// ChatInterface.jsx - CLEANED & FORMATTED (Option B1)
// - Removes hidden unicode chars
// - Fixes adjacent JSX elements bug
// - Keeps your comments and logic
// - Ready for Vite + React + PostCSS

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Sparkles, User } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { API_BASE_URL } from "../config.js";
import YouTubeRecommendations from "./YouTubeRecommendations";
import "../styles/chat-interface.css";

/**
 * DeepSeek-Full ChatInterface
 * - Streams SSE from /chat_stream
 * - Live agent-to-agent "thought" streaming with typing animation
 * - Agent timeline with avatars, colors, progressive reveal
 * - Cleans broken markdown (joins single-word lines into paragraphs)
 */

const AGENT_COLORS = [
  "#8BAE66", // green
  "#FECACA", // red-ish
  "#A1BC98", // sage
  "#EBD5AB", // yellow
  "#628141", // primary
  "#D2DCB6",
];

function chooseColorForAgent(name) {
  if (!name) return AGENT_COLORS[0];
  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AGENT_COLORS[hash % AGENT_COLORS.length];
}

// *** REFINED MARKDOWN CLEANUP LOGIC (Final Version from Previous Iteration) ***
function cleanSynthesizedText(text) {
  if (!text) return text;
  let t = text;

  // 1. Separate fused CamelCase/PascalCase words (e.g., 'WellnessPlanToaddress' -> 'Wellness Plan To address')
  t = t.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

  // 2. Ensure space after punctuation (e.g., 'symptoms.Please' -> 'symptoms. Please')
  t = t.replace(/([.?!,])([A-Za-z])/g, "$1 $2");

  // 3. Remove mid-word hyphen-breaks (e.g., 'well\n-being' -> 'well being')
  t = t.replace(/-\n/g, "");

  // 4. Remove forced line breaks that don't look like paragraph breaks
  t = t.replace(/([a-z0-9])\n([a-z0-9*])/gi, "$1 $2");

  // 5. Force spaces around ALL list markers/colons to break fused list items.
  // Fixes: *LeafyGreens: and spaces after colons
  t = t.replace(/([\*|\-|\:|\#])([A-Za-z])/g, "$1 $2");
  // Fixes: Leafy Greens:
  t = t.replace(/([A-Za-z])(:)/g, "$1 $2");

  // 6. Fix over-formatted list items like `***Leafy Greens**:` to `**Leafy Greens**`
  t = t.replace(/\*{2,3}\s*([^\*]+)\s*\*\*:?/g, "**$1**");

  // 7. Fix one-word-per-line problems (retained flow control)
  const lines = t.split("\n").map((l) => l.trim());
  const nonEmpty = lines.filter(Boolean);
  if (nonEmpty.length === 0) return t;

  const shortCount = nonEmpty.filter((l) => l.split(/\s+/).length <= 3).length;
  if (shortCount / nonEmpty.length > 0.5) {
    const paragraphs = [];
    let buf = [];
    for (const l of nonEmpty) {
      // Check for headings, code blocks, or list starts
      const isStructural =
        l.startsWith("#") || l.startsWith("*") || l.startsWith("-") || l.startsWith("`") || l.endsWith(":");
      if (isStructural) {
        if (buf.length) {
          paragraphs.push(buf.join(" "));
          buf = [];
        }
        paragraphs.push(l);
      } else {
        buf.push(l);
      }
    }
    if (buf.length) paragraphs.push(buf.join(" "));
    t = paragraphs.join("\n\n");
  }

  // Normalize excessive repeated newlines
  return t.replace(/\n{3,}/g, "\n\n").trim();
}

function normalizeMarkdown(text) {
  if (!text) return text;

  let t = cleanSynthesizedText(text);

  // 1. Fix headings like "##Introduction" or "## Introduction"
  t = t.replace(/#+\s*/g, (m) => m.trim() + " ");

  // 2. Fix numbered lists: 1 . ** → 1. **
  t = t.replace(/(\d+)\s*\.\s*/g, "$1. ");

  // 3. Fix broken bold markers " ** word **" and ensure inner content is clean
  t = t.replace(/\*\*\s*/g, "**");
  t = t.replace(/\s*\*\*/g, "**");

  // 4. Remove double colons '::'
  t = t.replace(/\s*::\s*/g, ": ");

  // 5. Ensure a single space after list markers (* or -)
  t = t.replace(/(\*|\-)\s+/g, "$1 ");

  // 6. Fix stray spaces before punctuation (last step for punctuation)
  t = t.replace(/\s+([,.!?;:])/g, "$1");

  // 7. Ensure headings have newline before them
  t = t.replace(/(\n|^)(#+\s+[^\n]+)/g, "\n\n$2");

  return t.trim();
}

export default function ChatInterface({ userId, userName, onBackToHome, onViewProfile }) {
  const [symptoms, setSymptoms] = useState("");
  const [report, setReport] = useState("");
  const [status, setStatus] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [followUpStatus, setFollowUpStatus] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [showAgentFlow, setShowAgentFlow] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]); // each log: { agent, output, display, color, status, id }
  const [isGenerating, setIsGenerating] = useState(false);

  // streaming control
  const streamControllerRef = useRef(null);
  const readerCancelRef = useRef(false);

  // refs for UI auto-scroll
  const timelineRef = useRef(null);
  const summaryRef = useRef(null);

  // helper: append or update last agent log if same agent (progressive streaming)
  const pushOrAppendAgentLog = (agentName, chunkText, opts = {}) => {
    setAgentLogs((prev) => {
      const last = prev[prev.length - 1];
      const isSameAgent = last && last.agent === agentName && !last.finalized;
      if (isSameAgent) {
        // append to last log
        const updated = [
          ...prev.slice(0, prev.length - 1),
          {
            ...last,
            output: (last.output || "") + chunkText,
            display: (last.display || "") + chunkText,
          },
        ];
        return updated;
      } else {
        // push a new agent log
        const color = chooseColorForAgent(agentName);
        const newLog = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          agent: agentName || "Agent",
          output: chunkText,
          display: chunkText, // progressive display
          color,
          status: opts.status || "thinking", // thinking | done
          finalized: !!opts.finalized,
          timestamp: Date.now(),
        };
        return [...prev, newLog];
      }
    });

    // after pushing, schedule auto-scroll to bottom
    setTimeout(() => {
      if (timelineRef.current) {
        timelineRef.current.scrollTo({
          top: timelineRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 40);
  };

  // mark last log from agent as finalized (done)
  const finalizeAgentLog = (agentName) => {
    setAgentLogs((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.agent === agentName && !last.finalized) {
        const updated = [...prev.slice(0, prev.length - 1), { ...last, finalized: true, status: "done" }];
        return updated;
      }
      return prev;
    });
  };

  // generic SSE chunk handler (parses data: ... blocks)
  const handleSseChunk = (raw) => {
    // raw is something like 'data: {"type":"thought","agent":"SymptomAgent","content":"..."}\n\n'
    // there might be multiple messages in raw separated by \n\n
    const parts = raw.split("\n\n");
    for (const p of parts) {
      if (!p.trim()) continue;
      // collect lines starting with data:
      const lines = p.split("\n").filter((ln) => ln.trim().startsWith("data:"));
      if (lines.length === 0) continue;
      const text = lines.map((ln) => ln.replace(/^data:\s?/, "")).join("\n");
      let evt;
      try {
        evt = JSON.parse(text);
      } catch (err) {
        // Not JSON: push raw as a thought for default agent
        pushOrAppendAgentLog("Agent", text);
        continue;
      }

      if (!evt || !evt.type) continue;

      // handle types
      if (evt.type === "thought" || evt.type === "step" || evt.type === "agent") {
        // agent to agent thought (may be partial)
        const agentName = evt.agent || evt.from || "Agent";
        // sometimes content may be object with text field
        const content =
          typeof evt.content === "string" ? evt.content : evt.content && evt.content.text ? evt.content.text : JSON.stringify(evt.content || "");
        // push progressive chunk
        pushOrAppendAgentLog(agentName, content);
      } else if (evt.type === "answer" || evt.type === "final" || evt.type === "synthesized") {
        // Final answer object may contain recommendations and synthesized_guidance
        const c = evt.content;
        if (typeof c === "string") {
          // fix formatting issues
          const cleaned = cleanSynthesizedText(c);
          setSummary((prev) => (prev ? prev + "\n\n" + cleaned : cleaned));
        } else if (typeof c === "object" && c !== null) {
          if (c.recommendations && Array.isArray(c.recommendations)) {
            setRecommendations(c.recommendations);
          }
          if (c.synthesized_guidance) {
            setSummary((prev) =>
              prev ? prev + "\n\n" + cleanSynthesizedText(c.synthesized_guidance) : cleanSynthesizedText(c.synthesized_guidance)
            );
          } else if (c.text) {
            setSummary((prev) => (prev ? prev + "\n\n" + cleanSynthesizedText(c.text) : cleanSynthesizedText(c.text)));
          }
        }
        // Mark last agent log finalized if agent provided
        if (evt.agent) finalizeAgentLog(evt.agent);
      } else if (evt.type === "meta") {
        if (evt.status) setStatus(evt.status);
      } else {
        // unknown - attach as raw
        const agentName = evt.agent || "Agent";
        const content = typeof evt.content === "string" ? evt.content : JSON.stringify(evt.content || "");
        pushOrAppendAgentLog(agentName, content);
      }
    }
  };

  // start SSE stream to /chat_stream
  const startStream = async (symptomsText, medicalReport) => {
    // abort previous stream if any
    if (streamControllerRef.current) {
      try {
        streamControllerRef.current.abort();
      } catch (e) {}
    }

    const controller = new AbortController();
    streamControllerRef.current = controller;
    readerCancelRef.current = false;

    setIsGenerating(true);
    setStatus("Preparing your wellness guidance…");
    setAgentLogs([]);
    setRecommendations([]);
    setSummary("");

    try {
      const resp = await fetch(`${API_BASE_URL}/chat_stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: symptomsText,
          medical_report: medicalReport || "",
          user_id: userId,
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        // try fallback
        const text = await resp.text();
        throw new Error(`Stream failed: ${resp.status} ${text}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (readerCancelRef.current) {
          try {
            reader.cancel();
          } catch (e) {}
          break;
        }
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // break into SSE messages (separated by \n\n)
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop(); // last may be partial

        for (const chunk of chunks) {
          // Each chunk could contain many lines; handle it
          handleSseChunk(chunk + "\n\n");
        }
      }

      // process leftover
      if (buffer && buffer.trim()) {
        handleSseChunk(buffer);
      }

      // If stream ended but no recommendations, try one final non-stream call
      if ((!recommendations || recommendations.length === 0) && !summary) {
        try {
          const fallback = await axios.post(`${API_BASE_URL}/health-assist`, {
            symptoms: symptomsText,
            medical_report: medicalReport,
            user_id: userId,
          });
          const data = fallback.data || {};
          if (data.recommendations) setRecommendations(data.recommendations);
          const guidance = data.synthesized_guidance || data.final_summary || "";
          if (guidance) setSummary((prev) => (prev ? prev + "\n\n" + cleanSynthesizedText(guidance) : cleanSynthesizedText(guidance)));
          if (data.agent_flow) {
            // convert agent_flow array into agentLogs (finalized)
            setAgentLogs((prev) =>
              prev.concat(
                data.agent_flow.map((a, idx) => ({
                  id: `fallback-${idx}-${Date.now()}`,
                  agent: a.agent || `Agent ${idx + 1}`,
                  output: typeof a.output === "string" ? a.output : JSON.stringify(a.output || ""),
                  display: typeof a.output === "string" ? a.output : JSON.stringify(a.output || ""),
                  color: chooseColorForAgent(a.agent || `Agent ${idx + 1}`),
                  status: "done",
                  finalized: true,
                }))
              )
            );
          }
        } catch (e) {
          // ignore fallback error
        }
      }

      setStatus("");
    } catch (err) {
      console.error("Streaming failed:", err);
      setStatus("Streaming failed — trying standard request...");

      // fallback to synchronous endpoint
      try {
        const res = await axios.post(`${API_BASE_URL}/health-assist`, {
          symptoms: symptomsText,
          medical_report: medicalReport,
          user_id: userId,
        });
        const data = res.data || {};
        setRecommendations(data.recommendations || []);
        // convert agent_flow to logs if present
        if (data.agent_flow && Array.isArray(data.agent_flow)) {
          setAgentLogs((prev) =>
            prev.concat(
              data.agent_flow.map((a, idx) => ({
                id: `fallback-${idx}-${Date.now()}`,
                agent: a.agent || `Agent ${idx + 1}`,
                output: typeof a.output === "string" ? a.output : JSON.stringify(a.output || ""),
                display: typeof a.output === "string" ? a.output : JSON.stringify(a.output || ""),
                color: chooseColorForAgent(a.agent || `Agent ${idx + 1}`),
                status: "done",
                finalized: true,
              }))
            )
          );
        }
        let guidance = data.synthesized_guidance || data.final_summary || "";
        if (typeof guidance === "string") {
          guidance = cleanSynthesizedText(guidance);
        } else if (typeof guidance === "object" && guidance !== null) {
          guidance = guidance.synthesized_guidance || guidance.text || "";
          guidance = cleanSynthesizedText(guidance);
        }
        if (guidance) setSummary((prev) => (prev ? prev + "\n\n" + guidance : guidance));
        setStatus("");
      } catch (e2) {
        setStatus(e2.response?.data?.error || "Something went wrong. Please try again.");
      }
    } finally {
      setIsGenerating(false);
      streamControllerRef.current = null;
    }
  };

  useEffect(() => {
    // cleanup on unmount
    return () => {
      readerCancelRef.current = true;
      if (streamControllerRef.current) {
        try {
          streamControllerRef.current.abort();
        } catch (e) {}
        streamControllerRef.current = null;
      }
    };
  }, []);

  // handle form submit => start streaming
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!symptoms.trim()) {
      setStatus("Please enter symptoms to continue.");
      return;
    }
    setStatus("Preparing your wellness guidance…");
    setRecommendations([]);
    setSummary("");
    setAgentLogs([]);
    await startStream(symptoms, report);
  };

  // follow-up handler (unchanged)
  const handleFollowUp = async (e) => {
    e?.preventDefault();
    if (!followUp.trim()) return;
    setFollowUpStatus("Thinking…");
    try {
      const res = await axios.post(`${API_BASE_URL}/follow-up`, {
        user_id: userId,
        question: followUp,
      });
      setFollowUpAnswer(res.data?.answer || "");
      setFollowUpStatus("");
    } catch (err) {
      setFollowUpStatus(err.response?.data?.error || "Failed to fetch follow-up answer.");
    }
  };

  // render agent step with typing indicator if not finalized
  const AgentStep = ({ log, index }) => {
    // show first letter circle for avatar
    const initials = (log.agent || "Agent")
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    // cleverness: animate display (framer handles containers)
    return (
      <motion.div
        className="agent-step"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04 }}
        key={log.id}
      >
        <div className="agent-step-header" style={{ alignItems: "flex-start" }}>
          <div
            className="agent-step-number"
            style={{
              background: log.color,
              boxShadow: `0 6px 18px ${log.color}33`,
            }}
          >
            {index + 1}
          </div>

          <div className="agent-step-info">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: log.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  boxShadow: `0 8px 24px ${log.color}33`,
                }}
              >
                {initials}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <h4 className="agent-step-name" style={{ margin: 0 }}>
                  {log.agent}
                </h4>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{log.finalized ? "Completed" : "Thinking..."}</div>
              </div>
            </div>

            {/* Output */}
            <div className="agent-step-output" style={{ marginTop: 12 }}>
              {/* Render the output as sanitized paragraphs; maintain newlines */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
                <ReactMarkdown>{normalizeMarkdown(log.display || log.output || "")}</ReactMarkdown>
              </motion.div>

              {/* Typing dots for live agent */}
              {!log.finalized && (
                <div style={{ marginTop: 8 }}>
                  <TypingDots color={log.color} />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TypingDots = ({ color = "#628141" }) => {
    return (
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <motion.span
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            background: color,
            display: "inline-block",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: 0 }}
        />
        <motion.span
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            background: color,
            display: "inline-block",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: 0.15 }}
        />
        <motion.span
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            background: color,
            display: "inline-block",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: 0.3 }}
        />
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <div className="wellness-header">
        <div className="wellness-header-left">
          <motion.button
            className="btn-icon"
            onClick={onBackToHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div className="wellness-header-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sparkles size={24} />
            <h2 style={{ margin: 0 }}>Arogya Wellness Chat</h2>
          </div>
        </div>

        <div className="wellness-header-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.button
            onClick={onViewProfile}
            className="btn-icon"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="View Profile"
          >
            <User size={20} />
          </motion.button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <main className="wellness-main">
        <div className="wellness-container">
          {/* Layout: Left Sticky Sidebar (Input + Follow-up) and Right Main Content */}
          <div className="wellness-layout">
            {/* --------------------------- LEFT SIDEBAR (STICKY) --------------------------- */}
            <aside className="wellness-sidebar">
              <div className="wellness-sidebar-sticky">
                {/* 1. Input Form (Always visible) */}
                <section className="wellness-input-card">
                  <div className="wellness-input-header">
                    <h3 style={{ margin: 0 }}>Share symptoms</h3>
                    <span className="wellness-badge">Private & secure</span>
                  </div>

                  <form onSubmit={handleSubmit} className="wellness-form">
                    {/* Symptoms & Report Fields omitted for brevity, they remain here */}
                    <div className="wellness-field">
                      <label>Symptoms</label>
                      <textarea
                        rows={4}
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Describe what you feel, how long, and what makes it better/worse."
                        className="wellness-textarea"
                      />
                    </div>

                    <div className="wellness-field">
                      <label>Medical report (optional)</label>
                      <textarea
                        rows={3}
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                        placeholder="Paste lab values, doctor's notes, or other context."
                        className="wellness-textarea"
                      />
                    </div>

                    {status && <p className="wellness-status">{status}</p>}

                    <div className="wellness-actions">
                      <button type="submit" className="btn-primary wellness-submit" disabled={isGenerating}>
                        {isGenerating ? (
                          <>
                            <Loader2 size={20} className="spinner" />
                            Generating...
                          </>
                        ) : (
                          "Generate guidance"
                        )}
                      </button>
                    </div>
                  </form>
                </section>

                {/* 2. Progress Indicator (Conditional) */}
                {isGenerating && (
                  <motion.div className="wellness-progress-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h4>🔄 Processing...</h4>
                    {/* Progress steps logic omitted for brevity */}
                    <div className="wellness-progress-steps">
                      <div className="wellness-progress-step">
                        <div
                          className={`wellness-progress-step-icon ${agentLogs.length > 0 ? "complete" : "active"}`}
                          aria-hidden
                        >
                          {agentLogs.length > 0 ? "✓" : "•"}
                        </div>
                        Analyzing symptoms
                      </div>
                      <div className="wellness-progress-step">
                        <div
                          className={`wellness-progress-step-icon ${
                            agentLogs.length > 1 ? "complete" : agentLogs.length === 1 ? "active" : ""
                          }`}
                          aria-hidden
                        >
                          {agentLogs.length > 1 ? "✓" : "•"}
                        </div>
                        Consulting agents
                      </div>
                      <div className="wellness-progress-step">
                        <div
                          className={`wellness-progress-step-icon ${summary ? "complete" : agentLogs.length > 2 ? "active" : ""}`}
                          aria-hidden
                        >
                          {summary ? "✓" : "•"}
                        </div>
                        Creating plan
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. Quick Stats (Conditional) */}
                {(summary || recommendations.length > 0) && (
                  <motion.div className="wellness-stats-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h4>✨ Analysis Complete</h4>
                    <div className="wellness-stats-grid">
                      <div className="wellness-stat">
                        <div className="wellness-stat-value">{agentLogs.length}</div>
                        <div className="wellness-stat-label">Agents Used</div>
                      </div>
                      <div className="wellness-stat">
                        <div className="wellness-stat-value">{recommendations.length}</div>
                        <div className="wellness-stat-label">Tips Given</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. Follow-up Card (Conditional - MOVED HERE) */}
                {(summary || recommendations.length > 0) && (
                  <motion.section
                    className="wellness-followup-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="wellness-followup-header">
                      <h3 style={{ margin: 0 }}>Ask a follow-up</h3>
                      <span className="wellness-badge-quick">Quick</span>
                    </div>

                    <form onSubmit={handleFollowUp} className="wellness-followup-form">
                      <textarea
                        rows={3}
                        value={followUp}
                        onChange={(e) => setFollowUp(e.target.value)}
                        placeholder="Example: Can I exercise tomorrow?"
                        className="wellness-textarea"
                      />
                      {followUpStatus && <p className="wellness-status">{followUpStatus}</p>}
                      <div className="wellness-followup-actions">
                        <button type="submit" className="btn-primary">
                          Ask
                        </button>
                        <p className="wellness-followup-hint">Short, focused follow-ups return quick replies.</p>
                      </div>
                    </form>

                    {followUpAnswer && (
                      <div className="wellness-followup-answer">
                        <ReactMarkdown>{followUpAnswer}</ReactMarkdown>
                      </div>
                    )}
                  </motion.section>
                )}
              </div>
            </aside>

            {/* --------------------------- RIGHT MAIN CONTENT --------------------------- */}
            <div className="wellness-main-content">
              {/* Agent Flow Card (Stays here) */}
              <motion.section className="agent-flow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                {/* Agent flow content omitted for brevity */}
                <button onClick={() => setShowAgentFlow((v) => !v)} className="agent-flow-toggle">
                  <div>
                    <p className="agent-flow-title">Agent collaboration</p>
                    <p className="agent-flow-subtitle">See how the system arrived at the plan</p>
                  </div>

                  <div className="agent-flow-badge">{showAgentFlow ? "Hide" : "Show"}</div>
                </button>

                <AnimatePresence>
                  {showAgentFlow && (
                    <motion.div className="agent-flow-content" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      {agentLogs.length === 0 ? (
                        <p className="agent-flow-empty">Generate a plan to see agent collaboration</p>
                      ) : (
                        <div className="agent-timeline" ref={timelineRef} style={{ maxHeight: 420, overflow: "auto", paddingRight: 8 }}>
                          <div className="agent-timeline-line" />

                          {agentLogs.map((log, i) => (
                            <AgentStep log={log} index={i} key={log.id} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>

              {/* Results Card (Stays here) */}
              <motion.section className="wellness-results-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="wellness-results-header">
                  <h3 style={{ margin: 0 }}>Your wellness plan</h3>
                  {(summary || recommendations.length > 0) && <span className="wellness-badge-ready">Ready</span>}
                </div>

                {/* Recommendations/Summary Content omitted for brevity */}
                {recommendations.length > 0 ? (
                  <div className="wellness-recommendations">
                    <p className="wellness-recommendations-title">Key Recommendations:</p>
                    <div className="wellness-recommendations-list">
                      {recommendations.map((r, idx) => (
                        <motion.div key={idx} className="wellness-recommendation-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }}>
                          <div className="wellness-recommendation-bullet" />
                          <p>{r}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="wellness-empty">No recommendations yet — submit symptoms to generate a plan.</p>
                )}

                {summary && (
                  <div className="wellness-summary" ref={summaryRef}>
                    <ReactMarkdown>{normalizeMarkdown(summary)}</ReactMarkdown>
                  </div>
                )}
              </motion.section>

              {/* Section Divider before YouTube */}
              {summary && symptoms && (
                <motion.div className="wellness-section-divider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <div className="wellness-section-divider-line" />
                  <div className="wellness-section-divider-text">Learn More</div>
                  <div className="wellness-section-divider-line" />
                </motion.div>
              )}

             
            </div>
            
          </div>
           {/* YouTube Recommendations (Stays here, will be styled horizontally) */}
          {/* YouTube recommendations */}
          {summary && (
            <section className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Curated videos
                </h3>
                <span className="text-xs sm:text-sm text-gray-500">
                  Helpful content matched to your plan
                </span>
              </div>
              <YouTubeRecommendations symptom={symptoms} />
            </section>
          )}


        </div>
      </main>
    </>
  );
}
