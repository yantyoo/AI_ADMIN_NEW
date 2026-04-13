# Figma Import Spec

## 목적
- 현재 `XpERP AI Admin` 구조를 Figma에 넣기 쉬운 형태로 내보내기 위한 handoff 레이어입니다.
- Next.js 코드를 Figma가 직접 읽을 수는 없어서, `figma-import-spec.json`을 중간 포맷으로 사용합니다.

## 생성 방법
```bash
npm run figma:export
```

## 생성 파일
- `figma-import-spec.json`

## 포함 범위
| 범위 | 내용 |
|---|---|
| 공통 레이아웃 | `AdminShell`, `Sidebar`, `TopHeader` |
| 화면 프레임 | `/login`, `/dashboard`, `/content`, `/cache-qa`, `/knowledge`, `/feedback`, `/accounts` |
| 상태값 | `idle`, `loading`, `success`, `empty`, `error`, `modal` |
| 정책 | 권한, 유효성, 페이지 사이즈, 선택 유지 규칙 |
| 에지 케이스 | 빈 상태, 에러, 자기 계정 제한, 중복 검증 |

## Figma에서 쓰는 방식
1. `figma-import-spec.json`을 읽는 커스텀 플러그인 또는 스크립트를 사용합니다.
2. `screens[]`를 `Frame`으로 생성합니다.
3. `layout`을 기준으로 섹션/컴포넌트를 배치합니다.
4. `states[]`, `flow[]`, `policies[]`는 오른쪽 패널 또는 주석 프레임으로 분리합니다.

## 주의
- 이 파일은 픽셀 단위 렌더링 결과가 아니라 구조 스펙입니다.
- 실제 Figma 오브젝트 생성이 필요하면 다음 단계는 플러그인 스크립트입니다.
