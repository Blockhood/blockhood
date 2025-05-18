export default function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <h2 className="section-title reveal">Why Join Blockhood?</h2>
        <div className="features-grid">
          <div className="feature-card reveal">
            <div className="feature-icon floating">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h3>Learn Web3 Fundamentals</h3>
            <p>
              Access beginner-friendly resources, guides, and tutorials to understand blockchain technology,
              cryptocurrencies, and decentralized applications.
            </p>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon floating">
              <i className="fas fa-users"></i>
            </div>
            <h3>Supportive Community</h3>
            <p>
              Connect with like-minded individuals, from beginners to experts, all willing to share knowledge and help
              you on your Web3 journey.
            </p>
          </div>
          <div className="feature-card reveal">
            <div className="feature-icon floating">
              <i className="fas fa-hands-helping"></i>
            </div>
            <h3>Mentorship & Guidance</h3>
            <p>
              Get personalized support and advice from experienced community members who have been through the Web3
              learning curve.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
