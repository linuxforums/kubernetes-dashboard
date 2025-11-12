# Multi-stage build for frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Backend stage
FROM node:20-alpine AS backend

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ .
RUN npm run build

# Final stage
FROM node:20-alpine

WORKDIR /app

# Copy frontend build
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder /app/frontend/next.config.js ./frontend/
COPY --from=frontend-builder /app/frontend/node_modules ./frontend/node_modules

# Copy backend
COPY --from=backend /app/backend/dist ./backend/dist
COPY --from=backend /app/backend/package*.json ./backend/
COPY --from=backend /app/backend/node_modules ./backend/node_modules

# Install concurrently for running both services
RUN npm install -g concurrently

# Copy root package.json
COPY package.json ./

EXPOSE 3000 3001

CMD ["concurrently", "cd frontend && npm start", "cd backend && npm start"]

