// // import { Routes, Route } from "react-router-dom";
// // import Dashboard from "../pages/Dashboard/Dashboard";
// // import CreateProject from "../pages/CreateProject/CreateProject";
// // import Scrum from "../pages/CreateProject/Scrum";
// // import ProjectLayout from "../pages/Project/ProjectLayout";
// // import Backlog from "../pages/Project/Backlog";
// // import Timeline from "../pages/Project/Timeline";
// // import Issues from "../pages/Project/Issues";

// // export default function AppRoutes() {
// //   return (
// //     <Routes>
// //       <Route path="/" element={<Dashboard />} />

// //       <Route path="/project/new" element={<CreateProject />} />
// //       <Route path="/project/new/scrum" element={<Scrum />} />

// //       {/* PROJECT AREA */}
// //       <Route path="/project/:slug" element={<ProjectLayout />}>
// //         <Route path="backlog" element={<Backlog />} />
// //         <Route path="timeline" element={<Timeline />} />
// //         <Route path="issues" element={<Issues />} />
// //       </Route>
// //     </Routes>
// //   );
// // // }


// // import { Routes, Route } from "react-router-dom";

// // import Dashboard from "../pages/Dashboard/Dashboard";

// // // Create Project flow
// // import CreateProject from "../pages/CreateProject";
// // import Scrum from "../pages/CreateProject/Scrum";
// // import Kanban from "../pages/CreateProject/Kanban";
// // import Duplicate from "../pages/CreateProject/Duplicate";
// // import ImportProject from "../pages/CreateProject/Import";

// // // Project area
// // import ProjectLayout from "../pages/Project/ProjectLayout";
// // import Backlog from "../pages/Project/Backlog";
// // import Timeline from "../pages/Project/Timeline";
// // import Issues from "../pages/Project/Issues";
// // import Team from "../pages/Project/Team";
// // import IssueDetail from "../pages/Project/IssueDetail";
// // import UserStoryDetail from "../pages/Project/UserStoryDetail";

// // export default function AppRoutes() {
// //   return (
// //     <Routes>
// //       {/* Home */}
// //       <Route path="/" element={<Dashboard />} />

// //       {/* Create Project */}
// //       <Route path="/project/new" element={<CreateProject />} />
// //       <Route path="/project/new/scrum" element={<Scrum />} />
// //       <Route path="/project/new/kanban" element={<Kanban />} />
// //       <Route path="/project/new/duplicate" element={<Duplicate />} />
// //       <Route path="/project/new/import" element={<ImportProject />} />

// //       {/* Project workspace */}
// //       <Route path="/project/:slug" element={<ProjectLayout />}>
// //         <Route path="timeline" element={<Timeline />} />
// //         <Route path="backlog" element={<Backlog />} />
// //         <Route path="us/:id" element={<UserStoryDetail />} />
// //         <Route path="issues" element={<Issues />} />
// //         <Route path="team" element={<Team />} /> 
// //         <Route path="issue/:id" element={<IssueDetail />} />

// //       </Route>
// //     </Routes>
// //   );
// // }

// import { Routes, Route } from "react-router-dom";

// import Dashboard from "../pages/Dashboard/Dashboard";

// // Create Project flow
// import CreateProject from "../pages/CreateProject";
// import Scrum from "../pages/CreateProject/Scrum";
// import Kanban from "../pages/CreateProject/Kanban";
// import Duplicate from "../pages/CreateProject/Duplicate";
// import ImportProject from "../pages/CreateProject/Import";

// // Project area
// import ProjectLayout from "../pages/Project/ProjectLayout";
// import Backlog from "../pages/Project/Backlog";
// import Timeline from "../pages/Project/Timeline";
// import Issues from "../pages/Project/Issues";
// import Team from "../pages/Project/Team";
// import IssueDetail from "../pages/Project/IssueDetail";
// import UserStoryDetail from "../pages/Project/UserStoryDetail";

// import SettingsLayout from "../pages/Project/Settings/SettingsLayout";

// // PROJECT
// import ProjectDetails from "../pages/Project/Settings/ProjectDetails";
// import Presets from "../pages/Project/Settings/Presets";
// import Modules from "../pages/Project/Settings/Modules";
// import Export from "../pages/Project/Settings/Export";
// import Reports from "../pages/Project/Settings/Reports";

// // ATTRIBUTES
// import Statuses from "../pages/Project/Settings/Statuses";
// import Points from "../pages/Project/Settings/Points";
// import Priorities from "../pages/Project/Settings/Priorities";
// import Severities from "../pages/Project/Settings/Severities";
// import Types from "../pages/Project/Settings/Types";
// import CustomFields from "../pages/Project/Settings/CustomFields";
// import Tags from "../pages/Project/Settings/Tags";
// import DueDates from "../pages/Project/Settings/DueDates";

