#!/usr/bin/env python3
"""Arcane Phase 5.24: diagnostic binding/symbol semantics prototype.

Audit notation only; this is not the canonical spoken surface grammar or a spell engine.
Supported forms:
  KI / TO / MU ...             canonical digit tokens (0..9)
  NAME                         named external input from `inputs`
  OP⟨arg, arg⟩                 nested expression
  KWAM⟨NAME, expression⟩       declare a binding; capture current value
  KWAT⟨NAME⟩                   read captured value
  KWAK⟨NAME⟩                   re-evaluate the binding's defining expression

A binding declaration stores both the captured value and its defining expression.
KWAT reads the captured value; KWAK evaluates the definition against current inputs.
This is an explicit PROVISIONAL convention for testing, not a recovered historical rule.
"""
from __future__ import annotations
from dataclasses import dataclass
import argparse, json, re
from typing import Any

DIGITS = {'ZA':0,'KI':1,'TO':2,'MU':3,'RE':4,'SA':5,'FI':6,'DU':7,'GO':8,'PE':9}
UNITS = {'MA': (('L',1),), 'SE': (('T',1),), 'KE': (('M',1),), 'RA': (), 'KU': (('TEMP',1),)}

class ArcaneError(Exception): pass
class ParseError(ArcaneError): pass
class NameResolutionError(ArcaneError): pass
class TypeCheckError(ArcaneError): pass
class EvaluationError(ArcaneError): pass

@dataclass(frozen=True)
class Quantity:
    value: float
    dim: tuple[tuple[str,int], ...] = ()
    def __str__(self): return f"{self.value:g} [{dimstr(self.dim)}]"

def dimstr(d):
    if not d: return '1'
    return '·'.join(k if p == 1 else f'{k}^{p}' for k,p in d)

def normdim(d): return tuple(sorted((k,p) for k,p in d.items() if p))
def combine(a,b,sign=1):
    x=dict(a); y=dict(b)
    for k,p in y.items(): x[k]=x.get(k,0)+sign*p
    return normdim(x)

@dataclass(frozen=True)
class Node:
    name: str
    args: tuple[Any,...] = ()
    literal: Any = None

TOKEN = re.compile(r'\s*([A-Za-z_][A-Za-z_0-9]*|⟨|⟩|,|:|[-+]?\d+(?:\.\d+)?)')
class Parser:
    def __init__(self, s):
        self.tokens=[]; pos=0
        while pos < len(s):
            m=TOKEN.match(s,pos)
            if not m:
                if s[pos:].strip()=='' : break
                raise ParseError(f"Unexpected character at position {pos}: {s[pos:pos+12]!r}")
            self.tokens.append(m.group(1)); pos=m.end()
        self.i=0
    def peek(self): return self.tokens[self.i] if self.i<len(self.tokens) else None
    def pop(self):
        t=self.peek()
        if t is None: raise ParseError('Unexpected end of expression')
        self.i+=1; return t
    def parse(self):
        n=self.expr()
        if self.peek() is not None: raise ParseError(f"Unexpected token {self.peek()!r}")
        return n
    def expr(self):
        name=self.pop()
        if name in ('⟨','⟩',',',':'): raise ParseError(f'Expected expression, got {name!r}')
        if self.peek()==':':
            self.pop(); unit=self.pop()
            if unit not in UNITS: raise ParseError(f'Unknown unit {unit!r}')
            try: value=float(name)
            except ValueError: raise ParseError('Typed literals require a numeric value, e.g. 2:MA')
            return Node('LITERAL',literal=Quantity(value,UNITS[unit]))
        if re.fullmatch(r'[-+]?\d+(?:\.\d+)?',name): return Node('LITERAL',literal=Quantity(float(name)))
        if self.peek()!='⟨': return Node(name)
        self.pop(); args=[]
        if self.peek()!='⟩':
            while True:
                args.append(self.expr())
                if self.peek()==',': self.pop(); continue
                break
        if self.pop()!='⟩': raise ParseError('Expected closing ⟩')
        return Node(name,tuple(args))

def parse(s): return Parser(s).parse()

ARITY={'FRAPA':2,'FRATA':2,'FRAKA':2,'FRALA':2,'FRASHA':1,'KWAM':2,'KWAT':1,'KWAK':1}

