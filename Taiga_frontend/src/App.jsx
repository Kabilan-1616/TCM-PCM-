// // // import Discover from "./pages/Discover/Discover";

// // // function App() {
// // //   return <Discover />;
// // // }

// // // export default App;

// // // import Login from "./pages/Login/Login";

// // // function App() {
// // //   return <Login />;
// // // }

// // // export default App;

// // // App.jsx
// // import Dashboard from "./pages/Dashboard/Dashboard";

// // function App() {
// //   return <Dashboard />;
// // }

// // export default App;


// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/Dashboard/Dashboard";
// import CreateProject from "./pages/CreateProject";
// import Scrum from "./pages/CreateProject/Scrum";
// import Kanban from "./pages/CreateProject/Kanban";
// import Duplicate from "./pages/CreateProject/Duplicate";
// import ImportProject from "./pages/CreateProject/Import";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Dashboard />} />

//         <Route path="/project/new" element={<CreateProject />} />
//         <Route path="/project/new/scrum" element={<Scrum />} />
//         <Route path="/project/new/kanban" element={<Kanban />} />
//         <Route path="/project/new/duplicate" element={<Duplicate />} />
//         <Route path="/project/new/import" element={<ImportProject />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
