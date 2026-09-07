const { useState, useMemo, useEffect, useCallback } = React;

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const INK = "#1C1B18";
const PAPER = "#F3EEE1";
const PAPER_DEEP = "#E9E2D0";
const INDIGO = "#2B3A55";
const VERMILION = "#B5482A";
const VERMILION_DEEP = "#8C3620";

function Icon({ name, size = 16 }) {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle" };
  const paths = {
    chevronLeft: <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    chevronRight: <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    shuffle: <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    restart: <path d="M1 4v6h6M23 20v-6h-6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    swap: <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    check: <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    x: <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    book: <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    pen: <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    trash: <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{paths[name]}</svg>;
}

function ModeButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className="ui-face" style={{
      display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 8,
      fontSize: 14, fontWeight: 500, border: `1px solid ${active ? VERMILION : "#c9c2ae"}`,
      background: active ? VERMILION : "transparent", color: active ? "#fff" : INK,
    }}>
      <Icon name={icon} size={16} />{label}
    </button>
  );
}

function DirectionToggle({ direction, setDirection }) {
  return (
    <button onClick={() => setDirection(direction === "jp-en" ? "en-jp" : "jp-en")} className="ui-face" style={{
      display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8,
      fontSize: 13, fontWeight: 500, border: "1px solid #c9c2ae", background: "transparent", color: "#5c584e",
    }}>
      <Icon name="swap" size={13} />
      {direction === "jp-en" ? "Japanese → English" : "English → Japanese"}
    </button>
  );
}

function IconBtn({ onClick, children, title, primary }) {
  return (
    <button onClick={onClick} title={title} aria-label={title} style={{
      width: 38, height: 38, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
      border: `1px solid ${primary ? VERMILION : "#c9c2ae"}`, background: primary ? VERMILION : "transparent",
      color: primary ? "#fff" : INK,
    }}>
      {children}
    </button>
  );
}

