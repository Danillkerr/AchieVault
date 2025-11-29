# Coursework: AchieVault – Game Achievement Tracker

A modern web application for dedicated gamers to track, manage, and plan their video game achievement hunting. This project is being developed as a 3rd-year coursework for a Software Engineering program.

---

## Description

The modern gaming landscape is fragmented across dozens of platforms (Steam, GOG, PlayStation, Xbox, etc.). For players who love to complete games 100%, tracking their progress and managing their "backlog" is a major challenge.

**AchieVault** provides a centralized hub to monitor game achievements (starting with Steam) and, most importantly, plan a "roadmap" to 100% completion.

## Core Architecture & Principles

This project is built using a **monorepo** approach, housing the backend and frontend in a single repository for unified version control and issue tracking.

- **Backend (NestJS):** The server-side application is built with a strong emphasis on **Object-Oriented Programming (OOP)** and **SOLID** principles. This ensures the codebase is scalable, maintainable, and testable.
- **API:** Communication is handled via a **RESTful API**, providing clear, stateless endpoints for the frontend to consume.
- **Frontend (React):** The client is a component-based Single Page Application (SPA) built with React.

## Key Features

- **Steam Synchronization:**
  - Automatically syncs your game library, playtime, and achievement progress from Steam.
  - Background synchronization using Redis and Bull queues to keep data up-to-date without impacting performance.
- **Discovery & Search:**
  - Search for games (powered by IGDB & Steam) and other users.
  - View detailed game stats, including "Time to Beat" and achievements.
- **Game Roadmaps:**
  - Plan your backlog using a **Kanban Board** system.
  - Drag and drop games between _Planned_, _In Progress_, _Deferred_, and _Completed_ statuses.
  - Receive automated game recommendations based on completion time and difficulty.
- **Global & Friend Leaderboards:**
  - **Completionists:** Ranked by the number of 100% completed games.
  - **Hunters:** Ranked by the total number of unlocked achievements.
  - Compare your stats directly with friends via the Friend Ranking modal.
- **Community Guides:**
  - Write and share rich-text guides for specific games using the integrated editor.
  - View guides created by other users to help unlock difficult achievements
- **Localization:**
  - Fully localized interface supporting **English** and **Ukrainian** (UA).

## Tech Stack

### Frontend

- **Core:** React 19, TypeScript, Vite
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v7
- **UI Components:** CSS Modules, React Hot Toast (Notifications)
- **Interactivity:** @dnd-kit (Kanban board drag-and-drop), React Quill New (Guide editor)
- **Internationalization:** i18next

### Backend

- **Framework:** NestJS
- **Database:** PostgreSQL (with TypeORM)
- **Queue & Caching:** Redis, Bull (for handling background sync jobs)
- **Authentication:** Passport.js (JWT + Steam OpenID Strategy)
- **External APIs:**
  - **Steam Web API:** For user profiles, libraries, and achievement data.
  - **IGDB API:** For high-quality game metadata, covers, and rating info.

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm
- PostgreSQL
- Redis

## Installation & Running

1. Backend:

   ```bash
   cd backend
   pnpm install
   nest start

   ```

2. Frontend:
   ```bash
   cd frontend
   pnpm install
   pnpm run dev
   ```

## License

This project is open-source and available under the MIT License.
