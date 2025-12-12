import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserButton, useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Menu, X, Sparkles } from "lucide-react";

function Navbar({ onGetStarted, onViewProfile, isLoggedIn, onScroll }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "about", label: "About" },
    { id: "how-it-works", label: "How It Works" },
    { id: "features", label: "Features" },
    { id: "purpose", label: "Purpose" },
  ];

  return (
    <motion.nav
      className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">

        {/* LOGO */}
        <div className="navbar-logo">
  <img 
    src="./logo3.png"     // ⭐ correct for public folder
    alt="Arogya Logo"
    className="navbar-logo-img"
  />

  <div className="logo-text">
    <span className="logo-title">Arogya</span>
    <span className="logo-subtitle">Wellness Assistant</span>
  </div>
</div>

        {/* DESKTOP LINKS */}
        <div className="navbar-links flex justify-center desktop-only">
          {navLinks.map((link, idx) => (
            <motion.button
              key={link.id}
              onClick={() => onScroll(link.id)}   // ⭐ correct new function
              className="nav-link"
              whileHover={{ scale: 1.05 }}
            >
              {link.label}
            </motion.button>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="navbar-actions">
          {isLoggedIn ? (
            <>
              <motion.button
                onClick={onGetStarted}
                className="btn-primary navbar-cta"
                whileHover={{ scale: 1.05 }}
              >
                Get Started
              </motion.button>

              {/* Custom profile page */}
              <button onClick={onViewProfile} className="user-button-wrapper">
                <UserButton 
                  appearance={{ elements: { avatarBox: "pointer-events-none" } }}
                  afterSignOutUrl="/"
                />
              </button>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <motion.button className="btn-secondary navbar-auth-btn">
                  Login
                </motion.button>
              </SignInButton>

              <SignUpButton mode="modal">
                <motion.button className="btn-primary navbar-cta">
                  Sign Up
                </motion.button>
              </SignUpButton>
            </>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            className="mobile-menu-toggle mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMobileMenuOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onScroll(link.id); // ⭐ scroll from mobile also
              }}
              className="mobile-nav-link"
            >
              {link.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;
