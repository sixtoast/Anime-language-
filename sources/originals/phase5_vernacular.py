#!/usr/bin/env python3
"""
ARCANE LANGUAGE AUDIT - PHASE 5 (vernacular register).
Builds a seeded vernacular lexicon that is legal under the Phase 4 phonology and at
least 2.0 (feature heuristic) from every formal form and every other vernacular form,
assembles interlinear sample sentences from concept keys, and checks them.
Heuristic distances are NOT listener tests.
"""
import csv, json, random, sys
sys.path.insert(0, "/home/claude")
import arcane_lexicon_tools as T

disp = lambda w: w.replace("ʃ", "sh").replace("ŋ", "ng")

# ---------------------------------------------------------------- formal forms already taken
rows4 = list(csv.DictReader(open("/mnt/user-data/outputs/Arcane_Lexicon_v4_draft.csv", encoding="utf-8")))
formal_forms = [r["form"] for r in rows4 if "(formal)" not in r["form"] and not r["form"].endswith("-") and r["cls"] != "CLITIC"]
by_gloss = {}
for r in rows4: by_gloss.setdefault(r["gloss"], r["form"])
SHARED = {   # closed-class words shared with the formal register
    "I": "mi", "you": "ri", "this/it": "su", "we": "ni", "everyone": "wo",
    "and": by_gloss["and"], "or": by_gloss["or"], "not": by_gloss["not"], "if": by_gloss["if"],
    "while": by_gloss["while"], "until": by_gloss["until (until)"] if "until (until)" in by_gloss else by_gloss["until"],
    "toward": "jo", "away from": "jur", "left": "pa", "right": "ba", "down": "ta", "up": "da", "back": "ka", "front": "ga",
    "now": by_gloss["now (instant of evaluation)"], "before": by_gloss["before"], "after": by_gloss["after"],
    "all": by_gloss["for all"], "some": by_gloss["exists (any)"],
}
for k in ["0","1","2","3","4","5","6","7","8","9"]:
    SHARED[k] = by_gloss[k]

# ---------------------------------------------------------------- concepts: (key, gloss, class, shape)
C = []
def cl(cls, shape, items):
    for key, gloss in items: C.append((key, gloss, cls, shape))
cl("PART", "CVC", [("Q","question particle (yes/no)"),("POL","polite particle"),("RESP","respectful particle"),
                   ("EMPH","emphatic particle"),("TOP","topic particle"),("PERF","already/done"),("PROG","ongoing")])
cl("INTJ", "CVC", [("HELLO","hello"),("BYE","goodbye"),("THANKS","thanks"),("SORRY","sorry"),("PLEASE","please"),
                   ("YES","yes"),("NO","no"),("MAYBE","maybe")])
cl("WH", "CVC", [("WHO","who"),("WHAT","what"),("WHERE","where"),("WHEN","when"),("WHY","why"),("HOW","how")])
cl("PREP", "CVC", [("IN","in/at"),("WITH","with"),("FOR","for"),("ABOUT","about"),("THAN","than")])
cl("CONJ", "CVC", [("BUT","but"),("BECAUSE","because"),("SO","so")])
cl("V", "CVC", [(k, k.lower()) for k in ["GO","COME","SEE","HEAR","SAY","KNOW","WANT","NEED","CAN","MAKE","GIVE","TAKE","EAT","DRINK",
                  "SLEEP","LIVE","DIE","FIGHT","HELP","LOVE","FEAR","THINK","REMEMBER","FORGET","LEARN","TEACH","LAUGH","CRY","RUN","WAIT","FIND","LOSE"]])
cl("N", "CVCV", [(k, k.lower()) for k in ["PERSON","FRIEND","FAMILY","MOTHER","FATHER","CHILD","TEACHER","STUDENT","NAME","HOME","DOOR","ROAD",
                  "TOWN","FOOD","WATER","FIRE","RAIN","WIND","SUN","MOON","NIGHT","DAY","MONEY","BOOK","WORD","STORY","JOKE","SONG",
                  "FACE","HAND","EYE","HEART","MAGE","SPELL","MANA","NULL"]])
cl("ADJ", "CVCV", [(k, k.lower()) for k in ["GOOD","BAD","BIG","SMALL","NEW","OLD","FAST","SLOW","STRONG","WEAK","HOT","COLD","HARD","EASY","TRUE","FUNNY","STRANGE","TIRED"]])
GL = {"NULL": "NULL (unclassified)", "HARD": "difficult", "SPELL": "spell (a construction)", "MANA": "mana"}

