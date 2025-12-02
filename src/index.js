function make_canvas(id, height, container = document.body) {
  const c = document.createElement("canvas");
  c.id = id;
  c.width = window.innerWidth * 0.8;
  c.height = height;
  container.appendChild(c);
}

for (let i = 0; i < 12; i++) {
  make_canvas("score_" + i, height);
  make_canvas("patterns_" + i, patterns_height);
}

import { draw_score } from "./score.js";
import { height, patterns_height } from "./settings.js";
import { click, sharpen, flatten, delete_note } from "./editor.js";
import { exportAllCanvasesToPDF } from "./export.js";
import { createScaleButtons, update_scale } from "./scales.js";
import { Note } from "tonal";

console.log(Note.pitchClass("C#4"));
console.log(Note.pitchClass("C4"));
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

window.addEventListener("keydown", onKeyDown);

const toggleBtn = document.getElementById("toggle-scores");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const canvases = Array.from(
      document.querySelectorAll('canvas[id^="score"]'),
    ).filter((c) => c.id !== "score_0");

    if (canvases.length === 0) return;
    const firstHidden = getComputedStyle(canvases[0]).display === "none";
    canvases.forEach((c) => {
      c.style.display = firstHidden ? "" : "none";
    });
    toggleBtn.textContent = firstHidden ? "Hide scores" : "Show scores";
  });
}

const exportBtn = document.getElementById("export-pdf");
if (exportBtn) {
  exportBtn.addEventListener("click", () => {
    // you can pass options e.g. exportAllCanvasesToPDF('scores.pdf', { mime: 'image/jpeg', quality: 0.9 });
    exportAllCanvasesToPDF();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scales-container");
  if (container) {
    createScaleButtons(container);

    // Delegate clicks from the container to .scale-btn elements and call update_scale
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(".scale-btn");
      if (!btn || !container.contains(btn)) return;

      const scale = btn.dataset.scale;
      if (!scale) return;

      // call the update function exported from scales.js
      if (typeof update_scale === "function") {
        update_scale(scale);
      }
    });
  }
});
