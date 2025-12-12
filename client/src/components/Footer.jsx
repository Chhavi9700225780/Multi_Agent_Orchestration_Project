import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <motion.div
          className="footer-brand"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Sparkles size={24} />
          <span className="footer-brand-text">Arogya Wellness Assistant</span>
        </motion.div>
        
        <motion.p
          className="footer-tagline"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          AI-Powered Multi-Agent Digital Wellness Platform
        </motion.p>
        
        <motion.div
          className="footer-tech"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span>Powered by</span>
          <strong>React</strong>
          <span>•</span>
          <strong>LangChain</strong>
          <span>•</span>
          <strong>Groq LLM</strong>
          <span>•</span>
          <strong>Flask</strong>
        </motion.div>
        
        <motion.div
          className="footer-love"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Made with <Heart size={16} className="footer-heart" /> for your wellness journey
        </motion.div>
        
        <motion.div
          className="footer-copyright"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          © 2025 Arogya Wellness Assistant. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
