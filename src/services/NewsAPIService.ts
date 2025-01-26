import axios, { AxiosInstance } from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/errorHandler.js";
import { News } from "../models/News.js";

interface NewsAPIResponse {
    articles: Array<{
      title: string;
      snippet: string;
      publisher: string;
      timestamp: string;
      newsUrl: string;
      images: {
        thumbnail: string;
        thumbnailProxied: string;
      };
    }>;
  }

export class NewsAPIService {
  private api: AxiosInstance;
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private lastFetch: number = 0;
  private cachedNews: NewsAPIResponse | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: "https://google-news13.p.rapidapi.com",
      headers: {
        "x-rapidapi-key": env.RAPIDAPI_KEY,
        "x-rapidapi-host": env.RAPIDAPI_HOST,
      },
    });
  }

  async fetchImmigrationNews(): Promise<void> {
    try {
      // Check cache
      if (this.isCacheValid()) {
        return;
      }

      const keywords = [
        "US immigration",
        "USCIS updates",
        "immigration policy",
        "visa updates",
      ];

      const newsPromises = keywords.map((keyword) =>
        this.api.get<NewsAPIResponse>("/search", {
          params: {
            keyword,
            lr: "en-US",
          },
        })
      );

      const responses = await Promise.all(newsPromises);
      const articles = responses.flatMap((response) => response.data.articles);

      // Process and store news
      await this.processAndStoreNews(articles);

      // Update cache
      this.lastFetch = Date.now();
      this.cachedNews = { articles };
    } catch (error) {
      console.error("Error fetching news:", error);
      throw new AppError(500, "Failed to fetch immigration news");
    }
  }

  private async processAndStoreNews(
    articles: NewsAPIResponse["articles"]
  ): Promise<void> {
    for (const article of articles) {
      const existingNews = await News.findOne({ headline: article.title });
      if (!existingNews) {
        await News.create({
          headline: article.title,
          content: article.snippet,
          contentSummary: article.snippet.substring(0, 200),
          imageUrl: article.images.thumbnail,
          source: article.publisher,
          url: article.newsUrl,
          publishedAt: new Date(article.timestamp),
          region: "United States",
          categories: ["Immigration News"],
          tags: ["news", "immigration"],
        });
      }
    }
  }

  private isCacheValid(): boolean {
    return (
      this.cachedNews !== null &&
      Date.now() - this.lastFetch < NewsAPIService.CACHE_DURATION
    );
  }
}
