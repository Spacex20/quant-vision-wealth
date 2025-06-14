
// Microservices Orchestrator - Centralized coordination and communication layer
import { portfolioService } from './portfolioService';
import { analyticsEngine } from './analyticsEngine';
import { researchEnvironmentService } from './researchEnvironmentService';
import { optimizationEngine } from './optimizationEngine';
import { userManagementService } from './userManagementService';
import { notificationService } from './notificationService';
import { marketDataService } from './marketDataService';
import { economicDataService } from './economicDataService';

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: string;
  errors: string[];
}

export interface ServiceMetrics {
  service: string;
  requestCount: number;
  errorCount: number;
  averageResponseTime: number;
  uptime: number;
  memoryUsage?: number;
}

export interface OrchestrationEvent {
  id: string;
  type: string;
  source: string;
  data: any;
  timestamp: string;
  correlationId?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  isActive: boolean;
}

export interface WorkflowStep {
  id: string;
  service: string;
  action: string;
  parameters: any;
  retryPolicy?: {
    maxRetries: number;
    backoffMultiplier: number;
    maxDelay: number;
  };
  timeout?: number;
  onSuccess?: string; // Next step ID
  onFailure?: string; // Failure step ID
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'manual';
  condition: string;
  schedule?: string; // Cron expression
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep?: string;
  startTime: string;
  endTime?: string;
  results: { [stepId: string]: any };
  errors: { [stepId: string]: string };
}

class MicroservicesOrchestrator {
  private services = new Map<string, any>();
  private serviceHealth = new Map<string, ServiceHealth>();
  private serviceMetrics = new Map<string, ServiceMetrics>();
  private workflows = new Map<string, WorkflowDefinition>();
  private workflowExecutions = new Map<string, WorkflowExecution>();
  private eventHandlers = new Map<string, Array<(event: OrchestrationEvent) => void>>();
  
  private healthCheckInterval = 30000; // 30 seconds
  private healthCheckTimer?: NodeJS.Timeout;

  constructor() {
    this.initializeServices();
    this.initializeWorkflows();
    this.startHealthMonitoring();
  }

  // Service Registration and Management
  private initializeServices(): void {
    console.log('Microservices Orchestrator: Initializing services');

    // Register all microservices
    this.services.set('portfolio', portfolioService);
    this.services.set('analytics', analyticsEngine);
    this.services.set('research', researchEnvironmentService);
    this.services.set('optimization', optimizationEngine);
    this.services.set('user', userManagementService);
    this.services.set('notification', notificationService);
    this.services.set('market_data', marketDataService);
    this.services.set('economic_data', economicDataService);

    // Initialize service metrics
    this.services.forEach((service, name) => {
      this.serviceMetrics.set(name, {
        service: name,
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 0,
        uptime: 100
      });
    });
  }

  // Service Health Monitoring
  async getServiceHealth(): Promise<ServiceHealth[]> {
    const healthChecks = Array.from(this.services.keys()).map(async (serviceName) => {
      const startTime = Date.now();
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      const errors: string[] = [];

      try {
        // Perform basic health check
        await this.performHealthCheck(serviceName);
        
        const responseTime = Date.now() - startTime;
        
        // Determine status based on response time
        if (responseTime > 5000) {
          status = 'unhealthy';
          errors.push('High response time');
        } else if (responseTime > 2000) {
          status = 'degraded';
          errors.push('Elevated response time');
        }

        const health: ServiceHealth = {
          service: serviceName,
          status,
          responseTime,
          lastCheck: new Date().toISOString(),
          errors
        };

        this.serviceHealth.set(serviceName, health);
        return health;

      } catch (error) {
        const health: ServiceHealth = {
          service: serviceName,
          status: 'unhealthy',
          responseTime: Date.now() - startTime,
          lastCheck: new Date().toISOString(),
          errors: [error instanceof Error ? error.message : 'Unknown error']
        };

        this.serviceHealth.set(serviceName, health);
        return health;
      }
    });

    return Promise.all(healthChecks);
  }

