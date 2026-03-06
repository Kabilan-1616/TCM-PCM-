import "./SkeletonItem.css";

export default function SkeletonItem() {
  return (
    <div className="skeleton-item">
      <div className="skeleton-avatar" />
      <div className="skeleton-lines">
        <div />
        <div />
      </div>
    </div>
  );
}