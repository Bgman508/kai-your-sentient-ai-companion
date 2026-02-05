# Base44 to Standalone Migration Guide

This document details the complete migration from Base44 platform to a standalone React + Express application.

## Summary of Changes

### Dependencies Removed
- `@base44/sdk` - Replaced with custom Axios-based API client
- `@base44/vite-plugin` - Removed from Vite config

### Dependencies Added
- `axios` - HTTP client for API requests
- `express` - Backend server framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware
- `morgan` - HTTP request logger
- `express-rate-limit` - Rate limiting
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `uuid` - Unique ID generation
- `openai` - OpenAI API client (optional)

## File Changes

### Configuration Files

#### `vite.config.js`
**Before:**
```javascript
import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    base44({ legacySDKImports: true, hmrNotifier: true }),
    react(),
  ]
});
```

**After:**
```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: { port: 3000 },
  build: { outDir: 'dist', sourcemap: true }
});
```

#### `package.json`
- Removed `@base44/sdk` and `@base44/vite-plugin`
- Upgraded React to v19
- Upgraded Vite to v6
- Added Express and related server dependencies
- Added `server` and `server:dev` scripts

### Frontend Changes

#### `src/api/base44Client.js` → `src/api/apiClient.js`
**Before:**
```javascript
import { createClient } from '@base44/sdk';
export const base44 = createClient({ appId, token, requiresAuth: false });
```

**After:**
```javascript
import axios from 'axios';
const apiClient = axios.create({ baseURL: API_BASE_URL });
export const authAPI = { login: (creds) => apiClient.post('/auth/login', creds) };
export const aiAPI = { reasoning: (q) => apiClient.post('/ai/reasoning', { query: q }) };
// ... more API exports
```

#### `src/lib/AuthContext.jsx`
**Before:**
```javascript
import { base44 } from '@/api/base44Client';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';
const currentUser = await base44.auth.me();
base44.auth.logout(window.location.href);
```

**After:**
```javascript
import { authAPI } from '@/api/apiClient';
const response = await authAPI.me();
const login = async (credentials) => { /* custom implementation */ };
const logout = () => { localStorage.removeItem('kai_access_token'); };
```

#### `src/lib/NavigationTracker.jsx`
**Before:**
```javascript
import { base44 } from '@/api/base44Client';
base44.appLogs.logUserInApp(pageName);
```

**After:**
```javascript
import { appLogsAPI } from '@/api/apiClient';
appLogsAPI.logPageView(pageName);
```

#### `src/lib/app-params.js`
**Before:**
```javascript
const storageKey = `base44_${toSnakeCase(paramName)}`;
appId: getAppParamValue("app_id", { defaultValue: import.meta.env.VITE_BASE44_APP_ID }),
```

**After:**
```javascript
const storageKey = `kai_${toSnakeCase(paramName)}`;
apiBaseUrl: getAppParamValue("api_base_url", { defaultValue: import.meta.env.VITE_API_BASE_URL }),
```

#### `src/lib/PageNotFound.jsx`
**Before:**
```javascript
import { base44 } from '@/api/base44Client';
const user = await base44.auth.me();
```

**After:**
```javascript
import { authAPI } from '@/api/apiClient';
const response = await authAPI.me();
```

#### `src/functions/*` (Deno → Node.js)
All function files converted from Deno/Base44 to frontend JavaScript:

**Before (Deno):**
```typescript
import { createClientFromRequest } from 'npm:@base44/sdk@0.5.0';
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  const memories = await base44.entities.Memory.list();
});
```

**After (Frontend):**
```javascript
import { aiAPI } from '@/api/apiClient';
export async function reasoningOrchestrator({ query }) {
  const response = await aiAPI.reasoning(query);
  return { data: response.data, error: null };
}
```

### Backend Changes (New)

Created complete Express.js backend in `server/` directory:

```
server/
├── index.js              # Main server entry
├── middleware/
│   ├── auth.js           # JWT authentication
│   └── errorHandler.js   # Error handling
└── routes/
    ├── auth.js           # Auth endpoints
    ├── users.js          # User management
    ├── memories.js       # Memory CRUD
    ├── goals.js          # Goal CRUD
    ├── context.js        # User context
    ├── selfAudit.js      # Self-audit logs
    ├── godModeState.js   # God mode state
    ├── ai.js             # AI function endpoints
    └── logs.js           # Activity logging
```

