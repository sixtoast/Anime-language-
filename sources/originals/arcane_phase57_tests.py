#!/usr/bin/env python3
"""Regression tests for the Arcane Phase 5.7 reference validator."""
import importlib.util
from pathlib import Path

p=Path(__file__).with_name('arcane_reference_validator.py')
spec=importlib.util.spec_from_file_location('arcane_reference_validator', p)
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

TESTS=[
 ('legacy subtraction alias resolves', 'FRATA⟨Q:length, Q:length⟩', True, 'Quantity'),
 ('preferred subtraction form accepted', 'FRAJA⟨Q:length, Q:length⟩', True, 'Quantity'),
 ('legacy multiplication alias resolves', 'FRAKA⟨Q:length, Q:time⟩', True, 'Quantity'),
 ('legacy cross-product alias resolves', 'DRIM⟨V:3d, V:3d⟩', True, 'Vector3'),
 ('legacy NOT alias resolves', 'GRAK⟨Boolean⟩', True, 'Boolean'),
 ('legacy compare alias resolves', 'DRAL⟨Comparable, Comparable, Criterion⟩', True, 'Boolean'),
 ('missing FRAPA argument rejected', 'FRAPA⟨Q:length⟩', False, 'expects 2 argument'),
 ('extra FRAPA argument rejected', 'FRAPA⟨Q:length, Q:length, Q:length⟩', False, 'expects 2 argument'),
 ('wrong FRAPA type rejected', 'FRAPA⟨Boolean, Q:length⟩', False, 'expects Quantity'),
 ('wrong GRASH type rejected', 'GRASH⟨Q:length⟩', False, 'expects Boolean'),
 ('wrong DRUM vector dimension rejected', 'DRUM⟨V:2d, V:2d⟩', False, 'expects Vector3'),
 ('nested expression accepted', 'GRASH⟨DRAL⟨Comparable, Comparable, Criterion⟩⟩', True, 'Boolean'),
 ('malformed expression rejected', 'FRAPA⟨Q:length, Q:length', False, 'malformed operator expression'),
 ('unknown operator not guessed', 'BEN⟨Q:length⟩', False, 'no validated signature'),
 ('region token not falsely treated as operator', 'BEN', False, 'unknown typed atom'),
]
passed=0
for name, expr, expected_ok, expected_text in TESTS:
    ok, detail=mod.validate(expr)
    result=ok==expected_ok and expected_text.lower() in detail.lower()
    print(f"{'PASS' if result else 'FAIL'} | {name} | {expr} | {detail}")
    passed += result
print(f'SUMMARY | {passed}/{len(TESTS)} regression checks passed')
raise SystemExit(0 if passed==len(TESTS) else 1)
