// ============================================================================
// CONFIGURATION & AI ENGINE INTEGRATION
// ============================================================================

const GEMINI_API_KEY = "";

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
      { id: "approval", label: "Clearly asks for approval", points: 5, prompt: "Does the text explicitly request formal approval or confirmation for the careers panel?" },
      { id: "deadline", label: "Decision deadline: Fri 3 PM", points: 4, prompt: "Does the text state Friday at 3:00 PM as the deadline for a decision?" },
      { id: "value", label: "Explains value to students", points: 4, prompt: "Does the text explain how the event benefits students or careers?" },
      { id: "details", label: "Uses relevant event details", points: 3, prompt: "Does the text mention key details like Oct 18, 4:00-5:30 PM, or West Hall?" },
      { id: "tone", label: "Professional, confident tone", points: 4, prompt: "Is the tone respectful, professional, and free of informal slang or profanity?" },
      { id: "length", label: "120–180 words", points: 3, prompt: "Is the word count between 120 and 180 words?" }
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
      { id: "ack", label: "Acknowledges the revision", points: 4, prompt: "Does the text acknowledge the client's revision or new direction?" },
      { id: "friday", label: "States Friday delivery", points: 4, prompt: "Does the text clearly state that delivery is scheduled for Friday?" },
      { id: "blame", label: "Avoids blame", points: 5, prompt: "Does the text maintain a polite tone without blaming the client?" },
      { id: "length", label: "Clear + concise (35-70 words)", points: 3, prompt: "Is the text concise and between 35 and 70 words?" },
      { id: "next_step", label: "Positive next step", points: 2, prompt: "Does the text end on a positive note or helpful offer?" }
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
      { id: "meaning", label: "Keeps the core meaning", points: 4, prompt: "Does the edit state that materials are being evaluated or reviewed?" },
      { id: "length", label: "10 words or fewer", points: 4, prompt: "Is the sentence 10 words or fewer?" },
      { id: "filler", label: "Removes filler phrases", points: 4, prompt: "Are wordy corporate phrases like 'at this point in time' completely removed?" },
      { id: "verb", label: "Uses a direct verb", points: 2, prompt: "Does it use a direct verb like 'reviewing' or 'evaluating'?" }
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
      { id: "name", label: "Names the dashboard", points: 4, prompt: "Does the text explicitly mention the dashboard?" },
      { id: "window", label: "Gives 6–7 PM window", points: 4, prompt: "Does the text mention the 6–7 PM maintenance timeframe?" },
      { id: "save", label: "Tells staff to save before 6", points: 4, prompt: "Does it warn staff to save their work prior to 6 PM?" },
      { id: "jargon", label: "Avoids technical jargon", points: 5, prompt: "Is the text clear and free of technical IT jargon?" },
      { id: "length", label: "Concise notice (30-65 words)", points: 3, prompt: "Is the notice between 30 and 65 words long?" }
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
      { id: "confirm", label: "Explicitly confirms", points: 6, prompt: "Does the response clearly confirm willingness to submit the proposal?" },
      { id: "proposal", label: "Mentions revised proposal", points: 5, prompt: "Does the response explicitly mention the revised proposal?" },
      { id: "time", label: "Confirms 4 PM today", points: 6, prompt: "Does it confirm delivery by 4 PM today?" },
      { id: "tone", label: "Professional tone", points: 5, prompt: "Is the tone professional and appropriate for a manager?" },
      { id: "length", label: "Concise reply (15-35 words)", points: 3, prompt: "Is the reply between 15 and 35 words long?" }
    ]
  }
];

// State variables
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
let debounceTimer = null;
let endingIndex = 0;
let endingSequence = [];
let endingTimer = null;
let endingMoving = false;
let autoAdvanceTimer = null;

// DOM Elements Container
let els = {};

