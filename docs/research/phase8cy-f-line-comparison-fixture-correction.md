# Phase 8CY-F — Correct line-comparison regression fixture

The Python suite now imports and executes successfully, but one comparison test failed because its input fixtures contained literal backslash-n characters instead of actual line breaks. The comparison correctly treated each string as one line and returned a replacement. Updated the test to supply real newline-separated lines so the expected inserted-line operation is meaningful. No comparison algorithm change. Next preview must verify all Python tests and the recursive DOCX extraction.
