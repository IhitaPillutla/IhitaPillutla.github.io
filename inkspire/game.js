const introLines = [
  { text: "Welcome to your first day at InkSpire. I'm your HR, Sparky.", type: "hr" },
  { text: "I assume you know what you're here for, boss needs you to get these tasks done ASAP.", type: "hr", toast: true },
  { text: "Well? Go on then, I wont bother you anymore. Just make sure these are done by the end of the day.", type: "hr" },
  { text: "Oh and, no lunch break for you until I see progress :)", type: "hr" },
  { text: "Well... I guess I better get started immediately.", type: "player" }
];

const tasks = [
  {
    file: "01_careers_panel.txt",
    tab: "Careers Panel",
    type: "APPROVAL EMAIL",
    title: "Get the panel approved",
    brief: "Draft the email using the notes on the left. You need a clear decision from the Dean without sounding timid or demanding.",
    max: 23,
    minReactionWords: 35,
    context: {
      purpose: "Get approval for the careers panel by Friday, 3:00 PM.",
      reader: "Dean of Student Affairs",
      role: "Student society events coordinator",
      constraints: ["Email", "120–180 words", "Respectful + confident"],
      notes: ["18 Oct · 4:00–5:30 PM", "80 students · West Hall", "3 alumni interested", "No funding requested"]
    },
    criteria: [
      { label: "Clearly asks for approval", points: 5, test: t => /approv|permission|confirm/.test(t.lower) && /career|panel/.test(t.lower) },
      { label: "Decision deadline: Fri 3 PM", points: 4, test: t => /friday/.test(t.lower) && /3\s*(?:pm|p\.m\.)|3:00/.test(t.lower) },
      { label: "Explains value to students", points: 4, test: t => /student/.test(t.lower) && /career|network|industry|insight|opportun|learn|benefit/.test(t.lower) },
      { label: "Uses relevant event details", points: 3, test: t => /18\s*(?:oct|october)|october\s*18/.test(t.lower) && /west hall|4:00|4\s*pm|5:30/.test(t.lower) },
      { label: "Professional, confident tone", points: 4, test: t => !hasRiskyTone(t.lower) && t.words.length >= 20 },
      { label: "120–180 words", points: 3, test: t => t.words.length >= 120 && t.words.length <= 180 }
    ]
  },
  {
    file: "02_client_revision.txt",
    tab: "Client Revision",
    type: "CLIENT EMAIL",
    title: "Fix the revision update",
    brief: "The client changed direction again. Tell them the new revision can be accommodated and that delivery moves to Friday — without blaming them.",
    max: 18,
    minReactionWords: 14,
    context: {
      purpose: "Confirm the revision and new Friday delivery date.",
      reader: "Existing client",
      role: "Project coordinator",
      constraints: ["Email", "35–70 words", "Neutral tone"],
      notes: ["New direction received", "Delivery moves to Friday", "Keep relationship positive"]
    },
    criteria: [
      { label: "Acknowledges the revision", points: 4, test: t => /revision|change|new direction|update/.test(t.lower) },
      { label: "States Friday delivery", points: 4, test: t => /friday/.test(t.lower) && /deliver|ready|send|complete/.test(t.lower) },
      { label: "Avoids blame", points: 5, test: t => !hasRiskyTone(t.lower) && !/stop changing|blame/.test(t.lower) && t.words.length >= 10 },
      { label: "Clear + concise", points: 3, test: t => t.words.length >= 25 && t.words.length <= 70 },
      { label: "Positive next step", points: 2, test: t => /happy|glad|we can|we will|please let|thank/.test(t.lower) }
    ]
  },
  {
    file: "03_clarity_edit.txt",
    tab: "Clarity Edit",
    type: "CLARITY EDIT",
    title: "Cut the corporate fog",
    brief: "Rewrite: “At this point in time, we are currently in the process of conducting an evaluation of the submitted materials.”",
    max: 14,
    minReactionWords: 5,
    context: {
      purpose: "Keep the meaning. Remove the deadweight.",
      reader: "Internal team",
      role: "Copy editor",
      constraints: ["1 sentence", "10 words max", "Plain English"],
      notes: ["Meaning: the materials are being reviewed now"]
    },
    criteria: [
      { label: "Keeps the core meaning", points: 4, test: t => /evaluat|review/.test(t.lower) && /material|submission/.test(t.lower) },
      { label: "10 words or fewer", points: 4, test: t => t.words.length >= 4 && t.words.length <= 10 },
      { label: "Removes filler phrases", points: 4, test: t => !/at this point in time|in the process of|conducting an evaluation|currently in/.test(t.lower) && t.words.length >= 4 },
      { label: "Uses a direct verb", points: 2, test: t => /\b(review|reviewing|evaluate|evaluating)\b/.test(t.lower) }
    ]
  },
  {
    file: "04_dashboard_notice.txt",
    tab: "Dashboard Notice",
    type: "STAFF NOTICE",
    title: "Write for the reader",
    brief: "Tell a non-technical department the dashboard will be unavailable from 6–7 PM and that they should save their work before 6 PM.",
    max: 20,
    minReactionWords: 16,
    context: {
      purpose: "Prevent staff from losing work during maintenance.",
      reader: "Non-technical staff",
      role: "Internal communications assistant",
      constraints: ["Notice", "30–65 words", "No jargon"],
      notes: ["Dashboard unavailable 6–7 PM", "Save work before 6 PM"]
    },
    criteria: [
      { label: "Names the dashboard", points: 4, test: t => /dashboard/.test(t.lower) },
      { label: "Gives 6–7 PM window", points: 4, test: t => /6\s*(?:pm|p\.m\.).*7\s*(?:pm|p\.m\.)|6\s*[–—-]\s*7\s*pm/.test(t.lower) },
      { label: "Tells staff to save before 6", points: 4, test: t => /save/.test(t.lower) && /before\s*6|by\s*6/.test(t.lower) },
      { label: "Avoids technical jargon", points: 5, test: t => !/backend|dependencies|service-layer|pursuant|infrastructure requirements|executing/.test(t.lower) && t.words.length >= 10 },
      { label: "Concise notice", points: 3, test: t => t.words.length >= 30 && t.words.length <= 65 }
    ]
  },
  {
    file: "05_manager_reply.txt",
    tab: "Manager Reply",
    type: "FINAL RESPONSE",
    title: "Reply to your manager",
    brief: "Your manager asks: “Can you send the revised proposal by 4 PM today?” Confirm the task and deadline professionally.",
    max: 25,
    minReactionWords: 7,
    context: {
      purpose: "Confirm that you will send the revised proposal by 4 PM today.",
      reader: "Your manager",
      role: "Intern",
      constraints: ["Reply", "15–35 words", "Direct + professional"],
      notes: ["Revised proposal", "Deadline: 4 PM today"]
    },
    criteria: [
      { label: "Explicitly confirms", points: 6, test: t => /\b(yes|certainly|absolutely|i can|i will|will do|of course)\b/.test(t.lower) },
      { label: "Mentions revised proposal", points: 5, test: t => /proposal/.test(t.lower) && /revis/.test(t.lower) },
      { label: "Confirms 4 PM today", points: 6, test: t => /4\s*(?:pm|p\.m\.)|4:00|by\s*4/.test(t.lower) && /today/.test(t.lower) },
      { label: "Professional tone", points: 5, test: t => !hasRiskyTone(t.lower) && t.words.length >= 7 },
      { label: "Concise reply", points: 3, test: t => t.words.length >= 15 && t.words.length <= 35 }
    ]
  }
];

