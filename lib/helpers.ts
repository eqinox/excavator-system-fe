import { ApiErrorResponse } from '@/dto/common.dto';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const processError = (error: any) => {};

// Assertion function that tells TypeScript the result is not an error
export function assertNoError<T>(
  result: { data: T } | { error: FetchBaseQueryError },
  defaultMessage: string
): asserts result is { data: T } {
  console.log('result', result);
  if ('error' in result) {
    const errorMessage =
      (result.error.data as ApiErrorResponse)?.message || defaultMessage;
    throw new Error(errorMessage);
  }
}

// Type guard function that helps TypeScript understand the result type
export const isApiError = (
  result: { data: any } | { error: FetchBaseQueryError }
): result is { error: FetchBaseQueryError } => {
  return 'error' in result;
};
