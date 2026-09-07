const introLines = [
  { text: "Welcome to your first day at InkSpire. I'm your HR, Sparky.", type: 'hr' },
  { text: "I assume you know what you're here for, boss needs you to get these tasks done ASAP.", type: 'hr', toast: true },
  { text: "Well? Go on then, I wont bother you anymore. Just make sure these are done by the end of the day.", type: 'hr' },
  { text: "Oh and, no lunch break for you until I see progress :)", type: 'hr' },
  { text: "Well... I guess I better get started immediately.", type: 'player' }
];

const tasks = [
  {
    type: 'EMAIL SUBJECT',
    title: 'Name the email',
    brief: 'The boss is sending a client an update about their project deadline, now set for 14 September. Write a clear professional subject line.',
    objective: 'Write a clear subject line',
    placeholder: 'Type the subject line...',
    evaluate(value) {
      const v = value.trim();
      const lower = v.toLowerCase();
      const words = v ? v.split(/\s+/).filter(Boolean) : [];
      let points = 0;
      if (/project|proposal|deadline|delivery|update/.test(lower)) points += 5;
      if (/14\s*(september|sep)|september\s*14|14th/.test(lower)) points += 5;
      if (words.length >= 4 && words.length <= 12) points += 5;
      if (v && !/[!]{2,}|\b(asap|urgent!!!|hey|stuff|thing)\b/i.test(v) && v !== v.toUpperCase()) points += 5;
      return {
        points,
        note: points >= 15
          ? 'Specific, professional, and useful before the email is even opened.'
          : 'Make the subject specific: what changed, what it concerns, and the relevant date.'
      };
    }
  },
  {
    type: 'TONE CHECK',
    title: 'Save the client relationship',
    brief: 'A colleague wrote: “You keep changing your mind, so obviously this is taking longer.” Rewrite it professionally. The new revisions will move delivery to Friday.',
    objective: 'Use an appropriate professional tone',
    placeholder: 'Rewrite the message...',
    evaluate(value) {
      const v = value.trim();
      const lower = v.toLowerCase();
      const words = v ? v.split(/\s+/).filter(Boolean) : [];
      let points = 0;
      if (/happy|glad|can|will|incorporat|new direction|revision|changes/.test(lower)) points += 5;
      if (/friday/.test(lower) && /deliver|deadline|complete|ready|send/.test(lower)) points += 5;
      if (v && !/you keep|your fault|obviously|stop changing|because of you|blame/.test(lower)) points += 5;
      if (words.length >= 9 && words.length <= 38) points += 5;
      return {
        points,
        note: points >= 15
          ? 'You acknowledged the request, explained the consequence, and avoided blaming the reader.'
          : 'Acknowledge the revision neutrally, state the Friday delivery impact, and remove blame.'
      };
    }
  },
  {
    type: 'CLARITY EDIT',
    title: 'Cut the corporate fog',
    brief: 'Rewrite this as clearly and concisely as possible: “At this point in time, we are currently in the process of conducting an evaluation of the submitted materials.”',
    objective: 'Improve clarity and concision',
    placeholder: 'Rewrite the sentence...',
    evaluate(value) {
      const v = value.trim();
      const lower = v.toLowerCase();
      const words = v ? v.split(/\s+/).filter(Boolean) : [];
      let points = 0;
      if (/evaluat|review/.test(lower)) points += 5;
      if (/submitted materials|materials submitted|submission/.test(lower)) points += 5;
      if (words.length >= 4 && words.length <= 10) points += 5;
      if (v && !/at this point in time|in the process of|conducting an evaluation|currently in/.test(lower)) points += 5;
      return {
        points,
        note: points >= 15
          ? 'Same meaning, fewer words, no deadweight.'
          : 'Keep the meaning, but remove filler phrases and unnecessary nominalisations.'
      };
    }
  },
  {
    type: 'AUDIENCE CHECK',
    title: 'Write for the reader',
    brief: 'Tell a non-technical department that the internal dashboard will be unavailable for maintenance from 6–7 PM. They should save their work before 6 PM.',
    objective: 'Adapt writing to the audience',
    placeholder: 'Write the notice...',
    evaluate(value) {
      const v = value.trim();
      const lower = v.toLowerCase();
      let points = 0;
      if (/dashboard/.test(lower)) points += 5;
      if (/6\s*(pm)?\s*[–—-]\s*7\s*pm|6\s*pm.*7\s*pm|from\s*6.*7/.test(lower)) points += 5;
      if (/save/.test(lower) && /before\s*6|by\s*6/.test(lower)) points += 5;
      if (v && !/backend|dependencies|service-layer|pursuant|infrastructure requirements|executing/.test(lower)) points += 5;
      return {
        points,
        note: points >= 15
          ? 'The reader gets the impact, timing, and action they need without unnecessary jargon.'
          : 'State what is unavailable, when, what the reader should do, and avoid technical jargon.'
      };
    }
  },
  {
    type: 'FINAL DRAFT',
    title: 'Reply to your manager',
    brief: 'Your manager asks: “Can you send the revised proposal by 4 PM today?” Write a concise professional reply that confirms the deadline.',
    objective: 'Draft a concise professional response',
    placeholder: 'Type your reply...',
    evaluate(value) {
      const v = value.trim();
      const lower = v.toLowerCase();
      let points = 0;
      if (/\b(yes|sure|certainly|absolutely|will|can)\b/.test(lower)) points += 7;
      if (/4\s*pm|4:00|by 4/.test(lower)) points += 7;
      if (v.length >= 20 && v.length <= 220) points += 4;
      if (v && !/\b(lol|bro|k|kk|whatever)\b|asap!!!/.test(lower)) points += 2;
      return {
        points,
        note: points >= 15
          ? 'Clear confirmation, clear deadline, no wasted words.'
          : 'Explicitly confirm the task and the 4 PM deadline in a concise professional tone.'
      };
    }
  }
];

