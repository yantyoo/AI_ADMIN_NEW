# IA_SPEC

## 1. 문서 목적
- 현재 구현된 관리자 서비스의 화면 구조와 사용자 흐름을 페이지 기준으로 정의한다.
- IA의 큰 틀은 유지하되, 현재 코드와 다른 내용은 최신 구현 상태로 갱신한다.
- 기능 상세와 정책은 `FEATURE_SPEC.md`를 따른다.

## 2. 뎁스 정의

| 구분 | 정의 |
|---|---|
| 1depth | URL 기준 최상위 라우트 |
| 2depth | 화면의 주요 패널 / 영역 |
| 3depth | 사용자가 직접 조작하는 입력, 버튼, 목록 항목, 상태 요소 |

## 3. 공통 구조

### 3.1 전역 레이아웃

| 영역 | 역할 | 주요 구성요소 |
|---|---|---|
| LNB | 좌측 고정 내비게이션 | `Sidebar` |
| Top | 상단 페이지 헤더 | `TopHeader` |
| Body | 페이지별 본문 | `admin-shell__content` |
| Modal | 확인 / 등록 / 수정 / 삭제 | `ModalDialog`, `ModalPortal` |
| Message | 작업 결과 안내 | `ToastStack` |

### 3.2 공통 배치 원칙
- 인증 완료 화면은 `AdminShell` 내부에서 렌더링된다.
- `/login`은 공용 레이아웃 없이 인증 카드만 노출한다.
- `/otp`는 실제 화면이 아니라 `/login`으로 리다이렉트한다.
- 본문은 좌우 분할 패널 또는 단일 메인 패널로 구성된다.
- 목록과 상세가 함께 있는 화면은 상세 선택 상태를 유지한다.
- 모달은 페이지 위 오버레이로 표시된다.

### 3.3 접근 권한

| 라우트 | MASTER | OPERATOR | 비고 |
|---|---:|---:|---|
| `/login` | O | O | 공용 |
| `/otp` | O | O | redirect-only |
| `/dashboard` | O | O | 공용 대시보드 |
| `/content` | O | X | 메뉴 비노출 |
| `/cache-qa` | O | X | 메뉴 비노출 |
| `/knowledge` | O | X | 메뉴 비노출 |
| `/feedback` | O | O | 공용 메뉴 |
| `/accounts` | O | X | 메뉴 비노출 |

### 3.4 메뉴 구조

| 메뉴 | 경로 | 노출 역할 |
|---|---|---|
| 대시보드 | `/dashboard` | MASTER, OPERATOR |
| 콘텐츠 관리 | `/content` | MASTER |
| 캐시 답변 관리 | `/cache-qa` | MASTER |
| 지식 기반 조회 | `/knowledge` | MASTER |
| 피드백 관리 | `/feedback` | MASTER, OPERATOR |
| 계정/권한 관리 | `/accounts` | MASTER |

## 4. 페이지별 IA

### 4.1 진입 / 리다이렉트

#### 1depth
- `/`

#### 2depth
- 진입 라우트

#### 3depth
- 인증 상태 확인
- `/dashboard` 또는 `/login` 이동

#### 흐름
- 인증 완료 상태면 `/dashboard`로 이동한다.
- 인증 전 상태면 `/login`으로 이동한다.

---

### 4.2 로그인

#### 1depth
- `/login`

#### 2depth
- 인증 카드
- 로그인 폼
- OTP 모달
- 안내 모달

#### 3depth
- 아이디 입력
- 비밀번호 입력
- 아이디 저장
- 로그인 버튼
- OTP 입력
- 취소 버튼
- 인증 완료 버튼
- 안내 모달 확인 버튼

#### 화면 구성
```text
auth-shell
└─ auth-card
   ├─ auth-card__intro
   │  ├─ 배지
   │  ├─ 타이틀
   │  ├─ 안내 문구
   │  └─ 보조 설명
   └─ auth-form
      ├─ auth-form__header
      ├─ auth-form__fields
      │  ├─ 아이디 입력
      │  ├─ 비밀번호 입력
      │  └─ 아이디 저장
      ├─ auth-form__actions
      └─ auth-form__feedback
```

