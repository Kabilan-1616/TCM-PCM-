import "./integrations.css";

export default function GitLab() {
  return (
    <div className="integration-page">
      <h2>Gitlab</h2>

      <div className="form-group">
        <label>Secret key</label>
        <input placeholder="Secret key" />
      </div>

      <div className="form-group">
        <label>Payload URL</label>
        <div className="payload-row">
          <input
            readOnly
            value="http://localhost:9000/api/v1/gitlab-hook?project=2"
          />
          <button className="icon-btn">📋</button>
        </div>
      </div>

      <div className="form-group">
        <label>Valid source IPs (separated by ,)</label>
        <input placeholder="Gitlab requests are not signed so the best way of verifying the origin is by IP." />
      </div>

      <button className="btn-primary">SAVE</button>

      <p className="help-link">
        Do you need help? Check out our support page!
      </p>
    </div>
  );
}
