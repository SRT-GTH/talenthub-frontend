/*
 * Roving radio keys for the details dialog's level picker and ranked / practice options (WAI-ARIA radiogroup): arrows move AND
 * select, Home / End jump. `group` is the `role="radiogroup"` element; enabled radios are `[role="radio"]:not([disabled])`.
 */
export const radioKeyTarget = (event, group) => {
  const radios = Array.from(group.querySelectorAll('[role="radio"]:not([disabled])'));
  if (radios.length === 0) return null;
  const at = radios.indexOf(document.activeElement);
  const forward = ['ArrowRight', 'ArrowDown'];
  const back = ['ArrowLeft', 'ArrowUp'];
  let next = -1;
  if (forward.includes(event.key)) next = (at + 1) % radios.length;
  else if (back.includes(event.key)) next = (at - 1 + radios.length) % radios.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = radios.length - 1;
  return next < 0 ? null : radios[next];
};
