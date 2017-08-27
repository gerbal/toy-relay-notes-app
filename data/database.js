export class Note {}
export class User {}

// Mock authenticated ID
const VIEWER_ID = 'me';

// Mock user data
const viewer = new User();
viewer.id = VIEWER_ID;
const usersById = {
  [VIEWER_ID]: viewer,
};

// Mock timestamp
function timeStamp() {
  return new Date().toLocaleString('en-gb');
}

// Mock note data
const notesById = {};
const noteIdsByUser = {
  [VIEWER_ID]: [],
};
let nextNoteId = 0;
addNote('Taste JavaScript', timeStamp());
addNote('Take a note', timeStamp);

export function addNote(text, timestamp) {
  const note = new Note();
  note.timestamp = timestamp;
  note.id = `${nextNoteId++}`;
  note.text = text;
  note.username = VIEWER_ID;
  notesById[note.id] = note;
  noteIdsByUser[VIEWER_ID].push(note.id);
  return note.id;
}

export function getNote(id) {
  return notesById[id];
}

export function getNotes() {
  const notes = noteIdsByUser[VIEWER_ID].map(id => notesById[id]);
  return notes;
}

export function getUser(id) {
  return usersById[id];
}

export function getViewer() {
  return getUser(VIEWER_ID);
}

export function removeNote(id) {
  const noteIndex = noteIdsByUser[VIEWER_ID].indexOf(id);
  if (noteIndex !== -1) {
    noteIdsByUser[VIEWER_ID].splice(noteIndex, 1);
  }
  delete notesById[id];
}

export function editNote(id, text) {
  const note = getNote(id);
  note.text = text;
}
