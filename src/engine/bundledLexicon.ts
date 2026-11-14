/**
 * Explicitly versioned bundle of the currently reviewed source CSV files.
 *
 * This makes source vocabulary available to the workbench without network access.
 * It does not declare every row canonical, nor does it enable alias rewriting.
 */
import lexiconCsv from "../../sources/originals/Arcane_Lexicon_v5_draft.csv?raw";
import aliasCsv from "../../sources/originals/Arcane_Alias_Registry_Phase_5_5.csv?raw";
import { loadLexiconCsvText } from "./lexiconCsvLoader";

export const BUNDLED_LEXICON_SOURCE = {
  label: "Arcane_Lexicon_v5_draft.csv",
  gitBlobSha: "2ec3b66ccdcecf517fa236ff06b88f1c5faaed96",
  version: "v5-draft",
  aliasLabel: "Arcane_Alias_Registry_Phase_5_5.csv",
  aliasGitBlobSha: "beb38dabb2c5087119d58add1bd10bfe196d5662",
  aliasVersion: "Phase 5.5 explicit alias registry",
  canonEffect: "none"
} as const;

export const bundledLexiconLoad = loadLexiconCsvText(lexiconCsv, {
  sourceLabel: BUNDLED_LEXICON_SOURCE.label,
  sourceVersion: BUNDLED_LEXICON_SOURCE.version,
  aliasCsvText: aliasCsv
});
