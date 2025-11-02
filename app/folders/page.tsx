"use client";

import { useState, useEffect } from "react";

interface Word {
  id: string;
  word: string;
  koreanMeaning: string;
  englishMeaning: string;
  exampleSentence: string;
}

interface Folder {
  id: string;
  name: string;
  words: {
    word: Word;
  }[];
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolders();
    fetchAllWords();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/folders");
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllWords = async () => {
    try {
      const response = await fetch("/api/words");
      const data = await response.json();
      setAllWords(data);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  const createFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });

      if (response.ok) {
        setNewFolderName("");
        fetchFolders();
      } else {
        const error = await response.json();
        alert(error.error || "폴더 생성에 실패했습니다");
      }
    } catch (error) {
      alert("폴더 생성 중 오류가 발생했습니다");
    }
  };

  const addWordToFolder = async (wordId: string, folderId: string) => {
    try {
      const response = await fetch(`/api/folders/${folderId}/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId }),
      });

      if (response.ok) {
        fetchFolders();
        alert("단어가 추가되었습니다!");
      } else {
        const error = await response.json();
        alert(error.error || "단어 추가에 실패했습니다");
      }
    } catch (error) {
      alert("단어 추가 중 오류가 발생했습니다");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">단어장 관리</h1>

        {/* 새 폴더 생성 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            새 단어장 만들기
          </h2>
          <form onSubmit={createFolder} className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="단어장 이름"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              생성
            </button>
          </form>
        </div>

        {/* 폴더 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedFolder(folder)}
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                {folder.name}
              </h3>
              <p className="text-gray-600">
                {folder.words.length}개의 단어
              </p>
            </div>
          ))}

          {folders.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              아직 생성된 단어장이 없습니다. 위에서 새 단어장을 만들어보세요!
            </div>
          )}
        </div>

        {/* 폴더 상세 모달 */}
        {selectedFolder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedFolder(null)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedFolder.name}
                </h2>
                <button
                  onClick={() => setSelectedFolder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* 폴더 내 단어 목록 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  저장된 단어 ({selectedFolder.words.length}개)
                </h3>
                {selectedFolder.words.length > 0 ? (
                  <div className="space-y-3">
                    {selectedFolder.words.map(({ word }) => (
                      <div
                        key={word.id}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="font-semibold text-blue-600">
                          {word.word}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {word.koreanMeaning}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">아직 단어가 없습니다</p>
                )}
              </div>

              {/* 단어 추가 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  단어 추가하기
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allWords.map((word) => (
                    <div
                      key={word.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {word.word}
                        </div>
                        <div className="text-sm text-gray-600">
                          {word.koreanMeaning}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          addWordToFolder(word.id, selectedFolder.id)
                        }
                        className="px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        추가
                      </button>
                    </div>
                  ))}
                  {allWords.length === 0 && (
                    <p className="text-gray-500">저장된 단어가 없습니다</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
