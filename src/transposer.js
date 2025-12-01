import { Note, Interval } from "tonal";
import { draw_score, note_to_iy } from "./score.js";
import { total_lines } from "./settings.js";
import { draw_patterns } from "./patterns.js";

function transpose_score(score, interval) {
  let new_score = {};
  for (let pos in score) {
    let note = score[pos];
    let transposed_note = Note.simplify(Note.transpose(note, interval));
    new_score[pos] = transposed_note;
  }
  return new_score;
}

export function draw_transpose(score) {
  for (let i = 0; i < 12; i++) {
    let interval = Interval.simplify(Interval.fromSemitones(i * 7));
    let shifted_score = transpose_score(score, interval);
    shifted_score = best_octave(shifted_score);
    draw_score(shifted_score, "score_" + i);
    draw_patterns(shifted_score, "patterns_" + i);
  }
}

function best_octave(score) {
  let cost = 1000;
  let best_shift = 0;
  for (let oct = -3; oct < 3; oct++) {
    let shifted_score = transpose_score(
      score,
      Interval.fromSemitones(oct * 12),
    );
    let iys = [];
    for (let pos in shifted_score) {
      let note = shifted_score[pos];
      let iy = note_to_iy(note);
      iys.push(iy);
    }
    let min_iy = Math.min(...iys);
    let max_iy = Math.max(...iys);
    let center = (min_iy + max_iy) / 2;
    let new_cost = Math.abs(center - total_lines);
    if (new_cost < cost) {
      cost = new_cost;
      best_shift = oct;
    }
  }
  return transpose_score(score, Interval.fromSemitones(best_shift * 12));
}
