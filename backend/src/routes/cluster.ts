import express from 'express';
import { getK8sApi, getK8sAppsApi } from '../kubernetes/client';

const router = express.Router();

// Get cluster info
router.get('/info', async (req, res) => {
  try {
    const api = getK8sApi();
    if (!api) {
      throw new Error('Kubernetes API not initialized');
    }

    // Get nodes
    const nodesResponse = await api.listNode();
    const nodes = nodesResponse.body.items.map((node) => ({
      name: node.metadata?.name,
      status: node.status?.conditions?.find((c: any) => c.type === 'Ready')?.status === 'True' ? 'Ready' : 'NotReady',
    }));

    // Get version (from first node or cluster info)
    const version = nodesResponse.body.items[0]?.status?.nodeInfo?.kubeletVersion || 'Unknown';

    res.json({
      version,
      nodes: nodes || [],
      connected: true,
    });
  } catch (error: any) {
    console.error('Error fetching cluster info:', error.message);
    // Return mock data for demo purposes
    res.json({
      version: 'v1.28.0',
      nodes: [
        { name: 'node-1', status: 'Ready' },
        { name: 'node-2', status: 'Ready' },
      ],
      connected: false,
    });
  }
});

// Get cluster metrics
router.get('/metrics', async (req, res) => {
  try {
    const api = getK8sApi();
    if (!api) {
      throw new Error('Kubernetes API not initialized');
    }
    
    // Get nodes for resource calculation
    const nodesResponse = await api.listNode();
    const nodes = nodesResponse.body.items;

    // Calculate approximate CPU and memory usage
    // In a real implementation, you'd use the metrics API
    const totalNodes = nodes.length;
    const cpuUsage = totalNodes > 0 ? Math.random() * 60 + 20 : 0; // Mock data
    const memoryUsage = totalNodes > 0 ? Math.random() * 50 + 30 : 0; // Mock data

    res.json({
      cpu: `${cpuUsage.toFixed(1)}%`,
      memory: `${memoryUsage.toFixed(1)}%`,
      nodes: totalNodes,
    });
  } catch (error: any) {
    console.error('Error fetching cluster metrics:', error.message);
    // Return mock data
    res.json({
      cpu: '45.2%',
      memory: '62.8%',
      nodes: 2,
    });
  }
});

export default router;

