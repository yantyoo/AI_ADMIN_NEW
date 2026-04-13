# Make Screen Spec

## 공통 구조
```text
AdminShell
├─ Sidebar
├─ TopHeader
└─ main content
   ├─ panel
   ├─ list panel
   ├─ detail frame
   └─ modal / toast
```

## 공통 컴포넌트
| 컴포넌트 | 역할 |
|---|---|
| `AdminShell` | 인증 후 전체 레이아웃 |
| `Sidebar` | 라우트 내비게이션 |
| `TopHeader` | 화면 제목과 설명 |
| `SectionHeader` | 섹션 제목 + 액션 |
| `ListPanel` | 목록형 화면 컨테이너 |
| `DetailFrame` | 상세형 화면 컨테이너 |
| `ModalDialog` | 생성/수정/삭제 확인 |
| `Pagination` | 페이지네이션 |
| `ToastStack` | 성공/오류 메시지 |

## 디자인 토큰
| 항목 | 값 |
|---|---|
| Background | `#edf1f8` |
| Surface | `#ffffff` |
| Surface muted | `#f4f7fb` |
| Border | `#dce4f0` |
| Text | `#1c2b3d` |
| Text muted | `#6e7f97` |
| Accent blue | `#4a82f5` |
| Accent green | `#27b870` |
| Accent rose | `#f24472` |

## 화면 범위
- 아래 라우트를 **모두** 생성해야 한다.
- `dashboard`는 첫 화면일 뿐, 유일한 화면이 아니다.

## 화면 우선순위
1. `/dashboard`
2. `/content`
3. `/cache-qa`
4. `/feedback`
5. `/accounts`
6. `/knowledge`
7. `/login`

## 화면 상세

### `/dashboard`
- 좌측: KPI 카드 3개 + 트렌드 차트
- 우측: 지문 키워드 + 피드백 비율
- 상태: `default`, `range-switch`, `error`

### `/content`
- 좌측: 문서 목록 + 검색/필터
- 우측: 문서 상세 + 히스토리 + 액션
- 모달: 업로드, 삭제 확인

### `/cache-qa`
- 좌측: 캐시 목록 + 검색/필터 + 페이징
- 우측: 상세 + 상태 변경 + 편집/삭제
- 모달: 생성/편집, 삭제 확인

### `/knowledge`
- 좌측: 조회 조건
- 우측: 결과 카드
- 상태: `idle`, `loading`, `success`, `empty`, `error`

### `/feedback`
- 좌측: 피드백 목록 + 날짜/반응 필터
- 우측: 대화 상세 + 부정사유

### `/accounts`
- 상단: 통계 카드
- 하단: 계정 목록 + 상세
- 모달: 계정 추가, 권한/상태 변경

### `/login`
- 좌측: 브랜딩/가이드
- 우측: 로그인 폼
- 모달: OTP, 안내, 경고

## 예외 처리
- 빈 목록은 빈 상태 메시지로 대체
- 검증 실패는 버튼 비활성화와 인라인 메시지로 처리
- 권한 없는 기능은 숨김 처리
- 자기 계정의 권한 조작은 차단

## 출력 규칙
- Make는 화면을 새로 발명하지 말고 기존 구조를 유지한다.
- 섹션은 가능한 한 현재 코드의 구조를 따른다.
- 각 화면은 Figma Frame 1개로 시작한다.
- 모든 라우트를 만든 뒤에만 완료로 본다.
