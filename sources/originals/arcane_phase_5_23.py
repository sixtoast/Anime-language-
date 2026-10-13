#!/usr/bin/env python3
"""Arcane Phase 5.23: bounded formal-expression parser, type checker and safe compile bridge.

Angle brackets are audit notation, not spoken Arcane syntax. This is deliberately
not a complete language compiler or a physical-feasibility simulator.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple, Union
import argparse, json, sys

DIGITS = {'ZA':0,'KI':1,'TO':2,'MU':3,'RE':4,'SA':5,'FI':6,'DU':7,'GO':8,'PE':9}
UNIT_DIM = {'MA': (('L',1),), 'SE': (('T',1),), 'KE': (('M',1),), 'KU': (('Theta',1),), 'RA': ()}
# Unit names are intentionally interpreted only in an explicit annotation: KI:MA.

class ArcaneError(Exception): pass
class ParseError(ArcaneError): pass
class TypeCheckError(ArcaneError): pass
class CompileError(ArcaneError): pass

@dataclass(frozen=True)
class Expr:
    op: str
    args: Tuple['Expr', ...] = ()
    value: Optional[str] = None

@dataclass(frozen=True)
class Type:
    kind: str
    dims: Tuple[Tuple[str,int], ...] = ()
    def __str__(self):
        if self.kind != 'Quantity': return self.kind
        if not self.dims: return 'Quantity[dimensionless]'
        return 'Quantity[' + ' '.join(k + ('^'+str(v) if v != 1 else '') for k,v in self.dims) + ']'

SCALAR = Type('Quantity', ())
BOOL = Type('Boolean')
INFO = Type('Information')

class Parser:
    def __init__(self, source: str):
        self.s = source
        self.i = 0
    def ws(self):
        while self.i < len(self.s) and self.s[self.i].isspace(): self.i += 1
    def ident(self):
        self.ws(); start=self.i
        while self.i < len(self.s) and (self.s[self.i].isalnum() or self.s[self.i]=='_'): self.i+=1
        if self.i == start: raise ParseError(f'Expected token at offset {self.i}')
        return self.s[start:self.i].upper()
    def expr(self):
        token=self.ident(); self.ws()
        if self.i < len(self.s) and self.s[self.i] == '⟨':
            self.i += 1; args=[]; self.ws()
            if self.i < len(self.s) and self.s[self.i] == '⟩': self.i += 1
            else:
                while True:
                    args.append(self.expr()); self.ws()
                    if self.i >= len(self.s): raise ParseError('Missing closing ⟩')
                    if self.s[self.i] == ',': self.i+=1; continue
                    if self.s[self.i] == '⟩': self.i+=1; break
                    raise ParseError(f'Expected comma or ⟩ at offset {self.i}')
            return Expr('call', tuple(args), token)
        if self.i < len(self.s) and self.s[self.i] == ':':
            self.i += 1; unit=self.ident()
            return Expr('literal', (), token+':'+unit)
        return Expr('atom', (), token)
    def parse(self):
        result=self.expr(); self.ws()
        if self.i != len(self.s): raise ParseError(f'Unexpected trailing input at offset {self.i}')
        return result

def dim_add(a, b, sign=1):
    d=dict(a)
    for k,v in b: d[k]=d.get(k,0)+sign*v
    return tuple(sorted((k,v) for k,v in d.items() if v))

# Only signatures sufficiently specified for a conservative prototype are accepted.
ARITY = {'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2,'FRASHA':1,'DRAN':1,'DREM':2,'DRIM':2,'DRAL':3,'GRAN':2,'GRAT':2,'GRAK':1}

def infer(e: Expr, env: Dict[str,Type]) -> Type:
    if e.op == 'atom':
        if e.value in DIGITS: return SCALAR
        if e.value in ('TRUE','FALSE'): return BOOL
        if e.value in env: return env[e.value]
        raise TypeCheckError(f'Unknown atom or unbound reference: {e.value}')
    if e.op == 'literal':
        number,unit=e.value.split(':',1)
        if number not in DIGITS: raise TypeCheckError(f'Only canonical digit atoms supported in literal, got {number}')
        if unit not in UNIT_DIM: raise TypeCheckError(f'Unknown unit: {unit}')
        return Type('Quantity', UNIT_DIM[unit])
    op=e.value
    if op not in ARITY: raise TypeCheckError(f'No approved type signature for operator {op}')
    if len(e.args) != ARITY[op]: raise TypeCheckError(f'{op} expects {ARITY[op]} arguments; got {len(e.args)}')
    ts=[infer(x,env) for x in e.args]
    if op in ('FRAPA','FRATA'):
        if any(t.kind!='Quantity' for t in ts): raise TypeCheckError(f'{op} requires quantities')
        if ts[0].dims != ts[1].dims: raise TypeCheckError(f'{op} requires matching dimensions: {ts[0]} vs {ts[1]}')
        return ts[0]
    if op=='FRAKA':
        if any(t.kind!='Quantity' for t in ts): raise TypeCheckError('FRAKA requires quantities')
        return Type('Quantity',dim_add(ts[0].dims,ts[1].dims))
    if op=='FRALA':
        if any(t.kind!='Quantity' for t in ts): raise TypeCheckError('FRALA requires quantities')
        return Type('Quantity',dim_add(ts[0].dims,ts[1].dims,-1))
    if op=='FRASHA':
        if ts[0].kind!='Quantity': raise TypeCheckError('FRASHA requires a quantity')
        return ts[0]
    if op=='DRAN':
        if ts[0].kind!='Vector': raise TypeCheckError('DRAN requires a vector; vector type declarations are not yet supported by this prototype')
        return Type('Quantity',ts[0].dims)
    if op=='DREM':
        if ts[0].kind!='Vector' or ts[1].kind!='Vector': raise TypeCheckError('DREM requires two vectors; vector type declarations are not yet supported')
        return Type('Quantity',dim_add(ts[0].dims,ts[1].dims))
    if op=='DRIM':
        if ts[0].kind!='Vector' or ts[1].kind!='Vector': raise TypeCheckError('DRIM requires two vectors; vector type declarations are not yet supported')
        return Type('Vector',dim_add(ts[0].dims,ts[1].dims))
    if op=='DRAL':
        if ts[0] != ts[1]: raise TypeCheckError('DRAL operands must have matching types and dimensions')
        if ts[2] not in (BOOL, INFO): raise TypeCheckError('DRAL third argument must be an explicitly represented relation criterion (not implemented as a dedicated type)')
        return BOOL
    if op in ('GRAN','GRAT'):
        if ts != [BOOL,BOOL]: raise TypeCheckError(f'{op} requires two Boolean operands')
        return BOOL
    if op=='GRAK':
        if ts != [BOOL]: raise TypeCheckError('GRAK requires one Boolean operand')
        return BOOL
    raise TypeCheckError(f'No type rule for {op}')

# Compiler bridge is intentionally tiny: it emits an intermediate representation,
# never a mana trajectory or physical action.
COMPILABLE = {'FRAPA','FRATA','FRAKA','FRALA','FRASHA','GRAN','GRAT','GRAK'}
def compile_ir(e: Expr):
    if e.op == 'atom':
        if e.value in DIGITS: return {'kind':'constant','value':DIGITS[e.value]}
        if e.value in ('TRUE','FALSE'): return {'kind':'boolean','value':e.value=='TRUE'}
        return {'kind':'reference','name':e.value}
    if e.op == 'literal':
        n,u=e.value.split(':',1)
        return {'kind':'quantity_literal','value':DIGITS[n],'unit':u}
    if e.value not in COMPILABLE:
        raise CompileError(f'{e.value} has no approved compiler mapping; rejected rather than guessed')
    return {'kind':'operator','operator':e.value,'args':[compile_ir(a) for a in e.args]}

def pretty(e):
    if e.op=='atom': return e.value
    if e.op=='literal': return e.value
    return e.value+'⟨'+', '.join(pretty(a) for a in e.args)+'⟩'

TESTS = [
 ('parse_nested','FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩','type_ok'),
 ('parse_trailing','FRAPA⟨KI, TO⟩ extra','parse_error'),
 ('arity_missing','FRAPA⟨KI⟩','type_error'),
 ('arity_extra','FRAPA⟨KI, TO, MU⟩','type_error'),
 ('add_dimension_mismatch','FRAPA⟨KI:MA, TO:SE⟩','type_error'),
 ('add_same_dimension','FRAPA⟨KI:MA, TO:MA⟩','type_ok'),
 ('multiply_dimensions','FRAKA⟨KI:MA, TO:SE⟩','type_ok'),
 ('divide_dimensions','FRALA⟨KI:MA, TO:MA⟩','type_ok'),
 ('unbound_reference','FRAPA⟨SPEED, KI⟩','type_error'),
 ('unsupported_compile','GAMA⟨RI, KI⟩','compile_error'),
 ('approved_compile','FRAPA⟨KI, TO⟩','compile_ok'),
 ('boolean_and','GRAN⟨TRUE, FALSE⟩','type_ok'),
 ('boolean_bad_operand','GRAN⟨KI, FALSE⟩','type_error'),
]
def run_tests():
    results=[]
    for name,src,expect in TESTS:
        try:
            ast=Parser(src).parse()
            if expect=='parse_error': outcome='parse_ok'
            elif expect=='compile_error':
                try: compile_ir(ast); outcome='compile_ok'
                except CompileError: outcome='compile_error'
            elif expect=='compile_ok':
                try:
                    infer(ast,{})
                    compile_ir(ast); outcome='compile_ok'
                except TypeCheckError: outcome='type_error'
                except CompileError: outcome='compile_error'
            else:
                try:
                    infer(ast,{})
                    outcome='type_ok'
                except TypeCheckError: outcome='type_error'
        except ParseError: outcome='parse_error'
        passed=outcome==expect
        results.append({'id':name,'input':src,'expected':expect,'actual':outcome,'passed':passed})
    return results

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--test',action='store_true'); ap.add_argument('--expr',default='FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩')
    ap.add_argument('--env-json',default='{}',help='JSON map of identifier to {kind,dims}; for example {"DIST":{"kind":"Quantity","dims":{"L":1}}}')
    args=ap.parse_args()
    if args.test:
        results=run_tests(); print(json.dumps({'phase':'5.23','passed':sum(r['passed'] for r in results),'total':len(results),'tests':results},indent=2)); return 0 if all(r['passed'] for r in results) else 1
    try:
        ast=Parser(args.expr).parse()
        raw=json.loads(args.env_json); env={k.upper():Type(v['kind'],tuple(sorted(v.get('dims',{}).items()))) for k,v in raw.items()}
        typ=infer(ast,env)
        try: ir=compile_ir(ast); compilation={'status':'mapped_to_intermediate_representation','ir':ir}
        except CompileError as ex: compilation={'status':'rejected_unmapped','reason':str(ex)}
        print(json.dumps({'phase':'5.23','source':args.expr,'normalised':pretty(ast),'type':str(typ),'compilation':compilation,'limits':['not spoken-surface grammar','not physical feasibility','not mana execution']},indent=2)); return 0
    except ArcaneError as ex:
        print(json.dumps({'phase':'5.23','status':'rejected','error':str(ex)},indent=2),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