function hasRiskyTone(lower) {
  return /\b(fuck|shit|bitch|ass|damn|crap|lol|bro|bruh|gonna|wanna|pls|plz|thx|whatever|k|kk|obviously)\b|you keep|your fault|because of you|!!!/.test(lower);
}

const spellingPatterns = [
  [/\brecieve\b/gi, "receive"], [/\bdefinately\b/gi, "definitely"], [/\bseperate\b/gi, "separate"],
  [/\badress\b/gi, "address"], [/\boccured\b/gi, "occurred"], [/\buntill\b/gi, "until"],
  [/\bwierd\b/gi, "weird"], [/\balot\b/gi, "a lot"], [/\bbecuase\b/gi, "because"], [/\bteh\b/gi, "the"]
];

const informalPattern = /\b(fuck|shit|bitch|ass|damn|crap|lol|bro|bruh|gonna|wanna|pls|plz|thx|whatever|k|kk|obviously|hey guys)\b|you keep|your fault|because of you|!!!/gi;
const clarityPattern = /at this point in time|in the process of|conducting an evaluation|currently in|please be advised that|pursuant to|due to the fact that|in order to/gi;

let introIndex = 0;
let introTimer = null;
let introMoving = false;
let taskIndex = 0;
let unlocked = tasks.map((_, i) => i === 0);
let completed = tasks.map(() => false);
let drafts = tasks.map(() => "");
let taskScores = tasks.map(() => 0);
let taskStart = tasks.map(() => null);
let lastReadWord = "";
let timerInterval = null;
let endingIndex = 0;
let endingSequence = [];
let endingTimer = null;
let endingMoving = false;
let autoAdvanceTimer = null;

