'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ClusterOverview from '@/components/ClusterOverview';
import NodesView from '@/components/NodesView';
import PodsView from '@/components/PodsView';
import DeploymentsView from '@/components/DeploymentsView';
import ServicesView from '@/components/ServicesView';
import Header from '@/components/Header';
import ErrorBoundary from '@/components/ErrorBoundary';

type View = 'overview' | 'nodes' | 'pods' | 'deployments' | 'services';

export default function Home() {
  const [activeView, setActiveView] = useState<View>('overview');
  const [clusterInfo, setClusterInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClusterInfo();
    const interval = setInterval(fetchClusterInfo, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchClusterInfo = async () => {
    try {
      const response = await fetch('/api/cluster/info');
      if (response.ok) {
        const data = await response.json();
        setClusterInfo(data);
      }
    } catch (error) {
      console.error('Failed to fetch cluster info:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <ClusterOverview clusterInfo={clusterInfo} />;
      case 'nodes':
        return <NodesView />;
      case 'pods':
        return <PodsView />;
      case 'deployments':
        return <DeploymentsView />;
      case 'services':
        return <ServicesView />;
      default:
        return <ClusterOverview clusterInfo={clusterInfo} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-black">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header clusterInfo={clusterInfo} loading={loading} />
          <main className="flex-1 overflow-y-auto p-6">
            {loading && !clusterInfo ? (
              <div className="flex items-center justify-center h-full">
                <div className="glass rounded-2xl p-8">
                  <div className="animate-pulse text-white/60">Loading cluster data...</div>
                </div>
              </div>
            ) : (
              renderView()
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

