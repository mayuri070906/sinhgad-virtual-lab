import { useEffect, useState } from "react";
import "./App.css";

import FCFS from "./components/FCFS";
import SJF from "./components/SJF";
import RR from "./components/RR";
import Bankers from "./components/Bankers";

const API_URL = "http://127.0.0.1:8000";

function App() {
  // Navigation & View States: 'home' | 'branches' | 'subjects' | 'progress'
  const [activeView, setActiveView] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchNotice, setBranchNotice] = useState(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [pendingTarget, setPendingTarget] = useState(null);
  const [authPromptMessage, setAuthPromptMessage] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authPassword2, setAuthPassword2] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Progress State
  const [remoteProgress, setRemoteProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);

  // =========================================================================
  // SUBJECTS & CURRICULUM DATA
  // =========================================================================

  const branches = [
    {
      id: "comp",
      name: "Computer Engineering",
      icon: "💻",
      badge: "Labs Active",
      badgeType: "active",
      description:
        "Explore core computing domains including Operating Systems, Data Structures, Algorithms, and DBMS with interactive simulations.",
      modulesCount: "3 Subjects • 22 Practicals",
      tags: ["Operating Systems", "Data Structures", "DBMS", "Algorithms"],
      isAvailable: true,
    },
    {
      id: "entc",
      name: "Electronics & Telecommunication",
      icon: "📡",
      badge: "In Development",
      badgeType: "dev",
      description:
        "Virtual simulations for Digital Signal Processing, Communication Systems, Microcontroller Architectures, and VLSI Design.",
      modulesCount: "4 Modules • Semester 4/5",
      tags: ["DSP", "Digital Comm", "Microcontrollers", "VLSI"],
      isAvailable: false,
      notice:
        "The Electronics & Telecommunication Virtual Lab modules are currently being prepared for the upcoming academic session. You can explore Computer Engineering practicals right now.",
    },
    {
      id: "mech",
      name: "Mechanical Engineering",
      icon: "⚙️",
      badge: "In Development",
      badgeType: "dev",
      description:
        "Interactive virtual apparatus for Thermodynamics, Fluid Dynamics, Theory of Machines, and Heat Transfer analysis.",
      modulesCount: "4 Modules • Semester 4/5",
      tags: ["Thermodynamics", "Fluid Mechanics", "TOM", "Heat Transfer"],
      isAvailable: false,
      notice:
        "The Mechanical Engineering Virtual Lab apparatus is currently being digitized. Please explore active Computer Engineering practicals in the meantime.",
    },
    {
      id: "civil",
      name: "Civil Engineering",
      icon: "🏗️",
      badge: "In Development",
      badgeType: "dev",
      description:
        "Computer-assisted experimental setups for Structural Analysis, Geotechnical Soil Testing, Surveying, and Hydraulic Engineering.",
      modulesCount: "4 Modules • Semester 4/5",
      tags: ["Structural Analysis", "Geotech", "Surveying", "Hydraulics"],
      isAvailable: false,
      notice:
        "The Civil Engineering Virtual Lab modules are scheduled for the next semester rollout. You can access the Computer Engineering lab modules immediately.",
    },
  ];

  const subjects = [
    {
      id: "ds",
      icon: "🌳",
      title: "Data Structures",
      short: "DS",
      description:
        "Learn data structures with concepts, algorithms and interactive visualizations.",
      topics: [
        "Arrays",
        "Linked List",
        "Stack",
        "Queue",
        "Trees",
        "Searching",
        "Sorting",
      ],
    },
    {
      id: "os",
      icon: "⚙️",
      title: "Operating System",
      short: "OS",
      description:
        "Understand operating system concepts, processes, scheduling, memory and deadlock.",
      topics: [
        "UNIX Operating System",
        "System Calls",
        "FCFS Scheduling",
        "SJF Scheduling",
        "Round Robin Scheduling",
        "Banker's Algorithm",
        "Page Replacement",
        "I/O Subsystem",
        "Memory Allocation",
      ],
    },
    {
      id: "dbms",
      icon: "🗄️",
      title: "DBMS",
      short: "DBMS",
      description:
        "Learn database concepts, SQL, normalization, transactions and indexing.",
      topics: [
        "Database Basics",
        "ER Model",
        "SQL",
        "Normalization",
        "Transactions",
        "Indexing",
      ],
    },
  ];

  const osPracticals = [
    {
      id: 1,
      title: "Study of UNIX Operating System",
      description:
        "Study UNIX operating system, commands, features and basic concepts.",
      type: "placeholder",
    },
    {
      id: 2,
      title: "Implementation of System Calls",
      description:
        "Implementation of system calls: fork(), exec(), suspend() and resume().",
      type: "placeholder",
    },
    {
      id: 3,
      title: "Implementation of FCFS Scheduling Algorithm",
      description:
        "Implement First Come First Serve CPU scheduling and calculate WT, TAT and averages.",
      type: "fcfs",
    },
    {
      id: 4,
      title: "Implementation of SJF (Non-Preemptive)",
      description:
        "Implement Shortest Job First non-preemptive scheduling and calculate WT and TAT.",
      type: "sjf",
    },
    {
      id: 5,
      title: "Implementation of Round Robin Scheduling Algorithm",
      description:
        "Implement Round Robin scheduling using a fixed time quantum.",
      type: "rr",
    },
    {
      id: 6,
      title: "Implementation of Banker's Algorithm",
      description:
        "Implement Banker's Algorithm for deadlock avoidance and check system safety.",
      type: "bankers",
    },
    {
      id: 7,
      title: "Simulation of Page Replacement Strategies",
      description:
        "Simulate FIFO, Optimal and LRU page replacement algorithms.",
      type: "placeholder",
    },
    {
      id: 8,
      title: "Study of I/O Subsystem",
      description:
        "Study input/output subsystem concepts and I/O management.",
      type: "placeholder",
    },
    {
      id: 9,
      title: "Memory Allocation Strategies",
      description:
        "Implement First Fit, Best Fit and Worst Fit memory allocation strategies.",
      type: "placeholder",
    },
  ];

  // Default progress structure showing subject-wise completion
  const defaultProgress = {
    total: 22,
    completed: 10,
    remaining: 12,
    percentage: 45,
    subjects: [
      {
        id: "os",
        title: "Operating System",
        icon: "⚙️",
        total: 9,
        completed: 4,
        remaining: 5,
        percentage: 44,
        practicals: [
          { id: 1, title: "Study of UNIX Operating System", status: "completed" },
          { id: 2, title: "Implementation of System Calls", status: "in_progress" },
          { id: 3, title: "Implementation of FCFS Scheduling Algorithm", status: "completed" },
          { id: 4, title: "Implementation of SJF (Non-Preemptive)", status: "completed" },
          { id: 5, title: "Implementation of Round Robin Scheduling Algorithm", status: "completed" },
          { id: 6, title: "Implementation of Banker's Algorithm", status: "in_progress" },
          { id: 7, title: "Simulation of Page Replacement Strategies", status: "pending" },
          { id: 8, title: "Study of I/O Subsystem", status: "pending" },
          { id: 9, title: "Memory Allocation Strategies", status: "pending" },
        ],
      },
      {
        id: "ds",
        title: "Data Structures",
        icon: "🌳",
        total: 7,
        completed: 4,
        remaining: 3,
        percentage: 57,
        practicals: [
          { id: 1, title: "Stack Operations & Visualizer", status: "completed" },
          { id: 2, title: "Queue Implementations", status: "completed" },
          { id: 3, title: "Singly Linked List Visualization", status: "completed" },
          { id: 4, title: "Doubly Linked List Operations", status: "in_progress" },
          { id: 5, title: "Searching Algorithms (Linear / Binary)", status: "pending" },
          { id: 6, title: "Sorting Algorithms (Bubble, Selection, Quick)", status: "completed" },
          { id: 7, title: "Binary Search Tree & Traversals", status: "pending" },
        ],
      },
      {
        id: "dbms",
        title: "DBMS",
        icon: "🗄️",
        total: 6,
        completed: 2,
        remaining: 4,
        percentage: 33,
        practicals: [
          { id: 1, title: "Database Concepts & Architecture", status: "completed" },
          { id: 2, title: "Entity-Relationship (ER) Modeling", status: "completed" },
          { id: 3, title: "SQL Schema & Query Execution", status: "in_progress" },
          { id: 4, title: "Relational Normalization Techniques", status: "pending" },
          { id: 5, title: "Transactions & ACID Properties", status: "pending" },
          { id: 6, title: "B-Tree Indexing Implementation", status: "pending" },
        ],
      },
    ],
  };

  const activeProgressData = remoteProgress || defaultProgress;

  // =========================================================================
  // AUTHENTICATION CHECK
  // =========================================================================

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(`${API_URL}/api/current-user/`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || { username: data.username, email: data.email });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkLogin();
  }, []);

  // Fetch Progress API if user is authenticated and on progress view
  useEffect(() => {
    if (isAuthenticated && activeView === "progress") {
      const fetchProgress = async () => {
        setProgressLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/progress/`, {
            method: "GET",
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            if (data && (data.total !== undefined || data.subjects)) {
              setRemoteProgress(data);
            }
          }
        } catch {
          // Graceful fallback to default progress
        } finally {
          setProgressLoading(false);
        }
      };

      fetchProgress();
    }
  }, [isAuthenticated, activeView]);

  // =========================================================================
  // NAVIGATION HANDLERS
  // =========================================================================

  const goHome = () => {
    setMobileMenuOpen(false);
    setSelectedExperiment(null);
    setSelectedSubject(null);
    setActiveView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToBranches = () => {
    setMobileMenuOpen(false);
    setSelectedExperiment(null);
    setSelectedSubject(null);
    setActiveView("branches");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToSubjects = () => {
    setMobileMenuOpen(false);
    setSelectedExperiment(null);
    setSelectedSubject(null);
    setActiveView("subjects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToProgress = () => {
    setMobileMenuOpen(false);
    if (!isAuthenticated) {
      openAuthModal(
        "login",
        { type: "view", view: "progress" },
        "Please sign in to view your laboratory progress and completion statistics."
      );
      return;
    }
    setSelectedExperiment(null);
    setSelectedSubject(null);
    setActiveView("progress");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubjectClick = (subject) => {
    if (!isAuthenticated) {
      openAuthModal(
        "login",
        { type: "subject", subject },
        `Please sign in to access ${subject.title} practical modules.`
      );
      return;
    }

    // DATA STRUCTURES: redirect to Django DS page
    if (subject.id === "ds") {
      window.location.href = "http://127.0.0.1:8000/data-structures/";
      return;
    }

    // OTHER SUBJECTS (OS, DBMS)
    setSelectedSubject(subject);
    setSelectedExperiment(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openExperiment = (experiment) => {
    setSelectedExperiment(experiment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackToPracticals = () => {
    setSelectedExperiment(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedExperiment(null);
    setActiveView("subjects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================================================================
  // AUTH MODAL & SUBMIT
  // =========================================================================

  const openAuthModal = (mode = "login", target = null, promptMsg = "") => {
    setAuthMode(mode);
    setPendingTarget(target);
    setAuthPromptMessage(promptMsg);
    setAuthError("");
    setAuthUsername("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthPassword2("");
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setAuthError("");
    setAuthUsername("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthPassword2("");

    if (pendingTarget) {
      const target = pendingTarget;
      setPendingTarget(null);

      if (target.type === "view") {
        setActiveView(target.view);
        setSelectedSubject(null);
        setSelectedExperiment(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (target.type === "subject") {
        const subject = target.subject;
        if (subject.id === "ds") {
          window.location.href = "http://127.0.0.1:8000/data-structures/";
          return;
        }
        setActiveView("subjects");
        setSelectedSubject(subject);
        setSelectedExperiment(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (target.type === "experiment") {
        setSelectedExperiment(target.experiment);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    // Default after manual login: direct to subjects view
    setActiveView("subjects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!authUsername.trim() || !authPassword) {
      setAuthError("Username and password are required.");
      return;
    }

    if (authMode === "register") {
      if (!authEmail.trim()) {
        setAuthError("Email is required.");
        return;
      }

      if (authPassword !== authPassword2) {
        setAuthError("Passwords do not match.");
        return;
      }
    }

    setAuthLoading(true);

    try {
      const endpoint =
        authMode === "login" ? "/api/login/" : "/api/register/";

      const body =
        authMode === "login"
          ? {
            username: authUsername.trim(),
            password: authPassword,
          }
          : {
            username: authUsername.trim(),
            email: authEmail.trim(),
            password: authPassword,
            password2: authPassword2,
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setAuthError(
          data.error ||
          data.message ||
          "Authentication failed. Please check your credentials."
        );
        return;
      }

      handleLoginSuccess(data.user);
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError(
        "Unable to connect to the server. Please verify the Django backend is running."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Logout request failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    setUser(null);
    setIsAuthenticated(false);
    setSelectedSubject(null);
    setSelectedExperiment(null);
    setActiveView("home");
    setMobileMenuOpen(false);
  };

  // =========================================================================
  // AUTH CHECK LOADING VIEW
  // =========================================================================

  if (checkingAuth) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-spinner"></div>
        <div className="auth-loading-title">🧪 Sinhgad Virtual Lab</div>
        <p className="auth-loading-sub">Connecting to educational services...</p>
      </div>
    );
  }

  // =========================================================================
  // EXPERIMENT VIEW (FCFS, SJF, RR, BANKERS, OR PLACEHOLDER)
  // =========================================================================

  if (selectedExperiment) {
    return (
      <div className="app">
        {/* TOP NAVBAR */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo" onClick={goHome}>
              <span className="logo-icon">🧪</span>
              <span className="logo-text">Sinhgad Virtual Lab</span>
            </div>

            <div className="nav-links">
              <button onClick={goHome}>Home</button>
              <button onClick={goToBranches}>All Branches</button>
              <button onClick={goBackToPracticals}>OS Practicals</button>
              <button onClick={goToProgress}>Progress</button>

              {isAuthenticated ? (
                <>
                  <div className="user-profile">
                    <span className="user-avatar">👤</span>
                    <span className="user-name">{user?.username}</span>
                  </div>
                  <button className="nav-btn-signout" onClick={handleLogout}>
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  className="nav-btn-primary"
                  onClick={() => openAuthModal("login")}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* BREADCRUMB STRIP */}
        <div className="breadcrumb-strip">
          <div className="breadcrumb-content">
            <span onClick={goHome} className="breadcrumb-link">
              Home
            </span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={goToBranches} className="breadcrumb-link">
              All Branches
            </span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={goToSubjects} className="breadcrumb-link">
              Computer Engineering
            </span>
            <span className="breadcrumb-sep">/</span>
            <span onClick={goBackToPracticals} className="breadcrumb-link">
              Operating System
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">
              {selectedExperiment.title}
            </span>
          </div>
        </div>

        {/* PRACTICAL IMPLEMENTATIONS */}
        {selectedExperiment.type === "fcfs" && <FCFS />}
        {selectedExperiment.type === "sjf" && <SJF />}
        {selectedExperiment.type === "rr" && <RR />}
        {selectedExperiment.type === "bankers" && <Bankers />}

        {selectedExperiment.type === "placeholder" && (
          <main className="subject-page">
            <section className="subject-header">
              <button className="back-button" onClick={goBackToPracticals}>
                ← Back to OS Practicals
              </button>

              <div className="large-subject-icon">🧪</div>

              <span className="section-label">
                SINHGAD VIRTUAL LAB / OS / EXPERIMENT{" "}
                {String(selectedExperiment.id).padStart(2, "0")}
              </span>

              <h1>{selectedExperiment.title}</h1>

              <p>{selectedExperiment.description}</p>

              <div className="placeholder-box">
                <div style={{ fontSize: "52px", marginBottom: "14px" }}>
                  🚧
                </div>

                <h2>Practical Module In Preparation</h2>

                <p>
                  This experimental module is being organized with comprehensive
                  theoretical notes, algorithm parameters, and interactive visual
                  components.
                </p>

                <button
                  className="hero-button"
                  onClick={goBackToPracticals}
                  style={{ marginTop: "18px" }}
                >
                  ← Back to OS Practicals
                </button>
              </div>
            </section>
          </main>
        )}

        <footer>
          <div className="footer-content">
            <div className="footer-logo">🧪 Sinhgad Virtual Lab</div>
            <p>Sinhgad Technical Education Society • Virtual Laboratory</p>
            <span>© 2026 Sinhgad Virtual Lab. All rights reserved.</span>
          </div>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // MAIN APPLICATION LAYOUT
  // =========================================================================

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="nav-container">
          {/* BRANDING */}
          <div className="logo" onClick={goHome}>
            <span className="logo-icon">🧪</span>
            <span className="logo-text">Sinhgad Virtual Lab</span>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* NAV LINKS */}
          <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <button
              className={
                activeView === "home" && !selectedSubject ? "active-link" : ""
              }
              onClick={goHome}
            >
              Home
            </button>

            <button
              className={
                activeView === "branches" ||
                  activeView === "subjects" ||
                  selectedSubject
                  ? "active-link"
                  : ""
              }
              onClick={goToBranches}
            >
              All Branches
            </button>

            <button
              className={activeView === "progress" ? "active-link" : ""}
              onClick={goToProgress}
            >
              Progress
            </button>

            {/* AUTH SECTION */}
            {isAuthenticated ? (
              <div className="nav-auth-group">
                <div className="user-profile" title={`Signed in as ${user?.username}`}>
                  <span className="user-avatar">👤</span>
                  <div className="user-info-text">
                    <span className="user-name">{user?.username}</span>
                    <span className="user-badge">Student</span>
                  </div>
                </div>

                <button
                  className="nav-btn-signout"
                  onClick={handleLogout}
                  title="Sign out of your account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="nav-auth-group">
                <button
                  className="nav-btn-signin"
                  onClick={() => openAuthModal("login")}
                >
                  Sign In
                </button>

                <button
                  className="nav-btn-register"
                  onClick={() => openAuthModal("register")}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= BREADCRUMB BAR (FOR SUB-PAGES) ================= */}
      {activeView !== "home" && (
        <div className="breadcrumb-strip">
          <div className="breadcrumb-content">
            <span onClick={goHome} className="breadcrumb-link">
              Home
            </span>

            {activeView === "branches" && (
              <>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">All Branches</span>
              </>
            )}

            {activeView === "subjects" && !selectedSubject && (
              <>
                <span className="breadcrumb-sep">/</span>
                <span onClick={goToBranches} className="breadcrumb-link">
                  All Branches
                </span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">
                  Computer Engineering
                </span>
              </>
            )}

            {selectedSubject && (
              <>
                <span className="breadcrumb-sep">/</span>
                <span onClick={goToBranches} className="breadcrumb-link">
                  All Branches
                </span>
                <span className="breadcrumb-sep">/</span>
                <span onClick={goBackToSubjects} className="breadcrumb-link">
                  Computer Engineering
                </span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">
                  {selectedSubject.title}
                </span>
              </>
            )}

            {activeView === "progress" && (
              <>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">Progress Dashboard</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW: HOME PAGE
          ===================================================================== */}
      {activeView === "home" && !selectedSubject && (
        <main>
          {/* HERO SECTION */}
          <section className="hero">
            <div className="hero-content">
              <div className="hero-badge">
                🏛️ Sinhgad Technical Education Society
              </div>

              <h1>Sinhgad Virtual Lab</h1>

              <p className="hero-subtitle">
                Interactive Learning Platform for Engineering Students
              </p>

              <p className="hero-desc">
                Access simulation-driven engineering laboratories, step-through
                algorithms in real-time, and reinforce core computer science
                concepts with hands-on practice.
              </p>

              <div className="hero-actions">
                <button className="hero-button" onClick={goToBranches}>
                  Explore Branches →
                </button>

                <button
                  className="hero-secondary-button"
                  onClick={goToProgress}
                >
                  View Progress
                </button>
              </div>

              {/* STATS STRIP */}
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">4</span>
                  <span className="stat-label">Engineering Branches</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">20+</span>
                  <span className="stat-label">Virtual Practicals</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Interactive Visualizers</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Accessible Online</span>
                </div>
              </div>
            </div>
          </section>

          {/* LEARN BY VISUALIZING SECTION */}
          <section className="features-section">
            <div className="section-heading">
              <span className="section-label">METHODOLOGY</span>
              <h2>Learn by Visualizing</h2>
              <p>
                Transform abstract mathematical and algorithmic principles into
                intuitive visual interactions.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <div className="feature-tag">Conceptual Clarity</div>
                <h3>Interactive Concepts</h3>
                <p>
                  Understand core engineering concepts through structured
                  explanations, step breakdowns, and illustrative architectural
                  diagrams.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <div className="feature-tag">Step-by-Step Simulators</div>
                <h3>Algorithm Visualization</h3>
                <p>
                  Watch CPU scheduling, sorting routines, and pointer
                  manipulations run in real-time with playback controls and
                  dynamic state updates.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🧪</div>
                <div className="feature-tag">Hands-on Laboratory</div>
                <h3>Virtual Experiments</h3>
                <p>
                  Perform experiments with custom inputs, analyze process wait
                  times, verify deadlock-free allocations, and inspect immediate
                  results.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <div className="feature-tag">Skill Assessment</div>
                <h3>Practice & Quiz</h3>
                <p>
                  Test your algorithmic problem-solving abilities with
                  self-paced quizzes, input edge-case challenges, and practical
                  exercises.
                </p>
              </div>
            </div>

            {/* CALLOUT BANNER */}
            <div className="home-banner">
              <div className="home-banner-text">
                <h3>Ready to start your virtual experiments?</h3>
                <p>
                  Choose your engineering department and begin interactive
                  learning right from your browser.
                </p>
              </div>
              <button className="home-banner-btn" onClick={goToBranches}>
                Explore All Branches →
              </button>
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          VIEW: ALL BRANCHES PAGE
          ===================================================================== */}
      {activeView === "branches" && !selectedSubject && (
        <main>
          <section className="branches-section">
            <div className="section-heading">
              <span className="section-label">ENGINEERING DISCIPLINES</span>
              <h2>All Branches</h2>
              <p>
                Select your engineering discipline to access specialized
                virtual laboratories and practical experiment modules.
              </p>
            </div>

            <div className="branches-grid">
              {branches.map((branch) => (
                <div
                  className={`branch-card ${branch.isAvailable ? "branch-active" : "branch-pending"
                    }`}
                  key={branch.id}
                >
                  <div className="branch-card-header">
                    <div className="branch-icon">{branch.icon}</div>
                    <span className={`branch-badge ${branch.badgeType}`}>
                      {branch.badge}
                    </span>
                  </div>

                  <h3 className="branch-name">{branch.name}</h3>

                  <p className="branch-description">{branch.description}</p>

                  <div className="branch-meta">
                    <span className="branch-modules-count">
                      {branch.modulesCount}
                    </span>
                  </div>

                  <div className="branch-tags">
                    {branch.tags.map((tag) => (
                      <span key={tag} className="branch-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="branch-card-footer">
                    {branch.isAvailable ? (
                      <button
                        className="branch-explore-btn"
                        onClick={goToSubjects}
                      >
                        Explore Subjects →
                      </button>
                    ) : (
                      <button
                        className="branch-explore-btn branch-btn-outline"
                        onClick={() => setBranchNotice(branch)}
                      >
                        Explore Branch →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          VIEW: COMPUTER ENGINEERING → SUBJECTS PAGE
          ===================================================================== */}
      {activeView === "subjects" && !selectedSubject && (
        <main>
          <section className="subjects-section">
            <button className="back-link-btn" onClick={goToBranches}>
              ← Back to All Branches
            </button>

            <div className="section-heading">
              <span className="section-label">
                COMPUTER ENGINEERING • SEMESTER LABS
              </span>
              <h2>Computer Engineering Subjects</h2>
              <p>
                Select a subject to explore its concepts, algorithms, and
                interactive practical learning modules.
              </p>
            </div>

            <div className="subject-grid">
              {subjects.map((subject) => (
                <div
                  className="subject-card"
                  key={subject.id}
                  onClick={() => handleSubjectClick(subject)}
                >
                  <div className="subject-icon">{subject.icon}</div>

                  <div className="subject-code">{subject.short}</div>

                  <h3>{subject.title}</h3>

                  <p>{subject.description}</p>

                  <div className="topic-preview">
                    {subject.topics.slice(0, 4).map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                    {subject.topics.length > 4 && (
                      <span>+{subject.topics.length - 4} more</span>
                    )}
                  </div>

                  <div className="explore-link">
                    {subject.id === "ds"
                      ? "Launch DS Lab ↗"
                      : `Explore ${subject.short} Practicals →`}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          VIEW: SUBJECT DETAIL (OS PRACTICALS OR DBMS TOPICS)
          ===================================================================== */}
      {selectedSubject && (
        <main className="subject-page">
          {/* ================= OS PRACTICALS ================= */}
          {selectedSubject.id === "os" ? (
            <>
              <section className="subject-header">
                <button className="back-button" onClick={goBackToSubjects}>
                  ← Back to Subjects
                </button>

                <div className="large-subject-icon">⚙️</div>

                <span className="section-label">
                  SINHGAD VIRTUAL LAB / COMPUTER ENGINEERING / OS
                </span>

                <h1>Operating System</h1>

                <p>
                  Understand CPU scheduling, process management, synchronization,
                  and deadlock avoidance with interactive virtual simulations.
                </p>
              </section>

              <section className="topics-section">
                <div className="section-heading">
                  <span className="section-label">PRACTICAL EXPERIMENTS</span>
                  <h2>Operating System Practicals</h2>
                  <p>
                    Select an experiment to open the interactive simulation or
                    study guide.
                  </p>
                </div>

                <div className="topics-grid">
                  {osPracticals.map((experiment) => (
                    <div
                      className="topic-card"
                      key={experiment.id}
                      onClick={() => openExperiment(experiment)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="topic-number">
                        {String(experiment.id).padStart(2, "0")}
                      </div>

                      <div className="topic-content">
                        <div className="topic-header-row">
                          <h3>{experiment.title}</h3>
                          {["fcfs", "sjf", "rr", "bankers"].includes(
                            experiment.type
                          ) ? (
                            <span className="badge-interactive">
                              Interactive Lab
                            </span>
                          ) : (
                            <span className="badge-study">Study Guide</span>
                          )}
                        </div>

                        <p>{experiment.description}</p>

                        <button
                          className="topic-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openExperiment(experiment);
                          }}
                        >
                          Open Practical →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            /* ================= OTHER SUBJECTS (DBMS) ================= */
            <>
              <section className="subject-header">
                <button className="back-button" onClick={goBackToSubjects}>
                  ← Back to Subjects
                </button>

                <div className="large-subject-icon">
                  {selectedSubject.icon}
                </div>

                <span className="section-label">
                  SINHGAD VIRTUAL LAB / COMPUTER ENGINEERING /{" "}
                  {selectedSubject.short}
                </span>

                <h1>{selectedSubject.title}</h1>

                <p>{selectedSubject.description}</p>
              </section>

              <section className="topics-section">
                <div className="section-heading">
                  <span className="section-label">CURRICULUM TOPICS</span>
                  <h2>{selectedSubject.title} Topics</h2>
                  <p>
                    Select a topic to explore theoretical concepts, schema
                    designs, and queries.
                  </p>
                </div>

                <div className="topics-grid">
                  {selectedSubject.topics.map((topic, index) => (
                    <div className="topic-card" key={topic}>
                      <div className="topic-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="topic-content">
                        <h3>{topic}</h3>
                        <p>
                          Learn {topic.toLowerCase()} fundamentals, schema
                          formulations, relational queries, and practical
                          examples.
                        </p>
                        <button className="topic-action-btn">
                          Open Topic →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      )}

      {/* =====================================================================
          VIEW: PROGRESS DASHBOARD
          ===================================================================== */}
      {activeView === "progress" && !selectedSubject && (
        <main className="progress-page">
          <section className="progress-section">
            <div className="progress-header">
              <div className="progress-header-badge">
                🎓 Student Academic Dashboard
              </div>
              <h2>Laboratory Progress</h2>
              <p>
                Track your practical completion, milestone achievements, and
                subject-wise progress across all laboratory courses.
              </p>
              {user && (
                <div className="progress-student-pill">
                  <span>Student: <strong>{user.username}</strong></span>
                  {user.email && <span>• Email: {user.email}</span>}
                  <span>• Department: Computer Engineering</span>
                </div>
              )}
            </div>

            {progressLoading ? (
              <div className="progress-loading">
                <div className="auth-spinner"></div>
                <p>Loading your progress statistics...</p>
              </div>
            ) : (
              <>
                {/* 4 OVERVIEW METRIC CARDS */}
                <div className="progress-metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon blue-icon">📘</div>
                    <div className="metric-data">
                      <span className="metric-value">
                        {activeProgressData.total}
                      </span>
                      <span className="metric-title">Total Practicals</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon green-icon">✅</div>
                    <div className="metric-data">
                      <span className="metric-value">
                        {activeProgressData.completed}
                      </span>
                      <span className="metric-title">Completed Practicals</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon orange-icon">⏳</div>
                    <div className="metric-data">
                      <span className="metric-value">
                        {activeProgressData.remaining}
                      </span>
                      <span className="metric-title">Remaining Practicals</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-icon purple-icon">📈</div>
                    <div className="metric-data">
                      <span className="metric-value">
                        {activeProgressData.percentage}%
                      </span>
                      <span className="metric-title">
                        Overall Completion
                      </span>
                    </div>
                  </div>
                </div>

                {/* OVERALL COMPLETION PROGRESS BAR */}
                <div className="overall-progress-card">
                  <div className="progress-bar-header">
                    <span>Overall Practical Completion</span>
                    <span className="progress-bar-pct">
                      {activeProgressData.percentage}%
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${activeProgressData.percentage}%` }}
                    ></div>
                  </div>
                  <div className="progress-bar-subtext">
                    {activeProgressData.completed} out of{" "}
                    {activeProgressData.total} practical modules completed.
                  </div>
                </div>

                {/* SUBJECT-WISE PROGRESS */}
                <div className="subject-progress-section">
                  <div className="section-heading-left">
                    <h3>Subject-wise Progress</h3>
                    <p>
                      Detailed module and experiment breakdown for each course.
                    </p>
                  </div>

                  <div className="subject-progress-grid">
                    {activeProgressData.subjects.map((sub) => (
                      <div className="subject-progress-card" key={sub.id}>
                        <div className="sub-progress-header">
                          <div className="sub-progress-title-row">
                            <span className="sub-icon">{sub.icon}</span>
                            <div>
                              <h4>{sub.title}</h4>
                              <span className="sub-counts">
                                {sub.completed} / {sub.total} Practicals
                                Completed
                              </span>
                            </div>
                          </div>
                          <span className="sub-badge-pct">
                            {sub.percentage}%
                          </span>
                        </div>

                        <div className="progress-bar-track small-track">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${sub.percentage}%` }}
                          ></div>
                        </div>

                        <div className="practicals-checklist">
                          <h5>Curriculum Checklist:</h5>
                          <ul>
                            {sub.practicals.map((prac) => (
                              <li key={prac.id} className="checklist-item">
                                <span className={`status-indicator ${prac.status}`}>
                                  {prac.status === "completed" && "✓"}
                                  {prac.status === "in_progress" && "⏳"}
                                  {prac.status === "pending" && "•"}
                                </span>
                                <span className="checklist-title">
                                  {prac.title}
                                </span>
                                <span className={`status-pill ${prac.status}`}>
                                  {prac.status === "completed" && "Completed"}
                                  {prac.status === "in_progress" && "In Progress"}
                                  {prac.status === "pending" && "Pending"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="sub-card-footer">
                          {sub.id === "os" && (
                            <button
                              className="sub-action-btn"
                              onClick={() => {
                                const osSub = subjects.find(
                                  (s) => s.id === "os"
                                );
                                handleSubjectClick(osSub);
                              }}
                            >
                              Open OS Practicals →
                            </button>
                          )}
                          {sub.id === "ds" && (
                            <button
                              className="sub-action-btn"
                              onClick={() => {
                                const dsSub = subjects.find(
                                  (s) => s.id === "ds"
                                );
                                handleSubjectClick(dsSub);
                              }}
                            >
                              Launch DS Lab ↗
                            </button>
                          )}
                          {sub.id === "dbms" && (
                            <button
                              className="sub-action-btn"
                              onClick={() => {
                                const dbmsSub = subjects.find(
                                  (s) => s.id === "dbms"
                                );
                                handleSubjectClick(dbmsSub);
                              }}
                            >
                              Open DBMS Topics →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTTOM ACTION */}
                <div className="progress-bottom-cta">
                  <button className="hero-button" onClick={goToSubjects}>
                    Continue Practicals in Computer Engineering →
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
      )}

      {/* =====================================================================
          BRANCH NOTICE MODAL (FOR ENTC, MECH, CIVIL)
          ===================================================================== */}
      {branchNotice && (
        <div
          className="auth-modal-overlay"
          onClick={() => setBranchNotice(null)}
        >
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="auth-modal-close"
              onClick={() => setBranchNotice(null)}
              type="button"
            >
              ×
            </button>

            <div className="auth-modal-header">
              <div className="auth-modal-icon">{branchNotice.icon}</div>
              <h2>{branchNotice.name}</h2>
              <div className="branch-modal-badge">
                Curriculum In Preparation
              </div>
              <p style={{ marginTop: "14px", lineHeight: "1.7" }}>
                {branchNotice.notice}
              </p>
            </div>

            <div className="branch-modal-actions">
              <button
                className="auth-submit-button"
                onClick={() => {
                  setBranchNotice(null);
                  goToSubjects();
                }}
              >
                Go to Computer Engineering Labs →
              </button>
              <button
                className="branch-modal-cancel"
                onClick={() => setBranchNotice(null)}
              >
                Back to Branches
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          AUTHENTICATION MODAL (SIGN IN / REGISTER)
          ===================================================================== */}
      {showAuthModal && (
        <div
          className="auth-modal-overlay"
          onClick={() => setShowAuthModal(false)}
        >
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="auth-modal-close"
              onClick={() => setShowAuthModal(false)}
              type="button"
            >
              ×
            </button>

            <div className="auth-modal-header">
              <div className="auth-modal-icon">🧪</div>
              <h2>
                {authMode === "login"
                  ? "Sign In to Sinhgad Virtual Lab"
                  : "Create Student Account"}
              </h2>
              <p>
                {authPromptMessage ||
                  (authMode === "login"
                    ? "Sign in with your student credentials to access practicals and track progress."
                    : "Register to begin interactive experiments and save your laboratory records.")}
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div className="auth-tab-row">
              <button
                type="button"
                className={`auth-tab ${authMode === "login" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab ${authMode === "register" ? "active" : ""
                  }`}
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
              >
                Register
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              <label>Username</label>
              <input
                type="text"
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />

              {authMode === "register" && (
                <>
                  <label>College Email</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="student@sinhgad.edu"
                    autoComplete="email"
                    required
                  />
                </>
              )}

              <label>Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete={
                  authMode === "login" ? "current-password" : "new-password"
                }
                required
              />

              {authMode === "register" && (
                <>
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={authPassword2}
                    onChange={(e) => setAuthPassword2(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                  />
                </>
              )}

              {authError && <div className="auth-error">{authError}</div>}

              <button
                className="auth-submit-button"
                type="submit"
                disabled={authLoading}
              >
                {authLoading
                  ? "Authenticating..."
                  : authMode === "login"
                    ? "Sign In →"
                    : "Complete Registration →"}
              </button>
            </form>

            <div className="auth-switch">
              {authMode === "login" ? (
                <>
                  <span>New to Sinhgad Virtual Lab?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setAuthError("");
                      setAuthEmail("");
                      setAuthPassword2("");
                    }}
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  <span>Already registered?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError("");
                      setAuthEmail("");
                      setAuthPassword2("");
                    }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="footer-content">
          <div className="footer-logo">🧪 Sinhgad Virtual Lab</div>
          <p>
            Sinhgad Technical Education Society • Virtual Laboratory Learning
            Platform
          </p>
          <div className="footer-links">
            <button onClick={goHome}>Home</button>
            <span>•</span>
            <button onClick={goToBranches}>All Branches</button>
            <span>•</span>
            <button onClick={goToSubjects}>Computer Engineering</button>
            <span>•</span>
            <button onClick={goToProgress}>Progress</button>
          </div>
          <span className="footer-copy">
            © 2026 Sinhgad Virtual Lab. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;