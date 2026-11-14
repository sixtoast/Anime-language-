const REPOSITORY = "https://github.com/sixtoast/Anime-language-";

export function githubBlobUrl(path: string, ref: string): string {
  const cleanPath = path.trim().replace(/^\\/+/, "");
  const cleanRef = ref.trim();
  if (!cleanPath || !cleanRef) throw new Error("A repository path and ref are required.");
  const [filePath, fragment] = cleanPath.split("#", 2);
  if (filePath.split("/").some((segment) => segment === ".." || segment === ".")) {
    throw new Error("Repository paths must not contain relative traversal segments.");
  }
  const encodedRef = cleanRef.split("/").map(encodeURIComponent).join("/");
  const encodedPath = filePath.split("/").map(encodeURIComponent).join("/");
  return REPOSITORY + "/blob/" + encodedRef + "/" + encodedPath + (fragment ? "#" + encodeURIComponent(fragment) : "");
}