document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  els = {
    intro: $("intro"), workspace: $("workspace"), ending: $("ending"),
    introText: $("introText"), objectiveToast: $("objectiveToast"), taskTabs: $("taskTabs"),
    ctxPurpose: $("ctxPurpose"), ctxReader: $("ctxReader"), ctxRole: $("ctxRole"), ctxConstraints: $("ctxConstraints"), ctxNotes: $("ctxNotes"),
    criteriaList: $("criteriaList"), taskType: $("taskType"), taskTitle: $("taskTitle"), taskBrief: $("taskBrief"), taskMax: $("taskMax"), fileName: $("fileName"),
    draftInput: $("draftInput"), lineStatus: $("lineStatus"), charStatus: $("charStatus"), wordStatus: $("wordStatus"), taskTimer: $("taskTimer"),
    diagnosticMessage: $("diagnosticMessage"), livePotential: $("livePotential"), feedback: $("feedback"), submitTask: $("submitTask"), endShift: $("endShift"),
    sparkyFace: $("sparkyFace"), sparkyComment: $("sparkyComment"), readingWord: $("readingWord"), wordCount: $("wordCount"), issueChips: $("issueChips"),
    scoreEl: $("score"), progressCount: $("progressCount"), lunchState: $("lunchState"), finalScore: $("finalScore"), endingText: $("endingText"), endingHint: $("endingHint"), restart: $("restart")
  };

  if (els.intro) els.intro.addEventListener("click", () => advanceIntro(false));
  if (els.draftInput) {
    els.draftInput.addEventListener("input", updateLive);
    els.draftInput.addEventListener("keyup", updateCaretStatus);
    els.draftInput.addEventListener("click", updateCaretStatus);
  }
  if (els.submitTask) els.submitTask.addEventListener("click", submitCurrentTask);
  if (els.endShift) els.endShift.addEventListener("click", showEnding);
  if (els.ending) els.ending.addEventListener("click", e => { if (!els.restart?.classList.contains("hidden") || e.target === els.restart) return; advanceEnding(false); });
  if (els.restart) els.restart.addEventListener("click", e => { e.stopPropagation(); window.location.reload(); });

  showIntroLine();
});

async function performAIEvaluation(task, text) {
  const words = makeTextState(text).words;

  if (!text.trim()) {
    return {
      issues: [],
      criteriaMet: task.criteria.map(() => false),
      sparkyReaction: { face: "😐", comment: "“I'm reading. Keep going.”" }
    };
  }

  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(`[https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$](https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$){GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are evaluating an office writing game.
Task Brief: ${task.brief}
Current Draft: "${text}"

Evaluate the draft and return strictly valid JSON matching this schema:
{
  "issues": [
    { "type": "spelling" | "informal" | "clarity", "label": "Short message", "start": number, "end": number }
  ],
  "criteriaMet": [boolean for each criterion in index order],
  "sparkyComment": "Short witty response in character as HR manager Sparky",
  "sparkyFace": "🙂" | "😐" | "🤨" | "😡" | "😥"
}

Criteria to evaluate in order:
${task.criteria.map((c, i) => `${i + 1}. ${c.prompt}`).join("\n")}`
            }]
          }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0]) {
        let rawJson = data.candidates[0].content.parts[0].text;
        rawJson = rawJson.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(rawJson);
        return {
          issues: parsed.issues || [],
          criteriaMet: parsed.criteriaMet || [],
          sparkyReaction: { face: parsed.sparkyFace || "😐", comment: parsed.sparkyComment || "“Keep drafting.”" }
        };
      }
    } catch (err) {
      console.warn("AI API request failed, falling back to local engine:", err);
    }
  }

  return runLocalNLPEngine(task, text, words);
}

