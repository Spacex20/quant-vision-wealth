
// Microservices Orchestrator - Coordinates all platform services
import { portfolioService } from './portfolioService';
import { marketDataService } from './marketDataService';
import { analyticsEngine } from './analyticsEngine';
import { researchEnvironmentService } from './researchEnvironmentService';
import { optimizationEngine } from './optimizationEngine';
import { userManagementService } from './userManagementService';
import { notificationService } from './notificationService';

export interface ServiceHealth {
  serviceName: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastUpdated: string;
  details?: any;
}

export interface SystemStatus {
  overallStatus: 'operational' | 'degraded' | 'major_outage';
  services: ServiceHealth[];
  incidentReports: any[];
}

export interface ServiceMetrics {
  serviceName: string;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  requestsPerSecond: number;
  errorsPerSecond: number;
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'manual';
  condition?: string;
  schedule?: string;
  eventType?: string;
}

export interface WorkflowStep {
  id: string;
  service: string;
  action: string;
  input?: any;
  output?: any;
  timeout?: number;
  retries?: number;
  onSuccess?: WorkflowStep;
  onError?: WorkflowStep;
  condition?: string;
}

export interface ServiceWorkflow {
  id: string;
  name: string;
  description: string;
  triggers: WorkflowTrigger[];
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventPayload {
  eventType: string;
  data: any;
}

class MicroservicesOrchestrator {
  private services: Map<string, any> = new Map();
  private workflows: Map<string, ServiceWorkflow> = new Map();
  private systemStatus: SystemStatus = {
    overallStatus: 'operational',
    services: [],
    incidentReports: []
  };

  constructor() {
    this.registerService('portfolio', portfolioService);
    this.registerService('marketData', marketDataService);
    this.registerService('analytics', analyticsEngine);
    this.registerService('research', researchEnvironmentService);
    this.registerService('optimization', optimizationEngine);
    this.registerService('userManagement', userManagementService);
    this.registerService('notification', notificationService);
    this.setupDefaultWorkflows();
  }

  registerService(serviceName: string, serviceInstance: any): void {
    this.services.set(serviceName, serviceInstance);
    this.systemStatus.services.push({
      serviceName,
      status: 'healthy',
      lastUpdated: new Date().toISOString()
    });
    console.log(`Microservices Orchestrator: Registered service ${serviceName}`);
  }

  unregisterService(serviceName: string): void {
    this.services.delete(serviceName);
    this.systemStatus.services = this.systemStatus.services.filter(s => s.serviceName !== serviceName);
    console.log(`Microservices Orchestrator: Unregistered service ${serviceName}`);
  }

  getServiceHealth(serviceName: string): ServiceHealth | undefined {
    return this.systemStatus.services.find(s => s.serviceName === serviceName);
  }

  // Fix the workflow trigger by adding condition property
  async executeWorkflow(workflowId: string, payload?: any): Promise<any> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    console.log('Microservices Orchestrator: Executing workflow', workflowId);
    
    const results: any[] = [];
    
    for (const step of workflow.steps) {
      try {
        const result = await this.executeWorkflowStep(step, payload, results);
        results.push(result);
        
        if (step.onSuccess) {
          await this.executeWorkflowStep(step.onSuccess, payload, results);
        }
      } catch (error) {
        console.error(`Workflow step ${step.id} failed:`, error);
        
        if (step.onError) {
          await this.executeWorkflowStep(step.onError, payload, results);
        } else {
          throw error;
        }
      }
    }
    
    return results;
  }

