# 🛡️ CyberHelp (Cyber Guardian Hub)

> A modern, trilingual web portal built to protect, educate, and assist everyday internet users and citizens against online fraud, cyber scams, and digital threats.

Available in **English**, **हिंदी (Hindi)**, and **मराठी (Marathi)**.

---

## ✨ Features & Modules

### 1. 🌐 Trilingual Accessibility
- Instant real-time language switching between English, हिंदी, and मराठी.
- Localized terminology, emergency instructions, questions, and safety guides tailored for Indian citizens.

### 2. 🚨 Immediate Help & Emergency Reporting
- **Emergency Helplines:** 1-click direct dial to the **National Cyber Crime Helpline (`1930`)**, police emergency (`112`), and direct links to the official [cybercrime.gov.in](https://cybercrime.gov.in) portal.
- **Golden Hour Guidance:** Urgent protocols to freeze fraudulent bank and UPI transactions within the critical first 24 hours.
- **Evidence Checklist:** Step-by-step guidance on collecting transaction IDs, bank statements, screenshots, and call records for official complaints.
- **Cyber Assistance Request System:** Form to submit incident summaries, generating a unique incident tracking reference number (`CH-XXXXX`) with offline persistence and cloud backup.

### 3. 🔍 Interactive Tools & Threat Detectors
- **Email Breach Checker:** Real-time search of public data breach records via XposedOrNot to detect compromised accounts without storing personal data.
- **Link, Domain & Email Authenticity Inspector:** Multi-layer security analyzer executing live DNS resolution, SSL/TLS certificate verification, redirect unmasking (for URL shorteners like `bit.ly`), mail exchange (MX) & DMARC/SPF anti-spoofing checks, and heuristic detection for brand impersonation, deceptive subdomains, and scam keywords.
- **Interactive Cyber-Safety Quiz:** Real-world fraud scenario questions with instant score calculations and detailed rationales.
- **Live Field Survey Analytics:** Direct real-time synchronization with Google Form survey responses, rendering interactive charts and community awareness metrics.

### 4. 🤖 AI Agent Integration (Model Context Protocol - MCP)
- Embedded MCP server at `/mcp` exposing 5 tools for external AI models and assistants:
  - `inspect_link_authenticity`: Deep multi-vector domain, link, and email authenticity analysis.
  - `list_awareness_articles`: Query safety articles in any language.
  - `check_email_leak`: Check email breach status.
  - `get_cyber_safety_guide`: Retrieve helplines and safety checklists.
  - `get_survey_results`: Query community field survey aggregates.


---

## 🛠️ Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (Fullstack React 19 + Nitro)
- **Routing:** TanStack Router (File-based routing)
- **Styling:** Tailwind CSS & Radix UI primitives
- **Database & Backend:** Supabase Client & Server Functions (`createServerFn`)
- **Intelligence:** Model Context Protocol (`@lovable.dev/mcp-js`)
- **Breach API:** XposedOrNot Public API

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm or pnpm or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cyberhelp-portal

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```text
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI components & layouts (SiteShell, etc.)
│   ├── integrations/       # Database & Supabase client integration
│   ├── lib/
│   │   ├── breach.functions.ts  # Email leak lookup logic
│   │   ├── content.ts           # Trilingual article and helpline content
│   │   ├── i18n.tsx             # Multi-language state & translator hook
│   │   ├── mcp/                 # MCP server tool definitions
│   │   └── survey.functions.ts  # Live Google Sheet survey parsing & cache
│   ├── routes/             # TanStack Start file-based pages
│   │   ├── __root.tsx      # App shell, SEO meta & headers
│   │   ├── index.tsx       # Homepage
│   │   ├── awareness.tsx   # Threat awareness articles
│   │   ├── breach-check.tsx# Email breach checker page
│   │   ├── contact.tsx     # Assistance request form
│   │   ├── quiz.tsx        # Cyber safety quiz
│   │   ├── report.tsx      # Emergency helplines & reporting steps
│   │   ├── safety.tsx      # Safety tips & Link Authenticity Inspector
│   │   ├── survey.tsx      # Live survey results & charts
│   │   └── mcp.ts          # MCP server endpoint (/mcp)
│   └── styles.css          # Design system & theme styles
├── vite.config.ts          # Vite bundler configuration
└── package.json            # Dependencies and scripts
```

---

## 🔒 Privacy & Safety Notice
CyberHelp does not store email addresses entered in the leak checker or sensitive passwords. If you are experiencing active financial fraud, dial **1930** immediately.
