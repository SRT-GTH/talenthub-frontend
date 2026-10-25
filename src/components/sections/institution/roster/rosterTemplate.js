/*
 * rosterTemplate — the CSV template of the class list ("Download CSV template" on the empty roster 11.2.2l, "Download template" in the upload dialog 11.2.2c).
 * ⚠️ ASSUMPTION: Figma does not draw the file; the headers are the default column names of the "Map your columns" step.
 */
export const TEMPLATE_CSV =
  'student_name,ghana_card,programme,index_number,dob,year_group,guardian_phone,email\n';

/** Saves the template as a real file (a Blob link; nothing leaves the browser). */
export const downloadTemplate = () => {
  const url = URL.createObjectURL(new Blob([TEMPLATE_CSV], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'savannah-hills-class-list-template.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
