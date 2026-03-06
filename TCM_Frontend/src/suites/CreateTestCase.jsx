import React, { useState, useEffect } from "react";
import "./CreateTestCase.css"; 

const CreateTestCase = ({ suite, onCancel, onSuccess, editingTestcase }) => {
  const [formData, setFormData] = useState({
    testcase_name: "",
    testcase_summary: "",
    testcase_precondition: "",
    task_id: "",
    testcase_status: "Draft",
    testcase_importance: "Medium",
    testcase_executiontype: "Manual",
    testcase_type: "System",
    steps: [
      { step_no: 1, action: "", expected_result: "", precondition: "" }
    ]
  });

  const [draggedIndex, setDraggedIndex] = useState(null);

  // Initialize formData with editingTestcase data if provided
  useEffect(() => {
    if (editingTestcase) {
      setFormData({
        testcase_name: editingTestcase.testcase_name || "",
        testcase_summary: editingTestcase.testcase_summary || "",
        testcase_precondition: editingTestcase.testcase_precondition || "",
        task_id: editingTestcase.task_id || "",
        testcase_status: editingTestcase.testcase_status || "Draft",
        testcase_importance: editingTestcase.testcase_importance || "Medium",
        testcase_executiontype: editingTestcase.testcase_executiontype || "Manual",
        testcase_type: editingTestcase.testcase_type || "System",
        steps: editingTestcase.steps && editingTestcase.steps.length > 0 ? editingTestcase.steps : [
          { step_no: 1, action: "", expected_result: "", precondition: "" }
        ]
      });
    }
  }, [editingTestcase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* --- STEPS LOGIC --- */
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { step_no: prev.steps.length + 1, action: "", expected_result: "", precondition: "" }]
    }));
  };

  const removeStep = (index) => {
    if (formData.steps.length === 1) return;
    const updated = formData.steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_no: i + 1 }));
    setFormData(prev => ({ ...prev, steps: updated }));
  };

  const updateStep = (index, field, value) => {
    const updated = [...formData.steps];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, steps: updated }));
  };

  /* --- DRAG & DROP --- */
  const onDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedSteps = [...formData.steps];
    const itemToMove = updatedSteps[draggedIndex];
    updatedSteps.splice(draggedIndex, 1);
    updatedSteps.splice(index, 0, itemToMove);
    const reordered = updatedSteps.map((step, i) => ({ ...step, step_no: i + 1 }));
    setDraggedIndex(index);
    setFormData(prev => ({ ...prev, steps: reordered }));
  };

  const onDragEnd = () => setDraggedIndex(null);

  /* --- API --- */
  const handleCreate = async () => {
    try {
      if (editingTestcase) {
        // Edit mode - PUT request
        await fetch(`http://127.0.0.1:8001/testcases/${editingTestcase.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      } else {
        // Create mode - POST request
        await fetch(`http://127.0.0.1:8001/suites/${suite.id}/testcases`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }
      onSuccess(); 
    } catch (err) { alert("Backend not reachable"); }
  };

  return (
    <div className="ctc-content-column">
      
      {/* HEADER */}
      <div className="ctc-header-row ctc-compact">
        <h3 className="ctc-page-title">{editingTestcase ? "Edit Test Case" : "New Test Case"} <span className="ctc-text-muted ctc-text-xs">/ {suite.suite_name}</span></h3>
        <div className="ctc-header-actions">
           <button className="ctc-btn-secondary ctc-compact" onClick={onCancel}>Cancel</button>
           <button className="ctc-btn-primary ctc-compact" onClick={handleCreate}>{editingTestcase ? "Update" : "Save"} Case</button>
        </div>
      </div>

      <div className="ctc-form-container ctc-scrollable">
        
        {/* ROW 1: NAME (30%) | SUMMARY (35%) | PRECONDITION (35%) */}
        <div className="ctc-row-flex">
           <div className="ctc-form-group" style={{flex: '0 0 30%'}}>
             <label className="ctc-label-small">Name</label>
             <input 
               name="testcase_name" 
               className="ctc-input-compact" 
               placeholder="Test Case Name"
               value={formData.testcase_name} 
               onChange={handleChange} 
               autoFocus
             />
           </div>
           <div className="ctc-form-group" style={{flex: '1'}}>
             <label className="ctc-label-small">Summary</label>
             <input 
               name="testcase_summary" 
               className="ctc-input-compact" 
               placeholder="Brief summary..."
               value={formData.testcase_summary} 
               onChange={handleChange} 
             />
           </div>
           <div className="ctc-form-group" style={{flex: '1'}}>
             <label className="ctc-label-small">Pre-condition</label>
             <input 
               name="testcase_precondition" 
               className="ctc-input-compact" 
               placeholder="Prerequisites..."
               value={formData.testcase_precondition} 
               onChange={handleChange} 
             />
           </div>
        </div>

        {/* ROW 2: 4 DROPDOWNS (Equal Width) */}
        <div className="ctc-grid-4 ctc-compact-grid">
           <div className="ctc-form-group">
             <label className="ctc-label-small">Task ID</label>
             <input 
               name="task_id" 
               className="ctc-input-compact" 
               placeholder="Task ID"
               value={formData.task_id} 
               onChange={handleChange} 
             />
           </div>
           <div className="ctc-form-group">
             <label className="ctc-label-small">Status</label>
             <select name="testcase_status" className="ctc-input-compact" value={formData.testcase_status} onChange={handleChange}>
               <option>Draft</option><option>Ready</option>
             </select>
           </div>
           <div className="ctc-form-group">
             <label className="ctc-label-small">Severity</label>
             <select name="testcase_importance" className="ctc-input-compact" value={formData.testcase_importance} onChange={handleChange}>
               <option>Low</option><option>Medium</option><option>High</option>
             </select>
           </div>
           <div className="ctc-form-group">
             <label className="ctc-label-small">Execution</label>
             <select name="testcase_executiontype" className="ctc-input-compact" value={formData.testcase_executiontype} onChange={handleChange}>
               <option>Manual</option><option>Automated</option>
             </select>
           </div>
        </div>

        {/* ROW 3: TYPE DROPDOWN */}
        <div className="ctc-grid-4 ctc-compact-grid">
           <div className="ctc-form-group">
             <label className="ctc-label-small">Type</label>
             <select name="testcase_type" className="ctc-input-compact" value={formData.testcase_type} onChange={handleChange}>
               <option>Unit</option><option>System</option><option>Integration</option><option>Acceptance</option>
             </select>
           </div>
        </div>

        {/* ROW 3: STEPS TABLE HEADER */}
        <div className="ctc-section-header">
           <label className="ctc-label-small" style={{color: '#1e293b'}}>TEST STEPS</label>
           <button className="ctc-btn-small" onClick={addStep}>+ Add Step</button>
        </div>

        {/* ROW 4: STEPS TABLE */}
        <div className="ctc-table-container ctc-steps-container">
          <table className="ctc-table ctc-fixed-layout">
            <thead>
              <tr>
                <th style={{width: '30px'}}></th>
                <th style={{width: '35px'}}>#</th>
                <th style={{width: '30%'}}>Action</th>
                <th style={{width: '30%'}}>Expected Result</th>
                <th style={{width: '25%'}}>Precondition (Step)</th>
                <th style={{width: '30px'}}></th>
              </tr>
            </thead>
            <tbody>
              {formData.steps.map((step, index) => (
                <tr 
                  key={index}
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  className={draggedIndex === index ? "ctc-row-dragging" : "ctc-step-row"}
                >
                  <td className="ctc-drag-handle">⠿</td>
                  <td className="ctc-id-cell ctc-center-text">{step.step_no}</td>
                  <td className="ctc-p-0">
                    <textarea 
                      className="ctc-cell-input" 
                      placeholder="Action..."
                      value={step.action} 
                      onChange={e => updateStep(index, "action", e.target.value)} 
                    />
                  </td>
                  <td className="ctc-p-0">
                    <textarea 
                      className="ctc-cell-input" 
                      placeholder="Expected..." 
                      value={step.expected_result} 
                      onChange={e => updateStep(index, "expected_result", e.target.value)} 
                    />
                  </td>
                   <td className="ctc-p-0">
                    <textarea 
                      className="ctc-cell-input" 
                      placeholder="(Optional)" 
                      value={step.precondition} 
                      onChange={e => updateStep(index, "precondition", e.target.value)} 
                    />
                  </td>
                  <td className="ctc-center-text">
                    {formData.steps.length > 1 && (
                      <button className="ctc-btn-icon-danger" tabIndex="-1" onClick={() => removeStep(index)}>×</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateTestCase;
