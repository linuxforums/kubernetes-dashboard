# Kubernetes-Dashboard

A beautiful dark glassy Kubernetes dashboard for visualizing and managing K8s clusters. Built with Next.js, TypeScript, and Express.js, featuring an Apple-inspired glassmorphism design.

![Kubernetes Dashboard](https://img.shields.io/badge/Kubernetes-Dashboard-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- 🎨 **Beautiful Dark Glassy UI** - Apple-inspired glassmorphism design
- 📊 **Cluster Overview** - Real-time metrics and health monitoring
- 🖥️ **Node Management** - View and monitor cluster nodes
- 🐳 **Pod Visualization** - Manage and track pods across namespaces
- 📦 **Deployment Control** - Scale and manage deployments
- 🌐 **Service Discovery** - View and manage services
- 🔄 **Real-time Updates** - Auto-refresh every 10 seconds
- 📱 **Responsive Design** - Works on desktop and tablet

## Screenshots

*Coming soon - Add screenshots of your dashboard*

## Prerequisites

- Node.js 20+ and npm
- Kubernetes cluster (or kubectl configured)
- Docker and Docker Compose (optional, for containerized deployment)

## Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/linuxforums/kubernetes-dashboard.git
   cd kubernetes-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure Kubernetes**
   
   Make sure you have `kubectl` configured and can access your cluster:
   ```bash
   kubectl cluster-info
   ```
   
   The dashboard will automatically load your kubeconfig from `~/.kube/config`

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start both frontend (http://localhost:3000) and backend (http://localhost:3001)

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the dashboard**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Usage

### Demo Mode

If you don't have a Kubernetes cluster configured, the dashboard will run in demo mode with mock data. This is perfect for:
- Testing the UI
- Demonstrating features
- Development without cluster access

### Connecting to a Cluster

1. **Local Cluster (minikube/kind)**
   ```bash
   # Start minikube
   minikube start
   
   # Verify connection
   kubectl get nodes
   ```

2. **Remote Cluster**
   ```bash
   # Configure kubectl
   kubectl config set-cluster my-cluster --server=https://your-cluster-url
   kubectl config set-credentials my-user --token=your-token
   kubectl config set-context my-context --cluster=my-cluster --user=my-user
   kubectl config use-context my-context
   ```

3. **In-Cluster Deployment**
   
   If deploying the dashboard inside a Kubernetes cluster, it will automatically use the service account. Create the necessary RBAC:

   ```yaml
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: kubernetes-dashboard
     namespace: default
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRole
   metadata:
     name: kubernetes-dashboard
   rules:
   - apiGroups: [""]
     resources: ["*"]
     verbs: ["get", "list", "watch"]
   - apiGroups: ["apps"]
     resources: ["*"]
     verbs: ["get", "list", "watch", "update", "patch"]
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: ClusterRoleBinding
   metadata:
     name: kubernetes-dashboard
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: ClusterRole
     name: kubernetes-dashboard
   subjects:
   - kind: ServiceAccount
     name: kubernetes-dashboard
     namespace: default
   ```

## Project Structure

```
kubernetes-dashboard/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── kubernetes/      # Kubernetes client
│   │   └── index.ts         # Server entry point
│   └── package.json
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Production Docker image
└── README.md
```

## API Endpoints

### Cluster
- `GET /api/cluster/info` - Get cluster information
- `GET /api/cluster/metrics` - Get cluster metrics

### Nodes
- `GET /api/nodes` - List all nodes

### Pods
- `GET /api/pods` - List all pods

### Deployments
- `GET /api/deployments` - List all deployments
- `POST /api/deployments/:namespace/:name/scale` - Scale deployment

### Services
- `GET /api/services` - List all services

## Development

### Frontend Development

```bash
cd frontend
npm run dev
```

### Backend Development

```bash
cd backend
npm run dev
```

### Running Tests

*Add test commands when tests are added*

## Configuration

### Environment Variables

**Backend** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Troubleshooting

### Cannot connect to cluster

1. Verify kubectl is configured:
   ```bash
   kubectl cluster-info
   ```

2. Check kubeconfig location:
   ```bash
   echo $KUBECONFIG
   # or
   ls ~/.kube/config
   ```

3. The dashboard will fall back to mock data if no cluster is found

### Port already in use

Change the port in the configuration files:
- Frontend: `frontend/package.json` or `frontend/.env.local`
- Backend: `backend/.env` or `backend/src/index.ts`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Kubernetes](https://kubernetes.io/) - Container orchestration platform
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Recharts](https://recharts.org/) - Charting library

## Demo

Try the dashboard at: [Demo](https://soon)

For a live demo without a cluster, the dashboard will display mock data automatically.

## Support

For issues and questions, please open an issue on GitHub.


