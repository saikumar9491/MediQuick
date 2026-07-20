# User Profile, Orders, & Wishlist Build — Task List

## Backend
- [x] Add `notificationPreferences` field to `server/models/User.js`
- [x] Create `server/models/Prescription.js` schema
- [x] Create `/api/customers/me/*` routes in `server/routes/customerRoutes.js`
- [x] Mount `customerRoutes` in `server/server.js`
- [x] Fix `customerRoutes.js` route paths to map `/me` prefix
- [x] Correct Order collection query filters from `user` to `userId`
- [x] Implement secure `GET /api/customers/me/orders/:orderId`
- [x] Implement secure `POST /api/orders/:orderId/reorder` with live stock validation
- [x] Implement secure `GET /api/orders/:orderId/invoice` html/pdf preview generator
- [x] Create new detailed `Wishlist` model (`server/models/Wishlist.js`)
- [x] Create new `RestockSubscription` model (`server/models/RestockSubscription.js`)
- [x] Implement dynamic wishlist auto-migration from legacy `User.wishlist` arrays
- [x] Hook product updates to dispatch back-in-stock `Notification` alerts to restock subscribers when stock level goes from 0 to >0.
- [x] Mount `productRoutes` in `server/server.js`

## Frontend
- [x] Create `client/src/api/profile.js` API helpers
- [x] Create Tab Components under `client/src/pages/Profile/components/`
- [x] Update route in `client/src/App.jsx` to load new Profile layout
- [x] Create `client/src/api/myOrders.js` orders API helpers
- [x] Create MyOrders page & components
- [x] Update route in `client/src/App.jsx` to load new MyOrders layout
- [x] Create `client/src/api/wishlist.js` wishlist API helpers
- [x] Create Wishlist page & components:
  - [x] `EmptyWishlistState.jsx`
  - [x] `WishlistProductCard.jsx`
  - [x] `WishlistGrid.jsx`
  - [x] `Wishlist.jsx`
- [x] Create shared `WishlistHeartButton.jsx` component for sitewide details pages
- [x] Update route in `client/src/App.jsx` to load new Wishlist layout

## Verification
- [x] Production build verification check compiles without errors (✓ built in 19.88s)
- [x] Run security tests: verify User B is blocked with `403 Forbidden` from accessing User A's order details, reordering, and invoices.
- [x] Run integration tests: verify restock notification dispatch hook fires to RestockSubscription recipients when stock goes from 0 to >0.
