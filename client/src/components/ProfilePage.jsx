import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { ArrowLeft, User as UserIcon, Trash2, Activity, Calendar, Heart } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { API_BASE_URL } from "../config.js";
import { useClerk } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";


function ProfilePage({ userId, onHome }) {
  

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [meds, setMeds] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const { user } = useUser();

  // Correct dynamic name display
  const fullName = user?.fullName || user?.firstName || "User";

  useEffect(() => {
    loadProfile();
    loadHistory();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${userId}`);
      const p = res.data.profile || {};

      setHeight(p.height_cm ? String(p.height_cm) : "");
      setWeight(p.weight_kg ? String(p.weight_kg) : "");
      setMeds(p.medications || "");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/history/${userId}`);
      const list = res.data?.history || [];
      setHistoryItems([...list].reverse());
    } catch (err) {
      console.error("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteHistoryItem = async (index) => {
    // Since we don't have a delete endpoint, we'll implement local delete
    // You may need to add a backend endpoint for this
    if (window.confirm("Are you sure you want to delete this session?")) {
      const newHistory = historyItems.filter((_, i) => i !== index);
      setHistoryItems(newHistory);
      // Optionally: call backend to delete
    }
  };

  const validate = () => {
    if (height && (Number(height) <= 0 || Number(height) > 300))
      return "Enter a valid height (1-300 cm).";
    if (weight && (Number(weight) <= 0 || Number(weight) > 500))
      return "Enter a valid weight (1-500 kg).";
    return "";
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setStatus(msg);
      return;
    }

    setSaving(true);
    setStatus("Saving...");

    try {
      await axios.post(`${API_BASE_URL}/profile/${userId}`, {
        height_cm: height ? Number(height) : null,
        weight_kg: weight ? Number(weight) : null,
        medications: meds.trim(),
      });

      setStatus("Profile saved successfully.");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus(err.response?.data?.error || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const calculateBMI = () => {
    if (height && weight) {
      const heightInM = Number(height) / 100;
      const bmi = Number(weight) / (heightInM * heightInM);
      return bmi.toFixed(1);
    }
    return "—";
  };

  return (
    <>
      {/* Header */}
      <div className="profile-page-header">
        <div className="profile-page-header-left">
          <motion.button
            className="btn-icon"
            onClick={onHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div className="profile-page-header-title">
            <UserIcon size={24} />
            <h2>My Profile</h2>
          </div>
        </div>
        <div className="profile-page-header-right">
          <UserButton afterSignOutUrl="/" />
        </div>
        
      </div>

      <main className="profile-page-main">
        <div className="profile-page-container">
          {/* Profile Card */}
          <section className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar">
                <UserIcon size={32} />
              </div>
              <div>
                <p className="profile-greeting">Welcome back,</p>
                <h3 className="profile-name">{fullName}</h3>
              </div>
            </div>

            {loading ? (
              <p className="profile-loading">Loading profile…</p>
            ) : (
              <form onSubmit={handleSave} className="profile-form">
                <div className="profile-metrics">
                  <div className="profile-metric">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="165"
                      className="profile-input"
                    />
                  </div>
                  <div className="profile-metric">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="64"
                      className="profile-input"
                    />
                  </div>
                  <div className="profile-metric">
                    <label>BMI</label>
                    <div className="profile-bmi">{calculateBMI()}</div>
                  </div>
                </div>

                <div className="profile-field">
                  <label>Medications & Supplements</label>
                  <textarea
                    rows={3}
                    value={meds}
                    onChange={(e) => setMeds(e.target.value)}
                    placeholder="Any medications you take..."
                    className="profile-input"
                  />
                </div>

                {status && (
                  <div className={`profile-status ${status.includes("success") ? "success" : ""}`}>
                    {status}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary profile-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}
          </section>

          {/* Health Report Summary */}
          {historyItems.length > 0 && (
            <section className="health-report-card">
              <h3 className="health-report-title">
                <Activity size={20} />
                Health Report Summary
              </h3>
              
              <div className="health-report-stats">
                <div className="health-stat-card">
                  <Calendar size={20} />
                  <div>
                    <p className="health-stat-value">{historyItems.length}</p>
                    <p className="health-stat-label">Total Sessions</p>
                  </div>
                </div>
                <div className="health-stat-card">
                  <Heart size={20} />
                  <div>
                    <p className="health-stat-value">
                      {new Set(historyItems.map((h) => h.query?.split(" ")[0])).size}
                    </p>
                    <p className="health-stat-label">Health Topics</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* History Section */}
          <section className="history-card">
            <div className="history-header">
              <h3>Previous Wellness Sessions</h3>
              {historyLoading && <span className="history-loading">Loading...</span>}
            </div>

            {historyItems.length === 0 ? (
              <p className="history-empty">
                No past sessions found. Start your wellness journey today!
              </p>
            ) : (
              <div className="history-list">
                {historyItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="history-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {/* History item header - clickable */}
                    <button
                      onClick={() =>
                        setExpandedHistory(expandedHistory === idx ? null : idx)
                      }
                      className="history-item-header"
                    >
                      <div className="history-item-info">
                        <p className="history-item-label">Query</p>
                        <p className="history-item-query">{item.query}</p>
                        {item.timestamp && (
                          <p className="history-item-timestamp">
                            {new Date(item.timestamp).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                      <div className="history-item-actions">
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryItem(idx);
                          }}
                          className="history-delete-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete session"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                        <div className={`history-expand-icon ${expandedHistory === idx ? "expanded" : ""}`}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Expanded content */}
                    {expandedHistory === idx && (
                      <motion.div
                        className="history-item-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {/* Recommendations */}
                        {item.recommendations && item.recommendations.length > 0 && (
                          <div className="history-recommendations">
                            <h4>Recommendations</h4>
                            <ul>
                              {item.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Synthesized Guidance */}
                        {item.synthesized_guidance && (
                          <div className="history-guidance">
                            <ReactMarkdown>{item.synthesized_guidance}</ReactMarkdown>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default ProfilePage;
