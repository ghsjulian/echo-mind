import useAppStore from "../store/useAppStore";

const AppMobileBar = () => {
  const { openAI, openProfile, isProfile } = useAppStore();
  return (
    <nav className="mobile-bottom-nav">
      <a
        onClick={(e) => {
          e.preventDefault();
          openProfile();
        }}
        href="#"
        className={` mobile-nav-item ${!isProfile ? "active" : ""}`}
      >
        <i className="fa-solid fa-house"></i>
        <span>Feed</span>
      </a>
      <a href="#" className="mobile-nav-item">
        <i className="fa-solid fa-fire"></i>
        <span>Explore</span>
      </a>
      <a href="#" className="mobile-nav-item">
        <i
          className="fa-solid fa-plus-circle"
          style={{ fontSize: "22px", color: "var(--accent-color)" }}
        ></i>
        <span>Post</span>
      </a>
      <a
        onClick={(e) => {
          e.preventDefault();
          openProfile();
        }}
        href="#"
        className={` mobile-nav-item ${isProfile ? "active" : ""}`}
      >
        <i className="fa-solid fa-user"></i>
        <span>Profile</span>
      </a>
      <a
        onClick={(e) => {
          (e.preventDefault(), openAI());
        }}
        href="#"
        className="mobile-nav-item"
      >
        <i className="fa-solid fa-hand-holding-heart"></i>
        <span>AI Chat</span>
      </a>
    </nav>
  );
};

export default AppMobileBar;
