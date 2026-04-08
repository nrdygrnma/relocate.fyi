# relocate.fyi

A structured relocation intelligence platform providing verified, actionable information for people seriously planning
an international move.

## What it does

Most relocation content is either fluffy lifestyle blogs or prohibitively expensive lawyer consultations. relocate.fyi
sits in the middle — rigorous, structured, and actionable for the educated professional navigating a real move.

The platform provides:

- **Destination profiles** — tax structure, banking reality, healthcare, cost of living, and practical friction points
  for each destination country
- **Origin profiles** — how to exit cleanly: tax liability termination, deregistration, banking continuity, and required
  documents
- **Pathway finder** — answer a few questions and get matched to the right visa or permit based on structured
  eligibility rules
- **Step-by-step trackers** — a personal action plan for each relocation pathway with deadlines and dependencies
- **Admin panel** — manage all country profiles, pathways, and steps without touching the database directly

## Tech stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Framework        | Nuxt 4 (Vue 3, Composition API) |
| State management | Pinia                           |
| Database         | SQLite (via Prisma)             |
| ORM              | Prisma 7                        |
| UI components    | Nuxt UI v3                      |
| Runtime          | Bun                             |
| Language         | TypeScript (strict)             |

## Project structure

```
relocate-fyi/
├── app/
│   ├── components/
│   │   ├── admin/              # Admin form components
│   │   │   ├── destination/    # Destination profile sections
│   │   │   └── origin/         # Origin profile sections
│   │   ├── country/            # Country card component
│   │   ├── pathway/            # Pathway, steps, eligibility components
│   │   └── profile/            # Shared profile display components
│   ├── composables/
│   │   └── useNullableModel.ts # Nullable field helpers for forms
│   ├── layouts/
│   │   └── default.vue         # App shell with header and footer
│   ├── pages/
│   │   ├── index.vue           # Home — country listing
│   │   ├── destination/
│   │   │   └── [slug].vue      # Destination country profile
│   │   ├── origin/
│   │   │   └── [slug].vue      # Origin country profile
│   │   ├── pathway-finder.vue  # Pathway finder questionnaire
│   │   └── admin/
│   │       ├── index.vue       # Admin dashboard
│   │       └── countries/
│   │           ├── index.vue   # Country list
│   │           └── [slug].vue  # Country profile editor
│   ├── stores/
│   │   └── countries.ts        # Pinia store — all data fetching and mutations
│   └── types/
│       └── index.ts            # Shared TypeScript interfaces
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data (Austria + Mauritius)
├── prisma.config.ts            # Prisma 7 configuration
├── server/
│   ├── api/
│   │   ├── countries/          # Public country API routes
│   │   └── admin/              # Admin API routes
│   └── db/
│       └── client.ts           # Prisma client singleton
└── dev.db                      # SQLite database (local only)
```

## Data model

Five entities power the platform:

- **Country** — base entity with flags for destination/origin profile availability
- **DestinationProfile** — six sections: tax, banking, healthcare, cost of living, practical friction, identity
- **OriginProfile** — five sections: tax exit, deregistration, financial continuity, exit documents, identity
- **Pathway** — a specific visa or permit linked to a destination profile
- **Step** — individual action within a pathway, with dependency tracking
- **EligibilityRule** — structured, filterable criteria that power the pathway finder

## Getting started

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- Node.js v20+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/relocate-fyi.git
cd relocate-fyi

# Install dependencies
bun install

# Set up the database
bunx prisma migrate dev

# Generate Prisma client
bunx prisma generate

# Seed with initial data (Austria + Mauritius)
bun prisma/seed.ts

# Start the development server
bun dev
```

The app runs at http://localhost:3000

### Database management

```bash
# Open Prisma Studio (visual database editor)
bunx prisma studio

# Reset database and reseed
bunx prisma migrate reset --force && bun prisma/seed.ts

# Create a new migration after schema changes
bunx prisma migrate dev --name describe_your_change
```

## Content management

Country profiles, pathways, and steps are managed through the built-in admin panel at /admin. No external CMS required.

Each section tracks:

- section_verified_at — when the data was last confirmed accurate
- section_source_url — the official source for the information

Data is manually researched and curated. A scraper watchdog (planned) will monitor official government pages for changes
and flag sections that may need review.

## Current data coverage

| Country   | Type        | Status    |
| --------- | ----------- | --------- |
| Mauritius | Destination | Published |
| Austria   | Origin      | Published |

## Roadmap

| Phase | Focus                                         | Status      |
| ----- | --------------------------------------------- | ----------- |
| 1     | Schema design + seed data                     | Done        |
| 2     | Nuxt app + API layer                          | Done        |
| 3     | Pathway finder + user accounts                | In progress |
| 4     | Timeline tracker + monetization               | Planned     |
| 5     | Scale — new countries + AI-assisted authoring | Planned     |

## Adding a new country

1. Add the country to prisma/seed.ts or directly via Prisma Studio
2. Create a destination or origin profile record
3. Add pathways, eligibility rules, and steps if applicable
4. Set published: true when the profile is complete
5. The country appears automatically on the home page

## Environment variables

| Variable     | Description                  | Default       |
| ------------ | ---------------------------- | ------------- |
| DATABASE_URL | Path to SQLite database file | file:./dev.db |

## License

MIT
