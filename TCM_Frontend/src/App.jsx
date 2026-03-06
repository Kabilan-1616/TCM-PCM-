import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  matchPath,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect, forwardRef, useCallback } from "react";
import axios from "axios";

// --- STYLES ---
import "./App.css";

// --- COMPONENTS ---
import Header from "./Header";
import Navigator from "./Navigator";
import TestDesignSidebar from "./suites/TestDesignSidebar";
import TestDesign from "./suites/TestDesign";
import MainDashboard from "./dashboard/MainDashboard";

import Login from "./auth/Login";
import Register from "./auth/Register";
import ProjectList from "./projects/ProjectList";
import ProjectCreate from "./projects/ProjectCreate";
import TestPlanManagement from "./testplans/TestPlanManagement";
import ExecutionRun from "./execution/Execution";
import AssignTestCases from "./testplans/AssignTestCases";
import PlanTestCases from "./testplans/PlanTestCases";
import PlanHistoryReport from "./reports/PlanHistoryReport";
import RTMReport from "./reports/RTMReport";

const API = "http://127.0.0.1:8001";

/* ─────────────────────────────────────────────────────────────
   URL SYNCHRONIZER
   Keeps activeProject in sync when user navigates directly
   to a deep URL (e.g. paste a link, browser back/forward).
───────────────────────────────────────────────────────────── */
const UrlWatcher = ({ projects, activeProject, setActiveProject }) => {
  const location = useLocation();

  useEffect(() => {
    if (projects.length === 0) return;

    const match =
      matchPath("/TestDesign/:projectId/*", location.pathname) ||
      matchPath("/execution/:projectId/*", location.pathname) ||
      matchPath("/reports/history/:projectId", location.pathname) ||
      matchPath("/reports/rtm/:projectId", location.pathname) ||
      matchPath("/TestPlanManagement/:projectId", location.pathname);

    if (match?.params?.projectId) {
      const urlId = parseInt(match.params.projectId);
      if (!isNaN(urlId) && (!activeProject || activeProject.id !== urlId)) {
        const found = projects.find((p) => p.id === urlId);
        if (found) setActiveProject(found);
      }
    }
  }, [location.pathname, projects, activeProject, setActiveProject]);

  return null;
};

/* ─────────────────────────────────────────────────────────────
   LAYOUT WRAPPER
   Renders the global chrome (header + sidebar + navigator)
   around every authenticated page.
───────────────────────────────────────────────────────────── */
const Layout = forwardRef(function Layout(
  {
    children,
    activeProject,
    onProjectSelect,
    projects,
    user,
    onLogout,
    sidebarData,
    onCreatePlanClick,
    searchQuery,
    onSearchChange,
  },
  ref
) {
  const location = useLocation();
  const navigate = useNavigate();

  const hideOn = ["/", "/Login", "/Register"];
  const showLayout = !hideOn.includes(location.pathname);

  // Derive active suite / test-case from the current URL
  const matchTC = matchPath(
    "/TestDesign/:projectId/:suiteId/:testcaseId",
    location.pathname
  );
  const matchSuite = matchPath(
    "/TestDesign/:projectId/:suiteId",
    location.pathname
  );

  const activeSuiteId = matchTC?.params?.suiteId
    ? parseInt(matchTC.params.suiteId)
    : matchSuite?.params?.suiteId
    ? parseInt(matchSuite.params.suiteId)
    : null;

  const activeTestCaseId = matchTC?.params?.testcaseId
    ? parseInt(matchTC.params.testcaseId)
    : null;

  const handleAddSuite = () => {
    if (activeProject) navigate(`/TestDesign/${activeProject.id}`);
  };

  return (
    <div className="app-container">
      {showLayout && <Header user={user} onLogout={onLogout} />}

      <div className="app-body">
        {showLayout && (
          <TestDesignSidebar
            activeProject={activeProject}
            projects={projects}
            onProjectSelect={onProjectSelect}
            suites={sidebarData.suites}
            suiteTestCases={sidebarData.suiteTestCases}
            expandedSuites={sidebarData.expandedSuites}
            toggleSuite={sidebarData.toggleSuite}
            selectedSuiteId={activeSuiteId}
            selectedTestCaseId={activeTestCaseId}
            onAddSuite={handleAddSuite}
          />
        )}

        <div className="right-panel-wrapper">
          {showLayout && (
            <Navigator
              ref={ref}
              activeProject={activeProject}
              onCreatePlanClick={onCreatePlanClick}
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          )}

          <main className="app-content-scrollable">{children}</main>
        </div>
      </div>
    </div>
  );
});