function StudyMode({ pool, direction, setDirection }) {
  const [order, setOrder] = useState(() => pool.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { setOrder(pool.map((_, i) => i)); setIdx(0); setFlipped(false); }, [pool]);

  const card = pool[order[idx]];

  const go = useCallback((delta) => {
    setFlipped(false);
    setIdx(prev => {
      const next = prev + delta;
      if (next < 0) return order.length - 1;
      if (next >= order.length) return 0;
      return next;
    });
  }, [order.length]);

  const reshuffle = () => { setOrder(shuffleArr(pool.map((_, i) => i))); setIdx(0); setFlipped(false); };

  const front = direction === "jp-en" ? card.jp : card.en;
  const frontSub = direction === "jp-en" ? card.reading : null;
  const back = direction === "jp-en" ? card.en : card.jp;
  const backSub = direction === "jp-en" ? null : card.reading;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span className="ui-face" style={{ fontSize: 13, color: "#8a8574" }}>{idx + 1} of {order.length} · {card.category}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <DirectionToggle direction={direction} setDirection={setDirection} />
          <IconBtn onClick={reshuffle} title="Shuffle"><Icon name="shuffle" size={15} /></IconBtn>
        </div>
      </div>

      <div className="flip-card" onClick={() => setFlipped(f => !f)} style={{ height: 300, cursor: "pointer" }}>
        <div className="flip-inner" style={{ position: "relative", width: "100%", height: "100%", transform: flipped ? "rotateY(180deg)" : "none" }}>
          <div className="flip-face" style={{
            position: "absolute", inset: 0, borderRadius: 16, background: "#fff", border: `1px solid ${PAPER_DEEP}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24,
          }}>
            <p className="jp-face" style={{ fontSize: direction === "jp-en" ? 56 : 34, margin: 0, textAlign: "center", color: INK, fontWeight: 500 }}>{front}</p>
            {frontSub && <p className="ui-face" style={{ margin: 0, fontSize: 16, color: "#8a8574" }}>{frontSub}</p>}
            <p className="ui-face" style={{ margin: "12px 0 0", fontSize: 12, color: "#b3ac96" }}>Tap to reveal</p>
          </div>
          <div className="flip-face flip-back" style={{
            position: "absolute", inset: 0, borderRadius: 16, background: INDIGO,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24,
          }}>
            <p className={direction === "jp-en" ? "ui-face" : "jp-face"} style={{ fontSize: direction === "jp-en" ? 30 : 48, margin: 0, textAlign: "center", color: "#fff", fontWeight: 500 }}>{back}</p>
            {backSub && <p className="ui-face" style={{ margin: 0, fontSize: 16, color: "#c7cedb" }}>{backSub}</p>}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20 }}>
        <IconBtn onClick={() => go(-1)} title="Previous"><Icon name="chevronLeft" size={18} /></IconBtn>
        <IconBtn onClick={() => go(1)} title="Next" primary><Icon name="chevronRight" size={18} /></IconBtn>
      </div>
    </div>
  );
}

function buildQuestion(pool) {
  const idx = Math.floor(Math.random() * pool.length);
  const correct = pool[idx];
  const distractorPool = pool.filter((_, i) => i !== idx);
  const distractors = shuffleArr(distractorPool).slice(0, Math.min(3, distractorPool.length));
  const options = shuffleArr([correct, ...distractors]);
  return { correct, options };
}

function QuizMode({ pool, direction, setDirection }) {
  const [question, setQuestion] = useState(() => buildQuestion(pool));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => { setQuestion(buildQuestion(pool)); setSelected(null); setScore({ correct: 0, total: 0 }); }, [pool, direction]);

  const next = () => { setQuestion(buildQuestion(pool)); setSelected(null); };
  const choose = (opt) => {
    if (selected) return;
    setSelected(opt.id);
    setScore(s => ({ correct: s.correct + (opt.id === question.correct.id ? 1 : 0), total: s.total + 1 }));
  };
  const restart = () => { setQuestion(buildQuestion(pool)); setSelected(null); setScore({ correct: 0, total: 0 }); };

  const prompt = direction === "jp-en" ? question.correct.jp : question.correct.en;
  const promptSub = direction === "jp-en" ? question.correct.reading : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span className="ui-face" style={{ fontSize: 13, color: "#8a8574" }}>Score: {score.correct} / {score.total}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <DirectionToggle direction={direction} setDirection={setDirection} />
          <IconBtn onClick={restart} title="Restart quiz"><Icon name="restart" size={15} /></IconBtn>
        </div>
      </div>

      <div style={{ background: "#fff", border: `1px solid ${PAPER_DEEP}`, borderRadius: 16, padding: "40px 28px", textAlign: "center", marginBottom: 20 }}>
        <p className="ui-face" style={{ margin: "0 0 14px", fontSize: 13, color: "#b3ac96" }}>
          {direction === "jp-en" ? "What does this mean?" : "How do you say this in Japanese?"}
        </p>
        <p className={direction === "jp-en" ? "jp-face" : "ui-face"} style={{ margin: 0, fontSize: direction === "jp-en" ? 48 : 28, fontWeight: 500, color: INK }}>{prompt}</p>
        {promptSub && <p className="ui-face" style={{ margin: "10px 0 0", fontSize: 15, color: "#8a8574" }}>{promptSub}</p>}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {question.options.map(opt => {
          const isCorrect = opt.id === question.correct.id;
          const isSelected = opt.id === selected;
          let bg = "#fff", border = "#c9c2ae", color = INK;
          if (selected) {
            if (isCorrect) { bg = "#EAF0E4"; border = "#6d8f56"; color = "#3d5a2b"; }
            else if (isSelected) { bg = "#F5E4DE"; border = VERMILION_DEEP; color = VERMILION_DEEP; }
          }
          const label = direction === "jp-en" ? opt.en : opt.jp;
          const labelSub = direction === "jp-en" ? null : opt.reading;
          return (
            <button key={opt.id} onClick={() => choose(opt)} className={`opt-btn ${direction === "en-jp" ? "jp-face" : "ui-face"}`} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px",
              borderRadius: 10, border: `1px solid ${border}`, background: bg, color, fontSize: direction === "en-jp" ? 20 : 16, textAlign: "left",
            }}>
              <span>{label}{labelSub && <span className="ui-face" style={{ display: "block", fontSize: 13, color: "#8a8574", marginTop: 2 }}>{labelSub}</span>}</span>
              {selected && isCorrect && <Icon name="check" size={18} />}
              {selected && isSelected && !isCorrect && <Icon name="x" size={18} />}
            </button>
          );
        })}
      </div>

      {selected && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
          <button onClick={next} className="ui-face" style={{ padding: "10px 24px", borderRadius: 8, border: `1px solid ${INK}`, background: INK, color: PAPER, fontSize: 14, fontWeight: 500 }}>
            Next word
          </button>
        </div>
      )}
    </div>
  );
}

const CUSTOM_VOCAB_KEY = "jpvocab_custom_words";

function loadCustomVocab() {
  try {
    const raw = localStorage.getItem(CUSTOM_VOCAB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Could not read saved words:", err);
    return [];
  }
}

function saveCustomVocab(list) {
  try {
    localStorage.setItem(CUSTOM_VOCAB_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Could not save words:", err);
  }
}

function TextField({ label, value, onChange, placeholder, jp }) {
  return (
    <label className="ui-face" style={{ display: "block", fontSize: 13, color: "#5c584e", fontWeight: 500 }}>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={jp ? "jp-face" : "ui-face"}
        style={{
          display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
          borderRadius: 8, border: "1px solid #c9c2ae", background: "#fff",
          fontSize: jp ? 18 : 15, color: INK,
        }}
      />
    </label>
  );
}

function AddMode({ customVocab, onAdd, onDelete, onClear, categories }) {
  const [jp, setJp] = useState("");
  const [reading, setReading] = useState("");
  const [en, setEn] = useState("");
  const [category, setCategory] = useState(categories[0] || "Custom");
  const [newCatMode, setNewCatMode] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [message, setMessage] = useState("");

  const submitOne = (e) => {
    e.preventDefault();
    if (!jp.trim() || !en.trim()) {
      setMessage("Japanese and English are both required.");
      return;
    }
    const finalCategory = newCatMode ? (newCat.trim() || "Custom") : category;
    onAdd({
      id: "custom-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      jp: jp.trim(),
      reading: reading.trim(),
      romaji: "",
      en: en.trim(),
      category: finalCategory,
    });
    setJp(""); setReading(""); setEn("");
    setNewCatMode(false); setNewCat("");
    setMessage("Added.");
  };

  const submitBulk = (e) => {
    e.preventDefault();
    const lines = bulkText.split("\n").map(l => l.trim()).filter(Boolean);
    const added = [];
    lines.forEach((line, i) => {
      const parts = line.split("|").map(p => p.trim());
      if (parts.length < 2) return;
      const [pJp, pReading = "", pEn = "", pCat = "Custom"] = parts;
      if (!pJp || !pEn) return;
      added.push({
        id: "custom-" + Date.now() + "-" + i + "-" + Math.random().toString(36).slice(2, 5),
        jp: pJp, reading: pReading, romaji: "", en: pEn, category: pCat || "Custom",
      });
    });
    if (added.length === 0) {
      setMessage("No valid lines found. Use: japanese | reading | english | category");
      return;
    }
    added.forEach(onAdd);
    setBulkText("");
    setMessage(`Added ${added.length} word${added.length === 1 ? "" : "s"}.`);
  };

  return (
    <div>
      <div style={{ background: "#fff", border: `1px solid ${PAPER_DEEP}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h3 className="ui-face" style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: INK }}>Add a word</h3>
        <form onSubmit={submitOne} style={{ display: "grid", gap: 14 }}>
          <TextField label="Japanese" value={jp} onChange={setJp} placeholder="例：新しい" jp />
          <TextField label="Reading (optional)" value={reading} onChange={setReading} placeholder="あたらしい" jp />
          <TextField label="English" value={en} onChange={setEn} placeholder="new" />

          <div>
            <label className="ui-face" style={{ display: "block", fontSize: 13, color: "#5c584e", fontWeight: 500, marginBottom: 6 }}>Category</label>
            {!newCatMode ? (
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="ui-face"
                  style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #c9c2ae", background: "#fff", fontSize: 15, color: INK }}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="button" onClick={() => setNewCatMode(true)} className="ui-face" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #c9c2ae", background: "transparent", fontSize: 13, color: "#5c584e" }}>
                  New category
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  placeholder="e.g. Food & Drink"
                  className="ui-face"
                  style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #c9c2ae", background: "#fff", fontSize: 15, color: INK }}
                />
                <button type="button" onClick={() => setNewCatMode(false)} className="ui-face" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #c9c2ae", background: "transparent", fontSize: 13, color: "#5c584e" }}>
                  Use existing
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="ui-face" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4,
            padding: "11px 18px", borderRadius: 8, border: `1px solid ${VERMILION}`, background: VERMILION,
            color: "#fff", fontSize: 14, fontWeight: 500,
          }}>
            <Icon name="plus" size={15} /> Add word
          </button>
        </form>
      </div>

      <div style={{ background: "#fff", border: `1px solid ${PAPER_DEEP}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h3 className="ui-face" style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600, color: INK }}>Add several at once</h3>
        <p className="ui-face" style={{ margin: "0 0 12px", fontSize: 13, color: "#8a8574" }}>
          One word per line: <code>japanese | reading | english | category</code>
        </p>
        <form onSubmit={submitBulk}>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"新しい | あたらしい | new | い-Adjectives\n図書館 | としょかん | library | Nouns"}
            className="ui-face"
            rows={5}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #c9c2ae", background: "#fff", fontSize: 14, color: INK, resize: "vertical" }}
          />
          <button type="submit" className="ui-face" style={{
            marginTop: 10, padding: "10px 18px", borderRadius: 8, border: `1px solid ${INK}`,
            background: INK, color: PAPER, fontSize: 14, fontWeight: 500,
          }}>
            Import lines
          </button>
        </form>
      </div>

      {message && <p className="ui-face" style={{ fontSize: 13, color: INDIGO, marginBottom: 20 }}>{message}</p>}

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 className="ui-face" style={{ margin: 0, fontSize: 15, fontWeight: 600, color: INK }}>
            Your added words ({customVocab.length})
          </h3>
          {customVocab.length > 0 && (
            <button onClick={onClear} className="ui-face" style={{ fontSize: 12, color: VERMILION_DEEP, background: "none", border: "none", padding: 0 }}>
              Clear all
            </button>
          )}
        </div>
        {customVocab.length === 0 ? (
          <p className="ui-face" style={{ fontSize: 13, color: "#b3ac96" }}>Nothing added yet — words you add appear here.</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {customVocab.map(w => (
              <div key={w.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", borderRadius: 10, border: "1px solid #e3ddca", background: "#fff",
              }}>
                <div>
                  <span className="jp-face" style={{ fontSize: 16, marginRight: 8 }}>{w.jp}</span>
                  <span className="ui-face" style={{ fontSize: 13, color: "#8a8574" }}>{w.reading} · {w.en} · {w.category}</span>
                </div>
                <button onClick={() => onDelete(w.id)} title="Delete" aria-label="Delete" style={{
                  width: 30, height: 30, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid #e3ddca", background: "transparent", color: "#8a8574",
                }}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState("study");
  const [customVocab, setCustomVocab] = useState(() => loadCustomVocab());
  const [direction, setDirection] = useState("jp-en");

  useEffect(() => { saveCustomVocab(customVocab); }, [customVocab]);

  const allVocab = useMemo(() => [...VOCAB, ...customVocab], [customVocab]);
  const allCategories = useMemo(() => [...new Set(allVocab.map(v => v.category))], [allVocab]);

  const [activeCats, setActiveCats] = useState(new Set(CATEGORIES));

  useEffect(() => {
    setActiveCats(prev => {
      const next = new Set(prev);
      let changed = false;
      allCategories.forEach(c => { if (!next.has(c)) { next.add(c); changed = true; } });
      return changed ? next : prev;
    });
  }, [allCategories]);

  const pool = useMemo(() => allVocab.filter(v => activeCats.has(v.category)), [allVocab, activeCats]);

  const addWord = (word) => setCustomVocab(prev => [...prev, word]);
  const deleteWord = (id) => setCustomVocab(prev => prev.filter(w => w.id !== id));
  const clearWords = () => {
    if (window.confirm("Remove all words you've added? This can't be undone.")) {
      setCustomVocab([]);
    }
  };

  const toggleCat = (cat) => {
    setActiveCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) { if (next.size > 1) next.delete(cat); }
      else next.add(cat);
      return next;
    });
  };
  const selectAll = () => setActiveCats(new Set(allCategories));

  return (
    <div style={{ minHeight: "100vh", background: PAPER, color: INK, fontFamily: "'EB Garamond', Georgia, serif" }}>
      <header className="header-wrap" style={{ padding: "40px 40px 20px", borderBottom: `1px solid ${PAPER_DEEP}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p className="ui-face" style={{ margin: 0, fontSize: 13, letterSpacing: "0.02em", color: INDIGO, fontWeight: 500 }}>第十三課</p>
          <h1 className="jp-face" style={{ margin: "4px 0 6px", fontSize: 42, fontWeight: 600, color: INK, lineHeight: 1.15 }}>単語帳</h1>
          <p style={{ margin: 0, fontSize: 16, color: "#5c584e", maxWidth: 520 }}>
            From Chapter 13: Conversation and Grammar — {allVocab.length} words across {allCategories.length} groups
            {customVocab.length > 0 ? ` (${customVocab.length} added by you)` : ""}.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
            <ModeButton active={mode === "study"} onClick={() => setMode("study")} icon="book" label="Study" />
            <ModeButton active={mode === "quiz"} onClick={() => setMode("quiz")} icon="pen" label="Quiz" />
            <ModeButton active={mode === "add"} onClick={() => setMode("add")} icon="plus" label="Add" />
          </div>
        </div>
      </header>

      <div className="content-wrap" style={{ maxWidth: 720, margin: "0 auto", padding: "28px 40px 80px" }}>
        {mode !== "add" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28, alignItems: "center" }}>
            <button onClick={selectAll} className="cat-chip ui-face" style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500, border: `1px solid ${INK}`,
              background: activeCats.size === allCategories.length ? INK : "transparent",
              color: activeCats.size === allCategories.length ? PAPER : INK,
            }}>All</button>
            {allCategories.map(cat => {
              const isOn = activeCats.has(cat);
              return (
                <button key={cat} onClick={() => toggleCat(cat)} className="cat-chip ui-face" style={{
                  padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                  border: `1px solid ${isOn ? VERMILION : "#c9c2ae"}`, background: isOn ? VERMILION : "transparent",
                  color: isOn ? "#fff" : "#7a7566",
                }}>{cat}</button>
              );
            })}
          </div>
        )}

        {mode === "add" ? (
          <AddMode
            customVocab={customVocab}
            onAdd={addWord}
            onDelete={deleteWord}
            onClear={clearWords}
            categories={allCategories}
          />
        ) : pool.length === 0 ? (
          <p style={{ color: "#7a7566" }}>Choose at least one category to begin.</p>
        ) : mode === "study" ? (
          <StudyMode pool={pool} direction={direction} setDirection={setDirection} />
        ) : (
          <QuizMode pool={pool} direction={direction} setDirection={setDirection} />
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
