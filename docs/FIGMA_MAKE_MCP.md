# Figma Make MCP Server

## 목적
- Figma Make에서 읽을 수 있는 HTTPS MCP 엔드포인트를 제공합니다.
- 로컬 플러그인이 아니라, Make의 custom connector로 연결하는 방식입니다.

## 엔드포인트
- `GET /api/mcp`
- `POST /api/mcp`

## 노출 도구
| 이름 | 용도 |
|---|---|
| `get_figma_import_spec` | 현재 UI 구조 JSON 반환 |

## 노출 리소스
| URI | 용도 |
|---|---|
| `figma://import-spec` | Figma용 구조 스펙 JSON |

## 노출 프롬프트
| 이름 | 용도 |
|---|---|
| `figma_make_context` | Make에서 문맥 주입용 시작 문구 |

## Figma Make 연결 방법
1. 서버를 HTTPS로 배포합니다.
2. Figma Make에서 `Add context > Connectors > Create`를 엽니다.
3. MCP server URL에 `https://your-domain.com/api/mcp`를 입력합니다.
4. `get_figma_import_spec` 도구를 활성화합니다.

## 주의
- Figma Make는 `localhost`와 `stdio` MCP 서버를 지원하지 않습니다.
- 반드시 공개 HTTPS URL이 있어야 합니다.
