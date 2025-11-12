'use client';

import { useEffect, useState } from 'react';
import { Layers, ArrowUp, ArrowDown, RefreshCw, MoreVertical } from 'lucide-react';

interface Deployment {
  name: string;
  namespace: string;
  ready: string;
  upToDate: number;
  available: number;
  age: string;
  replicas: number;
  strategy: string;
}

export default function DeploymentsView() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeployments = async () => {
    try {
      const response = await fetch('/api/deployments');
      if (response.ok) {
        const data = await response.json();
        setDeployments(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch deployments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeployments = deployments.filter((deployment) =>
    deployment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deployment.namespace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scaleDeployment = async (namespace: string, name: string, replicas: number) => {
    try {
      const response = await fetch(`/api/deployments/${namespace}/${name}/scale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replicas }),
      });
      if (response.ok) {
        fetchDeployments();
      }
    } catch (error) {
      console.error('Failed to scale deployment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="glass rounded-2xl p-8">
          <div className="animate-pulse text-white/60">Loading deployments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Deployments</h2>
        <div className="text-sm text-white/60">{filteredDeployments.length} deployments</div>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search deployments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl glass border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredDeployments.map((deployment) => (
          <DeploymentCard
            key={`${deployment.namespace}-${deployment.name}`}
            deployment={deployment}
            onScale={scaleDeployment}
          />
        ))}
      </div>

      {filteredDeployments.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <Layers className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <p className="text-white/60">No deployments found</p>
        </div>
      )}
    </div>
  );
}

function DeploymentCard({
  deployment,
  onScale,
}: {
  deployment: Deployment;
  onScale: (namespace: string, name: string, replicas: number) => void;
}) {
  const [replicas, setReplicas] = useState(deployment.replicas);
  const isReady = deployment.ready === `${deployment.available}/${deployment.replicas}`;

  const handleScale = (delta: number) => {
    const newReplicas = Math.max(0, replicas + delta);
    setReplicas(newReplicas);
    onScale(deployment.namespace, deployment.name, newReplicas);
  };

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isReady ? 'bg-green-400/10' : 'bg-yellow-400/10'}`}>
            <Layers className={`w-5 h-5 ${isReady ? 'text-green-400' : 'text-yellow-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{deployment.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 text-xs rounded glass text-white/80">
                {deployment.namespace}
              </span>
              <span className="px-2 py-1 text-xs rounded glass text-white/80">
                {deployment.strategy}
              </span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          isReady ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'
        }`}>
          {deployment.ready}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <div className="text-xs text-white/60 mb-1">Replicas</div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-white">{replicas}</div>
            <div className="flex gap-1">
              <button
                onClick={() => handleScale(-1)}
                className="p-1 rounded glass hover:glass-strong transition-all"
                title="Scale down"
              >
                <ArrowDown className="w-4 h-4 text-white/80" />
              </button>
              <button
                onClick={() => handleScale(1)}
                className="p-1 rounded glass hover:glass-strong transition-all"
                title="Scale up"
              >
                <ArrowUp className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1">Up to Date</div>
          <div className="text-sm font-semibold text-white">{deployment.upToDate}</div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1">Available</div>
          <div className="text-sm font-semibold text-white">{deployment.available}</div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1">Age</div>
          <div className="text-sm font-semibold text-white">{deployment.age}</div>
        </div>
      </div>
    </div>
  );
}