let introIndex = 0;
let taskIndex = 0;
let score = 0;
let submitted = false;
let introTimer = null;
let introMoving = false;
let endingTimer = null;
let endingIndex = 0;
let endingSequence = [];
let endingMoving = false;
let lastReadWord = '';

const intro = document.getElementById('intro');
const workspace = document.getElementById('workspace');
const ending = document.getElementById('ending');
const introText = document.getElementById('introText');
const objectiveToast = document.getElementById('objectiveToast');
const objectivesList = document.getElementById('objectivesList');
const progressCount = document.getElementById('progressCount');
const scoreEl = document.getElementById('score');
const taskType = document.getElementById('taskType');
const taskNumber = document.getElementById('taskNumber');
const taskTitle = document.getElementById('taskTitle');
const taskBrief = document.getElementById('taskBrief');
const taskContent = document.getElementById('taskContent');
const feedback = document.getElementById('feedback');
const liveLabel = document.getElementById('liveLabel');
const liveReadout = document.getElementById('liveReadout');
const livePotential = document.getElementById('livePotential');
const submitTask = document.getElementById('submitTask');
const nextTask = document.getElementById('nextTask');
const sparkyFace = document.getElementById('sparkyFace');
const sparkyComment = document.getElementById('sparkyComment');
const readingWord = document.getElementById('readingWord');
const wordCount = document.getElementById('wordCount');
const lunchState = document.getElementById('lunchState');
const pageNumber = document.getElementById('pageNumber');
const finalScore = document.getElementById('finalScore');
const endingText = document.getElementById('endingText');
const endingHint = document.getElementById('endingHint');
const restart = document.getElementById('restart');

function playLine(element, text, type = 'hr') {
  element.classList.remove('playing', 'skip-out', 'player');
  void element.offsetWidth;
  element.textContent = text;
  if (type === 'player') element.classList.add('player');
  element.classList.add('playing');
}

