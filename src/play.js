import * as Tone from "tone";
import { Note } from "tonal";

const trumpet = new Tone.Sampler({
  urls: {
    C6: "C6.mp3",
    D5: "D5.mp3",
    "D#4": "Ds4.mp3",
    F3: "F3.mp3",
    F4: "F4.mp3",
    F5: "F5.mp3",
    G4: "G4.mp3",
    A3: "A3.mp3",
    A5: "A5.mp3",
    "A#4": "As4.mp3",
    C4: "C4.mp3",
  },
  baseUrl: "./samples/trumpet/", // relative path to folder
}).toDestination();

export async function play_score(score_i, interval = 0.5) {
  const score = window.transposed_scores[score_i];
  const notes = [];
  for (let pos in score) {
    let note = score[pos];
    notes.push(Note.midi(note));
  }
  // Ensure Tone.js audio context is started
  await Tone.start();

  notes.forEach((midi, i) => {
    const freq = Tone.Frequency(midi, "midi"); // Convert MIDI to frequency
    // Schedule the note using Tone.now() + offset
    trumpet.triggerAttackRelease(freq, "4n", Tone.now() + i * interval);
  });
}