function runLocalNLPEngine(task, text, words) {
  const lower = text.toLowerCase();
  const issues = [];

  // 1. EXPANDED INFORMAL / RUDE / TEXT-SPEAK SCANNER
  const informalRules = [
    { regex: /\b(u suck|you suck|suck|sucks|dumb|stupid|trash|garbage|wtf|stfu|bullshit|screw|freaking)\b/gi, label: "Offensive/Rude tone" },
    { regex: /\b(fuck|shit|bitch|ass|damn|crap)\b/gi, label: "Profanity" },
    { regex: /\b(lol|lmao|rofl|omg|idk|btw|brb|tbh|imo|fyi|anyways|gonna|wanna|gotta|pls|plz|thx|thanks|whatever|k|kk|bro|bruh|dude|guys|yall|ya|yea|yeah|nah)\b/gi, label: "Slang/Informal" },
    { regex: /\b(u|r|ur|ure|y)\b/gi, label: "Text-speak abbreviation" },
    { regex: /\b(hi|hey|hello|so|like|obviously)\b/gi, label: "Casual opener/filler" },
    { regex: /!!!|\?\?\?/g, label: "Excessive punctuation" }
  ];

  informalRules.forEach(rule => {
    let match;
    while ((match = rule.regex.exec(text)) !== null) {
      const start = match.index;
      const end = match.index + match[0].length;
      if (!issues.some(i => start < i.end && end > i.start)) {
        issues.push({
          type: "informal",
          start,
          end,
          label: `${rule.label}: "${match[0]}"`
        });
      }
    }
  });

  // 2. COMMON OFFICE & WORKPLACE TYPO DICTIONARY
  const dictionary = {
    "evenning": "evening", "evenin": "evening", "comming": "coming",
    "tommorrow": "tomorrow", "tomorow": "tomorrow", "succesful": "successful",
    "begining": "beginning", "writting": "writing", "recieve": "receive",
    "recieved": "received", "definately": "definitely", "seperate": "separate",
    "apporval": "approval", "aproval": "approval", "recomended": "recommended",
    "sincorly": "sincerely", "sinserely": "sincerely", "fcuck": "fuck",
    "hyte": "hate", "luv": "love"
  };

  let searchOffset = 0;
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (!cleanWord) return;

    if (dictionary[cleanWord]) {
      const idx = lower.indexOf(cleanWord, searchOffset);
      if (idx !== -1) {
        if (!issues.some(i => idx < i.end && (idx + cleanWord.length) > i.start)) {
          issues.push({
            type: "spelling",
            start: idx,
            end: idx + cleanWord.length,
            label: `Spelling: "${cleanWord}" → "${dictionary[cleanWord]}"`
          });
        }
        searchOffset = idx + cleanWord.length;
      }
    }
  });

  issues.sort((a, b) => a.start - b.start);

  const hasInformal = issues.some(i => i.type === "informal");

  // 3. SPECIFIC CRITERIA EVALUATIONS FOR ALL 5 TASKS
  const criteriaMet = task.criteria.map((c) => {
    // Universal length check
    if (c.id === "length") {
      const limits = c.label.match(/\d+/g);
      if (limits && limits.length === 2) {
        return words.length >= Number(limits[0]) && words.length <= Number(limits[1]);
      }
      if (limits && limits.length === 1) {
        return words.length <= Number(limits[0]);
      }
    }

    // Universal tone check
    if (c.id === "tone") {
      return !hasInformal && words.length >= 10;
    }

    // SAFETY GUARD: Automatically fail content checks if draft contains informal slang/abbreviations
    if (hasInformal && words.length < 50) {
      return false;
    }

    // Specific Criterion Logic per Task
    switch (c.id) {
      // --- Task 1: Careers Panel Email ---
      case "approval":
        return (lower.includes("approval") || lower.includes("approve") || lower.includes("confirm")) &&
               (lower.includes("request") || lower.includes("seeking") || lower.includes("ask") || lower.includes("writing to") || lower.includes("would like"));

      case "deadline":
        return lower.includes("friday") && (lower.includes("3") || lower.includes("3:00") || lower.includes("3pm") || lower.includes("3 pm"));

      case "value":
        return lower.includes("benefit") || lower.includes("opportunity") || lower.includes("career") || lower.includes("student") || lower.includes("valuable") || lower.includes("insight");

      case "details":
        const detailMatches = [
          lower.includes("18") || lower.includes("october") || lower.includes("oct"),
          lower.includes("west hall"),
          lower.includes("80"),
          lower.includes("alumni"),
          lower.includes("4:00") || lower.includes("5:30") || lower.includes("4pm")
        ].filter(Boolean).length;
        return detailMatches >= 2;

      // --- Task 2: Client Revision ---
      case "ack":
        return lower.includes("revision") || lower.includes("direction") || lower.includes("change") || lower.includes("accommodate") || lower.includes("updated");

      case "friday":
        return lower.includes("friday");

      case "blame":
        return !hasInformal && !/\b(your fault|you delayed|you changed|you caused)\b/i.test(lower);

      case "next_step":
        return lower.includes("know") || lower.includes("question") || lower.includes("look forward") || lower.includes("help") || lower.includes("assist") || lower.includes("feel free");

      // --- Task 3: Clarity Edit ---
      case "meaning":
        return (lower.includes("evaluat") || lower.includes("review") || lower.includes("assess")) &&
               (lower.includes("material") || lower.includes("submission") || lower.includes("work"));

      case "filler":
        return !lower.includes("at this point in time") && !lower.includes("currently in the process of") && !lower.includes("conducting an evaluation");

      case "verb":
        return /\b(reviewing|evaluating|assessing|reviews|evaluates|assesses)\b/i.test(lower);

      // --- Task 4: Dashboard Notice ---
      case "name":
        return lower.includes("dashboard");

      case "window":
        return (lower.includes("6") || lower.includes("6:00") || lower.includes("6pm")) &&
               (lower.includes("7") || lower.includes("7:00") || lower.includes("7pm"));

      case "save":
        return lower.includes("save") && (lower.includes("before") || lower.includes("prior") || lower.includes("by 6"));

      case "jargon":
        return !/\b(server|backend|api|database|sql|downtime|cluster|deployment|endpoint)\b/i.test(lower);

      // --- Task 5: Manager Reply ---
      case "confirm":
        return lower.includes("will") || lower.includes("can") || lower.includes("confirm") || lower.includes("send") || lower.includes("submit") || lower.includes("happy to") || lower.includes("sure");

      case "proposal":
        return lower.includes("proposal");

      case "time":
        return (lower.includes("4") || lower.includes("4:00") || lower.includes("4pm") || lower.includes("4 pm")) && lower.includes("today");

      // Default Multi-Keyword Fallback
      default:
        const keywords = c.prompt.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter(w => w.length > 3 && !["does", "text", "explicitly", "about", "gives", "states"].includes(w));
        const matches = keywords.filter(kw => lower.includes(kw)).length;
        return matches >= 2;
    }
  });

  // 4. SPARKY HR REACTION LOGIC
  let sparkyFace = "🙂";
  let sparkyComment = "“I'm following. Keep writing.”";

  const severeIssue = issues.find(i => i.label.includes("Offensive") || i.label.includes("Profanity"));
  if (severeIssue) {
    sparkyFace = "😡";
    sparkyComment = "“That wording is going straight to HR. Which is me.”";
  } else if (hasInformal) {
    sparkyFace = "🤨";
    sparkyComment = "“Keep it professional. Slang won't cut it.”";
  } else if (words.length >= task.minReactionWords) {
    const metCount = criteriaMet.filter(Boolean).length;
    if (metCount >= task.criteria.length - 1) { sparkyFace = "🙂"; sparkyComment = "“Nice! Most of the brief is covered.”"; }
    else if (metCount >= 2) { sparkyFace = "😐"; sparkyComment = "“Getting there. Check the remaining criteria.”"; }
    else { sparkyFace = "🤨"; sparkyComment = "“You have enough text, but re-read the brief.”"; }
  }

  return { issues, criteriaMet, sparkyReaction: { face: sparkyFace, comment: sparkyComment } };
}
function playLine(element, text, type = "hr") {
  if (!element) return;
  element.classList.remove("playing", "skip-out", "player");
  void element.offsetWidth;
  element.textContent = text;
  if (type === "player") element.classList.add("player");
  element.classList.add("playing");
}

