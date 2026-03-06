import "./Team.css";

export default function Team() {
  const members = [
    {
      id: 1,
      name: "admin",
      role: "Product Owner",
      power: 0,
    },
  ];

  return (
    <div className="team">
      {/* HEADER */}
      <h2 className="team__title">Team</h2>

      <div className="team__layout">
        {/* LEFT FILTERS */}
        <aside className="team__filters">
          <h4>Filters</h4>

          <input
            className="team__search"
            placeholder="Search by full name..."
          />

          <div className="team__roles">
            <div className="role active">ALL</div>
            <div className="role">PRODUCT OWNER</div>
          </div>
        </aside>

        {/* MAIN LIST */}
        <section className="team__list">
          {/* TABLE HEADER */}
          <div className="team__row team__row--header">
            <span>Member</span>
            <span>Mr. Wolf</span>
            <span>Bug Hunter</span>
            <span>Night Shift</span>
            <span>Total Power</span>
          </div>

          {/* MEMBERS */}
          {members.map((m) => (
            <div key={m.id} className="team__row">
              <div className="member">
                <div className="avatar">🦊</div>
                <div>
                  <strong>{m.name}</strong>
                  <div className="role-text">{m.role}</div>
                  <div className="leave">✕ Leave this project</div>
                </div>
              </div>

              <span className="icon disabled">📁</span>
              <span className="icon disabled">🐞</span>
              <span className="icon disabled">🌙</span>
              <span>{m.power}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}