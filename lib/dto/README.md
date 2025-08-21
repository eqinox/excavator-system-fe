# DTO Documentation

## DTO File Structure

### Folder Organization

```
lib/dto/
├── common.dto.ts          # Common interfaces
├── server/                # Server responses
│   ├── auth.dto.ts
│   ├── category.dto.ts
│   └── equipment.dto.ts
└── client/                # Client requests
    ├── auth.dto.ts
    ├── category.dto.ts
    └── equipment.dto.ts
```

### Naming Conventions

#### Server DTOs (server/ folder)

**ResponseDto** - Complete server responses

- Contains `data`, `message`, `statusCode` properties
- Extend `CommonResponse<T>`
- Examples: `CategoryResponseDto`, `LoginResponseDto`

**ResponseDataDto** - Data inside the `data` property

- Contains only business logic data
- Used as generic parameter in ResponseDto
- Examples: `CategoryResponseDataDto`, `LoginDataDto`

#### Client DTOs (client/ folder)

**Dto** - Requests to server

- Contains parameters for sending
- Used only in frontend
- Examples: `LoginDto`, `RegisterDto`

### Examples

#### Server Responses

```typescript
// CategoryResponseDto - complete server response
{
  data: {
    id: "123",
    name: "Excavators",
    equipment: ["excavator-1", "excavator-2"],
    created_by: "user-123",
    image: {
      small: "small-image.jpg",
      original: "original-image.jpg"
    }
  },
  message: "Category retrieved successfully",
  statusCode: 200
}

// CategoriesResponseDto - array of categories
{
  data: [
    { id: "1", name: "Excavators", ... },
    { id: "2", name: "Bulldozers", ... }
  ],
  message: "Categories retrieved successfully",
  statusCode: 200
}
```

#### Client Requests

```typescript
// LoginDto - login parameters
{
  email: "user@example.com",
  password: "password123"
}

// RegisterDto - registration parameters
{
  email: "user@example.com",
  username: "username",
  password: "password123"
}
```

### Usage

#### Server DTOs

```typescript
// For typing API responses
const response: CategoryResponseDto = await api.getCategory(id);
const categories: CategoriesResponseDto = await api.getCategories();
```

#### Client DTOs

```typescript
// For typing API requests
const loginData: LoginDto = {
  email: 'user@example.com',
  password: 'password123',
};
await api.login(loginData);
```

### Important Notes

1. **Server DTOs** are for typing API responses
2. **Client DTOs** are for typing API requests
3. **ResponseDataDto** contains only the data, without the envelope
4. **ResponseDto** contains the complete response with envelope
5. All server responses follow the `CommonResponse<T>` structure
