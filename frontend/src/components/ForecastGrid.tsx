import EditableCell from "./EditableCell";
import ImpactBar from "./ImpactBar";
import { useForecast } from "../hooks/useForecast";
import { fmtNum, monthLabel, fmtPrice } from "../utils/format";
import type { Measure, Sku } from "../types/planner";
import "./ForecastGrid.css";
import ForecastChart, { LABEL_W, COL_W } from "./ForecastChart";

interface Props {
  brand: string;
  sku: Sku | null;
  measure: Measure;
}

export default function ForecastGrid({ brand, sku, measure }: Props) {
  const f = useForecast(brand, sku?.sku ?? null, measure);
  if (f.error)
    return <p className="grid-note">Could not load forecast: {f.error}</p>;
  if (!f.data) return <p className="grid-note">Loading forecast…</p>;

  const periods = f.data.periods;
  const years = [...new Set(periods.map((p) => p.slice(0, 4)))];
  const yearStart = (p: string) => (p.endsWith("-01") ? " year-start" : "");
  const ibpId = f.rows.find((r) => r.label === "Current IBP")?.id;
  return (
    <div className="grid-wrap">
      <div className="grid-scroll">
        <ForecastChart f={f} />
        <table
          className="fgrid"
          style={{
            tableLayout: "fixed",
            width: LABEL_W + periods.length * COL_W,
          }}
        >
          <colgroup>
            <col style={{ width: LABEL_W }} />
            {periods.map((p) => (
              <col key={p} style={{ width: COL_W }} />
            ))}
          </colgroup>
          <thead>
            <tr className="year-row">
              <th className="corner" rowSpan={2}>
                {measure === "VOLUME" ? "Volumes (units)" : "Values (EUR)"}
              </th>
              {years.map((y) => (
                <th
                  key={y}
                  className="year-head"
                  colSpan={periods.filter((p) => p.startsWith(y)).length}
                >
                  {y}
                </th>
              ))}
            </tr>
            <tr className="month-row">
              {periods.map((p) => (
                <th key={p} className={`month-head${yearStart(p)}`}>
                  {monthLabel(p)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {f.rows.map((row) => (
              <tr key={row.id} className={`row-${row.kind}`}>
                <th className="row-label">
                  {row.label}
                  {row.editable && <span className="pill">edit</span>}
                </th>
                {periods.map((p) => {
                  const v = f.cell(row.id, p);
                  const ibp = ibpId ? f.cell(ibpId, p) : null;
                  const isOv =
                    row.kind === "override" &&
                    v != null &&
                    ibp != null &&
                    Math.round(v) !== Math.round(ibp);
                  const cls = [
                    `cell${yearStart(p)}`,
                    isOv ? "overridden" : "",
                    row.kind === "variance"
                      ? v < 0
                        ? "neg"
                        : v > 0
                          ? "pos"
                          : ""
                      : "",
                  ].join(" ");

                  if (row.kind === "override") {
                    return row.editable ? (
                      <EditableCell
                        key={p}
                        value={isOv ? v : null}
                        placeholder={ibp ?? undefined}
                        className={cls}
                        onCommit={(n) => f.setOverride(p, n)}
                      />
                    ) : (
                      <td key={p} className={cls}>
                        {isOv ? fmtNum(v) : ""}
                      </td>
                    );
                  }

                  return (
                    <td key={p} className={cls}>
                      {row.kind === "price" ? fmtPrice(v) : fmtNum(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ImpactBar
        impact={f.impact}
        dirty={f.dirty}
        saving={f.saving}
        onReset={f.reset}
        onSave={f.save}
      />
    </div>
  );
}
