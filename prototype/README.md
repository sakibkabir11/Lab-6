# SplitSmart prototype

A responsive Next.js expense-sharing demo backed by SQLite through Prisma 6. Create groups, add members, record shared expenses, review balances and expense history, and log payments. Equal and percentage splits, optional receipt images, and date-filtered reports are also included.

## Run locally

```bash
cd prototype
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The setup command applies the checked-in additive SQLite migrations and inserts the demo fixtures. It is safe to rerun: migrations are tracked, and the seed uses stable fixture IDs/upserts without clearing unrelated data. To refresh demo fixtures later, run `npm run db:seed`.

By default, Prisma 6 resolves `DATABASE_URL="file:./dev.db"` relative to `prisma/schema.prisma`, so the local file is `prisma/dev.db`. Set `DATABASE_URL` in `.env` to use another SQLite file. `.env.example` shows the default. Local databases and environment files are ignored by Git.

Useful commands:

```bash
npm run db:generate  # regenerate Prisma Client
npm run db:migrate   # apply unapplied migrations without resetting data
npm run db:seed      # upsert demo data
npm run lint
npm run build
```

## Prototype behavior

The user selector is a demo identity switcher, not authentication or access control. New expenses are recorded immediately and affect balances; pre-existing demo expenses marked pending can still be reviewed in the in-app queue. Recording a payment only adds a ledger entry and does not transfer funds or connect to a payment service. Receipt images are stored as local data URLs in SQLite. Do not use this prototype for real financial or personal data.

Amounts and allocated shares are stored as integer cents. Percentage allocations accept two decimal places and must add to exactly 100%; equal-split remainder cents are assigned in stable member-ID order so shares always sum to the expense total. Group totals are calculated from member shares and always net to zero.
