import "./Presets.css";

const STATUS_OPTIONS = [
  "New",
  "Ready",
  "In progress",
  "Ready for test",
  "Done",
];

const ISSUE_TYPES = ["Bug", "Question", "Enhancement"];

const PRIORITIES = ["Low", "Normal", "High"];

const SEVERITIES = ["Low", "Normal", "High"];

const POINTS = ["?", "0", "1/2", "1", "2", "3", "5", "8", "10", "12", "20", "40"];

export default function Presets() {
  return (
    <div className="presets">
      <h2>Default values</h2>
      <p className="presets__subtitle">
        Set default values for all selector inputs.
      </p>

      <div className="presets__form">
        <PresetRow label="Epic status selector" options={STATUS_OPTIONS} />
        <PresetRow label="User story status selector" options={STATUS_OPTIONS} />
        <PresetRow label="Points selector" options={POINTS} />
        <PresetRow label="Task status selector" options={STATUS_OPTIONS} />
        <PresetRow label="Issue type selector" options={ISSUE_TYPES} />
        <PresetRow label="Issue status selector" options={STATUS_OPTIONS} />
        <PresetRow label="Priority selector" options={PRIORITIES} />
        <PresetRow label="Severity selector" options={SEVERITIES} />
      </div>

      <button className="save-btn">SAVE</button>
    </div>
  );
}

/* ---------- Row Component ---------- */

function PresetRow({ label, options }) {
  return (
    <div className="preset-row">
      <label>{label}</label>
      <select>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