function showIntroLine() {
  const line = introLines[introIndex];
  playLine(els.introText, line.text, line.type);
  if (els.objectiveToast) {
    els.objectiveToast.classList.add("hidden");
    if (line.toast) {
      els.objectiveToast.classList.remove("hidden");
      setTimeout(() => els.objectiveToast.classList.add("hidden"), 2700);
    }
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
    else { els.intro?.classList.add("hidden"); els.workspace?.classList.remove("hidden"); renderTabs(); renderTask(0); }
  };
  if (auto) finish();
  else { els.introText?.classList.remove("playing"); els.introText?.classList.add("skip-out"); setTimeout(finish, 280); }
}

function makeTextState(value) {
  const clean = value.replace(/\u00a0/g, " ");
  const words = clean.trim() ? clean.trim().split(/\s+/).filter(Boolean) : [];
  return { value: clean, lower: clean.toLowerCase(), words };
}

function renderTabs(newIndex = -1) {
  if (!els.taskTabs) return;
  els.taskTabs.innerHTML = tasks.map((task, i) => {
    const classes = ["task-tab", i === taskIndex ? "active" : "", completed[i] ? "completed" : "", !unlocked[i] ? "locked" : "", i === newIndex ? "newly-unlocked" : ""].filter(Boolean).join(" ");
    const icon = completed[i] ? "✓" : unlocked[i] ? "▤" : "🔒";
    return `<button class="${classes}" data-tab="${i}" ${!unlocked[i] ? "disabled" : ""}><span class="tab-num">${String(i + 1).padStart(2,"0")}</span><span>${icon} ${task.tab}</span></button>`;
  }).join("");
  els.taskTabs.querySelectorAll(".task-tab:not(.locked)").forEach(btn => btn.addEventListener("click", () => {
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
  if (els.taskType) els.taskType.textContent = task.type;
  if (els.taskTitle) els.taskTitle.textContent = task.title;
  if (els.taskBrief) els.taskBrief.textContent = task.brief;
  if (els.taskMax) els.taskMax.textContent = `${task.max} pts`;
  if (els.fileName) els.fileName.textContent = task.file;
  if (els.ctxPurpose) els.ctxPurpose.textContent = task.context.purpose;
  if (els.ctxReader) els.ctxReader.textContent = task.context.reader;
  if (els.ctxRole) els.ctxRole.textContent = task.context.role;
  if (els.ctxConstraints) els.ctxConstraints.innerHTML = task.context.constraints.map(x => `<span>${x}</span>`).join("");
  if (els.ctxNotes) els.ctxNotes.innerHTML = task.context.notes.map(x => `<li>${x}</li>`).join("");
  if (els.feedback) { els.feedback.className = "feedback hidden"; els.feedback.textContent = ""; }
  if (els.draftInput) {
    els.draftInput.textContent = drafts[index];
    els.draftInput.setAttribute("contenteditable", completed[index] ? "false" : "plaintext-only");
  }
  if (els.submitTask) els.submitTask.classList.toggle("hidden", completed[index]);
  if (els.endShift) els.endShift.classList.toggle("hidden", !(index === tasks.length - 1 && completed[index]));
  updateLive();
  startTaskTimer();
  if (!completed[index] && els.draftInput) setTimeout(() => els.draftInput.focus(), 80);
}

function getEditorText() { return els.draftInput ? els.draftInput.innerText.replace(/\n+$/g, "") : ""; }

function updateLive() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const task = tasks[taskIndex];
    const value = getEditorText();
    drafts[taskIndex] = value;
    const words = makeTextState(value).words;

    const fullText = value.trim() || "—";
    if (els.readingWord) els.readingWord.textContent = fullText;
    if (els.wordCount) els.wordCount.textContent = `${words.length} word${words.length === 1 ? "" : "s"}`;
    if (els.charStatus) els.charStatus.textContent = `${value.length} character${value.length === 1 ? "" : "s"}`;
    if (els.wordStatus) els.wordStatus.textContent = `${words.length} word${words.length === 1 ? "" : "s"}`;

    updateCaretStatus();

    const evaluation = await performAIEvaluation(task, value);

    let points = 0;
    task.criteria.forEach((c, idx) => { if (evaluation.criteriaMet[idx]) points += c.points; });
    if (els.livePotential) els.livePotential.textContent = `${points} / ${task.max}`;

    renderCriteria(task.criteria, evaluation.criteriaMet);
    renderDiagnostics(evaluation.issues);
    applyHighlights(evaluation.issues);

    if (fullText !== lastReadWord && fullText !== "—") {
      lastReadWord = fullText;
      pulseSparky();
    }

    setSparky(evaluation.sparkyReaction.face, evaluation.sparkyReaction.comment);
  }, 300);
}