// // MEMBERS
// import Members from "../pages/Project/Settings/Members";

// // PERMISSIONS
// import Permissions from "../pages/Project/Settings/Permissions";

// // INTEGRATIONS
// import Webhooks from "../pages/Project/Settings/Webhooks";
// import Github from "../pages/Project/Settings/Github";
// import Gitlab from "../pages/Project/Settings/Gitlab";
// import Bitbucket from "../pages/Project/Settings/Bitbucket";
// import Gogs from "../pages/Project/Settings/Gogs";


// export default function AppRoutes() {
//   return (
//     <Routes>
//       {/* Home */}
//       <Route path="/" element={<Dashboard />} />

//       {/* Create Project */}
//       <Route path="/project/new" element={<CreateProject />} />
//       <Route path="/project/new/scrum" element={<Scrum />} />
//       <Route path="/project/new/kanban" element={<Kanban />} />
//       <Route path="/project/new/duplicate" element={<Duplicate />} />
//       <Route path="/project/new/import" element={<ImportProject />} />

//       {/* Project workspace */}
//       <Route path="/project/:slug" element={<ProjectLayout />}>
//         <Route path="timeline" element={<Timeline />} />
//         <Route path="backlog" element={<Backlog />} />
//         <Route path="us/:id" element={<UserStoryDetail />} />
//         <Route path="issues" element={<Issues />} />
//         <Route path="issue/:id" element={<IssueDetail />} />
//         <Route path="team" element={<Team />} />

//         {/* ================= SETTINGS ================= */}
//         <Route path="admin" element={<SettingsLayout />}>
//           {/*
//           <Route index element={<ProjectDetails />} />
//           */}

//           {/* PROJECT */}
//           <Route path="project-profile/details" element={<ProjectDetails />} />
//           <Route path="project-profile/presets" element={<Presets />} />
//           <Route path="project-profile/modules" element={<Modules />} />
//           <Route path="project-profile/export" element={<Export />} />
//           <Route path="project-profile/reports" element={<Reports />} />

//           {/* ATTRIBUTES */}
//           <Route path="project-values/status" element={<Statuses />} />
//           <Route path="project-values/points" element={<Points />} />
//           <Route path="project-values/priorities" element={<Priorities />} />
//           <Route path="project-values/severities" element={<Severities />} />
//           <Route path="project-values/types" element={<Types />} />
//           <Route path="project-values/custom-fields" element={<CustomFields />} />
//           <Route path="project-values/tags" element={<Tags />} />
//           <Route path="project-values/due-dates" element={<DueDates />} />

//           {/* MEMBERS */}
//           <Route path="memberships" element={<Members />} />

//           {/* PERMISSIONS */}
//           <Route path="roles/:role" element={<Permissions />} />

//           {/* INTEGRATIONS */}
//           <Route path="third-parties/webhooks" element={<Webhooks />} />
//           <Route path="third-parties/github" element={<Github />} />
//           <Route path="third-parties/gitlab" element={<Gitlab />} />
//           <Route path="third-parties/bitbucket" element={<Bitbucket />} />
//           <Route path="third-parties/gogs" element={<Gogs />} />
//         </Route>
//       </Route>
//     </Routes>
//   );
// }

// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";

// /* PUBLIC PAGES */
// import Discover from "../pages/Discover/Discover";
// import Login from "../pages/Login/Login";

// /* DASHBOARD (optional later) */
// import Dashboard from "../pages/Dashboard/Dashboard";

// /* CREATE PROJECT */
// import CreateProject from "../pages/CreateProject";
// import Scrum from "../pages/CreateProject/Scrum";
// import Kanban from "../pages/CreateProject/Kanban";
// import Duplicate from "../pages/CreateProject/Duplicate";
// import ImportProject from "../pages/CreateProject/Import";

// /* PROJECT AREA */
// import ProjectLayout from "../pages/Project/ProjectLayout";
// import Backlog from "../pages/Project/Backlog";
// import Timeline from "../pages/Project/Timeline";
// import Issues from "../pages/Project/Issues";
// import Team from "../pages/Project/Team";
// import IssueDetail from "../pages/Project/IssueDetail";
// import UserStoryDetail from "../pages/Project/UserStoryDetail";

// /* SETTINGS */
// import SettingsLayout from "../pages/Project/Settings/SettingsLayout";
// import ProjectDetails from "../pages/Project/Settings/ProjectDetails";
// import Presets from "../pages/Project/Settings/Presets";
// import Modules from "../pages/Project/Settings/Modules";
// import Export from "../pages/Project/Settings/Export";
// import Reports from "../pages/Project/Settings/Reports";

