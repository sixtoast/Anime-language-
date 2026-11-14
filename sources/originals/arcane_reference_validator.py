#!/usr/bin/env python3
"""Arcane Phase 5.7 reference validator (not a full Arcane parser/compiler).

Audit notation: OPERATOR⟨argument, argument, ...⟩
Typed atoms: Q:length, Q:time, Q:dimensionless, V:3d, Bool, Comparable,
             Criterion, LiveExpr, Reference, Expr
Nested expressions may be supplied as operator expressions.

Examples:
  python arcane_reference_validator.py 'FRAPA⟨Q:length, Q:length⟩'
  python arcane_reference_validator.py 'FRATA⟨Q:length, Q:length⟩'

This validates a small, explicitly provisional signature subset. It does not parse
ordinary spoken Arcane, establish all quantity semantics, or execute mana effects.
"""
import re
import sys
from dataclasses import dataclass

ALIASES = {
    'frata': 'fraja', 'fraka': 'frama', 'drim': 'drum',
    'ren': 'ben', 'grak': 'grash', 'kwak': 'kwash', 'dral': 'dras',
}

@dataclass(frozen=True)
class Sig:
    arity: int
    inputs: tuple
    output: str
    note: str = ''

SIGS = {
    'frapa': Sig(2, ('Quantity', 'Quantity'), 'Quantity', 'Addition; compatible dimensions and semantic kinds required.'),
    'fraja': Sig(2, ('Quantity', 'Quantity'), 'Quantity', 'Subtraction; operand order is significant.'),
    'frama': Sig(2, ('Quantity', 'Quantity'), 'Quantity', 'Multiplication; dimensional algebra required.'),
    'dran': Sig(1, ('Vector',), 'Quantity', 'Magnitude; output nonnegative.'),
    'drem': Sig(2, ('Vector', 'Vector'), 'Quantity', 'Dot product; compatible frames and dimensions required.'),
    'drum': Sig(2, ('Vector3', 'Vector3'), 'Vector3', 'Cross product; Phase 4 D-017 frame rule applies.'),
    'dras': Sig(3, ('Comparable', 'Comparable', 'Criterion'), 'Boolean', 'Criterion encoding remains unresolved.'),
    'grash': Sig(1, ('Boolean',), 'Boolean', 'Provisional NOT signature.'),
    'kwash': Sig(1, ('LiveExprOrReference',), 'UnknownValue', 'Evaluation timing remains unresolved.'),
}

class ValidationError(Exception): pass

def split_args(s):
    args=[]; start=0; depth=0; i=0
    while i < len(s):
        if s.startswith('⟨', i): depth += 1; i += 1; continue
        if s.startswith('⟩', i):
            depth -= 1
            if depth < 0: raise ValidationError('unbalanced closing angle bracket')
            i += 1; continue
        if s[i] == ',' and depth == 0:
            args.append(s[start:i].strip()); start=i+1
        i += 1
    if depth != 0: raise ValidationError('unbalanced angle brackets')
    tail=s[start:].strip()
    if tail or args: args.append(tail)
    return args

def norm_type(t):
    t=t.strip()
    if t.lower().startswith('q:'): return 'Quantity'
    if t.lower() in {'v:3d','vector3','v3'}: return 'Vector3'
    if t.lower().startswith('v:'): return 'Vector'
    aliases={'bool':'Boolean','boolean':'Boolean','comparable':'Comparable','criterion':'Criterion','liveexpr':'LiveExpr','reference':'Reference','expr':'Expression'}
    return aliases.get(t.lower(), t)

def compatible(expected, got):
    if expected == 'Quantity': return got == 'Quantity'
    if expected == 'Vector': return got in {'Vector','Vector3'}
    if expected == 'Vector3': return got == 'Vector3'
    if expected == 'LiveExprOrReference': return got in {'LiveExpr','Reference','Expression'}
    return expected == got

def infer(expr):
    expr=expr.strip()
    if '⟨' not in expr:
        t=norm_type(expr)
        if t not in {'Quantity','Vector','Vector3','Boolean','Comparable','Criterion','LiveExpr','Reference','Expression'}:
            raise ValidationError(f'unknown typed atom or malformed expression: {expr!r}')
        return t, []
    m=re.fullmatch(r'\s*([A-Za-z][A-Za-z0-9 ]*)\s*⟨(.*)⟩\s*', expr)
    if not m: raise ValidationError('malformed operator expression; expected OPERATOR⟨...⟩')
    op=m.group(1).strip().lower()
    if op in ALIASES: op=ALIASES[op]
    # FRASHA is in the canonical inventory, but its post-Phase-4 preferred spelling/signature
    # has not been established here; deliberately do not pretend otherwise.
    sig=SIGS.get(op)
    if sig is None: raise ValidationError(f'no validated signature in this reference subset for {op.upper()}')
    args=split_args(m.group(2))
    if len(args) != sig.arity:
        raise ValidationError(f'{op.upper()} expects {sig.arity} argument(s), received {len(args)}')
    got=[]
    for a in args:
        typ, _=infer(a); got.append(typ)
    for i,(expected,actual) in enumerate(zip(sig.inputs,got), start=1):
        if not compatible(expected,actual):
            raise ValidationError(f'{op.upper()} argument {i} expects {expected}, received {actual}')
    # Do not infer physical dimensional validity from the broad Quantity type.
    return sig.output, [f'canonical operator {op.upper()}', sig.note, 'quantity dimensions/kinds and coordinate-frame compatibility are not fully checked by this harness']

def validate(s):
    try:
        typ, notes=infer(s)
        return True, f'ACCEPTED as {typ}' + (('; ' + '; '.join(notes)) if notes else '')
    except ValidationError as e:
        return False, f'REJECTED: {e}'

def main():
    if len(sys.argv) != 2:
        print(__doc__.strip(), file=sys.stderr); return 2
    ok, detail=validate(sys.argv[1])
    print(('PASS' if ok else 'FAIL') + ' | ' + detail)
    return 0 if ok else 1

if __name__ == '__main__': raise SystemExit(main())