const $ = id => document.getElementById(id);
const intro = $("intro"), workspace = $("workspace"), ending = $("ending");
const introText = $("introText"), objectiveToast = $("objectiveToast"), taskTabs = $("taskTabs");
const ctxPurpose = $("ctxPurpose"), ctxReader = $("ctxReader"), ctxRole = $("ctxRole"), ctxConstraints = $("ctxConstraints"), ctxNotes = $("ctxNotes");
const criteriaList = $("criteriaList"), taskType = $("taskType"), taskTitle = $("taskTitle"), taskBrief = $("taskBrief"), taskMax = $("taskMax"), fileName = $("fileName");
const draftInput = $("draftInput"), lineStatus = $("lineStatus"), charStatus = $("charStatus"), wordStatus = $("wordStatus"), taskTimer = $("taskTimer");
const diagnosticMessage = $("diagnosticMessage"), livePotential = $("livePotential"), feedback = $("feedback"), submitTask = $("submitTask"), endShift = $("endShift");
const sparkyFace = $("sparkyFace"), sparkyComment = $("sparkyComment"), readingWord = $("readingWord"), wordCount = $("wordCount"), issueChips = $("issueChips");
const scoreEl = $("score"), progressCount = $("progressCount"), lunchState = $("lunchState"), finalScore = $("finalScore"), endingText = $("endingText"), endingHint = $("endingHint"), restart = $("restart");

function playLine(element, text, type = "hr") {
  element.classList.remove("playing", "skip-out", "player");
  void element.offsetWidth;
  element.textContent = text;
  if (type === "player") element.classList.add("player");
  element.classList.add("playing");
}

function showIntroLine() {
  const line = introLines[introIndex];
  playLine(introText, line.text, line.type);
  objectiveToast.classList.add("hidden");
  if (line.toast) {
    objectiveToast.classList.remove("hidden");
    setTimeout(() => objectiveToast.classList.add("hidden"), 2700);
  }
  clearTimeout(introTimer);
  introTimer = setTimeout(() => advanceIntro(true), 10000);
}

function advanceIntro(auto = false) {
  if (introMoving) return;
  introMoving = true;
  clearTimeout(introTimer);
  const finish = () => {
    introMoving = false;
    if (introIndex < introLines.length - 1) { introIndex++; showIntroLine(); }
    else { intro.classList.add("hidden"); workspace.classList.remove("hidden"); renderTabs(); renderTask(0); }
  };
  if (auto) finish();
  else { introText.classList.remove("playing"); introText.classList.add("skip-out"); setTimeout(finish, 280); }
}

function makeTextState(value) {
  const clean = value.replace(/\u00a0/g, " ");
  const words = clean.trim() ? clean.trim().split(/\s+/).filter(Boolean) : [];
  return { value: clean, lower: clean.toLowerCase(), words };
}

function evaluateTask(task, value) {
  const state = makeTextState(value);
  const results = task.criteria.map(c => ({ ...c, met: !!c.test(state) }));
  const points = results.reduce((sum, c) => sum + (c.met ? c.points : 0), 0);
  return { state, results, points };
}

function renderTabs(newIndex = -1) {
  taskTabs.innerHTML = tasks.map((task, i) => {
    const classes = ["task-tab", i === taskIndex ? "active" : "", completed[i] ? "completed" : "", !unlocked[i] ? "locked" : "", i === newIndex ? "newly-unlocked" : ""].filter(Boolean).join(" ");
    const icon = completed[i] ? "✓" : unlocked[i] ? "▤" : "🔒";
    return `<button class="${classes}" data-tab="${i}" ${!unlocked[i] ? "disabled" : ""}><span class="tab-num">${String(i + 1).padStart(2,"0")}</span><span>${icon} ${task.tab}</span></button>`;
  }).join("");
  taskTabs.querySelectorAll(".task-tab:not(.locked)").forEach(btn => btn.addEventListener("click", () => {
    clearTimeout(autoAdvanceTimer);
    drafts[taskIndex] = getEditorText();
    renderTask(Number(btn.dataset.tab));
  }));
}

