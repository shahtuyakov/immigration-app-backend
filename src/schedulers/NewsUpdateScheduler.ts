import { NewsAPIService } from "../services/NewsAPIService.js";

export class NewsUpdateScheduler {
  private newsAPIService: NewsAPIService;
  private updateInterval: NodeJS.Timeout | null = null;
  private static readonly UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.newsAPIService = new NewsAPIService();
  }

  start(): void {
    // Initial fetch
    this.fetchNews();

    // Schedule regular updates
    this.updateInterval = setInterval(() => {
      this.fetchNews();
    }, NewsUpdateScheduler.UPDATE_INTERVAL);
  }

  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private async fetchNews(): Promise<void> {
    try {
      await this.newsAPIService.fetchImmigrationNews();
      console.log("News update completed:", new Date().toISOString());
    } catch (error) {
      console.error("News update failed:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      // Implement retry logic
      // setTimeout(() => {
      //   this.fetchNews();
      // }, 15 * 60 * 1000); // Retry after 15 minutes
    }
  }
}
