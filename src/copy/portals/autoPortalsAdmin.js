import { autoSections } from '../autoCopy.js';
import { AUTO_EXCLUDE, AUTO_PREVIEW, AUTO_ROOTS } from './autoPortalsConfig.js';

/*
 * autoPortalsAdmin — every portal data file, loaded at once, as Site copy sections (admin only: the editor needs every field).
 * Keep the globs equal to autoPortalsRuntime.js.
 */
const MODULES = import.meta.glob(
  [
    '../../components/sections/talent{Assessment,Community,Home,Jobs,Learning,Messages,Profile,Settings,SkillsLab,Streak,Wallet}/**/*{Data,data}.js',
    '../../components/sections/talent{Assessment,Community,Home,Jobs,Learning,Messages,Profile,Settings,SkillsLab,Streak,Wallet}/**/data/*.js',
    '../../components/sections/{parent,institution,agency}/**/*{Data,data}.js',
    '../../components/sections/{parent,institution,agency}/**/data/*.js',
  ],
  { eager: true }
);

export const AUTO_COPY_SECTIONS = autoSections(MODULES, {
  roots: AUTO_ROOTS,
  exclude: AUTO_EXCLUDE,
  preview: AUTO_PREVIEW,
});
