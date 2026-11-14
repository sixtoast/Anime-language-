import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const runtimeProcess = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };
const sourceRef = runtimeProcess.process?.env?.VERCEL_GIT_COMMIT_REF || runtimeProcess.process?.env?.GITHUB_REF_NAME || "main";

export default defineConfig({
  plugins: [react()],
  define: { __GITHUB_SOURCE_REF__: JSON.stringify(sourceRef) },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"]
  }
});