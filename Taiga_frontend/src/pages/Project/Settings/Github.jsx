import "./integrations.css";

export default function GitHub() {
  return (
    <div className="integration-page">
      <h2>GitHub</h2>

      <div className="form-group">
        <label>Secret key</label>
        <input placeholder="Secret key" />
      </div>

      <div className="form-group">
        <label>Payload URL</label>
        <div className="payload-row">
          <input
            readOnly
            value="http://localhost:9000/api/v1/github-hook?project=2"
          />
          <button className="icon-btn">📋</button>
        </div>
      </div>

      <button className="btn-primary">SAVE</button>

      <p className="help-link">
        Do you need help? Check out our support page!
      </p>
    </div>
  );
}
