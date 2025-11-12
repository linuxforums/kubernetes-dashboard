'use client';

import { useEffect, useState } from 'react';
import { Network, ExternalLink, Server, Globe } from 'lucide-react';

interface Service {
  name: string;
  namespace: string;
  type: string;
  clusterIP: string;
  externalIP: string;
  ports: string[];
  age: string;
  selector: Record<string, string>;
}

export default function ServicesView() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.namespace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="glass rounded-2xl p-8">
          <div className="animate-pulse text-white/60">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Services</h2>
        <div className="text-sm text-white/60">{filteredServices.length} services</div>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl glass border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/30"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredServices.map((service) => (
          <ServiceCard key={`${service.namespace}-${service.name}`} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <Network className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <p className="text-white/60">No services found</p>
        </div>
      )}
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'loadbalancer':
        return <ExternalLink className="w-5 h-5 text-orange-400" />;
      case 'nodeport':
        return <Server className="w-5 h-5 text-blue-400" />;
      case 'clusterip':
        return <Network className="w-5 h-5 text-green-400" />;
      default:
        return <Globe className="w-5 h-5 text-purple-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'loadbalancer':
        return 'bg-orange-400/10 text-orange-400';
      case 'nodeport':
        return 'bg-blue-400/10 text-blue-400';
      case 'clusterip':
        return 'bg-green-400/10 text-green-400';
      default:
        return 'bg-purple-400/10 text-purple-400';
    }
  };

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-400/10">
            {getTypeIcon(service.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{service.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 text-xs rounded glass text-white/80">
                {service.namespace}
              </span>
              <span className={`px-2 py-1 text-xs rounded ${getTypeColor(service.type)}`}>
                {service.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div>
          <div className="text-xs text-white/60 mb-1">Cluster IP</div>
          <div className="text-sm font-semibold text-white">{service.clusterIP || 'None'}</div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1">External IP</div>
          <div className="text-sm font-semibold text-white">{service.externalIP || 'None'}</div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1">Age</div>
          <div className="text-sm font-semibold text-white">{service.age}</div>
        </div>
      </div>

      {service.ports && service.ports.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/60 mb-2">Ports</div>
          <div className="flex flex-wrap gap-2">
            {service.ports.map((port, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-lg glass text-white/80"
              >
                {port}
              </span>
            ))}
          </div>
        </div>
      )}

      {service.selector && Object.keys(service.selector).length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/60 mb-2">Selector</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(service.selector).map(([key, value]) => (
              <span
                key={key}
                className="px-3 py-1 text-xs rounded-lg glass text-white/80"
              >
                {key}={value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

