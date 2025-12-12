import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import { Sparkles } from "lucide-react";

function ProfileForm({ userId, fullName, onProfileSaved }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [meds, setMeds] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/profile/${userId}`);
        const p = res.data.profile || {};

        setHeight(p.height_cm ? String(p.height_cm) : "");
        setWeight(p.weight_kg ? String(p.weight_kg) : "");
        setMeds(p.medications || "");
      } catch {
        // ignore - first time user
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

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
    setStatus("Saving profile...");

    try {
      await axios.post(`${API_BASE_URL}/profile/${userId}`, {
        height_cm: height ? Number(height) : null,
        weight_kg: weight ? Number(weight) : null,
        medications: meds.trim(),
      });

      setStatus("Profile saved successfully!");
      setTimeout(() => {
        onProfileSaved();
      }, 1000);
    } catch (err) {
      setStatus(err.response?.data?.error || "Unable to save profile.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center profile-form-bg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen profile-form-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="profile-form-card">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="profile-form-logo">
            <img 
    src="./logo3.png"     // ⭐ correct for public folder
    alt="Arogya Logo"
    className="navbar-logo-img rounded"
  />

  
            </div>
           
            <h2 className="text-xl font-bold text-gray-900 mt-4">
              Welcome, {fullName}
            </h2>
            <p className="text-gray-600 mt-2 text-sm text-center">
              Provide basic info so we can personalize your wellness support.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm text-gray-700 font-medium block mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="165"
                className="profile-form-input"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium block mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="64"
                className="profile-form-input"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium block mb-2">
                Medications
              </label>
              <textarea
                rows={3}
                value={meds}
                onChange={(e) => setMeds(e.target.value)}
                placeholder="Any medications you take..."
                className="profile-form-input resize-none"
              />
            </div>

            {status && (
              <div className={`profile-form-status ${saving ? '' : 'error'}`}>
                {status}
              </div>
            )}

            <button
              type="submit"
              className="profile-form-submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        </div>

        {/* Tagline */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Powered by a multi-agent AI system for personalized wellness insights.
        </p>
      </div>
    </div>
  );
}

export default ProfileForm;
