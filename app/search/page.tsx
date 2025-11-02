"use client";

import { useState } from "react";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordData, setWordData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setWordData(null);

    try {
      const response = await fetch("/api/words/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: searchTerm.trim() }),
      });

      if (!response.ok) {
        throw new Error("단어 생성에 실패했습니다");
      }

      const data = await response.json();
      setWordData(data);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = async () => {
    if (!wordData) return;

    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wordData),
      });

      if (!response.ok) {
        throw new Error("단어 저장에 실패했습니다");
      }

      alert("단어가 저장되었습니다!");
    } catch (err: any) {
      alert(err.message || "저장 중 오류가 발생했습니다");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">단어 검색</h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="영어 단어를 입력하세요"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "검색 중..." : "검색"}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {wordData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">
                {wordData.word}
              </h2>
            </div>

            <div className="space-y-4">
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
                <p className="text-gray-600 italic">{wordData.exampleSentence}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSaveWord}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                단어장에 저장
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