  private async executeWorkflowStep(step: WorkflowStep, payload: any, results: any[]): Promise<any> {
    const serviceInstance = this.services.get(step.service);
    if (!serviceInstance) {
      throw new Error(`Service ${step.service} not found`);
    }

    const action = serviceInstance[step.action];
    if (typeof action !== 'function') {
      throw new Error(`Action ${step.action} not found on service ${step.service}`);
    }

    // Check condition before execution
    if (step.condition) {
      const conditionMet = this.evaluateCondition(step.condition, payload, results);
      if (!conditionMet) {
        console.log(`Workflow step ${step.id} skipped due to unmet condition: ${step.condition}`);
        return null;
      }
    }

    console.log(`Executing workflow step ${step.id} - ${step.service}.${step.action}`);
    
    try {
      const timeout = step.timeout || 10000;
      const result = await Promise.race([
        action.call(serviceInstance, step.input),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
        )
      ]);
      
      console.log(`Workflow step ${step.id} completed successfully`);
      return result;
    } catch (error) {
      console.error(`Workflow step ${step.id} failed:`, error);
      throw error;
    }
  }

  private evaluateCondition(condition: string, payload: any, results: any[]): boolean {
    try {
      // Implement a more robust condition evaluation (e.g., using a rule engine)
      // This is a simplified example
      if (condition === 'drift_detected') {
        // Check if the previous step (check-drift) returned true
        const driftCheckResult = results.find(r => r === true);
        return !!driftCheckResult;
      }
      
      // Add more conditions as needed
      return false;
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  private setupDefaultWorkflows(): void {
    const now = new Date().toISOString();
    
    // Portfolio rebalancing workflow
    this.workflows.set('portfolio-rebalancing', {
      id: 'portfolio-rebalancing',
      name: 'Portfolio Rebalancing',
      description: 'Automated portfolio rebalancing based on drift',
      triggers: [
        { 
          type: 'schedule', 
          schedule: '0 9 * * 1', // Every Monday at 9 AM
          condition: 'market_open'
        }
      ],
      steps: [
        {
          id: 'check-drift',
          service: 'portfolio',
          action: 'checkRebalanceNeed',
          timeout: 30000
        },
        {
          id: 'execute-rebalance',
          service: 'optimization',
          action: 'rebalancePortfolio',
          timeout: 60000,
          condition: 'drift_detected'
        }
      ],
      isActive: true,
      createdAt: now,
      updatedAt: now
    });

    // Market data update workflow
    this.workflows.set('market-data-refresh', {
      id: 'market-data-refresh',
      name: 'Market Data Refresh',
      description: 'Refreshes market data for all tracked assets',
      triggers: [
        { type: 'schedule', schedule: '0 * * * *' } // Every hour
      ],
      steps: [
        {
          id: 'get-tracked-assets',
          service: 'portfolio',
          action: 'getAllPortfolios',
          timeout: 30000
        },
        {
          id: 'refresh-quotes',
          service: 'marketData',
          action: 'getMultipleQuotes',
          input: { symbols: '{{get-tracked-assets.assets.symbol}}' },
          timeout: 60000
        }
      ],
      isActive: false,
      createdAt: now,
      updatedAt: now
    });

    // News aggregation workflow
    this.workflows.set('news-aggregation', {
      id: 'news-aggregation',
      name: 'News Aggregation',
      description: 'Aggregates news articles for relevant symbols',
      triggers: [
        { type: 'schedule', schedule: '0/30 * * * *' } // Every 30 minutes
      ],
      steps: [
        {
          id: 'get-trending-symbols',
          service: 'analytics',
          action: 'getTrendingAssets',
          timeout: 30000
        },
        {
          id: 'fetch-news',
          service: 'marketData',
          action: 'getMarketNews',
          input: { symbols: '{{get-trending-symbols.symbols}}' },
          timeout: 60000
        },
        {
          id: 'notify-users',
          service: 'notification',
          action: 'sendNewsDigest',
          input: { news: '{{fetch-news.articles}}' },
          timeout: 30000
        }
      ],
      isActive: false,
      createdAt: now,
      updatedAt: now
    });
  }

  // System Monitoring and Reporting
  getSystemStatus(): SystemStatus {
    return { ...this.systemStatus };
  }

  async collectServiceMetrics(): Promise<ServiceMetrics[]> {
    const metrics: ServiceMetrics[] = [];
    for (const serviceName of this.services.keys()) {
      metrics.push({
        serviceName,
        cpuUsage: Math.random() * 80,
        memoryUsage: Math.random() * 90,
        responseTime: Math.random() * 200,
        requestsPerSecond: Math.random() * 100,
        errorsPerSecond: Math.random() * 5
      });
    }
    return metrics;
  }

  // Event Handling
  async handleEvent(event: EventPayload): Promise<void> {
    console.log('Microservices Orchestrator: Handling event', event.eventType);
    
    for (const workflow of this.workflows.values()) {
      if (workflow.isActive) {
        const eventTrigger = workflow.triggers.find(trigger => trigger.type === 'event' && trigger.eventType === event.eventType);
        if (eventTrigger) {
          try {
            await this.executeWorkflow(workflow.id, event);
          } catch (error) {
            console.error(`Error executing workflow ${workflow.id} for event ${event.eventType}:`, error);
          }
        }
      }
    }
  }
}

export const microservicesOrchestrator = new MicroservicesOrchestrator();
