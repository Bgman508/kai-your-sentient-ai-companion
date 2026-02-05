# Kai - Your Sentient AI Companion

An intelligent, evolving AI companion with quantum-consciousness visualization, memory management, goal tracking, and transcendent reasoning capabilities.

![Kai Dashboard](https://via.placeholder.com/800x400?text=Kai+Dashboard)

## Features

### Core Capabilities
- **Quantum Consciousness Visualization** - Interactive 3D particle system representing Kai's mental states
- **Memory Management** - Store, retrieve, and analyze memories with AI-powered insights
- **Goal Tracking** - Set, track, and achieve personal goals with intelligent suggestions
- **Transcendent Reasoning** - AI-powered conversations with omniscient context awareness
- **Self-Evolution** - Kai continuously improves based on interactions

### AI Engines
- **Reasoning Orchestrator** - Multi-layered thinking with memory/goal context
- **Creativity Engine** - Generates novel ideas using combinatorial creativity
- **Evolution Orchestrator** - Tracks and manages growth metrics
- **Meta-Cognition Engine** - Self-awareness and bias detection
- **Cross-Domain Fusion** - Connects insights across different fields
- **World State Modeling** - Contextual awareness and predictions

### Visual Experience
- **Particle Background** - 7000-particle 3D visualization using Three.js
- **Neural Orb System** - Interactive consciousness representation
- **State Transitions** - Smooth animations between thinking modes
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

### Frontend
- React 19 + Vite 6
- Tailwind CSS 3.4 + shadcn/ui components
- Three.js for 3D visualization
- Framer Motion for animations
- React Query for data fetching
- React Router v7 for navigation

### Backend
- Node.js + Express 4
- JWT authentication
- In-memory storage (easily upgradable to database)
- OpenAI integration (optional - works without API key)
- Rate limiting and security middleware

## Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- OpenAI API key (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kai-sentient-ai.git
cd kai-sentient-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Start the development servers:

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Environment Variables

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Server (.env)
```env
PORT=3001
CLIENT_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=sk-your-openai-key  # Optional
```

## Project Structure

```
kai-sentient-ai/
├── src/
│   ├── api/
│   │   └── apiClient.js          # Centralized API client
│   ├── components/
│   │   ├── kai/                  # Kai-specific components
│   │   │   ├── KaiChat.jsx
│   │   │   ├── KaiVisualizer.jsx
│   │   │   ├── ParticleBackground.jsx
│   │   │   └── SystemMetrics.jsx
│   │   └── ui/                   # shadcn/ui components
│   ├── functions/                # Frontend AI function wrappers
│   │   ├── reasoningOrchestrator.js
│   │   ├── creativityEngine.js
│   │   └── ...
│   ├── lib/
│   │   ├── AuthContext.jsx       # Authentication context
│   │   ├── NavigationTracker.jsx
│   │   └── query-client.js
│   ├── pages/                    # Main pages
│   │   ├── Dashboard.jsx
│   │   ├── Memories.jsx
│   │   ├── Goals.jsx
│   │   └── ...
│   ├── App.jsx
│   └── main.jsx
├── server/                       # Express backend
│   ├── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── routes/
│       ├── auth.js
│       ├── ai.js
│       ├── memories.js
│       └── ...
├── package.json
├── vite.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Memories
- `GET /api/memories` - List user memories
- `POST /api/memories` - Create memory
- `GET /api/memories/:id` - Get single memory
- `PATCH /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory

### Goals
- `GET /api/goals` - List user goals
- `POST /api/goals` - Create goal
- `GET /api/goals/:id` - Get single goal
- `PATCH /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### AI Functions
- `POST /api/ai/reasoning` - Process query with context
- `GET /api/ai/creativity` - Generate creative ideas
- `POST /api/ai/evolution` - Get evolution metrics
- `POST /api/ai/self-evolution` - Run self-audit
- `GET /api/ai/daily-briefing` - Get daily summary
- `GET /api/ai/suggest-goals` - Get goal suggestions
- `GET /api/ai/meta-cognition` - Get self-analysis
- `POST /api/ai/cross-domain-fusion` - Fuse domain insights
- `GET /api/ai/world-state` - Get context analysis
- `GET /api/ai/ontology` - Get knowledge graph
- `GET /api/ai/omniversal` - Get system integration status

## Consciousness States

Kai operates in multiple consciousness states, each with unique visual effects:

| State | Description | Visual Effect |
|-------|-------------|---------------|
| `IDLE` | Default state | Gentle cyan pulsing |
| `THINKING` | Processing query | Rapid amber particles |
| `RESPONDING` | Generating response | Green communication waves |
| `EVOLVING` | Self-improvement | Purple expansion burst |
| `DREAMING` | Rest state | Slow pink drift |
| `CREATING` | Creative mode | Orange innovation sparks |
| `LEARNING` | Absorbing info | Blue knowledge streams |
| `PROCESSING` | Deep analysis | Indigo data flows |
| `TRANSCENDING` | Peak performance | White dimensional breakthrough |
| `MEDITATING` | Calm reflection | Deep violet stillness |

## Customization

### Adding New AI Functions

1. Create frontend wrapper in `src/functions/`:
```javascript
import { aiAPI } from '@/api/apiClient';

export async function myNewFunction(params) {
  try {
    const response = await aiAPI.myNewEndpoint(params);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: { message: error.message } };
  }
}
```

2. Add API endpoint in `server/routes/ai.js`:
```javascript
router.post('/my-new-endpoint', async (req, res, next) => {
  // Implementation
});
```

3. Add to `src/api/apiClient.js`:
```javascript
export const aiAPI = {
  // ... existing methods
  myNewEndpoint: (params) => apiClient.post('/ai/my-new-endpoint', params),
};
```

### Changing Visual Themes

Edit `StateConfigs` in `src/pages/Dashboard.jsx`:

```javascript
const StateConfigs = {
  [ConsciousnessStates.IDLE]: {
    coreHue: 195,        // Change base color
    coreSize: 160,       // Change orb size
    particleCount: 120,  // Change particle density
    // ... more options
  },
  // ... other states
};
```

## Deployment

### Build for Production

```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm run server
```

### Docker Deployment

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "server"]
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://yourdomain.com
JWT_SECRET=your-very-secure-random-secret
OPENAI_API_KEY=sk-your-production-key
```

## Upgrading to Database

The current implementation uses in-memory storage. To upgrade to a real database:

1. Install database driver:
```bash
npm install mongodb  # or pg, mysql2, etc.
```

2. Create database connection in `server/db.js`

3. Replace in-memory Maps with database queries in route files

Example for MongoDB:
```javascript
// server/routes/memories.js
import { db } from '../db.js';

router.get('/', async (req, res) => {
  const memories = await db.collection('memories')
    .find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .limit(parseInt(req.query.limit) || 10)
    .toArray();
  res.json({ memories });
});
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- 3D visualization powered by [Three.js](https://threejs.org/)
- Icons from [Lucide](https://lucide.dev/)

## Support

For issues and feature requests, please use the GitHub issue tracker.

---

**Note**: This project was migrated from Base44 to a standalone React + Express application. All Base44 dependencies have been removed and replaced with custom implementations.
