(function() {
  const app = document.getElementById('app');
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle';
  toggleBtn.textContent = 'عربي';
  document.body.appendChild(toggleBtn);

  let lang = 'en';
  const texts = {
    en: {
      start: 'Start Simulation',
      score: 'Security Score',
      risk: 'Risk Level',
      improvements: 'Suggested Improvements',
      leaderboard: 'Leaderboard',
      restart: 'Restart Simulation',
      questions: [
        {
          text: 'You receive an email asking to reset your bank password via a link.',
          options: [
            { text: 'Click the link', value: 0, feedback: 'This could be a phishing attack.' },
            { text: 'Report as phishing', value: 1, feedback: 'Good job! You avoided a phishing attempt.' }
          ]
        },
        {
          text: 'You find an unknown USB stick in the lobby.',
          options: [
            { text: 'Plug it into your computer', value: 0, feedback: 'This might infect the system.' },
            { text: 'Hand it to IT for analysis', value: 1, feedback: 'Correct! Unknown devices should be checked first.' }
          ]
        },
        {
          text: 'Someone calls claiming to be IT support and asks for your password.',
          options: [
            { text: 'Provide the password', value: 0, feedback: 'Passwords should never be shared.' },
            { text: 'Verify the caller via official channel', value: 1, feedback: 'Great! Always verify requests.' }
          ]
        }
      ],
      improvementsText: 'Review bank security guidelines and stay alert for suspicious activity.'
    },
    ar: {
      start: '\u0628\u062F\u0621 \u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629',
      score: '\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0623\u0645\u0646',
      risk: '\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062E\u0637\u0631',
      improvements: '\u062A\u062D\u0633\u064A\u0646\u0627\u062A \u0645\u0642\u062A\u0631\u062D\u0629',
      leaderboard: '\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u0635\u062F\u0631',
      restart: '\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0643\u0627\u0629',
      questions: [
        {
          text: '\u062A\u0635\u0644\u0643 \u0631\u0633\u0627\u0644\u0629 \u062A\u0637\u0644\u0628 \u0625\u0639\u0627\u062F\u0629 \u062A\u0639\u064A\u064A\u0646 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631\u0643 \u0639\u0628\u0631 \u0631\u0627\u0628\u0637.',
          options: [
            { text: '\u0627\u0644\u0646\u0642\u0631 \u0639\u0644\u0649 \u0627\u0644\u0631\u0627\u0628\u0637', value: 0, feedback: '\u0642\u062F \u064A\u0643\u0648\u0646 \u0647\u0630\u0627 \u0647\u062C\u0648\u0645 \u0627\u0635\u0637\u064A\u0627\u062F.' },
            { text: '\u0627\u0644\u0625\u0628\u0644\u0627\u063A \u0639\u0646 \u0627\u0644\u062A\u0635\u064A\u062F', value: 1, feedback: '\u0639\u0645\u0644 \u062C\u064A\u062F! \u062A\u062C\u0646\u0628\u062A \u0647\u062C\u0648\u0645 \u0627\u0635\u0637\u064A\u0627\u062F.' }
          ]
        },
        {
          text: '\u062A\u062C\u062F \u0648\u0633\u064A\u0637 USB \u0645\u062C\u0647\u0648\u0644\u0627\u064B \u0641\u064A \u0627\u0644\u0627\u0633\u062A\u0642\u0628\u0627\u0644.',
          options: [
            { text: '\u062A\u0648\u0635\u0644\u0647 \u0628\u0627\u0644\u062D\u0627\u0633\u0648\u0628', value: 0, feedback: '\u0642\u062F \u064A\u0635\u0627\u0628 \u0627\u0644\u0646\u0638\u0627\u0645 \u0628\u0641\u064A\u0631\u0648\u0633.' },
            { text: '\u062A\u0633\u0644\u0645\u0647 \u0644\u0640 IT \u0644\u0644\u0641\u062D\u0635', value: 1, feedback: '\u0635\u062D\u064A\u062D! \u064A\u062C\u0628 \u0627\u0644\u062AA\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u0645\u062C\u0647\u0648\u0644\u0629.' }
          ]
        },
        {
          text: '\u064A\u062A\u0635\u0644 \u0634\u062E\u0635 \u064A\u062F\u0639\u064A \u0623\u0646\u0647 \u062F\u0639\u0645 \u0641\u0646\u064A \u0648\u064A\u0637\u0644\u0628 \u0645\u0646\u0643 \u0643\u0644\u0645\u0629 \u0645\u0631\u0648\u0631\u0643.',
          options: [
            { text: '\u062A\u0632\u0648\u062F\u0647 \u0628\u0627\u0644\u0643\u0644\u0645\u0629', value: 0, feedback: '\u0644\u0627 \u064A\u0646\u0628\u063A\u064A \u0645\u0634\u0627\u0631\u0643\u0629 \u0643\u0644\u0645\u0627\u062A \u0627\u0644\u0645\u0631\u0648\u0631.' },
            { text: '\u062A\u062A\u062D\u0642 \u0645\u0646 \u0627\u0644\u0645\u062A\u0635\u0644 \u0645\u0646 \u062E\u0644\u0627\u0644 \u0627\u0644\u0642\u0646\u0648\u0627\u062A \u0627\u0644\u0631\u0633\u0645\u064A\u0629', value: 1, feedback: '\u0631\u0627\u0626\u0639! \u062F\u0627\u0626\u0645\u0627\u064B \u062A\u062D\u0642\u0642 \u0645\u0646 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A.' }
          ]
        }
      ],
      improvementsText: '\u0627\u0637\u0644\u0639 \u0639\u0644\u0649 \u062A\u0639\u0644\u064A\u0645\u0627\u062A \u0627\u0644\u0623\u0645\u0646 \u0648\u0643\u0646 \u0645\u0646\u062A\u0628\u0647\u0627\u064B \u0644\u0623\u064A \u0646\u0634\u0627\u0637 \u0645\u0634\u0628\u0648\u0647.'
    }
  };

  toggleBtn.addEventListener('click', () => {
    lang = lang === 'en' ? 'ar' : 'en';
    toggleBtn.textContent = lang === 'en' ? 'عربي' : 'English';
    renderStart();
  });

  let currentQuestion = 0;
  let score = 0;
  const decisions = [];

  function renderStart() {
    app.innerHTML = `<h1>Bank Cybersecurity Training</h1><button id="start">${texts[lang].start}</button>`;
    document.getElementById('start').addEventListener('click', () => {
      currentQuestion = 0;
      score = 0;
      decisions.length = 0;
      renderQuestion();
    });
  }

  function renderQuestion() {
    const q = texts[lang].questions[currentQuestion];
    if (!q) return renderDashboard();

    app.innerHTML = `<div class="question"><p>${q.text}</p></div><div class="answers"></div>`;
    const answersEl = app.querySelector('.answers');
    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.textContent = option.text;
      btn.addEventListener('click', () => {
        score += option.value;
        decisions.push({ question: q.text, decision: option.text, feedback: option.feedback, value: option.value });
        currentQuestion++;
        renderQuestion();
      });
      answersEl.appendChild(btn);
    });
  }

  function riskLevel(score) {
    if (score >= texts[lang].questions.length) return { level: 'Green', color: '#4caf50' };
    if (score >= texts[lang].questions.length / 2) return { level: 'Yellow', color: '#ff9800' };
    return { level: 'Red', color: '#f44336' };
  }

  function renderDashboard() {
    const risk = riskLevel(score);
    const percent = Math.round((score / texts[lang].questions.length) * 100);

    app.innerHTML = `
      <div id="dashboard">
        <h2>${texts[lang].score}: ${percent}</h2>
        <p>${texts[lang].risk}: <span style="color:${risk.color}">${risk.level}</span></p>
        <div class="progress"><div class="progress-bar" style="width:${percent}%; background-color:${risk.color}"></div></div>
        <h3>${texts[lang].improvements}</h3>
        <p>${texts[lang].improvementsText}</p>
        <button id="restart">${texts[lang].restart}</button>
        <div class="leaderboard"><h3>${texts[lang].leaderboard}</h3><ul id="scores"></ul></div>
      </div>
    `;

    document.getElementById('restart').addEventListener('click', () => {
      renderStart();
    });

    saveScore(percent);
    renderScores();
  }

  function saveScore(value) {
    const data = JSON.parse(localStorage.getItem('scores') || '[]');
    data.push({ date: new Date().toLocaleString(), value });
    localStorage.setItem('scores', JSON.stringify(data));
  }

  function renderScores() {
    const scores = JSON.parse(localStorage.getItem('scores') || '[]').sort((a, b) => b.value - a.value).slice(0, 5);
    const ul = document.getElementById('scores');
    ul.innerHTML = '';
    scores.forEach(s => {
      const li = document.createElement('li');
      li.textContent = `${s.date}: ${s.value}`;
      ul.appendChild(li);
    });
  }

  renderStart();
})();
