/*
 * ChartTable — the text equivalent of a custom SVG chart: a visually hidden <table> with one row per point (same numbers the bars / lines draw).
 * Props: caption, headers [string], rows [[cell,...]] (first cell is the row header). Screen readers get it next to the chart; the SVG itself is aria-hidden.
 */

const ChartTable = ({ caption, headers, rows }) => (
  <div className="sr-only">
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]}>
            {r.map((c, i) =>
              i === 0 ? (
                <th key={c} scope="row">
                  {c}
                </th>
              ) : (
                <td key={`${r[0]}-${i}`}>{c}</td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ChartTable;
