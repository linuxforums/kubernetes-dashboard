import * as k8s from '@kubernetes/client-node';
import * as path from 'path';
import * as fs from 'fs';

let k8sApi: k8s.CoreV1Api;
let k8sAppsApi: k8s.AppsV1Api;
let k8sMetricsApi: any;

export function initKubernetesClient() {
  const kc = new k8s.KubeConfig();
  
  // Try to load kubeconfig from default locations
  try {
    // Check if running in cluster
    if (fs.existsSync('/var/run/secrets/kubernetes.io/serviceaccount/token')) {
      kc.loadFromCluster();
      console.log('📦 Loaded Kubernetes config from cluster');
    } else {
      // Load from default kubeconfig file
      const kubeconfigPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.kube', 'config');
      if (fs.existsSync(kubeconfigPath)) {
        kc.loadFromFile(kubeconfigPath);
        console.log('📁 Loaded Kubernetes config from file');
      } else {
        // Fallback to default (for demo/mock mode)
        kc.loadFromDefault();
        console.log('🔧 Using default Kubernetes config');
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not load Kubernetes config, using mock mode:', error);
    // Continue with mock mode
  }

  k8sApi = kc.makeApiClient(k8s.CoreV1Api);
  k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
  
  // Try to initialize metrics API (optional)
  try {
    // Metrics API might not be available in all clusters
    k8sMetricsApi = kc.makeApiClient(k8s.MetricsV1beta1Api);
  } catch (error) {
    console.warn('⚠️  Metrics API not available');
  }

  return { k8sApi, k8sAppsApi, k8sMetricsApi };
}

export function getK8sApi() {
  return k8sApi;
}

export function getK8sAppsApi() {
  return k8sAppsApi;
}

export function getK8sMetricsApi() {
  return k8sMetricsApi;
}

// Initialize client
initKubernetesClient();

