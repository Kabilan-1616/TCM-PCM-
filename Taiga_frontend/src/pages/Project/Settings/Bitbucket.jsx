import "./integrations.css";

export default function Bitbucket() {
  return (
    <div className="integration-page">
      <h2>Bitbucket</h2>

      <div className="form-group">
        <label>Secret key</label>
        <input placeholder="Secret key" />
      </div>

      <div className="form-group">
        <label>Payload URL</label>
        <div className="payload-row">
          <input
            readOnly
            value="http://localhost:9000/api/v1/bitbucket-hook?project=2"
          />
          <button className="icon-btn">📋</button>
        </div>
      </div>

      <div className="form-group">
        <label>Valid source IPs (separated by ,)</label>
        <input placeholder="13.52.5.96/28, 18.184.99.224/28" />
      </div>

      <button className="btn-primary">SAVE</button>

      <p className="help-link">
        Do you need help? Check out our support page!
      </p>
    </div>
  );
}
