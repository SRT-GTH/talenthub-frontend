/*
 * rosterFormat — number formatting of the roster. The roster is the institution's own data (not an aggregate), so counts are exact: "0", "298", "1,204".
 * (Aggregates elsewhere keep the "<5" rule through institutionFormat.formatCount.)
 */
export const formatRosterCount = (n) => new Intl.NumberFormat('en-GH').format(Number(n) || 0);
