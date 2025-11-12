# Quick Start Guide

## Prerequisites

- Node.js 20+ installed
- npm or yarn
- (Optional) Kubernetes cluster or kubectl configured

## Installation

### Option 1: Using Setup Script

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Installation

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

## Running the Dashboard

### Development Mode

```bash
# Start both frontend and backend
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Separate Development Servers

```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

## Demo Mode

If you don't have a Kubernetes cluster configured, the dashboard will automatically run in **demo mode** with mock data. This is perfect for:
- Testing the UI
- Demonstrating features
- Development without cluster access

## Connecting to a Real Cluster

1. **Ensure kubectl is configured:**
   ```bash
   kubectl cluster-info
   ```

2. **The dashboard will automatically detect your kubeconfig:**
   - Local: `~/.kube/config`
   - In-cluster: Service account tokens

3. **If connected, you'll see real cluster data:**
   - Real nodes, pods, deployments, and services
   - Live metrics and status

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 3001 are already in use:

**Frontend:** Edit `frontend/package.json` or create `frontend/.env.local`:
```env
PORT=3002
```

**Backend:** Edit `backend/.env`:
```env
PORT=3003
```

### Cannot Connect to Cluster

The dashboard will automatically fall back to demo mode if it can't connect to a cluster. This is normal and expected if you don't have kubectl configured.

### Module Not Found Errors

Make sure you've installed all dependencies:
```bash
npm run install:all
```

## Next Steps

1. Open http://localhost:3000 in your browser
2. Explore the dashboard features
3. Try connecting to a real cluster (optional)
4. Customize the UI and add features

## Features

- ✅ Cluster Overview with metrics
- ✅ Node management and monitoring
- ✅ Pod visualization and filtering
- ✅ Deployment scaling
- ✅ Service discovery
- ✅ Real-time updates (every 10 seconds)
- ✅ Beautiful dark glassy UI

Enjoy your Kubernetes Dashboard! 🚀

