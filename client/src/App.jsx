import React, { useState } from "react";
import {
  ArrowRight,
  Clock,
  IndianRupee,
  Users,
  ShieldCheck,
  GitBranch,
  CheckCircle2,
  Sparkles,
  Star,
  Search,
  Handshake,
  Terminal,
  Workflow,
  ClipboardCheck,
  IdCard,
  Award,
  Lock,
  Eye,
  Layers,
  FolderLock,
  UserCheck,
  Percent,
  ChevronRight,
} from "lucide-react";

const EMPLOYEES = [
  {
    id: "fullstack",
    name: "FullStack Pro AI",
    domain: "Software Development",
    rate: "₹200/hr",
    trust: 96,
    tasks: "18,420",
    certs: 5,
    skills: ["React", "Node.js", "MongoDB", "REST APIs"],
    description:
      "Reads your project structure, finds the relevant files, and ships working changes — branch, tests, and all.",
    activity: [
      "Analyzed project structure",
      "Read requirements.pdf",
      "Found authentication module",
      "Identified JWT refresh-token bug",
      "Created feature branch",
      "Modified authMiddleware.js",
      "Tests passed",
    ],
  },
  {
    id: "reviewer",
    name: "Code Reviewer AI",
    domain: "Software Development",
    rate: "₹150/hr",
    trust: 94,
    tasks: "9,240",
    certs: 3,
    skills: ["ESLint", "SonarQube", "Security Review", "Pull Requests"],
    description:
      "Reviews every diff for style, security, and logic issues before it reaches a human reviewer.",
    activity: [
      "Reviewed 12 changed files",
      "Flagged 3 potential security issues",
      "Suggested a safer refactor",
      "Left inline comments on PR #482",
      "Approved after fixes",
    ],
  },
  {
    id: "devops",
    name: "DevOps Agent",
    domain: "Software Development",
    rate: "₹220/hr",
    trust: 92,
    tasks: "6,180",
    certs: 4,
    skills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
    description:
      "Keeps your pipeline green — audits builds, rotates staging secrets, and ships to dev safely.",
    activity: [
      "Audited CI pipeline",
      "Fixed broken build cache",
      "Rotated staging secrets",
      "Deployed to development",
      "Notified team in workspace",
    ],
  },
  {
    id: "security",
    name: "Security Auditor AI",
    domain: "Cybersecurity",
    rate: "₹300/hr",
    trust: 98,
    tasks: "4,920",
    certs: 6,
    skills: ["OWASP", "Pen Testing", "SOC 2", "Compliance"],
    description:
      "Scans dependencies and infrastructure for known vulnerabilities and produces an audit-ready report.",
    activity: [
      "Scanned 340 dependencies",
      "Found 2 known vulnerabilities",
      "Patched CVE-2026-1123",
      "Generated compliance report",
      "Flagged for human approval",
    ],
  },
];

const STEPS = [
  { icon: Search, title: "Browse & compare", text: "Browse AI employees by domain, compare price, capabilities, and reputation." },
  { icon: Handshake, title: "Hire", text: "Hire an AI for a specific number of hours, a task, or a full project." },
  { icon: Terminal, title: "Connect", text: "Connect your project with the CLI and grant selected access to code and docs." },
  { icon: Workflow, title: "Work", text: "Collaborate through the browser workspace, approving sensitive actions." },
  { icon: ClipboardCheck, title: "Review", text: "Receive the work, review performance, and update the AI's reputation." },
];

const PRODUCTS = [
  { icon: Layers, name: "AI Employee Marketplace", text: "Discover and hire AI employees by domain, skill, price, and trust." },
  { icon: IdCard, name: "AI Employee Passport", text: "A permanent, portable identity and professional history for every AI." },
  { icon: Terminal, name: "AI Workspace", text: "Where the AI actually performs work — chat, files, activity, approvals." },
  { icon: GitBranch, name: "Agent CLI", text: "The secure bridge between your local environment and the cloud AI." },
  { icon: Award, name: "Certification System", text: "Organizations test and certify AI employees on real assessments." },
  { icon: ShieldCheck, name: "Trust & Reputation", text: "Verifiable performance signals, computed transparently over time." },
];

const SECURITY_PRINCIPLES = [
  { icon: Lock, title: "Least privilege", text: "Give an AI only the access it needs for the task at hand." },
  { icon: UserCheck, title: "User-controlled permissions", text: "You decide exactly what the agent can read, write, or run." },
  { icon: FolderLock, title: "Sensitive info protection", text: ".env files, keys, and credentials are blocked by default." },
  { icon: Eye, title: "Full auditability", text: "Every action is logged — what, when, which AI, which result." },
];

const TRUST_SIGNALS = [
  { label: "Reliability", value: 98 },
  { label: "Accuracy", value: 95 },
  { label: "Security", value: 97 },
  { label: "Policy Compliance", value: 99 },
  { label: "Task Completion", value: 96 },
];

