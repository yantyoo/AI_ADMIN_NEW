# Figma Make Context Pack

## 목적
- Figma Make가 이 저장소를 읽을 때, 가장 먼저 봐야 하는 진입 문서입니다.
- 이 프로젝트는 웹앱을 그대로 Make에서 실행하는 구조가 아니라, **기존 UI를 최대한 유지한 채 생성할 수 있게 하는 컨텍스트 패키지**입니다.

## 핵심 원칙
| 원칙 | 기준 |
|---|---|
| 디자인 보존 | 현재 색상, 간격, 라운드, 패널 구조, 상태값을 우선 유지 |
| 화면 단위 | 라우트별 1개 프레임으로 시작 |
| 컴포넌트 재사용 | `AdminShell`, `Sidebar`, `TopHeader`, `SectionHeader`, `ListPanel`, `DetailFrame`, `ModalDialog` 우선 사용 |
| 상태 유지 | `idle`, `loading`, `success`, `empty`, `error`, `modal`을 반드시 표현 |
| 과한 재설계 금지 | 레이아웃/톤앤매너를 새로 창작하지 말 것 |

## 우선 읽을 파일
1. [MAKE_STARTER.md](./MAKE_STARTER.md)
2. [MAKE_SCREEN_SPEC.md](./MAKE_SCREEN_SPEC.md)
3. [IA_SPEC.md](./IA_SPEC.md)
4. [FEATURE_SPEC.md](./FEATURE_SPEC.md)
5. [figma-import-spec.json](./figma-import-spec.json)

## Make에서의 사용 방식
- GitHub connector로 이 레포를 연결
- Make에서 `MAKE_STARTER.md`를 기반 프롬프트로 사용
- 필요하면 `MAKE_SCREEN_SPEC.md`를 추가 컨텍스트로 넣음

## 기대 결과
- 로그인, 대시보드, 콘텐츠, 캐시 QA, 지식 조회, 피드백, 계정관리 화면을 현재 구조 그대로 생성
- 화면별 상태와 모달까지 포함
- 디자인 토큰과 레이아웃 규칙을 크게 바꾸지 않음
