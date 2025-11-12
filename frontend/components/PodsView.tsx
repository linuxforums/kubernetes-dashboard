'use client';

import { useEffect, useState } from 'react';
import { Container, Clock, AlertCircle, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

interface Pod {
  name: string;
  namespace: string;
  status: string;
  ready: string;
  restarts: number;
  age: string;
  node: string;
  ip: string;
  containers: string[];
}

export default function PodsView() {
  const [pods, setPods] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPods();
    const interval = setInterval(fetchPods, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPods = async () => {
    try {
      const response = await fetch('/api/pods');
      if (response.ok) {
        const data = await response.json();
        setPods(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch pods:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPods = pods.filter((pod) => {
    const matchesFilter = filter === 'all' || pod.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = pod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pod.namespace.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'failed':
      case 'error':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="glass rounded-2xl p-8">
          <div className="animate-pulse text-white/60">Loading pods...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Pods</h2>
        <div className="text-sm text-white/60">{filteredPods.length} pods</div>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search pods..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl glass border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
        />
        <div className="flex gap-2">
          {['all', 'running', 'pending', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                filter === status
                  ? 'glass-strong border border-white/20 text-white'
                  : 'glass text-white/70 hover:text-white border border-transparent'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPods.map((pod) => (
          <PodCard key={`${pod.namespace}-${pod.name}`} pod={pod} />
        ))}
      </div>

      {filteredPods.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <Container className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <p className="text-white/60">No pods found</p>
        </div>
      )}
    </div>
  );
}

function PodCard({ pod }: { pod: Pod }) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'bg-green-400/20 text-green-400';
      case 'pending':
        return 'bg-yellow-400/20 text-yellow-400';
      case 'failed':
      case 'error':
        return 'bg-red-400/20 text-red-400';
      default:
        return 'bg-gray-400/20 text-gray-400';
    }
  };

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-400/10">
            <Container className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{pod.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 text-xs rounded glass text-white/80">
                {pod.namespace}
              </span>
              {pod.containers && pod.containers.length > 0 && (
                <span className="px-2 py-1 text-xs rounded glass text-white/80">
                  {pod.containers.length} container{pod.containers.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(pod.status)}`}>
            {getStatusIcon(pod.status)}
            <span>{pod.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <div className="text-xs text-white/60 mb-1">Ready</div>
          <div className="text-sm font-semibold text-white">{pod.ready}</div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1">Restarts</div>
          <div className="text-sm font-semibold text-white">{pod.restarts}</div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1">Age</div>
          <div className="text-sm font-semibold text-white">{pod.age}</div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1">Node</div>
          <div className="text-sm font-semibold text-white truncate">{pod.node || 'N/A'}</div>
        </div>
      </div>

      {pod.ip && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/60">IP: <span className="text-white">{pod.ip}</span></div>
        </div>
      )}
    </div>
  );
}

