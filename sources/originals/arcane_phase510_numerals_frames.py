from fractions import Fraction
DIGITS={'za':'0','ki':'1','to':'2','mu':'3','re':'4','sa':'5','fi':'6','du':'7','go':'8','pe':'9'}
UNITS={'ma':'length','se':'time','ke':'mass','ra':'angle','ku':'temperature','sho':'dimensionless'}
def parse_quantity(tokens):
    """Parse one audit-token numeral closed by a canonical unit; no new lexemes."""
    if not tokens: raise ValueError('empty quantity')
    unit=tokens[-1].lower()
    if unit not in UNITS: raise ValueError('quantity is not closed by a canonical unit')
    body=[x.lower() for x in tokens[:-1]]
    if not body: raise ValueError('quantity has no digits')
    if body.count('shi')>1: raise ValueError('multiple decimal markers')
    if any(x not in DIGITS and x!='shi' for x in body): raise ValueError('non-digit inside numeral')
    if body[0]=='shi' or body[-1]=='shi': raise ValueError('decimal marker requires digits on both sides')
    if 'shi' in body:
        i=body.index('shi'); left=''.join(DIGITS[x] for x in body[:i]); right=''.join(DIGITS[x] for x in body[i+1:])
        value=Fraction(int(left+right),10**len(right))
    else: value=Fraction(int(''.join(DIGITS[x] for x in body)),1)
    return value,UNITS[unit]

def parse_identifier_and_value(tokens):
    # Audit-token contract: identifier is a SHO-closed numeral, immediately followed by a value numeral closed by its own unit.
    for i,t in enumerate(tokens):
        if t.lower()=='sho':
            ident,kind=parse_quantity(tokens[:i+1])
            if kind!='dimensionless': raise ValueError('identifier terminator must be SHO')
            val,unit=parse_quantity(tokens[i+1:])
            return int(ident),val,unit
    raise ValueError('missing SHO-closed identifier')

def matvec(m,v): return tuple(sum(m[i][j]*v[j] for j in range(3)) for i in range(3))
def transpose(m): return tuple(tuple(m[j][i] for j in range(3)) for i in range(3))
def mmul(a,b): return tuple(tuple(sum(a[i][k]*b[k][j] for k in range(3)) for j in range(3)) for i in range(3))
def validate_rotation(r):
    rt=transpose(r); ident=mmul(rt,r)
    if ident != ((1,0,0),(0,1,0),(0,0,1)): return False
    det=(r[0][0]*(r[1][1]*r[2][2]-r[1][2]*r[2][1])-r[0][1]*(r[1][0]*r[2][2]-r[1][2]*r[2][0])+r[0][2]*(r[1][0]*r[2][1]-r[1][1]*r[2][0]))
    return det in (1,-1)

def run():
    checks=[]
    def test(name,fn):
        try: assert fn(); checks.append((name,'PASS'))
        except Exception as e: checks.append((name,'FAIL: '+str(e)))
    test('P5.10-T01 integer quantity closes with MA',lambda: parse_quantity(['ki','to','mu','ma'])==(Fraction(123),'length'))
    test('P5.10-T02 decimal quantity 0.20 m preserves value',lambda: parse_quantity(['za','shi','to','za','ma'])==(Fraction(1,5),'length'))
    test('P5.10-T03 SHO closes dimensionless numeral',lambda: parse_quantity(['ki','sho'])==(Fraction(1),'dimensionless'))
    test('P5.10-T04 seconds unit classified as time',lambda: parse_quantity(['sa','se'])==(Fraction(5),'time'))
    test('P5.10-T05 missing unit rejected',lambda: reject(lambda:parse_quantity(['ki','to'])))
    test('P5.10-T06 unknown unit rejected',lambda: reject(lambda:parse_quantity(['ki','xx'])))
    test('P5.10-T07 repeated decimal marker rejected',lambda: reject(lambda:parse_quantity(['ki','shi','to','shi','mu','ma'])))
    test('P5.10-T08 leading decimal marker rejected',lambda: reject(lambda:parse_quantity(['shi','ki','ma'])))
    test('P5.10-T09 trailing decimal marker rejected',lambda: reject(lambda:parse_quantity(['ki','shi','ma'])))
    test('P5.10-T10 identifier/value split by SHO',lambda:parse_identifier_and_value(['ki','sho','to','mu','ma'])==(1,Fraction(23),'length'))
    test('P5.10-T11 multi-digit identifier remains exact',lambda:parse_identifier_and_value(['ki','to','sho','mu','ma'])==(12,Fraction(3),'length'))
    test('P5.10-T12 missing SHO identifier rejected',lambda:reject(lambda:parse_identifier_and_value(['ki','to','mu','ma'])))
    I=((1,0,0),(0,1,0),(0,0,1)); R=((0,-1,0),(1,0,0),(0,0,1))
    test('P5.10-T13 identity matrix is valid rotation',lambda:validate_rotation(I))
    test('P5.10-T14 90-degree rotation matrix is valid',lambda:validate_rotation(R))
    test('P5.10-T15 orthogonal reflection matrix is valid frame map',lambda:validate_rotation(((1,0,0),(0,1,0),(0,0,-1))))
    test('P5.10-T16 malformed non-orthogonal matrix rejected',lambda:not validate_rotation(((1,1,0),(0,1,0),(0,0,1))))
    test('P5.10-T17 vector transformed by 90-degree rotation',lambda:matvec(R,(1,0,0))==(0,1,0))
    test('P5.10-T18 inverse rotation restores vector',lambda:matvec(transpose(R),matvec(R,(3,4,5)))==(3,4,5))
    test('P5.10-T19 rotation preserves vector length squared',lambda:sum(x*x for x in matvec(R,(3,4,5)))==sum(x*x for x in (3,4,5)))
    return checks

def reject(fn):
    try: fn()
    except ValueError: return True
    return False
if __name__=='__main__':
    rs=run()
    for n,s in rs: print(f'{s}\t{n}')
    print(f'RESULT: {sum(s=="PASS" for _,s in rs)}/{len(rs)} PASS')
    if any(s!='PASS' for _,s in rs): raise SystemExit(1)