function renderTask(index) {
  taskIndex = index;
  lastReadWord = "";
  const task = tasks[index];
  if (!taskStart[index]) taskStart[index] = Date.now();
  renderTabs();
  taskType.textContent = task.type;
  taskTitle.textContent = task.title;
  taskBrief.textContent = task.brief;
  taskMax.textContent = `${task.max} pts`;
  fileName.textContent = task.file;
  ctxPurpose.textContent = task.context.purpose;
  ctxReader.textContent = task.context.reader;
  ctxRole.textContent = task.context.role;
  ctxConstraints.innerHTML = task.context.constraints.map(x => `<span>${x}</span>`).join("");
  ctxNotes.innerHTML = task.context.notes.map(x => `<li>${x}</li>`).join("");
  feedback.className = "feedback hidden";
  feedback.textContent = "";
  draftInput.textContent = drafts[index];
  draftInput.setAttribute("contenteditable", completed[index] ? "false" : "plaintext-only");
  submitTask.classList.toggle("hidden", completed[index]);
  endShift.classList.toggle("hidden", !(index === tasks.length - 1 && completed[index]));
  updateLive();
  startTaskTimer();
  if (!completed[index]) setTimeout(() => draftInput.focus(), 80);
}

function getEditorText() { return draftInput.innerText.replace(/\n+$/g, ""); }

function updateLive() {
  const task = tasks[taskIndex];
  const value = getEditorText();
  drafts[taskIndex] = value;
  const evaluation = evaluateTask(task, value);
  const words = evaluation.state.words;

  // READ ENTIRE TEXT IN REAL TIME
  const fullText = value.trim() || "—";
  readingWord.textContent = fullText;

  wordCount.textContent = `${words.length} word${words.length === 1 ? "" : "s"}`;
  charStatus.textContent = `${value.length} character${value.length === 1 ? "" : "s"}`;
  wordStatus.textContent = `${words.length} word${words.length === 1 ? "" : "s"}`;
  livePotential.textContent = `${evaluation.points} / ${task.max}`;

  updateCaretStatus();
  renderCriteria(evaluation.results);

  const issues = detectIssues(draftInput.textContent || "");
  renderDiagnostics(issues);
  applyHighlights(issues);

  if (fullText !== lastReadWord && fullText !== "—") {
    lastReadWord = fullText;
    pulseSparky();
  }

  calibrateSparky(evaluation, issues);
}

function renderCriteria(results) {
  criteriaList.innerHTML = results.map(r => `<div class="criterion ${r.met ? "met" : ""}"><span class="criterion-dot"></span><span>${r.label}</span><strong>${r.met ? "+" : ""}${r.met ? r.points : 0}/${r.points}</strong></div>`).join("");
}

function detectIssues(text) {
  const issues = [];
  for (const [regex, suggestion] of spellingPatterns) {
    regex.lastIndex = 0;
    let m; while ((m = regex.exec(text))) issues.push({ type:"spelling", start:m.index, end:m.index + m[0].length, label:`${m[0]} → ${suggestion}` });
  }
  const lowerI = /\bi\b/g; let mi; while ((mi = lowerI.exec(text))) issues.push({ type:"spelling", start:mi.index, end:mi.index + 1, label:"Capitalize ‘I’" });
  informalPattern.lastIndex = 0; let m2; while ((m2 = informalPattern.exec(text))) issues.push({ type:"informal", start:m2.index, end:m2.index + m2[0].length, label:`Risky tone: “${m2[0]}”` });
  clarityPattern.lastIndex = 0; let m3; while ((m3 = clarityPattern.exec(text))) issues.push({ type:"clarity", start:m3.index, end:m3.index + m3[0].length, label:`Wordy: “${m3[0]}”` });
  const repeats = /([!?])\1+/g; let m4; while ((m4 = repeats.exec(text))) issues.push({ type:"informal", start:m4.index, end:m4.index + m4[0].length, label:"Avoid repeated punctuation" });
  return issues;
}

function textNodeMap(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = []; let offset = 0; let n;
  while ((n = walker.nextNode())) { nodes.push({ node:n, start:offset, end:offset + n.nodeValue.length }); offset += n.nodeValue.length; }
  return nodes;
}