function showIntroLine() {
  const line = introLines[introIndex];
  playLine(introText, line.text, line.type);
  objectiveToast.classList.add('hidden');
  if (line.toast) {
    objectiveToast.classList.remove('hidden');
    setTimeout(() => objectiveToast.classList.add('hidden'), 2700);
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
    if (introIndex < introLines.length - 1) {
      introIndex += 1;
      showIntroLine();
    } else {
      intro.classList.add('hidden');
      workspace.classList.remove('hidden');
      buildObjectives();
      renderTask();
    }
  };
  if (auto) finish();
  else {
    introText.classList.remove('playing');
    introText.classList.add('skip-out');
    setTimeout(finish, 280);
  }
}

function buildObjectives() {
  objectivesList.innerHTML = tasks.map((t, i) => `<li data-objective="${i}">${t.objective}</li>`).join('');
}

function renderTask() {
  const task = tasks[taskIndex];
  submitted = false;
  lastReadWord = '';
  feedback.className = 'feedback hidden';
  feedback.textContent = '';
  nextTask.classList.add('hidden');
  submitTask.classList.remove('hidden');
  taskType.textContent = task.type;
  taskNumber.textContent = `${String(taskIndex + 1).padStart(2, '0')} / ${String(tasks.length).padStart(2, '0')}`;
  pageNumber.textContent = `— ${String(taskIndex + 1).padStart(2, '0')} —`;
  taskTitle.textContent = task.title;
  taskBrief.textContent = task.brief;
  readingWord.textContent = '—';
  wordCount.textContent = '0 words';
  liveLabel.textContent = 'SPARKY IS READING LIVE';
  liveReadout.textContent = 'start typing...';
  livePotential.textContent = '';
  taskContent.innerHTML = `<label for="draftInput">YOUR RESPONSE</label><textarea id="draftInput" maxlength="500" autocomplete="off" spellcheck="true" placeholder="${task.placeholder}"></textarea>`;
  const input = document.getElementById('draftInput');
  input.addEventListener('input', () => updateLiveDraft(input.value));
  setSparky('😐', '“I\'m reading.”', false);
  setTimeout(() => input.focus(), 100);
}

function updateLiveDraft(value) {
  const task = tasks[taskIndex];
  if (submitted) return;
  const trimmed = value.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const currentWord = words.length ? words[words.length - 1] : '—';
  const result = task.evaluate(value);

  readingWord.textContent = currentWord;
  wordCount.textContent = `${words.length} word${words.length === 1 ? '' : 's'}`;
  livePotential.textContent = trimmed ? `LIVE ${result.points}/20` : '';

  if (!trimmed) {
    liveReadout.textContent = 'start typing...';
    setSparky('😐', '“I’m reading.”', false);
    return;
  }

  if (currentWord !== lastReadWord) {
    lastReadWord = currentWord;
    pulseSparky();
  }

  if (result.points >= 18) {
    liveReadout.textContent = 'clear + complete';
    setSparky('😐', '“...Fine. That works.”', true);
  } else if (result.points >= 14) {
    liveReadout.textContent = 'almost there';
    setSparky('🤨', '“Better. Something is still missing.”', true);
  } else if (result.points >= 9) {
    liveReadout.textContent = 'needs work';
    setSparky('😥', '“I’m not loving where this is going.”', true);
  } else if (words.length >= 5) {
    liveReadout.textContent = 'missing key details';
    setSparky('😰', '“Intern. Read the brief again.”', true);
  } else {
    liveReadout.textContent = 'reading...';
    setSparky('🤨', '“Go on...”', true);
  }
}

function pulseSparky() {
  sparkyFace.classList.remove('word-read');
  void sparkyFace.offsetWidth;
  sparkyFace.classList.add('word-read');
  setTimeout(() => sparkyFace.classList.remove('word-read'), 130);
}

function setSparky(face, comment, pulse = false) {
  sparkyFace.textContent = face;
  sparkyComment.textContent = comment;
  if (pulse) pulseSparky();
}

