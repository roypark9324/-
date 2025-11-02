# 영어 단어 학습 앱

사진과 검색을 통해 영어 단어를 학습하고 테스트할 수 있는 웹 애플리케이션입니다.

## 주요 기능

### 1. 단어 검색 및 자동 생성
- 영어 단어를 입력하면 자동으로 한글 뜻, 영영풀이, 예문을 생성합니다
- 생성된 단어 정보를 단어장에 저장할 수 있습니다

### 2. 사진으로 단어 추가 (OCR)
- 이미지를 업로드하면 Tesseract.js를 사용해 텍스트를 추출합니다
- 추출된 영어 단어를 선택하여 자동으로 단어 정보를 생성할 수 있습니다

### 3. 단어장 관리
- 여러 개의 단어장(폴더)을 생성하고 관리할 수 있습니다
- 하나의 단어를 여러 단어장에 추가할 수 있습니다
- 단어장 이름은 사용자가 자유롭게 설정 가능합니다

### 4. 단어 시험
- 여러 단어장을 선택하여 한꺼번에 시험을 볼 수 있습니다
- 두 가지 시험 모드를 지원합니다:
  - **단어 맞추기**: 한글 뜻과 영영 풀이를 보고 영어 단어를 맞춤
  - **빈칸 채우기**: 예문의 빈칸에 알맞은 단어를 입력

## 기술 스택

- **프론트엔드/백엔드**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **데이터베이스**: SQLite + Prisma ORM
- **OCR**: Tesseract.js

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 데이터베이스 설정

Prisma 마이그레이션을 실행하여 데이터베이스를 생성합니다:

```bash
# Prisma Client 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev --name init
```

만약 Prisma 엔진 다운로드 문제가 발생하면:

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma migrate dev --name init
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인합니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── words/        # 단어 관련 API
│   │   └── folders/      # 폴더 관련 API
│   ├── search/           # 단어 검색 페이지
│   ├── image/            # 사진 업로드 페이지
│   ├── folders/          # 단어장 관리 페이지
│   ├── test/             # 단어 시험 페이지
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 홈 페이지
├── components/            # React 컴포넌트
│   └── Navigation.tsx    # 네비게이션 바
├── lib/                   # 유틸리티
│   └── db.ts             # Prisma 클라이언트
├── prisma/                # Prisma 스키마
│   └── schema.prisma     # 데이터베이스 스키마
└── public/                # 정적 파일
```

## 데이터베이스 스키마

### Word (단어)
- id: 고유 ID
- word: 영어 단어
- koreanMeaning: 한글 뜻
- englishMeaning: 영영풀이
- exampleSentence: 예문

### Folder (단어장)
- id: 고유 ID
- name: 단어장 이름

### WordFolder (단어-폴더 관계)
- 단어와 폴더를 연결하는 중간 테이블
- 다대다 관계 구현

### TestResult (시험 결과)
- id: 고유 ID
- wordId: 단어 ID
- testType: 시험 유형
- isCorrect: 정답 여부

## 향후 개선 사항

### AI API 연동
현재는 단어 정보가 플레이스홀더로 생성됩니다. 실제 사용을 위해서는 OpenAI API 등을 연동해야 합니다.

`.env` 파일에 API 키를 추가:
```
OPENAI_API_KEY=your-api-key-here
```

`app/api/words/generate/route.ts`에서 API 호출 로직을 구현하면 됩니다.

### 추가 기능 아이디어
- 단어 복습 시스템 (간격 반복 학습)
- 학습 통계 및 진도 확인
- 단어 발음 듣기 (Text-to-Speech)
- 단어장 공유 기능
- 즐겨찾기/북마크 기능
- 다크 모드 지원

## 라이선스

MIT License