function renderCriteria(criteria, metArray) {
  if (!els.criteriaList) return;
  els.criteriaList.innerHTML = criteria.map((c, i) => {
    const met = !!metArray[i];
    return `<div class="criterion ${met ? "met" : ""}"><span class="criterion-dot"></span><span>${c.label}</span><strong>${met ? "+" : ""}${met ? c.points : 0}/${c.points}</strong></div>`;
  }).join("");
}

function textNodeMap(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = []; let offset = 0; let n;
  while ((n = walker.nextNode())) { nodes.push({ node: n, start: offset, end: offset + n.nodeValue.length }); offset += n.nodeValue.length; }
  return nodes;
}

function rangeForIssue(issue, map) {
  const s = map.find(x => issue.start >= x.start && issue.start <= x.end);
  const e = map.find(x => issue.end >= x.start && issue.end <= x.end) || map[map.length - 1];
  if (!s || !e) return null;
  const range = new Range();
  const startOffset = Math.max(0, Math.min(s.node.nodeValue.length, issue.start - s.start));
  const endOffset = Math.max(0, Math.min(e.node.nodeValue.length, issue.end - e.start));
  range.setStart(s.node, startOffset);
  range.setEnd(e.node, endOffset);
  return range;
}

function applyHighlights(issues) {
  if (!(window.CSS && CSS.highlights && window.Highlight && els.draftInput)) return;
  try {
    CSS.highlights.delete("spelling-error"); CSS.highlights.delete("informal-warning"); CSS.highlights.delete("clarity-warning");
    const map = textNodeMap(els.draftInput);
    if (!map.length) return;
    const groups = { spelling: [], informal: [], clarity: [] };
    issues.forEach(issue => {
      try {
        const range = rangeForIssue(issue, map);
        if (range) groups[issue.type]?.push(range);
      } catch (rangeErr) {}
    });
    if (groups.spelling.length) CSS.highlights.set("spelling-error", new Highlight(...groups.spelling));
    if (groups.informal.length) CSS.highlights.set("informal-warning", new Highlight(...groups.informal));
    if (groups.clarity.length) CSS.highlights.set("clarity-warning", new Highlight(...groups.clarity));
  } catch (err) {}
}