// /* ATTRIBUTES */
// import Statuses from "../pages/Project/Settings/Statuses";
// import Points from "../pages/Project/Settings/Points";
// import Priorities from "../pages/Project/Settings/Priorities";
// import Severities from "../pages/Project/Settings/Severities";
// import Types from "../pages/Project/Settings/Types";
// import CustomFields from "../pages/Project/Settings/CustomFields";
// import Tags from "../pages/Project/Settings/Tags";
// import DueDates from "../pages/Project/Settings/DueDates";

// /* MEMBERS */
// import Members from "../pages/Project/Settings/Members";

// /* PERMISSIONS */
// import Permissions from "../pages/Project/Settings/Permissions";

// /* INTEGRATIONS */
// import Webhooks from "../pages/Project/Settings/Webhooks";
// import Github from "../pages/Project/Settings/Github";
// import Gitlab from "../pages/Project/Settings/Gitlab";
// import Bitbucket from "../pages/Project/Settings/Bitbucket";
// import Gogs from "../pages/Project/Settings/Gogs";

// export default function AppRoutes() {
//   return (
//     <Routes>

//       {/* ================= PUBLIC ================= */}
//       <Route path="/" element={<Discover />} />
//       <Route path="/discover" element={<Discover />} />
//       <Route path="/login" element={<Login />} />

//       {/* ================= PROTECTED ================= */}
//       <Route
//         element={
//           <ProtectedRoute>
//             <RoutesWrapper />
//           </ProtectedRoute>
//         }
//       />

//       {/* Catch-all */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// /* ================= PROTECTED ROUTES TREE ================= */

// function RoutesWrapper() {
//   return (
//     <Routes>

//       {/* CREATE PROJECT */}
//       <Route path="/project/new" element={<CreateProject />} />
//       <Route path="/project/new/scrum" element={<Scrum />} />
//       <Route path="/project/new/kanban" element={<Kanban />} />
//       <Route path="/project/new/duplicate" element={<Duplicate />} />
//       <Route path="/project/new/import" element={<ImportProject />} />

//       {/* PROJECT WORKSPACE */}
//       <Route path="/project/:slug" element={<ProjectLayout />}>
//         <Route path="timeline" element={<Timeline />} />
//         <Route path="backlog" element={<Backlog />} />
//         <Route path="us/:id" element={<UserStoryDetail />} />
//         <Route path="issues" element={<Issues />} />
//         <Route path="issue/:id" element={<IssueDetail />} />
//         <Route path="team" element={<Team />} />

//         {/* SETTINGS */}
//         <Route path="admin" element={<SettingsLayout />}>
//           <Route path="project-profile/details" element={<ProjectDetails />} />
//           <Route path="project-profile/presets" element={<Presets />} />
//           <Route path="project-profile/modules" element={<Modules />} />
//           <Route path="project-profile/export" element={<Export />} />
//           <Route path="project-profile/reports" element={<Reports />} />

//           <Route path="project-values/status" element={<Statuses />} />
//           <Route path="project-values/points" element={<Points />} />
//           <Route path="project-values/priorities" element={<Priorities />} />
//           <Route path="project-values/severities" element={<Severities />} />
//           <Route path="project-values/types" element={<Types />} />
//           <Route path="project-values/custom-fields" element={<CustomFields />} />
//           <Route path="project-values/tags" element={<Tags />} />
//           <Route path="project-values/due-dates" element={<DueDates />} />

//           <Route path="memberships" element={<Members />} />
//           <Route path="roles/:role" element={<Permissions />} />

//           <Route path="third-parties/webhooks" element={<Webhooks />} />
//           <Route path="third-parties/github" element={<Github />} />
//           <Route path="third-parties/gitlab" element={<Gitlab />} />
//           <Route path="third-parties/bitbucket" element={<Bitbucket />} />
//           <Route path="third-parties/gogs" element={<Gogs />} />
//         </Route>
//       </Route>

//     </Routes>
//   );
// }


import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

/* ================= PUBLIC ================= */
import Discover from "../pages/Discover/Discover";
import Login from "../pages/Login/Login";

/* ================= DASHBOARD ================= */
import Dashboard from "../pages/Dashboard/Dashboard";

import UserSettingsLayout from "../pages/UserSettings/UserSettingsLayout";
import UserProfile from "../pages/UserSettings/UserProfile";
import AccountSettings from "../pages/UserSettings/AccountSettings";
import Notifications from "../pages/UserSettings/Notifications";

/* ================= CREATE PROJECT ================= */
import CreateProject from "../pages/CreateProject";
import Scrum from "../pages/CreateProject/Scrum";
import Kanban from "../pages/CreateProject/Kanban";
import Duplicate from "../pages/CreateProject/Duplicate";
import ImportProject from "../pages/CreateProject/Import";

