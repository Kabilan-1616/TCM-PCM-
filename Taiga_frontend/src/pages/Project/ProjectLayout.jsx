// import Header from "../../components/Header/Header";
// import Sidebar from "../../components/Sidebar/Sidebar";
// import { Outlet } from "react-router-dom";
// import "./Project.css";

// export default function ProjectLayout() {
//   return (
//     <>
//       <Header variant="dashboard" />
//       <div className="project-layout">
//         <Sidebar />
//         <main className="project-content">
//           <Outlet />
//         </main>
//       </div>
//     </>
//   );
// }

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./Project.css";

export default function ProjectLayout() {
  return (
    <>
      <Header variant="dashboard" />

      <div className="project-layout">
        <Sidebar />
        <main className="project-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}