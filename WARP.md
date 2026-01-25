# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
CoSketch is a real-time collaborative drawing application built with a Turborepo monorepo architecture. The system consists of three main applications:
- **Frontend** (Next.js 16): React-based canvas drawing interface
- **Backend** (Express + Bun): REST API for authentication and data persistence
- **WebSocket Server** (Bun + ws): Real-time collaborative drawing synchronization

## Development Commands

### Initial Setup
```bash
# Install all dependencies
bun install

# Start PostgreSQL database
bun run db:up

# Generate Prisma client
bun run generate

# Deploy database migrations
bun run db:deploy
```

### Development Workflow
```bash
# Run all apps in development mode with hot-reload
bun run dev

# Run individual apps
bun run dev --filter=cosketch-frontend
bun run dev --filter=cosketch-backend
bun run dev --filter=cosketch-websocket
```

### Building and Production
```bash
# Build all apps
bun run build

# Start production servers
bun run start

# Start individual production servers
bun run start:frontend
bun run start:backend
bun run start:websocket
```

### Code Quality
```bash
# Run linting across all packages
bun run lint

# Format code with Prettier
bun run format

# Type checking
bun run check-types
```

### Database Management
```bash
# Start PostgreSQL
bun run db:up

# Stop PostgreSQL
bun run db:down

# Deploy migrations
bun run db:deploy

# Access Prisma Studio (database GUI)
cd packages/database && bun run studio

# Generate Prisma client after schema changes
bun run generate
```

### Docker Operations
```bash
# Build production containers
bun run infra:build

# Start all containers
bun run infra:up

# Stop all containers
bun run infra:down
```

### Testing Individual Components
```bash
# Frontend (from apps/cosketch-frontend)
cd apps/cosketch-frontend
bun run lint
bun run check-types

# Backend (from apps/cosketch-backend)
cd apps/cosketch-backend
bun run dev

# WebSocket (from apps/cosketch-websocket)
cd apps/cosketch-websocket
bun run dev
```

## Architecture Overview

