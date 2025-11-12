import express from 'express';
import { getK8sApi } from '../kubernetes/client';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const api = getK8sApi();
    if (!api) {
      throw new Error('Kubernetes API not initialized');
    }
    const response = await api.listServiceForAllNamespaces();
    
    const services = response.body.items.map((service) => {
      const type = service.spec?.type || 'ClusterIP';
      const clusterIP = service.spec?.clusterIP || 'None';
      const externalIPs = service.status?.loadBalancer?.ingress?.[0]?.ip || 
                         service.spec?.externalIPs?.[0] || 
                         'None';
      
      const ports = service.spec?.ports?.map((port: any) => 
        `${port.port}${port.targetPort ? `:${port.targetPort}` : ''}${port.protocol ? `/${port.protocol}` : ''}`
      ) || [];

      return {
        name: service.metadata?.name || 'Unknown',
        namespace: service.metadata?.namespace || 'default',
        type,
        clusterIP,
        externalIP: externalIPs,
        ports,
        age: calculateAge(service.metadata?.creationTimestamp),
        selector: service.spec?.selector || {},
      };
    });

    res.json({ items: services });
  } catch (error: any) {
    console.error('Error fetching services:', error.message);
    // Return mock data for demo
    res.json({
      items: [
        {
          name: 'nginx-service',
          namespace: 'default',
          type: 'LoadBalancer',
          clusterIP: '10.96.0.1',
          externalIP: '192.168.1.100',
          ports: ['80:8080/TCP', '443:8443/TCP'],
          age: '2d',
          selector: { app: 'nginx' },
        },
        {
          name: 'redis-service',
          namespace: 'default',
          type: 'ClusterIP',
          clusterIP: '10.96.0.2',
          externalIP: 'None',
          ports: ['6379/TCP'],
          age: '5d',
          selector: { app: 'redis' },
        },
        {
          name: 'postgres-service',
          namespace: 'production',
          type: 'ClusterIP',
          clusterIP: '10.96.0.3',
          externalIP: 'None',
          ports: ['5432/TCP'],
          age: '10d',
          selector: { app: 'postgres' },
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
  
  if (diffDays > 0) {
    return `${diffDays}d`;
  } else if (diffHours > 0) {
    return `${diffHours}h`;
  } else {
    return '<1h';
  }
}

export default router;

