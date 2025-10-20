export interface CommonResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: number;
  data: any;
}

export interface ImageDto {
  original: string;
  small: string;
}
