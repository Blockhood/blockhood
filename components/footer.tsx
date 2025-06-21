import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="logo-footer">
          <Image
            src="/blockhood-logo.png"
            alt="Blockhood Logo"
            width={35}
            height={35}
          />
        </div>
        <p className="footer-tagline">
          Building a better Web3 future, together.
        </p>
        <div className="social-links">
          <a
            href="https://x.com/blockhoodid"
            className="social-link"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://discord.gg/8R4rJVkWdP"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Discord"
          >
            <i className="fab fa-discord"></i>
          </a>
          <a
            href="https://t.me/blockhoodid"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Telegram"
          >
            <i className="fab fa-telegram"></i>
          </a>
          <a href="#" className="social-link" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
        </div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Blockhood. All rights reserved.
          Empowering Web3 Beginners.
        </p>
      </div>
    </footer>
  );
}