function renderDiagnostics(issues) {
  if (els.issueChips) els.issueChips.innerHTML = issues.slice(0, 4).map(i => `<span class="issue-chip ${i.type === "spelling" ? "bad" : "warn"}">${i.label}</span>`).join("");
  if (els.diagnosticMessage) {
    if (!issues.length) els.diagnosticMessage.textContent = "No obvious issues detected. Keep checking the criteria.";
    else {
      const s = issues.filter(i => i.type === "spelling").length, t = issues.filter(i => i.type === "informal").length, c = issues.filter(i => i.type === "clarity").length;
      els.diagnosticMessage.textContent = [`${s ? s + " spelling/grammar" : ""}`, `${t ? t + " tone" : ""}`, `${c ? c + " clarity" : ""}`].filter(Boolean).join(" · ") + " flag(s)";
    }
  }
}

function setSparky(face, comment) {
  if (els.sparkyFace) els.sparkyFace.textContent = face;
  if (els.sparkyComment) els.sparkyComment.textContent = comment;
}

function pulseSparky() {
  if (!els.sparkyFace) return;
  els.sparkyFace.classList.remove("word-read");
  void els.sparkyFace.offsetWidth;
  els.sparkyFace.classList.add("word-read");
  setTimeout(() => els.sparkyFace?.classList.remove("word-read"), 120);
}

function updateCaretStatus() {
  if (!els.lineStatus || !els.draftInput) return;
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || !els.draftInput.contains(sel.anchorNode)) { els.lineStatus.textContent = "Ln 1, Col 1"; return; }
  const range = sel.getRangeAt(0).cloneRange();
  range.selectNodeContents(els.draftInput); range.setEnd(sel.anchorNode, sel.anchorOffset);
  const before = range.toString(); const lines = before.split("\n");
  els.lineStatus.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
}

function startTaskTimer() {
  clearInterval(timerInterval);
  const tick = () => {
    if (!els.taskTimer) return;
    const elapsed = Math.floor((Date.now() - taskStart[taskIndex]) / 1000);
    const min = String(Math.floor(elapsed / 60)).padStart(2, "0"), sec = String(elapsed % 60).padStart(2, "0");
    els.taskTimer.textContent = `${min}:${sec}`;
  };
  tick(); timerInterval = setInterval(tick, 1000);
}

