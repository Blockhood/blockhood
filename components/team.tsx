"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Team() {
  const teamsContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const teamsContainer = teamsContainerRef.current;
    const carousel = carouselRef.current;

    if (!teamsContainer || !carousel) return;

    const originalLogos = Array.from(carousel.children);
    const count = originalLogos.length;

    if (count > 0) {
      teamsContainer.classList.add("has-fades");
    }

    if (count >= 5) {
      // Duplicate items for seamless looping
      originalLogos.forEach((item) => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
      });

      let isDown = false;
      let startX: number;
      let scrollLeftStart: number;
      let velX = 0;
      let momentumID: NodeJS.Timeout | null = null;
      let autoScrollID: NodeJS.Timeout | null = null;
      let isHovering = false;
      const autoScrollSpeed = 0.5; // pixels per frame

      function startAutoScroll() {
        if (isDown || isHovering) return;
        if (autoScrollID) clearInterval(autoScrollID);
        autoScrollID = setInterval(() => {
          if (isDown || isHovering || !carousel) {
            if (autoScrollID) clearInterval(autoScrollID);
            return;
          }
          carousel.scrollLeft += autoScrollSpeed;
          // Check if scrolled past the end of the first set of items
          if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
            carousel.scrollLeft = 0; // Loop back to the beginning
          }
        }, 16);
      }

      function stopAutoScroll() {
        if (autoScrollID) clearInterval(autoScrollID);
      }

      function startMomentumScroll() {
        if (isDown || !carousel) return;
        stopAutoScroll();
        if (momentumID) clearInterval(momentumID);
        momentumID = setInterval(() => {
          if (Math.abs(velX) < 0.1 && !isDown) {
            if (momentumID) clearInterval(momentumID);
            if (!isHovering) startAutoScroll();
            return;
          }
          if (carousel) {
            carousel.scrollLeft += velX;
            velX *= 0.92;

            // Looping logic for momentum scroll
            const halfScrollWidth = carousel.scrollWidth / 2;
            if (carousel.scrollLeft >= halfScrollWidth) {
              carousel.scrollLeft -= halfScrollWidth; // Loop back
            } else if (carousel.scrollLeft < 0) {
              carousel.scrollLeft += halfScrollWidth; // Loop forward if scrolled too far left
            }
          }
        }, 16);
      }

      const onPointerDown = (e: MouseEvent | TouchEvent) => {
        isDown = true;
        isHovering = true;
        if (carousel) {
          carousel.style.cursor = "grabbing";
          const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
          startX = pageX - (carousel.offsetLeft || 0);
          scrollLeftStart = carousel.scrollLeft;
        }
        stopAutoScroll();
        if (momentumID) clearInterval(momentumID);
        velX = 0;
      };

      const onPointerUp = () => {
        if (!isDown) return;
        isDown = false;
        isHovering = false;
        if (carousel) {
          carousel.style.cursor = "grab";
        }
        startMomentumScroll();
      };

      const onPointerMove = (e: MouseEvent | TouchEvent) => {
        if (!isDown || !carousel) return;
        e.preventDefault();
        const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
        const x = pageX - (carousel.offsetLeft || 0);
        const walk = (x - startX) * 1.5;
        const newScrollLeft = scrollLeftStart - walk;
        velX = newScrollLeft - carousel.scrollLeft;
        carousel.scrollLeft = newScrollLeft;
      };

      const onMouseEnter = () => {
        isHovering = true;
        stopAutoScroll();
      };

      const onMouseLeave = () => {
        isHovering = false;
        if (!isDown) {
          startMomentumScroll();
        }
      };

      carousel.addEventListener("mousedown", onPointerDown as any);
      carousel.addEventListener("mouseenter", onMouseEnter);
      carousel.addEventListener("mouseleave", onMouseLeave);
      carousel.addEventListener("touchstart", onPointerDown as any, {
        passive: false,
      });
      document.addEventListener("mouseup", onPointerUp);
      document.addEventListener("mousemove", onPointerMove as any);
      document.addEventListener("touchend", onPointerUp);
      document.addEventListener("touchmove", onPointerMove as any, {
        passive: false,
      });

      startAutoScroll();

      return () => {
        // Cleanup event listeners
        carousel.removeEventListener("mousedown", onPointerDown as any);
        carousel.removeEventListener("mouseenter", onMouseEnter);
        carousel.removeEventListener("mouseleave", onMouseLeave);
        carousel.removeEventListener("touchstart", onPointerDown as any);
        document.removeEventListener("mouseup", onPointerUp);
        document.removeEventListener("mousemove", onPointerMove as any);
        document.removeEventListener("touchend", onPointerUp);
        document.removeEventListener("touchmove", onPointerMove as any);
        if (autoScrollID) clearInterval(autoScrollID);
        if (momentumID) clearInterval(momentumID);
      };
    } else if (count > 0) {
      // Less than 5 teams: center them
      carousel.style.justifyContent = "center";
    } else {
      // No teams, hide fades
      teamsContainer.classList.remove("has-fades");
    }
  }, []);
  return (
    <section className="team-section" id="team">
      <div className="container">
        <h2 className="section-title reveal">Meet Our Team</h2>
        <div className="teams-container has-fades" ref={teamsContainerRef}>
          <div
            className="teams-carousel reveal"
            id="teamsCarousel"
            ref={carouselRef}
          >
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
      </div>
    </section>
  );
}
