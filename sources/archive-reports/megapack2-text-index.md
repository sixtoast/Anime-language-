# Arcana Mega Pack2 — Searchable Text Index

- Generated (UTC): 2026-10-16T20:24:46.599927+00:00
- Source archive: `docs/Arcana megapack2.zip`
- Unique readable text documents: 253
- Extraction errors or skips: 0

## Scope

This is a search and review aid, not a canon decision. Duplicate byte-identical documents are indexed once; their archive names remain visible in the manifest. Scripts are treated as text and never executed. PDF text is not extracted in this pass.

## arcane_check 2.py

- Type: PY
- SHA-256: `a254ca33662846e2f7f872d6d39d0eaa35da4efda863624fcddc3ea82b817306`
- Extracted characters: 4476

~~~text
"""Static syntax checker for the provisional, line-oriented Arcane subset.

This checker validates block structure and recognises known statement shapes.
It deliberately does not execute programs or claim to be the canonical grammar.
"""
from __future__ import annotations
from dataclasses import dataclass
import re
from pathlib import Path

@dataclass(frozen=True)
class Issue:
    code: str
    message: str
    line: int
    hint: str = ""
    def render(self, filename: str = "<source>") -> str:
        suffix = f" Hint: {self.hint}" if self.hint else ""
        return f"{filename}:{self.line}: error {self.code}: {self.message}{suffix}"

@dataclass(frozen=True)
class Report:
    filename: str
    lines_checked: int
    issues: tuple[Issue, ...]
    @property
    def ok(self) -> bool: return not self.issues
    def render(self) -> str:
        if self.ok: return f"{self.filename}: syntax OK ({self.lines_checked} non-blank, non-comment lines checked)"
        return "\n".join(i.render(self.filename) for i in self.issues)

NAME = r"[A-Za-z_][A-Za-z0-9_]*"
# These forms are intentionally provisional and based on the reconstructed subset.
STATEMENT_PATTERNS = [
    re.compile(rf"KWAM\s+{NAME}\s*=>\s*.+"),
    re.compile(rf"KWAT\s+{NAME}"),
    re.compile(rf"KWAF\s+{NAME}\s*\([^()]*\)\s*=>\s*.+"),
    re.compile(r"KWAR\s+.+\s+FROM\s+.+\s+TO\s+.+\s+=>\s*.+"),
    re.compile(r"KWAS\s+.+\s+FROM\s+.+\s+TO\s+.+\s+=>\s*.+"),
    re.compile(r"KWAI\s+.+\s+THEN\s+.+\s+ELSE\s+.+"),
]

def check_source(source: str, filename: str = "<source>") -> Report:
    issues: list[Issue] = []
    stack: list[tuple[int, bool]] = []  # header line, has ELSE
    checked = 0
    for lineno, raw in enumerate(source.splitlines(), 1):
        text = raw.strip()
        if not text or text.startswith("#"):
            continue
        checked += 1
        if text.startswith("KWAI ") and text.endswith(" THEN"):
            if not text[5:-5].strip():
                issues.append(Issue("ARC-PARSE-001", "conditional condition is empty", lineno, "Add a condition before THEN."))
            stack.append((lineno, False)); continue
        if text == "ELSE":
            if not stack:
                issues.append(Issue("ARC-PARSE-002", "ELSE without an open conditional", lineno, "Add a matching KWAI ... THEN block."))
            elif stack[-1][1]:
                issues.append(Issue("ARC-PARSE-003", "duplicate ELSE in conditional", lineno, "Each conditional can have at most one ELSE."))
            else:
                header, _ = stack[-1]; stack[-1] = (header, True)
            continue
        if text == "END":
            if not stack: issues.append(Issue("ARC-PARSE-004", "END without an open block", lineno, "Remove END or add the matching conditional header."))
            else: stack.pop()
            continue
        if text.startswith("KWAI "):
            issues.append(Issue("ARC-PARSE-005", "malformed conditional header", lineno, "Block form: KWAI condition THEN on its own line.")); continue
        if text.startswith(("ELSE ", "END ")):
            issues.append(Issue("ARC-PARSE-006", "block delimiter must appear alone on its line", lineno)); continue
        if not any(pattern.fullmatch(text) for pattern in STATEMENT_PATTERNS):
            # Inline conditional and ordinary expressions are recognised as expression-like
            # only when they don't resemble a misspelled statement keyword.
            if re.match(r"^KW[A-Z]+\b", text):
                issues.append(Issue("ARC-PARSE-007", "unrecognised or malformed statement", lineno, "Check the keyword and required separators; syntax is provisional."))
            elif not text.startswith("$") and not re.fullmatch(rf"{NAME}\s*\(.*\)|[-+]?\d+(?:\.\d+)?", text):
                issues.append(Issue("ARC-PARSE-008", "unrecognised expression or statement shape", lineno, "Use a supported statement, function call, binding reference or numeric literal."))
    for header_line, has_else in reversed(stack):
        issues.append(Issue("ARC-PARSE-009", "conditional block is missing END", header_line, "Close the block with END."))
    issues.sort(key=lambda issue: issue.line)
    return Report(filename, checked, tuple(issues))

def check_file(path: str | Path) -> Report:
    p = Path(path)
    try: source = p.read_text(encoding="utf-8")
    except OSError as exc: return Report(str(p), 0, (Issue("ARC-IO-001", f"cannot read file: {exc}", 1),))
    return check_source(source, str(p))

~~~

## arcane_check 3.py

- Type: PY
- SHA-256: `24a113f2960900e22a19e2795937de192be9b5e06c92313e0ec2e9a58a38dfc4`
- Extracted characters: 5974

~~~text
"""Static syntax checker for the provisional, line-oriented Arcane subset.

This checker validates block structure and recognises known statement shapes.
It deliberately does not execute programs or claim to be the canonical grammar.
"""
from __future__ import annotations
from dataclasses import dataclass
import re
from pathlib import Path
from arcane_expr import validate_expression, ExpressionSyntaxError

@dataclass(frozen=True)
class Issue:
    code: str
    message: str
    line: int
    hint: str = ""
    def render(self, filename: str = "<source>") -> str:
        suffix = f" Hint: {self.hint}" if self.hint else ""
        return f"{filename}:{self.line}: error {self.code}: {self.message}{suffix}"

@dataclass(frozen=True)
class Report:
    filename: str
    lines_checked: int
    issues: tuple[Issue, ...]
    @property
    def ok(self) -> bool: return not self.issues
    def render(self) -> str:
        if self.ok: return f"{self.filename}: syntax OK ({self.lines_checked} non-blank, non-comment lines checked)"
        return "\n".join(i.render(self.filename) for i in self.issues)

NAME = r"[A-Za-z_][A-Za-z0-9_]*"
# These forms are intentionally provisional and based on the reconstructed subset.
STATEMENT_PATTERNS = [
    re.compile(rf"KWAM\s+{NAME}\s*=>\s*.+"),
    re.compile(rf"KWAT\s+{NAME}"),
    re.compile(rf"KWAF\s+{NAME}\s*\([^()]*\)\s*=>\s*.+"),
    re.compile(r"KWAR\s+.+\s+FROM\s+.+\s+TO\s+.+\s+=>\s*.+"),
    re.compile(r"KWAS\s+.+\s+FROM\s+.+\s+TO\s+.+\s+=>\s*.+"),
    re.compile(r"KWAI\s+.+\s+THEN\s+.+\s+ELSE\s+.+"),
]

def check_source(source: str, filename: str = "<source>") -> Report:
    issues: list[Issue] = []
    stack: list[tuple[int, bool]] = []  # header line, has ELSE
    checked = 0
    for lineno, raw in enumerate(source.splitlines(), 1):
        text = raw.strip()
        if not text or text.startswith("#"):
            continue
        checked += 1
        if text.startswith("KWAI ") and text.endswith(" THEN"):
            condition = text[5:-5].strip()
            if not condition:
                issues.append(Issue("ARC-PARSE-001", "conditional condition is empty", lineno, "Add a condition before THEN."))
            else:
                try: validate_expression(condition)
                except ExpressionSyntaxError as exc: issues.append(Issue("ARC-EXPR-001", str(exc), lineno, "Check operators, operands, and parentheses."))
            stack.append((lineno, False)); continue
        if text == "ELSE":
            if not stack:
                issues.append(Issue("ARC-PARSE-002", "ELSE without an open conditional", lineno, "Add a matching KWAI ... THEN block."))
            elif stack[-1][1]:
                issues.append(Issue("ARC-PARSE-003", "duplicate ELSE in conditional", lineno, "Each conditional can have at most one ELSE."))
            else:
                header, _ = stack[-1]; stack[-1] = (header, True)
            continue
        if text == "END":
            if not stack: issues.append(Issue("ARC-PARSE-004", "END without an open block", lineno, "Remove END or add the matching conditional header."))
            else: stack.pop()
            continue
        if text.startswith("KWAI "):
            issues.append(Issue("ARC-PARSE-005", "malformed conditional header", lineno, "Block form: KWAI condition THEN on its own line.")); continue
        if text.startswith(("ELSE ", "END ")):
            issues.append(Issue("ARC-PARSE-006", "block delimiter must appear alone on its line", lineno)); continue
        matched = next((pattern for pattern in STATEMENT_PATTERNS if pattern.fullmatch(text)), None)
        if matched:
            rhs = None
            if text.startswith("KWAM "): rhs = text.split("=>", 1)[1].strip()
            elif text.startswith("KWAF "): rhs = text.split("=>", 1)[1].strip()
            elif text.startswith("KWAT "): rhs = "$" + text.split(None, 1)[1].strip()
            elif text.startswith(("KWAR ", "KWAS ")): rhs = text.split("=>", 1)[1].strip()
            elif text.startswith("KWAI "):
                inline = re.fullmatch(r"KWAI\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+)", text)
                if inline:
                    for expression in inline.groups():
                        try: validate_expression(expression)
                        except ExpressionSyntaxError as exc: issues.append(Issue("ARC-EXPR-001", str(exc), lineno, "Check operators, operands, and parentheses."))
            if rhs is not None:
                try: validate_expression(rhs)
                except ExpressionSyntaxError as exc: issues.append(Issue("ARC-EXPR-001", str(exc), lineno, "Check operators, operands, and parentheses."))
            continue
        if not any(pattern.fullmatch(text) for pattern in STATEMENT_PATTERNS):
            # Inline conditional and ordinary expressions are recognised as expression-like
            # only when they don't resemble a misspelled statement keyword.
            if re.match(r"^KW[A-Z]+\b", text):
                issues.append(Issue("ARC-PARSE-007", "unrecognised or malformed statement", lineno, "Check the keyword and required separators; syntax is provisional."))
            elif not text.startswith("$") and not re.fullmatch(rf"{NAME}\s*\(.*\)|[-+]?\d+(?:\.\d+)?", text):
                issues.append(Issue("ARC-PARSE-008", "unrecognised expression or statement shape", lineno, "Use a supported statement, function call, binding reference or numeric literal."))
    for header_line, has_else in reversed(stack):
        issues.append(Issue("ARC-PARSE-009", "conditional block is missing END", header_line, "Close the block with END."))
    issues.sort(key=lambda issue: issue.line)
    return Report(filename, checked, tuple(issues))

def check_file(path: str | Path) -> Report:
    p = Path(path)
    try: source = p.read_text(encoding="utf-8")
    except OSError as exc: return Report(str(p), 0, (Issue("ARC-IO-001", f"cannot read file: {exc}", 1),))
    return check_source(source, str(p))

~~~

## arcane_check 4.py

- Type: PY
- SHA-256: `24a113f2960900e22a19e2795937de192be9b5e06c92313e0ec2e9a58a38dfc4`
- Extracted characters: 5974

~~~text
"""Static syntax checker for the provisional, line-oriented Arcane subset.

This checker validates block structure and recognises known statement shapes.
It deliberately does not execute programs or claim to be the canonical grammar.
"""
from __future__ import annotations
from dataclasses import dataclass
import re
from pathlib import Path
from arcane_expr import validate_expression, ExpressionSyntaxError

@dataclass(frozen=True)
class Issue:
    code: str
    message: str
    line: int
    hint: str = ""
    def render(self, filename: str = "<source>") -> str:
        suffix = f" Hint: {self.hint}" if self.hint else ""
        return f"{filename}:{self.line}: error {self.code}: {self.message}{suffix}"

@dataclass(frozen=True)
class Report:
    filename: str
    lines_checked: int
    issues: tuple[Issue, ...]
    @property
    def ok(self) -> bool: return not self.issues
    def render(self) -> str:
        if self.ok: return f"{self.filename}: syntax OK ({self.lines_checked} non-blank, non-comment lines checked)"
        return "\n".join(i.render(self.filename) for i in self.issues)

NAME = r"[A-Za-z_][A-Za-z0-9_]*"
# These forms are intentionally provisional and based on the reconstructed subset.
STATEMENT_PATTERNS = [
    re.compile(rf"KWAM\s+{NAME}\s*=>\s*.+"),
    re.compile(rf"KWAT\s+{NAME}"),
    re.compile(rf"KWAF\s+{NAME}\s*\([^()]*\)\s*=>\s*.+"),
    re.compile(r"KWAR\s+.+\s+FROM\s+.+\s+TO\s+.+\s+=>\s*.+"),
    re.compile(r"KWAS\s+.+\s+FROM\s+.+\s+TO\s+.+\s+=>\s*.+"),
    re.compile(r"KWAI\s+.+\s+THEN\s+.+\s+ELSE\s+.+"),
]

def check_source(source: str, filename: str = "<source>") -> Report:
    issues: list[Issue] = []
    stack: list[tuple[int, bool]] = []  # header line, has ELSE
    checked = 0
    for lineno, raw in enumerate(source.splitlines(), 1):
        text = raw.strip()
        if not text or text.startswith("#"):
            continue
        checked += 1
        if text.startswith("KWAI ") and text.endswith(" THEN"):
            condition = text[5:-5].strip()
            if not condition:
                issues.append(Issue("ARC-PARSE-001", "conditional condition is empty", lineno, "Add a condition before THEN."))
            else:
                try: validate_expression(condition)
                except ExpressionSyntaxError as exc: issues.append(Issue("ARC-EXPR-001", str(exc), lineno, "Check operators, operands, and parentheses."))
            stack.append((lineno, False)); continue
        if text == "ELSE":
            if not stack:
                issues.append(Issue("ARC-PARSE-002", "ELSE without an open conditional", lineno, "Add a matching KWAI ... THEN block."))
            elif stack[-1][1]:
                issues.append(Issue("ARC-PARSE-003", "duplicate ELSE in conditional", lineno, "Each conditional can have at most one ELSE."))
            else:
                header, _ = stack[-1]; stack[-1] = (header, True)
            continue
        if text == "END":
            if not stack: issues.append(Issue("ARC-PARSE-004", "END without an open block", lineno, "Remove END or add the matching conditional header."))
            else: stack.pop()
            continue
        if text.startswith("KWAI "):
            issues.append(Issue("ARC-PARSE-005", "malformed conditional header", lineno, "Block form: KWAI condition THEN on its own line.")); continue
        if text.startswith(("ELSE ", "END ")):
            issues.append(Issue("ARC-PARSE-006", "block delimiter must appear alone on its line", lineno)); continue
        matched = next((pattern for pattern in STATEMENT_PATTERNS if pattern.fullmatch(text)), None)
        if matched:
            rhs = None
            if text.startswith("KWAM "): rhs = text.split("=>", 1)[1].strip()
            elif text.startswith("KWAF "): rhs = text.split("=>", 1)[1].strip()
            elif text.startswith("KWAT "): rhs = "$" + text.split(None, 1)[1].strip()
            elif text.startswith(("KWAR ", "KWAS ")): rhs = text.split("=>", 1)[1].strip()
            elif text.startswith("KWAI "):
                inline = re.fullmatch(r"KWAI\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+)", text)
                if inline:
                    for expression in inline.groups():
                        try: validate_expression(expression)
                        except ExpressionSyntaxError as exc: issues.append(Issue("ARC-EXPR-001", str(exc), lineno, "Check operators, operands, and parentheses."))
            if rhs is not None:
                try: validate_expression(rhs)
                except ExpressionSyntaxError as exc: issues.append(Issue("ARC-EXPR-001", str(exc), lineno, "Check operators, operands, and parentheses."))
            continue
        if not any(pattern.fullmatch(text) for pattern in STATEMENT_PATTERNS):
            # Inline conditional and ordinary expressions are recognised as expression-like
            # only when they don't resemble a misspelled statement keyword.
            if re.match(r"^KW[A-Z]+\b", text):
                issues.append(Issue("ARC-PARSE-007", "unrecognised or malformed statement", lineno, "Check the keyword and required separators; syntax is provisional."))
            elif not text.startswith("$") and not re.fullmatch(rf"{NAME}\s*\(.*\)|[-+]?\d+(?:\.\d+)?", text):
                issues.append(Issue("ARC-PARSE-008", "unrecognised expression or statement shape", lineno, "Use a supported statement, function call, binding reference or numeric literal."))
    for header_line, has_else in reversed(stack):
        issues.append(Issue("ARC-PARSE-009", "conditional block is missing END", header_line, "Close the block with END."))
    issues.sort(key=lambda issue: issue.line)
    return Report(filename, checked, tuple(issues))

def check_file(path: str | Path) -> Report:
    p = Path(path)
    try: source = p.read_text(encoding="utf-8")
    except OSError as exc: return Report(str(p), 0, (Issue("ARC-IO-001", f"cannot read file: {exc}", 1),))
    return check_source(source, str(p))

~~~

## arcane_check 5.py

- Type: PY
- SHA-256: `017d19a251dd4f37b541cbed5aa9df876600b1ffbb93e04359d6d84fec80b7d1`
- Extracted characters: 1776

~~~text
"""Static structural checks for the executable provisional subset."""
import re
from dataclasses import dataclass
from pathlib import Path
@dataclass(frozen=True)
class Issue:
    code:str; message:str; line:int
    def render(self,filename='<source>'): return f'{filename}:{self.line}: error {self.code}: {self.message}'
@dataclass(frozen=True)
class Report:
    filename:str; issues:tuple; checked:int
    @property
    def ok(self): return not self.issues
    def render(self): return f'{self.filename}: syntax OK ({self.checked} lines checked)' if self.ok else '\n'.join(x.render(self.filename) for x in self.issues)
def check_source(src,filename='<source>'):
    stack=[]; issues=[]; checked=0
    for n,raw in enumerate(src.splitlines(),1):
        s=raw.strip()
        if not s or s.startswith('#'): continue
        checked+=1
        if re.fullmatch(r'KWAI\s+.+\s+THEN',s): stack.append(n)
        elif s=='ELSE':
            if not stack: issues.append(Issue('ARC-PARSE-002','ELSE without open conditional',n))
        elif s=='END':
            if not stack: issues.append(Issue('ARC-PARSE-002','END without open conditional',n))
            else: stack.pop()
        elif s.startswith('KWAI '): issues.append(Issue('ARC-PARSE-003','malformed conditional header',n))
        elif not (s.startswith('KWAM ') or s.startswith('KWAF ') or s.startswith('KWAT ')):
            issues.append(Issue('ARC-PARSE-004','unsupported statement shape',n))
    for n in stack: issues.append(Issue('ARC-PARSE-001','conditional missing END',n))
    return Report(filename,tuple(issues),checked)
def check_file(path):
    p=Path(path)
    try: return check_source(p.read_text(encoding='utf-8'),str(p))
    except OSError as e: return Report(str(p),(Issue('ARC-IO-001',str(e),1),),0)

~~~

## arcane_check 6.py

- Type: PY
- SHA-256: `c1a0099abc89ccf846165a08ca9d17b07311d3af6d6ebc7a5271427deb5026f7`
- Extracted characters: 1223

~~~text
"""Static syntax checks using the same parser as the runtime."""
from dataclasses import dataclass
from pathlib import Path
from arcane_runtime import ArcaneFailure, parse_program

@dataclass(frozen=True)
class Issue:
    code: str
    message: str
    line: int
    def render(self, filename='<source>'):
        return f'{filename}:{self.line}: error {self.code}: {self.message}'

@dataclass(frozen=True)
class Report:
    filename: str
    issues: tuple
    checked: int
    @property
    def ok(self): return not self.issues
    def render(self):
        return f'{self.filename}: syntax OK ({self.checked} lines checked)' if self.ok else '\n'.join(x.render(self.filename) for x in self.issues)

def check_source(src, filename='<source>'):
    checked=sum(1 for raw in src.splitlines() if raw.strip() and not raw.strip().startswith('#'))
    try:
        _, parsed=parse_program(src)
        return Report(filename,(),parsed)
    except ArcaneFailure as e:
        return Report(filename,(Issue(e.code,e.message,e.line),),checked)

def check_file(path):
    p=Path(path)
    try: return check_source(p.read_text(encoding='utf-8'),str(p))
    except OSError as e: return Report(str(p),(Issue('ARC-IO-001',str(e),1),),0)

~~~

## arcane_check.py

- Type: PY
- SHA-256: `06a7d0c6379a17713d998854e07ef10e708822e37b8be54f7e26eb1bba9b38d6`
- Extracted characters: 1083

~~~text
from dataclasses import dataclass
from pathlib import Path
from arcane_runtime import ArcaneFailure,parse_program
@dataclass(frozen=True)
class Issue:
    code:str; message:str; line:int
    def render(self,filename="<source>"): return f"{filename}:{self.line}: error {self.code}: {self.message}"
@dataclass(frozen=True)
class Report:
    filename:str; issues:tuple; checked:int
    @property
    def ok(self): return not self.issues
    def render(self): return f"{self.filename}: syntax OK ({self.checked} lines checked)" if self.ok else "\n".join(i.render(self.filename) for i in self.issues)
def check_source(source,filename="<source>"):
    checked=sum(1 for x in source.splitlines() if x.strip() and not x.strip().startswith("#"))
    try: _,n=parse_program(source); return Report(filename,(),n)
    except ArcaneFailure as e:return Report(filename,(Issue(e.code,e.message,e.line),),checked)
def check_file(path):
    p=Path(path)
    try:return check_source(p.read_text(encoding="utf-8"),str(p))
    except OSError as e:return Report(str(p),(Issue("ARC-IO-001",str(e),1),),0)

~~~

## arcane_cli 10.py

- Type: PY
- SHA-256: `fbe15912256199ad9328911bd196ab792514749635d0c1720bb0bde159865607`
- Extracted characters: 1096

~~~text
"""Arcane static checker CLI: syntax and provisional semantic validation; never executes."""
import argparse
from arcane_check import check_file
from arcane_semantic import analyze_file

def main():
    parser = argparse.ArgumentParser(description="Check syntax and semantics in the provisional Arcane subset")
    parser.add_argument("file", help="Arcane source file (.arc)")
    parser.add_argument("--syntax-only", action="store_true", help="run syntax checks only")
    parser.add_argument("--semantic-only", action="store_true", help="run semantic checks only (syntax should already be valid)")
    args = parser.parse_args()
    if args.syntax_only and args.semantic_only:
        parser.error("--syntax-only and --semantic-only cannot be used together")
    reports = []
    if not args.semantic_only:
        reports.append(check_file(args.file))
    if not args.syntax_only:
        reports.append(analyze_file(args.file))
    for report in reports:
        print(report.render())
    raise SystemExit(0 if all(report.ok for report in reports) else 1)

if __name__ == "__main__": main()

~~~

## arcane_cli 11.py

- Type: PY
- SHA-256: `51b1c7c326720967a67977e8508d560c54a38056f86c5f645fe3a54af395850d`
- Extracted characters: 1205

~~~text
"""Command-line interface for the minimal provisional Arcane runtime."""
import argparse
from pathlib import Path
from arcane_runtime import ArcaneRuntime, Diagnostic
from arcane_check import check_file
from arcane_semantic import analyze_file

def main():
    p=argparse.ArgumentParser(description='Check or run a provisional Arcane source file')
    p.add_argument('file',help='source file (.arc)')
    mode=p.add_mutually_exclusive_group()
    mode.add_argument('--check',action='store_true',help='run static syntax and semantic checks (default)')
    mode.add_argument('--run',action='store_true',help='run the supported executable subset')
    args=p.parse_args()
    if not args.run:
        reports=[check_file(args.file),analyze_file(args.file)]
        for r in reports: print(r.render())
        raise SystemExit(0 if all(r.ok for r in reports) else 1)
    try: source=Path(args.file).read_text(encoding='utf-8')
    except OSError as e: p.error(f'cannot read {args.file}: {e}')
    rt=ArcaneRuntime(); result=rt.run_program(source)
    if isinstance(result,Diagnostic): print(result.render(args.file)); raise SystemExit(1)
    for value in result: print(value)

if __name__=='__main__': main()

~~~

## arcane_cli 12.py

- Type: PY
- SHA-256: `9fff0c2587268530d60f34db0e2098457f11496972bb038e090563b9032844d0`
- Extracted characters: 1496

~~~text
"""Command-line interface for the minimal provisional Arcane runtime."""
import argparse
from pathlib import Path
from arcane_runtime import ArcaneRuntime, Diagnostic
from arcane_check import check_file
from arcane_semantic import analyze_file

def main():
    p=argparse.ArgumentParser(description='Check or run a provisional Arcane source file')
    p.add_argument('file',help='source file (.arc)')
    mode=p.add_mutually_exclusive_group()
    mode.add_argument('--check',action='store_true',help='run static syntax and semantic checks (default)')
    mode.add_argument('--run',action='store_true',help='run the supported executable subset')
    args=p.parse_args()
    if not args.run:
        reports=[check_file(args.file),analyze_file(args.file)]
        for r in reports: print(r.render())
        raise SystemExit(0 if all(r.ok for r in reports) else 1)
    try: source=Path(args.file).read_text(encoding='utf-8')
    except OSError as e: p.error(f'cannot read {args.file}: {e}')
    # Never execute a program that already has statically detectable errors.
    syntax=check_file(args.file); semantic=analyze_file(args.file)
    for report in (syntax,semantic):
        if not report.ok: print(report.render())
    if not syntax.ok or not semantic.ok: raise SystemExit(1)
    rt=ArcaneRuntime(); result=rt.run_program(source)
    if isinstance(result,Diagnostic): print(result.render(args.file)); raise SystemExit(1)
    for value in result: print(value)

if __name__=='__main__': main()

~~~

## arcane_cli 2.py

- Type: PY
- SHA-256: `198415d0b05fe4fc0ab390f9a7da44002adbc445dba800e1d08bfe251e5cb1a1`
- Extracted characters: 1353

~~~text
"""Minimal interactive shell for the Phase 7L Arcane runtime subset."""
from arcane_runtime import ArcaneRuntime, Quantity
from arcane_diagnostics import ArcaneDiagnosticError

def show(value):
    if isinstance(value, Quantity):
        dims = value.dimensions
        unit = ' dimensionless' if not dims else f' dimensions={dims}'
        return f'{value.value:g}{unit}'
    return repr(value)

def main():
    runtime = ArcaneRuntime()
    print('Arcane Phase 7L subset. Type :quit to exit; :help for examples.')
    while True:
        try: line = input('arcane> ').strip()
        except (EOFError, KeyboardInterrupt):
            print(); break
        if not line: continue
        if line == ':quit': break
        if line == ':help':
            print('Examples: FRAPA 2 3 | FRATA m s | KWAM total => FRAPA 2 3 | KWAT total')
            continue
        try:
            result = runtime.run_line(line)
            if hasattr(result, 'render') and hasattr(result, 'diagnostic'):
                print(result.render())
            elif hasattr(result, 'code') and hasattr(result, 'message'):
                print(result.render())
            else: print(show(result))
        except ArcaneDiagnosticError as exc: print(exc.diagnostic.render())
        except Exception as exc: print(f'Runtime error: {exc}')

if __name__ == '__main__': main()

~~~

## arcane_cli 3.py

- Type: PY
- SHA-256: `0cdccfed1fba6713d871ad5ef046da3e135b3f87f0a9fee9c1566e6408a5e154`
- Extracted characters: 1476

~~~text
"""Minimal interactive shell for the Phase 7L Arcane runtime subset."""
from arcane_runtime import ArcaneRuntime, Quantity
from arcane_diagnostics import ArcaneDiagnosticError

def show(value):
    if isinstance(value, Quantity):
        dims = value.dimensions
        unit = ' dimensionless' if not dims else f' dimensions={dims}'
        return f'{value.value:g}{unit}'
    return repr(value)

def main():
    runtime = ArcaneRuntime()
    print('Arcane Phase 7L subset. Type :quit to exit; :help for examples.')
    while True:
        try: line = input('arcane> ').strip()
        except (EOFError, KeyboardInterrupt):
            print(); break
        if not line: continue
        if line == ':quit': break
        if line == ':help':
            print('Examples: FRAPA 2 3 | FRATA m s | KWAM total => FRAPA 2 3 | KWAT total')
            print('Loops: KWAR i FROM 1 TO 3 => FRATA $i $i')
            print('Sum:   KWAS total FROM 1 TO 5 => $total')
            continue
        try:
            result = runtime.run_line(line)
            if hasattr(result, 'render') and hasattr(result, 'diagnostic'):
                print(result.render())
            elif hasattr(result, 'code') and hasattr(result, 'message'):
                print(result.render())
            else: print(show(result))
        except ArcaneDiagnosticError as exc: print(exc.diagnostic.render())
        except Exception as exc: print(f'Runtime error: {exc}')

if __name__ == '__main__': main()

~~~

## arcane_cli 4.py

- Type: PY
- SHA-256: `751f4075236b8a31a2e3b69214ecf8a3de3f3222a31a6d40b00226d91ad44667`
- Extracted characters: 864

~~~text
from arcane_runtime import ArcaneRuntime, ArcaneError, show

def main():
    r=ArcaneRuntime()
    print('Arcane Phase 7N subset — :help for examples, :quit to exit')
    while True:
        try: line=input('arcane> ').strip()
        except (EOFError,KeyboardInterrupt): print(); break
        if not line: continue
        if line==':quit': break
        if line==':help':
            print('KWAF square(x) => FRATA $x $x')
            print('square(4)')
            print('KWAR i FROM 1 TO 3 => square($i)')
            print('KWAS total FROM 1 TO 5 => $total')
            continue
        result=r.run_line(line)
        if hasattr(result,'render') and hasattr(result,'code'): print(result.render())
        elif hasattr(result,'render') and hasattr(result,'message'): print(result.render())
        else: print(show(result))

if __name__=='__main__': main()

~~~

## arcane_cli 5.py

- Type: PY
- SHA-256: `652cf44aad54a9d717fb38f0d24bbae40a99b4a70771b03163155720b1ac2a56`
- Extracted characters: 1003

~~~text
from arcane_runtime import ArcaneRuntime, ArcaneError, show

def main():
    r=ArcaneRuntime()
    print('Arcane Phase 7O subset — :help for examples, :quit to exit')
    while True:
        try: line=input('arcane> ').strip()
        except (EOFError,KeyboardInterrupt): print(); break
        if not line: continue
        if line==':quit': break
        if line==':help':
            print('KWAF square(x) => FRATA $x $x')
            print('square(4)')
            print('KWAR i FROM 1 TO 3 => square($i)')
            print('KWAS total FROM 1 TO 5 => $total')
            print('KWAI FRAGT 5 3 THEN FRAPA 10 2 ELSE 0')
            print('Multi-line programs: use ArcaneRuntime.run_program(source)')
            continue
        result=r.run_line(line)
        if hasattr(result,'render') and hasattr(result,'code'): print(result.render())
        elif hasattr(result,'render') and hasattr(result,'message'): print(result.render())
        else: print(show(result))

if __name__=='__main__': main()

~~~

## arcane_cli 6.py

- Type: PY
- SHA-256: `36122e6559fdcfe9fd9ebcd460d86b837b22398a7aa2db00850c4b7ec4b51742`
- Extracted characters: 1150

~~~text
from arcane_runtime import ArcaneRuntime, ArcaneError, show

def main():
    r=ArcaneRuntime()
    print('Arcane Phase 7O subset — :help for examples, :quit to exit')
    while True:
        try: line=input('arcane> ').strip()
        except (EOFError,KeyboardInterrupt): print(); break
        if not line: continue
        if line==':quit': break
        if line==':help':
            print('KWAF square(x) => FRATA $x $x')
            print('square(4)')
            print('KWAR i FROM 1 TO 3 => square($i)')
            print('KWAS total FROM 1 TO 5 => $total')
            print('KWAI FRAGT 5 3 THEN FRAPA 10 2 ELSE 0')
            print('Structured blocks:\nKWAI FRAGT 5 3 THEN\n  KWAM answer => 42\n  KWAT answer\nELSE\n  KWAM answer => 0\nEND')
            print('Block programs: use ArcaneRuntime.run_program(source); close blocks with END.')
            continue
        result=r.run_line(line)
        if hasattr(result,'render') and hasattr(result,'code'): print(result.render())
        elif hasattr(result,'render') and hasattr(result,'message'): print(result.render())
        else: print(show(result))

if __name__=='__main__': main()

~~~

## arcane_cli 7.py

- Type: PY
- SHA-256: `04ebbcc6a28c52f9629d21b18400d81e5141e7e79a246975272aec5156ff588f`
- Extracted characters: 1838

~~~text
"""Arcane provisional-subset CLI: interactive mode or execute a source file."""
import argparse
from pathlib import Path
from arcane_runtime import ArcaneRuntime, ArcaneError, Diagnostic, show


def display(result):
    if isinstance(result, Diagnostic):
        print(result.render())
    elif isinstance(result, list):
        for item in result:
            print(show(item))
    else:
        print(show(result))


def main():
    parser = argparse.ArgumentParser(description='Run the provisional Arcane language subset')
    parser.add_argument('file', nargs='?', help='Arcane source file to execute')
    args = parser.parse_args()
    runtime = ArcaneRuntime()
    if args.file:
        path = Path(args.file)
        try:
            source = path.read_text(encoding='utf-8')
        except OSError as error:
            parser.error(f'cannot read {path}: {error}')
        result = runtime.run_program(source)
        display(result)
        raise SystemExit(1 if isinstance(result, Diagnostic) else 0)

    print('Arcane Phase 7Q subset — :help for examples, :quit to exit')
    while True:
        try:
            line = input('arcane> ').strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not line:
            continue
        if line == ':quit':
            break
        if line == ':help':
            print('KWAF square(x) => FRATA $x $x')
            print('square(4)')
            print('KWAM width => 4; KWAM height => 3; FRATA $width $height')
            print('For multi-line blocks and programs, save source to a file and run: python arcane_cli.py program.arc')
            print('Block syntax: KWAI condition THEN, optional ELSE, and END on separate lines.')
            continue
        display(runtime.run_line(line))


if __name__ == '__main__':
    main()

~~~

## arcane_cli 8.py

- Type: PY
- SHA-256: `b625ad9bb8571d9c684c917690000f1fb3e0347bf42d408ca0a0f439b8478847`
- Extracted characters: 583

~~~text
"""Arcane Phase 7R static checker CLI. This does not execute programs."""
import argparse
from arcane_check import check_file

def main():
    parser = argparse.ArgumentParser(description="Check syntax in the provisional Arcane subset")
    parser.add_argument("file", help="Arcane source file (.arc)")
    parser.add_argument("--check", action="store_true", help="check syntax only (the only supported mode)")
    args = parser.parse_args()
    report = check_file(args.file)
    print(report.render())
    raise SystemExit(0 if report.ok else 1)

if __name__ == "__main__": main()

~~~

## arcane_cli 9.py

- Type: PY
- SHA-256: `b625ad9bb8571d9c684c917690000f1fb3e0347bf42d408ca0a0f439b8478847`
- Extracted characters: 583

~~~text
"""Arcane Phase 7R static checker CLI. This does not execute programs."""
import argparse
from arcane_check import check_file

def main():
    parser = argparse.ArgumentParser(description="Check syntax in the provisional Arcane subset")
    parser.add_argument("file", help="Arcane source file (.arc)")
    parser.add_argument("--check", action="store_true", help="check syntax only (the only supported mode)")
    args = parser.parse_args()
    report = check_file(args.file)
    print(report.render())
    raise SystemExit(0 if report.ok else 1)

if __name__ == "__main__": main()

~~~

## arcane_cli.py

- Type: PY
- SHA-256: `a6fbdc40ed96eaf497c2c4b3aedc6c68e2262c2b9668fc418a29a52f38b3bc14`
- Extracted characters: 1072

~~~text
import argparse
from pathlib import Path
from arcane_check import check_file
from arcane_semantic import analyze_file
from arcane_runtime import ArcaneRuntime,Diagnostic
def main():
    p=argparse.ArgumentParser(description="Arcane provisional interpreter")
    p.add_argument("file"); g=p.add_mutually_exclusive_group()
    g.add_argument("--check",action="store_true"); g.add_argument("--run",action="store_true")
    a=p.parse_args(); syntax=check_file(a.file); sem=analyze_file(a.file)
    if not a.run:
        print(syntax.render()); print(sem.render())
        raise SystemExit(0 if syntax.ok and sem.ok else 1)
    for r in (syntax,sem):
        if not r.ok: print(r.render())
    if not syntax.ok or not sem.ok: raise SystemExit(1)
    try: source=Path(a.file).read_text(encoding="utf-8")
    except OSError as e: print(f"error ARC-IO-001: {e}"); raise SystemExit(1)
    result=ArcaneRuntime().run_program(source)
    if isinstance(result,Diagnostic): print(result.render(a.file)); raise SystemExit(1)
    for x in result: print(x)
if __name__=="__main__":main()

~~~

## Arcane_Decision_Ledger 2.docx

- Type: DOCX TEXT
- SHA-256: `6405755b51cdcf44a4c99e8dbc9f433f5925bcb6a6d6a489422065cd20419def`
- Extracted characters: 1497

~~~text
ARCANE — DECISION LEDGER
Continuity register | proposals are not canon unless accepted
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Current decisions
D-001 CANON: Arcane is a human-designed control language.
D-002 CANON: language ≠ spell ≠ mana.
D-003 CANON: surface syntax HEAD + ARGUMENTS + MODIFIERS; scope details incomplete.
D-004 CANON: spell representation HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL; mapping to surface syntax required.
D-005 CANON: executable expressions must have one recoverable parse.
D-006 UNRESOLVED: recover exact v2.0 frame–vowel–coda morphology before integrating or retiring it.
D-007 UNRECOVERED: exact definitions and examples for h coupling, MEL anchoring, KAN/KEN/KAS.
D-008 PROPOSAL: define operator-specific signatures and test against existing examples.
D-009 PROPOSAL: formalise grouping and modifier scope.
D-010 CROSS-SPEC GAP: reconcile KREN/TRAK/FREM/SHREN/BRAN/VARE with v3.0-L vocabulary.
D-011 CANON: CREATE is not a physical primitive; KWAM creates a binding only.
D-012 GAP: specify Logos substrate, memory, energy and interface costs.
D-013 UNVERIFIED: vocabulary completion percentages need measurable coverage criteria.
Change record template
Decision ID:
Existing rule and source:
Concrete defect or gap:
Options considered:
Tests and results:
Decision: ACCEPT / REJECT / PROVISIONAL / UNRESOLVED
Date and rationale:
~~~

## Arcane_Decision_Ledger 3.docx

- Type: DOCX TEXT
- SHA-256: `6405755b51cdcf44a4c99e8dbc9f433f5925bcb6a6d6a489422065cd20419def`
- Extracted characters: 1497

~~~text
ARCANE — DECISION LEDGER
Continuity register | proposals are not canon unless accepted
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Current decisions
D-001 CANON: Arcane is a human-designed control language.
D-002 CANON: language ≠ spell ≠ mana.
D-003 CANON: surface syntax HEAD + ARGUMENTS + MODIFIERS; scope details incomplete.
D-004 CANON: spell representation HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL; mapping to surface syntax required.
D-005 CANON: executable expressions must have one recoverable parse.
D-006 UNRESOLVED: recover exact v2.0 frame–vowel–coda morphology before integrating or retiring it.
D-007 UNRECOVERED: exact definitions and examples for h coupling, MEL anchoring, KAN/KEN/KAS.
D-008 PROPOSAL: define operator-specific signatures and test against existing examples.
D-009 PROPOSAL: formalise grouping and modifier scope.
D-010 CROSS-SPEC GAP: reconcile KREN/TRAK/FREM/SHREN/BRAN/VARE with v3.0-L vocabulary.
D-011 CANON: CREATE is not a physical primitive; KWAM creates a binding only.
D-012 GAP: specify Logos substrate, memory, energy and interface costs.
D-013 UNVERIFIED: vocabulary completion percentages need measurable coverage criteria.
Change record template
Decision ID:
Existing rule and source:
Concrete defect or gap:
Options considered:
Tests and results:
Decision: ACCEPT / REJECT / PROVISIONAL / UNRESOLVED
Date and rationale:
~~~

## Arcane_Decision_Ledger 4.docx

- Type: DOCX TEXT
- SHA-256: `6405755b51cdcf44a4c99e8dbc9f433f5925bcb6a6d6a489422065cd20419def`
- Extracted characters: 1497

~~~text
ARCANE — DECISION LEDGER
Continuity register | proposals are not canon unless accepted
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Current decisions
D-001 CANON: Arcane is a human-designed control language.
D-002 CANON: language ≠ spell ≠ mana.
D-003 CANON: surface syntax HEAD + ARGUMENTS + MODIFIERS; scope details incomplete.
D-004 CANON: spell representation HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL; mapping to surface syntax required.
D-005 CANON: executable expressions must have one recoverable parse.
D-006 UNRESOLVED: recover exact v2.0 frame–vowel–coda morphology before integrating or retiring it.
D-007 UNRECOVERED: exact definitions and examples for h coupling, MEL anchoring, KAN/KEN/KAS.
D-008 PROPOSAL: define operator-specific signatures and test against existing examples.
D-009 PROPOSAL: formalise grouping and modifier scope.
D-010 CROSS-SPEC GAP: reconcile KREN/TRAK/FREM/SHREN/BRAN/VARE with v3.0-L vocabulary.
D-011 CANON: CREATE is not a physical primitive; KWAM creates a binding only.
D-012 GAP: specify Logos substrate, memory, energy and interface costs.
D-013 UNVERIFIED: vocabulary completion percentages need measurable coverage criteria.
Change record template
Decision ID:
Existing rule and source:
Concrete defect or gap:
Options considered:
Tests and results:
Decision: ACCEPT / REJECT / PROVISIONAL / UNRESOLVED
Date and rationale:
~~~

## Arcane_Decision_Ledger.docx

- Type: DOCX TEXT
- SHA-256: `6405755b51cdcf44a4c99e8dbc9f433f5925bcb6a6d6a489422065cd20419def`
- Extracted characters: 1497

~~~text
ARCANE — DECISION LEDGER
Continuity register | proposals are not canon unless accepted
RECOVERY DRAFT — compiled from canonical specifications and project context available in this conversation. This is not a complete archive of every historical chat.
Current decisions
D-001 CANON: Arcane is a human-designed control language.
D-002 CANON: language ≠ spell ≠ mana.
D-003 CANON: surface syntax HEAD + ARGUMENTS + MODIFIERS; scope details incomplete.
D-004 CANON: spell representation HEAD + CORE + PARAMETERS + CONSTRAINTS + CONTROL; mapping to surface syntax required.
D-005 CANON: executable expressions must have one recoverable parse.
D-006 UNRESOLVED: recover exact v2.0 frame–vowel–coda morphology before integrating or retiring it.
D-007 UNRECOVERED: exact definitions and examples for h coupling, MEL anchoring, KAN/KEN/KAS.
D-008 PROPOSAL: define operator-specific signatures and test against existing examples.
D-009 PROPOSAL: formalise grouping and modifier scope.
D-010 CROSS-SPEC GAP: reconcile KREN/TRAK/FREM/SHREN/BRAN/VARE with v3.0-L vocabulary.
D-011 CANON: CREATE is not a physical primitive; KWAM creates a binding only.
D-012 GAP: specify Logos substrate, memory, energy and interface costs.
D-013 UNVERIFIED: vocabulary completion percentages need measurable coverage criteria.
Change record template
Decision ID:
Existing rule and source:
Concrete defect or gap:
Options considered:
Tests and results:
Decision: ACCEPT / REJECT / PROVISIONAL / UNRESOLVED
Date and rationale:
~~~

## arcane_diagnostics 2.py

- Type: PY
- SHA-256: `cb3eb48481a86f632d911a5757cca591cf589137f2b2647dc17a2a11d1b8b979`
- Extracted characters: 5185

~~~text
"""Phase 7J: stable diagnostics and result typing utilities for Arcane tooling.

This module is deliberately independent of a particular evaluator implementation so
it can be integrated without changing the semantics of the provisional runtime.
"""
from dataclasses import dataclass
from enum import Enum
from typing import Any, Optional

class ErrorCode(str, Enum):
    PARSE_ERROR = 'ARC-PARSE-001'
    UNKNOWN_NAME = 'ARC-NAME-001'
    DUPLICATE_BINDING = 'ARC-NAME-002'
    TYPE_MISMATCH = 'ARC-TYPE-001'
    DIMENSION_MISMATCH = 'ARC-UNIT-001'
    INVALID_BOUNDS = 'ARC-LOOP-001'
    ITERATION_LIMIT = 'ARC-LOOP-002'
    DIVISION_BY_ZERO = 'ARC-MATH-001'
    CALL_DEPTH = 'ARC-RUNTIME-001'
    INTERNAL_ERROR = 'ARC-RUNTIME-999'

@dataclass(frozen=True)
class SourceSpan:
    line: int = 1
    column: int = 1
    end_line: Optional[int] = None
    end_column: Optional[int] = None
    def __post_init__(self):
        if self.line < 1 or self.column < 1: raise ValueError('source positions are 1-based positive integers')
        if self.end_line is not None and self.end_line < self.line: raise ValueError('end_line cannot precede line')
        if self.end_column is not None and self.end_line == self.line and self.end_column < self.column: raise ValueError('end_column cannot precede column')

@dataclass(frozen=True)
class Diagnostic:
    code: ErrorCode
    message: str
    span: SourceSpan = SourceSpan()
    hint: Optional[str] = None
    def render(self):
        out = f'{self.code.value} at {self.span.line}:{self.span.column}: {self.message}'
        if self.hint: out += f'\n  hint: {self.hint}'
        return out

class ArcaneDiagnosticError(Exception):
    def __init__(self, diagnostic: Diagnostic):
        self.diagnostic = diagnostic
        super().__init__(diagnostic.render())

class ValueKind(str, Enum):
    NUMBER = 'number'
    BOOLEAN = 'boolean'
    STRING = 'string'
    LIST = 'list'
    FUNCTION = 'function'
    UNKNOWN = 'unknown'

@dataclass(frozen=True)
class ValueType:
    kind: ValueKind
    dimensions: tuple[int, ...] = ()
    element_type: Optional['ValueType'] = None
    def describe(self):
        if self.kind == ValueKind.NUMBER and self.dimensions:
            return f"number[{','.join(map(str, self.dimensions))}]"
        if self.kind == ValueKind.LIST and self.element_type:
            return f'list[{self.element_type.describe()}]'
        return self.kind.value

@dataclass(frozen=True)
class TypedValue:
    value: Any
    type: ValueType

def infer_type(value: Any, dimensions: tuple[int, ...] = ()) -> ValueType:
    """Infer a descriptive type without changing or coercing the value."""
    if isinstance(value, bool): return ValueType(ValueKind.BOOLEAN)
    if isinstance(value, (int, float, complex)): return ValueType(ValueKind.NUMBER, dimensions)
    if isinstance(value, str): return ValueType(ValueKind.STRING)
    if isinstance(value, (list, tuple)):
        if not value: return ValueType(ValueKind.LIST, element_type=ValueType(ValueKind.UNKNOWN))
        first = infer_type(value[0])
        # Heterogeneous collections are represented honestly as unknown element type.
        if any(infer_type(item) != first for item in value[1:]): first = ValueType(ValueKind.UNKNOWN)
        return ValueType(ValueKind.LIST, element_type=first)
    if callable(value): return ValueType(ValueKind.FUNCTION)
    return ValueType(ValueKind.UNKNOWN)

def diagnostic_for_exception(exc: Exception, span: SourceSpan = SourceSpan()) -> Diagnostic:
    """Map common evaluator exceptions to stable diagnostics; never expose traceback text."""
    message = str(exc).strip() or exc.__class__.__name__
    low = message.casefold()
    if isinstance(exc, ZeroDivisionError) or 'division by zero' in low:
        code, hint = ErrorCode.DIVISION_BY_ZERO, 'Check the denominator before dividing.'
    elif 'unknown binding' in low or 'unknown name' in low:
        code, hint = ErrorCode.UNKNOWN_NAME, 'Check the spelling and whether the name is in scope.'
    elif 'duplicate binding' in low or 'already defined' in low:
        code, hint = ErrorCode.DUPLICATE_BINDING, 'Choose a new name or use the existing binding.'
    elif 'dimension' in low or 'unit' in low:
        code, hint = ErrorCode.DIMENSION_MISMATCH, 'Check that the quantities use compatible dimensions.'
    elif 'bound' in low or 'integer' in low:
        code, hint = ErrorCode.INVALID_BOUNDS, 'Use dimensionless integer bounds.'
    elif 'iteration' in low and ('maximum' in low or 'exceed' in low):
        code, hint = ErrorCode.ITERATION_LIMIT, 'Reduce the range to the configured iteration limit.'
    elif 'type' in low or 'numeric' in low:
        code, hint = ErrorCode.TYPE_MISMATCH, 'Check the value types expected by this operation.'
    elif 'parse' in low or 'unexpected' in low or 'token' in low:
        code, hint = ErrorCode.PARSE_ERROR, 'Check the expression syntax and delimiters.'
    elif 'call depth' in low or 'recursion' in low:
        code, hint = ErrorCode.CALL_DEPTH, 'Reduce recursive nesting or add a terminating condition.'
    else:
        code, hint = ErrorCode.INTERNAL_ERROR, None
    return Diagnostic(code, message, span, hint)

~~~

## arcane_diagnostics 3.py

- Type: PY
- SHA-256: `cb3eb48481a86f632d911a5757cca591cf589137f2b2647dc17a2a11d1b8b979`
- Extracted characters: 5185

~~~text
"""Phase 7J: stable diagnostics and result typing utilities for Arcane tooling.

This module is deliberately independent of a particular evaluator implementation so
it can be integrated without changing the semantics of the provisional runtime.
"""
from dataclasses import dataclass
from enum import Enum
from typing import Any, Optional

class ErrorCode(str, Enum):
    PARSE_ERROR = 'ARC-PARSE-001'
    UNKNOWN_NAME = 'ARC-NAME-001'
    DUPLICATE_BINDING = 'ARC-NAME-002'
    TYPE_MISMATCH = 'ARC-TYPE-001'
    DIMENSION_MISMATCH = 'ARC-UNIT-001'
    INVALID_BOUNDS = 'ARC-LOOP-001'
    ITERATION_LIMIT = 'ARC-LOOP-002'
    DIVISION_BY_ZERO = 'ARC-MATH-001'
    CALL_DEPTH = 'ARC-RUNTIME-001'
    INTERNAL_ERROR = 'ARC-RUNTIME-999'

@dataclass(frozen=True)
class SourceSpan:
    line: int = 1
    column: int = 1
    end_line: Optional[int] = None
    end_column: Optional[int] = None
    def __post_init__(self):
        if self.line < 1 or self.column < 1: raise ValueError('source positions are 1-based positive integers')
        if self.end_line is not None and self.end_line < self.line: raise ValueError('end_line cannot precede line')
        if self.end_column is not None and self.end_line == self.line and self.end_column < self.column: raise ValueError('end_column cannot precede column')

@dataclass(frozen=True)
class Diagnostic:
    code: ErrorCode
    message: str
    span: SourceSpan = SourceSpan()
    hint: Optional[str] = None
    def render(self):
        out = f'{self.code.value} at {self.span.line}:{self.span.column}: {self.message}'
        if self.hint: out += f'\n  hint: {self.hint}'
        return out

class ArcaneDiagnosticError(Exception):
    def __init__(self, diagnostic: Diagnostic):
        self.diagnostic = diagnostic
        super().__init__(diagnostic.render())

class ValueKind(str, Enum):
    NUMBER = 'number'
    BOOLEAN = 'boolean'
    STRING = 'string'
    LIST = 'list'
    FUNCTION = 'function'
    UNKNOWN = 'unknown'

@dataclass(frozen=True)
class ValueType:
    kind: ValueKind
    dimensions: tuple[int, ...] = ()
    element_type: Optional['ValueType'] = None
    def describe(self):
        if self.kind == ValueKind.NUMBER and self.dimensions:
            return f"number[{','.join(map(str, self.dimensions))}]"
        if self.kind == ValueKind.LIST and self.element_type:
            return f'list[{self.element_type.describe()}]'
        return self.kind.value

@dataclass(frozen=True)
class TypedValue:
    value: Any
    type: ValueType

def infer_type(value: Any, dimensions: tuple[int, ...] = ()) -> ValueType:
    """Infer a descriptive type without changing or coercing the value."""
    if isinstance(value, bool): return ValueType(ValueKind.BOOLEAN)
    if isinstance(value, (int, float, complex)): return ValueType(ValueKind.NUMBER, dimensions)
    if isinstance(value, str): return ValueType(ValueKind.STRING)
    if isinstance(value, (list, tuple)):
        if not value: return ValueType(ValueKind.LIST, element_type=ValueType(ValueKind.UNKNOWN))
        first = infer_type(value[0])
        # Heterogeneous collections are represented honestly as unknown element type.
        if any(infer_type(item) != first for item in value[1:]): first = ValueType(ValueKind.UNKNOWN)
        return ValueType(ValueKind.LIST, element_type=first)
    if callable(value): return ValueType(ValueKind.FUNCTION)
    return ValueType(ValueKind.UNKNOWN)

def diagnostic_for_exception(exc: Exception, span: SourceSpan = SourceSpan()) -> Diagnostic:
    """Map common evaluator exceptions to stable diagnostics; never expose traceback text."""
    message = str(exc).strip() or exc.__class__.__name__
    low = message.casefold()
    if isinstance(exc, ZeroDivisionError) or 'division by zero' in low:
        code, hint = ErrorCode.DIVISION_BY_ZERO, 'Check the denominator before dividing.'
    elif 'unknown binding' in low or 'unknown name' in low:
        code, hint = ErrorCode.UNKNOWN_NAME, 'Check the spelling and whether the name is in scope.'
    elif 'duplicate binding' in low or 'already defined' in low:
        code, hint = ErrorCode.DUPLICATE_BINDING, 'Choose a new name or use the existing binding.'
    elif 'dimension' in low or 'unit' in low:
        code, hint = ErrorCode.DIMENSION_MISMATCH, 'Check that the quantities use compatible dimensions.'
    elif 'bound' in low or 'integer' in low:
        code, hint = ErrorCode.INVALID_BOUNDS, 'Use dimensionless integer bounds.'
    elif 'iteration' in low and ('maximum' in low or 'exceed' in low):
        code, hint = ErrorCode.ITERATION_LIMIT, 'Reduce the range to the configured iteration limit.'
    elif 'type' in low or 'numeric' in low:
        code, hint = ErrorCode.TYPE_MISMATCH, 'Check the value types expected by this operation.'
    elif 'parse' in low or 'unexpected' in low or 'token' in low:
        code, hint = ErrorCode.PARSE_ERROR, 'Check the expression syntax and delimiters.'
    elif 'call depth' in low or 'recursion' in low:
        code, hint = ErrorCode.CALL_DEPTH, 'Reduce recursive nesting or add a terminating condition.'
    else:
        code, hint = ErrorCode.INTERNAL_ERROR, None
    return Diagnostic(code, message, span, hint)

~~~

## arcane_diagnostics 4.py

- Type: PY
- SHA-256: `6fd6f73ef14a4254b8caeb47d4a9117a350c246bffe39eb943062be0e6dde012`
- Extracted characters: 5185

~~~text
"""Phase 7J: stable diagnostics and result typing utilities for Arcane tooling.

This module is deliberately independent of a particular evaluator implementation so
it can be integrated without changing the semantics of the provisional runtime.
"""
from dataclasses import dataclass
from enum import Enum
from typing import Any, Optional

class ErrorCode(str, Enum):
    PARSE_ERROR = 'ARC-PARSE-001'
    UNKNOWN_NAME = 'ARC-NAME-001'
    DUPLICATE_BINDING = 'ARC-NAME-002'
    TYPE_MISMATCH = 'ARC-TYPE-001'
    DIMENSION_MISMATCH = 'ARC-UNIT-001'
    INVALID_BOUNDS = 'ARC-LOOP-001'
    ITERATION_LIMIT = 'ARC-LOOP-002'
    DIVISION_BY_ZERO = 'ARC-MATH-001'
    CALL_DEPTH = 'ARC-RUNTIME-001'
    INTERNAL_ERROR = 'ARC-RUNTIME-999'

@dataclass(frozen=True)
class SourceSpan:
    line: int = 1
    column: int = 1
    end_line: Optional[int] = None
    end_column: Optional[int] = None
    def __post_init__(self):
        if self.line < 1 or self.column < 1: raise ValueError('source positions are 1-based positive integers')
        if self.end_line is not None and self.end_line < self.line: raise ValueError('end_line cannot precede line')
        if self.end_column is not None and self.end_line == self.line and self.end_column < self.column: raise ValueError('end_column cannot precede column')

@dataclass(frozen=True)
class Diagnostic:
    code: ErrorCode
    message: str
    span: SourceSpan = SourceSpan()
    hint: Optional[str] = None
    def render(self):
        out = f'{self.code.value} at {self.span.line}:{self.span.column}: {self.message}'
        if self.hint: out += f'\n  hint: {self.hint}'
        return out

class ArcaneDiagnosticError(Exception):
    def __init__(self, diagnostic: Diagnostic):
        self.diagnostic = diagnostic
        super().__init__(diagnostic.render())

class ValueKind(str, Enum):
    NUMBER = 'number'
    BOOLEAN = 'boolean'
    STRING = 'string'
    LIST = 'list'
    FUNCTION = 'function'
    UNKNOWN = 'unknown'

@dataclass(frozen=True)
class ValueType:
    kind: ValueKind
    dimensions: tuple[int, ...] = ()
    element_type: Optional['ValueType'] = None
    def describe(self):
        if self.kind == ValueKind.NUMBER and self.dimensions:
            return f"number[{','.join(map(str, self.dimensions))}]"
        if self.kind == ValueKind.LIST and self.element_type:
            return f'list[{self.element_type.describe()}]'
        return self.kind.value

@dataclass(frozen=True)
class TypedValue:
    value: Any
    type: ValueType

def infer_type(value: Any, dimensions: tuple[int, ...] = ()) -> ValueType:
    """Infer a descriptive type without changing or coercing the value."""
    if isinstance(value, bool): return ValueType(ValueKind.BOOLEAN)
    if isinstance(value, (int, float, complex)): return ValueType(ValueKind.NUMBER, dimensions)
    if isinstance(value, str): return ValueType(ValueKind.STRING)
    if isinstance(value, (list, tuple)):
        if not value: return ValueType(ValueKind.LIST, element_type=ValueType(ValueKind.UNKNOWN))
        first = infer_type(value[0])
        # Heterogeneous collections are represented honestly as unknown element type.
        if any(infer_type(item) != first for item in value[1:]): first = ValueType(ValueKind.UNKNOWN)
        return ValueType(ValueKind.LIST, element_type=first)
    if callable(value): return ValueType(ValueKind.FUNCTION)
    return ValueType(ValueKind.UNKNOWN)

def diagnostic_for_exception(exc: Exception, span: SourceSpan = SourceSpan()) -> Diagnostic:
    """Map common evaluator exceptions to stable diagnostics; never expose traceback text."""
    message = str(exc).strip() or exc.__class__.__name__
    low = message.casefold()
    if isinstance(exc, ZeroDivisionError) or 'division by zero' in low:
        code, hint = ErrorCode.DIVISION_BY_ZERO, 'Check the denominator before dividing.'
    elif 'unknown binding' in low or 'unknown name' in low:
        code, hint = ErrorCode.UNKNOWN_NAME, 'Check the spelling and whether the name is in scope.'
    elif 'duplicate binding' in low or 'already defined' in low:
        code, hint = ErrorCode.DUPLICATE_BINDING, 'Choose a new name or use the existing binding.'
    elif 'bound' in low or 'integer' in low:
        code, hint = ErrorCode.INVALID_BOUNDS, 'Use dimensionless integer bounds.'
    elif 'dimension' in low or 'unit' in low:
        code, hint = ErrorCode.DIMENSION_MISMATCH, 'Check that the quantities use compatible dimensions.'
    elif 'iteration' in low and ('maximum' in low or 'exceed' in low):
        code, hint = ErrorCode.ITERATION_LIMIT, 'Reduce the range to the configured iteration limit.'
    elif 'type' in low or 'numeric' in low:
        code, hint = ErrorCode.TYPE_MISMATCH, 'Check the value types expected by this operation.'
    elif 'parse' in low or 'unexpected' in low or 'token' in low:
        code, hint = ErrorCode.PARSE_ERROR, 'Check the expression syntax and delimiters.'
    elif 'call depth' in low or 'recursion' in low:
        code, hint = ErrorCode.CALL_DEPTH, 'Reduce recursive nesting or add a terminating condition.'
    else:
        code, hint = ErrorCode.INTERNAL_ERROR, None
    return Diagnostic(code, message, span, hint)

~~~

## arcane_diagnostics.py

- Type: PY
- SHA-256: `cb3eb48481a86f632d911a5757cca591cf589137f2b2647dc17a2a11d1b8b979`
- Extracted characters: 5185

~~~text
"""Phase 7J: stable diagnostics and result typing utilities for Arcane tooling.

This module is deliberately independent of a particular evaluator implementation so
it can be integrated without changing the semantics of the provisional runtime.
"""
from dataclasses import dataclass
from enum import Enum
from typing import Any, Optional

class ErrorCode(str, Enum):
    PARSE_ERROR = 'ARC-PARSE-001'
    UNKNOWN_NAME = 'ARC-NAME-001'
    DUPLICATE_BINDING = 'ARC-NAME-002'
    TYPE_MISMATCH = 'ARC-TYPE-001'
    DIMENSION_MISMATCH = 'ARC-UNIT-001'
    INVALID_BOUNDS = 'ARC-LOOP-001'
    ITERATION_LIMIT = 'ARC-LOOP-002'
    DIVISION_BY_ZERO = 'ARC-MATH-001'
    CALL_DEPTH = 'ARC-RUNTIME-001'
    INTERNAL_ERROR = 'ARC-RUNTIME-999'

@dataclass(frozen=True)
class SourceSpan:
    line: int = 1
    column: int = 1
    end_line: Optional[int] = None
    end_column: Optional[int] = None
    def __post_init__(self):
        if self.line < 1 or self.column < 1: raise ValueError('source positions are 1-based positive integers')
        if self.end_line is not None and self.end_line < self.line: raise ValueError('end_line cannot precede line')
        if self.end_column is not None and self.end_line == self.line and self.end_column < self.column: raise ValueError('end_column cannot precede column')

@dataclass(frozen=True)
class Diagnostic:
    code: ErrorCode
    message: str
    span: SourceSpan = SourceSpan()
    hint: Optional[str] = None
    def render(self):
        out = f'{self.code.value} at {self.span.line}:{self.span.column}: {self.message}'
        if self.hint: out += f'\n  hint: {self.hint}'
        return out

class ArcaneDiagnosticError(Exception):
    def __init__(self, diagnostic: Diagnostic):
        self.diagnostic = diagnostic
        super().__init__(diagnostic.render())

class ValueKind(str, Enum):
    NUMBER = 'number'
    BOOLEAN = 'boolean'
    STRING = 'string'
    LIST = 'list'
    FUNCTION = 'function'
    UNKNOWN = 'unknown'

@dataclass(frozen=True)
class ValueType:
    kind: ValueKind
    dimensions: tuple[int, ...] = ()
    element_type: Optional['ValueType'] = None
    def describe(self):
        if self.kind == ValueKind.NUMBER and self.dimensions:
            return f"number[{','.join(map(str, self.dimensions))}]"
        if self.kind == ValueKind.LIST and self.element_type:
            return f'list[{self.element_type.describe()}]'
        return self.kind.value

@dataclass(frozen=True)
class TypedValue:
    value: Any
    type: ValueType

def infer_type(value: Any, dimensions: tuple[int, ...] = ()) -> ValueType:
    """Infer a descriptive type without changing or coercing the value."""
    if isinstance(value, bool): return ValueType(ValueKind.BOOLEAN)
    if isinstance(value, (int, float, complex)): return ValueType(ValueKind.NUMBER, dimensions)
    if isinstance(value, str): return ValueType(ValueKind.STRING)
    if isinstance(value, (list, tuple)):
        if not value: return ValueType(ValueKind.LIST, element_type=ValueType(ValueKind.UNKNOWN))
        first = infer_type(value[0])
        # Heterogeneous collections are represented honestly as unknown element type.
        if any(infer_type(item) != first for item in value[1:]): first = ValueType(ValueKind.UNKNOWN)
        return ValueType(ValueKind.LIST, element_type=first)
    if callable(value): return ValueType(ValueKind.FUNCTION)
    return ValueType(ValueKind.UNKNOWN)

def diagnostic_for_exception(exc: Exception, span: SourceSpan = SourceSpan()) -> Diagnostic:
    """Map common evaluator exceptions to stable diagnostics; never expose traceback text."""
    message = str(exc).strip() or exc.__class__.__name__
    low = message.casefold()
    if isinstance(exc, ZeroDivisionError) or 'division by zero' in low:
        code, hint = ErrorCode.DIVISION_BY_ZERO, 'Check the denominator before dividing.'
    elif 'unknown binding' in low or 'unknown name' in low:
        code, hint = ErrorCode.UNKNOWN_NAME, 'Check the spelling and whether the name is in scope.'
    elif 'duplicate binding' in low or 'already defined' in low:
        code, hint = ErrorCode.DUPLICATE_BINDING, 'Choose a new name or use the existing binding.'
    elif 'dimension' in low or 'unit' in low:
        code, hint = ErrorCode.DIMENSION_MISMATCH, 'Check that the quantities use compatible dimensions.'
    elif 'bound' in low or 'integer' in low:
        code, hint = ErrorCode.INVALID_BOUNDS, 'Use dimensionless integer bounds.'
    elif 'iteration' in low and ('maximum' in low or 'exceed' in low):
        code, hint = ErrorCode.ITERATION_LIMIT, 'Reduce the range to the configured iteration limit.'
    elif 'type' in low or 'numeric' in low:
        code, hint = ErrorCode.TYPE_MISMATCH, 'Check the value types expected by this operation.'
    elif 'parse' in low or 'unexpected' in low or 'token' in low:
        code, hint = ErrorCode.PARSE_ERROR, 'Check the expression syntax and delimiters.'
    elif 'call depth' in low or 'recursion' in low:
        code, hint = ErrorCode.CALL_DEPTH, 'Reduce recursive nesting or add a terminating condition.'
    else:
        code, hint = ErrorCode.INTERNAL_ERROR, None
    return Diagnostic(code, message, span, hint)

~~~

## arcane_expr 2.py

- Type: PY
- SHA-256: `a7f0fbdffa7ade867d8edca64f93b35fc3942e5846a742a7565626c057ab40e7`
- Extracted characters: 2841

~~~text
"""Small recursive-descent expression parser for the provisional Arcane subset."""
from __future__ import annotations
import re
from dataclasses import dataclass

TOKEN_RE = re.compile(r"\s*(\$[A-Za-z_][A-Za-z0-9_]*|(?:\d+\.\d+|\d+)|[A-Za-z_][A-Za-z0-9_]*|==|!=|<=|>=|[()+\-*/%,<>])")
BINARY_PREFIX = {"FRATA", "FRAPA", "FRAMO", "FRADI", "FRAGT", "FRALT", "FRAEQ", "FRANE", "FRAGE", "FRALE"}
PRECEDENCE = {"==": 1, "!=": 1, "<": 1, ">": 1, "<=": 1, ">=": 1, "+": 2, "-": 2, "*": 3, "/": 3, "%": 3}

class ExpressionSyntaxError(ValueError):
    pass

@dataclass
class Parser:
    tokens: list[str]
    pos: int = 0

    def peek(self): return self.tokens[self.pos] if self.pos < len(self.tokens) else None
    def take(self):
        token=self.peek()
        if token is None: raise ExpressionSyntaxError("unexpected end of expression")
        self.pos += 1
        return token

    def parse(self, min_precedence=0):
        token=self.take()
        if token == "(":
            self.parse(0)
            if self.take() != ")": raise ExpressionSyntaxError("expected ')' to close parenthesised expression")
        elif token in ("+", "-"):
            self.parse(4)
        elif token.startswith("$") or re.fullmatch(r"\d+(?:\.\d+)?", token):
            pass
        elif re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", token):
            if token in BINARY_PREFIX:
                self.parse(4)
                self.parse(4)
            elif self.peek() == "(":
                self.take()
                if self.peek() != ")":
                    self.parse(0)
                    while self.peek() == ",":
                        self.take(); self.parse(0)
                if self.take() != ")": raise ExpressionSyntaxError("expected ')' after function arguments")
            else:
                raise ExpressionSyntaxError(f"bare name '{token}' is not an expression; use a binding reference or function call")
        else:
            raise ExpressionSyntaxError(f"unexpected token '{token}'")
        while self.peek() in PRECEDENCE and PRECEDENCE[self.peek()] >= min_precedence:
            op=self.take(); self.parse(PRECEDENCE[op]+1)
        return True

def tokenize(expression: str) -> list[str]:
    tokens=[]; pos=0
    while pos < len(expression):
        match=TOKEN_RE.match(expression,pos)
        if not match:
            if expression[pos:].strip() == "": break
            raise ExpressionSyntaxError(f"unexpected character '{expression[pos]}'")
        tokens.append(match.group(1)); pos=match.end()
    if not tokens: raise ExpressionSyntaxError("expression is empty")
    return tokens

def validate_expression(expression: str) -> None:
    tokens=tokenize(expression)
    parser=Parser(tokens)
    parser.parse()
    if parser.peek() is not None: raise ExpressionSyntaxError(f"unexpected token '{parser.peek()}'")

~~~

## arcane_expr.py

- Type: PY
- SHA-256: `a7f0fbdffa7ade867d8edca64f93b35fc3942e5846a742a7565626c057ab40e7`
- Extracted characters: 2841

~~~text
"""Small recursive-descent expression parser for the provisional Arcane subset."""
from __future__ import annotations
import re
from dataclasses import dataclass

TOKEN_RE = re.compile(r"\s*(\$[A-Za-z_][A-Za-z0-9_]*|(?:\d+\.\d+|\d+)|[A-Za-z_][A-Za-z0-9_]*|==|!=|<=|>=|[()+\-*/%,<>])")
BINARY_PREFIX = {"FRATA", "FRAPA", "FRAMO", "FRADI", "FRAGT", "FRALT", "FRAEQ", "FRANE", "FRAGE", "FRALE"}
PRECEDENCE = {"==": 1, "!=": 1, "<": 1, ">": 1, "<=": 1, ">=": 1, "+": 2, "-": 2, "*": 3, "/": 3, "%": 3}

class ExpressionSyntaxError(ValueError):
    pass

@dataclass
class Parser:
    tokens: list[str]
    pos: int = 0

    def peek(self): return self.tokens[self.pos] if self.pos < len(self.tokens) else None
    def take(self):
        token=self.peek()
        if token is None: raise ExpressionSyntaxError("unexpected end of expression")
        self.pos += 1
        return token

    def parse(self, min_precedence=0):
        token=self.take()
        if token == "(":
            self.parse(0)
            if self.take() != ")": raise ExpressionSyntaxError("expected ')' to close parenthesised expression")
        elif token in ("+", "-"):
            self.parse(4)
        elif token.startswith("$") or re.fullmatch(r"\d+(?:\.\d+)?", token):
            pass
        elif re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", token):
            if token in BINARY_PREFIX:
                self.parse(4)
                self.parse(4)
            elif self.peek() == "(":
                self.take()
                if self.peek() != ")":
                    self.parse(0)
                    while self.peek() == ",":
                        self.take(); self.parse(0)
                if self.take() != ")": raise ExpressionSyntaxError("expected ')' after function arguments")
            else:
                raise ExpressionSyntaxError(f"bare name '{token}' is not an expression; use a binding reference or function call")
        else:
            raise ExpressionSyntaxError(f"unexpected token '{token}'")
        while self.peek() in PRECEDENCE and PRECEDENCE[self.peek()] >= min_precedence:
            op=self.take(); self.parse(PRECEDENCE[op]+1)
        return True

def tokenize(expression: str) -> list[str]:
    tokens=[]; pos=0
    while pos < len(expression):
        match=TOKEN_RE.match(expression,pos)
        if not match:
            if expression[pos:].strip() == "": break
            raise ExpressionSyntaxError(f"unexpected character '{expression[pos]}'")
        tokens.append(match.group(1)); pos=match.end()
    if not tokens: raise ExpressionSyntaxError("expression is empty")
    return tokens

def validate_expression(expression: str) -> None:
    tokens=tokenize(expression)
    parser=Parser(tokens)
    parser.parse()
    if parser.peek() is not None: raise ExpressionSyntaxError(f"unexpected token '{parser.peek()}'")

~~~

## Arcane_Lexicon_v5_draft 10.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft 11.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft 2.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft 3.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft 4.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft 5.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft 6.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft 7.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft 8.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft 9.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## Arcane_Lexicon_v5_draft.csv

- Type: CSV
- SHA-256: `4b38aec651a32b332d4f28068d34618c4dfb2f043d44a2f03c146dba2e31ad8a`
- Extracted characters: 12352

~~~text
form,gloss,cls,register,status,source,note
za,0,DIGIT,Shared,CANON,v3.0-L,
ki,1,DIGIT,Shared,CANON,v3.0-L,
to,2,DIGIT,Shared,CANON,v3.0-L,
mu,3,DIGIT,Shared,CANON,v3.0-L,
re,4,DIGIT,Shared,CANON,v3.0-L,
sa,5,DIGIT,Shared,CANON,v3.0-L,
fi,6,DIGIT,Shared,CANON,v3.0-L,
du,7,DIGIT,Shared,CANON,v3.0-L,
go,8,DIGIT,Shared,CANON,v3.0-L,
pe,9,DIGIT,Shared,CANON,v3.0-L,
shi,decimal separator,DECIMAL,Shared,CANON,v3.0-L,
ma,metre,UNIT,Shared,CANON,v3.0-L,
se,second,UNIT,Shared,CANON,v3.0-L,
ke,kilogram,UNIT,Shared,CANON,v3.0-L,
ra,radian,UNIT,Shared,CANON,v3.0-L,
ku,kelvin,UNIT,Shared,CANON,v3.0-L,
pa,-X,AXIS,Shared,CANON,v3.0-L,
ba,+X,AXIS,Shared,CANON,v3.0-L,
ta,-Y,AXIS,Shared,CANON,v3.0-L,
da,+Y,AXIS,Shared,CANON,v3.0-L,
ka,-Z,AXIS,Shared,CANON,v3.0-L,
ga,+Z,AXIS,Shared,CANON,v3.0-L,
MI (formal),SELF (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as mə
NI (formal),FIELD (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as nə
RI (formal),TARGET (unscoped; default scope = volume),REF,Shared,"CANON (v3.0-L), reinterpreted",v3.0-L,performs as rə
su,CURRENT,REF,Shared,CANON,v3.0-L,
wo,WORLD,REF,Shared,CANON,v3.0-L,
fe,FRAME,REF,Shared,CANON,v3.0-L,
jo,toward,SPREL,Formal,CANON,v3.0-L,
jur,away,SPREL,Formal,CANON,v3.0-L,
ja,along,SPREL,Formal,CANON,v3.0-L,
je,parallel,SPREL,Formal,CANON,v3.0-L,
ji,aligned/coincident,SPREL,Formal,CANON,v3.0-L,
pi,point,GEOM,Formal,CANON,v3.0-L,
len,line,GEOM,Formal,CANON,v3.0-L,
pla,plane,GEOM,Formal,CANON,v3.0-L,
sur,surface,GEOM,Formal,CANON,v3.0-L,
vom,volume,GEOM,Formal,CANON,v3.0-L,
par,path,GEOM,Formal,CANON,v3.0-L,
ben,region,GEOM,Formal,RENAMED,v3.0-L,was ren
net,network,GEOM,Formal,CANON,v3.0-L,
pala,position,PROP,Formal,CANON,v3.0-L,
vanu,velocity,PROP,Formal,CANON,v3.0-L,
moru,mass,PROP,Formal,CANON,v3.0-L,
kera,acceleration,PROP,Formal,CANON,v3.0-L,
feta,force,PROP,Formal,CANON,v3.0-L,
enra,energy,PROP,Formal,CANON,v3.0-L,
teva,temperature,PROP,Formal,CANON,v3.0-L,
pura,pressure,PROP,Formal,CANON,v3.0-L,
poma,momentum,PROP,Formal,CANON,v3.0-L,
nes,read,INFO,Formal,CANON,v3.0-L,
sima,measure,INFO,Formal,CANON,v3.0-L,
gama,assign,INFO,Formal,CANON,v3.0-L,
dave,infer,INFO,Formal,CANON,v3.0-L,
frapa,add,ARITH,Formal,CANON,v3.0-L,
fraja,subtract,ARITH,Formal,RENAMED,v3.0-L,was frata
frama,multiply,ARITH,Formal,RENAMED,v3.0-L,was fraka
frala,divide,ARITH,Formal,CANON,v3.0-L,
frasha,negate,ARITH,Formal,CANON,v3.0-L,
dran,magnitude,VEC,Formal,CANON,v3.0-L,
drem,dot,VEC,Formal,CANON,v3.0-L,
drum,cross,VEC,Formal,RENAMED,v3.0-L,was drim
dras,compare,VEC,Formal,RENAMED,v3.0-L,was dral
gran,and,LOGIC,Formal,CANON,v3.0-L,
grat,or,LOGIC,Formal,CANON,v3.0-L,
grash,not,LOGIC,Formal,RENAMED,v3.0-L,was grak
bek,if,CTRL,Formal,CANON,v3.0-L,
zet,while,CTRL,Formal,CANON,v3.0-L,
kwam,bind,BIND,Formal,CANON,v3.0-L,
kwat,reference binding,BIND,Formal,CANON,v3.0-L,
kwash,live evaluation,BIND,Formal,RENAMED,v3.0-L,was kwak
kren,establish,VERB,Formal,CANON,Magic v3.0 §26,
trak,alter,VERB,Formal,CANON,Magic v3.0 §26,
frem,maintain,VERB,Formal,CANON,Magic v3.0 §26,
shren,release,VERB,Formal,CANON,Magic v3.0 §26,
bran,couple,VERB,Formal,CANON,Magic v3.0 §26,
vare,prefer,VERB,Formal,CANON,Magic v3.0 §26,
po,position role,ROLE,Formal,CANON,v2.0,
fo,direction role,ROLE,Formal,CANON,v2.0,
lo,movement role,ROLE,Formal,CANON,v2.0,
hə,couple: mana,COUP,Formal,CANON,v2.0,
he,couple: matter,COUP,Formal,CANON,v2.0,
ha,couple: energy,COUP,Formal,CANON,v2.0,
hu,couple: living,COUP,Formal,CANON,v2.0,
hi,couple: information,COUP,Formal,CANON,v2.0,
ho,couple: field,COUP,Formal,CANON,v2.0,
boni,now (instant of evaluation),TIME,Formal,PROPOSED,Phase 4,
vote,before,TIME,Formal,PROPOSED,Phase 4,
fuwo,after,TIME,Formal,PROPOSED,Phase 4,
kole,until,CTRL,Formal,PROPOSED,Phase 4,
shasu,delay (offset before start),TIME,Formal,PROPOSED,Phase 4,
wela,duration,TIME,Formal,PROPOSED,Phase 4,
vitu,repetition interval,TIME,Formal,PROPOSED,Phase 4,
showa,deadline,TIME,Formal,PROPOSED,Phase 4,
leko,predict (estimate future state),TIME,Formal,PROPOSED,Phase 4,
tude,set union,SET,Formal,PROPOSED,Phase 4,
kofa,set intersection,SET,Formal,PROPOSED,Phase 4,
lipe,set difference,SET,Formal,PROPOSED,Phase 4,
belu,set complement,SET,Formal,PROPOSED,Phase 4,
tile,filter set by predicate,SET,Formal,PROPOSED,Phase 4,
wuke,order set by key,SET,Formal,PROPOSED,Phase 4,
fupa,pick min/max/nth from ordered set,SET,Formal,PROPOSED,Phase 4,
buve,search a domain for candidates,SET,Formal,PROPOSED,Phase 4,
bemi,exists (any),SET,Formal,PROPOSED,Phase 4,
tipa,for all,SET,Formal,PROPOSED,Phase 4,
weki,for each (iteration),CTRL,Formal,PROPOSED,Phase 4,
mosha,hard requirement,CONSTR,Formal,PROPOSED,Phase 4,
lisho,invariant: preserve,CONSTR,Formal,PROPOSED,Phase 4,
vobi,tolerance: within,CONSTR,Formal,PROPOSED,Phase 4,
wuga,exponent,MATH,Formal,PROPOSED,Phase 4,
levu,scientific notation (x10^n),MATH,Formal,PROPOSED,Phase 4,
nadi,relation: equal,RELVAL,Formal,PROPOSED,Phase 4,
dofa,relation: less than,RELVAL,Formal,PROPOSED,Phase 4,
guwi,relation: greater than,RELVAL,Formal,PROPOSED,Phase 4,
luri,control state: attached,STATE,Formal,PROPOSED,Phase 4,
dena,control state: transferred,STATE,Formal,PROPOSED,Phase 4,
votu,control state: independent,STATE,Formal,PROPOSED,Phase 4,
ruki,event: condition becomes true,CTRL,Formal,PROPOSED,Phase 4,
labu,frame transform,MISC,Formal,PROPOSED,Phase 4,
meto,block open,CTRL,Formal,PROPOSED,Phase 4,
dogu,block close,CTRL,Formal,PROPOSED,Phase 4,
sho,dimensionless unit (ends every numeral that has no physical unit),UNIT,Shared,PROPOSED,Phase 4,
vo,bit (information unit),UNIT,Shared,PROPOSED,Phase 4,unit of information; no dimension assigned yet
mi,SELF-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
me,SELF-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
mə,SELF-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ni,FIELD-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ne,FIELD-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
nə,FIELD-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ri,TARGET-point,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
re,TARGET-surface,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
rə,TARGET-volume,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ra,TARGET-path,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ro,TARGET-network,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
ru,TARGET-extended region,FUSED-REF,Performed,CANON (v2.0),v2.0,Performed fusion of reference + scope vowel
s-,IF (clitic form of bek),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
sh-,WHILE (clitic form of zet),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
f-,UNTIL (clitic form of until root),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
wi,LIVE (performed form of kwash),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
we,LOCKED (performed form of kwam+kwat lock),CLITIC,Performed,"CANON (v2.0), reinterpreted",v2.0,Performed only
pun,question particle (yes/no),PART,Vernacular,PROPOSED,Phase 5,
lap,polite particle,PART,Vernacular,PROPOSED,Phase 5,
jus,respectful particle,PART,Vernacular,PROPOSED,Phase 5,
fut,emphatic particle,PART,Vernacular,PROPOSED,Phase 5,
wit,topic particle,PART,Vernacular,PROPOSED,Phase 5,
don,already/done,PART,Vernacular,PROPOSED,Phase 5,
kok,ongoing,PART,Vernacular,PROPOSED,Phase 5,
zis,hello,INTJ,Vernacular,PROPOSED,Phase 5,
lal,goodbye,INTJ,Vernacular,PROPOSED,Phase 5,
sil,thanks,INTJ,Vernacular,PROPOSED,Phase 5,
nong,sorry,INTJ,Vernacular,PROPOSED,Phase 5,
val,please,INTJ,Vernacular,PROPOSED,Phase 5,
wang,yes,INTJ,Vernacular,PROPOSED,Phase 5,
kor,no,INTJ,Vernacular,PROPOSED,Phase 5,
gep,maybe,INTJ,Vernacular,PROPOSED,Phase 5,
shuk,who,WH,Vernacular,PROPOSED,Phase 5,
zosh,what,WH,Vernacular,PROPOSED,Phase 5,
ving,where,WH,Vernacular,PROPOSED,Phase 5,
zul,when,WH,Vernacular,PROPOSED,Phase 5,
gir,why,WH,Vernacular,PROPOSED,Phase 5,
jup,how,WH,Vernacular,PROPOSED,Phase 5,
desh,in/at,PREP,Vernacular,PROPOSED,Phase 5,
ding,with,PREP,Vernacular,PROPOSED,Phase 5,
push,for,PREP,Vernacular,PROPOSED,Phase 5,
buk,about,PREP,Vernacular,PROPOSED,Phase 5,
ges,than,PREP,Vernacular,PROPOSED,Phase 5,
was,but,CONJ,Vernacular,PROPOSED,Phase 5,
song,because,CONJ,Vernacular,PROPOSED,Phase 5,
vil,so,CONJ,Vernacular,PROPOSED,Phase 5,
ful,go,V,Vernacular,PROPOSED,Phase 5,
zem,come,V,Vernacular,PROPOSED,Phase 5,
wish,see,V,Vernacular,PROPOSED,Phase 5,
nak,hear,V,Vernacular,PROPOSED,Phase 5,
zir,say,V,Vernacular,PROPOSED,Phase 5,
shus,know,V,Vernacular,PROPOSED,Phase 5,
kong,want,V,Vernacular,PROPOSED,Phase 5,
tek,need,V,Vernacular,PROPOSED,Phase 5,
fam,can,V,Vernacular,PROPOSED,Phase 5,
shan,make,V,Vernacular,PROPOSED,Phase 5,
bul,give,V,Vernacular,PROPOSED,Phase 5,
lil,take,V,Vernacular,PROPOSED,Phase 5,
mol,eat,V,Vernacular,PROPOSED,Phase 5,
tut,drink,V,Vernacular,PROPOSED,Phase 5,
zop,sleep,V,Vernacular,PROPOSED,Phase 5,
wem,live,V,Vernacular,PROPOSED,Phase 5,
lus,die,V,Vernacular,PROPOSED,Phase 5,
lup,fight,V,Vernacular,PROPOSED,Phase 5,
las,help,V,Vernacular,PROPOSED,Phase 5,
gus,love,V,Vernacular,PROPOSED,Phase 5,
nash,fear,V,Vernacular,PROPOSED,Phase 5,
sish,think,V,Vernacular,PROPOSED,Phase 5,
bum,remember,V,Vernacular,PROPOSED,Phase 5,
shep,forget,V,Vernacular,PROPOSED,Phase 5,
mos,learn,V,Vernacular,PROPOSED,Phase 5,
pup,teach,V,Vernacular,PROPOSED,Phase 5,
tir,laugh,V,Vernacular,PROPOSED,Phase 5,
shash,cry,V,Vernacular,PROPOSED,Phase 5,
war,run,V,Vernacular,PROPOSED,Phase 5,
shem,wait,V,Vernacular,PROPOSED,Phase 5,
mop,find,V,Vernacular,PROPOSED,Phase 5,
tul,lose,V,Vernacular,PROPOSED,Phase 5,
teshi,person,N,Vernacular,PROPOSED,Phase 5,
fezo,friend,N,Vernacular,PROPOSED,Phase 5,
samo,family,N,Vernacular,PROPOSED,Phase 5,
juwe,mother,N,Vernacular,PROPOSED,Phase 5,
woju,father,N,Vernacular,PROPOSED,Phase 5,
toga,child,N,Vernacular,PROPOSED,Phase 5,
reki,teacher,N,Vernacular,PROPOSED,Phase 5,
shefo,student,N,Vernacular,PROPOSED,Phase 5,
dase,name,N,Vernacular,PROPOSED,Phase 5,
gezi,home,N,Vernacular,PROPOSED,Phase 5,
dosu,door,N,Vernacular,PROPOSED,Phase 5,
wipo,road,N,Vernacular,PROPOSED,Phase 5,
dine,town,N,Vernacular,PROPOSED,Phase 5,
gisho,food,N,Vernacular,PROPOSED,Phase 5,
losa,water,N,Vernacular,PROPOSED,Phase 5,
mije,fire,N,Vernacular,PROPOSED,Phase 5,
vuda,rain,N,Vernacular,PROPOSED,Phase 5,
diba,wind,N,Vernacular,PROPOSED,Phase 5,
tedi,sun,N,Vernacular,PROPOSED,Phase 5,
zoge,moon,N,Vernacular,PROPOSED,Phase 5,
zujo,night,N,Vernacular,PROPOSED,Phase 5,
domu,day,N,Vernacular,PROPOSED,Phase 5,
mawo,money,N,Vernacular,PROPOSED,Phase 5,
fape,book,N,Vernacular,PROPOSED,Phase 5,
rawu,word,N,Vernacular,PROPOSED,Phase 5,
wule,story,N,Vernacular,PROPOSED,Phase 5,
viso,joke,N,Vernacular,PROPOSED,Phase 5,
zeba,song,N,Vernacular,PROPOSED,Phase 5,
rora,face,N,Vernacular,PROPOSED,Phase 5,
tore,hand,N,Vernacular,PROPOSED,Phase 5,
lefi,eye,N,Vernacular,PROPOSED,Phase 5,
mubi,heart,N,Vernacular,PROPOSED,Phase 5,
vusi,mage,N,Vernacular,PROPOSED,Phase 5,
mewa,spell (a construction),N,Vernacular,PROPOSED,Phase 5,
sopu,mana,N,Vernacular,PROPOSED,Phase 5,
zufo,NULL (unclassified),N,Vernacular,PROPOSED,Phase 5,
wire,good,ADJ,Vernacular,PROPOSED,Phase 5,
meka,bad,ADJ,Vernacular,PROPOSED,Phase 5,
wavo,big,ADJ,Vernacular,PROPOSED,Phase 5,
lovi,small,ADJ,Vernacular,PROPOSED,Phase 5,
dinu,new,ADJ,Vernacular,PROPOSED,Phase 5,
maso,old,ADJ,Vernacular,PROPOSED,Phase 5,
dani,fast,ADJ,Vernacular,PROPOSED,Phase 5,
veju,slow,ADJ,Vernacular,PROPOSED,Phase 5,
jashi,strong,ADJ,Vernacular,PROPOSED,Phase 5,
wesho,weak,ADJ,Vernacular,PROPOSED,Phase 5,
geno,hot,ADJ,Vernacular,PROPOSED,Phase 5,
popa,cold,ADJ,Vernacular,PROPOSED,Phase 5,
podu,difficult,ADJ,Vernacular,PROPOSED,Phase 5,
foki,easy,ADJ,Vernacular,PROPOSED,Phase 5,
zori,true,ADJ,Vernacular,PROPOSED,Phase 5,
pufi,funny,ADJ,Vernacular,PROPOSED,Phase 5,
tibu,strange,ADJ,Vernacular,PROPOSED,Phase 5,
gaje,tired,ADJ,Vernacular,PROPOSED,Phase 5,

~~~

## ARCANE_PHASE_6Z_REPORT.md

- Type: MD
- SHA-256: `2bc08f731d2da537a1a5cdb6c046d8fe95e6963c2565c662fd3ced9b34ed8847`
- Extracted characters: 2101

~~~text
# Arcane Phase 6Z — Typed Quantities and Dimensional Validation

## Deliverable
A runnable arithmetic core now supports decimal numeric literals, a starter unit set, base-unit normalisation, dimensional inference, pre-evaluation type checking and informative failures. This is an implementation milestone, not another audit-only phase.

## Run
Requires Python 3.10+ and only the Python standard library.

```bash
python arcane_typed_core.py FRAPA 3 2
# 5 1
python arcane_typed_core.py FRAPA 2@m 30@cm
# 2.3 m
python arcane_typed_core.py FRAKA 3@m 2@s
# 6 m s
python arcane_typed_core.py FRAPA 2@m 3@s
# Arcane error: FRAPA requires matching dimensions; ...
python -m unittest -v test_arcane_typed_core.py
```

## Implemented
- Numeric literals including decimals and exponent notation.
- Units: dimensionless `1`, `m`, `cm`, `km`, `s`, `min`, `h`, `kg`, `g`.
- Addition/subtraction require equal dimensions.
- Multiplication adds dimension exponents; division subtracts them.
- Type checking is performed on the whole expression before numeric evaluation.
- Clear errors for unknown units/forms, malformed syntax, arity errors and division by zero.
- Decimal arithmetic avoids common binary floating-point surprises.

## Non-canonical boundary
Whitespace-separated prefix notation and `number@unit` literal notation are provisional implementation syntax, not canon. The dimension basis is currently length/time/mass only. It does not yet model temperature, electric current, angle, information, mana, uncertainty, affine units, vector/tensor types or physical feasibility. Arithmetic operator signatures remain an implementation profile pending canon approval. A dimensionally valid expression is not proof of physical or magical possibility.

## Phase exit result
The prior arithmetic-only core is extended with numeric and unit-bearing literals and a dimensional type checker. The tests in `test_arcane_typed_core.py` exercise successful calculations and invalid expressions through the same parser and evaluator. Future phases should build on this runtime rather than creating parallel prototypes.

~~~

## ARCANE_PHASE_7A_REPORT.md

- Type: MD
- SHA-256: `bb22c13c6d08cf2cc9b7a4941c1de36b9f847e8114869fe20335780be5b4f86c`
- Extracted characters: 2677

~~~text
# Arcane Phase 7A — Typed Bindings and References

## Outcome
A runnable environment now supports `KWAM` value bindings, `KWAT` references, and `KWAK` live-expression bindings using the Phase 6Z dimensional arithmetic evaluator. Expressions can refer to existing bindings with `$name` syntax. This is a working vertical slice, not an audit-only phase.

## Quick start
Requires Python 3.10+ and only the standard library.

```bash
python arcane_runtime.py 'KWAM distance = 3@m'
python arcane_runtime.py 'KWAT distance'  # each CLI invocation has a fresh environment, so use the Python API for multi-statement sessions
python -m unittest -v test_arcane_runtime.py
```

For a multi-statement session:

```python
from arcane_runtime import Environment, format_quantity
env = Environment()
env.execute('KWAM distance = 3@m')
env.execute('KWAM extension = 30@cm')
print(format_quantity(env.evaluate_expr(__import__('arcane_runtime').parse('FRAPA $distance $extension'))))
```

## Implemented
- `KWAM name = expression`: create a value binding, evaluating and validating the expression once.
- `KWAT name`: resolve an existing binding, case-insensitively.
- `KWAK name = expression`: create a live expression binding, re-evaluated on each read.
- `$name`: reference an existing binding inside an expression.
- Binding name validation, duplicate rejection, unknown-reference errors, and a cyclic-live-binding guard.
- Reuses dimensional checks for stored and live expressions; failed type checks do not create a binding.

## Limitations and canon boundary
The syntax and semantics are provisional implementation choices, not canonical Arcane grammar. Value bindings are immutable in this slice, so a live binding currently reevaluates against stable dependencies; meaningful reactive updates require a future assignment/state contract. Forward references are rejected. The CLI creates a fresh environment for each invocation; use the Python `Environment` API for a multi-statement session. No persistence, lexical scopes, functions, control flow, or magic/physical execution is implemented.

## Acceptance result
Focused tests cover binding creation, reference resolution, type failures, invalid names, duplicate names, live expression evaluation and cycle detection. Passing these tests establishes this feature slice only, not full-language completion.

## Next implementation milestone
Phase 7B should add explicit state update and scoped environments, then demonstrate that `KWAK` changes when a dependency changes. Keep that behaviour provisional until its canon contract is recovered or approved. Do not return to broad auditing unless a concrete implementation blocker appears.

~~~

## ARCANE_PHASE_7B_REPORT.md

- Type: MD
- SHA-256: `13af48f5bb70a80d2a1990c36a5e30a842a86b366c3de3e1532f6c23207dd503`
- Extracted characters: 2362

~~~text
# Arcane Phase 7B — Mutable State and Lexical Scopes

## Delivered
This phase extends the runnable provisional runtime with mutable state, live dependency updates and lexical scope stacks.

- `KWAS name = expression` creates mutable state.
- `KWAS name <- expression` updates the nearest existing mutable binding.
- `KWAK name = expression` remains a live expression and is reevaluated when read.
- `push_scope()` / `pop_scope()` create and remove lexical scopes through the Python API.
- Inner scopes may shadow outer names; after scope exit, the outer binding is visible again.
- Updates preserve the state's dimensional type; invalid updates leave the old value intact.
- Immutable `KWAM` values cannot be updated; unknown names and duplicate declarations are rejected.

## Example
```python
from arcane_runtime import Environment, format_quantity
env = Environment()
env.execute('KWAS distance = 2@m')
env.execute('KWAK total = FRAPA $distance 30@cm')
print(format_quantity(env.execute('KWAT total'))) # 2.3 m
env.execute('KWAS distance <- 5@m')
print(format_quantity(env.execute('KWAT total'))) # 5.3 m
```

Run tests with `python -m unittest -v test_arcane_runtime.py` (Python 3.10+, standard library only).

## Syntax/canon boundary
The command spellings, `<-` assignment notation, `$name` references and API-driven scope entry/exit are provisional implementation syntax, not canonical Arcane grammar. This runtime has no persistent REPL/session protocol, function-local automatic scopes, concurrency model, or full magical feasibility engine. A dimensionally valid calculation does not establish physical or magical feasibility.

## Acceptance
The focused suite covers state updates, reactive live expressions, dimensional preservation, immutability, unknown assignments, duplicate names, shadowing, scope cleanup, outer-state updates, cycle detection and regression arithmetic. Phase 7B is complete for this vertical slice when the included tests pass; the broader Arcane language remains in development.

## Next implementation target
Phase 7C should provide a persistent interactive session and transactional statement execution (a failed statement must not partially alter state), then integrate a small typed function/procedure mechanism if supported by the recovered specification. Avoid broad audits unless they unblock a concrete implementation.

~~~

## ARCANE_PHASE_7C_REPORT.md

- Type: MD
- SHA-256: `34e2d6d7f6c76f0d3e8987cd45633bcf86c64aa9f70cba63f267f955650f9dd1`
- Extracted characters: 2523

~~~text
# Arcane Phase 7C — Persistent Sessions and Transactional Execution

## Outcome
The runtime now has a persistent interactive session and script runner. Users can issue multiple statements in one environment, inspect bindings, enter/leave nested scopes, and continue after a failed statement. Every language statement executes transactionally: on an Arcane error or unexpected exception, the environment is restored to its pre-statement snapshot.

## Quick start
Requires Python 3.10+ and only the standard library.

```bash
python arcane_session.py
python arcane_session.py --script example.arc
python -m unittest -v test_arcane_runtime test_arcane_session
```

Example interactive session:

```text
arcane> KWAS distance = 2@m
2 m
arcane> KWAK total = FRAPA $distance 30@cm
2.3 m
arcane> KWAS distance <- 5@m
5 m
arcane> KWAT total
5.3 m
arcane> :scope in
entered scope 1
arcane> KWAM distance = 1@m
1 m
arcane> KWAT distance
1 m
arcane> :scope out
left scope; depth 0
arcane> KWAT distance
5 m
```

## Implemented
- One persistent `Environment` for the lifetime of an interactive session.
- `:help`, `:quit`, `:scope`, `:scope in`, `:scope out`, and `:env` commands.
- UTF-8 script execution with line-numbered output and continuation after a failing statement.
- Transactional rollback for each statement on language or unexpected runtime errors.
- Error messages include the statement number for session-level failures.
- Prior arithmetic, dimensional checks, bindings, mutable state and scopes remain integrated.

## Verification
The combined Phase 7B runtime and Phase 7C session suite passes **29 tests**. This is regression evidence for the included code only, not a claim of full Arcane conformance.

## Canon boundary and limitations
Interactive commands and the current Arcane syntax remain a provisional implementation profile, not a canon change. Each statement is atomic, but a multi-statement script is not one all-or-nothing transaction: earlier successful statements remain committed if a later statement fails. Session state is in memory only and is not persisted after the process exits. There is no editor, debugger, module system, or canonical grammar lock yet.

## Acceptance result
This phase makes the runtime materially more usable: it can run a sequence of statements, inspect and mutate live state, use scopes, recover from errors, and execute scripts. The next phase should add a small module/function capability or structured control flow through this same runtime, not restart broad auditing.

~~~

## ARCANE_PHASE_7D_REPORT.md

- Type: MD
- SHA-256: `ca1c489b616a57052adf84b5053300ddfb5ab829f0985789e47e9defe6f077ae`
- Extracted characters: 2166

~~~text
# Arcane Phase 7D — Typed Functions and Reusable Computation

## Delivered
This implementation adds reusable named functions to the existing provisional runtime.

- `KWAF name(p1,p2) => expression` defines a function.
- `KWAC name(arg1,arg2)` calls it.
- Parameters are evaluated arguments bound in a temporary local scope.
- Function bodies reuse the dimensional arithmetic evaluator.
- Wrong arity, unknown functions, duplicate names/parameters and invalid function bodies are rejected.
- A bounded call-depth guard is included for future recursive call paths.
- Function-local parameters do not leak, and they can shadow global names safely.
- Existing mutable state and live-expression evaluation remain integrated.

## Example
```text
KWAF extend(distance, addition) => FRAPA $distance $addition
KWAC extend(2@m, 30@cm)
# 2.3 m
```

## Run
Python 3.10+; standard library only.
```bash
python -m unittest -v test_arcane_runtime.py
python arcane_session.py
```

## Syntax/canon boundary and limitations
`KWAF`, `KWAC`, `=>`, comma-separated arguments and `$name` are provisional implementation syntax, not a canon change. Function bodies currently contain a single arithmetic/reference expression; function calls are not yet part of the expression grammar, so function composition is possible across statements but not nested inline calls. Return values are typed quantities. Function definitions are stored in the environment but are not yet scoped or persisted separately from the process. No branching, loops, user-defined return statements, overloading, or magic execution is implemented.

## Verification
13 focused tests pass, covering ordinary calls, dimensional unit arithmetic, mismatched dimensions, arity errors, unknown and duplicate functions, duplicate parameters, local scope isolation, global lookup, shadowing, state/live regression and invalid declaration rollback when used through the session manager.

## Next milestone
Phase 7E should add structured control flow and function-call expressions only after designing their grammar and evaluation rules in a small executable profile. Keep extending this runtime; do not restart the broad audit.

~~~

## ARCANE_PHASE_7E_REPORT.md

- Type: MD
- SHA-256: `ca7c950fb34a809fe537cb9b07eb3e9b9b8497ee818fcb4fa0efd888c93b324a`
- Extracted characters: 1698

~~~text
# Arcane Phase 7E — Conditional Expressions and Comparisons

## Delivered
This phase extends a runnable provisional runtime with three comparison operators and lazy conditional selection.

- `FRAGT a b`: greater-than comparison; returns dimensionless `1` or `0`.
- `FRALT a b`: less-than comparison; returns dimensionless `1` or `0`.
- `FRAEQ a b`: equality comparison; returns dimensionless `1` or `0`.
- `FRASI condition then_expr else_expr`: evaluates the condition, then evaluates only the selected branch. A zero condition is false; any non-zero condition is true.
- Functions may use conditional expressions in their body.
- The interactive shell snapshots state and rolls back failed statements.

## Example
```text
KWAF clamp_positive(x) => FRASI FRAGT $x 0 $x 0
KWAC clamp_positive(-3)
# 0 1
FRASI FRAGT 12 10 100 200
# 100 1
```

## Tests and running
Python 3.10+; standard library only.
```bash
python -m unittest -v test_arcane_runtime.py
python arcane_session.py
```
The included 12 tests pass, covering branch selection, lazy evaluation, comparisons, dimensional constraints, function integration and arity errors.

## Boundaries
All spellings and semantics added here are provisional implementation syntax, not a canon change. Function calls are still statements, not general expression nodes, so nested inline calls are not supported. `FRASI` dynamically evaluates only the selected branch; this means an invalid or unknown reference in an unselected branch is not evaluated. The current conditional truth rule is non-zero versus zero. Boolean types, static branch type inference, logical operators, loops, return statements, and full magic-system integration remain unimplemented.

~~~

## ARCANE_PHASE_7F_REPORT.md

- Type: MD
- SHA-256: `839405eb07c13203bcadbd09b1b30127e5e03ef8460158e6a9978082342fb95a`
- Extracted characters: 3255

~~~text
# Arcane Phase 7F — Function Composition

## Outcome
Phase 7F advances the runnable provisional Arcane subset by making user-defined function calls valid **expression nodes**. Function results can now feed directly into prefix operators, conditional branches, and other function arguments.

## New capability

```arcane
KWAF increment(x) => FRAPA $x 1
KWAF double(x) => FRAKA $x 2
KWAF add(x,y) => FRAPA $x $y

double(increment(3))
FRAPA increment(4) double(5)
add(double(3), increment(8))
```

Expected results for those three expressions are `8 1`, `15 1`, and `15 1` respectively. Unit-bearing values also pass through calls, for example `twice_distance(3@m)` returns `6 m` when `twice_distance(d)` multiplies `d` by 2.

## Implementation details
- Added a `Call` expression node and parser support for `function_name(expression, ...)`.
- Nested argument lists are parsed structurally instead of split naively on commas.
- Function arguments are evaluated in the caller's environment, then bound in a fresh local scope for the function body.
- Existing statement form `KWAC function(args)` remains supported, including nested calls.
- Function results can appear inside prefix expressions such as `FRAPA inc(2) inc(5)`.
- Existing conditional/comparison behaviour and unit-dimension checks remain covered by regression tests.
- Preserved a maximum active-call-depth guard and the session's per-command rollback behaviour.

## Verification
Automated test suite: **27 tests passed**. Tests cover nested composition, multiple arguments, prefix-expression integration, conditional composition, dimensions, errors, local-scope isolation, and existing Phase 7E conditional/comparison behaviour. The exact run is included in `PHASE_7F_TEST_OUTPUT.txt`.

## Boundaries and known limitations
- The grammar is still a small provisional subset, not the full Arcane grammar or canonical language specification.
- Functions must be defined before other function bodies that refer to them; forward declarations and recursion are not implemented as a supported language feature.
- Function body checking currently evaluates the body using dimensionless placeholder values for parameters. It is not a full static type/dimension inference system, and conditional branches are evaluated lazily at runtime rather than statically unified.
- Booleans are represented as dimensionless numeric 0/1; conditionals use non-zero truthiness.
- The runtime has only a few units (`m`, `cm`, `km`, `s`, `kg`) and operators (`FRAPA`, `FRATA`, `FRAKA`, `FRALA`, `FRASI`, `FRAGT`, `FRALT`, `FRAEQ`).
- This phase does not yet add loops, persistent modules, imports, a debugger, a full standard library, or integration with the complete magic-system model.

## Next implementation step
Phase 7G should add a narrowly scoped, test-backed capability that makes the language more usable—not another specification-only audit. Recommended direction: add logical composition (`AND`/`OR`/`NOT` equivalents) and formal boolean behaviour around comparisons and conditionals, with short-circuit tests and clear semantics, while retaining current arithmetic/function regression coverage. Before adopting spellings as canonical, reconcile them with the project lexicons in the supplied Arcana pack.

~~~

## ARCANE_PHASE_7G_REPORT.md

- Type: MD
- SHA-256: `2b106d4870d91ff58649b7f1213e0626dce941348e450c34f226f679004697f4`
- Extracted characters: 2792

~~~text
# Arcane Phase 7G — Logical Expressions and Boolean Semantics

## Outcome

Phase 7G extends the reconstructed provisional Phase 7F runtime with three logical expression operators and short-circuit evaluation. The implementation is runnable and the test suite passes **37/37 tests**.

## New operations

| Operator | Meaning | Arity |
|---|---|---:|
| `FRAND` | Logical conjunction | 2 |
| `FROR` | Logical disjunction | 2 |
| `FRNOT` | Logical negation | 1 |

**Lexicon status:** these operator spellings are provisional implementation choices. They have not been verified as canonical Arcane words and must not be silently promoted to canonical vocabulary.

## Semantics implemented

- Logical operations return dimensionless numeric truth values: `1` means true and `0` means false.
- Any non-zero dimensionless operand is interpreted as true; zero is false.
- `FRAND` stops after a false left operand and does not evaluate its right operand.
- `FROR` stops after a true left operand and does not evaluate its right operand.
- `FRNOT` maps false to true and any true value to false.
- Logical operands must be dimensionless. Dimensional operands raise `ArcaneTypeError`.
- Logical operations compose with comparisons, conditionals, and user-defined function calls.
- Operator spelling is case-insensitive.

## Verification

Command: `python -m unittest -v`

Result: **Ran 37 tests — OK.** The suite covers truth tables, negation, short-circuit behaviour, dimensional validation, comparisons composed with logic, conditional integration, function composition, case-insensitivity, arity and regression behaviour from Phase 7F.

## Known limitations

- This is still a deliberately small executable subset, not a complete Arcane runtime.
- Truth values are represented as dimensionless quantities, not a distinct static Boolean type.
- Existing `FRASI` still accepts any quantity as a condition using non-zero truthiness, including dimensional values; a future compatibility decision should define whether to tighten this.
- Static type inference, complete branch-type checking, forward declarations, loops, modules and broad standard-library integration are not supplied by this phase.
- The new spellings need review against the project's authoritative lexicon/decision ledger before being considered canonical.
- The phase builds on the current reconstructed Phase 7F package and the supplied `Arcana pack.zip`; it does not claim to recover missing historical workspace state.

## Files

- `arcane_runtime.py` — runtime implementation
- `arcane_session.py` — interactive session
- `test_arcane_runtime.py` — automated tests
- `example.arc` — logical-expression examples
- `PHASE_7G_TEST_OUTPUT.txt` — test output
- `PHASE_7G_STATUS.csv` — implementation status
- `README.txt` — usage notes

~~~

## ARCANE_PHASE_7H_REPORT 2.md

- Type: MD
- SHA-256: `43a1da56928a8faae3866b02824167210c408520e9f643489011cf60262f1c84`
- Extracted characters: 2921

~~~text
# Arcane Phase 7H — Bounded Repetition and Control Flow

## Outcome

Phase 7H adds a bounded repetition statement to the provisional runtime, building on function composition (Phase 7F) and logical expressions (Phase 7G). The final automated test run passes **24/24 tests**.

## Syntax (provisional)

```arcane
KWAR i FROM 1 TO 5 => FRAKA $i $i
```

This evaluates the body once for each integer from 1 through 5 inclusive and returns the list of results. `KWAR` and this grammar are provisional implementation spellings, not declared canonical Arcane vocabulary.

## Semantics

- Start and end bounds are evaluated once in the outer scope.
- Bounds must be dimensionless integral quantities.
- The range is inclusive.
- Empty ranges (`start > end`) return an empty list.
- Maximum iteration count is 1,000 per repeat; larger ranges raise `ArcaneEvaluationError` before executing the body.
- Each iteration gets its own temporary scope. The iteration variable is bound to that iteration's integer value and is removed even if evaluation fails.
- A same-named outer binding is preserved.
- The body can use arithmetic, comparisons, logic, and existing user-defined functions.
- The result is a list of expression results; this phase does not add mutable accumulators, break/continue, arbitrary loops, or general block statements.

## Verification

Command: `python -m unittest -v`

Result: **Ran 24 tests — OK.** Coverage includes inclusive and empty ranges, negative and single-item ranges, arithmetic/function/logic bodies, outer-scope bounds, scope isolation and cleanup, invalid bounds, maximum iteration enforcement, case-insensitivity, and regression tests for function composition, logic, conditionals, units and error handling.

## Limitations and decisions still open

- The syntax and keyword are provisional and require review against the authoritative decision ledger and lexicon before canonisation.
- This is a reconstructed, small executable subset rather than a complete Arcane compiler/runtime.
- Repetition returns a list of results. There is no mutation or accumulator construct yet.
- Only bounded repetition is supported; unrestricted while loops and general multi-statement blocks are not included.
- The current runtime uses dimensionless numeric values for booleans and has only a small unit/operator set.
- This phase does not establish complete integration with the larger magic-system model.

## Next implementation step

Phase 7I should add a minimal, test-backed aggregation/reduction capability (for example, summing a list of quantities with dimension checks) or a safe immutable collection layer. This would make the results of bounded repetition directly useful rather than leaving all values as an output list. First review the existing project decision ledger for conflicting conventions; keep new syntax explicitly provisional until approved. Continue building before expanding audits.

~~~

## ARCANE_PHASE_7H_REPORT.md

- Type: MD
- SHA-256: `43a1da56928a8faae3866b02824167210c408520e9f643489011cf60262f1c84`
- Extracted characters: 2921

~~~text
# Arcane Phase 7H — Bounded Repetition and Control Flow

## Outcome

Phase 7H adds a bounded repetition statement to the provisional runtime, building on function composition (Phase 7F) and logical expressions (Phase 7G). The final automated test run passes **24/24 tests**.

## Syntax (provisional)

```arcane
KWAR i FROM 1 TO 5 => FRAKA $i $i
```

This evaluates the body once for each integer from 1 through 5 inclusive and returns the list of results. `KWAR` and this grammar are provisional implementation spellings, not declared canonical Arcane vocabulary.

## Semantics

- Start and end bounds are evaluated once in the outer scope.
- Bounds must be dimensionless integral quantities.
- The range is inclusive.
- Empty ranges (`start > end`) return an empty list.
- Maximum iteration count is 1,000 per repeat; larger ranges raise `ArcaneEvaluationError` before executing the body.
- Each iteration gets its own temporary scope. The iteration variable is bound to that iteration's integer value and is removed even if evaluation fails.
- A same-named outer binding is preserved.
- The body can use arithmetic, comparisons, logic, and existing user-defined functions.
- The result is a list of expression results; this phase does not add mutable accumulators, break/continue, arbitrary loops, or general block statements.

## Verification

Command: `python -m unittest -v`

Result: **Ran 24 tests — OK.** Coverage includes inclusive and empty ranges, negative and single-item ranges, arithmetic/function/logic bodies, outer-scope bounds, scope isolation and cleanup, invalid bounds, maximum iteration enforcement, case-insensitivity, and regression tests for function composition, logic, conditionals, units and error handling.

## Limitations and decisions still open

- The syntax and keyword are provisional and require review against the authoritative decision ledger and lexicon before canonisation.
- This is a reconstructed, small executable subset rather than a complete Arcane compiler/runtime.
- Repetition returns a list of results. There is no mutation or accumulator construct yet.
- Only bounded repetition is supported; unrestricted while loops and general multi-statement blocks are not included.
- The current runtime uses dimensionless numeric values for booleans and has only a small unit/operator set.
- This phase does not establish complete integration with the larger magic-system model.

## Next implementation step

Phase 7I should add a minimal, test-backed aggregation/reduction capability (for example, summing a list of quantities with dimension checks) or a safe immutable collection layer. This would make the results of bounded repetition directly useful rather than leaving all values as an output list. First review the existing project decision ledger for conflicting conventions; keep new syntax explicitly provisional until approved. Continue building before expanding audits.

~~~

## ARCANE_PHASE_7I_REPORT.md

- Type: MD
- SHA-256: `bc076646e6cbfd260e238d3597eaa592d952db6fd10ae007a0a95ce6ae6c6bbf`
- Extracted characters: 2647

~~~text
# Arcane Phase 7I — Bounded Aggregation

## Outcome

Phase 7I adds a usable aggregation operation to the reconstructed Phase 7H runtime. `KWAS` evaluates a numeric expression over an inclusive bounded integer range and sums the results into a named binding. The existing `KWAR` list-producing operation remains available. The full regression suite passes **40/40 tests**.

## Provisional syntax

```arcane
KWAS total FROM 1 TO 5 => FRAKA $total $total
KWAT total
```

The first line sums the squares 1² + 2² + 3² + 4² + 5² and binds `total` to `55 1`.

This spelling is an implementation convenience, not approved canonical Arcane vocabulary. It must be reconciled with the authoritative decision ledger and lexicon before canonisation.

## Semantics and safeguards

- Bounds are evaluated once in the surrounding scope, must be dimensionless integers, and are inclusive.
- The existing 1,000-iteration cap is enforced before evaluation.
- Each iteration uses an isolated scope, cleaned up even if evaluation fails.
- The expression must return numeric quantities. All results must have matching dimensions.
- The sum preserves the common dimension: summing metres returns metres.
- An empty range returns dimensionless zero (`0 1`). This is an explicit provisional convention; it cannot infer the dimension of a body that was never evaluated.
- The final sum is stored under the requested binding name. Duplicate bindings in the current scope are rejected.
- Existing `KWAR`, arithmetic, functions, logic, units and error behaviour remain covered by regression tests.

## Verification

Command: `python -m unittest -v`

Result: **40 tests passed** — 24 existing tests plus 16 aggregation tests. Coverage includes empty/single/multi-item ranges, sums of squares, function bodies, decimal results, dimension preservation, bounds validation, iteration caps, case-insensitivity, duplicate binding rejection and scope cleanup.

## Scope and limitations

This is a small reconstructed executable subset, not the full Arcane compiler or a claim that the grammar is canon. The current numeric model has three base dimensions and a limited unit/operator set. Empty aggregation currently returns dimensionless zero. General list literals, arbitrary collection reductions, mutable accumulators, and multi-statement blocks are not implemented.

## Next build step

Phase 7J should make the runtime easier to use and verify: add explicit value/result typing and stable error reporting, while checking all new syntax against the decision ledger before treating any spelling as canonical. Avoid reopening completed phases unless a concrete regression is found.

~~~

## ARCANE_PHASE_7J_REPORT 2.md

- Type: MD
- SHA-256: `e3c13d2dede27f35ab1b575b7653860b865f3345779a22b3046cede75fc7b765`
- Extracted characters: 2455

~~~text
# Arcane Phase 7J — Value Typing and Stable Diagnostics

## Outcome

Phase 7J delivers a tested diagnostics and descriptive value-typing module. It defines stable diagnostic codes, source spans, human-readable hints, safe mapping from common evaluator exceptions, and descriptive type metadata for numbers, booleans, strings, lists, functions, and unknown values. The new module passes **23/23 tests**.

## Stable error codes

| Code | Meaning |
|---|---|
| ARC-PARSE-001 | Parse error |
| ARC-NAME-001 | Unknown name or binding |
| ARC-NAME-002 | Duplicate binding |
| ARC-TYPE-001 | Type mismatch |
| ARC-UNIT-001 | Dimension/unit mismatch |
| ARC-LOOP-001 | Invalid repetition bounds |
| ARC-LOOP-002 | Iteration limit exceeded |
| ARC-MATH-001 | Division by zero |
| ARC-RUNTIME-001 | Call-depth limit |
| ARC-RUNTIME-999 | Unclassified runtime error |

These codes are stable API proposals for the runtime layer. They do not change Arcane language syntax.

## Value typing

`infer_type` distinguishes booleans from numbers (important in Python, where `bool` subclasses `int`), describes numeric dimensions when supplied, identifies functions and strings, and describes homogeneous or heterogeneous collections without coercing values. Empty and heterogeneous collections are reported as `list[unknown]` rather than guessed.

## Important integration boundary

The prior Phase 7H/7I runtime files were not present in the active workspace when this phase began; only the original `Arcana pack.zip` was available. Therefore this phase provides independently tested integration utilities rather than claiming to have wired them into a missing evaluator or rerun the prior 40-test suite. The supplied Phase 5 lexicon and decision ledger are included for reference, but the new error codes and helper module are not canonised language vocabulary.

## Verification

Command: `python -m unittest -v`

Result: **23 tests passed.** Tests cover stable rendering, source-span validation, exception mapping, safe fallback handling, type inference, dimensional descriptors, homogeneous/heterogeneous lists, booleans, functions, and typed values.

## Next build step

Restore the latest Phase 7I runtime package into the active workspace and integrate `diagnostic_for_exception` at the interactive-shell boundary. Then run both Phase 7I regression tests and the new Phase 7J tests together. Do not claim end-to-end integration until that combined suite is passing.

~~~

## ARCANE_PHASE_7J_REPORT 3.md

- Type: MD
- SHA-256: `e3c13d2dede27f35ab1b575b7653860b865f3345779a22b3046cede75fc7b765`
- Extracted characters: 2455

~~~text
# Arcane Phase 7J — Value Typing and Stable Diagnostics

## Outcome

Phase 7J delivers a tested diagnostics and descriptive value-typing module. It defines stable diagnostic codes, source spans, human-readable hints, safe mapping from common evaluator exceptions, and descriptive type metadata for numbers, booleans, strings, lists, functions, and unknown values. The new module passes **23/23 tests**.

## Stable error codes

| Code | Meaning |
|---|---|
| ARC-PARSE-001 | Parse error |
| ARC-NAME-001 | Unknown name or binding |
| ARC-NAME-002 | Duplicate binding |
| ARC-TYPE-001 | Type mismatch |
| ARC-UNIT-001 | Dimension/unit mismatch |
| ARC-LOOP-001 | Invalid repetition bounds |
| ARC-LOOP-002 | Iteration limit exceeded |
| ARC-MATH-001 | Division by zero |
| ARC-RUNTIME-001 | Call-depth limit |
| ARC-RUNTIME-999 | Unclassified runtime error |

These codes are stable API proposals for the runtime layer. They do not change Arcane language syntax.

## Value typing

`infer_type` distinguishes booleans from numbers (important in Python, where `bool` subclasses `int`), describes numeric dimensions when supplied, identifies functions and strings, and describes homogeneous or heterogeneous collections without coercing values. Empty and heterogeneous collections are reported as `list[unknown]` rather than guessed.

## Important integration boundary

The prior Phase 7H/7I runtime files were not present in the active workspace when this phase began; only the original `Arcana pack.zip` was available. Therefore this phase provides independently tested integration utilities rather than claiming to have wired them into a missing evaluator or rerun the prior 40-test suite. The supplied Phase 5 lexicon and decision ledger are included for reference, but the new error codes and helper module are not canonised language vocabulary.

## Verification

Command: `python -m unittest -v`

Result: **23 tests passed.** Tests cover stable rendering, source-span validation, exception mapping, safe fallback handling, type inference, dimensional descriptors, homogeneous/heterogeneous lists, booleans, functions, and typed values.

## Next build step

Restore the latest Phase 7I runtime package into the active workspace and integrate `diagnostic_for_exception` at the interactive-shell boundary. Then run both Phase 7I regression tests and the new Phase 7J tests together. Do not claim end-to-end integration until that combined suite is passing.

~~~

## ARCANE_PHASE_7J_REPORT 4.md

- Type: MD
- SHA-256: `e3c13d2dede27f35ab1b575b7653860b865f3345779a22b3046cede75fc7b765`
- Extracted characters: 2455

~~~text
# Arcane Phase 7J — Value Typing and Stable Diagnostics

## Outcome

Phase 7J delivers a tested diagnostics and descriptive value-typing module. It defines stable diagnostic codes, source spans, human-readable hints, safe mapping from common evaluator exceptions, and descriptive type metadata for numbers, booleans, strings, lists, functions, and unknown values. The new module passes **23/23 tests**.

## Stable error codes

| Code | Meaning |
|---|---|
| ARC-PARSE-001 | Parse error |
| ARC-NAME-001 | Unknown name or binding |
| ARC-NAME-002 | Duplicate binding |
| ARC-TYPE-001 | Type mismatch |
| ARC-UNIT-001 | Dimension/unit mismatch |
| ARC-LOOP-001 | Invalid repetition bounds |
| ARC-LOOP-002 | Iteration limit exceeded |
| ARC-MATH-001 | Division by zero |
| ARC-RUNTIME-001 | Call-depth limit |
| ARC-RUNTIME-999 | Unclassified runtime error |

These codes are stable API proposals for the runtime layer. They do not change Arcane language syntax.

## Value typing

`infer_type` distinguishes booleans from numbers (important in Python, where `bool` subclasses `int`), describes numeric dimensions when supplied, identifies functions and strings, and describes homogeneous or heterogeneous collections without coercing values. Empty and heterogeneous collections are reported as `list[unknown]` rather than guessed.

## Important integration boundary

The prior Phase 7H/7I runtime files were not present in the active workspace when this phase began; only the original `Arcana pack.zip` was available. Therefore this phase provides independently tested integration utilities rather than claiming to have wired them into a missing evaluator or rerun the prior 40-test suite. The supplied Phase 5 lexicon and decision ledger are included for reference, but the new error codes and helper module are not canonised language vocabulary.

## Verification

Command: `python -m unittest -v`

Result: **23 tests passed.** Tests cover stable rendering, source-span validation, exception mapping, safe fallback handling, type inference, dimensional descriptors, homogeneous/heterogeneous lists, booleans, functions, and typed values.

## Next build step

Restore the latest Phase 7I runtime package into the active workspace and integrate `diagnostic_for_exception` at the interactive-shell boundary. Then run both Phase 7I regression tests and the new Phase 7J tests together. Do not claim end-to-end integration until that combined suite is passing.

~~~

## ARCANE_PHASE_7J_REPORT.md

- Type: MD
- SHA-256: `e3c13d2dede27f35ab1b575b7653860b865f3345779a22b3046cede75fc7b765`
- Extracted characters: 2455

~~~text
# Arcane Phase 7J — Value Typing and Stable Diagnostics

## Outcome

Phase 7J delivers a tested diagnostics and descriptive value-typing module. It defines stable diagnostic codes, source spans, human-readable hints, safe mapping from common evaluator exceptions, and descriptive type metadata for numbers, booleans, strings, lists, functions, and unknown values. The new module passes **23/23 tests**.

## Stable error codes

| Code | Meaning |
|---|---|
| ARC-PARSE-001 | Parse error |
| ARC-NAME-001 | Unknown name or binding |
| ARC-NAME-002 | Duplicate binding |
| ARC-TYPE-001 | Type mismatch |
| ARC-UNIT-001 | Dimension/unit mismatch |
| ARC-LOOP-001 | Invalid repetition bounds |
| ARC-LOOP-002 | Iteration limit exceeded |
| ARC-MATH-001 | Division by zero |
| ARC-RUNTIME-001 | Call-depth limit |
| ARC-RUNTIME-999 | Unclassified runtime error |

These codes are stable API proposals for the runtime layer. They do not change Arcane language syntax.

## Value typing

`infer_type` distinguishes booleans from numbers (important in Python, where `bool` subclasses `int`), describes numeric dimensions when supplied, identifies functions and strings, and describes homogeneous or heterogeneous collections without coercing values. Empty and heterogeneous collections are reported as `list[unknown]` rather than guessed.

## Important integration boundary

The prior Phase 7H/7I runtime files were not present in the active workspace when this phase began; only the original `Arcana pack.zip` was available. Therefore this phase provides independently tested integration utilities rather than claiming to have wired them into a missing evaluator or rerun the prior 40-test suite. The supplied Phase 5 lexicon and decision ledger are included for reference, but the new error codes and helper module are not canonised language vocabulary.

## Verification

Command: `python -m unittest -v`

Result: **23 tests passed.** Tests cover stable rendering, source-span validation, exception mapping, safe fallback handling, type inference, dimensional descriptors, homogeneous/heterogeneous lists, booleans, functions, and typed values.

## Next build step

Restore the latest Phase 7I runtime package into the active workspace and integrate `diagnostic_for_exception` at the interactive-shell boundary. Then run both Phase 7I regression tests and the new Phase 7J tests together. Do not claim end-to-end integration until that combined suite is passing.

~~~

## ARCANE_PHASE_7K_REPORT 2.md

- Type: MD
- SHA-256: `2ac78fa868651d515ab90c88e5ed3c8ac192aaaa413b49ac6c54c0fa1082b2ca`
- Extracted characters: 1792

~~~text
# Arcane Phase 7K — Runtime Diagnostic Adapter

## Delivered

Phase 7K adds `arcane_runtime_adapter.py`, a small adapter that connects any existing evaluator callable to the Phase 7J diagnostic catalogue and descriptive type system. It returns a structured `EvaluationResult`, preserves already-structured Arcane diagnostics, maps common exceptions to stable codes, attaches source positions, avoids traceback leakage in user-facing messages, and offers `require_success` for callers that prefer exceptions.

## Verification

- 33/33 combined tests passed: 23 Phase 7J diagnostic/type tests and 10 adapter integration tests.
- Python standard library only.
- The adapter's dimensions argument is metadata supplied by the caller; it does not perform unit arithmetic or infer dimensions from an evaluator-specific quantity class.

## Integration boundary / limitation

The prior provisional Phase 7H/7I evaluator source was not available in the active workspace. Therefore this phase provides and tests an integration adapter, but does not claim the adapter has been wired into the missing evaluator or that bounded repetition/aggregation have been regression-tested here. The user's supplied `Arcana pack.zip` contains historical language-audit assets and a Phase 5 lexicon generator, not the Phase 7H/7I runtime.

## Compatibility and canonical language

No Arcane syntax, spelling, grammar, or canonical vocabulary is changed by this phase. Diagnostic codes and type descriptors are implementation utilities, not language vocabulary decisions.

## Next build-forward step

Recover the actual latest Phase 7I runtime package into the workspace, wire `evaluate_safely` into its session/evaluator boundary, and run the complete runtime regression suite plus these adapter tests in one package.

~~~

## ARCANE_PHASE_7K_REPORT 3.md

- Type: MD
- SHA-256: `2ac78fa868651d515ab90c88e5ed3c8ac192aaaa413b49ac6c54c0fa1082b2ca`
- Extracted characters: 1792

~~~text
# Arcane Phase 7K — Runtime Diagnostic Adapter

## Delivered

Phase 7K adds `arcane_runtime_adapter.py`, a small adapter that connects any existing evaluator callable to the Phase 7J diagnostic catalogue and descriptive type system. It returns a structured `EvaluationResult`, preserves already-structured Arcane diagnostics, maps common exceptions to stable codes, attaches source positions, avoids traceback leakage in user-facing messages, and offers `require_success` for callers that prefer exceptions.

## Verification

- 33/33 combined tests passed: 23 Phase 7J diagnostic/type tests and 10 adapter integration tests.
- Python standard library only.
- The adapter's dimensions argument is metadata supplied by the caller; it does not perform unit arithmetic or infer dimensions from an evaluator-specific quantity class.

## Integration boundary / limitation

The prior provisional Phase 7H/7I evaluator source was not available in the active workspace. Therefore this phase provides and tests an integration adapter, but does not claim the adapter has been wired into the missing evaluator or that bounded repetition/aggregation have been regression-tested here. The user's supplied `Arcana pack.zip` contains historical language-audit assets and a Phase 5 lexicon generator, not the Phase 7H/7I runtime.

## Compatibility and canonical language

No Arcane syntax, spelling, grammar, or canonical vocabulary is changed by this phase. Diagnostic codes and type descriptors are implementation utilities, not language vocabulary decisions.

## Next build-forward step

Recover the actual latest Phase 7I runtime package into the workspace, wire `evaluate_safely` into its session/evaluator boundary, and run the complete runtime regression suite plus these adapter tests in one package.

~~~

## ARCANE_PHASE_7K_REPORT.md

- Type: MD
- SHA-256: `2ac78fa868651d515ab90c88e5ed3c8ac192aaaa413b49ac6c54c0fa1082b2ca`
- Extracted characters: 1792

~~~text
# Arcane Phase 7K — Runtime Diagnostic Adapter

## Delivered

Phase 7K adds `arcane_runtime_adapter.py`, a small adapter that connects any existing evaluator callable to the Phase 7J diagnostic catalogue and descriptive type system. It returns a structured `EvaluationResult`, preserves already-structured Arcane diagnostics, maps common exceptions to stable codes, attaches source positions, avoids traceback leakage in user-facing messages, and offers `require_success` for callers that prefer exceptions.

## Verification

- 33/33 combined tests passed: 23 Phase 7J diagnostic/type tests and 10 adapter integration tests.
- Python standard library only.
- The adapter's dimensions argument is metadata supplied by the caller; it does not perform unit arithmetic or infer dimensions from an evaluator-specific quantity class.

## Integration boundary / limitation

The prior provisional Phase 7H/7I evaluator source was not available in the active workspace. Therefore this phase provides and tests an integration adapter, but does not claim the adapter has been wired into the missing evaluator or that bounded repetition/aggregation have been regression-tested here. The user's supplied `Arcana pack.zip` contains historical language-audit assets and a Phase 5 lexicon generator, not the Phase 7H/7I runtime.

## Compatibility and canonical language

No Arcane syntax, spelling, grammar, or canonical vocabulary is changed by this phase. Diagnostic codes and type descriptors are implementation utilities, not language vocabulary decisions.

## Next build-forward step

Recover the actual latest Phase 7I runtime package into the workspace, wire `evaluate_safely` into its session/evaluator boundary, and run the complete runtime regression suite plus these adapter tests in one package.

~~~

## ARCANE_PHASE_7L_REPORT 2.md

- Type: MD
- SHA-256: `437a7bbb6674dea6b0f89e600b28b512ad7879cb401adc999f934621756566ad`
- Extracted characters: 1459

~~~text
# Arcane Phase 7L — Runnable Runtime Consolidation

## Delivered

This phase adds a small runnable expression runtime that uses the Phase 7J diagnostic catalogue and Phase 7K adapter utilities. It supports numeric quantities, a small provisional unit table, prefix arithmetic, comparisons, logical operators, parentheses, named bindings (`KWAM name => expression`) and binding lookup (`KWAT name`). Diagnostics are raised as `ArcaneDiagnosticError` for expression evaluation, and line-level commands return structured diagnostic results on command failures.

## Verification

The complete packaged test suite was run with `python -m unittest -v`: **54 tests passed** across diagnostics, adapter and runtime tests.

## Scope and limitations

This is a runnable, deliberately small subset, not a complete Arcane implementation. It does not yet integrate the earlier Phase 7H/7I `KWAR` bounded repetition and `KWAS` bounded aggregation constructs, nor functions or the complete unit/conversion system. Prefix operator names and the statement forms `KWAM`/`KWAT` remain provisional until verified against the authoritative decision ledger and canonical grammar. Logical operators currently evaluate both operands; short-circuit behaviour is not promised by this subset. No claim is made that this is a release-ready full language implementation.

## Run

From this directory:

```bash
python -m unittest -v
python arcane_cli.py
```

Python standard library only.

~~~

## ARCANE_PHASE_7L_REPORT.md

- Type: MD
- SHA-256: `437a7bbb6674dea6b0f89e600b28b512ad7879cb401adc999f934621756566ad`
- Extracted characters: 1459

~~~text
# Arcane Phase 7L — Runnable Runtime Consolidation

## Delivered

This phase adds a small runnable expression runtime that uses the Phase 7J diagnostic catalogue and Phase 7K adapter utilities. It supports numeric quantities, a small provisional unit table, prefix arithmetic, comparisons, logical operators, parentheses, named bindings (`KWAM name => expression`) and binding lookup (`KWAT name`). Diagnostics are raised as `ArcaneDiagnosticError` for expression evaluation, and line-level commands return structured diagnostic results on command failures.

## Verification

The complete packaged test suite was run with `python -m unittest -v`: **54 tests passed** across diagnostics, adapter and runtime tests.

## Scope and limitations

This is a runnable, deliberately small subset, not a complete Arcane implementation. It does not yet integrate the earlier Phase 7H/7I `KWAR` bounded repetition and `KWAS` bounded aggregation constructs, nor functions or the complete unit/conversion system. Prefix operator names and the statement forms `KWAM`/`KWAT` remain provisional until verified against the authoritative decision ledger and canonical grammar. Logical operators currently evaluate both operands; short-circuit behaviour is not promised by this subset. No claim is made that this is a release-ready full language implementation.

## Run

From this directory:

```bash
python -m unittest -v
python arcane_cli.py
```

Python standard library only.

~~~

## ARCANE_PHASE_7M_REPORT.md

- Type: MD
- SHA-256: `14263db79f8734a43ccd0a5d2308e4c58b1e21cb31ff71513bd4cee0ee6b7af3`
- Extracted characters: 1879

~~~text
# Arcane Phase 7M — Runtime Integration

## Delivered

Phase 7M restores bounded repetition and bounded aggregation to the runnable Phase 7L subset and implements true short-circuit evaluation for `FRAND` and `FROR`.

Supported provisional forms:

- `KWAR i FROM 1 TO 3 => FRATA $i $i` returns a list of per-iteration results.
- `KWAS total FROM 1 TO 5 => $total` returns the sum (15).
- Iteration variables are local to each evaluation and do not leak into global bindings.
- Inclusive integer bounds are required, with an iteration cap.
- Aggregation preserves the result dimensions and rejects mixed dimensions/non-numeric values.
- Empty repetition returns an empty list; empty aggregation returns dimensionless zero as a provisional convention.
- `FRAND` and `FROR` parse but do not evaluate an unused operand, so a short-circuited unknown name does not cause an error.
- Diagnostic mapping prioritises invalid bounds over generic dimension wording.

## Verification

`python -m unittest -v`: **65 tests passed** across diagnostics, adapter, runtime, repetition, aggregation and short-circuit logic.

Manual smoke checks:

- `KWAR i FROM 1 TO 3 => FRATA $i $i` -> `[1, 4, 9]` (as dimensionless quantities)
- `KWAS total FROM 1 TO 5 => $total` -> `15`
- `FRAND 0 $missing` -> `False`
- `FROR 1 $missing` -> `True`

## Limitations

This remains a compact runnable subset, not the full Arcane language. The statement and operator spellings are provisional until confirmed against the authoritative grammar/decision ledger. Function definitions/calls, a full parser, canonical vocabulary validation, richer source spans and complete unit conversions remain outstanding. The earlier evaluator source was unavailable, so this phase reimplements the bounded constructs against the currently available Phase 7L runtime rather than claiming byte-for-byte restoration of Phase 7H/7I.

~~~

## ARCANE_PHASE_7N_REPORT 2.md

- Type: MD
- SHA-256: `b46e6370eafacf74ac0f4738e3c0a30b88dbf6d9d39e0c0b8566277aca1df51d`
- Extracted characters: 1805

~~~text
# Arcane Phase 7N — User-Defined Functions

## Delivered

Phase 7N adds user-defined functions to the compact runnable Arcane subset. Functions have named parameters, local parameter bindings, return the value of their expression body, can call other functions, and support recursive calls guarded by a configurable maximum call depth.

Provisional syntax:

```text
KWAF square(x) => FRATA $x $x
square(4)
KWAF add(x, y) => FRAPA $x $y
add(4, 5)
```

Function parameters are local to a call and do not create global bindings. The runtime checks arity, duplicate function names, duplicate parameters, unknown names during evaluation, dimensional operations, and call-depth limits. Functions can be used in bounded repetition and aggregation expressions.

## Verification

`python -m unittest -v`: **21 tests passed**. Tests cover function declaration/calls, multiple parameters, nesting, local scope, wrong arity, duplicate declarations/parameters, units, recursion limits, integration with repetition and aggregation, diagnostics, and short-circuit logic.

## Limits and honesty

This is still a small executable subset, not a complete Arcane implementation. `KWAF` and call syntax are provisional implementation choices, not canonised language grammar. Function bodies are validated when called rather than fully type-checked at declaration. The active workspace only contained the supplied historical Arcana pack; the earlier Phase 7M runtime archive was not present, so this package is a consolidated reconstruction based on the implemented subset described in the project conversation, not a claim of exact source recovery. The supplied draft lexicon is included as a reference, not treated as proof that provisional syntax is approved.

## Run

```bash
python arcane_cli.py
python -m unittest -v
```

~~~

## ARCANE_PHASE_7N_REPORT 3.md

- Type: MD
- SHA-256: `b46e6370eafacf74ac0f4738e3c0a30b88dbf6d9d39e0c0b8566277aca1df51d`
- Extracted characters: 1805

~~~text
# Arcane Phase 7N — User-Defined Functions

## Delivered

Phase 7N adds user-defined functions to the compact runnable Arcane subset. Functions have named parameters, local parameter bindings, return the value of their expression body, can call other functions, and support recursive calls guarded by a configurable maximum call depth.

Provisional syntax:

```text
KWAF square(x) => FRATA $x $x
square(4)
KWAF add(x, y) => FRAPA $x $y
add(4, 5)
```

Function parameters are local to a call and do not create global bindings. The runtime checks arity, duplicate function names, duplicate parameters, unknown names during evaluation, dimensional operations, and call-depth limits. Functions can be used in bounded repetition and aggregation expressions.

## Verification

`python -m unittest -v`: **21 tests passed**. Tests cover function declaration/calls, multiple parameters, nesting, local scope, wrong arity, duplicate declarations/parameters, units, recursion limits, integration with repetition and aggregation, diagnostics, and short-circuit logic.

## Limits and honesty

This is still a small executable subset, not a complete Arcane implementation. `KWAF` and call syntax are provisional implementation choices, not canonised language grammar. Function bodies are validated when called rather than fully type-checked at declaration. The active workspace only contained the supplied historical Arcana pack; the earlier Phase 7M runtime archive was not present, so this package is a consolidated reconstruction based on the implemented subset described in the project conversation, not a claim of exact source recovery. The supplied draft lexicon is included as a reference, not treated as proof that provisional syntax is approved.

## Run

```bash
python arcane_cli.py
python -m unittest -v
```

~~~

## ARCANE_PHASE_7N_REPORT 4.md

- Type: MD
- SHA-256: `b46e6370eafacf74ac0f4738e3c0a30b88dbf6d9d39e0c0b8566277aca1df51d`
- Extracted characters: 1805

~~~text
# Arcane Phase 7N — User-Defined Functions

## Delivered

Phase 7N adds user-defined functions to the compact runnable Arcane subset. Functions have named parameters, local parameter bindings, return the value of their expression body, can call other functions, and support recursive calls guarded by a configurable maximum call depth.

Provisional syntax:

```text
KWAF square(x) => FRATA $x $x
square(4)
KWAF add(x, y) => FRAPA $x $y
add(4, 5)
```

Function parameters are local to a call and do not create global bindings. The runtime checks arity, duplicate function names, duplicate parameters, unknown names during evaluation, dimensional operations, and call-depth limits. Functions can be used in bounded repetition and aggregation expressions.

## Verification

`python -m unittest -v`: **21 tests passed**. Tests cover function declaration/calls, multiple parameters, nesting, local scope, wrong arity, duplicate declarations/parameters, units, recursion limits, integration with repetition and aggregation, diagnostics, and short-circuit logic.

## Limits and honesty

This is still a small executable subset, not a complete Arcane implementation. `KWAF` and call syntax are provisional implementation choices, not canonised language grammar. Function bodies are validated when called rather than fully type-checked at declaration. The active workspace only contained the supplied historical Arcana pack; the earlier Phase 7M runtime archive was not present, so this package is a consolidated reconstruction based on the implemented subset described in the project conversation, not a claim of exact source recovery. The supplied draft lexicon is included as a reference, not treated as proof that provisional syntax is approved.

## Run

```bash
python arcane_cli.py
python -m unittest -v
```

~~~

## ARCANE_PHASE_7N_REPORT.md

- Type: MD
- SHA-256: `b46e6370eafacf74ac0f4738e3c0a30b88dbf6d9d39e0c0b8566277aca1df51d`
- Extracted characters: 1805

~~~text
# Arcane Phase 7N — User-Defined Functions

## Delivered

Phase 7N adds user-defined functions to the compact runnable Arcane subset. Functions have named parameters, local parameter bindings, return the value of their expression body, can call other functions, and support recursive calls guarded by a configurable maximum call depth.

Provisional syntax:

```text
KWAF square(x) => FRATA $x $x
square(4)
KWAF add(x, y) => FRAPA $x $y
add(4, 5)
```

Function parameters are local to a call and do not create global bindings. The runtime checks arity, duplicate function names, duplicate parameters, unknown names during evaluation, dimensional operations, and call-depth limits. Functions can be used in bounded repetition and aggregation expressions.

## Verification

`python -m unittest -v`: **21 tests passed**. Tests cover function declaration/calls, multiple parameters, nesting, local scope, wrong arity, duplicate declarations/parameters, units, recursion limits, integration with repetition and aggregation, diagnostics, and short-circuit logic.

## Limits and honesty

This is still a small executable subset, not a complete Arcane implementation. `KWAF` and call syntax are provisional implementation choices, not canonised language grammar. Function bodies are validated when called rather than fully type-checked at declaration. The active workspace only contained the supplied historical Arcana pack; the earlier Phase 7M runtime archive was not present, so this package is a consolidated reconstruction based on the implemented subset described in the project conversation, not a claim of exact source recovery. The supplied draft lexicon is included as a reference, not treated as proof that provisional syntax is approved.

## Run

```bash
python arcane_cli.py
python -m unittest -v
```

~~~

## ARCANE_PHASE_7O_REPORT 2.md

- Type: MD
- SHA-256: `ee0ad8eeac38f755adb16d2230686e20832ca93e3a210dbfc9fc7e31a77f58b1`
- Extracted characters: 1819

~~~text
# Arcane Phase 7O — Control Flow and Program Composition

## Delivered

Phase 7O extends the reconstructed runnable subset from Phase 7N with:

- **Conditional selection:** `KWAI condition THEN expression ELSE expression` evaluates the condition and runs only the selected branch.
- **Multi-line programs:** `ArcaneRuntime.run_program(source)` executes newline-separated statements in order, skips blank lines and full-line comments beginning with `#`, and returns the results.
- **Stop-on-error behaviour:** a diagnostic stops program execution immediately, includes the source line number, and prevents later statements from running.
- **Regression coverage:** all prior function, arithmetic, units, repetition, aggregation, diagnostics and safety-limit tests remain, with new tests for conditionals and multi-line execution.

## Examples

```arcane
KWAM score => 8
KWAI FRAGT $score 5 THEN FRAPA $score 2 ELSE 0
```

The conditional result is `10`.

```arcane
# small multi-step program
KWAM width => 4
KWAM height => 3
KWAM area => FRATA $width $height
KWAT area
```

`run_program` returns a list of statement results; the final result is `12`.

## Validation

Run `python -m unittest -v` from this directory. Phase 7O suite: **28 tests passed**.

## Important status and limitations

This is a **reconstructed, provisional executable subset**, not a claim that the whole Arcane language is complete. `KWAI` and the `THEN`/`ELSE` form are provisional implementation syntax, not canonical language decisions. Conditional branches currently accept expressions, not nested statement blocks; `run_program` currently has no indentation-based blocks, loops over statements, imports, or file/module system. The grammar and spelling must be reconciled with the canonical Arcane language ledger before declaring them final.

~~~

## ARCANE_PHASE_7O_REPORT 3.md

- Type: MD
- SHA-256: `ee0ad8eeac38f755adb16d2230686e20832ca93e3a210dbfc9fc7e31a77f58b1`
- Extracted characters: 1819

~~~text
# Arcane Phase 7O — Control Flow and Program Composition

## Delivered

Phase 7O extends the reconstructed runnable subset from Phase 7N with:

- **Conditional selection:** `KWAI condition THEN expression ELSE expression` evaluates the condition and runs only the selected branch.
- **Multi-line programs:** `ArcaneRuntime.run_program(source)` executes newline-separated statements in order, skips blank lines and full-line comments beginning with `#`, and returns the results.
- **Stop-on-error behaviour:** a diagnostic stops program execution immediately, includes the source line number, and prevents later statements from running.
- **Regression coverage:** all prior function, arithmetic, units, repetition, aggregation, diagnostics and safety-limit tests remain, with new tests for conditionals and multi-line execution.

## Examples

```arcane
KWAM score => 8
KWAI FRAGT $score 5 THEN FRAPA $score 2 ELSE 0
```

The conditional result is `10`.

```arcane
# small multi-step program
KWAM width => 4
KWAM height => 3
KWAM area => FRATA $width $height
KWAT area
```

`run_program` returns a list of statement results; the final result is `12`.

## Validation

Run `python -m unittest -v` from this directory. Phase 7O suite: **28 tests passed**.

## Important status and limitations

This is a **reconstructed, provisional executable subset**, not a claim that the whole Arcane language is complete. `KWAI` and the `THEN`/`ELSE` form are provisional implementation syntax, not canonical language decisions. Conditional branches currently accept expressions, not nested statement blocks; `run_program` currently has no indentation-based blocks, loops over statements, imports, or file/module system. The grammar and spelling must be reconciled with the canonical Arcane language ledger before declaring them final.

~~~

## ARCANE_PHASE_7O_REPORT.md

- Type: MD
- SHA-256: `ee0ad8eeac38f755adb16d2230686e20832ca93e3a210dbfc9fc7e31a77f58b1`
- Extracted characters: 1819

~~~text
# Arcane Phase 7O — Control Flow and Program Composition

## Delivered

Phase 7O extends the reconstructed runnable subset from Phase 7N with:

- **Conditional selection:** `KWAI condition THEN expression ELSE expression` evaluates the condition and runs only the selected branch.
- **Multi-line programs:** `ArcaneRuntime.run_program(source)` executes newline-separated statements in order, skips blank lines and full-line comments beginning with `#`, and returns the results.
- **Stop-on-error behaviour:** a diagnostic stops program execution immediately, includes the source line number, and prevents later statements from running.
- **Regression coverage:** all prior function, arithmetic, units, repetition, aggregation, diagnostics and safety-limit tests remain, with new tests for conditionals and multi-line execution.

## Examples

```arcane
KWAM score => 8
KWAI FRAGT $score 5 THEN FRAPA $score 2 ELSE 0
```

The conditional result is `10`.

```arcane
# small multi-step program
KWAM width => 4
KWAM height => 3
KWAM area => FRATA $width $height
KWAT area
```

`run_program` returns a list of statement results; the final result is `12`.

## Validation

Run `python -m unittest -v` from this directory. Phase 7O suite: **28 tests passed**.

## Important status and limitations

This is a **reconstructed, provisional executable subset**, not a claim that the whole Arcane language is complete. `KWAI` and the `THEN`/`ELSE` form are provisional implementation syntax, not canonical language decisions. Conditional branches currently accept expressions, not nested statement blocks; `run_program` currently has no indentation-based blocks, loops over statements, imports, or file/module system. The grammar and spelling must be reconciled with the canonical Arcane language ledger before declaring them final.

~~~

## ARCANE_PHASE_7P_REPORT 2.md

- Type: MD
- SHA-256: `69bc9af52e5a4bc2450d6d30fb3460cb5b2ca48f321baded490d22259fdaef33`
- Extracted characters: 1645

~~~text
# Arcane Phase 7P — Structured Blocks and Program Flow

## Delivered
- Added multi-line `KWAI condition THEN` / optional `ELSE` / `END` blocks.
- Supports multiple statements within each branch and nested conditional blocks.
- Only the selected branch executes; the unselected branch is parsed for structure but not evaluated.
- Introduced block-local binding scopes. Bindings created inside a branch are available to later statements in that branch and do not leak after the block.
- Preserved the Phase 7N/7O expression, function, loop, aggregation, inline-conditional, and diagnostic behaviour.
- Added malformed block, nesting, scope and source-line regression tests.

## Provisional example
```arcane
KWAM score => 8
KWAI FRAGT $score 5 THEN
  KWAM bonus => 2
  KWAM answer => FRAPA $score $bonus
  KWAT answer
ELSE
  KWAM answer => 0
  KWAT answer
END
```
The selected branch emits results for each executed statement; its final value is 10. `bonus` and `answer` are scoped to the branch.

## Validation
The standard-library unittest suite passes 35 tests. The exact run is recorded in `PHASE_7P_TEST_OUTPUT.txt`.

## Limitations and compatibility
All keywords and grammar forms in this runtime remain provisional implementation syntax, not canonical Arcane decisions. This phase adds structured conditional blocks, not general-purpose loops over statement blocks, modules, exception handling, or a complete parser/compiler. Function definitions remain registered at runtime level rather than being lexically scoped inside branches. Scope semantics should be reviewed against the canonical language decisions before being declared stable.

~~~

## ARCANE_PHASE_7P_REPORT.md

- Type: MD
- SHA-256: `69bc9af52e5a4bc2450d6d30fb3460cb5b2ca48f321baded490d22259fdaef33`
- Extracted characters: 1645

~~~text
# Arcane Phase 7P — Structured Blocks and Program Flow

## Delivered
- Added multi-line `KWAI condition THEN` / optional `ELSE` / `END` blocks.
- Supports multiple statements within each branch and nested conditional blocks.
- Only the selected branch executes; the unselected branch is parsed for structure but not evaluated.
- Introduced block-local binding scopes. Bindings created inside a branch are available to later statements in that branch and do not leak after the block.
- Preserved the Phase 7N/7O expression, function, loop, aggregation, inline-conditional, and diagnostic behaviour.
- Added malformed block, nesting, scope and source-line regression tests.

## Provisional example
```arcane
KWAM score => 8
KWAI FRAGT $score 5 THEN
  KWAM bonus => 2
  KWAM answer => FRAPA $score $bonus
  KWAT answer
ELSE
  KWAM answer => 0
  KWAT answer
END
```
The selected branch emits results for each executed statement; its final value is 10. `bonus` and `answer` are scoped to the branch.

## Validation
The standard-library unittest suite passes 35 tests. The exact run is recorded in `PHASE_7P_TEST_OUTPUT.txt`.

## Limitations and compatibility
All keywords and grammar forms in this runtime remain provisional implementation syntax, not canonical Arcane decisions. This phase adds structured conditional blocks, not general-purpose loops over statement blocks, modules, exception handling, or a complete parser/compiler. Function definitions remain registered at runtime level rather than being lexically scoped inside branches. Scope semantics should be reviewed against the canonical language decisions before being declared stable.

~~~

## ARCANE_PHASE_7Q_REPORT.md

- Type: MD
- SHA-256: `48c35a497553d72e6d754c62ecca2caddc012f2e9c06c28f701e9f8810197b5c`
- Extracted characters: 2130

~~~text
# Arcane Phase 7Q — Parser Consolidation and File-Based Execution

## Outcome
Phase 7Q replaces the duplicated conditional parsing/execution paths in `ArcaneRuntime.run_program` with one recursive structured parser and a separate execution pass. It also adds CLI file execution.

## Delivered
- A single recursive parser builds a small internal tree for statements and `KWAI` conditional blocks.
- The entire source is parsed before execution begins. A malformed later block therefore does not leave earlier bindings partially applied.
- Execution only evaluates the selected conditional branch.
- Nested blocks preserve branch-local binding scopes.
- Runtime diagnostics preserve original source line numbers, including blank lines and comments.
- CLI supports `python arcane_cli.py path/to/program.arc`; interactive mode remains available.
- Added `phase7q_example.arc` as a runnable demonstration.

## Validation
- `python -m unittest -v`: 40 tests passed.
- CLI smoke test: `python arcane_cli.py phase7q_example.arc` completed and produced the expected square result (49).
- The ZIP archive was checked with `unzip -t` after packaging.

## Known limitations
- This remains a reconstructed subset. Keyword spellings and grammar are provisional, not canonical language decisions.
- The parser is a focused recursive parser for line-oriented statements and conditional blocks, not yet a full token-based grammar for every language construct.
- Function declarations currently register in the runtime's function table rather than following conditional-block lexical scope. Function declaration scope needs a separate design and tests.
- Unit values are represented internally by dimensional tuples; display formatting is still developer-oriented.

## Run
From the extracted `arcane_phase7n` directory:

```bash
python -m unittest -v
python arcane_cli.py phase7q_example.arc
python arcane_cli.py
```

## Phase principle
This phase improves usability by simplifying program execution and enabling repeatable source files. It is not intended to imply that Arcane is complete or that provisional syntax has been canonically approved.

~~~

## ARCANE_PHASE_7R_REPORT 2.md

- Type: MD
- SHA-256: `84293b2273e26d219edf3b165a0e2d32e550664b60897b47ed158b491169c144`
- Extracted characters: 1479

~~~text
# Arcane Phase 7R — Syntax Checking and Developer Tooling

## Delivered
- Added `arcane_check.py`, a standalone static checker for the reconstructed, provisional line-oriented Arcane subset.
- Added `arcane_cli.py` with file-based syntax checking, readable diagnostics, and meaningful process exit codes (0 for valid input, 1 for errors).
- Checks conditional block balance, missing/unexpected `END`, `ELSE` without a block, duplicate `ELSE`, malformed block headers, and common statement shapes.
- Preserves original source line numbers, including blank lines and comments.
- Added valid and invalid `.arc` examples plus unit tests.

## Validation
- `python -m unittest -v`: 10 tests passed.
- Valid example exits with status 0.
- Invalid example reports malformed block structure and exits nonzero.

## Important scope note
The Phase 7Q runtime package was not present in the active workspace; only the historical `Arcana pack.zip` was available. Accordingly, Phase 7R is delivered as a standalone static-checking tool, not as an update to a verified Phase 7Q runtime. It does **not** execute programs or type-check/evaluate expressions. Its accepted statement patterns are intentionally approximate and syntax remains provisional. This checker must not be mistaken for the canonical Arcane parser or a guarantee that a program will execute successfully.

## Run
```bash
python -m unittest -v
python arcane_cli.py example_valid.arc
python arcane_cli.py example_invalid.arc
```

~~~

## ARCANE_PHASE_7R_REPORT 3.md

- Type: MD
- SHA-256: `84293b2273e26d219edf3b165a0e2d32e550664b60897b47ed158b491169c144`
- Extracted characters: 1479

~~~text
# Arcane Phase 7R — Syntax Checking and Developer Tooling

## Delivered
- Added `arcane_check.py`, a standalone static checker for the reconstructed, provisional line-oriented Arcane subset.
- Added `arcane_cli.py` with file-based syntax checking, readable diagnostics, and meaningful process exit codes (0 for valid input, 1 for errors).
- Checks conditional block balance, missing/unexpected `END`, `ELSE` without a block, duplicate `ELSE`, malformed block headers, and common statement shapes.
- Preserves original source line numbers, including blank lines and comments.
- Added valid and invalid `.arc` examples plus unit tests.

## Validation
- `python -m unittest -v`: 10 tests passed.
- Valid example exits with status 0.
- Invalid example reports malformed block structure and exits nonzero.

## Important scope note
The Phase 7Q runtime package was not present in the active workspace; only the historical `Arcana pack.zip` was available. Accordingly, Phase 7R is delivered as a standalone static-checking tool, not as an update to a verified Phase 7Q runtime. It does **not** execute programs or type-check/evaluate expressions. Its accepted statement patterns are intentionally approximate and syntax remains provisional. This checker must not be mistaken for the canonical Arcane parser or a guarantee that a program will execute successfully.

## Run
```bash
python -m unittest -v
python arcane_cli.py example_valid.arc
python arcane_cli.py example_invalid.arc
```

~~~

## ARCANE_PHASE_7R_REPORT.md

- Type: MD
- SHA-256: `84293b2273e26d219edf3b165a0e2d32e550664b60897b47ed158b491169c144`
- Extracted characters: 1479

~~~text
# Arcane Phase 7R — Syntax Checking and Developer Tooling

## Delivered
- Added `arcane_check.py`, a standalone static checker for the reconstructed, provisional line-oriented Arcane subset.
- Added `arcane_cli.py` with file-based syntax checking, readable diagnostics, and meaningful process exit codes (0 for valid input, 1 for errors).
- Checks conditional block balance, missing/unexpected `END`, `ELSE` without a block, duplicate `ELSE`, malformed block headers, and common statement shapes.
- Preserves original source line numbers, including blank lines and comments.
- Added valid and invalid `.arc` examples plus unit tests.

## Validation
- `python -m unittest -v`: 10 tests passed.
- Valid example exits with status 0.
- Invalid example reports malformed block structure and exits nonzero.

## Important scope note
The Phase 7Q runtime package was not present in the active workspace; only the historical `Arcana pack.zip` was available. Accordingly, Phase 7R is delivered as a standalone static-checking tool, not as an update to a verified Phase 7Q runtime. It does **not** execute programs or type-check/evaluate expressions. Its accepted statement patterns are intentionally approximate and syntax remains provisional. This checker must not be mistaken for the canonical Arcane parser or a guarantee that a program will execute successfully.

## Run
```bash
python -m unittest -v
python arcane_cli.py example_valid.arc
python arcane_cli.py example_invalid.arc
```

~~~

## ARCANE_PHASE_7S_REPORT 2.md

- Type: MD
- SHA-256: `cfde3e3b039bf4f21203fad1dd3c48354b592a229cfbeec55257c58bcadac234`
- Extracted characters: 1730

~~~text
# Arcane Phase 7S — Expression Parsing and Static Validation

## Delivered
- Added `arcane_expr.py`, a recursive expression parser for the provisional subset.
- Supports numeric literals, `$binding` references, parenthesised expressions, unary `+`/`-`, infix arithmetic/comparison operators, function calls (including nested calls), and the provisional two-operand prefix operators (`FRATA`, `FRAPA`, `FRAMO`, `FRADI`, `FRAGT`, `FRALT`, `FRAEQ`, `FRANE`, `FRAGE`, `FRALE`).
- The static checker validates right-hand-side expressions for bindings, function definitions and repetition/aggregation statements, plus conditions and inline conditional branches.
- Expression errors use `ARC-EXPR-001` with line-numbered diagnostics and hints.
- Existing block-structure checks remain active.

## Validation
- `python -m unittest -v`: **16 tests passed**.
- Valid example checked successfully (exit code 0).
- Intentionally invalid example reported its malformed block structure and returned exit code 1.

## Example
Valid:
```arcane
KWAM total => (4 + 3) * 2
KWAM result => square(double(3))
KWAM area => FRATA $width $height
```
Invalid:
```arcane
KWAM total => 4 +
KWAM area => FRATA $width
```
The checker reports a missing operand in the first expression and a missing operand for the prefix operator in the second.

## Limitations
This is a static syntax parser, not an evaluator or full compiler. It does not resolve whether variables/functions exist, infer types or dimensions, prove operator compatibility, or execute control flow. Operator spellings and grammar remain provisional and must be checked against the authoritative Arcane decision ledger before canonisation. It intentionally supports only the subset listed above.

~~~

## ARCANE_PHASE_7S_REPORT.md

- Type: MD
- SHA-256: `cfde3e3b039bf4f21203fad1dd3c48354b592a229cfbeec55257c58bcadac234`
- Extracted characters: 1730

~~~text
# Arcane Phase 7S — Expression Parsing and Static Validation

## Delivered
- Added `arcane_expr.py`, a recursive expression parser for the provisional subset.
- Supports numeric literals, `$binding` references, parenthesised expressions, unary `+`/`-`, infix arithmetic/comparison operators, function calls (including nested calls), and the provisional two-operand prefix operators (`FRATA`, `FRAPA`, `FRAMO`, `FRADI`, `FRAGT`, `FRALT`, `FRAEQ`, `FRANE`, `FRAGE`, `FRALE`).
- The static checker validates right-hand-side expressions for bindings, function definitions and repetition/aggregation statements, plus conditions and inline conditional branches.
- Expression errors use `ARC-EXPR-001` with line-numbered diagnostics and hints.
- Existing block-structure checks remain active.

## Validation
- `python -m unittest -v`: **16 tests passed**.
- Valid example checked successfully (exit code 0).
- Intentionally invalid example reported its malformed block structure and returned exit code 1.

## Example
Valid:
```arcane
KWAM total => (4 + 3) * 2
KWAM result => square(double(3))
KWAM area => FRATA $width $height
```
Invalid:
```arcane
KWAM total => 4 +
KWAM area => FRATA $width
```
The checker reports a missing operand in the first expression and a missing operand for the prefix operator in the second.

## Limitations
This is a static syntax parser, not an evaluator or full compiler. It does not resolve whether variables/functions exist, infer types or dimensions, prove operator compatibility, or execute control flow. Operator spellings and grammar remain provisional and must be checked against the authoritative Arcane decision ledger before canonisation. It intentionally supports only the subset listed above.

~~~

## ARCANE_PHASE_7T_REPORT.md

- Type: MD
- SHA-256: `a90d1e4419bce6c4ebb1199412fe4f3cf6acba2e111438e112b0f61029416950`
- Extracted characters: 2683

~~~text
# Arcane Phase 7T — Symbol Tables and Semantic Analysis

## Outcome

Phase 7T adds a standalone semantic-analysis pass and integrates it into the existing static-checking CLI. It remains a checker, not an interpreter or compiler. It does not execute source programs.

## Checks implemented

- Resolve `$binding` references against the current scope and enclosing scopes.
- Detect duplicate `KWAM` binding declarations in the same scope.
- Collect `KWAF` function declarations so forward function calls can be resolved.
- Detect duplicate function definitions and duplicate function parameters.
- Detect calls to undefined functions.
- Check function-call argument counts against declared parameter counts.
- Treat conditional branches as separate provisional scopes; branch-local bindings do not escape the block.
- Give function parameters their own expression scope.
- Preserve line-specific diagnostics with codes `ARC-SEM-001` through `ARC-SEM-007`.

## CLI

```bash
python arcane_cli.py example_valid.arc
python arcane_cli.py example_invalid.arc
python arcane_cli.py --syntax-only example_valid.arc
python arcane_cli.py --semantic-only example_valid.arc
python -m unittest -v
```

The default CLI runs syntax and semantic checks. `--syntax-only` and `--semantic-only` are available for focused diagnostics; they cannot be combined.

## Verification

- 31 unit tests passed across syntax and semantic suites.
- The valid example passed syntax and semantic checks.
- The deliberately invalid example failed with non-zero exit status and diagnostics.
- Archive integrity checked after packaging.

## Explicit boundaries

This is based on the reconstructed provisional subset. Scope rules are implemented as a testable working policy, not declared canon. In particular, branch-local scope, declaration ordering, function visibility, recursion, and whether `KWAT` is definitively a binding-use statement must be reconciled against the full canonical specification. Type checking, dimensional/constraint analysis, control-flow guarantees, runtime integration, and execution remain out of scope. The historical archive available in this workspace did not include the prior reconstructed Phase 7 runtime, so this phase does not claim runtime integration.

## Next phase recommendation

Phase 7U should recover/reconstruct a single runnable workspace and define a minimal end-to-end contract: parse source, run static checks, then execute a small supported program subset. This is more valuable than adding more isolated checks indefinitely. Before promoting the provisional syntax to canonical status, reconcile the checker against the decision ledger and grammar consistency register.

~~~

## ARCANE_PHASE_7U_REPORT 2.md

- Type: MD
- SHA-256: `cd9913a4b5d156a10f425d55b6cf4bb0ea6c5825113a3908fbab67abff252c1e`
- Extracted characters: 2147

~~~text
# Arcane Phase 7U — Minimal Runnable Workspace

## Outcome
A fresh, self-contained executable subset has been created because the previous Phase 7R/7T workspace and archives were not present in the active file workspace. This is a reconstruction from the recent documented examples, not a recovery of the missing original runtime.

## Implemented
- A recursive expression evaluator for numeric literals, `$binding` references, parentheses, unary signs, infix arithmetic/comparison operators, nested function calls, and the provisional binary `FR*` operators.
- `KWAM name => expression` binding declarations.
- `KWAF name(params) => expression` expression-bodied functions.
- `KWAT name` output statements.
- Structured `KWAI condition THEN` / optional `ELSE` / `END` blocks, including nesting and branch-local bindings.
- Full block-structure parsing before execution, so malformed blocks do not partially execute prior statements.
- CLI modes: `python arcane_cli.py --check file.arc` and `python arcane_cli.py --run file.arc`.
- Standard-library-only runtime and 12 automated tests.

## Validation
- `python -m unittest -v`: 12 tests passed.
- `python arcane_cli.py --check example.arc`: syntax and semantic checks passed (exit 0).
- `python arcane_cli.py --run example.arc`: printed `49` (exit 0).

## Boundaries and known limitations
- This is a minimal reconstructed subset, not the complete Arcane language or a verified continuation of the unavailable runtime source.
- Keyword spellings, operator meanings, scoping, and function declaration rules remain provisional.
- Function bodies are expressions only; no statements, return statements, modules, imports, or general loops.
- `KWAT` outputs a named binding only.
- The static checker and semantic checker are lightweight; runtime diagnostics remain authoritative for executable behavior.
- The existing 31-test Phase 7T suite could not be preserved because its files were not present in the workspace. The 12 tests in this package are newly runnable and included.

## Run
```bash
python -m unittest -v
python arcane_cli.py --check example.arc
python arcane_cli.py --run example.arc
```

~~~

## ARCANE_PHASE_7U_REPORT.md

- Type: MD
- SHA-256: `cd9913a4b5d156a10f425d55b6cf4bb0ea6c5825113a3908fbab67abff252c1e`
- Extracted characters: 2147

~~~text
# Arcane Phase 7U — Minimal Runnable Workspace

## Outcome
A fresh, self-contained executable subset has been created because the previous Phase 7R/7T workspace and archives were not present in the active file workspace. This is a reconstruction from the recent documented examples, not a recovery of the missing original runtime.

## Implemented
- A recursive expression evaluator for numeric literals, `$binding` references, parentheses, unary signs, infix arithmetic/comparison operators, nested function calls, and the provisional binary `FR*` operators.
- `KWAM name => expression` binding declarations.
- `KWAF name(params) => expression` expression-bodied functions.
- `KWAT name` output statements.
- Structured `KWAI condition THEN` / optional `ELSE` / `END` blocks, including nesting and branch-local bindings.
- Full block-structure parsing before execution, so malformed blocks do not partially execute prior statements.
- CLI modes: `python arcane_cli.py --check file.arc` and `python arcane_cli.py --run file.arc`.
- Standard-library-only runtime and 12 automated tests.

## Validation
- `python -m unittest -v`: 12 tests passed.
- `python arcane_cli.py --check example.arc`: syntax and semantic checks passed (exit 0).
- `python arcane_cli.py --run example.arc`: printed `49` (exit 0).

## Boundaries and known limitations
- This is a minimal reconstructed subset, not the complete Arcane language or a verified continuation of the unavailable runtime source.
- Keyword spellings, operator meanings, scoping, and function declaration rules remain provisional.
- Function bodies are expressions only; no statements, return statements, modules, imports, or general loops.
- `KWAT` outputs a named binding only.
- The static checker and semantic checker are lightweight; runtime diagnostics remain authoritative for executable behavior.
- The existing 31-test Phase 7T suite could not be preserved because its files were not present in the workspace. The 12 tests in this package are newly runnable and included.

## Run
```bash
python -m unittest -v
python arcane_cli.py --check example.arc
python arcane_cli.py --run example.arc
```

~~~

## ARCANE_PHASE_7V_REPORT.md

- Type: MD
- SHA-256: `6b624cc8bfce2808222b8c497f7bedc11e5c0ce0c61646b00abedfe4d816da69`
- Extracted characters: 2897

~~~text
# Arcane Phase 7V — Runtime and Checker Integration

## Outcome
Phase 7V improves the Phase 7U runnable reconstruction by sharing the parser between static syntax checking and runtime execution, adding pre-execution CLI validation, introducing a recursive-call depth guard, resetting runtime state between runs, and expanding integration coverage.

## Implemented
- `parse_program()` is now the common source parser for the runtime and syntax checker.
- The parser rejects malformed `KWAM`, `KWAF`, and `KWAT` statement shapes as well as invalid conditional structure before execution.
- `arcane_cli.py --run` runs syntax and lightweight semantic checks first and exits non-zero on detected errors.
- Function expression evaluation has a configurable call-depth guard (`ARC-RUN-002`).
- Runtime statement execution has a configurable step limit (`ARC-RUN-003`).
- `ArcaneRuntime.run_program()` resets globals, functions, output and step state for each invocation.
- Five new integration tests supplement the original twelve runtime tests.

## Validation performed
- `python -m unittest -v`: 17 tests passed.
- `python arcane_cli.py --check example.arc`: syntax and semantic checks passed.
- `python arcane_cli.py --run example.arc`: output `49`.
- CLI integration test confirms statically detectable semantic errors stop execution with exit code 1.
- Shared-parser test confirms the checker and runtime return the same diagnostic code for a missing conditional terminator.

## Known limitations
- This is still a provisional, minimal reconstructed subset, not the complete Arcane language or a verified continuation of the unavailable earlier source tree.
- Operator meanings, keyword spellings, scope rules and declaration semantics remain provisional.
- The semantic analyser is lightweight and regex-based; it is not a formal type checker and can miss complex expression cases.
- The runtime's step counter currently guards executed AST nodes; it is not a general instruction budget for expression evaluation.
- Functions remain expression-bodied, and there are no general loops, modules, imports, or statement-bodied functions.
- `KWAT` outputs a named binding only.
- Function declarations are registered as execution reaches them; forward function calls are not guaranteed by the runtime even if the lightweight semantic analyser can recognise a later declaration.
- The original Phase 7R/7T source and test suite were unavailable in the active workspace. Phase 7V builds on the newly reconstructed Phase 7U files and preserves their 12 tests rather than claiming to recover the old suite.

## Next implementation target
Phase 7W should focus on runtime/semantic consistency: function declaration and scope rules, stronger expression-aware semantic analysis, forward-call policy, and CLI-level conformance tests. It should not expand the grammar until those existing behaviours are aligned.

~~~

## ARCANE_PHASE_7W_REPORT.md

- Type: MD
- SHA-256: `ca4f575f8d8af46a60b530d4e157026c39d5392da886770d850c45060b5521f2`
- Extracted characters: 1051

~~~text
# Arcane Phase 7W — Function and Semantic Consistency

## Delivered
- Shared AST parser for syntax checking and execution.
- Program-wide function registration, enabling forward calls.
- Nested function calls and argument-count checks.
- Duplicate function/parameter diagnostics.
- Parameter-only function scope and branch-local bindings.
- CLI validation before execution.
- Runtime call-depth and statement-step limits.
- Regression tests for the above behaviours.

## Verification
Run `python -m unittest -v`, `python arcane_cli.py --check example.arc`, and `python arcane_cli.py --run example.arc`. The example should print `13`.

## Limitations
This is a provisional reconstructed subset, not the complete canonical Arcane language. Prefix operator semantics and keyword grammar require reconciliation with the authoritative specification. Semantic checks are static approximations; runtime checks remain necessary. The original earlier source tree was unavailable, so this package is a reproducible reconstruction rather than recovered history.

~~~

## arcane_runtime 10.py

- Type: PY
- SHA-256: `a88e179f017ac93680043efba7fa0e2e5b0c36fd0b3f0c3147db24d26752d597`
- Extracted characters: 8626

~~~text
"""Arcane Phase 7H provisional runtime: bounded repetition expressions."""
from dataclasses import dataclass
from decimal import Decimal
import re

class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneBindingError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass

D0=(0,0,0)
UNITS={'1':(Decimal(1),D0),'m':(Decimal(1),(1,0,0)),'cm':(Decimal('.01'),(1,0,0)),'km':(Decimal(1000),(1,0,0)),'s':(Decimal(1),(0,1,0)),'kg':(Decimal(1),(0,0,1))}
ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2,'FRASI':3,'FRAGT':2,'FRALT':2,'FRAEQ':2,'FRAND':2,'FROR':2,'FRNOT':1}
MAX_REPEAT=1000
@dataclass(frozen=True)
class Q: value:Decimal; dim:tuple[int,int,int]=D0
@dataclass(frozen=True)
class Lit: q:Q
@dataclass(frozen=True)
class Ref: name:str
@dataclass(frozen=True)
class Node: op:str; args:tuple
@dataclass(frozen=True)
class Call: name:str; args:tuple
@dataclass(frozen=True)
class Repeat: var:str; start:object; end:object; body:object
@dataclass(frozen=True)
class Func: name:str; params:tuple[str,...]; body:object

def sum_quantities(values):
    """Sum a collection of quantities; all non-empty items must share dimensions."""
    values=list(values)
    if not values:return Q(Decimal(0),D0)
    if any(not isinstance(v,Q) for v in values):raise ArcaneTypeError('FRSUM accepts only numeric quantities')
    dim=values[0].dim
    if any(v.dim!=dim for v in values[1:]):raise ArcaneTypeError('FRSUM requires matching dimensions')
    return Q(sum((v.value for v in values),Decimal(0)),dim)

TOKEN=re.compile(r'\s*(\$[A-Za-z_]\w*|[A-Za-z_]\w*|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:@[A-Za-z]+)?|[(),])')
def tokens(s):
 out=[];pos=0
 while pos<len(s):
  m=TOKEN.match(s,pos)
  if not m:
   if s[pos:].strip(): raise ArcaneParseError(f'unexpected text near {s[pos:pos+16]!r}')
   break
  out.append(m.group(1));pos=m.end()
 return out
class Parser:
 def __init__(self,ts): self.ts=ts;self.i=0
 def peek(self): return self.ts[self.i] if self.i<len(self.ts) else None
 def take(self):
  if self.i>=len(self.ts): raise ArcaneParseError('unexpected end of expression')
  t=self.ts[self.i];self.i+=1;return t
 def expr(self):
  t=self.take();op=t.upper()
  if op in ARITY:return Node(op,tuple(self.expr() for _ in range(ARITY[op])))
  if t.startswith('$'):return Ref(t[1:])
  m=re.fullmatch(r'([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:@([A-Za-z]+))?',t)
  if m:
   n,u=m.groups();u=u or '1'
   if u not in UNITS:raise ArcaneTypeError(f'unknown unit {u}')
   scale,d=UNITS[u];return Lit(Q(Decimal(n)*scale,d))
  if re.fullmatch(r'[A-Za-z_]\w*',t):
   if self.peek()!='(':raise ArcaneParseError(f'unknown expression token {t!r}; function calls require parentheses')
   self.take();args=[]
   if self.peek()!=')':
    while True:
     args.append(self.expr())
     if self.peek()==',':self.take();continue
     break
   if self.take()!=')':raise ArcaneParseError('expected closing parenthesis')
   return Call(t,tuple(args))
  raise ArcaneParseError(f'unknown expression token {t!r}')
def parse(s):
 p=Parser(tokens(s));e=p.expr()
 if p.i!=len(p.ts):raise ArcaneParseError('extra expression tokens')
 return e

class Environment:
 def __init__(self):self.scopes=[{}];self.functions={};self.depth=0;self.max_depth=64
 def push(self):self.scopes.append({})
 def pop(self):
  if len(self.scopes)==1:raise ArcaneBindingError('cannot pop global scope')
  self.scopes.pop()
 def lookup(self,n):
  for s in reversed(self.scopes):
   if n.casefold() in s:return s[n.casefold()]
  raise ArcaneBindingError(f'unknown binding {n!r}')
 def eval(self,e):
  if isinstance(e,Lit):return e.q
  if isinstance(e,Ref):return self.lookup(e.name)
  if isinstance(e,Call):return self.call_values(e.name,[self.eval(x) for x in e.args])
  if isinstance(e,Repeat):
   a=self.eval(e.start);b=self.eval(e.end)
   if a.dim!=D0 or b.dim!=D0:raise ArcaneTypeError('repeat bounds must be dimensionless integers')
   if a.value!=a.value.to_integral_value() or b.value!=b.value.to_integral_value():raise ArcaneTypeError('repeat bounds must be integers')
   start,end=int(a.value),int(b.value)
   count=max(0,end-start+1)
   if count>MAX_REPEAT:raise ArcaneEvaluationError(f'repetition exceeds maximum of {MAX_REPEAT} iterations')
   results=[]
   for i in range(start,end+1):
    self.push()
    try:self.scopes[-1][e.var.casefold()]=Q(Decimal(i));results.append(self.eval(e.body))
    finally:self.pop()
   return results
  op=e.op
  if op=='FRASI':
   c=self.eval(e.args[0]);return self.eval(e.args[1] if c.value!=0 else e.args[2])
  if op=='FRNOT':
   a=self.eval(e.args[0])
   if a.dim!=D0:raise ArcaneTypeError('FRNOT requires a dimensionless operand')
   return Q(Decimal(0 if a.value!=0 else 1))
  if op in ('FRAND','FROR'):
   left=self.eval(e.args[0])
   if left.dim!=D0:raise ArcaneTypeError(f'{op} requires dimensionless operands')
   truth=left.value!=0
   if op=='FRAND' and not truth:return Q(Decimal(0))
   if op=='FROR' and truth:return Q(Decimal(1))
   right=self.eval(e.args[1])
   if right.dim!=D0:raise ArcaneTypeError(f'{op} requires dimensionless operands')
   return Q(Decimal(1 if right.value!=0 else 0))
  a=[self.eval(x) for x in e.args]
  if op in ('FRAPA','FRATA','FRAGT','FRALT','FRAEQ') and a[0].dim!=a[1].dim:raise ArcaneTypeError(f'{op} requires matching dimensions')
  if op=='FRAGT':return Q(Decimal(a[0].value>a[1].value))
  if op=='FRALT':return Q(Decimal(a[0].value<a[1].value))
  if op=='FRAEQ':return Q(Decimal(a[0].value==a[1].value))
  if op=='FRAPA':return Q(a[0].value+a[1].value,a[0].dim)
  if op=='FRATA':return Q(a[0].value-a[1].value,a[0].dim)
  if op=='FRAKA':return Q(a[0].value*a[1].value,tuple(x+y for x,y in zip(a[0].dim,a[1].dim)))
  if not a[1].value:raise ArcaneEvaluationError('division by zero')
  return Q(a[0].value/a[1].value,tuple(x-y for x,y in zip(a[0].dim,a[1].dim)))
 def define(self,name,params,body):
  k=name.casefold()
  if k in self.functions:raise ArcaneBindingError(f'function {name} already defined')
  if len(set(p.casefold() for p in params))!=len(params):raise ArcaneBindingError('duplicate parameter')
  if any(not re.fullmatch(r'[A-Za-z_]\w*',p) for p in params):raise ArcaneParseError('invalid parameter name')
  tree=parse(body);self.push()
  try:
   for p in params:self.scopes[-1][p.casefold()]=Q(Decimal(1))
   self.eval(tree)
  finally:self.pop()
  self.functions[k]=Func(name,tuple(params),tree);return f'function {name} defined'
 def call_values(self,name,vals):
  f=self.functions.get(name.casefold())
  if not f:raise ArcaneBindingError(f'unknown function {name!r}')
  if len(vals)!=len(f.params):raise ArcaneBindingError(f'{name} expects {len(f.params)} argument(s), got {len(vals)}')
  if self.depth>=self.max_depth:raise ArcaneEvaluationError('maximum call depth exceeded')
  self.push();self.depth+=1
  try:
   for p,v in zip(f.params,vals):self.scopes[-1][p.casefold()]=v
   return self.eval(f.body)
  finally:self.depth-=1;self.pop()
 def execute(self,s):
  m=re.fullmatch(r'KWAM\s+(\w+)\s*=\s*(.+)',s,re.I)
  if m:
   k=m[1].casefold()
   if k in self.scopes[-1]:raise ArcaneBindingError('duplicate binding')
   v=self.eval(parse(m[2]));self.scopes[-1][k]=v;return v
  m=re.fullmatch(r'KWAF\s+(\w+)\s*\((.*?)\)\s*=>\s*(.+)',s,re.I)
  if m:return self.define(m[1],[p.strip() for p in m[2].split(',') if p.strip()],m[3])
  # Provisional aggregation statement: KWAS total FROM start TO end => expression
  # The expression is evaluated once per inclusive integer and its results are summed.
  m=re.fullmatch(r'KWAS\s+(\w+)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',s,re.I)
  if m:
   k=m[1].casefold()
   if k in self.scopes[-1]:raise ArcaneBindingError('duplicate binding')
   values=self.eval(Repeat(m[1],parse(m[2]),parse(m[3]),parse(m[4])))
   result=sum_quantities(values);self.scopes[-1][k]=result;return result
  # Provisional bounded-repeat statement: KWAR i FROM start TO end => expression
  m=re.fullmatch(r'KWAR\s+(\w+)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',s,re.I)
  if m:return self.eval(Repeat(m[1],parse(m[2]),parse(m[3]),parse(m[4])))
  m=re.fullmatch(r'KWAC\s+(\w+)\s*\((.*)\)',s,re.I)
  if m:
   tree=parse(m[1]+'('+m[2]+')')
   if not isinstance(tree,Call):raise ArcaneParseError('expected function call')
   return self.eval(tree)
  m=re.fullmatch(r'KWAT\s+(\w+)',s,re.I)
  if m:return self.lookup(m[1])
  return self.eval(parse(s))

def fmt(q):
 if isinstance(q,list):return '['+', '.join(fmt(x) for x in q)+']'
 v=format(q.value.normalize(),'f') if q.value else '0';d=q.dim
 u=' '.join(sym if p==1 else f'{sym}^{p}' for sym,p in zip(('m','s','kg'),d) if p) or '1'
 return f'{v} {u}'

~~~

## arcane_runtime 11.py

- Type: PY
- SHA-256: `aaba14b564f08c284d12295d50688c8eb6236f23ad73141bd5def048fdd0b436`
- Extracted characters: 5493

~~~text
"""Arcane Phase 7L: compact runnable expression runtime with diagnostics.

This is a deliberately small executable subset. Operator spellings and statement
forms marked provisional in the project history remain provisional here.
"""
from dataclasses import dataclass
import re
from arcane_diagnostics import (ArcaneDiagnosticError, Diagnostic, ErrorCode,
    SourceSpan, diagnostic_for_exception)
from arcane_runtime_adapter import EvaluationResult, evaluate_safely

@dataclass(frozen=True)
class Quantity:
    value: float
    dimensions: tuple[int, ...] = ()
    def _same(self, other):
        if not isinstance(other, Quantity): raise TypeError('numeric value required')
        if self.dimensions != other.dimensions: raise ValueError('dimension mismatch')
    def __add__(self, other): self._same(other); return Quantity(self.value+other.value,self.dimensions)
    def __sub__(self, other): self._same(other); return Quantity(self.value-other.value,self.dimensions)
    def __mul__(self, other):
        if not isinstance(other,Quantity): raise TypeError('numeric value required')
        n=max(len(self.dimensions),len(other.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=other.dimensions+(0,)*(n-len(other.dimensions))
        return Quantity(self.value*other.value,tuple(x+y for x,y in zip(a,b)))
    def __truediv__(self, other):
        if not isinstance(other,Quantity): raise TypeError('numeric value required')
        if other.value==0: raise ZeroDivisionError('division by zero')
        n=max(len(self.dimensions),len(other.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=other.dimensions+(0,)*(n-len(other.dimensions))
        return Quantity(self.value/other.value,tuple(x-y for x,y in zip(a,b)))

UNITS={'1':(1.0,()),'m':(1.0,(1,0,0)),'cm':(0.01,(1,0,0)),'km':(1000.0,(1,0,0)),'s':(1.0,(0,1,0)),'kg':(1.0,(0,0,1))}
TOKEN=re.compile(r'\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z_0-9]*)|(\$[A-Za-z_][A-Za-z_0-9]*)|(\()|(\))|(,))')
class ArcaneRuntime:
    def __init__(self, max_iterations=1000, max_call_depth=64):
        self.bindings={}; self.max_iterations=max_iterations; self.max_call_depth=max_call_depth
    def define(self,name,value):
        if name in self.bindings: raise ValueError(f'duplicate binding {name}')
        self.bindings[name]=value; return value
    def lookup(self,name):
        if name not in self.bindings: raise ValueError(f'unknown binding {name}')
        return self.bindings[name]
    def _tokens(self, source):
        pos=0; out=[]
        while pos<len(source):
            if source[pos:].strip()=='' : break
            m=TOKEN.match(source,pos)
            if not m: raise ValueError(f'unexpected token at column {pos+1}')
            out.append(next((x for x in m.groups() if x is not None)))
            pos=m.end()
        return out
    def evaluate(self, source):
        try: tokens=self._tokens(source)
        except Exception as exc: raise ArcaneDiagnosticError(diagnostic_for_exception(exc)) from None
        i=0
        def expr():
            nonlocal i
            if i>=len(tokens): raise ValueError('unexpected end of expression')
            t=tokens[i]; i+=1
            if t=='(':
                v=expr()
                if i>=len(tokens) or tokens[i]!=')': raise ValueError('unexpected token: expected )')
                i+=1; return v
            if t.startswith('$'): return self.lookup(t[1:])
            if t.replace('.','',1).isdigit(): return Quantity(float(t))
            if t in ('FRNOT','FRAND','FROR'):
                if t=='FRNOT': return not truth(expr())
                left=truth(expr())
                right=truth(expr())
                return bool(left and right) if t=='FRAND' else bool(left or right)
            if t in ('FRAPA','FRALA','FRATA','FRAKA','FRAGT','FRALT','FRAEQ'):
                a=expr(); b=expr()
                if t=='FRAPA': return a+b
                if t=='FRALA': return a-b
                if t=='FRATA': return a*b
                if t=='FRAKA': return a/b
                if not isinstance(a,Quantity) or not isinstance(b,Quantity): raise TypeError('numeric value required')
                a._same(b)
                return a.value>b.value if t=='FRAGT' else a.value<b.value if t=='FRALT' else a.value==b.value
            if t in UNITS:
                factor,dims=UNITS[t]; return Quantity(factor,dims)
            raise ValueError(f'unknown binding {t}')
        try: value=expr()
        except Exception as exc: raise ArcaneDiagnosticError(diagnostic_for_exception(exc)) from None
        if i!=len(tokens): raise ArcaneDiagnosticError(Diagnostic(ErrorCode.PARSE_ERROR,f'unexpected token {tokens[i]}'))
        return value
    def run_line(self,line):
        line=line.strip()
        try:
            m=re.fullmatch(r'KWAM\s+([A-Za-z_]\w*)\s*=>\s*(.+)',line)
            if m: return self.define(m.group(1),self.evaluate(m.group(2)))
            m=re.fullmatch(r'KWAT\s+([A-Za-z_]\w*)',line)
            if m: return self.lookup(m.group(1))
            return self.evaluate(line)
        except ArcaneDiagnosticError as e: return EvaluationResult(diagnostic=e.diagnostic)
        except Exception as e: return evaluate_safely(lambda: (_ for _ in ()).throw(e)).diagnostic

def truth(value):
    if isinstance(value,bool): return value
    if isinstance(value,Quantity) and not value.dimensions and value.value in (0,1): return value.value==1
    raise TypeError('logical operation requires boolean or dimensionless 0/1')

~~~

## arcane_runtime 12.py

- Type: PY
- SHA-256: `adc6d11d24972d63439e1746e46d4303f78122b81d6703fb8040415af8b228de`
- Extracted characters: 8062

~~~text
"""Arcane Phase 7L: compact runnable expression runtime with diagnostics.

This is a deliberately small executable subset. Operator spellings and statement
forms marked provisional in the project history remain provisional here.
"""
from dataclasses import dataclass
import re
from arcane_diagnostics import (ArcaneDiagnosticError, Diagnostic, ErrorCode,
    SourceSpan, diagnostic_for_exception)
from arcane_runtime_adapter import EvaluationResult, evaluate_safely

@dataclass(frozen=True)
class Quantity:
    value: float
    dimensions: tuple[int, ...] = ()
    def _same(self, other):
        if not isinstance(other, Quantity): raise TypeError('numeric value required')
        if self.dimensions != other.dimensions: raise ValueError('dimension mismatch')
    def __add__(self, other): self._same(other); return Quantity(self.value+other.value,self.dimensions)
    def __sub__(self, other): self._same(other); return Quantity(self.value-other.value,self.dimensions)
    def __mul__(self, other):
        if not isinstance(other,Quantity): raise TypeError('numeric value required')
        n=max(len(self.dimensions),len(other.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=other.dimensions+(0,)*(n-len(other.dimensions))
        return Quantity(self.value*other.value,tuple(x+y for x,y in zip(a,b)))
    def __truediv__(self, other):
        if not isinstance(other,Quantity): raise TypeError('numeric value required')
        if other.value==0: raise ZeroDivisionError('division by zero')
        n=max(len(self.dimensions),len(other.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=other.dimensions+(0,)*(n-len(other.dimensions))
        return Quantity(self.value/other.value,tuple(x-y for x,y in zip(a,b)))

UNITS={'1':(1.0,()),'m':(1.0,(1,0,0)),'cm':(0.01,(1,0,0)),'km':(1000.0,(1,0,0)),'s':(1.0,(0,1,0)),'kg':(1.0,(0,0,1))}
TOKEN=re.compile(r'\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z_0-9]*)|(\$[A-Za-z_][A-Za-z_0-9]*)|(\()|(\))|(,))')
class ArcaneRuntime:
    def __init__(self, max_iterations=1000, max_call_depth=64):
        self.bindings={}; self.max_iterations=max_iterations; self.max_call_depth=max_call_depth
    def define(self,name,value):
        if name in self.bindings: raise ValueError(f'duplicate binding {name}')
        self.bindings[name]=value; return value
    def lookup(self,name):
        if name not in self.bindings: raise ValueError(f'unknown binding {name}')
        return self.bindings[name]
    def _tokens(self, source):
        pos=0; out=[]
        while pos<len(source):
            if source[pos:].strip()=='' : break
            m=TOKEN.match(source,pos)
            if not m: raise ValueError(f'unexpected token at column {pos+1}')
            out.append(next((x for x in m.groups() if x is not None)))
            pos=m.end()
        return out
    def evaluate(self, source, local_bindings=None):
        local_bindings = {} if local_bindings is None else dict(local_bindings)
        try: tokens=self._tokens(source)
        except Exception as exc: raise ArcaneDiagnosticError(diagnostic_for_exception(exc)) from None
        i=0
        def expr(execute=True):
            nonlocal i
            if i>=len(tokens): raise ValueError('unexpected end of expression')
            t=tokens[i]; i+=1
            if t=='(':
                v=expr(execute)
                if i>=len(tokens) or tokens[i]!=')': raise ValueError('unexpected token: expected )')
                i+=1; return v
            if t.startswith('$'):
                name=t[1:]
                if not execute: return None
                if name in local_bindings: return local_bindings[name]
                return self.lookup(name)
            if t.replace('.','',1).isdigit(): return Quantity(float(t)) if execute else None
            if t in ('FRNOT','FRAND','FROR'):
                if t=='FRNOT':
                    value=expr(execute)
                    return not truth(value) if execute else None
                left_value=expr(execute)
                if not execute:
                    expr(False); return None
                left=truth(left_value)
                # Parse, but do not evaluate, the unused operand.
                if t=='FRAND' and not left:
                    expr(False); return False
                if t=='FROR' and left:
                    expr(False); return True
                return truth(expr(True))
            if t in ('FRAPA','FRALA','FRATA','FRAKA','FRAGT','FRALT','FRAEQ'):
                a=expr(execute); b=expr(execute)
                if not execute: return None
                if t=='FRAPA': return a+b
                if t=='FRALA': return a-b
                if t=='FRATA': return a*b
                if t=='FRAKA': return a/b
                if not isinstance(a,Quantity) or not isinstance(b,Quantity): raise TypeError('numeric value required')
                a._same(b)
                return a.value>b.value if t=='FRAGT' else a.value<b.value if t=='FRALT' else a.value==b.value
            if t in UNITS:
                factor,dims=UNITS[t]; return Quantity(factor,dims) if execute else None
            if not execute: return None
            raise ValueError(f'unknown binding {t}')
        try: value=expr()
        except Exception as exc: raise ArcaneDiagnosticError(diagnostic_for_exception(exc)) from None
        if i!=len(tokens): raise ArcaneDiagnosticError(Diagnostic(ErrorCode.PARSE_ERROR,f'unexpected token {tokens[i]}'))
        return value
    @staticmethod
    def _bound(value):
        if not isinstance(value,Quantity) or value.dimensions or not float(value.value).is_integer():
            raise ValueError('bounds must be dimensionless integers')
        return int(value.value)

    def run_line(self,line):
        line=line.strip()
        try:
            m=re.fullmatch(r'KWAM\s+([A-Za-z_]\w*)\s*=>\s*(.+)',line)
            if m: return self.define(m.group(1),self.evaluate(m.group(2)))
            m=re.fullmatch(r'KWAT\s+([A-Za-z_]\w*)',line)
            if m: return self.lookup(m.group(1))
            # Provisional bounded repetition: KWAR i FROM start TO end => expression
            m=re.fullmatch(r'KWAR\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                name,lo_src,hi_src,body=m.groups()
                lo=self._bound(self.evaluate(lo_src)); hi=self._bound(self.evaluate(hi_src))
                count=max(0,hi-lo+1)
                if count>self.max_iterations: raise ValueError('iteration limit exceeded')
                return [self.evaluate(body,{name:Quantity(float(i))}) for i in range(lo,hi+1)]
            # Provisional bounded aggregation: KWAS result FROM start TO end => expression
            m=re.fullmatch(r'KWAS\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                name,lo_src,hi_src,body=m.groups()
                lo=self._bound(self.evaluate(lo_src)); hi=self._bound(self.evaluate(hi_src))
                count=max(0,hi-lo+1)
                if count>self.max_iterations: raise ValueError('iteration limit exceeded')
                values=[self.evaluate(body,{name:Quantity(float(i))}) for i in range(lo,hi+1)]
                if not values: return Quantity(0.0)
                if not all(isinstance(v,Quantity) for v in values): raise TypeError('aggregation requires numeric values')
                dims=values[0].dimensions
                if any(v.dimensions != dims for v in values): raise ValueError('dimension mismatch in aggregation')
                return Quantity(sum(v.value for v in values),dims)
            return self.evaluate(line)
        except ArcaneDiagnosticError as e: return EvaluationResult(diagnostic=e.diagnostic)
        except Exception as e: return evaluate_safely(lambda: (_ for _ in ()).throw(e)).diagnostic

def truth(value):
    if isinstance(value,bool): return value
    if isinstance(value,Quantity) and not value.dimensions and value.value in (0,1): return value.value==1
    raise TypeError('logical operation requires boolean or dimensionless 0/1')

~~~

## arcane_runtime 13.py

- Type: PY
- SHA-256: `11ed1d03eb79838d65f92801ce9af1506c6ede23b56b6d8ac9a075a63683bac5`
- Extracted characters: 9511

~~~text
"""Arcane Phase 7N: compact runnable subset with user-defined functions.
All grammar spellings here are provisional implementation syntax, not canonical decisions.
"""
from dataclasses import dataclass
import re

@dataclass(frozen=True)
class Diagnostic:
    code: str
    message: str
    line: int = 1
    column: int = 1
    hint: str = ''
    def render(self):
        s=f'{self.code} at {self.line}:{self.column}: {self.message}'
        return s + (f'\n  hint: {self.hint}' if self.hint else '')

class ArcaneError(Exception):
    def __init__(self, code, message, hint=''):
        self.diagnostic=Diagnostic(code,message,hint=hint)
        super().__init__(self.diagnostic.render())

@dataclass(frozen=True)
class Quantity:
    value: float
    dimensions: tuple[int,...]=()
    def same(self, other):
        if not isinstance(other,Quantity): raise ArcaneError('ARC-TYPE-001','numeric value required')
        if self.dimensions != other.dimensions: raise ArcaneError('ARC-UNIT-001','dimension mismatch','Use quantities with compatible dimensions.')
    def __add__(self,o): self.same(o); return Quantity(self.value+o.value,self.dimensions)
    def __sub__(self,o): self.same(o); return Quantity(self.value-o.value,self.dimensions)
    def __mul__(self,o):
        self.same_numeric(o); n=max(len(self.dimensions),len(o.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=o.dimensions+(0,)*(n-len(o.dimensions)); return Quantity(self.value*o.value,tuple(x+y for x,y in zip(a,b)))
    def __truediv__(self,o):
        self.same_numeric(o)
        if o.value==0: raise ArcaneError('ARC-MATH-001','division by zero','Check the denominator before dividing.')
        n=max(len(self.dimensions),len(o.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=o.dimensions+(0,)*(n-len(o.dimensions)); return Quantity(self.value/o.value,tuple(x-y for x,y in zip(a,b)))
    def same_numeric(self,o):
        if not isinstance(o,Quantity): raise ArcaneError('ARC-TYPE-001','numeric value required')

UNITS={'1':Quantity(1), 'm':Quantity(1,(1,0,0)), 'cm':Quantity(.01,(1,0,0)), 'km':Quantity(1000,(1,0,0)), 's':Quantity(1,(0,1,0)), 'kg':Quantity(1,(0,0,1))}
TOKEN=re.compile(r'\s*(?:(\d+(?:\.\d+)?)|(\$?[A-Za-z_][A-Za-z_0-9]*)|(=>)|(\()|(\))|(,))')

class ArcaneRuntime:
    def __init__(self,max_iterations=1000,max_call_depth=64):
        self.bindings={}; self.functions={}; self.max_iterations=max_iterations; self.max_call_depth=max_call_depth
    def define(self,name,value):
        if name in self.bindings: raise ArcaneError('ARC-NAME-002',f'duplicate binding {name}')
        self.bindings[name]=value; return value
    def _tokenize(self,src):
        out=[]; p=0
        while p<len(src):
            if src[p:].strip()=='': break
            m=TOKEN.match(src,p)
            if not m: raise ArcaneError('ARC-PARSE-001',f'unexpected token at column {p+1}','Check spelling and delimiters.')
            out.append(next(x for x in m.groups() if x is not None)); p=m.end()
        return out
    def evaluate(self,src,locals_=None,depth=0):
        if depth>self.max_call_depth: raise ArcaneError('ARC-RUNTIME-001','maximum function call depth exceeded')
        locals_=locals_ or {}; ts=self._tokenize(src); i=0
        def expr(execute=True):
            nonlocal i
            if i>=len(ts): raise ArcaneError('ARC-PARSE-001','unexpected end of expression')
            t=ts[i]; i+=1
            if t=='(':
                v=expr(execute)
                if i>=len(ts) or ts[i]!=')': raise ArcaneError('ARC-PARSE-001','expected closing parenthesis')
                i+=1; return v
            if t.replace('.','',1).isdigit(): return Quantity(float(t)) if execute else None
            if t.startswith('$'):
                n=t[1:]
                if not execute:return None
                if n in locals_:return locals_[n]
                if n in self.bindings:return self.bindings[n]
                raise ArcaneError('ARC-NAME-001',f'unknown binding {n}','Check the spelling and scope.')
            if t in ('FRNOT','FRAND','FROR'):
                if t=='FRNOT':
                    v=expr(execute); return (not self.truth(v)) if execute else None
                left=expr(execute)
                if not execute: expr(False); return None
                b=self.truth(left)
                if t=='FRAND' and not b: expr(False); return False
                if t=='FROR' and b: expr(False); return True
                return self.truth(expr(True))
            if t in ('FRAPA','FRALA','FRATA','FRAKA','FRAGT','FRALT','FRAEQ'):
                a=expr(execute); b=expr(execute)
                if not execute:return None
                if t=='FRAPA':return a+b
                if t=='FRALA':return a-b
                if t=='FRATA':return a*b
                if t=='FRAKA':return a/b
                a.same(b)
                return a.value>b.value if t=='FRAGT' else a.value<b.value if t=='FRALT' else a.value==b.value
            if t in UNITS:return UNITS[t] if execute else None
            if t in self.functions:
                if i>=len(ts) or ts[i]!='(': raise ArcaneError('ARC-PARSE-001',f'function {t} requires parentheses')
                i+=1; args=[]
                if i<len(ts) and ts[i]!=')':
                    while True:
                        args.append(expr(execute))
                        if i<len(ts) and ts[i]==',': i+=1; continue
                        break
                if i>=len(ts) or ts[i]!=')': raise ArcaneError('ARC-PARSE-001','expected ) after function arguments')
                i+=1
                if not execute:return None
                fn=self.functions[t]
                if len(args)!=len(fn['params']): raise ArcaneError('ARC-TYPE-001',f'{t} expects {len(fn["params"])} arguments, got {len(args)}')
                return self.evaluate(fn['body'],dict(zip(fn['params'],args)),depth+1)
            if not execute:return None
            raise ArcaneError('ARC-NAME-001',f'unknown name {t}')
        result=expr()
        if i!=len(ts): raise ArcaneError('ARC-PARSE-001',f'unexpected token {ts[i]}')
        return result
    @staticmethod
    def truth(v):
        if isinstance(v,bool):return v
        if isinstance(v,Quantity) and not v.dimensions and v.value in (0,1):return v.value==1
        raise ArcaneError('ARC-TYPE-001','logical operation requires boolean or dimensionless 0/1')
    @staticmethod
    def _bound(v):
        if not isinstance(v,Quantity) or v.dimensions or not v.value.is_integer(): raise ArcaneError('ARC-LOOP-001','bounds must be dimensionless integers')
        return int(v.value)
    def run_line(self,line):
        line=line.strip()
        try:
            m=re.fullmatch(r'KWAM\s+([A-Za-z_]\w*)\s*=>\s*(.+)',line)
            if m:return self.define(m.group(1),self.evaluate(m.group(2)))
            m=re.fullmatch(r'KWAF\s+([A-Za-z_]\w*)\s*\(([^()]*)\)\s*=>\s*(.+)',line)
            if m:
                name,ps,body=m.groups(); params=[p.strip().lstrip('$') for p in ps.split(',') if p.strip()]
                if any(not re.fullmatch(r'[A-Za-z_]\w*',p) for p in params) or len(set(params))!=len(params): raise ArcaneError('ARC-PARSE-001','invalid or duplicate function parameter')
                if name in self.functions or name in self.bindings: raise ArcaneError('ARC-NAME-002',f'name already defined: {name}')
                # Register before syntax validation so self-recursion parses safely.
                self.functions[name]={'params':params,'body':body}
                # Syntax/name validation is deferred until the first call, allowing recursion.
                return f'function {name}/{len(params)} defined'
            m=re.fullmatch(r'KWAT\s+([A-Za-z_]\w*)',line)
            if m:
                if m.group(1) not in self.bindings: raise ArcaneError('ARC-NAME-001',f'unknown binding {m.group(1)}')
                return self.bindings[m.group(1)]
            m=re.fullmatch(r'KWAR\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                n,lo,hi,body=m.groups(); a=self._bound(self.evaluate(lo)); b=self._bound(self.evaluate(hi)); count=max(0,b-a+1)
                if count>self.max_iterations: raise ArcaneError('ARC-LOOP-002','iteration limit exceeded')
                return [self.evaluate(body,{n:Quantity(float(k))}) for k in range(a,b+1)]
            m=re.fullmatch(r'KWAS\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                n,lo,hi,body=m.groups(); a=self._bound(self.evaluate(lo)); b=self._bound(self.evaluate(hi)); count=max(0,b-a+1)
                if count>self.max_iterations: raise ArcaneError('ARC-LOOP-002','iteration limit exceeded')
                vals=[self.evaluate(body,{n:Quantity(float(k))}) for k in range(a,b+1)]
                if not vals:return Quantity(0)
                if not all(isinstance(v,Quantity) for v in vals): raise ArcaneError('ARC-TYPE-001','aggregation requires numeric values')
                if any(v.dimensions!=vals[0].dimensions for v in vals): raise ArcaneError('ARC-UNIT-001','dimension mismatch in aggregation')
                return Quantity(sum(v.value for v in vals),vals[0].dimensions)
            return self.evaluate(line)
        except ArcaneError as e:return e.diagnostic

def show(v):
    if isinstance(v,Quantity):return f'{v.value:g}'+(' dimensionless' if not v.dimensions else f' dimensions={v.dimensions}')
    if isinstance(v,list):return '['+', '.join(show(x) for x in v)+']'
    return str(v)

~~~

## arcane_runtime 14.py

- Type: PY
- SHA-256: `b565fd5831c353f0302a8fc5b59e6b10493deadab433a05df140384a50ca64db`
- Extracted characters: 10689

~~~text
"""Arcane Phase 7N: compact runnable subset with user-defined functions.
All grammar spellings here are provisional implementation syntax, not canonical decisions.
"""
from dataclasses import dataclass
import re

@dataclass(frozen=True)
class Diagnostic:
    code: str
    message: str
    line: int = 1
    column: int = 1
    hint: str = ''
    def render(self):
        s=f'{self.code} at {self.line}:{self.column}: {self.message}'
        return s + (f'\n  hint: {self.hint}' if self.hint else '')

class ArcaneError(Exception):
    def __init__(self, code, message, hint=''):
        self.diagnostic=Diagnostic(code,message,hint=hint)
        super().__init__(self.diagnostic.render())

@dataclass(frozen=True)
class Quantity:
    value: float
    dimensions: tuple[int,...]=()
    def same(self, other):
        if not isinstance(other,Quantity): raise ArcaneError('ARC-TYPE-001','numeric value required')
        if self.dimensions != other.dimensions: raise ArcaneError('ARC-UNIT-001','dimension mismatch','Use quantities with compatible dimensions.')
    def __add__(self,o): self.same(o); return Quantity(self.value+o.value,self.dimensions)
    def __sub__(self,o): self.same(o); return Quantity(self.value-o.value,self.dimensions)
    def __mul__(self,o):
        self.same_numeric(o); n=max(len(self.dimensions),len(o.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=o.dimensions+(0,)*(n-len(o.dimensions)); return Quantity(self.value*o.value,tuple(x+y for x,y in zip(a,b)))
    def __truediv__(self,o):
        self.same_numeric(o)
        if o.value==0: raise ArcaneError('ARC-MATH-001','division by zero','Check the denominator before dividing.')
        n=max(len(self.dimensions),len(o.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=o.dimensions+(0,)*(n-len(o.dimensions)); return Quantity(self.value/o.value,tuple(x-y for x,y in zip(a,b)))
    def same_numeric(self,o):
        if not isinstance(o,Quantity): raise ArcaneError('ARC-TYPE-001','numeric value required')

UNITS={'1':Quantity(1), 'm':Quantity(1,(1,0,0)), 'cm':Quantity(.01,(1,0,0)), 'km':Quantity(1000,(1,0,0)), 's':Quantity(1,(0,1,0)), 'kg':Quantity(1,(0,0,1))}
TOKEN=re.compile(r'\s*(?:(\d+(?:\.\d+)?)|(\$?[A-Za-z_][A-Za-z_0-9]*)|(=>)|(\()|(\))|(,))')

class ArcaneRuntime:
    def __init__(self,max_iterations=1000,max_call_depth=64):
        self.bindings={}; self.functions={}; self.max_iterations=max_iterations; self.max_call_depth=max_call_depth
    def define(self,name,value):
        if name in self.bindings: raise ArcaneError('ARC-NAME-002',f'duplicate binding {name}')
        self.bindings[name]=value; return value
    def _tokenize(self,src):
        out=[]; p=0
        while p<len(src):
            if src[p:].strip()=='': break
            m=TOKEN.match(src,p)
            if not m: raise ArcaneError('ARC-PARSE-001',f'unexpected token at column {p+1}','Check spelling and delimiters.')
            out.append(next(x for x in m.groups() if x is not None)); p=m.end()
        return out
    def evaluate(self,src,locals_=None,depth=0):
        if depth>self.max_call_depth: raise ArcaneError('ARC-RUNTIME-001','maximum function call depth exceeded')
        locals_=locals_ or {}; ts=self._tokenize(src); i=0
        def expr(execute=True):
            nonlocal i
            if i>=len(ts): raise ArcaneError('ARC-PARSE-001','unexpected end of expression')
            t=ts[i]; i+=1
            if t=='(':
                v=expr(execute)
                if i>=len(ts) or ts[i]!=')': raise ArcaneError('ARC-PARSE-001','expected closing parenthesis')
                i+=1; return v
            if t.replace('.','',1).isdigit(): return Quantity(float(t)) if execute else None
            if t.startswith('$'):
                n=t[1:]
                if not execute:return None
                if n in locals_:return locals_[n]
                if n in self.bindings:return self.bindings[n]
                raise ArcaneError('ARC-NAME-001',f'unknown binding {n}','Check the spelling and scope.')
            if t in ('FRNOT','FRAND','FROR'):
                if t=='FRNOT':
                    v=expr(execute); return (not self.truth(v)) if execute else None
                left=expr(execute)
                if not execute: expr(False); return None
                b=self.truth(left)
                if t=='FRAND' and not b: expr(False); return False
                if t=='FROR' and b: expr(False); return True
                return self.truth(expr(True))
            if t in ('FRAPA','FRALA','FRATA','FRAKA','FRAGT','FRALT','FRAEQ'):
                a=expr(execute); b=expr(execute)
                if not execute:return None
                if t=='FRAPA':return a+b
                if t=='FRALA':return a-b
                if t=='FRATA':return a*b
                if t=='FRAKA':return a/b
                a.same(b)
                return a.value>b.value if t=='FRAGT' else a.value<b.value if t=='FRALT' else a.value==b.value
            if t in UNITS:return UNITS[t] if execute else None
            if t in self.functions:
                if i>=len(ts) or ts[i]!='(': raise ArcaneError('ARC-PARSE-001',f'function {t} requires parentheses')
                i+=1; args=[]
                if i<len(ts) and ts[i]!=')':
                    while True:
                        args.append(expr(execute))
                        if i<len(ts) and ts[i]==',': i+=1; continue
                        break
                if i>=len(ts) or ts[i]!=')': raise ArcaneError('ARC-PARSE-001','expected ) after function arguments')
                i+=1
                if not execute:return None
                fn=self.functions[t]
                if len(args)!=len(fn['params']): raise ArcaneError('ARC-TYPE-001',f'{t} expects {len(fn["params"])} arguments, got {len(args)}')
                return self.evaluate(fn['body'],dict(zip(fn['params'],args)),depth+1)
            if not execute:return None
            raise ArcaneError('ARC-NAME-001',f'unknown name {t}')
        result=expr()
        if i!=len(ts): raise ArcaneError('ARC-PARSE-001',f'unexpected token {ts[i]}')
        return result
    @staticmethod
    def truth(v):
        if isinstance(v,bool):return v
        if isinstance(v,Quantity) and not v.dimensions and v.value in (0,1):return v.value==1
        raise ArcaneError('ARC-TYPE-001','logical operation requires boolean or dimensionless 0/1')
    @staticmethod
    def _bound(v):
        if not isinstance(v,Quantity) or v.dimensions or not v.value.is_integer(): raise ArcaneError('ARC-LOOP-001','bounds must be dimensionless integers')
        return int(v.value)
    def run_program(self, source):
        """Execute a newline-separated program; stop at the first diagnostic."""
        results=[]
        for line_no, line in enumerate(source.splitlines(), 1):
            if not line.strip() or line.lstrip().startswith('#'):
                continue
            result=self.run_line(line)
            if isinstance(result, Diagnostic):
                return Diagnostic(result.code, f'line {line_no}: {result.message}', line_no, result.column, result.hint)
            results.append(result)
        return results

    def run_line(self,line):
        line=line.strip()
        try:
            # Provisional conditional form: KWAI condition THEN expression ELSE expression.
            m=re.fullmatch(r'KWAI\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+)',line)
            if m:
                condition, yes_expr, no_expr=m.groups()
                condition_value=self.evaluate(condition)
                choose_yes=self.truth(condition_value)
                return self.evaluate(yes_expr if choose_yes else no_expr)
            if line.startswith('KWAI '):
                raise ArcaneError('ARC-PARSE-001','conditional requires THEN and ELSE branches','Use: KWAI condition THEN expression ELSE expression')
            m=re.fullmatch(r'KWAM\s+([A-Za-z_]\w*)\s*=>\s*(.+)',line)
            if m:return self.define(m.group(1),self.evaluate(m.group(2)))
            m=re.fullmatch(r'KWAF\s+([A-Za-z_]\w*)\s*\(([^()]*)\)\s*=>\s*(.+)',line)
            if m:
                name,ps,body=m.groups(); params=[p.strip().lstrip('$') for p in ps.split(',') if p.strip()]
                if any(not re.fullmatch(r'[A-Za-z_]\w*',p) for p in params) or len(set(params))!=len(params): raise ArcaneError('ARC-PARSE-001','invalid or duplicate function parameter')
                if name in self.functions or name in self.bindings: raise ArcaneError('ARC-NAME-002',f'name already defined: {name}')
                # Register before syntax validation so self-recursion parses safely.
                self.functions[name]={'params':params,'body':body}
                # Syntax/name validation is deferred until the first call, allowing recursion.
                return f'function {name}/{len(params)} defined'
            m=re.fullmatch(r'KWAT\s+([A-Za-z_]\w*)',line)
            if m:
                if m.group(1) not in self.bindings: raise ArcaneError('ARC-NAME-001',f'unknown binding {m.group(1)}')
                return self.bindings[m.group(1)]
            m=re.fullmatch(r'KWAR\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                n,lo,hi,body=m.groups(); a=self._bound(self.evaluate(lo)); b=self._bound(self.evaluate(hi)); count=max(0,b-a+1)
                if count>self.max_iterations: raise ArcaneError('ARC-LOOP-002','iteration limit exceeded')
                return [self.evaluate(body,{n:Quantity(float(k))}) for k in range(a,b+1)]
            m=re.fullmatch(r'KWAS\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                n,lo,hi,body=m.groups(); a=self._bound(self.evaluate(lo)); b=self._bound(self.evaluate(hi)); count=max(0,b-a+1)
                if count>self.max_iterations: raise ArcaneError('ARC-LOOP-002','iteration limit exceeded')
                vals=[self.evaluate(body,{n:Quantity(float(k))}) for k in range(a,b+1)]
                if not vals:return Quantity(0)
                if not all(isinstance(v,Quantity) for v in vals): raise ArcaneError('ARC-TYPE-001','aggregation requires numeric values')
                if any(v.dimensions!=vals[0].dimensions for v in vals): raise ArcaneError('ARC-UNIT-001','dimension mismatch in aggregation')
                return Quantity(sum(v.value for v in vals),vals[0].dimensions)
            return self.evaluate(line)
        except ArcaneError as e:return e.diagnostic

def show(v):
    if isinstance(v,Quantity):return f'{v.value:g}'+(' dimensionless' if not v.dimensions else f' dimensions={v.dimensions}')
    if isinstance(v,list):return '['+', '.join(show(x) for x in v)+']'
    return str(v)

~~~

## arcane_runtime 15.py

- Type: PY
- SHA-256: `ca0f2427a6f47c9b6104c8eee042ead994dc6cbaf161d3e4b5fcf7980e16a629`
- Extracted characters: 19958

~~~text
"""Arcane Phase 7N: compact runnable subset with user-defined functions.
All grammar spellings here are provisional implementation syntax, not canonical decisions.
"""
from dataclasses import dataclass
import re

@dataclass(frozen=True)
class Diagnostic:
    code: str
    message: str
    line: int = 1
    column: int = 1
    hint: str = ''
    def render(self):
        s=f'{self.code} at {self.line}:{self.column}: {self.message}'
        return s + (f'\n  hint: {self.hint}' if self.hint else '')

class ArcaneError(Exception):
    def __init__(self, code, message, hint=''):
        self.diagnostic=Diagnostic(code,message,hint=hint)
        super().__init__(self.diagnostic.render())

@dataclass(frozen=True)
class Quantity:
    value: float
    dimensions: tuple[int,...]=()
    def same(self, other):
        if not isinstance(other,Quantity): raise ArcaneError('ARC-TYPE-001','numeric value required')
        if self.dimensions != other.dimensions: raise ArcaneError('ARC-UNIT-001','dimension mismatch','Use quantities with compatible dimensions.')
    def __add__(self,o): self.same(o); return Quantity(self.value+o.value,self.dimensions)
    def __sub__(self,o): self.same(o); return Quantity(self.value-o.value,self.dimensions)
    def __mul__(self,o):
        self.same_numeric(o); n=max(len(self.dimensions),len(o.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=o.dimensions+(0,)*(n-len(o.dimensions)); return Quantity(self.value*o.value,tuple(x+y for x,y in zip(a,b)))
    def __truediv__(self,o):
        self.same_numeric(o)
        if o.value==0: raise ArcaneError('ARC-MATH-001','division by zero','Check the denominator before dividing.')
        n=max(len(self.dimensions),len(o.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=o.dimensions+(0,)*(n-len(o.dimensions)); return Quantity(self.value/o.value,tuple(x-y for x,y in zip(a,b)))
    def same_numeric(self,o):
        if not isinstance(o,Quantity): raise ArcaneError('ARC-TYPE-001','numeric value required')

UNITS={'1':Quantity(1), 'm':Quantity(1,(1,0,0)), 'cm':Quantity(.01,(1,0,0)), 'km':Quantity(1000,(1,0,0)), 's':Quantity(1,(0,1,0)), 'kg':Quantity(1,(0,0,1))}
TOKEN=re.compile(r'\s*(?:(\d+(?:\.\d+)?)|(\$?[A-Za-z_][A-Za-z_0-9]*)|(=>)|(\()|(\))|(,))')

class ArcaneRuntime:
    def __init__(self,max_iterations=1000,max_call_depth=64):
        self.bindings={}; self.functions={}; self.scopes=[]; self.max_iterations=max_iterations; self.max_call_depth=max_call_depth
    def define(self,name,value):
        target=self.scopes[-1] if self.scopes else self.bindings
        if name in target: raise ArcaneError('ARC-NAME-002',f'duplicate binding {name}')
        if not self.scopes and (name in self.functions): raise ArcaneError('ARC-NAME-002',f'name already defined: {name}')
        target[name]=value; return value

    def _lookup_binding(self,name,locals_):
        if name in locals_: return locals_[name]
        for scope in reversed(self.scopes):
            if name in scope: return scope[name]
        if name in self.bindings: return self.bindings[name]
        raise ArcaneError('ARC-NAME-001',f'unknown binding {name}','Check the spelling and scope.')
    def _tokenize(self,src):
        out=[]; p=0
        while p<len(src):
            if src[p:].strip()=='': break
            m=TOKEN.match(src,p)
            if not m: raise ArcaneError('ARC-PARSE-001',f'unexpected token at column {p+1}','Check spelling and delimiters.')
            out.append(next(x for x in m.groups() if x is not None)); p=m.end()
        return out
    def evaluate(self,src,locals_=None,depth=0):
        if depth>self.max_call_depth: raise ArcaneError('ARC-RUNTIME-001','maximum function call depth exceeded')
        locals_=locals_ or {}; ts=self._tokenize(src); i=0
        def expr(execute=True):
            nonlocal i
            if i>=len(ts): raise ArcaneError('ARC-PARSE-001','unexpected end of expression')
            t=ts[i]; i+=1
            if t=='(':
                v=expr(execute)
                if i>=len(ts) or ts[i]!=')': raise ArcaneError('ARC-PARSE-001','expected closing parenthesis')
                i+=1; return v
            if t.replace('.','',1).isdigit(): return Quantity(float(t)) if execute else None
            if t.startswith('$'):
                n=t[1:]
                if not execute:return None
                return self._lookup_binding(n,locals_)
            if t in ('FRNOT','FRAND','FROR'):
                if t=='FRNOT':
                    v=expr(execute); return (not self.truth(v)) if execute else None
                left=expr(execute)
                if not execute: expr(False); return None
                b=self.truth(left)
                if t=='FRAND' and not b: expr(False); return False
                if t=='FROR' and b: expr(False); return True
                return self.truth(expr(True))
            if t in ('FRAPA','FRALA','FRATA','FRAKA','FRAGT','FRALT','FRAEQ'):
                a=expr(execute); b=expr(execute)
                if not execute:return None
                if t=='FRAPA':return a+b
                if t=='FRALA':return a-b
                if t=='FRATA':return a*b
                if t=='FRAKA':return a/b
                a.same(b)
                return a.value>b.value if t=='FRAGT' else a.value<b.value if t=='FRALT' else a.value==b.value
            if t in UNITS:return UNITS[t] if execute else None
            if t in self.functions:
                if i>=len(ts) or ts[i]!='(': raise ArcaneError('ARC-PARSE-001',f'function {t} requires parentheses')
                i+=1; args=[]
                if i<len(ts) and ts[i]!=')':
                    while True:
                        args.append(expr(execute))
                        if i<len(ts) and ts[i]==',': i+=1; continue
                        break
                if i>=len(ts) or ts[i]!=')': raise ArcaneError('ARC-PARSE-001','expected ) after function arguments')
                i+=1
                if not execute:return None
                fn=self.functions[t]
                if len(args)!=len(fn['params']): raise ArcaneError('ARC-TYPE-001',f'{t} expects {len(fn["params"])} arguments, got {len(args)}')
                return self.evaluate(fn['body'],dict(zip(fn['params'],args)),depth+1)
            if not execute:return None
            raise ArcaneError('ARC-NAME-001',f'unknown name {t}')
        result=expr()
        if i!=len(ts): raise ArcaneError('ARC-PARSE-001',f'unexpected token {ts[i]}')
        return result
    @staticmethod
    def truth(v):
        if isinstance(v,bool):return v
        if isinstance(v,Quantity) and not v.dimensions and v.value in (0,1):return v.value==1
        raise ArcaneError('ARC-TYPE-001','logical operation requires boolean or dimensionless 0/1')
    @staticmethod
    def _bound(v):
        if not isinstance(v,Quantity) or v.dimensions or not v.value.is_integer(): raise ArcaneError('ARC-LOOP-001','bounds must be dimensionless integers')
        return int(v.value)
    def run_program(self, source):
        """Execute statements and KWAI/THEN/ELSE/END blocks; stop at first error.

        Block bindings are scoped to the selected branch and do not leak out.
        Syntax is provisional. Block headers and delimiters occupy their own lines.
        """
        lines=[]
        for number, raw in enumerate(source.splitlines(),1):
            text=raw.strip()
            if not text or text.startswith('#'):
                continue
            lines.append((number,text))
        def parse_block(index, stops=()):
            results=[]
            while index < len(lines):
                number,text=lines[index]
                if text in stops:
                    return results,index,text
                if text.startswith('KWAI ') and text.endswith(' THEN'):
                    condition=text[5:-5].strip()
                    if not condition:
                        return Diagnostic('ARC-PARSE-001','empty conditional condition',number),index,None
                    index+=1
                    yes,index,stop=parse_block(index,('ELSE','END'))
                    if isinstance(yes,Diagnostic): return yes,index,None
                    if stop is None:
                        return Diagnostic('ARC-PARSE-001','conditional block requires END',number,1,'Close each block with END.'),index,None
                    no=[]
                    if stop=='ELSE':
                        index+=1
                        no,index,stop=parse_block(index,('END',))
                        if isinstance(no,Diagnostic): return no,index,None
                        if stop!='END':
                            return Diagnostic('ARC-PARSE-001','ELSE branch requires END',number,1),index,None
                    index+=1
                    try: take_yes=self.truth(self.evaluate(condition))
                    except ArcaneError as e:
                        d=e.diagnostic
                        return Diagnostic(d.code,f'line {number}: {d.message}',number,d.column,d.hint),index,None
                    self.scopes.append({})
                    try:
                        chosen=yes if take_yes else no
                        # Execute only the chosen source statements, preserving nested control flow.
                        selected_numbers=set(n for n,_ in chosen)
                        # The parser above records execution results for both branches only as source tuples.
                        # Branches are re-executed through the source interpreter below.
                        branch_source='\n'.join(t for n,t in chosen)
                        branch_results=self.run_program(branch_source) if branch_source else []
                        if isinstance(branch_results,Diagnostic): return branch_results,index,None
                        results.extend(branch_results)
                    finally:
                        self.scopes.pop()
                    continue
                if text in ('ELSE','END'):
                    if text in stops:return results,index,text
                    return Diagnostic('ARC-PARSE-001',f'unexpected {text}',number),index,None
                result=self.run_line(text)
                if isinstance(result,Diagnostic):
                    return Diagnostic(result.code,f'line {number}: {result.message}',number,result.column,result.hint),index,None
                results.append(result); index+=1
            return results,index,None
        # Parser needs source tuples to retain block structure; this nested helper is
        # intentionally separate from evaluation to make malformed delimiters explicit.
        def parse_and_execute(index=0, stops=()):
            results=[]
            while index < len(lines):
                number,text=lines[index]
                if text in stops:return results,index,text
                m=re.fullmatch(r'KWAI\s+(.+?)\s+THEN',text)
                if m:
                    condition=m.group(1); index+=1
                    yes,index,stop=parse_and_execute(index,('ELSE','END'))
                    if isinstance(yes,Diagnostic):return yes,index,None
                    no=[]
                    if stop=='ELSE':
                        index+=1; no,index,stop=parse_and_execute(index,('END',))
                        if isinstance(no,Diagnostic):return no,index,None
                    if stop!='END':return Diagnostic('ARC-PARSE-001','conditional block requires END',number,1,'Close each conditional with END.'),index,None
                    index+=1
                    try: condition_value=self.truth(self.evaluate(condition))
                    except ArcaneError as e:
                        d=e.diagnostic; return Diagnostic(d.code,f'line {number}: {d.message}',number,d.column,d.hint),index,None
                    self.scopes.append({})
                    try:
                        # Branch nodes are (line_number, text) for simple statements and
                        # ('block', condition, yes, no, header_line) for nested blocks.
                        branch=yes if condition_value else no
                        def execute_nodes(nodes):
                            out=[]
                            for node in nodes:
                                if len(node)==5 and node[0]=='block':
                                    _,cond,yy,nn,ln=node
                                    try: val=self.truth(self.evaluate(cond))
                                    except ArcaneError as e:
                                        d=e.diagnostic; return Diagnostic(d.code,f'line {ln}: {d.message}',ln,d.column,d.hint)
                                    self.scopes.append({})
                                    try:
                                        r=execute_nodes(yy if val else nn)
                                        if isinstance(r,Diagnostic):return r
                                        out.extend(r)
                                    finally:self.scopes.pop()
                                else:
                                    ln,txt=node
                                    r=self.run_line(txt)
                                    if isinstance(r,Diagnostic):return Diagnostic(r.code,f'line {ln}: {r.message}',ln,r.column,r.hint)
                                    out.append(r)
                            return out
                        chosen_results=execute_nodes(branch)
                        if isinstance(chosen_results,Diagnostic):return chosen_results,index,None
                        results.extend(chosen_results)
                    finally:self.scopes.pop()
                    continue
                if text in ('ELSE','END'):
                    if text in stops:return results,index,text
                    return Diagnostic('ARC-PARSE-001',f'unexpected {text}',number),index,None
                result=self.run_line(text)
                if isinstance(result,Diagnostic):return Diagnostic(result.code,f'line {number}: {result.message}',number,result.column,result.hint),index,None
                results.append(result); index+=1
            return results,index,None
        # Replace simple results with structured nodes using a dedicated recursive parser.
        def parse_nodes(index=0, stops=()):
            nodes=[]
            while index<len(lines):
                number,text=lines[index]
                if text in stops:return nodes,index,text
                m=re.fullmatch(r'KWAI\s+(.+?)\s+THEN',text)
                if m:
                    cond=m.group(1); yes,index,stop=parse_nodes(index+1,('ELSE','END'))
                    if isinstance(yes,Diagnostic):return yes,index,None
                    no=[]
                    if stop=='ELSE':no,index,stop=parse_nodes(index+1,('END',))
                    if isinstance(no,Diagnostic):return no,index,None
                    if stop!='END':return Diagnostic('ARC-PARSE-001','conditional block requires END',number,1,'Close each conditional with END.'),index,None
                    nodes.append(('block',cond,yes,no,number)); index+=1; continue
                if text in ('ELSE','END'):
                    if text in stops:return nodes,index,text
                    return Diagnostic('ARC-PARSE-001',f'unexpected {text}',number),index,None
                nodes.append((number,text));index+=1
            return nodes,index,None
        nodes,index,stop=parse_nodes()
        if isinstance(nodes,Diagnostic):return nodes
        if stop is not None:return Diagnostic('ARC-PARSE-001',f'unexpected {stop}')
        def execute(nodes):
            results=[]
            for node in nodes:
                if len(node)==5 and node[0]=='block':
                    _,condition,yes,no,number=node
                    try:take_yes=self.truth(self.evaluate(condition))
                    except ArcaneError as e:
                        d=e.diagnostic;return Diagnostic(d.code,f'line {number}: {d.message}',number,d.column,d.hint)
                    self.scopes.append({})
                    try:
                        out=execute(yes if take_yes else no)
                        if isinstance(out,Diagnostic):return out
                        results.extend(out)
                    finally:self.scopes.pop()
                else:
                    number,text=node;out=self.run_line(text)
                    if isinstance(out,Diagnostic):return Diagnostic(out.code,f'line {number}: {out.message}',number,out.column,out.hint)
                    results.append(out)
            return results
        return execute(nodes)

    def run_line(self,line):
        line=line.strip()
        try:
            # Provisional conditional form: KWAI condition THEN expression ELSE expression.
            m=re.fullmatch(r'KWAI\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+)',line)
            if m:
                condition, yes_expr, no_expr=m.groups()
                condition_value=self.evaluate(condition)
                choose_yes=self.truth(condition_value)
                return self.evaluate(yes_expr if choose_yes else no_expr)
            if line.startswith('KWAI '):
                raise ArcaneError('ARC-PARSE-001','conditional requires THEN and ELSE branches','Use: KWAI condition THEN expression ELSE expression')
            m=re.fullmatch(r'KWAM\s+([A-Za-z_]\w*)\s*=>\s*(.+)',line)
            if m:return self.define(m.group(1),self.evaluate(m.group(2)))
            m=re.fullmatch(r'KWAF\s+([A-Za-z_]\w*)\s*\(([^()]*)\)\s*=>\s*(.+)',line)
            if m:
                name,ps,body=m.groups(); params=[p.strip().lstrip('$') for p in ps.split(',') if p.strip()]
                if any(not re.fullmatch(r'[A-Za-z_]\w*',p) for p in params) or len(set(params))!=len(params): raise ArcaneError('ARC-PARSE-001','invalid or duplicate function parameter')
                if name in self.functions or name in self.bindings: raise ArcaneError('ARC-NAME-002',f'name already defined: {name}')
                # Register before syntax validation so self-recursion parses safely.
                self.functions[name]={'params':params,'body':body}
                # Syntax/name validation is deferred until the first call, allowing recursion.
                return f'function {name}/{len(params)} defined'
            m=re.fullmatch(r'KWAT\s+([A-Za-z_]\w*)',line)
            if m:
                return self._lookup_binding(m.group(1),{})
            m=re.fullmatch(r'KWAR\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                n,lo,hi,body=m.groups(); a=self._bound(self.evaluate(lo)); b=self._bound(self.evaluate(hi)); count=max(0,b-a+1)
                if count>self.max_iterations: raise ArcaneError('ARC-LOOP-002','iteration limit exceeded')
                return [self.evaluate(body,{n:Quantity(float(k))}) for k in range(a,b+1)]
            m=re.fullmatch(r'KWAS\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                n,lo,hi,body=m.groups(); a=self._bound(self.evaluate(lo)); b=self._bound(self.evaluate(hi)); count=max(0,b-a+1)
                if count>self.max_iterations: raise ArcaneError('ARC-LOOP-002','iteration limit exceeded')
                vals=[self.evaluate(body,{n:Quantity(float(k))}) for k in range(a,b+1)]
                if not vals:return Quantity(0)
                if not all(isinstance(v,Quantity) for v in vals): raise ArcaneError('ARC-TYPE-001','aggregation requires numeric values')
                if any(v.dimensions!=vals[0].dimensions for v in vals): raise ArcaneError('ARC-UNIT-001','dimension mismatch in aggregation')
                return Quantity(sum(v.value for v in vals),vals[0].dimensions)
            return self.evaluate(line)
        except ArcaneError as e:return e.diagnostic

def show(v):
    if isinstance(v,Quantity):return f'{v.value:g}'+(' dimensionless' if not v.dimensions else f' dimensions={v.dimensions}')
    if isinstance(v,list):return '['+', '.join(show(x) for x in v)+']'
    return str(v)

~~~

## arcane_runtime 16.py

- Type: PY
- SHA-256: `5934852ddf84921f7036c2b0bea61f75cc794ec517c4fc8a4b79bb238f3de82a`
- Extracted characters: 13783

~~~text
"""Arcane Phase 7N: compact runnable subset with user-defined functions.
All grammar spellings here are provisional implementation syntax, not canonical decisions.
"""
from dataclasses import dataclass
import re

@dataclass(frozen=True)
class Diagnostic:
    code: str
    message: str
    line: int = 1
    column: int = 1
    hint: str = ''
    def render(self):
        s=f'{self.code} at {self.line}:{self.column}: {self.message}'
        return s + (f'\n  hint: {self.hint}' if self.hint else '')

class ArcaneError(Exception):
    def __init__(self, code, message, hint=''):
        self.diagnostic=Diagnostic(code,message,hint=hint)
        super().__init__(self.diagnostic.render())

@dataclass(frozen=True)
class Quantity:
    value: float
    dimensions: tuple[int,...]=()
    def same(self, other):
        if not isinstance(other,Quantity): raise ArcaneError('ARC-TYPE-001','numeric value required')
        if self.dimensions != other.dimensions: raise ArcaneError('ARC-UNIT-001','dimension mismatch','Use quantities with compatible dimensions.')
    def __add__(self,o): self.same(o); return Quantity(self.value+o.value,self.dimensions)
    def __sub__(self,o): self.same(o); return Quantity(self.value-o.value,self.dimensions)
    def __mul__(self,o):
        self.same_numeric(o); n=max(len(self.dimensions),len(o.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=o.dimensions+(0,)*(n-len(o.dimensions)); return Quantity(self.value*o.value,tuple(x+y for x,y in zip(a,b)))
    def __truediv__(self,o):
        self.same_numeric(o)
        if o.value==0: raise ArcaneError('ARC-MATH-001','division by zero','Check the denominator before dividing.')
        n=max(len(self.dimensions),len(o.dimensions)); a=self.dimensions+(0,)*(n-len(self.dimensions)); b=o.dimensions+(0,)*(n-len(o.dimensions)); return Quantity(self.value/o.value,tuple(x-y for x,y in zip(a,b)))
    def same_numeric(self,o):
        if not isinstance(o,Quantity): raise ArcaneError('ARC-TYPE-001','numeric value required')

UNITS={'1':Quantity(1), 'm':Quantity(1,(1,0,0)), 'cm':Quantity(.01,(1,0,0)), 'km':Quantity(1000,(1,0,0)), 's':Quantity(1,(0,1,0)), 'kg':Quantity(1,(0,0,1))}
TOKEN=re.compile(r'\s*(?:(\d+(?:\.\d+)?)|(\$?[A-Za-z_][A-Za-z_0-9]*)|(=>)|(\()|(\))|(,))')

class ArcaneRuntime:
    def __init__(self,max_iterations=1000,max_call_depth=64):
        self.bindings={}; self.functions={}; self.scopes=[]; self.max_iterations=max_iterations; self.max_call_depth=max_call_depth
    def define(self,name,value):
        target=self.scopes[-1] if self.scopes else self.bindings
        if name in target: raise ArcaneError('ARC-NAME-002',f'duplicate binding {name}')
        if not self.scopes and (name in self.functions): raise ArcaneError('ARC-NAME-002',f'name already defined: {name}')
        target[name]=value; return value

    def _lookup_binding(self,name,locals_):
        if name in locals_: return locals_[name]
        for scope in reversed(self.scopes):
            if name in scope: return scope[name]
        if name in self.bindings: return self.bindings[name]
        raise ArcaneError('ARC-NAME-001',f'unknown binding {name}','Check the spelling and scope.')
    def _tokenize(self,src):
        out=[]; p=0
        while p<len(src):
            if src[p:].strip()=='': break
            m=TOKEN.match(src,p)
            if not m: raise ArcaneError('ARC-PARSE-001',f'unexpected token at column {p+1}','Check spelling and delimiters.')
            out.append(next(x for x in m.groups() if x is not None)); p=m.end()
        return out
    def evaluate(self,src,locals_=None,depth=0):
        if depth>self.max_call_depth: raise ArcaneError('ARC-RUNTIME-001','maximum function call depth exceeded')
        locals_=locals_ or {}; ts=self._tokenize(src); i=0
        def expr(execute=True):
            nonlocal i
            if i>=len(ts): raise ArcaneError('ARC-PARSE-001','unexpected end of expression')
            t=ts[i]; i+=1
            if t=='(':
                v=expr(execute)
                if i>=len(ts) or ts[i]!=')': raise ArcaneError('ARC-PARSE-001','expected closing parenthesis')
                i+=1; return v
            if t.replace('.','',1).isdigit(): return Quantity(float(t)) if execute else None
            if t.startswith('$'):
                n=t[1:]
                if not execute:return None
                return self._lookup_binding(n,locals_)
            if t in ('FRNOT','FRAND','FROR'):
                if t=='FRNOT':
                    v=expr(execute); return (not self.truth(v)) if execute else None
                left=expr(execute)
                if not execute: expr(False); return None
                b=self.truth(left)
                if t=='FRAND' and not b: expr(False); return False
                if t=='FROR' and b: expr(False); return True
                return self.truth(expr(True))
            if t in ('FRAPA','FRALA','FRATA','FRAKA','FRAGT','FRALT','FRAEQ'):
                a=expr(execute); b=expr(execute)
                if not execute:return None
                if t=='FRAPA':return a+b
                if t=='FRALA':return a-b
                if t=='FRATA':return a*b
                if t=='FRAKA':return a/b
                a.same(b)
                return a.value>b.value if t=='FRAGT' else a.value<b.value if t=='FRALT' else a.value==b.value
            if t in UNITS:return UNITS[t] if execute else None
            if t in self.functions:
                if i>=len(ts) or ts[i]!='(': raise ArcaneError('ARC-PARSE-001',f'function {t} requires parentheses')
                i+=1; args=[]
                if i<len(ts) and ts[i]!=')':
                    while True:
                        args.append(expr(execute))
                        if i<len(ts) and ts[i]==',': i+=1; continue
                        break
                if i>=len(ts) or ts[i]!=')': raise ArcaneError('ARC-PARSE-001','expected ) after function arguments')
                i+=1
                if not execute:return None
                fn=self.functions[t]
                if len(args)!=len(fn['params']): raise ArcaneError('ARC-TYPE-001',f'{t} expects {len(fn["params"])} arguments, got {len(args)}')
                return self.evaluate(fn['body'],dict(zip(fn['params'],args)),depth+1)
            if not execute:return None
            raise ArcaneError('ARC-NAME-001',f'unknown name {t}')
        result=expr()
        if i!=len(ts): raise ArcaneError('ARC-PARSE-001',f'unexpected token {ts[i]}')
        return result
    @staticmethod
    def truth(v):
        if isinstance(v,bool):return v
        if isinstance(v,Quantity) and not v.dimensions and v.value in (0,1):return v.value==1
        raise ArcaneError('ARC-TYPE-001','logical operation requires boolean or dimensionless 0/1')
    @staticmethod
    def _bound(v):
        if not isinstance(v,Quantity) or v.dimensions or not v.value.is_integer(): raise ArcaneError('ARC-LOOP-001','bounds must be dimensionless integers')
        return int(v.value)
    def run_program(self, source):
        """Parse and execute a complete program using a small structured AST.

        Provisional syntax: KWAI condition THEN / ELSE / END. Parsing completes
        before execution begins, so malformed blocks cannot partially mutate state.
        Returns statement results, or a Diagnostic on the first parse/runtime error.
        """
        lines=[]
        for number, raw in enumerate(source.splitlines(), 1):
            text=raw.strip()
            if text and not text.startswith('#'):
                lines.append((number, text))

        def parse_sequence(index, stops=()):
            nodes=[]
            while index < len(lines):
                number, text=lines[index]
                if text in stops:
                    return nodes, index, text
                match=re.fullmatch(r'KWAI\s+(.+?)\s+THEN', text)
                if match:
                    condition=match.group(1)
                    yes, index, stop=parse_sequence(index+1, ('ELSE','END'))
                    if isinstance(yes, Diagnostic): return yes, index, None
                    no=[]
                    if stop == 'ELSE':
                        no, index, stop=parse_sequence(index+1, ('END',))
                        if isinstance(no, Diagnostic): return no, index, None
                    if stop != 'END':
                        return Diagnostic('ARC-PARSE-001', 'conditional block requires END', number, 1, 'Close each conditional with END.'), index, None
                    nodes.append(('if', condition, yes, no, number))
                    index += 1
                    continue
                if text in ('ELSE','END'):
                    if text in stops: return nodes, index, text
                    return Diagnostic('ARC-PARSE-001', f'unexpected {text}', number), index, None
                nodes.append(('statement', number, text))
                index += 1
            return nodes, index, None

        nodes, index, stop=parse_sequence(0)
        if isinstance(nodes, Diagnostic): return nodes
        if stop is not None: return Diagnostic('ARC-PARSE-001', f'unexpected {stop}')

        def execute(sequence):
            results=[]
            for node in sequence:
                if node[0] == 'if':
                    _, condition, yes, no, number=node
                    try:
                        condition_value=self.truth(self.evaluate(condition))
                    except ArcaneError as error:
                        d=error.diagnostic
                        return Diagnostic(d.code, f'line {number}: {d.message}', number, d.column, d.hint)
                    self.scopes.append({})
                    try:
                        branch_results=execute(yes if condition_value else no)
                        if isinstance(branch_results, Diagnostic): return branch_results
                        results.extend(branch_results)
                    finally:
                        self.scopes.pop()
                else:
                    _, number, text=node
                    result=self.run_line(text)
                    if isinstance(result, Diagnostic):
                        return Diagnostic(result.code, f'line {number}: {result.message}', number, result.column, result.hint)
                    results.append(result)
            return results
        return execute(nodes)

    def run_line(self,line):
        line=line.strip()
        try:
            # Provisional conditional form: KWAI condition THEN expression ELSE expression.
            m=re.fullmatch(r'KWAI\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+)',line)
            if m:
                condition, yes_expr, no_expr=m.groups()
                condition_value=self.evaluate(condition)
                choose_yes=self.truth(condition_value)
                return self.evaluate(yes_expr if choose_yes else no_expr)
            if line.startswith('KWAI '):
                raise ArcaneError('ARC-PARSE-001','conditional requires THEN and ELSE branches','Use: KWAI condition THEN expression ELSE expression')
            m=re.fullmatch(r'KWAM\s+([A-Za-z_]\w*)\s*=>\s*(.+)',line)
            if m:return self.define(m.group(1),self.evaluate(m.group(2)))
            m=re.fullmatch(r'KWAF\s+([A-Za-z_]\w*)\s*\(([^()]*)\)\s*=>\s*(.+)',line)
            if m:
                name,ps,body=m.groups(); params=[p.strip().lstrip('$') for p in ps.split(',') if p.strip()]
                if any(not re.fullmatch(r'[A-Za-z_]\w*',p) for p in params) or len(set(params))!=len(params): raise ArcaneError('ARC-PARSE-001','invalid or duplicate function parameter')
                if name in self.functions or name in self.bindings: raise ArcaneError('ARC-NAME-002',f'name already defined: {name}')
                # Register before syntax validation so self-recursion parses safely.
                self.functions[name]={'params':params,'body':body}
                # Syntax/name validation is deferred until the first call, allowing recursion.
                return f'function {name}/{len(params)} defined'
            m=re.fullmatch(r'KWAT\s+([A-Za-z_]\w*)',line)
            if m:
                return self._lookup_binding(m.group(1),{})
            m=re.fullmatch(r'KWAR\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                n,lo,hi,body=m.groups(); a=self._bound(self.evaluate(lo)); b=self._bound(self.evaluate(hi)); count=max(0,b-a+1)
                if count>self.max_iterations: raise ArcaneError('ARC-LOOP-002','iteration limit exceeded')
                return [self.evaluate(body,{n:Quantity(float(k))}) for k in range(a,b+1)]
            m=re.fullmatch(r'KWAS\s+([A-Za-z_]\w*)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',line)
            if m:
                n,lo,hi,body=m.groups(); a=self._bound(self.evaluate(lo)); b=self._bound(self.evaluate(hi)); count=max(0,b-a+1)
                if count>self.max_iterations: raise ArcaneError('ARC-LOOP-002','iteration limit exceeded')
                vals=[self.evaluate(body,{n:Quantity(float(k))}) for k in range(a,b+1)]
                if not vals:return Quantity(0)
                if not all(isinstance(v,Quantity) for v in vals): raise ArcaneError('ARC-TYPE-001','aggregation requires numeric values')
                if any(v.dimensions!=vals[0].dimensions for v in vals): raise ArcaneError('ARC-UNIT-001','dimension mismatch in aggregation')
                return Quantity(sum(v.value for v in vals),vals[0].dimensions)
            return self.evaluate(line)
        except ArcaneError as e:return e.diagnostic

def show(v):
    if isinstance(v,Quantity):return f'{v.value:g}'+(' dimensionless' if not v.dimensions else f' dimensions={v.dimensions}')
    if isinstance(v,list):return '['+', '.join(show(x) for x in v)+']'
    return str(v)

~~~

## arcane_runtime 17.py

- Type: PY
- SHA-256: `3ab8b8d52327d26e7bf5a5c8ce3224fd103651bb38e01140ff5516c6e59fb649`
- Extracted characters: 7978

~~~text
"""Phase 7U: minimal executable Arcane subset. Grammar is provisional."""
from __future__ import annotations
from dataclasses import dataclass
import re
from typing import Any

@dataclass(frozen=True)
class Diagnostic:
    code: str
    message: str
    line: int = 1
    hint: str = ""
    def render(self, filename="<source>"):
        return f"{filename}:{self.line}: error {self.code}: {self.message}" + (f" Hint: {self.hint}" if self.hint else "")

class ArcaneFailure(Exception):
    def __init__(self, code, message, line=1, hint=""):
        super().__init__(message); self.code=code; self.message=message; self.line=line; self.hint=hint
    def diagnostic(self): return Diagnostic(self.code,self.message,self.line,self.hint)

TOKEN = re.compile(r"\s*(\$[A-Za-z_][A-Za-z0-9_]*|(?:\d+\.\d+|\d+)|[A-Za-z_][A-Za-z0-9_]*|==|!=|<=|>=|[()+\-*/%,<>])")
PREFIX = {'FRATA':lambda a,b:a*b, 'FRAPA':lambda a,b:a+b, 'FRAMO':lambda a,b:a-b, 'FRADI':lambda a,b:a/b, 'FRAGT':lambda a,b:a>b, 'FRALT':lambda a,b:a<b, 'FRAEQ':lambda a,b:a==b, 'FRANE':lambda a,b:a!=b, 'FRAGE':lambda a,b:a>=b, 'FRALE':lambda a,b:a<=b}
PREC={'==':1,'!=':1,'<':1,'>':1,'<=':1,'>=':1,'+':2,'-':2,'*':3,'/':3,'%':3}

def tokens(src,line):
    out=[]; p=0
    while p<len(src):
        m=TOKEN.match(src,p)
        if not m:
            if src[p:].strip()=='' : break
            raise ArcaneFailure('ARC-EXPR-001',f"unexpected character {src[p]!r}",line)
        out.append(m.group(1)); p=m.end()
    if not out: raise ArcaneFailure('ARC-EXPR-001','empty expression',line)
    return out

class Expr:
    def __init__(self,ts,scope,functions,line): self.ts=ts; self.i=0; self.scope=scope; self.functions=functions; self.line=line
    def peek(self): return self.ts[self.i] if self.i<len(self.ts) else None
    def take(self):
        t=self.peek()
        if t is None: raise ArcaneFailure('ARC-EXPR-001','unexpected end of expression',self.line)
        self.i+=1; return t
    def parse(self,minp=0):
        t=self.take()
        if t=='(':
            v=self.parse()
            if self.take()!=')': raise ArcaneFailure('ARC-EXPR-001',"expected ')'",self.line)
        elif t in ('+','-'):
            v=self.parse(4); v=+v if t=='+' else -v
        elif t.startswith('$'):
            name=t[1:]
            try: v=self.scope[name]
            except KeyError: raise ArcaneFailure('ARC-SEM-005',f"unresolved binding '${name}'",self.line,"Declare it before use in the current scope or an enclosing scope.")
        elif re.fullmatch(r'\d+(?:\.\d+)?',t): v=float(t) if '.' in t else int(t)
        elif re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*',t):
            if t in PREFIX:
                a=self.parse(4); b=self.parse(4); v=PREFIX[t](a,b)
            elif self.peek()=='(':
                self.take(); args=[]
                if self.peek()!=')':
                    args.append(self.parse())
                    while self.peek()==',': self.take(); args.append(self.parse())
                if self.take()!=')': raise ArcaneFailure('ARC-EXPR-001',"expected ')' after arguments",self.line)
                if t not in self.functions: raise ArcaneFailure('ARC-SEM-006',f"undefined function '{t}'",self.line)
                fn=self.functions[t]
                if len(args)!=len(fn[0]): raise ArcaneFailure('ARC-SEM-007',f"function '{t}' expects {len(fn[0])} argument(s), got {len(args)}",self.line)
                local=dict(zip(fn[0],args)); v=self.eval_function(fn[1],local,t)
            else: raise ArcaneFailure('ARC-EXPR-002',f"bare name '{t}' is not a value",self.line,"Use $binding or a function call.")
        else: raise ArcaneFailure('ARC-EXPR-001',f"unexpected token {t!r}",self.line)
        while self.peek() in PREC and PREC[self.peek()]>=minp:
            op=self.take(); rhs=self.parse(PREC[op]+1)
            try:
                if op=='+': v=v+rhs
                elif op=='-': v=v-rhs
                elif op=='*': v=v*rhs
                elif op=='/': v=v/rhs
                elif op=='%': v=v%rhs
                elif op=='==': v=v==rhs
                elif op=='!=': v=v!=rhs
                elif op=='<': v=v<rhs
                elif op=='>': v=v>rhs
                elif op=='<=': v=v<=rhs
                elif op=='>=': v=v>=rhs
            except (TypeError,ZeroDivisionError) as e: raise ArcaneFailure('ARC-RUN-001',f"operator {op!r} failed: {e}",self.line)
        return v
    def eval_function(self,body,local,name):
        # Function body expression uses a fresh scope containing its parameters.
        return evaluate(body,local,self.functions,self.line)

def evaluate(src,scope,functions,line):
    ts=tokens(src,line); p=Expr(ts,scope,functions,line); value=p.parse()
    if p.peek() is not None: raise ArcaneFailure('ARC-EXPR-001',f"unexpected token {p.peek()!r}",line)
    return value

class ArcaneRuntime:
    def __init__(self): self.globals={}; self.functions={}; self.output=[]
    def run_program(self,source):
        # Parse all block structure before running any statements.
        lines=[(n,raw.strip()) for n,raw in enumerate(source.splitlines(),1) if raw.strip() and not raw.strip().startswith('#')]
        def parse_seq(i,stops=()):
            nodes=[]
            while i<len(lines):
                n,s=lines[i]
                if s in stops: return nodes,i,s
                m=re.fullmatch(r'KWAI\s+(.+?)\s+THEN',s)
                if m:
                    yes,i,stop=parse_seq(i+1,('ELSE','END'))
                    if stop=='ELSE': no,i,stop=parse_seq(i+1,('END',))
                    else: no=[]
                    if stop!='END': raise ArcaneFailure('ARC-PARSE-001','conditional block missing END',n)
                    nodes.append(('if',n,m.group(1),yes,no)); i+=1; continue
                if s in ('ELSE','END'): raise ArcaneFailure('ARC-PARSE-002',f'unexpected {s}',n)
                if s.startswith('KWAI '): raise ArcaneFailure('ARC-PARSE-003','malformed conditional header; expected KWAI condition THEN',n)
                nodes.append(('stmt',n,s)); i+=1
            return nodes,i,None
        try:
            ast,i,stop=parse_seq(0)
            if stop: raise ArcaneFailure('ARC-PARSE-002',f'unexpected {stop}')
            self.output=[]; self._exec(ast,self.globals)
            return list(self.output)
        except ArcaneFailure as e: return e.diagnostic()
    def _exec(self,nodes,scope):
        for node in nodes:
            if node[0]=='if':
                _,line,condition,yes,no=node
                truth=evaluate(condition,scope,self.functions,line)
                branch=yes if truth else no
                self._exec(branch,dict(scope))
                continue
            _,line,s=node
            fm=re.fullmatch(r'KWAF\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^()]*)\)\s*=>\s*(.+)',s)
            if fm:
                name,raw,body=fm.groups(); params=tuple(x.strip().lstrip('$') for x in raw.split(',') if x.strip())
                if len(set(params))!=len(params): raise ArcaneFailure('ARC-SEM-002',f'duplicate parameter in function {name}',line)
                if name in self.functions: raise ArcaneFailure('ARC-SEM-003',f"function '{name}' defined more than once",line)
                self.functions[name]=(params,body); continue
            bm=re.fullmatch(r'KWAM\s+([A-Za-z_][A-Za-z0-9_]*)\s*=>\s*(.+)',s)
            if bm:
                name,expr=bm.groups()
                if name in scope: raise ArcaneFailure('ARC-SEM-004',f"binding '{name}' already exists in this scope",line)
                scope[name]=evaluate(expr,scope,self.functions,line); continue
            om=re.fullmatch(r'KWAT\s+([A-Za-z_][A-Za-z0-9_]*)',s)
            if om:
                name=om.group(1)
                if name not in scope: raise ArcaneFailure('ARC-SEM-005',f"unresolved binding '{name}'",line)
                self.output.append(scope[name]); continue
            raise ArcaneFailure('ARC-PARSE-004',f"unsupported statement: {s}",line,"Supported: KWAM, KWAF, KWAT and structured KWAI blocks.")

~~~

## arcane_runtime 18.py

- Type: PY
- SHA-256: `1fe59ac352cf122a6edd48e77f0ee8844dc7215728b4db9cbee1c10b2a260fec`
- Extracted characters: 9845

~~~text
"""Phase 7U: minimal executable Arcane subset. Grammar is provisional."""
from __future__ import annotations
from dataclasses import dataclass
import re
from typing import Any

@dataclass(frozen=True)
class Diagnostic:
    code: str
    message: str
    line: int = 1
    hint: str = ""
    def render(self, filename="<source>"):
        return f"{filename}:{self.line}: error {self.code}: {self.message}" + (f" Hint: {self.hint}" if self.hint else "")

class ArcaneFailure(Exception):
    def __init__(self, code, message, line=1, hint=""):
        super().__init__(message); self.code=code; self.message=message; self.line=line; self.hint=hint
    def diagnostic(self): return Diagnostic(self.code,self.message,self.line,self.hint)

TOKEN = re.compile(r"\s*(\$[A-Za-z_][A-Za-z0-9_]*|(?:\d+\.\d+|\d+)|[A-Za-z_][A-Za-z0-9_]*|==|!=|<=|>=|[()+\-*/%,<>])")
PREFIX = {'FRATA':lambda a,b:a*b, 'FRAPA':lambda a,b:a+b, 'FRAMO':lambda a,b:a-b, 'FRADI':lambda a,b:a/b, 'FRAGT':lambda a,b:a>b, 'FRALT':lambda a,b:a<b, 'FRAEQ':lambda a,b:a==b, 'FRANE':lambda a,b:a!=b, 'FRAGE':lambda a,b:a>=b, 'FRALE':lambda a,b:a<=b}
PREC={'==':1,'!=':1,'<':1,'>':1,'<=':1,'>=':1,'+':2,'-':2,'*':3,'/':3,'%':3}

def tokens(src,line):
    out=[]; p=0
    while p<len(src):
        m=TOKEN.match(src,p)
        if not m:
            if src[p:].strip()=='' : break
            raise ArcaneFailure('ARC-EXPR-001',f"unexpected character {src[p]!r}",line)
        out.append(m.group(1)); p=m.end()
    if not out: raise ArcaneFailure('ARC-EXPR-001','empty expression',line)
    return out

class Expr:
    def __init__(self,ts,scope,functions,line,call_depth=0,max_call_depth=100): self.ts=ts; self.i=0; self.scope=scope; self.functions=functions; self.line=line; self.call_depth=call_depth; self.max_call_depth=max_call_depth
    def peek(self): return self.ts[self.i] if self.i<len(self.ts) else None
    def take(self):
        t=self.peek()
        if t is None: raise ArcaneFailure('ARC-EXPR-001','unexpected end of expression',self.line)
        self.i+=1; return t
    def parse(self,minp=0):
        t=self.take()
        if t=='(':
            v=self.parse()
            if self.take()!=')': raise ArcaneFailure('ARC-EXPR-001',"expected ')'",self.line)
        elif t in ('+','-'):
            v=self.parse(4); v=+v if t=='+' else -v
        elif t.startswith('$'):
            name=t[1:]
            try: v=self.scope[name]
            except KeyError: raise ArcaneFailure('ARC-SEM-005',f"unresolved binding '${name}'",self.line,"Declare it before use in the current scope or an enclosing scope.")
        elif re.fullmatch(r'\d+(?:\.\d+)?',t): v=float(t) if '.' in t else int(t)
        elif re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*',t):
            if t in PREFIX:
                a=self.parse(4); b=self.parse(4); v=PREFIX[t](a,b)
            elif self.peek()=='(':
                self.take(); args=[]
                if self.peek()!=')':
                    args.append(self.parse())
                    while self.peek()==',': self.take(); args.append(self.parse())
                if self.take()!=')': raise ArcaneFailure('ARC-EXPR-001',"expected ')' after arguments",self.line)
                if t not in self.functions: raise ArcaneFailure('ARC-SEM-006',f"undefined function '{t}'",self.line)
                fn=self.functions[t]
                if len(args)!=len(fn[0]): raise ArcaneFailure('ARC-SEM-007',f"function '{t}' expects {len(fn[0])} argument(s), got {len(args)}",self.line)
                if self.call_depth >= self.max_call_depth:
                    raise ArcaneFailure('ARC-RUN-002',f"maximum function call depth ({self.max_call_depth}) exceeded in '{t}'",self.line)
                local=dict(zip(fn[0],args)); v=self.eval_function(fn[1],local,t)
            else: raise ArcaneFailure('ARC-EXPR-002',f"bare name '{t}' is not a value",self.line,"Use $binding or a function call.")
        else: raise ArcaneFailure('ARC-EXPR-001',f"unexpected token {t!r}",self.line)
        while self.peek() in PREC and PREC[self.peek()]>=minp:
            op=self.take(); rhs=self.parse(PREC[op]+1)
            try:
                if op=='+': v=v+rhs
                elif op=='-': v=v-rhs
                elif op=='*': v=v*rhs
                elif op=='/': v=v/rhs
                elif op=='%': v=v%rhs
                elif op=='==': v=v==rhs
                elif op=='!=': v=v!=rhs
                elif op=='<': v=v<rhs
                elif op=='>': v=v>rhs
                elif op=='<=': v=v<=rhs
                elif op=='>=': v=v>=rhs
            except (TypeError,ZeroDivisionError) as e: raise ArcaneFailure('ARC-RUN-001',f"operator {op!r} failed: {e}",self.line)
        return v
    def eval_function(self,body,local,name):
        # Function body expression uses a fresh scope containing its parameters.
        return evaluate(body,local,self.functions,self.line,self.call_depth+1,self.max_call_depth)

def evaluate(src,scope,functions,line,call_depth=0,max_call_depth=100):
    ts=tokens(src,line); p=Expr(ts,scope,functions,line,call_depth,max_call_depth); value=p.parse()
    if p.peek() is not None: raise ArcaneFailure('ARC-EXPR-001',f"unexpected token {p.peek()!r}",line)
    return value

def parse_program(source):
    """Parse source into the AST shared by the checker and runtime."""
    lines=[(n,raw.strip()) for n,raw in enumerate(source.splitlines(),1) if raw.strip() and not raw.strip().startswith('#')]
    def parse_seq(i,stops=()):
        nodes=[]
        while i<len(lines):
            n,s=lines[i]
            if s in stops: return nodes,i,s
            m=re.fullmatch(r'KWAI\s+(.+?)\s+THEN',s)
            if m:
                yes,i,stop=parse_seq(i+1,('ELSE','END'))
                if stop=='ELSE': no,i,stop=parse_seq(i+1,('END',))
                else: no=[]
                if stop!='END': raise ArcaneFailure('ARC-PARSE-001','conditional block missing END',n)
                nodes.append(('if',n,m.group(1),yes,no)); i+=1; continue
            if s in ('ELSE','END'): raise ArcaneFailure('ARC-PARSE-002',f'unexpected {s}',n)
            if s.startswith('KWAI '): raise ArcaneFailure('ARC-PARSE-003','malformed conditional header; expected KWAI condition THEN',n)
            if s.startswith('KWAM ') and not re.fullmatch(r'KWAM\s+[A-Za-z_][A-Za-z0-9_]*\s*=>\s*.+',s):
                raise ArcaneFailure('ARC-PARSE-005','malformed binding; expected KWAM name => expression',n)
            if s.startswith('KWAF ') and not re.fullmatch(r'KWAF\s+[A-Za-z_][A-Za-z0-9_]*\s*\([^()]*\)\s*=>\s*.+',s):
                raise ArcaneFailure('ARC-PARSE-006','malformed function; expected KWAF name(params) => expression',n)
            if s.startswith('KWAT ') and not re.fullmatch(r'KWAT\s+[A-Za-z_][A-Za-z0-9_]*',s):
                raise ArcaneFailure('ARC-PARSE-007','malformed output; expected KWAT binding_name',n)
            if not (s.startswith('KWAM ') or s.startswith('KWAF ') or s.startswith('KWAT ')):
                raise ArcaneFailure('ARC-PARSE-004',f'unsupported statement: {s}',n,'Supported: KWAM, KWAF, KWAT and structured KWAI blocks.')
            nodes.append(('stmt',n,s)); i+=1
        return nodes,i,None
    ast,i,stop=parse_seq(0)
    if stop: raise ArcaneFailure('ARC-PARSE-002',f'unexpected {stop}')
    return ast, len(lines)

class ArcaneRuntime:
    def __init__(self,max_call_depth=100,max_steps=10000):
        self.globals={}; self.functions={}; self.output=[]
        self.max_call_depth=max_call_depth; self.max_steps=max_steps; self.steps=0
    def run_program(self,source):
        # Parse and statically validate statement shapes before mutating runtime state.
        try:
            ast,_=parse_program(source)
            self.globals={}; self.functions={}; self.output=[]; self.steps=0
            self._exec(ast,self.globals)
            return list(self.output)
        except ArcaneFailure as e: return e.diagnostic()
    def _step(self,line):
        self.steps += 1
        if self.steps > self.max_steps:
            raise ArcaneFailure('ARC-RUN-003',f'maximum execution step count ({self.max_steps}) exceeded',line)
    def _exec(self,nodes,scope):
        for node in nodes:
            self._step(node[1])
            if node[0]=='if':
                _,line,condition,yes,no=node
                truth=evaluate(condition,scope,self.functions,line,max_call_depth=self.max_call_depth)
                branch=yes if truth else no
                self._exec(branch,dict(scope))
                continue
            _,line,s=node
            fm=re.fullmatch(r'KWAF\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^()]*)\)\s*=>\s*(.+)',s)
            if fm:
                name,raw,body=fm.groups(); params=tuple(x.strip().lstrip('$') for x in raw.split(',') if x.strip())
                if len(set(params))!=len(params): raise ArcaneFailure('ARC-SEM-002',f'duplicate parameter in function {name}',line)
                if name in self.functions: raise ArcaneFailure('ARC-SEM-003',f"function '{name}' defined more than once",line)
                self.functions[name]=(params,body); continue
            bm=re.fullmatch(r'KWAM\s+([A-Za-z_][A-Za-z0-9_]*)\s*=>\s*(.+)',s)
            if bm:
                name,expr=bm.groups()
                if name in scope: raise ArcaneFailure('ARC-SEM-004',f"binding '{name}' already exists in this scope",line)
                scope[name]=evaluate(expr,scope,self.functions,line,max_call_depth=self.max_call_depth); continue
            om=re.fullmatch(r'KWAT\s+([A-Za-z_][A-Za-z0-9_]*)',s)
            if om:
                name=om.group(1)
                if name not in scope: raise ArcaneFailure('ARC-SEM-005',f"unresolved binding '{name}'",line)
                self.output.append(scope[name]); continue
            raise ArcaneFailure('ARC-PARSE-004',f"unsupported statement: {s}",line,"Supported: KWAM, KWAF, KWAT and structured KWAI blocks.")

~~~

## arcane_runtime 2.py

- Type: PY
- SHA-256: `222ecf0d5c383d0b78beecf81098f1e0499ee42dac7ad0c9e05542c21b23688f`
- Extracted characters: 6906

~~~text
"""Arcane Phase 7A: provisional typed quantities + bindings runtime.

Binding syntax here is an implementation profile, not a canon change:
  KWAM name = expression   create an immutable value binding
  KWAT name                reference a binding
  KWAK name = expression   create a live expression binding, reevaluated on read
Expression literals: 3, 2.5, 3@m, 30@cm, 2@s, ZA..PE
Arithmetic operators: FRAPA, FRATA, FRAKA, FRALA (binary prefix forms)
"""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
import re

class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass
class ArcaneBindingError(ArcaneError): pass

DIMENSIONLESS=(0,0,0)
UNITS={"1":(Decimal(1),DIMENSIONLESS),"m":(Decimal(1),(1,0,0)),"cm":(Decimal('.01'),(1,0,0)),"km":(Decimal(1000),(1,0,0)),"s":(Decimal(1),(0,1,0)),"min":(Decimal(60),(0,1,0)),"h":(Decimal(3600),(0,1,0)),"kg":(Decimal(1),(0,0,1)),"g":(Decimal('.001'),(0,0,1))}
DIGITS={"ZA":0,"KI":1,"TO":2,"MU":3,"RE":4,"SA":5,"FI":6,"DU":7,"GO":8,"PE":9}
ARITY={"FRAPA":2,"FRATA":2,"FRAKA":2,"FRALA":2}
_NUM_UNIT=re.compile(r"^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)(?:@([A-Za-z0-9]+))?$")
_NAME=re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")

@dataclass(frozen=True)
class Quantity:
    value: Decimal
    dimension: tuple[int,int,int]
@dataclass(frozen=True)
class Literal:
    quantity: Quantity
@dataclass(frozen=True)
class Reference:
    name: str
@dataclass(frozen=True)
class Call:
    op: str
    args: tuple['Expr',...]
Expr=Literal|Reference|Call

def _adddim(a,b): return tuple(x+y for x,y in zip(a,b))
def _subdim(a,b): return tuple(x-y for x,y in zip(a,b))
def _literal(token):
    if token in DIGITS: return Literal(Quantity(Decimal(DIGITS[token]),DIMENSIONLESS))
    m=_NUM_UNIT.fullmatch(token)
    if not m: return None
    raw,unit=m.groups(); unit=unit or '1'
    if unit not in UNITS: raise ArcaneTypeError(f"unknown unit {unit!r}")
    try: val=Decimal(raw)
    except InvalidOperation as e: raise ArcaneParseError(f"invalid number {token!r}") from e
    scale,dim=UNITS[unit]
    return Literal(Quantity(val*scale,dim))

class _Parser:
    def __init__(self,tokens): self.tokens=tokens; self.i=0
    def expr(self):
        if self.i>=len(self.tokens): raise ArcaneParseError('unexpected end; expected operand')
        tok=self.tokens[self.i]; self.i+=1
        lit=_literal(tok)
        if lit is not None: return lit
        if tok.startswith('$') and _NAME.fullmatch(tok[1:]): return Reference(tok[1:])
        if tok in ARITY: return Call(tok,tuple(self.expr() for _ in range(ARITY[tok])))
        raise ArcaneParseError(f"unknown form or malformed literal {tok!r}")

def parse(source):
    if not isinstance(source,str) or not source.strip(): raise ArcaneParseError('expression must not be empty')
    p=_Parser(source.split()); tree=p.expr()
    if p.i!=len(p.tokens): raise ArcaneParseError('extra tokens: '+' '.join(p.tokens[p.i:]))
    return tree

@dataclass
class Binding:
    kind: str
    expression: Expr|None=None
    value: Quantity|None=None

class Environment:
    def __init__(self): self._bindings={}; self._resolving=[]
    def create_value(self,name,expression):
        self._validate_name(name); key=name.casefold()
        if key in self._bindings: raise ArcaneBindingError(f"binding {name!r} already exists")
        tree=parse(expression); value=self.evaluate_expr(tree)
        self._bindings[key]=Binding('value',value=value)
        return value
    def create_live(self,name,expression):
        self._validate_name(name); key=name.casefold()
        if key in self._bindings: raise ArcaneBindingError(f"binding {name!r} already exists")
        tree=parse(expression)
        # Validate references and type semantics now, but do not store evaluated result.
        self.evaluate_expr(tree)
        self._bindings[key]=Binding('live',expression=tree)
        return self.resolve(name)
    def _validate_name(self,name):
        if not isinstance(name,str) or not _NAME.fullmatch(name): raise ArcaneBindingError(f"invalid binding name {name!r}")
    def resolve(self,name):
        key=name.casefold()
        if key not in self._bindings: raise ArcaneBindingError(f"unknown binding {name!r}")
        if key in self._resolving: raise ArcaneBindingError('cyclic live binding: '+' -> '.join(self._resolving+[key]))
        b=self._bindings[key]
        if b.kind=='value': return b.value
        self._resolving.append(key)
        try: return self.evaluate_expr(b.expression)
        finally: self._resolving.pop()
    def evaluate_expr(self,tree):
        if isinstance(tree,Literal): return tree.quantity
        if isinstance(tree,Reference): return self.resolve(tree.name)
        a,b=(self.evaluate_expr(x) for x in tree.args)
        if tree.op in ('FRAPA','FRATA') and a.dimension!=b.dimension:
            raise ArcaneTypeError(f"{tree.op} requires matching dimensions; got {a.dimension} and {b.dimension}")
        if tree.op=='FRAPA': return Quantity(a.value+b.value,a.dimension)
        if tree.op=='FRATA': return Quantity(a.value-b.value,a.dimension)
        if tree.op=='FRAKA': return Quantity(a.value*b.value,_adddim(a.dimension,b.dimension))
        if tree.op=='FRALA':
            if b.value==0: raise ArcaneEvaluationError('FRALA: division by zero')
            return Quantity(a.value/b.value,_subdim(a.dimension,b.dimension))
        raise ArcaneParseError(f"unsupported operator {tree.op}")
    def execute(self,statement):
        """Execute one statement in provisional command syntax."""
        s=statement.strip()
        m=re.fullmatch(r'KWAM\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)',s,re.I)
        if m: return self.create_value(m.group(1),m.group(2))
        m=re.fullmatch(r'KWAK\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)',s,re.I)
        if m: return self.create_live(m.group(1),m.group(2))
        m=re.fullmatch(r'KWAT\s+([A-Za-z_][A-Za-z0-9_]*)',s,re.I)
        if m: return self.resolve(m.group(1))
        raise ArcaneParseError('expected KWAM name = expression, KWAK name = expression, or KWAT name')

def format_quantity(q):
    v=format(q.value.normalize(),'f') if q.value else '0'; l,t,m=q.dimension
    if (l,t,m)==DIMENSIONLESS: unit='1'
    else:
        bits=[]
        for symbol,power in [('m',l),('s',t),('kg',m)]:
            if power: bits.append(symbol if power==1 else f'{symbol}^{power}')
        unit=' '.join(bits)
    return f'{v} {unit}'

if __name__=='__main__':
    import argparse
    cli=argparse.ArgumentParser(description='Arcane provisional typed bindings runtime')
    cli.add_argument('statement',nargs='+'); ns=cli.parse_args(); env=Environment()
    try: print(format_quantity(env.execute(' '.join(ns.statement))))
    except ArcaneError as exc: raise SystemExit(f'Arcane error: {exc}')

~~~

## arcane_runtime 3.py

- Type: PY
- SHA-256: `62c72607786baebb2e51f5a4f5213c438ee58d3cf3782ad13e51c0293deb0e34`
- Extracted characters: 8497

~~~text
"""Arcane Phase 7B: provisional mutable state and lexical scopes.

Not canon: KWAM name = expr (immutable value), KWAK name = expr (live expression),
KWAT name (read), KWAS name = expr (update nearest existing mutable state).
Expressions use $name references and binary prefix arithmetic operators.
"""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
import re

class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass
class ArcaneBindingError(ArcaneError): pass

D0=(0,0,0)
UNITS={'1':(Decimal(1),D0),'m':(Decimal(1),(1,0,0)),'cm':(Decimal('.01'),(1,0,0)),'km':(Decimal(1000),(1,0,0)),'s':(Decimal(1),(0,1,0)),'min':(Decimal(60),(0,1,0)),'h':(Decimal(3600),(0,1,0)),'kg':(Decimal(1),(0,0,1)),'g':(Decimal('.001'),(0,0,1))}
DIGITS={'ZA':0,'KI':1,'TO':2,'MU':3,'RE':4,'SA':5,'FI':6,'DU':7,'GO':8,'PE':9}
ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2}
NUM_RE=re.compile(r'^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)(?:@([A-Za-z0-9]+))?$')
NAME_RE=re.compile(r'^[A-Za-z_][A-Za-z0-9_]*$')

@dataclass(frozen=True)
class Quantity:
    value: Decimal
    dimension: tuple[int,int,int]
@dataclass(frozen=True)
class Literal: quantity: Quantity
@dataclass(frozen=True)
class Reference: name: str
@dataclass(frozen=True)
class Call:
    op: str
    args: tuple['Expr',...]
Expr=Literal|Reference|Call

def _plus(a,b): return tuple(x+y for x,y in zip(a,b))
def _minus(a,b): return tuple(x-y for x,y in zip(a,b))
def _literal(token):
    if token in DIGITS: return Literal(Quantity(Decimal(DIGITS[token]),D0))
    m=NUM_RE.fullmatch(token)
    if not m: return None
    raw,unit=m.groups(); unit=unit or '1'
    if unit not in UNITS: raise ArcaneTypeError(f'unknown unit {unit!r}')
    try: val=Decimal(raw)
    except InvalidOperation as e: raise ArcaneParseError(f'invalid numeric literal {token!r}') from e
    scale,dims=UNITS[unit]
    return Literal(Quantity(val*scale,dims))
class _Parser:
    def __init__(self,tokens): self.tokens=tokens; self.i=0
    def expr(self):
        if self.i>=len(self.tokens): raise ArcaneParseError('unexpected end; expected operand')
        tok=self.tokens[self.i]; self.i+=1
        lit=_literal(tok)
        if lit is not None: return lit
        if tok.startswith('$') and NAME_RE.fullmatch(tok[1:]): return Reference(tok[1:])
        if tok in ARITY: return Call(tok,tuple(self.expr() for _ in range(ARITY[tok])))
        raise ArcaneParseError(f'unknown form or malformed literal {tok!r}')
def parse(source):
    if not isinstance(source,str) or not source.strip(): raise ArcaneParseError('expression must not be empty')
    p=_Parser(source.split()); tree=p.expr()
    if p.i!=len(p.tokens): raise ArcaneParseError('extra tokens: '+' '.join(p.tokens[p.i:]))
    return tree

@dataclass
class Binding:
    kind: str # value, state, live
    value: Quantity|None=None
    expression: Expr|None=None

class Environment:
    def __init__(self): self._scopes=[{}]; self._resolving=[]
    @property
    def scope_depth(self): return len(self._scopes)-1
    def push_scope(self): self._scopes.append({})
    def pop_scope(self):
        if len(self._scopes)==1: raise ArcaneBindingError('cannot pop the global scope')
        self._scopes.pop()
    def _valid_name(self,name):
        if not isinstance(name,str) or not NAME_RE.fullmatch(name): raise ArcaneBindingError(f'invalid binding name {name!r}')
    def _current_key(self,name):
        key=name.casefold()
        if key in self._scopes[-1]: raise ArcaneBindingError(f'binding {name!r} already exists in this scope')
        return key
    def _find(self,name):
        key=name.casefold()
        for scope in reversed(self._scopes):
            if key in scope: return scope[key]
        raise ArcaneBindingError(f'unknown binding {name!r}')
    def _find_scope(self,name):
        key=name.casefold()
        for scope in reversed(self._scopes):
            if key in scope: return scope,key
        raise ArcaneBindingError(f'unknown binding {name!r}')
    def create_value(self,name,source):
        self._valid_name(name); key=self._current_key(name); value=self.evaluate_expr(parse(source))
        self._scopes[-1][key]=Binding('value',value=value); return value
    def create_state(self,name,source):
        self._valid_name(name); key=self._current_key(name); value=self.evaluate_expr(parse(source))
        self._scopes[-1][key]=Binding('state',value=value); return value
    def create_live(self,name,source):
        self._valid_name(name); key=self._current_key(name); tree=parse(source)
        # Validate now so invalid declarations never enter the environment.
        self.evaluate_expr(tree)
        self._scopes[-1][key]=Binding('live',expression=tree)
        return self.resolve(name)
    def assign(self,name,source):
        scope,key=self._find_scope(name); binding=scope[key]
        if binding.kind!='state': raise ArcaneBindingError(f'{name!r} is not mutable state; only KWAM state bindings can be updated')
        new_value=self.evaluate_expr(parse(source))
        if new_value.dimension!=binding.value.dimension:
            raise ArcaneTypeError(f'cannot change dimensions of {name!r}: expected {binding.value.dimension}, got {new_value.dimension}')
        binding.value=new_value; return new_value
    def resolve(self,name):
        key=name.casefold(); binding=self._find(name)
        if binding.kind!='live': return binding.value
        marker=(key,id(binding))
        if marker in self._resolving: raise ArcaneBindingError('cyclic live binding detected')
        self._resolving.append(marker)
        try: return self.evaluate_expr(binding.expression)
        finally: self._resolving.pop()
    def evaluate_expr(self,tree):
        if isinstance(tree,Literal): return tree.quantity
        if isinstance(tree,Reference): return self.resolve(tree.name)
        a,b=(self.evaluate_expr(x) for x in tree.args)
        if tree.op in ('FRAPA','FRATA') and a.dimension!=b.dimension:
            raise ArcaneTypeError(f'{tree.op} requires matching dimensions; got {a.dimension} and {b.dimension}')
        if tree.op=='FRAPA': return Quantity(a.value+b.value,a.dimension)
        if tree.op=='FRATA': return Quantity(a.value-b.value,a.dimension)
        if tree.op=='FRAKA': return Quantity(a.value*b.value,_plus(a.dimension,b.dimension))
        if tree.op=='FRALA':
            if b.value==0: raise ArcaneEvaluationError('FRALA: division by zero')
            return Quantity(a.value/b.value,_minus(a.dimension,b.dimension))
        raise ArcaneParseError(f'unsupported operator {tree.op}')
    def execute(self,statement):
        s=statement.strip()
        patterns=[('KWAM',r'KWAM\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)','value'),('KWAK',r'KWAK\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)','live'),('KWAS',r'KWAS\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)','state'),('KWAS',r'KWAS\s+([A-Za-z_][A-Za-z0-9_]*)\s*<-\s*(.+)','assign')]
        for _,pattern,kind in patterns:
            m=re.fullmatch(pattern,s,re.I)
            if m:
                name,expr=m.groups()
                if kind=='value': return self.create_value(name,expr)
                if kind=='live': return self.create_live(name,expr)
                if kind=='state': return self.create_state(name,expr)
                return self.assign(name,expr)
        m=re.fullmatch(r'KWAT\s+([A-Za-z_][A-Za-z0-9_]*)',s,re.I)
        if m: return self.resolve(m.group(1))
        if s.split() and s.split()[0] in ARITY: return self.evaluate_expr(parse(s))
        raise ArcaneParseError('expected KWAM name = expr, KWAK name = expr, KWAS name = expr, KWAS name <- expr, KWAT name, or an arithmetic expression')

def format_quantity(q):
    v=format(q.value.normalize(),'f') if q.value else '0'; l,t,m=q.dimension
    if (l,t,m)==D0: unit='1'
    else:
        parts=[]
        for sym,power in [('m',l),('s',t),('kg',m)]:
            if power: parts.append(sym if power==1 else f'{sym}^{power}')
        unit=' '.join(parts)
    return f'{v} {unit}'

if __name__=='__main__':
    import argparse
    ap=argparse.ArgumentParser(description='Arcane provisional state/scope runtime; one statement per process')
    ap.add_argument('statement',nargs='+'); args=ap.parse_args(); env=Environment()
    try: print(format_quantity(env.execute(' '.join(args.statement))))
    except ArcaneError as e: raise SystemExit(f'Arcane error: {e}')

~~~

## arcane_runtime 4.py

- Type: PY
- SHA-256: `62c72607786baebb2e51f5a4f5213c438ee58d3cf3782ad13e51c0293deb0e34`
- Extracted characters: 8497

~~~text
"""Arcane Phase 7B: provisional mutable state and lexical scopes.

Not canon: KWAM name = expr (immutable value), KWAK name = expr (live expression),
KWAT name (read), KWAS name = expr (update nearest existing mutable state).
Expressions use $name references and binary prefix arithmetic operators.
"""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
import re

class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass
class ArcaneBindingError(ArcaneError): pass

D0=(0,0,0)
UNITS={'1':(Decimal(1),D0),'m':(Decimal(1),(1,0,0)),'cm':(Decimal('.01'),(1,0,0)),'km':(Decimal(1000),(1,0,0)),'s':(Decimal(1),(0,1,0)),'min':(Decimal(60),(0,1,0)),'h':(Decimal(3600),(0,1,0)),'kg':(Decimal(1),(0,0,1)),'g':(Decimal('.001'),(0,0,1))}
DIGITS={'ZA':0,'KI':1,'TO':2,'MU':3,'RE':4,'SA':5,'FI':6,'DU':7,'GO':8,'PE':9}
ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2}
NUM_RE=re.compile(r'^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)(?:@([A-Za-z0-9]+))?$')
NAME_RE=re.compile(r'^[A-Za-z_][A-Za-z0-9_]*$')

@dataclass(frozen=True)
class Quantity:
    value: Decimal
    dimension: tuple[int,int,int]
@dataclass(frozen=True)
class Literal: quantity: Quantity
@dataclass(frozen=True)
class Reference: name: str
@dataclass(frozen=True)
class Call:
    op: str
    args: tuple['Expr',...]
Expr=Literal|Reference|Call

def _plus(a,b): return tuple(x+y for x,y in zip(a,b))
def _minus(a,b): return tuple(x-y for x,y in zip(a,b))
def _literal(token):
    if token in DIGITS: return Literal(Quantity(Decimal(DIGITS[token]),D0))
    m=NUM_RE.fullmatch(token)
    if not m: return None
    raw,unit=m.groups(); unit=unit or '1'
    if unit not in UNITS: raise ArcaneTypeError(f'unknown unit {unit!r}')
    try: val=Decimal(raw)
    except InvalidOperation as e: raise ArcaneParseError(f'invalid numeric literal {token!r}') from e
    scale,dims=UNITS[unit]
    return Literal(Quantity(val*scale,dims))
class _Parser:
    def __init__(self,tokens): self.tokens=tokens; self.i=0
    def expr(self):
        if self.i>=len(self.tokens): raise ArcaneParseError('unexpected end; expected operand')
        tok=self.tokens[self.i]; self.i+=1
        lit=_literal(tok)
        if lit is not None: return lit
        if tok.startswith('$') and NAME_RE.fullmatch(tok[1:]): return Reference(tok[1:])
        if tok in ARITY: return Call(tok,tuple(self.expr() for _ in range(ARITY[tok])))
        raise ArcaneParseError(f'unknown form or malformed literal {tok!r}')
def parse(source):
    if not isinstance(source,str) or not source.strip(): raise ArcaneParseError('expression must not be empty')
    p=_Parser(source.split()); tree=p.expr()
    if p.i!=len(p.tokens): raise ArcaneParseError('extra tokens: '+' '.join(p.tokens[p.i:]))
    return tree

@dataclass
class Binding:
    kind: str # value, state, live
    value: Quantity|None=None
    expression: Expr|None=None

class Environment:
    def __init__(self): self._scopes=[{}]; self._resolving=[]
    @property
    def scope_depth(self): return len(self._scopes)-1
    def push_scope(self): self._scopes.append({})
    def pop_scope(self):
        if len(self._scopes)==1: raise ArcaneBindingError('cannot pop the global scope')
        self._scopes.pop()
    def _valid_name(self,name):
        if not isinstance(name,str) or not NAME_RE.fullmatch(name): raise ArcaneBindingError(f'invalid binding name {name!r}')
    def _current_key(self,name):
        key=name.casefold()
        if key in self._scopes[-1]: raise ArcaneBindingError(f'binding {name!r} already exists in this scope')
        return key
    def _find(self,name):
        key=name.casefold()
        for scope in reversed(self._scopes):
            if key in scope: return scope[key]
        raise ArcaneBindingError(f'unknown binding {name!r}')
    def _find_scope(self,name):
        key=name.casefold()
        for scope in reversed(self._scopes):
            if key in scope: return scope,key
        raise ArcaneBindingError(f'unknown binding {name!r}')
    def create_value(self,name,source):
        self._valid_name(name); key=self._current_key(name); value=self.evaluate_expr(parse(source))
        self._scopes[-1][key]=Binding('value',value=value); return value
    def create_state(self,name,source):
        self._valid_name(name); key=self._current_key(name); value=self.evaluate_expr(parse(source))
        self._scopes[-1][key]=Binding('state',value=value); return value
    def create_live(self,name,source):
        self._valid_name(name); key=self._current_key(name); tree=parse(source)
        # Validate now so invalid declarations never enter the environment.
        self.evaluate_expr(tree)
        self._scopes[-1][key]=Binding('live',expression=tree)
        return self.resolve(name)
    def assign(self,name,source):
        scope,key=self._find_scope(name); binding=scope[key]
        if binding.kind!='state': raise ArcaneBindingError(f'{name!r} is not mutable state; only KWAM state bindings can be updated')
        new_value=self.evaluate_expr(parse(source))
        if new_value.dimension!=binding.value.dimension:
            raise ArcaneTypeError(f'cannot change dimensions of {name!r}: expected {binding.value.dimension}, got {new_value.dimension}')
        binding.value=new_value; return new_value
    def resolve(self,name):
        key=name.casefold(); binding=self._find(name)
        if binding.kind!='live': return binding.value
        marker=(key,id(binding))
        if marker in self._resolving: raise ArcaneBindingError('cyclic live binding detected')
        self._resolving.append(marker)
        try: return self.evaluate_expr(binding.expression)
        finally: self._resolving.pop()
    def evaluate_expr(self,tree):
        if isinstance(tree,Literal): return tree.quantity
        if isinstance(tree,Reference): return self.resolve(tree.name)
        a,b=(self.evaluate_expr(x) for x in tree.args)
        if tree.op in ('FRAPA','FRATA') and a.dimension!=b.dimension:
            raise ArcaneTypeError(f'{tree.op} requires matching dimensions; got {a.dimension} and {b.dimension}')
        if tree.op=='FRAPA': return Quantity(a.value+b.value,a.dimension)
        if tree.op=='FRATA': return Quantity(a.value-b.value,a.dimension)
        if tree.op=='FRAKA': return Quantity(a.value*b.value,_plus(a.dimension,b.dimension))
        if tree.op=='FRALA':
            if b.value==0: raise ArcaneEvaluationError('FRALA: division by zero')
            return Quantity(a.value/b.value,_minus(a.dimension,b.dimension))
        raise ArcaneParseError(f'unsupported operator {tree.op}')
    def execute(self,statement):
        s=statement.strip()
        patterns=[('KWAM',r'KWAM\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)','value'),('KWAK',r'KWAK\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)','live'),('KWAS',r'KWAS\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)','state'),('KWAS',r'KWAS\s+([A-Za-z_][A-Za-z0-9_]*)\s*<-\s*(.+)','assign')]
        for _,pattern,kind in patterns:
            m=re.fullmatch(pattern,s,re.I)
            if m:
                name,expr=m.groups()
                if kind=='value': return self.create_value(name,expr)
                if kind=='live': return self.create_live(name,expr)
                if kind=='state': return self.create_state(name,expr)
                return self.assign(name,expr)
        m=re.fullmatch(r'KWAT\s+([A-Za-z_][A-Za-z0-9_]*)',s,re.I)
        if m: return self.resolve(m.group(1))
        if s.split() and s.split()[0] in ARITY: return self.evaluate_expr(parse(s))
        raise ArcaneParseError('expected KWAM name = expr, KWAK name = expr, KWAS name = expr, KWAS name <- expr, KWAT name, or an arithmetic expression')

def format_quantity(q):
    v=format(q.value.normalize(),'f') if q.value else '0'; l,t,m=q.dimension
    if (l,t,m)==D0: unit='1'
    else:
        parts=[]
        for sym,power in [('m',l),('s',t),('kg',m)]:
            if power: parts.append(sym if power==1 else f'{sym}^{power}')
        unit=' '.join(parts)
    return f'{v} {unit}'

if __name__=='__main__':
    import argparse
    ap=argparse.ArgumentParser(description='Arcane provisional state/scope runtime; one statement per process')
    ap.add_argument('statement',nargs='+'); args=ap.parse_args(); env=Environment()
    try: print(format_quantity(env.execute(' '.join(args.statement))))
    except ArcaneError as e: raise SystemExit(f'Arcane error: {e}')

~~~

## arcane_runtime 5.py

- Type: PY
- SHA-256: `638b63ff3e5e3129fb1275ffe10f5376bed0d6f2d68313409fcccc976e86a72c`
- Extracted characters: 7848

~~~text
"""Arcane provisional runtime: typed arithmetic, bindings, scopes, functions."""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation
import re
class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass
class ArcaneBindingError(ArcaneError): pass
D0=(0,0,0); UNITS={'1':(Decimal(1),D0),'m':(Decimal(1),(1,0,0)),'cm':(Decimal('.01'),(1,0,0)),'km':(Decimal(1000),(1,0,0)),'s':(Decimal(1),(0,1,0)),'min':(Decimal(60),(0,1,0)),'h':(Decimal(3600),(0,1,0)),'kg':(Decimal(1),(0,0,1)),'g':(Decimal('.001'),(0,0,1))}
DIGITS={'ZA':0,'KI':1,'TO':2,'MU':3,'RE':4,'SA':5,'FI':6,'DU':7,'GO':8,'PE':9}; ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2}
NUM_RE=re.compile(r'^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)(?:@([A-Za-z0-9]+))?$'); NAME_RE=re.compile(r'^[A-Za-z_][A-Za-z0-9_]*$')
@dataclass(frozen=True)
class Quantity: value:Decimal; dimension:tuple[int,int,int]
@dataclass(frozen=True)
class Literal: quantity:Quantity
@dataclass(frozen=True)
class Reference: name:str
@dataclass(frozen=True)
class Call: op:str; args:tuple['Expr',...]
Expr=Literal|Reference|Call
def _add(a,b): return tuple(x+y for x,y in zip(a,b))
def _sub(a,b): return tuple(x-y for x,y in zip(a,b))
def _literal(tok):
 if tok in DIGITS:return Literal(Quantity(Decimal(DIGITS[tok]),D0))
 m=NUM_RE.fullmatch(tok)
 if not m:return None
 raw,unit=m.groups(); unit=unit or '1'
 if unit not in UNITS:raise ArcaneTypeError(f'unknown unit {unit!r}')
 try:v=Decimal(raw)
 except InvalidOperation as e:raise ArcaneParseError(f'invalid number {tok!r}') from e
 scale,d=UNITS[unit];return Literal(Quantity(v*scale,d))
class Parser:
 def __init__(self,t):self.t=t;self.i=0
 def expr(self):
  if self.i>=len(self.t):raise ArcaneParseError('unexpected end; expected operand')
  tok=self.t[self.i];self.i+=1;lit=_literal(tok)
  if lit is not None:return lit
  if tok.startswith('$') and NAME_RE.fullmatch(tok[1:]):return Reference(tok[1:])
  if tok in ARITY:return Call(tok,tuple(self.expr() for _ in range(ARITY[tok])))
  raise ArcaneParseError(f'unknown form or malformed literal {tok!r}')
def parse(s):
 if not isinstance(s,str) or not s.strip():raise ArcaneParseError('expression must not be empty')
 p=Parser(s.split());tree=p.expr()
 if p.i!=len(p.t):raise ArcaneParseError('extra tokens: '+' '.join(p.t[p.i:]))
 return tree
@dataclass
class Binding: kind:str; value:Quantity|None=None; expression:Expr|None=None
@dataclass(frozen=True)
class FunctionDef: name:str; params:tuple[str,...]; body:Expr
class Environment:
 def __init__(self):self._scopes=[{}];self._resolving=[];self.functions={};self._call_depth=0;self.max_call_depth=64
 @property
 def scope_depth(self):return len(self._scopes)-1
 def push_scope(self):self._scopes.append({})
 def pop_scope(self):
  if len(self._scopes)==1:raise ArcaneBindingError('cannot pop global scope')
  self._scopes.pop()
 def _valid(self,n):
  if not isinstance(n,str) or not NAME_RE.fullmatch(n):raise ArcaneBindingError(f'invalid name {n!r}')
 def _newkey(self,n):
  self._valid(n);k=n.casefold()
  if k in self._scopes[-1]:raise ArcaneBindingError(f'binding {n!r} already exists in this scope')
  return k
 def _find(self,n):
  for scope in reversed(self._scopes):
   if n.casefold() in scope:return scope[n.casefold()]
  raise ArcaneBindingError(f'unknown binding {n!r}')
 def resolve(self,n):
  b=self._find(n)
  if b.kind!='live':return b.value
  marker=(n.casefold(),id(b))
  if marker in self._resolving:raise ArcaneBindingError('cyclic live binding detected')
  self._resolving.append(marker)
  try:return self.evaluate_expr(b.expression)
  finally:self._resolving.pop()
 def evaluate_expr(self,e):
  if isinstance(e,Literal):return e.quantity
  if isinstance(e,Reference):return self.resolve(e.name)
  a,b=(self.evaluate_expr(x) for x in e.args)
  if e.op in ('FRAPA','FRATA') and a.dimension!=b.dimension:raise ArcaneTypeError(f'{e.op} requires matching dimensions; got {a.dimension}, {b.dimension}')
  if e.op=='FRAPA':return Quantity(a.value+b.value,a.dimension)
  if e.op=='FRATA':return Quantity(a.value-b.value,a.dimension)
  if e.op=='FRAKA':return Quantity(a.value*b.value,_add(a.dimension,b.dimension))
  if b.value==0:raise ArcaneEvaluationError('FRALA: division by zero')
  return Quantity(a.value/b.value,_sub(a.dimension,b.dimension))
 def create_value(self,n,s):k=self._newkey(n);v=self.evaluate_expr(parse(s));self._scopes[-1][k]=Binding('value',value=v);return v
 def create_state(self,n,s):k=self._newkey(n);v=self.evaluate_expr(parse(s));self._scopes[-1][k]=Binding('state',value=v);return v
 def create_live(self,n,s):k=self._newkey(n);e=parse(s);self.evaluate_expr(e);self._scopes[-1][k]=Binding('live',expression=e);return self.resolve(n)
 def assign(self,n,s):
  for scope in reversed(self._scopes):
   k=n.casefold()
   if k in scope:
    b=scope[k]
    if b.kind!='state':raise ArcaneBindingError(f'{n!r} is not mutable state')
    v=self.evaluate_expr(parse(s))
    if v.dimension!=b.value.dimension:raise ArcaneTypeError(f'cannot change dimensions of {n!r}')
    b.value=v;return v
  raise ArcaneBindingError(f'unknown binding {n!r}')
 def define_function(self,n,params,body):
  self._valid(n);k=n.casefold(); ps=tuple(params)
  if k in self.functions:raise ArcaneBindingError(f'function {n!r} already defined')
  if len({p.casefold() for p in ps})!=len(ps):raise ArcaneBindingError('duplicate parameter name')
  for p in ps:self._valid(p)
  tree=parse(body)
  # Validate syntax now; parameter refs are bound temporarily for semantic checking.
  self.push_scope()
  try:
   for p in ps:self._scopes[-1][p.casefold()]=Binding('value',value=Quantity(Decimal(1),D0))
   self.evaluate_expr(tree)
  finally:self.pop_scope()
  self.functions[k]=FunctionDef(n,ps,tree)
  return f'function {n} defined'
 def call_function(self,n,args):
  k=n.casefold()
  if k not in self.functions:raise ArcaneBindingError(f'unknown function {n!r}')
  fn=self.functions[k]
  if len(args)!=len(fn.params):raise ArcaneBindingError(f'{n} expects {len(fn.params)} argument(s), got {len(args)}')
  if self._call_depth>=self.max_call_depth:raise ArcaneEvaluationError('maximum function call depth exceeded')
  vals=[self.evaluate_expr(parse(a)) for a in args]
  self._call_depth+=1;self.push_scope()
  try:
   for p,v in zip(fn.params,vals):self._scopes[-1][p.casefold()]=Binding('value',value=v)
   return self.evaluate_expr(fn.body)
  finally:self.pop_scope();self._call_depth-=1
 def execute(self,s):
  s=s.strip();m=re.fullmatch(r'KWAM\s+(\w+)\s*=\s*(.+)',s,re.I)
  if m:return self.create_value(*m.groups())
  m=re.fullmatch(r'KWAS\s+(\w+)\s*=\s*(.+)',s,re.I)
  if m:return self.create_state(*m.groups())
  m=re.fullmatch(r'KWAS\s+(\w+)\s*<-\s*(.+)',s,re.I)
  if m:return self.assign(*m.groups())
  m=re.fullmatch(r'KWAK\s+(\w+)\s*=\s*(.+)',s,re.I)
  if m:return self.create_live(*m.groups())
  m=re.fullmatch(r'KWAT\s+(\w+)',s,re.I)
  if m:return self.resolve(m.group(1))
  m=re.fullmatch(r'KWAF\s+(\w+)\s*\((.*?)\)\s*=>\s*(.+)',s,re.I)
  if m:
   n,ps,body=m.groups();params=[] if not ps.strip() else [x.strip() for x in ps.split(',')]
   return self.define_function(n,params,body)
  m=re.fullmatch(r'KWAC\s+(\w+)\s*\((.*?)\)',s,re.I)
  if m:
   n,raw=m.groups();args=[] if not raw.strip() else [x.strip() for x in raw.split(',')]
   return self.call_function(n,args)
  if s.split() and s.split()[0] in ARITY:return self.evaluate_expr(parse(s))
  raise ArcaneParseError('unrecognised statement')
def format_quantity(q):
 v=format(q.value.normalize(),'f') if q.value else '0';l,t,m=q.dimension
 if (l,t,m)==D0:u='1'
 else:
  bits=[]
  for sym,p in [('m',l),('s',t),('kg',m)]:
   if p:bits.append(sym if p==1 else f'{sym}^{p}')
  u=' '.join(bits)
 return f'{v} {u}'

~~~

## arcane_runtime 6.py

- Type: PY
- SHA-256: `51cf58ef81e4752f4b4ee3935e0b4f0453f34bc09d22145d7b35b0b5514d735c`
- Extracted characters: 5135

~~~text
"""Arcane Phase 7E provisional executable subset: quantities, functions, and conditionals."""
from dataclasses import dataclass
from decimal import Decimal
import re
class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneBindingError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass
D0=(0,0,0); UNITS={'1':(Decimal(1),D0),'m':(Decimal(1),(1,0,0)),'cm':(Decimal('.01'),(1,0,0)),'km':(Decimal(1000),(1,0,0)),'s':(Decimal(1),(0,1,0)),'kg':(Decimal(1),(0,0,1))}
ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2,'FRASI':3,'FRAGT':2,'FRALT':2,'FRAEQ':2}
@dataclass(frozen=True)
class Q: value:Decimal; dim:tuple[int,int,int]=D0
@dataclass(frozen=True)
class Lit: q:Q
@dataclass(frozen=True)
class Ref: name:str
@dataclass(frozen=True)
class Node: op:str; args:tuple
@dataclass(frozen=True)
class Func: name:str; params:tuple[str,...]; body:object
TOKEN=re.compile(r'\s*(\$[A-Za-z_]\w*|[A-Za-z_]\w*|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:@[A-Za-z]+)?)')
def tokens(s):
 out=[]; pos=0
 while pos<len(s):
  m=TOKEN.match(s,pos)
  if not m:
   if s[pos:].strip(): raise ArcaneParseError(f'unexpected text near {s[pos:pos+16]!r}')
   break
  out.append(m.group(1));pos=m.end()
 return out
class Parser:
 def __init__(self,ts):self.ts=ts;self.i=0
 def expr(self):
  if self.i>=len(self.ts):raise ArcaneParseError('missing expression')
  t=self.ts[self.i];self.i+=1
  if t in ARITY:return Node(t,tuple(self.expr() for _ in range(ARITY[t])))
  if t.startswith('$'):return Ref(t[1:])
  m=re.fullmatch(r'([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:@([A-Za-z]+))?',t)
  if m:
   n,u=m.groups();u=u or '1'
   if u not in UNITS:raise ArcaneTypeError(f'unknown unit {u}')
   scale,d=UNITS[u];return Lit(Q(Decimal(n)*scale,d))
  raise ArcaneParseError(f'unknown expression token {t!r}')
def parse(s):
 p=Parser(tokens(s));e=p.expr()
 if p.i!=len(p.ts):raise ArcaneParseError('extra expression tokens')
 return e
class Environment:
 def __init__(self):self.scopes=[{}];self.functions={};self.depth=0;self.max_depth=64
 def push(self):self.scopes.append({})
 def pop(self):
  if len(self.scopes)==1:raise ArcaneBindingError('cannot pop global scope')
  self.scopes.pop()
 def lookup(self,n):
  for s in reversed(self.scopes):
   if n.casefold() in s:return s[n.casefold()]
  raise ArcaneBindingError(f'unknown binding {n!r}')
 def eval(self,e):
  if isinstance(e,Lit):return e.q
  if isinstance(e,Ref):return self.lookup(e.name)
  op=e.op
  if op=='FRASI':
   condition=self.eval(e.args[0]);return self.eval(e.args[1] if condition.value!=0 else e.args[2])
  a=[self.eval(x) for x in e.args]
  if op in ('FRAPA','FRATA','FRAGT','FRALT','FRAEQ') and a[0].dim!=a[1].dim:raise ArcaneTypeError(f'{op} requires matching dimensions')
  if op=='FRAGT':return Q(Decimal(a[0].value>a[1].value),D0)
  if op=='FRALT':return Q(Decimal(a[0].value<a[1].value),D0)
  if op=='FRAEQ':return Q(Decimal(a[0].value==a[1].value),D0)
  if op=='FRAPA':return Q(a[0].value+a[1].value,a[0].dim)
  if op=='FRATA':return Q(a[0].value-a[1].value,a[0].dim)
  if op=='FRAKA':return Q(a[0].value*a[1].value,tuple(x+y for x,y in zip(a[0].dim,a[1].dim)))
  if not a[1].value:raise ArcaneEvaluationError('division by zero')
  return Q(a[0].value/a[1].value,tuple(x-y for x,y in zip(a[0].dim,a[1].dim)))
 def define(self,name,params,body):
  k=name.casefold()
  if k in self.functions:raise ArcaneBindingError(f'function {name} already defined')
  if len(set(p.casefold() for p in params))!=len(params):raise ArcaneBindingError('duplicate parameter')
  tree=parse(body);self.push()
  try:
   for p in params:self.scopes[-1][p.casefold()]=Q(Decimal(1))
   self.eval(tree)
  finally:self.pop()
  self.functions[k]=Func(name,tuple(params),tree)
 def call(self,name,args):
  f=self.functions.get(name.casefold())
  if not f:raise ArcaneBindingError(f'unknown function {name!r}')
  if len(args)!=len(f.params):raise ArcaneBindingError(f'{name} expects {len(f.params)} argument(s), got {len(args)}')
  if self.depth>=self.max_depth:raise ArcaneEvaluationError('maximum call depth exceeded')
  vals=[self.eval(parse(x)) for x in args];self.push();self.depth+=1
  try:
   for p,v in zip(f.params,vals):self.scopes[-1][p.casefold()]=v
   return self.eval(f.body)
  finally:self.depth-=1;self.pop()
 def execute(self,s):
  m=re.fullmatch(r'KWAM\s+(\w+)\s*=\s*(.+)',s,re.I)
  if m:
   k=m[1].casefold()
   if k in self.scopes[-1]:raise ArcaneBindingError('duplicate binding')
   v=self.eval(parse(m[2]));self.scopes[-1][k]=v;return v
  m=re.fullmatch(r'KWAF\s+(\w+)\s*\((.*?)\)\s*=>\s*(.+)',s,re.I)
  if m:return self.define(m[1],[p.strip() for p in m[2].split(',') if p.strip()],m[3]) or f'function {m[1]} defined'
  m=re.fullmatch(r'KWAC\s+(\w+)\s*\((.*)\)',s,re.I)
  if m:return self.call(m[1],[x.strip() for x in m[2].split(',') if x.strip()])
  m=re.fullmatch(r'KWAT\s+(\w+)',s,re.I)
  if m:return self.lookup(m[1])
  return self.eval(parse(s))
def fmt(q):
 v=format(q.value.normalize(),'f') if q.value else '0';d=q.dim
 u=' '.join(sym if p==1 else f'{sym}^{p}' for sym,p in zip(('m','s','kg'),d) if p) or '1';return f'{v} {u}'

~~~

## arcane_runtime 7.py

- Type: PY
- SHA-256: `608566b09a90c2206714a97dfe0efcbd2562aa74befe4932f45a7f8b900b775e`
- Extracted characters: 6237

~~~text
"""Arcane Phase 7F provisional executable subset: composable function expressions."""
from dataclasses import dataclass
from decimal import Decimal
import re

class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneBindingError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass

D0=(0,0,0)
UNITS={'1':(Decimal(1),D0),'m':(Decimal(1),(1,0,0)),'cm':(Decimal('.01'),(1,0,0)),'km':(Decimal(1000),(1,0,0)),'s':(Decimal(1),(0,1,0)),'kg':(Decimal(1),(0,0,1))}
ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2,'FRASI':3,'FRAGT':2,'FRALT':2,'FRAEQ':2}
@dataclass(frozen=True)
class Q: value:Decimal; dim:tuple[int,int,int]=D0
@dataclass(frozen=True)
class Lit: q:Q
@dataclass(frozen=True)
class Ref: name:str
@dataclass(frozen=True)
class Node: op:str; args:tuple
@dataclass(frozen=True)
class Call: name:str; args:tuple
@dataclass(frozen=True)
class Func: name:str; params:tuple[str,...]; body:object

TOKEN=re.compile(r'\s*(\$[A-Za-z_]\w*|[A-Za-z_]\w*|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:@[A-Za-z]+)?|[(),])')
def tokens(s):
 out=[];pos=0
 while pos<len(s):
  m=TOKEN.match(s,pos)
  if not m:
   if s[pos:].strip():raise ArcaneParseError(f'unexpected text near {s[pos:pos+16]!r}')
   break
  out.append(m.group(1));pos=m.end()
 return out

class Parser:
 def __init__(self,ts):self.ts=ts;self.i=0
 def peek(self):return self.ts[self.i] if self.i<len(self.ts) else None
 def take(self):
  if self.i>=len(self.ts):raise ArcaneParseError('unexpected end of expression')
  t=self.ts[self.i];self.i+=1;return t
 def expr(self):
  t=self.take()
  if t in ARITY:return Node(t,tuple(self.expr() for _ in range(ARITY[t])))
  if t.startswith('$'):return Ref(t[1:])
  m=re.fullmatch(r'([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:@([A-Za-z]+))?',t)
  if m:
   n,u=m.groups();u=u or '1'
   if u not in UNITS:raise ArcaneTypeError(f'unknown unit {u}')
   scale,d=UNITS[u];return Lit(Q(Decimal(n)*scale,d))
  if re.fullmatch(r'[A-Za-z_]\w*',t):
   if self.peek()!='(':raise ArcaneParseError(f'unknown expression token {t!r}; function calls require parentheses')
   self.take() # (
   args=[]
   if self.peek()!=')':
    while True:
     args.append(self.expr())
     if self.peek()==',':self.take();continue
     break
   if self.take()!=')':raise ArcaneParseError('expected closing parenthesis')
   return Call(t,tuple(args))
  raise ArcaneParseError(f'unknown expression token {t!r}')

def parse(s):
 p=Parser(tokens(s));e=p.expr()
 if p.i!=len(p.ts):raise ArcaneParseError('extra expression tokens')
 return e

class Environment:
 def __init__(self):self.scopes=[{}];self.functions={};self.depth=0;self.max_depth=64
 def push(self):self.scopes.append({})
 def pop(self):
  if len(self.scopes)==1:raise ArcaneBindingError('cannot pop global scope')
  self.scopes.pop()
 def lookup(self,n):
  for s in reversed(self.scopes):
   if n.casefold() in s:return s[n.casefold()]
  raise ArcaneBindingError(f'unknown binding {n!r}')
 def eval(self,e):
  if isinstance(e,Lit):return e.q
  if isinstance(e,Ref):return self.lookup(e.name)
  if isinstance(e,Call):return self.call_values(e.name,[self.eval(x) for x in e.args])
  op=e.op
  if op=='FRASI':
   condition=self.eval(e.args[0]);return self.eval(e.args[1] if condition.value!=0 else e.args[2])
  a=[self.eval(x) for x in e.args]
  if op in ('FRAPA','FRATA','FRAGT','FRALT','FRAEQ') and a[0].dim!=a[1].dim:raise ArcaneTypeError(f'{op} requires matching dimensions')
  if op=='FRAGT':return Q(Decimal(a[0].value>a[1].value),D0)
  if op=='FRALT':return Q(Decimal(a[0].value<a[1].value),D0)
  if op=='FRAEQ':return Q(Decimal(a[0].value==a[1].value),D0)
  if op=='FRAPA':return Q(a[0].value+a[1].value,a[0].dim)
  if op=='FRATA':return Q(a[0].value-a[1].value,a[0].dim)
  if op=='FRAKA':return Q(a[0].value*a[1].value,tuple(x+y for x,y in zip(a[0].dim,a[1].dim)))
  if not a[1].value:raise ArcaneEvaluationError('division by zero')
  return Q(a[0].value/a[1].value,tuple(x-y for x,y in zip(a[0].dim,a[1].dim)))
 def define(self,name,params,body):
  k=name.casefold()
  if k in self.functions:raise ArcaneBindingError(f'function {name} already defined')
  if len(set(p.casefold() for p in params))!=len(params):raise ArcaneBindingError('duplicate parameter')
  if any(not re.fullmatch(r'[A-Za-z_]\w*',p) for p in params):raise ArcaneParseError('invalid parameter name')
  tree=parse(body);self.push()
  try:
   for p in params:self.scopes[-1][p.casefold()]=Q(Decimal(1))
   self.eval(tree)
  finally:self.pop()
  self.functions[k]=Func(name,tuple(params),tree)
  return f'function {name} defined'
 def call_values(self,name,vals):
  f=self.functions.get(name.casefold())
  if not f:raise ArcaneBindingError(f'unknown function {name!r}')
  if len(vals)!=len(f.params):raise ArcaneBindingError(f'{name} expects {len(f.params)} argument(s), got {len(vals)}')
  if self.depth>=self.max_depth:raise ArcaneEvaluationError('maximum call depth exceeded')
  self.push();self.depth+=1
  try:
   for p,v in zip(f.params,vals):self.scopes[-1][p.casefold()]=v
   return self.eval(f.body)
  finally:self.depth-=1;self.pop()
 def call(self,name,args):
  # Backwards-compatible API for callers passing argument expressions as strings.
  return self.call_values(name,[self.eval(parse(x)) for x in args])
 def execute(self,s):
  m=re.fullmatch(r'KWAM\s+(\w+)\s*=\s*(.+)',s,re.I)
  if m:
   k=m[1].casefold()
   if k in self.scopes[-1]:raise ArcaneBindingError('duplicate binding')
   v=self.eval(parse(m[2]));self.scopes[-1][k]=v;return v
  m=re.fullmatch(r'KWAF\s+(\w+)\s*\((.*?)\)\s*=>\s*(.+)',s,re.I)
  if m:return self.define(m[1],[p.strip() for p in m[2].split(',') if p.strip()],m[3])
  m=re.fullmatch(r'KWAC\s+(\w+)\s*\((.*)\)',s,re.I)
  if m:
   # Parse the complete call, so nested calls and comma-containing arguments work.
   tree=parse(m[1]+'('+m[2]+')')
   if not isinstance(tree,Call):raise ArcaneParseError('expected function call')
   return self.eval(tree)
  m=re.fullmatch(r'KWAT\s+(\w+)',s,re.I)
  if m:return self.lookup(m[1])
  return self.eval(parse(s))

def fmt(q):
 v=format(q.value.normalize(),'f') if q.value else '0';d=q.dim
 u=' '.join(sym if p==1 else f'{sym}^{p}' for sym,p in zip(('m','s','kg'),d) if p) or '1'
 return f'{v} {u}'

~~~

## arcane_runtime 8.py

- Type: PY
- SHA-256: `12297ed43f0740375ce7017e1b238a2bf4f51f236316c574ce5992639fb6e963`
- Extracted characters: 7228

~~~text
"""Arcane Phase 7F provisional executable subset: composable function expressions."""
from dataclasses import dataclass
from decimal import Decimal
import re

class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneBindingError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass

D0=(0,0,0)
UNITS={'1':(Decimal(1),D0),'m':(Decimal(1),(1,0,0)),'cm':(Decimal('.01'),(1,0,0)),'km':(Decimal(1000),(1,0,0)),'s':(Decimal(1),(0,1,0)),'kg':(Decimal(1),(0,0,1))}
# FRAND / FROR / FRNOT are provisional runtime spellings, not asserted as canonical lexicon forms.
ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2,'FRASI':3,'FRAGT':2,'FRALT':2,'FRAEQ':2,'FRAND':2,'FROR':2,'FRNOT':1}
@dataclass(frozen=True)
class Q: value:Decimal; dim:tuple[int,int,int]=D0
@dataclass(frozen=True)
class Lit: q:Q
@dataclass(frozen=True)
class Ref: name:str
@dataclass(frozen=True)
class Node: op:str; args:tuple
@dataclass(frozen=True)
class Call: name:str; args:tuple
@dataclass(frozen=True)
class Func: name:str; params:tuple[str,...]; body:object

TOKEN=re.compile(r'\s*(\$[A-Za-z_]\w*|[A-Za-z_]\w*|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:@[A-Za-z]+)?|[(),])')
def tokens(s):
 out=[];pos=0
 while pos<len(s):
  m=TOKEN.match(s,pos)
  if not m:
   if s[pos:].strip():raise ArcaneParseError(f'unexpected text near {s[pos:pos+16]!r}')
   break
  out.append(m.group(1));pos=m.end()
 return out

class Parser:
 def __init__(self,ts):self.ts=ts;self.i=0
 def peek(self):return self.ts[self.i] if self.i<len(self.ts) else None
 def take(self):
  if self.i>=len(self.ts):raise ArcaneParseError('unexpected end of expression')
  t=self.ts[self.i];self.i+=1;return t
 def expr(self):
  t=self.take()
  op=t.upper()
  if op in ARITY:return Node(op,tuple(self.expr() for _ in range(ARITY[op])))
  if t.startswith('$'):return Ref(t[1:])
  m=re.fullmatch(r'([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:@([A-Za-z]+))?',t)
  if m:
   n,u=m.groups();u=u or '1'
   if u not in UNITS:raise ArcaneTypeError(f'unknown unit {u}')
   scale,d=UNITS[u];return Lit(Q(Decimal(n)*scale,d))
  if re.fullmatch(r'[A-Za-z_]\w*',t):
   if self.peek()!='(':raise ArcaneParseError(f'unknown expression token {t!r}; function calls require parentheses')
   self.take() # (
   args=[]
   if self.peek()!=')':
    while True:
     args.append(self.expr())
     if self.peek()==',':self.take();continue
     break
   if self.take()!=')':raise ArcaneParseError('expected closing parenthesis')
   return Call(t,tuple(args))
  raise ArcaneParseError(f'unknown expression token {t!r}')

def parse(s):
 p=Parser(tokens(s));e=p.expr()
 if p.i!=len(p.ts):raise ArcaneParseError('extra expression tokens')
 return e

class Environment:
 def __init__(self):self.scopes=[{}];self.functions={};self.depth=0;self.max_depth=64
 def push(self):self.scopes.append({})
 def pop(self):
  if len(self.scopes)==1:raise ArcaneBindingError('cannot pop global scope')
  self.scopes.pop()
 def lookup(self,n):
  for s in reversed(self.scopes):
   if n.casefold() in s:return s[n.casefold()]
  raise ArcaneBindingError(f'unknown binding {n!r}')
 def eval(self,e):
  if isinstance(e,Lit):return e.q
  if isinstance(e,Ref):return self.lookup(e.name)
  if isinstance(e,Call):return self.call_values(e.name,[self.eval(x) for x in e.args])
  op=e.op
  if op=='FRASI':
   condition=self.eval(e.args[0]);return self.eval(e.args[1] if condition.value!=0 else e.args[2])
  if op=='FRNOT':
   a=self.eval(e.args[0])
   if a.dim!=D0:raise ArcaneTypeError('FRNOT requires a dimensionless operand')
   return Q(Decimal(0 if a.value!=0 else 1),D0)
  if op=='FRAND':
   left=self.eval(e.args[0])
   if left.dim!=D0:raise ArcaneTypeError('FRAND requires dimensionless operands')
   if left.value==0:return Q(Decimal(0),D0)
   right=self.eval(e.args[1])
   if right.dim!=D0:raise ArcaneTypeError('FRAND requires dimensionless operands')
   return Q(Decimal(1 if right.value!=0 else 0),D0)
  if op=='FROR':
   left=self.eval(e.args[0])
   if left.dim!=D0:raise ArcaneTypeError('FROR requires dimensionless operands')
   if left.value!=0:return Q(Decimal(1),D0)
   right=self.eval(e.args[1])
   if right.dim!=D0:raise ArcaneTypeError('FROR requires dimensionless operands')
   return Q(Decimal(1 if right.value!=0 else 0),D0)
  a=[self.eval(x) for x in e.args]
  if op in ('FRAPA','FRATA','FRAGT','FRALT','FRAEQ') and a[0].dim!=a[1].dim:raise ArcaneTypeError(f'{op} requires matching dimensions')
  if op=='FRAGT':return Q(Decimal(a[0].value>a[1].value),D0)
  if op=='FRALT':return Q(Decimal(a[0].value<a[1].value),D0)
  if op=='FRAEQ':return Q(Decimal(a[0].value==a[1].value),D0)
  if op=='FRAPA':return Q(a[0].value+a[1].value,a[0].dim)
  if op=='FRATA':return Q(a[0].value-a[1].value,a[0].dim)
  if op=='FRAKA':return Q(a[0].value*a[1].value,tuple(x+y for x,y in zip(a[0].dim,a[1].dim)))
  if not a[1].value:raise ArcaneEvaluationError('division by zero')
  return Q(a[0].value/a[1].value,tuple(x-y for x,y in zip(a[0].dim,a[1].dim)))
 def define(self,name,params,body):
  k=name.casefold()
  if k in self.functions:raise ArcaneBindingError(f'function {name} already defined')
  if len(set(p.casefold() for p in params))!=len(params):raise ArcaneBindingError('duplicate parameter')
  if any(not re.fullmatch(r'[A-Za-z_]\w*',p) for p in params):raise ArcaneParseError('invalid parameter name')
  tree=parse(body);self.push()
  try:
   for p in params:self.scopes[-1][p.casefold()]=Q(Decimal(1))
   self.eval(tree)
  finally:self.pop()
  self.functions[k]=Func(name,tuple(params),tree)
  return f'function {name} defined'
 def call_values(self,name,vals):
  f=self.functions.get(name.casefold())
  if not f:raise ArcaneBindingError(f'unknown function {name!r}')
  if len(vals)!=len(f.params):raise ArcaneBindingError(f'{name} expects {len(f.params)} argument(s), got {len(vals)}')
  if self.depth>=self.max_depth:raise ArcaneEvaluationError('maximum call depth exceeded')
  self.push();self.depth+=1
  try:
   for p,v in zip(f.params,vals):self.scopes[-1][p.casefold()]=v
   return self.eval(f.body)
  finally:self.depth-=1;self.pop()
 def call(self,name,args):
  # Backwards-compatible API for callers passing argument expressions as strings.
  return self.call_values(name,[self.eval(parse(x)) for x in args])
 def execute(self,s):
  m=re.fullmatch(r'KWAM\s+(\w+)\s*=\s*(.+)',s,re.I)
  if m:
   k=m[1].casefold()
   if k in self.scopes[-1]:raise ArcaneBindingError('duplicate binding')
   v=self.eval(parse(m[2]));self.scopes[-1][k]=v;return v
  m=re.fullmatch(r'KWAF\s+(\w+)\s*\((.*?)\)\s*=>\s*(.+)',s,re.I)
  if m:return self.define(m[1],[p.strip() for p in m[2].split(',') if p.strip()],m[3])
  m=re.fullmatch(r'KWAC\s+(\w+)\s*\((.*)\)',s,re.I)
  if m:
   # Parse the complete call, so nested calls and comma-containing arguments work.
   tree=parse(m[1]+'('+m[2]+')')
   if not isinstance(tree,Call):raise ArcaneParseError('expected function call')
   return self.eval(tree)
  m=re.fullmatch(r'KWAT\s+(\w+)',s,re.I)
  if m:return self.lookup(m[1])
  return self.eval(parse(s))

def fmt(q):
 v=format(q.value.normalize(),'f') if q.value else '0';d=q.dim
 u=' '.join(sym if p==1 else f'{sym}^{p}' for sym,p in zip(('m','s','kg'),d) if p) or '1'
 return f'{v} {u}'

~~~

## arcane_runtime 9.py

- Type: PY
- SHA-256: `d176c4b33c6e50e8ba919cb9775ab4aa362c316730c5e0d7c86bdf9663b55f9f`
- Extracted characters: 7655

~~~text
"""Arcane Phase 7H provisional runtime: bounded repetition expressions."""
from dataclasses import dataclass
from decimal import Decimal
import re

class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneBindingError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass

D0=(0,0,0)
UNITS={'1':(Decimal(1),D0),'m':(Decimal(1),(1,0,0)),'cm':(Decimal('.01'),(1,0,0)),'km':(Decimal(1000),(1,0,0)),'s':(Decimal(1),(0,1,0)),'kg':(Decimal(1),(0,0,1))}
ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2,'FRASI':3,'FRAGT':2,'FRALT':2,'FRAEQ':2,'FRAND':2,'FROR':2,'FRNOT':1}
MAX_REPEAT=1000
@dataclass(frozen=True)
class Q: value:Decimal; dim:tuple[int,int,int]=D0
@dataclass(frozen=True)
class Lit: q:Q
@dataclass(frozen=True)
class Ref: name:str
@dataclass(frozen=True)
class Node: op:str; args:tuple
@dataclass(frozen=True)
class Call: name:str; args:tuple
@dataclass(frozen=True)
class Repeat: var:str; start:object; end:object; body:object
@dataclass(frozen=True)
class Func: name:str; params:tuple[str,...]; body:object

TOKEN=re.compile(r'\s*(\$[A-Za-z_]\w*|[A-Za-z_]\w*|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:@[A-Za-z]+)?|[(),])')
def tokens(s):
 out=[];pos=0
 while pos<len(s):
  m=TOKEN.match(s,pos)
  if not m:
   if s[pos:].strip(): raise ArcaneParseError(f'unexpected text near {s[pos:pos+16]!r}')
   break
  out.append(m.group(1));pos=m.end()
 return out
class Parser:
 def __init__(self,ts): self.ts=ts;self.i=0
 def peek(self): return self.ts[self.i] if self.i<len(self.ts) else None
 def take(self):
  if self.i>=len(self.ts): raise ArcaneParseError('unexpected end of expression')
  t=self.ts[self.i];self.i+=1;return t
 def expr(self):
  t=self.take();op=t.upper()
  if op in ARITY:return Node(op,tuple(self.expr() for _ in range(ARITY[op])))
  if t.startswith('$'):return Ref(t[1:])
  m=re.fullmatch(r'([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:@([A-Za-z]+))?',t)
  if m:
   n,u=m.groups();u=u or '1'
   if u not in UNITS:raise ArcaneTypeError(f'unknown unit {u}')
   scale,d=UNITS[u];return Lit(Q(Decimal(n)*scale,d))
  if re.fullmatch(r'[A-Za-z_]\w*',t):
   if self.peek()!='(':raise ArcaneParseError(f'unknown expression token {t!r}; function calls require parentheses')
   self.take();args=[]
   if self.peek()!=')':
    while True:
     args.append(self.expr())
     if self.peek()==',':self.take();continue
     break
   if self.take()!=')':raise ArcaneParseError('expected closing parenthesis')
   return Call(t,tuple(args))
  raise ArcaneParseError(f'unknown expression token {t!r}')
def parse(s):
 p=Parser(tokens(s));e=p.expr()
 if p.i!=len(p.ts):raise ArcaneParseError('extra expression tokens')
 return e

class Environment:
 def __init__(self):self.scopes=[{}];self.functions={};self.depth=0;self.max_depth=64
 def push(self):self.scopes.append({})
 def pop(self):
  if len(self.scopes)==1:raise ArcaneBindingError('cannot pop global scope')
  self.scopes.pop()
 def lookup(self,n):
  for s in reversed(self.scopes):
   if n.casefold() in s:return s[n.casefold()]
  raise ArcaneBindingError(f'unknown binding {n!r}')
 def eval(self,e):
  if isinstance(e,Lit):return e.q
  if isinstance(e,Ref):return self.lookup(e.name)
  if isinstance(e,Call):return self.call_values(e.name,[self.eval(x) for x in e.args])
  if isinstance(e,Repeat):
   a=self.eval(e.start);b=self.eval(e.end)
   if a.dim!=D0 or b.dim!=D0:raise ArcaneTypeError('repeat bounds must be dimensionless integers')
   if a.value!=a.value.to_integral_value() or b.value!=b.value.to_integral_value():raise ArcaneTypeError('repeat bounds must be integers')
   start,end=int(a.value),int(b.value)
   count=max(0,end-start+1)
   if count>MAX_REPEAT:raise ArcaneEvaluationError(f'repetition exceeds maximum of {MAX_REPEAT} iterations')
   results=[]
   for i in range(start,end+1):
    self.push()
    try:self.scopes[-1][e.var.casefold()]=Q(Decimal(i));results.append(self.eval(e.body))
    finally:self.pop()
   return results
  op=e.op
  if op=='FRASI':
   c=self.eval(e.args[0]);return self.eval(e.args[1] if c.value!=0 else e.args[2])
  if op=='FRNOT':
   a=self.eval(e.args[0])
   if a.dim!=D0:raise ArcaneTypeError('FRNOT requires a dimensionless operand')
   return Q(Decimal(0 if a.value!=0 else 1))
  if op in ('FRAND','FROR'):
   left=self.eval(e.args[0])
   if left.dim!=D0:raise ArcaneTypeError(f'{op} requires dimensionless operands')
   truth=left.value!=0
   if op=='FRAND' and not truth:return Q(Decimal(0))
   if op=='FROR' and truth:return Q(Decimal(1))
   right=self.eval(e.args[1])
   if right.dim!=D0:raise ArcaneTypeError(f'{op} requires dimensionless operands')
   return Q(Decimal(1 if right.value!=0 else 0))
  a=[self.eval(x) for x in e.args]
  if op in ('FRAPA','FRATA','FRAGT','FRALT','FRAEQ') and a[0].dim!=a[1].dim:raise ArcaneTypeError(f'{op} requires matching dimensions')
  if op=='FRAGT':return Q(Decimal(a[0].value>a[1].value))
  if op=='FRALT':return Q(Decimal(a[0].value<a[1].value))
  if op=='FRAEQ':return Q(Decimal(a[0].value==a[1].value))
  if op=='FRAPA':return Q(a[0].value+a[1].value,a[0].dim)
  if op=='FRATA':return Q(a[0].value-a[1].value,a[0].dim)
  if op=='FRAKA':return Q(a[0].value*a[1].value,tuple(x+y for x,y in zip(a[0].dim,a[1].dim)))
  if not a[1].value:raise ArcaneEvaluationError('division by zero')
  return Q(a[0].value/a[1].value,tuple(x-y for x,y in zip(a[0].dim,a[1].dim)))
 def define(self,name,params,body):
  k=name.casefold()
  if k in self.functions:raise ArcaneBindingError(f'function {name} already defined')
  if len(set(p.casefold() for p in params))!=len(params):raise ArcaneBindingError('duplicate parameter')
  if any(not re.fullmatch(r'[A-Za-z_]\w*',p) for p in params):raise ArcaneParseError('invalid parameter name')
  tree=parse(body);self.push()
  try:
   for p in params:self.scopes[-1][p.casefold()]=Q(Decimal(1))
   self.eval(tree)
  finally:self.pop()
  self.functions[k]=Func(name,tuple(params),tree);return f'function {name} defined'
 def call_values(self,name,vals):
  f=self.functions.get(name.casefold())
  if not f:raise ArcaneBindingError(f'unknown function {name!r}')
  if len(vals)!=len(f.params):raise ArcaneBindingError(f'{name} expects {len(f.params)} argument(s), got {len(vals)}')
  if self.depth>=self.max_depth:raise ArcaneEvaluationError('maximum call depth exceeded')
  self.push();self.depth+=1
  try:
   for p,v in zip(f.params,vals):self.scopes[-1][p.casefold()]=v
   return self.eval(f.body)
  finally:self.depth-=1;self.pop()
 def execute(self,s):
  m=re.fullmatch(r'KWAM\s+(\w+)\s*=\s*(.+)',s,re.I)
  if m:
   k=m[1].casefold()
   if k in self.scopes[-1]:raise ArcaneBindingError('duplicate binding')
   v=self.eval(parse(m[2]));self.scopes[-1][k]=v;return v
  m=re.fullmatch(r'KWAF\s+(\w+)\s*\((.*?)\)\s*=>\s*(.+)',s,re.I)
  if m:return self.define(m[1],[p.strip() for p in m[2].split(',') if p.strip()],m[3])
  # Provisional bounded-repeat statement: KWAR i FROM start TO end => expression
  m=re.fullmatch(r'KWAR\s+(\w+)\s+FROM\s+(.+?)\s+TO\s+(.+?)\s*=>\s*(.+)',s,re.I)
  if m:return self.eval(Repeat(m[1],parse(m[2]),parse(m[3]),parse(m[4])))
  m=re.fullmatch(r'KWAC\s+(\w+)\s*\((.*)\)',s,re.I)
  if m:
   tree=parse(m[1]+'('+m[2]+')')
   if not isinstance(tree,Call):raise ArcaneParseError('expected function call')
   return self.eval(tree)
  m=re.fullmatch(r'KWAT\s+(\w+)',s,re.I)
  if m:return self.lookup(m[1])
  return self.eval(parse(s))

def fmt(q):
 if isinstance(q,list):return '['+', '.join(fmt(x) for x in q)+']'
 v=format(q.value.normalize(),'f') if q.value else '0';d=q.dim
 u=' '.join(sym if p==1 else f'{sym}^{p}' for sym,p in zip(('m','s','kg'),d) if p) or '1'
 return f'{v} {u}'

~~~

## arcane_runtime.py

- Type: PY
- SHA-256: `bc7baa591f3886f64bc22d33b47a7fced6230fe3625a6f7be694ee91c5d5a924`
- Extracted characters: 8799

~~~text
"""Arcane Phase 7W: small provisional interpreter with a shared AST parser."""
from dataclasses import dataclass
import re

@dataclass(frozen=True)
class Diagnostic:
    code: str
    message: str
    line: int = 1
    def render(self, filename="<source>"):
        return f"{filename}:{self.line}: error {self.code}: {self.message}"

class ArcaneFailure(Exception):
    def __init__(self, code, message, line=1):
        super().__init__(message); self.code, self.message, self.line = code, message, line
    def diagnostic(self): return Diagnostic(self.code, self.message, self.line)

@dataclass(frozen=True)
class Node:
    kind: str
    line: int
    name: str = ""
    params: tuple = ()
    expr: str = ""
    yes: tuple = ()
    no: tuple = ()

NAME = r"[A-Za-z_][A-Za-z0-9_]*"
BINOPS = {"FRATA": (3, lambda a,b:a*b), "FRAPA": (2, lambda a,b:a+b),
          "FRAMO": (2, lambda a,b:a-b), "FRADI": (3, lambda a,b:a/b),
          "FRAGT": (1, lambda a,b:a>b), "FRALT": (1, lambda a,b:a<b),
          "FRAEQ": (1, lambda a,b:a==b), "FRANE": (1, lambda a,b:a!=b),
          "FRAGE": (1, lambda a,b:a>=b), "FRALE": (1, lambda a,b:a<=b)}
TOKEN = re.compile(r"\s*(\$\w+|\d+(?:\.\d+)?|[A-Za-z_]\w*|==|!=|<=|>=|[()+\-*/%,<>])")
PRECEDENCE = {"==":1,"!=":1,"<":1,">":1,"<=":1,">=":1,"+":2,"-":2,"*":3,"/":3,"%":3}

def parse_program(source):
    lines = [(i, s.strip()) for i,s in enumerate(source.splitlines(),1)
             if s.strip() and not s.strip().startswith("#")]
    def seq(i, stops=()):
        out=[]
        while i < len(lines):
            ln,s=lines[i]
            if s in stops: return out,i,s
            m=re.fullmatch(r"KWAI\s+(.+?)\s+THEN",s)
            if m:
                yes,i,stop=seq(i+1,("ELSE","END"))
                if stop=="ELSE": no,i,stop=seq(i+1,("END",))
                else: no=[]
                if stop!="END": raise ArcaneFailure("ARC-PARSE-001","conditional block missing END",ln)
                out.append(Node("if",ln,expr=m.group(1),yes=tuple(yes),no=tuple(no))); i+=1; continue
            if s in ("ELSE","END"): raise ArcaneFailure("ARC-PARSE-002",f"unexpected {s}",ln)
            fm=re.fullmatch(rf"KWAF\s+({NAME})\s*\(([^()]*)\)\s*=>\s*(.+)",s)
            bm=re.fullmatch(rf"KWAM\s+({NAME})\s*=>\s*(.+)",s)
            om=re.fullmatch(rf"KWAT\s+({NAME})",s)
            if s.startswith("KWAF "):
                if not fm: raise ArcaneFailure("ARC-PARSE-006","expected KWAF name(params) => expression",ln)
                nm,raw,expr=fm.groups(); params=tuple(x.strip().lstrip("$") for x in raw.split(",") if x.strip())
                if any(not re.fullmatch(NAME,p) for p in params): raise ArcaneFailure("ARC-PARSE-008","invalid parameter name",ln)
                out.append(Node("function",ln,name=nm,params=params,expr=expr))
            elif s.startswith("KWAM "):
                if not bm: raise ArcaneFailure("ARC-PARSE-005","expected KWAM name => expression",ln)
                out.append(Node("binding",ln,name=bm.group(1),expr=bm.group(2)))
            elif s.startswith("KWAT "):
                if not om: raise ArcaneFailure("ARC-PARSE-007","expected KWAT binding_name",ln)
                out.append(Node("output",ln,name=om.group(1)))
            elif s.startswith("KWAI "): raise ArcaneFailure("ARC-PARSE-003","expected KWAI condition THEN",ln)
            else: raise ArcaneFailure("ARC-PARSE-004",f"unsupported statement: {s}",ln)
            i+=1
        return out,i,None
    ast,i,stop=seq(0)
    if stop: raise ArcaneFailure("ARC-PARSE-002",f"unexpected {stop}")
    return tuple(ast),len(lines)

def walk(nodes):
    for n in nodes:
        yield n
        if n.kind=="if":
            yield from walk(n.yes); yield from walk(n.no)

def tokenize(expr,line):
    out=[]; pos=0
    while pos<len(expr):
        m=TOKEN.match(expr,pos)
        if not m:
            if expr[pos:].strip()=="": break
            raise ArcaneFailure("ARC-EXPR-001",f"unexpected character {expr[pos]!r}",line)
        out.append(m.group(1)); pos=m.end()
    if not out: raise ArcaneFailure("ARC-EXPR-001","empty expression",line)
    return out

class Parser:
    def __init__(self,ts,scope,funcs,line,depth,max_depth):
        self.ts,self.i,self.scope,self.funcs,self.line=ts,0,scope,funcs,line
        self.depth,self.max_depth=depth,max_depth
    def peek(self): return self.ts[self.i] if self.i<len(self.ts) else None
    def take(self):
        t=self.peek()
        if t is None: raise ArcaneFailure("ARC-EXPR-001","unexpected end of expression",self.line)
        self.i+=1; return t
    def parse(self,minp=0):
        t=self.take()
        if t=="(":
            v=self.parse()
            if self.take()!=")": raise ArcaneFailure("ARC-EXPR-001","expected ')'",self.line)
        elif t in ("+","-"):
            v=self.parse(4); v=v if t=="+" else -v
        elif t.startswith("$"):
            if t[1:] not in self.scope: raise ArcaneFailure("ARC-SEM-005",f"unresolved binding '{t}'",self.line)
            v=self.scope[t[1:]]
        elif re.fullmatch(r"\d+(?:\.\d+)?",t): v=float(t) if "." in t else int(t)
        elif re.fullmatch(NAME,t) and t in BINOPS:
            _,fn=BINOPS[t]; v=fn(self.parse(4),self.parse(4))
        elif re.fullmatch(NAME,t) and self.peek()=="(":
            self.take(); args=[]
            if self.peek()!=")":
                args.append(self.parse())
                while self.peek()==",": self.take(); args.append(self.parse())
            if self.take()!=")": raise ArcaneFailure("ARC-EXPR-001","expected ')' after arguments",self.line)
            if t not in self.funcs: raise ArcaneFailure("ARC-SEM-006",f"undefined function '{t}'",self.line)
            params,body,fl=self.funcs[t]
            if len(args)!=len(params): raise ArcaneFailure("ARC-SEM-007",f"function '{t}' expects {len(params)} argument(s), got {len(args)}",self.line)
            if self.depth>=self.max_depth: raise ArcaneFailure("ARC-RUN-002",f"maximum call depth ({self.max_depth}) exceeded",self.line)
            v=evaluate(body,dict(zip(params,args)),self.funcs,fl,self.depth+1,self.max_depth)
        else: raise ArcaneFailure("ARC-EXPR-002",f"invalid expression token {t!r}",self.line)
        while self.peek() in PRECEDENCE and PRECEDENCE[self.peek()]>=minp:
            op=self.take(); rhs=self.parse(PRECEDENCE[op]+1)
            try:
                fn={"+":lambda:v+rhs,"-":lambda:v-rhs,"*":lambda:v*rhs,"/":lambda:v/rhs,"%":lambda:v%rhs,
                    "==":lambda:v==rhs,"!=":lambda:v!=rhs,"<":lambda:v<rhs,">":lambda:v>rhs,
                    "<=":lambda:v<=rhs,">=":lambda:v>=rhs}[op]
                v=fn()
            except ZeroDivisionError: raise ArcaneFailure("ARC-RUN-001","division by zero",self.line)
            except TypeError as e: raise ArcaneFailure("ARC-RUN-004",str(e),self.line)
        return v

def evaluate(expr,scope,funcs,line,depth=0,max_depth=100):
    p=Parser(tokenize(expr,line),scope,funcs,line,depth,max_depth); v=p.parse()
    if p.peek() is not None: raise ArcaneFailure("ARC-EXPR-001",f"unexpected token {p.peek()!r}",line)
    return v

class ArcaneRuntime:
    def __init__(self,max_call_depth=100,max_steps=10000):
        self.max_call_depth,self.max_steps=max_call_depth,max_steps; self.reset()
    def reset(self): self.globals,self.functions,self.output,self.steps={},{},[],0
    def run_program(self,source):
        try:
            ast,_=parse_program(source); self.reset()
            for n in walk(ast):
                if n.kind=="function":
                    if n.name in self.functions: raise ArcaneFailure("ARC-SEM-003",f"duplicate function '{n.name}'",n.line)
                    if len(set(n.params))!=len(n.params): raise ArcaneFailure("ARC-SEM-002",f"duplicate parameter in '{n.name}'",n.line)
                    self.functions[n.name]=(n.params,n.expr,n.line)
            self._exec(ast,self.globals); return list(self.output)
        except ArcaneFailure as e: return e.diagnostic()
    def _exec(self,nodes,scope):
        for n in nodes:
            self.steps+=1
            if self.steps>self.max_steps: raise ArcaneFailure("ARC-RUN-003",f"execution step limit ({self.max_steps}) exceeded",n.line)
            if n.kind=="if":
                c=evaluate(n.expr,scope,self.functions,n.line,max_depth=self.max_call_depth)
                self._exec(n.yes if c else n.no,dict(scope))
            elif n.kind=="binding":
                if n.name in scope: raise ArcaneFailure("ARC-SEM-004",f"duplicate binding '{n.name}'",n.line)
                scope[n.name]=evaluate(n.expr,scope,self.functions,n.line,max_depth=self.max_call_depth)
            elif n.kind=="output":
                if n.name not in scope: raise ArcaneFailure("ARC-SEM-005",f"unresolved binding '{n.name}'",n.line)
                self.output.append(scope[n.name])

~~~

## arcane_runtime_adapter 2.py

- Type: PY
- SHA-256: `8eb59bf6ccf60776cd1af02fd64dad72687e7a971e069abec734fdb9c0668b8b`
- Extracted characters: 2408

~~~text
"""Phase 7K: adapter utilities for connecting an Arcane evaluator to diagnostics.

This is an integration boundary, not a replacement evaluator. Pass a callable that
runs one existing evaluation; errors are converted to stable diagnostics and successful
results receive descriptive types without coercion.
"""
from dataclasses import dataclass
from typing import Any, Callable, Optional

from arcane_diagnostics import (
    ArcaneDiagnosticError, Diagnostic, ErrorCode, SourceSpan, TypedValue,
    diagnostic_for_exception, infer_type,
)

@dataclass(frozen=True)
class EvaluationResult:
    typed_value: Optional[TypedValue] = None
    diagnostic: Optional[Diagnostic] = None

    @property
    def ok(self) -> bool:
        return self.typed_value is not None and self.diagnostic is None

    def render(self) -> str:
        if self.diagnostic is not None:
            return self.diagnostic.render()
        if self.typed_value is None:
            return 'ARC-RUNTIME-999: evaluation produced no result'
        return f"{self.typed_value.type.describe()}: {self.typed_value.value!r}"


def evaluate_safely(evaluator: Callable[[], Any], span: SourceSpan = SourceSpan(),
                    dimensions: tuple[int, ...] = ()) -> EvaluationResult:
    """Run an evaluator callable and normalise its result or exception.

    Existing ArcaneDiagnosticError objects retain their original diagnostic. Other
    exceptions are mapped through the Phase 7J catalogue. Exception tracebacks are
    deliberately not included in user-facing output.
    """
    try:
        value = evaluator()
        return EvaluationResult(typed_value=TypedValue(value, infer_type(value, dimensions)))
    except ArcaneDiagnosticError as exc:
        return EvaluationResult(diagnostic=exc.diagnostic)
    except Exception as exc:  # adapter boundary intentionally normalises evaluator errors
        return EvaluationResult(diagnostic=diagnostic_for_exception(exc, span))


def require_success(result: EvaluationResult) -> TypedValue:
    """Return the typed value or raise a structured Arcane diagnostic error."""
    if result.diagnostic is not None:
        raise ArcaneDiagnosticError(result.diagnostic)
    if result.typed_value is None:
        raise ArcaneDiagnosticError(Diagnostic(
            code=ErrorCode.INTERNAL_ERROR,
            message='evaluation produced no result',
        ))
    return result.typed_value

~~~

## arcane_runtime_adapter 3.py

- Type: PY
- SHA-256: `8eb59bf6ccf60776cd1af02fd64dad72687e7a971e069abec734fdb9c0668b8b`
- Extracted characters: 2408

~~~text
"""Phase 7K: adapter utilities for connecting an Arcane evaluator to diagnostics.

This is an integration boundary, not a replacement evaluator. Pass a callable that
runs one existing evaluation; errors are converted to stable diagnostics and successful
results receive descriptive types without coercion.
"""
from dataclasses import dataclass
from typing import Any, Callable, Optional

from arcane_diagnostics import (
    ArcaneDiagnosticError, Diagnostic, ErrorCode, SourceSpan, TypedValue,
    diagnostic_for_exception, infer_type,
)

@dataclass(frozen=True)
class EvaluationResult:
    typed_value: Optional[TypedValue] = None
    diagnostic: Optional[Diagnostic] = None

    @property
    def ok(self) -> bool:
        return self.typed_value is not None and self.diagnostic is None

    def render(self) -> str:
        if self.diagnostic is not None:
            return self.diagnostic.render()
        if self.typed_value is None:
            return 'ARC-RUNTIME-999: evaluation produced no result'
        return f"{self.typed_value.type.describe()}: {self.typed_value.value!r}"


def evaluate_safely(evaluator: Callable[[], Any], span: SourceSpan = SourceSpan(),
                    dimensions: tuple[int, ...] = ()) -> EvaluationResult:
    """Run an evaluator callable and normalise its result or exception.

    Existing ArcaneDiagnosticError objects retain their original diagnostic. Other
    exceptions are mapped through the Phase 7J catalogue. Exception tracebacks are
    deliberately not included in user-facing output.
    """
    try:
        value = evaluator()
        return EvaluationResult(typed_value=TypedValue(value, infer_type(value, dimensions)))
    except ArcaneDiagnosticError as exc:
        return EvaluationResult(diagnostic=exc.diagnostic)
    except Exception as exc:  # adapter boundary intentionally normalises evaluator errors
        return EvaluationResult(diagnostic=diagnostic_for_exception(exc, span))


def require_success(result: EvaluationResult) -> TypedValue:
    """Return the typed value or raise a structured Arcane diagnostic error."""
    if result.diagnostic is not None:
        raise ArcaneDiagnosticError(result.diagnostic)
    if result.typed_value is None:
        raise ArcaneDiagnosticError(Diagnostic(
            code=ErrorCode.INTERNAL_ERROR,
            message='evaluation produced no result',
        ))
    return result.typed_value

~~~

## arcane_runtime_adapter.py

- Type: PY
- SHA-256: `8eb59bf6ccf60776cd1af02fd64dad72687e7a971e069abec734fdb9c0668b8b`
- Extracted characters: 2408

~~~text
"""Phase 7K: adapter utilities for connecting an Arcane evaluator to diagnostics.

This is an integration boundary, not a replacement evaluator. Pass a callable that
runs one existing evaluation; errors are converted to stable diagnostics and successful
results receive descriptive types without coercion.
"""
from dataclasses import dataclass
from typing import Any, Callable, Optional

from arcane_diagnostics import (
    ArcaneDiagnosticError, Diagnostic, ErrorCode, SourceSpan, TypedValue,
    diagnostic_for_exception, infer_type,
)

@dataclass(frozen=True)
class EvaluationResult:
    typed_value: Optional[TypedValue] = None
    diagnostic: Optional[Diagnostic] = None

    @property
    def ok(self) -> bool:
        return self.typed_value is not None and self.diagnostic is None

    def render(self) -> str:
        if self.diagnostic is not None:
            return self.diagnostic.render()
        if self.typed_value is None:
            return 'ARC-RUNTIME-999: evaluation produced no result'
        return f"{self.typed_value.type.describe()}: {self.typed_value.value!r}"


def evaluate_safely(evaluator: Callable[[], Any], span: SourceSpan = SourceSpan(),
                    dimensions: tuple[int, ...] = ()) -> EvaluationResult:
    """Run an evaluator callable and normalise its result or exception.

    Existing ArcaneDiagnosticError objects retain their original diagnostic. Other
    exceptions are mapped through the Phase 7J catalogue. Exception tracebacks are
    deliberately not included in user-facing output.
    """
    try:
        value = evaluator()
        return EvaluationResult(typed_value=TypedValue(value, infer_type(value, dimensions)))
    except ArcaneDiagnosticError as exc:
        return EvaluationResult(diagnostic=exc.diagnostic)
    except Exception as exc:  # adapter boundary intentionally normalises evaluator errors
        return EvaluationResult(diagnostic=diagnostic_for_exception(exc, span))


def require_success(result: EvaluationResult) -> TypedValue:
    """Return the typed value or raise a structured Arcane diagnostic error."""
    if result.diagnostic is not None:
        raise ArcaneDiagnosticError(result.diagnostic)
    if result.typed_value is None:
        raise ArcaneDiagnosticError(Diagnostic(
            code=ErrorCode.INTERNAL_ERROR,
            message='evaluation produced no result',
        ))
    return result.typed_value

~~~

## arcane_semantic 2.py

- Type: PY
- SHA-256: `88bae7f54cdce69bf7173ab0d41847e097b707eb194fa5a12e0d482c89adbaae`
- Extracted characters: 8650

~~~text
"""Phase 7T semantic checks for the provisional Arcane subset.

This module does not execute programs and does not define canonical scope rules.
It implements an explicit, documented provisional policy for bindings and functions.
"""
from __future__ import annotations
from dataclasses import dataclass
import re
from pathlib import Path
from arcane_expr import tokenize, BINARY_PREFIX

NAME = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
FUNCTION = re.compile(r"^KWAF\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^()]*)\)\s*=>\s*(.+)$")
BINDING = re.compile(r"^KWAM\s+([A-Za-z_][A-Za-z0-9_]*)\s*=>\s*(.+)$")

@dataclass(frozen=True)
class SemanticIssue:
    code: str
    message: str
    line: int
    hint: str = ""
    def render(self, filename="<source>"):
        extra = f" Hint: {self.hint}" if self.hint else ""
        return f"{filename}:{self.line}: error {self.code}: {self.message}{extra}"

@dataclass
class Scope:
    bindings: dict[str, int]
    params: set[str]
    kind: str = "block"
    def resolve(self, name: str) -> bool:
        scope: Scope | None = self
        while scope is not None:
            if name in scope.bindings or name in scope.params:
                return True
            scope = getattr(scope, "parent", None)
        return False

@dataclass(frozen=True)
class FunctionInfo:
    params: tuple[str, ...]
    line: int

@dataclass(frozen=True)
class SemanticReport:
    filename: str
    issues: tuple[SemanticIssue, ...]
    @property
    def ok(self): return not self.issues
    def render(self):
        if self.ok: return f"{self.filename}: semantic checks OK"
        return "\n".join(i.render(self.filename) for i in self.issues)

def _parent_scope(bindings=None, params=None, kind="block", parent=None):
    s = Scope(bindings or {}, params or set(), kind)
    s.parent = parent
    return s

def _calls_and_refs(expression: str):
    """Return binding refs and named calls, excluding Arcane prefix operators."""
    tokens = tokenize(expression)
    refs = [t[1:] for t in tokens if t.startswith("$")]
    calls = []
    for i, tok in enumerate(tokens[:-1]):
        if NAME.fullmatch(tok) and tokens[i+1] == "(" and tok not in BINARY_PREFIX:
            # Count top-level comma-separated arguments in this call.
            depth, commas, has_arg = 0, 0, False
            j = i + 2
            if j < len(tokens) and tokens[j] == ")":
                arity = 0
            else:
                arity = 1
                while j < len(tokens):
                    t = tokens[j]
                    if t == "(": depth += 1
                    elif t == ")":
                        if depth == 0: break
                        depth -= 1
                    elif t == "," and depth == 0: commas += 1
                    j += 1
                arity += commas
            calls.append((tok, arity))
    return refs, calls

def analyze_source(source: str, filename: str = "<source>") -> SemanticReport:
    issues: list[SemanticIssue] = []
    lines = [(i, raw.strip()) for i, raw in enumerate(source.splitlines(), 1)
             if raw.strip() and not raw.strip().startswith("#")]
    functions: dict[str, FunctionInfo] = {}
    # First pass: function declarations are globally visible (including forward calls).
    for line, text in lines:
        m = FUNCTION.fullmatch(text)
        if not m: continue
        name, raw_params, _ = m.groups()
        params = tuple(p.strip().lstrip("$") for p in raw_params.split(",") if p.strip())
        if any(not NAME.fullmatch(p) for p in params):
            issues.append(SemanticIssue("ARC-SEM-001", f"invalid parameter list for function '{name}'", line,
                                        "Use comma-separated identifier names."))
            continue
        if len(set(params)) != len(params):
            issues.append(SemanticIssue("ARC-SEM-002", f"duplicate parameter in function '{name}'", line))
        if name in functions:
            issues.append(SemanticIssue("ARC-SEM-003", f"function '{name}' is defined more than once", line,
                                        "Give each function one definition."))
        else: functions[name] = FunctionInfo(params, line)

    root = _parent_scope(kind="global")
    # Function parameters belong to their own expression scope; function bodies are expression-only here.
    scopes = [root]
    block_frames = []  # stores parent scope and whether currently in ELSE branch
    for line, text in lines:
        if text.startswith("KWAI ") and text.endswith(" THEN"):
            expr = text[5:-5].strip()
            _check_expr(expr, line, scopes[-1], functions, issues)
            parent = scopes[-1]
            child = _parent_scope(kind="branch", parent=parent)
            scopes.append(child); block_frames.append((parent, False))
            continue
        if text == "ELSE":
            if block_frames and scopes:
                parent, _ = block_frames[-1]
                scopes[-1] = _parent_scope(kind="branch", parent=parent)
                block_frames[-1] = (parent, True)
            continue
        if text == "END":
            if block_frames and len(scopes) > 1:
                scopes.pop(); block_frames.pop()
            continue
        fm = FUNCTION.fullmatch(text)
        if fm:
            name, raw_params, expr = fm.groups()
            params = set(p.strip().lstrip("$") for p in raw_params.split(",") if p.strip())
            fn_scope = _parent_scope(params=params, kind="function", parent=root)
            _check_expr(expr, line, fn_scope, functions, issues, current_function=name)
            continue
        bm = BINDING.fullmatch(text)
        if bm:
            name, expr = bm.groups()
            _check_expr(expr, line, scopes[-1], functions, issues)
            if name in scopes[-1].bindings:
                issues.append(SemanticIssue("ARC-SEM-004", f"binding '{name}' is declared more than once in the same scope", line,
                                            "Use a new name or assign through a separately specified update construct."))
            else:
                scopes[-1].bindings[name] = line
            continue
        # KWAT is treated as a reference/use in the reconstructed subset.
        if text.startswith("KWAT "):
            name = text.split(None, 1)[1].strip()
            if not scopes[-1].resolve(name):
                issues.append(SemanticIssue("ARC-SEM-005", f"unresolved binding '{name}'", line,
                                            "Declare it with KWAM in an enclosing scope."))
            continue
        # Check expressions embedded in the remaining recognised provisional forms.
        if text.startswith(("KWAR ", "KWAS ")) and "=>" in text:
            _check_expr(text.split("=>", 1)[1].strip(), line, scopes[-1], functions, issues)
        elif text.startswith("KWAI ") and " THEN " in text and " ELSE " in text:
            m = re.fullmatch(r"KWAI\s+(.+?)\s+THEN\s+(.+?)\s+ELSE\s+(.+)", text)
            if m:
                for expr in m.groups(): _check_expr(expr, line, scopes[-1], functions, issues)
    issues.sort(key=lambda i: (i.line, i.code, i.message))
    return SemanticReport(filename, tuple(issues))

def _check_expr(expr, line, scope, functions, issues, current_function=None):
    try: refs, calls = _calls_and_refs(expr)
    except Exception: return  # syntax checker owns parse diagnostics
    for name in refs:
        if not scope.resolve(name):
            issues.append(SemanticIssue("ARC-SEM-005", f"unresolved binding '${name}'", line,
                                        "Declare the binding in this scope or an enclosing scope."))
    for name, arity in calls:
        if name not in functions:
            issues.append(SemanticIssue("ARC-SEM-006", f"call to undefined function '{name}'", line,
                                        "Define the function with KWAF before using it, or correct the name."))
        elif len(functions[name].params) != arity:
            issues.append(SemanticIssue("ARC-SEM-007", f"function '{name}' expects {len(functions[name].params)} argument(s), got {arity}", line,
                                        "Match the call's argument count to the function definition."))
        if current_function and name == current_function:
            # Recursion is not prohibited; leave it permitted pending canonical call rules.
            pass

def analyze_file(path: str | Path) -> SemanticReport:
    p = Path(path)
    try: source = p.read_text(encoding="utf-8")
    except OSError as exc: return SemanticReport(str(p), (SemanticIssue("ARC-IO-001", f"cannot read file: {exc}", 1),))
    return analyze_source(source, str(p))

~~~

## arcane_semantic 3.py

- Type: PY
- SHA-256: `e77fa386cf881220c77df23104ffec7e91dd60ed37e0fd8a57a62921571ee2c3`
- Extracted characters: 3004

~~~text
"""Lightweight static name/function checks for Phase 7U; runtime remains authoritative."""
import re
from dataclasses import dataclass
from pathlib import Path
@dataclass(frozen=True)
class Issue:
    code:str; message:str; line:int
    def render(self,filename='<source>'): return f'{filename}:{self.line}: error {self.code}: {self.message}'
@dataclass(frozen=True)
class Report:
    filename:str; issues:tuple
    @property
    def ok(self): return not self.issues
    def render(self): return f'{self.filename}: semantic checks OK' if self.ok else '\n'.join(i.render(self.filename) for i in self.issues)
def analyze_source(src,filename='<source>'):
    issues=[]; bindings=set(); funcs={}; pending=[]; params=set(); stack=[]
    lines=[(i,s.strip()) for i,s in enumerate(src.splitlines(),1) if s.strip() and not s.strip().startswith('#')]
    for n,s in lines:
        fm=re.fullmatch(r'KWAF\s+(\w+)\s*\(([^()]*)\)\s*=>\s*(.+)',s)
        if fm:
            name,raw,body=fm.groups(); ps=[x.strip().lstrip('$') for x in raw.split(',') if x.strip()]
            if name in funcs: issues.append(Issue('ARC-SEM-003',f"duplicate function '{name}'",n))
            funcs[name]=len(ps); pending.append((n,body,set(ps),name)); continue
        if s.startswith('KWAI ') and s.endswith(' THEN'):
            stack.append(set()); continue
        if s=='ELSE':
            if stack: stack[-1]=set()
            continue
        if s=='END':
            if stack: stack.pop()
            continue
        bm=re.fullmatch(r'KWAM\s+(\w+)\s*=>\s*(.+)',s)
        if bm:
            name,body=bm.groups(); visible=bindings.union(*stack) if stack else bindings
            _refs(body,n,visible,funcs,issues,allow_forward=True)
            current=stack[-1] if stack else bindings
            if name in current: issues.append(Issue('ARC-SEM-004',f"duplicate binding '{name}'",n))
            current.add(name); continue
        if s.startswith('KWAT '):
            name=s.split(None,1)[1]; visible=bindings.union(*stack) if stack else bindings
            if name not in visible: issues.append(Issue('ARC-SEM-005',f"unresolved binding '{name}'",n))
    for n,body,ps,name in pending: _refs(body,n,ps,funcs,issues,allow_forward=True)
    return Report(filename,tuple(issues))
def _refs(expr,line,visible,funcs,issues,allow_forward=False):
    for name in re.findall(r'\$([A-Za-z_]\w*)',expr):
        if name not in visible: issues.append(Issue('ARC-SEM-005',f"unresolved binding '${name}'",line))
    for name,args in re.findall(r'\b([A-Za-z_]\w*)\s*\(([^()]*)\)',expr):
        if name not in funcs: issues.append(Issue('ARC-SEM-006',f"undefined function '{name}'",line))
        elif len([x for x in args.split(',') if x.strip()]) != funcs[name]: issues.append(Issue('ARC-SEM-007',f"wrong argument count for '{name}'",line))
def analyze_file(path):
    p=Path(path)
    try: return analyze_source(p.read_text(encoding='utf-8'),str(p))
    except OSError as e: return Report(str(p),(Issue('ARC-IO-001',str(e),1),))

~~~

## arcane_semantic 4.py

- Type: PY
- SHA-256: `e77fa386cf881220c77df23104ffec7e91dd60ed37e0fd8a57a62921571ee2c3`
- Extracted characters: 3004

~~~text
"""Lightweight static name/function checks for Phase 7U; runtime remains authoritative."""
import re
from dataclasses import dataclass
from pathlib import Path
@dataclass(frozen=True)
class Issue:
    code:str; message:str; line:int
    def render(self,filename='<source>'): return f'{filename}:{self.line}: error {self.code}: {self.message}'
@dataclass(frozen=True)
class Report:
    filename:str; issues:tuple
    @property
    def ok(self): return not self.issues
    def render(self): return f'{self.filename}: semantic checks OK' if self.ok else '\n'.join(i.render(self.filename) for i in self.issues)
def analyze_source(src,filename='<source>'):
    issues=[]; bindings=set(); funcs={}; pending=[]; params=set(); stack=[]
    lines=[(i,s.strip()) for i,s in enumerate(src.splitlines(),1) if s.strip() and not s.strip().startswith('#')]
    for n,s in lines:
        fm=re.fullmatch(r'KWAF\s+(\w+)\s*\(([^()]*)\)\s*=>\s*(.+)',s)
        if fm:
            name,raw,body=fm.groups(); ps=[x.strip().lstrip('$') for x in raw.split(',') if x.strip()]
            if name in funcs: issues.append(Issue('ARC-SEM-003',f"duplicate function '{name}'",n))
            funcs[name]=len(ps); pending.append((n,body,set(ps),name)); continue
        if s.startswith('KWAI ') and s.endswith(' THEN'):
            stack.append(set()); continue
        if s=='ELSE':
            if stack: stack[-1]=set()
            continue
        if s=='END':
            if stack: stack.pop()
            continue
        bm=re.fullmatch(r'KWAM\s+(\w+)\s*=>\s*(.+)',s)
        if bm:
            name,body=bm.groups(); visible=bindings.union(*stack) if stack else bindings
            _refs(body,n,visible,funcs,issues,allow_forward=True)
            current=stack[-1] if stack else bindings
            if name in current: issues.append(Issue('ARC-SEM-004',f"duplicate binding '{name}'",n))
            current.add(name); continue
        if s.startswith('KWAT '):
            name=s.split(None,1)[1]; visible=bindings.union(*stack) if stack else bindings
            if name not in visible: issues.append(Issue('ARC-SEM-005',f"unresolved binding '{name}'",n))
    for n,body,ps,name in pending: _refs(body,n,ps,funcs,issues,allow_forward=True)
    return Report(filename,tuple(issues))
def _refs(expr,line,visible,funcs,issues,allow_forward=False):
    for name in re.findall(r'\$([A-Za-z_]\w*)',expr):
        if name not in visible: issues.append(Issue('ARC-SEM-005',f"unresolved binding '${name}'",line))
    for name,args in re.findall(r'\b([A-Za-z_]\w*)\s*\(([^()]*)\)',expr):
        if name not in funcs: issues.append(Issue('ARC-SEM-006',f"undefined function '{name}'",line))
        elif len([x for x in args.split(',') if x.strip()]) != funcs[name]: issues.append(Issue('ARC-SEM-007',f"wrong argument count for '{name}'",line))
def analyze_file(path):
    p=Path(path)
    try: return analyze_source(p.read_text(encoding='utf-8'),str(p))
    except OSError as e: return Report(str(p),(Issue('ARC-IO-001',str(e),1),))

~~~

## arcane_semantic.py

- Type: PY
- SHA-256: `413ef93d9dcaa700b9284efc8fd2b4e98c05d66319e891cdf5b547b53e527a4e`
- Extracted characters: 3490

~~~text
from dataclasses import dataclass
from pathlib import Path
import re
from arcane_runtime import ArcaneFailure, parse_program, walk, tokenize, BINOPS

@dataclass(frozen=True)
class Issue:
    code:str; message:str; line:int
    def render(self,filename="<source>"): return f"{filename}:{self.line}: error {self.code}: {self.message}"
@dataclass(frozen=True)
class Report:
    filename:str; issues:tuple
    @property
    def ok(self): return not self.issues
    def render(self): return f"{self.filename}: semantic checks OK" if self.ok else "\n".join(x.render(self.filename) for x in self.issues)

def _expr(expr,line,visible,functions,issues):
    try: ts=tokenize(expr,line)
    except ArcaneFailure as e: issues.append(Issue(e.code,e.message,line)); return
    for t in ts:
        if t.startswith("$") and t[1:] not in visible:
            issues.append(Issue("ARC-SEM-005",f"unresolved binding '{t}'",line))
    i=0
    while i<len(ts)-1:
        name=ts[i]
        if re.fullmatch(r"[A-Za-z_]\w*",name) and name not in BINOPS and ts[i+1]=="(":
            j=i+2; depth=0; commas=0; empty=j<len(ts) and ts[j]==")"
            while j<len(ts):
                if ts[j]=="(": depth+=1
                elif ts[j]==")":
                    if depth==0: break
                    depth-=1
                elif ts[j]=="," and depth==0: commas+=1
                j+=1
            arity=0 if empty else commas+1
            if name not in functions: issues.append(Issue("ARC-SEM-006",f"undefined function '{name}'",line))
            elif functions[name]!=arity: issues.append(Issue("ARC-SEM-007",f"function '{name}' expects {functions[name]} argument(s), got {arity}",line))
        i+=1

def analyze_source(source,filename="<source>"):
    try: ast,_=parse_program(source)
    except ArcaneFailure as e: return Report(filename,(Issue(e.code,e.message,e.line),))
    issues=[]; functions={}
    for n in walk(ast):
        if n.kind=="function":
            if n.name in functions: issues.append(Issue("ARC-SEM-003",f"duplicate function '{n.name}'",n.line))
            else: functions[n.name]=len(n.params)
            if len(set(n.params))!=len(n.params): issues.append(Issue("ARC-SEM-002",f"duplicate parameter in '{n.name}'",n.line))
    def block(nodes,inherited):
        visible=set(inherited); declared=set()
        for n in nodes:
            if n.kind=="binding":
                _expr(n.expr,n.line,visible,functions,issues)
                if n.name in declared: issues.append(Issue("ARC-SEM-004",f"duplicate binding '{n.name}'",n.line))
                declared.add(n.name); visible.add(n.name)
            elif n.kind=="output":
                if n.name not in visible: issues.append(Issue("ARC-SEM-005",f"unresolved binding '{n.name}'",n.line))
            elif n.kind=="if":
                _expr(n.expr,n.line,visible,functions,issues)
                block(n.yes,visible); block(n.no,visible)
    block(ast,set())
    # Function expressions intentionally use parameter-only scope in this subset.
    for n in walk(ast):
        if n.kind=="function": _expr(n.expr,n.line,set(n.params),functions,issues)
    unique=[]; seen=set()
    for x in issues:
        k=(x.code,x.message,x.line)
        if k not in seen: seen.add(k); unique.append(x)
    return Report(filename,tuple(unique))

def analyze_file(path):
    p=Path(path)
    try:return analyze_source(p.read_text(encoding="utf-8"),str(p))
    except OSError as e:return Report(str(p),(Issue("ARC-IO-001",str(e),1),))

~~~

## arcane_session 2.py

- Type: PY
- SHA-256: `4f5a0c87b96c1792ac0dbc4a0261741eb8f215c5cae41440d4983fea4fd89a57`
- Extracted characters: 1852

~~~text
import copy
from dataclasses import dataclass
from arcane_runtime import Environment, ArcaneError, format_quantity
@dataclass(frozen=True)
class Result: ok:bool; message:str; value:object=None
class ArcaneSession:
 def __init__(self):self.env=Environment();self.count=0
 def execute_line(self,line):
  s=line.strip()
  if not s or s.startswith('#'):return Result(True,'')
  if s.casefold() in (':quit',':exit'):return Result(True,'Goodbye.')
  if s.casefold()==':help':return Result(True,'KWAM name = expr | KWAS name = expr | KWAS name <- expr | KWAK name = expr | KWAT name | KWAF name(p1,p2) => expression | KWAC name(args) | :env | :scope in/out | :quit')
  if s.casefold()==':scope in':self.env.push_scope();return Result(True,f'entered scope {self.env.scope_depth}')
  if s.casefold()==':scope out':
   try:self.env.pop_scope();return Result(True,f'left scope; depth {self.env.scope_depth}')
   except ArcaneError as e:return Result(False,f'Error: {e}')
  if s.casefold()==':env':
   visible={}
   for scope in self.env._scopes:visible.update(scope)
   return Result(True,'\n'.join(f'{n} [{b.kind}] = {format_quantity(self.env.resolve(n))}' for n,b in sorted(visible.items())) or '(no bindings)')
  snap=copy.deepcopy((self.env._scopes,self.env.functions,self.env._resolving))
  self.count+=1
  try:
   v=self.env.execute(s);msg=format_quantity(v) if hasattr(v,'dimension') else str(v);return Result(True,msg,v)
  except Exception as e:
   self.env._scopes,self.env.functions,self.env._resolving=snap
   return Result(False,f'Error on statement {self.count}: {e}')
if __name__=='__main__':
 s=ArcaneSession();print('Arcane provisional runtime. Type :help or :quit.')
 while True:
  try:line=input('arcane> ')
  except EOFError:break
  r=s.execute_line(line)
  if r.message:print(r.message)
  if line.strip().casefold() in (':quit',':exit'):break

~~~

## arcane_session 3.py

- Type: PY
- SHA-256: `682bd376f63aa0503a22ea3db244e05e5522cbe1dfbe462083a3b74e45af2d2a`
- Extracted characters: 812

~~~text
"""Minimal interactive shell for Phase 7E provisional runtime."""
import copy
from arcane_runtime import Environment,fmt,ArcaneError

def main():
 e=Environment();print('Arcane Phase 7E provisional runtime. :help for help, :quit to exit.')
 while True:
  try:s=input('arcane> ').strip()
  except EOFError:print();break
  if s.casefold() in (':quit',':exit'):break
  if s.casefold()==':help':print('KWAM name = expression | KWAF name(params) => expression | KWAC name(args) | FRASI condition then else | FRAGT/FRALT/FRAEQ comparisons | :quit');continue
  if not s:continue
  snap=copy.deepcopy((e.scopes,e.functions))
  try:
   v=e.execute(s);print(fmt(v) if hasattr(v,'dim') else v)
  except Exception as ex:
   e.scopes,e.functions=snap;print(f'Error: {type(ex).__name__}: {ex}')
if __name__=='__main__':main()

~~~

## arcane_session 4.py

- Type: PY
- SHA-256: `496efd4dae120344221a2f2e5aead41ea4f900534c142e97bf6472100a05115f`
- Extracted characters: 825

~~~text
"""Interactive shell for the Phase 7F provisional Arcane runtime."""
import copy
from arcane_runtime import Environment,fmt

def main():
 e=Environment();print('Arcane Phase 7F provisional runtime. :help for help, :quit to exit.')
 while True:
  try:s=input('arcane> ').strip()
  except EOFError:print();break
  if s.casefold() in (':quit',':exit'):break
  if s.casefold()==':help':
   print('KWAM name = expression | KWAF name(params) => expression | KWAC name(args) | name(expr, ...) | FRASI condition then else | FRAGT/FRALT/FRAEQ comparisons | :quit');continue
  if not s:continue
  snap=copy.deepcopy((e.scopes,e.functions))
  try:
   v=e.execute(s);print(fmt(v) if hasattr(v,'dim') else v)
  except Exception as ex:
   e.scopes,e.functions=snap;print(f'Error: {type(ex).__name__}: {ex}')
if __name__=='__main__':main()

~~~

## arcane_session 5.py

- Type: PY
- SHA-256: `496efd4dae120344221a2f2e5aead41ea4f900534c142e97bf6472100a05115f`
- Extracted characters: 825

~~~text
"""Interactive shell for the Phase 7F provisional Arcane runtime."""
import copy
from arcane_runtime import Environment,fmt

def main():
 e=Environment();print('Arcane Phase 7F provisional runtime. :help for help, :quit to exit.')
 while True:
  try:s=input('arcane> ').strip()
  except EOFError:print();break
  if s.casefold() in (':quit',':exit'):break
  if s.casefold()==':help':
   print('KWAM name = expression | KWAF name(params) => expression | KWAC name(args) | name(expr, ...) | FRASI condition then else | FRAGT/FRALT/FRAEQ comparisons | :quit');continue
  if not s:continue
  snap=copy.deepcopy((e.scopes,e.functions))
  try:
   v=e.execute(s);print(fmt(v) if hasattr(v,'dim') else v)
  except Exception as ex:
   e.scopes,e.functions=snap;print(f'Error: {type(ex).__name__}: {ex}')
if __name__=='__main__':main()

~~~

## arcane_session 6.py

- Type: PY
- SHA-256: `caba6689a467658f6f8642753e5db5311312c8241d018f1106116dc11db77ec5`
- Extracted characters: 867

~~~text
"""Interactive shell for the Phase 7H provisional Arcane runtime."""
import copy
from arcane_runtime import Environment,fmt

def main():
 e=Environment();print('Arcane Phase 7H provisional runtime. :help for help, :quit to exit.')
 while True:
  try:s=input('arcane> ').strip()
  except EOFError:print();break
  if s.casefold() in (':quit',':exit'):break
  if s.casefold()==':help':
   print('KWAM name = expression | KWAF name(params) => expression | KWAC name(args) | KWAT name | KWAR i FROM start TO end => expression | FRASI/FRAGT/FRALT/FRAEQ | FRAND/FROR/FRNOT | :quit');continue
  if not s:continue
  snap=copy.deepcopy((e.scopes,e.functions))
  try:
   v=e.execute(s);print(fmt(v) if isinstance(v,list) or hasattr(v,'dim') else v)
  except Exception as ex:
   e.scopes,e.functions=snap;print(f'Error: {type(ex).__name__}: {ex}')
if __name__=='__main__':main()

~~~

## arcane_session 7.py

- Type: PY
- SHA-256: `caba6689a467658f6f8642753e5db5311312c8241d018f1106116dc11db77ec5`
- Extracted characters: 867

~~~text
"""Interactive shell for the Phase 7H provisional Arcane runtime."""
import copy
from arcane_runtime import Environment,fmt

def main():
 e=Environment();print('Arcane Phase 7H provisional runtime. :help for help, :quit to exit.')
 while True:
  try:s=input('arcane> ').strip()
  except EOFError:print();break
  if s.casefold() in (':quit',':exit'):break
  if s.casefold()==':help':
   print('KWAM name = expression | KWAF name(params) => expression | KWAC name(args) | KWAT name | KWAR i FROM start TO end => expression | FRASI/FRAGT/FRALT/FRAEQ | FRAND/FROR/FRNOT | :quit');continue
  if not s:continue
  snap=copy.deepcopy((e.scopes,e.functions))
  try:
   v=e.execute(s);print(fmt(v) if isinstance(v,list) or hasattr(v,'dim') else v)
  except Exception as ex:
   e.scopes,e.functions=snap;print(f'Error: {type(ex).__name__}: {ex}')
if __name__=='__main__':main()

~~~

## arcane_session.py

- Type: PY
- SHA-256: `6315ef131ecf6d877580b0677de457ccb8a90a22f335085d4ef41de6d18f42c4`
- Extracted characters: 5961

~~~text
"""Arcane Phase 7C: persistent interactive sessions and transactional statements.

All command spellings are provisional implementation syntax, not canon.
"""
from __future__ import annotations
import copy
from dataclasses import dataclass
from pathlib import Path
from typing import TextIO
from arcane_runtime import Environment, ArcaneError, format_quantity

HELP = """Arcane interactive session (provisional syntax)
  KWAM name = expression     immutable value
  KWAS name = expression     mutable state
  KWAS name <- expression   update mutable state
  KWAK name = expression     live expression
  KWAT name                  read a binding
  FRAPA/FRATA/FRAKA/FRALA    evaluate arithmetic expression
  :scope in                  enter nested scope
  :scope out                 leave nested scope
  :scope                     show current scope depth
  :env                       list visible bindings
  :help                      show this help
  :quit                      exit

Expressions support numeric literals, units and $name references.
Each statement is atomic: a failed command restores the environment.
"""

@dataclass(frozen=True)
class SessionResult:
    ok: bool
    message: str
    value: object = None

class ArcaneSession:
    def __init__(self, environment: Environment | None = None):
        self.env = environment or Environment()
        self.statement_number = 0

    def _visible_bindings(self):
        # Preserve nearest-scope shadowing; display the effective visible binding.
        visible = {}
        for scope in self.env._scopes:
            visible.update(scope)
        return visible

    def execute_line(self, line: str) -> SessionResult:
        raw = line.strip()
        if not raw or raw.startswith('#'):
            return SessionResult(True, '')
        if raw.casefold() in (':quit', ':exit'):
            return SessionResult(True, 'Goodbye.')
        if raw.casefold() == ':help':
            return SessionResult(True, HELP)
        if raw.casefold() == ':scope':
            return SessionResult(True, f'scope depth: {self.env.scope_depth}')
        if raw.casefold() == ':scope in':
            self.env.push_scope()
            return SessionResult(True, f'entered scope {self.env.scope_depth}')
        if raw.casefold() == ':scope out':
            try:
                self.env.pop_scope()
            except ArcaneError as exc:
                return SessionResult(False, f'Error: {exc}')
            return SessionResult(True, f'left scope; depth {self.env.scope_depth}')
        if raw.casefold() == ':env':
            visible = self._visible_bindings()
            if not visible:
                return SessionResult(True, '(no bindings)')
            lines = []
            for name, binding in sorted(visible.items()):
                try:
                    value = self.env.resolve(name)
                    rendered = format_quantity(value)
                except ArcaneError as exc:
                    rendered = f'<error: {exc}>'
                lines.append(f'{name} [{binding.kind}] = {rendered}')
            return SessionResult(True, '\n'.join(lines))

        # Snapshot before executing. Any language error restores all scope maps and
        # binding objects, so even an accidental partial mutation cannot leak.
        snapshot = copy.deepcopy(self.env._scopes)
        resolving = list(self.env._resolving)
        self.statement_number += 1
        try:
            value = self.env.execute(raw)
            message = format_quantity(value) if hasattr(value, 'dimension') and hasattr(value, 'value') else str(value)
            return SessionResult(True, message, value)
        except ArcaneError as exc:
            self.env._scopes = snapshot
            self.env._resolving = resolving
            return SessionResult(False, f'Error on statement {self.statement_number}: {exc}')
        except Exception as exc:
            # Surface unexpected implementation failures without corrupting state.
            self.env._scopes = snapshot
            self.env._resolving = resolving
            return SessionResult(False, f'Internal error on statement {self.statement_number}: {type(exc).__name__}: {exc}')

    def run_stream(self, source: TextIO, output: TextIO, interactive: bool = False) -> int:
        if interactive:
            output.write('Arcane provisional runtime. Type :help for commands; :quit to exit.\n')
        for line in source:
            if interactive:
                output.write('arcane> ')
                output.flush()
            result = self.execute_line(line)
            if result.message:
                output.write(result.message + '\n')
            if line.strip().casefold() in (':quit', ':exit'):
                break
        return 0

def run_file(path: str | Path, output: TextIO) -> int:
    session = ArcaneSession()
    errors = 0
    with open(path, encoding='utf-8') as src:
        for lineno, line in enumerate(src, 1):
            result = session.execute_line(line)
            if result.message:
                output.write(f'{lineno}: {result.message}\n')
            if not result.ok:
                errors += 1
    return 1 if errors else 0

if __name__ == '__main__':
    import argparse, sys
    parser = argparse.ArgumentParser(description='Arcane persistent interactive runtime')
    parser.add_argument('--script', help='execute statements from a UTF-8 file')
    args = parser.parse_args()
    if args.script:
        raise SystemExit(run_file(args.script, sys.stdout))
    session = ArcaneSession()
    sys.stdout.write('Arcane provisional runtime. Type :help for commands; :quit to exit.\n')
    while True:
        try:
            line = input('arcane> ')
        except EOFError:
            print()
            break
        result = session.execute_line(line)
        if result.message:
            print(result.message)
        if line.strip().casefold() in (':quit', ':exit'):
            break

~~~

## arcane_typed_core.py

- Type: PY
- SHA-256: `22c00b2be1ebb2f3791aaa706b12545f3ef21da7f6d47ad1f23b680174621e71`
- Extracted characters: 5714

~~~text
"""Arcane Phase 6Z: provisional dimensional type-checking arithmetic runtime.

This implementation profile is deliberately non-canonical. It makes numeric
literals and units executable while preserving the recovered operator names.
No physical/magical feasibility is inferred from dimensional validity.
"""
from __future__ import annotations
from dataclasses import dataclass
from decimal import Decimal, InvalidOperation, DivisionByZero
import re
from typing import Mapping

class ArcaneError(ValueError): pass
class ArcaneParseError(ArcaneError): pass
class ArcaneTypeError(ArcaneError): pass
class ArcaneEvaluationError(ArcaneError): pass

# Dimension vector order: length, time, mass. This is a small starter set.
DIMENSIONLESS = (0, 0, 0)
UNITS: Mapping[str, tuple[Decimal, tuple[int,int,int]]] = {
    "1": (Decimal(1), DIMENSIONLESS),
    "m": (Decimal(1), (1,0,0)),
    "cm": (Decimal("0.01"), (1,0,0)),
    "km": (Decimal(1000), (1,0,0)),
    "s": (Decimal(1), (0,1,0)),
    "min": (Decimal(60), (0,1,0)),
    "h": (Decimal(3600), (0,1,0)),
    "kg": (Decimal(1), (0,0,1)),
    "g": (Decimal("0.001"), (0,0,1)),
}
DIGITS = {"ZA":0,"KI":1,"TO":2,"MU":3,"RE":4,"SA":5,"FI":6,"DU":7,"GO":8,"PE":9}

@dataclass(frozen=True)
class Quantity:
    value: Decimal  # normalised to SI base units for this supported dimension set
    dimension: tuple[int,int,int]
    def __str__(self):
        return f"{self.value} [L^{self.dimension[0]} T^{self.dimension[1]} M^{self.dimension[2]}]"

@dataclass(frozen=True)
class Literal:
    quantity: Quantity
    source: str
@dataclass(frozen=True)
class Call:
    op: str
    args: tuple['Expr', ...]
Expr = Literal | Call
ARITY = {"FRAPA":2, "FRATA":2, "FRAKA":2, "FRALA":2}

# Supported provisional literal spellings: 3, 3@m, 25@cm, 2@s, and digit roots.
_NUM_UNIT = re.compile(r"^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)(?:@([A-Za-z0-9]+))?$")

def _dims_add(a,b): return tuple(x+y for x,y in zip(a,b))
def _dims_sub(a,b): return tuple(x-y for x,y in zip(a,b))

def _literal(token: str) -> Literal | None:
    if token in DIGITS:
        return Literal(Quantity(Decimal(DIGITS[token]), DIMENSIONLESS), token)
    match = _NUM_UNIT.fullmatch(token)
    if not match: return None
    raw, unit = match.groups(); unit = unit or "1"
    if unit not in UNITS: raise ArcaneTypeError(f"unknown unit {unit!r}; supported units: {', '.join(UNITS)}")
    try: value = Decimal(raw)
    except InvalidOperation as exc: raise ArcaneParseError(f"invalid numeric literal {token!r}") from exc
    scale, dims = UNITS[unit]
    return Literal(Quantity(value*scale, dims), token)

class _Parser:
    def __init__(self, tokens): self.tokens=tokens; self.i=0
    def expr(self):
        if self.i >= len(self.tokens): raise ArcaneParseError("unexpected end of expression; expected an operand")
        token=self.tokens[self.i]; self.i += 1
        lit=_literal(token)
        if lit is not None: return lit
        if token in ARITY:
            return Call(token, tuple(self.expr() for _ in range(ARITY[token])))
        if token in ("FRASHA", "SIMA", "GAMA", "DAVE", "KWAM", "KWAT", "KWAK"):
            raise ArcaneParseError(f"{token} is not implemented in this arithmetic profile; refusing to guess its semantics")
        raise ArcaneParseError(f"unknown form or malformed literal {token!r}")

def parse(source: str) -> Expr:
    if not isinstance(source,str) or not source.strip(): raise ArcaneParseError("expression must be a non-empty string")
    p=_Parser(source.split()); tree=p.expr()
    if p.i != len(p.tokens): raise ArcaneParseError("extra token(s) after complete expression: "+' '.join(p.tokens[p.i:]))
    return tree

def infer_dimension(expr: Expr) -> tuple[int,int,int]:
    if isinstance(expr, Literal): return expr.quantity.dimension
    a,b=(infer_dimension(x) for x in expr.args)
    if expr.op in ("FRAPA","FRATA"):
        if a != b: raise ArcaneTypeError(f"{expr.op} requires matching dimensions; got {a} and {b}")
        return a
    if expr.op == "FRAKA": return _dims_add(a,b)
    if expr.op == "FRALA": return _dims_sub(a,b)
    raise ArcaneTypeError(f"no type rule for {expr.op}")

def evaluate_expr(expr: Expr) -> Quantity:
    # Type-check the whole expression before performing arithmetic.
    infer_dimension(expr)
    if isinstance(expr, Literal): return expr.quantity
    a,b=(evaluate_expr(x) for x in expr.args)
    if expr.op == "FRAPA": value=a.value+b.value; dims=a.dimension
    elif expr.op == "FRATA": value=a.value-b.value; dims=a.dimension
    elif expr.op == "FRAKA": value=a.value*b.value; dims=_dims_add(a.dimension,b.dimension)
    elif expr.op == "FRALA":
        if b.value == 0: raise ArcaneEvaluationError("FRALA: division by zero")
        value=a.value/b.value; dims=_dims_sub(a.dimension,b.dimension)
    else: raise ArcaneTypeError(f"operator {expr.op} is not implemented")
    return Quantity(value,dims)

def evaluate(source: str) -> Quantity: return evaluate_expr(parse(source))
def format_quantity(q: Quantity) -> str:
    val=format(q.value.normalize(),'f') if q.value else '0'
    l,t,m=q.dimension
    if (l,t,m)==DIMENSIONLESS: unit='1'
    else:
        factors=[]
        for symbol,power in (("m",l),("s",t),("kg",m)):
            if power: factors.append(symbol if power==1 else f"{symbol}^{power}")
        unit=' '.join(factors)
    return f"{val} {unit}"

if __name__ == '__main__':
    import argparse
    cli=argparse.ArgumentParser(description='Arcane provisional dimensional arithmetic core')
    cli.add_argument('expression', nargs='+'); args=cli.parse_args()
    try: print(format_quantity(evaluate(' '.join(args.expression))))
    except ArcaneError as exc: raise SystemExit(f"Arcane error: {exc}")

~~~

## phase5_vernacular.py

- Type: PY
- SHA-256: `eb1901b4c433af94dee61c5e1a6e0f6021edbbca2873eb3215744c2b85801505`
- Extracted characters: 11069

~~~text
#!/usr/bin/env python3
"""
ARCANE LANGUAGE AUDIT - PHASE 5 (vernacular register).
Builds a seeded vernacular lexicon that is legal under the Phase 4 phonology and at
least 2.0 (feature heuristic) from every formal form and every other vernacular form,
assembles interlinear sample sentences from concept keys, and checks them.
Heuristic distances are NOT listener tests.
"""
import csv, json, random, sys
sys.path.insert(0, "/home/claude")
import arcane_lexicon_tools as T

disp = lambda w: w.replace("ʃ", "sh").replace("ŋ", "ng")

# ---------------------------------------------------------------- formal forms already taken
rows4 = list(csv.DictReader(open("/mnt/user-data/outputs/Arcane_Lexicon_v4_draft.csv", encoding="utf-8")))
formal_forms = [r["form"] for r in rows4 if "(formal)" not in r["form"] and not r["form"].endswith("-") and r["cls"] != "CLITIC"]
by_gloss = {}
for r in rows4: by_gloss.setdefault(r["gloss"], r["form"])
SHARED = {   # closed-class words shared with the formal register
    "I": "mi", "you": "ri", "this/it": "su", "we": "ni", "everyone": "wo",
    "and": by_gloss["and"], "or": by_gloss["or"], "not": by_gloss["not"], "if": by_gloss["if"],
    "while": by_gloss["while"], "until": by_gloss["until (until)"] if "until (until)" in by_gloss else by_gloss["until"],
    "toward": "jo", "away from": "jur", "left": "pa", "right": "ba", "down": "ta", "up": "da", "back": "ka", "front": "ga",
    "now": by_gloss["now (instant of evaluation)"], "before": by_gloss["before"], "after": by_gloss["after"],
    "all": by_gloss["for all"], "some": by_gloss["exists (any)"],
}
for k in ["0","1","2","3","4","5","6","7","8","9"]:
    SHARED[k] = by_gloss[k]

# ---------------------------------------------------------------- concepts: (key, gloss, class, shape)
C = []
def cl(cls, shape, items):
    for key, gloss in items: C.append((key, gloss, cls, shape))
cl("PART", "CVC", [("Q","question particle (yes/no)"),("POL","polite particle"),("RESP","respectful particle"),
                   ("EMPH","emphatic particle"),("TOP","topic particle"),("PERF","already/done"),("PROG","ongoing")])
cl("INTJ", "CVC", [("HELLO","hello"),("BYE","goodbye"),("THANKS","thanks"),("SORRY","sorry"),("PLEASE","please"),
                   ("YES","yes"),("NO","no"),("MAYBE","maybe")])
cl("WH", "CVC", [("WHO","who"),("WHAT","what"),("WHERE","where"),("WHEN","when"),("WHY","why"),("HOW","how")])
cl("PREP", "CVC", [("IN","in/at"),("WITH","with"),("FOR","for"),("ABOUT","about"),("THAN","than")])
cl("CONJ", "CVC", [("BUT","but"),("BECAUSE","because"),("SO","so")])
cl("V", "CVC", [(k, k.lower()) for k in ["GO","COME","SEE","HEAR","SAY","KNOW","WANT","NEED","CAN","MAKE","GIVE","TAKE","EAT","DRINK",
                  "SLEEP","LIVE","DIE","FIGHT","HELP","LOVE","FEAR","THINK","REMEMBER","FORGET","LEARN","TEACH","LAUGH","CRY","RUN","WAIT","FIND","LOSE"]])
cl("N", "CVCV", [(k, k.lower()) for k in ["PERSON","FRIEND","FAMILY","MOTHER","FATHER","CHILD","TEACHER","STUDENT","NAME","HOME","DOOR","ROAD",
                  "TOWN","FOOD","WATER","FIRE","RAIN","WIND","SUN","MOON","NIGHT","DAY","MONEY","BOOK","WORD","STORY","JOKE","SONG",
                  "FACE","HAND","EYE","HEART","MAGE","SPELL","MANA","NULL"]])
cl("ADJ", "CVCV", [(k, k.lower()) for k in ["GOOD","BAD","BIG","SMALL","NEW","OLD","FAST","SLOW","STRONG","WEAK","HOT","COLD","HARD","EASY","TRUE","FUNNY","STRANGE","TIRED"]])
GL = {"NULL": "NULL (unclassified)", "HARD": "difficult", "SPELL": "spell (a construction)", "MANA": "mana"}

ONS = list("bdgtkpmnlrvwfsjz") + ["ʃ"]
VOW = "aeiou"
def pool(shape):
    out = []
    if shape == "CVC":
        for o in ONS:
            for v in VOW:
                for c in "mnŋptksʃlr":
                    out.append(o + v + c)
    else:
        for o1 in ONS:
            for v1 in VOW:
                for o2 in ONS:
                    for v2 in VOW:
                        if v1 != v2: out.append(o1 + v1 + o2 + v2)
    return out

def generate(seed=5105, thr=2.0):
    rng = random.Random(seed)
    pools = {s: pool(s) for s in ("CVC", "CVCV")}
    for p in pools.values(): rng.shuffle(p)
    taken = list(formal_forms)
    out = {}
    for key, gloss, cls, shape in C:
        pick = None
        for w in pools[shape]:
            if w in taken or T.syllabify(w)[1]: continue
            if min(T.dist(w, t) for t in taken) < thr: continue
            pick = w; break
        if pick is None: raise SystemExit(f"no form for {key}")
        out[key] = pick; taken.append(pick)
    return out

FORMS = generate()
GLOSS = {k: GL.get(k, g) for k, g, c, s in C}
CLS = {k: c for k, g, c, s in C}
ALIAS = {"mi": "I", "ri": "you", "su": "this/it", "ni": "we", "wo": "everyone", "jo": "toward"}
def form(k):
    k = ALIAS.get(k, k)
    if k in FORMS: return FORMS[k]
    if k in SHARED: return SHARED[k]
    return k   # literal formal form or separator
def tok(k): return disp(form(k))

# ---------------------------------------------------------------- sample sentences (key lists + English)
S = [
 ("Greeting", ["HELLO"], "Hello."),
 ("Thanks", ["THANKS", "ri"], "Thank you."),
 ("Predicate adjective", ["TIRED", "mi"], "I am tired."),
 ("Yes/no question", ["TIRED", "ri", "Q"], "Are you tired?"),
 ("Negation", ["not", "WANT", "mi", "EAT", "FOOD"], "I don't want to eat food."),
 ("Plain statement", ["SAY", "TEACHER"], "The teacher speaks."),
 ("WH predicate", ["WHERE", "DOOR"], "Where is the door?"),
 ("Past with a time word", ["before", "HELP", "WHO", "ri"], "Who helped you?"),
 ("Possession", ["LEARN", "FRIEND", "mi", "SPELL"], "My friend learns spells."),
 ("Direction", ["COME", "jo", "mi"], "Come toward me."),
 ("Polite request", ["GIVE", "mi", "WATER", "POL"], "Give me water, please (polite)."),
 ("Respectful thanks", ["THANKS", "ri", "RESP"], "Thank you (respectful)."),
 ("Conditional", ["if", "WANT", "ri", "HELP", "mi", "ri"], "If you want, I'll help you."),
 ("Because", ["not", "CAN", "mi", "FIND", "ROAD", "BECAUSE", "NIGHT"], "I can't find the road because it is night."),
 ("Comparison", ["STRONG", "MAGE", "THAN", "TEACHER"], "The mage is stronger than the teacher."),
 ("Coordination", ["FUNNY", "STORY", "su", "and", "STRANGE", "su"], "This story is funny, and it is strange."),
 ("Everyone", ["FEAR", "wo"], "Everyone is afraid."),
 ("Past + object", ["before", "FORGET", "mi", "NAME", "ri"], "I forgot your name."),
 ("WH object", ["WANT", "ri", "WHAT"], "What do you want?"),
 ("Progressive question", ["now", "PROG", "COME", "ri", "Q"], "Are you coming now?"),
 ("Modal + noun phrase", ["CAN", "mi", "MAKE", "FIRE", "SMALL"], "I can make a small fire."),
 ("Affection", ["LOVE", "mi", "ri", "EMPH"], "I really like you."),
 ("Compliment", ["STRONG", "HEART", "ri"], "Your heart is strong."),
 ("Slang (insult)", ["NULL", "ri"], "You're a NULL (you're useless)."),
 ("Counting", ["2", "FRIEND", "mi"], "I have two friends (lit. two friends, mine)."),
]
# SMALL is not a defined key: use the adjective key

IDIOMS = [
 ("Old news", [by_gloss["read"], by_gloss["before"]], "literally 'read, before' = stale information; gossip everyone already knows"),
 ("Up to date", [by_gloss["live evaluation"], "ri"], "literally 'live you' = you're keeping up"),
 ("All talk", ["tipa", by_gloss["assign"], "·", "not", "MAKE"], "literally 'all assign, not make' = all talk, no action (specifying an effect is not providing its mechanism)"),
 ("Hard to judge", ["not", by_gloss["measure"], "ri"], "literally 'not measure you' = don't size someone up by one reading"),
 ("Out of energy", ["not", "MANA", "ri"], "literally 'no mana you' = you're worn out"),
]

# ---------------------------------------------------------------- checks
res = []
def rec(i, title, ok, detail=""): res.append(dict(id=i, title=title, status="PASS" if ok else "FAIL", detail=detail))
allv = [FORMS[k] for k in FORMS]
bad = [(disp(w), T.syllabify(w)[1]) for w in allv if T.syllabify(w)[1]]
rec("P5-T01", f"All {len(allv)} vernacular forms are phonotactically legal", not bad, str(bad))
rec("P5-T02", "No vernacular form equals a formal form", not (set(allv) & set(formal_forms)))
rec("P5-T03", "No two vernacular forms are identical", len(set(allv)) == len(allv))
mind = min(min(T.dist(w, f) for f in formal_forms) for w in allv)
rec("P5-T04", "Every vernacular form is at least 2.0 from every formal form (heuristic)", mind >= 2.0, f"minimum {mind:.2f}")
mind2 = min(T.dist(a, b) for i, a in enumerate(allv) for b in allv[i+1:])
rec("P5-T05", "Every vernacular pair is at least 2.0 apart (heuristic)", mind2 >= 2.0, f"minimum {mind2:.2f}")
not_formal = [k for k, v in SHARED.items() if v not in formal_forms]
rec("P5-T06", "Every shared closed-class word is an actual form in the formal lexicon", not not_formal, str(not_formal))
known = set(FORMS) | set(SHARED) | set(ALIAS)
bad_s = [(n, k) for n, ks, e in S for k in ks if k not in known]
rec("P5-T07", f"All {len(S)} sample sentences use only defined words", not bad_s, str(bad_s))
# register-separability: formal forms re-used with different meaning in vernacular
json.dump(dict(forms=FORMS, shared=SHARED, results=res), open("/home/claude/phase5_report.json", "w"), ensure_ascii=False, indent=1)
for r in res: print(r["id"], r["status"], r["title"], r["detail"][:80])

# ---------------------------------------------------------------- merged lexicon CSV
out = []
for r in rows4:
    reg = "Performed" if r["cls"] in ("FUSED-REF", "CLITIC") else "Formal"
    if r["cls"] in ("DIGIT", "DECIMAL", "UNIT", "AXIS", "REF"): reg = "Shared"
    out.append(dict(form=r["form"], gloss=r["gloss"], cls=r["cls"], register=reg, status=r["status"], source=r["source"], note=r["note"]))
for k, g, c, s in C:
    out.append(dict(form=disp(FORMS[k]), gloss=GLOSS[k], cls=c, register="Vernacular", status="PROPOSED", source="Phase 5", note=""))
with open("/mnt/user-data/outputs/Arcane_Lexicon_v5_draft.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["form", "gloss", "cls", "register", "status", "source", "note"]); w.writeheader(); w.writerows(out)
print("rows:", len(out), "| vernacular roots:", len(C), "| passed", sum(r["status"] == "PASS" for r in res), "/", len(res))

# print sentences for review
for n, ks, e in S:
    print(f"{n:22s} {' '.join(tok(k) for k in ks):40s} | {' '.join(GLOSS.get(ALIAS.get(k, k), ALIAS.get(k, k)) for k in ks)} | {e}")
for n, ks, e in IDIOMS:
    print(n, "|", " ".join(disp(form(k)) for k in ks), "|", e)
print(json.dumps({k: disp(v) for k, v in FORMS.items()}, ensure_ascii=False))

# ---- dump for the document builder
doc = dict(
    forms={k: disp(v) for k, v in FORMS.items()}, gloss=GLOSS, cls=CLS, results=res,
    shared={k: disp(v) for k, v in SHARED.items()},
    sentences=[dict(name=n, arcane=" ".join(tok(k) for k in ks),
                    gloss=" ".join(GLOSS.get(ALIAS.get(k, k), ALIAS.get(k, k)) for k in ks), english=e) for n, ks, e in S],
    idioms=[dict(name=n, arcane=" ".join(disp(form(k)) for k in ks), meaning=e) for n, ks, e in IDIOMS],
)
json.dump(doc, open("/home/claude/phase5_doc.json", "w"), ensure_ascii=False, indent=1)

~~~

## PHASE_5_README.txt

- Type: TXT
- SHA-256: `9f57f105f11b3975c5046b2dfb838ed3d97cfb607822439a6c18491893b6c13d`
- Extracted characters: 1196

~~~text
ARCANE LANGUAGE AUDIT — PHASE 5: the vernacular register

Files
- Arcane_Language_Audit_Phase_5.docx: register map (vernacular, technical, formal, performed), vernacular grammar G-V1 to G-V10, casual-speech rules, shared closed classes, the 115-root vernacular lexicon, 25 interlinear sample sentences, 5 idioms, checks, ledger entries D-042 to D-050.
- Arcane_Lexicon_v5_draft.csv: the combined lexicon (255 rows) with a register column (Formal, Performed, Shared, Vernacular).
- phase5_vernacular.py: the generator and checks. It reads the Phase 4 lexicon CSV and the Phase 4 tools from the working folder, so treat it as a record of the checks, not a packaged tool.

Status
Decided under the owner's delegation. Vernacular roots are chosen by a seeded search (seed 5105), so the sounds are arbitrary. 7 of 7 mechanical checks passed (legality, uniqueness, heuristic distance from every formal form, sample sentences use only defined words). Nothing has been tested with listeners.

Owner decision flagged: zufo as slang for NULL.
Next: listener tests; grow the dictionary toward ~1,000 words; names and honorifics; historical layers; writing; a parser; optionally a viseme chart for lip-sync.

~~~

## PHASE_6Z_STATUS.csv

- Type: CSV
- SHA-256: `ff8c8a20006bf3f1764e00c83a495d103076edec80c0142e0f2aa9c4aed1ef27`
- Extracted characters: 814

~~~text
work_item,status,evidence,notes
Numeric literals,IMPLEMENTED,test_arcane_typed_core.py,Decimal and exponent notation
Starter unit system,IMPLEMENTED,test_arcane_typed_core.py,m cm km s min h kg g
Base-unit normalisation,IMPLEMENTED,test_arcane_typed_core.py,Small fixed unit table
Dimensional inference,IMPLEMENTED,test_arcane_typed_core.py,Length time mass exponents
Type check before evaluation,IMPLEMENTED,test_arcane_typed_core.py,Addition/subtraction dimension mismatch rejected
Error handling,IMPLEMENTED,test_arcane_typed_core.py,Malformed syntax unknown unit/operator and division by zero
Full canonical grammar,NOT_COMPLETE,ARCANE_PHASE_6Z_REPORT.md,Surface syntax remains provisional
Mana and physical feasibility,NOT_IMPLEMENTED,ARCANE_PHASE_6Z_REPORT.md,Dimensional validity does not imply feasibility

~~~

## PHASE_6Z_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `ae8e1bc63e4b5bf858ab389d40cc4c655b2abbd680390cbcbb2cf7cdee81c129`
- Extracted characters: 2460

~~~text
test_add_dimensionless (test_arcane_typed_core.TypedCoreTests.test_add_dimensionless) ... ok
test_add_same_units (test_arcane_typed_core.TypedCoreTests.test_add_same_units) ... ok
test_bad_numeric_token_rejected (test_arcane_typed_core.TypedCoreTests.test_bad_numeric_token_rejected) ... ok
test_cm_normalisation (test_arcane_typed_core.TypedCoreTests.test_cm_normalisation) ... ok
test_decimal_arithmetic (test_arcane_typed_core.TypedCoreTests.test_decimal_arithmetic) ... ok
test_digit_root_dimensionless (test_arcane_typed_core.TypedCoreTests.test_digit_root_dimensionless) ... ok
test_divide_dimensions (test_arcane_typed_core.TypedCoreTests.test_divide_dimensions) ... ok
test_division_by_zero (test_arcane_typed_core.TypedCoreTests.test_division_by_zero) ... ok
test_empty_expression_rejected (test_arcane_typed_core.TypedCoreTests.test_empty_expression_rejected) ... ok
test_extra_tokens_rejected (test_arcane_typed_core.TypedCoreTests.test_extra_tokens_rejected) ... ok
test_incompatible_add_rejected (test_arcane_typed_core.TypedCoreTests.test_incompatible_add_rejected) ... ok
test_incompatible_subtract_rejected (test_arcane_typed_core.TypedCoreTests.test_incompatible_subtract_rejected) ... ok
test_km_normalisation (test_arcane_typed_core.TypedCoreTests.test_km_normalisation) ... ok
test_mass_unit_conversion (test_arcane_typed_core.TypedCoreTests.test_mass_unit_conversion) ... ok
test_missing_operand_rejected (test_arcane_typed_core.TypedCoreTests.test_missing_operand_rejected) ... ok
test_multiply_dimensions (test_arcane_typed_core.TypedCoreTests.test_multiply_dimensions) ... ok
test_nested_dimension_error_detected_before_eval (test_arcane_typed_core.TypedCoreTests.test_nested_dimension_error_detected_before_eval) ... ok
test_nested_expression_dimensions (test_arcane_typed_core.TypedCoreTests.test_nested_expression_dimensions) ... ok
test_numeric_literal (test_arcane_typed_core.TypedCoreTests.test_numeric_literal) ... ok
test_subtract_operand_order (test_arcane_typed_core.TypedCoreTests.test_subtract_operand_order) ... ok
test_time_unit_conversion (test_arcane_typed_core.TypedCoreTests.test_time_unit_conversion) ... ok
test_unknown_operator_rejected (test_arcane_typed_core.TypedCoreTests.test_unknown_operator_rejected) ... ok
test_unknown_unit_rejected (test_arcane_typed_core.TypedCoreTests.test_unknown_unit_rejected) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.001s

OK

~~~

## PHASE_7A_STATUS.csv

- Type: CSV
- SHA-256: `9ac72eae81e73ecfcdb77fdb3662409f5431843d9063c774bced2e028b46384b`
- Extracted characters: 896

~~~text
work_item,status,evidence,notes
KWAM value binding,IMPLEMENTED,test_arcane_runtime.py,Immutable evaluated value
KWAT reference,IMPLEMENTED,test_arcane_runtime.py,Case-insensitive name resolution
KWAK live expression,IMPLEMENTED,test_arcane_runtime.py,Reevaluated on read; dependencies immutable in this slice
Expression references,IMPLEMENTED,test_arcane_runtime.py,$name provisional expression syntax
Dimensional validation,INTEGRATED,test_arcane_runtime.py,Reuses typed quantity evaluator
Cycle detection,IMPLEMENTED,test_arcane_runtime.py,Guard for cyclic live expressions
Persistent sessions,NOT_IMPLEMENTED,ARCANE_PHASE_7A_REPORT.md,CLI starts fresh environment each invocation
Canonical syntax,NOT_APPROVED,ARCANE_PHASE_7A_REPORT.md,Provisional implementation profile
Full language runtime,NOT_COMPLETE,ARCANE_PHASE_7A_REPORT.md,Control flow temporal operators and magic feasibility remain

~~~

## PHASE_7A_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `3874fb10276edf1b0383158423a235cd289626cc5fe82bff60c1738b26aa0ad0`
- Extracted characters: 1778

~~~text
test_arithmetic_still_works (test_arcane_runtime.BindingRuntimeTests.test_arithmetic_still_works) ... ok
test_duplicate_binding_rejected (test_arcane_runtime.BindingRuntimeTests.test_duplicate_binding_rejected) ... ok
test_expression_reference (test_arcane_runtime.BindingRuntimeTests.test_expression_reference) ... ok
test_invalid_name_rejected (test_arcane_runtime.BindingRuntimeTests.test_invalid_name_rejected) ... ok
test_kwam_creates_value_binding (test_arcane_runtime.BindingRuntimeTests.test_kwam_creates_value_binding) ... ok
test_kwat_case_insensitive (test_arcane_runtime.BindingRuntimeTests.test_kwat_case_insensitive) ... ok
test_live_binding_evaluates_expression_on_read (test_arcane_runtime.BindingRuntimeTests.test_live_binding_evaluates_expression_on_read) ... ok
test_live_binding_rejects_unknown_reference (test_arcane_runtime.BindingRuntimeTests.test_live_binding_rejects_unknown_reference) ... ok
test_live_binding_type_check (test_arcane_runtime.BindingRuntimeTests.test_live_binding_type_check) ... ok
test_malformed_statement_rejected (test_arcane_runtime.BindingRuntimeTests.test_malformed_statement_rejected) ... ok
test_reference_cycle_guard (test_arcane_runtime.BindingRuntimeTests.test_reference_cycle_guard) ... ok
test_reject_empty_statement (test_arcane_runtime.BindingRuntimeTests.test_reject_empty_statement) ... ok
test_unknown_reference_rejected (test_arcane_runtime.BindingRuntimeTests.test_unknown_reference_rejected) ... ok
test_value_binding_is_stable (test_arcane_runtime.BindingRuntimeTests.test_value_binding_is_stable) ... ok
test_value_binding_type_check (test_arcane_runtime.BindingRuntimeTests.test_value_binding_type_check) ... ok

----------------------------------------------------------------------
Ran 15 tests in 0.002s

OK

~~~

## PHASE_7B_STATUS.csv

- Type: CSV
- SHA-256: `fd244d7c2141b55d122d8c00080bd9be6e4fbfe52fb348627473ad7f9277622b`
- Extracted characters: 810

~~~text
work_item,status,evidence,notes
Mutable state bindings,IMPLEMENTED,test_arcane_runtime.py,KWAS name = expression
State assignment,IMPLEMENTED,test_arcane_runtime.py,KWAS name <- expression
Live dependency updates,IMPLEMENTED,test_arcane_runtime.py,KWAK reevaluates when read
Lexical scope stack,IMPLEMENTED,test_arcane_runtime.py,Python API push_scope/pop_scope
Shadowing,IMPLEMENTED,test_arcane_runtime.py,Nearest scope wins
Dimensional preservation on assignment,IMPLEMENTED,test_arcane_runtime.py,Failed assignment leaves old state unchanged
Immutable value protection,IMPLEMENTED,test_arcane_runtime.py,KWAM cannot be assigned
Canonical grammar,NOT_APPROVED,ARCANE_PHASE_7B_REPORT.md,All added syntax remains provisional
Persistent REPL,NOT_IMPLEMENTED,ARCANE_PHASE_7B_REPORT.md,Next usability improvement

~~~

## PHASE_7B_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `511da25172d4be6189be3caa574a599138f2c54f927cf585c04669ad8791903d`
- Extracted characters: 1726

~~~text
test_arithmetic_still_works (test_arcane_runtime.StateScopeTests.test_arithmetic_still_works) ... ok
test_case_insensitive_names (test_arcane_runtime.StateScopeTests.test_case_insensitive_names) ... ok
test_duplicate_same_scope_rejected (test_arcane_runtime.StateScopeTests.test_duplicate_same_scope_rejected) ... ok
test_failed_declaration_not_created (test_arcane_runtime.StateScopeTests.test_failed_declaration_not_created) ... ok
test_immutable_value_cannot_update (test_arcane_runtime.StateScopeTests.test_immutable_value_cannot_update) ... ok
test_inner_scope_disappears (test_arcane_runtime.StateScopeTests.test_inner_scope_disappears) ... ok
test_live_binding_in_inner_scope_sees_outer_state (test_arcane_runtime.StateScopeTests.test_live_binding_in_inner_scope_sees_outer_state) ... ok
test_live_cycle_detected (test_arcane_runtime.StateScopeTests.test_live_cycle_detected) ... ok
test_live_reacts_to_update (test_arcane_runtime.StateScopeTests.test_live_reacts_to_update) ... ok
test_outer_state_can_update_from_inner_scope (test_arcane_runtime.StateScopeTests.test_outer_state_can_update_from_inner_scope) ... ok
test_pop_global_scope_rejected (test_arcane_runtime.StateScopeTests.test_pop_global_scope_rejected) ... ok
test_scope_shadowing (test_arcane_runtime.StateScopeTests.test_scope_shadowing) ... ok
test_state_dimension_cannot_change (test_arcane_runtime.StateScopeTests.test_state_dimension_cannot_change) ... ok
test_state_updates (test_arcane_runtime.StateScopeTests.test_state_updates) ... ok
test_unknown_assignment_rejected (test_arcane_runtime.StateScopeTests.test_unknown_assignment_rejected) ... ok

----------------------------------------------------------------------
Ran 15 tests in 0.003s

OK

~~~

## PHASE_7C_DEMO_OUTPUT.txt

- Type: TXT
- SHA-256: `395801c4425e6d174c4f789112c3907bfed49b6d42480c421dc450537ee9e43d`
- Extracted characters: 106

~~~text
2: 2 m
3: 2.3 m
4: 2.3 m
5: 5 m
6: 5.3 m
7: entered scope 1
8: 1 m
9: 1 m
10: left scope; depth 0
11: 5 m

~~~

## PHASE_7C_STATUS.csv

- Type: CSV
- SHA-256: `0f549d349518690bb355cf7bd49213080aac75b039f2a6bd777a22e41ce0cf35`
- Extracted characters: 937

~~~text
work_item,status,evidence,notes
Persistent interactive session,IMPLEMENTED,arcane_session.py,Single in-memory environment across statements
Session commands,IMPLEMENTED,test_arcane_session.py,help quit scope in/out scope depth and environment listing
Transactional statement execution,IMPLEMENTED,test_arcane_session.py,Rollback to pre-statement snapshot on errors
Error diagnostics,IMPLEMENTED,test_arcane_session.py,Statement numbering and explicit failure messages
Script runner,IMPLEMENTED,test_arcane_session.py,Line-numbered output; continues after failures
Phase 7B regression,VERIFIED,PHASE_7C_TEST_OUTPUT.txt,29 tests pass combined
Persistent disk storage,NOT_IMPLEMENTED,ARCANE_PHASE_7C_REPORT.md,Session state ends with process
Canonical grammar,NOT_APPROVED,ARCANE_PHASE_7C_REPORT.md,Provisional implementation syntax
Full Arcane runtime,NOT_COMPLETE,ARCANE_PHASE_7C_REPORT.md,Functions/control flow/magic feasibility remain

~~~

## PHASE_7C_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `7ee121151410dcea6e2ff3bf57161ee1e349f4e4d3e6cf890cea3dd3f76edf90`
- Extracted characters: 3200

~~~text
test_arithmetic_still_works (test_arcane_runtime.StateScopeTests.test_arithmetic_still_works) ... ok
test_case_insensitive_names (test_arcane_runtime.StateScopeTests.test_case_insensitive_names) ... ok
test_duplicate_same_scope_rejected (test_arcane_runtime.StateScopeTests.test_duplicate_same_scope_rejected) ... ok
test_failed_declaration_not_created (test_arcane_runtime.StateScopeTests.test_failed_declaration_not_created) ... ok
test_immutable_value_cannot_update (test_arcane_runtime.StateScopeTests.test_immutable_value_cannot_update) ... ok
test_inner_scope_disappears (test_arcane_runtime.StateScopeTests.test_inner_scope_disappears) ... ok
test_live_binding_in_inner_scope_sees_outer_state (test_arcane_runtime.StateScopeTests.test_live_binding_in_inner_scope_sees_outer_state) ... ok
test_live_cycle_detected (test_arcane_runtime.StateScopeTests.test_live_cycle_detected) ... ok
test_live_reacts_to_update (test_arcane_runtime.StateScopeTests.test_live_reacts_to_update) ... ok
test_outer_state_can_update_from_inner_scope (test_arcane_runtime.StateScopeTests.test_outer_state_can_update_from_inner_scope) ... ok
test_pop_global_scope_rejected (test_arcane_runtime.StateScopeTests.test_pop_global_scope_rejected) ... ok
test_scope_shadowing (test_arcane_runtime.StateScopeTests.test_scope_shadowing) ... ok
test_state_dimension_cannot_change (test_arcane_runtime.StateScopeTests.test_state_dimension_cannot_change) ... ok
test_state_updates (test_arcane_runtime.StateScopeTests.test_state_updates) ... ok
test_unknown_assignment_rejected (test_arcane_runtime.StateScopeTests.test_unknown_assignment_rejected) ... ok
test_arithmetic_expression (test_arcane_session.SessionTests.test_arithmetic_expression) ... ok
test_blank_and_comment_ignored (test_arcane_session.SessionTests.test_blank_and_comment_ignored) ... ok
test_cannot_exit_global_scope (test_arcane_session.SessionTests.test_cannot_exit_global_scope) ... ok
test_duplicate_declaration_rolls_back (test_arcane_session.SessionTests.test_duplicate_declaration_rolls_back) ... ok
test_environment_listing (test_arcane_session.SessionTests.test_environment_listing) ... ok
test_failed_declaration_not_left_behind (test_arcane_session.SessionTests.test_failed_declaration_not_left_behind) ... ok
test_failed_statement_rolls_back_state (test_arcane_session.SessionTests.test_failed_statement_rolls_back_state) ... ok
test_help_and_scope_depth (test_arcane_session.SessionTests.test_help_and_scope_depth) ... ok
test_live_binding_updates_in_session (test_arcane_session.SessionTests.test_live_binding_updates_in_session) ... ok
test_quit_command (test_arcane_session.SessionTests.test_quit_command) ... ok
test_scope_commands (test_arcane_session.SessionTests.test_scope_commands) ... ok
test_script_execution_persists (test_arcane_session.SessionTests.test_script_execution_persists) ... ok
test_script_reports_errors_but_continues (test_arcane_session.SessionTests.test_script_reports_errors_but_continues) ... ok
test_session_persists_across_statements (test_arcane_session.SessionTests.test_session_persists_across_statements) ... ok

----------------------------------------------------------------------
Ran 29 tests in 0.004s

OK

~~~

## PHASE_7D_STATUS.csv

- Type: CSV
- SHA-256: `a7c9fc237eb79df53aebb89199b05c0aea02447b4fea5d515d1b1a180f894ff0`
- Extracted characters: 705

~~~text
work_item,status,evidence,notes
Function definitions,IMPLEMENTED,test_arcane_runtime.py,KWAF name(params) => expression
Function calls,IMPLEMENTED,test_arcane_runtime.py,KWAC name(args)
Argument arity validation,IMPLEMENTED,test_arcane_runtime.py,Exact argument count
Dimensional validation,INTEGRATED,test_arcane_runtime.py,Reuses typed quantity evaluator
Function local scope,IMPLEMENTED,test_arcane_runtime.py,Parameters isolated from caller
Global binding lookup,IMPLEMENTED,test_arcane_runtime.py,Lexical environment lookup
Function-call expressions,NOT_IMPLEMENTED,ARCANE_PHASE_7D_REPORT.md,No nested inline calls yet
Canonical grammar,NOT_APPROVED,ARCANE_PHASE_7D_REPORT.md,Provisional syntax only

~~~

## PHASE_7D_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `7fe0c14c9e944878ba8cb021f2dd957c800290fc49bdc67d912c72cd145201f7`
- Extracted characters: 1422

~~~text
test_bad_function_body_not_registered (test_arcane_runtime.FunctionTests.test_bad_function_body_not_registered) ... ok
test_duplicate_function (test_arcane_runtime.FunctionTests.test_duplicate_function) ... ok
test_duplicate_parameters (test_arcane_runtime.FunctionTests.test_duplicate_parameters) ... ok
test_function_basic (test_arcane_runtime.FunctionTests.test_function_basic) ... ok
test_function_can_read_global_binding (test_arcane_runtime.FunctionTests.test_function_can_read_global_binding) ... ok
test_function_local_param_shadows_global (test_arcane_runtime.FunctionTests.test_function_local_param_shadows_global) ... ok
test_function_typed_units (test_arcane_runtime.FunctionTests.test_function_typed_units) ... ok
test_function_wrong_dimensions (test_arcane_runtime.FunctionTests.test_function_wrong_dimensions) ... ok
test_local_parameter_does_not_leak (test_arcane_runtime.FunctionTests.test_local_parameter_does_not_leak) ... ok
test_regression_state_live (test_arcane_runtime.FunctionTests.test_regression_state_live) ... ok
test_sequential_function_composition (test_arcane_runtime.FunctionTests.test_sequential_function_composition) ... ok
test_unknown_function (test_arcane_runtime.FunctionTests.test_unknown_function) ... ok
test_wrong_arity (test_arcane_runtime.FunctionTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 13 tests in 0.002s

OK

~~~

## PHASE_7E_STATUS.csv

- Type: CSV
- SHA-256: `41bf1f282901468a5cdcf2eae0eb19cc2579dcd1771cfb17979ee1aa5b87cb1d`
- Extracted characters: 786

~~~text
work_item,status,evidence,notes
Greater-than comparison,IMPLEMENTED,test_arcane_runtime.py,FRAGT returns dimensionless 1 or 0
Less-than comparison,IMPLEMENTED,test_arcane_runtime.py,FRALT returns dimensionless 1 or 0
Equality comparison,IMPLEMENTED,test_arcane_runtime.py,FRAEQ returns dimensionless 1 or 0
Conditional expression,IMPLEMENTED,test_arcane_runtime.py,FRASI lazy branch selection
Conditional inside function,IMPLEMENTED,test_arcane_runtime.py,Function body supports conditional expression
Transactional interactive statement,IMPLEMENTED,arcane_session.py,Rollback snapshot on errors
Nested inline function calls,NOT_IMPLEMENTED,ARCANE_PHASE_7E_REPORT.md,Function calls remain statement-level
Canonical grammar,NOT_APPROVED,ARCANE_PHASE_7E_REPORT.md,Provisional syntax only

~~~

## PHASE_7E_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `523fe5009ec54f556220b273043fc840d7c51f75007f093c6d6b5a1b81d12ffb`
- Extracted characters: 1501

~~~text
test_comparison_dimensions (test_arcane_runtime.StructuredExecutionTests.test_comparison_dimensions) ... ok
test_conditional_false_branch (test_arcane_runtime.StructuredExecutionTests.test_conditional_false_branch) ... ok
test_conditional_returns_selected_branch_type (test_arcane_runtime.StructuredExecutionTests.test_conditional_returns_selected_branch_type) ... ok
test_conditional_true_branch (test_arcane_runtime.StructuredExecutionTests.test_conditional_true_branch) ... ok
test_division_by_zero_in_selected_branch (test_arcane_runtime.StructuredExecutionTests.test_division_by_zero_in_selected_branch) ... ok
test_equal (test_arcane_runtime.StructuredExecutionTests.test_equal) ... ok
test_function_arity (test_arcane_runtime.StructuredExecutionTests.test_function_arity) ... ok
test_function_can_use_conditional (test_arcane_runtime.StructuredExecutionTests.test_function_can_use_conditional) ... ok
test_greater_than (test_arcane_runtime.StructuredExecutionTests.test_greater_than) ... ok
test_lazy_conditional_does_not_evaluate_unselected_division (test_arcane_runtime.StructuredExecutionTests.test_lazy_conditional_does_not_evaluate_unselected_division) ... ok
test_less_than_false (test_arcane_runtime.StructuredExecutionTests.test_less_than_false) ... ok
test_unselected_branch_is_not_evaluated (test_arcane_runtime.StructuredExecutionTests.test_unselected_branch_is_not_evaluated) ... ok

----------------------------------------------------------------------
Ran 12 tests in 0.001s

OK

~~~

## PHASE_7F_STATUS.csv

- Type: CSV
- SHA-256: `b2e724dc0f7e9c8646d99f49588540142e9e32075f6f0fa1c4c02181e4eebf36`
- Extracted characters: 907

~~~text
item,status,notes
Function calls as expression nodes,implemented,"name(expr, ...)"
Nested function calls,implemented,"including multiple nested arguments"
Calls inside prefix expressions,implemented,"e.g. FRAPA inc(2) double(5)"
Nested calls in KWAC statement form,implemented,legacy form preserved
Unit dimension propagation,implemented,"small supported unit set only"
Conditionals and comparisons,regression-tested,"existing provisional semantics retained"
Error handling and local scopes,regression-tested,"unknown function, arity, dimensions, scope leakage"
Automated tests,passed,"27 tests"
Canonical grammar,not claimed,"provisional subset only"
Forward declarations and recursion,not implemented,"functions must be defined before use in function bodies"
Static dimension inference,not implemented,"runtime checks and placeholder validation only"
Loops and module system,not implemented,"future work"

~~~

## PHASE_7F_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `f41f8cb3bed4ceebd9ad097dd1e3317582c7996d0158e97f602d08081035c207`
- Extracted characters: 3517

~~~text
test_comparison_dimensions (test_arcane_runtime.ConditionalRegressionTests.test_comparison_dimensions) ... ok
test_conditional_false_branch (test_arcane_runtime.ConditionalRegressionTests.test_conditional_false_branch) ... ok
test_conditional_selected_branch_type_is_returned (test_arcane_runtime.ConditionalRegressionTests.test_conditional_selected_branch_type_is_returned) ... ok
test_conditional_true_branch (test_arcane_runtime.ConditionalRegressionTests.test_conditional_true_branch) ... ok
test_division_by_zero_in_selected_branch (test_arcane_runtime.ConditionalRegressionTests.test_division_by_zero_in_selected_branch) ... ok
test_equal (test_arcane_runtime.ConditionalRegressionTests.test_equal) ... ok
test_greater_than (test_arcane_runtime.ConditionalRegressionTests.test_greater_than) ... ok
test_lazy_conditional_does_not_evaluate_unselected_division (test_arcane_runtime.ConditionalRegressionTests.test_lazy_conditional_does_not_evaluate_unselected_division) ... ok
test_less_than_false (test_arcane_runtime.ConditionalRegressionTests.test_less_than_false) ... ok
test_unselected_branch_is_not_evaluated (test_arcane_runtime.ConditionalRegressionTests.test_unselected_branch_is_not_evaluated) ... ok
test_arity_error_in_nested_call (test_arcane_runtime.FunctionCompositionTests.test_arity_error_in_nested_call) ... ok
test_call_arguments_evaluated_in_caller_scope (test_arcane_runtime.FunctionCompositionTests.test_call_arguments_evaluated_in_caller_scope) ... ok
test_conditional_inside_composed_function (test_arcane_runtime.FunctionCompositionTests.test_conditional_inside_composed_function) ... ok
test_dimension_error_propagates_through_nested_call (test_arcane_runtime.FunctionCompositionTests.test_dimension_error_propagates_through_nested_call) ... ok
test_duplicate_function_is_rejected (test_arcane_runtime.FunctionCompositionTests.test_duplicate_function_is_rejected) ... ok
test_duplicate_parameters_are_rejected (test_arcane_runtime.FunctionCompositionTests.test_duplicate_parameters_are_rejected) ... ok
test_function_argument_can_be_arithmetic_expression (test_arcane_runtime.FunctionCompositionTests.test_function_argument_can_be_arithmetic_expression) ... ok
test_function_local_bindings_do_not_leak (test_arcane_runtime.FunctionCompositionTests.test_function_local_bindings_do_not_leak) ... ok
test_function_result_can_feed_prefix_expression (test_arcane_runtime.FunctionCompositionTests.test_function_result_can_feed_prefix_expression) ... ok
test_kwac_accepts_nested_calls (test_arcane_runtime.FunctionCompositionTests.test_kwac_accepts_nested_calls) ... ok
test_maximum_call_depth_guard (test_arcane_runtime.FunctionCompositionTests.test_maximum_call_depth_guard) ... ok
test_multiple_nested_arguments (test_arcane_runtime.FunctionCompositionTests.test_multiple_nested_arguments) ... ok
test_nested_calls_preserve_dimensions (test_arcane_runtime.FunctionCompositionTests.test_nested_calls_preserve_dimensions) ... ok
test_nested_division_by_zero_errors (test_arcane_runtime.FunctionCompositionTests.test_nested_division_by_zero_errors) ... ok
test_nested_function_calls (test_arcane_runtime.FunctionCompositionTests.test_nested_function_calls) ... ok
test_unclosed_call_errors (test_arcane_runtime.FunctionCompositionTests.test_unclosed_call_errors) ... ok
test_unknown_nested_function_errors (test_arcane_runtime.FunctionCompositionTests.test_unknown_nested_function_errors) ... ok

----------------------------------------------------------------------
Ran 27 tests in 0.002s

OK

~~~

## PHASE_7G_STATUS.csv

- Type: CSV
- SHA-256: `dbff9022fb1c8eede40f8cb7d2b6eb2b76426925d64844c177e43fa487f8d2c0`
- Extracted characters: 804

~~~text
area,status,notes
FRAND conjunction,implemented,Short-circuit evaluation; dimensionless operands required
FROR disjunction,implemented,Short-circuit evaluation; dimensionless operands required
FRNOT negation,implemented,Dimensionless operand required
Boolean representation,provisional,Dimensionless numeric truth values 0 and 1; not a separate Boolean type
Function composition,verified,Logic can consume function-call expressions
Conditional integration,verified,Logical expressions can be used as FRASI conditions
Case-insensitive operators,implemented,Operator names normalised during parsing
Canonical lexicon status,unconfirmed,FRAND FROR FRNOT are provisional runtime spellings
Automated tests,passed,37 of 37 tests passed
Full Arcane runtime,incomplete,This phase implements a tested subset only

~~~

## PHASE_7G_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `dd4a17bb65746e4c74113683dcd239431fb7d9ec53b9e9aa0b625c334966697c`
- Extracted characters: 3959

~~~text
test_conditional_false_branch (test_arcane_runtime.FunctionCompositionRegressionTests.test_conditional_false_branch) ... ok
test_conditional_is_lazy (test_arcane_runtime.FunctionCompositionRegressionTests.test_conditional_is_lazy) ... ok
test_conditional_true_branch (test_arcane_runtime.FunctionCompositionRegressionTests.test_conditional_true_branch) ... ok
test_dimension_mismatch_is_rejected (test_arcane_runtime.FunctionCompositionRegressionTests.test_dimension_mismatch_is_rejected) ... ok
test_division_by_zero_is_rejected (test_arcane_runtime.FunctionCompositionRegressionTests.test_division_by_zero_is_rejected) ... ok
test_local_scope_does_not_leak (test_arcane_runtime.FunctionCompositionRegressionTests.test_local_scope_does_not_leak) ... ok
test_multiple_nested_arguments (test_arcane_runtime.FunctionCompositionRegressionTests.test_multiple_nested_arguments) ... ok
test_nested_calls_preserve_dimensions (test_arcane_runtime.FunctionCompositionRegressionTests.test_nested_calls_preserve_dimensions) ... ok
test_nested_function_calls (test_arcane_runtime.FunctionCompositionRegressionTests.test_nested_function_calls) ... ok
test_unknown_binding_is_rejected (test_arcane_runtime.FunctionCompositionRegressionTests.test_unknown_binding_is_rejected) ... ok
test_wrong_arity_is_rejected (test_arcane_runtime.FunctionCompositionRegressionTests.test_wrong_arity_is_rejected) ... ok
test_and_evaluates_right_when_needed (test_arcane_runtime.LogicTests.test_and_evaluates_right_when_needed) ... ok
test_and_false_false (test_arcane_runtime.LogicTests.test_and_false_false) ... ok
test_and_false_true (test_arcane_runtime.LogicTests.test_and_false_true) ... ok
test_and_requires_dimensionless_left (test_arcane_runtime.LogicTests.test_and_requires_dimensionless_left) ... ok
test_and_requires_dimensionless_right (test_arcane_runtime.LogicTests.test_and_requires_dimensionless_right) ... ok
test_and_short_circuits_false_left (test_arcane_runtime.LogicTests.test_and_short_circuits_false_left) ... ok
test_and_true_false (test_arcane_runtime.LogicTests.test_and_true_false) ... ok
test_and_true_true (test_arcane_runtime.LogicTests.test_and_true_true) ... ok
test_comparisons_compose_with_logic (test_arcane_runtime.LogicTests.test_comparisons_compose_with_logic) ... ok
test_logic_arity_error (test_arcane_runtime.LogicTests.test_logic_arity_error) ... ok
test_logic_inside_conditional (test_arcane_runtime.LogicTests.test_logic_inside_conditional) ... ok
test_logic_is_case_insensitive (test_arcane_runtime.LogicTests.test_logic_is_case_insensitive) ... ok
test_logic_with_function_composition (test_arcane_runtime.LogicTests.test_logic_with_function_composition) ... ok
test_nested_logic (test_arcane_runtime.LogicTests.test_nested_logic) ... ok
test_not_false (test_arcane_runtime.LogicTests.test_not_false) ... ok
test_not_normalizes_nonzero_truth (test_arcane_runtime.LogicTests.test_not_normalizes_nonzero_truth) ... ok
test_not_requires_dimensionless (test_arcane_runtime.LogicTests.test_not_requires_dimensionless) ... ok
test_not_true (test_arcane_runtime.LogicTests.test_not_true) ... ok
test_or_evaluates_right_when_needed (test_arcane_runtime.LogicTests.test_or_evaluates_right_when_needed) ... ok
test_or_false_false (test_arcane_runtime.LogicTests.test_or_false_false) ... ok
test_or_false_true (test_arcane_runtime.LogicTests.test_or_false_true) ... ok
test_or_requires_dimensionless_left (test_arcane_runtime.LogicTests.test_or_requires_dimensionless_left) ... ok
test_or_requires_dimensionless_right (test_arcane_runtime.LogicTests.test_or_requires_dimensionless_right) ... ok
test_or_short_circuits_true_left (test_arcane_runtime.LogicTests.test_or_short_circuits_true_left) ... ok
test_or_true_false (test_arcane_runtime.LogicTests.test_or_true_false) ... ok
test_or_true_true (test_arcane_runtime.LogicTests.test_or_true_true) ... ok

----------------------------------------------------------------------
Ran 37 tests in 0.003s

OK

~~~

## PHASE_7H_STATUS 2.csv

- Type: CSV
- SHA-256: `fb3ec530237426bb9fd4a4ecebc2d4188faf2e00c660bb9af4f135fab7a9e6bf`
- Extracted characters: 875

~~~text
area,status,notes
Bounded repetition,implemented,"KWAR i FROM start TO end => expression; provisional syntax"
Inclusive integer range,implemented,"Start and end both included"
Empty range,implemented,"start > end yields empty list"
Bound validation,implemented,"Dimensionless integers required"
Iteration guard,implemented,"Maximum 1,000 iterations per repeat"
Iteration-local scope,implemented,"Loop variable removed after each iteration and on errors"
Outer-scope bound evaluation,implemented,"Bounds evaluated before loop scope is entered"
Function composition in body,verified,"Function calls work inside repeat body"
Logical/comparison expressions in body,verified,"Existing operations retained"
Automated tests,passed,"24 of 24 tests"
Canonical language status,unconfirmed,"KWAR and syntax are provisional"
Full Arcane runtime,incomplete,"Small executable subset only"

~~~

## PHASE_7H_STATUS.csv

- Type: CSV
- SHA-256: `fb3ec530237426bb9fd4a4ecebc2d4188faf2e00c660bb9af4f135fab7a9e6bf`
- Extracted characters: 875

~~~text
area,status,notes
Bounded repetition,implemented,"KWAR i FROM start TO end => expression; provisional syntax"
Inclusive integer range,implemented,"Start and end both included"
Empty range,implemented,"start > end yields empty list"
Bound validation,implemented,"Dimensionless integers required"
Iteration guard,implemented,"Maximum 1,000 iterations per repeat"
Iteration-local scope,implemented,"Loop variable removed after each iteration and on errors"
Outer-scope bound evaluation,implemented,"Bounds evaluated before loop scope is entered"
Function composition in body,verified,"Function calls work inside repeat body"
Logical/comparison expressions in body,verified,"Existing operations retained"
Automated tests,passed,"24 of 24 tests"
Canonical language status,unconfirmed,"KWAR and syntax are provisional"
Full Arcane runtime,incomplete,"Small executable subset only"

~~~

## PHASE_7H_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `8f65db438791414e205c641cbbb3cdb965f3e93d5bf9bdeabc99a4d07f36f7cf`
- Extracted characters: 2461

~~~text
test_body_arithmetic (test_arcane_runtime.BoundedRepeatTests.test_body_arithmetic) ... ok
test_body_function (test_arcane_runtime.BoundedRepeatTests.test_body_function) ... ok
test_body_logic (test_arcane_runtime.BoundedRepeatTests.test_body_logic) ... ok
test_bounds_evaluated_in_outer_scope (test_arcane_runtime.BoundedRepeatTests.test_bounds_evaluated_in_outer_scope) ... ok
test_case_insensitive_keyword (test_arcane_runtime.BoundedRepeatTests.test_case_insensitive_keyword) ... ok
test_dimensioned_bounds_rejected (test_arcane_runtime.BoundedRepeatTests.test_dimensioned_bounds_rejected) ... ok
test_empty_range (test_arcane_runtime.BoundedRepeatTests.test_empty_range) ... ok
test_error_cleans_loop_scope (test_arcane_runtime.BoundedRepeatTests.test_error_cleans_loop_scope) ... ok
test_excessive_iterations_rejected (test_arcane_runtime.BoundedRepeatTests.test_excessive_iterations_rejected) ... ok
test_fractional_bounds_rejected (test_arcane_runtime.BoundedRepeatTests.test_fractional_bounds_rejected) ... ok
test_inclusive_range (test_arcane_runtime.BoundedRepeatTests.test_inclusive_range) ... ok
test_loop_variable_does_not_leak (test_arcane_runtime.BoundedRepeatTests.test_loop_variable_does_not_leak) ... ok
test_negative_range (test_arcane_runtime.BoundedRepeatTests.test_negative_range) ... ok
test_non_numeric_result_is_not_claimed (test_arcane_runtime.BoundedRepeatTests.test_non_numeric_result_is_not_claimed) ... ok
test_outer_binding_survives (test_arcane_runtime.BoundedRepeatTests.test_outer_binding_survives) ... ok
test_single_iteration (test_arcane_runtime.BoundedRepeatTests.test_single_iteration) ... ok
test_and_short_circuit (test_arcane_runtime.RegressionTests.test_and_short_circuit) ... ok
test_conditional_lazy (test_arcane_runtime.RegressionTests.test_conditional_lazy) ... ok
test_dimension_mismatch (test_arcane_runtime.RegressionTests.test_dimension_mismatch) ... ok
test_division_zero (test_arcane_runtime.RegressionTests.test_division_zero) ... ok
test_nested_function_composition (test_arcane_runtime.RegressionTests.test_nested_function_composition) ... ok
test_or_short_circuit (test_arcane_runtime.RegressionTests.test_or_short_circuit) ... ok
test_unit_arithmetic (test_arcane_runtime.RegressionTests.test_unit_arithmetic) ... ok
test_unknown_binding (test_arcane_runtime.RegressionTests.test_unknown_binding) ... ok

----------------------------------------------------------------------
Ran 24 tests in 0.002s

OK

~~~

## PHASE_7H_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `8f65db438791414e205c641cbbb3cdb965f3e93d5bf9bdeabc99a4d07f36f7cf`
- Extracted characters: 2461

~~~text
test_body_arithmetic (test_arcane_runtime.BoundedRepeatTests.test_body_arithmetic) ... ok
test_body_function (test_arcane_runtime.BoundedRepeatTests.test_body_function) ... ok
test_body_logic (test_arcane_runtime.BoundedRepeatTests.test_body_logic) ... ok
test_bounds_evaluated_in_outer_scope (test_arcane_runtime.BoundedRepeatTests.test_bounds_evaluated_in_outer_scope) ... ok
test_case_insensitive_keyword (test_arcane_runtime.BoundedRepeatTests.test_case_insensitive_keyword) ... ok
test_dimensioned_bounds_rejected (test_arcane_runtime.BoundedRepeatTests.test_dimensioned_bounds_rejected) ... ok
test_empty_range (test_arcane_runtime.BoundedRepeatTests.test_empty_range) ... ok
test_error_cleans_loop_scope (test_arcane_runtime.BoundedRepeatTests.test_error_cleans_loop_scope) ... ok
test_excessive_iterations_rejected (test_arcane_runtime.BoundedRepeatTests.test_excessive_iterations_rejected) ... ok
test_fractional_bounds_rejected (test_arcane_runtime.BoundedRepeatTests.test_fractional_bounds_rejected) ... ok
test_inclusive_range (test_arcane_runtime.BoundedRepeatTests.test_inclusive_range) ... ok
test_loop_variable_does_not_leak (test_arcane_runtime.BoundedRepeatTests.test_loop_variable_does_not_leak) ... ok
test_negative_range (test_arcane_runtime.BoundedRepeatTests.test_negative_range) ... ok
test_non_numeric_result_is_not_claimed (test_arcane_runtime.BoundedRepeatTests.test_non_numeric_result_is_not_claimed) ... ok
test_outer_binding_survives (test_arcane_runtime.BoundedRepeatTests.test_outer_binding_survives) ... ok
test_single_iteration (test_arcane_runtime.BoundedRepeatTests.test_single_iteration) ... ok
test_and_short_circuit (test_arcane_runtime.RegressionTests.test_and_short_circuit) ... ok
test_conditional_lazy (test_arcane_runtime.RegressionTests.test_conditional_lazy) ... ok
test_dimension_mismatch (test_arcane_runtime.RegressionTests.test_dimension_mismatch) ... ok
test_division_zero (test_arcane_runtime.RegressionTests.test_division_zero) ... ok
test_nested_function_composition (test_arcane_runtime.RegressionTests.test_nested_function_composition) ... ok
test_or_short_circuit (test_arcane_runtime.RegressionTests.test_or_short_circuit) ... ok
test_unit_arithmetic (test_arcane_runtime.RegressionTests.test_unit_arithmetic) ... ok
test_unknown_binding (test_arcane_runtime.RegressionTests.test_unknown_binding) ... ok

----------------------------------------------------------------------
Ran 24 tests in 0.002s

OK

~~~

## PHASE_7I_STATUS.csv

- Type: CSV
- SHA-256: `9e8dfc317dc64ae0618e9b3ae7e1950576d7e9622b3cf2da3f31e5ad6f4e81c3`
- Extracted characters: 633

~~~text
item,status,notes
Bounded aggregation,implemented,KWAS sums expression results across inclusive integer bounds
Dimensional consistency,implemented,Non-empty results must share the same dimensions
Empty range,implemented,Returns dimensionless zero as a provisional convention
Iteration safety,implemented,Reuses the 1000-iteration cap from Phase 7H
Scope safety,implemented,Iteration scopes are cleaned up after success or failure
Regression suite,passed,40 tests pass
Canonical syntax review,pending,KWAS remains provisional pending decision-ledger review
Full compiler integration,not claimed,This is a reconstructed subset runtime

~~~

## PHASE_7I_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `b9e1d35df94ef1d68cb45b813ea13930ae3bf3ad304c4948fe39612bc0982975`
- Extracted characters: 4135

~~~text
test_duplicate_sum_binding_rejected (test_arcane_runtime.AggregationTests.test_duplicate_sum_binding_rejected) ... ok
test_sum_bounds_must_be_integers (test_arcane_runtime.AggregationTests.test_sum_bounds_must_be_integers) ... ok
test_sum_case_insensitive (test_arcane_runtime.AggregationTests.test_sum_case_insensitive) ... ok
test_sum_decimal_body (test_arcane_runtime.AggregationTests.test_sum_decimal_body) ... ok
test_sum_dimensioned_body (test_arcane_runtime.AggregationTests.test_sum_dimensioned_body) ... ok
test_sum_dimensioned_bounds_rejected (test_arcane_runtime.AggregationTests.test_sum_dimensioned_bounds_rejected) ... ok
test_sum_does_not_leak_iteration_variable (test_arcane_runtime.AggregationTests.test_sum_does_not_leak_iteration_variable) ... ok
test_sum_empty_range_is_zero (test_arcane_runtime.AggregationTests.test_sum_empty_range_is_zero) ... ok
test_sum_excessive_repeat_rejected (test_arcane_runtime.AggregationTests.test_sum_excessive_repeat_rejected) ... ok
test_sum_function_body (test_arcane_runtime.AggregationTests.test_sum_function_body) ... ok
test_sum_preserves_dimensions (test_arcane_runtime.AggregationTests.test_sum_preserves_dimensions) ... ok
test_sum_repeated_squares (test_arcane_runtime.AggregationTests.test_sum_repeated_squares) ... ok
test_sum_result_can_be_used (test_arcane_runtime.AggregationTests.test_sum_result_can_be_used) ... ok
test_sum_scope_cleanup_on_error (test_arcane_runtime.AggregationTests.test_sum_scope_cleanup_on_error) ... ok
test_sum_simple_range (test_arcane_runtime.AggregationTests.test_sum_simple_range) ... ok
test_sum_single_value (test_arcane_runtime.AggregationTests.test_sum_single_value) ... ok
test_body_arithmetic (test_arcane_runtime.BoundedRepeatTests.test_body_arithmetic) ... ok
test_body_function (test_arcane_runtime.BoundedRepeatTests.test_body_function) ... ok
test_body_logic (test_arcane_runtime.BoundedRepeatTests.test_body_logic) ... ok
test_bounds_evaluated_in_outer_scope (test_arcane_runtime.BoundedRepeatTests.test_bounds_evaluated_in_outer_scope) ... ok
test_case_insensitive_keyword (test_arcane_runtime.BoundedRepeatTests.test_case_insensitive_keyword) ... ok
test_dimensioned_bounds_rejected (test_arcane_runtime.BoundedRepeatTests.test_dimensioned_bounds_rejected) ... ok
test_empty_range (test_arcane_runtime.BoundedRepeatTests.test_empty_range) ... ok
test_error_cleans_loop_scope (test_arcane_runtime.BoundedRepeatTests.test_error_cleans_loop_scope) ... ok
test_excessive_iterations_rejected (test_arcane_runtime.BoundedRepeatTests.test_excessive_iterations_rejected) ... ok
test_fractional_bounds_rejected (test_arcane_runtime.BoundedRepeatTests.test_fractional_bounds_rejected) ... ok
test_inclusive_range (test_arcane_runtime.BoundedRepeatTests.test_inclusive_range) ... ok
test_loop_variable_does_not_leak (test_arcane_runtime.BoundedRepeatTests.test_loop_variable_does_not_leak) ... ok
test_negative_range (test_arcane_runtime.BoundedRepeatTests.test_negative_range) ... ok
test_non_numeric_result_is_not_claimed (test_arcane_runtime.BoundedRepeatTests.test_non_numeric_result_is_not_claimed) ... ok
test_outer_binding_survives (test_arcane_runtime.BoundedRepeatTests.test_outer_binding_survives) ... ok
test_single_iteration (test_arcane_runtime.BoundedRepeatTests.test_single_iteration) ... ok
test_and_short_circuit (test_arcane_runtime.RegressionTests.test_and_short_circuit) ... ok
test_conditional_lazy (test_arcane_runtime.RegressionTests.test_conditional_lazy) ... ok
test_dimension_mismatch (test_arcane_runtime.RegressionTests.test_dimension_mismatch) ... ok
test_division_zero (test_arcane_runtime.RegressionTests.test_division_zero) ... ok
test_nested_function_composition (test_arcane_runtime.RegressionTests.test_nested_function_composition) ... ok
test_or_short_circuit (test_arcane_runtime.RegressionTests.test_or_short_circuit) ... ok
test_unit_arithmetic (test_arcane_runtime.RegressionTests.test_unit_arithmetic) ... ok
test_unknown_binding (test_arcane_runtime.RegressionTests.test_unknown_binding) ... ok

----------------------------------------------------------------------
Ran 40 tests in 0.002s

OK

~~~

## PHASE_7J_STATUS 2.csv

- Type: CSV
- SHA-256: `595d8c6e0e84b1992c40853b440df39cd4c64f47c7ff55f89a87bb3837518d2f`
- Extracted characters: 737

~~~text
item,status,notes
Stable diagnostic codes,implemented,10 stable codes defined
Source spans,implemented,1-based positions with validation
Human-readable hints,implemented,Common error categories mapped with safe fallback
Descriptive value typing,implemented,Numbers booleans strings lists functions unknown
Boolean versus numeric distinction,verified,Python bool is checked before number
List type descriptions,implemented,Homogeneous collections described; mixed and empty are unknown element type
Automated tests,passed,23 of 23 new tests pass
Prior runtime integration,pending,Phase 7H/7I files absent from active workspace; helper module remains independent
Canonical language vocabulary,unchanged,No new language keywords introduced

~~~

## PHASE_7J_STATUS 3.csv

- Type: CSV
- SHA-256: `595d8c6e0e84b1992c40853b440df39cd4c64f47c7ff55f89a87bb3837518d2f`
- Extracted characters: 737

~~~text
item,status,notes
Stable diagnostic codes,implemented,10 stable codes defined
Source spans,implemented,1-based positions with validation
Human-readable hints,implemented,Common error categories mapped with safe fallback
Descriptive value typing,implemented,Numbers booleans strings lists functions unknown
Boolean versus numeric distinction,verified,Python bool is checked before number
List type descriptions,implemented,Homogeneous collections described; mixed and empty are unknown element type
Automated tests,passed,23 of 23 new tests pass
Prior runtime integration,pending,Phase 7H/7I files absent from active workspace; helper module remains independent
Canonical language vocabulary,unchanged,No new language keywords introduced

~~~

## PHASE_7J_STATUS 4.csv

- Type: CSV
- SHA-256: `595d8c6e0e84b1992c40853b440df39cd4c64f47c7ff55f89a87bb3837518d2f`
- Extracted characters: 737

~~~text
item,status,notes
Stable diagnostic codes,implemented,10 stable codes defined
Source spans,implemented,1-based positions with validation
Human-readable hints,implemented,Common error categories mapped with safe fallback
Descriptive value typing,implemented,Numbers booleans strings lists functions unknown
Boolean versus numeric distinction,verified,Python bool is checked before number
List type descriptions,implemented,Homogeneous collections described; mixed and empty are unknown element type
Automated tests,passed,23 of 23 new tests pass
Prior runtime integration,pending,Phase 7H/7I files absent from active workspace; helper module remains independent
Canonical language vocabulary,unchanged,No new language keywords introduced

~~~

## PHASE_7J_STATUS.csv

- Type: CSV
- SHA-256: `595d8c6e0e84b1992c40853b440df39cd4c64f47c7ff55f89a87bb3837518d2f`
- Extracted characters: 737

~~~text
item,status,notes
Stable diagnostic codes,implemented,10 stable codes defined
Source spans,implemented,1-based positions with validation
Human-readable hints,implemented,Common error categories mapped with safe fallback
Descriptive value typing,implemented,Numbers booleans strings lists functions unknown
Boolean versus numeric distinction,verified,Python bool is checked before number
List type descriptions,implemented,Homogeneous collections described; mixed and empty are unknown element type
Automated tests,passed,23 of 23 new tests pass
Prior runtime integration,pending,Phase 7H/7I files absent from active workspace; helper module remains independent
Canonical language vocabulary,unchanged,No new language keywords introduced

~~~

## PHASE_7J_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `cee52a12e8ac162fc6e5d25fce8b83e7eb97ab6e41f3ffaac1467725a06df128`
- Extracted characters: 2244

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.001s

OK

~~~

## PHASE_7J_TEST_OUTPUT 3.txt

- Type: TXT
- SHA-256: `cee52a12e8ac162fc6e5d25fce8b83e7eb97ab6e41f3ffaac1467725a06df128`
- Extracted characters: 2244

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.001s

OK

~~~

## PHASE_7J_TEST_OUTPUT 4.txt

- Type: TXT
- SHA-256: `cee52a12e8ac162fc6e5d25fce8b83e7eb97ab6e41f3ffaac1467725a06df128`
- Extracted characters: 2244

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.001s

OK

~~~

## PHASE_7J_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `cee52a12e8ac162fc6e5d25fce8b83e7eb97ab6e41f3ffaac1467725a06df128`
- Extracted characters: 2244

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.001s

OK

~~~

## PHASE_7K_STATUS 2.csv

- Type: CSV
- SHA-256: `ab1f9daac0df6a88dbe97d775f0a65db901e2cbc9b293594bf2deb2aa0654443`
- Extracted characters: 715

~~~text
item,status,notes
Phase 7J diagnostic catalogue,complete,23 existing tests pass
Phase 7J descriptive value typing,complete,Numbers booleans strings lists functions unknown values
Phase 7K evaluator adapter,complete,Wraps evaluator callables in typed result or diagnostic
Existing diagnostic preservation,verified,Structured Arcane diagnostics pass through unchanged
Common exception mapping,verified,Unknown names and division by zero covered
Source position attachment,verified,Adapter tests cover line and column
Combined regression,passed,33 of 33 tests
Phase 7H/7I evaluator integration,blocked,Prior evaluator package absent from active workspace
Canonical grammar changes,none,No syntax or vocabulary changed

~~~

## PHASE_7K_STATUS 3.csv

- Type: CSV
- SHA-256: `ab1f9daac0df6a88dbe97d775f0a65db901e2cbc9b293594bf2deb2aa0654443`
- Extracted characters: 715

~~~text
item,status,notes
Phase 7J diagnostic catalogue,complete,23 existing tests pass
Phase 7J descriptive value typing,complete,Numbers booleans strings lists functions unknown values
Phase 7K evaluator adapter,complete,Wraps evaluator callables in typed result or diagnostic
Existing diagnostic preservation,verified,Structured Arcane diagnostics pass through unchanged
Common exception mapping,verified,Unknown names and division by zero covered
Source position attachment,verified,Adapter tests cover line and column
Combined regression,passed,33 of 33 tests
Phase 7H/7I evaluator integration,blocked,Prior evaluator package absent from active workspace
Canonical grammar changes,none,No syntax or vocabulary changed

~~~

## PHASE_7K_STATUS.csv

- Type: CSV
- SHA-256: `ab1f9daac0df6a88dbe97d775f0a65db901e2cbc9b293594bf2deb2aa0654443`
- Extracted characters: 715

~~~text
item,status,notes
Phase 7J diagnostic catalogue,complete,23 existing tests pass
Phase 7J descriptive value typing,complete,Numbers booleans strings lists functions unknown values
Phase 7K evaluator adapter,complete,Wraps evaluator callables in typed result or diagnostic
Existing diagnostic preservation,verified,Structured Arcane diagnostics pass through unchanged
Common exception mapping,verified,Unknown names and division by zero covered
Source position attachment,verified,Adapter tests cover line and column
Combined regression,passed,33 of 33 tests
Phase 7H/7I evaluator integration,blocked,Prior evaluator package absent from active workspace
Canonical grammar changes,none,No syntax or vocabulary changed

~~~

## PHASE_7K_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `6477c9f5ad934a8be304682c5bf25a4b0e0286c54e25ee872d75c948ba581969`
- Extracted characters: 3480

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok
test_bool_is_not_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_bool_is_not_number) ... ok
test_existing_diagnostic_is_preserved (test_arcane_runtime_adapter.RuntimeAdapterTests.test_existing_diagnostic_is_preserved) ... ok
test_list_typed (test_arcane_runtime_adapter.RuntimeAdapterTests.test_list_typed) ... ok
test_require_success_raises_structured_error (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_raises_structured_error) ... ok
test_require_success_returns_value (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_returns_value) ... ok
test_success_preserves_dimension_metadata (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_preserves_dimension_metadata) ... ok
test_success_wraps_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_wraps_number) ... ok
test_unexpected_exception_is_sanitised (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unexpected_exception_is_sanitised) ... ok
test_unknown_name_maps_with_source_location (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unknown_name_maps_with_source_location) ... ok
test_zero_division_maps (test_arcane_runtime_adapter.RuntimeAdapterTests.test_zero_division_maps) ... ok

----------------------------------------------------------------------
Ran 33 tests in 0.001s

OK

~~~

## PHASE_7K_TEST_OUTPUT 3.txt

- Type: TXT
- SHA-256: `6477c9f5ad934a8be304682c5bf25a4b0e0286c54e25ee872d75c948ba581969`
- Extracted characters: 3480

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok
test_bool_is_not_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_bool_is_not_number) ... ok
test_existing_diagnostic_is_preserved (test_arcane_runtime_adapter.RuntimeAdapterTests.test_existing_diagnostic_is_preserved) ... ok
test_list_typed (test_arcane_runtime_adapter.RuntimeAdapterTests.test_list_typed) ... ok
test_require_success_raises_structured_error (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_raises_structured_error) ... ok
test_require_success_returns_value (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_returns_value) ... ok
test_success_preserves_dimension_metadata (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_preserves_dimension_metadata) ... ok
test_success_wraps_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_wraps_number) ... ok
test_unexpected_exception_is_sanitised (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unexpected_exception_is_sanitised) ... ok
test_unknown_name_maps_with_source_location (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unknown_name_maps_with_source_location) ... ok
test_zero_division_maps (test_arcane_runtime_adapter.RuntimeAdapterTests.test_zero_division_maps) ... ok

----------------------------------------------------------------------
Ran 33 tests in 0.001s

OK

~~~

## PHASE_7K_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `6477c9f5ad934a8be304682c5bf25a4b0e0286c54e25ee872d75c948ba581969`
- Extracted characters: 3480

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok
test_bool_is_not_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_bool_is_not_number) ... ok
test_existing_diagnostic_is_preserved (test_arcane_runtime_adapter.RuntimeAdapterTests.test_existing_diagnostic_is_preserved) ... ok
test_list_typed (test_arcane_runtime_adapter.RuntimeAdapterTests.test_list_typed) ... ok
test_require_success_raises_structured_error (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_raises_structured_error) ... ok
test_require_success_returns_value (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_returns_value) ... ok
test_success_preserves_dimension_metadata (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_preserves_dimension_metadata) ... ok
test_success_wraps_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_wraps_number) ... ok
test_unexpected_exception_is_sanitised (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unexpected_exception_is_sanitised) ... ok
test_unknown_name_maps_with_source_location (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unknown_name_maps_with_source_location) ... ok
test_zero_division_maps (test_arcane_runtime_adapter.RuntimeAdapterTests.test_zero_division_maps) ... ok

----------------------------------------------------------------------
Ran 33 tests in 0.001s

OK

~~~

## PHASE_7L_STATUS 2.csv

- Type: CSV
- SHA-256: `b46cfb9cced28b83dc441e4ae2c049eb977ce6dfbce7a33d8b2d9d21c1f7a35c`
- Extracted characters: 706

~~~text
item,status,notes
Runnable expression evaluator,implemented,Small executable subset only
Stable diagnostic integration,implemented,Uses Phase 7J diagnostic catalogue
Interactive CLI,implemented,Minimal local shell
Arithmetic and dimensions,tested,Prefix arithmetic and unit exponent vectors
Bindings,tested,KWAM and KWAT are provisional forms
Phase 7H bounded repetition,not_integrated,Requires recovery of original evaluator
Phase 7I bounded aggregation,not_integrated,Requires recovery of original evaluator
Functions,not_integrated,Not part of this small subset
Canonical grammar confirmation,pending,Check authoritative decision ledger before treating forms as canonical
Combined tests,passed,54 tests

~~~

## PHASE_7L_STATUS.csv

- Type: CSV
- SHA-256: `b46cfb9cced28b83dc441e4ae2c049eb977ce6dfbce7a33d8b2d9d21c1f7a35c`
- Extracted characters: 706

~~~text
item,status,notes
Runnable expression evaluator,implemented,Small executable subset only
Stable diagnostic integration,implemented,Uses Phase 7J diagnostic catalogue
Interactive CLI,implemented,Minimal local shell
Arithmetic and dimensions,tested,Prefix arithmetic and unit exponent vectors
Bindings,tested,KWAM and KWAT are provisional forms
Phase 7H bounded repetition,not_integrated,Requires recovery of original evaluator
Phase 7I bounded aggregation,not_integrated,Requires recovery of original evaluator
Functions,not_integrated,Not part of this small subset
Canonical grammar confirmation,pending,Check authoritative decision ledger before treating forms as canonical
Combined tests,passed,54 tests

~~~

## PHASE_7L_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `17388bdc7d501b05614c507d5af8dcd8dc183ab0d7618bae350a921d73c12e6f`
- Extracted characters: 5132

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok
test_add (test_arcane_runtime.RuntimeTests.test_add) ... ok
test_comparison (test_arcane_runtime.RuntimeTests.test_comparison) ... ok
test_define_and_lookup (test_arcane_runtime.RuntimeTests.test_define_and_lookup) ... ok
test_dimensionless_one_truth (test_arcane_runtime.RuntimeTests.test_dimensionless_one_truth) ... ok
test_divide (test_arcane_runtime.RuntimeTests.test_divide) ... ok
test_divide_zero_diagnostic (test_arcane_runtime.RuntimeTests.test_divide_zero_diagnostic) ... ok
test_duplicate_binding (test_arcane_runtime.RuntimeTests.test_duplicate_binding) ... ok
test_equality (test_arcane_runtime.RuntimeTests.test_equality) ... ok
test_invalid_token (test_arcane_runtime.RuntimeTests.test_invalid_token) ... ok
test_logic (test_arcane_runtime.RuntimeTests.test_logic) ... ok
test_multiply (test_arcane_runtime.RuntimeTests.test_multiply) ... ok
test_not (test_arcane_runtime.RuntimeTests.test_not) ... ok
test_number (test_arcane_runtime.RuntimeTests.test_number) ... ok
test_parentheses (test_arcane_runtime.RuntimeTests.test_parentheses) ... ok
test_product_dimensions (test_arcane_runtime.RuntimeTests.test_product_dimensions) ... ok
test_subtract (test_arcane_runtime.RuntimeTests.test_subtract) ... ok
test_trailing_token (test_arcane_runtime.RuntimeTests.test_trailing_token) ... ok
test_units_add_same (test_arcane_runtime.RuntimeTests.test_units_add_same) ... ok
test_units_mismatch (test_arcane_runtime.RuntimeTests.test_units_mismatch) ... ok
test_unknown_name_diagnostic (test_arcane_runtime.RuntimeTests.test_unknown_name_diagnostic) ... ok
test_zero_is_not_true (test_arcane_runtime.RuntimeTests.test_zero_is_not_true) ... ok
test_bool_is_not_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_bool_is_not_number) ... ok
test_existing_diagnostic_is_preserved (test_arcane_runtime_adapter.RuntimeAdapterTests.test_existing_diagnostic_is_preserved) ... ok
test_list_typed (test_arcane_runtime_adapter.RuntimeAdapterTests.test_list_typed) ... ok
test_require_success_raises_structured_error (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_raises_structured_error) ... ok
test_require_success_returns_value (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_returns_value) ... ok
test_success_preserves_dimension_metadata (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_preserves_dimension_metadata) ... ok
test_success_wraps_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_wraps_number) ... ok
test_unexpected_exception_is_sanitised (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unexpected_exception_is_sanitised) ... ok
test_unknown_name_maps_with_source_location (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unknown_name_maps_with_source_location) ... ok
test_zero_division_maps (test_arcane_runtime_adapter.RuntimeAdapterTests.test_zero_division_maps) ... ok

----------------------------------------------------------------------
Ran 54 tests in 0.001s

OK

~~~

## PHASE_7L_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `17388bdc7d501b05614c507d5af8dcd8dc183ab0d7618bae350a921d73c12e6f`
- Extracted characters: 5132

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok
test_add (test_arcane_runtime.RuntimeTests.test_add) ... ok
test_comparison (test_arcane_runtime.RuntimeTests.test_comparison) ... ok
test_define_and_lookup (test_arcane_runtime.RuntimeTests.test_define_and_lookup) ... ok
test_dimensionless_one_truth (test_arcane_runtime.RuntimeTests.test_dimensionless_one_truth) ... ok
test_divide (test_arcane_runtime.RuntimeTests.test_divide) ... ok
test_divide_zero_diagnostic (test_arcane_runtime.RuntimeTests.test_divide_zero_diagnostic) ... ok
test_duplicate_binding (test_arcane_runtime.RuntimeTests.test_duplicate_binding) ... ok
test_equality (test_arcane_runtime.RuntimeTests.test_equality) ... ok
test_invalid_token (test_arcane_runtime.RuntimeTests.test_invalid_token) ... ok
test_logic (test_arcane_runtime.RuntimeTests.test_logic) ... ok
test_multiply (test_arcane_runtime.RuntimeTests.test_multiply) ... ok
test_not (test_arcane_runtime.RuntimeTests.test_not) ... ok
test_number (test_arcane_runtime.RuntimeTests.test_number) ... ok
test_parentheses (test_arcane_runtime.RuntimeTests.test_parentheses) ... ok
test_product_dimensions (test_arcane_runtime.RuntimeTests.test_product_dimensions) ... ok
test_subtract (test_arcane_runtime.RuntimeTests.test_subtract) ... ok
test_trailing_token (test_arcane_runtime.RuntimeTests.test_trailing_token) ... ok
test_units_add_same (test_arcane_runtime.RuntimeTests.test_units_add_same) ... ok
test_units_mismatch (test_arcane_runtime.RuntimeTests.test_units_mismatch) ... ok
test_unknown_name_diagnostic (test_arcane_runtime.RuntimeTests.test_unknown_name_diagnostic) ... ok
test_zero_is_not_true (test_arcane_runtime.RuntimeTests.test_zero_is_not_true) ... ok
test_bool_is_not_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_bool_is_not_number) ... ok
test_existing_diagnostic_is_preserved (test_arcane_runtime_adapter.RuntimeAdapterTests.test_existing_diagnostic_is_preserved) ... ok
test_list_typed (test_arcane_runtime_adapter.RuntimeAdapterTests.test_list_typed) ... ok
test_require_success_raises_structured_error (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_raises_structured_error) ... ok
test_require_success_returns_value (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_returns_value) ... ok
test_success_preserves_dimension_metadata (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_preserves_dimension_metadata) ... ok
test_success_wraps_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_wraps_number) ... ok
test_unexpected_exception_is_sanitised (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unexpected_exception_is_sanitised) ... ok
test_unknown_name_maps_with_source_location (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unknown_name_maps_with_source_location) ... ok
test_zero_division_maps (test_arcane_runtime_adapter.RuntimeAdapterTests.test_zero_division_maps) ... ok

----------------------------------------------------------------------
Ran 54 tests in 0.001s

OK

~~~

## PHASE_7M_STATUS.csv

- Type: CSV
- SHA-256: `3345346e1bbf08b93c36e56cab93827af07cbefee81cffab30fa5f8adacb2fad`
- Extracted characters: 661

~~~text
item,status,evidence
Runnable expression evaluator,implemented,arcane_runtime.py
Stable diagnostics,integrated,arcane_diagnostics.py and runtime tests
Runtime adapter,integrated,arcane_runtime_adapter.py and adapter tests
Bounded repetition,implemented in subset,Phase 7M tests
Bounded aggregation,implemented in subset,Phase 7M tests
Short-circuit FRAND/FROR,implemented in subset,Phase 7M tests
Function definitions and calls,not yet implemented,explicit scope limitation
Canonical grammar verification,pending,authoritative language audit required
Full language release,not complete,subset scope documented
Automated tests,65 passed,PHASE_7M_TEST_OUTPUT.txt

~~~

## PHASE_7M_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `1c42561fc39ac415c95f062113b66025a5dd0960b97781bee5454c97214f2987`
- Extracted characters: 6323

~~~text
test_bounds_mapping (test_arcane_diagnostics.DiagnosticTests.test_bounds_mapping) ... ok
test_dimension_mapping (test_arcane_diagnostics.DiagnosticTests.test_dimension_mapping) ... ok
test_division_mapping (test_arcane_diagnostics.DiagnosticTests.test_division_mapping) ... ok
test_duplicate_mapping (test_arcane_diagnostics.DiagnosticTests.test_duplicate_mapping) ... ok
test_end_line_cannot_precede_start (test_arcane_diagnostics.DiagnosticTests.test_end_line_cannot_precede_start) ... ok
test_exception_wrap (test_arcane_diagnostics.DiagnosticTests.test_exception_wrap) ... ok
test_iteration_mapping (test_arcane_diagnostics.DiagnosticTests.test_iteration_mapping) ... ok
test_parse_mapping (test_arcane_diagnostics.DiagnosticTests.test_parse_mapping) ... ok
test_source_positions_are_one_based (test_arcane_diagnostics.DiagnosticTests.test_source_positions_are_one_based) ... ok
test_stable_render (test_arcane_diagnostics.DiagnosticTests.test_stable_render) ... ok
test_type_mapping (test_arcane_diagnostics.DiagnosticTests.test_type_mapping) ... ok
test_unknown_mapping_is_safe (test_arcane_diagnostics.DiagnosticTests.test_unknown_mapping_is_safe) ... ok
test_unknown_name_mapping (test_arcane_diagnostics.DiagnosticTests.test_unknown_name_mapping) ... ok
test_bool_is_not_number (test_arcane_diagnostics.ValueTypingTests.test_bool_is_not_number) ... ok
test_dimension_descriptor (test_arcane_diagnostics.ValueTypingTests.test_dimension_descriptor) ... ok
test_empty_list (test_arcane_diagnostics.ValueTypingTests.test_empty_list) ... ok
test_function (test_arcane_diagnostics.ValueTypingTests.test_function) ... ok
test_heterogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_heterogeneous_list) ... ok
test_homogeneous_list (test_arcane_diagnostics.ValueTypingTests.test_homogeneous_list) ... ok
test_int_number (test_arcane_diagnostics.ValueTypingTests.test_int_number) ... ok
test_string (test_arcane_diagnostics.ValueTypingTests.test_string) ... ok
test_typed_value (test_arcane_diagnostics.ValueTypingTests.test_typed_value) ... ok
test_unknown_object (test_arcane_diagnostics.ValueTypingTests.test_unknown_object) ... ok
test_aggregation_empty_range (test_arcane_runtime.Phase7MIntegrationTests.test_aggregation_empty_range) ... ok
test_aggregation_iteration_limit (test_arcane_runtime.Phase7MIntegrationTests.test_aggregation_iteration_limit) ... ok
test_aggregation_preserves_dimensions (test_arcane_runtime.Phase7MIntegrationTests.test_aggregation_preserves_dimensions) ... ok
test_aggregation_squares (test_arcane_runtime.Phase7MIntegrationTests.test_aggregation_squares) ... ok
test_and_short_circuits (test_arcane_runtime.Phase7MIntegrationTests.test_and_short_circuits) ... ok
test_bounded_aggregation (test_arcane_runtime.Phase7MIntegrationTests.test_bounded_aggregation) ... ok
test_bounded_repetition (test_arcane_runtime.Phase7MIntegrationTests.test_bounded_repetition) ... ok
test_invalid_bound (test_arcane_runtime.Phase7MIntegrationTests.test_invalid_bound) ... ok
test_or_short_circuits (test_arcane_runtime.Phase7MIntegrationTests.test_or_short_circuits) ... ok
test_repetition_empty_range (test_arcane_runtime.Phase7MIntegrationTests.test_repetition_empty_range) ... ok
test_repetition_scope_does_not_leak (test_arcane_runtime.Phase7MIntegrationTests.test_repetition_scope_does_not_leak) ... ok
test_add (test_arcane_runtime.RuntimeTests.test_add) ... ok
test_comparison (test_arcane_runtime.RuntimeTests.test_comparison) ... ok
test_define_and_lookup (test_arcane_runtime.RuntimeTests.test_define_and_lookup) ... ok
test_dimensionless_one_truth (test_arcane_runtime.RuntimeTests.test_dimensionless_one_truth) ... ok
test_divide (test_arcane_runtime.RuntimeTests.test_divide) ... ok
test_divide_zero_diagnostic (test_arcane_runtime.RuntimeTests.test_divide_zero_diagnostic) ... ok
test_duplicate_binding (test_arcane_runtime.RuntimeTests.test_duplicate_binding) ... ok
test_equality (test_arcane_runtime.RuntimeTests.test_equality) ... ok
test_invalid_token (test_arcane_runtime.RuntimeTests.test_invalid_token) ... ok
test_logic (test_arcane_runtime.RuntimeTests.test_logic) ... ok
test_multiply (test_arcane_runtime.RuntimeTests.test_multiply) ... ok
test_not (test_arcane_runtime.RuntimeTests.test_not) ... ok
test_number (test_arcane_runtime.RuntimeTests.test_number) ... ok
test_parentheses (test_arcane_runtime.RuntimeTests.test_parentheses) ... ok
test_product_dimensions (test_arcane_runtime.RuntimeTests.test_product_dimensions) ... ok
test_subtract (test_arcane_runtime.RuntimeTests.test_subtract) ... ok
test_trailing_token (test_arcane_runtime.RuntimeTests.test_trailing_token) ... ok
test_units_add_same (test_arcane_runtime.RuntimeTests.test_units_add_same) ... ok
test_units_mismatch (test_arcane_runtime.RuntimeTests.test_units_mismatch) ... ok
test_unknown_name_diagnostic (test_arcane_runtime.RuntimeTests.test_unknown_name_diagnostic) ... ok
test_zero_is_not_true (test_arcane_runtime.RuntimeTests.test_zero_is_not_true) ... ok
test_bool_is_not_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_bool_is_not_number) ... ok
test_existing_diagnostic_is_preserved (test_arcane_runtime_adapter.RuntimeAdapterTests.test_existing_diagnostic_is_preserved) ... ok
test_list_typed (test_arcane_runtime_adapter.RuntimeAdapterTests.test_list_typed) ... ok
test_require_success_raises_structured_error (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_raises_structured_error) ... ok
test_require_success_returns_value (test_arcane_runtime_adapter.RuntimeAdapterTests.test_require_success_returns_value) ... ok
test_success_preserves_dimension_metadata (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_preserves_dimension_metadata) ... ok
test_success_wraps_number (test_arcane_runtime_adapter.RuntimeAdapterTests.test_success_wraps_number) ... ok
test_unexpected_exception_is_sanitised (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unexpected_exception_is_sanitised) ... ok
test_unknown_name_maps_with_source_location (test_arcane_runtime_adapter.RuntimeAdapterTests.test_unknown_name_maps_with_source_location) ... ok
test_zero_division_maps (test_arcane_runtime_adapter.RuntimeAdapterTests.test_zero_division_maps) ... ok

----------------------------------------------------------------------
Ran 65 tests in 0.002s

OK

~~~

## PHASE_7N_STATUS 2.csv

- Type: CSV
- SHA-256: `de79f74c641c45f9d8d1ae5eca97c0fa06475cfb955cbd3ecd6410c055e60a22`
- Extracted characters: 617

~~~text
item,status,evidence
User-defined functions,implemented,KWAF function declaration and name(args) calls
Multiple parameters,implemented,Unit tests
Nested function calls,implemented,Unit tests
Local parameter scope,implemented,Unit tests
Arity validation,implemented,Unit tests
Recursive call-depth guard,implemented,Unit tests
Functions in repetition and aggregation,implemented,Unit tests
Diagnostic handling,implemented,Unit tests
Canonical syntax confirmation,pending,Provisional syntax requires decision-ledger review
Full language implementation,not complete,Explicit subset scope
Automated tests,passed,21 tests

~~~

## PHASE_7N_STATUS 3.csv

- Type: CSV
- SHA-256: `de79f74c641c45f9d8d1ae5eca97c0fa06475cfb955cbd3ecd6410c055e60a22`
- Extracted characters: 617

~~~text
item,status,evidence
User-defined functions,implemented,KWAF function declaration and name(args) calls
Multiple parameters,implemented,Unit tests
Nested function calls,implemented,Unit tests
Local parameter scope,implemented,Unit tests
Arity validation,implemented,Unit tests
Recursive call-depth guard,implemented,Unit tests
Functions in repetition and aggregation,implemented,Unit tests
Diagnostic handling,implemented,Unit tests
Canonical syntax confirmation,pending,Provisional syntax requires decision-ledger review
Full language implementation,not complete,Explicit subset scope
Automated tests,passed,21 tests

~~~

## PHASE_7N_STATUS 4.csv

- Type: CSV
- SHA-256: `de79f74c641c45f9d8d1ae5eca97c0fa06475cfb955cbd3ecd6410c055e60a22`
- Extracted characters: 617

~~~text
item,status,evidence
User-defined functions,implemented,KWAF function declaration and name(args) calls
Multiple parameters,implemented,Unit tests
Nested function calls,implemented,Unit tests
Local parameter scope,implemented,Unit tests
Arity validation,implemented,Unit tests
Recursive call-depth guard,implemented,Unit tests
Functions in repetition and aggregation,implemented,Unit tests
Diagnostic handling,implemented,Unit tests
Canonical syntax confirmation,pending,Provisional syntax requires decision-ledger review
Full language implementation,not complete,Explicit subset scope
Automated tests,passed,21 tests

~~~

## PHASE_7N_STATUS.csv

- Type: CSV
- SHA-256: `de79f74c641c45f9d8d1ae5eca97c0fa06475cfb955cbd3ecd6410c055e60a22`
- Extracted characters: 617

~~~text
item,status,evidence
User-defined functions,implemented,KWAF function declaration and name(args) calls
Multiple parameters,implemented,Unit tests
Nested function calls,implemented,Unit tests
Local parameter scope,implemented,Unit tests
Arity validation,implemented,Unit tests
Recursive call-depth guard,implemented,Unit tests
Functions in repetition and aggregation,implemented,Unit tests
Diagnostic handling,implemented,Unit tests
Canonical syntax confirmation,pending,Provisional syntax requires decision-ledger review
Full language implementation,not complete,Explicit subset scope
Automated tests,passed,21 tests

~~~

## PHASE_7N_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `ec92ec8109d0538b4af1ac65591305d9066113a10d424a9ccb7fe8f8c55ddaa8`
- Extracted characters: 2073

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.002s

OK

~~~

## PHASE_7N_TEST_OUTPUT 3.txt

- Type: TXT
- SHA-256: `ec92ec8109d0538b4af1ac65591305d9066113a10d424a9ccb7fe8f8c55ddaa8`
- Extracted characters: 2073

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.002s

OK

~~~

## PHASE_7N_TEST_OUTPUT 4.txt

- Type: TXT
- SHA-256: `ec92ec8109d0538b4af1ac65591305d9066113a10d424a9ccb7fe8f8c55ddaa8`
- Extracted characters: 2073

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.002s

OK

~~~

## PHASE_7N_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `ec92ec8109d0538b4af1ac65591305d9066113a10d424a9ccb7fe8f8c55ddaa8`
- Extracted characters: 2073

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.002s

OK

~~~

## PHASE_7O_STATUS 2.csv

- Type: CSV
- SHA-256: `7c995edc1c7f3ff5ec86600a30e3f97f7bab5dc5a1b96b51431969d2019b274e`
- Extracted characters: 477

~~~text
item,status,notes
conditional selection,implemented,Provisional KWAI condition THEN expression ELSE expression syntax
multi-line execution,implemented,Sequential statements and full-line comments
error line reporting,implemented,Stops at first diagnostic and reports source line
regression suite,passed,28 tests passed
canonical grammar,open,Provisional syntax requires ledger reconciliation
full language completeness,not complete,This is a runnable subset and reconstruction

~~~

## PHASE_7O_STATUS 3.csv

- Type: CSV
- SHA-256: `7c995edc1c7f3ff5ec86600a30e3f97f7bab5dc5a1b96b51431969d2019b274e`
- Extracted characters: 477

~~~text
item,status,notes
conditional selection,implemented,Provisional KWAI condition THEN expression ELSE expression syntax
multi-line execution,implemented,Sequential statements and full-line comments
error line reporting,implemented,Stops at first diagnostic and reports source line
regression suite,passed,28 tests passed
canonical grammar,open,Provisional syntax requires ledger reconciliation
full language completeness,not complete,This is a runnable subset and reconstruction

~~~

## PHASE_7O_STATUS.csv

- Type: CSV
- SHA-256: `7c995edc1c7f3ff5ec86600a30e3f97f7bab5dc5a1b96b51431969d2019b274e`
- Extracted characters: 477

~~~text
item,status,notes
conditional selection,implemented,Provisional KWAI condition THEN expression ELSE expression syntax
multi-line execution,implemented,Sequential statements and full-line comments
error line reporting,implemented,Stops at first diagnostic and reports source line
regression suite,passed,28 tests passed
canonical grammar,open,Provisional syntax requires ledger reconciliation
full language completeness,not complete,This is a runnable subset and reconstruction

~~~

## PHASE_7O_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `65a0ff34a94bc619a7b50ec1dcd2774d2f1ca7169233cff0cf24a1206f7c2a1f`
- Extracted characters: 2565

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_conditional_false (test_arcane_runtime.Phase7NTests.test_conditional_false) ... ok
test_conditional_requires_branches (test_arcane_runtime.Phase7NTests.test_conditional_requires_branches) ... ok
test_conditional_true (test_arcane_runtime.Phase7NTests.test_conditional_true) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_multiline_program (test_arcane_runtime.Phase7NTests.test_multiline_program) ... ok
test_program_stops_on_error_with_line (test_arcane_runtime.Phase7NTests.test_program_stops_on_error_with_line) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 28 tests in 0.002s

OK

~~~

## PHASE_7O_TEST_OUTPUT 3.txt

- Type: TXT
- SHA-256: `65a0ff34a94bc619a7b50ec1dcd2774d2f1ca7169233cff0cf24a1206f7c2a1f`
- Extracted characters: 2565

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_conditional_false (test_arcane_runtime.Phase7NTests.test_conditional_false) ... ok
test_conditional_requires_branches (test_arcane_runtime.Phase7NTests.test_conditional_requires_branches) ... ok
test_conditional_true (test_arcane_runtime.Phase7NTests.test_conditional_true) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_multiline_program (test_arcane_runtime.Phase7NTests.test_multiline_program) ... ok
test_program_stops_on_error_with_line (test_arcane_runtime.Phase7NTests.test_program_stops_on_error_with_line) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 28 tests in 0.002s

OK

~~~

## PHASE_7O_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `65a0ff34a94bc619a7b50ec1dcd2774d2f1ca7169233cff0cf24a1206f7c2a1f`
- Extracted characters: 2565

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_conditional_false (test_arcane_runtime.Phase7NTests.test_conditional_false) ... ok
test_conditional_requires_branches (test_arcane_runtime.Phase7NTests.test_conditional_requires_branches) ... ok
test_conditional_true (test_arcane_runtime.Phase7NTests.test_conditional_true) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_multiline_program (test_arcane_runtime.Phase7NTests.test_multiline_program) ... ok
test_program_stops_on_error_with_line (test_arcane_runtime.Phase7NTests.test_program_stops_on_error_with_line) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 28 tests in 0.002s

OK

~~~

## PHASE_7P_STATUS 2.csv

- Type: CSV
- SHA-256: `6ed4e56f7989b7c779d898c1d20fd1ad7f80e22f478f10d86876f6e9bf24005f`
- Extracted characters: 781

~~~text
feature,status,notes
structured conditional blocks,implemented,KWAI condition THEN ... ELSE ... END; provisional syntax
nested conditional blocks,implemented,recursive block parser and execution
branch-local binding scope,implemented,bindings do not leak outside selected branch
multiple branch statements,implemented,statement results returned in execution order
malformed block diagnostics,implemented,missing END and unexpected delimiters detected
source-line diagnostics,implemented,errors in executed branch identify original line
full canonical grammar,not complete,syntax requires reconciliation with canonical decisions
lexically scoped functions,not implemented,function declarations remain runtime-level
full compiler and standard library,not complete,outside this phase

~~~

## PHASE_7P_STATUS.csv

- Type: CSV
- SHA-256: `6ed4e56f7989b7c779d898c1d20fd1ad7f80e22f478f10d86876f6e9bf24005f`
- Extracted characters: 781

~~~text
feature,status,notes
structured conditional blocks,implemented,KWAI condition THEN ... ELSE ... END; provisional syntax
nested conditional blocks,implemented,recursive block parser and execution
branch-local binding scope,implemented,bindings do not leak outside selected branch
multiple branch statements,implemented,statement results returned in execution order
malformed block diagnostics,implemented,missing END and unexpected delimiters detected
source-line diagnostics,implemented,errors in executed branch identify original line
full canonical grammar,not complete,syntax requires reconciliation with canonical decisions
lexically scoped functions,not implemented,function declarations remain runtime-level
full compiler and standard library,not complete,outside this phase

~~~

## PHASE_7P_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `dd42d166ee275842d5527c30084555c111def8bb94b2fec65a5b2b577c9b4317`
- Extracted characters: 3373

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_block_binding_does_not_leak (test_arcane_runtime.Phase7NTests.test_block_binding_does_not_leak) ... ok
test_conditional_false (test_arcane_runtime.Phase7NTests.test_conditional_false) ... ok
test_conditional_requires_branches (test_arcane_runtime.Phase7NTests.test_conditional_requires_branches) ... ok
test_conditional_true (test_arcane_runtime.Phase7NTests.test_conditional_true) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_error_inside_branch_has_source_line (test_arcane_runtime.Phase7NTests.test_error_inside_branch_has_source_line) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_missing_end_is_diagnostic (test_arcane_runtime.Phase7NTests.test_missing_end_is_diagnostic) ... ok
test_multiline_program (test_arcane_runtime.Phase7NTests.test_multiline_program) ... ok
test_nested_conditional_blocks (test_arcane_runtime.Phase7NTests.test_nested_conditional_blocks) ... ok
test_program_stops_on_error_with_line (test_arcane_runtime.Phase7NTests.test_program_stops_on_error_with_line) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_structured_conditional_false_multistep (test_arcane_runtime.Phase7NTests.test_structured_conditional_false_multistep) ... ok
test_structured_conditional_true_multistep (test_arcane_runtime.Phase7NTests.test_structured_conditional_true_multistep) ... ok
test_unexpected_end_is_diagnostic (test_arcane_runtime.Phase7NTests.test_unexpected_end_is_diagnostic) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 35 tests in 0.002s

OK

~~~

## PHASE_7P_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `dd42d166ee275842d5527c30084555c111def8bb94b2fec65a5b2b577c9b4317`
- Extracted characters: 3373

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_block_binding_does_not_leak (test_arcane_runtime.Phase7NTests.test_block_binding_does_not_leak) ... ok
test_conditional_false (test_arcane_runtime.Phase7NTests.test_conditional_false) ... ok
test_conditional_requires_branches (test_arcane_runtime.Phase7NTests.test_conditional_requires_branches) ... ok
test_conditional_true (test_arcane_runtime.Phase7NTests.test_conditional_true) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_error_inside_branch_has_source_line (test_arcane_runtime.Phase7NTests.test_error_inside_branch_has_source_line) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_missing_end_is_diagnostic (test_arcane_runtime.Phase7NTests.test_missing_end_is_diagnostic) ... ok
test_multiline_program (test_arcane_runtime.Phase7NTests.test_multiline_program) ... ok
test_nested_conditional_blocks (test_arcane_runtime.Phase7NTests.test_nested_conditional_blocks) ... ok
test_program_stops_on_error_with_line (test_arcane_runtime.Phase7NTests.test_program_stops_on_error_with_line) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_structured_conditional_false_multistep (test_arcane_runtime.Phase7NTests.test_structured_conditional_false_multistep) ... ok
test_structured_conditional_true_multistep (test_arcane_runtime.Phase7NTests.test_structured_conditional_true_multistep) ... ok
test_unexpected_end_is_diagnostic (test_arcane_runtime.Phase7NTests.test_unexpected_end_is_diagnostic) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 35 tests in 0.002s

OK

~~~

## PHASE_7Q_STATUS.csv

- Type: CSV
- SHA-256: `7f22f61e6020743a26416442e877d0c5924bfdb50950f98a8bb23f72ba6c9aee`
- Extracted characters: 939

~~~text
area,status,details
runtime parser,implemented,One recursive parser and separate execution pass for statement and conditional nodes
parse-before-execute,implemented,Malformed block syntax is detected before program statements execute
nested conditionals,tested,Nested blocks execute only selected branch
branch scope,tested,Bindings created in branches do not leak outside branch scopes
source diagnostics,tested,Original line numbers retained through blank lines and comments
file execution,implemented,CLI accepts a source-file path
interactive CLI,retained,Interactive line mode remains available
regression suite,passed,40 automated tests passed
canonical grammar,provisional,Spellings and grammar require reconciliation with canonical language decisions
function lexical scope,open,Function declarations are not yet scoped to conditional blocks
full grammar,open,Parser is a line-oriented subset rather than a complete formal grammar

~~~

## PHASE_7Q_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `af86c60f41bda0d58e04e4effa174dbf2b246abbf22d72881db75dc78ba2099f`
- Extracted characters: 4013

~~~text
test_aggregation (test_arcane_runtime.Phase7NTests.test_aggregation) ... ok
test_binding (test_arcane_runtime.Phase7NTests.test_binding) ... ok
test_block_binding_does_not_leak (test_arcane_runtime.Phase7NTests.test_block_binding_does_not_leak) ... ok
test_conditional_false (test_arcane_runtime.Phase7NTests.test_conditional_false) ... ok
test_conditional_requires_branches (test_arcane_runtime.Phase7NTests.test_conditional_requires_branches) ... ok
test_conditional_true (test_arcane_runtime.Phase7NTests.test_conditional_true) ... ok
test_div_zero (test_arcane_runtime.Phase7NTests.test_div_zero) ... ok
test_duplicate_function_name (test_arcane_runtime.Phase7NTests.test_duplicate_function_name) ... ok
test_duplicate_function_parameter (test_arcane_runtime.Phase7NTests.test_duplicate_function_parameter) ... ok
test_else_branch_not_executed (test_arcane_runtime.Phase7NTests.test_else_branch_not_executed) ... ok
test_error_inside_branch_has_source_line (test_arcane_runtime.Phase7NTests.test_error_inside_branch_has_source_line) ... ok
test_file_program_preserves_comments_and_line_numbers (test_arcane_runtime.Phase7NTests.test_file_program_preserves_comments_and_line_numbers) ... ok
test_function_call (test_arcane_runtime.Phase7NTests.test_function_call) ... ok
test_function_define (test_arcane_runtime.Phase7NTests.test_function_define) ... ok
test_function_inside_aggregation (test_arcane_runtime.Phase7NTests.test_function_inside_aggregation) ... ok
test_function_inside_repetition (test_arcane_runtime.Phase7NTests.test_function_inside_repetition) ... ok
test_function_multiple_args (test_arcane_runtime.Phase7NTests.test_function_multiple_args) ... ok
test_function_nested (test_arcane_runtime.Phase7NTests.test_function_nested) ... ok
test_function_scope (test_arcane_runtime.Phase7NTests.test_function_scope) ... ok
test_function_with_unit (test_arcane_runtime.Phase7NTests.test_function_with_unit) ... ok
test_iteration_limit (test_arcane_runtime.Phase7NTests.test_iteration_limit) ... ok
test_missing_end_is_diagnostic (test_arcane_runtime.Phase7NTests.test_missing_end_is_diagnostic) ... ok
test_multiline_program (test_arcane_runtime.Phase7NTests.test_multiline_program) ... ok
test_nested_block_local_bindings_do_not_escape (test_arcane_runtime.Phase7NTests.test_nested_block_local_bindings_do_not_escape) ... ok
test_nested_conditional_blocks (test_arcane_runtime.Phase7NTests.test_nested_conditional_blocks) ... ok
test_parse_error_does_not_partially_execute (test_arcane_runtime.Phase7NTests.test_parse_error_does_not_partially_execute) ... ok
test_program_can_call_declared_function (test_arcane_runtime.Phase7NTests.test_program_can_call_declared_function) ... ok
test_program_stops_on_error_with_line (test_arcane_runtime.Phase7NTests.test_program_stops_on_error_with_line) ... ok
test_recursion_limit (test_arcane_runtime.Phase7NTests.test_recursion_limit) ... ok
test_repetition (test_arcane_runtime.Phase7NTests.test_repetition) ... ok
test_short_circuit_and (test_arcane_runtime.Phase7NTests.test_short_circuit_and) ... ok
test_short_circuit_or (test_arcane_runtime.Phase7NTests.test_short_circuit_or) ... ok
test_show (test_arcane_runtime.Phase7NTests.test_show) ... ok
test_structured_conditional_false_multistep (test_arcane_runtime.Phase7NTests.test_structured_conditional_false_multistep) ... ok
test_structured_conditional_true_multistep (test_arcane_runtime.Phase7NTests.test_structured_conditional_true_multistep) ... ok
test_unexpected_end_is_diagnostic (test_arcane_runtime.Phase7NTests.test_unexpected_end_is_diagnostic) ... ok
test_units_mismatch (test_arcane_runtime.Phase7NTests.test_units_mismatch) ... ok
test_unknown_name (test_arcane_runtime.Phase7NTests.test_unknown_name) ... ok
test_unknown_parameter_in_body (test_arcane_runtime.Phase7NTests.test_unknown_parameter_in_body) ... ok
test_wrong_arity (test_arcane_runtime.Phase7NTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 40 tests in 0.002s

OK

~~~

## PHASE_7R_STATUS 2.csv

- Type: CSV
- SHA-256: `67680525519da93ba1e78fc201c0f3868de24823de5f95d9813b009fffddc6f7`
- Extracted characters: 708

~~~text
feature,status,notes
static syntax-check command,implemented,python arcane_cli.py path/to/file.arc
conditional delimiter validation,implemented,Missing END unexpected END ELSE without header duplicate ELSE
source line diagnostics,implemented,Original line numbers retained
CLI exit codes,implemented,0 on syntax pass 1 on diagnostics
statement-shape checks,implemented,Approximate patterns for provisional subset
automated tests,passed,10 tests
runtime execution,not included,Phase 7Q runtime archive unavailable in active workspace
canonical grammar,provisional,Checker does not canonise keyword forms or replace authoritative grammar
full expression/type checking,not implemented,Static shape checker only

~~~

## PHASE_7R_STATUS 3.csv

- Type: CSV
- SHA-256: `67680525519da93ba1e78fc201c0f3868de24823de5f95d9813b009fffddc6f7`
- Extracted characters: 708

~~~text
feature,status,notes
static syntax-check command,implemented,python arcane_cli.py path/to/file.arc
conditional delimiter validation,implemented,Missing END unexpected END ELSE without header duplicate ELSE
source line diagnostics,implemented,Original line numbers retained
CLI exit codes,implemented,0 on syntax pass 1 on diagnostics
statement-shape checks,implemented,Approximate patterns for provisional subset
automated tests,passed,10 tests
runtime execution,not included,Phase 7Q runtime archive unavailable in active workspace
canonical grammar,provisional,Checker does not canonise keyword forms or replace authoritative grammar
full expression/type checking,not implemented,Static shape checker only

~~~

## PHASE_7R_STATUS.csv

- Type: CSV
- SHA-256: `67680525519da93ba1e78fc201c0f3868de24823de5f95d9813b009fffddc6f7`
- Extracted characters: 708

~~~text
feature,status,notes
static syntax-check command,implemented,python arcane_cli.py path/to/file.arc
conditional delimiter validation,implemented,Missing END unexpected END ELSE without header duplicate ELSE
source line diagnostics,implemented,Original line numbers retained
CLI exit codes,implemented,0 on syntax pass 1 on diagnostics
statement-shape checks,implemented,Approximate patterns for provisional subset
automated tests,passed,10 tests
runtime execution,not included,Phase 7Q runtime archive unavailable in active workspace
canonical grammar,provisional,Checker does not canonise keyword forms or replace authoritative grammar
full expression/type checking,not implemented,Static shape checker only

~~~

## PHASE_7R_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `9e6ecebdfc17a41d0e0de69ae324cc31c7a81f2e7963d86d1a924fe213a789c9`
- Extracted characters: 1035

~~~text
test_comment_and_blank_lines (test_arcane_check.SyntaxCheckerTests.test_comment_and_blank_lines) ... ok
test_duplicate_else (test_arcane_check.SyntaxCheckerTests.test_duplicate_else) ... ok
test_else_without_header (test_arcane_check.SyntaxCheckerTests.test_else_without_header) ... ok
test_function_declaration_shape (test_arcane_check.SyntaxCheckerTests.test_function_declaration_shape) ... ok
test_line_number_preserved (test_arcane_check.SyntaxCheckerTests.test_line_number_preserved) ... ok
test_malformed_header (test_arcane_check.SyntaxCheckerTests.test_malformed_header) ... ok
test_missing_end (test_arcane_check.SyntaxCheckerTests.test_missing_end) ... ok
test_unexpected_end (test_arcane_check.SyntaxCheckerTests.test_unexpected_end) ... ok
test_unknown_keyword (test_arcane_check.SyntaxCheckerTests.test_unknown_keyword) ... ok
test_valid_nested_blocks (test_arcane_check.SyntaxCheckerTests.test_valid_nested_blocks) ... ok

----------------------------------------------------------------------
Ran 10 tests in 0.000s

OK

~~~

## PHASE_7R_TEST_OUTPUT 3.txt

- Type: TXT
- SHA-256: `9e6ecebdfc17a41d0e0de69ae324cc31c7a81f2e7963d86d1a924fe213a789c9`
- Extracted characters: 1035

~~~text
test_comment_and_blank_lines (test_arcane_check.SyntaxCheckerTests.test_comment_and_blank_lines) ... ok
test_duplicate_else (test_arcane_check.SyntaxCheckerTests.test_duplicate_else) ... ok
test_else_without_header (test_arcane_check.SyntaxCheckerTests.test_else_without_header) ... ok
test_function_declaration_shape (test_arcane_check.SyntaxCheckerTests.test_function_declaration_shape) ... ok
test_line_number_preserved (test_arcane_check.SyntaxCheckerTests.test_line_number_preserved) ... ok
test_malformed_header (test_arcane_check.SyntaxCheckerTests.test_malformed_header) ... ok
test_missing_end (test_arcane_check.SyntaxCheckerTests.test_missing_end) ... ok
test_unexpected_end (test_arcane_check.SyntaxCheckerTests.test_unexpected_end) ... ok
test_unknown_keyword (test_arcane_check.SyntaxCheckerTests.test_unknown_keyword) ... ok
test_valid_nested_blocks (test_arcane_check.SyntaxCheckerTests.test_valid_nested_blocks) ... ok

----------------------------------------------------------------------
Ran 10 tests in 0.000s

OK

~~~

## PHASE_7R_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `9e6ecebdfc17a41d0e0de69ae324cc31c7a81f2e7963d86d1a924fe213a789c9`
- Extracted characters: 1035

~~~text
test_comment_and_blank_lines (test_arcane_check.SyntaxCheckerTests.test_comment_and_blank_lines) ... ok
test_duplicate_else (test_arcane_check.SyntaxCheckerTests.test_duplicate_else) ... ok
test_else_without_header (test_arcane_check.SyntaxCheckerTests.test_else_without_header) ... ok
test_function_declaration_shape (test_arcane_check.SyntaxCheckerTests.test_function_declaration_shape) ... ok
test_line_number_preserved (test_arcane_check.SyntaxCheckerTests.test_line_number_preserved) ... ok
test_malformed_header (test_arcane_check.SyntaxCheckerTests.test_malformed_header) ... ok
test_missing_end (test_arcane_check.SyntaxCheckerTests.test_missing_end) ... ok
test_unexpected_end (test_arcane_check.SyntaxCheckerTests.test_unexpected_end) ... ok
test_unknown_keyword (test_arcane_check.SyntaxCheckerTests.test_unknown_keyword) ... ok
test_valid_nested_blocks (test_arcane_check.SyntaxCheckerTests.test_valid_nested_blocks) ... ok

----------------------------------------------------------------------
Ran 10 tests in 0.000s

OK

~~~

## PHASE_7S_STATUS 2.csv

- Type: CSV
- SHA-256: `a9600dae3139ef7e3941c425db0ba9cc367e1be672e8046b55cb8e5fb7f9cbb0`
- Extracted characters: 941

~~~text
area,status,details
expression tokenisation,implemented,Numeric literals binding references identifiers operators and punctuation
expression parsing,implemented,Parentheses unary signs infix arithmetic and comparisons
prefix operators,implemented,Provisional two-operand FR* operators
function call syntax,implemented,Nested function-call expression syntax
statement RHS validation,implemented,Bindings functions loops and aggregations
conditional condition validation,implemented,Block and inline conditional expressions
line diagnostics,implemented,ARC-EXPR-001 with original source line
block structure checks,retained,Missing END unexpected END ELSE and duplicate ELSE
semantic name resolution,not implemented,No symbol-table/type analysis
runtime evaluation,not implemented,Static checker only
canonical grammar,open,Provisional operators and syntax need decision-ledger reconciliation
regression suite,passed,16 automated tests passed

~~~

## PHASE_7S_STATUS.csv

- Type: CSV
- SHA-256: `a9600dae3139ef7e3941c425db0ba9cc367e1be672e8046b55cb8e5fb7f9cbb0`
- Extracted characters: 941

~~~text
area,status,details
expression tokenisation,implemented,Numeric literals binding references identifiers operators and punctuation
expression parsing,implemented,Parentheses unary signs infix arithmetic and comparisons
prefix operators,implemented,Provisional two-operand FR* operators
function call syntax,implemented,Nested function-call expression syntax
statement RHS validation,implemented,Bindings functions loops and aggregations
conditional condition validation,implemented,Block and inline conditional expressions
line diagnostics,implemented,ARC-EXPR-001 with original source line
block structure checks,retained,Missing END unexpected END ELSE and duplicate ELSE
semantic name resolution,not implemented,No symbol-table/type analysis
runtime evaluation,not implemented,Static checker only
canonical grammar,open,Provisional operators and syntax need decision-ledger reconciliation
regression suite,passed,16 automated tests passed

~~~

## PHASE_7S_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `85426eee636c1471e81159568eb741cf3664eb2adb8b8aff9a586b539c001d0a`
- Extracted characters: 1681

~~~text
test_comment_and_blank_lines (test_arcane_check.SyntaxCheckerTests.test_comment_and_blank_lines) ... ok
test_condition_expression_validation (test_arcane_check.SyntaxCheckerTests.test_condition_expression_validation) ... ok
test_duplicate_else (test_arcane_check.SyntaxCheckerTests.test_duplicate_else) ... ok
test_else_without_header (test_arcane_check.SyntaxCheckerTests.test_else_without_header) ... ok
test_function_declaration_shape (test_arcane_check.SyntaxCheckerTests.test_function_declaration_shape) ... ok
test_line_number_preserved (test_arcane_check.SyntaxCheckerTests.test_line_number_preserved) ... ok
test_malformed_header (test_arcane_check.SyntaxCheckerTests.test_malformed_header) ... ok
test_malformed_prefix_operator (test_arcane_check.SyntaxCheckerTests.test_malformed_prefix_operator) ... ok
test_missing_end (test_arcane_check.SyntaxCheckerTests.test_missing_end) ... ok
test_missing_operand (test_arcane_check.SyntaxCheckerTests.test_missing_operand) ... ok
test_nested_function_call_expression (test_arcane_check.SyntaxCheckerTests.test_nested_function_call_expression) ... ok
test_unclosed_parenthesis (test_arcane_check.SyntaxCheckerTests.test_unclosed_parenthesis) ... ok
test_unexpected_end (test_arcane_check.SyntaxCheckerTests.test_unexpected_end) ... ok
test_unknown_keyword (test_arcane_check.SyntaxCheckerTests.test_unknown_keyword) ... ok
test_valid_arithmetic_expression (test_arcane_check.SyntaxCheckerTests.test_valid_arithmetic_expression) ... ok
test_valid_nested_blocks (test_arcane_check.SyntaxCheckerTests.test_valid_nested_blocks) ... ok

----------------------------------------------------------------------
Ran 16 tests in 0.001s

OK

~~~

## PHASE_7S_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `85426eee636c1471e81159568eb741cf3664eb2adb8b8aff9a586b539c001d0a`
- Extracted characters: 1681

~~~text
test_comment_and_blank_lines (test_arcane_check.SyntaxCheckerTests.test_comment_and_blank_lines) ... ok
test_condition_expression_validation (test_arcane_check.SyntaxCheckerTests.test_condition_expression_validation) ... ok
test_duplicate_else (test_arcane_check.SyntaxCheckerTests.test_duplicate_else) ... ok
test_else_without_header (test_arcane_check.SyntaxCheckerTests.test_else_without_header) ... ok
test_function_declaration_shape (test_arcane_check.SyntaxCheckerTests.test_function_declaration_shape) ... ok
test_line_number_preserved (test_arcane_check.SyntaxCheckerTests.test_line_number_preserved) ... ok
test_malformed_header (test_arcane_check.SyntaxCheckerTests.test_malformed_header) ... ok
test_malformed_prefix_operator (test_arcane_check.SyntaxCheckerTests.test_malformed_prefix_operator) ... ok
test_missing_end (test_arcane_check.SyntaxCheckerTests.test_missing_end) ... ok
test_missing_operand (test_arcane_check.SyntaxCheckerTests.test_missing_operand) ... ok
test_nested_function_call_expression (test_arcane_check.SyntaxCheckerTests.test_nested_function_call_expression) ... ok
test_unclosed_parenthesis (test_arcane_check.SyntaxCheckerTests.test_unclosed_parenthesis) ... ok
test_unexpected_end (test_arcane_check.SyntaxCheckerTests.test_unexpected_end) ... ok
test_unknown_keyword (test_arcane_check.SyntaxCheckerTests.test_unknown_keyword) ... ok
test_valid_arithmetic_expression (test_arcane_check.SyntaxCheckerTests.test_valid_arithmetic_expression) ... ok
test_valid_nested_blocks (test_arcane_check.SyntaxCheckerTests.test_valid_nested_blocks) ... ok

----------------------------------------------------------------------
Ran 16 tests in 0.001s

OK

~~~

## PHASE_7T_STATUS.csv

- Type: CSV
- SHA-256: `886ebf0463b1e4f75bc85d93c2b44f7a2225307c14d43609c0563d4e3acae594`
- Extracted characters: 589

~~~text
Item,Status,Evidence
Symbol resolution,Implemented,ARC-SEM-005; unit tests
Duplicate binding detection,Implemented,ARC-SEM-004; unit tests
Function definition validation,Implemented,ARC-SEM-001/002/003; unit tests
Undefined function detection,Implemented,ARC-SEM-006; unit tests
Function arity checking,Implemented,ARC-SEM-007; unit tests
Conditional branch scopes,Provisional policy,Branch-scope regression tests
Runtime integration,Not implemented,Prior runtime package absent from available archive
Canonical grammar status,Unresolved,Decision ledger has unresolved grammar/scope items

~~~

## PHASE_7T_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `1df4fc7a1a2331fd3d73ba8210d573cceb9e669cd37e17d274cb7432c6d5caed`
- Extracted characters: 3191

~~~text
test_comment_and_blank_lines (test_arcane_check.SyntaxCheckerTests.test_comment_and_blank_lines) ... ok
test_condition_expression_validation (test_arcane_check.SyntaxCheckerTests.test_condition_expression_validation) ... ok
test_duplicate_else (test_arcane_check.SyntaxCheckerTests.test_duplicate_else) ... ok
test_else_without_header (test_arcane_check.SyntaxCheckerTests.test_else_without_header) ... ok
test_function_declaration_shape (test_arcane_check.SyntaxCheckerTests.test_function_declaration_shape) ... ok
test_line_number_preserved (test_arcane_check.SyntaxCheckerTests.test_line_number_preserved) ... ok
test_malformed_header (test_arcane_check.SyntaxCheckerTests.test_malformed_header) ... ok
test_malformed_prefix_operator (test_arcane_check.SyntaxCheckerTests.test_malformed_prefix_operator) ... ok
test_missing_end (test_arcane_check.SyntaxCheckerTests.test_missing_end) ... ok
test_missing_operand (test_arcane_check.SyntaxCheckerTests.test_missing_operand) ... ok
test_nested_function_call_expression (test_arcane_check.SyntaxCheckerTests.test_nested_function_call_expression) ... ok
test_unclosed_parenthesis (test_arcane_check.SyntaxCheckerTests.test_unclosed_parenthesis) ... ok
test_unexpected_end (test_arcane_check.SyntaxCheckerTests.test_unexpected_end) ... ok
test_unknown_keyword (test_arcane_check.SyntaxCheckerTests.test_unknown_keyword) ... ok
test_valid_arithmetic_expression (test_arcane_check.SyntaxCheckerTests.test_valid_arithmetic_expression) ... ok
test_valid_nested_blocks (test_arcane_check.SyntaxCheckerTests.test_valid_nested_blocks) ... ok
test_branch_binding_does_not_escape (test_arcane_semantic.SemanticTests.test_branch_binding_does_not_escape) ... ok
test_call_arity_zero (test_arcane_semantic.SemanticTests.test_call_arity_zero) ... ok
test_declared_binding_resolves (test_arcane_semantic.SemanticTests.test_declared_binding_resolves) ... ok
test_duplicate_binding_same_scope (test_arcane_semantic.SemanticTests.test_duplicate_binding_same_scope) ... ok
test_duplicate_functions (test_arcane_semantic.SemanticTests.test_duplicate_functions) ... ok
test_duplicate_parameters (test_arcane_semantic.SemanticTests.test_duplicate_parameters) ... ok
test_else_branch_has_separate_scope (test_arcane_semantic.SemanticTests.test_else_branch_has_separate_scope) ... ok
test_forward_function_call (test_arcane_semantic.SemanticTests.test_forward_function_call) ... ok
test_function_arity (test_arcane_semantic.SemanticTests.test_function_arity) ... ok
test_function_parameter_not_global (test_arcane_semantic.SemanticTests.test_function_parameter_not_global) ... ok
test_function_parameter_scope (test_arcane_semantic.SemanticTests.test_function_parameter_scope) ... ok
test_nested_scope_sees_outer_binding (test_arcane_semantic.SemanticTests.test_nested_scope_sees_outer_binding) ... ok
test_undefined_function (test_arcane_semantic.SemanticTests.test_undefined_function) ... ok
test_unresolved_binding (test_arcane_semantic.SemanticTests.test_unresolved_binding) ... ok
test_valid_example (test_arcane_semantic.SemanticTests.test_valid_example) ... ok

----------------------------------------------------------------------
Ran 31 tests in 0.001s

OK

~~~

## PHASE_7U_STATUS 2.csv

- Type: CSV
- SHA-256: `f4f42dba3bfab30f0dcf155d6956f25f10eaf1a2a1126e5fd204020b79f42016`
- Extracted characters: 810

~~~text
feature,status,evidence_or_limit
Expression evaluation,implemented,12 runtime regression tests
Bindings,implemented,KWAM name => expression
Expression-bodied functions,implemented,KWAF name(params) => expression
Output,implemented,KWAT binding
Conditional blocks,implemented,KWAI / ELSE / END with nesting
Parse-before-execute,implemented,malformed blocks do not partially mutate globals
CLI static check,implemented,syntax and lightweight semantic check
CLI execution,implemented,example prints 49
Full canonical grammar,not implemented,all syntax remains provisional
General loops and statement-bodied functions,not implemented,not in this subset
Prior Phase 7T tests,not preserved,previous workspace files were unavailable
Runtime integration with original project,unverified,this is a fresh reconstruction

~~~

## PHASE_7U_STATUS.csv

- Type: CSV
- SHA-256: `f4f42dba3bfab30f0dcf155d6956f25f10eaf1a2a1126e5fd204020b79f42016`
- Extracted characters: 810

~~~text
feature,status,evidence_or_limit
Expression evaluation,implemented,12 runtime regression tests
Bindings,implemented,KWAM name => expression
Expression-bodied functions,implemented,KWAF name(params) => expression
Output,implemented,KWAT binding
Conditional blocks,implemented,KWAI / ELSE / END with nesting
Parse-before-execute,implemented,malformed blocks do not partially mutate globals
CLI static check,implemented,syntax and lightweight semantic check
CLI execution,implemented,example prints 49
Full canonical grammar,not implemented,all syntax remains provisional
General loops and statement-bodied functions,not implemented,not in this subset
Prior Phase 7T tests,not preserved,previous workspace files were unavailable
Runtime integration with original project,unverified,this is a fresh reconstruction

~~~

## PHASE_7U_TEST_OUTPUT 2.txt

- Type: TXT
- SHA-256: `0d9b9481b146fe67e52935e386608d685bdd5232a48eab6e8785a958692175ee`
- Extracted characters: 1133

~~~text
test_binding_arithmetic_output (test_arcane_runtime.RuntimeTests.test_binding_arithmetic_output) ... ok
test_comments (test_arcane_runtime.RuntimeTests.test_comments) ... ok
test_conditional_false (test_arcane_runtime.RuntimeTests.test_conditional_false) ... ok
test_conditional_true (test_arcane_runtime.RuntimeTests.test_conditional_true) ... ok
test_division_by_zero (test_arcane_runtime.RuntimeTests.test_division_by_zero) ... ok
test_function_call (test_arcane_runtime.RuntimeTests.test_function_call) ... ok
test_missing_end (test_arcane_runtime.RuntimeTests.test_missing_end) ... ok
test_nested_conditional (test_arcane_runtime.RuntimeTests.test_nested_conditional) ... ok
test_parse_before_execution (test_arcane_runtime.RuntimeTests.test_parse_before_execution) ... ok
test_undefined_function (test_arcane_runtime.RuntimeTests.test_undefined_function) ... ok
test_unresolved_binding (test_arcane_runtime.RuntimeTests.test_unresolved_binding) ... ok
test_wrong_arity (test_arcane_runtime.RuntimeTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 12 tests in 0.001s

OK

~~~

## PHASE_7U_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `0d9b9481b146fe67e52935e386608d685bdd5232a48eab6e8785a958692175ee`
- Extracted characters: 1133

~~~text
test_binding_arithmetic_output (test_arcane_runtime.RuntimeTests.test_binding_arithmetic_output) ... ok
test_comments (test_arcane_runtime.RuntimeTests.test_comments) ... ok
test_conditional_false (test_arcane_runtime.RuntimeTests.test_conditional_false) ... ok
test_conditional_true (test_arcane_runtime.RuntimeTests.test_conditional_true) ... ok
test_division_by_zero (test_arcane_runtime.RuntimeTests.test_division_by_zero) ... ok
test_function_call (test_arcane_runtime.RuntimeTests.test_function_call) ... ok
test_missing_end (test_arcane_runtime.RuntimeTests.test_missing_end) ... ok
test_nested_conditional (test_arcane_runtime.RuntimeTests.test_nested_conditional) ... ok
test_parse_before_execution (test_arcane_runtime.RuntimeTests.test_parse_before_execution) ... ok
test_undefined_function (test_arcane_runtime.RuntimeTests.test_undefined_function) ... ok
test_unresolved_binding (test_arcane_runtime.RuntimeTests.test_unresolved_binding) ... ok
test_wrong_arity (test_arcane_runtime.RuntimeTests.test_wrong_arity) ... ok

----------------------------------------------------------------------
Ran 12 tests in 0.001s

OK

~~~

## PHASE_7V_STATUS.csv

- Type: CSV
- SHA-256: `4b9407a494287fc5f1d3841152c97cbff331f7e346014effb4665dfe294e8aaf`
- Extracted characters: 675

~~~text
area,status,evidence,limitation
shared_parser,implemented,parse_program used by runtime and checker,subset grammar only
cli_prevalidation,implemented,syntax and semantic checks run before --run,semantic analyser is lightweight
recursion_guard,implemented,ARC-RUN-002 regression test,expression recursion only
step_limit,implemented,configurable max_steps in runtime,counts AST statements/conditionals
runtime_reset,implemented,repeated-run regression test,functions remain sequentially registered
runtime_tests,passed,12 existing tests,subset coverage
integration_tests,passed,5 new tests,not a complete language conformance suite
example,passed,prints 49,provisional syntax

~~~

## PHASE_7V_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `fe9e55b2413645dc12da7690eff50b7fe9556532d9412f876829700bb51ad25d`
- Extracted characters: 1919

~~~text
test_binding_arithmetic_output (test_arcane_runtime.RuntimeTests.test_binding_arithmetic_output) ... ok
test_comments (test_arcane_runtime.RuntimeTests.test_comments) ... ok
test_conditional_false (test_arcane_runtime.RuntimeTests.test_conditional_false) ... ok
test_conditional_true (test_arcane_runtime.RuntimeTests.test_conditional_true) ... ok
test_division_by_zero (test_arcane_runtime.RuntimeTests.test_division_by_zero) ... ok
test_function_call (test_arcane_runtime.RuntimeTests.test_function_call) ... ok
test_missing_end (test_arcane_runtime.RuntimeTests.test_missing_end) ... ok
test_nested_conditional (test_arcane_runtime.RuntimeTests.test_nested_conditional) ... ok
test_parse_before_execution (test_arcane_runtime.RuntimeTests.test_parse_before_execution) ... ok
test_undefined_function (test_arcane_runtime.RuntimeTests.test_undefined_function) ... ok
test_unresolved_binding (test_arcane_runtime.RuntimeTests.test_unresolved_binding) ... ok
test_wrong_arity (test_arcane_runtime.RuntimeTests.test_wrong_arity) ... ok
test_checker_and_runtime_share_block_parser (test_phase7v_integration.Phase7VIntegrationTests.test_checker_and_runtime_share_block_parser) ... ok
test_checker_rejects_malformed_statement_shapes (test_phase7v_integration.Phase7VIntegrationTests.test_checker_rejects_malformed_statement_shapes) ... ok
test_cli_does_not_execute_semantically_invalid_program (test_phase7v_integration.Phase7VIntegrationTests.test_cli_does_not_execute_semantically_invalid_program) ... ok
test_recursive_function_hits_guard_not_python_recursion_error (test_phase7v_integration.Phase7VIntegrationTests.test_recursive_function_hits_guard_not_python_recursion_error) ... ok
test_runtime_state_resets_between_runs (test_phase7v_integration.Phase7VIntegrationTests.test_runtime_state_resets_between_runs) ... ok

----------------------------------------------------------------------
Ran 17 tests in 0.680s

OK

~~~

## PHASE_7W_STATUS.csv

- Type: CSV
- SHA-256: `11b49b89146679a44777704d9874ccc4aff60e5c9a37a9e0e42474971341503d`
- Extracted characters: 638

~~~text
feature,status,notes
Shared parser,implemented,One AST parser for checker and runtime
Program-wide function registration,implemented,Forward calls supported
Nested call arity analysis,implemented,Token-aware nested calls
Duplicate function detection,implemented,Before execution
Duplicate parameter detection,implemented,Before execution
Function scope,provisional,Parameter-only; no implicit global capture
Branch scope,implemented,Branch bindings do not escape
CLI pre-validation,implemented,Syntax and semantic checks before run
Runtime limits,implemented,Call depth and AST step count
Canonical grammar,not complete,Still provisional

~~~

## PHASE_7W_TEST_OUTPUT.txt

- Type: TXT
- SHA-256: `81077e04e7b5695cffaf55b031906d6fa6938734ae3827af2f3a898b23f2154b`
- Extracted characters: 2499

~~~text
Spreadsheet runtime warmup failed during python startup
Traceback (most recent call last):
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/patches/warm_spreadsheet_runtime_on_startup.py", line 26, in warm_spreadsheet_runtime_on_startup
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/spreadsheet_warmup.py", line 785, in warm_spreadsheet_runtime
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/spreadsheet_warmup.py", line 718, in _warm_feature_flows
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/spreadsheet_warmup.py", line 509, in _warm_drawing_and_image_flows
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/generated/interface/models.py", line 32861, in bring_to_front
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/rpc/remote.py", line 764, in __call__
  File "/tmp/tmp.QlpUkOUI9D/artifact_tool_v2-2.8.66/artifact_tool/rpc/client.py", line 175, in call
artifact_tool.rpc.client.RemoteError: Element ordering requires an owning element collection.
test_arity_nested_call (test_phase7w.Phase7W.test_arity_nested_call) ... ok
test_branch_binding_does_not_escape (test_phase7w.Phase7W.test_branch_binding_does_not_escape) ... ok
test_branch_local_binding (test_phase7w.Phase7W.test_branch_local_binding) ... ok
test_checker_and_runtime_share_parser (test_phase7w.Phase7W.test_checker_and_runtime_share_parser) ... ok
test_cli_blocks_invalid_program (test_phase7w.Phase7W.test_cli_blocks_invalid_program) ... ok
test_comment (test_phase7w.Phase7W.test_comment) ... ok
test_division_by_zero (test_phase7w.Phase7W.test_division_by_zero) ... ok
test_duplicate_binding (test_phase7w.Phase7W.test_duplicate_binding) ... ok
test_duplicate_functions (test_phase7w.Phase7W.test_duplicate_functions) ... ok
test_duplicate_params (test_phase7w.Phase7W.test_duplicate_params) ... ok
test_forward_function_call (test_phase7w.Phase7W.test_forward_function_call) ... ok
test_function_does_not_capture_global (test_phase7w.Phase7W.test_function_does_not_capture_global) ... ok
test_nested_calls (test_phase7w.Phase7W.test_nested_calls) ... ok
test_precedence (test_phase7w.Phase7W.test_precedence) ... ok
test_recursion_guard (test_phase7w.Phase7W.test_recursion_guard) ... ok
test_state_reset (test_phase7w.Phase7W.test_state_reset) ... ok
test_step_guard (test_phase7w.Phase7W.test_step_guard) ... ok

----------------------------------------------------------------------
Ran 17 tests in 4.710s

OK

~~~

## README 10.txt

- Type: TXT
- SHA-256: `ca6da7bb37de3569e866c122f3f9f4823745932adb0cba2c614dca7462b17370`
- Extracted characters: 1220

~~~text
ARCANE PHASE 7I — BOUNDED AGGREGATION

Contents
- arcane_runtime.py: provisional executable runtime
- arcane_session.py: interactive shell
- test_arcane_runtime.py: 40 automated feature and regression tests
- example.arc: bounded repetition examples
- PHASE_7I_TEST_OUTPUT.txt: final test output
- ARCANE_PHASE_7I_REPORT.md: implementation notes and limitations
- PHASE_7I_STATUS.csv: delivery status
- Arcane_Lexicon_v5_draft.csv: supplied project lexicon snapshot for reference

Run from this directory:
  python -m unittest -v
  python arcane_session.py

Provisional bounded repetition:
  KWAR i FROM 1 TO 5 => FRAKA $i $i

Provisional bounded aggregation:
  KWAS total FROM 1 TO 5 => FRAKA $total $total
  KWAT total

The aggregation example returns 55 dimensionless. Bounds are inclusive dimensionless integers, and each operation is limited to 1,000 iterations. Aggregation requires consistent result dimensions. An empty range sums to dimensionless zero.

KWAR, KWAS and their grammar are implementation choices, not confirmed canonical Arcane words. The supplied lexicon is included as a reference, and no claim is made that these provisional spellings have been approved as canon. Python standard library only.

~~~

## README 11.txt

- Type: TXT
- SHA-256: `40f9cbdf4b03a084a4c8743dda8b613a4220873776c10055f2fd22d4509bab54`
- Extracted characters: 851

~~~text
ARCANE PHASE 7J — VALUE TYPING AND STABLE DIAGNOSTICS

Contents
- arcane_diagnostics.py: diagnostic codes, source spans, exception mapping and descriptive value types
- test_arcane_diagnostics.py: 23 tests
- PHASE_7J_TEST_OUTPUT.txt: test output
- ARCANE_PHASE_7J_REPORT.md: implementation report and integration boundary
- Arcane_Lexicon_v5_draft.csv: supplied lexicon snapshot
- Arcane_Decision_Ledger.docx: supplied decision ledger reference

Run tests:
  python -m unittest -v

This phase adds independent integration utilities; it does not include or claim end-to-end integration with the earlier provisional runtime, because the Phase 7H/7I package was not present in the active workspace at implementation time. The diagnostic codes and helper types do not alter language syntax or establish canonical vocabulary. Python standard library only.

~~~

## README 12.txt

- Type: TXT
- SHA-256: `bb00015db1bc349b524234046a18ce109ea4e4e9135fc501f7200c967652e360`
- Extracted characters: 961

~~~text
ARCANE PHASE 7K — RUNTIME DIAGNOSTIC ADAPTER

Files
- arcane_diagnostics.py: stable diagnostic codes, source spans, exception mapping and value typing (Phase 7J)
- arcane_runtime_adapter.py: callable adapter that returns typed results or structured diagnostics (Phase 7K)
- test_arcane_diagnostics.py: 23 tests
- test_arcane_runtime_adapter.py: 10 adapter tests
- PHASE_7K_TEST_OUTPUT.txt: combined test output
- ARCANE_PHASE_7K_REPORT.md: implementation report and integration boundary
- Arcane_Lexicon_v5_draft.csv and Arcane_Decision_Ledger.docx: supplied project references

Run all tests from this directory:
  python -m unittest -v

Verified: 33/33 tests passed. Python standard library only.

Important boundary: this package does not contain the previous Phase 7H/7I evaluator. It delivers a tested integration adapter, not a claim of end-to-end integration with bounded repetition or aggregation. No language syntax or canonical vocabulary is changed.

~~~

## README 13.txt

- Type: TXT
- SHA-256: `646232cb220d88dbd29f75084cde32dd848792f7a071a1efab2c0f8c51246149`
- Extracted characters: 735

~~~text
ARCANE PHASE 7L — RUNNABLE RUNTIME CONSOLIDATION

Quick start
  python arcane_cli.py

Run all tests
  python -m unittest -v

Runtime features in this small executable subset
- Prefix arithmetic: FRAPA, FRALA, FRATA, FRAKA
- Comparisons: FRAGT, FRALT, FRAEQ
- Logic: FRAND, FROR, FRNOT
- Parenthesised expressions
- Units: 1, m, cm, km, s, kg
- Bindings: KWAM name => expression; KWAT name
- Stable diagnostics from Phase 7J

The runtime is not yet the full Phase 7H/7I evaluator. KWAR, KWAS, functions,
full canonical grammar, short-circuit logic and authoritative vocabulary checks
remain outstanding. Operator spellings and statement syntax are provisional.

Run tests with: python -m unittest -v
Verified suite: 54/54 tests passed.

~~~

## README 14.txt

- Type: TXT
- SHA-256: `d31c754f91fffe9c465ac2ce6aaf6970f23d9e7eb3446d677c87126d06a2e1fd`
- Extracted characters: 814

~~~text
ARCANE PHASE 7M — RUNTIME INTEGRATION

Quick start:
  python arcane_cli.py

Run the complete suite:
  python -m unittest -v

Runnable subset includes:
- Prefix arithmetic: FRAPA, FRALA, FRATA, FRAKA
- Comparisons: FRAGT, FRALT, FRAEQ
- Short-circuit logic: FRAND, FROR, FRNOT
- Parenthesised expressions
- Units: 1, m, cm, km, s, kg
- Bindings: KWAM name => expression; KWAT name
- Bounded repetition: KWAR i FROM start TO end => expression
- Bounded aggregation: KWAS total FROM start TO end => expression
- Stable diagnostics and descriptive typing utilities

Example commands:
  FRAPA 2 3
  KWAR i FROM 1 TO 3 => FRATA $i $i
  KWAS total FROM 1 TO 5 => $total

The grammar/operator spellings and statement forms are provisional, not canonical
language decisions. This is not yet the full Arcane implementation.

~~~

## README 15.txt

- Type: TXT
- SHA-256: `b10a4adb9d4fa26b399d39a70cf9777e2442e0a8dedab7dd22348eae765f90a7`
- Extracted characters: 713

~~~text
ARCANE PHASE 7N — FUNCTIONS AND COMPOSITION

Run the interactive shell:
  python arcane_cli.py

Run tests:
  python -m unittest -v

Examples:
  KWAF square(x) => FRATA $x $x
  square(4)
  KWAF add(x, y) => FRAPA $x $y
  add(4, 5)
  KWAR i FROM 1 TO 3 => square($i)
  KWAS total FROM 1 TO 5 => $total

Features: prefix arithmetic and comparisons, short-circuit logic, dimensional
quantities, bindings, bounded repetition, aggregation, user-defined functions,
local parameter scope, and recursion depth protection.

Important: this is a compact runnable subset. KWAF and the statement/operator
forms are provisional until reconciled with the authoritative grammar and decision
ledger. Python standard library only.

~~~

## README 16.txt

- Type: TXT
- SHA-256: `b0e8da09a877142c7fb965109a2565da3a29b475e6f0bbe885cc512a41b551af`
- Extracted characters: 664

~~~text
ARCANE PHASE 7O — CONTROL FLOW AND PROGRAM COMPOSITION

Files:
- arcane_runtime.py: standard-library runtime subset
- arcane_cli.py: interactive REPL
- test_arcane_runtime.py: regression suite
- Arcane_Lexicon_v5_draft.csv: supplied draft reference, not canonical syntax approval
- ARCANE_PHASE_7O_REPORT.md: changes, examples, validation, limitations

Run:
  python -m unittest -v
  python arcane_cli.py

Examples:
  KWAF square(x) => FRATA $x $x
  square(4)
  KWAI FRAGT 5 3 THEN FRAPA 10 2 ELSE 0

For multi-line programs, import ArcaneRuntime and call run_program(source).
The current syntax is provisional and the runtime is not the complete Arcane language.

~~~

## README 17.txt

- Type: TXT
- SHA-256: `59e22542f7091f0435a7c84aa12ea6b874f3640ecb70e706b1f3e281f84017b1`
- Extracted characters: 797

~~~text
ARCANE PHASE 7P — STRUCTURED BLOCKS AND PROGRAM FLOW

Files:
- arcane_runtime.py: standard-library runtime subset
- arcane_cli.py: interactive REPL
- test_arcane_runtime.py: 35 regression tests
- Arcane_Lexicon_v5_draft.csv: supplied draft reference, not canonical syntax approval
- ARCANE_PHASE_7P_REPORT.md: implementation, validation and limitations
- PHASE_7P_STATUS.csv: feature status ledger
- PHASE_7P_TEST_OUTPUT.txt: exact test output

Run from this directory:
  python -m unittest -v
  python arcane_cli.py

Structured conditional example:
  KWAI FRAGT 5 3 THEN
    KWAM answer => 42
    KWAT answer
  ELSE
    KWAM answer => 0
  END

For multi-line programs, use ArcaneRuntime.run_program(source).
All syntax is provisional; this is a runnable subset, not the complete Arcane language.

~~~

## README 18.txt

- Type: TXT
- SHA-256: `ed245d59de803a5939dcd59963cd407cdfccfa98597c4f53c26caec41d2732e1`
- Extracted characters: 577

~~~text
ARCANE PHASE 7Q — PARSER CONSOLIDATION AND FILE-BASED EXECUTION

Requirements: Python 3.10+ (standard library only)

Run tests:
  python -m unittest -v

Run the example program:
  python arcane_cli.py phase7q_example.arc

Start interactive mode:
  python arcane_cli.py

Phase 7Q replaces duplicated structured-program parsing with a single recursive
parser and separate execution pass, and adds source-file execution through the
CLI. The implementation is a reconstructed Arcane subset. Syntax remains
provisional until reconciled with the canonical Arcane language decisions.

~~~

## README 19.txt

- Type: TXT
- SHA-256: `da7db98e6a29f9503240f41d65501bfcd855cb6c37615e6faebdc7def6cad257`
- Extracted characters: 634

~~~text
ARCANE PHASE 7R — SYNTAX CHECKING AND DEVELOPER TOOLING

This standalone package adds a static checker for the reconstructed provisional
Arcane subset. It does not execute programs and is not a full compiler.

Run tests:
  python -m unittest -v

Check a valid example:
  python arcane_cli.py example_valid.arc

Check an intentionally invalid example:
  python arcane_cli.py example_invalid.arc

Exit status: 0 means the checker found no supported-shape or block-structure
errors; 1 means it reported an issue. Passing does not guarantee runtime success.
All syntax remains provisional pending reconciliation with canonical decisions.

~~~

## README 2.txt

- Type: TXT
- SHA-256: `f8ec35d9795bb029b10a1df37bfd3f81ff5da934101ca34c047268362e9a9181`
- Extracted characters: 470

~~~text
ARCANE PHASE 7A — TYPED BINDINGS AND REFERENCES

Files:
- arcane_runtime.py: runnable provisional runtime
- test_arcane_runtime.py: 15 focused automated tests
- ARCANE_PHASE_7A_REPORT.md: implementation and limitations
- PHASE_7A_STATUS.csv: acceptance status
- PHASE_7A_TEST_OUTPUT.txt: captured test output

Run tests:
python -m unittest -v test_arcane_runtime.py

This is a provisional implementation profile, not a canon change. Python 3.10+; standard library only.

~~~

## README 20.txt

- Type: TXT
- SHA-256: `3f38baaab527772745db3840a6ba7a6e9df10c7a2a6309d76d8cbd65d96ed83d`
- Extracted characters: 819

~~~text
ARCANE PHASE 7S — EXPRESSION PARSING AND STATIC VALIDATION

Requirements: Python 3.10+ (standard library only)

Files:
- arcane_expr.py: recursive parser for provisional expressions
- arcane_check.py: block and statement/expression static checker
- arcane_cli.py: command-line checker
- test_arcane_check.py: 16 regression tests
- example_valid.arc / example_invalid.arc: CLI examples
- ARCANE_PHASE_7S_REPORT.md: implementation report and limitations
- PHASE_7S_STATUS.csv: feature status ledger
- PHASE_7S_TEST_OUTPUT.txt: test output

Run tests:
  python -m unittest -v

Check syntax:
  python arcane_cli.py example_valid.arc
  python arcane_cli.py example_invalid.arc

This is static validation for a reconstructed subset, not the full Arcane
compiler or runtime. Grammar and operator spellings remain provisional.

~~~

## README 21.txt

- Type: TXT
- SHA-256: `a319b5b99d456b4010b8d35ad70414b1bb64bc726ecbda9180687b0b8403a22d`
- Extracted characters: 813

~~~text
ARCANE PHASE 7T — SYMBOL TABLES AND SEMANTIC ANALYSIS

Contents:
- arcane_check.py: syntax and expression-shape checking (Phase 7R/7S)
- arcane_expr.py: provisional expression parser
- arcane_semantic.py: Phase 7T scope, binding, and function checks
- arcane_cli.py: integrated syntax + semantic CLI (no execution)
- test_arcane_check.py and test_arcane_semantic.py: automated regression tests
- example_valid.arc and example_invalid.arc: smoke-test fixtures
- ARCANE_PHASE_7T_REPORT.md: implementation details and limitations
- PHASE_7T_TEST_OUTPUT.txt: full test log

Run from this directory:
  python -m unittest -v
  python arcane_cli.py example_valid.arc
  python arcane_cli.py example_invalid.arc

The syntax and semantic rules are provisional, not canonical. This package does not execute Arcane programs.

~~~

## README 22.txt

- Type: TXT
- SHA-256: `1a4b9626975ee8009c480ff4b00a688ee396768bafe39ce42fb1883a31e38d98`
- Extracted characters: 559

~~~text
ARCANE PHASE 7U — MINIMAL RUNNABLE WORKSPACE

Python 3.10+; standard library only.

Run regression tests:
  python -m unittest -v

Static checks:
  python arcane_cli.py --check example.arc

Execute program:
  python arcane_cli.py --run example.arc

Expected example output: 49

This package is a fresh reconstruction because the prior Phase 7R/7T workspace
was not available. It implements a small executable subset, not the complete
Arcane language. Grammar and semantics remain provisional. See
ARCANE_PHASE_7U_REPORT.md for detailed scope and limitations.

~~~

## README 23.txt

- Type: TXT
- SHA-256: `5cf133cfd0c7221cee32eef3c20efd43d49a4609f1bf40ab6d48e76f455a53e1`
- Extracted characters: 600

~~~text
ARCANE PHASE 7V — SHARED PARSER AND SAFER EXECUTION

Python 3.10+; standard library only.

Run regression tests:
  python -m unittest -v

Static checks:
  python arcane_cli.py --check example.arc

Validate, then execute:
  python arcane_cli.py --run example.arc

Expected example output: 49

Phase 7V integrates syntax checking and runtime parsing, validates syntax and
semantic issues before CLI execution, guards recursive calls, and resets
runtime state between runs. This remains a small reconstructed subset, not the
complete Arcane language. See ARCANE_PHASE_7V_REPORT.md for scope and limits.

~~~

## README 3.txt

- Type: TXT
- SHA-256: `54778bb428eea78948ccf4b1df3659f7e8a8a1fdb63903f3c5406d0df76e9848`
- Extracted characters: 478

~~~text
ARCANE PHASE 7B — MUTABLE STATE AND SCOPES

Contents:
- arcane_runtime.py: runnable provisional runtime
- test_arcane_runtime.py: 15 focused tests
- ARCANE_PHASE_7B_REPORT.md: implementation summary and boundaries
- PHASE_7B_STATUS.csv: acceptance register
- PHASE_7B_TEST_OUTPUT.txt: actual test output

Run tests (Python 3.10+, standard library only):
python -m unittest -v test_arcane_runtime.py

This is a provisional implementation profile, not a canonical grammar change.

~~~

## README 4.txt

- Type: TXT
- SHA-256: `65b051b51cac9372e5ae2ed88d13dd61d7d232f24edc0d0a3e90f5eef6eeb48f`
- Extracted characters: 389

~~~text
ARCANE PHASE 7C — PERSISTENT SESSIONS AND TRANSACTIONAL EXECUTION

Run interactive runtime:
  python arcane_session.py

Run demonstration script:
  python arcane_session.py --script example.arc

Run tests:
  python -m unittest -v test_arcane_runtime test_arcane_session

Python 3.10+; standard library only.
Syntax is a provisional implementation profile, not a canonical language change.

~~~

## README 5.txt

- Type: TXT
- SHA-256: `18688c4856a2a8510d17719d141a43a3d7fce8440fd5f2a829c0834c0d11419c`
- Extracted characters: 289

~~~text
ARCANE PHASE 7D — TYPED FUNCTIONS

Files: arcane_runtime.py, arcane_session.py, test_arcane_runtime.py, report, status CSV.
Run tests: python -m unittest -v test_arcane_runtime.py
Run session: python arcane_session.py
Python 3.10+, standard library only. Syntax is provisional, not canon.

~~~

## README 6.txt

- Type: TXT
- SHA-256: `eb753a365a21014900fa0c318441f627d7ea55fdaf969ed5ba2f5996e38ebd5d`
- Extracted characters: 270

~~~text
ARCANE PHASE 7E — CONDITIONALS AND COMPARISONS

Run tests: python -m unittest -v test_arcane_runtime.py
Run shell: python arcane_session.py
Example file: example.arc
Python 3.10+, standard library only.
Syntax is provisional and does not alter canonical Arcane grammar.

~~~

## README 7.txt

- Type: TXT
- SHA-256: `28c4201407bcd715e17e6b8ee69a5697d9ce1bfe2f7fbd2499b73d4b72c5815d`
- Extracted characters: 1141

~~~text
ARCANE PHASE 7F — FUNCTION COMPOSITION

Contents
- arcane_runtime.py: executable provisional subset and parser
- arcane_session.py: interactive command-line session
- test_arcane_runtime.py: regression and feature tests
- example.arc: sample programs (run line-by-line in the session; comments are explanatory)
- PHASE_7F_TEST_OUTPUT.txt: captured automated test output
- ARCANE_PHASE_7F_REPORT.md: implementation notes, limits, and next step
- PHASE_7F_STATUS.csv: compact delivery status

Run
  python -m unittest -v
  python arcane_session.py

Language examples
  KWAF increment(x) => FRAPA $x 1
  KWAF double(x) => FRAKA $x 2
  double(increment(3))
  FRAPA increment(4) double(5)

The expression-call form name(expr, ...) is new in Phase 7F. Function calls can now appear wherever an expression is accepted, including inside prefix operations, conditionals, and other function arguments.

This is a provisional implementation subset, not a claim that the entire Arcane language specification is complete or canonical. It supports a small dimensional quantity system and a limited set of prefix operators. See the report for limitations.

~~~

## README 8.txt

- Type: TXT
- SHA-256: `3ae8748d00f4e633fe9ab8ab824b3f2290ac0caf8b653d954cc838e2af53a5c5`
- Extracted characters: 852

~~~text
ARCANE PHASE 7G — LOGICAL EXPRESSIONS

This package extends the provisional Phase 7F runtime with short-circuit logical operations:
  FRAND <left> <right>  logical conjunction
  FROR  <left> <right>  logical disjunction
  FRNOT <value>          logical negation

These spellings are provisional implementation tokens only. They have not been established as canonical forms in the Arcane lexicon. All three operators return dimensionless numeric truth values (1 for true, 0 for false). Any non-zero dimensionless operand is treated as true. FRAND and FROR short-circuit. Logical operands must be dimensionless.

Requirements: Python 3.10+ (standard library only).
Run tests: python -m unittest -v
Start interactive session: python arcane_session.py

This is a tested executable subset, not a claim that the complete Arcane language/runtime is finished.

~~~

## README 9.txt

- Type: TXT
- SHA-256: `d1b392e821b63392c38a0af91c40505ec2e044fa257606ec5db69cd38b9c5106`
- Extracted characters: 1189

~~~text
ARCANE PHASE 7H — BOUNDED REPETITION

Contents
- arcane_runtime.py: provisional executable runtime
- arcane_session.py: interactive shell
- test_arcane_runtime.py: 24 automated feature and regression tests
- example.arc: bounded repetition examples
- PHASE_7H_TEST_OUTPUT.txt: final test output
- ARCANE_PHASE_7H_REPORT.md: implementation notes and limitations
- PHASE_7H_STATUS.csv: delivery status
- Arcane_Lexicon_v5_draft.csv: supplied project lexicon snapshot for reference

Run from this directory:
  python -m unittest -v
  python arcane_session.py

Provisional bounded repetition syntax:
  KWAR i FROM 1 TO 5 => expression

Bounds are inclusive, must be dimensionless integers, and the maximum is 1,000 iterations per repeat. Each iteration gets an isolated scope; the loop variable does not leak into the surrounding scope. The result is a list of expression results. If the start is greater than the end, the result is an empty list.

KWAR and this syntax are implementation choices, not confirmed canonical Arcane words. The supplied lexicon is included as a reference, and no claim is made that this provisional syntax has been approved as canon. Python standard library only.

~~~

## README.txt

- Type: TXT
- SHA-256: `d58e5d585a71ae85c348ab4a4bbdd25d0f1510d096d9f0c9b6442bd68b002570`
- Extracted characters: 315

~~~text
ARCANE PHASE 7W — FUNCTION AND SEMANTIC CONSISTENCY
Python 3.10+; standard library only.
Tests: python -m unittest -v
Check: python arcane_cli.py --check example.arc
Run:   python arcane_cli.py --run example.arc
Expected example output: 13
See ARCANE_PHASE_7W_REPORT.md. This is a provisional reconstructed subset.

~~~

## test_arcane_check 2.py

- Type: PY
- SHA-256: `c1694387324a6c0e4e62205cd162accaee118c171569f3c6a7fe30f160e81689`
- Extracted characters: 2292

~~~text
import unittest
from arcane_check import check_source

class SyntaxCheckerTests(unittest.TestCase):
    def test_valid_nested_blocks(self):
        r=check_source('KWAM score => 8\nKWAI FRAGT $score 5 THEN\nKWAI FRAEQ 1 1 THEN\nKWAM answer => 42\nEND\nELSE\nKWAM answer => 0\nEND')
        self.assertTrue(r.ok, r.render())
    def test_missing_end(self): self.assertIn('ARC-PARSE-009', [x.code for x in check_source('KWAI FRAGT 2 1 THEN\nKWAM x => 1').issues])
    def test_unexpected_end(self): self.assertIn('ARC-PARSE-004', [x.code for x in check_source('END').issues])
    def test_else_without_header(self): self.assertIn('ARC-PARSE-002', [x.code for x in check_source('ELSE').issues])
    def test_duplicate_else(self): self.assertIn('ARC-PARSE-003', [x.code for x in check_source('KWAI FRAGT 2 1 THEN\nELSE\nELSE\nEND').issues])
    def test_malformed_header(self): self.assertIn('ARC-PARSE-005', [x.code for x in check_source('KWAI FRAGT 2 1').issues])
    def test_comment_and_blank_lines(self): self.assertTrue(check_source('# hi\n\nKWAM x => 4\nKWAT x').ok)
    def test_unknown_keyword(self): self.assertIn('ARC-PARSE-007', [x.code for x in check_source('KWZZ x => 1').issues])
    def test_line_number_preserved(self): self.assertEqual(check_source('# c\n\nEND').issues[0].line,3)
    def test_function_declaration_shape(self): self.assertTrue(check_source('KWAF square(x) => FRATA $x $x').ok)


    def test_valid_arithmetic_expression(self):
        self.assertTrue(check_source('KWAM total => (4 + 3) * 2').ok)
    def test_missing_operand(self):
        self.assertIn('ARC-EXPR-001', [x.code for x in check_source('KWAM total => 4 +').issues])
    def test_unclosed_parenthesis(self):
        self.assertIn('ARC-EXPR-001', [x.code for x in check_source('KWAM total => (4 + 3').issues])
    def test_malformed_prefix_operator(self):
        self.assertIn('ARC-EXPR-001', [x.code for x in check_source('KWAM total => FRATA $x').issues])
    def test_condition_expression_validation(self):
        self.assertIn('ARC-EXPR-001', [x.code for x in check_source('KWAI FRAGT $x THEN\nEND').issues])
    def test_nested_function_call_expression(self):
        self.assertTrue(check_source('KWAM value => square(double(3))').ok)

if __name__ == '__main__': unittest.main(verbosity=2)

~~~

## test_arcane_check 3.py

- Type: PY
- SHA-256: `c1694387324a6c0e4e62205cd162accaee118c171569f3c6a7fe30f160e81689`
- Extracted characters: 2292

~~~text
import unittest
from arcane_check import check_source

class SyntaxCheckerTests(unittest.TestCase):
    def test_valid_nested_blocks(self):
        r=check_source('KWAM score => 8\nKWAI FRAGT $score 5 THEN\nKWAI FRAEQ 1 1 THEN\nKWAM answer => 42\nEND\nELSE\nKWAM answer => 0\nEND')
        self.assertTrue(r.ok, r.render())
    def test_missing_end(self): self.assertIn('ARC-PARSE-009', [x.code for x in check_source('KWAI FRAGT 2 1 THEN\nKWAM x => 1').issues])
    def test_unexpected_end(self): self.assertIn('ARC-PARSE-004', [x.code for x in check_source('END').issues])
    def test_else_without_header(self): self.assertIn('ARC-PARSE-002', [x.code for x in check_source('ELSE').issues])
    def test_duplicate_else(self): self.assertIn('ARC-PARSE-003', [x.code for x in check_source('KWAI FRAGT 2 1 THEN\nELSE\nELSE\nEND').issues])
    def test_malformed_header(self): self.assertIn('ARC-PARSE-005', [x.code for x in check_source('KWAI FRAGT 2 1').issues])
    def test_comment_and_blank_lines(self): self.assertTrue(check_source('# hi\n\nKWAM x => 4\nKWAT x').ok)
    def test_unknown_keyword(self): self.assertIn('ARC-PARSE-007', [x.code for x in check_source('KWZZ x => 1').issues])
    def test_line_number_preserved(self): self.assertEqual(check_source('# c\n\nEND').issues[0].line,3)
    def test_function_declaration_shape(self): self.assertTrue(check_source('KWAF square(x) => FRATA $x $x').ok)


    def test_valid_arithmetic_expression(self):
        self.assertTrue(check_source('KWAM total => (4 + 3) * 2').ok)
    def test_missing_operand(self):
        self.assertIn('ARC-EXPR-001', [x.code for x in check_source('KWAM total => 4 +').issues])
    def test_unclosed_parenthesis(self):
        self.assertIn('ARC-EXPR-001', [x.code for x in check_source('KWAM total => (4 + 3').issues])
    def test_malformed_prefix_operator(self):
        self.assertIn('ARC-EXPR-001', [x.code for x in check_source('KWAM total => FRATA $x').issues])
    def test_condition_expression_validation(self):
        self.assertIn('ARC-EXPR-001', [x.code for x in check_source('KWAI FRAGT $x THEN\nEND').issues])
    def test_nested_function_call_expression(self):
        self.assertTrue(check_source('KWAM value => square(double(3))').ok)

if __name__ == '__main__': unittest.main(verbosity=2)

~~~

## test_arcane_check.py

- Type: PY
- SHA-256: `c5aadd77eb335919b677c17814718d612a5f9893a93e656fa0323a760151a71d`
- Extracted characters: 1463

~~~text
import unittest
from arcane_check import check_source

class SyntaxCheckerTests(unittest.TestCase):
    def test_valid_nested_blocks(self):
        r=check_source('KWAM score => 8\nKWAI FRAGT $score 5 THEN\nKWAI FRAEQ 1 1 THEN\nKWAM answer => 42\nEND\nELSE\nKWAM answer => 0\nEND')
        self.assertTrue(r.ok, r.render())
    def test_missing_end(self): self.assertIn('ARC-PARSE-009', [x.code for x in check_source('KWAI FRAGT 2 1 THEN\nKWAM x => 1').issues])
    def test_unexpected_end(self): self.assertIn('ARC-PARSE-004', [x.code for x in check_source('END').issues])
    def test_else_without_header(self): self.assertIn('ARC-PARSE-002', [x.code for x in check_source('ELSE').issues])
    def test_duplicate_else(self): self.assertIn('ARC-PARSE-003', [x.code for x in check_source('KWAI FRAGT 2 1 THEN\nELSE\nELSE\nEND').issues])
    def test_malformed_header(self): self.assertIn('ARC-PARSE-005', [x.code for x in check_source('KWAI FRAGT 2 1').issues])
    def test_comment_and_blank_lines(self): self.assertTrue(check_source('# hi\n\nKWAM x => 4\nKWAT x').ok)
    def test_unknown_keyword(self): self.assertIn('ARC-PARSE-007', [x.code for x in check_source('KWZZ x => 1').issues])
    def test_line_number_preserved(self): self.assertEqual(check_source('# c\n\nEND').issues[0].line,3)
    def test_function_declaration_shape(self): self.assertTrue(check_source('KWAF square(x) => FRATA $x $x').ok)

if __name__ == '__main__': unittest.main(verbosity=2)

~~~

## test_arcane_diagnostics 2.py

- Type: PY
- SHA-256: `5223e65e059c37d8636709553acc4d9e7da5fde8b45cbb769990796fd4eeca44`
- Extracted characters: 3223

~~~text
import unittest
from arcane_diagnostics import (ErrorCode, SourceSpan, Diagnostic, ArcaneDiagnosticError,
    ValueKind, ValueType, TypedValue, infer_type, diagnostic_for_exception)

class DiagnosticTests(unittest.TestCase):
 def test_stable_render(self):
  d=Diagnostic(ErrorCode.UNKNOWN_NAME,'unknown binding x',SourceSpan(3,5),'Check scope.')
  self.assertEqual(d.render(),'ARC-NAME-001 at 3:5: unknown binding x\n  hint: Check scope.')
 def test_source_positions_are_one_based(self):
  with self.assertRaises(ValueError):SourceSpan(0,1)
  with self.assertRaises(ValueError):SourceSpan(1,0)
 def test_end_line_cannot_precede_start(self):
  with self.assertRaises(ValueError):SourceSpan(4,1,3,2)
 def test_exception_wrap(self):
  e=ArcaneDiagnosticError(Diagnostic(ErrorCode.PARSE_ERROR,'unexpected token'))
  self.assertEqual(e.diagnostic.code,ErrorCode.PARSE_ERROR)
 def test_division_mapping(self):self.assertEqual(diagnostic_for_exception(ZeroDivisionError('division by zero')).code,ErrorCode.DIVISION_BY_ZERO)
 def test_unknown_name_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('unknown binding x')).code,ErrorCode.UNKNOWN_NAME)
 def test_duplicate_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('duplicate binding')).code,ErrorCode.DUPLICATE_BINDING)
 def test_dimension_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('dimension mismatch')).code,ErrorCode.DIMENSION_MISMATCH)
 def test_bounds_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('bounds must be integers')).code,ErrorCode.INVALID_BOUNDS)
 def test_iteration_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('maximum iteration count exceeded')).code,ErrorCode.ITERATION_LIMIT)
 def test_type_mapping(self):self.assertEqual(diagnostic_for_exception(TypeError('numeric value required')).code,ErrorCode.TYPE_MISMATCH)
 def test_parse_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('unexpected token')).code,ErrorCode.PARSE_ERROR)
 def test_unknown_mapping_is_safe(self):self.assertEqual(diagnostic_for_exception(RuntimeError('oops')).code,ErrorCode.INTERNAL_ERROR)

class ValueTypingTests(unittest.TestCase):
 def test_bool_is_not_number(self):self.assertEqual(infer_type(True).kind,ValueKind.BOOLEAN)
 def test_int_number(self):self.assertEqual(infer_type(4).kind,ValueKind.NUMBER)
 def test_dimension_descriptor(self):self.assertEqual(infer_type(4,(1,0,0)).describe(),'number[1,0,0]')
 def test_string(self):self.assertEqual(infer_type('arcane').kind,ValueKind.STRING)
 def test_homogeneous_list(self):self.assertEqual(infer_type([1,2]).describe(),'list[number]')
 def test_empty_list(self):self.assertEqual(infer_type([]).describe(),'list[unknown]')
 def test_heterogeneous_list(self):self.assertEqual(infer_type([1,'x']).describe(),'list[unknown]')
 def test_function(self):self.assertEqual(infer_type(lambda x:x).kind,ValueKind.FUNCTION)
 def test_unknown_object(self):self.assertEqual(infer_type(object()).kind,ValueKind.UNKNOWN)
 def test_typed_value(self):
  v=TypedValue(7,ValueType(ValueKind.NUMBER));self.assertEqual(v.value,7);self.assertEqual(v.type.kind,ValueKind.NUMBER)

if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_diagnostics 3.py

- Type: PY
- SHA-256: `5223e65e059c37d8636709553acc4d9e7da5fde8b45cbb769990796fd4eeca44`
- Extracted characters: 3223

~~~text
import unittest
from arcane_diagnostics import (ErrorCode, SourceSpan, Diagnostic, ArcaneDiagnosticError,
    ValueKind, ValueType, TypedValue, infer_type, diagnostic_for_exception)

class DiagnosticTests(unittest.TestCase):
 def test_stable_render(self):
  d=Diagnostic(ErrorCode.UNKNOWN_NAME,'unknown binding x',SourceSpan(3,5),'Check scope.')
  self.assertEqual(d.render(),'ARC-NAME-001 at 3:5: unknown binding x\n  hint: Check scope.')
 def test_source_positions_are_one_based(self):
  with self.assertRaises(ValueError):SourceSpan(0,1)
  with self.assertRaises(ValueError):SourceSpan(1,0)
 def test_end_line_cannot_precede_start(self):
  with self.assertRaises(ValueError):SourceSpan(4,1,3,2)
 def test_exception_wrap(self):
  e=ArcaneDiagnosticError(Diagnostic(ErrorCode.PARSE_ERROR,'unexpected token'))
  self.assertEqual(e.diagnostic.code,ErrorCode.PARSE_ERROR)
 def test_division_mapping(self):self.assertEqual(diagnostic_for_exception(ZeroDivisionError('division by zero')).code,ErrorCode.DIVISION_BY_ZERO)
 def test_unknown_name_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('unknown binding x')).code,ErrorCode.UNKNOWN_NAME)
 def test_duplicate_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('duplicate binding')).code,ErrorCode.DUPLICATE_BINDING)
 def test_dimension_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('dimension mismatch')).code,ErrorCode.DIMENSION_MISMATCH)
 def test_bounds_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('bounds must be integers')).code,ErrorCode.INVALID_BOUNDS)
 def test_iteration_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('maximum iteration count exceeded')).code,ErrorCode.ITERATION_LIMIT)
 def test_type_mapping(self):self.assertEqual(diagnostic_for_exception(TypeError('numeric value required')).code,ErrorCode.TYPE_MISMATCH)
 def test_parse_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('unexpected token')).code,ErrorCode.PARSE_ERROR)
 def test_unknown_mapping_is_safe(self):self.assertEqual(diagnostic_for_exception(RuntimeError('oops')).code,ErrorCode.INTERNAL_ERROR)

class ValueTypingTests(unittest.TestCase):
 def test_bool_is_not_number(self):self.assertEqual(infer_type(True).kind,ValueKind.BOOLEAN)
 def test_int_number(self):self.assertEqual(infer_type(4).kind,ValueKind.NUMBER)
 def test_dimension_descriptor(self):self.assertEqual(infer_type(4,(1,0,0)).describe(),'number[1,0,0]')
 def test_string(self):self.assertEqual(infer_type('arcane').kind,ValueKind.STRING)
 def test_homogeneous_list(self):self.assertEqual(infer_type([1,2]).describe(),'list[number]')
 def test_empty_list(self):self.assertEqual(infer_type([]).describe(),'list[unknown]')
 def test_heterogeneous_list(self):self.assertEqual(infer_type([1,'x']).describe(),'list[unknown]')
 def test_function(self):self.assertEqual(infer_type(lambda x:x).kind,ValueKind.FUNCTION)
 def test_unknown_object(self):self.assertEqual(infer_type(object()).kind,ValueKind.UNKNOWN)
 def test_typed_value(self):
  v=TypedValue(7,ValueType(ValueKind.NUMBER));self.assertEqual(v.value,7);self.assertEqual(v.type.kind,ValueKind.NUMBER)

if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_diagnostics 4.py

- Type: PY
- SHA-256: `5223e65e059c37d8636709553acc4d9e7da5fde8b45cbb769990796fd4eeca44`
- Extracted characters: 3223

~~~text
import unittest
from arcane_diagnostics import (ErrorCode, SourceSpan, Diagnostic, ArcaneDiagnosticError,
    ValueKind, ValueType, TypedValue, infer_type, diagnostic_for_exception)

class DiagnosticTests(unittest.TestCase):
 def test_stable_render(self):
  d=Diagnostic(ErrorCode.UNKNOWN_NAME,'unknown binding x',SourceSpan(3,5),'Check scope.')
  self.assertEqual(d.render(),'ARC-NAME-001 at 3:5: unknown binding x\n  hint: Check scope.')
 def test_source_positions_are_one_based(self):
  with self.assertRaises(ValueError):SourceSpan(0,1)
  with self.assertRaises(ValueError):SourceSpan(1,0)
 def test_end_line_cannot_precede_start(self):
  with self.assertRaises(ValueError):SourceSpan(4,1,3,2)
 def test_exception_wrap(self):
  e=ArcaneDiagnosticError(Diagnostic(ErrorCode.PARSE_ERROR,'unexpected token'))
  self.assertEqual(e.diagnostic.code,ErrorCode.PARSE_ERROR)
 def test_division_mapping(self):self.assertEqual(diagnostic_for_exception(ZeroDivisionError('division by zero')).code,ErrorCode.DIVISION_BY_ZERO)
 def test_unknown_name_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('unknown binding x')).code,ErrorCode.UNKNOWN_NAME)
 def test_duplicate_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('duplicate binding')).code,ErrorCode.DUPLICATE_BINDING)
 def test_dimension_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('dimension mismatch')).code,ErrorCode.DIMENSION_MISMATCH)
 def test_bounds_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('bounds must be integers')).code,ErrorCode.INVALID_BOUNDS)
 def test_iteration_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('maximum iteration count exceeded')).code,ErrorCode.ITERATION_LIMIT)
 def test_type_mapping(self):self.assertEqual(diagnostic_for_exception(TypeError('numeric value required')).code,ErrorCode.TYPE_MISMATCH)
 def test_parse_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('unexpected token')).code,ErrorCode.PARSE_ERROR)
 def test_unknown_mapping_is_safe(self):self.assertEqual(diagnostic_for_exception(RuntimeError('oops')).code,ErrorCode.INTERNAL_ERROR)

class ValueTypingTests(unittest.TestCase):
 def test_bool_is_not_number(self):self.assertEqual(infer_type(True).kind,ValueKind.BOOLEAN)
 def test_int_number(self):self.assertEqual(infer_type(4).kind,ValueKind.NUMBER)
 def test_dimension_descriptor(self):self.assertEqual(infer_type(4,(1,0,0)).describe(),'number[1,0,0]')
 def test_string(self):self.assertEqual(infer_type('arcane').kind,ValueKind.STRING)
 def test_homogeneous_list(self):self.assertEqual(infer_type([1,2]).describe(),'list[number]')
 def test_empty_list(self):self.assertEqual(infer_type([]).describe(),'list[unknown]')
 def test_heterogeneous_list(self):self.assertEqual(infer_type([1,'x']).describe(),'list[unknown]')
 def test_function(self):self.assertEqual(infer_type(lambda x:x).kind,ValueKind.FUNCTION)
 def test_unknown_object(self):self.assertEqual(infer_type(object()).kind,ValueKind.UNKNOWN)
 def test_typed_value(self):
  v=TypedValue(7,ValueType(ValueKind.NUMBER));self.assertEqual(v.value,7);self.assertEqual(v.type.kind,ValueKind.NUMBER)

if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_diagnostics.py

- Type: PY
- SHA-256: `5223e65e059c37d8636709553acc4d9e7da5fde8b45cbb769990796fd4eeca44`
- Extracted characters: 3223

~~~text
import unittest
from arcane_diagnostics import (ErrorCode, SourceSpan, Diagnostic, ArcaneDiagnosticError,
    ValueKind, ValueType, TypedValue, infer_type, diagnostic_for_exception)

class DiagnosticTests(unittest.TestCase):
 def test_stable_render(self):
  d=Diagnostic(ErrorCode.UNKNOWN_NAME,'unknown binding x',SourceSpan(3,5),'Check scope.')
  self.assertEqual(d.render(),'ARC-NAME-001 at 3:5: unknown binding x\n  hint: Check scope.')
 def test_source_positions_are_one_based(self):
  with self.assertRaises(ValueError):SourceSpan(0,1)
  with self.assertRaises(ValueError):SourceSpan(1,0)
 def test_end_line_cannot_precede_start(self):
  with self.assertRaises(ValueError):SourceSpan(4,1,3,2)
 def test_exception_wrap(self):
  e=ArcaneDiagnosticError(Diagnostic(ErrorCode.PARSE_ERROR,'unexpected token'))
  self.assertEqual(e.diagnostic.code,ErrorCode.PARSE_ERROR)
 def test_division_mapping(self):self.assertEqual(diagnostic_for_exception(ZeroDivisionError('division by zero')).code,ErrorCode.DIVISION_BY_ZERO)
 def test_unknown_name_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('unknown binding x')).code,ErrorCode.UNKNOWN_NAME)
 def test_duplicate_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('duplicate binding')).code,ErrorCode.DUPLICATE_BINDING)
 def test_dimension_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('dimension mismatch')).code,ErrorCode.DIMENSION_MISMATCH)
 def test_bounds_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('bounds must be integers')).code,ErrorCode.INVALID_BOUNDS)
 def test_iteration_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('maximum iteration count exceeded')).code,ErrorCode.ITERATION_LIMIT)
 def test_type_mapping(self):self.assertEqual(diagnostic_for_exception(TypeError('numeric value required')).code,ErrorCode.TYPE_MISMATCH)
 def test_parse_mapping(self):self.assertEqual(diagnostic_for_exception(ValueError('unexpected token')).code,ErrorCode.PARSE_ERROR)
 def test_unknown_mapping_is_safe(self):self.assertEqual(diagnostic_for_exception(RuntimeError('oops')).code,ErrorCode.INTERNAL_ERROR)

class ValueTypingTests(unittest.TestCase):
 def test_bool_is_not_number(self):self.assertEqual(infer_type(True).kind,ValueKind.BOOLEAN)
 def test_int_number(self):self.assertEqual(infer_type(4).kind,ValueKind.NUMBER)
 def test_dimension_descriptor(self):self.assertEqual(infer_type(4,(1,0,0)).describe(),'number[1,0,0]')
 def test_string(self):self.assertEqual(infer_type('arcane').kind,ValueKind.STRING)
 def test_homogeneous_list(self):self.assertEqual(infer_type([1,2]).describe(),'list[number]')
 def test_empty_list(self):self.assertEqual(infer_type([]).describe(),'list[unknown]')
 def test_heterogeneous_list(self):self.assertEqual(infer_type([1,'x']).describe(),'list[unknown]')
 def test_function(self):self.assertEqual(infer_type(lambda x:x).kind,ValueKind.FUNCTION)
 def test_unknown_object(self):self.assertEqual(infer_type(object()).kind,ValueKind.UNKNOWN)
 def test_typed_value(self):
  v=TypedValue(7,ValueType(ValueKind.NUMBER));self.assertEqual(v.value,7);self.assertEqual(v.type.kind,ValueKind.NUMBER)

if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_runtime 10.py

- Type: PY
- SHA-256: `1b5961192aac29fdbabbf0fd2bbc840e382388e611caaced12fe70df2f227082`
- Extracted characters: 2538

~~~text
import unittest
from arcane_runtime import ArcaneRuntime, Quantity
from arcane_diagnostics import ArcaneDiagnosticError, ErrorCode

class RuntimeTests(unittest.TestCase):
 def setUp(self): self.r=ArcaneRuntime()
 def test_number(self): self.assertEqual(self.r.evaluate('4').value,4)
 def test_add(self): self.assertEqual(self.r.evaluate('FRAPA 2 3').value,5)
 def test_subtract(self): self.assertEqual(self.r.evaluate('FRALA 8 3').value,5)
 def test_multiply(self): self.assertEqual(self.r.evaluate('FRATA 2 3').value,6)
 def test_divide(self): self.assertEqual(self.r.evaluate('FRAKA 8 2').value,4)
 def test_divide_zero_diagnostic(self):
  with self.assertRaises(ArcaneDiagnosticError) as e: self.r.evaluate('FRAKA 1 0')
  self.assertEqual(e.exception.diagnostic.code,ErrorCode.DIVISION_BY_ZERO)
 def test_unknown_name_diagnostic(self):
  with self.assertRaises(ArcaneDiagnosticError) as e: self.r.evaluate('$missing')
  self.assertEqual(e.exception.diagnostic.code,ErrorCode.UNKNOWN_NAME)
 def test_units_add_same(self): self.assertEqual(self.r.evaluate('FRAPA m cm').dimensions,(1,0,0))
 def test_units_mismatch(self):
  with self.assertRaises(ArcaneDiagnosticError) as e: self.r.evaluate('FRAPA m s')
  self.assertEqual(e.exception.diagnostic.code,ErrorCode.DIMENSION_MISMATCH)
 def test_product_dimensions(self): self.assertEqual(self.r.evaluate('FRATA m s').dimensions,(1,1,0))
 def test_comparison(self): self.assertTrue(self.r.evaluate('FRAGT 3 2'))
 def test_equality(self): self.assertTrue(self.r.evaluate('FRAEQ 3 3'))
 def test_logic(self): self.assertTrue(self.r.evaluate('FRAND 1 1'))
 def test_not(self): self.assertTrue(self.r.evaluate('FRNOT 0'))
 def test_parentheses(self): self.assertEqual(self.r.evaluate('( FRAPA 2 3 )').value,5)
 def test_define_and_lookup(self):
  self.r.run_line('KWAM total => FRAPA 2 3'); self.assertEqual(self.r.run_line('KWAT total').value,5)
 def test_duplicate_binding(self):
  self.r.run_line('KWAM x => 1'); out=self.r.run_line('KWAM x => 2'); self.assertEqual(out.code,ErrorCode.DUPLICATE_BINDING)
 def test_trailing_token(self):
  with self.assertRaises(ArcaneDiagnosticError) as e: self.r.evaluate('1 2')
  self.assertEqual(e.exception.diagnostic.code,ErrorCode.PARSE_ERROR)
 def test_invalid_token(self):
  with self.assertRaises(ArcaneDiagnosticError): self.r.evaluate('@')
 def test_dimensionless_one_truth(self): self.assertTrue(self.r.evaluate('FRNOT 0'))
 def test_zero_is_not_true(self): self.assertFalse(self.r.evaluate('FRAND 0 1'))

if __name__=='__main__': unittest.main()

~~~

## test_arcane_runtime 11.py

- Type: PY
- SHA-256: `a849f6351622fd039e77a1485aa69e7cfd71780a7d2515d540cadce792b329dd`
- Extracted characters: 4055

~~~text
import unittest
from arcane_runtime import ArcaneRuntime, Quantity
from arcane_diagnostics import ArcaneDiagnosticError, ErrorCode

class RuntimeTests(unittest.TestCase):
 def setUp(self): self.r=ArcaneRuntime()
 def test_number(self): self.assertEqual(self.r.evaluate('4').value,4)
 def test_add(self): self.assertEqual(self.r.evaluate('FRAPA 2 3').value,5)
 def test_subtract(self): self.assertEqual(self.r.evaluate('FRALA 8 3').value,5)
 def test_multiply(self): self.assertEqual(self.r.evaluate('FRATA 2 3').value,6)
 def test_divide(self): self.assertEqual(self.r.evaluate('FRAKA 8 2').value,4)
 def test_divide_zero_diagnostic(self):
  with self.assertRaises(ArcaneDiagnosticError) as e: self.r.evaluate('FRAKA 1 0')
  self.assertEqual(e.exception.diagnostic.code,ErrorCode.DIVISION_BY_ZERO)
 def test_unknown_name_diagnostic(self):
  with self.assertRaises(ArcaneDiagnosticError) as e: self.r.evaluate('$missing')
  self.assertEqual(e.exception.diagnostic.code,ErrorCode.UNKNOWN_NAME)
 def test_units_add_same(self): self.assertEqual(self.r.evaluate('FRAPA m cm').dimensions,(1,0,0))
 def test_units_mismatch(self):
  with self.assertRaises(ArcaneDiagnosticError) as e: self.r.evaluate('FRAPA m s')
  self.assertEqual(e.exception.diagnostic.code,ErrorCode.DIMENSION_MISMATCH)
 def test_product_dimensions(self): self.assertEqual(self.r.evaluate('FRATA m s').dimensions,(1,1,0))
 def test_comparison(self): self.assertTrue(self.r.evaluate('FRAGT 3 2'))
 def test_equality(self): self.assertTrue(self.r.evaluate('FRAEQ 3 3'))
 def test_logic(self): self.assertTrue(self.r.evaluate('FRAND 1 1'))
 def test_not(self): self.assertTrue(self.r.evaluate('FRNOT 0'))
 def test_parentheses(self): self.assertEqual(self.r.evaluate('( FRAPA 2 3 )').value,5)
 def test_define_and_lookup(self):
  self.r.run_line('KWAM total => FRAPA 2 3'); self.assertEqual(self.r.run_line('KWAT total').value,5)
 def test_duplicate_binding(self):
  self.r.run_line('KWAM x => 1'); out=self.r.run_line('KWAM x => 2'); self.assertEqual(out.code,ErrorCode.DUPLICATE_BINDING)
 def test_trailing_token(self):
  with self.assertRaises(ArcaneDiagnosticError) as e: self.r.evaluate('1 2')
  self.assertEqual(e.exception.diagnostic.code,ErrorCode.PARSE_ERROR)
 def test_invalid_token(self):
  with self.assertRaises(ArcaneDiagnosticError): self.r.evaluate('@')
 def test_dimensionless_one_truth(self): self.assertTrue(self.r.evaluate('FRNOT 0'))
 def test_zero_is_not_true(self): self.assertFalse(self.r.evaluate('FRAND 0 1'))

if __name__=='__main__': unittest.main()

class Phase7MIntegrationTests(unittest.TestCase):
 def setUp(self): self.r=ArcaneRuntime()
 def test_bounded_repetition(self):
  out=self.r.run_line('KWAR i FROM 1 TO 3 => FRATA $i $i')
  self.assertEqual([x.value for x in out],[1,4,9])
 def test_repetition_empty_range(self): self.assertEqual(self.r.run_line('KWAR i FROM 3 TO 1 => $i'),[])
 def test_repetition_scope_does_not_leak(self):
  self.r.run_line('KWAR i FROM 1 TO 2 => $i')
  out=self.r.run_line('KWAT i'); self.assertEqual(out.code,ErrorCode.UNKNOWN_NAME)
 def test_bounded_aggregation(self): self.assertEqual(self.r.run_line('KWAS total FROM 1 TO 5 => $total').value,15)
 def test_aggregation_squares(self): self.assertEqual(self.r.run_line('KWAS total FROM 1 TO 3 => FRATA $total $total').value,14)
 def test_aggregation_empty_range(self): self.assertEqual(self.r.run_line('KWAS total FROM 3 TO 1 => $total').value,0)
 def test_aggregation_iteration_limit(self):
  self.r.max_iterations=3
  out=self.r.run_line('KWAR i FROM 1 TO 4 => $i'); self.assertEqual(out.code,ErrorCode.ITERATION_LIMIT)
 def test_invalid_bound(self):
  out=self.r.run_line('KWAR i FROM m TO 3 => $i'); self.assertEqual(out.code,ErrorCode.INVALID_BOUNDS)
 def test_and_short_circuits(self): self.assertFalse(self.r.evaluate('FRAND 0 $missing'))
 def test_or_short_circuits(self): self.assertTrue(self.r.evaluate('FROR 1 $missing'))
 def test_aggregation_preserves_dimensions(self): self.assertEqual(self.r.run_line('KWAS total FROM 1 TO 3 => FRATA $total m').dimensions,(1,0,0))

~~~

## test_arcane_runtime 12.py

- Type: PY
- SHA-256: `a5ff64daea84b5bb473bab92d766e0c991012aeda7596c19770fae3f75abf80d`
- Extracted characters: 3272

~~~text
import unittest
from arcane_runtime import ArcaneRuntime, Quantity, Diagnostic, show

class Phase7NTests(unittest.TestCase):
 def setUp(self): self.r=ArcaneRuntime()
 def test_function_define(self): self.assertIn('defined',self.r.run_line('KWAF square(x) => FRATA $x $x'))
 def test_function_call(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual(self.r.evaluate('square(4)').value,16)
 def test_function_multiple_args(self):
  self.r.run_line('KWAF add(x, y) => FRAPA $x $y'); self.assertEqual(self.r.evaluate('add(4, 5)').value,9)
 def test_function_nested(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.r.run_line('KWAF fourth(x) => square(square($x))'); self.assertEqual(self.r.evaluate('fourth(2)').value,16)
 def test_function_scope(self):
  self.r.run_line('KWAF ident(x) => $x'); self.r.evaluate('ident(2)')
  self.assertEqual(self.r.run_line('KWAT x').code,'ARC-NAME-001')
 def test_wrong_arity(self):
  self.r.run_line('KWAF ident(x) => $x'); self.assertEqual(self.r.run_line('ident()').code,'ARC-TYPE-001')
 def test_duplicate_function_parameter(self): self.assertEqual(self.r.run_line('KWAF bad(x,x) => $x').code,'ARC-PARSE-001')
 def test_duplicate_function_name(self):
  self.r.run_line('KWAF f(x) => $x'); self.assertEqual(self.r.run_line('KWAF f(y) => $y').code,'ARC-NAME-002')
 def test_unknown_parameter_in_body(self):
  self.r.run_line('KWAF bad(x) => $z'); self.assertEqual(self.r.run_line('bad(1)').code,'ARC-NAME-001')
 def test_recursion_limit(self):
  self.r.max_call_depth=5; self.r.run_line('KWAF loop(x) => loop($x)'); out=self.r.run_line('loop(1)'); self.assertEqual(out.code,'ARC-RUNTIME-001')
 def test_function_with_unit(self):
  self.r.run_line('KWAF twice(x) => FRATA $x 2'); self.assertEqual(self.r.evaluate('twice(m)').dimensions,(1,0,0))
 def test_repetition(self): self.assertEqual([x.value for x in self.r.run_line('KWAR i FROM 1 TO 3 => FRATA $i $i')],[1,4,9])
 def test_aggregation(self): self.assertEqual(self.r.run_line('KWAS s FROM 1 TO 5 => $s').value,15)
 def test_short_circuit_and(self): self.assertFalse(self.r.evaluate('FRAND 0 $missing'))
 def test_short_circuit_or(self): self.assertTrue(self.r.evaluate('FROR 1 $missing'))
 def test_units_mismatch(self): self.assertEqual(self.r.run_line('FRAPA m s').code,'ARC-UNIT-001')
 def test_div_zero(self): self.assertEqual(self.r.run_line('FRAKA 1 0').code,'ARC-MATH-001')
 def test_iteration_limit(self): self.r.max_iterations=2; self.assertEqual(self.r.run_line('KWAR i FROM 1 TO 3 => $i').code,'ARC-LOOP-002')
 def test_binding(self): self.r.run_line('KWAM total => FRAPA 2 3'); self.assertEqual(self.r.run_line('KWAT total').value,5)
 def test_unknown_name(self): self.assertEqual(self.r.run_line('$wat').code,'ARC-NAME-001')
 def test_show(self): self.assertEqual(show(Quantity(3)),'3 dimensionless')
 def test_function_inside_repetition(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual([x.value for x in self.r.run_line('KWAR i FROM 1 TO 3 => square($i)')],[1,4,9])
 def test_function_inside_aggregation(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual(self.r.run_line('KWAS total FROM 1 TO 3 => square($total)').value,14)

if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_runtime 13.py

- Type: PY
- SHA-256: `0dc50840b6b59def74ea3b58150a04233af96c2c0c5d287d8e04429db9b97ec7`
- Extracted characters: 4047

~~~text
import unittest
from arcane_runtime import ArcaneRuntime, Quantity, Diagnostic, show

class Phase7NTests(unittest.TestCase):
 def setUp(self): self.r=ArcaneRuntime()
 def test_function_define(self): self.assertIn('defined',self.r.run_line('KWAF square(x) => FRATA $x $x'))
 def test_function_call(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual(self.r.evaluate('square(4)').value,16)
 def test_function_multiple_args(self):
  self.r.run_line('KWAF add(x, y) => FRAPA $x $y'); self.assertEqual(self.r.evaluate('add(4, 5)').value,9)
 def test_function_nested(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.r.run_line('KWAF fourth(x) => square(square($x))'); self.assertEqual(self.r.evaluate('fourth(2)').value,16)
 def test_function_scope(self):
  self.r.run_line('KWAF ident(x) => $x'); self.r.evaluate('ident(2)')
  self.assertEqual(self.r.run_line('KWAT x').code,'ARC-NAME-001')
 def test_wrong_arity(self):
  self.r.run_line('KWAF ident(x) => $x'); self.assertEqual(self.r.run_line('ident()').code,'ARC-TYPE-001')
 def test_duplicate_function_parameter(self): self.assertEqual(self.r.run_line('KWAF bad(x,x) => $x').code,'ARC-PARSE-001')
 def test_duplicate_function_name(self):
  self.r.run_line('KWAF f(x) => $x'); self.assertEqual(self.r.run_line('KWAF f(y) => $y').code,'ARC-NAME-002')
 def test_unknown_parameter_in_body(self):
  self.r.run_line('KWAF bad(x) => $z'); self.assertEqual(self.r.run_line('bad(1)').code,'ARC-NAME-001')
 def test_recursion_limit(self):
  self.r.max_call_depth=5; self.r.run_line('KWAF loop(x) => loop($x)'); out=self.r.run_line('loop(1)'); self.assertEqual(out.code,'ARC-RUNTIME-001')
 def test_function_with_unit(self):
  self.r.run_line('KWAF twice(x) => FRATA $x 2'); self.assertEqual(self.r.evaluate('twice(m)').dimensions,(1,0,0))
 def test_repetition(self): self.assertEqual([x.value for x in self.r.run_line('KWAR i FROM 1 TO 3 => FRATA $i $i')],[1,4,9])
 def test_aggregation(self): self.assertEqual(self.r.run_line('KWAS s FROM 1 TO 5 => $s').value,15)
 def test_short_circuit_and(self): self.assertFalse(self.r.evaluate('FRAND 0 $missing'))
 def test_short_circuit_or(self): self.assertTrue(self.r.evaluate('FROR 1 $missing'))
 def test_units_mismatch(self): self.assertEqual(self.r.run_line('FRAPA m s').code,'ARC-UNIT-001')
 def test_div_zero(self): self.assertEqual(self.r.run_line('FRAKA 1 0').code,'ARC-MATH-001')
 def test_iteration_limit(self): self.r.max_iterations=2; self.assertEqual(self.r.run_line('KWAR i FROM 1 TO 3 => $i').code,'ARC-LOOP-002')
 def test_binding(self): self.r.run_line('KWAM total => FRAPA 2 3'); self.assertEqual(self.r.run_line('KWAT total').value,5)
 def test_unknown_name(self): self.assertEqual(self.r.run_line('$wat').code,'ARC-NAME-001')
 def test_show(self): self.assertEqual(show(Quantity(3)),'3 dimensionless')
 def test_function_inside_repetition(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual([x.value for x in self.r.run_line('KWAR i FROM 1 TO 3 => square($i)')],[1,4,9])
 def test_function_inside_aggregation(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual(self.r.run_line('KWAS total FROM 1 TO 3 => square($total)').value,14)
 def test_conditional_true(self): self.assertEqual(self.r.run_line('KWAI FRAGT 5 3 THEN FRAPA 10 2 ELSE 0').value,12)
 def test_conditional_false(self): self.assertEqual(self.r.run_line('KWAI FRALT 5 3 THEN 1 ELSE 9').value,9)
 def test_conditional_requires_branches(self): self.assertEqual(self.r.run_line('KWAI FRAGT 5 3').code,'ARC-PARSE-001')
 def test_multiline_program(self):
  result=self.r.run_program('# example\nKWAM x => 4\nKWAM y => FRATA $x $x\nKWAT y')
  self.assertEqual(len(result),3); self.assertEqual(result[-1].value,16)
 def test_program_stops_on_error_with_line(self):
  result=self.r.run_program('KWAM x => 1\n$missing\nKWAM y => 2')
  self.assertEqual(result.code,'ARC-NAME-001'); self.assertEqual(result.line,2); self.assertNotIn('y',self.r.bindings)

if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_runtime 14.py

- Type: PY
- SHA-256: `8adb03f5201caa9c8abeffcd2856d091c68c7339fe081d9f5e8cace3bfa58872`
- Extracted characters: 5552

~~~text
import unittest
from arcane_runtime import ArcaneRuntime, Quantity, Diagnostic, show

class Phase7NTests(unittest.TestCase):
 def setUp(self): self.r=ArcaneRuntime()
 def test_function_define(self): self.assertIn('defined',self.r.run_line('KWAF square(x) => FRATA $x $x'))
 def test_function_call(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual(self.r.evaluate('square(4)').value,16)
 def test_function_multiple_args(self):
  self.r.run_line('KWAF add(x, y) => FRAPA $x $y'); self.assertEqual(self.r.evaluate('add(4, 5)').value,9)
 def test_function_nested(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.r.run_line('KWAF fourth(x) => square(square($x))'); self.assertEqual(self.r.evaluate('fourth(2)').value,16)
 def test_function_scope(self):
  self.r.run_line('KWAF ident(x) => $x'); self.r.evaluate('ident(2)')
  self.assertEqual(self.r.run_line('KWAT x').code,'ARC-NAME-001')
 def test_wrong_arity(self):
  self.r.run_line('KWAF ident(x) => $x'); self.assertEqual(self.r.run_line('ident()').code,'ARC-TYPE-001')
 def test_duplicate_function_parameter(self): self.assertEqual(self.r.run_line('KWAF bad(x,x) => $x').code,'ARC-PARSE-001')
 def test_duplicate_function_name(self):
  self.r.run_line('KWAF f(x) => $x'); self.assertEqual(self.r.run_line('KWAF f(y) => $y').code,'ARC-NAME-002')
 def test_unknown_parameter_in_body(self):
  self.r.run_line('KWAF bad(x) => $z'); self.assertEqual(self.r.run_line('bad(1)').code,'ARC-NAME-001')
 def test_recursion_limit(self):
  self.r.max_call_depth=5; self.r.run_line('KWAF loop(x) => loop($x)'); out=self.r.run_line('loop(1)'); self.assertEqual(out.code,'ARC-RUNTIME-001')
 def test_function_with_unit(self):
  self.r.run_line('KWAF twice(x) => FRATA $x 2'); self.assertEqual(self.r.evaluate('twice(m)').dimensions,(1,0,0))
 def test_repetition(self): self.assertEqual([x.value for x in self.r.run_line('KWAR i FROM 1 TO 3 => FRATA $i $i')],[1,4,9])
 def test_aggregation(self): self.assertEqual(self.r.run_line('KWAS s FROM 1 TO 5 => $s').value,15)
 def test_short_circuit_and(self): self.assertFalse(self.r.evaluate('FRAND 0 $missing'))
 def test_short_circuit_or(self): self.assertTrue(self.r.evaluate('FROR 1 $missing'))
 def test_units_mismatch(self): self.assertEqual(self.r.run_line('FRAPA m s').code,'ARC-UNIT-001')
 def test_div_zero(self): self.assertEqual(self.r.run_line('FRAKA 1 0').code,'ARC-MATH-001')
 def test_iteration_limit(self): self.r.max_iterations=2; self.assertEqual(self.r.run_line('KWAR i FROM 1 TO 3 => $i').code,'ARC-LOOP-002')
 def test_binding(self): self.r.run_line('KWAM total => FRAPA 2 3'); self.assertEqual(self.r.run_line('KWAT total').value,5)
 def test_unknown_name(self): self.assertEqual(self.r.run_line('$wat').code,'ARC-NAME-001')
 def test_show(self): self.assertEqual(show(Quantity(3)),'3 dimensionless')
 def test_function_inside_repetition(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual([x.value for x in self.r.run_line('KWAR i FROM 1 TO 3 => square($i)')],[1,4,9])
 def test_function_inside_aggregation(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual(self.r.run_line('KWAS total FROM 1 TO 3 => square($total)').value,14)
 def test_conditional_true(self): self.assertEqual(self.r.run_line('KWAI FRAGT 5 3 THEN FRAPA 10 2 ELSE 0').value,12)
 def test_conditional_false(self): self.assertEqual(self.r.run_line('KWAI FRALT 5 3 THEN 1 ELSE 9').value,9)
 def test_conditional_requires_branches(self): self.assertEqual(self.r.run_line('KWAI FRAGT 5 3').code,'ARC-PARSE-001')
 def test_multiline_program(self):
  result=self.r.run_program('# example\nKWAM x => 4\nKWAM y => FRATA $x $x\nKWAT y')
  self.assertEqual(len(result),3); self.assertEqual(result[-1].value,16)
 def test_program_stops_on_error_with_line(self):
  result=self.r.run_program('KWAM x => 1\n$missing\nKWAM y => 2')
  self.assertEqual(result.code,'ARC-NAME-001'); self.assertEqual(result.line,2); self.assertNotIn('y',self.r.bindings)


 def test_structured_conditional_true_multistep(self):
  out=self.r.run_program("""KWAM score => 8
KWAI FRAGT $score 5 THEN
  KWAM bonus => 2
  KWAM answer => FRAPA $score $bonus
  KWAT answer
ELSE
  KWAM answer => 0
  KWAT answer
END""")
  self.assertEqual(len(out),4); self.assertEqual(out[-1].value,10)
 def test_structured_conditional_false_multistep(self):
  out=self.r.run_program("""KWAM score => 2
KWAI FRAGT $score 5 THEN
  KWAM result => 100
ELSE
  KWAM result => FRAPA $score 3
  KWAT result
END""")
  self.assertEqual(len(out),3); self.assertEqual(out[-1].value,5)
 def test_block_binding_does_not_leak(self):
  self.r.run_program("""KWAI FRAGT 2 1 THEN
  KWAM secret => 7
  KWAT secret
END""")
  self.assertEqual(self.r.run_line('KWAT secret').code,'ARC-NAME-001')
 def test_nested_conditional_blocks(self):
  out=self.r.run_program("""KWAI FRAGT 3 2 THEN
  KWAI FRAEQ 1 1 THEN
    KWAM result => 42
    KWAT result
  ELSE
    KWAM result => 0
  END
ELSE
  KWAM other => 9
END""")
  self.assertEqual(out[-1].value,42)
 def test_missing_end_is_diagnostic(self):
  out=self.r.run_program('KWAI FRAGT 2 1 THEN\nKWAM x => 3')
  self.assertEqual(out.code,'ARC-PARSE-001')
 def test_unexpected_end_is_diagnostic(self):
  out=self.r.run_program('END')
  self.assertEqual(out.code,'ARC-PARSE-001')
 def test_error_inside_branch_has_source_line(self):
  out=self.r.run_program('KWAI FRAGT 2 1 THEN\nKWAM x => $missing\nEND')
  self.assertEqual(out.code,'ARC-NAME-001'); self.assertEqual(out.line,2)

if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_runtime 15.py

- Type: PY
- SHA-256: `a90bdf5aa235f55bcf3e9ed5a850b9913646694a9f76f1b60c04ebf7d867d327`
- Extracted characters: 6615

~~~text
import unittest
from arcane_runtime import ArcaneRuntime, Quantity, Diagnostic, show

class Phase7NTests(unittest.TestCase):
 def setUp(self): self.r=ArcaneRuntime()
 def test_function_define(self): self.assertIn('defined',self.r.run_line('KWAF square(x) => FRATA $x $x'))
 def test_function_call(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual(self.r.evaluate('square(4)').value,16)
 def test_function_multiple_args(self):
  self.r.run_line('KWAF add(x, y) => FRAPA $x $y'); self.assertEqual(self.r.evaluate('add(4, 5)').value,9)
 def test_function_nested(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.r.run_line('KWAF fourth(x) => square(square($x))'); self.assertEqual(self.r.evaluate('fourth(2)').value,16)
 def test_function_scope(self):
  self.r.run_line('KWAF ident(x) => $x'); self.r.evaluate('ident(2)')
  self.assertEqual(self.r.run_line('KWAT x').code,'ARC-NAME-001')
 def test_wrong_arity(self):
  self.r.run_line('KWAF ident(x) => $x'); self.assertEqual(self.r.run_line('ident()').code,'ARC-TYPE-001')
 def test_duplicate_function_parameter(self): self.assertEqual(self.r.run_line('KWAF bad(x,x) => $x').code,'ARC-PARSE-001')
 def test_duplicate_function_name(self):
  self.r.run_line('KWAF f(x) => $x'); self.assertEqual(self.r.run_line('KWAF f(y) => $y').code,'ARC-NAME-002')
 def test_unknown_parameter_in_body(self):
  self.r.run_line('KWAF bad(x) => $z'); self.assertEqual(self.r.run_line('bad(1)').code,'ARC-NAME-001')
 def test_recursion_limit(self):
  self.r.max_call_depth=5; self.r.run_line('KWAF loop(x) => loop($x)'); out=self.r.run_line('loop(1)'); self.assertEqual(out.code,'ARC-RUNTIME-001')
 def test_function_with_unit(self):
  self.r.run_line('KWAF twice(x) => FRATA $x 2'); self.assertEqual(self.r.evaluate('twice(m)').dimensions,(1,0,0))
 def test_repetition(self): self.assertEqual([x.value for x in self.r.run_line('KWAR i FROM 1 TO 3 => FRATA $i $i')],[1,4,9])
 def test_aggregation(self): self.assertEqual(self.r.run_line('KWAS s FROM 1 TO 5 => $s').value,15)
 def test_short_circuit_and(self): self.assertFalse(self.r.evaluate('FRAND 0 $missing'))
 def test_short_circuit_or(self): self.assertTrue(self.r.evaluate('FROR 1 $missing'))
 def test_units_mismatch(self): self.assertEqual(self.r.run_line('FRAPA m s').code,'ARC-UNIT-001')
 def test_div_zero(self): self.assertEqual(self.r.run_line('FRAKA 1 0').code,'ARC-MATH-001')
 def test_iteration_limit(self): self.r.max_iterations=2; self.assertEqual(self.r.run_line('KWAR i FROM 1 TO 3 => $i').code,'ARC-LOOP-002')
 def test_binding(self): self.r.run_line('KWAM total => FRAPA 2 3'); self.assertEqual(self.r.run_line('KWAT total').value,5)
 def test_unknown_name(self): self.assertEqual(self.r.run_line('$wat').code,'ARC-NAME-001')
 def test_show(self): self.assertEqual(show(Quantity(3)),'3 dimensionless')
 def test_function_inside_repetition(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual([x.value for x in self.r.run_line('KWAR i FROM 1 TO 3 => square($i)')],[1,4,9])
 def test_function_inside_aggregation(self):
  self.r.run_line('KWAF square(x) => FRATA $x $x'); self.assertEqual(self.r.run_line('KWAS total FROM 1 TO 3 => square($total)').value,14)
 def test_conditional_true(self): self.assertEqual(self.r.run_line('KWAI FRAGT 5 3 THEN FRAPA 10 2 ELSE 0').value,12)
 def test_conditional_false(self): self.assertEqual(self.r.run_line('KWAI FRALT 5 3 THEN 1 ELSE 9').value,9)
 def test_conditional_requires_branches(self): self.assertEqual(self.r.run_line('KWAI FRAGT 5 3').code,'ARC-PARSE-001')
 def test_multiline_program(self):
  result=self.r.run_program('# example\nKWAM x => 4\nKWAM y => FRATA $x $x\nKWAT y')
  self.assertEqual(len(result),3); self.assertEqual(result[-1].value,16)
 def test_program_stops_on_error_with_line(self):
  result=self.r.run_program('KWAM x => 1\n$missing\nKWAM y => 2')
  self.assertEqual(result.code,'ARC-NAME-001'); self.assertEqual(result.line,2); self.assertNotIn('y',self.r.bindings)


 def test_structured_conditional_true_multistep(self):
  out=self.r.run_program("""KWAM score => 8
KWAI FRAGT $score 5 THEN
  KWAM bonus => 2
  KWAM answer => FRAPA $score $bonus
  KWAT answer
ELSE
  KWAM answer => 0
  KWAT answer
END""")
  self.assertEqual(len(out),4); self.assertEqual(out[-1].value,10)
 def test_structured_conditional_false_multistep(self):
  out=self.r.run_program("""KWAM score => 2
KWAI FRAGT $score 5 THEN
  KWAM result => 100
ELSE
  KWAM result => FRAPA $score 3
  KWAT result
END""")
  self.assertEqual(len(out),3); self.assertEqual(out[-1].value,5)
 def test_block_binding_does_not_leak(self):
  self.r.run_program("""KWAI FRAGT 2 1 THEN
  KWAM secret => 7
  KWAT secret
END""")
  self.assertEqual(self.r.run_line('KWAT secret').code,'ARC-NAME-001')
 def test_nested_conditional_blocks(self):
  out=self.r.run_program("""KWAI FRAGT 3 2 THEN
  KWAI FRAEQ 1 1 THEN
    KWAM result => 42
    KWAT result
  ELSE
    KWAM result => 0
  END
ELSE
  KWAM other => 9
END""")
  self.assertEqual(out[-1].value,42)
 def test_missing_end_is_diagnostic(self):
  out=self.r.run_program('KWAI FRAGT 2 1 THEN\nKWAM x => 3')
  self.assertEqual(out.code,'ARC-PARSE-001')
 def test_unexpected_end_is_diagnostic(self):
  out=self.r.run_program('END')
  self.assertEqual(out.code,'ARC-PARSE-001')
 def test_error_inside_branch_has_source_line(self):
  out=self.r.run_program('KWAI FRAGT 2 1 THEN\nKWAM x => $missing\nEND')
  self.assertEqual(out.code,'ARC-NAME-001'); self.assertEqual(out.line,2)


 def test_parse_error_does_not_partially_execute(self):
  out=self.r.run_program("KWAM before => 1\nKWAI FRAGT 2 1 THEN\nKWAM inside => 2")
  self.assertEqual(out.code,'ARC-PARSE-001')
  self.assertNotIn('before',self.r.bindings)
 def test_file_program_preserves_comments_and_line_numbers(self):
  out=self.r.run_program("# header\n\nKWAM x => 3\nKWAT missing")
  self.assertEqual(out.code,'ARC-NAME-001'); self.assertEqual(out.line,4)
 def test_nested_block_local_bindings_do_not_escape(self):
  self.r.run_program("KWAI FRAGT 2 1 THEN\nKWAI FRAEQ 1 1 THEN\nKWAM inner => 5\nEND\nEND")
  self.assertEqual(self.r.run_line('KWAT inner').code,'ARC-NAME-001')
 def test_else_branch_not_executed(self):
  out=self.r.run_program("KWAI FRAGT 2 1 THEN\nKWAM selected => 7\nELSE\nKWAM missing_branch => $unknown\nEND")
  self.assertEqual(len(out),1); self.assertEqual(out[0].value,7)
 def test_program_can_call_declared_function(self):
  out=self.r.run_program("KWAF double(x) => FRATA $x 2\nKWAM result => double(6)\nKWAT result")
  self.assertEqual(out[-1].value,12)

if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_runtime 16.py

- Type: PY
- SHA-256: `8ee17b26da25c33ac9db6a270682fe6542fcaa7960df01c539dd05d49a2073d6`
- Extracted characters: 1702

~~~text
import unittest
from arcane_runtime import ArcaneRuntime, Diagnostic
class RuntimeTests(unittest.TestCase):
 def runp(self,s): return ArcaneRuntime().run_program(s)
 def test_binding_arithmetic_output(self): self.assertEqual(self.runp('KWAM x => (4 + 3) * 2\nKWAT x'),[14])
 def test_function_call(self): self.assertEqual(self.runp('KWAF square(x) => FRATA $x $x\nKWAM result => square(5)\nKWAT result'),[25])
 def test_conditional_true(self): self.assertEqual(self.runp('KWAM x => 7\nKWAI FRAGT $x 5 THEN\nKWAT x\nELSE\nKWAT x\nEND'),[7])
 def test_conditional_false(self): self.assertEqual(self.runp('KWAI FRAGT 2 5 THEN\nKWAM x => 1\nELSE\nKWAM y => 9\nKWAT y\nEND'),[9])
 def test_nested_conditional(self): self.assertEqual(self.runp('KWAI FRAEQ 1 1 THEN\nKWAI FRAGT 3 2 THEN\nKWAM inner => 4\nKWAT inner\nEND\nEND'),[4])
 def test_missing_end(self): self.assertEqual(self.runp('KWAI FRAEQ 1 1 THEN\nKWAM x => 2').code,'ARC-PARSE-001')
 def test_unresolved_binding(self): self.assertEqual(self.runp('KWAM x => $nope').code,'ARC-SEM-005')
 def test_wrong_arity(self): self.assertEqual(self.runp('KWAF f(x) => $x\nKWAM result => f(1,2)').code,'ARC-SEM-007')
 def test_undefined_function(self): self.assertEqual(self.runp('KWAM x => missing(1)').code,'ARC-SEM-006')
 def test_parse_before_execution(self):
  rt=ArcaneRuntime(); out=rt.run_program('KWAM x => 1\nKWAI FRAEQ 1 1 THEN')
  self.assertEqual(out.code,'ARC-PARSE-001'); self.assertNotIn('x',rt.globals)
 def test_division_by_zero(self): self.assertEqual(self.runp('KWAM x => 1 / 0').code,'ARC-RUN-001')
 def test_comments(self): self.assertEqual(self.runp('# hi\nKWAM x => 2\nKWAT x'),[2])
if __name__=='__main__': unittest.main(verbosity=2)

~~~

## test_arcane_runtime 17.py

- Type: PY
- SHA-256: `8ee17b26da25c33ac9db6a270682fe6542fcaa7960df01c539dd05d49a2073d6`
- Extracted characters: 1702

~~~text
import unittest
from arcane_runtime import ArcaneRuntime, Diagnostic
class RuntimeTests(unittest.TestCase):
 def runp(self,s): return ArcaneRuntime().run_program(s)
 def test_binding_arithmetic_output(self): self.assertEqual(self.runp('KWAM x => (4 + 3) * 2\nKWAT x'),[14])
 def test_function_call(self): self.assertEqual(self.runp('KWAF square(x) => FRATA $x $x\nKWAM result => square(5)\nKWAT result'),[25])
 def test_conditional_true(self): self.assertEqual(self.runp('KWAM x => 7\nKWAI FRAGT $x 5 THEN\nKWAT x\nELSE\nKWAT x\nEND'),[7])
 def test_conditional_false(self): self.assertEqual(self.runp('KWAI FRAGT 2 5 THEN\nKWAM x => 1\nELSE\nKWAM y => 9\nKWAT y\nEND'),[9])
 def test_nested_conditional(self): self.assertEqual(self.runp('KWAI FRAEQ 1 1 THEN\nKWAI FRAGT 3 2 THEN\nKWAM inner => 4\nKWAT inner\nEND\nEND'),[4])
 def test_missing_end(self): self.assertEqual(self.runp('KWAI FRAEQ 1 1 THEN\nKWAM x => 2').code,'ARC-PARSE-001')
 def test_unresolved_binding(self): self.assertEqual(self.runp('KWAM x => $nope').code,'ARC-SEM-005')
 def test_wrong_arity(self): self.assertEqual(self.runp('KWAF f(x) => $x\nKWAM result => f(1,2)').code,'ARC-SEM-007')
 def test_undefined_function(self): self.assertEqual(self.runp('KWAM x => missing(1)').code,'ARC-SEM-006')
 def test_parse_before_execution(self):
  rt=ArcaneRuntime(); out=rt.run_program('KWAM x => 1\nKWAI FRAEQ 1 1 THEN')
  self.assertEqual(out.code,'ARC-PARSE-001'); self.assertNotIn('x',rt.globals)
 def test_division_by_zero(self): self.assertEqual(self.runp('KWAM x => 1 / 0').code,'ARC-RUN-001')
 def test_comments(self): self.assertEqual(self.runp('# hi\nKWAM x => 2\nKWAT x'),[2])
if __name__=='__main__': unittest.main(verbosity=2)

~~~

## test_arcane_runtime 2.py

- Type: PY
- SHA-256: `950a8009969fcc1ee20ca0dbd5c0d5ed1ecd39e5cfeeea68804068b05c614745`
- Extracted characters: 3231

~~~text
import unittest
from arcane_runtime import Environment, format_quantity, ArcaneBindingError, ArcaneTypeError, ArcaneParseError
class StateScopeTests(unittest.TestCase):
 def setUp(self): self.e=Environment()
 def test_state_updates(self):
  self.e.execute('KWAS x = 2'); self.e.execute('KWAS x <- 5'); self.assertEqual(format_quantity(self.e.execute('KWAT x')),'5 1')
 def test_live_reacts_to_update(self):
  self.e.execute('KWAS x = 2'); self.e.execute('KWAK y = FRAPA $x 3'); self.assertEqual(format_quantity(self.e.execute('KWAT y')),'5 1'); self.e.execute('KWAS x <- 7'); self.assertEqual(format_quantity(self.e.execute('KWAT y')),'10 1')
 def test_state_dimension_cannot_change(self):
  self.e.execute('KWAS d = 2@m')
  with self.assertRaises(ArcaneTypeError): self.e.execute('KWAS d <- 4@s')
  self.assertEqual(format_quantity(self.e.execute('KWAT d')),'2 m')
 def test_immutable_value_cannot_update(self):
  self.e.execute('KWAM x = 2')
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAS x <- 3')
 def test_unknown_assignment_rejected(self):
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAS missing <- 3')
 def test_duplicate_same_scope_rejected(self):
  self.e.execute('KWAS x = 1')
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAM x = 2')
 def test_scope_shadowing(self):
  self.e.execute('KWAS x = 1'); self.e.push_scope(); self.e.execute('KWAM x = 2'); self.assertEqual(format_quantity(self.e.execute('KWAT x')),'2 1'); self.e.pop_scope(); self.assertEqual(format_quantity(self.e.execute('KWAT x')),'1 1')
 def test_outer_state_can_update_from_inner_scope(self):
  self.e.execute('KWAS x = 1'); self.e.push_scope(); self.e.execute('KWAS x <- 8'); self.e.pop_scope(); self.assertEqual(format_quantity(self.e.execute('KWAT x')),'8 1')
 def test_pop_global_scope_rejected(self):
  with self.assertRaises(ArcaneBindingError): self.e.pop_scope()
 def test_inner_scope_disappears(self):
  self.e.push_scope(); self.e.execute('KWAM local = 4'); self.e.pop_scope()
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAT local')
 def test_live_binding_in_inner_scope_sees_outer_state(self):
  self.e.execute('KWAS x = 2'); self.e.push_scope(); self.e.execute('KWAK y = FRAKA $x 3'); self.assertEqual(format_quantity(self.e.execute('KWAT y')),'6 1'); self.e.pop_scope()
 def test_failed_declaration_not_created(self):
  with self.assertRaises(ArcaneTypeError): self.e.execute('KWAM bad = FRAPA 1@m 2@s')
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAT bad')
 def test_live_cycle_detected(self):
  self.e._scopes[0]['a']=__import__('arcane_runtime').Binding('live',expression=__import__('arcane_runtime').parse('$b'))
  self.e._scopes[0]['b']=__import__('arcane_runtime').Binding('live',expression=__import__('arcane_runtime').parse('$a'))
  with self.assertRaises(ArcaneBindingError): self.e.resolve('a')
 def test_case_insensitive_names(self):
  self.e.execute('KWAS Count = 3'); self.e.execute('KWAS count <- 4'); self.assertEqual(format_quantity(self.e.execute('KWAT COUNT')),'4 1')
 def test_arithmetic_still_works(self): self.assertEqual(format_quantity(self.e.execute('FRAPA 2 3')),'5 1')
if __name__=='__main__': unittest.main(verbosity=2)

~~~

## test_arcane_runtime 3.py

- Type: PY
- SHA-256: `950a8009969fcc1ee20ca0dbd5c0d5ed1ecd39e5cfeeea68804068b05c614745`
- Extracted characters: 3231

~~~text
import unittest
from arcane_runtime import Environment, format_quantity, ArcaneBindingError, ArcaneTypeError, ArcaneParseError
class StateScopeTests(unittest.TestCase):
 def setUp(self): self.e=Environment()
 def test_state_updates(self):
  self.e.execute('KWAS x = 2'); self.e.execute('KWAS x <- 5'); self.assertEqual(format_quantity(self.e.execute('KWAT x')),'5 1')
 def test_live_reacts_to_update(self):
  self.e.execute('KWAS x = 2'); self.e.execute('KWAK y = FRAPA $x 3'); self.assertEqual(format_quantity(self.e.execute('KWAT y')),'5 1'); self.e.execute('KWAS x <- 7'); self.assertEqual(format_quantity(self.e.execute('KWAT y')),'10 1')
 def test_state_dimension_cannot_change(self):
  self.e.execute('KWAS d = 2@m')
  with self.assertRaises(ArcaneTypeError): self.e.execute('KWAS d <- 4@s')
  self.assertEqual(format_quantity(self.e.execute('KWAT d')),'2 m')
 def test_immutable_value_cannot_update(self):
  self.e.execute('KWAM x = 2')
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAS x <- 3')
 def test_unknown_assignment_rejected(self):
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAS missing <- 3')
 def test_duplicate_same_scope_rejected(self):
  self.e.execute('KWAS x = 1')
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAM x = 2')
 def test_scope_shadowing(self):
  self.e.execute('KWAS x = 1'); self.e.push_scope(); self.e.execute('KWAM x = 2'); self.assertEqual(format_quantity(self.e.execute('KWAT x')),'2 1'); self.e.pop_scope(); self.assertEqual(format_quantity(self.e.execute('KWAT x')),'1 1')
 def test_outer_state_can_update_from_inner_scope(self):
  self.e.execute('KWAS x = 1'); self.e.push_scope(); self.e.execute('KWAS x <- 8'); self.e.pop_scope(); self.assertEqual(format_quantity(self.e.execute('KWAT x')),'8 1')
 def test_pop_global_scope_rejected(self):
  with self.assertRaises(ArcaneBindingError): self.e.pop_scope()
 def test_inner_scope_disappears(self):
  self.e.push_scope(); self.e.execute('KWAM local = 4'); self.e.pop_scope()
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAT local')
 def test_live_binding_in_inner_scope_sees_outer_state(self):
  self.e.execute('KWAS x = 2'); self.e.push_scope(); self.e.execute('KWAK y = FRAKA $x 3'); self.assertEqual(format_quantity(self.e.execute('KWAT y')),'6 1'); self.e.pop_scope()
 def test_failed_declaration_not_created(self):
  with self.assertRaises(ArcaneTypeError): self.e.execute('KWAM bad = FRAPA 1@m 2@s')
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAT bad')
 def test_live_cycle_detected(self):
  self.e._scopes[0]['a']=__import__('arcane_runtime').Binding('live',expression=__import__('arcane_runtime').parse('$b'))
  self.e._scopes[0]['b']=__import__('arcane_runtime').Binding('live',expression=__import__('arcane_runtime').parse('$a'))
  with self.assertRaises(ArcaneBindingError): self.e.resolve('a')
 def test_case_insensitive_names(self):
  self.e.execute('KWAS Count = 3'); self.e.execute('KWAS count <- 4'); self.assertEqual(format_quantity(self.e.execute('KWAT COUNT')),'4 1')
 def test_arithmetic_still_works(self): self.assertEqual(format_quantity(self.e.execute('FRAPA 2 3')),'5 1')
if __name__=='__main__': unittest.main(verbosity=2)

~~~

## test_arcane_runtime 4.py

- Type: PY
- SHA-256: `e9466bc3e8d972a756eb9a6e55b0dde0feeb81f851b65cd23c579505a412c150`
- Extracted characters: 2600

~~~text
import unittest
from arcane_runtime import Environment,format_quantity,ArcaneBindingError,ArcaneTypeError
class FunctionTests(unittest.TestCase):
 def setUp(self):self.e=Environment()
 def test_function_basic(self):
  self.e.execute('KWAF add(a,b) => FRAPA $a $b');self.assertEqual(format_quantity(self.e.execute('KWAC add(2,3)')),'5 1')
 def test_function_typed_units(self):
  self.e.execute('KWAF extend(a,b) => FRAPA $a $b');self.assertEqual(format_quantity(self.e.execute('KWAC extend(2@m,30@cm)')),'2.3 m')
 def test_function_wrong_dimensions(self):
  self.e.execute('KWAF add(a,b) => FRAPA $a $b')
  with self.assertRaises(ArcaneTypeError):self.e.execute('KWAC add(2@m,3@s)')
 def test_wrong_arity(self):
  self.e.execute('KWAF f(a) => $a')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAC f(1,2)')
 def test_unknown_function(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAC missing(1)')
 def test_duplicate_function(self):
  self.e.execute('KWAF f(a) => $a')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAF f(a) => $a')
 def test_duplicate_parameters(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAF f(a,a) => $a')
 def test_local_parameter_does_not_leak(self):
  self.e.execute('KWAF f(x) => FRAPA $x 1');self.e.execute('KWAC f(2)')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAT x')
 def test_function_can_read_global_binding(self):
  self.e.execute('KWAM base = 10');self.e.execute('KWAF addbase(x) => FRAPA $x $base');self.assertEqual(format_quantity(self.e.execute('KWAC addbase(2)')),'12 1')
 def test_function_local_param_shadows_global(self):
  self.e.execute('KWAM x = 99');self.e.execute('KWAF ident(x) => $x');self.assertEqual(format_quantity(self.e.execute('KWAC ident(2)')),'2 1')
 def test_sequential_function_composition(self):
  self.e.execute('KWAF double(x) => FRAKA $x 2');self.e.execute('KWAF plusone(x) => FRAPA $x 1');v=self.e.execute('KWAC double(3)');self.e.create_value('intermediate', format_quantity(v).split()[0]);self.assertEqual(format_quantity(self.e.execute('KWAC plusone($intermediate)')),'7 1')
 def test_regression_state_live(self):
  self.e.execute('KWAS x = 2');self.e.execute('KWAK y = FRAPA $x 3');self.e.execute('KWAS x <- 4');self.assertEqual(format_quantity(self.e.execute('KWAT y')),'7 1')
 def test_bad_function_body_not_registered(self):
  with self.assertRaises(Exception):self.e.execute('KWAF bad(a) => FRAPA $a 2@m')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAC bad(1)')
if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_runtime 5.py

- Type: PY
- SHA-256: `0953910bd4a71e402e2038d60471ae46e98955ec3bdd01f97a0d5ca9428b4f24`
- Extracted characters: 1748

~~~text
import unittest
from arcane_runtime import Environment,fmt,ArcaneTypeError,ArcaneBindingError,ArcaneEvaluationError
class StructuredExecutionTests(unittest.TestCase):
 def setUp(self):self.e=Environment()
 def test_conditional_true_branch(self):self.assertEqual(fmt(self.e.execute('FRASI 1 12 20')),'12 1')
 def test_conditional_false_branch(self):self.assertEqual(fmt(self.e.execute('FRASI 0 12 20')),'20 1')
 def test_lazy_conditional_does_not_evaluate_unselected_division(self):self.assertEqual(fmt(self.e.execute('FRASI 1 8 FRALA 1 0')),'8 1')
 def test_greater_than(self):self.assertEqual(fmt(self.e.execute('FRAGT 3 2')),'1 1')
 def test_less_than_false(self):self.assertEqual(fmt(self.e.execute('FRALT 3 2')),'0 1')
 def test_equal(self):self.assertEqual(fmt(self.e.execute('FRAEQ 4 4')),'1 1')
 def test_comparison_dimensions(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('FRAGT 1@m 2@s')
 def test_conditional_returns_selected_branch_type(self):self.assertEqual(fmt(self.e.execute('FRASI 1 1@m 2@s')),'1 m')
 def test_function_can_use_conditional(self):
  self.e.execute('KWAF clamp_positive(x) => FRASI FRAGT $x 0 $x 0');self.assertEqual(fmt(self.e.execute('KWAC clamp_positive(5)')),'5 1');self.assertEqual(fmt(self.e.execute('KWAC clamp_positive(-2)')),'0 1')
 def test_function_arity(self):
  self.e.execute('KWAF ident(x) => $x')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAC ident(1,2)')
 def test_division_by_zero_in_selected_branch(self):
  with self.assertRaises(ArcaneEvaluationError):self.e.execute('FRASI 0 9 FRALA 1 0')
 def test_unselected_branch_is_not_evaluated(self):self.assertEqual(fmt(self.e.execute('FRASI 1 4 $missing')),'4 1')
if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_runtime 6.py

- Type: PY
- SHA-256: `96e90b7d45d4eed6519d47809d04a4af38ad621d943402c96d20d74a97617d91`
- Extracted characters: 4517

~~~text
import unittest
from arcane_runtime import Environment,fmt,ArcaneTypeError,ArcaneBindingError,ArcaneEvaluationError,ArcaneParseError

class FunctionCompositionTests(unittest.TestCase):
 def setUp(self): self.e=Environment()
 def define_basics(self):
  self.e.execute('KWAF increment(x) => FRAPA $x 1')
  self.e.execute('KWAF double(x) => FRAKA $x 2')
 def test_nested_function_calls(self):
  self.define_basics();self.assertEqual(fmt(self.e.execute('double(increment(3))')),'8 1')
 def test_kwac_accepts_nested_calls(self):
  self.define_basics();self.assertEqual(fmt(self.e.execute('KWAC double(increment(3))')),'8 1')
 def test_function_argument_can_be_arithmetic_expression(self):
  self.define_basics();self.assertEqual(fmt(self.e.execute('double(FRAPA 3 4)')),'14 1')
 def test_multiple_nested_arguments(self):
  self.e.execute('KWAF add(x,y) => FRAPA $x $y')
  self.e.execute('KWAF square(x) => FRAKA $x $x')
  self.assertEqual(fmt(self.e.execute('add(square(3), square(4))')),'25 1')
 def test_nested_calls_preserve_dimensions(self):
  self.e.execute('KWAF twice_distance(d) => FRAKA $d 2')
  self.assertEqual(fmt(self.e.execute('twice_distance(3@m)')),'6 m')
 def test_conditional_inside_composed_function(self):
  self.e.execute('KWAF positive(x) => FRASI FRAGT $x 0 $x 0')
  self.e.execute('KWAF double(x) => FRAKA $x 2')
  self.assertEqual(fmt(self.e.execute('double(positive(-3))')),'0 1')
  self.assertEqual(fmt(self.e.execute('double(positive(3))')),'6 1')
 def test_function_result_can_feed_prefix_expression(self):
  self.e.execute('KWAF inc(x) => FRAPA $x 1')
  self.assertEqual(fmt(self.e.execute('FRAPA inc(2) inc(5)')),'9 1')
 def test_call_arguments_evaluated_in_caller_scope(self):
  self.e.execute('KWAM base = 10')
  self.e.execute('KWAF plus_base(x) => FRAPA $x $base')
  self.assertEqual(fmt(self.e.execute('plus_base(FRAPA $base 2)')),'22 1')
 def test_arity_error_in_nested_call(self):
  self.e.execute('KWAF ident(x) => $x')
  with self.assertRaises(ArcaneBindingError):self.e.execute('FRAPA ident(1,2) 3')
 def test_unknown_nested_function_errors(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('FRAPA absent(1) 2')
 def test_dimension_error_propagates_through_nested_call(self):
  self.e.execute('KWAF add(x,y) => FRAPA $x $y')
  with self.assertRaises(ArcaneTypeError):self.e.execute('add(1@m,2@s)')
 def test_function_local_bindings_do_not_leak(self):
  self.e.execute('KWAF local(x) => FRAPA $x 1')
  self.e.execute('local(2)')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAT x')
 def test_duplicate_function_is_rejected(self):
  self.e.execute('KWAF ident(x) => $x')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAF ident(y) => $y')
 def test_duplicate_parameters_are_rejected(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAF bad(x,X) => $x')
 def test_unclosed_call_errors(self):
  with self.assertRaises(ArcaneParseError):self.e.execute('absent(1')
 def test_nested_division_by_zero_errors(self):
  with self.assertRaises(ArcaneEvaluationError):self.e.execute('FRAPA 1 FRALA 2 0')
 def test_maximum_call_depth_guard(self):
  self.e.execute('KWAF ident(x) => $x');self.e.depth=self.e.max_depth
  with self.assertRaises(ArcaneEvaluationError):self.e.execute('ident(1)')

class ConditionalRegressionTests(unittest.TestCase):
 def setUp(self):self.e=Environment()
 def test_conditional_true_branch(self):self.assertEqual(fmt(self.e.execute('FRASI 1 12 20')),'12 1')
 def test_conditional_false_branch(self):self.assertEqual(fmt(self.e.execute('FRASI 0 12 20')),'20 1')
 def test_lazy_conditional_does_not_evaluate_unselected_division(self):self.assertEqual(fmt(self.e.execute('FRASI 1 8 FRALA 1 0')),'8 1')
 def test_greater_than(self):self.assertEqual(fmt(self.e.execute('FRAGT 3 2')),'1 1')
 def test_less_than_false(self):self.assertEqual(fmt(self.e.execute('FRALT 3 2')),'0 1')
 def test_equal(self):self.assertEqual(fmt(self.e.execute('FRAEQ 4 4')),'1 1')
 def test_comparison_dimensions(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('FRAGT 1@m 2@s')
 def test_conditional_selected_branch_type_is_returned(self):self.assertEqual(fmt(self.e.execute('FRASI 1 1@m 2@s')),'1 m')
 def test_division_by_zero_in_selected_branch(self):
  with self.assertRaises(ArcaneEvaluationError):self.e.execute('FRASI 0 9 FRALA 1 0')
 def test_unselected_branch_is_not_evaluated(self):self.assertEqual(fmt(self.e.execute('FRASI 1 4 $missing')),'4 1')

if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_runtime 7.py

- Type: PY
- SHA-256: `dba00354c04515d592eb0c8caa9320757b6247598373574d7732b4b91f7656bb`
- Extracted characters: 4768

~~~text
import unittest
from arcane_runtime import Environment,fmt,ArcaneTypeError,ArcaneBindingError,ArcaneEvaluationError,ArcaneParseError

class LogicTests(unittest.TestCase):
 def setUp(self): self.e=Environment()
 def test_and_true_true(self): self.assertEqual(fmt(self.e.execute('FRAND 1 1')),'1 1')
 def test_and_true_false(self): self.assertEqual(fmt(self.e.execute('FRAND 1 0')),'0 1')
 def test_and_false_true(self): self.assertEqual(fmt(self.e.execute('FRAND 0 1')),'0 1')
 def test_and_false_false(self): self.assertEqual(fmt(self.e.execute('FRAND 0 0')),'0 1')
 def test_or_true_true(self): self.assertEqual(fmt(self.e.execute('FROR 1 1')),'1 1')
 def test_or_true_false(self): self.assertEqual(fmt(self.e.execute('FROR 1 0')),'1 1')
 def test_or_false_true(self): self.assertEqual(fmt(self.e.execute('FROR 0 1')),'1 1')
 def test_or_false_false(self): self.assertEqual(fmt(self.e.execute('FROR 0 0')),'0 1')
 def test_not_true(self): self.assertEqual(fmt(self.e.execute('FRNOT 1')),'0 1')
 def test_not_false(self): self.assertEqual(fmt(self.e.execute('FRNOT 0')),'1 1')
 def test_not_normalizes_nonzero_truth(self): self.assertEqual(fmt(self.e.execute('FRNOT -5')),'0 1')
 def test_and_short_circuits_false_left(self): self.assertEqual(fmt(self.e.execute('FRAND 0 FRALA 1 0')),'0 1')
 def test_or_short_circuits_true_left(self): self.assertEqual(fmt(self.e.execute('FROR 7 FRALA 1 0')),'1 1')
 def test_and_evaluates_right_when_needed(self):
  with self.assertRaises(ArcaneEvaluationError): self.e.execute('FRAND 1 FRALA 1 0')
 def test_or_evaluates_right_when_needed(self):
  with self.assertRaises(ArcaneEvaluationError): self.e.execute('FROR 0 FRALA 1 0')
 def test_and_requires_dimensionless_left(self):
  with self.assertRaises(ArcaneTypeError): self.e.execute('FRAND 1@m 1')
 def test_and_requires_dimensionless_right(self):
  with self.assertRaises(ArcaneTypeError): self.e.execute('FRAND 1 1@s')
 def test_or_requires_dimensionless_left(self):
  with self.assertRaises(ArcaneTypeError): self.e.execute('FROR 1@m 0')
 def test_or_requires_dimensionless_right(self):
  with self.assertRaises(ArcaneTypeError): self.e.execute('FROR 0 1@kg')
 def test_not_requires_dimensionless(self):
  with self.assertRaises(ArcaneTypeError): self.e.execute('FRNOT 2@m')
 def test_comparisons_compose_with_logic(self): self.assertEqual(fmt(self.e.execute('FRAND FRAGT 3 2 FRALT 4 5')),'1 1')
 def test_nested_logic(self): self.assertEqual(fmt(self.e.execute('FROR FRAND 1 0 FRNOT 0')),'1 1')
 def test_logic_inside_conditional(self): self.assertEqual(fmt(self.e.execute('FRASI FRAND FRAGT 3 2 FRALT 1 2 10 20')),'10 1')
 def test_logic_with_function_composition(self):
  self.e.execute('KWAF greater(x,y) => FRAGT $x $y')
  self.assertEqual(fmt(self.e.execute('FRAND greater(8,3) greater(4,1)')),'1 1')
 def test_logic_is_case_insensitive(self): self.assertEqual(fmt(self.e.execute('frand 1 1')),'1 1')
 def test_logic_arity_error(self):
  with self.assertRaises(ArcaneParseError): self.e.execute('FRAND 1')

class FunctionCompositionRegressionTests(unittest.TestCase):
 def setUp(self): self.e=Environment()
 def test_nested_function_calls(self):
  self.e.execute('KWAF increment(x) => FRAPA $x 1');self.e.execute('KWAF double(x) => FRAKA $x 2')
  self.assertEqual(fmt(self.e.execute('double(increment(3))')),'8 1')
 def test_multiple_nested_arguments(self):
  self.e.execute('KWAF add(x,y) => FRAPA $x $y');self.e.execute('KWAF square(x) => FRAKA $x $x')
  self.assertEqual(fmt(self.e.execute('add(square(3), square(4))')),'25 1')
 def test_nested_calls_preserve_dimensions(self):
  self.e.execute('KWAF twice_distance(d) => FRAKA $d 2');self.assertEqual(fmt(self.e.execute('twice_distance(3@m)')),'6 m')
 def test_conditional_is_lazy(self): self.assertEqual(fmt(self.e.execute('FRASI 1 4 $missing')),'4 1')
 def test_dimension_mismatch_is_rejected(self):
  with self.assertRaises(ArcaneTypeError): self.e.execute('FRAGT 1@m 2@s')
 def test_division_by_zero_is_rejected(self):
  with self.assertRaises(ArcaneEvaluationError): self.e.execute('FRALA 1 0')
 def test_unknown_binding_is_rejected(self):
  with self.assertRaises(ArcaneBindingError): self.e.execute('$missing')
 def test_wrong_arity_is_rejected(self):
  self.e.execute('KWAF ident(x) => $x')
  with self.assertRaises(ArcaneBindingError): self.e.execute('ident(1,2)')
 def test_local_scope_does_not_leak(self):
  self.e.execute('KWAF ident(x) => $x');self.e.execute('ident(5)')
  with self.assertRaises(ArcaneBindingError): self.e.execute('KWAT x')
 def test_conditional_true_branch(self): self.assertEqual(fmt(self.e.execute('FRASI 1 12 20')),'12 1')
 def test_conditional_false_branch(self): self.assertEqual(fmt(self.e.execute('FRASI 0 12 20')),'20 1')

if __name__=='__main__': unittest.main(verbosity=2)

~~~

## test_arcane_runtime 8.py

- Type: PY
- SHA-256: `cbdfb17f072915b07f1d211fde3d73f548b2d669948a2fcbd060b4547067076c`
- Extracted characters: 3504

~~~text
import unittest
from arcane_runtime import Environment,fmt,ArcaneTypeError,ArcaneBindingError,ArcaneEvaluationError,ArcaneParseError
class BoundedRepeatTests(unittest.TestCase):
 def setUp(self):self.e=Environment()
 def test_inclusive_range(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 1 TO 3 => $i')),'[1 1, 2 1, 3 1]')
 def test_single_iteration(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 4 TO 4 => FRAKA $i 2')),'[8 1]')
 def test_empty_range(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 4 TO 2 => $i')),'[]')
 def test_negative_range(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM -2 TO 0 => $i')),'[-2 1, -1 1, 0 1]')
 def test_body_arithmetic(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 1 TO 3 => FRAKA $i $i')),'[1 1, 4 1, 9 1]')
 def test_body_function(self):
  self.e.execute('KWAF double(x) => FRAKA $x 2');self.assertEqual(fmt(self.e.execute('KWAR i FROM 1 TO 3 => double($i)')),'[2 1, 4 1, 6 1]')
 def test_body_logic(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 1 TO 3 => FRAGT $i 1')),'[0 1, 1 1, 1 1]')
 def test_dimensioned_bounds_rejected(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('KWAR i FROM 1@m TO 3 => $i')
 def test_fractional_bounds_rejected(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('KWAR i FROM 1.5 TO 3 => $i')
 def test_excessive_iterations_rejected(self):
  with self.assertRaises(ArcaneEvaluationError):self.e.execute('KWAR i FROM 1 TO 1001 => $i')
 def test_loop_variable_does_not_leak(self):
  self.e.execute('KWAR i FROM 1 TO 2 => $i')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAT i')
 def test_outer_binding_survives(self):
  self.e.execute('KWAM i = 99');self.e.execute('KWAR i FROM 1 TO 2 => $i');self.assertEqual(fmt(self.e.execute('KWAT i')),'99 1')
 def test_bounds_evaluated_in_outer_scope(self):
  self.e.execute('KWAM start = 2');self.e.execute('KWAM finish = 3');self.assertEqual(fmt(self.e.execute('KWAR i FROM $start TO $finish => $i')),'[2 1, 3 1]')
 def test_error_cleans_loop_scope(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAR i FROM 1 TO 2 => $missing')
  self.assertEqual(len(self.e.scopes),1)
 def test_case_insensitive_keyword(self):self.assertEqual(fmt(self.e.execute('kwar i from 1 to 2 => $i')),'[1 1, 2 1]')
 def test_non_numeric_result_is_not_claimed(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAR i FROM 1 TO 2 => $missing')
class RegressionTests(unittest.TestCase):
 def setUp(self):self.e=Environment()
 def test_nested_function_composition(self):
  self.e.execute('KWAF inc(x) => FRAPA $x 1');self.e.execute('KWAF double(x) => FRAKA $x 2');self.assertEqual(fmt(self.e.execute('double(inc(3))')),'8 1')
 def test_and_short_circuit(self):self.assertEqual(fmt(self.e.execute('FRAND 0 FRALA 1 0')),'0 1')
 def test_or_short_circuit(self):self.assertEqual(fmt(self.e.execute('FROR 1 FRALA 1 0')),'1 1')
 def test_conditional_lazy(self):self.assertEqual(fmt(self.e.execute('FRASI 1 4 $missing')),'4 1')
 def test_unit_arithmetic(self):self.assertEqual(fmt(self.e.execute('FRAPA 2@m 3@m')),'5 m')
 def test_division_zero(self):
  with self.assertRaises(ArcaneEvaluationError):self.e.execute('FRALA 1 0')
 def test_dimension_mismatch(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('FRAGT 1@m 1@s')
 def test_unknown_binding(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('$missing')
if __name__=='__main__':unittest.main(verbosity=2)

~~~

## test_arcane_runtime 9.py

- Type: PY
- SHA-256: `ac3645bd6a16f5571f62cdc0833c88aed4622778382a1066fdf158955f0e9538`
- Extracted characters: 5939

~~~text
import unittest
from arcane_runtime import Environment,fmt,ArcaneTypeError,ArcaneBindingError,ArcaneEvaluationError,ArcaneParseError
class BoundedRepeatTests(unittest.TestCase):
 def setUp(self):self.e=Environment()
 def test_inclusive_range(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 1 TO 3 => $i')),'[1 1, 2 1, 3 1]')
 def test_single_iteration(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 4 TO 4 => FRAKA $i 2')),'[8 1]')
 def test_empty_range(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 4 TO 2 => $i')),'[]')
 def test_negative_range(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM -2 TO 0 => $i')),'[-2 1, -1 1, 0 1]')
 def test_body_arithmetic(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 1 TO 3 => FRAKA $i $i')),'[1 1, 4 1, 9 1]')
 def test_body_function(self):
  self.e.execute('KWAF double(x) => FRAKA $x 2');self.assertEqual(fmt(self.e.execute('KWAR i FROM 1 TO 3 => double($i)')),'[2 1, 4 1, 6 1]')
 def test_body_logic(self):self.assertEqual(fmt(self.e.execute('KWAR i FROM 1 TO 3 => FRAGT $i 1')),'[0 1, 1 1, 1 1]')
 def test_dimensioned_bounds_rejected(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('KWAR i FROM 1@m TO 3 => $i')
 def test_fractional_bounds_rejected(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('KWAR i FROM 1.5 TO 3 => $i')
 def test_excessive_iterations_rejected(self):
  with self.assertRaises(ArcaneEvaluationError):self.e.execute('KWAR i FROM 1 TO 1001 => $i')
 def test_loop_variable_does_not_leak(self):
  self.e.execute('KWAR i FROM 1 TO 2 => $i')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAT i')
 def test_outer_binding_survives(self):
  self.e.execute('KWAM i = 99');self.e.execute('KWAR i FROM 1 TO 2 => $i');self.assertEqual(fmt(self.e.execute('KWAT i')),'99 1')
 def test_bounds_evaluated_in_outer_scope(self):
  self.e.execute('KWAM start = 2');self.e.execute('KWAM finish = 3');self.assertEqual(fmt(self.e.execute('KWAR i FROM $start TO $finish => $i')),'[2 1, 3 1]')
 def test_error_cleans_loop_scope(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAR i FROM 1 TO 2 => $missing')
  self.assertEqual(len(self.e.scopes),1)
 def test_case_insensitive_keyword(self):self.assertEqual(fmt(self.e.execute('kwar i from 1 to 2 => $i')),'[1 1, 2 1]')
 def test_non_numeric_result_is_not_claimed(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAR i FROM 1 TO 2 => $missing')
class RegressionTests(unittest.TestCase):
 def setUp(self):self.e=Environment()
 def test_nested_function_composition(self):
  self.e.execute('KWAF inc(x) => FRAPA $x 1');self.e.execute('KWAF double(x) => FRAKA $x 2');self.assertEqual(fmt(self.e.execute('double(inc(3))')),'8 1')
 def test_and_short_circuit(self):self.assertEqual(fmt(self.e.execute('FRAND 0 FRALA 1 0')),'0 1')
 def test_or_short_circuit(self):self.assertEqual(fmt(self.e.execute('FROR 1 FRALA 1 0')),'1 1')
 def test_conditional_lazy(self):self.assertEqual(fmt(self.e.execute('FRASI 1 4 $missing')),'4 1')
 def test_unit_arithmetic(self):self.assertEqual(fmt(self.e.execute('FRAPA 2@m 3@m')),'5 m')
 def test_division_zero(self):
  with self.assertRaises(ArcaneEvaluationError):self.e.execute('FRALA 1 0')
 def test_dimension_mismatch(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('FRAGT 1@m 1@s')
 def test_unknown_binding(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('$missing')
if __name__=='__main__':unittest.main(verbosity=2)

class AggregationTests(unittest.TestCase):
 def setUp(self):self.e=Environment()
 def test_sum_repeated_squares(self):
  self.assertEqual(fmt(self.e.execute('KWAS total FROM 1 TO 5 => FRAKA $total $total')),'55 1')
  self.assertEqual(fmt(self.e.execute('KWAT total')),'55 1')
 def test_sum_simple_range(self):self.assertEqual(fmt(self.e.execute('KWAS total FROM 1 TO 4 => $total')),'10 1')
 def test_sum_empty_range_is_zero(self):self.assertEqual(fmt(self.e.execute('KWAS total FROM 4 TO 2 => $total')),'0 1')
 def test_sum_single_value(self):self.assertEqual(fmt(self.e.execute('KWAS total FROM 7 TO 7 => FRAKA $total 3')),'21 1')
 def test_sum_decimal_body(self):self.assertEqual(fmt(self.e.execute('KWAS total FROM 1 TO 3 => FRALA $total 2')),'3 1')
 def test_sum_dimensioned_body(self):self.assertEqual(fmt(self.e.execute('KWAS distance FROM 1 TO 3 => FRAKA $distance 1@m')),'6 m')
 def test_sum_preserves_dimensions(self):self.assertEqual(fmt(self.e.execute('KWAS distance FROM 1 TO 2 => FRAPA 2@m 3@m')),'10 m')
 def test_sum_result_can_be_used(self):
  self.e.execute('KWAS total FROM 1 TO 3 => $total')
  self.assertEqual(fmt(self.e.execute('FRAKA $total 2')),'12 1')
 def test_duplicate_sum_binding_rejected(self):
  self.e.execute('KWAM total = 2')
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAS total FROM 1 TO 2 => $total')
 def test_sum_scope_cleanup_on_error(self):
  with self.assertRaises(ArcaneBindingError):self.e.execute('KWAS total FROM 1 TO 2 => $missing')
  self.assertEqual(len(self.e.scopes),1)
 def test_sum_does_not_leak_iteration_variable(self):
  self.e.execute('KWAS total FROM 1 TO 2 => $total')
  with self.assertRaises(ArcaneBindingError):self.e.lookup('i')
 def test_sum_function_body(self):
  self.e.execute('KWAF double(x) => FRAKA $x 2')
  self.assertEqual(fmt(self.e.execute('KWAS total FROM 1 TO 3 => double($total)')),'12 1')
 def test_sum_excessive_repeat_rejected(self):
  with self.assertRaises(ArcaneEvaluationError):self.e.execute('KWAS total FROM 1 TO 1001 => $total')
 def test_sum_bounds_must_be_integers(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('KWAS total FROM 1.5 TO 3 => $total')
 def test_sum_dimensioned_bounds_rejected(self):
  with self.assertRaises(ArcaneTypeError):self.e.execute('KWAS total FROM 1@m TO 3 => $total')
 def test_sum_case_insensitive(self):self.assertEqual(fmt(self.e.execute('kwas total from 1 to 3 => $total')),'6 1')

~~~

## test_arcane_runtime.py

- Type: PY
- SHA-256: `35dc293622d45fe434dc59eff3b1e106fa9ca13be858ab57886552688c1bba24`
- Extracted characters: 2930

~~~text
import unittest
from decimal import Decimal
from arcane_runtime import Environment, Quantity, ArcaneBindingError, ArcaneTypeError, ArcaneParseError, format_quantity

class BindingRuntimeTests(unittest.TestCase):
    def setUp(self): self.env=Environment()
    def test_kwam_creates_value_binding(self):
        self.env.execute('KWAM distance = 3@m')
        self.assertEqual(format_quantity(self.env.execute('KWAT distance')), '3 m')
    def test_kwat_case_insensitive(self):
        self.env.execute('KWAM distance = 3@m')
        self.assertEqual(format_quantity(self.env.execute('KWAT DISTANCE')), '3 m')
    def test_unknown_reference_rejected(self):
        with self.assertRaises(ArcaneBindingError): self.env.execute('KWAT missing')
    def test_duplicate_binding_rejected(self):
        self.env.execute('KWAM x = 2')
        with self.assertRaises(ArcaneBindingError): self.env.execute('KWAM x = 3')
    def test_invalid_name_rejected(self):
        with self.assertRaises(ArcaneBindingError): self.env.create_value('bad-name','2')
    def test_value_binding_is_stable(self):
        self.env.execute('KWAM x = 2')
        self.env.execute('KWAM y = FRAPA $x 3')
        self.assertEqual(format_quantity(self.env.execute('KWAT y')), '5 1')
    def test_live_binding_evaluates_expression_on_read(self):
        self.env.execute('KWAM x = 2')
        self.env.execute('KWAK y = FRAPA $x 3')
        self.assertEqual(format_quantity(self.env.execute('KWAT y')), '5 1')
    def test_live_binding_rejects_unknown_reference(self):
        with self.assertRaises(ArcaneBindingError): self.env.execute('KWAK y = FRAPA $x 3')
    def test_value_binding_type_check(self):
        with self.assertRaises(ArcaneTypeError): self.env.execute('KWAM invalid = FRAPA 2@m 3@s')
    def test_live_binding_type_check(self):
        with self.assertRaises(ArcaneTypeError): self.env.execute('KWAK invalid = FRAPA 2@m 3@s')
    def test_expression_reference(self):
        self.env.execute('KWAM x = 2@m')
        self.assertEqual(format_quantity(self.env.evaluate_expr(__import__('arcane_runtime').parse('FRAPA $x 30@cm'))), '2.3 m')
    def test_malformed_statement_rejected(self):
        with self.assertRaises(ArcaneParseError): self.env.execute('KWAM x 2')
    def test_reference_cycle_guard(self):
        self.env._bindings['a']=__import__('arcane_runtime').Binding('live',expression=__import__('arcane_runtime').parse('$b'))
        self.env._bindings['b']=__import__('arcane_runtime').Binding('live',expression=__import__('arcane_runtime').parse('$a'))
        with self.assertRaises(ArcaneBindingError): self.env.resolve('a')
    def test_arithmetic_still_works(self):
        self.assertEqual(format_quantity(self.env.execute('KWAM result = FRAPA 2 3')), '5 1')
    def test_reject_empty_statement(self):
        with self.assertRaises(ArcaneParseError): self.env.execute(' ')

if __name__=='__main__': unittest.main(verbosity=2)

~~~

## test_arcane_runtime_adapter 2.py

- Type: PY
- SHA-256: `995fa128c6d33a5be01c8a062f27f3ca7cf83baa0a6b8dcb3f2336be14832eaa`
- Extracted characters: 2598

~~~text
import unittest
from arcane_diagnostics import ErrorCode, SourceSpan, Diagnostic, ArcaneDiagnosticError, ValueKind
from arcane_runtime_adapter import evaluate_safely, require_success

class RuntimeAdapterTests(unittest.TestCase):
    def test_success_wraps_number(self):
        result = evaluate_safely(lambda: 12)
        self.assertTrue(result.ok)
        self.assertEqual(result.typed_value.type.kind, ValueKind.NUMBER)
        self.assertEqual(result.typed_value.value, 12)

    def test_success_preserves_dimension_metadata(self):
        result = evaluate_safely(lambda: 2.5, dimensions=(1, 0, -1))
        self.assertEqual(result.typed_value.type.dimensions, (1, 0, -1))

    def test_bool_is_not_number(self):
        self.assertEqual(evaluate_safely(lambda: True).typed_value.type.kind, ValueKind.BOOLEAN)

    def test_list_typed(self):
        self.assertEqual(evaluate_safely(lambda: [1, 2]).typed_value.type.describe(), 'list[number]')

    def test_unknown_name_maps_with_source_location(self):
        result = evaluate_safely(lambda: (_ for _ in ()).throw(NameError('unknown name: x')), SourceSpan(4, 7))
        self.assertFalse(result.ok)
        self.assertEqual(result.diagnostic.code, ErrorCode.UNKNOWN_NAME)
        self.assertIn('4:7', result.render())

    def test_zero_division_maps(self):
        result = evaluate_safely(lambda: 1 / 0)
        self.assertEqual(result.diagnostic.code, ErrorCode.DIVISION_BY_ZERO)
        self.assertIn('hint:', result.render())

    def test_existing_diagnostic_is_preserved(self):
        diagnostic = Diagnostic(ErrorCode.PARSE_ERROR, 'bad expression', SourceSpan(2, 3), 'check syntax')
        result = evaluate_safely(lambda: (_ for _ in ()).throw(ArcaneDiagnosticError(diagnostic)))
        self.assertEqual(result.diagnostic, diagnostic)

    def test_unexpected_exception_is_sanitised(self):
        result = evaluate_safely(lambda: (_ for _ in ()).throw(RuntimeError('opaque runtime failure')))
        self.assertEqual(result.diagnostic.code, ErrorCode.INTERNAL_ERROR)
        self.assertNotIn('Traceback', result.render())

    def test_require_success_returns_value(self):
        typed = require_success(evaluate_safely(lambda: 'hello'))
        self.assertEqual(typed.value, 'hello')

    def test_require_success_raises_structured_error(self):
        result = evaluate_safely(lambda: 1 / 0)
        with self.assertRaises(ArcaneDiagnosticError) as ctx:
            require_success(result)
        self.assertEqual(ctx.exception.diagnostic.code, ErrorCode.DIVISION_BY_ZERO)

if __name__ == '__main__':
    unittest.main()

~~~

## test_arcane_runtime_adapter 3.py

- Type: PY
- SHA-256: `995fa128c6d33a5be01c8a062f27f3ca7cf83baa0a6b8dcb3f2336be14832eaa`
- Extracted characters: 2598

~~~text
import unittest
from arcane_diagnostics import ErrorCode, SourceSpan, Diagnostic, ArcaneDiagnosticError, ValueKind
from arcane_runtime_adapter import evaluate_safely, require_success

class RuntimeAdapterTests(unittest.TestCase):
    def test_success_wraps_number(self):
        result = evaluate_safely(lambda: 12)
        self.assertTrue(result.ok)
        self.assertEqual(result.typed_value.type.kind, ValueKind.NUMBER)
        self.assertEqual(result.typed_value.value, 12)

    def test_success_preserves_dimension_metadata(self):
        result = evaluate_safely(lambda: 2.5, dimensions=(1, 0, -1))
        self.assertEqual(result.typed_value.type.dimensions, (1, 0, -1))

    def test_bool_is_not_number(self):
        self.assertEqual(evaluate_safely(lambda: True).typed_value.type.kind, ValueKind.BOOLEAN)

    def test_list_typed(self):
        self.assertEqual(evaluate_safely(lambda: [1, 2]).typed_value.type.describe(), 'list[number]')

    def test_unknown_name_maps_with_source_location(self):
        result = evaluate_safely(lambda: (_ for _ in ()).throw(NameError('unknown name: x')), SourceSpan(4, 7))
        self.assertFalse(result.ok)
        self.assertEqual(result.diagnostic.code, ErrorCode.UNKNOWN_NAME)
        self.assertIn('4:7', result.render())

    def test_zero_division_maps(self):
        result = evaluate_safely(lambda: 1 / 0)
        self.assertEqual(result.diagnostic.code, ErrorCode.DIVISION_BY_ZERO)
        self.assertIn('hint:', result.render())

    def test_existing_diagnostic_is_preserved(self):
        diagnostic = Diagnostic(ErrorCode.PARSE_ERROR, 'bad expression', SourceSpan(2, 3), 'check syntax')
        result = evaluate_safely(lambda: (_ for _ in ()).throw(ArcaneDiagnosticError(diagnostic)))
        self.assertEqual(result.diagnostic, diagnostic)

    def test_unexpected_exception_is_sanitised(self):
        result = evaluate_safely(lambda: (_ for _ in ()).throw(RuntimeError('opaque runtime failure')))
        self.assertEqual(result.diagnostic.code, ErrorCode.INTERNAL_ERROR)
        self.assertNotIn('Traceback', result.render())

    def test_require_success_returns_value(self):
        typed = require_success(evaluate_safely(lambda: 'hello'))
        self.assertEqual(typed.value, 'hello')

    def test_require_success_raises_structured_error(self):
        result = evaluate_safely(lambda: 1 / 0)
        with self.assertRaises(ArcaneDiagnosticError) as ctx:
            require_success(result)
        self.assertEqual(ctx.exception.diagnostic.code, ErrorCode.DIVISION_BY_ZERO)

if __name__ == '__main__':
    unittest.main()

~~~

## test_arcane_runtime_adapter.py

- Type: PY
- SHA-256: `995fa128c6d33a5be01c8a062f27f3ca7cf83baa0a6b8dcb3f2336be14832eaa`
- Extracted characters: 2598

~~~text
import unittest
from arcane_diagnostics import ErrorCode, SourceSpan, Diagnostic, ArcaneDiagnosticError, ValueKind
from arcane_runtime_adapter import evaluate_safely, require_success

class RuntimeAdapterTests(unittest.TestCase):
    def test_success_wraps_number(self):
        result = evaluate_safely(lambda: 12)
        self.assertTrue(result.ok)
        self.assertEqual(result.typed_value.type.kind, ValueKind.NUMBER)
        self.assertEqual(result.typed_value.value, 12)

    def test_success_preserves_dimension_metadata(self):
        result = evaluate_safely(lambda: 2.5, dimensions=(1, 0, -1))
        self.assertEqual(result.typed_value.type.dimensions, (1, 0, -1))

    def test_bool_is_not_number(self):
        self.assertEqual(evaluate_safely(lambda: True).typed_value.type.kind, ValueKind.BOOLEAN)

    def test_list_typed(self):
        self.assertEqual(evaluate_safely(lambda: [1, 2]).typed_value.type.describe(), 'list[number]')

    def test_unknown_name_maps_with_source_location(self):
        result = evaluate_safely(lambda: (_ for _ in ()).throw(NameError('unknown name: x')), SourceSpan(4, 7))
        self.assertFalse(result.ok)
        self.assertEqual(result.diagnostic.code, ErrorCode.UNKNOWN_NAME)
        self.assertIn('4:7', result.render())

    def test_zero_division_maps(self):
        result = evaluate_safely(lambda: 1 / 0)
        self.assertEqual(result.diagnostic.code, ErrorCode.DIVISION_BY_ZERO)
        self.assertIn('hint:', result.render())

    def test_existing_diagnostic_is_preserved(self):
        diagnostic = Diagnostic(ErrorCode.PARSE_ERROR, 'bad expression', SourceSpan(2, 3), 'check syntax')
        result = evaluate_safely(lambda: (_ for _ in ()).throw(ArcaneDiagnosticError(diagnostic)))
        self.assertEqual(result.diagnostic, diagnostic)

    def test_unexpected_exception_is_sanitised(self):
        result = evaluate_safely(lambda: (_ for _ in ()).throw(RuntimeError('opaque runtime failure')))
        self.assertEqual(result.diagnostic.code, ErrorCode.INTERNAL_ERROR)
        self.assertNotIn('Traceback', result.render())

    def test_require_success_returns_value(self):
        typed = require_success(evaluate_safely(lambda: 'hello'))
        self.assertEqual(typed.value, 'hello')

    def test_require_success_raises_structured_error(self):
        result = evaluate_safely(lambda: 1 / 0)
        with self.assertRaises(ArcaneDiagnosticError) as ctx:
            require_success(result)
        self.assertEqual(ctx.exception.diagnostic.code, ErrorCode.DIVISION_BY_ZERO)

if __name__ == '__main__':
    unittest.main()

~~~

## test_arcane_semantic.py

- Type: PY
- SHA-256: `16988e85515d13b68262232c893aa58bf8e77afa5dcd630114654187f995aff6`
- Extracted characters: 2251

~~~text
import unittest
from arcane_semantic import analyze_source

class SemanticTests(unittest.TestCase):
    def codes(self, source): return [i.code for i in analyze_source(source).issues]
    def test_valid_example(self):
        self.assertEqual(self.codes('KWAF square(x) => FRATA $x $x\nKWAM input => 7\nKWAI FRAGT $input 5 THEN\n  KWAM answer => square($input)\n  KWAT answer\nELSE\n  KWAM answer => 0\n  KWAT answer\nEND'), [])
    def test_unresolved_binding(self):
        self.assertIn('ARC-SEM-005', self.codes('KWAM y => $missing'))
    def test_declared_binding_resolves(self):
        self.assertEqual(self.codes('KWAM x => 2\nKWAM y => $x + 1'), [])
    def test_undefined_function(self):
        self.assertIn('ARC-SEM-006', self.codes('KWAM x => absent(2)'))
    def test_function_arity(self):
        self.assertIn('ARC-SEM-007', self.codes('KWAF add(x, y) => $x + $y\nKWAM z => add(1)'))
    def test_forward_function_call(self):
        self.assertEqual(self.codes('KWAM z => add(1, 2)\nKWAF add(x, y) => $x + $y'), [])
    def test_duplicate_binding_same_scope(self):
        self.assertIn('ARC-SEM-004', self.codes('KWAM x => 1\nKWAM x => 2'))
    def test_duplicate_functions(self):
        self.assertIn('ARC-SEM-003', self.codes('KWAF f(x) => $x\nKWAF f(y) => $y'))
    def test_duplicate_parameters(self):
        self.assertIn('ARC-SEM-002', self.codes('KWAF f(x, x) => $x'))
    def test_nested_scope_sees_outer_binding(self):
        self.assertEqual(self.codes('KWAM x => 1\nKWAI FRAEQ $x 1 THEN\nKWAT x\nEND'), [])
    def test_branch_binding_does_not_escape(self):
        self.assertIn('ARC-SEM-005', self.codes('KWAI FRAEQ 1 1 THEN\nKWAM x => 1\nEND\nKWAT x'))
    def test_else_branch_has_separate_scope(self):
        self.assertEqual(self.codes('KWAI FRAEQ 1 1 THEN\nKWAM x => 1\nELSE\nKWAM x => 2\nEND'), [])
    def test_function_parameter_scope(self):
        self.assertEqual(self.codes('KWAF f(x) => $x'), [])
    def test_function_parameter_not_global(self):
        self.assertIn('ARC-SEM-005', self.codes('KWAF f(x) => $x\nKWAM y => $x'))
    def test_call_arity_zero(self):
        self.assertIn('ARC-SEM-007', self.codes('KWAF f() => 1\nKWAM x => f(2)'))

if __name__ == '__main__': unittest.main(verbosity=2)

~~~

## test_arcane_session.py

- Type: PY
- SHA-256: `125db30d60262d88ea65cbb57234eef4e109b3c8170cfef991fffff7ea2881c7`
- Extracted characters: 3688

~~~text
import io
import tempfile
import unittest
from pathlib import Path
from arcane_session import ArcaneSession, run_file
from arcane_runtime import format_quantity, ArcaneBindingError

class SessionTests(unittest.TestCase):
    def setUp(self): self.s = ArcaneSession()
    def run_ok(self, line):
        result = self.s.execute_line(line)
        self.assertTrue(result.ok, result.message)
        return result
    def test_session_persists_across_statements(self):
        self.run_ok('KWAS x = 2@m')
        self.run_ok('KWAS x <- 4@m')
        self.assertEqual(self.run_ok('KWAT x').message, '4 m')
    def test_live_binding_updates_in_session(self):
        self.run_ok('KWAS x = 2@m')
        self.run_ok('KWAK y = FRAPA $x 30@cm')
        self.assertEqual(self.run_ok('KWAT y').message, '2.3 m')
        self.run_ok('KWAS x <- 5@m')
        self.assertEqual(self.run_ok('KWAT y').message, '5.3 m')
    def test_failed_statement_rolls_back_state(self):
        self.run_ok('KWAS x = 2@m')
        bad = self.s.execute_line('KWAS x <- 3@s')
        self.assertFalse(bad.ok)
        self.assertEqual(self.run_ok('KWAT x').message, '2 m')
    def test_failed_declaration_not_left_behind(self):
        bad = self.s.execute_line('KWAM broken = FRAPA 1@m 2@s')
        self.assertFalse(bad.ok)
        self.assertFalse(self.s.execute_line('KWAT broken').ok)
    def test_duplicate_declaration_rolls_back(self):
        self.run_ok('KWAS x = 1')
        bad = self.s.execute_line('KWAM x = 2')
        self.assertFalse(bad.ok)
        self.assertEqual(self.run_ok('KWAT x').message, '1 1')
    def test_scope_commands(self):
        self.run_ok('KWAM x = 1')
        self.run_ok(':scope in')
        self.run_ok('KWAM x = 2')
        self.assertEqual(self.run_ok('KWAT x').message, '2 1')
        self.run_ok(':scope out')
        self.assertEqual(self.run_ok('KWAT x').message, '1 1')
    def test_cannot_exit_global_scope(self):
        r = self.s.execute_line(':scope out')
        self.assertFalse(r.ok)
        self.assertEqual(self.s.env.scope_depth, 0)
    def test_environment_listing(self):
        self.run_ok('KWAS x = 3@m')
        self.run_ok('KWAK y = FRAPA $x 1@m')
        text = self.run_ok(':env').message
        self.assertIn('x [state] = 3 m', text)
        self.assertIn('y [live] = 4 m', text)
    def test_help_and_scope_depth(self):
        self.assertIn('KWAM', self.run_ok(':help').message)
        self.assertEqual(self.run_ok(':scope').message, 'scope depth: 0')
    def test_blank_and_comment_ignored(self):
        self.assertTrue(self.s.execute_line('').ok)
        self.assertTrue(self.s.execute_line('# note').ok)
    def test_arithmetic_expression(self):
        self.assertEqual(self.run_ok('FRAPA 3 4').message, '7 1')
    def test_script_execution_persists(self):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / 'sample.arc'
            p.write_text('KWAS x = 2\nKWAS x <- 8\nKWAT x\n', encoding='utf-8')
            out = io.StringIO()
            self.assertEqual(run_file(p, out), 0)
            self.assertIn('3: 8 1', out.getvalue())
    def test_script_reports_errors_but_continues(self):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / 'sample.arc'
            p.write_text('KWAS x = 2\nKWAS x <- 4@s\nKWAT x\n', encoding='utf-8')
            out = io.StringIO()
            self.assertEqual(run_file(p, out), 1)
            self.assertIn('Error on statement 2', out.getvalue())
            self.assertIn('3: 2 1', out.getvalue())
    def test_quit_command(self):
        self.assertEqual(self.run_ok(':quit').message, 'Goodbye.')

if __name__ == '__main__': unittest.main(verbosity=2)

~~~

## test_arcane_typed_core.py

- Type: PY
- SHA-256: `4686c7fee40cfde6c983f36e247d81b35a14f64704e0ba9f7e2d3d5bcd7050bb`
- Extracted characters: 2827

~~~text
import unittest
from decimal import Decimal
from arcane_typed_core import evaluate, parse, format_quantity, ArcaneParseError, ArcaneTypeError, ArcaneEvaluationError
class TypedCoreTests(unittest.TestCase):
    def test_digit_root_dimensionless(self): self.assertEqual(format_quantity(evaluate('KI')), '1 1')
    def test_numeric_literal(self): self.assertEqual(evaluate('3').value, Decimal(3))
    def test_add_dimensionless(self): self.assertEqual(evaluate('FRAPA 3 2').value, Decimal(5))
    def test_add_same_units(self): self.assertEqual(format_quantity(evaluate('FRAPA 2@m 30@cm')), '2.3 m')
    def test_subtract_operand_order(self): self.assertEqual(evaluate('FRATA 1 2').value, Decimal(-1))
    def test_multiply_dimensions(self): self.assertEqual(format_quantity(evaluate('FRAKA 3@m 2@s')), '6 m s')
    def test_divide_dimensions(self): self.assertEqual(format_quantity(evaluate('FRALA 10@m 2@s')), '5 m s^-1')
    def test_cm_normalisation(self): self.assertEqual(evaluate('FRAPA 1@m 100@cm').value, Decimal(2))
    def test_km_normalisation(self): self.assertEqual(evaluate('FRAPA 1@km 500@m').value, Decimal(1500))
    def test_incompatible_add_rejected(self):
        with self.assertRaises(ArcaneTypeError): evaluate('FRAPA 2@m 3@s')
    def test_incompatible_subtract_rejected(self):
        with self.assertRaises(ArcaneTypeError): evaluate('FRATA 2@kg 1@m')
    def test_nested_expression_dimensions(self): self.assertEqual(format_quantity(evaluate('FRAPA FRAKA 2@m 3@s FRAKA 4@m 1@s')), '10 m s')
    def test_division_by_zero(self):
        with self.assertRaises(ArcaneEvaluationError): evaluate('FRALA 1 0')
    def test_unknown_unit_rejected(self):
        with self.assertRaises(ArcaneTypeError): evaluate('3@furlong')
    def test_unknown_operator_rejected(self):
        with self.assertRaises(ArcaneParseError): parse('FRASHA KI')
    def test_extra_tokens_rejected(self):
        with self.assertRaises(ArcaneParseError): parse('FRAPA 1 2 3')
    def test_missing_operand_rejected(self):
        with self.assertRaises(ArcaneParseError): parse('FRAPA 1')
    def test_empty_expression_rejected(self):
        with self.assertRaises(ArcaneParseError): parse(' ')
    def test_bad_numeric_token_rejected(self):
        with self.assertRaises(ArcaneParseError): parse('2..4')
    def test_decimal_arithmetic(self): self.assertEqual(evaluate('FRAPA 0.1 0.2').value, Decimal('0.3'))
    def test_nested_dimension_error_detected_before_eval(self):
        with self.assertRaises(ArcaneTypeError): evaluate('FRAPA FRAKA 2@m 3@s 4@kg')
    def test_time_unit_conversion(self): self.assertEqual(evaluate('FRAPA 1@min 30@s').value, Decimal(90))
    def test_mass_unit_conversion(self): self.assertEqual(evaluate('FRAPA 1@kg 500@g').value, Decimal('1.500'))
if __name__=='__main__': unittest.main(verbosity=2)

~~~

## test_phase7v_integration.py

- Type: PY
- SHA-256: `dcd48d85e1c6b19ba0b3a5239271bbdb449622da7fd4325a2cff6f34a28eab37`
- Extracted characters: 2116

~~~text
"""Phase 7V integration and safety regressions."""
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from arcane_check import check_source
from arcane_runtime import ArcaneRuntime, Diagnostic

ROOT = Path(__file__).resolve().parent

class Phase7VIntegrationTests(unittest.TestCase):
    def test_checker_and_runtime_share_block_parser(self):
        source = 'KWAM x => 1\nKWAI FRAEQ 1 1 THEN\nKWAT x'
        checked = check_source(source)
        executed = ArcaneRuntime().run_program(source)
        self.assertFalse(checked.ok)
        self.assertIsInstance(executed, Diagnostic)
        self.assertEqual(checked.issues[0].code, executed.code)

    def test_checker_rejects_malformed_statement_shapes(self):
        for source in ('KWAM x 1', 'KWAF f(x) $x', 'KWAT x(1)'):
            with self.subTest(source=source):
                self.assertFalse(check_source(source).ok)

    def test_recursive_function_hits_guard_not_python_recursion_error(self):
        result = ArcaneRuntime(max_call_depth=4).run_program(
            'KWAF loop(x) => loop($x)\nKWAM y => loop(1)'
        )
        self.assertIsInstance(result, Diagnostic)
        self.assertEqual(result.code, 'ARC-RUN-002')

    def test_runtime_state_resets_between_runs(self):
        runtime = ArcaneRuntime()
        self.assertEqual(runtime.run_program('KWAM x => 3\nKWAT x'), [3])
        self.assertEqual(runtime.run_program('KWAM x => 4\nKWAT x'), [4])

    def test_cli_does_not_execute_semantically_invalid_program(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'bad.arc'
            path.write_text('KWAM x => 1\nKWAT missing\n', encoding='utf-8')
            result = subprocess.run(
                [sys.executable, str(ROOT / 'arcane_cli.py'), '--run', str(path)],
                capture_output=True, text=True, cwd=ROOT
            )
            self.assertEqual(result.returncode, 1)
            self.assertIn('ARC-SEM-005', result.stdout)
            self.assertNotIn('\n1\n', result.stdout)

if __name__ == '__main__':
    unittest.main(verbosity=2)

~~~

## test_phase7w.py

- Type: PY
- SHA-256: `30f7e1c34dd43d09abc4ca97a0770873d47da91cac3ca0679bb7c8d335164fa5`
- Extracted characters: 3184

~~~text
import subprocess,sys,tempfile,unittest
from pathlib import Path
from arcane_runtime import ArcaneRuntime,Diagnostic
from arcane_check import check_source
from arcane_semantic import analyze_source
ROOT=Path(__file__).parent
class Phase7W(unittest.TestCase):
 def test_forward_function_call(self):
  self.assertEqual(ArcaneRuntime().run_program("KWAM x => double(4)\nKWAF double(n) => FRATA $n 2\nKWAT x"),[8])
 def test_nested_calls(self):
  self.assertEqual(ArcaneRuntime().run_program("KWAF add(a,b) => $a+$b\nKWAF sq(x) => $x*$x\nKWAM v => add(sq(3),1)\nKWAT v"),[10])
 def test_arity_nested_call(self):
  codes=[x.code for x in analyze_source("KWAF f(x) => $x\nKWAM v => f(g(1,2))").issues]
  self.assertIn("ARC-SEM-006",codes)
 def test_duplicate_functions(self):
  r=ArcaneRuntime().run_program("KWAM x => 1\nKWAF f(x) => $x\nKWAF f(y) => $y")
  self.assertIsInstance(r,Diagnostic); self.assertEqual(r.code,"ARC-SEM-003")
 def test_duplicate_params(self):
  self.assertIn("ARC-SEM-002",[x.code for x in analyze_source("KWAF f(x,x) => $x").issues])
 def test_duplicate_binding(self):
  self.assertIn("ARC-SEM-004",[x.code for x in analyze_source("KWAM x => 1\nKWAM x => 2").issues])
 def test_branch_binding_does_not_escape(self):
  self.assertIn("ARC-SEM-005",[x.code for x in analyze_source("KWAI FRAEQ 1 1 THEN\nKWAM a => 2\nEND\nKWAT a").issues])
 def test_branch_local_binding(self):
  self.assertEqual(ArcaneRuntime().run_program("KWAI FRAEQ 1 1 THEN\nKWAM a => 2\nKWAT a\nEND"),[2])
 def test_checker_and_runtime_share_parser(self):
  s="KWAI FRAEQ 1 1 THEN\nKWAM x => 2"
  self.assertFalse(check_source(s).ok); self.assertIsInstance(ArcaneRuntime().run_program(s),Diagnostic)
 def test_cli_blocks_invalid_program(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d)/"bad.arc"; p.write_text("KWAM x => 1\nKWAT absent\n")
   r=subprocess.run([sys.executable,str(ROOT/"arcane_cli.py"),"--run",str(p)],capture_output=True,text=True)
   self.assertEqual(r.returncode,1); self.assertIn("ARC-SEM-005",r.stdout); self.assertNotIn("\n1\n",r.stdout)
 def test_recursion_guard(self):
  r=ArcaneRuntime(max_call_depth=4).run_program("KWAF f(x) => f($x)\nKWAM y => f(1)")
  self.assertIsInstance(r,Diagnostic); self.assertEqual(r.code,"ARC-RUN-002")
 def test_step_guard(self):
  r=ArcaneRuntime(max_steps=1).run_program("KWAM a => 1\nKWAT a")
  self.assertIsInstance(r,Diagnostic); self.assertEqual(r.code,"ARC-RUN-003")
 def test_division_by_zero(self):
  r=ArcaneRuntime().run_program("KWAM a => 1/0")
  self.assertIsInstance(r,Diagnostic); self.assertEqual(r.code,"ARC-RUN-001")
 def test_precedence(self):
  self.assertEqual(ArcaneRuntime().run_program("KWAM a => 2+3*4\nKWAT a"),[14])
 def test_comment(self):
  self.assertEqual(ArcaneRuntime().run_program("# hi\nKWAM a => 3\nKWAT a"),[3])
 def test_state_reset(self):
  r=ArcaneRuntime(); self.assertEqual(r.run_program("KWAM a => 1\nKWAT a"),[1]); self.assertEqual(r.run_program("KWAM a => 2\nKWAT a"),[2])
 def test_function_does_not_capture_global(self):
  self.assertIn("ARC-SEM-005",[x.code for x in analyze_source("KWAM g => 9\nKWAF f(x) => $g+$x").issues])
if __name__=="__main__":unittest.main(verbosity=2)

~~~

