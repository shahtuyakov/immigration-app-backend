export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    metadata?: {
      timestamp: string;
      path: string;
      version: string;
    };
  }
  
  export function createSuccessResponse<T>(
    data: T,
    message = 'Operation successful',
    req?: any
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      metadata: req ? {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        version: '1.0'
      } : undefined
    };
  }
  
  export function createErrorResponse(
    message: string,
    error?: string,
    req?: any
  ): ApiResponse<null> {
    return {
      success: false,
      message,
      error,
      metadata: req ? {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        version: '1.0'
      } : undefined
    };
  }