# Eurovision Tracker

My new full stack project for ranking and viewing Eurovision Song Contest entrys. WIP

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Supabase](https://supabase.com/) account and project (for PostgreSQL database)

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with your Supabase PostgreSQL connection string:

```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
```

## 3. Apply Database Migrations

This will create all necessary tables in your Supabase database:

```bash
npx prisma migrate deploy
```

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Seed the Database

This will populate the database with Eurovision entry data:

```bash
npm run seed
```

## 6. Start the Development Server

```bash
npm run dev
```
