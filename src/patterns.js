import { fingerings } from "./fingerings.js";
import { get_canvas } from "./utils.js";
import { Note } from "tonal";
import { patterns_height } from "./settings.js";
const r = 10;
const dx = 40;

function draw_pattern(pattern, ix, canvas) {
  const ctx = canvas.getContext("2d");
  for (var i = 0; i < 3; i++) {
    ctx.beginPath();
    const cx = ix * dx + dx / 2;
    const cy = patterns_height - (patterns_height / 4) * (i + 1);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    if (pattern[i] == 1) {
      ctx.fillStyle = "black";
    }
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.stroke();
  }
}

function sharp_simplify(note) {
  const n = Note.simplify(note);
  if (Note.get(n).acc == "b") {
    return Note.enharmonic(n);
  }
  return n;
}

export function draw_patterns(score, canvas_id) {
  const canvas = get_canvas(canvas_id);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let imax = canvas.width / dx;
  for (var ix = 0; ix < imax; ix++) {
    if (ix in score) {
      const note = sharp_simplify(score[ix]);
      const pattern = fingerings[note];
      draw_pattern(pattern, ix, canvas);
    }
  }
}
