# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Build & Production
npm run build
npm run start

# Database
npm run setup        # Install deps, generate Prisma client, run migrations
npm run db:reset     # Reset and re-migrate the database
npx prisma generate  # Regenerate Prisma client after schema changes

# Tests
npm test             # Run all tests with Vitest
npx vitest run src/lib/__tests__/file-system.test.ts  # Run a single test file
```

## Environment Variables

- `ANTHROPIC_API_KEY` — optional; without it the app uses a `MockLanguageModel` that returns static examples
- `JWT_SECRET` — session signing key; a dev default is provided in code

## Architecture

UIGen is an AI-powered React component generator. Users describe a component in chat, the AI edits files via tool calls, and a live preview renders the result in a sandboxed iframe.

### Request Flow

1. User sends a chat message → `POST /api/chat`
2. Route handler (`src/app/api/chat/route.ts`) passes the message + current virtual file system state to Claude
3. Claude streams a response using two tools: `str_replace_editor` (view/create/str_replace/insert) and `file_manager` (rename/delete)
4. Tool calls are applied to the virtual file system on the client
5. The preview iframe re-renders; for authenticated users, the project is auto-saved to SQLite

### Virtual File System (`src/lib/file-system.ts`)

All files live in memory — nothing is written to disk. The `VirtualFileSystem` class stores a hierarchical tree using `Map`s. It serializes to/from a plain JSON structure for API transport and database persistence. The AI operates on this FS via the tool schema; the client applies tool results through `FileSystemContext`.

### Component Preview (`src/components/preview/PreviewFrame.tsx`)

The preview is an `<iframe sandbox>` that receives a generated HTML document. `src/lib/transform/jsx-transformer.ts` uses Babel to transpile JSX and builds an import map pointing to `esm.sh` for third-party packages. It detects the entry point by looking for `App.jsx`, `App.tsx`, `index.jsx`, etc.

### AI Provider (`src/lib/provider.ts`)

Returns `claude-haiku-4-5` when `ANTHROPIC_API_KEY` is set, otherwise a `MockLanguageModel`. The system prompt lives in `src/lib/prompts/generation.tsx`.

### Auth (`src/lib/auth.ts`)

JWT sessions stored in `HttpOnly` cookies (7-day expiry). Middleware at `src/middleware.ts` protects `/api/projects` and `/api/filesystem`. All data mutations go through server actions in `src/actions/`.

### Database

SQLite via Prisma. Two models: `User` (email + hashed password) and `Project` (stores serialized messages and file system as JSON strings). After editing `prisma/schema.prisma`, run `npx prisma generate && npx prisma migrate dev`.

### Key Contexts

- `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) — owns the in-memory FS instance, exposes file CRUD to all components
- `ChatContext` (`src/lib/contexts/chat-context.tsx`) — wraps Vercel AI SDK's `useChat`, ties AI tool results back to the file system

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).