/* ─────────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────────── */
function App() {
  // ── Auth ────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // ── Projects ────────────────────────────────────────────
  const [projects, setProjects] = useState([]);

  const [activeProject, setActiveProject] = useState(() => {
    try {
      const saved = localStorage.getItem("activeProject");
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // ── UI Shared State ─────────────────────────────────────
  const [isPlanModalOpen, setPlanModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Sidebar / Tree State ─────────────────────────────────
  const [suites, setSuites] = useState([]);
  const [suiteTestCases, setSuiteTestCases] = useState({});
  const [expandedSuites, setExpandedSuites] = useState({});

  // ── Load all projects ────────────────────────────────────
  const fetchAllProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/allprojects`);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // ── Load suites when active project changes ──────────────
  const loadSuites = useCallback(async (projectId) => {
    try {
      const res = await axios.get(`${API}/projects/${projectId}/suites`);
      setSuites(res.data || []);
    } catch (err) {
      console.error("Failed to load suites:", err);
    }
  }, []);

  useEffect(() => {
    if (activeProject?.id) {
      loadSuites(activeProject.id);
    } else {
      setSuites([]);
      setSuiteTestCases({});
      setExpandedSuites({});
    }
  }, [activeProject, loadSuites]);

  // ── Toggle suite expand / collapse (lazy-load TCs) ───────
  const toggleSuite = useCallback((suiteId) => {
    setExpandedSuites((prev) => {
      const willExpand = !prev[suiteId];
      if (willExpand) {
        axios
          .get(`${API}/suites/${suiteId}/testcases`)
          .then((res) =>
            setSuiteTestCases((prevTCs) => ({
              ...prevTCs,
              [suiteId]: res.data,
            }))
          )
          .catch(console.error);
      }
      return { ...prev, [suiteId]: willExpand };
    });
  }, []);

  /**
   * refreshSidebar(suiteId?)
   * ─────────────────────────
   * Called by TestDesign after any create / edit / delete.
   *  - Always re-fetches the suite list (handles new or deleted suites).
   *  - If a suiteId is supplied, also re-fetches that suite's test cases
   *    so the sidebar tree stays accurate.
   */
  const refreshSidebar = useCallback(
    async (suiteId = null) => {
      if (!activeProject?.id) return;

      // Re-fetch the suite list
      await loadSuites(activeProject.id);

      if (suiteId) {
        // Invalidate cached TCs for this suite and reload them
        setSuiteTestCases((prev) => {
          const next = { ...prev };
          delete next[suiteId];
          return next;
        });
        try {
          const res = await axios.get(`${API}/suites/${suiteId}/testcases`);
          setSuiteTestCases((prev) => ({ ...prev, [suiteId]: res.data }));
        } catch (err) {
          console.error("Failed to reload test cases:", err);
        }
      }
    },
    [activeProject, loadSuites]
  );

  // ── Auth handlers ────────────────────────────────────────
  const handleLoginSuccess = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    setActiveProject(null);
    localStorage.clear();
    window.location.href = "/Login";
  };

  // ── Project selection ────────────────────────────────────
  const handleProjectChange = useCallback((p) => {
    if (!p) {
      setActiveProject(null);
      localStorage.removeItem("activeProject");
    } else {
      setActiveProject(p);
      localStorage.setItem("activeProject", JSON.stringify(p));
    }
  }, []);

  // ── Bundle sidebar data for Layout ──────────────────────
  const sidebarData = {
    suites,
    suiteTestCases,
    expandedSuites,
    toggleSuite,
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <BrowserRouter>
      <UrlWatcher
        projects={projects}
        activeProject={activeProject}
        setActiveProject={handleProjectChange}
      />

      <Layout
        activeProject={activeProject}
        onProjectSelect={handleProjectChange}
        projects={projects}
        user={user}
        onLogout={handleLogout}
        sidebarData={sidebarData}
        onCreatePlanClick={() => setPlanModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <Routes>
          {/* ── Public ── */}
          <Route path="/Register" element={<Register />} />
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/MainDashboard" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Landing dashboard after login */}
          <Route
            path="/MainDashboard"
            element={
              <MainDashboard
                activeProject={activeProject}
                projects={projects}
                onProjectSelect={handleProjectChange}
              />
            }
          />
          <Route
            path="/Login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />


          {/* ── Projects ── */}
          <Route
            path="/ProjectList"
            element={
              <ProjectList
                onRefresh={fetchAllProjects}
                searchQuery={searchQuery}
              />
            }
          />
          <Route
            path="/ProjectCreate"
            element={<ProjectCreate onRefresh={fetchAllProjects} />}
          />

          {/* ── Test Design (single route, catches all sub-paths) ── */}
          <Route
            path="/TestDesign/:projectId?/:suiteId?/:testcaseId?"
            element={
              <TestDesign
                activeProject={activeProject}
                onSidebarRefresh={refreshSidebar}
              />
            }
          />

          {/* ── Test Plans ── */}
          <Route
            path="/TestPlanManagement/:projectId"
            element={
              <TestPlanManagement
                activeProject={activeProject}
                isPlanModalOpen={isPlanModalOpen}
                onClosePlanModal={() => setPlanModalOpen(false)}
                searchQuery={searchQuery}
              />
            }
          />
          <Route
            path="/AssignTestCases/:planId"
            element={<AssignTestCases />}
          />
          <Route path="/PlanTestCases/:planId" element={<PlanTestCases />} />

          {/* ── Execution ── */}
          <Route
            path="/execution/*"
            element={<ExecutionRun activeProject={activeProject} />}
          />

          {/* ── Reports ── */}
          <Route
            path="/reports/history/:projectId"
            element={<PlanHistoryReport />}
          />

          <Route 
          path="/reports/rtm/:projectId" 
          element={<RTMReport activeProject={activeProject} />} 
        />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
