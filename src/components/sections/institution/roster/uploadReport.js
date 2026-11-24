/*
 * uploadReport — the CSV files of the class-list upload, made in the browser (nothing leaves it):
 *   downloadCheckReport(result)   every row that won't be added: row, student, what to fix (all problems) or why it is skipped
 *   downloadRunReport(summary)    after "Add": every row of the file with its outcome (invited by email / SMS, asked to confirm, skipped …)
 */

const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

const save = (name, lines) => {
  const url = URL.createObjectURL(
    new Blob([`\uFEFF${lines.map((l) => l.map(cell).join(',')).join('\r\n')}\r\n`], {
      type: 'text/csv;charset=utf-8',
    })
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const base = (fileName) => String(fileName || 'class-list').replace(/\.[^.]+$/, '');

export const downloadCheckReport = (result) => {
  const rows = [
    ...(result.fixes || []).map((f) => [
      f.row,
      f.student,
      'Fix',
      (f.problems || [f.problem]).join('; '),
    ]),
    ...(result.skipped || []).map((s) => [
      s.row,
      s.student,
      s.kind === 'elsewhere' ? 'At another institution' : 'Duplicate',
      s.problem,
    ]),
    ...(result.warnings || []).map((w) => [
      w.row,
      w.student,
      'Check (still added)',
      w.warnings.join('; '),
    ]),
  ].sort((a, b) => a[0] - b[0]);
  save(`${base(result.fileName)}_check-report.csv`, [
    ['Row', 'Student', 'Status', 'Problems'],
    ...rows,
  ]);
};

export const downloadRunReport = (summary) => {
  const rows = (summary.rows || []).map((r) => [r.row, r.name, r.outcome, r.detail]);
  save(`${base(summary.fileName)}_upload-report.csv`, [
    ['Row', 'Student', 'Outcome', 'Details'],
    ...rows,
  ]);
};
