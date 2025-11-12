import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clusterRoutes from './routes/cluster';
import nodesRoutes from './routes/nodes';
import podsRoutes from './routes/pods';
import deploymentsRoutes from './routes/deployments';
import servicesRoutes from './routes/services';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/cluster', clusterRoutes);
app.use('/api/nodes', nodesRoutes);
app.use('/api/pods', podsRoutes);
app.use('/api/deployments', deploymentsRoutes);
app.use('/api/services', servicesRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

