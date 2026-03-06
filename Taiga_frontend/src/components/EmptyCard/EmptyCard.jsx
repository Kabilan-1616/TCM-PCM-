import "./EmptyCard.css";

export default function EmptyCard({ onNewProject }) {
  return (
    <div className="empty-card">
      <p>You don’t have any project yet</p>
      <button onClick={onNewProject}>NEW PROJECT</button>
    </div>
  );
}