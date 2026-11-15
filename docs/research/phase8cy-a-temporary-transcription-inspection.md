# Phase 8CY-A — Temporary preview transcription inspection

The initial preview extraction succeeded: the original Phase 4 DOCX was decoded and the SHA-256 of the decoded source bytes matched the archive-recorded digest `c8204667c204227ba474fd0b5245fd66f1ba081565671f5a28cf65efb513eaea`.

The preview build now temporarily prints the generated document-body transcription to its build log, because the generated public asset is not available through the deployment source-file API and the web reader cannot open the preview URL. This is a temporary inspection transport only. It does not change the original source or claim that text boxes, comments, tracked changes, images or layout have been extracted. The next step is to inspect the transcription and then remove the log-dump command from the build script.
