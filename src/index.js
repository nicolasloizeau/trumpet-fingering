function make_canvas(id, height, container = document.body) {
  const c = document.createElement("canvas");
  c.id = id;
  c.width = 1000;
  c.height = height;
  if (id.startsWith("score")) c.classList.add("score-canvas");
  container.appendChild(c);
}

for (let i = 0; i < 12; i++) {
  make_canvas("score_" + i, height);
  make_canvas("patterns_" + i, patterns_height);
}

import { draw_score } from "./score.js";
import { height, patterns_height } from "./settings.js";
import { click, sharpen, flatten, delete_note } from "./editor.js";

function init() {
  draw_score(window.score, "score_0");
  let canvas = document.getElementById("score_0");
  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left,
      y = e.clientY - r.top;
    click(x, y);
  });
}
init();

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    sharpen();
  }
  if (e.key === "ArrowDown") {
    flatten();
  }
  if (e.key === "Delete" || e.key === "Backspace") {
    delete_note();
  }
  if (e.key === "Enter") {
    draw();
  }
});

// Prevent page scrolling when using Up/Down arrows, but allow normal behavior
// inside text inputs, textareas, or contentEditable elements.
function isEditable(el) {
  if (!el) return false;
  const name = el.tagName;
  return name === "INPUT" || name === "TEXTAREA" || el.isContentEditable;
}

function onKeyDown(e) {
  // modern recommended check
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    // Don't block typing in inputs
    if (isEditable(e.target)) return;
    e.preventDefault(); // stop the browser scrolling
    e.stopPropagation(); // optional: stop bubbling if desired

    // Your own handling:
    if (e.key === "ArrowUp") {
      // handle up
    } else {
      // handle down
    }
  }
}

// Attach once, e.g. on app start:
window.addEventListener("keydown", onKeyDown);

const toggleBtn = document.getElementById("toggle-scores");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const canvases = document.querySelectorAll('canvas[id^="score"]');
    if (canvases.length === 0) return;
    const firstHidden = getComputedStyle(canvases[0]).display === "none";
    canvases.forEach((c) => {
      c.style.display = firstHidden ? "" : "none";
    });
    toggleBtn.textContent = firstHidden ? "Hide scores" : "Show scores";

    // optional: when showing canvases, you may want to redraw them
    // canvases.forEach(c => { if (getComputedStyle(c).display !== 'none') draw_score(window.score, c.id); });
  });
}
