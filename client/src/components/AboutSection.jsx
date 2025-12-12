import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, Users, Zap, Shield } from "lucide-react";

function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <Brain size={32} />,
      title: "AI-Powered Intelligence",
      description: "Advanced multi-agent system using Google Gemini for smart health insights",
    },
    {
      icon: <Users size={32} />,
      title: "Multi-Agent Collaboration",
      description: "Four specialized agents working together for comprehensive wellness guidance",
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Recommendations",
      description: "Get personalized diet, fitness, and lifestyle advice in seconds",
    },
    {
      icon: <Shield size={32} />,
      title: "Safe & Supportive",
      description: "Contextual memory ensures continuous, personalized support for your journey",
    },
  ];

  return (
    <section id="about" className="section-container" ref={ref}>
      <div className="section-content">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">What is Arogya?</h2>
          <p className="section-description">
            Arogya Wellness Orchestrator is an AI-driven multi-agent wellness support system
            designed for students and working professionals who face everyday health challenges
            such as stress, tiredness, irregular eating habits, and lack of physical activity.
          </p>
        </motion.div>

        <div className="about-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="about-card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="about-card-icon">{feature.icon}</div>
              <h3 className="about-card-title">{feature.title}</h3>
              <p className="about-card-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
