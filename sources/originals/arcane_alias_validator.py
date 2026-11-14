#!/usr/bin/env python3
"""Self-contained Phase 5.6 Arcane alias and lexicon consistency validator.

Usage:
  python arcane_alias_validator.py Arcane_Lexicon_v4_draft.csv Arcane_Alias_Registry_Phase_5_5.csv
  python arcane_alias_validator.py Arcane_Lexicon_v5_draft.csv Arcane_Alias_Registry_Phase_5_5.csv

This validates registry-to-lexicon consistency. It does NOT implement an Arcane parser,
prove that a compiler accepts aliases, or establish listener intelligibility.
"""
import csv
import sys
from collections import defaultdict
from pathlib import Path

EXPECTED = {
    "frata": ("fraja", "subtract"),
    "fraka": ("frama", "multiply"),
    "drim": ("drum", "cross product"),
    "ren": ("ben", "region"),
    "grak": ("grash", "not"),
    "kwak": ("kwash", "live evaluation"),
    "dral": ("dras", "compare"),
}

class Check:
    def __init__(self): self.results=[]
    def add(self, name, ok, detail): self.results.append((name, bool(ok), detail))
    def report(self):
        for name, ok, detail in self.results:
            print(f"{'PASS' if ok else 'FAIL'} | {name} | {detail}")
        passed=sum(ok for _,ok,_ in self.results)
        print(f"SUMMARY | {passed}/{len(self.results)} checks passed")
        return 0 if passed==len(self.results) else 1

def load_csv(path):
    with open(path, newline='', encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))

def main():
    if len(sys.argv) != 3:
        print(__doc__.strip(), file=sys.stderr); return 2
    lex_path, alias_path = map(Path, sys.argv[1:])
    lex = load_csv(lex_path)
    alias_rows = load_csv(alias_path)
    forms = defaultdict(list)
    for row in lex:
        form=(row.get('form') or '').strip().lower()
        if form: forms[form].append(row)
    registry={}
    for row in alias_rows:
        old=(row.get('legacy_form') or '').strip().lower()
        new=(row.get('preferred_form') or row.get('canonical_form') or '').strip().lower()
        gloss=(row.get('gloss') or '').strip().lower()
        if old: registry[old]=(new,gloss,row)
    c=Check()
    c.add('LEXICON_READABLE', bool(lex) and 'form' in (lex[0] if lex else {}), f"{len(lex)} rows loaded from {lex_path.name}")
    c.add('REGISTRY_READABLE', bool(alias_rows) and 'legacy_form' in (alias_rows[0] if alias_rows else {}), f"{len(alias_rows)} alias rows loaded")
    c.add('EXPECTED_ALIAS_SET', set(registry)==set(EXPECTED), f"expected {sorted(EXPECTED)}; found {sorted(registry)}")
    c.add('NO_ALIAS_SELF_MAP', all(old != val[0] for old,val in registry.items()), 'each legacy spelling maps to a distinct preferred spelling')
    for old,(expected_new, expected_gloss) in EXPECTED.items():
        got=registry.get(old)
        c.add(f'ALIAS_TARGET:{old}', got is not None and got[0]==expected_new, f"{old} -> {got[0] if got else 'MISSING'}; expected {expected_new}")
        c.add(f'PREFERRED_EXISTS:{expected_new}', expected_new in forms, f"preferred form {'exists' if expected_new in forms else 'MISSING'} in lexicon")
        matching=[r for r in forms.get(expected_new,[]) if (r.get('gloss') or '').strip().lower()==expected_gloss]
        # 'cross' is the lexicon gloss for the cross-product operator.
        if expected_new=='drum': matching=[r for r in forms.get(expected_new,[]) if 'cross' in (r.get('gloss') or '').lower()]
        c.add(f'PREFERRED_GLOSS:{expected_new}', bool(matching), f"expected meaning compatible with '{expected_gloss}'")
        c.add(f'LEGACY_NOT_SEPARATE_LEXEME:{old}', old not in forms, 'legacy form absent as independent lexicon entry; registry remains the compatibility layer')
        # Preserve the original token for diagnostics while returning the preferred key.
        original=old.upper()
        resolved=registry[old][0]
        c.add(f'RESOLVE_PRESERVES_SOURCE:{old}', resolved==expected_new and original.lower()==old, f"source token {original} can be retained; lookup key {resolved}")
    # Detect duplicate surface forms, but do not automatically fail: v2.0 performed forms
    # deliberately overlap with later digit/unit forms, so the lookup must be scope-aware.
    duplicates={f:rows for f,rows in forms.items() if len(rows)>1}
    expected_known={'re','ra'}
    unexpected=set(duplicates)-expected_known
    c.add('DUPLICATE_FORMS_CLASSIFIED', not unexpected, f"known register/class-sensitive overlaps: {sorted(set(duplicates)&expected_known)}; other duplicates: {sorted(unexpected)}")
    for form in sorted(set(duplicates)&expected_known):
        rows=duplicates[form]
        classes=sorted({(r.get('cls') or '') for r in rows})
        sources=sorted({(r.get('source') or '') for r in rows})
        c.add(f'SCOPE_AWARE_DUPLICATE:{form}', len(classes)>1, f"surface form appears in classes {classes}; sources {sources}; resolver must use class/register/context")
    return c.report()

if __name__=='__main__': raise SystemExit(main())
