import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const FigmaImportSpecPath = join(process.cwd(), "docs/figma-import-spec.json");

async function readFigmaImportSpec() {
  const raw = await readFile(FigmaImportSpecPath, "utf8");
  return JSON.parse(raw) as unknown;
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "get_figma_import_spec",
      {
        title: "Get Figma Import Spec",
        description:
          "Returns the current admin UI structure as a Figma-ready import spec for Make or other MCP clients.",
        inputSchema: {
          includeScreens: z.boolean().optional().default(true),
          includePolicies: z.boolean().optional().default(true)
        }
      },
      async () => {
        const spec = await readFigmaImportSpec();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(spec, null, 2)
            }
          ]
        };
      }
    );

    server.registerResource(
      "figma-import-spec",
      "figma://import-spec",
      {
        title: "Figma Import Spec",
        description: "Machine-readable spec for building the admin UI structure in Figma Make."
      },
      async () => {
        const spec = await readFigmaImportSpec();
        return {
        contents: [
          {
            uri: "figma://import-spec",
            mimeType: "application/json",
            text: JSON.stringify(spec, null, 2)
          }
        ]
        };
      }
    );

    server.registerPrompt(
      "figma_make_context",
      {
        title: "Figma Make Context",
        description: "Prompt starter for using the admin UI structure in Figma Make."
      },
      () => ({
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text:
                "Use the get_figma_import_spec tool or figma://import-spec resource to build the XpERP AI Admin structure in Figma Make."
            }
          }
        ]
      })
    );
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: true
  }
);

export { handler as GET, handler as POST };
