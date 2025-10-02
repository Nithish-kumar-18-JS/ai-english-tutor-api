# Database Seeding

This directory contains scripts to populate your database with initial data for the AI English Tutor application.

## Available Seeders

### 1. Gamification Seeder (`seed_gamification.ts`)
Seeds the database with:
- **Word Streaks**: Daily, weekly, and total streak goals
- **Achievements**: Progress, consistency, and special achievements

#### Word Streaks
- **Daily**: 1, 3, 7, 14, 30, 100 days
- **Weekly**: 1, 2, 4, 8, 12 weeks  
- **Total**: 10, 25, 50, 100 total streaks

#### Achievements
- **Progress**: 100, 500, 1K, 5K, 10K words learned
- **Consistency**: 7, 30, 100, 365 days streaks
- **Special**: First goal, goal crusher, overachiever, mission accomplished

### 2. Words Seeder (`seed_words.js`)
Seeds vocabulary words (existing seeder)

### 3. Complete Seeder (`seed_all.ts`)
Runs all seeders in the correct order

## Usage

### Run All Seeders
```bash
npm run seed
```

### Run Specific Seeders
```bash
# Gamification only
npm run seed:gamification

# Words only  
npm run seed:words
```

### Direct Execution
```bash
# TypeScript seeders
npx ts-node src/seed/seed_gamification.ts
npx ts-node src/seed/seed_all.ts

# JavaScript seeders
node src/seed/seed_words.js
```

## Database Requirements

Make sure you have:
1. ✅ Applied all Prisma migrations
2. ✅ Generated Prisma client
3. ✅ Database connection configured in `.env`

```bash
# Apply migrations
npm run prisma:migrate

# Generate client
npm run prisma:generate
```

## Data Structure

### WordStreaks Table
```sql
CREATE TABLE "WordStreaks" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type "WordStreakType" NOT NULL, -- DAILY, WEEKLY, TOTAL, ACHIEVEMENT
  goal INTEGER NOT NULL,
  createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP(3) NOT NULL
);
```

### Achievement Table
```sql
CREATE TABLE "Achievement" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type "AchievementType" NOT NULL, -- PROGRESS, CONSISTENCY, SPECIAL
  condition JSONB NOT NULL, -- { "words": 500 } or { "days": 30 }
  createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP(3) NOT NULL
);
```

## Features

- ✅ **Upsert Logic**: Safe to run multiple times
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Error Handling**: Comprehensive error reporting
- ✅ **Progress Tracking**: Console output with emojis
- ✅ **Summary Reports**: Final counts and statistics

## Troubleshooting

### Common Issues

1. **Migration Error**: Run `npm run prisma:migrate` first
2. **Client Error**: Run `npm run prisma:generate` 
3. **Connection Error**: Check your `.env` DATABASE_URL
4. **Permission Error**: Ensure database user has CREATE permissions

### Reset Database
```bash
# Reset and reseed everything
npm run prisma:reset
npm run seed
```
