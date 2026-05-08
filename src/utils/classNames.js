/**
 * classNames(...args) — joins truthy class-name fragments.
 * Mirrors elysium's util. Use it to conditionally compose Tailwind classes:
 *
 *   classNames('btn', isPrimary && 'btn-primary', size === 'lg' && 'btn-lg')
 */
export const classNames = (...args) => args.filter(Boolean).join(' ');

export default classNames;
