# Make Starter

## 목적
이 저장소의 현재 UI 구조를 유지한 채 Figma Make 화면으로 재구성하라. 새 디자인을 만들지 말고, 기존 레이아웃/토큰/상태/컴포넌트를 최대한 보존하라.

## 작업 원칙
| 항목 | 지시 |
|---|---|
| 레이아웃 | 현재 라우트 구조를 그대로 사용 |
| 톤 | `XpERP AI Admin`의 운영자용 B2B 톤 유지 |
| 컬러 | 기존 토큰 우선 사용 |
| 카드 | panel, list, detail, modal 구조 유지 |
| 상태 | loading, empty, error, success, disabled 표현 |
| 권한 | MASTER / OPERATOR 분기 유지 |
| 이동 | 좌측 사이드바 + 상단 헤더 + 본문 구조 유지 |

## 반드시 지켜야 할 점
1. `/dashboard`만 만들고 끝내지 말 것.
2. `/content`, `/cache-qa`, `/feedback`, `/accounts`, `/knowledge`, `/login`까지 모두 생성할 것.
3. 각 화면은 별도 Frame으로 분리할 것.
4. 메인 화면 우선순위는 `dashboard`이지만, 범위는 전체 라우트다.
5. 모달과 토스트는 화면 상태로 분리할 것.

## 생성 순서
1. `AdminShell`을 최상위로 둔다.
2. `/dashboard`를 메인 예시로 먼저 생성한다.
3. 리스트/상세형 화면(`/content`, `/cache-qa`, `/feedback`, `/accounts`)을 패턴화한다.
4. 마지막에 `/login`과 `/knowledge`를 붙인다.
5. 모든 라우트를 생성한 뒤에만 완료로 본다.

## 화면별 목표
| 라우트 | 목표 |
|---|---|
| `/login` | 인증 흐름과 OTP 모달 표현 |
| `/dashboard` | KPI + 차트 + 우측 보조 패널 |
| `/content` | 문서 목록 / 상세 / 업로드 / 삭제 |
| `/cache-qa` | 캐시 답변 목록 / 상세 / 편집 / 삭제 |
| `/knowledge` | 조건 입력 / 질의 결과 / 복사 |
| `/feedback` | 피드백 목록 / 상세 대화 / 부정사유 |
| `/accounts` | 계정 목록 / 상세 / 권한 조작 / 감사기록 |

## 절대 바꾸지 말 것
- 사이드바 위치
- 리스트/상세 2단 구조
- 패널과 모달의 사용 방식
- 상태값 정의
- 역할별 노출 정책

## 디자인 유지 기준
- 현재의 넓은 여백과 카드형 계층을 유지
- 라운드는 과하게 줄이지 말 것
- 운영툴 느낌의 실용적 인터페이스를 유지
- 장식용 요소를 늘리지 말 것

## 참고 파일
- [MAKE_SCREEN_SPEC.md](./MAKE_SCREEN_SPEC.md)
- [IA_SPEC.md](./IA_SPEC.md)
- [FEATURE_SPEC.md](./FEATURE_SPEC.md)
