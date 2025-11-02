import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: 모든 단어 조회
export async function GET(request: NextRequest) {
  try {
    const words = await prisma.word.findMany({
      include: {
        folders: {
          include: {
            folder: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(words);
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "단어 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// POST: 새 단어 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, koreanMeaning, englishMeaning, exampleSentence } = body;

    if (!word || !koreanMeaning || !englishMeaning || !exampleSentence) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요" },
        { status: 400 }
      );
    }

    // 중복 체크
    const existingWord = await prisma.word.findUnique({
      where: { word: word.toLowerCase() },
    });

    if (existingWord) {
      return NextResponse.json(
        { error: "이미 존재하는 단어입니다", word: existingWord },
        { status: 409 }
      );
    }

    const newWord = await prisma.word.create({
      data: {
        word: word.toLowerCase(),
        koreanMeaning,
        englishMeaning,
        exampleSentence,
      },
    });

    return NextResponse.json(newWord, { status: 201 });
  } catch (error) {
    console.error("Error creating word:", error);
    return NextResponse.json(
      { error: "단어 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
