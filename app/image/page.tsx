"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";

export default function ImagePage() {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState("");
  const [wordData, setWordData] = useState<any>(null);
  const [generatingWord, setGeneratingWord] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string;
      setImage(imageUrl);
      await processImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageUrl: string) => {
    setLoading(true);
    setExtractedText("");
    setWords([]);

    try {
      const worker = await createWorker("eng");
      const {
        data: { text },
      } = await worker.recognize(imageUrl);
      await worker.terminate();

      setExtractedText(text);

      // 텍스트에서 영어 단어 추출
      const extractedWords = text
        .split(/\s+/)
        .filter((word) => /^[a-zA-Z]+$/.test(word))
        .map((word) => word.toLowerCase())
        .filter((word, index, self) => self.indexOf(word) === index); // 중복 제거

      setWords(extractedWords);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("이미지 처리 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const generateWordInfo = async (word: string) => {
    setSelectedWord(word);
    setGeneratingWord(true);
    setWordData(null);

    try {
      const response = await fetch("/api/words/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        throw new Error("단어 생성에 실패했습니다");
      }

      const data = await response.json();
      setWordData(data);
    } catch (error: any) {
      alert(error.message || "오류가 발생했습니다");
    } finally {
      setGeneratingWord(false);
    }
  };

  const saveWord = async () => {
    if (!wordData) return;

    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wordData),
      });

      if (response.ok) {
        alert("단어가 저장되었습니다!");
        setWordData(null);
        setSelectedWord("");
      } else {
        const error = await response.json();
        alert(error.error || "저장에 실패했습니다");
      }
    } catch (error) {
      alert("저장 중 오류가 발생했습니다");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          사진으로 단어 추가
        </h1>

        {/* 이미지 업로드 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            이미지 업로드
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* 업로드된 이미지 */}
        {image && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              업로드된 이미지
            </h2>
            <img
              src={image}
              alt="Uploaded"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
            <div className="text-blue-600 text-lg">
              이미지에서 텍스트를 추출하는 중...
            </div>
          </div>
        )}

        {/* 추출된 텍스트 */}
        {extractedText && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              추출된 텍스트
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {extractedText}
            </p>
          </div>
        )}

        {/* 추출된 단어 목록 */}
        {words.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              추출된 영어 단어
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {words.map((word) => (
                <button
                  key={word}
                  onClick={() => generateWordInfo(word)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedWord === word
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 단어 정보 생성 중 */}
        {generatingWord && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-blue-600 text-lg">
              단어 정보를 생성하는 중...
            </div>
          </div>
        )}

        {/* 생성된 단어 정보 */}
        {wordData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">
              {wordData.word}
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  한글 뜻
                </h3>
                <p className="text-gray-600">{wordData.koreanMeaning}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  영영풀이
                </h3>
                <p className="text-gray-600">{wordData.englishMeaning}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  예문
                </h3>
                <p className="text-gray-600 italic">
                  {wordData.exampleSentence}
                </p>
              </div>
            </div>

            <button
              onClick={saveWord}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              단어장에 저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
