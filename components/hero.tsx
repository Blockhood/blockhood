import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-flex">
            <div className="hero-logo">
              <Image
                src="/blockhood-logo.png"
                alt="Blockhood Logo"
                width={180}
                height={180}
              />
            </div>
            <div className="hero-main-text">
              <h1 className="reveal">
                Welcome to <span>Blockhood</span> Community
              </h1>
              <p className="reveal">
                Your friendly Web3 community built to help beginners navigate
                the blockchain world. Learn, connect, and grow together in the
                decentralized space.
              </p>
            </div>
          </div>
          <div className="hero-cta reveal">
            <Link href="/guides" className="cta-button cta-primary">
              <i className="fas fa-book"></i> Explore Guides
            </Link>
            <a
              href="https://discord.gg/8R4rJVkWdP"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button cta-secondary"
            >
              <i className="fab fa-discord"></i> Join our Discord
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