function totalScore() { return taskScores.reduce((a, b) => a + b, 0); }

function updateShiftScore() {
  const score = totalScore();
  if (els.scoreEl) els.scoreEl.textContent = score;
  if (els.progressCount) els.progressCount.textContent = `${completed.filter(Boolean).length}/5 filed`;
  if (els.lunchState) {
    if (score > 75) { els.lunchState.textContent = "UNLOCKED"; els.lunchState.classList.add("unlocked"); }
    else { els.lunchState.textContent = "LOCKED"; els.lunchState.classList.remove("unlocked"); }
  }
}

async function submitCurrentTask() {
  if (completed[taskIndex]) return;
  const value = getEditorText();
  if (!value.trim()) {
    if (els.feedback) { els.feedback.textContent = "You can't file an empty task."; els.feedback.className = "feedback bad"; }
    setSparky("🤨", "“You have to write something first.”");
    return;
  }
  
  const task = tasks[taskIndex];
  const evaluation = await performAIEvaluation(task, value);
  
  let points = 0;
  task.criteria.forEach((c, idx) => { if (evaluation.criteriaMet[idx]) points += c.points; });

  drafts[taskIndex] = value; taskScores[taskIndex] = points; completed[taskIndex] = true;
  if (els.draftInput) els.draftInput.setAttribute("contenteditable", "false");
  if (els.submitTask) els.submitTask.classList.add("hidden");
  if (els.feedback) {
    els.feedback.textContent = `Filed: ${points}/${task.max} points · ${evaluation.criteriaMet.filter(Boolean).length}/${task.criteria.length} criteria met.`;
    els.feedback.className = `feedback ${points / task.max >= .6 ? "good" : "bad"}`;
  }
  
  updateShiftScore();
  
  if (taskIndex < tasks.length - 1) {
    unlocked[taskIndex + 1] = true; renderTabs(taskIndex + 1);
    if (els.feedback) els.feedback.textContent += ` Next tab unlocked: ${tasks[taskIndex + 1].file}`;
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = setTimeout(() => renderTask(taskIndex + 1), 1600);
  } else {
    if (els.endShift) els.endShift.classList.remove("hidden");
    renderTabs();
  }
}

function showEnding() {
  clearInterval(timerInterval); clearTimeout(autoAdvanceTimer);
  els.workspace?.classList.add("hidden"); els.ending?.classList.remove("hidden"); els.restart?.classList.add("hidden"); els.endingHint?.classList.remove("hidden");
  const score = totalScore(); if (els.finalScore) els.finalScore.textContent = `${score} / 100`;
  endingSequence = score > 75 ? [
    { text: "Huh, not bad intern. Not bad at all.", type: "hr" },
    { text: "I guess you can go have your lunch now. Make that 15 minutes.", type: "hr" },
    { text: "Only 15 minutes...?", type: "player" },
    { text: "What was that?", type: "hr" },
    { text: "Nothing!", type: "player" }
  ] : [
    { text: "*Sighs*, I guess no lunch break for you.", type: "hr" },
    { text: "Wait but please-", type: "player" },
    { text: "Nada. Get back to work.", type: "hr" }
  ];
  endingIndex = 0; showEndingLine();
}

function showEndingLine() {
  const line = endingSequence[endingIndex]; playLine(els.endingText, line.text, line.type);
  clearTimeout(endingTimer); endingTimer = setTimeout(() => advanceEnding(true), 10000);
}

function advanceEnding(auto = false) {
  if (endingMoving) return; endingMoving = true; clearTimeout(endingTimer);
  const finish = () => {
    endingMoving = false;
    if (endingIndex < endingSequence.length - 1) { endingIndex++; showEndingLine(); }
    else { els.endingText?.classList.remove("playing"); if (els.endingText) els.endingText.style.opacity = 0; els.endingHint?.classList.add("hidden"); els.restart?.classList.remove("hidden"); }
  };
  if (auto) finish(); else { els.endingText?.classList.remove("playing"); els.endingText?.classList.add("skip-out"); setTimeout(finish, 280); }
}