ONS = list("bdgtkpmnlrvwfsjz") + ["ʃ"]
VOW = "aeiou"
def pool(shape):
    out = []
    if shape == "CVC":
        for o in ONS:
            for v in VOW:
                for c in "mnŋptksʃlr":
                    out.append(o + v + c)
    else:
        for o1 in ONS:
            for v1 in VOW:
                for o2 in ONS:
                    for v2 in VOW:
                        if v1 != v2: out.append(o1 + v1 + o2 + v2)
    return out

def generate(seed=5105, thr=2.0):
    rng = random.Random(seed)
    pools = {s: pool(s) for s in ("CVC", "CVCV")}
    for p in pools.values(): rng.shuffle(p)
    taken = list(formal_forms)
    out = {}
    for key, gloss, cls, shape in C:
        pick = None
        for w in pools[shape]:
            if w in taken or T.syllabify(w)[1]: continue
            if min(T.dist(w, t) for t in taken) < thr: continue
            pick = w; break
        if pick is None: raise SystemExit(f"no form for {key}")
        out[key] = pick; taken.append(pick)
    return out

FORMS = generate()
GLOSS = {k: GL.get(k, g) for k, g, c, s in C}
CLS = {k: c for k, g, c, s in C}
ALIAS = {"mi": "I", "ri": "you", "su": "this/it", "ni": "we", "wo": "everyone", "jo": "toward"}
def form(k):
    k = ALIAS.get(k, k)
    if k in FORMS: return FORMS[k]
    if k in SHARED: return SHARED[k]
    return k   # literal formal form or separator
def tok(k): return disp(form(k))

# ---------------------------------------------------------------- sample sentences (key lists + English)
S = [
 ("Greeting", ["HELLO"], "Hello."),
 ("Thanks", ["THANKS", "ri"], "Thank you."),
 ("Predicate adjective", ["TIRED", "mi"], "I am tired."),
 ("Yes/no question", ["TIRED", "ri", "Q"], "Are you tired?"),
 ("Negation", ["not", "WANT", "mi", "EAT", "FOOD"], "I don't want to eat food."),
 ("Plain statement", ["SAY", "TEACHER"], "The teacher speaks."),
 ("WH predicate", ["WHERE", "DOOR"], "Where is the door?"),
 ("Past with a time word", ["before", "HELP", "WHO", "ri"], "Who helped you?"),
 ("Possession", ["LEARN", "FRIEND", "mi", "SPELL"], "My friend learns spells."),
 ("Direction", ["COME", "jo", "mi"], "Come toward me."),
 ("Polite request", ["GIVE", "mi", "WATER", "POL"], "Give me water, please (polite)."),
 ("Respectful thanks", ["THANKS", "ri", "RESP"], "Thank you (respectful)."),
 ("Conditional", ["if", "WANT", "ri", "HELP", "mi", "ri"], "If you want, I'll help you."),
 ("Because", ["not", "CAN", "mi", "FIND", "ROAD", "BECAUSE", "NIGHT"], "I can't find the road because it is night."),
 ("Comparison", ["STRONG", "MAGE", "THAN", "TEACHER"], "The mage is stronger than the teacher."),
 ("Coordination", ["FUNNY", "STORY", "su", "and", "STRANGE", "su"], "This story is funny, and it is strange."),
 ("Everyone", ["FEAR", "wo"], "Everyone is afraid."),
 ("Past + object", ["before", "FORGET", "mi", "NAME", "ri"], "I forgot your name."),
 ("WH object", ["WANT", "ri", "WHAT"], "What do you want?"),
 ("Progressive question", ["now", "PROG", "COME", "ri", "Q"], "Are you coming now?"),
 ("Modal + noun phrase", ["CAN", "mi", "MAKE", "FIRE", "SMALL"], "I can make a small fire."),
 ("Affection", ["LOVE", "mi", "ri", "EMPH"], "I really like you."),
 ("Compliment", ["STRONG", "HEART", "ri"], "Your heart is strong."),
 ("Slang (insult)", ["NULL", "ri"], "You're a NULL (you're useless)."),
 ("Counting", ["2", "FRIEND", "mi"], "I have two friends (lit. two friends, mine)."),
]
# SMALL is not a defined key: use the adjective key

