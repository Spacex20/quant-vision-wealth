
// Notification Service - Handle all types of notifications and alerts
import { userManagementService, NotificationPreferences } from './userManagementService';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: NotificationChannel[];
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
  expiresAt?: string;
}

export type NotificationType = 
  | 'portfolio_update'
  | 'price_alert'
  | 'market_alert'
  | 'news_digest'
  | 'performance_report'
  | 'rebalance_reminder'
  | 'system_update'
  | 'security_alert'
  | 'trade_confirmation'
  | 'milestone_achievement'
  | 'market_opening'
  | 'market_closing'
  | 'earnings_reminder'
  | 'dividend_notification';

export type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms';

export interface PriceAlert {
  id: string;
  userId: string;
  symbol: string;
  condition: 'above' | 'below' | 'change_percent';
  targetValue: number;
  currentValue?: number;
  isActive: boolean;
  triggeredAt?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface MarketAlert {
  id: string;
  userId: string;
  type: 'market_open' | 'market_close' | 'volatility' | 'volume' | 'sector_movement';
  condition: string;
  threshold?: number;
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
}

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  message: string;
  channels: NotificationChannel[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  variables: string[];
}

class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private priceAlerts: Map<string, PriceAlert> = new Map();
  private marketAlerts: Map<string, MarketAlert> = new Map();
  private templates: Map<NotificationType, NotificationTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
    this.loadStoredData();
    this.startAlertMonitoring();
  }

  // Notification Management
  async createNotification(
    userId: string,
    type: NotificationType,
    data: any = {},
    options: {
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      channels?: NotificationChannel[];
      scheduledAt?: string;
      expiresAt?: string;
    } = {}
  ): Promise<Notification> {
    console.log('Notification Service: Creating notification', type, 'for user', userId);

    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`No template found for notification type: ${type}`);
    }

    const userPreferences = await userManagementService.getUserPreferences(userId);
    const allowedChannels = this.getAllowedChannels(type, userPreferences.notifications);
    const channels = options.channels?.filter(c => allowedChannels.includes(c)) || allowedChannels;

    if (channels.length === 0) {
      console.log('Notification Service: User has disabled all channels for this notification type');
      return null as any;
    }

    const notification: Notification = {
      id: this.generateNotificationId(),
      userId,
      type,
      title: this.interpolateTemplate(template.title, data),
      message: this.interpolateTemplate(template.message, data),
      data,
      priority: options.priority || template.priority,
      channels,
      status: options.scheduledAt ? 'pending' : 'sent',
      scheduledAt: options.scheduledAt,
      sentAt: options.scheduledAt ? undefined : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      expiresAt: options.expiresAt
    };

    this.notifications.set(notification.id, notification);
    
    if (!options.scheduledAt) {
      await this.sendNotification(notification);
    }

    this.saveNotifications();
    return notification;
  }

  async sendNotification(notification: Notification): Promise<boolean> {
    console.log('Notification Service: Sending notification', notification.id);

    try {
      const sendPromises = notification.channels.map(channel => 
        this.sendToChannel(notification, channel)
      );

      const results = await Promise.allSettled(sendPromises);
      const success = results.some(result => result.status === 'fulfilled');

      notification.status = success ? 'sent' : 'failed';
      notification.sentAt = new Date().toISOString();

      this.notifications.set(notification.id, notification);
      this.saveNotifications();

      return success;
    } catch (error) {
      console.error('Error sending notification:', error);
      notification.status = 'failed';
      this.notifications.set(notification.id, notification);
      return false;
    }
  }

  async getUserNotifications(
    userId: string,
    options: {
      status?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
      type?: NotificationType;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<Notification[]> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .filter(n => !options.status || n.status === options.status)
      .filter(n => !options.type || n.type === options.type)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const start = options.offset || 0;
    const end = start + (options.limit || 50);
    
    return userNotifications.slice(start, end);
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId);
    if (!notification) return false;

    notification.status = 'read';
    notification.readAt = new Date().toISOString();
    
    this.notifications.set(notificationId, notification);
    this.saveNotifications();
    
    return true;
  }

  async markAllAsRead(userId: string, type?: NotificationType): Promise<number> {
    let count = 0;
    
    for (const [id, notification] of this.notifications) {
      if (notification.userId === userId && 
          notification.status !== 'read' &&
          (!type || notification.type === type)) {
        notification.status = 'read';
        notification.readAt = new Date().toISOString();
        count++;
      }
    }
    
    this.saveNotifications();
    return count;
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    const deleted = this.notifications.delete(notificationId);
    if (deleted) {
      this.saveNotifications();
    }
    return deleted;
  }

  // Price Alerts
  async createPriceAlert(
    userId: string,
    symbol: string,
    condition: 'above' | 'below' | 'change_percent',
    targetValue: number,
    expiresAt?: string
  ): Promise<PriceAlert> {
    console.log('Notification Service: Creating price alert', symbol, condition, targetValue);

    const alert: PriceAlert = {
      id: this.generateAlertId(),
      userId,
      symbol: symbol.toUpperCase(),
      condition,
      targetValue,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt
    };

    this.priceAlerts.set(alert.id, alert);
    this.savePriceAlerts();
    
    return alert;
  }

  async getUserPriceAlerts(userId: string): Promise<PriceAlert[]> {
    return Array.from(this.priceAlerts.values())
      .filter(alert => alert.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updatePriceAlert(alertId: string, updates: Partial<PriceAlert>): Promise<PriceAlert | null> {
    const alert = this.priceAlerts.get(alertId);
    if (!alert) return null;

    const updatedAlert = { ...alert, ...updates };
    this.priceAlerts.set(alertId, updatedAlert);
    this.savePriceAlerts();
    
    return updatedAlert;
  }

  async deletePriceAlert(alertId: string): Promise<boolean> {
    const deleted = this.priceAlerts.delete(alertId);
    if (deleted) {
      this.savePriceAlerts();
    }
    return deleted;
  }

  // Market Alerts
  async createMarketAlert(
    userId: string,
    type: 'market_open' | 'market_close' | 'volatility' | 'volume' | 'sector_movement',
    condition: string,
    threshold?: number
  ): Promise<MarketAlert> {
    console.log('Notification Service: Creating market alert', type, condition);

    const alert: MarketAlert = {
      id: this.generateAlertId(),
      userId,
      type,
      condition,
      threshold,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    this.marketAlerts.set(alert.id, alert);
    this.saveMarketAlerts();
    
    return alert;
  }

  async getUserMarketAlerts(userId: string): Promise<MarketAlert[]> {
    return Array.from(this.marketAlerts.values())
      .filter(alert => alert.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Batch Notifications
  async sendBulkNotification(
    userIds: string[],
    type: NotificationType,
    data: any = {},
    options: any = {}
  ): Promise<{ sent: number; failed: number }> {
    console.log('Notification Service: Sending bulk notification to', userIds.length, 'users');

    let sent = 0;
    let failed = 0;

    const promises = userIds.map(async (userId) => {
      try {
        await this.createNotification(userId, type, data, options);
        sent++;
      } catch (error) {
        console.error('Failed to send notification to user', userId, error);
        failed++;
      }
    });

    await Promise.allSettled(promises);
    
    return { sent, failed };
  }

  // Scheduled Notifications
  async scheduleNotification(
    userId: string,
    type: NotificationType,
    scheduledAt: string,
    data: any = {},
    options: any = {}
  ): Promise<Notification> {
    return this.createNotification(userId, type, data, {
      ...options,
      scheduledAt
    });
  }

  async processScheduledNotifications(): Promise<void> {
    const now = new Date().toISOString();
    const pendingNotifications = Array.from(this.notifications.values())
      .filter(n => n.status === 'pending' && n.scheduledAt && n.scheduledAt <= now);

    for (const notification of pendingNotifications) {
      await this.sendNotification(notification);
    }
  }

  // Private helper methods
  private async sendToChannel(notification: Notification, channel: NotificationChannel): Promise<boolean> {
    switch (channel) {
      case 'in_app':
        return this.sendInAppNotification(notification);
      case 'email':
        return this.sendEmailNotification(notification);
      case 'push':
        return this.sendPushNotification(notification);
      case 'sms':
        return this.sendSMSNotification(notification);
      default:
        return false;
    }
  }

  private async sendInAppNotification(notification: Notification): Promise<boolean> {
    console.log('Sending in-app notification:', notification.title);
    
    // Dispatch custom event for in-app notifications
    window.dispatchEvent(new CustomEvent('notification', {
      detail: notification
    }));
    
    return true;
  }

  private async sendEmailNotification(notification: Notification): Promise<boolean> {
    console.log('Sending email notification:', notification.title);
    
    // In production, integrate with email service (SendGrid, etc.)
    // For now, just log
    console.log(`Email to ${notification.userId}: ${notification.title} - ${notification.message}`);
    
    return true;
  }

  private async sendPushNotification(notification: Notification): Promise<boolean> {
    console.log('Sending push notification:', notification.title);
    
    // In production, integrate with push service
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
      return true;
    }
    
    return false;
  }

  private async sendSMSNotification(notification: Notification): Promise<boolean> {
    console.log('Sending SMS notification:', notification.title);
    
    // In production, integrate with SMS service (Twilio, etc.)
    return true;
  }

  private getAllowedChannels(type: NotificationType, preferences: NotificationPreferences): NotificationChannel[] {
    const channels: NotificationChannel[] = ['in_app']; // Always allow in-app

    // Check email preferences
    if (this.isEmailNotificationAllowed(type, preferences.email)) {
      channels.push('email');
    }

    // Check push preferences
    if (this.isPushNotificationAllowed(type, preferences.push)) {
      channels.push('push');
    }

    // Check SMS preferences
    if (this.isSMSNotificationAllowed(type, preferences.sms)) {
      channels.push('sms');
    }

    return channels;
  }

  private isEmailNotificationAllowed(type: NotificationType, emailPrefs: any): boolean {
    switch (type) {
      case 'portfolio_update':
        return emailPrefs.portfolioUpdates;
      case 'market_alert':
      case 'price_alert':
        return emailPrefs.marketAlerts;
      case 'news_digest':
        return emailPrefs.newsDigest;
      case 'performance_report':
        return emailPrefs.performanceReports;
      case 'system_update':
        return emailPrefs.systemUpdates;
      default:
        return false;
    }
  }

  private isPushNotificationAllowed(type: NotificationType, pushPrefs: any): boolean {
    switch (type) {
      case 'price_alert':
        return pushPrefs.priceAlerts;
      case 'milestone_achievement':
        return pushPrefs.portfolioMilestones;
      case 'market_alert':
        return pushPrefs.marketNews;
      case 'rebalance_reminder':
        return pushPrefs.rebalanceReminders;
      default:
        return false;
    }
  }

  private isSMSNotificationAllowed(type: NotificationType, smsPrefs: any): boolean {
    switch (type) {
      case 'security_alert':
        return smsPrefs.securityAlerts;
      case 'system_update':
        return smsPrefs.urgentAlerts;
      default:
        return false;
    }
  }

  private interpolateTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  private startAlertMonitoring(): void {
    // Check price alerts every minute
    setInterval(() => {
      this.checkPriceAlerts();
    }, 60000);

    // Check market alerts every 5 minutes
    setInterval(() => {
      this.checkMarketAlerts();
    }, 300000);

    // Process scheduled notifications every minute
    setInterval(() => {
      this.processScheduledNotifications();
    }, 60000);
  }

  private async checkPriceAlerts(): Promise<void> {
    // In production, this would check current prices against alerts
    console.log('Checking price alerts...');
    
    // Mock alert triggering for demo
    const activeAlerts = Array.from(this.priceAlerts.values())
      .filter(alert => alert.isActive && (!alert.expiresAt || alert.expiresAt > new Date().toISOString()));

    for (const alert of activeAlerts) {
      // Simulate random alert triggering (5% chance)
      if (Math.random() < 0.05) {
        await this.triggerPriceAlert(alert);
      }
    }
  }

  private async checkMarketAlerts(): Promise<void> {
    console.log('Checking market alerts...');
    
    // Mock market alert checking
    const activeAlerts = Array.from(this.marketAlerts.values())
      .filter(alert => alert.isActive);

    for (const alert of activeAlerts) {
      // Simulate random alert triggering (3% chance)
      if (Math.random() < 0.03) {
        await this.triggerMarketAlert(alert);
      }
    }
  }

  private async triggerPriceAlert(alert: PriceAlert): Promise<void> {
    console.log('Triggering price alert:', alert.id);

    alert.triggeredAt = new Date().toISOString();
    alert.isActive = false; // Disable after triggering

    await this.createNotification(alert.userId, 'price_alert', {
      symbol: alert.symbol,
      condition: alert.condition,
      targetValue: alert.targetValue,
      currentValue: alert.currentValue || alert.targetValue + (Math.random() - 0.5) * 10
    });

    this.priceAlerts.set(alert.id, alert);
    this.savePriceAlerts();
  }

  private async triggerMarketAlert(alert: MarketAlert): Promise<void> {
    console.log('Triggering market alert:', alert.id);

    alert.lastTriggered = new Date().toISOString();

    await this.createNotification(alert.userId, 'market_alert', {
      type: alert.type,
      condition: alert.condition,
      threshold: alert.threshold
    });

    this.marketAlerts.set(alert.id, alert);
    this.saveMarketAlerts();
  }

  private initializeTemplates(): void {
    const templates: Array<[NotificationType, NotificationTemplate]> = [
      ['portfolio_update', {
        type: 'portfolio_update',
        title: 'Portfolio Update',
        message: 'Your portfolio {{portfolioName}} has been updated. Current value: ${{currentValue}}',
        channels: ['in_app', 'email'],
        priority: 'medium',
        variables: ['portfolioName', 'currentValue']
      }],
      ['price_alert', {
        type: 'price_alert',
        title: 'Price Alert: {{symbol}}',
        message: '{{symbol}} is now {{condition}} ${{targetValue}}. Current price: ${{currentValue}}',
        channels: ['in_app', 'push', 'email'],
        priority: 'high',
        variables: ['symbol', 'condition', 'targetValue', 'currentValue']
      }],
      ['market_alert', {
        type: 'market_alert',
        title: 'Market Alert',
        message: 'Market condition detected: {{condition}}',
        channels: ['in_app', 'push'],
        priority: 'medium',
        variables: ['condition']
      }],
      ['performance_report', {
        type: 'performance_report',
        title: 'Weekly Performance Report',
        message: 'Your portfolio performance this week: {{performance}}%',
        channels: ['in_app', 'email'],
        priority: 'low',
        variables: ['performance', 'period']
      }],
      ['rebalance_reminder', {
        type: 'rebalance_reminder',
        title: 'Rebalancing Recommended',
        message: 'Your portfolio has drifted from target allocation. Consider rebalancing.',
        channels: ['in_app', 'push'],
        priority: 'medium',
        variables: ['portfolioName', 'drift']
      }],
      ['security_alert', {
        type: 'security_alert',
        title: 'Security Alert',
        message: 'Unusual activity detected on your account. Please review immediately.',
        channels: ['in_app', 'email', 'sms'],
        priority: 'urgent',
        variables: ['activity', 'location']
      }]
    ];

    templates.forEach(([type, template]) => {
      this.templates.set(type, template);
    });
  }

  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadStoredData(): void {
    try {
      const notifications = localStorage.getItem('notifications');
      if (notifications) {
        const parsed = JSON.parse(notifications);
        parsed.forEach((notif: Notification) => {
          this.notifications.set(notif.id, notif);
        });
      }

      const priceAlerts = localStorage.getItem('price_alerts');
      if (priceAlerts) {
        const parsed = JSON.parse(priceAlerts);
        parsed.forEach((alert: PriceAlert) => {
          this.priceAlerts.set(alert.id, alert);
        });
      }

      const marketAlerts = localStorage.getItem('market_alerts');
      if (marketAlerts) {
        const parsed = JSON.parse(marketAlerts);
        parsed.forEach((alert: MarketAlert) => {
          this.marketAlerts.set(alert.id, alert);
        });
      }
    } catch (error) {
      console.error('Error loading stored notification data:', error);
    }
  }

  private saveNotifications(): void {
    try {
      const notifications = Array.from(this.notifications.values());
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  private savePriceAlerts(): void {
    try {
      const alerts = Array.from(this.priceAlerts.values());
      localStorage.setItem('price_alerts', JSON.stringify(alerts));
    } catch (error) {
      console.error('Error saving price alerts:', error);
    }
  }

  private saveMarketAlerts(): void {
    try {
      const alerts = Array.from(this.marketAlerts.values());
      localStorage.setItem('market_alerts', JSON.stringify(alerts));
    } catch (error) {
      console.error('Error saving market alerts:', error);
    }
  }
}

export const notificationService = new NotificationService();