#### OTP 모달 구성
```text
modal auth-otp-modal
├─ modal__header
│  ├─ OTP 인증 제목
│  └─ OTP 안내 문구
├─ auth-otp-modal__body
│  ├─ OTP 입력
│  ├─ 상태 메시지
│  └─ 취소 / 인증 완료
└─ modal__footer 없음
```

#### 상태 전이
- 로그인 성공 -> OTP 모달 오픈
- 로그인 실패 -> 안내 모달
- 권한 없음 -> 안내 모달
- OTP 성공 -> `/dashboard`
- OTP 잠금 -> 잠금 안내 모달

#### 메시지 위치
- 로그인 에러: 로그인 폼 하단
- OTP 에러: OTP 모달 내 폼 하단
- 경고/잠금: 안내 모달

---

### 4.3 대시보드

#### 1depth
- `/dashboard`

#### 2depth
- 메인 지표 영역
- 보조 정보 영역

#### 3depth
- 기간 탭
- KPI 카드 3개
- 추이 차트
- 질문 키워드 목록
- 피드백 비율 도넛

#### 화면 구성
```text
dashboard-grid
├─ panel panel--main
│  ├─ SectionHeader
│  │  └─ TimeRangeTabs
│  ├─ metric-card-grid
│  └─ TrendChart
└─ dashboard-side
   ├─ KeywordList
   └─ FeedbackRatio
```

#### 메인 영역
- `기간별 지표 현황` 제목
- 기간 탭: `일간`, `주간`, `월간`
- KPI 카드 3개: 접속자 수 / 문의 수 / 실패 수
- 추이 차트: 접속자 막대 + 문의 선형 추이

#### 보조 영역
- 질문 키워드 카드
- 피드백 비율 도넛 카드
- 긍정/부정 토글

#### 상세 배치
```text
dashboard-grid
├─ main
│  ├─ 기간 선택
│  ├─ KPI 카드 행
│  └─ 추이 차트
└─ side
   ├─ 질문 키워드
   └─ 피드백 비율
```

#### 화면 구성
```text
dashboard-grid
├─ panel panel--main
│  ├─ SectionHeader
│  ├─ TimeRangeTabs
│  ├─ metric-card-grid
│  └─ TrendChart
└─ dashboard-side
   ├─ KeywordList
   └─ FeedbackRatio
```

#### 상태 전이
- 기간 탭 클릭 -> 메인 KPI/차트 데이터 교체
- 에러 상태 -> `ErrorState` 노출

---

### 4.4 콘텐츠 관리

#### 1depth
- `/content`

#### 2depth
- 문서 목록 패널
- 문서 상세 패널
- 문서 업로드 모달
- 문서 삭제 모달

#### 3depth
- 문서 유형 선택
- 문서명 검색
- 검색 버튼
- 초기화 버튼
- 문서 목록 행 선택
- 문서 업로드 버튼
- 다운로드 버튼
- 수정 버튼
- 삭제 버튼
- 파일 선택
- 저장 경로 입력
- 문서 유형 선택

#### 화면 구성
```text
content-grid
├─ content-table-card
│  ├─ SectionHeader
│  ├─ content-toolbar
│  │  ├─ 문서 유형
│  │  ├─ 문서명 검색
│  │  └─ 검색 / 초기화
│  └─ content-table-scroll
│     └─ 문서 목록 테이블
└─ content-detail-card
   └─ content-detail-scroll
      ├─ 문서명 + 유형 카드
      ├─ 상세 메타 2열
      ├─ 다운로드 / 수정 / 삭제
      └─ 변경 이력
```

#### 업로드 / 수정 모달
```text
modal
├─ 제목: 문서 업로드 / 문서 수정 업로드
├─ 파일 선택
├─ 저장 경로
├─ 문서 유형
└─ 취소 / 저장
```

#### 삭제 모달
```text
modal
├─ 제목: 문서 삭제 확인
├─ 안내 문구
└─ 취소 / 삭제
```

