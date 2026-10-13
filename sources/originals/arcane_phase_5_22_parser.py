#!/usr/bin/env python3
"""Arcane Phase 5.22: bounded construction parser.

Parses only the documented Phase 4 hand-flame construction profile. This is not
a general Arcane parser and does not infer omitted grammar. Middle dots are
required phrase boundaries in this fixture profile. No physical feasibility is assessed.
"""
from dataclasses import dataclass, asdict
from pathlib import Path
import json, sys

DIGITS = {'za':0,'ki':1,'to':2,'mu':3,'re':4,'sa':5,'fi':6,'du':7,'go':8,'pe':9}
UNITS = {'ma':'metre','se':'second','ke':'kilogram','ra':'radian','ku':'kelvin','sho':'dimensionless'}
AXES = {'pa':'-X','ba':'+X','ta':'-Y','da':'+Y','ka':'-Z','ga':'+Z'}
ROLES = {'po':'position'}
COUPLINGS = {'he':'matter/mechanical-or-chemical domain (provisional)','ha':'energy/thermal domain (provisional)','ho':'electromagnetic domain (provisional)','hu':'biological domain (provisional)','hi':'informational domain (provisional)','hə':'mana-only domain (provisional)'}
# Phase 4 calls these construction Feet; the semantic interpretation is deliberately conservative.
FEET = {'kan':{'alias':'TRAK ENRA','status':'documented example-level alias'},
         'ken':{'alias':'FREM / structure held','status':'documented example-level alias'},
         'kas':{'alias':'SHREN / release','status':'documented example-level alias'}}
EXPECTED = 'mel · po da za shi to za ma · kan ken · he ha · sa shi za se · kas'

class ParseError(ValueError):
    def __init__(self, code, message): self.code=code; self.message=message; super().__init__(f'{code}: {message}')

def parse_quantity(tokens):
    """Parse digits [shi fractional digits] unit. Returns exact decimal text + unit."""
    if not tokens: raise ParseError('E-QTY-EMPTY','Quantity is empty.')
    if tokens[-1] not in UNITS: raise ParseError('E-QTY-UNIT','A quantity must end in a recognised unit (Phase 4 G-2).')
    body=tokens[:-1]
    if not body: raise ParseError('E-QTY-NUMBER','Unit has no numeric value.')
    if body.count('shi') > 1: raise ParseError('E-QTY-DECIMAL','More than one decimal separator.')
    if 'shi' in body:
        i=body.index('shi'); whole=body[:i]; frac=body[i+1:]
        if not whole or not frac: raise ParseError('E-QTY-DECIMAL','Decimal separator requires digits on both sides.')
    else: whole=body; frac=[]
    for tok in whole+frac:
        if tok not in DIGITS: raise ParseError('E-QTY-DIGIT',f'Unknown digit token {tok!r}.')
    value=''.join(str(DIGITS[t]) for t in whole)
    if frac: value += '.' + ''.join(str(DIGITS[t]) for t in frac)
    return {'kind':'Quantity','value_text':value,'unit_token':tokens[-1],'unit':UNITS[tokens[-1]],'source_tokens':tokens[:], 'precision_digits':len(frac)}

def parse(text):
    # Preserve phrase boundaries: these are structurally meaningful in this fixture.
    phrases=[[t.lower() for t in part.strip().split()] for part in text.strip().split('·')]
    if len(phrases)!=6: raise ParseError('E-PHRASE-COUNT',f'Fixture profile requires 6 phrases; got {len(phrases)}.')
    if any(not p for p in phrases): raise ParseError('E-EMPTY-PHRASE','Empty phrase is not accepted.')
    if len(phrases[0])!=1 or phrases[0][0]!='mel':
        raise ParseError('E-ANCHOR','This profile requires the documented initial anchor token mel; other anchor forms are unsupported.')
    anchor={'kind':'Anchor','token':'mel','interpretation':'me + anchor coda l (example-level; full landmark system unresolved)'}
    p=phrases[1]
    if len(p)<4 or p[0] not in ROLES or p[1] not in AXES:
        raise ParseError('E-SPATIAL','Expected a known spatial role, axis, then a unit-closed quantity.')
    position=parse_quantity(p[2:])
    if position['unit_token']!='ma': raise ParseError('E-POSITION-UNIT','Position quantity in this profile must use ma (metre).')
    spatial={'kind':'SpatialParameter','role':ROLES[p[0]],'role_token':p[0],'axis':AXES[p[1]],'axis_token':p[1],'quantity':position}
    p=phrases[2]
    if len(p)<1 or any(x not in ('kan','ken') for x in p) or p!=['kan','ken']:
        raise ParseError('E-FOOT-PROFILE','This fixture profile supports exactly the documented Foot sequence kan ken; other sequences are unsupported, not inferred.')
    feet=[{'kind':'Foot','token':x,**FEET[x]} for x in p]
    p=phrases[3]
    if p!=['he','ha']:
        if not all(x in COUPLINGS for x in p): raise ParseError('E-COUPLING','Unknown coupling token.')
        raise ParseError('E-COUPLING-PROFILE','This fixture profile supports the documented coupling sequence he ha only.')
    couplings=[{'kind':'Coupling','token':x,'interpretation':COUPLINGS[x]} for x in p]
    p=phrases[4]
    duration=parse_quantity(p)
    if duration['unit_token']!='se': raise ParseError('E-DURATION-UNIT','Duration quantity in this profile must use se (second).')
    p=phrases[5]
    if p!=['kas']: raise ParseError('E-RELEASE','Expected the documented final release token kas.')
    return {'status':'PARSED_SUBSET','grammar':'P5.22-HAND-FLAME-PROFILE-1','parse_tree':{'kind':'PerformedConstruction','profile':'documented hand-flame transcription profile','anchor':anchor,'spatial_parameter':spatial,'feet':feet,'couplings':couplings,'duration':duration,'release':{'kind':'Release','token':'kas','interpretation':FEET['kas']['alias']}},'limitations':['Only the single documented Phase 4 hand-flame profile is parsed.','This does not prove the spoken language has a unique parse in general.','Parameter-vowel mapping, full anchor semantics and coupling-domain mappings remain provisional or incomplete.','No mana, energy, matter, stability or physical-mechanism feasibility is evaluated.']}

