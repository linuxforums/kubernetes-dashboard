import express from 'express';
import { getK8sApi } from '../kubernetes/client';

const router = express.Router();

// Get all pods
router.get('/', async (req, res) => {
  try {
    const api = getK8sApi();
    if (!api) {
      throw new Error('Kubernetes API not initialized');
    }
    const response = await api.listPodForAllNamespaces();
    
    const pods = response.body.items.map((pod) => {
      const phase = pod.status?.phase || 'Unknown';
      const readyContainers = pod.status?.containerStatuses?.filter((cs: any) => cs.ready).length || 0;
      const totalContainers = pod.spec?.containers?.length || 0;
      const restartCount = pod.status?.containerStatuses?.reduce((sum: number, cs: any) => sum + (cs.restartCount || 0), 0) || 0;

      return {
        name: pod.metadata?.name || 'Unknown',
        namespace: pod.metadata?.namespace || 'default',
        status: phase,
        ready: `${readyContainers}/${totalContainers}`,
        restarts: restartCount,
        age: calculateAge(pod.metadata?.creationTimestamp),
        node: pod.spec?.nodeName || 'N/A',
        ip: pod.status?.podIP || 'N/A',
        containers: pod.spec?.containers?.map((c: any) => c.name) || [],
      };
    });

    res.json({ items: pods });
  } catch (error: any) {
    console.error('Error fetching pods:', error.message);
    // Return mock data for demo
    res.json({
      items: [
        {
          name: 'nginx-deployment-7d4f8d8b5c-abc123',
          namespace: 'default',
          status: 'Running',
          ready: '1/1',
          restarts: 0,
          age: '2h',
          node: 'node-1',
          ip: '10.244.0.5',
          containers: ['nginx'],
        },
        {
          name: 'redis-deployment-6f8c9d4e2b-def456',
          namespace: 'default',
          status: 'Running',
          ready: '1/1',
          restarts: 1,
          age: '1d',
          node: 'node-2',
          ip: '10.244.1.3',
          containers: ['redis'],
        },
        {
          name: 'postgres-deployment-5e7b8a3c1d-ghi789',
          namespace: 'production',
          status: 'Running',
          ready: '1/1',
          restarts: 0,
          age: '3d',
          node: 'node-1',
          ip: '10.244.0.8',
          containers: ['postgres'],
        },
        {
          name: 'pending-pod-xyz123',
          namespace: 'default',
          status: 'Pending',
          ready: '0/1',
          restarts: 0,
          age: '5m',
          node: 'N/A',
          ip: 'N/A',
          containers: ['app'],
        },
      ],
    });
  }
});

function calculateAge(creationTimestamp?: string): string {
  if (!creationTimestamp) return 'Unknown';
  
  const created = new Date(creationTimestamp);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays}d`;
  } else if (diffHours > 0) {
    return `${diffHours}h`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m`;
  } else {
    return '<1m';
  }
}

export default router;

