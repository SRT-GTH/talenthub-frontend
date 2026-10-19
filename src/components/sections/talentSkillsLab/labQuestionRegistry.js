import { debug } from '../../../utils/debug.js';

const log = debug('labQuestionRegistry');

/* Question-kind registry: see the header comment of labQuestionKinds.jsx for the renderer contract. */
const KINDS = {};

export const registerQuestionKind = (kind, Component) => {
  KINDS[kind] = Component;
  log('registered', kind);
};
export const getQuestionKind = (kind) => KINDS[kind] ?? null;
