# FEATURE_SPEC

## 1. 문서 목적
- 이 문서는 현재 구현된 관리자 화면을 기준으로 기능을 정의한다.
- 기능 번호(`FS-xxx`)는 기존 분류 체계를 유지한다.
- 추측은 제외하고, 코드에 실제로 구현된 동작만 기록한다.
- 화면 구조와 라우트 구성은 `docs/IA_SPEC.md`를 따른다.

## 2. 공통 규칙

### 2.1 현재 구현 기준 상태값

| 상태 | 의미 |
|---|---|
| `IDLE` | 초기 대기 |
| `LOADING` | 조회 또는 처리 중 |
| `SUCCESS` | 정상 결과 표시 |
| `EMPTY` | 조회 결과 없음 |
| `ERROR` | 조회 실패 또는 검증 오류 |
| `ACTIVE` | 활성 상태 |
| `INACTIVE` | 비활성 상태 |
| `LOCKED` | 잠금 상태 |
| `DISABLED` | 동작 불가 또는 비노출 상태 |

### 2.2 공통 컴포넌트 / 패턴

- 공통 레이아웃: `AdminShell`, `TopHeader`, `Sidebar`
- 목록/상세: `ListPanel`, `DetailFrame`
- 섹션 헤더: `SectionHeader`
- 모달: `ModalDialog`, `ModalPortal`
- 페이지네이션: `Pagination`
- 메시지: `ToastStack`
- 자동 해제 메시지: `useAutoDismissMessage`

### 2.3 검색 / 필터 / 정렬 / 페이징

| 항목 | 현재 구현 |
|---|---|
| 검색 | 대부분 클라이언트 검색 |
| 검색 적용 방식 | 버튼 클릭 시 적용하는 화면이 있음 |
| 필터 | enum 값은 정확히 일치 |
| 정렬 | 화면별 최신순 또는 관련도 정렬 |
| 페이지네이션 | 캐시 답변 관리만 사용 |
| page clamp | 캐시 답변 관리에서 1~total 범위로 보정 |

### 2.4 권한 범위

| 페이지 | MASTER | OPERATOR |
|---|---:|---:|
| 로그인 / OTP | O | O |
| 대시보드 | O | O |
| 콘텐츠 관리 | O | X |
| 캐시 답변 관리 | O | X |
| 지식 기반 조회 | O | X |
| 피드백 관리 | O | O |
| 계정/권한 관리 | O | X |

### 2.5 라우트 노트

- `/`는 인증 상태에 따라 `/dashboard` 또는 `/login`으로 이동한다.
- `/otp`는 현재 사용자 화면이 아니라 `/login`으로 리다이렉트만 수행한다.
- `app/knowledge/page.tsx`는 현재 `KnowledgePanel`을 직접 렌더링한다.
- `features/placeholder/placeholder-page.tsx`는 존재하지만 현재 활성 라우트에는 연결되어 있지 않다.

## 3. 기능 정의

### 3.1 인증

| FS ID | 기능명 | 설명 | 입력값 | 결과 | 현재 구현 |
|---|---|---|---|---|---|
| FS-001 | 로그인 입력 | 아이디와 비밀번호를 입력한다 | `userId`, `password`, `rememberId` | 로그인 검증 | 로그인 화면은 단일 카드형 폼 |
| FS-002 | 로그인 제출 | 계정 정보를 확인하고 OTP 단계로 진입한다 | `userId`, `password` | OTP 모달 오픈 | `test0000`, `test1111`, `blocked0000` 목업 계정 사용 |
| FS-003 | 비인가 계정 차단 | 허용되지 않은 계정은 로그인하지 못하게 한다 | `userId`, `password` | 안내 모달 | 권한 없는 계정은 즉시 안내 모달 노출 |
| FS-004 | OTP 입력 | 6자리 OTP를 입력한다 | `otp` | 검증 | OTP는 로그인 화면의 모달에서 입력 |
| FS-005 | OTP 제출 | OTP를 검증하고 인증을 완료한다 | `otp` | 대시보드 이동 | 5회 실패 시 잠금 |
| FS-006 | 인증 상태 유지 | 세션/로컬 저장소에 인증 상태를 보존한다 | 없음 | 새로고침 유지 | `sessionStorage`, `localStorage` 사용 |
| FS-007 | 로그아웃 | 인증 상태를 제거하고 로그인으로 이동한다 | 없음 | `/login` 이동 | 사이드바 로그아웃 모달로 수행 |

