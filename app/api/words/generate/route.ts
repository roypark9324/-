import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word } = body;

    if (!word || typeof word !== "string") {
      return NextResponse.json(
        { error: "단어를 입력해주세요" },
        { status: 400 }
      );
    }

    // OpenAI API 키가 설정되지 않은 경우
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          word: word.toLowerCase(),
          koreanMeaning: "OpenAI API 키가 설정되지 않았습니다. .env 파일을 확인하세요.",
          englishMeaning: "OpenAI API key is not configured. Please check your .env file.",
          exampleSentence: "Please add OPENAI_API_KEY to your .env file to use this feature.",
        }
      );
    }

    // OpenAI API를 사용하여 단어 정보 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful English vocabulary assistant. For any given English word, provide:
1. Korean meaning (한글 뜻)
2. English definition (영영 풀이)
3. Example sentence using the word

Return the response in JSON format with these exact keys: koreanMeaning, englishMeaning, exampleSentence.
Make sure the Korean meaning is accurate and natural in Korean.
The example sentence should be practical and commonly used.`,
        },
        {
          role: "user",
          content: `Word: ${word.trim()}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI API returned empty response");
    }

    const parsedData = JSON.parse(content);

    const wordData = {
      word: word.toLowerCase().trim(),
      koreanMeaning: parsedData.koreanMeaning || parsedData.korean_meaning || "의미를 찾을 수 없습니다",
      englishMeaning: parsedData.englishMeaning || parsedData.english_meaning || "Definition not found",
      exampleSentence: parsedData.exampleSentence || parsedData.example_sentence || `I learned the word "${word}".`,
    };

    return NextResponse.json(wordData);
  } catch (error: any) {
    console.error("Word generation error:", error);

    // OpenAI API 에러 처리
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: "OpenAI API 할당량이 부족합니다. API 계정을 확인해주세요." },
        { status: 402 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: "OpenAI API 키가 유효하지 않습니다." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "단어 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
