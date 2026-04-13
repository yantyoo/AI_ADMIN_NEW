export type PlaceholderSpec = {
  title: string;
  description: string;
  blockedReason: string;
};

export function getPlaceholderSpec(title: string, description: string): PlaceholderSpec {
  return {
    title,
    description,
    blockedReason: "기능정의서에 상세 화면 또는 API가 없어 현재는 구현 보류 상태입니다."
  };
}
