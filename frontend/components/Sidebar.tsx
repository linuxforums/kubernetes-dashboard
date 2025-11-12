'use client';

import { LayoutDashboard, Server, Container, Layers, Network } from 'lucide-react';
import { clsx } from 'clsx';

type View = 'overview' | 'nodes' | 'pods' | 'deployments' | 'services';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const menuItems = [
  { id: 'overview' as View, label: 'Overview', icon: LayoutDashboard },
  { id: 'nodes' as View, label: 'Nodes', icon: Server },
  { id: 'pods' as View, label: 'Pods', icon: Container },
  { id: 'deployments' as View, label: 'Deployments', icon: Layers },
  { id: 'services' as View, label: 'Services', icon: Network },
];

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="w-64 glass-strong border-r border-white/10 p-4 flex flex-col">
      <div className="mb-8">
        <div className="text-xl font-bold text-white mb-1">K8s Dashboard</div>
        <div className="text-xs text-white/40">Cluster Manager</div>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'glass-strong border border-white/20 text-white shadow-lg'
                  : 'glass text-white/70 hover:glass-strong hover:text-white hover:border-white/10 border border-transparent'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="text-xs text-white/40 text-center">
          Kubernetes Dashboard v1.0.0
        </div>
      </div>
    </aside>
  );
}

