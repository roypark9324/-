import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: 모든 폴더 조회
export async function GET() {
  try {
    const folders = await prisma.folder.findMany({
      include: {
        words: {
          include: {
            word: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "폴더 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

// POST: 새 폴더 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "폴더 이름을 입력해주세요" },
        { status: 400 }
      );
    }

    // 중복 체크
    const existingFolder = await prisma.folder.findUnique({
      where: { name },
    });

    if (existingFolder) {
      return NextResponse.json(
        { error: "이미 존재하는 폴더 이름입니다" },
        { status: 409 }
      );
    }

    const newFolder = await prisma.folder.create({
      data: { name },
    });

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "폴더 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
