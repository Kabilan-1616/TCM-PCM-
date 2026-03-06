import "./integrations.css";

export default function Webhooks() {
  return (
    <div className="integration-page">
      <h2>Webhooks</h2>

      <div className="webhooks-table">
        <div className="webhooks-header">
          <div>Name</div>
          <div>URL</div>
          <div></div>
        </div>

        <div className="webhooks-row">
          <input placeholder="Type the service name" />
          <input placeholder="Type the service payload url" />
          <input placeholder="Type the service secret key" />

          <button className="icon-btn success">✓</button>
          <button className="icon-btn danger">✕</button>
        </div>
      </div>

      <p className="help-link">
        Do you need help? Check out our support page!
      </p>
    </div>
  );
}
