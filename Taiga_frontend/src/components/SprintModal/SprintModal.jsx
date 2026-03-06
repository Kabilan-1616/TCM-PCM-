import { useState } from "react";
import "./SprintModal.css";

export default function SprintModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSave = () => {
    if (!name || !startDate || !endDate) return;

    onSave({
      name,
      start_date: startDate,
      end_date: endDate,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal sprint-modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2>New sprint</h2>

        <input
          placeholder="Sprint name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="date-row">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button className="primary-btn" onClick={handleSave}>
          SAVE
        </button>
      </div>
    </div>
  );
}
