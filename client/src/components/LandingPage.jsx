import React, { useEffect } from "react";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import WorkflowSection from "./WorkflowSection";
import FeaturesSection from "./FeaturesSection";

import PurposeSection from "./PurposeSection";
import Footer from "./Footer";

function LandingPage({ onGetStarted, scrollTarget, onScrolled }) {

  // 🔥 Auto-scroll when App asks LandingPage to scroll
  useEffect(() => {
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (onScrolled) onScrolled(); // tell parent "done"
      }, 250);
    }
  }, [scrollTarget]);

  return (
    <div className="landing-page">
      <HeroSection onGetStarted={onGetStarted} />
      <AboutSection />
      <WorkflowSection />
      <FeaturesSection />
    
      <PurposeSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
