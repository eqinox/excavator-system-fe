import { UserDto } from '../client/auth.dto';
import { CommonResponse } from '../common.dto';

// The Data of the response
export interface RegisterResponseDataDto {
  id: string;
  email: string;
  username?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// The Data of the response
export interface LoginResponseDataDto {
  access_token: string;
  // user: UserDto;
}

export interface RefreshTokenResponseDataDto {
  access_token: string;
}

// Response DTOs that extend CommonResponse
export interface UserResponseDto extends CommonResponse<UserDto> {}

export interface RegisterResponseDto
  extends CommonResponse<RegisterResponseDataDto> {}

export interface LoginResponseDto
  extends CommonResponse<LoginResponseDataDto> {}

export interface RefreshTokenResponseDto
  extends CommonResponse<RefreshTokenResponseDataDto> {}