function rangeForIssue(issue, map) {
  const s = map.find(x => issue.start >= x.start && issue.start <= x.end);
  const e = map.find(x => issue.end >= x.start && issue.end <= x.end) || map[map.length - 1];
  if (!s || !e) return null;
  const range = new Range();
  range.setStart(s.node, Math.max(0, issue.start - s.start));
  range.setEnd(e.node, Math.min(e.node.nodeValue.length, issue.end - e.start));
  return range;
}

function applyHighlights(issues) {
  if (!(window.CSS && CSS.highlights && window.Highlight)) return;
  CSS.highlights.delete("spelling-error"); CSS.highlights.delete("informal-warning"); CSS.highlights.delete("clarity-warning");
  const map = textNodeMap(draftInput);
  const groups = { spelling:[], informal:[], clarity:[] };
  issues.forEach(issue => { const range = rangeForIssue(issue, map); if (range) groups[issue.type].push(range); });
  if (groups.spelling.length) CSS.highlights.set("spelling-error", new Highlight(...groups.spelling));
  if (groups.informal.length) CSS.highlights.set("informal-warning", new Highlight(...groups.informal));
  if (groups.clarity.length) CSS.highlights.set("clarity-warning", new Highlight(...groups.clarity));
}

function renderDiagnostics(issues) {
  issueChips.innerHTML = issues.slice(0,4).map(i => `<span class="issue-chip ${i.type === "spelling" ? "bad" : "warn"}">${i.label}</span>`).join("");
  if (!issues.length) diagnosticMessage.textContent = "No obvious issues detected. Keep checking the criteria.";
  else {
    const s = issues.filter(i => i.type === "spelling").length, t = issues.filter(i => i.type === "informal").length, c = issues.filter(i => i.type === "clarity").length;
    diagnosticMessage.textContent = [`${s ? s + " spelling/grammar" : ""}`, `${t ? t + " tone" : ""}`, `${c ? c + " clarity" : ""}`].filter(Boolean).join(" · ") + " flag(s)";
  }
}

function calibrateSparky(evaluation, issues) {
  if (completed[taskIndex]) {
    const ratio = taskScores[taskIndex] / tasks[taskIndex].max;
    if (ratio >= .8) setSparky("🙂", "“Filed. That was actually good.”");
    else if (ratio >= .6) setSparky("😐", "“Filed. Acceptable.”");
    else setSparky("🤨", "“Filed. I have notes.”");
    return;
  }

  const words = evaluation.state.words.length;
  if (!words) { setSparky("😐", "“I'm reading. Keep going.”"); return; }

  // Check for profanity / informal tone FIRST before word-count checks
  const hasInformalOrSwear = issues.some(i => i.type === "informal") || 
                             hasRiskyTone(evaluation.state.lower) ||
                             /your fault|because of you|stop changing/.test(evaluation.state.lower);

  if (hasInformalOrSwear) {
    setSparky("😡", "“Okay. THAT wording is going to HR. Which is me.”");
    return;
  }

  if (words < tasks[taskIndex].minReactionWords) {
    setSparky("🙂", "“Yep. I'm following. Keep writing.”");
    return;
  }

  const ratio = evaluation.points / tasks[taskIndex].max;
  if (ratio >= .8) setSparky("🙂", "“Nice. Most of the brief is covered.”");
  else if (ratio >= .6) setSparky("😐", "“Solid. Check the remaining criteria.”");
  else if (ratio >= .4) setSparky("🤨", "“The core is there. You're missing a few things.”");
  else setSparky("😥", "“You have enough written now — re-check the brief.”");
}

function setSparky(face, comment) { sparkyFace.textContent = face; sparkyComment.textContent = comment; }
function pulseSparky() { sparkyFace.classList.remove("word-read"); void sparkyFace.offsetWidth; sparkyFace.classList.add("word-read"); setTimeout(() => sparkyFace.classList.remove("word-read"), 120); }

function updateCaretStatus() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || !draftInput.contains(sel.anchorNode)) { lineStatus.textContent = "Ln 1, Col 1"; return; }
  const range = sel.getRangeAt(0).cloneRange();
  range.selectNodeContents(draftInput); range.setEnd(sel.anchorNode, sel.anchorOffset);
  const before = range.toString(); const lines = before.split("\n");
  lineStatus.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
}

