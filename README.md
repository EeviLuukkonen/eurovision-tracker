# ESCoreboard - Eurovision ranking app

My full stack project for ranking, viewing and comparing Eurovision Song Contest entries.

App is running on [escoreboard.vercel.app](https://escoreboard.vercel.app).

You can browse contest years from 2015 to 2026, look at official result data and create your own yearly rankings. By creating an account, you can save your rankings and compare your scoreboard with the official one. You can get an AI analysis (by Claude) of how your opinions differ from official results.

[Timesheet](https://github.com/EeviLuukkonen/eurovision-tracker/blob/main/docs/tuntikirjanpito.md)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Supabase](https://supabase.com/) account and project (for PostgreSQL database)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with your Supabase PostgreSQL connection string:

```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```

### 3. Apply Database Migrations

This will create all necessary tables in your Supabase database:

```bash
npx prisma migrate deploy
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Seed the Database

This will populate the database with Eurovision entry data:

```bash
npm run seed
npm run seed:results
```

### 6. Start the Development Server

```bash
npm run dev
```

## Use of AI

Copilot has been used during development for brainstorming ideas, designing structures, asking questions and code generation. Some files and functions (e.g. db seeding, utils) have mostly been generated with AI, and those are marked as such with a comment. All other files may include some AI generated parts but are mostly done and designed by me. A lot of the styling and CSS was generated based on prompts describing the wanted look and then tweaking manually. Models used were mainly GPT-5.3-Codex and Claude Sonnet 4.5.

## Future development

Here are some TODOs that I will leave to do-maybe-someday-but-probably-never-will:

* Distinction between semi finals and finals
* Possibility to create multiple rankings of same year and compare them (e.g. before and after live shows)
* Custom rankings based on different criteria: rank winners, by country, by your own winners etc.
* Search other people's rankings and compare with yours
* See community ranking
* Better testing protocol, I was not very test driven and relied on AI on the tests while focusing on features more