def validate_arity(n):
    if n.name in ARITY and len(n.args)!=ARITY[n.name]:
        raise TypeCheckError(f'{n.name} expects {ARITY[n.name]} argument(s), got {len(n.args)}')
    for a in n.args: validate_arity(a)

def name_arg(n, op):
    if n.name not in ('IDENT',) and n.args: raise TypeCheckError(f'{op} first/only argument must be a binding name')
    if n.name in ('LITERAL','KWAM','KWAT','KWAK','FRAPA','FRATA','FRAKA','FRALA','FRASHA'):
        raise TypeCheckError(f'{op} requires a binding identifier, not {n.name}')
    return n.name

class Scope:
    def __init__(self,parent=None): self.parent=parent; self.bindings={}
    def resolve(self,name):
        if name in self.bindings: return self.bindings[name]
        if self.parent: return self.parent.resolve(name)
        raise NameResolutionError(f'Undefined binding {name!r}')
    def declare(self,name,entry):
        if name in self.bindings: raise NameResolutionError(f'Duplicate declaration {name!r} in the same scope')
        self.bindings[name]=entry

@dataclass
class Binding:
    expression: Node
    captured: Any

class Evaluator:
    def __init__(self, inputs=None): self.inputs=inputs if inputs is not None else {}; self.scope=Scope(); self.events=[]
    def eval(self,n):
        if n.name=='LITERAL': return n.literal
        if n.name in DIGITS: return Quantity(float(DIGITS[n.name]))
        if n.name=='KWAM':
            name=name_arg(n.args[0], 'KWAM')
            # RHS is evaluated before declaration, so a failed RHS never leaves a partial binding.
            value=self.eval(n.args[1])
            self.scope.declare(name,Binding(n.args[1],value))
            self.events.append({'event':'declare','name':name,'captured':show(value)})
            return value
        if n.name=='KWAT':
            name=name_arg(n.args[0], 'KWAT'); b=self.scope.resolve(name)
            self.events.append({'event':'read-captured','name':name,'value':show(b.captured)})
            return b.captured
        if n.name=='KWAK':
            name=name_arg(n.args[0], 'KWAK'); b=self.scope.resolve(name)
            value=self.eval(b.expression)
            self.events.append({'event':'reevaluate-live','name':name,'value':show(value)})
            return value
        if not n.args:
            if n.name not in self.inputs: raise NameResolutionError(f'Undefined external input or binding {n.name!r}')
            v=self.inputs[n.name]
            return v if isinstance(v,Quantity) else Quantity(float(v))
        vals=[self.eval(a) for a in n.args]
        if n.name in ('FRAPA','FRATA'):
            a,b=quantities(vals,n.name)
            if a.dim!=b.dim: raise TypeCheckError(f'{n.name} requires matching dimensions; got {dimstr(a.dim)} and {dimstr(b.dim)}')
            return Quantity(a.value+b.value if n.name=='FRAPA' else a.value-b.value,a.dim)
        if n.name=='FRAKA':
            a,b=quantities(vals,n.name); return Quantity(a.value*b.value,combine(a.dim,b.dim))
        if n.name=='FRALA':
            a,b=quantities(vals,n.name)
            if b.value==0: raise EvaluationError('FRALA division by zero')
            return Quantity(a.value/b.value,combine(a.dim,b.dim,-1))
        if n.name=='FRASHA':
            (a,)=quantities(vals,n.name); return Quantity(-a.value,a.dim)
        raise TypeCheckError(f'No executable semantics registered for operator {n.name!r}')

def quantities(vals,op):
    if not all(isinstance(v,Quantity) for v in vals): raise TypeCheckError(f'{op} expects numeric quantities')
    return vals

def show(v): return str(v) if isinstance(v,Quantity) else repr(v)
def run(expression, inputs=None):
    tree=parse(expression); validate_arity(tree); ev=Evaluator(inputs); result=ev.eval(tree)
    return {'expression':expression,'result':show(result),'events':ev.events}

