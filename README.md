# 🌍 GreenHire 

**The luxury job board for climate tech champions.**

GreenHire is a premium SaaS platform built for the modern clean energy and sustainability sector. It connects top-tier engineering, design, and product talent with the world's most innovative climate tech startups.

The platform is engineered with a dark-first, cinematic aesthetic utilizing high-fidelity glassmorphism, dynamic ambient meshes, and highly interactive user components.

---

## ⚡ Tech Stack

- **Frontend Core**: [Next.js 14](https://nextjs.org/) (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, custom mesh atmospheric gradients, `@tailwindcss/typography`
- **UI & Motion**: Framer Motion, Lucide Icons, Shadcn/ui
- **Backend & Database**: [Appwrite](https://appwrite.io/) (PostgreSQL migrating to native Appwrite Collections)
- **CMS (Blog & Case Studies)**: Sanity v3
- **Typography**: Vercel Geist (Geist Sans & Geist Mono)

---

## ✨ Core Features

* **Cinematic Aesthetic**: A fully custom dark-mode ecosystem leveraging emerald and lime gradients over a deep textured canvas.
* **Interactive Job Feed**: High-performance client-side filtering engine linking sidebar constraints directly to dynamic job logic mapping.
* **Premium Job Pages**: Dynamic Server Pages pulling live roles directly from Appwrite, formatted beautifully utilizing localized `prose-invert` Markdown parsers.
* **Sticky Sidebars & Advanced UI**: Complex nested architectural layouts modeling standard enterprise software structures.

---

## 🚀 Getting Started

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Configuration

Copy the `.env.local.example` file to create your own configuration pipeline tying into Appwrite and Sanity.

```bash
cp .env.local.example .env.local
```

Ensure the following variables are strictly configured:
* Appwrite endpoint and Project credentials.
* Sanity CMS configuration keys.

### 3. Run the Development Server

Start the application on localhost:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application hot-reloads dynamically as you tweak the system.

---

## 📝 Project Structure

- `src/app/` - Next.js 14 App Router endpoints (Index, `/jobs`, `/blog`)
- `src/components/` - Global generic components (Buttons, Inputs, Forms, Glass Containers)
- `src/sections/` - Massive layout chunks constructed specifically for the Landing Page flow
- `src/styles/` - Global CSS definitions and pure Tailwind root overrides
- `src/lib/` - Appwrite and server-side configurations

---

*Designed to build the future, save the planet.*
