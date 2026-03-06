import "./Export.css";

export default function Export() {
  return (
    <div className="export">
      <h2>Export</h2>

      <p className="export__desc">
        Export your project to save a backup or to create a new one based on this.
      </p>

      <button className="export__btn">EXPORT</button>

      <p className="export__help">
        <span>ⓘ</span>{" "}
        <a href="#" onClick={(e) => e.preventDefault()}>
          Do you need help? Check out our support page!
        </a>
      </p>
    </div>
  );
}