def selftest():
    tests=[]
    def test(id,desc,fn):
        try: detail=fn(); tests.append({'id':id,'status':'PASS','description':desc,'detail':str(detail)})
        except Exception as e: tests.append({'id':id,'status':'FAIL','description':desc,'detail':f'{type(e).__name__}: {e}'})
    def expect_error(fn, cls):
        try: fn()
        except cls as e: return f'rejected: {e}'
        raise AssertionError(f'expected {cls.__name__}')
    test('P5.24-T01','KWAM declares a binding and KWAT reads captured value',lambda: run('KWAM⟨X, FRAPA⟨KI, TO⟩⟩') if False else captured_test())
    test('P5.24-T02','KWAK reevaluates a stored expression against changed inputs',live_test)
    test('P5.24-T03','Undefined binding is rejected',lambda: expect_error(lambda:run('KWAT⟨MISSING⟩'),NameResolutionError))
    test('P5.24-T04','Duplicate declaration in same scope is rejected',lambda: expect_error(lambda: duplicate_test(),NameResolutionError))
    test('P5.24-T05','Dimension mismatch during live evaluation is rejected',lambda: expect_error(lambda:run('FRAPA⟨A, B⟩',{'A':Quantity(1,UNITS['MA']),'B':Quantity(1,UNITS['SE'])}),TypeCheckError))
    test('P5.24-T06','Division by zero is rejected',lambda: expect_error(lambda:run('FRALA⟨KI, ZA⟩'),EvaluationError))
    test('P5.24-T07','Declaration is atomic if its RHS fails',atomic_test)
    test('P5.24-T08','Captured value stays stable after external input changes',captured_stability_test)
    test('P5.24-T09','Nested arithmetic inside a binding preserves parse structure',lambda: run('KWAM⟨X, FRAPA⟨KI, FRAPA⟨TO, MU⟩⟩⟩'))
    test('P5.24-T10','Malformed arity is rejected before evaluation',lambda: expect_error(lambda:run('FRAPA⟨KI⟩'),TypeCheckError))
    return tests

def captured_test():
    ev=Evaluator(); val=ev.eval(parse('KWAM⟨X, FRAPA⟨KI, TO⟩⟩')); got=ev.eval(parse('KWAT⟨X⟩'))
    assert val.value==3 and got.value==3
    return f'declaration={val}; KWAT={got}'
def live_test():
    inputs={'POSITION':Quantity(4,UNITS['MA'])}; ev=Evaluator(inputs)
    ev.eval(parse('KWAM⟨P, POSITION⟩')); captured=ev.eval(parse('KWAT⟨P⟩'))
    inputs['POSITION']=Quantity(9,UNITS['MA']); live=ev.eval(parse('KWAK⟨P⟩'))
    assert captured.value==4 and live.value==9
    return f'KWAT={captured}; KWAK after update={live}'
def duplicate_test():
    ev=Evaluator(); ev.eval(parse('KWAM⟨X, KI⟩')); ev.eval(parse('KWAM⟨X, TO⟩'))
def atomic_test():
    ev=Evaluator()
    try: ev.eval(parse('KWAM⟨X, UNKNOWN⟩'))
    except NameResolutionError: pass
    assert 'X' not in ev.scope.bindings
    return 'failed RHS left no X binding'
def captured_stability_test():
    inputs={'P':Quantity(2)}; ev=Evaluator(inputs); ev.eval(parse('KWAM⟨X, P⟩'))
    inputs['P']=Quantity(7); a=ev.eval(parse('KWAT⟨X⟩')); b=ev.eval(parse('KWAK⟨X⟩'))
    assert a.value==2 and b.value==7
    return f'captured={a}; live={b}'

def main():
    ap=argparse.ArgumentParser(description=__doc__); ap.add_argument('--expr'); ap.add_argument('--inputs',default='{}',help='JSON object of external numeric inputs'); ap.add_argument('--selftest',action='store_true'); ap.add_argument('--json',action='store_true')
    a=ap.parse_args()
    if a.selftest:
        tests=selftest(); print(json.dumps(tests,indent=2) if a.json else '\n'.join(f"{t['id']} {t['status']} — {t['description']}: {t['detail']}" for t in tests)); raise SystemExit(0 if all(t['status']=='PASS' for t in tests) else 1)
    if not a.expr: ap.error('provide --expr or --selftest')
    try: result=run(a.expr,json.loads(a.inputs)); print(json.dumps(result,indent=2) if a.json else f"{result['expression']} => {result['result']}\nEvents: {result['events']}")
    except ArcaneError as e: print(f'ERROR: {type(e).__name__}: {e}'); raise SystemExit(2)
if __name__=='__main__': main()
