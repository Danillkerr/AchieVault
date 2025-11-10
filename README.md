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

- **Steam Integration:** Securely log in with your Steam account (via Steam OpenID) to automatically sync your game library and achievement progress.
- **Achievement Monitoring:** Get a clear, detailed view of all your achievements for any given game.
- **The "Roadmap" Feature:** Create an ordered "roadmap" (a sequential queue) of games you plan to complete.
- **Leaderboards:** Compare your progress (achievements, 100% completions) against friends and the global community.
- **Guides:** Users can add their own guides or watch other's to help others on their road to 100%.

## Tech Stack

This project is built as a Monolithic Application with a RESTful API.

| Area         | Technology               | Description                                                                                                                  |
| :----------- | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| **Backend**  | **Nest.js** (TypeScript) | A progressive Node.js framework for building efficient and scalable server-side applications that can adhering OOP & SOLID.. |
| **Frontend** | **React** (TypeScript)   | A component-based library for building user interfaces.                                                                      |
| **Database** | **PostgreSQL**           | A powerful, open-source object-relational database system.                                                                   |
| **ORM**      | **TypeORM**              | An ORM that runs in Node.js and can be used with TypeScript.                                                                 |
| **Auth**     | **Passport.js**          | Flexible and modular authentication middleware for Node.js.                                                                  |

| External APIs     | Description                                                      |
| :---------------- | :--------------------------------------------------------------- |
| **Steam Web API** | For user auth (OpenID) and syncing game/achievement data.        |
| **IGDB API**      | For fetching rich game metadata (covers, genres, ratings, etc.). |
