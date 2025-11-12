'use client';

import { Activity, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  clusterInfo: any;
  loading: boolean;
}

export default function Header({ clusterInfo, loading }: HeaderProps) {
  const isConnected = clusterInfo && !loading;

  return (
    <header className="glass-strong border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-white">Kubernetes Dashboard</h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full glass text-sm">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Disconnected</span>
              </>
            )}
          </div>
        </div>
        {clusterInfo && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-white/80">
                {clusterInfo.nodes?.length || 0} Nodes
              </span>
            </div>
            <div className="text-sm text-white/60">
              {clusterInfo.version || 'Unknown Version'}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

