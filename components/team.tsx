import Image from "next/image";

export default function Team() {
  return (
    <section className="team-section" id="team">
      <div className="container">
        <h2 className="section-title reveal">Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member-card reveal">
            <Image
              src="/images/founder.jpeg"
              alt="Wisearich.vl"
              className="team-member-img"
              width={120}
              height={120}
            />
            <h3>Wisearich.vl</h3>
            <p>Founder</p>
            <div className="team-member-socials">
              <a
                href="https://x.com/RichlyWise"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://linktr.ee/wisearich_"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="team-member-card reveal">
            <Image
              src="/images/Nesctfox.jpeg"
              alt="Nesctfox"
              className="team-member-img"
              width={120}
              height={120}
            />
            <h3>Nesctfox</h3>
            <p>Community Manager</p>
            <div className="team-member-socials">
              <a
                href="https://x.com/nestcfox"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="team-member-card reveal">
            <Image
              src="/images/BAGAZZ.jpeg"
              alt="BAGAZZ"
              className="team-member-img"
              width={120}
              height={120}
            />
            <h3>BAGAZZ</h3>
            <p>Collab Manager</p>
            <div className="team-member-socials">
              <a
                href="https://x.com/0xLamboe"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="team-member-card reveal">
            <Image
              src="/images/Belugaa.jpeg"
              alt="Belugaa"
              className="team-member-img"
              width={120}
              height={120}
            />
            <h3>Belugaa</h3>
            <p>CTO</p>
            <div className="team-member-socials">
              <a
                href="https://x.com/YourJungler"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="team-member-card reveal">
            <Image
              src="/images/gebeonchain.jpeg"
              alt="Belugaa"
              className="team-member-img"
              width={120}
              height={120}
            />
            <h3>Gebe</h3>
            <p>Graphic Designer</p>
            <div className="team-member-socials">
              <a
                href="https://x.com/gebeonchain"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div className="team-member-card reveal">
            <Image
              src="/images/Vandebenn.jpeg"
              alt="Belugaa"
              className="team-member-img"
              width={120}
              height={120}
            />
            <h3>VanDeBenn</h3>
            <p>Tech Developer</p>
            <div className="team-member-socials">
              <a
                href="https://x.com/VanDeBenn"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="team-social-link"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
