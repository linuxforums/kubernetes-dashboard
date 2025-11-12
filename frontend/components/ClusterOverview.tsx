'use client';

import { useEffect, useState } from 'react';
import { Server, Container, Layers, Network, Cpu, HardDrive, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ClusterOverviewProps {
  clusterInfo: any;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ClusterOverview({ clusterInfo }: ClusterOverviewProps) {
  const [metrics, setMetrics] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPods: 0,
    runningPods: 0,
    pendingPods: 0,
    totalServices: 0,
    totalDeployments: 0,
  });

  useEffect(() => {
    fetchMetrics();
    fetchStats();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchStats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/cluster/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [podsRes, servicesRes, deploymentsRes] = await Promise.all([
        fetch('/api/pods'),
        fetch('/api/services'),
        fetch('/api/deployments'),
      ]);

      if (podsRes.ok) {
        const podsData = await podsRes.json();
        const running = podsData.items?.filter((p: any) => p.status === 'Running').length || 0;
        const pending = podsData.items?.filter((p: any) => p.status === 'Pending').length || 0;
        setStats(prev => ({
          ...prev,
          totalPods: podsData.items?.length || 0,
          runningPods: running,
          pendingPods: pending,
        }));
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setStats(prev => ({
          ...prev,
          totalServices: servicesData.items?.length || 0,
        }));
      }

      if (deploymentsRes.ok) {
        const deploymentsData = await deploymentsRes.json();
        setStats(prev => ({
          ...prev,
          totalDeployments: deploymentsData.items?.length || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const podStatusData = [
    { name: 'Running', value: stats.runningPods, color: '#10b981' },
    { name: 'Pending', value: stats.pendingPods, color: '#f59e0b' },
    { name: 'Other', value: stats.totalPods - stats.runningPods - stats.pendingPods, color: '#6b7280' },
  ].filter(item => item.value > 0);

  const mockTimeSeriesData = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5}m`,
    cpu: Math.random() * 80 + 10,
    memory: Math.random() * 70 + 15,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Server}
          label="Nodes"
          value={clusterInfo?.nodes?.length || 0}
          color="blue"
        />
        <StatCard
          icon={Container}
          label="Pods"
          value={stats.totalPods}
          color="green"
        />
        <StatCard
          icon={Layers}
          label="Deployments"
          value={stats.totalDeployments}
          color="purple"
        />
        <StatCard
          icon={Network}
          label="Services"
          value={stats.totalServices}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resource Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockTimeSeriesData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" name="CPU %" />
              <Area type="monotone" dataKey="memory" stroke="#10b981" fillOpacity={1} fill="url(#colorMemory)" name="Memory %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pod Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={podStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {podStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Cluster Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HealthMetric
            label="CPU Usage"
            value={metrics?.cpu || '0%'}
            icon={Cpu}
            status="healthy"
          />
          <HealthMetric
            label="Memory Usage"
            value={metrics?.memory || '0%'}
            icon={HardDrive}
            status="healthy"
          />
          <HealthMetric
            label="Active Pods"
            value={`${stats.runningPods}/${stats.totalPods}`}
            icon={Activity}
            status={stats.runningPods === stats.totalPods ? 'healthy' : 'warning'}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-400/10',
    green: 'text-green-400 bg-green-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
    orange: 'text-orange-400 bg-orange-400/10',
  };

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/60">{label}</div>
    </div>
  );
}

function HealthMetric({ label, value, icon: Icon, status }: any) {
  const statusColors = {
    healthy: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl glass">
      <Icon className={`w-8 h-8 ${statusColors[status as keyof typeof statusColors]}`} />
      <div>
        <div className="text-sm text-white/60">{label}</div>
        <div className="text-xl font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

