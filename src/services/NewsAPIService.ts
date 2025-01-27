import axios, { AxiosInstance } from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/errorHandler.js";
import { News } from "../models/News.js";

interface NewsAPIResponse {
  status: string;
  items: Array<{
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
      if (this.isCacheValid()) {
        return;
      }

      const keywords = ["US immigration"];

      const newsPromises = keywords.map((keyword) =>
        this.api.get<NewsAPIResponse>("/search", {
          params: {
            keyword,
            lr: "en-US",
          },
        })
      );

      const responses = await Promise.all(newsPromises);
      const articles = responses.flatMap((response) => {
        if (!response.data?.items) {
          console.warn('No items found in response:', response.data);
          return [];
        }
        return response.data.items;
      });

      await this.processAndStoreNews(articles);

      this.lastFetch = Date.now();
      this.cachedNews = { items: articles, status: "ok" };
    } catch (error) {
      console.error("Error fetching news:", error);
      throw new AppError(500, "Failed to fetch immigration news");
    }
  }

  private async processAndStoreNews(
    articles: NewsAPIResponse["items"]
  ): Promise<void> {
    for (const article of articles) {
      try {
        if (!article.title) {
          console.warn('Skipping article with no title:', article);
          continue;
        }

        const existingNews = await News.findOne({ headline: article.title });
        if (!existingNews) {
          await News.create({
            headline: article.title,
            content: article.snippet || '',
            contentSummary: article.snippet ? article.snippet.substring(0, 200) : '',
            imageUrl: article.images?.thumbnail || '',
            source: article.publisher || 'Unknown',
            url: article.newsUrl || '',
            publishedAt: article.timestamp ? new Date(Number(article.timestamp)) : new Date(),
            region: "United States",
            categories: ["Immigration News"],
            tags: ["news", "immigration"],
          });
        }
      } catch (error) {
        if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
          console.error('Validation error while processing article:', {
            articleTitle: article.title,
            errors: error,
            validationMessage: error.message
          });
        } else {
          console.error(`Error processing article ${article.title}:`, error);
        }
        continue;
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