#### 목록 / 상세 배치
```text
content-grid
├─ left
│  ├─ 검색 조건
│  ├─ 목록 테이블
│  └─ 빈 상태
└─ right
   ├─ 제목 카드
   ├─ 메타 정보
   ├─ 액션 버튼
   └─ 변경 이력
```

#### 화면 구성
```text
content-grid
├─ content-table-card
│  ├─ SectionHeader
│  ├─ content-toolbar
│  └─ content-table-scroll
└─ content-detail-card
   └─ content-detail-scroll
```

#### 상세 구조
- 상단: 문서명 + 유형
- 메타: 저장 경로, 파일 크기, 등록자, 등록일, 수정자, 수정일
- 하단: 변경 이력과 액션 버튼

#### 상태 전이
- 유형/검색어 적용 -> 목록 필터링
- 행 선택 -> 상세 갱신
- 업로드/수정 완료 -> 목록과 상세 갱신
- 삭제 완료 -> 다음 항목 자동 선택

---

### 4.5 캐시 답변 관리

#### 1depth
- `/cache-qa`

#### 2depth
- 답변 목록 패널
- 상세 패널
- 답변 등록/수정 모달
- 답변 삭제 모달

#### 3depth
- 질문 검색
- 상태 필터
- 검색 버튼
- 초기화 버튼
- 목록 행 선택
- 답변 등록 버튼
- 페이지네이션
- 수정 버튼
- 활성화/비활성화 버튼
- 삭제 버튼
- 질문 입력
- 답변 입력
- 상태 선택
- 초기화 버튼(모달)
- 등록/수정 버튼

#### 화면 구성
```text
cache-qa-grid
├─ ListPanel.cache-qa-list-card
│  ├─ list-panel__header
│  ├─ cache-qa-toolbar
│  │  ├─ 질문 검색
│  │  ├─ 상태 필터
│  │  └─ 검색 / 초기화
│  ├─ list-panel__body
│  │  └─ 답변 목록 테이블
│  └─ Pagination
└─ cache-qa-side
   └─ DetailFrame.cache-qa-detail-card
      ├─ 상태 배지
      ├─ 대화 내용
      ├─ 메타 정보
      └─ 수정 / 활성화 / 삭제
```

#### 등록 / 수정 모달
```text
modal
├─ 제목: 답변 등록 / 답변 수정
├─ 질문
├─ 답변
├─ 상태
└─ 초기화 / 등록 또는 수정 저장
```

#### 삭제 모달
```text
modal
├─ 제목: 답변 삭제 확인
├─ 안내 문구
└─ 취소 / 삭제
```

#### 목록 / 상세 배치
```text
cache-qa-grid
├─ left
│  ├─ 검색 조건
│  ├─ 답변 목록
│  └─ 페이지네이션
└─ right
   ├─ 상태 배지
   ├─ 대화 내용
   ├─ 메타 정보
   └─ 액션 버튼
```

#### 화면 구성
```text
cache-qa-grid
├─ ListPanel.cache-qa-list-card
│  ├─ list-panel__header
│  ├─ cache-qa-toolbar
│  ├─ list-panel__body
│  └─ Pagination
└─ cache-qa-side
   └─ DetailFrame.cache-qa-detail-card
```

#### 상세 구조
- 상단: 상태 배지
- 본문: 질문 / 답변 대화
- 메타: 등록자, 등록일, 수정자, 수정일, 캐시 조회 수
- 액션: 수정, 활성화/비활성화, 삭제

#### 상태 전이
- 검색어/상태 변경 -> 목록 재계산
- 페이지 이동 -> 현재 페이지 목록만 변경
- 행 선택 -> 상세 갱신
- 등록/수정 -> 목록 갱신
- 상태 전환 -> 상세 상태 즉시 갱신
- 삭제 -> 다음 항목 자동 선택

---

### 4.6 지식 기반 조회

#### 1depth
- `/knowledge`

#### 2depth
- 조회 조건 패널
- 조회 결과 패널

