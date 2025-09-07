// Performance monitoring utilities

interface PerformanceMetrics {
  queryName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  error?: string;
  dataSize?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private isEnabled: boolean = process.env.NODE_ENV === 'development';

  startQuery(queryName: string): string {
    if (!this.isEnabled) return '';
    
    const startTime = performance.now();
    const metric: PerformanceMetrics = {
      queryName,
      startTime,
      success: false
    };
    
    this.metrics.push(metric);
    return queryName;
  }

  endQuery(queryName: string, success: boolean = true, error?: string, dataSize?: number) {
    if (!this.isEnabled) return;
    
    const metric = this.metrics.find(m => m.queryName === queryName && !m.endTime);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      metric.success = success;
      metric.error = error;
      metric.dataSize = dataSize;
      
      // Log slow queries
      if (metric.duration > 1000) { // More than 1 second
        console.warn(`🐌 Slow query detected: ${queryName} took ${metric.duration.toFixed(2)}ms`);
      } else if (metric.duration > 500) { // More than 500ms
        console.log(`⏱️ Query: ${queryName} took ${metric.duration.toFixed(2)}ms`);
      }
    }
  }

  getMetrics() {
    return this.metrics;
  }

  getAverageQueryTime(queryName?: string) {
    const relevantMetrics = queryName 
      ? this.metrics.filter(m => m.queryName === queryName)
      : this.metrics;
    
    if (relevantMetrics.length === 0) return 0;
    
    const totalTime = relevantMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    return totalTime / relevantMetrics.length;
  }

  clearMetrics() {
    this.metrics = [];
  }

  generateReport() {
    if (!this.isEnabled) return;
    
    const report = {
      totalQueries: this.metrics.length,
      averageTime: this.getAverageQueryTime(),
      slowQueries: this.metrics.filter(m => (m.duration || 0) > 1000),
      failedQueries: this.metrics.filter(m => !m.success),
      queryBreakdown: this.getQueryBreakdown()
    };
    
    console.table(report.queryBreakdown);
    return report;
  }

  private getQueryBreakdown() {
    const breakdown: Record<string, { count: number; avgTime: number; totalTime: number }> = {};
    
    this.metrics.forEach(metric => {
      if (!breakdown[metric.queryName]) {
        breakdown[metric.queryName] = { count: 0, avgTime: 0, totalTime: 0 };
      }
      
      breakdown[metric.queryName].count++;
      breakdown[metric.queryName].totalTime += metric.duration || 0;
    });
    
    // Calculate averages
    Object.keys(breakdown).forEach(queryName => {
      breakdown[queryName].avgTime = breakdown[queryName].totalTime / breakdown[queryName].count;
    });
    
    return breakdown;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Higher-order function to wrap async functions with performance monitoring
export function withPerformanceMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  queryName: string
) {
  return async (...args: T): Promise<R> => {
    const startId = performanceMonitor.startQuery(queryName);
    
    try {
      const result = await fn(...args);
      performanceMonitor.endQuery(startId, true, undefined, JSON.stringify(result).length);
      return result;
    } catch (error) {
      performanceMonitor.endQuery(startId, false, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };
}

// Supabase query wrapper with performance monitoring
export function createMonitoredSupabaseQuery(queryName: string) {
  return {
    select: (columns: string) => {
      const startId = performanceMonitor.startQuery(`${queryName}_select`);
      return {
        from: (table: string) => {
          return {
            eq: (column: string, value: any) => {
              return {
                order: (column: string, options?: { ascending?: boolean }) => {
                  return {
                    limit: (count: number) => {
                      return {
                        then: async (callback: (result: any) => void) => {
                          try {
                            const result = await supabase
                              .from(table)
                              .select(columns)
                              .eq(column, value)
                              .order(column, options)
                              .limit(count);
                            
                            performanceMonitor.endQuery(
                              startId, 
                              !result.error, 
                              result.error?.message,
                              JSON.stringify(result.data).length
                            );
                            
                            callback(result);
                            return result;
                          } catch (error) {
                            performanceMonitor.endQuery(startId, false, error instanceof Error ? error.message : 'Unknown error');
                            throw error;
                          }
                        }
                      };
                    }
                  };
                }
              };
            }
          };
        }
      };
    }
  };
}

// Performance tips and recommendations
export const performanceTips = {
  // Database optimization tips
  database: [
    "Use indexes on frequently queried columns",
    "Limit the number of rows returned with .limit()",
    "Use specific column selection instead of SELECT *",
    "Implement pagination for large datasets",
    "Use database-level caching when possible"
  ],
  
  // Frontend optimization tips
  frontend: [
    "Implement client-side caching",
    "Use React.memo for expensive components",
    "Implement virtual scrolling for large lists",
    "Use lazy loading for images and components",
    "Minimize re-renders with useMemo and useCallback"
  ],
  
  // Network optimization tips
  network: [
    "Use connection pooling",
    "Implement request debouncing",
    "Use compression for large responses",
    "Implement offline support with service workers",
    "Use CDN for static assets"
  ]
};

// Utility to check if a query is taking too long
export function isQuerySlow(duration: number): boolean {
  return duration > 1000; // More than 1 second
}

// Utility to get performance recommendations
export function getPerformanceRecommendations(metrics: PerformanceMetrics[]) {
  const recommendations: string[] = [];
  
  const slowQueries = metrics.filter(m => (m.duration || 0) > 1000);
  const failedQueries = metrics.filter(m => !m.success);
  
  if (slowQueries.length > 0) {
    recommendations.push(`Consider optimizing ${slowQueries.length} slow queries`);
  }
  
  if (failedQueries.length > 0) {
    recommendations.push(`Fix ${failedQueries.length} failed queries`);
  }
  
  const avgTime = metrics.reduce((sum, m) => sum + (m.duration || 0), 0) / metrics.length;
  if (avgTime > 500) {
    recommendations.push("Consider implementing caching to reduce average query time");
  }
  
  return recommendations;
}