### Monorepo Structure
- **apps/**: Three independent applications
  - `cosketch-frontend`: Next.js 16 with App Router, using Zustand for state management
  - `cosketch-backend`: Express.js REST API (authentication, rooms, canvas persistence)
  - `cosketch-websocket`: WebSocket server for real-time collaboration
- **packages/**: Shared code
  - `database`: Prisma ORM with PostgreSQL adapter
  - `types`: Shared TypeScript types and Zod schemas
  - `backend-common`: Shared utilities (JWT verification)
  - `eslint-config`, `typescript-config`: Shared configurations

### Data Flow Architecture

#### Real-Time Collaboration Flow
1. **Client Drawing Action** → Frontend CanvasEngine
2. **WebSocket Message** → Frontend sends shape data via WebSocket
3. **Server Processing** → WebSocket server validates and persists to database
4. **Broadcast** → Server broadcasts to all connected clients in the room
5. **Client Update** → Other clients receive and render the shape

#### Authentication Flow
1. User authenticates via REST API (backend)
2. JWT token is issued
3. Token is used for WebSocket connection authentication
4. Token verified by `@repo/backend-common` utilities

### Frontend Architecture

#### Canvas Engine (`apps/cosketch-frontend/src/canvas_engine/`)
- **CanvasEngine.ts**: Core drawing logic using rough.js for hand-drawn style
  - Manages shape creation (Rectangle, Diamond, Ellipse, Arrow, Line, Freehand, Text)
  - Handles pointer events and drawing state
  - Coordinates with SelectionManager for shape manipulation
- **SelectionManager.ts**: Handles shape selection, moving, resizing, and rotation
- **eraser.ts**: Eraser tool implementation

#### State Management (Zustand stores in `src/stores/`)
- `canvas.store.ts`: Canvas state
- `canvas_style.store.ts`: Drawing style settings (colors, stroke width, fill style)
- `tool.store.ts`: Selected tool state
- `shape_selected.store.ts`: Currently selected shape

#### Key Frontend Directories
- `src/api/`: API client functions for REST endpoints
- `src/hooks/`: React hooks including `useSocket` for WebSocket connection
- `src/components/`: Reusable UI components (forms, auth, dialogs)
- `src/app/`: Next.js App Router pages
  - `canvas/[roomId]/page.tsx`: Main collaborative canvas page
  - `dashboard/page.tsx`: User dashboard
  - `(auth)/`: Authentication pages (signin/signup)

### Backend Architecture

#### Backend API (`apps/cosketch-backend/src/`)
- **Routes**:
  - `auth.routes.ts`: User authentication (signup, signin)
  - `room.routes.ts`: Room creation and management
  - `canvas.routes.ts`: Canvas data persistence
- **Controllers**: Business logic for each route
- **Middleware**: Authentication middleware
- **Utils**: Helper functions

#### WebSocket Server (`apps/cosketch-websocket/src/`)
- **handlers/**:
  - `wsHandler.ts`: Main WebSocket connection handler, authenticates users
  - `roomHandler.ts`: Room join/leave logic, user presence tracking
  - `canvasHandler.ts`: Canvas event processing (draw, update, erase, clear)
- **services/**: Authentication and token extraction services

### Database Schema (Prisma)
- **User**: Users with email/password authentication
- **Room**: Collaborative drawing rooms with admin and slug-based access
- **Canvas**: Stores shape data as JSON, linked to rooms and users

### Type System
All canvas-related types are defined in `packages/types/src/canvas.ts` using Zod schemas:
- **Shape**: Individual drawing elements with type, coordinates, options
- **ShapeOptions**: Style configuration (roughness, stroke, fill)
- **CanvasMessage**: WebSocket messages from client to server
- **BroadcastMessage**: WebSocket messages from server to clients

### Technology Stack
- **Runtime**: Bun for backend services, Node.js for Next.js
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Zustand
- **Backend**: Express.js, Prisma, PostgreSQL
- **Real-time**: WebSocket (ws library)
- **Drawing**: rough.js (hand-drawn style), perfect-freehand (smooth curves)
- **Validation**: Zod schemas
- **Build Tool**: Turborepo with TUI mode

## Environment Variables
Each app requires environment variables. Key variables include:

### Backend (cosketch-backend)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `JWT_EXPIRES_IN`: Token expiration time
- `FRONTEND_URL`: Frontend origin for CORS
- `NODE_ENV`: Environment mode

### Frontend (cosketch-frontend)
- `NEXT_PUBLIC_BACKEND_URL`: Backend API URL
- `NEXT_PUBLIC_WS_URL`: WebSocket server URL

### WebSocket (cosketch-websocket)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Must match backend's JWT_SECRET
- `NODE_ENV`: Environment mode

## Important Development Notes

### Turborepo Task Dependencies
- `build` tasks depend on `^build` (dependencies built first)
- `start:backend` and `start:websocket` depend on `^db:deploy`
- `dev` tasks run concurrently with hot-reload

### WebSocket Message Types
Messages follow strict Zod schemas defined in `@repo/types`:
- **canvas:draw**: Create new shape
- **canvas:update**: Modify existing shape
- **canvas:erase**: Delete shape by ID
- **canvas:clear**: Clear entire canvas
- **room:join**: Join a room
- **room:leave**: Leave a room

### Drawing Engine Behavior
- Uses rough.js for hand-drawn aesthetic with configurable roughness levels
- Supports multiple stroke styles (solid, dashed, dotted)
- Shapes stored with rotation, fill, and stroke options
- Freehand tool uses perfect-freehand library for smooth curves

### Database Migrations
- Migrations are in `packages/database/prisma/migrations/`
- Always run `bun run generate` after schema changes
- Use `bun run db:deploy` for production migrations
- Use `cd packages/database && bun prisma migrate dev` for development migrations

### Package Manager
This project uses **Bun** (v1.2.5 or later) as the package manager and runtime. Do not use npm or yarn.

## CI/CD
GitHub Actions workflows in `.github/workflows/`:
- `cd_backend.yml`: Backend deployment
- `cd_frontend.yml`: Frontend deployment
- `cd_websocket.yml`: WebSocket server deployment

Production Dockerfiles are in `docker/` directory for each service.
