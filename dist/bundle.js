/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ../../../node_modules/@tonaljs/pitch/dist/index.mjs
// index.ts
function isNamedPitch(src) {
  return src !== null && typeof src === "object" && "name" in src && typeof src.name === "string" ? true : false;
}
var SIZES = (/* unused pure expression or super */ null && ([0, 2, 4, 5, 7, 9, 11]));
var chroma = ({ step, alt }) => (SIZES[step] + alt + 120) % 12;
var height = ({ step, alt, oct, dir = 1 }) => dir * (SIZES[step] + alt + 12 * (oct === void 0 ? -100 : oct));
var midi = (pitch2) => {
  const h = height(pitch2);
  return pitch2.oct !== void 0 && h >= -12 && h <= 115 ? h + 12 : null;
};
function isPitch(pitch2) {
  return pitch2 !== null && typeof pitch2 === "object" && "step" in pitch2 && typeof pitch2.step === "number" && "alt" in pitch2 && typeof pitch2.alt === "number" && !isNaN(pitch2.step) && !isNaN(pitch2.alt) ? true : false;
}
var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
var STEPS_TO_OCTS = FIFTHS.map(
  (fifths) => Math.floor(fifths * 7 / 12)
);
function coordinates(pitch2) {
  const { step, alt, oct, dir = 1 } = pitch2;
  const f = FIFTHS[step] + 7 * alt;
  if (oct === void 0) {
    return [dir * f];
  }
  const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
  return [dir * f, dir * o];
}
var FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];
function pitch(coord) {
  const [f, o, dir] = coord;
  const step = FIFTHS_TO_STEPS[unaltered(f)];
  const alt = Math.floor((f + 1) / 7);
  if (o === void 0) {
    return { step, alt, dir };
  }
  const oct = o + 4 * alt + STEPS_TO_OCTS[step];
  return { step, alt, oct, dir };
}
function unaltered(f) {
  const i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/pitch-interval/dist/index.mjs
// index.ts

var fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
var NoInterval = Object.freeze({
  empty: true,
  name: "",
  num: NaN,
  q: "",
  type: "",
  step: NaN,
  alt: NaN,
  dir: NaN,
  simple: NaN,
  semitones: NaN,
  chroma: NaN,
  coord: [],
  oct: NaN
});
var INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
var INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
var REGEX = new RegExp(
  "^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$"
);
function tokenizeInterval(str) {
  const m = REGEX.exec(`${str}`);
  if (m === null) {
    return ["", ""];
  }
  return m[1] ? [m[1], m[2]] : [m[4], m[3]];
}
var cache = {};
function interval(src) {
  return typeof src === "string" ? cache[src] || (cache[src] = parse(src)) : isPitch(src) ? interval(pitchName(src)) : isNamedPitch(src) ? interval(src.name) : NoInterval;
}
var dist_SIZES = [0, 2, 4, 5, 7, 9, 11];
var TYPES = "PMMPPMM";
function parse(str) {
  const tokens = tokenizeInterval(str);
  if (tokens[0] === "") {
    return NoInterval;
  }
  const num = +tokens[0];
  const q = tokens[1];
  const step = (Math.abs(num) - 1) % 7;
  const t = TYPES[step];
  if (t === "M" && q === "P") {
    return NoInterval;
  }
  const type = t === "M" ? "majorable" : "perfectable";
  const name = "" + num + q;
  const dir = num < 0 ? -1 : 1;
  const simple = num === 8 || num === -8 ? num : dir * (step + 1);
  const alt = qToAlt(type, q);
  const oct = Math.floor((Math.abs(num) - 1) / 7);
  const semitones = dir * (dist_SIZES[step] + alt + 12 * oct);
  const chroma = (dir * (dist_SIZES[step] + alt) % 12 + 12) % 12;
  const coord = coordinates({ step, alt, oct, dir });
  return {
    empty: false,
    name,
    num,
    q,
    step,
    alt,
    dir,
    type,
    simple,
    semitones,
    chroma,
    coord,
    oct
  };
}
function coordToInterval(coord, forceDescending) {
  const [f, o = 0] = coord;
  const isDescending = f * 7 + o * 12 < 0;
  const ivl = forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
  return interval(pitch(ivl));
}
function qToAlt(type, q) {
  return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
}
function pitchName(props) {
  const { step, alt, oct = 0, dir } = props;
  if (!dir) {
    return "";
  }
  const calcNum = step + 1 + 7 * oct;
  const num = calcNum === 0 ? step + 1 : calcNum;
  const d = dir < 0 ? "-" : "";
  const type = TYPES[step] === "M" ? "majorable" : "perfectable";
  const name = d + num + altToQ(type, alt);
  return name;
}
function altToQ(type, alt) {
  if (alt === 0) {
    return type === "majorable" ? "M" : "P";
  } else if (alt === -1 && type === "majorable") {
    return "m";
  } else if (alt > 0) {
    return fillStr("A", alt);
  } else {
    return fillStr("d", type === "perfectable" ? alt : alt + 1);
  }
}

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/pitch-note/dist/index.mjs
// index.ts

var dist_fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
var NoNote = Object.freeze({
  empty: true,
  name: "",
  letter: "",
  acc: "",
  pc: "",
  step: NaN,
  alt: NaN,
  chroma: NaN,
  height: NaN,
  coord: [],
  midi: null,
  freq: null
});
var dist_cache = /* @__PURE__ */ new Map();
var stepToLetter = (step) => "CDEFGAB".charAt(step);
var altToAcc = (alt) => alt < 0 ? dist_fillStr("b", -alt) : dist_fillStr("#", alt);
var accToAlt = (acc) => acc[0] === "b" ? -acc.length : acc.length;
function dist_note(src) {
  const stringSrc = JSON.stringify(src);
  const cached = dist_cache.get(stringSrc);
  if (cached) {
    return cached;
  }
  const value = typeof src === "string" ? dist_parse(src) : isPitch(src) ? dist_note(dist_pitchName(src)) : isNamedPitch(src) ? dist_note(src.name) : NoNote;
  dist_cache.set(stringSrc, value);
  return value;
}
var dist_REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
function tokenizeNote(str) {
  const m = dist_REGEX.exec(str);
  return m ? [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]] : ["", "", "", ""];
}
function coordToNote(noteCoord) {
  return dist_note(pitch(noteCoord));
}
var mod = (n, m) => (n % m + m) % m;
var SEMI = [0, 2, 4, 5, 7, 9, 11];
function dist_parse(noteName) {
  const tokens = tokenizeNote(noteName);
  if (tokens[0] === "" || tokens[3] !== "") {
    return NoNote;
  }
  const letter = tokens[0];
  const acc = tokens[1];
  const octStr = tokens[2];
  const step = (letter.charCodeAt(0) + 3) % 7;
  const alt = accToAlt(acc);
  const oct = octStr.length ? +octStr : void 0;
  const coord = coordinates({ step, alt, oct });
  const name = letter + acc + octStr;
  const pc = letter + acc;
  const chroma = (SEMI[step] + alt + 120) % 12;
  const height = oct === void 0 ? mod(SEMI[step] + alt, 12) - 12 * 99 : SEMI[step] + alt + 12 * (oct + 1);
  const midi = height >= 0 && height <= 127 ? height : null;
  const freq = oct === void 0 ? null : Math.pow(2, (height - 69) / 12) * 440;
  return {
    empty: false,
    acc,
    alt,
    chroma,
    coord,
    freq,
    height,
    letter,
    midi,
    name,
    oct,
    pc,
    step
  };
}
function dist_pitchName(props) {
  const { step, alt, oct } = props;
  const letter = stepToLetter(step);
  if (!letter) {
    return "";
  }
  const pc = letter + altToAcc(alt);
  return oct || oct === 0 ? pc + oct : pc;
}

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/pitch-distance/dist/index.mjs
// index.ts


function transpose(noteName, intervalName) {
  const note = dist_note(noteName);
  const intervalCoord = Array.isArray(intervalName) ? intervalName : interval(intervalName).coord;
  if (note.empty || !intervalCoord || intervalCoord.length < 2) {
    return "";
  }
  const noteCoord = note.coord;
  const tr = noteCoord.length === 1 ? [noteCoord[0] + intervalCoord[0]] : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
  return coordToNote(tr).name;
}
function tonicIntervalsTransposer(intervals, tonic) {
  const len = intervals.length;
  return (normalized) => {
    if (!tonic) return "";
    const index = normalized < 0 ? (len - -normalized % len) % len : normalized % len;
    const octaves = Math.floor(normalized / len);
    const root = transpose(tonic, [0, octaves]);
    return transpose(root, intervals[index]);
  };
}
function distance(fromNote, toNote) {
  const from = dist_note(fromNote);
  const to = dist_note(toNote);
  if (from.empty || to.empty) {
    return "";
  }
  const fcoord = from.coord;
  const tcoord = to.coord;
  const fifths = tcoord[0] - fcoord[0];
  const octs = fcoord.length === 2 && tcoord.length === 2 ? tcoord[1] - fcoord[1] : -Math.floor(fifths * 7 / 12);
  const forceDescending = to.height === from.height && to.midi !== null && from.oct === to.oct && from.step > to.step;
  return coordToInterval([fifths, octs], forceDescending).name;
}

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/abc-notation/dist/index.mjs
// index.ts


