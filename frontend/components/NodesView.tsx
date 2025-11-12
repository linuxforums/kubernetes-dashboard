'use client';

import { useEffect, useState } from 'react';
import { Server, Cpu, HardDrive, Activity, Container } from 'lucide-react';

interface Node {
  name: string;
  status: string;
  roles: string[];
  cpu: string;
  memory: string;
  pods: number;
  age: string;
  version: string;
  conditions: any[];
}

export default function NodesView() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNodes();
    const interval = setInterval(fetchNodes, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNodes = async () => {
    try {
      const response = await fetch('/api/nodes');
      if (response.ok) {
        const data = await response.json();
        setNodes(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="glass rounded-2xl p-8">
          <div className="animate-pulse text-white/60">Loading nodes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Nodes</h2>
        <div className="text-sm text-white/60">{nodes.length} nodes</div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {nodes.map((node) => (
          <NodeCard key={node.name} node={node} />
        ))}
      </div>

      {nodes.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <Server className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <p className="text-white/60">No nodes found</p>
        </div>
      )}
    </div>
  );
}

function NodeCard({ node }: { node: Node }) {
  const isReady = node.conditions?.some((c: any) => c.type === 'Ready' && c.status === 'True');
  const cpuUsage = parseFloat(node.cpu) || 0;
  const memoryUsage = parseFloat(node.memory) || 0;

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isReady ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
            <Server className={`w-5 h-5 ${isReady ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{node.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {node.roles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-1 text-xs rounded glass text-white/80"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          isReady ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
        }`}>
          {node.status}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <MetricItem
          icon={Cpu}
          label="CPU"
          value={`${cpuUsage.toFixed(1)}%`}
          color="blue"
        />
        <MetricItem
          icon={HardDrive}
          label="Memory"
          value={`${memoryUsage.toFixed(1)}%`}
          color="green"
        />
        <MetricItem
          icon={Container}
          label="Pods"
          value={node.pods.toString()}
          color="purple"
        />
        <MetricItem
          icon={Activity}
          label="Version"
          value={node.version}
          color="orange"
        />
      </div>

      {node.conditions && node.conditions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            {node.conditions.map((condition: any, index: number) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${
                  condition.status === 'True'
                    ? 'bg-green-400/10 text-green-400'
                    : 'bg-yellow-400/10 text-yellow-400'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  condition.status === 'True' ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <span>{condition.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricItem({ icon: Icon, label, value, color }: any) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
  };

  return (
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${colorClasses[color as keyof typeof colorClasses]}`} />
      <div>
        <div className="text-xs text-white/60">{label}</div>
        <div className="text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

