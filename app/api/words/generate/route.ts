import { NextRequest, NextResponse } from "next/server";

// AI API를 사용하지 않고 기본 예시 데이터를 생성하는 함수
// 실제 프로덕션에서는 OpenAI API 등을 사용할 수 있습니다
function generateWordData(word: string) {
  // 간단한 예시 데이터 생성
  // TODO: 실제로는 OpenAI API나 Dictionary API를 사용해야 합니다
  return {
    word: word.toLowerCase(),
    koreanMeaning: `${word}의 한글 뜻 (AI API 연동 필요)`,
    englishMeaning: `The English definition of "${word}". (AI API integration needed)`,
    exampleSentence: `This is an example sentence using the word "${word}". (AI API integration needed)`,
  };
}

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

    const wordData = generateWordData(word.trim());

    // TODO: 여기에 OpenAI API 호출 로직을 추가할 수 있습니다
    // 예시:
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a helpful English vocabulary assistant. Provide Korean meaning, English definition, and an example sentence for the given word in JSON format."
    //     },
    //     {
    //       role: "user",
    //       content: `Word: ${word}`
    //     }
    //   ],
    // });

    return NextResponse.json(wordData);
  } catch (error) {
    console.error("Word generation error:", error);
    return NextResponse.json(
      { error: "단어 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