function startTaskTimer() {
  clearInterval(timerInterval);
  const tick = () => {
    const elapsed = Math.floor((Date.now() - taskStart[taskIndex]) / 1000);
    const min = String(Math.floor(elapsed/60)).padStart(2,"0"), sec = String(elapsed%60).padStart(2,"0");
    taskTimer.textContent = `${min}:${sec}`;
  };
  tick(); timerInterval = setInterval(tick, 1000);
}

function totalScore() { return taskScores.reduce((a,b) => a+b, 0); }

function updateShiftScore() {
  const score = totalScore(); scoreEl.textContent = score;
  progressCount.textContent = `${completed.filter(Boolean).length}/5 filed`;
  if (score > 75) { lunchState.textContent = "UNLOCKED"; lunchState.classList.add("unlocked"); }
  else { lunchState.textContent = "LOCKED"; lunchState.classList.remove("unlocked"); }
}

function submitCurrentTask() {
  if (completed[taskIndex]) return;
  const value = getEditorText();
  if (!value.trim()) { feedback.textContent = "You can't file an empty task."; feedback.className = "feedback bad"; setSparky("🤨", "“You have to write something first.”"); return; }
  const task = tasks[taskIndex]; const evaluation = evaluateTask(task, value);
  drafts[taskIndex] = value; taskScores[taskIndex] = evaluation.points; completed[taskIndex] = true;
  draftInput.setAttribute("contenteditable", "false"); submitTask.classList.add("hidden");
  feedback.textContent = `Filed: ${evaluation.points}/${task.max} points · ${evaluation.results.filter(r => r.met).length}/${evaluation.results.length} criteria met.`;
  feedback.className = `feedback ${evaluation.points/task.max >= .6 ? "good" : "bad"}`;
  updateShiftScore(); calibrateSparky(evaluation, detectIssues(draftInput.textContent || ""));
  if (taskIndex < tasks.length - 1) {
    unlocked[taskIndex + 1] = true; renderTabs(taskIndex + 1);
    feedback.textContent += ` Next tab unlocked: ${tasks[taskIndex + 1].file}`;
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = setTimeout(() => renderTask(taskIndex + 1), 1600);
  } else {
    endShift.classList.remove("hidden");
    renderTabs();
  }
}

function showEnding() {
  clearInterval(timerInterval); clearTimeout(autoAdvanceTimer);
  workspace.classList.add("hidden"); ending.classList.remove("hidden"); restart.classList.add("hidden"); endingHint.classList.remove("hidden");
  const score = totalScore(); finalScore.textContent = `${score} / 100`;
  endingSequence = score > 75 ? [
    {text:"Huh, not bad intern. Not bad at all.",type:"hr"},
    {text:"I guess you can go have your lunch now. Make that 15 minutes.",type:"hr"},
    {text:"Only 15 minutes...?",type:"player"},
    {text:"What was that?",type:"hr"},
    {text:"Nothing!",type:"player"}
  ] : [
    {text:"*Sighs*, I guess no lunch break for you.",type:"hr"},
    {text:"Wait but please-",type:"player"},
    {text:"Nada. Get back to work.",type:"hr"}
  ];
  endingIndex = 0; showEndingLine();
}

function showEndingLine() {
  const line = endingSequence[endingIndex]; playLine(endingText, line.text, line.type);
  clearTimeout(endingTimer); endingTimer = setTimeout(() => advanceEnding(true), 10000);
}

function advanceEnding(auto = false) {
  if (endingMoving) return; endingMoving = true; clearTimeout(endingTimer);
  const finish = () => {
    endingMoving = false;
    if (endingIndex < endingSequence.length - 1) { endingIndex++; showEndingLine(); }
    else { endingText.classList.remove("playing"); endingText.style.opacity = 0; endingHint.classList.add("hidden"); restart.classList.remove("hidden"); }
  };
  if (auto) finish(); else { endingText.classList.remove("playing"); endingText.classList.add("skip-out"); setTimeout(finish, 280); }
}

intro.addEventListener("click", () => advanceIntro(false));
draftInput.addEventListener("input", updateLive);
draftInput.addEventListener("keyup", updateCaretStatus);
draftInput.addEventListener("click", updateCaretStatus);
submitTask.addEventListener("click", submitCurrentTask);
endShift.addEventListener("click", showEnding);
ending.addEventListener("click", e => { if (!restart.classList.contains("hidden") || e.target === restart) return; advanceEnding(false); });
restart.addEventListener("click", e => { e.stopPropagation(); window.location.reload(); });

showIntroLine();
