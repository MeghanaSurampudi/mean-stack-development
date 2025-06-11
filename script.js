/* ---------- script.js ---------- */
let time = 1500;
let timer;
let isRunning = false;
let focusTime = 1500;
let breakTime = 300;
let onBreak = false;

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const moodSelect = document.getElementById("moodSelect");
const cycleMode = document.getElementById("cycleMode");
const quoteDisplay = document.getElementById("quoteDisplay");
const startSound = document.getElementById("startSound");
const breakSound = document.getElementById("breakSound");
const endSound = document.getElementById("endSound");
const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = `${circumference}`;

const quotes = [
  "Stay focused and never give up!",
  "Your only limit is your mind.",
  "Push yourself, because no one else will.",
  "Discipline = freedom.",
  "Small steps lead to big results."
];

function updateDisplay() {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  minutesDisplay.textContent = String(minutes).padStart(2, '0');
  secondsDisplay.textContent = String(seconds).padStart(2, '0');
  setProgress(time / (onBreak ? breakTime : focusTime));
}

function setProgress(percent) {
  const offset = circumference * (1 - percent);
  circle.style.strokeDashoffset = offset;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startSound.play();
    timer = setInterval(() => {
      time--;
      updateDisplay();
      if (time <= 0) {
        clearInterval(timer);
        isRunning = false;
        if (onBreak) {
          endSound.play();
          alert("Break over! Back to work!");
          onBreak = false;
          time = focusTime;
        } else {
          breakSound.play();
          const quote = getRandomQuote();
          quoteDisplay.textContent = quote;
          alert(quote);
          onBreak = true;
          time = breakTime;
        }
        startTimer();
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  onBreak = false;
  time = focusTime;
  updateDisplay();
  quoteDisplay.textContent = "";
}

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

moodSelect.addEventListener("change", () => {
  document.body.className = `${document.body.classList.contains('dark') ? 'dark' : 'light'} ${moodSelect.value}`;
});

document.getElementById("toggleTheme").addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  document.body.classList.toggle("light", !isDark);
});

cycleMode.addEventListener("change", () => {
  const customInputs = [document.getElementById("customFocus"), document.getElementById("customBreak")];
  if (cycleMode.value === "custom") {
    customInputs.forEach(i => i.style.display = "inline-block");
    customInputs.forEach(i => i.addEventListener("input", () => {
      focusTime = +document.getElementById("customFocus").value * 60 || 1500;
      breakTime = +document.getElementById("customBreak").value * 60 || 300;
      time = focusTime;
      updateDisplay();
    }));
  } else {
    customInputs.forEach(i => i.style.display = "none");
    focusTime = 1500;
    breakTime = 300;
    time = focusTime;
    updateDisplay();
  }
});

updateDisplay();