#### 인증 정책
- 로그인 성공 후에만 OTP 단계가 열린다.
- OTP 실패 횟수는 별도로 누적된다.
- OTP 5회 실패 시 잠금 안내 모달이 열린다.
- 아이디 저장은 `userId`만 보존하고 비밀번호는 저장하지 않는다.
- `/otp` 라우트는 실제 입력 화면이 아니라 redirect-only 라우트다.

#### 인증 메시지

| 상황 | 메시지 |
|---|---|
| 계정/비밀번호 불일치 | `아이디 또는 비밀번호가 올바르지 않습니다.` |
| 권한 없음 | `권한이 없는 사용자입니다.` |
| OTP 6자리 미입력 | `6자리 OTP를 입력해 주세요.` |
| OTP 실패 | `OTP 인증에 실패했습니다. (n/5)` |
| OTP 잠금 | `OTP 오류로 잠금된 아이디입니다. 관리자에게 문의하세요.` |

### 3.2 대시보드

| FS ID | 기능명 | 설명 | 입력값 | 결과 | 현재 구현 |
|---|---|---|---|---|---|
| FS-008 | 기간 선택 | DAY/WEEK/MONTH 중 하나를 선택한다 | `selectedRange` | 데이터 교체 | 선택 즉시 같은 화면 내 데이터만 교체 |
| FS-009 | KPI 접속자 수 | 접속자 수를 표시한다 | 기간 | 카드 표시 | `MetricCard` 사용 |
| FS-010 | KPI 문의 수 | 문의 수를 표시한다 | 기간 | 카드 표시 | `MetricCard` 사용 |
| FS-011 | KPI 실패 수 | 실패 수를 표시한다 | 기간 | 카드 표시 | `MetricCard` 사용 |
| FS-012 | 추이 차트 | 접속자/문의 추이를 표시한다 | 기간 | 차트 표시 | SVG 기반 차트 |
| FS-013 | 질문 키워드 | 질문 키워드 상위 항목을 표시한다 | 기간 | 목록 표시 | 고정 키워드 데이터 사용 |
| FS-014 | 피드백 비율 | 긍정/부정 비율을 표시한다 | 기간 | 도넛 차트 / 요약 | 내부 탭으로 긍정/부정 전환 |
| FS-015 | 오류 상태 | 조회 실패 상태를 표시한다 | 없음 | 에러 화면 | 현재는 화면 내부 상태용 컴포넌트 |

#### 대시보드 정책
- 초기 데이터는 `WEEK` 기준으로 로드된다.
- 상단 기간 탭은 `DAY`, `WEEK`, `MONTH` 3종만 사용한다.
- 메인 영역은 KPI 카드와 추이 차트로 구성된다.
- 우측 영역은 질문 키워드와 피드백 비율로 구성된다.
- 에러 상태는 `ErrorState` 컴포넌트로 노출된다.

#### 데이터
- API 함수: `getDashboardData(range)`
- 주요 타입: `DashboardPayload`, `MetricCardData`, `TrendPoint`, `KeywordItem`, `FeedbackRatioData`

### 3.3 콘텐츠 관리

