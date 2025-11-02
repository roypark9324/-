export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          영어 단어 학습 앱
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* 단어 검색 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              단어 검색
            </h2>
            <p className="text-gray-600">
              영어 단어를 검색하면 자동으로 한글 뜻, 영영풀이, 예문을 생성합니다.
            </p>
          </div>

          {/* 사진으로 단어 추가 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              사진으로 단어 추가
            </h2>
            <p className="text-gray-600">
              사진을 업로드하면 단어를 인식하고 자동으로 정보를 생성합니다.
            </p>
          </div>

          {/* 단어장 관리 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              단어장 관리
            </h2>
            <p className="text-gray-600">
              폴더별로 단어장을 정리하고 관리하세요.
            </p>
          </div>

          {/* 단어 시험 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              단어 시험
            </h2>
            <p className="text-gray-600">
              다양한 방식으로 단어를 테스트하고 실력을 향상시키세요.
            </p>
          </div>

          {/* 복습 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              복습하기
            </h2>
            <p className="text-gray-600">
              저장된 단어들을 복습하고 암기하세요.
            </p>
          </div>

          {/* 통계 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              학습 통계
            </h2>
            <p className="text-gray-600">
              학습 진도와 성과를 확인하세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
