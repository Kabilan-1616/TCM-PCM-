import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { loadExcelJS } from "../utils/excelExport";
import "./PlanHistoryReport.css";

const PlanHistoryReport = () => {
  const { projectId } = useParams();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Accordion States
  const [expandedBuilds, setExpandedBuilds] = useState({});
  const [expandedTCs, setExpandedTCs] = useState({});
  const [expandedIssues, setExpandedIssues] = useState({});

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8001/projects/${projectId}/testplans`);
        setPlans(res.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };
    if (projectId) fetchPlans();
  }, [projectId]);

  const handlePlanSelect = async (e) => {
    const pId = e.target.value;
    setSelectedPlanId(pId);
    setReportData(null);
    setError(null);
    
    if (!pId) return;

    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:8001/reports/plan-history/${pId}`);
      setReportData(res.data);
      
      // Auto-expand the latest build
      if (res.data.builds && res.data.builds.length > 0) {
        setExpandedBuilds({ [res.data.builds[0].build_id]: true });
        if (res.data.builds[0].issues?.length > 0) {
          setExpandedIssues({ [res.data.builds[0].build_id]: true });
        }
      }
    } catch (err) {
      console.error("Report Fetch Error:", err);
      setError("Failed to load report data.");
    }
    setLoading(false);
  };

  const toggleBuild = (id) => setExpandedBuilds(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleTC = (id) => setExpandedTCs(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleIssue = (id) => setExpandedIssues(prev => ({ ...prev, [id]: !prev[id] }));

  // Export to Excel function for Plan History Report
const exportPlanHistoryToExcel = async () => {
  if (!reportData?.builds?.length) { alert("No data to export"); return; }

  try {
    const ExcelJS = await loadExcelJS();
    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Plan History');

    // ── Color palette ──
    const COLORS = {
      headerMain:   '1F3864',  // dark navy  → Row 1 "Execution" / "TC Info"
      headerBuild:  '2E75B6',  // medium blue → Row 2 build name
      headerCols:   'BDD7EE',  // light blue  → Row 3 column names
      fixedHeader:  '1F3864',  // same navy for fixed block rows 1-2
      fixedCols:    'D6E4F0',  // pale blue   → fixed col headers row 3
      white:        'FFFFFF',
      dataAlt:      'F2F7FB',  // very light blue alternate rows
    };

    const centerAlign  = { horizontal: 'center', vertical: 'middle', wrapText: true };
    const leftAlign    = { horizontal: 'left',   vertical: 'middle', wrapText: true };

    const makeFont = (color = 'FFFFFF', bold = false, size = 10) =>
      ({ name: 'Calibri', color: { argb: 'FF' + color }, bold, size });

    const makeFill = (color) =>
      ({ type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + color } });

    const makeBorder = () => ({
      top:    { style: 'thin', color: { argb: 'FFB0C4D8' } },
      left:   { style: 'thin', color: { argb: 'FFB0C4D8' } },
      bottom: { style: 'thin', color: { argb: 'FFB0C4D8' } },
      right:  { style: 'thin', color: { argb: 'FFB0C4D8' } },
    });

    // ── Builds ordered oldest→newest (B1, B2...) ──
    const builds = [...reportData.builds].reverse();

    const maxIssuesPerBuild = builds.map(build => {
      let max = 0;
      build.executions?.forEach(exec => {
        const n = (build.issues?.filter(i => i.testcase_id === exec.testcase_id) || []).length;
        if (n > max) max = n;
      });
      return Math.max(max, 1);
    });

    const fixedCols  = [
      'Test Case ID', 'Task ID', 'Project Name', 'Suite Name', 'Test Case Name',
      'Steps Action', 'Step Expected', 'Step Actual',
      'Test Case Type', 'Test Case Status', 'Written By', 'Written On',
    ];
    const numFixed = fixedCols.length; // 12

    // where each build block starts (1-based col index for ExcelJS)
    const buildStartCols = [];
    let colCursor = numFixed + 1;
    builds.forEach((_, i) => {
      buildStartCols.push(colCursor);
      colCursor += 2 + maxIssuesPerBuild[i] * 4;
    });
    const totalCols = colCursor - 1;

    // ────────────────────────────────────────────
    // ROW 1 — Main headings
    // ────────────────────────────────────────────
    const row1 = ws.addRow(Array(totalCols).fill(''));
    row1.height = 22;

    // Merge + style fixed block label
    ws.mergeCells(1, 1, 1, numFixed);
    const r1fixed = row1.getCell(1);
    r1fixed.value     = 'Test Case Information';
    r1fixed.font      = makeFont(COLORS.white, true, 12);
    r1fixed.fill      = makeFill(COLORS.fixedHeader);
    r1fixed.alignment = centerAlign;
    r1fixed.border    = makeBorder();

    builds.forEach((_, i) => {
      const startC = buildStartCols[i];
      const endC   = i < builds.length - 1 ? buildStartCols[i + 1] - 1 : totalCols;
      ws.mergeCells(1, startC, 1, endC);
      const cell    = row1.getCell(startC);
      cell.value     = 'Execution';
      cell.font      = makeFont(COLORS.white, true, 12);
      cell.fill      = makeFill(COLORS.headerMain);
      cell.alignment = centerAlign;
      cell.border    = makeBorder();
    });

    // ────────────────────────────────────────────
    // ROW 2 — Build names
    // ────────────────────────────────────────────
    const row2 = ws.addRow(Array(totalCols).fill(''));
    row2.height = 20;

    ws.mergeCells(2, 1, 2, numFixed);
    const r2fixed = row2.getCell(1);
    r2fixed.value     = reportData.plan_name || 'Test Plan';
    r2fixed.font      = makeFont(COLORS.white, true, 11);
    r2fixed.fill      = makeFill(COLORS.fixedHeader);
    r2fixed.alignment = centerAlign;
    r2fixed.border    = makeBorder();

    builds.forEach((build, i) => {
      const startC = buildStartCols[i];
      const endC   = i < builds.length - 1 ? buildStartCols[i + 1] - 1 : totalCols;
      ws.mergeCells(2, startC, 2, endC);
      const cell    = row2.getCell(startC);
      cell.value     = build.build_version || build.build_name;
      cell.font      = makeFont(COLORS.white, true, 11);
      cell.fill      = makeFill(COLORS.headerBuild);
      cell.alignment = centerAlign;
      cell.border    = makeBorder();
    });

    // ────────────────────────────────────────────
    // ROW 3 — Column headers
    // ────────────────────────────────────────────
    const headerValues = [...fixedCols];
    builds.forEach((_, i) => {
      headerValues.push('Executed By', 'Executed Status');
      for (let d = 1; d <= maxIssuesPerBuild[i]; d++) {
        headerValues.push('Defect ID', 'Defect Description', 'Defect Status', 'Priority');
      }
    });

    const row3 = ws.addRow(headerValues);
    row3.height = 18;
    row3.eachCell((cell, colNum) => {
      const isFixed = colNum <= numFixed;
      cell.font      = makeFont(isFixed ? '1F3864' : '1F3864', true, 10);
      cell.fill      = makeFill(isFixed ? COLORS.fixedCols : COLORS.headerCols);
      cell.alignment = centerAlign;
      cell.border    = makeBorder();
    });

    // ────────────────────────────────────────────
    // DATA ROWS
    // ────────────────────────────────────────────
    const allTCs = [];
    reportData.builds.forEach(build => {
      build.executions?.forEach(exec => {
        if (!allTCs.find(t => t.testcase_id === exec.testcase_id)) {
          allTCs.push({ testcase_id: exec.testcase_id, testcase_name: exec.testcase_name });
        }
      });
    });

    let globalRowIdx = 4; // after 3 header rows
    let tcColorToggle = false;

    allTCs.forEach(tc => {
      // gather steps from first build that has them
      let steps = [];
      let metaExec = null;
      for (const build of builds) {
        const e = build.executions?.find(ex => ex.testcase_id === tc.testcase_id);
        if (e) {
          if (!metaExec) metaExec = e;
          if (e.steps?.length && !steps.length) steps = e.steps;
        }
      }
      if (!steps.length) steps = [{}];

      const rowBg = tcColorToggle ? COLORS.dataAlt : COLORS.white;
      tcColorToggle = !tcColorToggle;

      const tcStartRow = globalRowIdx;

      steps.forEach((step, stepIdx) => {
        const rowValues = Array(totalCols).fill('');

        if (stepIdx === 0) {
          rowValues[0]  = tc.testcase_id;
          rowValues[1]  = metaExec?.task_id || 'N/A';
          rowValues[2]  = reportData.project_name || '';
          rowValues[3]  = metaExec?.suite_name || 'N/A';
          rowValues[4]  = tc.testcase_name;
          rowValues[8]  = metaExec?.testcase_type || '';
          rowValues[9]  = metaExec?.testcase_status || '';
          rowValues[10] = metaExec?.created_by || 'N/A';
          rowValues[11] = metaExec?.created_at || 'N/A';
        }

        rowValues[5] = step.action || step.description || '';
        rowValues[6] = step.expected_result || step.expected || '';
        rowValues[7] = step.actual_result || step.actual || '';

        if (stepIdx === 0) {
          builds.forEach((build, bi) => {
            const exec   = build.executions?.find(e => e.testcase_id === tc.testcase_id);
            const issues = build.issues?.filter(i => i.testcase_id === tc.testcase_id) || [];
            let c = buildStartCols[bi] - 1; // 0-based
            rowValues[c++] = exec?.executed_by || '';
            rowValues[c++] = exec?.status      || '';
            for (let d = 0; d < maxIssuesPerBuild[bi]; d++) {
              const iss    = issues[d];
              rowValues[c++] = iss?.id          || '';
              rowValues[c++] = iss?.description || iss?.title || '';
              rowValues[c++] = iss?.status      || '';
              rowValues[c++] = iss?.priority    || '';
            }
          });
        }

        const dataRow = ws.addRow(rowValues);
        dataRow.height = 16;
        dataRow.eachCell((cell, colNum) => {
          cell.fill      = makeFill(rowBg);
          cell.alignment = colNum <= 5 ? leftAlign : centerAlign;
          cell.font      = makeFont('1F2D3D', false, 10);
          cell.border    = makeBorder();
        });
        globalRowIdx++;
      });

      // Merge TC-level fixed cols vertically if multiple steps
      if (steps.length > 1) {
        [1, 2, 3, 4, 5, 9, 10, 11, 12].forEach(c => {
          ws.mergeCells(tcStartRow, c, tcStartRow + steps.length - 1, c);
          const cell    = ws.getCell(tcStartRow, c);
          cell.alignment = { ...centerAlign };
        });
        // merge build cols too
        builds.forEach((_, bi) => {
          const startC = buildStartCols[bi];
          const endC   = startC + 1 + maxIssuesPerBuild[bi] * 4;
          for (let c = startC; c < endC; c++) {
            ws.mergeCells(tcStartRow, c, tcStartRow + steps.length - 1, c);
            ws.getCell(tcStartRow, c).alignment = centerAlign;
          }
        });
      }
    });

    // ────────────────────────────────────────────
    // COLUMN WIDTHS
    // ────────────────────────────────────────────
    const widths = [
      8, 10, 18, 18, 28,   // TC ID, Task ID, Project, Suite, TC Name
      25, 25, 25,            // Action, Expected, Actual
      15, 15, 14, 14,        // Type, Status, Written By, Written On
    ];
    builds.forEach((_, i) => {
      widths.push(16, 16); // Executed By, Status
      for (let d = 0; d < maxIssuesPerBuild[i]; d++) {
        widths.push(12, 28, 14, 12); // Defect ID, Desc, Status, Priority
      }
    });
    ws.columns = widths.map(w => ({ width: w }));

    // ── Freeze top 3 header rows + first 2 cols ──
    ws.views = [{ state: 'frozen', xSplit: 2, ySplit: 3 }];

    // ── Write file ──
    const buffer   = await workbook.xlsx.writeBuffer();
    const blob     = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href  = url;
    link.download = `Plan_History_${reportData.plan_name || 'Report'}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    alert("Exported successfully!");

  } catch (err) {
    console.error("Export error:", err);
    alert("Error exporting: " + err.message);
  }
};


  return (
    <div className="ph-container-full">
      {/* HEADER BAR */}
      <div className="ph-header-bar no-print">
        <div className="ph-header-left">
          <h2>📊 Execution History Report</h2>
          <div className="ph-breadcrumbs">
            <span>{reportData?.project_name || "Project"}</span>
            <span className="sep">/</span>
            <span>{reportData?.plan_name || "Test Plan"}</span>
          </div>
        </div>
        <div className="ph-header-right">
          <select onChange={handlePlanSelect} value={selectedPlanId} className="ph-select-modern">
            <option value="">-- Select Test Plan --</option>
            {plans.map(p => <option key={p.id} value={p.id}>{p.testplan_name}</option>)}
          </select>
          {reportData && reportData.builds && reportData.builds.length > 0 && (
            <button className="ph-export-btn" onClick={exportPlanHistoryToExcel} title="Export to Excel">
              📥 Export to Excel
            </button>
          )}
        </div>
      </div>

      {loading && <div className="ph-loading">Generating Report...</div>}
      {error && <div className="ph-error">{error}</div>}

      {/* MAIN CONTENT */}
      {reportData && (
        <div className="ph-main-content">
          
          {(!reportData.builds || reportData.builds.length === 0) && (
            <div className="ph-empty-state">No execution history found for this plan.</div>
          )}

          {/* BUILD LIST */}
          <div className="ph-build-stack">
            {reportData.builds?.map((build) => {
              const hasIssues = build.issues?.length > 0;
              const isExpanded = expandedBuilds[build.build_id];

              return (
                <div key={build.build_id} className={`ph-build-block ${hasIssues ? 'status-fail' : 'status-pass'}`}>
                  
                  {/* Build Header Row */}
                  <div className="ph-build-header-row" onClick={() => toggleBuild(build.build_id)}>
                    <div className="ph-bhr-left">
                      <button className={`ph-toggle-btn ${isExpanded ? 'open' : ''}`}>▼</button>
                      <div className="ph-build-title">
                        <h3>{build.build_version}</h3>
                        <span className="ph-build-date">Released: {build.release_date || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div className="ph-bhr-stats">
                       {hasIssues ? (
                         <span className="ph-pill danger">{build.issues.length} Defects</span>
                       ) : (
                         <span className="ph-pill success">Clean Build</span>
                       )}
                       <span className="ph-pill neutral">{build.executions?.length || 0} Tests</span>
                    </div>
                  </div>

                  {/* Build Content Body */}
                  {isExpanded && (
                    <div className="ph-build-body">
                      
                      {/* --- 1. DEFECTS TABLE (Changed from Cards to Table) --- */}
                      {hasIssues && (
                         <div className="ph-section issues-section">
                            <div className="ph-section-header warning-bg" onClick={() => toggleIssue(build.build_id)}>
                               <div className="ph-sh-title">
                                 <span>🚨 Known Defects</span>
                                 <span className="ph-count-badge">{build.issues.length}</span>
                               </div>
                               <span className="ph-text-toggle">{expandedIssues[build.build_id] ? "Hide" : "Show"}</span>
                            </div>
                            
                            {expandedIssues[build.build_id] && (
                                <div className="ph-table-wrapper">
                                    <table className="ph-data-table issues-table">
                                        <thead>
                                            <tr>
                                                <th width="60px">ID</th>
                                                <th width="80px">Task ID</th>
                                                <th width="100px">Type</th>
                                                <th>Title</th>
                                                <th width="100px">Severity</th>
                                                <th width="100px">Priority</th>
                                                <th width="100px">Status</th>
                                                <th width="120px">Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {build.issues.map(iss => (
                                                <tr key={iss.id}>
                                                    <td className="fw-bold">#{iss.id}</td>
                                                    <td>{iss.task_id || "N/A"}</td>
                                                    <td><span className={`type-tag ${iss.issue_type?.toLowerCase()}`}>{iss.issue_type || "BUG"}</span></td>
                                                    <td>{iss.title}</td>
                                                    <td><span className={`severity-tag ${iss.severity?.toLowerCase()}`}>{iss.severity}</span></td>
                                                    <td><span className={`priority-tag ${iss.priority?.toLowerCase()}`}>{iss.priority}</span></td>
                                                    <td><span className={`status-tag ${iss.status?.toLowerCase()}`}>{iss.status}</span></td>
                                                    <td>{iss.created_at ? new Date(iss.created_at).toLocaleDateString() : "N/A"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                         </div>
                      )}

                      {/* --- 2. EXECUTION TABLE --- */}
                      <div className="ph-section exec-section">
                        <div className="ph-section-header">
                           🧪 Test Execution Log
                        </div>
                        <div className="ph-exec-grid">
                          {/* Table Header for Executions */}
                          <div className="ph-exec-row header-row">
                              <div className="col-status">Status</div>
                              <div className="col-name">Test Case Name</div>
                              <div className="col-user">Executed By</div>
                              <div className="col-action">Details</div>
                          </div>

                          {build.executions?.map((exec, idx) => {
                              const uniqueId = `${build.build_id}-${exec.testcase_id}-${idx}`;
                              const isTcExpanded = expandedTCs[uniqueId];
                              const statusClass = exec.status?.toLowerCase();

                              return (
                                  <div key={uniqueId} className="ph-exec-group">
                                      {/* Execution Row */}
                                      <div className={`ph-exec-row ${statusClass}-border`} onClick={() => toggleTC(uniqueId)}>
                                          <div className="col-status">
                                              <span className={`status-dot ${statusClass}`}></span>
                                              <span className={`status-text ${statusClass}`}>{exec.status}</span>
                                          </div>
                                          <div className="col-name">
                                              <strong>{exec.testcase_name}</strong>
                                          </div>
                                          <div className="col-user">
                                              {exec.executed_by}
                                          </div>
                                          <div className="col-action">
                                              <span className={`arrow ${isTcExpanded ? 'down' : 'right'}`}>›</span>
                                          </div>
                                      </div>

                                      {/* Expanded Steps */}
                                      {isTcExpanded && (
                                          <div className="ph-exec-details">
                                              {exec.notes && <div className="ph-notes-box">📝 <strong>Notes:</strong> {exec.notes}</div>}
                                              
                                              <table className="ph-steps-table-full">
                                                  <thead>
                                                      <tr>
                                                          <th width="50px">#</th>
                                                          <th>Action</th>
                                                          <th>Expected</th>
                                                          <th>Actual</th>
                                                          <th width="80px">Result</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody>
                                                      {exec.steps?.map(s => (
                                                          <tr key={s.step_no} className={s.status === "Fail" ? "row-fail" : ""}>
                                                              <td>{s.step_no}</td>
                                                              <td>{s.description}</td>
                                                              <td>{s.expected}</td>
                                                              <td className="mono-font">{s.actual}</td>
                                                              <td><span className={`step-badge ${s.status?.toLowerCase()}`}>{s.status}</span></td>
                                                          </tr>
                                                      ))}
                                                  </tbody>
                                              </table>
                                          </div>
                                      )}
                                  </div>
                              );
                          })}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanHistoryReport;