| FS ID | 기능명 | 설명 | 입력값 | 결과 | 현재 구현 |
|---|---|---|---|---|---|
| FS-016 | 문서 목록 조회 | 등록된 문서를 테이블로 조회한다 | 없음 | 목록 표시 | 최신 수정일/생성일 기준 정렬 |
| FS-017 | 문서 유형 필터 | MANUAL / FAQ 를 필터링한다 | `type` | 목록 필터링 | 정확히 일치하는 값만 적용 |
| FS-018 | 문서 검색 | 문서명과 저장 경로로 검색한다 | `keyword` | 목록 필터링 | 검색 버튼으로 적용 |
| FS-019 | 문서 선택 | 선택 문서의 상세를 표시한다 | `documentId` | 상세 표시 | 행 클릭으로 선택 |
| FS-020 | 문서 업로드 모달 | 신규 업로드 입력창을 연다 | 없음 | 모달 오픈 | `문서 업로드` 버튼 |
| FS-021 | 문서 업로드 제출 | 새 문서를 추가한다 | `fileName`, `path`, `type` | 목록 갱신 | 파일 선택 필수 |
| FS-022 | 문서 수정 모달 | 선택 문서를 수정한다 | `documentId` | 모달 오픈 | 선택 문서 기준으로 값 선입력 |
| FS-023 | 문서 수정 제출 | 기존 문서를 갱신한다 | `fileName`, `path`, `type` | 목록/상세 갱신 | 수정 후 `history`에 새 항목 추가 |
| FS-024 | 문서 삭제 확인 | 삭제 확인 모달을 연다 | 없음 | 모달 오픈 | 확인 후 삭제 |
| FS-025 | 문서 삭제 제출 | 선택 문서를 삭제한다 | `documentId` | 목록 제거 | 삭제 후 다음 문서를 자동 선택 |
| FS-026 | 문서 다운로드 | 다운로드 동작을 트리거한다 | `documentId` | 토스트 메시지 | 실제 파일 전송은 미구현 |
| FS-027 | 변경 이력 조회 | 문서 변경 이력을 본다 | `documentId` | 이력 표시 | 최신 이력부터 노출 |
| FS-028 | 상태 표시 | 문서 상태를 표시한다 | `status` | 배지 표시 | `정상`, `실패` 2종 |

#### 콘텐츠 정책
- 목록 컬럼은 `문서명 / 유형 / 등록자 / 등록일 / 수정일 / 상태` 순서다.
- 상세 상단은 문서명과 유형을 한 묶음으로 표시한다.
- 상세 메타는 `저장 경로`, `파일 크기`, `등록자`, `등록일`, `수정자`, `수정일` 순으로 2열 배치다.
- `수정자`는 현재 `history[0]?.actor` 값으로 표시한다.
- 업로드/수정 모달은 파일 선택, 저장 경로, 문서 유형을 사용한다.
- 업로드 파일 허용 확장자는 `.pdf`, `.docx`, `.txt`, `.md`다.
- 상태는 `ACTIVE`, `FAILED`만 사용한다.

#### 데이터
- API 함수: `getContentDocuments`, `uploadContentDocument`
- 주요 타입: `ContentDocument`, `ContentHistoryItem`, `ContentDocumentType`, `ContentDocumentStatus`

### 3.4 캐시 답변 관리