var abc_notation_dist_fillStr = (character, times) => Array(times + 1).join(character);
var abc_notation_dist_REGEX = /^(_{1,}|=|\^{1,}|)([abcdefgABCDEFG])([,']*)$/;
function tokenize(str) {
  const m = abc_notation_dist_REGEX.exec(str);
  if (!m) {
    return ["", "", ""];
  }
  return [m[1], m[2], m[3]];
}
function abcToScientificNotation(str) {
  const [acc, letter, oct] = tokenize(str);
  if (letter === "") {
    return "";
  }
  let o = 4;
  for (let i = 0; i < oct.length; i++) {
    o += oct.charAt(i) === "," ? -1 : 1;
  }
  const a = acc[0] === "_" ? acc.replace(/_/g, "b") : acc[0] === "^" ? acc.replace(/\^/g, "#") : "";
  return letter.charCodeAt(0) > 96 ? letter.toUpperCase() + a + (o + 1) : letter + a + o;
}
function scientificToAbcNotation(str) {
  const n = dist_note(str);
  if (n.empty || !n.oct && n.oct !== 0) {
    return "";
  }
  const { letter, acc, oct } = n;
  const a = acc[0] === "b" ? acc.replace(/b/g, "_") : acc.replace(/#/g, "^");
  const l = oct > 4 ? letter.toLowerCase() : letter;
  const o = oct === 5 ? "" : oct > 4 ? abc_notation_dist_fillStr("'", oct - 5) : abc_notation_dist_fillStr(",", 4 - oct);
  return a + l + o;
}
function dist_transpose(note2, interval) {
  return scientificToAbcNotation(transpose(abcToScientificNotation(note2), interval));
}
function dist_distance(from, to) {
  return distance(abcToScientificNotation(from), abcToScientificNotation(to));
}
var abc_notation_default = {
  abcToScientificNotation,
  scientificToAbcNotation,
  tokenize,
  transpose: dist_transpose,
  distance: dist_distance
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/array/dist/index.mjs
// index.ts

function ascR(b, n) {
  const a = [];
  for (; n--; a[n] = n + b) ;
  return a;
}
function descR(b, n) {
  const a = [];
  for (; n--; a[n] = b - n) ;
  return a;
}
function range(from, to) {
  return from < to ? ascR(from, to - from + 1) : descR(from, from - to + 1);
}
function rotate(times, arr) {
  const len = arr.length;
  const n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}
function compact(arr) {
  return arr.filter((n) => n === 0 || n);
}
function sortedNoteNames(notes) {
  const valid = notes.map((n) => note(n)).filter((n) => !n.empty);
  return valid.sort((a, b) => a.height - b.height).map((n) => n.name);
}
function sortedUniqNoteNames(arr) {
  return sortedNoteNames(arr).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}
function shuffle(arr, rnd = Math.random) {
  let i;
  let t;
  let m = arr.length;
  while (m) {
    i = Math.floor(rnd() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}
function permutations(arr) {
  if (arr.length === 0) {
    return [[]];
  }
  return permutations(arr.slice(1)).reduce((acc, perm) => {
    return acc.concat(
      arr.map((e, pos) => {
        const newPerm = perm.slice();
        newPerm.splice(pos, 0, arr[0]);
        return newPerm;
      })
    );
  }, []);
}

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/collection/dist/index.mjs
// index.ts
function dist_ascR(b, n) {
  const a = [];
  for (; n--; a[n] = n + b) ;
  return a;
}
function dist_descR(b, n) {
  const a = [];
  for (; n--; a[n] = b - n) ;
  return a;
}
function dist_range(from, to) {
  return from < to ? dist_ascR(from, to - from + 1) : dist_descR(from, from - to + 1);
}
function dist_rotate(times, arr) {
  const len = arr.length;
  const n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
}
function dist_compact(arr) {
  return arr.filter((n) => n === 0 || n);
}
function dist_shuffle(arr, rnd = Math.random) {
  let i;
  let t;
  let m = arr.length;
  while (m) {
    i = Math.floor(rnd() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}
function dist_permutations(arr) {
  if (arr.length === 0) {
    return [[]];
  }
  return dist_permutations(arr.slice(1)).reduce((acc, perm) => {
    return acc.concat(
      arr.map((e, pos) => {
        const newPerm = perm.slice();
        newPerm.splice(pos, 0, arr[0]);
        return newPerm;
      })
    );
  }, []);
}
var collection_default = {
  compact: dist_compact,
  permutations: dist_permutations,
  range: dist_range,
  rotate: dist_rotate,
  shuffle: dist_shuffle
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/pcset/dist/index.mjs
// index.ts




var EmptyPcset = {
  empty: true,
  name: "",
  setNum: 0,
  chroma: "000000000000",
  normalized: "000000000000",
  intervals: []
};
var setNumToChroma = (num2) => Number(num2).toString(2).padStart(12, "0");
var chromaToNumber = (chroma2) => parseInt(chroma2, 2);
var pcset_dist_REGEX = /^[01]{12}$/;
function isChroma(set) {
  return pcset_dist_REGEX.test(set);
}
var isPcsetNum = (set) => typeof set === "number" && set >= 0 && set <= 4095;
var isPcset = (set) => set && isChroma(set.chroma);
var pcset_dist_cache = { [EmptyPcset.chroma]: EmptyPcset };
function get(src) {
  const chroma2 = isChroma(src) ? src : isPcsetNum(src) ? setNumToChroma(src) : Array.isArray(src) ? listToChroma(src) : isPcset(src) ? src.chroma : EmptyPcset.chroma;
  return pcset_dist_cache[chroma2] = pcset_dist_cache[chroma2] || chromaToPcset(chroma2);
}
var pcset = get;
var dist_chroma = (set) => get(set).chroma;
var intervals = (set) => get(set).intervals;
var num = (set) => get(set).setNum;
var IVLS = [
  "1P",
  "2m",
  "2M",
  "3m",
  "3M",
  "4P",
  "5d",
  "5P",
  "6m",
  "6M",
  "7m",
  "7M"
];
function chromaToIntervals(chroma2) {
  const intervals2 = [];
  for (let i = 0; i < 12; i++) {
    if (chroma2.charAt(i) === "1") intervals2.push(IVLS[i]);
  }
  return intervals2;
}
function notes(set) {
  return get(set).intervals.map((ivl) => transpose("C", ivl));
}
function chromas() {
  return dist_range(2048, 4095).map(setNumToChroma);
}
function modes(set, normalize = true) {
  const pcs = get(set);
  const binary = pcs.chroma.split("");
  return dist_compact(
    binary.map((_, i) => {
      const r = dist_rotate(i, binary);
      return normalize && r[0] === "0" ? null : r.join("");
    })
  );
}
function isEqual(s1, s2) {
  return get(s1).setNum === get(s2).setNum;
}
function isSubsetOf(set) {
  const s = get(set).setNum;
  return (notes2) => {
    const o = get(notes2).setNum;
    return s && s !== o && (o & s) === o;
  };
}
function isSupersetOf(set) {
  const s = get(set).setNum;
  return (notes2) => {
    const o = get(notes2).setNum;
    return s && s !== o && (o | s) === o;
  };
}
function isNoteIncludedIn(set) {
  const s = get(set);
  return (noteName) => {
    const n = dist_note(noteName);
    return s && !n.empty && s.chroma.charAt(n.chroma) === "1";
  };
}
var includes = (/* unused pure expression or super */ null && (isNoteIncludedIn));
function filter(set) {
  const isIncluded = isNoteIncludedIn(set);
  return (notes2) => {
    return notes2.filter(isIncluded);
  };
}
var pcset_default = {
  get,
  chroma: dist_chroma,
  num,
  intervals,
  chromas,
  isSupersetOf,
  isSubsetOf,
  isNoteIncludedIn,
  isEqual,
  filter,
  modes,
  notes,
  // deprecated
  pcset
};
function chromaRotations(chroma2) {
  const binary = chroma2.split("");
  return binary.map((_, i) => dist_rotate(i, binary).join(""));
}
function chromaToPcset(chroma2) {
  const setNum = chromaToNumber(chroma2);
  const normalizedNum = chromaRotations(chroma2).map(chromaToNumber).filter((n) => n >= 2048).sort()[0];
  const normalized = setNumToChroma(normalizedNum);
  const intervals2 = chromaToIntervals(chroma2);
  return {
    empty: false,
    name: "",
    setNum,
    chroma: chroma2,
    normalized,
    intervals: intervals2
  };
}
function listToChroma(set) {
  if (set.length === 0) {
    return EmptyPcset.chroma;
  }
  let pitch;
  const binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < set.length; i++) {
    pitch = dist_note(set[i]);
    if (pitch.empty) pitch = interval(set[i]);
    if (!pitch.empty) binary[pitch.chroma] = 1;
  }
  return binary.join("");
}

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/chord-type/dist/index.mjs
// index.ts


// data.ts
var CHORDS = [
  // ==Major==
  ["1P 3M 5P", "major", "M ^  maj"],
  ["1P 3M 5P 7M", "major seventh", "maj7 \u0394 ma7 M7 Maj7 ^7"],
  ["1P 3M 5P 7M 9M", "major ninth", "maj9 \u03949 ^9"],
  ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
  ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
  ["1P 3M 5P 6M 9M", "sixth added ninth", "6add9 6/9 69 M69"],
  ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
  [
    "1P 3M 5P 7M 11A",
    "major seventh sharp eleventh",
    "maj#4 \u0394#4 \u0394#11 M7#11 ^7#11 maj7#11"
  ],
  // ==Minor==
  // '''Normal'''
  ["1P 3m 5P", "minor", "m min -"],
  ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
  [
    "1P 3m 5P 7M",
    "minor/major seventh",
    "m/ma7 m/maj7 mM7 mMaj7 m/M7 -\u03947 m\u0394 -^7 -maj7"
  ],
  ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
  ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
  ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
  ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
  ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
  // '''Diminished'''
  ["1P 3m 5d", "diminished", "dim \xB0 o"],
  ["1P 3m 5d 7d", "diminished seventh", "dim7 \xB07 o7"],
  ["1P 3m 5d 7m", "half-diminished", "m7b5 \xF8 -7b5 h7 h"],
  // ==Dominant/Seventh==
  // '''Normal'''
  ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
  ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
  ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
  ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
  // '''Altered'''
  ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
  ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
  ["1P 3M 7m 9m", "altered", "alt7"],
  // '''Suspended'''
  ["1P 4P 5P", "suspended fourth", "sus4 sus"],
  ["1P 2M 5P", "suspended second", "sus2"],
  ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
  ["1P 5P 7m 9M 11P", "eleventh", "11"],
  [
    "1P 4P 5P 7m 9m",
    "suspended fourth flat ninth",
    "b9sus phryg 7b9sus 7b9sus4"
  ],
  // ==Other==
  ["1P 5P", "fifth", "5"],
  ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
  ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
  ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
  [
    "1P 3M 5P 7M 9M 11A",
    "major sharp eleventh (lydian)",
    "maj9#11 \u03949#11 ^9#11"
  ],
  // ==Legacy==
  ["1P 2M 4P 5P", "", "sus24 sus4add9"],
  ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
  ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
  ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
  ["1P 3M 5A 7m 9M", "", "9#5 9+"],
  ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
  ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
  ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
  ["1P 3M 5A 9A", "", "+add#9"],
  ["1P 3M 5A 9M", "", "M#5add9 +add9"],
  ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
  ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
  ["1P 3M 5P 6M 9M 11A", "", "69#11"],
  ["1P 3m 5P 6M 9M", "", "m69 -69"],
  ["1P 3M 5P 6m 7m", "", "7b6"],
  ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
  ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
  ["1P 3M 5P 7M 9m", "", "M7b9"],
  ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
  ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
  ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
  ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
  ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
  ["1P 3M 5P 7m 9A 13M", "", "13#9"],
  ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
  ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
  ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
  ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
  ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
  ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
  ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
  ["1P 3M 5P 7m 9m 13M", "", "13b9"],
  ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
  ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
  ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
  ["1P 3M 5P 9m", "", "Maddb9"],
  ["1P 3M 5d", "", "Mb5"],
  ["1P 3M 5d 6M 7m 9M", "", "13b5"],
  ["1P 3M 5d 7M", "", "M7b5"],
  ["1P 3M 5d 7M 9M", "", "M9b5"],
  ["1P 3M 5d 7m", "", "7b5"],
  ["1P 3M 5d 7m 9M", "", "9b5"],
  ["1P 3M 7m", "", "7no5"],
  ["1P 3M 7m 13m", "", "7b13"],
  ["1P 3M 7m 9M", "", "9no5"],
  ["1P 3M 7m 9M 13M", "", "13no5"],
  ["1P 3M 7m 9M 13m", "", "9b13"],
  ["1P 3m 4P 5P", "", "madd4"],
  ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
  ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
  ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
  ["1P 3m 5P 9M", "", "madd9"],
  ["1P 3m 5d 6M 7M", "", "o7M7"],
  ["1P 3m 5d 7M", "", "oM7"],
  ["1P 3m 6m 7M", "", "mb6M7"],
  ["1P 3m 6m 7m", "", "m7#5"],
  ["1P 3m 6m 7m 9M", "", "m9#5"],
  ["1P 3m 5A 7m 9M 11P", "", "m11A"],
  ["1P 3m 6m 9m", "", "mb6b9"],
  ["1P 2M 3m 5d 7m", "", "m9b5"],
  ["1P 4P 5A 7M", "", "M7#5sus4"],
  ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
  ["1P 4P 5A 7m", "", "7#5sus4"],
  ["1P 4P 5P 7M", "", "M7sus4"],
  ["1P 4P 5P 7M 9M", "", "M9sus4"],
  ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
  ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
  ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
  ["1P 4P 7m 10m", "", "4 quartal"],
  ["1P 5P 7m 9m 11P", "", "11b9"]
];
var data_default = CHORDS;

// index.ts
var NoChordType = {
  ...EmptyPcset,
  name: "",
  quality: "Unknown",
  intervals: [],
  aliases: []
};
var dictionary = [];
var index = {};
function dist_get(type) {
  return index[type] || NoChordType;
}
var chordType = dist_get;
function names() {
  return dictionary.map((chord) => chord.name).filter((x) => x);
}
function symbols() {
  return dictionary.map((chord) => chord.aliases[0]).filter((x) => x);
}
function keys() {
  return Object.keys(index);
}
function dist_all() {
  return dictionary.slice();
}
var entries = dist_all;
function removeAll() {
  dictionary = [];
  index = {};
}
function add(intervals, aliases, fullName) {
  const quality = getQuality(intervals);
  const chord = {
    ...get(intervals),
    name: fullName || "",
    quality,
    intervals,
    aliases
  };
  dictionary.push(chord);
  if (chord.name) {
    index[chord.name] = chord;
  }
  index[chord.setNum] = chord;
  index[chord.chroma] = chord;
  chord.aliases.forEach((alias) => addAlias(chord, alias));
}
function addAlias(chord, alias) {
  index[alias] = chord;
}
function getQuality(intervals) {
  const has = (interval) => intervals.indexOf(interval) !== -1;
  return has("5A") ? "Augmented" : has("3M") ? "Major" : has("5d") ? "Diminished" : has("3m") ? "Minor" : "Unknown";
}
data_default.forEach(
  ([ivls, fullName, names2]) => add(ivls.split(" "), names2.split(" "), fullName)
);
dictionary.sort((a, b) => a.setNum - b.setNum);
var chord_type_default = {
  names,
  symbols,
  get: dist_get,
  all: dist_all,
  add,
  removeAll,
  keys,
  // deprecated
  entries,
  chordType
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/chord-detect/dist/index.mjs
// index.ts



var namedSet = (notes) => {
  const pcToName = notes.reduce((record, n) => {
    const chroma = dist_note(n).chroma;
    if (chroma !== void 0) {
      record[chroma] = record[chroma] || dist_note(n).name;
    }
    return record;
  }, {});
  return (chroma) => pcToName[chroma];
};
function detect(source, options = {}) {
  const notes = source.map((n) => dist_note(n).pc).filter((x) => x);
  if (dist_note.length === 0) {
    return [];
  }
  const found = findMatches(notes, 1, options);
  return found.filter((chord) => chord.weight).sort((a, b) => b.weight - a.weight).map((chord) => chord.name);
}
var BITMASK = {
  // 3m 000100000000
  // 3M 000010000000
  anyThirds: 384,
  // 5P 000000010000
  perfectFifth: 16,
  // 5d 000000100000
  // 5A 000000001000
  nonPerfectFifths: 40,
  anySeventh: 3
};
var testChromaNumber = (bitmask) => (chromaNumber) => Boolean(chromaNumber & bitmask);
var hasAnyThird = testChromaNumber(BITMASK.anyThirds);
var hasPerfectFifth = testChromaNumber(BITMASK.perfectFifth);
var hasAnySeventh = testChromaNumber(BITMASK.anySeventh);
var hasNonPerfectFifth = testChromaNumber(BITMASK.nonPerfectFifths);
function hasAnyThirdAndPerfectFifthAndAnySeventh(chordType) {
  const chromaNumber = parseInt(chordType.chroma, 2);
  return hasAnyThird(chromaNumber) && hasPerfectFifth(chromaNumber) && hasAnySeventh(chromaNumber);
}
function withPerfectFifth(chroma) {
  const chromaNumber = parseInt(chroma, 2);
  return hasNonPerfectFifth(chromaNumber) ? chroma : (chromaNumber | 16).toString(2);
}
function findMatches(notes, weight, options) {
  const tonic = notes[0];
  const tonicChroma = dist_note(tonic).chroma;
  const noteName = namedSet(notes);
  const allModes = modes(notes, false);
  const found = [];
  allModes.forEach((mode, index) => {
    const modeWithPerfectFifth = options.assumePerfectFifth && withPerfectFifth(mode);
    const chordTypes = dist_all().filter((chordType) => {
      if (options.assumePerfectFifth && hasAnyThirdAndPerfectFifthAndAnySeventh(chordType)) {
        return chordType.chroma === modeWithPerfectFifth;
      }
      return chordType.chroma === mode;
    });
    chordTypes.forEach((chordType) => {
      const chordName = chordType.aliases[0];
      const baseNote = noteName(index);
      const isInversion = index !== tonicChroma;
      if (isInversion) {
        found.push({
          weight: 0.5 * weight,
          name: `${baseNote}${chordName}/${tonic}`
        });
      } else {
        found.push({ weight: 1 * weight, name: `${baseNote}${chordName}` });
      }
    });
  });
  return found;
}
var chord_detect_default = { detect };

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/interval/dist/index.mjs
// index.ts


function dist_names() {
  return "1P 2M 3M 4P 5P 6m 7m".split(" ");
}
var interval_dist_get = interval;
var dist_name = (name2) => interval(name2).name;
var semitones = (name2) => interval(name2).semitones;
var quality = (name2) => interval(name2).q;
var dist_num = (name2) => interval(name2).num;
function simplify(name2) {
  const i = interval(name2);
  return i.empty ? "" : i.simple + i.q;
}
function invert(name2) {
  const i = interval(name2);
  if (i.empty) {
    return "";
  }
  const step = (7 - i.step) % 7;
  const alt = i.type === "perfectable" ? -i.alt : -(i.alt + 1);
  return interval({ step, alt, oct: i.oct, dir: i.dir }).name;
}
var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
var IQ = "P m M m M P d P m M m M".split(" ");
function fromSemitones(semitones2) {
  const d = semitones2 < 0 ? -1 : 1;
  const n = Math.abs(semitones2);
  const c = n % 12;
  const o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
}
var interval_dist_distance = distance;
var dist_add = combinator((a, b) => [a[0] + b[0], a[1] + b[1]]);
var addTo = (interval) => (other) => dist_add(interval, other);
var subtract = combinator((a, b) => [a[0] - b[0], a[1] - b[1]]);
function transposeFifths(interval, fifths) {
  const ivl = interval_dist_get(interval);
  if (ivl.empty) return "";
  const [nFifths, nOcts, dir] = ivl.coord;
  return coordToInterval([nFifths + fifths, nOcts, dir]).name;
}
var interval_default = {
  names: dist_names,
  get: interval_dist_get,
  name: dist_name,
  num: dist_num,
  semitones,
  quality,
  fromSemitones,
  distance: interval_dist_distance,
  invert,
  simplify,
  add: dist_add,
  addTo,
  subtract,
  transposeFifths
};
function combinator(fn) {
  return (a, b) => {
    const coordA = interval(a).coord;
    const coordB = interval(b).coord;
    if (coordA && coordB) {
      const coord = fn(coordA, coordB);
      return coordToInterval(coord).name;
    }
  };
}

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/scale-type/dist/index.mjs
// index.ts


// data.ts
var SCALES = [
  // Basic scales
  ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
  ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
  ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian"],
  // Jazz common scales
  ["1P 2M 3m 3M 5P 6M", "major blues"],
  ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
  ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
  ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
  ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
  ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
  // Modes
  ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
  ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
  ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
  ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
  ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
  // 5-note scales
  ["1P 3M 4P 5P 7M", "ionian pentatonic"],
  ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
  ["1P 2M 4P 5P 6M", "ritusen"],
  ["1P 2M 4P 5P 7m", "egyptian"],
  ["1P 3M 4P 5d 7m", "neopolitan major pentatonic"],
  ["1P 3m 4P 5P 6m", "vietnamese 1"],
  ["1P 2m 3m 5P 6m", "pelog"],
  ["1P 2m 4P 5P 6m", "kumoijoshi"],
  ["1P 2M 3m 5P 6m", "hirajoshi"],
  ["1P 2m 4P 5d 7m", "iwato"],
  ["1P 2m 4P 5P 7m", "in-sen"],
  ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
  ["1P 3m 4P 6m 7m", "malkos raga"],
  ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
  ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
  ["1P 3m 4P 5P 6M", "minor six pentatonic"],
  ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
  ["1P 2M 3M 5P 6m", "flat six pentatonic"],
  ["1P 2m 3M 5P 6M", "scriabin"],
  ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
  ["1P 3M 4A 5A 7M", "lydian #5P pentatonic"],
  ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
  ["1P 3m 4P 5P 7M", "minor #7M pentatonic"],
  ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
  // 6-note scales
  ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
  ["1P 2A 3M 5P 5A 7M", "augmented"],
  ["1P 2M 4P 5P 6M 7m", "piongio"],
  ["1P 2m 3M 4A 6M 7m", "prometheus neopolitan"],
  ["1P 2M 3M 4A 6M 7m", "prometheus"],
  ["1P 2m 3M 5d 6m 7m", "mystery #1"],
  ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
  ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"],
  ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
  // 7-note scales
  ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
  ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
  [
    "1P 2m 2A 3M 4A 6m 7m",
    "altered",
    "super locrian",
    "diminished whole tone",
    "pomeroy"
  ],
  ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
  [
    "1P 2M 3M 4P 5P 6m 7m",
    "mixolydian b6",
    "melodic minor fifth mode",
    "hindu"
  ],
  ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
  ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
  [
    "1P 2m 3m 4P 5P 6M 7m",
    "dorian b2",
    "phrygian #6",
    "melodic minor second mode"
  ],
  [
    "1P 2m 3m 4d 5d 6m 7d",
    "ultralocrian",
    "superlocrian bb7",
    "superlocrian diminished"
  ],
  ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
  ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
  // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
  [
    "1P 2M 3m 4A 5P 6M 7m",
    "dorian #4",
    "ukrainian dorian",
    "romanian minor",
    "altered dorian"
  ],
  ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
  ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
  ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
  ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
  ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
  ["1P 2m 3m 4P 5P 6M 7M", "neopolitan major"],
  ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
  ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
  ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
  ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
  ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
  ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
  ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
  ["1P 2m 3M 4P 5d 6m 7M", "persian"],
  ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
  [
    "1P 2M 3M 4P 5A 6M 7M",
    "major augmented",
    "major #5",
    "ionian augmented",
    "ionian #5"
  ],
  ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
  // 8-note scales
  ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
  ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
  ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
  ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
  ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
  ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
  ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
  ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
  ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
  [
    "1P 2m 3m 3M 4A 5P 6M 7m",
    "half-whole diminished",
    "dominant diminished",
    "messiaen's mode #2"
  ],
  ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
  ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
  // 9-note scales
  ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
  ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
  // 10-note scales
  ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
  // 12-note scales
  ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]
];
var dist_data_default = SCALES;

// index.ts
var NoScaleType = {
  ...EmptyPcset,
  intervals: [],
  aliases: []
};
var dist_dictionary = [];
var dist_index = {};
function scale_type_dist_names() {
  return dist_dictionary.map((scale) => scale.name);
}
function scale_type_dist_get(type) {
  return dist_index[type] || NoScaleType;
}
var scaleType = scale_type_dist_get;
function scale_type_dist_all() {
  return dist_dictionary.slice();
}
var dist_entries = scale_type_dist_all;
function dist_keys() {
  return Object.keys(dist_index);
}
function dist_removeAll() {
  dist_dictionary = [];
  dist_index = {};
}
function scale_type_dist_add(intervals, name, aliases = []) {
  const scale = { ...get(intervals), name, intervals, aliases };
  dist_dictionary.push(scale);
  dist_index[scale.name] = scale;
  dist_index[scale.setNum] = scale;
  dist_index[scale.chroma] = scale;
  scale.aliases.forEach((alias) => dist_addAlias(scale, alias));
  return scale;
}
function dist_addAlias(scale, alias) {
  dist_index[alias] = scale;
}
dist_data_default.forEach(
  ([ivls, name, ...aliases]) => scale_type_dist_add(ivls.split(" "), name, aliases)
);
var scale_type_default = {
  names: scale_type_dist_names,
  get: scale_type_dist_get,
  all: scale_type_dist_all,
  add: scale_type_dist_add,
  removeAll: dist_removeAll,
  keys: dist_keys,
  // deprecated
  entries: dist_entries,
  scaleType
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/chord/dist/index.mjs
// index.ts








var NoChord = {
  empty: true,
  name: "",
  symbol: "",
  root: "",
  bass: "",
  rootDegree: 0,
  type: "",
  tonic: null,
  setNum: NaN,
  quality: "Unknown",
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};
function dist_tokenize(name) {
  const [letter, acc, oct, type] = tokenizeNote(name);
  if (letter === "") {
    return tokenizeBass("", name);
  } else if (letter === "A" && type === "ug") {
    return tokenizeBass("", "aug");
  } else {
    return tokenizeBass(letter + acc, oct + type);
  }
}
function tokenizeBass(note2, chord2) {
  const split = chord2.split("/");
  if (split.length === 1) {
    return [note2, split[0], ""];
  }
  const [letter, acc, oct, type] = tokenizeNote(split[1]);
  if (letter !== "" && oct === "" && type === "") {
    return [note2, split[0], letter + acc];
  } else {
    return [note2, chord2, ""];
  }
}
function chord_dist_get(src) {
  if (Array.isArray(src)) {
    return getChord(src[1] || "", src[0], src[2]);
  } else if (src === "") {
    return NoChord;
  } else {
    const [tonic, type, bass] = dist_tokenize(src);
    const chord2 = getChord(type, tonic, bass);
    return chord2.empty ? getChord(src) : chord2;
  }
}
function getChord(typeName, optionalTonic, optionalBass) {
  const type = dist_get(typeName);
  const tonic = dist_note(optionalTonic || "");
  const bass = dist_note(optionalBass || "");
  if (type.empty || optionalTonic && tonic.empty || optionalBass && bass.empty) {
    return NoChord;
  }
  const bassInterval = distance(tonic.pc, bass.pc);
  const bassIndex = type.intervals.indexOf(bassInterval);
  const hasRoot = bassIndex >= 0;
  const root = hasRoot ? bass : dist_note("");
  const rootDegree = bassIndex === -1 ? NaN : bassIndex + 1;
  const hasBass = bass.pc && bass.pc !== tonic.pc;
  const intervals = Array.from(type.intervals);
  if (hasRoot) {
    for (let i = 1; i < rootDegree; i++) {
      const num = intervals[0][0];
      const quality = intervals[0][1];
      const newNum = parseInt(num, 10) + 7;
      intervals.push(`${newNum}${quality}`);
      intervals.shift();
    }
  } else if (hasBass) {
    const ivl = subtract(distance(tonic.pc, bass.pc), "8P");
    if (ivl) intervals.unshift(ivl);
  }
  const notes2 = tonic.empty ? [] : intervals.map((i) => transpose(tonic.pc, i));
  typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
  const symbol = `${tonic.empty ? "" : tonic.pc}${typeName}${hasRoot && rootDegree > 1 ? "/" + root.pc : hasBass ? "/" + bass.pc : ""}`;
  const name = `${optionalTonic ? tonic.pc + " " : ""}${type.name}${hasRoot && rootDegree > 1 ? " over " + root.pc : hasBass ? " over " + bass.pc : ""}`;
  return {
    ...type,
    name,
    symbol,
    tonic: tonic.pc,
    type: type.name,
    root: root.pc,
    bass: hasBass ? bass.pc : "",
    intervals,
    rootDegree,
    notes: notes2
  };
}
var chord = chord_dist_get;
function chord_dist_transpose(chordName, interval) {
  const [tonic, type, bass] = dist_tokenize(chordName);
  if (!tonic) {
    return chordName;
  }
  const tr = transpose(bass, interval);
  const slash = tr ? "/" + tr : "";
  return transpose(tonic, interval) + type + slash;
}
function chordScales(name) {
  const s = chord_dist_get(name);
  const isChordIncluded = isSupersetOf(s.chroma);
  return scale_type_dist_all().filter((scale) => isChordIncluded(scale.chroma)).map((scale) => scale.name);
}
function extended(chordName) {
  const s = chord_dist_get(chordName);
  const isSuperset = isSupersetOf(s.chroma);
  return dist_all().filter((chord2) => isSuperset(chord2.chroma)).map((chord2) => s.tonic + chord2.aliases[0]);
}
function reduced(chordName) {
  const s = chord_dist_get(chordName);
  const isSubset = isSubsetOf(s.chroma);
  return dist_all().filter((chord2) => isSubset(chord2.chroma)).map((chord2) => s.tonic + chord2.aliases[0]);
}
function dist_notes(chordName, tonic) {
  const chord2 = chord_dist_get(chordName);
  const note2 = tonic || chord2.tonic;
  if (!note2 || chord2.empty) return [];
  return chord2.intervals.map((ivl) => transpose(note2, ivl));
}
function degrees(chordName, tonic) {
  const chord2 = chord_dist_get(chordName);
  const note2 = tonic || chord2.tonic;
  const transpose2 = tonicIntervalsTransposer(chord2.intervals, note2);
  return (degree) => degree ? transpose2(degree > 0 ? degree - 1 : degree) : "";
}
function steps(chordName, tonic) {
  const chord2 = chord_dist_get(chordName);
  const note2 = tonic || chord2.tonic;
  return tonicIntervalsTransposer(chord2.intervals, note2);
}
var chord_default = {
  getChord,
  get: chord_dist_get,
  detect: detect,
  chordScales,
  extended,
  reduced,
  tokenize: dist_tokenize,
  transpose: chord_dist_transpose,
  degrees,
  steps,
  notes: dist_notes,
  chord
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/duration-value/dist/index.mjs
// data.ts
var DATA = [
  [
    0.125,
    "dl",
    ["large", "duplex longa", "maxima", "octuple", "octuple whole"]
  ],
  [0.25, "l", ["long", "longa"]],
  [0.5, "d", ["double whole", "double", "breve"]],
  [1, "w", ["whole", "semibreve"]],
  [2, "h", ["half", "minim"]],
  [4, "q", ["quarter", "crotchet"]],
  [8, "e", ["eighth", "quaver"]],
  [16, "s", ["sixteenth", "semiquaver"]],
  [32, "t", ["thirty-second", "demisemiquaver"]],
  [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]],
  [128, "h", ["hundred twenty-eighth"]],
  [256, "th", ["two hundred fifty-sixth"]]
];
var duration_value_dist_data_default = DATA;

// index.ts
var VALUES = [];
duration_value_dist_data_default.forEach(
  ([denominator, shorthand, names2]) => duration_value_dist_add(denominator, shorthand, names2)
);
var NoDuration = {
  empty: true,
  name: "",
  value: 0,
  fraction: [0, 0],
  shorthand: "",
  dots: "",
  names: []
};
function duration_value_dist_names() {
  return VALUES.reduce((names2, duration) => {
    duration.names.forEach((name) => names2.push(name));
    return names2;
  }, []);
}
function shorthands() {
  return VALUES.map((dur) => dur.shorthand);
}
var duration_value_dist_REGEX = /^([^.]+)(\.*)$/;
function duration_value_dist_get(name) {
  const [_, simple, dots] = duration_value_dist_REGEX.exec(name) || [];
  const base = VALUES.find(
    (dur) => dur.shorthand === simple || dur.names.includes(simple)
  );
  if (!base) {
    return NoDuration;
  }
  const fraction2 = calcDots(base.fraction, dots.length);
  const value2 = fraction2[0] / fraction2[1];
  return { ...base, name, dots, value: value2, fraction: fraction2 };
}
var value = (name) => duration_value_dist_get(name).value;
var fraction = (name) => duration_value_dist_get(name).fraction;
var duration_value_default = { names: duration_value_dist_names, shorthands, get: duration_value_dist_get, value, fraction };
function duration_value_dist_add(denominator, shorthand, names2) {
  VALUES.push({
    empty: false,
    dots: "",
    name: "",
    value: 1 / denominator,
    fraction: denominator < 1 ? [1 / denominator, 1] : [1, denominator],
    shorthand,
    names: names2
  });
}
function calcDots(fraction2, dots) {
  const pow = Math.pow(2, dots);
  let numerator = fraction2[0] * pow;
  let denominator = fraction2[1] * pow;
  const base = numerator;
  for (let i = 0; i < dots; i++) {
    numerator += base / Math.pow(2, i + 1);
  }
  while (numerator % 2 === 0 && denominator % 2 === 0) {
    numerator /= 2;
    denominator /= 2;
  }
  return [numerator, denominator];
}

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/midi/dist/index.mjs
// index.ts

function isMidi(arg) {
  return +arg >= 0 && +arg <= 127;
}
function toMidi(note) {
  if (isMidi(note)) {
    return +note;
  }
  const n = dist_note(note);
  return n.empty ? null : n.midi;
}
function midiToFreq(midi, tuning = 440) {
  return Math.pow(2, (midi - 69) / 12) * tuning;
}
var L2 = Math.log(2);
var L440 = Math.log(440);
function freqToMidi(freq) {
  const v = 12 * (Math.log(freq) - L440) / L2 + 69;
  return Math.round(v * 100) / 100;
}
var SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
var FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
function midiToNoteName(midi, options = {}) {
  if (isNaN(midi) || midi === -Infinity || midi === Infinity) return "";
  midi = Math.round(midi);
  const pcs = options.sharps === true ? SHARPS : FLATS;
  const pc = pcs[midi % 12];
  if (options.pitchClass) {
    return pc;
  }
  const o = Math.floor(midi / 12) - 1;
  return pc + o;
}
function midi_dist_chroma(midi) {
  return midi % 12;
}
function pcsetFromChroma(chroma2) {
  return chroma2.split("").reduce((pcset2, val, index) => {
    if (index < 12 && val === "1") pcset2.push(index);
    return pcset2;
  }, []);
}
function pcsetFromMidi(midi) {
  return midi.map(midi_dist_chroma).sort((a, b) => a - b).filter((n, i, a) => i === 0 || n !== a[i - 1]);
}
function dist_pcset(notes) {
  return Array.isArray(notes) ? pcsetFromMidi(notes) : pcsetFromChroma(notes);
}
function pcsetNearest(notes) {
  const set = dist_pcset(notes);
  return (midi) => {
    const ch = midi_dist_chroma(midi);
    for (let i = 0; i < 12; i++) {
      if (set.includes(ch + i)) return midi + i;
      if (set.includes(ch - i)) return midi - i;
    }
    return void 0;
  };
}
function pcsetSteps(notes, tonic) {
  const set = dist_pcset(notes);
  const len = set.length;
  return (step) => {
    const index = step < 0 ? (len - -step % len) % len : step % len;
    const octaves = Math.floor(step / len);
    return set[index] + octaves * 12 + tonic;
  };
}
function pcsetDegrees(notes, tonic) {
  const steps = pcsetSteps(notes, tonic);
  return (degree) => {
    if (degree === 0) return void 0;
    return steps(degree > 0 ? degree - 1 : degree);
  };
}
var index_default = {
  chroma: midi_dist_chroma,
  freqToMidi,
  isMidi,
  midiToFreq,
  midiToNoteName,
  pcsetNearest,
  pcset: dist_pcset,
  pcsetDegrees,
  pcsetSteps,
  toMidi
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/note/dist/index.mjs
// index.ts



var NAMES = ["C", "D", "E", "F", "G", "A", "B"];
var toName = (n) => n.name;
var onlyNotes = (array) => array.map(dist_note).filter((n) => !n.empty);
function note_dist_names(array) {
  if (array === void 0) {
    return NAMES.slice();
  } else if (!Array.isArray(array)) {
    return [];
  } else {
    return onlyNotes(array).map(toName);
  }
}
var note_dist_get = dist_note;
var note_dist_name = (note) => note_dist_get(note).name;
var pitchClass = (note) => note_dist_get(note).pc;
var accidentals = (note) => note_dist_get(note).acc;
var octave = (note) => note_dist_get(note).oct;
var dist_midi = (note) => note_dist_get(note).midi;
var freq = (note) => note_dist_get(note).freq;
var note_dist_chroma = (note) => note_dist_get(note).chroma;
function fromMidi(midi2) {
  return midiToNoteName(midi2);
}
function fromFreq(freq2) {
  return midiToNoteName(freqToMidi(freq2));
}
function fromFreqSharps(freq2) {
  return midiToNoteName(freqToMidi(freq2), { sharps: true });
}
function fromMidiSharps(midi2) {
  return midiToNoteName(midi2, { sharps: true });
}
var note_dist_distance = distance;
var note_dist_transpose = transpose;
var tr = transpose;
var transposeBy = (interval) => (note) => note_dist_transpose(note, interval);
var trBy = transposeBy;
var transposeFrom = (note) => (interval) => note_dist_transpose(note, interval);
var trFrom = transposeFrom;
function dist_transposeFifths(noteName, fifths) {
  return note_dist_transpose(noteName, [fifths, 0]);
}
var trFifths = dist_transposeFifths;
function transposeOctaves(noteName, octaves) {
  return note_dist_transpose(noteName, [0, octaves]);
}
var ascending = (a, b) => a.height - b.height;
var descending = (a, b) => b.height - a.height;
function sortedNames(notes, comparator) {
  comparator = comparator || ascending;
  return onlyNotes(notes).sort(comparator).map(toName);
}
function sortedUniqNames(notes) {
  return sortedNames(notes, ascending).filter(
    (n, i, a) => i === 0 || n !== a[i - 1]
  );
}
var dist_simplify = (noteName) => {
  const note = note_dist_get(noteName);
  if (note.empty) {
    return "";
  }
  return midiToNoteName(note.midi || note.chroma, {
    sharps: note.alt > 0,
    pitchClass: note.midi === null
  });
};
function enharmonic(noteName, destName) {
  const src = note_dist_get(noteName);
  if (src.empty) {
    return "";
  }
  const dest = note_dist_get(
    destName || midiToNoteName(src.midi || src.chroma, {
      sharps: src.alt < 0,
      pitchClass: true
    })
  );
  if (dest.empty || dest.chroma !== src.chroma) {
    return "";
  }
  if (src.oct === void 0) {
    return dest.pc;
  }
  const srcChroma = src.chroma - src.alt;
  const destChroma = dest.chroma - dest.alt;
  const destOctOffset = srcChroma > 11 || destChroma < 0 ? -1 : srcChroma < 0 || destChroma > 11 ? 1 : 0;
  const destOct = src.oct + destOctOffset;
  return dest.pc + destOct;
}
var dist_index_default = {
  names: note_dist_names,
  get: note_dist_get,
  name: note_dist_name,
  pitchClass,
  accidentals,
  octave,
  midi: dist_midi,
  ascending,
  descending,
  distance: note_dist_distance,
  sortedNames,
  sortedUniqNames,
  fromMidi,
  fromMidiSharps,
  freq,
  fromFreq,
  fromFreqSharps,
  chroma: note_dist_chroma,
  transpose: note_dist_transpose,
  tr,
  transposeBy,
  trBy,
  transposeFrom,
  trFrom,
  transposeFifths: dist_transposeFifths,
  transposeOctaves,
  trFifths,
  simplify: dist_simplify,
  enharmonic
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/roman-numeral/dist/index.mjs
// index.ts



var NoRomanNumeral = { empty: true, name: "", chordType: "" };
var roman_numeral_dist_cache = {};
function roman_numeral_dist_get(src) {
  return typeof src === "string" ? roman_numeral_dist_cache[src] || (roman_numeral_dist_cache[src] = roman_numeral_dist_parse(src)) : typeof src === "number" ? roman_numeral_dist_get(dist_NAMES[src] || "") : isPitch(src) ? fromPitch(src) : isNamedPitch(src) ? roman_numeral_dist_get(src.name) : NoRomanNumeral;
}
var romanNumeral = roman_numeral_dist_get;
function roman_numeral_dist_names(major = true) {
  return (major ? dist_NAMES : NAMES_MINOR).slice();
}
function fromPitch(pitch) {
  return roman_numeral_dist_get(altToAcc(pitch.alt) + dist_NAMES[pitch.step]);
}
var roman_numeral_dist_REGEX = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
function roman_numeral_dist_tokenize(str) {
  return roman_numeral_dist_REGEX.exec(str) || ["", "", "", ""];
}
var ROMANS = "I II III IV V VI VII";
var dist_NAMES = ROMANS.split(" ");
var NAMES_MINOR = ROMANS.toLowerCase().split(" ");
function roman_numeral_dist_parse(src) {
  const [name, acc, roman, chordType] = roman_numeral_dist_tokenize(src);
  if (!roman) {
    return NoRomanNumeral;
  }
  const upperRoman = roman.toUpperCase();
  const step = dist_NAMES.indexOf(upperRoman);
  const alt = accToAlt(acc);
  const dir = 1;
  return {
    empty: false,
    name,
    roman,
    interval: interval({ step, alt, dir }).name,
    acc,
    chordType,
    alt,
    step,
    major: roman === upperRoman,
    oct: 0,
    dir
  };
}
var roman_numeral_default = {
  names: roman_numeral_dist_names,
  get: roman_numeral_dist_get,
  // deprecated
  romanNumeral
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/key/dist/index.mjs
// index.ts



var Empty = Object.freeze([]);
var NoKey = {
  type: "major",
  tonic: "",
  alteration: 0,
  keySignature: ""
};
var NoKeyScale = {
  tonic: "",
  grades: Empty,
  intervals: Empty,
  scale: Empty,
  triads: Empty,
  chords: Empty,
  chordsHarmonicFunction: Empty,
  chordScales: Empty,
  secondaryDominants: Empty,
  secondaryDominantSupertonics: Empty,
  substituteDominantsMinorRelative: Empty,
  substituteDominants: Empty,
  substituteDominantSupertonics: Empty,
  secondaryDominantsMinorRelative: Empty
};
var NoMajorKey = {
  ...NoKey,
  ...NoKeyScale,
  type: "major",
  minorRelative: "",
  scale: Empty,
  substituteDominants: Empty,
  secondaryDominantSupertonics: Empty,
  substituteDominantsMinorRelative: Empty
};
var NoMinorKey = {
  ...NoKey,
  type: "minor",
  relativeMajor: "",
  natural: NoKeyScale,
  harmonic: NoKeyScale,
  melodic: NoKeyScale
};
var mapScaleToType = (scale, list, sep = "") => list.map((type, i) => `${scale[i]}${sep}${type}`);
function keyScale(grades, triads, chordTypes, harmonicFunctions, chordScales) {
  return (tonic) => {
    const intervals = grades.map((gr) => roman_numeral_dist_get(gr).interval || "");
    const scale = intervals.map((interval) => note_dist_transpose(tonic, interval));
    const chords = mapScaleToType(scale, chordTypes);
    const secondaryDominants = scale.map((note2) => note_dist_transpose(note2, "5P")).map(
      (note2) => (
        // A secondary dominant is a V chord which:
        // 1. is not diatonic to the key,
        // 2. it must have a diatonic root.
        scale.includes(note2) && !chords.includes(note2 + "7") ? note2 + "7" : ""
      )
    );
    const secondaryDominantSupertonics = supertonics(
      secondaryDominants,
      triads
    );
    const substituteDominants = secondaryDominants.map((chord) => {
      if (!chord) return "";
      const domRoot = chord.slice(0, -1);
      const subRoot = note_dist_transpose(domRoot, "5d");
      return subRoot + "7";
    });
    const substituteDominantSupertonics = supertonics(
      substituteDominants,
      triads
    );
    return {
      tonic,
      grades,
      intervals,
      scale,
      triads: mapScaleToType(scale, triads),
      chords,
      chordsHarmonicFunction: harmonicFunctions.slice(),
      chordScales: mapScaleToType(scale, chordScales, " "),
      secondaryDominants,
      secondaryDominantSupertonics,
      substituteDominants,
      substituteDominantSupertonics,
      // @deprecated use secondaryDominantsSupertonic
      secondaryDominantsMinorRelative: secondaryDominantSupertonics,
      // @deprecated use secondaryDominantsSupertonic
      substituteDominantsMinorRelative: substituteDominantSupertonics
    };
  };
}
var supertonics = (dominants, targetTriads) => {
  return dominants.map((chord, index) => {
    if (!chord) return "";
    const domRoot = chord.slice(0, -1);
    const minorRoot = note_dist_transpose(domRoot, "5P");
    const target = targetTriads[index];
    const isMinor = target.endsWith("m");
    return isMinor ? minorRoot + "m7" : minorRoot + "m7b5";
  });
};
var distInFifths = (from, to) => {
  const f = dist_note(from);
  const t = dist_note(to);
  return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
};
var MajorScale = keyScale(
  "I II III IV V VI VII".split(" "),
  " m m   m dim".split(" "),
  "maj7 m7 m7 maj7 7 m7 m7b5".split(" "),
  "T SD T SD D T D".split(" "),
  "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(",")
);
var NaturalScale = keyScale(
  "I II bIII IV V bVI bVII".split(" "),
  "m dim  m m  ".split(" "),
  "m7 m7b5 maj7 m7 m7 maj7 7".split(" "),
  "T SD T SD D SD SD".split(" "),
  "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(",")
);
var HarmonicScale = keyScale(
  "I II bIII IV V bVI VII".split(" "),
  "m dim aug m   dim".split(" "),
  "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "),
  "T SD T SD D SD D".split(" "),
  "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(
    ","
  )
);
var MelodicScale = keyScale(
  "I II bIII IV V VI VII".split(" "),
  "m m aug   dim dim".split(" "),
  "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "),
  "T SD T SD D  ".split(" "),
  "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(
    ","
  )
);
function majorKey(tonic) {
  const pc = dist_note(tonic).pc;
  if (!pc) return NoMajorKey;
  const keyScale2 = MajorScale(pc);
  const alteration = distInFifths("C", pc);
  return {
    ...keyScale2,
    type: "major",
    minorRelative: note_dist_transpose(pc, "-3m"),
    alteration,
    keySignature: altToAcc(alteration)
  };
}
function majorKeyChords(tonic) {
  const key = majorKey(tonic);
  const chords = [];
  keyChordsOf(key, chords);
  return chords;
}
function minorKeyChords(tonic) {
  const key = minorKey(tonic);
  const chords = [];
  keyChordsOf(key.natural, chords);
  keyChordsOf(key.harmonic, chords);
  keyChordsOf(key.melodic, chords);
  return chords;
}
function keyChordsOf(key, chords) {
  const updateChord = (name, newRole) => {
    if (!name) return;
    let keyChord = chords.find((chord) => chord.name === name);
    if (!keyChord) {
      keyChord = { name, roles: [] };
      chords.push(keyChord);
    }
    if (newRole && !keyChord.roles.includes(newRole)) {
      keyChord.roles.push(newRole);
    }
  };
  key.chords.forEach(
    (chordName, index) => updateChord(chordName, key.chordsHarmonicFunction[index])
  );
  key.secondaryDominants.forEach(
    (chordName, index) => updateChord(chordName, `V/${key.grades[index]}`)
  );
  key.secondaryDominantSupertonics.forEach(
    (chordName, index) => updateChord(chordName, `ii/${key.grades[index]}`)
  );
  key.substituteDominants.forEach(
    (chordName, index) => updateChord(chordName, `subV/${key.grades[index]}`)
  );
  key.substituteDominantSupertonics.forEach(
    (chordName, index) => updateChord(chordName, `subii/${key.grades[index]}`)
  );
}
function minorKey(tnc) {
  const pc = dist_note(tnc).pc;
  if (!pc) return NoMinorKey;
  const alteration = distInFifths("C", pc) - 3;
  return {
    type: "minor",
    tonic: pc,
    relativeMajor: note_dist_transpose(pc, "3m"),
    alteration,
    keySignature: altToAcc(alteration),
    natural: NaturalScale(pc),
    harmonic: HarmonicScale(pc),
    melodic: MelodicScale(pc)
  };
}
function majorTonicFromKeySignature(sig) {
  if (typeof sig === "number") {
    return dist_transposeFifths("C", sig);
  } else if (typeof sig === "string" && /^b+|#+$/.test(sig)) {
    return dist_transposeFifths("C", accToAlt(sig));
  }
  return null;
}
var key_dist_index_default = { majorKey, majorTonicFromKeySignature, minorKey };

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/mode/dist/index.mjs
// index.ts





var MODES = [
  [0, 2773, 0, "ionian", "", "Maj7", "major"],
  [1, 2902, 2, "dorian", "m", "m7"],
  [2, 3418, 4, "phrygian", "m", "m7"],
  [3, 2741, -1, "lydian", "", "Maj7"],
  [4, 2774, 1, "mixolydian", "", "7"],
  [5, 2906, 3, "aeolian", "m", "m7", "minor"],
  [6, 3434, 5, "locrian", "dim", "m7b5"]
];
var NoMode = {
  ...EmptyPcset,
  name: "",
  alt: 0,
  modeNum: NaN,
  triad: "",
  seventh: "",
  aliases: []
};
var dist_modes = MODES.map(toMode);
var mode_dist_index = {};
dist_modes.forEach((mode2) => {
  mode_dist_index[mode2.name] = mode2;
  mode2.aliases.forEach((alias) => {
    mode_dist_index[alias] = mode2;
  });
});
function mode_dist_get(name) {
  return typeof name === "string" ? mode_dist_index[name.toLowerCase()] || NoMode : name && name.name ? mode_dist_get(name.name) : NoMode;
}
var mode = mode_dist_get;
function mode_dist_all() {
  return dist_modes.slice();
}
var mode_dist_entries = mode_dist_all;
function mode_dist_names() {
  return dist_modes.map((mode2) => mode2.name);
}
function toMode(mode2) {
  const [modeNum, setNum, alt, name, triad, seventh, alias] = mode2;
  const aliases = alias ? [alias] : [];
  const chroma = Number(setNum).toString(2);
  const intervals = scale_type_dist_get(name).intervals;
  return {
    empty: false,
    intervals,
    modeNum,
    chroma,
    normalized: chroma,
    name,
    setNum,
    alt,
    triad,
    seventh,
    aliases
  };
}
function mode_dist_notes(modeName, tonic) {
  return mode_dist_get(modeName).intervals.map((ivl) => transpose(tonic, ivl));
}
function chords(chords2) {
  return (modeName, tonic) => {
    const mode2 = mode_dist_get(modeName);
    if (mode2.empty) return [];
    const triads2 = dist_rotate(mode2.modeNum, chords2);
    const tonics = mode2.intervals.map((i) => transpose(tonic, i));
    return triads2.map((triad, i) => tonics[i] + triad);
  };
}
var triads = chords(MODES.map((x) => x[4]));
var seventhChords = chords(MODES.map((x) => x[5]));
function mode_dist_distance(destination, source) {
  const from = mode_dist_get(source);
  const to = mode_dist_get(destination);
  if (from.empty || to.empty) return "";
  return simplify(transposeFifths("1P", to.alt - from.alt));
}
function relativeTonic(destination, source, tonic) {
  return transpose(tonic, mode_dist_distance(destination, source));
}
var mode_default = {
  get: mode_dist_get,
  names: mode_dist_names,
  all: mode_dist_all,
  distance: mode_dist_distance,
  relativeTonic,
  notes: mode_dist_notes,
  triads,
  seventhChords,
  // deprecated
  entries: mode_dist_entries,
  mode
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/progression/dist/index.mjs
// index.ts




function fromRomanNumerals(tonic, chords) {
  const romanNumerals = chords.map(roman_numeral_dist_get);
  return romanNumerals.map(
    (rn) => transpose(tonic, interval(rn)) + rn.chordType
  );
}
function toRomanNumerals(tonic, chords) {
  return chords.map((chord) => {
    const [note, chordType] = dist_tokenize(chord);
    const intervalName = distance(tonic, note);
    const roman = roman_numeral_dist_get(interval(intervalName));
    return roman.name + chordType;
  });
}
var progression_default = { fromRomanNumerals, toRomanNumerals };

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/range/dist/index.mjs
// index.ts


function numeric(notes) {
  const midi = dist_compact(
    notes.map((note) => typeof note === "number" ? note : toMidi(note))
  );
  if (!notes.length || midi.length !== notes.length) {
    return [];
  }
  return midi.reduce(
    (result, note) => {
      const last = result[result.length - 1];
      return result.concat(dist_range(last, note).slice(1));
    },
    [midi[0]]
  );
}
function chromatic(notes, options) {
  return numeric(notes).map((midi) => midiToNoteName(midi, options));
}
var range_dist_index_default = { numeric, chromatic };

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/scale/dist/index.mjs
// index.ts







var NoScale = {
  empty: true,
  name: "",
  type: "",
  tonic: null,
  setNum: NaN,
  chroma: "",
  normalized: "",
  aliases: [],
  notes: [],
  intervals: []
};
function scale_dist_tokenize(name) {
  if (typeof name !== "string") {
    return ["", ""];
  }
  const i = name.indexOf(" ");
  const tonic = dist_note(name.substring(0, i));
  if (tonic.empty) {
    const n = dist_note(name);
    return n.empty ? ["", name.toLowerCase()] : [n.name, ""];
  }
  const type = name.substring(tonic.name.length + 1).toLowerCase();
  return [tonic.name, type.length ? type : ""];
}
var scale_dist_names = scale_type_dist_names;
function scale_dist_get(src) {
  const tokens = Array.isArray(src) ? src : scale_dist_tokenize(src);
  const tonic = dist_note(tokens[0]).name;
  const st = scale_type_dist_get(tokens[1]);
  if (st.empty) {
    return NoScale;
  }
  const type = st.name;
  const notes = tonic ? st.intervals.map((i) => transpose(tonic, i)) : [];
  const name = tonic ? tonic + " " + type : type;
  return { ...st, name, type, tonic, notes };
}
var scale = scale_dist_get;
function dist_detect(notes, options = {}) {
  const notesChroma = dist_chroma(notes);
  const tonic = dist_note(options.tonic ?? notes[0] ?? "");
  const tonicChroma = tonic.chroma;
  if (tonicChroma === void 0) {
    return [];
  }
  const pitchClasses = notesChroma.split("");
  pitchClasses[tonicChroma] = "1";
  const scaleChroma = dist_rotate(tonicChroma, pitchClasses).join("");
  const match = scale_type_dist_all().find((scaleType) => scaleType.chroma === scaleChroma);
  const results = [];
  if (match) {
    results.push(tonic.name + " " + match.name);
  }
  if (options.match === "exact") {
    return results;
  }
  dist_extended(scaleChroma).forEach((scaleName) => {
    results.push(tonic.name + " " + scaleName);
  });
  return results;
}
function scaleChords(name) {
  const s = scale_dist_get(name);
  const inScale = isSubsetOf(s.chroma);
  return dist_all().filter((chord) => inScale(chord.chroma)).map((chord) => chord.aliases[0]);
}
function dist_extended(name) {
  const chroma2 = isChroma(name) ? name : scale_dist_get(name).chroma;
  const isSuperset = isSupersetOf(chroma2);
  return scale_type_dist_all().filter((scale2) => isSuperset(scale2.chroma)).map((scale2) => scale2.name);
}
function dist_reduced(name) {
  const isSubset = isSubsetOf(scale_dist_get(name).chroma);
  return scale_type_dist_all().filter((scale2) => isSubset(scale2.chroma)).map((scale2) => scale2.name);
}
function scaleNotes(notes) {
  const pcset = notes.map((n) => dist_note(n).pc).filter((x) => x);
  const tonic = pcset[0];
  const scale2 = sortedUniqNames(pcset);
  return dist_rotate(scale2.indexOf(tonic), scale2);
}
function modeNames(name) {
  const s = scale_dist_get(name);
  if (s.empty) {
    return [];
  }
  const tonics = s.tonic ? s.notes : s.intervals;
  return modes(s.chroma).map((chroma2, i) => {
    const modeName = scale_dist_get(chroma2).name;
    return modeName ? [tonics[i], modeName] : ["", ""];
  }).filter((x) => x[0]);
}
function getNoteNameOf(scale2) {
  const names2 = Array.isArray(scale2) ? scaleNotes(scale2) : scale_dist_get(scale2).notes;
  const chromas = names2.map((name) => dist_note(name).chroma);
  return (noteOrMidi) => {
    const currNote = typeof noteOrMidi === "number" ? dist_note(fromMidi(noteOrMidi)) : dist_note(noteOrMidi);
    const height = currNote.height;
    if (height === void 0) return void 0;
    const chroma2 = height % 12;
    const position = chromas.indexOf(chroma2);
    if (position === -1) return void 0;
    return enharmonic(currNote.name, names2[position]);
  };
}
function rangeOf(scale2) {
  const getName = getNoteNameOf(scale2);
  return (fromNote, toNote) => {
    const from = dist_note(fromNote).height;
    const to = dist_note(toNote).height;
    if (from === void 0 || to === void 0) return [];
    return dist_range(from, to).map(getName).filter((x) => x);
  };
}
function dist_degrees(scaleName) {
  const { intervals, tonic } = scale_dist_get(scaleName);
  const transpose2 = tonicIntervalsTransposer(intervals, tonic);
  return (degree) => degree ? transpose2(degree > 0 ? degree - 1 : degree) : "";
}
function dist_steps(scaleName) {
  const { intervals, tonic } = scale_dist_get(scaleName);
  return tonicIntervalsTransposer(intervals, tonic);
}
var scale_dist_index_default = {
  degrees: dist_degrees,
  detect: dist_detect,
  extended: dist_extended,
  get: scale_dist_get,
  modeNames,
  names: scale_dist_names,
  rangeOf,
  reduced: dist_reduced,
  scaleChords,
  scaleNotes,
  steps: dist_steps,
  tokenize: scale_dist_tokenize,
  // deprecated
  scale
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/time-signature/dist/index.mjs
// index.ts
var NONE = {
  empty: true,
  name: "",
  upper: void 0,
  lower: void 0,
  type: void 0,
  additive: []
};
var time_signature_dist_NAMES = ["4/4", "3/4", "2/4", "2/2", "12/8", "9/8", "6/8", "3/8"];
function time_signature_dist_names() {
  return time_signature_dist_NAMES.slice();
}
var time_signature_dist_REGEX = /^(\d*\d(?:\+\d)*)\/(\d+)$/;
var CACHE = /* @__PURE__ */ new Map();
function time_signature_dist_get(literal) {
  const stringifiedLiteral = JSON.stringify(literal);
  const cached = CACHE.get(stringifiedLiteral);
  if (cached) {
    return cached;
  }
  const ts = build(time_signature_dist_parse(literal));
  CACHE.set(stringifiedLiteral, ts);
  return ts;
}
function time_signature_dist_parse(literal) {
  if (typeof literal === "string") {
    const [_, up2, low] = time_signature_dist_REGEX.exec(literal) || [];
    return time_signature_dist_parse([up2, low]);
  }
  const [up, down] = literal;
  const denominator = +down;
  if (typeof up === "number") {
    return [up, denominator];
  }
  const list = up.split("+").map((n) => +n);
  return list.length === 1 ? [list[0], denominator] : [list, denominator];
}
var time_signature_default = { names: time_signature_dist_names, parse: time_signature_dist_parse, get: time_signature_dist_get };
var isPowerOfTwo = (x) => Math.log(x) / Math.log(2) % 1 === 0;
function build([up, down]) {
  const upper = Array.isArray(up) ? up.reduce((a, b) => a + b, 0) : up;
  const lower = down;
  if (upper === 0 || lower === 0) {
    return NONE;
  }
  const name = Array.isArray(up) ? `${up.join("+")}/${down}` : `${up}/${down}`;
  const additive = Array.isArray(up) ? up : [];
  const type = lower === 4 || lower === 2 ? "simple" : lower === 8 && upper % 3 === 0 ? "compound" : isPowerOfTwo(lower) ? "irregular" : "irrational";
  return {
    empty: false,
    name,
    type,
    upper,
    lower,
    additive
  };
}

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/voice-leading/dist/index.mjs
// index.ts

var topNoteDiff = (voicings, lastVoicing) => {
  if (!lastVoicing || !lastVoicing.length) {
    return voicings[0];
  }
  const topNoteMidi = (voicing) => dist_index_default.midi(voicing[voicing.length - 1]) || 0;
  const diff = (voicing) => Math.abs(topNoteMidi(lastVoicing) - topNoteMidi(voicing));
  return voicings.sort((a, b) => diff(a) - diff(b))[0];
};
var voice_leading_dist_index_default = {
  topNoteDiff
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/voicing-dictionary/dist/index.mjs
// index.ts


// data.ts
var dist_triads = {
  M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
  o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
  aug: ["1P 3m 5A", "3m 5A 8P", "5A 8P 10m"]
};
var lefthand = {
  m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
  "7": ["3M 6M 7m 9M", "7m 9M 10M 13M"],
  "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
  "69": ["3M 5P 6A 9M"],
  m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
  "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  // b9 / b13
  "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  // b9 / b13
  o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
  "7#11": ["7m 9M 11A 13A"],
  "7#9": ["3M 7m 9A"],
  mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
  m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
};
var voicing_dictionary_dist_all = {
  M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
  m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
  o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
  aug: ["1P 3m 5A", "3m 5A 8P", "5A 8P 10m"],
  m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
  "7": ["3M 6M 7m 9M", "7m 9M 10M 13M"],
  "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
  "69": ["3M 5P 6A 9M"],
  m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
  "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  // b9 / b13
  "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  // b9 / b13
  o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
  "7#11": ["7m 9M 11A 13A"],
  "7#9": ["3M 7m 9A"],
  mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
  m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
};

// index.ts
var defaultDictionary = lefthand;
function lookup(symbol, dictionary = defaultDictionary) {
  if (dictionary[symbol]) {
    return dictionary[symbol];
  }
  const { aliases } = chord_default.get("C" + symbol);
  const match = Object.keys(dictionary).find((_symbol) => aliases.includes(_symbol)) || "";
  if (match !== void 0) {
    return dictionary[match];
  }
  return void 0;
}
var voicing_dictionary_dist_index_default = {
  lookup,
  lefthand,
  triads: dist_triads,
  all: voicing_dictionary_dist_all,
  defaultDictionary
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/voicing/dist/index.mjs
// index.ts






var defaultRange = ["C3", "C5"];
var dist_defaultDictionary = voicing_dictionary_dist_index_default.all;
var defaultVoiceLeading = voice_leading_dist_index_default.topNoteDiff;
function voicing_dist_get(chord, range = defaultRange, dictionary = dist_defaultDictionary, voiceLeading = defaultVoiceLeading, lastVoicing) {
  const voicings = search(chord, range, dictionary);
  if (!lastVoicing || !lastVoicing.length) {
    return voicings[0];
  } else {
    return voiceLeading(voicings, lastVoicing);
  }
}
function search(chord, range = defaultRange, dictionary = voicing_dictionary_dist_index_default.triads) {
  const [tonic, symbol] = chord_default.tokenize(chord);
  const sets = voicing_dictionary_dist_index_default.lookup(symbol, dictionary);
  if (!sets) {
    return [];
  }
  const voicings = sets.map((intervals) => intervals.split(" "));
  const notesInRange = range_dist_index_default.chromatic(range);
  return voicings.reduce((voiced, voicing) => {
    const relativeIntervals = voicing.map(
      (interval) => interval_default.subtract(interval, voicing[0]) || ""
    );
    const bottomPitchClass = dist_index_default.transpose(tonic, voicing[0]);
    const starts = notesInRange.filter((note) => dist_index_default.chroma(note) === dist_index_default.chroma(bottomPitchClass)).filter(
      (note) => (dist_index_default.midi(
        dist_index_default.transpose(
          note,
          relativeIntervals[relativeIntervals.length - 1]
        )
      ) || 0) <= (dist_index_default.midi(range[1]) || 0)
    ).map((note) => dist_index_default.enharmonic(note, bottomPitchClass));
    const notes = starts.map(
      (start) => relativeIntervals.map((interval) => dist_index_default.transpose(start, interval))
    );
    return voiced.concat(notes);
  }, []);
}
function sequence(chords, range = defaultRange, dictionary = dist_defaultDictionary, voiceLeading = defaultVoiceLeading, lastVoicing) {
  const { voicings } = chords.reduce(
    ({ voicings: voicings2, lastVoicing: lastVoicing2 }, chord) => {
      const voicing = voicing_dist_get(chord, range, dictionary, voiceLeading, lastVoicing2);
      lastVoicing2 = voicing;
      voicings2.push(voicing);
      return { voicings: voicings2, lastVoicing: lastVoicing2 };
    },
    { voicings: [], lastVoicing }
  );
  return voicings;
}
var voicing_dist_index_default = {
  get: voicing_dist_get,
  search,
  sequence
};

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/@tonaljs/core/dist/index.mjs
// index.ts





var core_dist_fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
function deprecate(original, alternative, fn) {
  return function(...args) {
    console.warn(`${original} is deprecated. Use ${alternative}.`);
    return fn.apply(this, args);
  };
}
var isNamed = deprecate("isNamed", "isNamedPitch", isNamedPitch);

//# sourceMappingURL=index.mjs.map
;// ../../../node_modules/tonal/dist/index.mjs
// index.ts
























var Tonal = (/* unused pure expression or super */ null && (Core));
var PcSet = (/* unused pure expression or super */ null && (Pcset));
var ChordDictionary = (/* unused pure expression or super */ null && (ChordType));
var ScaleDictionary = (/* unused pure expression or super */ null && (ScaleType));

//# sourceMappingURL=index.mjs.map
;// ./src/utils.js
function set_canvas_size(canvas_id, width, height) {
  const canvas = document.getElementById(canvas_id);
  canvas.width = width;
  canvas.height = height;
}

function get_canvas(canvas_id) {
  return document.getElementById(canvas_id);
}

;// ./src/settings.js
window.score = {};
const staff_offset = -24;
const upper_lines = 2;
const lower_lines = 3;
const total_lines = upper_lines + lower_lines + 5;
const dy = 20;
const dx = 40;
const settings_height = total_lines * dy;
const patterns_height = 100;

;// ./src/score.js




function note_to_iy(note) {
  const info = note_dist_get(note);
  return info.oct * 7 + info.step + staff_offset;
}

function needs_natural(previous_note, current_note) {
  const info1 = note_dist_get(previous_note);
  const info2 = note_dist_get(current_note);
  const same_oct = info1.oct == info2.oct;
  const same_step = info1.step == info2.step;
  return same_step && same_oct && info1.acc != "" && info2.acc == "";
}

function draw_score(score, canvas_id) {
  draw_grid(canvas_id);
  const canvas = get_canvas(canvas_id);
  for (const ix in score) {
    const note = score[ix];
    const iy = note_to_iy(note);
    let acc = note_dist_get(note).acc;
    // add natural sign if previous note had an accidental
    const previous_note = score[ix - 1];
    if (needs_natural(previous_note, note)) {
      acc = "n";
    }
    draw_note(ix, iy, acc, canvas);
  }
  const ctx = canvas.getContext("2d");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${dy * 4}px Arial`;
  ctx.fillText("𝄞", dx / 2, get_y_note(lower_lines * 2 + 4) + 11);
}

function draw_note(ix, iy, acc, canvas) {
  const ctx = canvas.getContext("2d");
  var x = ix * dx + dx / 2;
  var y = get_y_note(iy) + 1;
  const radius = dy / 2;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (acc == "b") {
    const accX = x - radius * 1.8;
    const accY = y - radius * 0.5;
    ctx.font = `${radius * 4}px Arial`;
    ctx.fillText("♭", accX, accY);
  } else if (acc == "#") {
    const accX = x - radius * 1.8;
    const accY = y + radius * 0.3;
    ctx.font = `${radius * 3}px Arial`;
    ctx.fillText("♯", accX, accY);
  } else if (acc == "n") {
    const accX = x - radius * 1.5;
    const accY = y - radius * 0.3;
    ctx.font = `${radius * 3}px Arial`;
    ctx.fillText("♮", accX, accY);
  }
}

function draw_line(x1, y1, x2, y2, color, width, ctx) {
  ctx.beginPath();
  ctx.moveTo(x1 + 0.5, y1 + 0.5);
  ctx.lineTo(x2 + 0.5, y2 + 0.5);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function get_y_line(i) {
  return settings_height - i * dy - dy / 2;
}

function get_y_note(i) {
  return settings_height - (i * dy) / 2 - dy / 2;
}

function draw_grid(canvas_id) {
  const canvas = get_canvas(canvas_id);
  const ctx = canvas.getContext("2d");

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw vertical lines
  for (let i = 0; i < canvas.width / dx; i++) {
    draw_line(i * dx - 1, 0, i * dx - 1, canvas.height, "#E1E1E1", 1, ctx);
  }

  // draw horizontal lines
  let line_types = [
    ...Array(lower_lines).fill(0),
    ...Array(5).fill(1),
    ...Array(upper_lines).fill(0),
  ];
  for (let i = 0; i < line_types.length; i++) {
    const y = get_y_line(i) + 0.5;
    const x1 = 0;
    const x2 = canvas.width;
    if (line_types[i] == 0) {
      var color = "#E1E1E1";
      var w = 1;
    } else {
      var color = "#000";
      var w = 2;
    }
    draw_line(x1, y, x2, y, color, w, ctx);
  }
}

;// ./src/fingerings.js
const fingerings = {
  "F#3": [1, 1, 1],
  G3: [1, 0, 1],
  "G#3": [0, 1, 1],
  A3: [1, 1, 0],
  "A#3": [1, 0, 0],
  B3: [0, 1, 0],
  C4: [0, 0, 0],
  "C#4": [1, 1, 1],
  D4: [1, 0, 1],
  "D#4": [0, 1, 1],
  E4: [1, 1, 0],
  F4: [1, 0, 0],
  "F#4": [0, 1, 0],
  G4: [0, 0, 0],
  "G#4": [0, 1, 1],
  A4: [1, 1, 0],
  "A#4": [1, 0, 0],
  B4: [0, 1, 0],
  C5: [0, 0, 0],
  "C#5": [1, 1, 0],
  D5: [1, 0, 0],
  "D#5": [0, 1, 0],
  E5: [0, 0, 0],
  F5: [1, 0, 0],
  "F#5": [0, 1, 0],
  G5: [0, 0, 0],
  "G#5": [0, 1, 1],
  A5: [1, 1, 0],
  "A#5": [1, 0, 0],
  B5: [0, 1, 0],
  C6: [0, 0, 0],
};

;// ./src/patterns.js




const r = 10;
const patterns_dx = 40;

function draw_pattern(pattern, ix, canvas) {
  const ctx = canvas.getContext("2d");
  for (var i = 0; i < 3; i++) {
    ctx.beginPath();
    const cx = ix * patterns_dx + patterns_dx / 2;
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
  const n = dist_simplify(note);
  if (note_dist_get(n).acc == "b") {
    return enharmonic(n);
  }
  return n;
}

function draw_patterns(score, canvas_id) {
  const canvas = get_canvas(canvas_id);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let imax = canvas.width / patterns_dx;
  for (var ix = 0; ix < imax; ix++) {
    if (ix in score) {
      const note = sharp_simplify(score[ix]);
      const pattern = fingerings[note];
      if (pattern !== undefined) draw_pattern(pattern, ix, canvas);
    }
  }
}

;// ./src/transposer.js





function transpose_score(score, interval) {
  let new_score = {};
  for (let pos in score) {
    let note = score[pos];
    let transposed_note = dist_simplify(note_dist_transpose(note, interval));
    new_score[pos] = transposed_note;
  }
  return new_score;
}

function draw_transpose(score) {
  draw_score(score, "score_0");
  draw_patterns(score, "patterns_0");
  for (let i = 1; i < 12; i++) {
    let interval = simplify(fromSemitones(i * 7));
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
      fromSemitones(oct * 12),
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
  return transpose_score(score, fromSemitones(best_shift * 12));
}

;// ./src/editor.js






var current_note = -1;
const letters = ["C", "D", "E", "F", "G", "A", "B"];
const all_notes = get_all_notes();

function snap(x, y, canvas_id = "score_0") {
  const canvas = get_canvas(canvas_id);
  let xs = arange(0 + dx / 2, canvas.width + dx / 2, dx);
  let ix = nearestIndex(xs, x);
  let ys = arange(dy / 2, canvas.height, dy / 2);
  let iy = total_lines * 2 - 2 - nearestIndex(ys, y);
  return [ix, iy];
}

function nearestIndex(xs, x) {
  if (xs.length === 0) return -1;
  let bestI = 0;
  let bestD = Math.abs(xs[0] - x);
  for (let i = 1; i < xs.length; i++) {
    const d = Math.abs(xs[i] - x);
    if (d < bestD) {
      bestD = d;
      bestI = i;
    }
  }
  return bestI;
}

function iy_to_note(iy) {
  iy = iy - staff_offset;
  var oct = Math.floor(iy / 7);
  var step = iy % 7;
  var letter = letters[step];
  var note = letter + oct;
  return note;
}

function arange(start, stop, step = 1) {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }
  const out = [];
  for (let v = start; step > 0 ? v < stop : v > stop; v += step) {
    out.push(v);
  }
  return out;
}

function get_all_notes() {
  var notes = [];
  for (let oct = 3; oct < 7; oct++) {
    for (let letter of letters) {
      for (let acc of ["b", "", "#"]) {
        notes.push(letter + acc + oct);
      }
    }
  }
  return notes;
}

function update() {
  draw_score(window.score, "score_0");
  draw_patterns(window.score, "patterns_0");
  draw_transpose(window.score);
}

function click(x, y) {
  let ix, iy;
  [ix, iy] = snap(x, y);
  var note = iy_to_note(iy);
  current_note = ix;
  window.score[ix] = note;
  update();
}

function move_current(sign) {
  let note = window.score[current_note];
  let i = all_notes.indexOf(note);
  note = all_notes[i + sign];
  window.score[current_note] = note;
  update();
}

function sharpen() {
  move_current(1);
}

function flatten() {
  move_current(-1);
}

function delete_note() {
  if (current_note in window.score) {
    delete window.score[current_note];
    update();
  }
}

;// ./src/export.js
// this file is all vide coded. to improve

async function exportAllCanvasesToPDF(
  filename = "canvases.pdf",
  opts = {},
) {
  const { jsPDF } = window.jspdf;
  const allCanvases = Array.from(document.querySelectorAll("canvas"));
  const groupSize = Number(opts.groupSize) || 12;
  const mime = opts.mime || "image/png";
  const quality = typeof opts.quality === "number" ? opts.quality : 1.0;
  const margin = typeof opts.margin === "number" ? opts.margin : 20;
  const spacing = typeof opts.spacing === "number" ? opts.spacing : 8;

  // detect toggle state: extras hidden => export only visible canvases on a single page
  const extrasHidden = checkExtrasHidden();

  const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxRenderWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin * 2;

  // Helper: convert canvases to image items with target render sizes
  function makeItemsFromCanvases(canvases) {
    return canvases.map((c) => {
      const dataUrl = c.toDataURL(mime, quality);
      const imgW = c.width || 1;
      const imgH = c.height || 1;
      const renderW = maxRenderWidth;
      const renderH = (imgH / imgW) * renderW;
      return { dataUrl, renderW, renderH };
    });
  }

  // Helper: draw a list of items stacked vertically on the current pdf page (scaled to fit)
  function renderItemsOnCurrentPage(items) {
    const totalRenderHeight =
      items.reduce((sum, it) => sum + it.renderH, 0) +
      spacing * Math.max(0, items.length - 1);
    const globalScale =
      totalRenderHeight > availableHeight
        ? availableHeight / totalRenderHeight
        : 1;

    let y = margin;
    items.forEach((it) => {
      const finalW = it.renderW * globalScale;
      const finalH = it.renderH * globalScale;
      const x = (pageWidth - finalW) / 2;
      pdf.addImage(
        it.dataUrl,
        mime === "image/png" ? "PNG" : "JPEG",
        x,
        y,
        finalW,
        finalH,
      );
      y += finalH + spacing;
    });
  }

  if (extrasHidden) {
    const visibleCanvases = allCanvases.filter((c) => {
      const s = getComputedStyle(c);
      return (
        s.display !== "none" &&
        s.visibility !== "hidden" &&
        c.width > 0 &&
        c.height > 0
      );
    });
    if (visibleCanvases.length === 0) {
      alert("No visible canvases found to export.");
      return;
    }
    const items = makeItemsFromCanvases(visibleCanvases);
    renderItemsOnCurrentPage(items);
    pdf.save(filename);
    return;
  }

  // grouped behavior (default): split into pages of groupSize
  for (let start = 0; start < allCanvases.length; start += groupSize) {
    const group = allCanvases.slice(start, start + groupSize);
    const items = makeItemsFromCanvases(group);
    if (start !== 0) pdf.addPage();
    renderItemsOnCurrentPage(items);
  }

  pdf.save(filename);
}

// small utility to detect whether extra score canvases are hidden
function checkExtrasHidden() {
  const scoreCanvases = Array.from(
    document.querySelectorAll('canvas[id^="score"]'),
  );
  if (scoreCanvases.length <= 1) return false;
  return scoreCanvases.slice(1).some((c) => {
    const s = getComputedStyle(c);
    return (
      s.display === "none" ||
      s.visibility === "hidden" ||
      c.offsetParent === null
    );
  });
}

;// ./src/scales.js


const scales = {
  major: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
  minor: ["C4", "D4", "Eb4", "F4", "G4", "Ab4", "Bb4", "C5"],
  whole: ["C4", "D4", "E4", "F#4", "G#4", "A#4", "C5"],
  pentatonic: ["C4", "D4", "E4", "G4", "A4", "C5"],
  diminished: ["C4", "D4", "Eb4", "F4", "F#4", "G#4", "A4", "B4", "C5"],
  blues: ["C4", "Eb4", "F4", "Gb4", "G4", "Bb4", "C5"],
};

function createScaleButtons(container = document.body) {
  if (!container) return;
  const frag = document.createDocumentFragment();

  Object.keys(scales).forEach((name) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn scale-btn";
    btn.dataset.scale = name;
    btn.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    frag.appendChild(btn);
  });

  container.appendChild(frag);
}

function mirror(arr) {
  if (!Array.isArray(arr) || arr.length <= 1)
    return Array.isArray(arr) ? arr.slice() : [];
  const tailReversed = arr.slice(0, -1).reverse();
  return arr.concat(tailReversed);
}

function update_score(score) {
  score = mirror(score);
  window.score = {};
  for (let i = 0; i < score.length; i++) {
    let note = score[i];
    window.score[i + 3] = note;
  }
}

function update_scale(scale_name) {
  update_score(scales[scale_name]);
  update();
}

;// ./src/index.js
function make_canvas(id, height, container = document.body) {
  const c = document.createElement("canvas");
  c.id = id;
  c.width = window.innerWidth * 0.8;
  c.height = height;
  container.appendChild(c);
}

for (let i = 0; i < 12; i++) {
  make_canvas("score_" + i, settings_height);
  make_canvas("patterns_" + i, patterns_height);
}








console.log(pitchClass("C#4"));
console.log(pitchClass("C4"));
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

/******/ })()
;