"""Phase 5.15 evidence gate. This validates source/status boundaries, not Arcane semantics."""
from pathlib import Path
import csv
P=Path(__file__).resolve().parent/'Arcane_Phase_5_15_Construction_Contract_Matrix.csv'
rows=list(csv.DictReader(P.open()))
def run():
 t=[]
 def c(n,fn):
  try: assert fn(); t.append((n,True,'PASS'))
  except Exception as e: t.append((n,False,'FAIL: '+str(e)))
 by={r['item']:r for r in rows}
 c('matrix has unique item keys',lambda:len(by)==len(rows))
 c('construction-expression split recorded',lambda:'Construction' in by['Construction/Expression split']['contract'] and 'Expression' in by['Construction/Expression split']['contract'])
 c('construction order preserved',lambda:'reference → spatial role/vector → Feet → couplings → quantity → control → release' in by['Construction order']['contract'])
 c('Foot shape does not claim full semantics',lambda:'TOKEN CHECK ONLY' in by['Foot shape']['executable'])
 c('parameter vowel mapping remains provisional',lambda:by['Parameter vowels']['status']=='PROVISIONAL')
 c('coupling mapping remains provisional',lambda:'PROVISIONAL' in by['Coupling syllables']['status'])
 c('KREN not promoted',lambda:by['KREN macro']['status']=='PROPOSED' and by['KREN macro']['executable']=='NO')
 c('worked example not executable',lambda:by['Worked hand-flame sequence']['executable']=='NO' and 'unspecified' in by['Worked hand-flame sequence']['gap'])
 c('compiler bridge not demonstrated',lambda:by['Expression-to-construction bridge']['executable']=='NO')
 c('missing v2.0 source gap explicit',lambda:by['Original v2.0 full morphology']['status']=='SOURCE GAP')
 c('all rows have evidence and gap',lambda:all(r['evidence'].strip() and r['gap'].strip() for r in rows))
 c('no row silently marks execution YES',lambda:all(r['executable']!='YES' for r in rows))
 return t
if __name__=='__main__':
 r=run()
 for n,ok,m in r: print(f'{m}\t{n}')
 print(f'RESULT: {sum(x[1] for x in r)}/{len(r)} PASS')
 raise SystemExit(0 if all(x[1] for x in r) else 1)
