# SOLUTION.md

---

## Frontend (React)

### Memory Leak Prevention
- Used `AbortController` in `Items.js` to cancel fetch.

### Pagination & Search
- Server-side pagination with query parameters (`q`, `page`, `limit`).
- Debounced search input with `useEffect` and `setTimeout`.

### Performance: Virtualization
- Integrated `react-window` for virtualized rendering.

### UI/UX Polish
- Created a `global.css` for styling the app.
- Added skeleton loaders.

### Error Handling
- Added a global `ErrorBoundary` component to catch unhandled errors.

---

## Backend (Node.js/Express)

### Non-blocking I/O
- Refactored all file operations in `items.js` to use async `fs.promises` methods.

### Performance: Caching
- Cached item data and stats in memory, invalidating cache on file changes using `fs.watch`.


### Security
- Added `helmet` for secure HTTP headers.

### Testing
- Added Jest tests for items routes.

---

## Trade-offs

- **In-memory caching**: Improves performance for read-heavy workloads but may not scale for distributed deployments.
- **fs.watch**: Simple for local development, but not robust for production environments.
- **Virtualization**: Chose `react-window` for its simplicity and performance, but it requires fixed item heights.
- **Security**: Basic protections are in place for production but further security can be added (auth, input validation, advanced rate limiting).

---