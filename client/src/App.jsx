import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import ChatInterface from "./components/ChatInterface";
import AuthPage from "./components/AuthPage";
import ProfileForm from "./components/ProfileForm";
import ProfilePage from "./components/ProfilePage";

import { API_BASE_URL } from "./config.js";
import "./styles/global.css";

const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_YOUR_KEY_HERE";

function AppContent() {
  const { user } = useUser();

  const [showChat, setShowChat] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);

  // ⭐ NEW: Track which section LandingPage should scroll to
  const [scrollTarget, setScrollTarget] = useState(null);

  // Load Profile After Login
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/profile/${user.id}`);
        const p = res.data?.profile;

        const hasProfile =
          p?.height_cm || p?.weight_kg || p?.medications;

        if (!hasProfile) setShowProfileForm(true);
      } catch {
        setShowProfileForm(true);
      }
    };

    checkProfile();
  }, [user]);

  // Handlers
  const handleGetStarted = () => {
  if (!user) {
    setShowAuthModal(true);
    return;
  }

  // If user is on profile page → close it
  setShowProfilePage(false);

  // If profile form incomplete → don't open chat
  if (showProfileForm) return;

  // Open chat
  setShowChat(true);
};


  const handleScrollRequest = (sectionId) => {
    // ALWAYS go back to landing page
    setShowChat(false);
    setShowProfilePage(false);

    // trigger scroll after landing renders
    setScrollTarget(sectionId);
  };

  const handleProfileSaved = () => setShowProfileForm(false);

  return (
    <div className="app-container">
      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuthModal && <AuthPage onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>

      <SignedOut>
  <Navbar 
    onShowAuth={() => setShowAuthModal(true)} 
    isLoggedIn={false}
    onScroll={handleScrollRequest}
  />
  <LandingPage 
    onGetStarted={() => setShowAuthModal(true)}
    scrollTarget={scrollTarget}
    onScrolled={() => setScrollTarget(null)}
  />
</SignedOut>

     <SignedIn>

  {/* Hide navbar when user is filling the profile form */}
  {!showProfileForm && (
    <Navbar
      onGetStarted={handleGetStarted}
      onViewProfile={() => setShowProfilePage(true)}
      isLoggedIn={true}
      onScroll={handleScrollRequest}
    />
  )}

  <AnimatePresence mode="wait">

    {showProfileForm ? (
      <ProfileForm
        userId={user?.id}
        fullName={user?.fullName}
        onProfileSaved={handleProfileSaved}
      />

    ) : showProfilePage ? (
      <ProfilePage
        userId={user?.id}
        onHome={() => setShowProfilePage(false)}
      />

    ) : showChat ? (
      <ChatInterface
        userId={user?.id}
        onBackToDashboard={() => setShowChat(false)}
      />

    ) : (
      <LandingPage
        onGetStarted={handleGetStarted}
        scrollTarget={scrollTarget}
        onScrolled={() => setScrollTarget(null)}
      />
    )}

  </AnimatePresence>

</SignedIn>

    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AppContent />
    </ClerkProvider>
  );
}
