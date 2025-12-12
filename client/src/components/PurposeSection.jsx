import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Heart,
  Stethoscope,
  Smartphone 
} from "lucide-react";

function PurposeSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const problems = [
    "Chronic fatigue and low energy levels",
    "Stress from studies or work demands",
    "Irregular eating patterns and poor nutrition",
    "No time for regular exercise",
    "Poor sleep quality and irregular schedules",
    "Lack of personalized health guidance",
  ];

  const applications = [
    {
      icon: <Heart size={32} />,
      title: "Personal Wellness",
      description: "Perfect for students and professionals seeking quick, daily health tips and guidance",
      color: "#628141",
    },
    {
      icon: <Building2 size={32} />,
      title: "Corporate Wellness",
      description: "Integrate into HR programs to improve employee health and reduce workplace stress",
      color: "#8BAE66",
    },
    {
      icon: <GraduationCap size={32} />,
      title: "Educational Institutions",
      description: "Help colleges promote better lifestyle habits and student well-being",
      color: "#A1BC98",
    },
    {
      icon: <Smartphone size={32} />,
      title: "Fitness Apps",
      description: "Integrate as an intelligent wellness suggestion engine in lifestyle applications",
      color: "#D2DCB6",
    },
    
   
  ];

  return (
    <section id="purpose" className="section-container purpose-section" ref={ref}>
      <div className="section-content">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Our Purpose</h2>
          <p className="section-description">
            Empowering healthier lives through intelligent, accessible wellness support
          </p>
        </motion.div>

       

        {/* Solution */}
        <motion.div
          className="purpose-solution"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="purpose-solution-title">Our Solution</h3>
          <div className="purpose-solution-content">
            <p>
              Arogya provides a <strong>simple digital tool</strong> that offers:
            </p>
            <ul className="purpose-solution-list">
              <li>Quick, personalized wellness suggestions</li>
              <li>Beginner-friendly exercise routines</li>
              <li>Easy diet hacks and nutrition guidance</li>
              <li>Simple lifestyle improvements</li>
              <li>24/7 AI-powered support</li>
            </ul>
          </div>
        </motion.div>

        {/* Applications */}
        <motion.div
          className="purpose-applications"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h3 className="purpose-applications-title">Real-World Applications</h3>
          <div className="applications-grid">
            {applications.map((app, index) => (
              <motion.div
                key={index}
                className="application-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 10px 30px rgba(98, 129, 65, 0.2)" 
                }}
              >
                <div 
                  className="application-icon"
                  style={{ backgroundColor: app.color }}
                >
                  {app.icon}
                </div>
                <h4 className="application-title">{app.title}</h4>
                <p className="application-description">{app.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default PurposeSection;
