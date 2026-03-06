import "./EmptyStateCard.css";

export default function EmptyStateCard({ icon, text }) {
  return (
    <div className="empty-card">
      <div className="empty-card__icon">
        {icon === "heart" ? "♡" : "📈"}
      </div>
      <p>{text}</p>
    </div>
  );
}