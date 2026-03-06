import "./Reports.css";

const ReportBlock = ({ title }) => {
  return (
    <div className="report-block">
      <div className="report-block__header">{title}</div>

      <div className="report-block__body">
        <input
          type="text"
          placeholder="Please regenerate CSV url"
          disabled
        />

        <button className="icon-btn" title="Copy">
          📄
        </button>

        <button className="link-btn">+ Generate Url</button>
      </div>
    </div>
  );
};

export default function Reports() {
  return (
    <div className="reports">
      <h2>Reports</h2>

      <p className="reports__desc">
        Export your project data in CSV format and make your own reports.
      </p>

      <p className="reports__desc">
        Download a CSV file or copy the generated URL and open it in your
        favourite text editor or spreadsheet to make your own project data
        reports. You will be able to visualize and analyze all your data easily.
      </p>

      <ReportBlock title="EPICS REPORTS" />
      <ReportBlock title="USER STORIES REPORTS" />
      <ReportBlock title="TASKS REPORTS" />
      <ReportBlock title="ISSUES REPORTS" />

      <p className="reports__help">
        ⓘ How to use this on my own spreadsheet?
      </p>
    </div>
  );
}