## Environment Variables

### Client (.env)
| Old | New |
|-----|-----|
| `VITE_BASE44_APP_ID` | Removed |
| `VITE_BASE44_APP_BASE_URL` | `VITE_API_BASE_URL` |
| `VITE_BASE44_FUNCTIONS_VERSION` | Removed |

### Server (.env) - New
```env
PORT=3001
CLIENT_URL=http://localhost:3000
NODE_ENV=development
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-key  # Optional
```

## API Endpoint Mapping

| Base44 | New Express |
|--------|-------------|
| `base44.auth.me()` | `GET /api/auth/me` |
| `base44.auth.logout()` | `POST /api/auth/logout` |
| `base44.entities.Memory.list()` | `GET /api/memories` |
| `base44.entities.Memory.create()` | `POST /api/memories` |
| `base44.entities.Goal.list()` | `GET /api/goals` |
| `base44.entities.Goal.create()` | `POST /api/goals` |
| `base44.appLogs.logUserInApp()` | `POST /api/logs/page-view` |

## AI Functions Mapping

| Old Function | New Endpoint |
|--------------|--------------|
| `reasoningOrchestrator.ts` | `POST /api/ai/reasoning` |
| `creativityEngine.ts` | `GET /api/ai/creativity` |
| `evolutionOrchestrator.ts` | `POST /api/ai/evolution` |
| `selfEvolutionEngine.ts` | `POST /api/ai/self-evolution` |
| `dailyBriefingGenerator.ts` | `GET /api/ai/daily-briefing` |
| `goalSuggester.ts` | `GET /api/ai/suggest-goals` |
| `metaCognitionEngine.ts` | `GET /api/ai/meta-cognition` |
| `crossDomainFusion.ts` | `POST /api/ai/cross-domain-fusion` |
| `worldStateModeling.ts` | `GET /api/ai/world-state` |
| `dynamicOntologyBuilder.ts` | `GET /api/ai/ontology` |
| `omniversalIntegrator.ts` | `GET /api/ai/omniversal` |

## Data Storage

### Before (Base44)
- Managed database through Base44 platform
- Entities defined in Base44 builder
- Automatic CRUD operations

### After (In-Memory)
- In-memory Maps for development
- Easy upgrade path to MongoDB/PostgreSQL
- Explicit data models in route files

## Authentication Flow

### Before
1. Base44 handles OAuth/token management
2. SDK automatically attaches tokens
3. Redirects handled by Base44

### After
1. JWT tokens stored in localStorage
2. Axios interceptor adds Authorization header
3. Custom login/register/logout flows
4. Token refresh on 401 errors

## Development Workflow

### Before
```bash
npm install
npm run dev  # Base44 dev server
```

### After
```bash
npm install

# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run dev
```

## Production Deployment

### Before
- Deploy through Base44 platform
- Automatic hosting and scaling

### After
```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm run server
```

Or use Docker:
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

## Migration Checklist

- [x] Remove @base44/vite-plugin from vite.config.js
- [x] Remove @base44/sdk from package.json
- [x] Create custom API client with Axios
- [x] Refactor AuthContext for JWT authentication
- [x] Update NavigationTracker
- [x] Convert all Deno functions to Express routes
- [x] Update app-params.js
- [x] Update index.html branding
- [x] Create .env.example
- [x] Add error handling middleware
- [x] Create comprehensive README
- [x] Update all component imports
- [x] Verify no base44 references remain

## Benefits of Migration

1. **Full Control** - Own your entire stack
2. **No Platform Lock-in** - Independent of Base44
3. **Customizable** - Modify any part of the system
4. **Cost Effective** - Self-hosting options
5. **Scalable** - Choose your own database and hosting
6. **Open Source Friendly** - Can be fully open sourced

## Known Limitations

1. **In-Memory Storage** - Data resets on server restart (upgrade to database for production)
2. **No Real-time** - No WebSocket support yet
3. **Single Server** - No horizontal scaling setup

## Future Enhancements

1. Add MongoDB/PostgreSQL integration
2. Implement WebSocket for real-time features
3. Add Redis for caching
4. Set up Docker Compose for easy deployment
5. Add comprehensive test suite
6. Implement CI/CD pipeline