#### 3depth
- 문서 유형 선택
- 테스트 문서 선택
- 질문 입력
- 초기화 버튼
- 조회 버튼
- 결과 복사 버튼

#### 화면 구성
```text
knowledge-grid
├─ panel panel--main
│  ├─ SectionHeader
│  └─ knowledge-form
│     ├─ 문서 유형
│     ├─ 테스트 문서
│     ├─ 질문 입력
│     └─ 초기화 / 조회
└─ DetailFrame(panel panel--main)
   └─ knowledge-result-scroll
      ├─ 답변 카드
      ├─ 참조 문서
      ├─ 저장 경로
      ├─ 참조 단락
      └─ 결과 복사
```

#### 상태별 화면
- `IDLE`: 조건 입력 전 안내
- `LOADING`: 조회 중 안내
- `SUCCESS`: 답변 / 참조 정보 / 복사 버튼
- `EMPTY`: 일치 결과 없음 안내
- `ERROR`: 조회 실패 안내

#### 조회 조건 배치
```text
knowledge-form
├─ 문서 유형
├─ 테스트 문서
├─ 질문 입력
└─ 하단 버튼
   ├─ 초기화
   └─ 조회
```

#### 화면 구성
```text
knowledge-grid
├─ panel panel--main
│  ├─ SectionHeader
│  └─ knowledge-form
└─ DetailFrame(panel panel--main)
   └─ knowledge-result-scroll
```

#### 상세 구조
- 상태별 중앙 안내: IDLE / LOADING / EMPTY / ERROR
- 성공 상태:
  - 답변 카드
  - 참조 문서
  - 저장 경로
  - 참조 단락
  - 결과 복사 버튼

#### 상태 전이
- 문서 유형 변경 -> 테스트 문서 초기화
- 조회 실행 -> LOADING -> SUCCESS / EMPTY
- 초기화 -> IDLE
- 결과 복사 -> 복사 완료 상태 표시

---

### 4.7 피드백 관리

#### 1depth
- `/feedback`

#### 2depth
- 목록 패널
- 상세 패널

#### 3depth
- 반응 필터
- 시작일 입력
- 종료일 입력
- 검색 버튼
- 초기화 버튼
- 목록 행 선택

#### 화면 구성
```text
feedback-grid
├─ feedback-list-card
│  ├─ SectionHeader
│  ├─ feedback-filter-bar
│  │  ├─ 반응 필터
│  │  ├─ 시작일
│  │  ├─ 종료일
│  │  └─ 검색 / 초기화
│  └─ feedback-list-scroll
│     └─ 피드백 테이블
└─ DetailFrame.feedback-detail-card
   └─ feedback-detail-scroll
      ├─ 상단 식별 카드
      ├─ 대화 내용
      └─ 부정사유
```

#### 화면 구성
```text
feedback-grid
├─ feedback-list-card
│  ├─ SectionHeader
│  ├─ feedback-filter-bar
│  └─ feedback-list-scroll
└─ DetailFrame.feedback-detail-card
   └─ feedback-detail-scroll
```

#### 상세 구조
- 상단 우측: 긍정 / 부정 배지
- 상단 본문: 단지명 + 사용자 아이디
- 대화 내용: 사용자 / 챗봇 대화 버블
- 조건부 영역: 부정사유

#### 목록 / 상세 배치
```text
feedback-grid
├─ left
│  ├─ 반응 필터
│  ├─ 기간 필터
│  └─ 목록 테이블
└─ right
   ├─ 상태 배지
   ├─ 식별 카드
   ├─ 대화 내용
   └─ 부정사유
```

#### 상태 전이
- 반응 필터 변경 -> 목록 재필터링
- 날짜 검색 -> 목록 재필터링
- 행 선택 -> 상세 갱신

---

### 4.8 계정 / 권한 관리

#### 1depth
- `/accounts`

#### 2depth
- 통계 영역
- 관리자 목록 패널
- 관리자 상세 패널
- 관리자 추가 모달
- 권한 변경 모달