def run_tests():
    cases=[
      ('valid canonical fixture',EXPECTED,True,None),
      ('missing phrase', 'mel · po da za shi to za ma · kan ken · he ha · sa shi za se',False,'E-PHRASE-COUNT'),
      ('empty phrase','mel · · kan ken · he ha · sa shi za se · kas',False,'E-EMPTY-PHRASE'),
      ('unknown anchor','mi · po da za shi to za ma · kan ken · he ha · sa shi za se · kas',False,'E-ANCHOR'),
      ('unknown role','mel · xx da za shi to za ma · kan ken · he ha · sa shi za se · kas',False,'E-SPATIAL'),
      ('unknown axis','mel · po xx za shi to za ma · kan ken · he ha · sa shi za se · kas',False,'E-SPATIAL'),
      ('quantity missing unit','mel · po da za shi to za · kan ken · he ha · sa shi za se · kas',False,'E-QTY-UNIT'),
      ('bad digit','mel · po da za shi xx ma · kan ken · he ha · sa shi za se · kas',False,'E-QTY-DIGIT'),
      ('bad decimal no whole digits','mel · po da shi to ma · kan ken · he ha · sa shi za se · kas',False,'E-QTY-DECIMAL'),
      ('bad decimal no fractional digits','mel · po da za shi ma · kan ken · he ha · sa shi za se · kas',False,'E-QTY-DECIMAL'),
      ('multiple decimals','mel · po da za shi to shi za ma · kan ken · he ha · sa shi za se · kas',False,'E-QTY-DECIMAL'),
      ('wrong position unit','mel · po da za shi to za se · kan ken · he ha · sa shi za se · kas',False,'E-POSITION-UNIT'),
      ('wrong foot profile','mel · po da za shi to za ma · kan · he ha · sa shi za se · kas',False,'E-FOOT-PROFILE'),
      ('wrong coupling profile','mel · po da za shi to za ma · kan ken · he · sa shi za se · kas',False,'E-COUPLING-PROFILE'),
      ('wrong duration unit','mel · po da za shi to za ma · kan ken · he ha · sa shi za ma · kas',False,'E-DURATION-UNIT'),
      ('missing release','mel · po da za shi to za ma · kan ken · he ha · sa shi za se · he',False,'E-RELEASE'),
      ('rejected unclosed phrase boundaries','mel po da za shi to za ma kan ken he ha sa shi za se kas',False,'E-PHRASE-COUNT'),
    ]
    out=[]
    for name,src,should_pass,code in cases:
        try:
            result=parse(src)
            passed=should_pass
            got='PARSED_SUBSET'
        except ParseError as e:
            result=None; got=e.code; passed=(not should_pass and got==code)
        out.append({'test':name,'expected':'accept' if should_pass else code,'actual':got,'status':'PASS' if passed else 'FAIL'})
    return out

if __name__=='__main__':
    if len(sys.argv)>1 and sys.argv[1]=='--test':
        tests=run_tests(); print(json.dumps({'summary':{'passed':sum(t['status']=='PASS' for t in tests),'failed':sum(t['status']=='FAIL' for t in tests),'total':len(tests)},'tests':tests},indent=2)); sys.exit(0 if all(t['status']=='PASS' for t in tests) else 1)
    source=' '.join(sys.argv[1:]) if len(sys.argv)>1 else EXPECTED
    try: print(json.dumps(parse(source),indent=2,ensure_ascii=False))
    except ParseError as e:
        print(json.dumps({'status':'REJECTED_WITHIN_SUBSET','error':{'code':e.code,'message':e.message}},indent=2,ensure_ascii=False)); sys.exit(2)
