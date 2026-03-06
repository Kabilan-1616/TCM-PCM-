import "./Tabs.css";

export default function Tabs({ tabs, active }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`tab ${tab === active ? "active" : ""}`}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}