export default function Community() {
  return (
    <section className="community" id="community">
      <div className="container">
        <div className="community-container">
          <h2 className="section-title reveal">Join Our Growing Community</h2>
          <p className="reveal lead-text">
            Blockhood is more than just a community – it's a movement to make Web3 accessible for everyone. Take your
            first step into the decentralized future today.
          </p>

          <div className="social-proof reveal">
            <div className="social-item">
              <div className="social-value">250+</div>
              <div className="social-label">Community Members</div>
            </div>
            <div className="social-item">
              <div className="social-value">100+</div>
              <div className="social-label">Daily Active Users</div>
            </div>
            <div className="social-item">
              <div className="social-value">10+</div>
              <div className="social-label">Success Stories</div>
            </div>
          </div>

          <div className="community-cta reveal">
            <a
              href="https://discord.gg/8R4rJVkWdP"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button cta-primary"
            >
              <i className="fab fa-discord"></i> Join our Discord
            </a>
            <a
              href="https://t.me/blockhoodid"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button cta-secondary"
            >
              <i className="fab fa-telegram"></i> Join our Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
