import useAPI from "../store/useAPI";
import useAppStore from "../store/useAppStore";

const AppHeader = () => {
  const { toggleTheme, isDark } = useAPI();
  const { openNotification } = useAppStore();

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
          <input type="text" placeholder="Search Pulse, posts, peoples..." />
        </div>
      </div>

      {/* <nav className="nav-tabs">
        <button className="tab-btn active">
          <i className="fa-solid fa-house"></i> Home
        </button>
        <button className="tab-btn">
          <i className="fa-solid fa-fire"></i> Trending
        </button>
        <button className="tab-btn">
          <i className="fa-solid fa-users"></i> Communities
        </button>
        <button className="tab-btn">
          <i className="fa-solid fa-clapperboard"></i> Media
        </button>
      </nav> */}

      <div className="nav-actions">
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
        <button className="icon-btn" title="Messages">
          <i className="fa-solid fa-paper-plane"></i>
          <span className="badge-dot"></span>
        </button>
        <button
          onClick={openNotification}
          className="icon-btn"
          title="Notifications"
        >
          <i className="fa-solid fa-bell"></i>
          <span className="badge-dot"></span>
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
