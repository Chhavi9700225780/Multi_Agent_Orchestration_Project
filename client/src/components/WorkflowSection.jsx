import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  MessageSquare, 
  Search, 
  Users, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Activity,
  Brain,
  Heart
} from "lucide-react";

function WorkflowSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      icon: <MessageSquare size={32} />,
      title: "Share Your Symptoms",
      description: "Describe how you're feeling—stress, fatigue, pain, or any health concern",
      color: "#628141",
    },
    {
      icon: <Search size={32} />,
      title: "Intent Classification",
      description: "AI analyzes if your query is wellness-related and routes it appropriately",
      color: "#8BAE66",
    },
    {
      icon: <Users size={32} />,
      title: "Multi-Agent Collaboration",
      description: "Four specialized agents work together: Symptom, Diet, Fitness & Lifestyle",
      color: "#A1BC98",
    },
    {
      icon: <Sparkles size={32} />,
      title: "Output Synthesis",
      description: "All recommendations are merged into one coherent wellness plan",
      color: "#D2DCB6",
    },
    {
      icon: <CheckCircle size={32} />,
      title: "Personalized Guidance",
      description: "Receive your tailored wellness recommendations with safety review",
      color: "#628141",
    },
  ];

  const agents = [
    {
      name: "Symptom Agent",
      role: "Analyzes Symptoms",
      description: "Identifies health issues and routes query to appropriate agents",
      color: "#628141",
      icon: <Brain size={24} />,
    },
    {
      name: "Diet Agent",
      role: "Nutrition Guidance",
      description: "Suggests healthy food choices and natural remedies",
      color: "#8BAE66",
      icon: <Heart size={24} />,
    },
    {
      name: "Fitness Agent",
      role: "Exercise Planning",
      description: "Provides beginner-friendly workouts tailored to your condition",
      color: "#A1BC98",
      icon: <Activity size={24} />,
    },
    {
      name: "Lifestyle Agent",
      role: "Habit Improvement",
      description: "Recommends sleep, hydration, and stress management tips",
      color: "#D2DCB6",
      icon: <Sparkles size={24} />,
    },
  ];

  return (
    <section id="how-it-works" className="section-container workflow-section" ref={ref}>
      <div className="section-content">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">
            A seamless journey from symptom to solution, powered by AI collaboration
          </p>
        </motion.div>

        {/* Main Workflow Diagram */}
        <div className="workflow-diagram">
          {/* Step 1 - Input */}
          <motion.div
            className="workflow-node workflow-node-start"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="node-glow"
              style={{ backgroundColor: steps[0].color }}
              animate={inView ? {
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="node-icon" style={{ backgroundColor: steps[0].color }}>
              {steps[0].icon}
            </div>
            <h3 className="node-title">{steps[0].title}</h3>
            <p className="node-description">{steps[0].description}</p>
          </motion.div>

          {/* Animated Connection Line 1 */}
          <motion.svg className="workflow-connector" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M 0 50 Q 50 50 100 50"
              fill="none"
              stroke={steps[0].color}
              strokeWidth="3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.circle
              r="4"
              fill={steps[0].color}
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={inView ? { offsetDistance: "100%", opacity: [0, 1, 1, 0] } : {}}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s">
                <mpath href="#path1" />
              </animateMotion>
            </motion.circle>
            <path id="path1" d="M 0 50 Q 50 50 100 50" fill="none" />
          </motion.svg>

          {/* Step 2 - Classification */}
          <motion.div
            className="workflow-node"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              className="node-glow"
              style={{ backgroundColor: steps[1].color }}
              animate={inView ? {
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
            <div className="node-icon" style={{ backgroundColor: steps[1].color }}>
              {steps[1].icon}
            </div>
            <h3 className="node-title">{steps[1].title}</h3>
            <p className="node-description">{steps[1].description}</p>
          </motion.div>

          {/* Branching Connections to Agents */}
          <div className="workflow-branch">
            <svg className="branch-connector" viewBox="0 0 100 200" preserveAspectRatio="none">
              <motion.path
                d="M 0 100 L 50 100"
                fill="none"
                stroke={steps[1].color}
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
              />
              {agents.map((_, idx) => {
                const yPos = 25 + idx * 50;
                return (
                  <motion.path
                    key={idx}
                    d={`M 50 100 Q 75 ${50 + idx * 37.5} 100 ${yPos}`}
                    fill="none"
                    stroke={agents[idx].color}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { 
                      pathLength: 1, 
                      opacity: 1,
                      strokeDashoffset: [0, -8],
                    } : {}}
                    transition={{ 
                      pathLength: { duration: 0.8, delay: 0.8 + idx * 0.1 },
                      opacity: { duration: 0.8, delay: 0.8 + idx * 0.1 },
                      strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" },
                    }}
                  />
                );
              })}
            </svg>

            {/* Agent Nodes */}
            <div className="agent-nodes">
              {agents.map((agent, index) => (
                <motion.div
                  key={index}
                  className="agent-node"
                  initial={{ opacity: 0, x: -30, scale: 0.8 }}
                  animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 10px 30px ${agent.color}40`,
                  }}
                >
                  <motion.div
                    className="agent-node-glow"
                    style={{ backgroundColor: agent.color }}
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: index * 0.4,
                    }}
                  />
                  <div className="agent-node-icon" style={{ backgroundColor: agent.color }}>
                    {agent.icon}
                  </div>
                  <div className="agent-node-content">
                    <h4 className="agent-node-name">{agent.name}</h4>
                    <p className="agent-node-role">{agent.role}</p>
                    <p className="agent-node-description">{agent.description}</p>
                  </div>
                  <motion.div
                    className="agent-pulse"
                    style={{ borderColor: agent.color }}
                    animate={{
                      scale: [1, 1.5],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Convergence Lines */}
            <svg className="convergence-connector" viewBox="0 0 100 200" preserveAspectRatio="none">
              {agents.map((agent, idx) => {
                const yPos = 25 + idx * 50;
                return (
                  <motion.path
                    key={idx}
                    d={`M 0 ${yPos} Q 25 ${50 + idx * 37.5} 50 100`}
                    fill="none"
                    stroke={agent.color}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { 
                      pathLength: 1, 
                      opacity: 1,
                      strokeDashoffset: [0, -8],
                    } : {}}
                    transition={{ 
                      pathLength: { duration: 0.8, delay: 1.5 + idx * 0.1 },
                      opacity: { duration: 0.8, delay: 1.5 + idx * 0.1 },
                      strokeDashoffset: { duration: 1.5, repeat: Infinity, ease: "linear" },
                    }}
                  />
                );
              })}
              <motion.path
                d="M 50 100 L 100 100"
                fill="none"
                stroke={steps[3].color}
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.9 }}
              />
            </svg>
          </div>

          {/* Step 4 - Synthesis */}
          <motion.div
            className="workflow-node"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 2 }}
          >
            <motion.div
              className="node-glow"
              style={{ backgroundColor: steps[3].color }}
              animate={inView ? {
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />
            <div className="node-icon" style={{ backgroundColor: steps[3].color }}>
              {steps[3].icon}
            </div>
            <h3 className="node-title">{steps[3].title}</h3>
            <p className="node-description">{steps[3].description}</p>
          </motion.div>

          {/* Animated Connection Line 2 */}
          <motion.svg className="workflow-connector" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M 0 50 Q 50 50 100 50"
              fill="none"
              stroke={steps[3].color}
              strokeWidth="3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 2.2 }}
            />
            <motion.circle
              r="4"
              fill={steps[3].color}
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={inView ? { offsetDistance: "100%", opacity: [0, 1, 1, 0] } : {}}
              transition={{ duration: 2, delay: 2.2, repeat: Infinity, repeatDelay: 1 }}
            >
              <animateMotion dur="2s" repeatCount="indefinite" begin="2.2s">
                <mpath href="#path2" />
              </animateMotion>
            </motion.circle>
            <path id="path2" d="M 0 50 Q 50 50 100 50" fill="none" />
          </motion.svg>

          {/* Step 5 - Output */}
          <motion.div
            className="workflow-node workflow-node-end"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 2.4 }}
          >
            <motion.div
              className="node-glow"
              style={{ backgroundColor: steps[4].color }}
              animate={inView ? {
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              }}
            />
            <div className="node-icon" style={{ backgroundColor: steps[4].color }}>
              {steps[4].icon}
            </div>
            <h3 className="node-title">{steps[4].title}</h3>
            <p className="node-description">{steps[4].description}</p>
            <motion.div
              className="success-badge"
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 2.8, type: "spring" }}
            >
              ✓ Complete
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default WorkflowSection;