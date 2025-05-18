"use client"

import { useEffect } from "react"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Team from "@/components/team"
import Partners from "@/components/partners"
import Community from "@/components/community"

export default function Home() {
  useEffect(() => {
    // Reveal elements on scroll
    function reveal() {
      const reveals = document.querySelectorAll(".reveal")

      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight
        const elementTop = reveals[i].getBoundingClientRect().top
        const elementVisible = 150

        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active")
        }
      }
    }

    // Trigger reveal on page load and scroll
    window.addEventListener("load", reveal)
    window.addEventListener("scroll", () => {
      reveal()

      // Header scroll effect
      const header = document.getElementById("header")
      if (window.scrollY > 50) {
        header?.classList.add("scrolled")
      } else {
        header?.classList.remove("scrolled")
      }
    })

    // Initial reveal call
    reveal()

    return () => {
      window.removeEventListener("load", reveal)
      window.removeEventListener("scroll", reveal)
    }
  }, [])

  return (
    <main>
      <Hero />
      <Features />
      <Team />
      <Partners />
      <Community />
    </main>
  )
}