#### 3depth
- 목록 행 선택
- 관리자 추가 버튼
- 권한 복구 버튼
- 권한 비활성화 버튼
- 잠금 해제 버튼
- 사유 입력
- 후보 검색
- 후보 선택
- 추가 사유 입력
- 확인 버튼
- 취소 버튼

#### 화면 구성
```text
accounts-layout
├─ accounts-stat-grid
│  └─ 통계 카드 4개
├─ accounts-grid
│  ├─ accounts-list-card
│  │  ├─ SectionHeader
│  │  └─ 관리자 목록 테이블
│  └─ DetailFrame.accounts-detail-card
│     ├─ 이름 · 아이디 · 권한 박스
│     ├─ 메타 정보
│     ├─ 권한 액션
│     ├─ 로그인 이력
│     └─ 잠금·해제 이력
├─ 관리자 추가 모달
└─ 권한 변경 모달
```

#### 목록 / 상세 배치
```text
accounts-layout
├─ top
│  └─ 통계 카드
├─ body
│  ├─ 관리자 목록
│  └─ 관리자 상세
└─ modal
   ├─ 관리자 추가
   └─ 권한 변경
```

#### 관리자 추가 모달
```text
modal
├─ 제목: 관리자 추가
├─ 사용자 검색
├─ 후보 목록
├─ 추가 사유
└─ 취소 / 확인
```

#### 권한 변경 모달
```text
modal
├─ 제목: 권한 복구 / 권한 비활성화 / 잠금 해제
├─ 사유 입력
└─ 취소 / 확인
```

#### 화면 구성
```text
accounts-layout
├─ accounts-stat-grid
├─ accounts-grid
│  ├─ accounts-list-card
│  └─ DetailFrame.accounts-detail-card
├─ 관리자 추가 모달
└─ 권한 변경 모달
```

#### 상세 구조
- 상단: 이름 · 아이디 · 권한 박스
- 메타: 등록일, 최종 로그인
- 액션: 권한 복구 / 비활성화 / 잠금 해제
- 이력: 로그인 이력, 잠금·해제 이력
- 본인 계정 안내: 권한 변경 제한 문구

#### 상태 전이
- 목록 행 선택 -> 상세 갱신
- 권한 변경 -> 로컬 상태 갱신
- 관리자 추가 -> 후보 선택 후 목록 갱신
- 본인 계정 선택 -> 위험 액션 비노출

---

### 4.9 구현 보류 화면

#### 1depth
- 라우트 미할당

#### 2depth
- 보류 안내 패널

#### 3depth
- 없음

#### 화면 구성
```text
panel panel--placeholder
├─ panel__title
└─ placeholder-state
```

#### 설명
- `features/placeholder/placeholder-page.tsx`는 `pageMetaByPath` 기반의 보류 안내 화면이다.
- 현재 활성 라우트에 직접 연결되어 있지 않지만, IA에는 내부 보류 화면으로 포함한다.
- 화면에는 제목과 `구현 보류` 안내만 노출된다.

#### 상세 구조
```text
panel panel--placeholder
├─ panel__title
└─ placeholder-state
   ├─ 구현 보류
   └─ 보류 사유 설명
```

## 5. 공통 메시지 규칙

| 상황 | 위치 | 현재 구현 |
|---|---|---|
| 성공 | 토스트 또는 결과 상태 | `ToastStack` 사용 화면 존재 |
| 실패 | 토스트 / 모달 / 폼 하단 | 화면별로 다름 |
| 빈 상태 | 목록 또는 상세 중앙 | 공통 빈 상태 카드 사용 |
| 권한 제한 | 메뉴 비노출 / 버튼 비노출 | `Sidebar` 필터링 + 상세 안내 |
| 모달 확인 | 모달 하단 | 확인/취소 버튼 |

## 6. 문서 유지 원칙
- 현재 코드 구조를 기준으로 페이지를 정의한다.
- 존재하지 않는 라우트 흐름은 추가하지 않는다.
- 구현되지 않은 기능은 추측해서 넣지 않는다.
