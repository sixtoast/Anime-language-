# Phase 8CY-C — Repair preview build command quoting

The Phase 8CY-B preview did not reach extraction: its `package.json` build command embedded unescaped double quotes around the Python unittest glob, making package.json invalid JSON. The glob is now single-quoted for the shell, and the complete package manifest was parsed before commit. No source extraction or tests ran in the failed deployment. The next preview must confirm Python unit tests, extraction and concordance output.
