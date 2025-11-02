import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST: 폴더에 단어 추가
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: folderId } = params;
    const body = await request.json();
    const { wordId } = body;

    if (!wordId) {
      return NextResponse.json(
        { error: "단어 ID를 입력해주세요" },
        { status: 400 }
      );
    }

    // 폴더와 단어가 존재하는지 확인
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    const word = await prisma.word.findUnique({
      where: { id: wordId },
    });

    if (!folder || !word) {
      return NextResponse.json(
        { error: "폴더 또는 단어를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 이미 추가되어 있는지 확인
    const existing = await prisma.wordFolder.findFirst({
      where: {
        folderId,
        wordId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "이미 이 폴더에 추가된 단어입니다" },
        { status: 409 }
      );
    }

    // 단어를 폴더에 추가
    const wordFolder = await prisma.wordFolder.create({
      data: {
        folderId,
        wordId,
      },
      include: {
        word: true,
        folder: true,
      },
    });

    return NextResponse.json(wordFolder, { status: 201 });
  } catch (error) {
    console.error("Error adding word to folder:", error);
    return NextResponse.json(
      { error: "단어 추가 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// DELETE: 폴더에서 단어 제거
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: folderId } = params;
    const { searchParams } = new URL(request.url);
    const wordId = searchParams.get("wordId");

    if (!wordId) {
      return NextResponse.json(
        { error: "단어 ID를 입력해주세요" },
        { status: 400 }
      );
    }

    await prisma.wordFolder.deleteMany({
      where: {
        folderId,
        wordId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing word from folder:", error);
    return NextResponse.json(
      { error: "단어 제거 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
