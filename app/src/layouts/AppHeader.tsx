import useAPI from "../store/useAPI";
import useAppStore from "../store/useAppStore";

const AppHeader = () => {
  const { toggleTheme, isDark } = useAPI();
  const { openNotification, notifications, openAI, onlineCount } = useAppStore();

  return (
    <header className="navbar">
      <div className="left-bar">
        <a href="#" className="nav-brand">
          <div className="brand-logo">
            <img src="/icons/favicon.png" alt="Echo Mind" />
          </div>
        </a>

        <div className="nav-search">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" placeholder="Search echoes, thoughts, topics..." />
        </div>
      </div>

      <div className="nav-actions">
        {/* Real-time Online Users Badge */}
        <div
          title={`${onlineCount} anonymous users online now`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            background: "var(--bg-input)",
            padding: "6px 12px",
            borderRadius: "16px",
            color: "var(--text-secondary)",
            fontWeight: "600",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 6px #10b981",
            }}
          ></span>
          <span>{onlineCount} Online</span>
        </div>

        <button
          onClick={toggleTheme}
          className="icon-btn"
          id="themeToggle"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? (
            <i className="fa-solid fa-sun"></i>
          ) : (
            <i className="fa-solid fa-moon"></i>
          )}
        </button>

        <button
          onClick={openAI}
          className="icon-btn"
          title="AI Support & Secret Chat"
          style={{ color: "var(--accent-color)" }}
        >
          <i className="fa-solid fa-heart-pulse"></i>
        </button>

        <button
          onClick={openNotification}
          className="icon-btn"
          title="Notifications"
        >
          <i className="fa-solid fa-bell"></i>
          {notifications?.length > 0 && (
            <span className="badge-dot">{notifications?.length}</span>
          )}
        </button>

        <div className="nav-user">
          <div className="avatar-wrap">
            <img src="/icons/man.png" alt="User Avatar" className="avatar" />
            <span className="online-ring"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
