# CoSketch WebSocket

CoSketch WebSocket is the real-time communication server for **CoSketch**, enabling collaborative sketching with instant updates using WebSockets. Built with **Bun** for performance and efficiency.

## Getting Started

### 1️⃣ Install Dependencies

Ensure you have [Bun](https://bun.sh) installed, then run:

```sh
bun install
```

### 2️⃣ Run the WebSocket Server

Start the WebSocket server using:

```sh
bun run index.ts
```

For development with file watching:

```sh
bun run --watch index.ts
```

Or simply:

```sh
bun run dev
```

### 3️⃣ Project Structure

```sh
co-sketch-websocket/
├── src/
│   ├── server.ts     # WebSocket server logic
│   ├── handlers/     # Event handlers for messages
│   ├── utils/        # Helper functions
│   ├── index.ts      # Entry point
├── package.json      # Project metadata & scripts
├── bun.lockb         # Bun lock file
└── README.md         # Documentation
```

## Tech Stack

- **Bun** → Fast JavaScript runtime
- **WebSockets** → Real-time bidirectional communication
- **TypeScript** → Ensuring type safety

## Scripts (package.json)

```json
{
  "scripts": {
    "dev": "bun run src/server.ts",
    "start": "bun run src/server.ts",
    "lint": "bun lint"
  }
}
```

## To-Do

- [ ] Implement event handling for real-time sketch updates
- [ ] Optimize WebSocket message handling
- [ ] Add authentication support

---

### **"Sketch Together, Think Better."**
