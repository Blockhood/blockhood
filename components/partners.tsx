"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export default function Partners() {
  const partnersContainerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const partnersContainer = partnersContainerRef.current
    const carousel = carouselRef.current

    if (!partnersContainer || !carousel) return

    const originalLogos = Array.from(carousel.children)
    const count = originalLogos.length

    if (count > 0) {
      partnersContainer.classList.add("has-fades")
    }

    if (count >= 5) {
      // Duplicate items for seamless looping
      originalLogos.forEach((item) => {
        const clone = item.cloneNode(true)
        carousel.appendChild(clone)
      })

      let isDown = false
      let startX: number
      let scrollLeftStart: number
      let velX = 0
      let momentumID: NodeJS.Timeout | null = null
      let autoScrollID: NodeJS.Timeout | null = null
      let isHovering = false
      const autoScrollSpeed = 0.5 // pixels per frame

      function startAutoScroll() {
        if (isDown || isHovering) return
        if (autoScrollID) clearInterval(autoScrollID)
        autoScrollID = setInterval(() => {
          if (isDown || isHovering || !carousel) {
            if (autoScrollID) clearInterval(autoScrollID)
            return
          }
          carousel.scrollLeft += autoScrollSpeed
          // Check if scrolled past the end of the first set of items
          if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
            carousel.scrollLeft = 0 // Loop back to the beginning
          }
        }, 16)
      }

      function stopAutoScroll() {
        if (autoScrollID) clearInterval(autoScrollID)
      }

      function startMomentumScroll() {
        if (isDown || !carousel) return
        stopAutoScroll()
        if (momentumID) clearInterval(momentumID)
        momentumID = setInterval(() => {
          if (Math.abs(velX) < 0.1 && !isDown) {
            if (momentumID) clearInterval(momentumID)
            if (!isHovering) startAutoScroll()
            return
          }
          if (carousel) {
            carousel.scrollLeft += velX
            velX *= 0.92

            // Looping logic for momentum scroll
            const halfScrollWidth = carousel.scrollWidth / 2
            if (carousel.scrollLeft >= halfScrollWidth) {
              carousel.scrollLeft -= halfScrollWidth // Loop back
            } else if (carousel.scrollLeft < 0) {
              carousel.scrollLeft += halfScrollWidth // Loop forward if scrolled too far left
            }
          }
        }, 16)
      }

      const onPointerDown = (e: MouseEvent | TouchEvent) => {
        isDown = true
        isHovering = true
        if (carousel) {
          carousel.style.cursor = "grabbing"
          const pageX = "touches" in e ? e.touches[0].pageX : e.pageX
          startX = pageX - (carousel.offsetLeft || 0)
          scrollLeftStart = carousel.scrollLeft
        }
        stopAutoScroll()
        if (momentumID) clearInterval(momentumID)
        velX = 0
      }

      const onPointerUp = () => {
        if (!isDown) return
        isDown = false
        isHovering = false
        if (carousel) {
          carousel.style.cursor = "grab"
        }
        startMomentumScroll()
      }

      const onPointerMove = (e: MouseEvent | TouchEvent) => {
        if (!isDown || !carousel) return
        e.preventDefault()
        const pageX = "touches" in e ? e.touches[0].pageX : e.pageX
        const x = pageX - (carousel.offsetLeft || 0)
        const walk = (x - startX) * 1.5
        const newScrollLeft = scrollLeftStart - walk
        velX = newScrollLeft - carousel.scrollLeft
        carousel.scrollLeft = newScrollLeft
      }

      const onMouseEnter = () => {
        isHovering = true
        stopAutoScroll()
      }

      const onMouseLeave = () => {
        isHovering = false
        if (!isDown) {
          startMomentumScroll()
        }
      }

      carousel.addEventListener("mousedown", onPointerDown as any)
      carousel.addEventListener("mouseenter", onMouseEnter)
      carousel.addEventListener("mouseleave", onMouseLeave)
      carousel.addEventListener("touchstart", onPointerDown as any, { passive: false })
      document.addEventListener("mouseup", onPointerUp)
      document.addEventListener("mousemove", onPointerMove as any)
      document.addEventListener("touchend", onPointerUp)
      document.addEventListener("touchmove", onPointerMove as any, { passive: false })

      startAutoScroll()

      return () => {
        // Cleanup event listeners
        carousel.removeEventListener("mousedown", onPointerDown as any)
        carousel.removeEventListener("mouseenter", onMouseEnter)
        carousel.removeEventListener("mouseleave", onMouseLeave)
        carousel.removeEventListener("touchstart", onPointerDown as any)
        document.removeEventListener("mouseup", onPointerUp)
        document.removeEventListener("mousemove", onPointerMove as any)
        document.removeEventListener("touchend", onPointerUp)
        document.removeEventListener("touchmove", onPointerMove as any)
        if (autoScrollID) clearInterval(autoScrollID)
        if (momentumID) clearInterval(momentumID)
      }
    } else if (count > 0) {
      // Less than 5 partners: center them
      carousel.style.justifyContent = "center"
    } else {
      // No partners, hide fades
      partnersContainer.classList.remove("has-fades")
    }
  }, [])

  return (
    <section className="partners-section" id="partners">
      <div className="container">
        <h2 className="section-title reveal">Our Partners</h2>
        <div className="partners-container" ref={partnersContainerRef}>
          <div className="partners-carousel reveal" id="partnersCarousel" ref={carouselRef}>
            <div className="partner-logo">
              <Image src="/coming-soon.png" alt="Partner 1 Logo" width={150} height={70} />
            </div>
            <div className="partner-logo">
              <Image src="/coming-soon.png" alt="Partner 2 Logo" width={150} height={70} />
            </div>
            <div className="partner-logo">
              <Image src="/coming-soon.png" alt="Partner 3 Logo" width={150} height={70} />
            </div>
            <div className="partner-logo">
              <Image src="/coming-soon.png" alt="Partner 4 Logo" width={150} height={70} />
            </div>
            <div className="partner-logo">
              <Image src="/coming-soon.png" alt="Partner 5 Logo" width={150} height={70} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