/* ================= PROJECT WORKSPACE ================= */
import ProjectLayout from "../pages/Project/ProjectLayout";
import Backlog from "../pages/Project/Backlog";
import Timeline from "../pages/Project/Timeline";
import Issues from "../pages/Project/Issues";
import Team from "../pages/Project/Team";
import IssueDetail from "../pages/Project/IssueDetail";
import UserStoryDetail from "../pages/Project/UserStoryDetail";
import Taskboard from "../pages/Taskboard/Taskboard";

/* ================= SETTINGS ================= */
import SettingsLayout from "../pages/Project/Settings/SettingsLayout";
import ProjectDetails from "../pages/Project/Settings/ProjectDetails";
import Presets from "../pages/Project/Settings/Presets";
import Modules from "../pages/Project/Settings/Modules";
import Export from "../pages/Project/Settings/Export";
import Reports from "../pages/Project/Settings/Reports";

/* ================= ATTRIBUTES ================= */
import Statuses from "../pages/Project/Settings/Statuses";
import Points from "../pages/Project/Settings/Points";
import Priorities from "../pages/Project/Settings/Priorities";
import Severities from "../pages/Project/Settings/Severities";
import Types from "../pages/Project/Settings/Types";
import CustomFields from "../pages/Project/Settings/CustomFields";
import Tags from "../pages/Project/Settings/Tags";
import DueDates from "../pages/Project/Settings/DueDates";


/* ================= MEMBERS ================= */
import Members from "../pages/Project/Settings/Members";

/* ================= PERMISSIONS ================= */
import Permissions from "../pages/Project/Settings/Permissions";

/* ================= INTEGRATIONS ================= */
import Webhooks from "../pages/Project/Settings/Webhooks";
import Github from "../pages/Project/Settings/Github";
import Gitlab from "../pages/Project/Settings/Gitlab";
import Bitbucket from "../pages/Project/Settings/Bitbucket";
import Gogs from "../pages/Project/Settings/Gogs";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ========= PUBLIC ========= */}
      <Route path="/" element={<Discover />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/login" element={<Login />} />

      {/* ========= DASHBOARD (AFTER LOGIN) ========= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ========= USER SETTINGS ========= */}
      <Route
        path="/user-settings"
        element={
          <ProtectedRoute>
            <UserSettingsLayout />
          </ProtectedRoute>
        }
      >
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="account" element={<AccountSettings />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>


      {/* ========= CREATE PROJECT ========= */}
      <Route
        path="/project/new"
        element={
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project/new/scrum"
        element={
          <ProtectedRoute>
            <Scrum />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project/new/kanban"
        element={
          <ProtectedRoute>
            <Kanban />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project/new/duplicate"
        element={
          <ProtectedRoute>
            <Duplicate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project/new/import"
        element={
          <ProtectedRoute>
            <ImportProject />
          </ProtectedRoute>
        }
      />

      {/* ========= PROJECT WORKSPACE ========= */}
      <Route
        path="/project/:slug"
        element={
          <ProtectedRoute>
            <ProjectLayout />
          </ProtectedRoute>
        }
      >
        <Route path="timeline" element={<Timeline />} />
        <Route path="taskboard/:sprintId" element={<Taskboard/>} />
        <Route path="backlog" element={<Backlog />} />
        <Route path="us/:id" element={<UserStoryDetail />} />
        <Route path="issues" element={<Issues />} />
        <Route path="issue/:id" element={<IssueDetail />} />
        <Route path="team" element={<Team />} />

        {/* ========= SETTINGS ========= */}
        <Route path="admin" element={<SettingsLayout />}>
          {/* PROJECT */}
          <Route path="project-profile/details" element={<ProjectDetails />} />
          <Route path="project-profile/presets" element={<Presets />} />
          <Route path="project-profile/modules" element={<Modules />} />
          <Route path="project-profile/export" element={<Export />} />
          <Route path="project-profile/reports" element={<Reports />} />

          {/* ATTRIBUTES */}
          <Route path="project-values/status" element={<Statuses />} />
          <Route path="project-values/points" element={<Points />} />
          <Route path="project-values/priorities" element={<Priorities />} />
          <Route path="project-values/severities" element={<Severities />} />
          <Route path="project-values/types" element={<Types />} />
          <Route path="project-values/custom-fields" element={<CustomFields />} />
          <Route path="project-values/tags" element={<Tags />} />
          <Route path="project-values/due-dates" element={<DueDates />} />

          {/* MEMBERS */}
          <Route path="memberships" element={<Members />} />

          {/* PERMISSIONS */}
          <Route path="roles/:role" element={<Permissions />} />

          {/* INTEGRATIONS */}
          <Route path="third-parties/webhooks" element={<Webhooks />} />
          <Route path="third-parties/github" element={<Github />} />
          <Route path="third-parties/gitlab" element={<Gitlab />} />
          <Route path="third-parties/bitbucket" element={<Bitbucket />} />
          <Route path="third-parties/gogs" element={<Gogs />} />
        </Route>
      </Route>

      {/* ========= FALLBACK ========= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
