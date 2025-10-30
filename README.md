# Coursework: AchieVault – Game Achievement Tracker

**A modern web application for dedicated gamers to track, manage, and plan their video game achievement hunting.**

---

## Description

The modern gaming landscape is fragmented across dozens of platforms (Steam, GOG, PlayStation, Xbox, etc.). For players who love to complete games 100%, tracking their progress and managing their "backlog" is a major challenge.

**AchieVault** (Game Achievement Tracker) is a web application being developed as a 3rd-year сoursework for a Software Engineering program. Inspired by services like `completionist.me`, it provides ability to monitor game achievements and, most importantly, plan your path to 100% completion.

## Key Features

- **Steam Integration:** Securely log in with your Steam account (via Steam OpenID) to automatically sync your game library and achievement progress.
- **Achievement Monitoring:** Get a clear, detailed view of all your achievements for any given game, seeing exactly what you've unlocked and what's left to do.
- **The "Roadmap" Feature:** Create an ordered "roadmap" (a sequential queue) of games you plan to complete, allowing you to focus on one game at a time.
- **Leaderboards:** Within the app you can compare your progress on a shared leaderboard. See who has the most achievements or 100% completions between games, friends and globally.
- **Guides:** Users can add their guides to help others on their road to 100%.

## Tech Stack

This project is built as a Monolithic Application with a RESTful API.

| Area         | Technology               | Description                                                                                   |
| :----------- | :----------------------- | :-------------------------------------------------------------------------------------------- |
| **Backend**  | **Nest.js** (TypeScript) | A progressive Node.js framework for building efficient and scalable server-side applications. |
| **Frontend** | **React**                | A JavaScript library for building user interfaces based on components.                        |
| **Database** | **PostgreSQL**           | A powerful, open-source object-relational database system.                                    |
| **ORM**      | **TypeORM**              | An ORM that runs in Node.js and can be used with TypeScript.                                  |
| **Auth**     | **Passport.js**          | Flexible and modular authentication middleware for Node.js.                                   |
