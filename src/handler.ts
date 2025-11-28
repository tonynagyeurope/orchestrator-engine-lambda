import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { runOrchestration } from "orchestrator-engine";
import fs from "node:fs/promises";

// ESM-ben a require.resolve helyett:
const resolvePath = (specifier: string) => import.meta.resolve(specifier);

export const run: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const provider = body.provider ?? "openai";
    const input = body.input ?? "";
    const profileId = body.profileId ?? "default";

    // --- DEBUG BLOCK (ESM safe) -------------------------------------
    try {
      const oePath = await resolvePath("orchestrator-engine");
      console.log("[DEBUG] Using OE from:", oePath);

      const providerDiscoveryPath = await resolvePath(
        "orchestrator-engine/dist/src/reasoning/providerDiscovery.js"
      );

      const providerDiscoveryContent = await fs.readFile(
        new URL(providerDiscoveryPath),
        "utf8"
      );

      console.log("[DEBUG] providerDiscovery.js content:");
      console.log(providerDiscoveryContent);
    } catch (debugErr) {
      console.warn("[DEBUG] Failed to print providerDiscovery content:", debugErr);
    }
    // ----------------------------------------------------------------

    // 1) Run the OE core engine
    const result = await runOrchestration(input, profileId);

    // 2) Transform output for FE
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        provider,
        profile: result.profile,
        summary: result.summary,
        trace: result.trace
      })
    };

  } catch (error) {
    console.error("Lambda execution error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: "Orchestration failed"
      })
    };
  }
};
