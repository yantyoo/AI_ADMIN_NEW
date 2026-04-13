import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const outputPath = resolve(process.cwd(), "figma-import-spec.json");

const spec = {
  meta: {
    projectName: "XpERP AI Admin",
    purpose: "Current admin UI structure exported as a Figma import spec.",
    note: "Native Figma cannot read Next.js code directly, so this file is the handoff layer for a plugin or custom importer."
  },
  designSystem: {
    tokens: {
      colors: {
        bg: "#edf1f8",
        surface: "#ffffff",
        surfaceMuted: "#f4f7fb",
        border: "#dce4f0",
        text: "#1c2b3d",
        textMuted: "#6e7f97",
        navBg: "#252e42",
        navSurface: "#3a4f75",
        accentBlue: "#4a82f5",
        accentGreen: "#27b870",
        accentRose: "#f24472"
      },
      radius: {
        lg: 22,
        md: 16,
        sm: 12,
        xs: 8
      },
      shadow: {
        base: "0 4px 20px rgba(22, 40, 68, 0.08)",
        strong: "0 12px 48px rgba(22, 40, 68, 0.14)"
      }
    },
    sharedComponents: [
      {
        name: "AdminShell",
        source: "components/layout/admin-shell.tsx",
        role: "authenticated layout shell",
        nodes: ["sidebar", "top-header", "admin-shell__content"]
      },
      {
        name: "Sidebar",
        source: "features/layout/sidebar.tsx",
        role: "global navigation",
        nodes: ["brand", "nav-items", "user-card", "logout-modal"]
      },
      {
        name: "TopHeader",
        source: "features/layout/top-header.tsx",
        role: "page title header",
        nodes: ["title", "description"]
      },
      {
        name: "SectionHeader",
        source: "components/layout/section-header.tsx",
        role: "section title and actions"
      },
      {
        name: "ListPanel",
        source: "components/layout/list-panel.tsx",
        role: "list page container",
        nodes: ["header", "toolbar", "body", "footer"]
      },
      {
        name: "DetailFrame",
        source: "components/layout/detail-frame.tsx",
        role: "detail panel container",
        nodes: ["header", "body", "actions"]
      },
      {
        name: "ModalDialog",
        source: "components/ui/modal-dialog.tsx",
        role: "modal overlay",
        nodes: ["backdrop", "dialog", "header", "content", "footer"]
      },
      {
        name: "Pagination",
        source: "components/ui/pagination.tsx",
        role: "list pagination"
      },
      {
        name: "ToastStack",
        source: "components/ui/toast-stack.tsx",
        role: "transient system message"
      }
    ]
  },
  screens: [
    {
      id: "route-root",
      route: "/",
      title: "Root Redirect",
      access: "public",
      source: ["app/page.tsx"],
      frame: { width: 1440, height: 1024 },
      shell: "redirect-only",
      flow: [
        "Check auth stage from sessionStorage",
        "authenticated -> /dashboard",
        "otherwise -> /login"
      ],
      states: ["redirecting"],
      edgeCases: ["Missing sessionStorage should fall back to /login"],
      kpi: ["redirect decision should happen on first client render"]
    },
    {
      id: "route-login",
      route: "/login",
      title: "로그인",
      access: "public",
      source: ["app/login/page.tsx", "features/auth/auth-screen.tsx"],
      frame: { width: 1440, height: 1024 },
      shell: "auth-shell",
      layout: [
        {
          name: "auth-card",
          children: [
            "auth-card__intro",
            "auth-form"
          ]
        },
        {
          name: "OTP modal",
          children: ["auth-otp-modal", "auth-otp-modal__body", "auth-otp-modal__actions"]
        },
        {
          name: "Notice modal",
          children: ["auth-notice-modal", "auth-notice-modal__message"]
        }
      ],
      flow: [
        "Enter user id and password",
        "Valid credentials -> open OTP modal",
        "OTP success -> /dashboard",
        "Invalid credentials or lock -> show notice modal",
        "5 failed OTP attempts -> lock notice"
      ],
      states: ["idle", "loading", "error", "otp-modal", "notice-modal", "locked"],
      edgeCases: [
        "OTP screen is modal-only and not a standalone input page",
        "Remember-id affects stored auth profile only"
      ],
      policies: [
        "SESSION_KEY should drive auth stage",
        "Public route should not show authenticated shell"
      ],
      kpi: [
        "login feedback should be shown within 300ms",
        "OTP failure count should be visible on each failed attempt"
      ]
    },
    {
      id: "route-dashboard",
      route: "/dashboard",
      title: "대시보드",
      access: ["MASTER", "OPERATOR"],
      source: ["app/dashboard/page.tsx", "features/dashboard/dashboard-page.tsx", "features/dashboard/dashboard-panel.tsx"],
      frame: { width: 1440, height: 1024 },
      shell: "AdminShell",
      layout: [
        {
          name: "dashboard-grid",
          children: [
            {
              name: "panel panel--main",
              children: ["SectionHeader", "TimeRangeTabs", "metric-card-grid", "TrendChart", "ErrorState"]
            },
            {
              name: "dashboard-side",
              children: ["KeywordList", "FeedbackRatio"]
            }
          ]
        }
      ],
      flow: [
        "Open dashboard",
        "Switch day/week/month range",
        "Refresh KPI cards and chart",
        "If error state appears, retry to recover"
      ],
      states: ["default", "range-switch", "error"],
      edgeCases: [
        "ErrorState should replace chart and KPI area",
        "Range selection must persist in local UI state only"
      ],
      policies: [
        "Initial range is WEEK",
        "Only DAY, WEEK, MONTH are allowed"
      ],
      kpi: [
        "range switch should update visible data immediately",
        "chart hover/tooltip should remain responsive"
      ]
    },
    {
      id: "route-content",
      route: "/content",
      title: "콘텐츠 관리",
      access: ["MASTER"],
      source: ["app/content/page.tsx", "features/content/content-page.tsx", "features/content/content-panel.tsx"],
      frame: { width: 1440, height: 1024 },
      shell: "AdminShell",
      layout: [
        {
          name: "content-grid",
          children: [
            {
              name: "content-table-card",
              children: ["SectionHeader", "content-toolbar", "content-table-scroll"]
            },
            {
              name: "content-detail-card",
              children: ["content-detail-scroll", "content-history", "content-detail-actions"]
            }
          ]
        },
        {
          name: "Upload modal",
          children: ["file selector", "path input", "type select", "footer actions"]
        },
        {
          name: "Delete modal",
          children: ["confirmation text", "cancel", "delete"]
        }
      ],
      flow: [
        "Filter by document type and keyword",
        "Select a row to inspect details",
        "Upload a new document or edit the selected one",
        "Delete after confirmation",
        "Show toast after create/edit/delete/download"
      ],
      states: ["list", "empty", "detail-selected", "upload-modal", "delete-modal", "toast-success", "toast-error"],
      edgeCases: [
        "Empty list should show guidance copy",
        "Delete removes the selected item and auto-selects next item",
        "Editing appends a history record"
      ],
      policies: [
        "File types are restricted to pdf, docx, txt, md",
        "Search applies to name and path",
        "Table columns are document name, type, author, created, updated, status"
      ],
      kpi: [
        "search results should feel instant on local data",
        "modal validation should block submit until file and path exist"
      ]
    },
    {
      id: "route-cache-qa",
      route: "/cache-qa",
      title: "캐시 답변 관리",
      access: ["MASTER"],
      source: ["app/cache-qa/page.tsx", "features/cache-qa/cache-qa-page.tsx", "features/cache-qa/cache-qa-panel.tsx"],
      frame: { width: 1440, height: 1024 },
      shell: "AdminShell",
      layout: [
        {
          name: "cache-qa-grid",
          children: [
            {
              name: "cache-qa-list-card",
              children: ["ListPanel", "search field", "status filter", "Pagination"]
            },
            {
              name: "cache-qa-side",
              children: ["cache-qa-detail-card", "cache-qa-editor-card"]
            }
          ]
        },
        {
          name: "Editor modal",
          children: ["question textarea", "answer textarea", "status select", "counter", "footer actions"]
        },
        {
          name: "Delete modal",
          children: ["confirmation text", "cancel", "delete"]
        }
      ],
      flow: [
        "Search by question keyword",
        "Filter by status",
        "Page through the list",
        "Open detail panel",
        "Create/edit/toggle status/delete cache answer",
        "Show toast after every mutation"
      ],
      states: ["list", "empty", "detail-selected", "editor-modal", "delete-modal", "toast-success", "toast-error"],
      edgeCases: [
        "Duplicate question validation blocks create/edit",
        "Selected item must follow current filter and page",
        "Status toggle should refresh the detail panel immediately"
      ],
      policies: [
        "Page size is fixed to 10",
        "Question similarity should affect sort order when keyword search is used",
        "Only ACTIVE and INACTIVE are allowed"
      ],
      kpi: [
        "validation should be blocked before API write",
        "pagination should keep selection aligned with filtered list"
      ]
    },
    {
      id: "route-knowledge",
      route: "/knowledge",
      title: "지식 기반 조회",
      access: ["MASTER"],
      source: ["app/knowledge/page.tsx", "features/knowledge/knowledge-page.tsx", "features/knowledge/knowledge-panel.tsx"],
      frame: { width: 1440, height: 1024 },
      shell: "AdminShell",
      layout: [
        {
          name: "knowledge-grid",
          children: [
            {
              name: "panel panel--main",
              children: ["SectionHeader", "knowledge-form"]
            },
            {
              name: "DetailFrame",
              children: ["knowledge-result-scroll", "knowledge-answer", "knowledge-reference", "knowledge-footer"]
            }
          ]
        }
      ],
      flow: [
        "Choose document type",
        "Choose test document",
        "Type question",
        "Run query",
        "Show loading, success, empty, or error state",
        "Copy answer when result exists"
      ],
      states: ["idle", "loading", "success", "empty", "error"],
      edgeCases: [
        "Document list should reset when document type changes",
        "Copy button is only visible after success",
        "Query should be blocked until all required fields are filled"
      ],
      policies: [
        "Required fields are question, documentType, documentId",
        "Knowledge result shows answer, generated time, reference document, and reference paragraph"
      ],
      kpi: [
        "loading state must appear immediately after submit",
        "copy action should give feedback within 2s"
      ]
    },
    {
      id: "route-feedback",
      route: "/feedback",
      title: "피드백 관리",
      access: ["MASTER", "OPERATOR"],
      source: ["app/feedback/page.tsx", "features/feedback/feedback-page.tsx", "features/feedback/feedback-panel.tsx"],
      frame: { width: 1440, height: 1024 },
      shell: "AdminShell",
      layout: [
        {
          name: "feedback-grid",
          children: [
            {
              name: "feedback-list-card",
              children: ["SectionHeader", "feedback-filter-bar", "feedback-list-scroll"]
            },
            {
              name: "feedback-detail-card",
              children: ["feedback-detail-scroll", "conversation", "negative-reason"]
            }
          ]
        }
      ],
      flow: [
        "Filter by reaction and date range",
        "Select feedback row",
        "Inspect conversation and negative reason",
        "Switch filters to update selected item"
      ],
      states: ["list", "empty", "detail-selected"],
      edgeCases: [
        "Negative reason should only render for NEGATIVE reaction",
        "Selection should follow the filtered result set"
      ],
      policies: [
        "Table columns are created time, complex name, user id, reaction, negative reason",
        "Date range is applied from the draft fields only after search action"
      ],
      kpi: [
        "filter application should keep table selection consistent",
        "detail view should preserve scrollable conversation layout"
      ]
    },
    {
      id: "route-accounts",
      route: "/accounts",
      title: "계정/권한 관리",
      access: ["MASTER"],
      source: ["app/accounts/page.tsx", "features/accounts/accounts-page.tsx", "features/accounts/accounts-panel.tsx"],
      frame: { width: 1440, height: 1024 },
      shell: "AdminShell",
      layout: [
        {
          name: "accounts-layout",
          children: [
            {
              name: "accounts-stat-grid",
              children: ["4 metric cards"]
            },
            {
              name: "accounts-grid",
              children: ["accounts-list-card", "accounts-detail-card"]
            }
          ]
        },
        {
          name: "Add account modal",
          children: ["user search", "candidate list", "reason textarea", "footer actions"]
        },
        {
          name: "Action modal",
          children: ["reason textarea", "footer actions"]
        }
      ],
      flow: [
        "Review account list and summary cards",
        "Select an account",
        "Activate, deactivate, or unlock depending on state",
        "Add a new account from candidate search",
        "Show audit history in the detail panel"
      ],
      states: ["list", "detail-selected", "add-modal", "action-modal"],
      edgeCases: [
        "Self account must not allow privilege mutation",
        "Add-account confirmation requires selected candidate and reason",
        "Action confirmation requires reason"
      ],
      policies: [
        "Roles are MASTER and OPERATOR",
        "Statuses are ACTIVE, INACTIVE, LOCKED",
        "Login history and lock history are read-only audit data"
      ],
      kpi: [
        "status changes should update list and detail in one render",
        "audit history should remain readable in a scrollable detail pane"
      ]
    }
  ],
  globalPolicies: [
    "Authenticated routes must use AdminShell.",
    "Public routes are /, /login, and modal-only auth states.",
    "All transient mutations should show toast feedback.",
    "Loading, empty, error, disabled, and success states must be represented in the Figma frame set.",
    "Role-based visibility must be reflected in the screen variants."
  ],
  openQuestions: [
    "Should placeholder routes be included in the import file or excluded from the production Figma deck?",
    "Do you want a second pass that turns this JSON into actual Figma nodes through a plugin script?"
  ]
};

async function main() {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(spec, null, 2) + "\n", "utf8");
  process.stdout.write(`Wrote ${outputPath}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { spec as figmaImportSpec };
