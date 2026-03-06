import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { loadExcelJS } from "../utils/excelExport";
import "./RTMReport.css";

const API_BASE = "http://127.0.0.1:8001";

function RTMReport({ activeProject }) {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(false);
  const [rtmRows, setRtmRows] = useState([]);
  const [error, setError] = useState(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const targetId = activeProject?.id || projectId;
    if (!targetId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/projects/${targetId}/testcases`);
        if (Array.isArray(res.data)) {
          processRTMData(res.data);
        } else {
          setError("Invalid data format from server.");
        }
      } catch (err) {
        console.error("RTM Fetch Error:", err);
        setError("Failed to load Test Cases. Ensure the backend endpoint exists.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeProject, projectId]);

  // --- 2. PROCESS DATA ---
  const processRTMData = (testCases) => {
    const grouped = {};

    testCases.forEach((tc) => {
      const rawTaskID = tc.task_id ? String(tc.task_id).trim() : "";
      const taskID = rawTaskID === "" ? "Unassigned" : rawTaskID;

      if (!grouped[taskID]) {
        grouped[taskID] = { task_id: taskID, Unit: [], Integration: [], System: [], Other: [] };
      }

      const type = (tc.testcase_type || "").toLowerCase();
      if (type.includes("unit"))              grouped[taskID].Unit.push(tc);
      else if (type.includes("integration"))  grouped[taskID].Integration.push(tc);
      else if (type.includes("system"))       grouped[taskID].System.push(tc);
      else                                    grouped[taskID].Other.push(tc);
    });

    const rows = Object.values(grouped).sort((a, b) => {
      if (a.task_id === "Unassigned") return 1;
      if (b.task_id === "Unassigned") return -1;
      return a.task_id.localeCompare(b.task_id, undefined, { numeric: true });
    });

    setRtmRows(rows);
  };

  // --- 3. STYLED EXCEL EXPORT ---
  const exportRTMToExcel = async () => {
    try {
      const ExcelJS = await loadExcelJS();
      const workbook = new ExcelJS.Workbook();
      const ws = workbook.addWorksheet("RTM Report");

      // ── Color palette ──
      const COLORS = {
        headerMain: "1F3864",  // dark navy  → title row
        headerCols: "BDD7EE",  // light blue → column header row
        white:      "FFFFFF",
        dataAlt:    "F2F7FB",  // alternate row tint
      };

      const centerAlign = { horizontal: "center", vertical: "middle", wrapText: true };
      const leftAlign   = { horizontal: "left",   vertical: "middle", wrapText: true };

      const makeFont = (color = "FFFFFF", bold = false, size = 10) => ({
        name: "Calibri", color: { argb: "FF" + color }, bold, size,
      });

      const makeFill = (color) => ({
        type: "pattern", pattern: "solid", fgColor: { argb: "FF" + color },
      });

      const makeBorder = () => ({
        top:    { style: "thin", color: { argb: "FFB0C4D8" } },
        left:   { style: "thin", color: { argb: "FFB0C4D8" } },
        bottom: { style: "thin", color: { argb: "FFB0C4D8" } },
        right:  { style: "thin", color: { argb: "FFB0C4D8" } },
      });

      const totalCols = 5;

      // ── ROW 1: Title ──────────────────────────────────────────
      const row1 = ws.addRow(Array(totalCols).fill(""));
      row1.height = 26;
      ws.mergeCells(1, 1, 1, totalCols);
      const titleCell     = row1.getCell(1);
      titleCell.value     = `Requirements Traceability Matrix${activeProject?.project_name ? " — " + activeProject.project_name : ""}`;
      titleCell.font      = makeFont(COLORS.white, true, 13);
      titleCell.fill      = makeFill(COLORS.headerMain);
      titleCell.alignment = centerAlign;
      titleCell.border    = makeBorder();

      // ── ROW 2: Column headers ─────────────────────────────────
      const headers = ["Task ID", "Unit Tests", "Integration Tests", "System Tests", "Acceptance Tests"];
      const row2 = ws.addRow(headers);
      row2.height = 20;
      row2.eachCell((cell) => {
        cell.font      = makeFont("1F3864", true, 10);
        cell.fill      = makeFill(COLORS.headerCols);
        cell.alignment = centerAlign;
        cell.border    = makeBorder();
      });

      // ── DATA ROWS ─────────────────────────────────────────────
      let toggle = false;

      rtmRows.forEach((row) => {
        const bg = toggle ? COLORS.dataAlt : COLORS.white;
        toggle = !toggle;

        const formatTCs = (list) =>
          list?.length
            ? list.map((tc) => `TC-${tc.id}`).join("\n")
            : "—";

        const maxCount = Math.max(
          row.Unit?.length || 0,
          row.Integration?.length || 0,
          row.System?.length || 0,
          row.Other?.length || 0,
          1
        );

        const dataRow = ws.addRow([
          row.task_id,
          formatTCs(row.Unit),
          formatTCs(row.Integration),
          formatTCs(row.System),
          formatTCs(row.Other),
        ]);

        dataRow.height = Math.max(18, maxCount * 18);

        dataRow.eachCell((cell, colNum) => {
          cell.fill      = makeFill(bg);
          cell.alignment = colNum === 1 ? leftAlign : centerAlign;
          cell.font      = makeFont("1F2D3D", false, 10);
          cell.border    = makeBorder();
        });
      });

      // ── COLUMN WIDTHS ─────────────────────────────────────────
      ws.columns = [
        { width: 16 },  // Task ID
        { width: 32 },  // Unit
        { width: 32 },  // Integration
        { width: 32 },  // System
        { width: 32 },  // Acceptance
      ];

      // ── FREEZE top 2 rows + first column ─────────────────────
      ws.views = [{ state: "frozen", xSplit: 1, ySplit: 2 }];

      // ── WRITE FILE ────────────────────────────────────────────
      const buffer = await workbook.xlsx.writeBuffer();
      const blob   = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href     = url;
      link.download = `RTM_${activeProject?.project_name || "Report"}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      alert("RTM Report exported successfully!");

    } catch (err) {
      console.error("Export error:", err);
      alert("Error exporting to Excel: " + err.message);
    }
  };

  // --- 4. RENDER HELPERS ---
  const renderBadges = (list, typeClass) => {
    if (!list || list.length === 0) return <span className="empty-dash">-</span>;
    return (
      <div className="id-container">
        {list.map((tc) => (
          <span
            key={tc.id}
            className={`tc-badge ${typeClass}`}
            title={tc.testcase_name}
          >
            TC-{tc.id}
          </span>
        ))}
      </div>
    );
  };

  // --- 5. VIEW ---
  if (!activeProject && !projectId) {
    return (
      <div className="rtm-page">
        <div className="empty-state">Select a project to view the RTM.</div>
      </div>
    );
  }

  return (
    <div className="rtm-page">
      <div className="content-card">

        {/* Header */}
        <div className="header-row">
          <h3>📊 Requirements Traceability Matrix</h3>
          {activeProject && (
            <div className="meta-badge">{activeProject.project_name}</div>
          )}
          {!loading && !error && rtmRows.length > 0 && (
            <button className="export-btn" onClick={exportRTMToExcel} title="Export to Excel">
              📥 Export to Excel
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && <div className="loading">Generating Matrix...</div>}

        {/* Error */}
        {error && (
          <div className="error-box">
            <p>❌ {error}</p>
            <small>Check console for details.</small>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="rtm-table-wrapper">
            <table className="rtm-table">
              <thead>
                <tr>
                  <th className="th-task">Task ID</th>
                  <th className="th-type">Unit Tests</th>
                  <th className="th-type">Integration Tests</th>
                  <th className="th-type">System Tests</th>
                  <th className="th-type">Acceptance Tests</th>
                </tr>
              </thead>
              <tbody>
                {rtmRows.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      No Test Cases found for this project.
                    </td>
                  </tr>
                ) : (
                  rtmRows.map((row) => (
                    <tr key={row.task_id}>
                      <td className="task-id-cell">{row.task_id}</td>
                      <td>{renderBadges(row.Unit, "unit")}</td>
                      <td>{renderBadges(row.Integration, "integration")}</td>
                      <td>{renderBadges(row.System, "system")}</td>
                      <td>{renderBadges(row.Other, "other")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RTMReport;
