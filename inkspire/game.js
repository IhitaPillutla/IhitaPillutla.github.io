const introLines = [
  { text: "Welcome to your first day at InkSpire. I'm your HR, Sparky.", type: 'hr' },
  { text: "I assume you know what you're here for, boss needs you to get these tasks done ASAP.", type: 'hr', toast: true },
  { text: "Well? Go on then, I wont bother you anymore. Just make sure these are done by the end of the day.", type: 'hr' },
  { text: "Oh and, no lunch break for you until I see progress :)", type: 'hr' },
  { text: "Well... I guess I better get started immediately.", type: 'player' }
];

const tasks = [
  {
    type: 'EMAIL TRIAGE',
    title: 'Fix the subject line',
    brief: 'The boss is sending a deadline update to a client. Pick the clearest professional subject line.',
    objective: 'Write a clear subject line',
    kind: 'choice',
    choices: [
      'IMPORTANT!!! READ THIS ASAP',
      'Update Regarding Your Project Deadline — 14 September',
      'Hey, quick thing',
      'Project stuff'
    ],
    answer: 1,
    feedback: 'Specific, neutral, and useful before the email is even opened.'
  },
  {
    type: 'TONE CHECK',
    title: 'Save the client relationship',
    brief: 'A colleague wrote this after the client requested another revision: “You keep changing your mind, so obviously this is taking longer.” Choose the best rewrite.',
    objective: 'Use an appropriate professional tone',
    kind: 'choice',
    choices: [
      'As previously stated, the delays are the result of your repeated changes.',
      'We’re happy to incorporate the new direction. The additional revisions will shift the delivery date to Friday.',
      'No worries lol, we’ll try.',
      'Please stop changing the brief.'
    ],
    answer: 1,
    feedback: 'It acknowledges the request, explains the consequence, and avoids blaming the reader.'
  },
  {
    type: 'CLARITY EDIT',
    title: 'Cut the corporate fog',
    brief: 'Choose the clearest version of this sentence: “At this point in time, we are currently in the process of conducting an evaluation of the submitted materials.”',
    objective: 'Improve clarity and concision',
    kind: 'choice',
    choices: [
      'At this current point in time, we are evaluating the materials that were submitted.',
      'We are currently evaluating the submitted materials.',
      'The submitted materials, at this point, are in a process of evaluation by us.',
      'Evaluation, currently, is being conducted on materials submitted.'
    ],
    answer: 1,
    feedback: 'Same meaning, fewer words, no deadweight.'
  },
  {
    type: 'AUDIENCE CHECK',
    title: 'Write for the reader',
    brief: 'You need to tell a non-technical department that the internal dashboard will be unavailable for maintenance. Pick the strongest version.',
    objective: 'Adapt writing to the audience',
    kind: 'choice',
    choices: [
      'The dashboard will undergo scheduled backend infrastructure maintenance from 6–7 PM. Please save your work before 6 PM.',
      'We will be executing a maintenance operation involving backend dependencies and service-layer updates.',
      'Dashboard dead 6–7. Don’t use it.',
      'Please be advised that maintenance shall be undertaken pursuant to infrastructure requirements.'
    ],
    answer: 0,
    feedback: 'The reader gets the impact, timing, and action they need without unnecessary jargon.'
  },
  {
    type: 'FINAL DRAFT',
    title: 'Reply to your manager',
    brief: 'Your manager asks: “Can you send the revised proposal by 4 PM today?” Write a concise professional reply that confirms the deadline. Sparky is reading as you type.',
    objective: 'Draft a concise professional response',
    kind: 'text',
    placeholder: 'Type your reply here...',
    evaluate(value) {
      const v = value.trim();
      if (!v) return { points: 0, note: 'You cannot submit an empty reply to your manager.' };
      const lower = v.toLowerCase();
      let points = 0;
      if (/\b(yes|sure|certainly|absolutely|will|can)\b/.test(lower)) points += 7;
      if (/4\s*pm|4:00|by 4/.test(lower)) points += 7;
      if (v.length >= 20 && v.length <= 220) points += 4;
      if (!/\b(lol|bro|k|kk|whatever)\b|asap!!!/.test(lower)) points += 2;
      return {
        points,
        note: points >= 15
          ? 'Clear confirmation, clear deadline, no wasted words.'
          : 'Your reply should explicitly confirm the task and the 4 PM deadline in a concise professional tone.'
      };
    }
  }
];

