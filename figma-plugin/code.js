const spec = {
  meta: {
    projectName: "XpERP AI Admin"
  },
  screens: [
    {
      route: "/login",
      title: "로그인",
      sections: [
        "auth-card__intro",
        "auth-form",
        "auth-otp-modal",
        "auth-notice-modal"
      ],
      states: ["idle", "loading", "error", "otp-modal", "notice-modal", "locked"]
    },
    {
      route: "/dashboard",
      title: "대시보드",
      sections: ["dashboard-grid", "panel--main", "metric-card-grid", "TrendChart", "dashboard-side"],
      states: ["default", "range-switch", "error"]
    },
    {
      route: "/content",
      title: "콘텐츠 관리",
      sections: ["content-grid", "content-table-card", "content-detail-card", "Upload modal", "Delete modal"],
      states: ["list", "empty", "detail-selected", "upload-modal", "delete-modal"]
    },
    {
      route: "/cache-qa",
      title: "캐시 답변 관리",
      sections: ["cache-qa-grid", "cache-qa-list-card", "cache-qa-detail-card", "Editor modal", "Delete modal"],
      states: ["list", "empty", "detail-selected", "editor-modal", "delete-modal"]
    },
    {
      route: "/knowledge",
      title: "지식 기반 조회",
      sections: ["knowledge-grid", "knowledge-form", "knowledge-result-scroll"],
      states: ["idle", "loading", "success", "empty", "error"]
    },
    {
      route: "/feedback",
      title: "피드백 관리",
      sections: ["feedback-grid", "feedback-list-card", "feedback-detail-card"],
      states: ["list", "empty", "detail-selected"]
    },
    {
      route: "/accounts",
      title: "계정/권한 관리",
      sections: ["accounts-layout", "accounts-stat-grid", "accounts-grid", "Add account modal", "Action modal"],
      states: ["list", "detail-selected", "add-modal", "action-modal"]
    }
  ]
};

const WIDTH = 1440;
const SCREEN_HEIGHT = 920;
const GAP = 80;
const PADDING = 64;
const CARD_W = 1240;

async function loadFonts() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
}

function makePaint(hex) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return { type: "SOLID", color: { r, g, b } };
}

function createText(chars, size, style, color = "#1C2B3D") {
  const node = figma.createText();
  node.fontName = { family: "Inter", style };
  node.characters = chars;
  node.fontSize = size;
  node.fills = [makePaint(color)];
  return node;
}

function createChip(text) {
  const chip = figma.createFrame();
  chip.name = `chip-${text}`;
  chip.layoutMode = "HORIZONTAL";
  chip.primaryAxisSizingMode = "AUTO";
  chip.counterAxisSizingMode = "AUTO";
  chip.paddingLeft = 10;
  chip.paddingRight = 10;
  chip.paddingTop = 6;
  chip.paddingBottom = 6;
  chip.itemSpacing = 8;
  chip.cornerRadius = 999;
  chip.fills = [makePaint("#EEF3FF")];
  chip.strokes = [makePaint("#DCE4F0")];
  chip.strokeWeight = 1;
  chip.appendChild(createText(text, 12, "Medium", "#4A82F5"));
  return chip;
}

function createSectionTitle(text) {
  return createText(text, 18, "Bold", "#1C2B3D");
}

function createBodyText(text) {
  const node = createText(text, 14, "Regular", "#6E7F97");
  node.lineHeight = { unit: "PIXELS", value: 20 };
  return node;
}

function createScreenFrame(screen, index) {
  const frame = figma.createFrame();
  frame.name = `${screen.route} - ${screen.title}`;
  frame.resize(WIDTH, SCREEN_HEIGHT);
  frame.x = PADDING + index * (WIDTH + GAP);
  frame.y = 0;
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  frame.itemSpacing = 24;
  frame.paddingTop = 40;
  frame.paddingBottom = 40;
  frame.paddingLeft = 40;
  frame.paddingRight = 40;
  frame.fills = [makePaint("#EDF1F8")];
  frame.strokes = [makePaint("#DCE4F0")];
  frame.strokeWeight = 1;
  frame.cornerRadius = 24;

  const header = figma.createFrame();
  header.name = "header";
  header.layoutMode = "VERTICAL";
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "AUTO";
  header.itemSpacing = 8;
  header.fills = [];
  header.strokes = [];

  header.appendChild(createText(screen.route, 12, "Medium", "#4A82F5"));
  header.appendChild(createSectionTitle(screen.title));
  header.appendChild(createBodyText(`상태: ${screen.states.join(", ")}`));

  const sectionWrap = figma.createFrame();
  sectionWrap.name = "sections";
  sectionWrap.layoutMode = "VERTICAL";
  sectionWrap.primaryAxisSizingMode = "AUTO";
  sectionWrap.counterAxisSizingMode = "AUTO";
  sectionWrap.itemSpacing = 12;
  sectionWrap.fills = [];
  sectionWrap.strokes = [];

  for (const sectionName of screen.sections) {
    const card = figma.createFrame();
    card.name = sectionName;
    card.layoutMode = "VERTICAL";
    card.primaryAxisSizingMode = "AUTO";
    card.counterAxisSizingMode = "FIXED";
    card.resize(CARD_W, 96);
    card.paddingLeft = 20;
    card.paddingRight = 20;
    card.paddingTop = 18;
    card.paddingBottom = 18;
    card.itemSpacing = 10;
    card.cornerRadius = 18;
    card.fills = [makePaint("#FFFFFF")];
    card.strokes = [makePaint("#DCE4F0")];
    card.strokeWeight = 1;
    card.appendChild(createText(sectionName, 16, "Semi Bold", "#1C2B3D"));
    card.appendChild(createBodyText("이 영역은 Figma에서 화면 단위로 세분화할 섹션입니다."));
    sectionWrap.appendChild(card);
  }

  const chips = figma.createFrame();
  chips.name = "state-chips";
  chips.layoutMode = "HORIZONTAL";
  chips.primaryAxisSizingMode = "AUTO";
  chips.counterAxisSizingMode = "AUTO";
  chips.itemSpacing = 8;
  chips.fills = [];
  chips.strokes = [];
  for (const state of screen.states) {
    chips.appendChild(createChip(state));
  }

  frame.appendChild(header);
  frame.appendChild(chips);
  frame.appendChild(sectionWrap);
  return frame;
}

async function main() {
  await loadFonts();

  const page = figma.createPage();
  page.name = "XpERP Admin Import";
  await figma.setCurrentPageAsync(page);

  const createdNodeIds = [];
  const createdNodes = [];
  for (const [index, screen] of spec.screens.entries()) {
    const frame = createScreenFrame(screen, index);
    page.appendChild(frame);
    createdNodeIds.push(frame.id);
    createdNodes.push(frame);
  }

  figma.viewport.scrollAndZoomIntoView(createdNodes);

  return {
    pageId: page.id,
    createdNodeIds
  };
}

main();
