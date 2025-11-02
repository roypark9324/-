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

type TestMode = "fill_blank" | "word_match" | null;

export default function TestPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [testMode, setTestMode] = useState<TestMode>(null);
  const [testWords, setTestWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/folders");
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const toggleFolder = (folderId: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const startTest = () => {
    if (selectedFolders.length === 0 || !testMode) {
      alert("단어장과 시험 모드를 선택해주세요");
      return;
    }

    // 선택된 폴더들의 단어 수집
    const words: Word[] = [];
    folders.forEach((folder) => {
      if (selectedFolders.includes(folder.id)) {
        folder.words.forEach(({ word }) => {
          if (!words.find((w) => w.id === word.id)) {
            words.push(word);
          }
        });
      }
    });

    if (words.length === 0) {
      alert("선택한 단어장에 단어가 없습니다");
      return;
    }

    // 단어 섞기
    const shuffled = words.sort(() => Math.random() - 0.5);
    setTestWords(shuffled);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setTestStarted(true);
    setUserAnswer("");
    setShowResult(false);
  };

  const checkAnswer = () => {
    const currentWord = testWords[currentIndex];
    let correct = false;

    if (testMode === "word_match") {
      correct = userAnswer.toLowerCase().trim() === currentWord.word.toLowerCase();
    } else if (testMode === "fill_blank") {
      correct = userAnswer.toLowerCase().trim() === currentWord.word.toLowerCase();
    }

    setIsCorrect(correct);
    setShowResult(true);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < testWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setShowResult(false);
    } else {
      // 시험 종료
      alert(
        `시험이 끝났습니다!\n총 ${score.total + 1}문제 중 ${
          score.correct + (isCorrect ? 1 : 0)
        }문제 정답`
      );
      setTestStarted(false);
      setSelectedFolders([]);
      setTestMode(null);
    }
  };

  const getFillBlankSentence = (sentence: string, word: string) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    return sentence.replace(regex, "______");
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">단어 시험</h1>

          {/* 단어장 선택 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              시험 볼 단어장 선택
            </h2>
            <div className="space-y-2">
              {folders.map((folder) => (
                <label
                  key={folder.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFolders.includes(folder.id)}
                    onChange={() => toggleFolder(folder.id)}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="text-gray-800">
                    {folder.name} ({folder.words.length}개 단어)
                  </span>
                </label>
              ))}
              {folders.length === 0 && (
                <p className="text-gray-500">생성된 단어장이 없습니다</p>
              )}
            </div>
          </div>

          {/* 시험 모드 선택 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              시험 모드 선택
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setTestMode("word_match")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  testMode === "word_match"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  단어 맞추기
                </h3>
                <p className="text-sm text-gray-600">
                  한글 뜻 또는 영영 풀이를 보고 영어 단어를 맞추세요
                </p>
              </button>

              <button
                onClick={() => setTestMode("fill_blank")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  testMode === "fill_blank"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  빈칸 채우기
                </h3>
                <p className="text-sm text-gray-600">
                  예문의 빈칸에 알맞은 단어를 입력하세요
                </p>
              </button>
            </div>
          </div>

          {/* 시작 버튼 */}
          <button
            onClick={startTest}
            disabled={selectedFolders.length === 0 || !testMode}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            시험 시작
          </button>
        </div>
      </div>
    );
  }

  // 시험 진행 중
  const currentWord = testWords[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {testMode === "word_match" ? "단어 맞추기" : "빈칸 채우기"}
          </h1>
          <div className="text-gray-600">
            {currentIndex + 1} / {testWords.length}
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-6 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentIndex + 1) / testWords.length) * 100}%`,
            }}
          />
        </div>

        {/* 점수 */}
        <div className="mb-6 text-center">
          <span className="text-lg text-gray-700">
            정답: {score.correct} / {score.total}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {testMode === "word_match" ? (
            // 단어 맞추기 모드
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  한글 뜻:
                </h3>
                <p className="text-xl text-gray-800">
                  {currentWord.koreanMeaning}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  영영 풀이:
                </h3>
                <p className="text-xl text-gray-800">
                  {currentWord.englishMeaning}
                </p>
              </div>
            </div>
          ) : (
            // 빈칸 채우기 모드
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  한글 뜻:
                </h3>
                <p className="text-xl text-gray-800">
                  {currentWord.koreanMeaning}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  예문:
                </h3>
                <p className="text-xl text-gray-800 italic">
                  {getFillBlankSentence(
                    currentWord.exampleSentence,
                    currentWord.word
                  )}
                </p>
              </div>
            </div>
          )}

          {/* 답변 입력 */}
          {!showResult ? (
            <div className="mt-8">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                placeholder="답을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-lg mb-4"
                autoFocus
              />
              <button
                onClick={checkAnswer}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                정답 확인
              </button>
            </div>
          ) : (
            // 결과 표시
            <div className="mt-8">
              <div
                className={`p-6 rounded-lg mb-4 ${
                  isCorrect
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-red-100 border-2 border-red-500"
                }`}
              >
                <div className="text-center mb-4">
                  <span
                    className={`text-2xl font-bold ${
                      isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isCorrect ? "정답입니다!" : "틀렸습니다"}
                  </span>
                </div>

                {!isCorrect && (
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold text-gray-700">
                        정답:
                      </span>{" "}
                      <span className="text-green-700 font-bold text-lg">
                        {currentWord.word}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">
                        예문:
                      </span>{" "}
                      <span className="text-gray-800 italic">
                        {currentWord.exampleSentence}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={nextQuestion}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {currentIndex < testWords.length - 1
                  ? "다음 문제"
                  : "시험 종료"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
