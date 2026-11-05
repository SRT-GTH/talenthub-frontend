/*
 * A CV file handed from Career Buddy to the Upload-my-CV flow (2026-11-01). Career Buddy's attach button used to say
 * "I've kept your CV with this conversation. I can't read files yet" - nothing was sent anywhere, while the CV reader
 * already existed. Now a PDF / .docx dropped in the chat opens the same reader and review (nothing is saved until the
 * talent checks it). In memory only: a reload drops it, and it is read once.
 */
let pending = null;

export const handOffCv = (file) => {
  pending = file || null;
};

export const peekHandedOffCv = () => pending;

export const takeHandedOffCv = () => {
  const file = pending;
  pending = null;
  return file;
};
