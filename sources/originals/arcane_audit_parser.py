#!/usr/bin/env python3
"""Arcane Phase 6 audit parser.

Parses the provisional Phase 2 audit notation OP⟨arg1, arg2, ...⟩.
This is NOT a parser for spoken Arcane or the full canonical formal language.
It validates grouping, argument boundaries, selected fixed arities, and malformed input.
"""
from dataclasses import dataclass
import re

TOKEN = re.compile(r"\s*(?:(?P<ident>[A-Za-z_][A-Za-z0-9_-]*)|(?P<langle>⟨)|(?P<rangle>⟩)|(?P<comma>,)|(?P<other>[^\s]))")

@dataclass(frozen=True)
class Atom:
    value: str

@dataclass(frozen=True)
class Call:
    operator: str
    args: tuple

class ParseError(ValueError):
    pass

class Parser:
    def __init__(self, source):
        self.tokens = []
        for m in TOKEN.finditer(source):
            kind = next(k for k, v in m.groupdict().items() if v is not None)
            self.tokens.append((kind, m.group(kind)))
        self.i = 0
        # Detect characters the tokenizer cannot consume rather than silently skipping them.
        consumed = ''.join(m.group(0) for m in TOKEN.finditer(source))
        if consumed.replace(' ', '') != source.replace(' ', ''):
            raise ParseError('Unrecognised character or token')

    def peek(self, kind=None):
        if self.i >= len(self.tokens): return False if kind else None
        return self.tokens[self.i][0] == kind if kind else self.tokens[self.i]

    def take(self, kind):
        if not self.peek(kind):
            got = self.peek()
            raise ParseError(f'Expected {kind}, got {got}')
        tok = self.tokens[self.i]
        self.i += 1
        return tok[1]

    def expression(self):
        if not self.peek('ident'):
            raise ParseError(f'Expected identifier, got {self.peek()}')
        name = self.take('ident')
        if not self.peek('langle'):
            return Atom(name)
        self.take('langle')
        if self.peek('rangle'):
            self.take('rangle')
            return Call(name, ())
        args = [self.expression()]
        while self.peek('comma'):
            self.take('comma')
            args.append(self.expression())
        self.take('rangle')
        return Call(name, tuple(args))

    def parse(self):
        tree = self.expression()
        if self.i != len(self.tokens):
            raise ParseError(f'Trailing token {self.peek()}')
        return tree

ARITY = {
    'FRAPA': 2, 'FRATA': 2, 'FRAKA': 2, 'FRALA': 2,
    'FRASHA': 1, 'DRAN': 1, 'DREM': 2, 'DRIM': 2,
    'DRAL': 3, 'GRAN': 2, 'GRAT': 2, 'GRAK': 1,
    'BEK': 2, 'ZET': 2, 'KWAT': 1,
}

def check_arities(node, errors=None):
    errors = [] if errors is None else errors
    if isinstance(node, Call):
        expected = ARITY.get(node.operator)
        if expected is not None and len(node.args) != expected:
            errors.append(f'{node.operator}: expected {expected} args, got {len(node.args)}')
        for arg in node.args: check_arities(arg, errors)
    return errors

def tree_shape(node):
    if isinstance(node, Atom): return node.value
    return (node.operator, tuple(tree_shape(a) for a in node.args))

def run_tests():
    results=[]
    def test(test_id, name, fn):
        try:
            ok, detail = fn()
        except Exception as e:
            ok, detail = False, f'{type(e).__name__}: {e}'
        results.append((test_id, name, 'PASS' if ok else 'FAIL', detail))
    def parse(s): return Parser(s).parse()
    test('P6-T01','Binary expression parses',lambda: (tree_shape(parse('FRAPA⟨KI, TO⟩')) == ('FRAPA',('KI','TO')), str(tree_shape(parse('FRAPA⟨KI, TO⟩')))))
    test('P6-T02','Nested expression preserves tree',lambda: (tree_shape(parse('FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩')) == ('FRAPA',('KI',('FRAPA',('TO','MU')))), str(tree_shape(parse('FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩')))))
    test('P6-T03','Operand order preserved',lambda: (tree_shape(parse('FRATA⟨KI, TO⟩')) != tree_shape(parse('FRATA⟨TO, KI⟩')), 'Reversing arguments changes the tree'))
    test('P6-T04','Missing argument rejected',lambda: (rejects('FRAPA⟨KI,⟩'), 'Trailing/missing expression rejected'))
    test('P6-T05','Unclosed expression rejected',lambda: (rejects('FRAPA⟨KI, TO'), 'Missing closing bracket rejected'))
    test('P6-T06','Extra trailing token rejected',lambda: (rejects('FRAPA⟨KI, TO⟩ MU'), 'Trailing token rejected'))
    test('P6-T07','Wrong fixed arity rejected',lambda: (bool(check_arities(parse('FRAPA⟨KI⟩'))), str(check_arities(parse('FRAPA⟨KI⟩')))))
    test('P6-T08','Nested arity checked recursively',lambda: (bool(check_arities(parse('FRAPA⟨KI, FRASHA⟨TO, MU⟩⟩'))), str(check_arities(parse('FRAPA⟨KI, FRASHA⟨TO, MU⟩⟩')))))
    test('P6-T09','Unknown operators remain syntactically parseable',lambda: (isinstance(parse('CUSTOM⟨A, B⟩'), Call), 'Syntax is separate from signature registry'))
    test('P6-T10','Empty argument list structurally parses but arity check rejects known operator',lambda: (bool(check_arities(parse('FRAPA⟨⟩'))), str(check_arities(parse('FRAPA⟨⟩')))))
    return results

def rejects(s):
    try: parse_result=Parser(s).parse()
    except ParseError: return True
    return False

if __name__ == '__main__':
    rows=run_tests()
    for row in rows: print(' | '.join(row))
    print(f'RESULT: {sum(r[2]=="PASS" for r in rows)}/{len(rows)} tests passed')
