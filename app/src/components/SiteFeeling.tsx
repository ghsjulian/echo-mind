const SiteFeeling = () => {
  const selectSimTag = (
    e: React.MouseEvent<HTMLButtonElement>,
    feeling: string,
  ): void => {
    console.log(e, feeling);
  };

  return (
    <section className="section-container" id="simulator">
      <div className="section-header">
        <span className="section-tag">Interactive Preview</span>
        <h2 className="section-title">Try The Emotional Support Simulator</h2>
        <p className="section-desc">
          Click on what you are experiencing right now to see how Pulse responds
          with instant care.
        </p>
      </div>

      <div className="simulator-wrapper">
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "16px",
            }}
          >
            Select how you're feeling:
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <button
              className="sim-tag-btn active"
              onClick={(e) => selectSimTag(e, "Anxious")}
            >
              😰 Anxious & Stressed
            </button>
            <button
              className="sim-tag-btn"
              onClick={(e) => selectSimTag(e, "Lonely")}
            >
              💔 Feeling Lonely
            </button>
            <button
              className="sim-tag-btn"
              onClick={(e) => selectSimTag(e, "Overwhelmed")}
            >
              🤯 Overwhelmed
            </button>
            <button
              className="sim-tag-btn"
              onClick={(e) => selectSimTag(e, "Unwell")}
            >
              🤒 Physically Unwell
            </button>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginTop: "16px",
            }}
          >
            * Pulse uses AI sentiment evaluation to recommend appropriate coping
            strategies and supporter matches.
          </p>
        </div>

        <div className="sim-result-box">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
                color: "var(--accent-primary)",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              <i className="fa-solid fa-heart-pulse"></i> AI Care Response
            </div>
            <p
              id="simResponseText"
              style={{
                fontSize: "15px",
                color: "var(--text-primary)",
                fontWeight: "500",
              }}
            >
              "Take a deep breath in... and out. It's completely valid to feel
              stressed. Let's get you connected to someone who can listen."
            </p>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border-color)",
              paddingTop: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              id="simSupporterStatus"
            >
              Recommended match: Stress & Anxiety Peer Listener
            </span>
            <a
              href="feed.html"
              className="btn btn-primary"
              style={{ padding: "6px 16px", fontSize: "12px" }}
            >
              Connect Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteFeeling;
