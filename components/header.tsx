"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "./auth-provider";
import AuthDialog from "./auth-dialog";
import { Menu, UserRound, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const raw = localStorage.getItem("sb-sbtscaztdlyqijvksdmo-auth-token");

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const userId = parsed?.user?.id;

        if (userId) {
          setUser(userId);
          return;
        } else {
          window.location.reload();
          return;
        }
      } catch (error) {
        console.error("Error parsing auth token:", error);

        window.location.reload();
        return;
      }
    }

    const fallbackId = localStorage.getItem("id") || user;

    if (fallbackId) {
      setUser(fallbackId);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header id="header" className={scrolled ? "scrolled" : ""}>
        <div className="container">
          <nav>
            <Link href="/" className="logo">
              <div className="logo-icon">
                <Image
                  src="/blockhood-logo.png"
                  alt="Blockhood Logo"
                  width={40}
                  height={40}
                />
              </div>
              Block<span>hood</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/guides"
                className="text-light dark:text-light hover:text-accent dark:hover:text-accent transition-colors relative group"
              >
                Guides
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/events"
                className="text-light dark:text-light hover:text-accent dark:hover:text-accent transition-colors relative group"
              >
                Events
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/careers"
                className="text-light dark:text-light hover:text-accent dark:hover:text-accent transition-colors relative group"
              >
                Careers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/ecosystems"
                className="text-light dark:text-light hover:text-accent dark:hover:text-accent transition-colors relative group"
              >
                Ecosystems
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            <div className="flex items-center md:gap-4">
              <ThemeToggle />

              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 rounded-2xl px-3 py-2 border border-gray-700 bg-darker hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={"/default_pp.jpg"}
                        alt={"profile"}
                        width={32}
                        height={32}
                      />
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 dropdown-menu">
                    <Link
                      href="/"
                      className="flex items-center px-4 py-2.5 text-accent hover:bg-gray-700/50 transition-colors"
                    >
                      <i className="fas fa-user mr-2"></i> Profile
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center px-4 py-2.5 text-accent hover:bg-gray-700/50 transition-colors"
                    >
                      <i className="fas fa-tachometer-alt mr-2"></i> Dashboard
                    </Link>
                    <div className="border-t border-gray-700 my-1 dropdown-divider"></div>
                    <button
                      onClick={() => {
                        logout();
                        setShowAuthDialog(true);
                        setUser(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2.5 text-accent hover:bg-gray-700/50 transition-colors"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthDialog(true)}
                  className="flex items-center gap-2 rounded-xl text-[1rem] font-medium transition-all duration-300 px-5 py-2.5 md:inline-flex md:border md:border-white md:bg-transparent md:text-white md:hover:bg-white md:hover:text-black md:hover:-translate-y-0.5 md:hover:shadow-lg"
                >
                  <span className="hidden md:inline">Join Us</span>
                  <span className="md:hidden inline">
                    <UserRound />
                  </span>
                </button>
              )}

              <button
                className="md:hidden text-light"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 bg-darker rounded-b-lg">
              <Link
                href="/guides"
                className="block py-2 px-4 text-light dark:text-light hover:text-accent dark:hover:text-accent hover:bg-gray-800/50 rounded-md transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Guides
              </Link>
              <Link
                href="/events"
                className="block py-2 px-4 text-light dark:text-light hover:text-accent dark:hover:text-accent hover:bg-gray-800/50 rounded-md transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/careers"
                className="block py-2 px-4 text-light dark:text-light hover:text-accent dark:hover:text-accent hover:bg-gray-800/50 rounded-md transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
              </Link>
            </div>
          )}
        </div>
        {/* Add hover effect styles for both light and dark modes */}
        <style jsx global>{`
          .group:hover .text-light {
            color: var(--accent);
          }
          .group span {
            background-color: var(--accent);
          }
          .light .group:hover .text-light {
            color: var(--accent);
          }
          .light .group span {
            background-color: var(--accent);
          }
        `}</style>
      </header>

      {showAuthDialog && (
        <AuthDialog onClose={() => setShowAuthDialog(false)} />
      )}
    </>
  );
}
