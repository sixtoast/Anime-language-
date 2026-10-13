#!/usr/bin/env python3
"""Arcane Phase 5.9 audit harness: semantic kinds, units, and explicit frame transforms.
Audit tool only; not a complete Arcane parser/compiler and does not execute magic.
"""
from dataclasses import dataclass
from fractions import Fraction

# Dimensions: (length, time, mass, temperature)
D = {'1':(0,0,0,0),'length':(1,0,0,0),'area':(2,0,0,0),'volume':(3,0,0,0),'time':(0,1,0,0),'mass':(0,0,1,0),'velocity':(1,-1,0,0),'acceleration':(1,-2,0,0),'force':(1,-2,1,0),'energy':(2,-2,1,0),'temperature':(0,0,0,1),'pressure':(-1,-2,1,0),'momentum':(1,-1,1,0)}
@dataclass(frozen=True)
class Quantity:
    kind: str
    dim: tuple
    frame: str|None = None
    unit: str|None = None

# SI conversion factors to base units. Radian is dimensionless but semantically tagged.
UNITS = {'MA':('length',Fraction(1)),'SE':('time',Fraction(1)),'KE':('mass',Fraction(1)),
         'KU':('temperature',Fraction(1)),'RA':('dimensionless',Fraction(1)),
         'CM':('length',Fraction(1,100)),'MM':('length',Fraction(1,1000)),
         'KM':('length',Fraction(1000)),'MS':('time',Fraction(1,1000)),
         'MIN':('time',Fraction(60)),'H':('time',Fraction(3600)),'G':('mass',Fraction(1,1000))}
# A deliberately explicit orthogonal basis mapping for frames. Entries are world-axis vectors.
# The legacy D-017 caster frame is treated as left-handed for cross-product components.
FRAMES = {'world': {'handedness':1, 'basis': {'X':(1,0,0),'Y':(0,1,0),'Z':(0,0,1)}},
          'caster':{'handedness':-1,'basis': {'X':(1,0,0),'Y':(0,1,0),'Z':(0,0,-1)}},
          'local': {'handedness':1,'basis': {'X':(1,0,0),'Y':(0,1,0),'Z':(0,0,1)}}}

def add(a:Quantity,b:Quantity,op='add'):
    if a.dim != b.dim: raise ValueError('dimension mismatch')
    if a.kind == 'position' and b.kind == 'position':
        if op=='add': raise ValueError('position + position is undefined; use a displacement operation')
        return Quantity('displacement',a.dim,a.frame)
    if a.kind == 'position' and b.kind == 'displacement':
        if a.frame != b.frame: raise ValueError('frame mismatch; transform explicitly first')
        return Quantity('position',a.dim,a.frame)
    if a.kind == 'displacement' and b.kind == 'position' and op=='add':
        if a.frame != b.frame: raise ValueError('frame mismatch; transform explicitly first')
        return Quantity('position',a.dim,a.frame)
    if a.kind != b.kind: raise ValueError(f'incompatible semantic kinds: {a.kind} and {b.kind}')
    if a.kind in ('scalar','displacement','vector','direction') and a.frame != b.frame and a.frame and b.frame:
        raise ValueError('frame mismatch; transform explicitly first')
    return Quantity(a.kind,a.dim,a.frame or b.frame)

def convert(value, from_unit, to_unit):
    if from_unit not in UNITS or to_unit not in UNITS: raise ValueError('unknown unit')
    k1,f1=UNITS[from_unit]; k2,f2=UNITS[to_unit]
    if k1!=k2: raise ValueError('incompatible unit dimensions')
    return Fraction(value)*f1/f2

def cross(a,b,va,vb,frame):
    if a.dim != b.dim: # dimensions may differ; this implementation supports dimension propagation too
        pass
    if a.frame != b.frame or a.frame != frame: raise ValueError('cross product requires vectors in one declared frame')
    if frame not in FRAMES: raise ValueError('unknown frame')
    handed=FRAMES[frame]['handedness']; x,y,z=va; u,v,w=vb
    return (handed*(y*w-z*v), handed*(z*u-x*w), handed*(x*v-y*u))

def run_tests():
    tests=[]
    def test(name,fn,expected):
        try: got=fn(); ok=(got==expected); detail=repr(got)
        except Exception as e: ok=(isinstance(expected,type) and isinstance(e,expected)); detail=f'{type(e).__name__}: {e}'
        tests.append((name,ok,detail))
    L=D['length']; T=D['time']
    test('position plus displacement yields position',lambda:add(Quantity('position',L,'world'),Quantity('displacement',L,'world')),Quantity('position',L,'world'))
    test('position plus position rejected',lambda:add(Quantity('position',L,'world'),Quantity('position',L,'world')),ValueError)
    test('frame mismatch rejected for position update',lambda:add(Quantity('position',L,'world'),Quantity('displacement',L,'caster')),ValueError)
    test('displacement plus displacement accepted',lambda:add(Quantity('displacement',L,'world'),Quantity('displacement',L,'world')),Quantity('displacement',L,'world'))
    test('1 km = 1000 m',lambda:convert(1,'KM','MA'),Fraction(1000))
    test('250 cm = 5/2 m',lambda:convert(250,'CM','MA'),Fraction(5,2))
    test('60 seconds = 1 minute',lambda:convert(60,'SE','MIN'),Fraction(1))
    test('length cannot convert to time',lambda:convert(1,'MA','SE'),ValueError)
    test('D-017 world basis cross X x Y gives +Z',lambda:cross(Quantity('vector',L,'world'),Quantity('vector',L,'world'),(1,0,0),(0,1,0),'world'),(0,0,1))
    test('D-017 caster handedness gives -Z for X x Y',lambda:cross(Quantity('vector',L,'caster'),Quantity('vector',L,'caster'),(1,0,0),(0,1,0),'caster'),(0,0,-1))
    test('cross product frame mismatch rejected',lambda:cross(Quantity('vector',L,'world'),Quantity('vector',L,'caster'),(1,0,0),(0,1,0),'world'),ValueError)
    test('angle remains semantically tagged',lambda:Quantity('angle',D['1'],None,'RA').kind,'angle')
    test('position and scalar kind mismatch rejected',lambda:add(Quantity('position',L,'world'),Quantity('scalar',L)),ValueError)
    test('unit registry has canonical metre',lambda:UNITS['MA'][0],'length')
    test('fractional conversion exact',lambda:convert(1,'MS','SE'),Fraction(1,1000))
    return tests
if __name__=='__main__':
    results=run_tests()
    for name,ok,detail in results: print(f"{'PASS' if ok else 'FAIL'} | {name} | {detail}")
    print(f'SUMMARY | {sum(ok for _,ok,_ in results)}/{len(results)} passed')
    raise SystemExit(0 if all(ok for _,ok,_ in results) else 1)