| FS ID | 기능명 | 설명 | 입력값 | 결과 | 현재 구현 |
|---|---|---|---|---|---|
| FS-029 | 답변 목록 조회 | 캐시 답변 목록을 조회한다 | 없음 | 테이블 표시 | 10개 단위 페이징 |
| FS-030 | 질문 검색 | 질문 텍스트를 검색한다 | `keyword` | 목록 필터링 | 정규화 후 유사도 검색 |
| FS-031 | 상태 필터 | 활성/비활성을 필터링한다 | `status` | 목록 필터링 | `ALL`, `ACTIVE`, `INACTIVE` |
| FS-032 | 관련도 정렬 | 검색어가 있을 때 관련도 우선 정렬한다 | `keyword` | 목록 정렬 | 점수 동률 시 최신순 |
| FS-033 | 페이지네이션 | 목록을 페이지로 나눈다 | `page` | 페이지 전환 | 현재 페이지 자동 보정 |
| FS-034 | 상세 조회 | 질문, 답변, 메타를 본다 | `id` | 상세 표시 | 선택 항목 기준 상세 표시 |
| FS-035 | 답변 등록 모달 | 신규 답변 입력창을 연다 | 없음 | 모달 오픈 | 등록 버튼으로 열림 |
| FS-036 | 답변 등록 제출 | 새 답변을 생성한다 | `question`, `answer`, `status` | 목록 추가 | 중복 질문 차단 |
| FS-037 | 답변 수정 모달 | 기존 답변을 수정한다 | `id` | 모달 오픈 | 선택 항목 값 선입력 |
| FS-038 | 답변 수정 제출 | 기존 답변을 갱신한다 | `question`, `answer`, `status` | 목록 갱신 | 자기 자신은 중복 비교 제외 |
| FS-039 | 상태 전환 | 활성/비활성을 전환한다 | `id`, `status` | 상세 갱신 | 토글 즉시 반영 |
| FS-040 | 답변 삭제 확인 | 삭제 확인 모달을 연다 | 없음 | 모달 오픈 | 확인 후 삭제 |
| FS-041 | 답변 삭제 제출 | 선택 답변을 삭제한다 | `id` | 목록 제거 | 다음 항목 자동 선택 |
| FS-042 | 글자 수 표시 | 질문/답변 입력 길이를 표시한다 | `question`, `answer` | 카운터 표시 | 모달 하단 카운터 |
| FS-043 | 중복 판정 | 유사한 질문의 중복 여부를 판단한다 | `question` | 오류 메시지 | 정규화 + Levenshtein 사용 |

#### 캐시 답변 정책
- 검색어는 정규화 후 비교한다.
- 중복 판정 임계값은 `0.85`다.
- 목록 컬럼은 `질문 / 상태 / 등록일 / 수정일`이다.
- 상세 상단에는 상태 배지만 노출한다.
- 상세 본문은 `대화 내용`과 메타 정보, 액션 버튼으로 구성된다.
- 메타 정보는 `등록자`, `등록일`, `수정자`, `수정일`, `캐시 조회 수`를 보여준다.
- `답변 요약`과 `마지막 매칭`은 현재 UI에서 표시하지 않는다.
- 상세 질문/답변 본문에는 시간 표기가 없다.

#### 데이터
- API 함수: `getCacheQaInitialData`, `createCacheQaEntry`, `updateCacheQaEntry`, `toggleCacheQaEntryStatus`, `findCacheQaDuplicate`
- 주요 타입: `CacheQaItem`, `CacheQaForm`, `CacheQaStatus`, `CacheQaFilters`, `CacheQaMatch`

### 3.5 지식 기반 조회

| FS ID | 기능명 | 설명 | 입력값 | 결과 | 현재 구현 |
|---|---|---|---|---|---|
| FS-044 | 질문 입력 | 테스트할 질문을 입력한다 | `question` | 조회 대상 설정 | 1자 이상 입력 |
| FS-045 | 문서 유형 선택 | MANUAL / FAQ 를 선택한다 | `documentType` | 문서 목록 필터링 | 변경 시 문서 선택 초기화 |
| FS-046 | 테스트 문서 선택 | 조회할 문서를 선택한다 | `documentId` | 조회 대상 확정 | 문서 유형 선택 후 활성 |
| FS-047 | 조회 실행 | 조건 충족 시 조회를 실행한다 | `form` | 결과 패널 갱신 | `LOADING`, `SUCCESS`, `EMPTY`, `ERROR` |
| FS-048 | 조회 결과 표시 | 답변과 참조 정보를 표시한다 | 결과 | 결과 표시 | 답변, 참조 문서, 참조 단락 노출 |
| FS-049 | 결과 없음 표시 | 결과가 없을 때 안내한다 | 없음 | 빈 상태 | 실패와 구분 |
| FS-050 | 조회 실패 표시 | 조회 실패를 안내한다 | 없음 | 에러 상태 | 재시도 문구 노출 |
| FS-051 | 결과 복사 | 답변을 클립보드에 복사한다 | `answer` | 복사 완료 표시 | 성공 시 `복사 완료` 문구 |
| FS-052 | 초기화 | 입력과 결과를 초기화한다 | 없음 | 초기 상태 복귀 | form/result/copied 초기화 |

