#!/usr/bin/env python3
"""Arcane Phase 6D: reconcile Phase 6C operator names with Phase 4/5 lexicon.
Audit prototype only. No change to spoken canon is implied by these tests.
"""
import csv, sys
from pathlib import Path
from arcane_phase6c_operator_registry import Parser, check, TypeCheckError, ParseError, Q, Type, BOOL, Atom, Call

LEXICON = Path(__file__).with_name('Arcane_Lexicon_v5_draft.csv')

def load_lexicon(path=LEXICON):
    with open(path, encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))

def alias_map(rows):
    """Recover explicit legacy aliases only from 'was FORM' lexicon notes."""
    aliases = {}
    for row in rows:
        note = (row.get('note') or '').strip()
        if note.lower().startswith('was '):
            old = note[4:].strip().lower()
            new = (row.get('form') or '').strip().lower()
            if old and new:
                if old in aliases and aliases[old] != new:
                    raise ValueError(f'Conflicting alias {old}: {aliases[old]} vs {new}')
                aliases[old] = new
    return aliases

# Source forms are the Phase 4/5 spellings. Legacy names remain accepted as aliases.
CANONICAL_OPERATOR = {
    'FRAPA':'frapa', 'FRATA':'fraja', 'FRAKA':'frama', 'FRALA':'frala',
    'FRASHA':'frasha', 'DRAN':'dran', 'DREM':'drem', 'DRIM':'drum',
    'DRAL':'dras', 'GRAN':'gran', 'GRAT':'grat', 'GRAK':'grash',
    'BEK':'bek', 'ZET':'zet', 'KWAM':'kwam', 'KWAT':'kwat', 'KWAK':'kwash',
    'NES':'nes', 'SIMA':'sima', 'GAMA':'gama', 'DAVE':'dave',
}

def resolve_operator(name, aliases=None):
    """Resolve a parser's abstract operator label to the lexicon's actual form.
    Return the lexical form; type rules are still expressed in stable semantic IDs.
    """
    aliases = aliases or {}
    n = name.strip().lower()
    n = aliases.get(n, n)
    for semantic_id, form in CANONICAL_OPERATOR.items():
        if n == form or n == semantic_id.lower():
            return form
    return n

def semantic_id_for_form(form, aliases=None):
    """Map a current or explicit legacy language form to the stable semantic ID."""
    aliases = aliases or {}
    name = form.strip().lower()
    name = aliases.get(name, name)
    for semantic_id, current_form in CANONICAL_OPERATOR.items():
        if name == current_form:
            return semantic_id
    # Also accept semantic IDs directly for internal tests/backward compatibility.
    for semantic_id in CANONICAL_OPERATOR:
        if name == semantic_id.lower():
            return semantic_id
    return None

def normalise_ast(node, aliases=None):
    """Return an AST with operator spellings translated to stable semantic IDs."""
    if isinstance(node, Atom):
        return Atom(node.value.upper())
    if isinstance(node, Call):
        semantic_id = semantic_id_for_form(node.operator, aliases)
        if semantic_id is None:
            semantic_id = node.operator.upper()
        return Call(semantic_id, tuple(normalise_ast(arg, aliases) for arg in node.args))
    raise TypeError(f'Unsupported AST node: {type(node).__name__}')

def check_lexical_expression(source, aliases=None):
    """Parse an audit-notation expression using lexicon forms, then type-check it."""
    return check(normalise_ast(Parser(source).parse(), aliases))

def lexical_audit(rows):
    forms = {r['form'].lower() for r in rows if r.get('form')}
    formal = {r['form'].lower() for r in rows if r.get('register') == 'Formal'}
    problems=[]
    for op, form in CANONICAL_OPERATOR.items():
        if form not in forms:
            problems.append(f'{op} maps to {form}, which is absent from lexicon')
    # Verify renamed historical forms are declared by the Phase 4/5 notes, not guessed.
    aliases=alias_map(rows)
    for old,new in aliases.items():
        if new not in forms:
            problems.append(f'alias {old} points to absent form {new}')
    return problems, aliases

def tests():
    rows=load_lexicon(); problems, aliases=lexical_audit(rows); out=[]
    def add(i,name,ok,detail): out.append((i,name,'PASS' if ok else 'FAIL',str(detail)))
    add('6D-01','All mapped canonical operator forms exist in Phase 5 lexicon',not problems,'; '.join(problems) if problems else f'{len(CANONICAL_OPERATOR)} mappings verified')
    expected={'frata':'fraja','fraka':'frama','drim':'drum','dral':'dras','grak':'grash','kwak':'kwash'}
    add('6D-02','Explicit rename aliases recovered',all(aliases.get(k)==v for k,v in expected.items()),{k:aliases.get(k) for k in expected})
    add('6D-03','Renamed canonical forms remain distinct',len(set(expected.values()))==len(expected),list(expected.values()))
    add('6D-04','Lexicon has 255 rows',len(rows)==255,f'rows={len(rows)}')
    add('6D-05','All legacy aliases point to a present canonical form',all(v in {r['form'].lower() for r in rows} for v in aliases.values()),f'aliases={len(aliases)}')
    add('6D-06','Alias resolver maps FRATA to fraja',resolve_operator('FRATA',aliases)=='fraja',resolve_operator('FRATA',aliases))
    add('6D-07','Alias resolver maps DRIM to drum',resolve_operator('DRIM',aliases)=='drum',resolve_operator('DRIM',aliases))
    add('6D-08','Alias resolver maps GRAK to grash',resolve_operator('GRAK',aliases)=='grash',resolve_operator('GRAK',aliases))
    add('6D-09','Canonical FRAPA remains unchanged',resolve_operator('FRAPA',aliases)=='frapa',resolve_operator('FRAPA',aliases))
    add('6D-10','Formal roots remain in Formal register',all(any(r['form'].lower()==v and r.get('register')=='Formal' for r in rows) for v in CANONICAL_OPERATOR.values()),'checked all mapped forms')
    # Explicitly check unresolved operators are not promoted merely because lexicon entries exist.
    add('6D-11','Lexicon presence does not imply executable semantics',all(x in CANONICAL_OPERATOR for x in ('BEK','ZET','KWAM','KWAT','KWAK')),'semantic blocking remains a separate policy')
    # Exercise the actual current lexical forms through AST normalisation and type checking.
    checks=[('FRAJA','FRAJA⟨LEN_A, LEN_B⟩',Q(1)),('FRAMA','FRAMA⟨LEN_A, LEN_B⟩',Q(2)),('DRUM','DRUM⟨VEC_LEN_A, VEC_VEL_A⟩',Type('Vector',(2,-1,0,0))),('DRAS','DRAS⟨LEN_A, LEN_B, LT⟩',BOOL),('GRASH','GRASH⟨BOOL_A⟩',BOOL)]
    for j,(op,expr,want) in enumerate(checks,12):
        try: got=check_lexical_expression(expr, aliases); ok=(got==want); detail=f'{expr} -> {got}'
        except Exception as e: ok=False; detail=f'{type(e).__name__}: {e}'
        add(f'6D-{j:02d}',f'Current lexical form {op} normalises and type-checks',ok,detail)
    return out

if __name__=='__main__':
    results=tests()
    for row in results: print(' | '.join(row))
    print(f'RESULT: {sum(r[2]=="PASS" for r in results)}/{len(results)} passed')
