# KAI - Production Deployment Guide

## Prerequisites

- Node.js 20+
- A server (VPS, AWS, DigitalOcean, etc.)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt is free)

## Environment Setup

### 1. Generate JWT Secret

```bash
openssl rand -base64 64
```

Copy this value for the `JWT_SECRET` environment variable.

### 2. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key for the `OPENAI_API_KEY` environment variable

### 3. Create Production .env File

```bash
cp .env.example .env
```

Edit `.env` with your production values:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
PORT=3001
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
JWT_SECRET=your-generated-secret-here
OPENAI_API_KEY=your-openai-api-key-here
```

## Deployment Steps

### Option 1: Manual Deployment

1. **Clone the repository on your server**
   ```bash
   git clone https://github.com/Bgman508/kai-your-sentient-ai-companion.git
   cd kai-your-sentient-ai-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the frontend**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm run server
   ```

### Option 2: PM2 (Recommended)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem file**
   ```bash
   cat > ecosystem.config.js << 'EOF'
   module.exports = {
     apps: [{
       name: 'kai-server',
       script: './server/index.js',
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       env: {
         NODE_ENV: 'production',
         PORT: 3001
       }
     }]
   };
   EOF
   ```

3. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Option 3: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["node", "server/index.js"]
   ```

2. **Build and run**
   ```bash
   docker build -t kai .
   docker run -p 3001:3001 --env-file .env kai
   ```

## Nginx Configuration (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        root /path/to/kai/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Migration (Optional)

To migrate from in-memory storage to a real database:

1. Install database driver (e.g., PostgreSQL)
   ```bash
   npm install pg
   ```

2. Update storage layer in `server/routes/*.js`
3. Add database connection to `server/index.js`

## Security Checklist

- [ ] JWT_SECRET is a strong random string
- [ ] OpenAI API key is set
- [ ] NODE_ENV is set to 'production'
- [ ] SSL certificate is configured
- [ ] Firewall rules are set (only allow ports 80, 443, SSH)
- [ ] Regular security updates (`npm audit fix`)

## Monitoring

```bash
# View logs
pm2 logs kai-server

# Monitor resources
pm2 monit
```

## Troubleshooting

### Server won't start
- Check if JWT_SECRET is set
- Check if port 3001 is available
- Check logs: `pm2 logs`

### AI responses not working
- Verify OPENAI_API_KEY is set correctly
- Check API key has sufficient credits

### Frontend not loading
- Verify build completed: `npm run build`
- Check Nginx configuration
- Verify dist folder exists
