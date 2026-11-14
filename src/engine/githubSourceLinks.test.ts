import { describe, expect, it } from "vitest";
import { githubBlobUrl } from "./githubSourceLinks";

describe("branch-aware GitHub source links", () => {
  it("[WEB-SRC-001] points preview links at the deployment branch", () => {
    expect(githubBlobUrl("docs/research/phase8az-note.md", "feat/research-update"))
      .toBe("https://github.com/sixtoast/Anime-language-/blob/feat/research-update/docs/research/phase8az-note.md");
  });
  it("keeps local source links on main when that ref is supplied", () => {
    expect(githubBlobUrl("src/App.tsx", "main"))
      .toBe("https://github.com/sixtoast/Anime-language-/blob/main/src/App.tsx");
  });
  it("preserves section fragments and safely encodes path segments", () => {
    expect(githubBlobUrl("docs/research/a note.md#section-2", "main"))
      .toBe("https://github.com/sixtoast/Anime-language-/blob/main/docs/research/a%20note.md#section-2");
  });
  it("rejects missing refs and path traversal", () => {
    expect(() => githubBlobUrl("docs/a.md", " ")).toThrow();
    expect(() => githubBlobUrl("../secrets.txt", "main")).toThrow();
  });
});
