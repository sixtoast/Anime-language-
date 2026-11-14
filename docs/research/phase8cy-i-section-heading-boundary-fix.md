# Phase 8CY-I — Restrict section-heading detection

The first subsection-aware probe recognised §§3.1 and 3.2 but also misclassified ordinary prose beginning with numerals (for example, “35 missing roots added”) as a heading. That prematurely truncated section 3.2 and contaminated the top-level section list. The heading parser now requires a period after top-level section numbers and accepts dotted subsection numbers without a final period. This preserves real headings while excluding numbered prose.