function submitCurrentTask() {
  if (submitted) return;
  const task = tasks[taskIndex];
  const input = document.getElementById('draftInput');
  const result = task.evaluate(input.value);
  const points = result.points;
  const correct = points >= 15;

  if (!input.value.trim()) {
    feedback.textContent = 'You cannot file an empty task.';
    feedback.className = 'feedback bad';
    setSparky('😡', '“You submitted air.”', true);
    return;
  }

  submitted = true;
  input.disabled = true;
  score += points;
  scoreEl.textContent = score;
  feedback.textContent = `+${points} points — ${result.note}`;
  feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
  document.querySelector(`[data-objective="${taskIndex}"]`).classList.add('done');
  progressCount.textContent = `${taskIndex + 1}/${tasks.length}`;
  submitTask.classList.add('hidden');
  nextTask.classList.remove('hidden');
  nextTask.textContent = taskIndex === tasks.length - 1 ? 'END SHIFT ▸' : 'TURN PAGE ▸';

  if (points >= 18) setSparky('😐', '“Hm. Competent. Annoying, but competent.”', true);
  else if (correct) setSparky('🤨', '“Passable. Don’t get smug.”', true);
  else if (points >= 9) setSparky('😥', '“Barely. I’m writing this down.”', true);
  else setSparky('😡', '“Do you need me to call the boss? I can call the boss.”', true);

  if (score >= 75) {
    lunchState.textContent = 'PROVISIONALLY UNLOCKED';
    lunchState.style.color = '#536b22';
  }
}

function nextTaskPage() {
  if (!submitted) return;
  if (taskIndex < tasks.length - 1) {
    taskIndex += 1;
    renderTask();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else showEnding();
}

function showEnding() {
  workspace.classList.add('hidden');
  ending.classList.remove('hidden');
  finalScore.textContent = `${score} / 100`;
  restart.classList.add('hidden');
  endingHint.classList.remove('hidden');
  endingIndex = 0;
  endingSequence = score >= 75
    ? [
        { text: 'Huh, not bad intern. Not bad at all.', type: 'hr' },
        { text: 'I guess you can go have your lunch now. Make that 15 minutes.', type: 'hr' },
        { text: 'Only 15 minutes...?', type: 'player' },
        { text: 'What was that?', type: 'hr' },
        { text: 'Nothing!', type: 'player' }
      ]
    : [
        { text: '*Sighs*, I guess no lunch break for you.', type: 'hr' },
        { text: 'Wait but please-', type: 'player' },
        { text: 'Nada. Get back to work.', type: 'hr' }
      ];
  showEndingLine();
}

function showEndingLine() {
  const line = endingSequence[endingIndex];
  playLine(endingText, line.text, line.type);
  clearTimeout(endingTimer);
  endingTimer = setTimeout(() => advanceEnding(true), 10000);
}

function advanceEnding(auto = false) {
  if (endingMoving || !restart.classList.contains('hidden')) return;
  endingMoving = true;
  clearTimeout(endingTimer);
  const finish = () => {
    endingMoving = false;
    if (endingIndex < endingSequence.length - 1) {
      endingIndex += 1;
      showEndingLine();
    } else {
      endingText.classList.remove('playing', 'skip-out', 'player');
      endingText.textContent = '';
      endingHint.classList.add('hidden');
      restart.classList.remove('hidden');
    }
  };
  if (auto) finish();
  else {
    endingText.classList.remove('playing');
    endingText.classList.add('skip-out');
    setTimeout(finish, 280);
  }
}

intro.addEventListener('click', () => advanceIntro(false));
ending.addEventListener('click', event => {
  if (event.target === restart) return;
  advanceEnding(false);
});
submitTask.addEventListener('click', submitCurrentTask);
nextTask.addEventListener('click', nextTaskPage);
restart.addEventListener('click', event => {
  event.stopPropagation();
  window.location.reload();
});

showIntroLine();