#### 지식 기반 정책
- `문서 유형`을 고르면 `테스트 문서` 목록이 필터링된다.
- `테스트 문서`는 문서 유형을 먼저 선택해야 활성화된다.
- 조회 버튼은 필수값이 모두 충족되어야 활성화된다.
- 조회 결과 영역은 답변 카드, 참조 정보, 복사 버튼으로 구성된다.
- `생성 시각`은 결과 카드에 표시된다.
- `참조 문서`는 문서명과 유형을 함께 노출한다.
- `참조 단락`은 `chunk-042` 형태의 문자열로 표시된다.

#### 데이터
- API 함수: `getKnowledgeInitialData`, `executeKnowledgeQuery`
- 주요 타입: `KnowledgeDocument`, `KnowledgeQueryForm`, `KnowledgeResult`

### 3.6 피드백 관리

| FS ID | 기능명 | 설명 | 입력값 | 결과 | 현재 구현 |
|---|---|---|---|---|---|
| FS-056 | 피드백 목록 조회 | 피드백을 테이블로 조회한다 | `reaction`, `dateRange` | 목록 표시 | 반응 필터와 날짜 필터 사용 |
| FS-057 | 반응 필터 | 전체/긍정/부정을 필터링한다 | `reaction` | 목록 필터링 | 드롭다운 방식 |
| FS-058 | 상세 선택 | 선택 피드백의 상세를 표시한다 | `id` | 상세 표시 | 행 클릭으로 선택 |
| FS-059 | 대화 표시 | 사용자/챗봇 대화를 표시한다 | 없음 | 대화 표시 | 대화 버블 형태 |
| FS-060 | 부정 사유 표시 | 부정 사유를 조건부로 표시한다 | 없음 | 조건부 표시 | `NEGATIVE`일 때만 노출 |

#### 피드백 정책
- 목록 컬럼은 `작성일시`, `단지명`, `사용자`, `반응`, `부정사유`다.
- 상세 상단은 `단지명`과 `사용자 아이디`를 한 묶음으로 보여준다.
- 오른쪽 상단에는 긍정/부정 배지가 노출된다.
- 상세 대화에는 각 턴의 발화자와 시각이 함께 노출된다.
- `부정사유`는 반응이 `NEGATIVE`이고 값이 있을 때만 보인다.
- 목록 필터는 검색 버튼이 아니라 즉시 적용되는 반응 선택과 날짜 검색 버튼 조합이다.
- 목록에는 페이지네이션이 없다.

#### 데이터
- API 함수: `getFeedbacks`
- 주요 타입: `FeedbackDetail`, `FeedbackConversationTurn`, `FeedbackFilters`, `FeedbackReaction`

### 3.7 계정 / 권한 관리

| FS ID | 기능명 | 설명 | 입력값 | 결과 | 현재 구현 |
|---|---|---|---|---|---|
| FS-061 | 관리자 목록 조회 | 관리자 목록을 조회한다 | 없음 | 테이블 표시 | 활성/비활성/잠금 포함 |
| FS-062 | 역할 통계 표시 | MASTER / OPERATOR 통계를 표시한다 | 없음 | KPI 카드 | 현재 패널에서 로컬 계산 |
| FS-063 | 관리자 선택 | 선택 관리자의 상세를 표시한다 | `id` | 상세 표시 | 행 클릭으로 선택 |
| FS-064 | 관리자 추가 모달 | 후보 계정 검색 후 추가한다 | 없음 | 모달 오픈 | MASTER만 사용 |
| FS-065 | 관리자 추가 제출 | 후보 계정을 추가한다 | `candidate`, `reason` | 목록 갱신 | 현재 사유는 UI 검증용 |
| FS-066 | 권한 복구 | 비활성 계정을 활성화한다 | `id`, `reason` | 상태 갱신 | 자기 자신 제외 |
| FS-067 | 권한 비활성화 | 활성 OPERATOR 계정을 비활성화한다 | `id`, `reason` | 상태 갱신 | MASTER는 대상 제외 |
| FS-068 | 잠금 해제 | 잠금 계정을 해제한다 | `id`, `reason` | 상태 갱신 | `LOCKED`만 대상 |
| FS-069 | 자기 계정 보호 | 본인 계정은 위험 작업에서 제외한다 | 없음 | 버튼 비노출 | 상세 하단 안내 표시 |
| FS-070 | 로그인 이력 조회 | 로그인 이력을 본다 | `id` | 이력 표시 | 성공/실패와 IP 표시 |
| FS-071 | 잠금/해제 이력 조회 | 잠금/해제 이력을 본다 | `id` | 이력 표시 | 사유와 수행자 표시 |

