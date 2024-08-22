# Coin Control

A simple budgeting app that helps you keep track of your expenses.

## Learning project disclaimer

This is a learning project to practice DDD, CQRS and other software architecture concepts. The solutions here may not be something I would use in a production environment as many of them would be over-engineered for the problem at hand.

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
