import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Brain, 
  History, 
  Shield, 
  Zap, 
  MessageCircle,
  Users,
  CheckCircle,
  Sparkles 
} from "lucide-react";

function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <Users size={40} />,
      title: "True Multi-Agent System",
      description: "Dynamically controlled AI framework where specialized agents communicate through real handoff mechanisms for adaptive recommendations",
      gradient: "linear-gradient(135deg, #628141 0%, #8BAE66 100%)",
    },
    {
      icon: <History size={40} />,
      title: "Persistent Memory",
      description: "Conversation history stored using LangChain's ConversationBufferMemory for continuous, contextual wellness support",
      gradient: "linear-gradient(135deg, #8BAE66 0%, #A1BC98 100%)",
    },
    {
      icon: <Brain size={40} />,
      title: "LLM-Powered Classification",
      description: "Smart intent classifier determines if queries are wellness-related and provides appropriate responses",
      gradient: "linear-gradient(135deg, #A1BC98 0%, #D2DCB6 100%)",
    },
    {
      icon: <Shield size={40} />,
      title: "Safe & Reviewed Output",
      description: "Final Review Agent polishes all responses for clarity, safety, friendliness, and correctness",
      gradient: "linear-gradient(135deg, #628141 0%, #778873 100%)",
    },
   
    
   
    
  ];

  return (
    <section id="features" className="section-container features-section" ref={ref}>
      <div className="section-content">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-description">
            Everything you need for a complete AI-powered wellness experience
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <motion.div
                className="feature-card-icon-wrapper"
                style={{ background: feature.gradient }}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="feature-card-icon">
                  {feature.icon}
                </div>
              </motion.div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-description">{feature.description}</p>
              
              <motion.div
                className="feature-card-shine"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  delay: index * 0.2,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
