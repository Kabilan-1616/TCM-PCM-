import "./TemplateOption.css";

export default function TemplateOption({ title, description, onClick }) {
  return (
    <div className="template-option" onClick={onClick}>
      <div className="template-option__left">
        <div className="template-option__icon" />
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="template-option__help">?</div>
    </div>
  );
}