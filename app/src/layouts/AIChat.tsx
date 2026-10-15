import useAppStore from "../store/useAppStore";
import "../styles/ai-chat.css";

const AIChat = () => {
  const { isAI, openAI } = useAppStore();
  return (
    <aside className={`sidebar-right ${isAI ? "active" : ""}`}>
      <div className="ai-widget-card">
        <div className="ai-widget-header">
          <div className="ai-title-wrap">
            <div className="ai-icon-sparkle">
              <i className="fa-solid fa-hand-holding-heart"></i>
            </div>
            <div className="ai-header-text">
              <h3>Emotional Support AI</h3>
              <span>24/7 Compassionate Listener</span>
            </div>
          </div>
          <button className="close-ai" onClick={openAI}>
            x
          </button>
        </div>

        <div className="ai-widget-body">
          <div className="ai-chat-box" id="aiChatBox">
            <div className="ai-msg bot">
              <div className="ai-avatar">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="ai-bubble">
                Hey! How is your health and mood today? I'm here to listen and
                help you connect with a friendly supporter if you need one. ❤️
              </div>
            </div>
            <div className="ai-msg user">
              <div className="ai-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="ai-bubble">hiiii</div>
            </div>
          </div>
          <div className="supporter-status-card" id="supporterStatusCard">
            <div className="match-loader" id="matchLoader">
              <div className="spinner"></div>
              <span id="matchStatusText">
                Searching for a compassionate supporter...
              </span>
            </div>
            <div
              className="supporter-profile"
              id="supporterProfile"
              style={{ display: "none" }}
            >
              <div className="supporter-avatar-wrap">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  className="supporter-avatar"
                  alt="Supporter Avatar"
                  id="supporterImg"
                />
                <div className="status-dot"></div>
              </div>
              <div className="supporter-info">
                <h4 id="supporterName">Sarah M.</h4>
                <p id="supporterRole">Peer Listener & Wellness Coach</p>
              </div>
            </div>
            <div
              className="supporter-actions"
              id="supporterActions"
              style={{ display: "none" }}
            >
              <button className="btn-action btn-primary">
                <i className="fa-solid fa-comments"></i> Chat Now
              </button>
              <button className="btn-action btn-secondary">
                <i className="fa-solid fa-phone"></i> Call
              </button>
            </div>
          </div>

          <div className="ai-input-area">
            <input
              type="text"
              id="aiInput"
              placeholder="Share how you're feeling..."
            />
            <button className="ai-send-btn">
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AIChat;
