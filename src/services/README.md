# Services - Usage Guide

This directory contains all API service modules for making HTTP requests.

## Files

- **`base.service.ts`** - Generic CRUD API service class
- **`auth.service.ts`** - Authentication API endpoints
- **`users.service.ts`** - Users API endpoints (example implementation)
- **`index.ts`** - Central export file for all services
  // yourApi.delete(id)

````

### With Custom DTOs

```typescript
interface CreateDTO {
  name: string;
  description: string;
}

interface UpdateDTO {
  name?: string;
  description?: string;
}

export const yourApi = createApiService<YourEntity, CreateDTO, UpdateDTO>(
  "/endpoint"
);
````

### Extending with Custom Methods

```typescript
const baseService = createApiService<Product>("/products");

export const productsApi = {
  ...baseService,

  // Custom method
  async getFeatured() {
    return baseService.customGet<Product[]>("featured");
  },

  // Another custom method
  async updateStock(productId: number, quantity: number) {
    return baseService.customPost(`${productId}/stock`, { quantity });
  },
};
```

## Available Methods

### Standard CRUD

- **`getAll(params?)`** - Get all items with pagination/filters
- **`getById(id)`** - Get single item by ID
- **`create(data)`** - Create new item
- **`update(id, data)`** - Full update
- **`patch(id, data)`** - Partial update
- **`delete(id)`** - Delete item
- **`bulkDelete(ids)`** - Delete multiple items

### Custom Requests

export interface CreateRoleDTO {
name: string;
permissions: string[];
}

const baseRolesService = createApiService<Role, CreateRoleDTO>("/roles");

export const rolesApi = {
...baseRolesService,

async assignPermissions(roleId: string, permissions: string[]) {
return baseRolesService.customPost(`${roleId}/permissions`, {
permissions,
});
},

async getPermissions() {
return baseRolesService.customGet<string[]>("available-permissions");
},
};
pageSize: 10,
search: "john",
role: "admin",
});

    console.log(response.data); // Array of users
    console.log(response.total); // Total count

} catch (error) {
console.error("Failed to load users:", error);
}
}

async function createUser() {
try {
const newUser = await usersApi.create({
name: "John Doe",
email: "john@example.com",
password: "password123",
role: "admin",
roleId: "1",
});

    console.log("User created:", newUser);

} catch (error) {
console.error("Failed to create user:", error);
}
}

```

## TypeScript Benefits

- Full type safety for request/response
- Auto-completion in IDE
- Compile-time error checking
- Generic types for reusability
```
