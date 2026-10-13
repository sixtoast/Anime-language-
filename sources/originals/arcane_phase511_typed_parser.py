"""Phase 5.11 audit parser: typed abstract expressions, not a surface Arcane compiler."""
from dataclasses import dataclass
from fractions import Fraction

@dataclass(frozen=True)
class Type:
    kind: str
    dims: tuple = ()  # length,time,mass,temperature,angle exponents
    frame: str|None = None

@dataclass(frozen=True)
class Value:
    value: Fraction
    type: Type

SCALAR=Type('scalar')
BOOL=Type('boolean')
DIMLESS=Type('quantity',(0,0,0,0,0))
LENGTH=Type('quantity',(1,0,0,0,0))
TIME=Type('quantity',(0,1,0,0,0))
MASS=Type('quantity',(0,0,1,0,0))
TEMP=Type('quantity',(0,0,0,1,0))
ANGLE=Type('quantity',(0,0,0,0,1))

def add(a,b):
    if a.type.kind!='quantity' or b.type.kind!='quantity': raise TypeError('FRAPA requires quantities')
    if a.type.dims!=b.type.dims: raise TypeError('FRAPA dimension mismatch')
    if a.type.frame!=b.type.frame: raise TypeError('FRAPA frame mismatch')
    return Value(a.value+b.value,a.type)
def sub(a,b):
    if a.type.kind!='quantity' or b.type.kind!='quantity': raise TypeError('FRAJA/FRATA requires quantities')
    if a.type.dims!=b.type.dims: raise TypeError('subtract dimension mismatch')
    if a.type.frame!=b.type.frame: raise TypeError('subtract frame mismatch')
    return Value(a.value-b.value,a.type)
def mul(a,b):
    if a.type.kind!='quantity' or b.type.kind!='quantity': raise TypeError('FRAMA/FRAKA requires quantities')
    if a.type.frame is not None or b.type.frame is not None: raise TypeError('frame-bearing quantities require explicit vector/scalar rules')
    dims=tuple(x+y for x,y in zip(a.type.dims,b.type.dims))
    return Value(a.value*b.value,Type('quantity',dims))
def div(a,b):
    if a.type.kind!='quantity' or b.type.kind!='quantity': raise TypeError('FRALA requires quantities')
    if b.value==0: raise ZeroDivisionError('FRALA denominator is zero')
    if a.type.frame is not None or b.type.frame is not None: raise TypeError('frame-bearing quantities require explicit vector/scalar rules')
    dims=tuple(x-y for x,y in zip(a.type.dims,b.type.dims))
    return Value(a.value/b.value,Type('quantity',dims))
def compare(a,b,relation):
    if a.type!=b.type: raise TypeError('DRAS/DRAL requires comparable values of matching type and frame')
    if relation=='NADI': return a.value==b.value
    if relation=='DOFA': return a.value<b.value
    if relation=='GUWI': return a.value>b.value
    raise TypeError('unknown comparison relation')

# Explicit audit AST representation. It is intentionally not claimed to be surface Arcane.
@dataclass(frozen=True)
class Expr:
    op: str
    args: tuple

def parse_audit(text):
    """Parse OP⟨arg,...⟩ recursively; audit punctuation is meta-notation only."""
    s=text.strip()
    def skip(i):
        while i<len(s) and s[i].isspace(): i+=1
        return i
    def expr(i):
        i=skip(i); start=i
        while i<len(s) and (s[i].isalnum() or s[i]=='_'): i+=1
        if i==start: raise ValueError('expected operator or atom')
        op=s[start:i]
        i=skip(i)
        if i>=len(s) or s[i]!='⟨': return op,i
        i+=1; args=[]
        if i<len(s) and s[i]=='⟩': return Expr(op,()),i+1
        while True:
            arg,i=expr(i); args.append(arg); i=skip(i)
            if i>=len(s): raise ValueError('unclosed argument list')
            if s[i]=='⟩': return Expr(op,tuple(args)),i+1
            if s[i]!=',': raise ValueError('expected comma or closing bracket')
            i+=1
    node,end=expr(0); end=skip(end)
    if end!=len(s): raise ValueError('trailing tokens')
    return node

def arity_check(node, signatures):
    if not isinstance(node,Expr): return True
    if node.op not in signatures: raise ValueError(f'unknown operator: {node.op}')
    lo,hi=signatures[node.op]
    if not lo<=len(node.args)<=hi: raise ValueError(f'{node.op} arity error')
    for a in node.args: arity_check(a,signatures)
    return True

def tests():
    out=[]
    def t(n,f):
        try: assert f(); out.append(('PASS',n))
        except Exception as e: out.append(('FAIL',n+': '+str(e)))
    one=Value(Fraction(1),LENGTH); two=Value(Fraction(2),LENGTH); sec=Value(Fraction(1),TIME)
    t('same-dimension addition',lambda:add(one,two)==Value(Fraction(3),LENGTH))
    t('length plus time rejected',lambda:reject(lambda:add(one,sec)))
    t('length times length gives area',lambda:mul(one,two).type.dims==(2,0,0,0,0))
    t('length divided by time gives velocity dimensions',lambda:div(one,sec).type.dims==(1,-1,0,0,0))
    t('division by zero rejected',lambda:reject(lambda:div(one,Value(Fraction(0),LENGTH))))
    t('matching-type comparison works',lambda:compare(one,two,'DOFA') is True)
    t('mismatched-type comparison rejected',lambda:reject(lambda:compare(one,sec,'DOFA')))
    t('nested audit parse',lambda:parse_audit('FRAPA⟨KI,FRAPA⟨TO,MU⟩⟩')==Expr('FRAPA',('KI',Expr('FRAPA',('TO','MU')))))
    t('missing close bracket rejected',lambda:reject(lambda:parse_audit('FRAPA⟨KI,TO')))
    t('trailing tokens rejected',lambda:reject(lambda:parse_audit('KI TO')))
    sig={'FRAPA':(2,2),'FRASHA':(1,1)}
    t('fixed arity accepted',lambda:arity_check(parse_audit('FRAPA⟨KI,TO⟩'),sig))
    t('missing argument rejected',lambda:reject(lambda:arity_check(parse_audit('FRAPA⟨KI⟩'),sig)))
    t('extra argument rejected',lambda:reject(lambda:arity_check(parse_audit('FRAPA⟨KI,TO,MU⟩'),sig)))
    t('unknown operator rejected',lambda:reject(lambda:arity_check(parse_audit('BOGUS⟨KI⟩'),sig)))
    return out

def reject(fn):
    try: fn()
    except (ValueError,TypeError,ZeroDivisionError): return True
    return False
if __name__=='__main__':
    rs=tests()
    for s,n in rs: print(f'{s}\t{n}')
    print(f'RESULT: {sum(s=="PASS" for s,_ in rs)}/{len(rs)} PASS')
    if any(s!='PASS' for s,_ in rs): raise SystemExit(1)
