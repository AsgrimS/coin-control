# Coin Control

A simple budgeting app that helps you keep track of your expenses.

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

## Database

To create a database, you need to run the following command:

```bash
pnpm run db:push
```

You can inspect the database by running:

```bash
pnpm run db:studio
```

## Configuration

You need to copy and adjust the `template.example` file to a `.env` file.

You can preview the production build with `pnpm run preview`.