#### 계정 정책
- 목록 컬럼은 `이름`, `아이디`, `권한`, `상태`, `최종 로그인`이다.
- 상세 상단은 `이름 · 아이디 · 권한`을 한 줄 박스로 보여준다.
- 역할 통계 카드는 활성 계정 기준으로 집계된다.
- `관리자 추가`는 이름, 아이디, 단지코드로 후보 검색을 한다.
- 권한 변경과 추가는 사유 입력을 요구하지만, 현재 로컬 상태에는 사유가 저장되지 않는다.
- 본인 계정은 권한 변경과 비활성화가 제한된다.

#### 데이터
- API 함수: `getAccountsData`
- 주요 타입: `AccountDetail`, `AccountStats`, `UserCandidate`, `AccountLoginHistory`, `AccountLockHistory`

## 4. API / 데이터 구조 요약

### 4.1 현재 API 형태

| 도메인 | 현재 함수/형태 | 비고 |
|---|---|---|
| 인증 | `sessionStorage`, `localStorage`, mock 계정 데이터 | 실 API 없음 |
| 대시보드 | `getDashboardData(range)` | 읽기 전용 mock |
| 콘텐츠 | `getContentDocuments`, `uploadContentDocument` | 로컬 mock 갱신 |
| 캐시 답변 관리 | `getCacheQaInitialData`, `createCacheQaEntry`, `updateCacheQaEntry`, `toggleCacheQaEntryStatus`, `findCacheQaDuplicate` | 로컬 CRUD 유사 흐름 |
| 지식 기반 조회 | `getKnowledgeInitialData`, `executeKnowledgeQuery` | read-only + mock 결과 생성 |
| 피드백 | `getFeedbacks` | 읽기 전용 |
| 계정 | `getAccountsData` | 읽기 전용 + 화면 로컬 상태 변경 |

### 4.2 핵심 데이터 타입

| 타입 | 핵심 필드 |
|---|---|
| `DashboardPayload` | `selectedRange`, `metrics`, `trend`, `fixedKeywords`, `fixedFeedbackRatio` |
| `ContentDocument` | `id`, `name`, `type`, `path`, `author`, `createdAt`, `updatedAt`, `status`, `fileName`, `fileSize`, `history` |
| `CacheQaItem` | `id`, `question`, `answer`, `status`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `hitCount`, `lastMatchedAt` |
| `KnowledgeResult` | `answer`, `generatedAt`, `referenceDocument`, `referenceParagraph` |
| `FeedbackDetail` | `complexName`, `userId`, `reaction`, `createdAt`, `conversation`, `negativeReason` |
| `AccountDetail` | `id`, `name`, `role`, `status`, `registeredAt`, `lastLoginAt`, `loginHistory`, `lockHistory` |

## 5. OPEN_QUESTIONS

- `accounts`의 사유 입력은 현재 UI 검증용인데, 백엔드 연동 시 저장 여부를 확정할 필요가 있다.
- `features/placeholder/placeholder-page.tsx`를 별도 IA 항목으로 노출할지 결정이 필요하다.
- 실제 백엔드 연동 시 각 mock 함수의 엔드포인트와 에러 응답 규격이 필요하다.