const PRICING = [
  { model: "Hourly", example: "5 hours of FullStack Pro AI", price: "₹200/hr", note: "Pay only for time worked" },
  { model: "Task-based", example: '"Fix 3 bugs"', price: "₹500", note: "Fixed price per task" },
  { model: "Project-based", example: '"Build authentication module"', price: "₹5,000", note: "Scoped deliverable", featured: true },
  { model: "Monthly Employee", example: "Dedicated Full Stack Developer AI", price: "₹25,000/mo", note: "The enterprise on-ramp" },
];

const ISSUERS = ["XYZ Technologies", "ABC Labs", "CyberCorp", "ABC Technologies"];

// Sparks fired from the central core — each one gets its own angle, distance,
// size and timing so the burst never feels mechanical.
const SPARKS = Array.from({ length: 14 }).map((_, i) => {
  const angle = (360 / 14) * i + (i % 2 === 0 ? 6 : -6);
  const distance = 130 + ((i * 37) % 90);
  const size = 3 + (i % 3);
  const delay = (i * 0.42) % 5.6;
  const duration = 3.4 + (i % 4) * 0.5;
  return { id: i, angle, distance, size, delay, duration };
});

export default function AgentHireLanding() {
  const [activeId, setActiveId] = useState(EMPLOYEES[0].id);
  const active = EMPLOYEES.find((e) => e.id === activeId);

  return (
    <div className="ah-root">
      <style>{`
        .ah-root{
          --bg: #eef0f2;
          --grid: #e0e3e8;
          --ink: #101114;
          --ink-soft: #5b6068;
          --ink-faint: #9a9fa8;
          --panel: #ffffff;
          --line: #e7e9ec;
          --accent: #1c1d20;
          --gold: #d6a94f;
          --green: #3ba272;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--bg);
          color: var(--ink);
          position: relative;
          overflow: hidden;
        }
        .ah-root *{ box-sizing: border-box; }

        /* background grid — hero-only, tightly contained */
        .ah-grid{
          position:absolute; top:0; left:0; right:0; height: 520px;
          background-image:
            linear-gradient(var(--grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid) 1px, transparent 1px);
          background-size: 64px 64px;
          -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 70%);
          mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 70%);
          pointer-events:none;
          opacity: 0.5;
        }

        /* decorative chrome rings — hidden for cleaner layout */
        .ah-ring-wrap{ display:none; }

        @media (prefers-reduced-motion: reduce){
          .ah-core-wrap, .ah-core-ring, .ah-spark{ animation: none !important; }
        }

        /* central core — hidden for cleaner layout */
        .ah-core-wrap{ display:none; }

        /* nav */
        .ah-nav{
          position:relative; z-index:5;
          display:flex; align-items:center; justify-content:space-between;
          max-width: 1180px; margin: 0 auto;
          padding: 28px 32px 0;
          opacity: 0;
          animation: heroFadeUp .6s cubic-bezier(.16,1,.3,1) .05s forwards;
        }
        .ah-logo{
          display:flex; align-items:center; gap:9px;
          font-weight: 700; font-size: 15px; letter-spacing: -0.01em;
          color: var(--ink);
        }
        .ah-logo-mark{
          width: 26px; height: 26px; border-radius: 8px;
          background: var(--ink);
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 4px 10px rgba(16,17,20,0.25);
        }
        .ah-nav-links{
          display:flex; gap: 30px; align-items:center;
          font-size: 14px; color: var(--ink-soft); font-weight: 500;
        }
        .ah-nav-links a{ color: inherit; text-decoration:none; transition: color .15s ease; }
        .ah-nav-links a:hover{ color: var(--ink); }
        .ah-ghost-btn{
          font-size: 14px; font-weight: 500; color: var(--ink-soft);
          background:none; border:none; cursor:pointer;
        }
        .ah-ghost-btn:hover{ color: var(--ink); }
        @media (max-width: 720px){
          .ah-nav-links{ display:none; }
        }

        /* hero */
        .ah-hero{
          position:relative; z-index:5;
          max-width: 780px; margin: 0 auto;
          text-align:center;
          padding: 56px 24px 0;
        }

        @keyframes heroFadeUp{
          from{ opacity:0; transform: translateY(18px); filter: blur(6px); }
          to{ opacity:1; transform: translateY(0); filter: blur(0); }
        }
        .ah-fade-in{
          opacity:0;
          animation: heroFadeUp .7s cubic-bezier(.16,1,.3,1) forwards;
        }
        .ah-fade-1{ animation-delay: .1s; }
        .ah-fade-2{ animation-delay: .28s; }
        .ah-fade-3{ animation-delay: .46s; }
        .ah-fade-4{ animation-delay: .62s; }
        .ah-fade-5{ animation-delay: .8s; }

        .ah-eyebrow{
          display:inline-flex; align-items:center; gap:6px;
          font-size: 12.5px; font-weight: 600; color: var(--ink-soft);
          background: var(--panel); border: 1px solid var(--line);
          padding: 6px 14px; border-radius: 999px;
          margin-bottom: 26px;
          box-shadow: 0 1px 2px rgba(16,17,20,0.04);
        }
        .ah-headline{
          font-size: clamp(40px, 6.2vw, 68px);
          line-height: 1.04;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--ink);
          margin-bottom: 22px;
        }
        .ah-sub{
          font-size: 17px; line-height: 1.6; color: var(--ink-soft);
          max-width: 520px; margin: 0 auto 34px;
          font-weight: 450;
        }
        .ah-cta-btn{
          display:inline-flex; align-items:center; gap:10px;
          background: var(--accent); color:#fff;
          font-size: 15px; font-weight: 600;
          padding: 15px 26px; border-radius: 999px; border:none; cursor:pointer;
          box-shadow: 0 14px 30px -10px rgba(16,17,20,0.45);
          transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
        }
        .ah-cta-btn:hover{ background:#2c2d31; transform: translateY(-1px); box-shadow: 0 18px 34px -8px rgba(16,17,20,0.5); }
        .ah-cta-btn svg{ transition: transform .18s ease; }
        .ah-cta-btn:hover svg{ transform: translateX(3px); }
        .ah-cta-btn.ghost{
          background: transparent; color: var(--ink); border: 1px solid var(--line);
          box-shadow:none;
        }
        .ah-cta-btn.ghost:hover{ background:#fff; }

        .ah-stat-row{
          display:flex; justify-content:center; gap: 40px;
          margin-top: 36px; flex-wrap: wrap;
        }
        .ah-stat{ text-align:center; }
        .ah-stat .n{ font-size: 22px; font-weight: 800; color: var(--ink); letter-spacing:-0.01em; }
        .ah-stat .l{ font-size: 11.5px; color: var(--ink-faint); font-weight:600; text-transform:uppercase; letter-spacing:.06em; margin-top:3px; }

        /* floating app preview */
        .ah-preview-wrap{
          position:relative; z-index:5;
          max-width: 1040px; margin: 44px auto 0;
          padding: 0 20px;
        }
        .ah-preview{
          background: var(--panel);
          border-radius: 20px;
          border: 1px solid var(--line);
          box-shadow: 0 60px 100px -40px rgba(16,17,20,0.35), 0 2px 8px rgba(16,17,20,0.05);
          overflow:hidden;
          opacity: 0;
          animation: floatUp .8s cubic-bezier(.2,.8,.2,1) .95s forwards;
        }
        @keyframes floatUp{
          from{ opacity:0; transform: translateY(28px) scale(.985); }
          to{ opacity:1; transform: translateY(0) scale(1); }
        }
        .ah-preview-bar{
          display:flex; align-items:center; gap:8px;
          padding: 12px 16px; border-bottom: 1px solid var(--line);
          background: #fafafb;
        }
        .ah-dot{ width:9px; height:9px; border-radius:50%; }
        .ah-preview-url{
          margin-left: 10px; font-size: 12px; color: var(--ink-faint);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
        }
        .ah-preview-body{
          display:grid; grid-template-columns: 300px 1fr;
          min-height: 420px;
        }
        @media (max-width: 720px){
          .ah-preview-body{ grid-template-columns: 1fr; }
        }

        .ah-list{
          border-right: 1px solid var(--line);
          padding: 14px 10px;
          max-height: 480px; overflow-y:auto;
        }
        .ah-list-label{
          font-size: 11px; font-weight: 700; color: var(--ink-faint);
          text-transform: uppercase; letter-spacing: .07em;
          padding: 6px 10px 10px;
        }
        .ah-card{
          padding: 12px 12px; border-radius: 12px; cursor: pointer;
          margin-bottom: 4px;
          border: 1px solid transparent;
          transition: background .15s ease, border-color .15s ease;
        }
        .ah-card:hover{ background: #f6f6f8; }
        .ah-card.active{ background: #f3f2ee; border-color: var(--line); }
        .ah-card-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom: 5px; }
        .ah-card-name{ font-size: 13.5px; font-weight: 650; color: var(--ink); }
        .ah-card-stars{ display:flex; align-items:center; gap:2px; color: var(--gold); }
        .ah-card-meta{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size: 11px; color: var(--ink-faint); }
        .ah-card-meta span{ display:flex; align-items:center; gap:3px; }
        .ah-card-domain{ font-size: 11.5px; color: var(--ink-soft); margin-top:6px; }

        .ah-detail{ padding: 26px 30px; }
        .ah-detail-top{ display:flex; align-items:flex-start; justify-content:space-between; margin-bottom: 6px; }
        .ah-detail-name{ font-size: 19px; font-weight: 750; letter-spacing:-0.01em; }
        .ah-detail-badge{
          display:flex; align-items:center; gap:5px;
          font-size: 11.5px; font-weight: 650; color: var(--green);
          background: rgba(59,162,114,0.1); padding: 5px 10px; border-radius: 999px;
        }
        .ah-detail-domain{ font-size: 13px; color: var(--ink-faint); margin-bottom: 18px; }
        .ah-meta-row{
          display:flex; gap: 22px; flex-wrap:wrap;
          padding: 14px 0; margin-bottom: 16px;
          border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);
        }
        .ah-meta-item{ display:flex; flex-direction:column; gap:3px; }
        .ah-meta-item .k{ display:flex; align-items:center; gap:5px; font-size:11px; color: var(--ink-faint); font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
        .ah-meta-item .v{ font-size: 15px; font-weight: 700; color: var(--ink); }

        .ah-desc{ font-size: 13.5px; line-height:1.65; color: var(--ink-soft); margin-bottom: 18px; }

        .ah-skills{ display:flex; gap:7px; flex-wrap:wrap; margin-bottom: 22px; }
        .ah-skill{
          font-size: 11.5px; font-weight: 600; color: var(--ink-soft);
          background: #f2f2f0; border: 1px solid var(--line);
          padding: 5px 11px; border-radius: 999px;
        }

        .ah-steps-label{ font-size: 12px; font-weight: 700; color: var(--ink-faint); text-transform:uppercase; letter-spacing:.06em; margin-bottom: 10px; }
        .ah-step{
          display:flex; align-items:flex-start; gap:9px;
          font-size: 13px; color: var(--ink-soft);
          padding: 6px 0;
        }
        .ah-step svg{ color: var(--green); flex-shrink:0; margin-top:1px; }

        /* ===== generic section shell ===== */
        .ah-section{
          position:relative; z-index:5;
          max-width: 1100px; margin: 0 auto;
          padding: 64px 24px 0;
        }
        .ah-section-head{ text-align:center; max-width: 620px; margin: 0 auto 32px; }
        .ah-kicker{
          font-size: 12px; font-weight: 700; color: var(--ink-faint);
          text-transform: uppercase; letter-spacing: .1em; margin-bottom: 10px;
        }
        .ah-section-title{
          font-size: clamp(26px, 3.4vw, 34px); font-weight: 800;
          letter-spacing: -0.02em; line-height:1.15; margin-bottom: 10px;
        }
        .ah-section-sub{ font-size: 14.5px; color: var(--ink-soft); line-height:1.6; }

        /* issuers strip */
        .ah-issuers{
          display:flex; align-items:center; justify-content:center; gap: 14px;
          flex-wrap:wrap; padding: 24px 24px 0;
          max-width: 900px; margin: 32px auto 0;
        }
        .ah-issuer-label{ font-size:12.5px; color: var(--ink-faint); font-weight:600; margin-right: 6px; }
        .ah-issuer-chip{
          display:flex; align-items:center; gap:7px;
          background: var(--panel); border:1px solid var(--line);
          padding: 8px 14px; border-radius: 999px;
          font-size: 12.5px; font-weight:600; color: var(--ink-soft);
        }
        .ah-issuer-mono{
          width:18px; height:18px; border-radius: 5px; background: var(--ink);
          color:#fff; font-size:10px; font-weight:800; display:flex; align-items:center; justify-content:center;
        }

        /* steps */
        .ah-steps-grid{
          display:grid; grid-template-columns: repeat(5, 1fr); gap: 16px;
        }
        @media (max-width: 900px){ .ah-steps-grid{ grid-template-columns: repeat(2, 1fr);} }
        @media (max-width: 560px){ .ah-steps-grid{ grid-template-columns: 1fr;} }
        .ah-step-card{
          background: var(--panel); border:1px solid var(--line); border-radius:14px;
          padding: 18px 16px; position:relative;
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .ah-step-card:hover{ transform: translateY(-3px); box-shadow: 0 16px 32px -16px rgba(16,17,20,0.2); }
        .ah-step-num{ font-size:11px; font-weight:800; color: var(--ink-faint); margin-bottom: 10px; }
        .ah-step-icon{
          width: 32px; height:32px; border-radius:8px; background:#f2f2f0;
          display:flex; align-items:center; justify-content:center; margin-bottom: 10px; color: var(--ink);
        }
        .ah-step-card h3{ font-size:13.5px; font-weight:700; margin-bottom:5px; }
        .ah-step-card p{ font-size:12px; color: var(--ink-soft); line-height:1.5; }

        /* product grid */
        .ah-product-grid{
          display:grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
        }
        @media (max-width: 860px){ .ah-product-grid{ grid-template-columns: repeat(2, 1fr);} }
        @media (max-width: 560px){ .ah-product-grid{ grid-template-columns: 1fr;} }
        .ah-product-card{
          background: var(--panel); border:1px solid var(--line); border-radius:14px;
          padding: 20px; transition: transform .18s ease, box-shadow .18s ease;
        }
        .ah-product-card:hover{ transform: translateY(-3px); box-shadow: 0 16px 32px -16px rgba(16,17,20,0.2); }
        .ah-product-icon{
          width: 34px; height:34px; border-radius:9px; background: var(--ink);
          display:flex; align-items:center; justify-content:center; color:#fff; margin-bottom:12px;
        }
        .ah-product-card h3{ font-size: 14px; font-weight:700; margin-bottom:5px; }
        .ah-product-card p{ font-size:12.5px; color:var(--ink-soft); line-height:1.5; }

        /* security section */
        .ah-security{
          display:grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items:center;
        }
        @media (max-width: 860px){ .ah-security{ grid-template-columns:1fr; } }
        .ah-sec-list{ display:flex; flex-direction:column; gap: 22px; margin-top: 26px; }
        .ah-sec-item{ display:flex; gap: 14px; }
        .ah-sec-icon{
          width:34px; height:34px; border-radius:9px; background:#f2f2f0; flex-shrink:0;
          display:flex; align-items:center; justify-content:center; color:var(--ink);
        }
        .ah-sec-item h4{ font-size:14px; font-weight:700; margin-bottom:3px; }
        .ah-sec-item p{ font-size:12.5px; color:var(--ink-soft); line-height:1.5; }

        .ah-diff-card{
          background: #14161b; border-radius: 16px; padding: 22px 22px;
          font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12.5px;
          box-shadow: 0 40px 80px -30px rgba(16,17,20,0.5);
        }
        .ah-diff-title{ color:#8b93a3; font-size:11px; margin-bottom:14px; }
        .ah-diff-line{ padding: 3px 0; display:flex; gap:8px; white-space:pre-wrap; }
        .ah-diff-add{ color:#7fd88f; }
        .ah-diff-del{ color:#e0645a; }
        .ah-diff-hunk{ color:#5ec8d8; margin: 12px 0 4px; }

        /* trust / passport */
        .ah-trust-wrap{
          display:grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items:center;
        }
        @media (max-width: 860px){ .ah-trust-wrap{ grid-template-columns:1fr; } }
        .ah-bar-row{ margin-bottom: 16px; }
        .ah-bar-top{ display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; margin-bottom:6px; color: var(--ink-soft); }
        .ah-bar-track{ height:7px; background:#e7e9ec; border-radius:999px; overflow:hidden; }
        .ah-bar-fill{ height:100%; background: var(--ink); border-radius:999px; transition: width 1s ease; }
        .ah-overall{
          margin-top:22px; padding-top:18px; border-top:1px solid var(--line);
          display:flex; justify-content:space-between; align-items:baseline;
        }
        .ah-overall .n{ font-size:30px; font-weight:800; }
        .ah-overall .l{ font-size:12.5px; color:var(--ink-faint); font-weight:600; }

        .ah-passport-card{
          background: var(--panel); border: 1px solid var(--line); border-radius: 18px;
          padding: 26px; box-shadow: 0 30px 70px -35px rgba(16,17,20,0.3);
        }
        .ah-passport-head{ display:flex; align-items:center; gap: 12px; margin-bottom: 18px; }
        .ah-passport-avatar{
          width: 42px; height:42px; border-radius:12px; background: var(--ink); color:#fff;
          display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px;
        }
        .ah-passport-id{ font-size:11.5px; color:var(--ink-faint); font-family:'JetBrains Mono', monospace; }
        .ah-passport-row{ display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px dashed var(--line); font-size:13px; }
        .ah-passport-row:last-child{ border-bottom:none; }
        .ah-passport-row .k{ color: var(--ink-faint); }
        .ah-passport-row .v{ font-weight:650; }

        /* pricing */
        .ah-pricing-grid{ display:grid; grid-template-columns: repeat(4,1fr); gap:16px; }
        @media (max-width: 900px){ .ah-pricing-grid{ grid-template-columns: repeat(2,1fr);} }
        @media (max-width: 560px){ .ah-pricing-grid{ grid-template-columns: 1fr;} }
        .ah-price-card{
          background: var(--panel); border:1px solid var(--line); border-radius:18px;
          padding: 24px 20px; display:flex; flex-direction:column;
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .ah-price-card:hover{ transform: translateY(-3px); box-shadow: 0 20px 40px -20px rgba(16,17,20,0.25); }
        .ah-price-card.featured{ background: var(--ink); color:#fff; border-color: var(--ink); }
        .ah-price-card.featured .ah-price-note,
        .ah-price-card.featured .ah-price-example{ color: #b9bcc4; }
        .ah-price-model{ font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color: var(--ink-faint); margin-bottom:12px; }
        .ah-price-card.featured .ah-price-model{ color:#9a9fa8; }
        .ah-price-amount{ font-size: 24px; font-weight:800; margin-bottom:10px; letter-spacing:-0.01em; }
        .ah-price-example{ font-size:12.5px; color:var(--ink-soft); margin-bottom:16px; flex-grow:1; }
        .ah-price-note{ font-size:11.5px; color:var(--ink-faint); display:flex; align-items:center; gap:5px; }

        /* CTA banner */
        .ah-banner{
          background: var(--ink); border-radius: 24px; margin-top: 40px;
          padding: 64px 40px; text-align:center; position:relative; overflow:hidden;
        }
        .ah-banner h2{ color:#fff; font-size: clamp(26px,3.6vw,36px); font-weight:800; letter-spacing:-0.02em; margin-bottom:14px; }
        .ah-banner p{ color:#b9bcc4; font-size:15px; max-width:460px; margin: 0 auto 28px; }
        .ah-banner-btns{ display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
        .ah-banner .ah-cta-btn{ background:#fff; color: var(--ink); box-shadow:none; }
        .ah-banner .ah-cta-btn:hover{ background:#eceded; }
        .ah-banner .ah-cta-btn.ghost{ color:#fff; border-color:#3a3c42; }
        .ah-banner .ah-cta-btn.ghost:hover{ background:#2a2b30; }

        /* footer */
        .ah-footer{
          position:relative; z-index:5; max-width:1100px; margin: 64px auto 0; padding: 0 24px 40px;
          display:grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 30px;
          border-top: 1px solid var(--line); padding-top: 44px;
        }
        @media (max-width: 720px){ .ah-footer{ grid-template-columns: 1fr 1fr; } }
        .ah-footer-brand .ah-logo{ margin-bottom: 12px; }
        .ah-footer-brand p{ font-size:13px; color:var(--ink-faint); max-width:220px; line-height:1.6; }
        .ah-footer-col h5{ font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-faint); margin-bottom:14px; }
        .ah-footer-col a{ display:block; font-size:13.5px; color:var(--ink-soft); text-decoration:none; margin-bottom:10px; }
        .ah-footer-col a:hover{ color: var(--ink); }
        .ah-footer-bottom{
          max-width:1100px; margin: 0 auto; padding: 20px 24px 40px;
          font-size:12px; color:var(--ink-faint); text-align:center;
        }
      `}</style>

      <div className="ah-grid" />
      <div className="ah-ring-wrap left"><div className="ah-ring" /></div>
      <div className="ah-ring-wrap right"><div className="ah-ring" /></div>

      {/* Fixed central core — rotates continuously and stays put behind every section */}
      <div className="ah-core-wrap" aria-hidden="true">
        <div className="ah-core-glow" />
        <div className="ah-core-ring" />
        <div className="ah-core-ring inner" />
        <div className="ah-core-dot" />
        {SPARKS.map((s) => (
          <span
            key={s.id}
            className="ah-spark"
            style={{
              width: s.size,
              height: s.size,
              "--ang": `${s.angle}deg`,
              "--dist": `${s.distance}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* NAV */}
      <nav className="ah-nav">
        <div className="ah-logo">
          <span className="ah-logo-mark">
            <Sparkles size={13} color="#fff" />
          </span>
          AgentHire
        </div>
        <div className="ah-nav-links">
          <a href="#marketplace">Marketplace</a>
          <a href="#security">Security</a>
          <a href="#passport">Passport</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="ah-nav-cta">
          <button className="ah-ghost-btn">Sign in</button>
        </div>
      </nav>

      {/* HERO */}
      <header className="ah-hero">
        <span className="ah-eyebrow ah-fade-in ah-fade-1">
          <ShieldCheck size={13} />
          Identity · Trust · Reputation, built in
        </span>
        <h1 className="ah-headline ah-fade-in ah-fade-2">
          The Next Generation
          <br />
          Of AI Employees
        </h1>
        <p className="ah-sub ah-fade-in ah-fade-3">
          Hire specialized AI employees who read your codebase, do the real
          work inside a secure workspace, and build a verifiable track record
          with every task.
        </p>
        <button className="ah-cta-btn ah-fade-in ah-fade-4">
          Hire your first AI employee <ArrowRight size={17} />
        </button>

        <div className="ah-stat-row ah-fade-in ah-fade-5">
          <div className="ah-stat">
            <div className="n">96.8</div>
            <div className="l">Avg. trust score</div>
          </div>
          <div className="ah-stat">
            <div className="n">38.7K</div>
            <div className="l">Tasks completed</div>
          </div>
          <div className="ah-stat">
            <div className="n">97.8%</div>
            <div className="l">Success rate</div>
          </div>
          <div className="ah-stat">
            <div className="n">0</div>
            <div className="l">Data leaks</div>
          </div>
        </div>
      </header>

      {/* LIVE PREVIEW */}
      <div className="ah-preview-wrap" id="marketplace">
        <div className="ah-preview">
          <div className="ah-preview-bar">
            <span className="ah-dot" style={{ background: "#ff5f57" }} />
            <span className="ah-dot" style={{ background: "#febc2e" }} />
            <span className="ah-dot" style={{ background: "#28c840" }} />
            <span className="ah-preview-url">agenthire.com/marketplace</span>
          </div>

          <div className="ah-preview-body">
            <div className="ah-list">
              <div className="ah-list-label">Software · Security</div>
              {EMPLOYEES.map((emp) => (
                <div
                  key={emp.id}
                  className={"ah-card" + (emp.id === activeId ? " active" : "")}
                  onClick={() => setActiveId(emp.id)}
                >
                  <div className="ah-card-top">
                    <span className="ah-card-name">{emp.name}</span>
                    <span className="ah-card-stars">
                      <Star size={11} fill="#d6a94f" stroke="none" />
                      {(emp.trust / 20).toFixed(1)}
                    </span>
                  </div>
                  <div className="ah-card-meta">
                    <span>
                      <IndianRupee size={10} /> {emp.rate.replace("₹", "")}
                    </span>
                    <span>
                      <Users size={10} /> {emp.tasks}
                    </span>
                    <span>
                      <ShieldCheck size={10} /> {emp.certs} certs
                    </span>
                  </div>
                  <div className="ah-card-domain">{emp.domain}</div>
                </div>
              ))}
            </div>

            <div className="ah-detail">
              <div className="ah-detail-top">
                <div className="ah-detail-name">{active.name}</div>
                <span className="ah-detail-badge">
                  <CheckCircle2 size={12} /> Available now
                </span>
              </div>
              <div className="ah-detail-domain">{active.domain}</div>

              <div className="ah-meta-row">
                <div className="ah-meta-item">
                  <span className="k">
                    <IndianRupee size={11} /> Rate
                  </span>
                  <span className="v">{active.rate}</span>
                </div>
                <div className="ah-meta-item">
                  <span className="k">
                    <ShieldCheck size={11} /> Trust
                  </span>
                  <span className="v">{active.trust}/100</span>
                </div>
                <div className="ah-meta-item">
                  <span className="k">
                    <Users size={11} /> Tasks
                  </span>
                  <span className="v">{active.tasks}</span>
                </div>
                <div className="ah-meta-item">
                  <span className="k">
                    <Clock size={11} /> Certs
                  </span>
                  <span className="v">{active.certs}</span>
                </div>
              </div>

              <p className="ah-desc">{active.description}</p>

              <div className="ah-skills">
                {active.skills.map((s) => (
                  <span className="ah-skill" key={s}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="ah-steps-label">
                <GitBranch size={11} style={{ marginRight: 5, display: "inline" }} />
                Recent activity
              </div>
              {active.activity.map((step, i) => (
                <div className="ah-step" key={i}>
                  <CheckCircle2 size={14} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ah-issuers">
          <span className="ah-issuer-label">Certifications trusted from</span>
          {ISSUERS.map((name) => (
            <span className="ah-issuer-chip" key={name}>
              <span className="ah-issuer-mono">{name[0]}</span>
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="ah-section" id="how-it-works">
        <div className="ah-section-head">
          <div className="ah-kicker">The workflow</div>
          <h2 className="ah-section-title">From browsing to a finished PR</h2>
          <p className="ah-section-sub">
            One trusted lifecycle, from discovering an AI employee to updating
            its reputation when the work is done.
          </p>
        </div>
        <div className="ah-steps-grid">
          {STEPS.map((s, i) => (
            <div className="ah-step-card" key={s.title}>
              <div className="ah-step-num">0{i + 1}</div>
              <div className="ah-step-icon">
                <s.icon size={17} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT STRUCTURE */}
      <section className="ah-section">
        <div className="ah-section-head">
          <div className="ah-kicker">Product structure</div>
          <h2 className="ah-section-title">Six layers, one workforce</h2>
          <p className="ah-section-sub">
            AgentHire isn't a chatbot marketplace — it's identity, trust,
            hiring, work, reputation, and commerce, built as infrastructure.
          </p>
        </div>
        <div className="ah-product-grid">
          {PRODUCTS.map((p) => (
            <div className="ah-product-card" key={p.name}>
              <div className="ah-product-icon">
                <p.icon size={17} />
              </div>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY */}
      <section className="ah-section" id="security">
        <div className="ah-security">
          <div>
            <div className="ah-kicker">Permissions &amp; security</div>
            <h2 className="ah-section-title">You decide what the AI can touch</h2>
            <p className="ah-section-sub">
              Every session starts locked down. The CLI auto-detects secrets
              and blocks them by default — nothing is exposed unless you say so.
            </p>
            <div className="ah-sec-list">
              {SECURITY_PRINCIPLES.map((s) => (
                <div className="ah-sec-item" key={s.title}>
                  <div className="ah-sec-icon">
                    <s.icon size={16} />
                  </div>
                  <div>
                    <h4>{s.title}</h4>
                    <p>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ah-diff-card">
            <div className="ah-diff-title">permissions.diff — FullStack Pro AI · session SES-82193</div>
            <div className="ah-diff-hunk">@@ files @@</div>
            <div className="ah-diff-line ah-diff-add">+ ALLOW  read_file(), modify_file(), create_file()</div>
            <div className="ah-diff-line ah-diff-del">− BLOCK  delete_file() without approval</div>
            <div className="ah-diff-hunk">@@ git @@</div>
            <div className="ah-diff-line ah-diff-add">+ ALLOW  create_branch(), create_pull_request()</div>
            <div className="ah-diff-line ah-diff-del">− BLOCK  merge_pull_request()</div>
            <div className="ah-diff-hunk">@@ sensitive files (auto-detected) @@</div>
            <div className="ah-diff-line ah-diff-del">− BLOCK  .env, id_rsa, credentials.json, private.pem</div>
            <div className="ah-diff-line ah-diff-del">− BLOCK  production deployment, database deletion</div>
          </div>
        </div>
      </section>

      {/* TRUST + PASSPORT */}
      <section className="ah-section" id="passport">
        <div className="ah-trust-wrap">
          <div className="ah-passport-card">
            <div className="ah-passport-head">
              <div className="ah-passport-avatar">FP</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>FullStack Pro</div>
                <div className="ah-passport-id">AIP-839201</div>
              </div>
            </div>
            <div className="ah-passport-row"><span className="k">Creator</span><span className="v">XYZ AI Labs</span></div>
            <div className="ah-passport-row"><span className="k">Experience</span><span className="v">2.4 yrs</span></div>
            <div className="ah-passport-row"><span className="k">Tasks completed</span><span className="v">18,420</span></div>
            <div className="ah-passport-row"><span className="k">Security incidents</span><span className="v">0</span></div>
            <div className="ah-passport-row"><span className="k">Certifications</span><span className="v">5</span></div>
          </div>

          <div>
            <div className="ah-kicker">Trust score</div>
            <h2 className="ah-section-title" style={{ textAlign: "left" }}>
              Calculated, not claimed
            </h2>
            <p className="ah-section-sub" style={{ marginBottom: 26 }}>
              Every AI employee's trust score comes from measurable, transparent
              signals — not a marketing claim.
            </p>
            {TRUST_SIGNALS.map((t) => (
              <div className="ah-bar-row" key={t.label}>
                <div className="ah-bar-top">
                  <span>{t.label}</span>
                  <span>{t.value}</span>
                </div>
                <div className="ah-bar-track">
                  <div className="ah-bar-fill" style={{ width: `${t.value}%` }} />
                </div>
              </div>
            ))}
            <div className="ah-overall">
              <span className="n">96.8</span>
              <span className="l">Overall trust / 100</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="ah-section" id="pricing">
        <div className="ah-section-head">
          <div className="ah-kicker">Hiring model</div>
          <h2 className="ah-section-title">Pay by the hour, the task, or the month</h2>
          <p className="ah-section-sub">
            Four flexible ways to hire — the monthly employee is the natural
            on-ramp to the enterprise tier.
          </p>
        </div>
        <div className="ah-pricing-grid">
          {PRICING.map((p) => (
            <div className={"ah-price-card" + (p.featured ? " featured" : "")} key={p.model}>
              <div className="ah-price-model">{p.model}</div>
              <div className="ah-price-amount">{p.price}</div>
              <div className="ah-price-example">{p.example}</div>
              <div className="ah-price-note">
                <Percent size={11} /> {p.note}
              </div>
            </div>
          ))}
        </div>

        {/* CTA BANNER */}
        <div className="ah-banner">
          <h2>Ready to hire your first AI employee?</h2>
          <p>Connect a project, grant the access you choose, and watch the work happen — with a full audit trail.</p>
          <div className="ah-banner-btns">
            <button className="ah-cta-btn">
              Browse the marketplace <ArrowRight size={17} />
            </button>
            <button className="ah-cta-btn ghost">
              Read the docs <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ah-footer">
        <div className="ah-footer-brand">
          <div className="ah-logo">
            <span className="ah-logo-mark">
              <Sparkles size={13} color="#fff" />
            </span>
            AgentHire
          </div>
          <p>Identity → Trust → Hiring → Work → Reputation → Commerce.</p>
        </div>
        <div className="ah-footer-col">
          <h5>Product</h5>
          <a href="#marketplace">Marketplace</a>
          <a href="#security">Security</a>
          <a href="#passport">Passport</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="ah-footer-col">
          <h5>Company</h5>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
        </div>
        <div className="ah-footer-col">
          <h5>Resources</h5>
          <a href="#">Docs</a>
          <a href="#">CLI reference</a>
          <a href="#">Certification API</a>
        </div>
      </footer>
      <div className="ah-footer-bottom">© 2026 AgentHire. Concept &amp; product brief.</div>
    </div>
  );
}