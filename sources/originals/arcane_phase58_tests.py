#!/usr/bin/env python3
import importlib.util
from pathlib import Path
p=Path(__file__).with_name('arcane_phase58_types.py'); spec=importlib.util.spec_from_file_location('t',p); t=importlib.util.module_from_spec(spec); spec.loader.exec_module(t)
cases=[
('length addition','FRAPA⟨Q[length],Q[length]⟩',True,'Q[length]'),
('length plus time rejected','FRAPA⟨Q[length],Q[time]⟩',False,'matching dimensions'),
('legacy subtraction alias','FRATA⟨Q[time],Q[time]⟩',True,'Q[time]'),
('length times length gives area','FRAKA⟨Q[length],Q[length]⟩',True,'Q[area]'),
('length divided by time gives velocity','FRALA⟨Q[length],Q[time]⟩',True,'Q[velocity]'),
('magnitude preserves vector dimension','DRAN⟨V3[length;world]⟩',True,'Q[length]'),
('dot product adds dimensions','DREM⟨V3[length;world],V3[velocity;world]⟩',True,'Q[L^2 T^-1]'),
('dot product frame mismatch rejected','DREM⟨V3[length;world],V3[length;caster]⟩',False,'common frame'),
('cross product output dimension','DRIM⟨V3[length;world],V3[length;world]⟩',True,'V3[area;world]'),
('cross product frame mismatch rejected','DRUM⟨V3[length;world],V3[length;caster]⟩',False,'common frame'),
('wrong cross product type rejected','DRUM⟨Q[length],Q[length]⟩',False,'requires 3D vectors'),
('nested typed expression','FRAPA⟨DRAN⟨V3[length;world]⟩,Q[length]⟩',True,'Q[length]'),
('comparison returns Boolean','DRAL⟨Q[length],Q[length],Criterion⟩',True,'Bool'),
('comparison mismatched dimensions rejected','DRAS⟨Q[length],Q[time],Criterion⟩',False,'compatible types'),
('unknown operator fails closed','BEN⟨Q[length]⟩',False,'no Phase 5.8 signature'),
('unbalanced syntax rejected','FRAPA⟨Q[length],Q[length]',False,'malformed expression'),
]
passed=0
with open(Path(__file__).with_name('Arcane_Phase_5_8_Test_Results.txt'),'w') as f:
 for name,expr,ok,needle in cases:
  try: result='PASS | type = '+str(t.parse(expr)); actual=True
  except ValueError as e: result='REJECT | '+str(e); actual=False
  good=(actual==ok and needle.lower() in result.lower()); passed+=good
  line=f"{'PASS' if good else 'FAIL'} | {name} | {expr} | {result}"
  print(line); f.write(line+'\n')
 summary=f'SUMMARY | {passed}/{len(cases)} regression checks passed'; print(summary); f.write(summary+'\n')
raise SystemExit(0 if passed==len(cases) else 1)
