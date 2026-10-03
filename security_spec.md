# Security Specification - Venezia Shoes Storefront

## 1. Data Invariants
1. Every document ID in `/products/{productId}` and `/storeConfig/{configId}` must match `^[a-zA-Z0-9_\-]+$` and be at most 128 characters.
2. Every `Product` document must strictly contain only the allowed keys defined in `firebase-blueprint.json` (`id`, `ref`, `name`, `frenchName`, `category`, `categoryLabel`, `brand`, `price`, `image`, `badge`, `sizes`, `colors`, `origin`, `boxQuantity`, `description`, `highlights`, `createdAt`) with bounded string and array sizes.
3. No shadow or undocumented fields are permitted on create or update.
4. `id` and `createdAt` fields on `Product` are immutable once created.

## 2. The "Dirty Dozen" Payloads
1. **Shadow Field Injection on Create**: `{ "id": "p1", "category": "bags", "image": "https://example.com/a.jpg", "isSuperAdmin": true }` -> Rejected by `hasOnly`.
2. **Oversized Product ID**: `productId` of 300 characters -> Rejected by `isValidId`.
3. **Invalid Product ID Characters**: `productId = "prod/../admin"` -> Rejected by `isValidId` regex.
4. **Invalid Category Enum**: `{ "id": "p1", "category": "electronics", "image": "https://example.com/a.jpg" }` -> Rejected by category enum check.
5. **Oversized Name String**: `name` > 300 characters -> Rejected by `.size() <= 300`.
6. **Oversized Description String**: `description` > 2000 characters -> Rejected by `.size() <= 2000`.
7. **Negative Price**: `price: -50` -> Rejected by `price >= 0`.
8. **Unbounded Colors Array**: `colors` with 50 elements -> Rejected by `colors.size() <= 20`.
9. **Unbounded Highlights Array**: `highlights` with 50 elements -> Rejected by `highlights.size() <= 20`.
10. **Immutable ID Mutation on Update**: Changing `id` from `"p1"` to `"p2"` -> Rejected by `incoming().id == existing().id`.
11. **Value Poisoning on Update**: Updating `price` to `"free"` (string instead of number) -> Rejected by `isValidProduct(incoming())`.
12. **Arbitrary Collection Write**: Writing to `/unauthorizedCollection/doc1` -> Rejected by global default-deny catch-all.