IDIOMS = [
 ("Old news", [by_gloss["read"], by_gloss["before"]], "literally 'read, before' = stale information; gossip everyone already knows"),
 ("Up to date", [by_gloss["live evaluation"], "ri"], "literally 'live you' = you're keeping up"),
 ("All talk", ["tipa", by_gloss["assign"], "·", "not", "MAKE"], "literally 'all assign, not make' = all talk, no action (specifying an effect is not providing its mechanism)"),
 ("Hard to judge", ["not", by_gloss["measure"], "ri"], "literally 'not measure you' = don't size someone up by one reading"),
 ("Out of energy", ["not", "MANA", "ri"], "literally 'no mana you' = you're worn out"),
]

# ---------------------------------------------------------------- checks
res = []
def rec(i, title, ok, detail=""): res.append(dict(id=i, title=title, status="PASS" if ok else "FAIL", detail=detail))
allv = [FORMS[k] for k in FORMS]
bad = [(disp(w), T.syllabify(w)[1]) for w in allv if T.syllabify(w)[1]]
rec("P5-T01", f"All {len(allv)} vernacular forms are phonotactically legal", not bad, str(bad))
rec("P5-T02", "No vernacular form equals a formal form", not (set(allv) & set(formal_forms)))
rec("P5-T03", "No two vernacular forms are identical", len(set(allv)) == len(allv))
mind = min(min(T.dist(w, f) for f in formal_forms) for w in allv)
rec("P5-T04", "Every vernacular form is at least 2.0 from every formal form (heuristic)", mind >= 2.0, f"minimum {mind:.2f}")
mind2 = min(T.dist(a, b) for i, a in enumerate(allv) for b in allv[i+1:])
rec("P5-T05", "Every vernacular pair is at least 2.0 apart (heuristic)", mind2 >= 2.0, f"minimum {mind2:.2f}")
not_formal = [k for k, v in SHARED.items() if v not in formal_forms]
rec("P5-T06", "Every shared closed-class word is an actual form in the formal lexicon", not not_formal, str(not_formal))
known = set(FORMS) | set(SHARED) | set(ALIAS)
bad_s = [(n, k) for n, ks, e in S for k in ks if k not in known]
rec("P5-T07", f"All {len(S)} sample sentences use only defined words", not bad_s, str(bad_s))
# register-separability: formal forms re-used with different meaning in vernacular
json.dump(dict(forms=FORMS, shared=SHARED, results=res), open("/home/claude/phase5_report.json", "w"), ensure_ascii=False, indent=1)
for r in res: print(r["id"], r["status"], r["title"], r["detail"][:80])

# ---------------------------------------------------------------- merged lexicon CSV
out = []
for r in rows4:
    reg = "Performed" if r["cls"] in ("FUSED-REF", "CLITIC") else "Formal"
    if r["cls"] in ("DIGIT", "DECIMAL", "UNIT", "AXIS", "REF"): reg = "Shared"
    out.append(dict(form=r["form"], gloss=r["gloss"], cls=r["cls"], register=reg, status=r["status"], source=r["source"], note=r["note"]))
for k, g, c, s in C:
    out.append(dict(form=disp(FORMS[k]), gloss=GLOSS[k], cls=c, register="Vernacular", status="PROPOSED", source="Phase 5", note=""))
with open("/mnt/user-data/outputs/Arcane_Lexicon_v5_draft.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["form", "gloss", "cls", "register", "status", "source", "note"]); w.writeheader(); w.writerows(out)
print("rows:", len(out), "| vernacular roots:", len(C), "| passed", sum(r["status"] == "PASS" for r in res), "/", len(res))

# print sentences for review
for n, ks, e in S:
    print(f"{n:22s} {' '.join(tok(k) for k in ks):40s} | {' '.join(GLOSS.get(ALIAS.get(k, k), ALIAS.get(k, k)) for k in ks)} | {e}")
for n, ks, e in IDIOMS:
    print(n, "|", " ".join(disp(form(k)) for k in ks), "|", e)
print(json.dumps({k: disp(v) for k, v in FORMS.items()}, ensure_ascii=False))

# ---- dump for the document builder
doc = dict(
    forms={k: disp(v) for k, v in FORMS.items()}, gloss=GLOSS, cls=CLS, results=res,
    shared={k: disp(v) for k, v in SHARED.items()},
    sentences=[dict(name=n, arcane=" ".join(tok(k) for k in ks),
                    gloss=" ".join(GLOSS.get(ALIAS.get(k, k), ALIAS.get(k, k)) for k in ks), english=e) for n, ks, e in S],
    idioms=[dict(name=n, arcane=" ".join(disp(form(k)) for k in ks), meaning=e) for n, ks, e in IDIOMS],
)
json.dump(doc, open("/home/claude/phase5_doc.json", "w"), ensure_ascii=False, indent=1)
