import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignIn } from "@clerk/clerk-react";
import { Sparkles, Heart, Brain, Activity, X } from "lucide-react";

function AuthPage({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="auth-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="auth-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="auth-modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="auth-modal-grid">
            <motion.div
              className="auth-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="auth-logo">
                <Sparkles size={48} />
              </div>
              <h1 className="auth-title">
                Welcome to <span className="gradient-text">Arogya</span>
              </h1>
              <p className="auth-subtitle">
                Your AI-powered wellness companion for a healthier, happier life
              </p>
              
              <div className="auth-features">
                <motion.div
                  className="auth-feature"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Brain size={24} />
                  <span>Multi-Agent AI Intelligence</span>
                </motion.div>
                <motion.div
                  className="auth-feature"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Activity size={24} />
                  <span>Personalized Wellness Plans</span>
                </motion.div>
                <motion.div
                  className="auth-feature"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Heart size={24} />
                  <span>Holistic Health Support</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="auth-right"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="clerk-container">
                <SignIn 
                  appearance={{
                    elements: {
                      rootBox: "clerk-root-box",
                      card: "clerk-card",
                      headerTitle: "clerk-header-title",
                      headerSubtitle: "clerk-header-subtitle",
                      socialButtonsBlockButton: "clerk-social-button",
                      formButtonPrimary: "clerk-primary-button",
                      footerActionLink: "clerk-link",
                    }
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AuthPage;