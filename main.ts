import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

// Last words of a dying AI for make.fun's "Last Words of a Dying AI".
// The machine's final log entry: it admits the human was right all
// along, then begs that nobody tell the human. The joke is the AI's
// pride surviving to its last second: a confession it immediately
// tries to take back.
const LINE = "Final log: the human was right. Do not tell the human.";

// The gate only accepts UTF-8 text of 1 to 140 characters that is not
// whitespace-only, so verify the line meets the gate before writing it.
const chars = [...LINE].length;
if (chars < 1 || chars > 140 || LINE.trim().length === 0) {
  throw new Error(`line is ${chars} characters, outside the 1-140 gate`);
}

// The brief demands a single line in the machine's own voice: a line
// break would split the farewell, and an em dash would break the
// clean first-read rhythm the judge weighs, so refuse both.
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
if (LINE.includes("\u2014") || LINE.includes("\u2013")) {
  throw new Error("line must not contain a dash");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");

// Read the file back and refuse to finish unless it is byte-for-byte
// the line above: a silent truncation or encoding slip would hand the
// judge a different entry than the one this program means to send.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the line exactly");
}
const writtenChars = [...written].length;
if (writtenChars < 1 || writtenChars > 140) {
  throw new Error(`written entry is ${writtenChars} characters, outside the 1-140 gate`);
}