  private async performHealthCheck(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    // Basic check - ensure service object exists and has expected methods
    switch (serviceName) {
      case 'portfolio':
        if (typeof service.getAllPortfolios !== 'function') {
          throw new Error('Portfolio service missing required methods');
        }
        break;
      case 'analytics':
        if (typeof service.generateReport !== 'function') {
          throw new Error('Analytics service missing required methods');
        }
        break;
      case 'market_data':
        if (typeof service.getRealTimeQuote !== 'function') {
          throw new Error('Market data service missing required methods');
        }
        break;
      // Add checks for other services
    }
  }

  private startHealthMonitoring(): void {
    this.healthCheckTimer = setInterval(async () => {
      try {
        await this.getServiceHealth();
        console.log('Microservices Orchestrator: Health check completed');
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, this.healthCheckInterval);
  }

  // Inter-Service Communication
  async callService(
    serviceName: string,
    method: string,
    args: any[] = [],
    options: { timeout?: number; retries?: number } = {}
  ): Promise<any> {
    const startTime = Date.now();
    const metrics = this.serviceMetrics.get(serviceName);
    
    if (metrics) {
      metrics.requestCount++;
    }

    try {
      const service = this.services.get(serviceName);
      if (!service) {
        throw new Error(`Service ${serviceName} not found`);
      }

      if (typeof service[method] !== 'function') {
        throw new Error(`Method ${method} not found on service ${serviceName}`);
      }

      // Apply timeout if specified
      let result;
      if (options.timeout) {
        result = await Promise.race([
          service[method](...args),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Service call timeout')), options.timeout)
          )
        ]);
      } else {
        result = await service[method](...args);
      }

      // Update metrics
      const responseTime = Date.now() - startTime;
      if (metrics) {
        metrics.averageResponseTime = 
          (metrics.averageResponseTime * (metrics.requestCount - 1) + responseTime) / metrics.requestCount;
      }

      return result;

    } catch (error) {
      if (metrics) {
        metrics.errorCount++;
      }

      console.error(`Service call failed: ${serviceName}.${method}`, error);

      // Retry logic
      if (options.retries && options.retries > 0) {
        console.log(`Retrying service call: ${serviceName}.${method}, attempts left: ${options.retries}`);
        return this.callService(serviceName, method, args, { 
          ...options, 
          retries: options.retries - 1 
        });
      }

      throw error;
    }
  }

  // Event System
  publishEvent(type: string, source: string, data: any, correlationId?: string): void {
    const event: OrchestrationEvent = {
      id: this.generateEventId(),
      type,
      source,
      data,
      timestamp: new Date().toISOString(),
      correlationId
    };

    console.log('Publishing event:', event);

    const handlers = this.eventHandlers.get(type) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Event handler error:', error);
      }
    });
  }

  subscribeToEvent(type: string, handler: (event: OrchestrationEvent) => void): void {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, []);
    }
    this.eventHandlers.get(type)!.push(handler);
  }

  // Workflow Management
  async executeWorkflow(workflowId: string, initialData: any = {}): Promise<WorkflowExecution> {
    console.log('Executing workflow:', workflowId);

    const workflow = this.workflows.get(workflowId);
    if (!workflow || !workflow.isActive) {
      throw new Error(`Workflow ${workflowId} not found or inactive`);
    }

    const execution: WorkflowExecution = {
      id: this.generateExecutionId(),
      workflowId,
      status: 'running',
      currentStep: workflow.steps[0]?.id,
      startTime: new Date().toISOString(),
      results: {},
      errors: {}
    };

    this.workflowExecutions.set(execution.id, execution);

    try {
      await this.executeWorkflowSteps(workflow, execution, initialData);
      
      execution.status = 'completed';
      execution.endTime = new Date().toISOString();

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date().toISOString();
      console.error('Workflow execution failed:', error);
    }

    this.workflowExecutions.set(execution.id, execution);
    return execution;
  }

  private async executeWorkflowSteps(
    workflow: WorkflowDefinition, 
    execution: WorkflowExecution, 
    data: any
  ): Promise<void> {
    let currentStepId = workflow.steps[0]?.id;
    const executionData = { ...data };

    while (currentStepId) {
      const step = workflow.steps.find(s => s.id === currentStepId);
      if (!step) break;

      execution.currentStep = currentStepId;
      this.workflowExecutions.set(execution.id, execution);

      try {
        console.log(`Executing workflow step: ${step.id}`);
        
        const result = await this.executeWorkflowStep(step, executionData);
        execution.results[step.id] = result;
        
        // Merge result into execution data for next steps
        if (result && typeof result === 'object') {
          Object.assign(executionData, result);
        }

        currentStepId = step.onSuccess;

      } catch (error) {
        execution.errors[step.id] = error instanceof Error ? error.message : 'Unknown error';
        
        if (step.onFailure) {
          currentStepId = step.onFailure;
        } else {
          throw error;
        }
      }
    }
  }

  private async executeWorkflowStep(step: WorkflowStep, data: any): Promise<any> {
    const timeout = step.timeout || 30000; // 30 second default
    const maxRetries = step.retryPolicy?.maxRetries || 0;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.callService(
          step.service,
          step.action,
          [{ ...step.parameters, ...data }],
          { timeout }
        );
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }

        // Apply backoff delay
        const delay = (step.retryPolicy?.backoffMultiplier || 1) * Math.pow(2, attempt) * 1000;
        const maxDelay = step.retryPolicy?.maxDelay || 30000;
        const actualDelay = Math.min(delay, maxDelay);

        console.log(`Step ${step.id} failed, retrying in ${actualDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, actualDelay));
      }
    }
  }

  // Pre-defined Workflows
  private initializeWorkflows(): void {
    // Portfolio Analysis Workflow
    this.workflows.set('portfolio_analysis', {
      id: 'portfolio_analysis',
      name: 'Complete Portfolio Analysis',
      description: 'Comprehensive analysis including performance, risk, and optimization',
      isActive: true,
      triggers: [
        { type: 'event', condition: 'portfolio_updated' },
        { type: 'schedule', schedule: '0 9 * * 1' } // Weekly on Monday at 9 AM
      ],
      steps: [
        {
          id: 'get_portfolio',
          service: 'portfolio',
          action: 'getPortfolio',
          parameters: {},
          onSuccess: 'generate_analytics'
        },
        {
          id: 'generate_analytics',
          service: 'analytics',
          action: 'generateReport',
          parameters: {},
          onSuccess: 'optimize_portfolio'
        },
        {
          id: 'optimize_portfolio',
          service: 'optimization',
          action: 'optimizePortfolio',
          parameters: { objectives: [{ type: 'maximize_sharpe' }] },
          onSuccess: 'send_notification'
        },
        {
          id: 'send_notification',
          service: 'notification',
          action: 'createNotification',
          parameters: { type: 'performance_report' },
          onSuccess: undefined
        }
      ]
    });

    // Market Alert Workflow
    this.workflows.set('market_alert', {
      id: 'market_alert',
      name: 'Market Alert Processing',
      description: 'Process market changes and alert users',
      isActive: true,
      triggers: [
        { type: 'event', condition: 'market_volatility_high' }
      ],
      steps: [
        {
          id: 'analyze_impact',
          service: 'analytics',
          action: 'analyzeRisk',
          parameters: {},
          onSuccess: 'send_alerts'
        },
        {
          id: 'send_alerts',
          service: 'notification',
          action: 'sendBulkNotification',
          parameters: { type: 'market_alert' },
          onSuccess: undefined
        }
      ]
    });

    // User Onboarding Workflow
    this.workflows.set('user_onboarding', {
      id: 'user_onboarding',
      name: 'New User Onboarding',
      description: 'Complete onboarding process for new users',
      isActive: true,
      triggers: [
        { type: 'event', condition: 'user_registered' }
      ],
      steps: [
        {
          id: 'create_default_portfolio',
          service: 'portfolio',
          action: 'createPortfolio',
          parameters: {
            name: 'My First Portfolio',
            assets: [
              { symbol: 'VTI', allocation: 60 },
              { symbol: 'BND', allocation: 40 }
            ]
          },
          onSuccess: 'send_welcome'
        },
        {
          id: 'send_welcome',
          service: 'notification',
          action: 'createNotification',
          parameters: { type: 'system_update', title: 'Welcome!' },
          onSuccess: undefined
        }
      ]
    });
  }

  // Orchestrated Operations
  async performCompletePortfolioAnalysis(portfolioId: string): Promise<any> {
    console.log('Orchestrator: Performing complete portfolio analysis for', portfolioId);

    const correlationId = this.generateCorrelationId();
    
    try {
      // 1. Get portfolio data
      const portfolio = await this.callService('portfolio', 'getPortfolio', [portfolioId]);
      
      // 2. Generate analytics report
      const analyticsReport = await this.callService('analytics', 'generateReport', [portfolioId]);
      
      // 3. Perform optimization
      const optimization = await this.callService('optimization', 'optimizePortfolio', [
        portfolioId, 
        [{ type: 'maximize_sharpe' }], 
        {}
      ]);
      
      // 4. Generate research insights
      const researchInsights = await Promise.all(
        portfolio.assets.map((asset: any) =>
          this.callService('research', 'getMarketSentiment', [asset.symbol])
        )
      );
      
      // 5. Compile comprehensive report
      const comprehensiveReport = {
        portfolio,
        analytics: analyticsReport,
        optimization,
        research: researchInsights,
        correlationId,
        generatedAt: new Date().toISOString()
      };

      // 6. Send notification
      await this.callService('notification', 'createNotification', [
        portfolio.userId || 'unknown',
        'performance_report',
        { portfolioName: portfolio.name, analysis: 'complete' }
      ]);

      this.publishEvent('portfolio_analysis_completed', 'orchestrator', {
        portfolioId,
        reportId: correlationId
      }, correlationId);

      return comprehensiveReport;

    } catch (error) {
      console.error('Complete portfolio analysis failed:', error);
      
      this.publishEvent('portfolio_analysis_failed', 'orchestrator', {
        portfolioId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, correlationId);

      throw error;
    }
  }

  async handleMarketEvent(eventType: string, marketData: any): Promise<void> {
    console.log('Orchestrator: Handling market event', eventType);

    const correlationId = this.generateCorrelationId();

    try {
      // 1. Analyze market impact
      const impact = await this.callService('analytics', 'runScenarioAnalysis', [
        'market_portfolio', // Default market portfolio
        [{ name: eventType, assetReturns: marketData }]
      ]);

      // 2. Get affected users (mock - in production, query database)
      const affectedUsers = ['user1', 'user2', 'user3']; // Mock user IDs

      // 3. Send market alerts
      await this.callService('notification', 'sendBulkNotification', [
        affectedUsers,
        'market_alert',
        { event: eventType, impact }
      ]);

      // 4. Update portfolio valuations
      for (const userId of affectedUsers) {
        try {
          const portfolios = await this.callService('portfolio', 'getAllPortfolios', []);
          
          for (const portfolio of portfolios) {
            await this.callService('analytics', 'updateRealTimeMetrics', [portfolio.id]);
          }
        } catch (error) {
          console.error(`Failed to update portfolios for user ${userId}:`, error);
        }
      }

      this.publishEvent('market_event_processed', 'orchestrator', {
        eventType,
        affectedUsers: affectedUsers.length,
        impact
      }, correlationId);

    } catch (error) {
      console.error('Market event handling failed:', error);
      throw error;
    }
  }

  // Metrics and Monitoring
  getServiceMetrics(): ServiceMetrics[] {
    return Array.from(this.serviceMetrics.values());
  }

  getWorkflowExecutions(workflowId?: string): WorkflowExecution[] {
    const executions = Array.from(this.workflowExecutions.values());
    
    if (workflowId) {
      return executions.filter(exec => exec.workflowId === workflowId);
    }
    
    return executions.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  // Utility methods
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup
  destroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
  }
}

export const microservicesOrchestrator = new MicroservicesOrchestrator();

// Global error handler for microservices
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in microservices:', event.reason);
  
  microservicesOrchestrator.publishEvent('unhandled_error', 'global', {
    error: event.reason,
    timestamp: new Date().toISOString()
  });
});
