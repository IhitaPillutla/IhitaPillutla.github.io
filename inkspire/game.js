const introLines = [
  { text: "Welcome to your first day at InkSpire. I'm your HR, Sparky.", type: 'hr' },
  { text: "I assume you know what you're here for. Boss needs you to get these tasks done ASAP.", type: 'hr', toast: true },
  { text: "Well? Go on then. I won't bother you anymore. Just make sure these are done by the end of the day.", type: 'hr' },
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
    brief: 'Your manager asks: “Can you send the revised proposal by 4 PM today?” Write a concise professional reply that confirms the deadline.',
    objective: 'Draft a concise professional response',
    kind: 'text',
    placeholder: 'Type your reply here...',
    evaluate(value) {
      const v = value.trim();
      if (!v) return { points: 0, note: 'You cannot submit an empty reply to your manager.' };
      const lower = v.toLowerCase();
      let points = 0;
      if (/yes|sure|certainly|absolutely|will|can/.test(lower)) points += 7;
      if (/4\s*pm|4:00|by 4/.test(lower)) points += 7;
      if (v.length >= 20 && v.length <= 220) points += 4;
      if (!/lol|bro|asap!!!|k|kk|whatever/.test(lower)) points += 2;
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

const intro = document.getElementById('intro');
const workspace = document.getElementById('workspace');
const ending = document.getElementById('ending');
const introText = document.getElementById('introText');
const playerLine = document.getElementById('playerLine');
const objectiveToast = document.getElementById('objectiveToast');
const introNext = document.getElementById('introNext');
const objectivesList = document.getElementById('objectivesList');
const progressCount = document.getElementById('progressCount');
const scoreEl = document.getElementById('score');
const taskType = document.getElementById('taskType');
const taskNumber = document.getElementById('taskNumber');
const taskTitle = document.getElementById('taskTitle');
const taskBrief = document.getElementById('taskBrief');
const taskContent = document.getElementById('taskContent');
const feedback = document.getElementById('feedback');
const submitTask = document.getElementById('submitTask');
const nextTask = document.getElementById('nextTask');
const sparkyFace = document.getElementById('sparkyFace');
const sparkyComment = document.getElementById('sparkyComment');
const lunchState = document.getElementById('lunchState');
const finalFace = document.getElementById('finalFace');
const finalScore = document.getElementById('finalScore');
const endingLine = document.getElementById('endingLine');
const endingPlayer = document.getElementById('endingPlayer');
const endingReply = document.getElementById('endingReply');
const restart = document.getElementById('restart');

function showIntroLine() {
  const line = introLines[introIndex];
  introText.classList.add('hidden');
  playerLine.classList.add('hidden');
  if (line.type === 'player') {
    playerLine.textContent = line.text;
    playerLine.classList.remove('hidden');
  } else {
    introText.textContent = line.text;
    introText.classList.remove('hidden');
  }
  if (line.toast) {
    objectiveToast.classList.remove('hidden');
    setTimeout(() => objectiveToast.classList.add('hidden'), 1500);
  }
  introNext.textContent = introIndex === introLines.length - 1 ? 'CLOCK IN ▸' : 'CONTINUE ▸';
}

function buildObjectives() {
  objectivesList.innerHTML = tasks.map((t, i) => `<li data-objective="${i}">${t.objective}</li>`).join('');
}

function renderTask() {
  const task = tasks[taskIndex];
  submitted = false;
  selectedChoice = null;
  feedback.className = 'feedback hidden';
  feedback.textContent = '';
  nextTask.classList.add('hidden');
  submitTask.classList.remove('hidden');
  taskType.textContent = task.type;
  taskNumber.textContent = `${String(taskIndex + 1).padStart(2, '0')} / ${String(tasks.length).padStart(2, '0')}`;
  taskTitle.textContent = task.title;
  taskBrief.textContent = task.brief;
  if (task.kind === 'choice') {
    taskContent.innerHTML = `<div class="choice-grid">${task.choices.map((choice, i) => `<button class="choice" data-choice="${i}">${choice}</button>`).join('')}</div>`;
    taskContent.querySelectorAll('.choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (submitted) return;
        selectedChoice = Number(btn.dataset.choice);
        taskContent.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  } else {
    taskContent.innerHTML = `<label for="draftInput">YOUR RESPONSE</label><textarea id="draftInput" maxlength="500" placeholder="${task.placeholder}"></textarea>`;
  }
  updateSparky();
}

function submitCurrentTask() {
  if (submitted) return;
  const task = tasks[taskIndex];
  let points = 0;
  let note = '';
  let correct = false;

  if (task.kind === 'choice') {
    if (selectedChoice === null) {
      feedback.textContent = 'Pick an answer before submitting.';
      feedback.className = 'feedback bad';
      return;
    }
    correct = selectedChoice === task.answer;
    points = correct ? 20 : 0;
    note = correct ? task.feedback : `Not quite. ${task.feedback}`;
    taskContent.querySelectorAll('.choice').forEach((btn, i) => {
      btn.disabled = true;
      if (i === task.answer) btn.style.outline = '2px solid #63812d';
    });
  } else {
    const value = document.getElementById('draftInput').value;
    const result = task.evaluate(value);
    points = result.points;
    note = result.note;
    correct = points >= 15;
    document.getElementById('draftInput').disabled = true;
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
  nextTask.textContent = taskIndex === tasks.length - 1 ? 'END SHIFT ▸' : 'NEXT TASK ▸';
  updateSparky(correct);
}

function updateSparky(lastCorrect = null) {
  const completed = taskIndex + (submitted ? 1 : 0);
  const maxSoFar = Math.max(completed * 20, 1);
  const ratio = completed ? score / maxSoFar : 1;
  let face = '😐';
  let comment = '“Let’s see what you can do.”';

  if (lastCorrect === true) comment = '“Hm. Competent. Annoying, but competent.”';
  if (lastCorrect === false) comment = '“Do you need me to call the boss? I can call the boss.”';
  if (ratio < .85) face = '🤨';
  if (ratio < .65) face = '😥';
  if (ratio < .45) face = '😰';
  if (ratio < .25) face = '😡';
  sparkyFace.textContent = face;
  sparkyComment.textContent = comment;
  if (score >= 75) {
    lunchState.textContent = 'PROVISIONALLY UNLOCKED';
    lunchState.style.color = '#d7ff4f';
  }
}

function next() {
  if (!submitted) return;
  if (taskIndex < tasks.length - 1) {
    taskIndex += 1;
    renderTask();
  } else {
    showEnding();
  }
}

function showEnding() {
  workspace.classList.add('hidden');
  ending.classList.remove('hidden');
  finalScore.textContent = `${score} / 100`;
  if (score >= 75) {
    finalFace.textContent = '😐';
    endingLine.textContent = 'Huh, not bad intern. Not bad at all. I guess you can go have your lunch now. Make that 15 minutes.';
    endingPlayer.textContent = '“Only 15 minutes...?”';
    endingReply.textContent = '“What was that?”  “Nothing!”';
  } else {
    finalFace.textContent = '😡';
    endingLine.textContent = '*Sighs* I guess no lunch break for you.';
    endingPlayer.textContent = '“Wait but please—”';
    endingReply.textContent = '“Nada. Get back to work.”';
  }
}

introNext.addEventListener('click', () => {
  if (introIndex < introLines.length - 1) {
    introIndex += 1;
    showIntroLine();
  } else {
    intro.classList.add('hidden');
    workspace.classList.remove('hidden');
    buildObjectives();
    renderTask();
  }
});
submitTask.addEventListener('click', submitCurrentTask);
nextTask.addEventListener('click', next);
restart.addEventListener('click', () => window.location.reload());

showIntroLine();