let introIndex = 0;
let taskIndex = 0;
let score = 0;
let selectedChoice = null;
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
const liveFeedback = document.getElementById('liveFeedback');
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

  if (auto) {
    finish();
  } else {
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
  selectedChoice = null;
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
  livePotential.textContent = '';

  if (task.kind === 'choice') {
    liveLabel.textContent = 'SPARKY IS WATCHING';
    liveReadout.textContent = 'pick an option...';
    taskContent.innerHTML = `<div class="choice-grid">${task.choices.map((choice, i) => `<button class="choice" data-choice="${i}">${choice}</button>`).join('')}</div>`;
    taskContent.querySelectorAll('.choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (submitted) return;
        selectedChoice = Number(btn.dataset.choice);
        taskContent.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        previewChoice(selectedChoice);
      });
    });
  } else {
    liveLabel.textContent = 'SPARKY IS READING LIVE';
    liveReadout.textContent = 'start typing...';
    taskContent.innerHTML = `<label for="draftInput">YOUR RESPONSE</label><textarea id="draftInput" maxlength="500" autocomplete="off" spellcheck="true" placeholder="${task.placeholder}"></textarea>`;
    const input = document.getElementById('draftInput');
    input.addEventListener('input', () => updateLiveDraft(input.value));
    input.addEventListener('keyup', () => updateLiveDraft(input.value));
  }
  setSparky('😐', '“I\'m reading.”', false);
}

function previewChoice(choiceIndex) {
  const task = tasks[taskIndex];
  const choice = task.choices[choiceIndex];
  const words = choice.trim().split(/\s+/).filter(Boolean);
  const last = words[words.length - 1] || '—';
  readingWord.textContent = last;
  wordCount.textContent = `${words.length} word${words.length === 1 ? '' : 's'}`;
  liveReadout.textContent = choiceIndex === task.answer ? 'that reads well...' : 'hmm...';
  livePotential.textContent = choiceIndex === task.answer ? 'LOOKS GOOD' : 'RECONSIDER';
  if (choiceIndex === task.answer) {
    setSparky('😐', '“Okay. That actually works.”', true);
  } else {
    setSparky('🤨', '“You’re filing THAT?”', true);
  }
}

function updateLiveDraft(value) {
  const task = tasks[taskIndex];
  if (task.kind !== 'text' || submitted) return;

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
    setSparky('😐', '“...Fine. Keep going.”', true);
  } else if (result.points >= 14) {
    liveReadout.textContent = 'almost there';
    setSparky('🤨', '“Better. Something is still missing.”', true);
  } else if (result.points >= 8) {
    liveReadout.textContent = 'needs work';
    setSparky('😥', '“I’m not loving where this is going.”', true);
  } else if (words.length >= 4) {
    liveReadout.textContent = 'missing key details';
    setSparky('😰', '“Intern. The deadline. Please.”', true);
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
  let points = 0;
  let note = '';
  let correct = false;

  if (task.kind === 'choice') {
    if (selectedChoice === null) {
      feedback.textContent = 'Pick an answer before filing the task.';
      feedback.className = 'feedback bad';
      setSparky('🤨', '“There is literally nothing selected.”', true);
      return;
    }
    correct = selectedChoice === task.answer;
    points = correct ? 20 : 0;
    note = correct ? task.feedback : `Not quite. ${task.feedback}`;
    taskContent.querySelectorAll('.choice').forEach((btn, i) => {
      btn.disabled = true;
      if (i === task.answer) btn.style.outline = '2px solid #658344';
    });
  } else {
    const input = document.getElementById('draftInput');
    const result = task.evaluate(input.value);
    points = result.points;
    note = result.note;
    correct = points >= 15;
    input.disabled = true;
  }

  submitted = true;
  score += points;
  scoreEl.textContent = score;
  feedback.textContent = `+${points} points — ${note}`;
  feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
  document.querySelector(`[data-objective="${taskIndex}"]`).classList.add('done');
  progressCount.textContent = `${taskIndex + 1}/${tasks.length}`;
  submitTask.classList.add('hidden');
  nextTask.classList.remove('hidden');
  nextTask.textContent = taskIndex === tasks.length - 1 ? 'END SHIFT ▸' : 'TURN PAGE ▸';

  if (correct) setSparky('😐', '“Hm. Competent. Annoying, but competent.”', true);
  else if (points >= 10) setSparky('😥', '“Barely. I’m writing this down.”', true);
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
  } else {
    showEnding();
  }
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
  if (endingMoving || restart.classList.contains('hidden') === false) return;
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

  if (auto) {
    finish();
  } else {
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
