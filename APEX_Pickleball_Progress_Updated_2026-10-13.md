# APEX Pickleball — Project Progress

**Last updated:** October 15, 2026 (Asia/Manila)  
**Project:** APEX Pickleball e-commerce portfolio website  
**Purpose:** Track implementation progress, tested behavior, and next steps.  
**Current phase:** Priority 3 — Admin UI, order fulfillment, and basic product/inventory saving implemented; stale-write and storefront verification remain.

The filename retains its original October 13 date; this document now includes progress through October 15.

---

## 1. Project Overview

APEX Pickleball is an e-commerce-style portfolio project built to demonstrate frontend and backend web development skills, including product browsing, a Supabase-backed catalog, cart and checkout flows, inventory validation, and order creation.

### Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- React
- Motion (`motion/react`)
- Lucide icons
- Supabase (PostgreSQL and server-side client)
- `@supabase/supabase-js`
- `@supabase/ssr` (installed version range: `^0.12.7`)
- `server-only`

### Design direction

- Dark background: `#080909`
- Lime accent: `#D7FF3F`
- Product focus: pickleball paddles

---

## 2. Features Implemented

### Product catalog and pages

- [x] Product data exists for 11 paddles.
- [x] Product records have been imported into the Supabase `products` table.
- [x] Active products can be fetched from Supabase using a server-only helper.
- [x] The homepage showcase loads products through a server component loader.
- [x] The collection page loads products and renders `ProductGrid`.
- [x] Local product data is used as a fallback if Supabase fetching fails.
- [x] Product detail route works for `/products/head-radical-elite`.
- [x] Next.js 16 `cacheComponents` page/prerender issue was addressed by awaiting route params inside a component wrapped in `Suspense`.

### Cart

- [x] Cart page uses local storage key `apex-cart`.
- [x] Cart items include `id`, `name`, `price`, `image`, and `quantity`.
- [x] Checkout is reachable from the cart.
- [x] Checkout preserves the cart when the order request fails.

### Checkout and order creation

- [x] Checkout form collects customer and shipping information.
- [x] Checkout sends customer details and product IDs/quantities to `POST /api/orders`.
- [x] Checkout displays a test-order confirmation after a successful response.
- [x] Checkout clears `apex-cart` only after a successful order response.
- [x] Checkout has an `errorMessage` state.
- [x] A custom dark-themed error modal is implemented and working.
- [x] The modal can display an error message and closes using the “Got it” button.
- [x] The API route calls the Supabase RPC function `create_store_order`.
- [x] The RPC validates item input, checks active products and stock, calculates prices from the database, creates the order and order items, and decreases stock.
- [x] The order creation flow has succeeded in a test.
- [x] Insufficient stock is rejected by the database, e.g. `Insufficient stock for HEAD Radical Elite`.
- [x] The API response was adjusted so insufficient-stock errors can be returned to checkout for display in the modal.

> **Important:** This is still a test checkout. No real payment provider is connected. The checkout confirmation UI itself says that no payment is collected. Verify that the current API/RPC and confirmation wording match before treating this as production-ready.

### Admin authentication and authorization

- [x] Existing Supabase project reused; Email authentication enabled and a test admin user manually created in Supabase Auth.
- [x] Email/password admin login at `/admin/login`; no public admin signup page.
- [x] Browser and server Supabase SSR clients use the publishable key and cookie sessions.
- [x] `src/proxy.ts` refreshes sessions with `getClaims()` on `/admin/:path*` and `/api/admin/:path*`, forwarding refreshed cookies and cache headers.
- [x] Server-only `getAdminAccess()` verifies the user with `getUser()` and checks the server-only, comma-separated `ADMIN_EMAILS` allowlist case-insensitively.
- [x] Each implemented protected page/API checks authorization itself. Proxy is session-refresh infrastructure, not the authorization gate.
- [x] Login uses a Server Action; valid accounts outside the allowlist are signed out of the current session and rejected by the code.
- [x] Logout uses a Server Action with `scope: "local"`.
- [x] Signed-out pages redirect to login; signed-in non-admin pages call `notFound()`. APIs distinguish `401` and `403`.
- [ ] Independently test the non-admin account rejection/`403` path; this has not been explicitly user-confirmed.

### Admin overview and order management

- [x] Dashboard displays total orders, pending orders, active low-stock products (`stock <= 5`, including zero), and non-cancelled test-order value.
- [x] `get_admin_test_order_value()` calculates the value in PostgreSQL rather than summing a limited API result in JavaScript.
- [x] Orders list displays the latest 20 orders, newest first, with reference links, status badges, totals and Manila-local dates.
- [x] Individual order page/API displays customer and shipping information, purchased items, subtotal, shipping fee and total.
- [x] Controlled forward fulfillment: `pending -> confirmed -> shipped -> delivered`.
- [x] Order `PATCH` validates the UUID, JSON payload and allowed transition, then atomically filters by `id` and `expectedStatus` before updating.
- [x] Stale/missing-row updates return `409`; update errors are shown in the UI and the button is disabled while pending.
- [x] Successful status changes persist after refresh; a two-tab stale-update test passed (user-confirmed).
- [ ] Cancellation/restocking is not implemented and no cancellation policy has been selected.

### Admin UI and product editor

- [x] Shared `AdminShell` with Overview, Orders and Products navigation, storefront link and logout.
- [x] APEX dark/lime styling applied to dashboard cards, tables, order details, status/stock badges and login.
- [x] Admin layouts checked at narrow/mobile widths by the user; no overlap reported.
- [x] Products endpoint/list includes active and inactive records, up to 100 alphabetically, with a separate full `totalProducts` count.
- [x] Product table shows thumbnails, names/categories, PHP prices, stock badges and visibility badges.
- [x] Search matches loaded product names, categories and IDs. Stock filter supports all, available (`> 0`), low (`<= 5`, including zero), and out of stock (`= 0`). These are client-side filters over loaded records, not a paginated search of the full catalog.
- [x] Product-name links open a protected `/admin/products/[id]` page with a single-product loader.
- [x] Product editor shows thumbnail, product ID/category, price and stock inputs, and storefront visibility checkbox.
- [x] Admin product reads and the `AdminProduct` type include `updated_at`; product updates compare the submitted version before saving.
- [x] `src/lib/products/validation.ts` implements price/stock range and precision checks matching the inspected database schema; the protected product `PATCH` uses them and validates visibility.
- [x] Product edit form sends price, stock, visibility and expected `updated_at`; pending, success, error and stale-version responses are handled in the UI.
- [x] User confirmed Save changes works and a stock edit was saved successfully. This is a manual report, not an independent live database audit.
- [ ] Test a stale product edit from two tabs and verify checkout-driven inventory changes also update `updated_at` so an older editor cannot overwrite newer stock.
- [ ] Reload and check the saved product in the admin list and storefront; explicitly verify price and visibility edits.
- [ ] Product creation, metadata/image editing, upload and deletion are not implemented in the admin area.

---

## 3. Important Files

| File | Responsibility |
|---|---|
| `src/app/page.tsx` | Homepage composition |
| `src/app/globals.css` | Global styles and design tokens |
| `src/app/layout.tsx` | Root layout |
| `src/components/layout/Navbar.tsx` | Navigation |
| `src/components/layout/Footer.tsx` | Footer |
| `src/components/hero/HeroSection.tsx` | Homepage hero |
| `src/components/showcase/PaddleShowcase.tsx` | Paddle showcase UI |
| `src/components/showcase/PaddleShowcaseLoader.tsx` | Server-side product loading and fallback |
| `src/components/products/ProductCard.tsx` | Product card |
| `src/components/products/ProductGrid.tsx` | Collection grid, filtering/search/sort and quick view |
| `src/components/products/ProductPurchasePanel.tsx` | Product purchase UI |
| `src/data/products.ts` | Local product data and `PaddleProduct` type |
| `src/lib/supabase/admin.ts` | Server-only Supabase admin client |
| `src/lib/supabase/products.ts` | Fetch active products from Supabase |
| `src/app/products/[id]/page.tsx` | Product details page |
| `src/app/collection/page.tsx` | Product collection page |
| `src/app/cart/page.tsx` | Cart page |
| `src/app/checkout/page.tsx` | Checkout form, request handling, success state, and error modal |
| `src/app/api/orders/route.ts` | Server endpoint for creating orders |
| `src/app/api/health/supabase/route.ts` | Supabase health-check endpoint |
| `src/proxy.ts` | Admin SSR session refresh; cookie/cache-header forwarding |
| `src/lib/supabase/client.ts` | Browser Supabase SSR client |
| `src/lib/supabase/server.ts` | Per-request, cookie-aware server Supabase SSR client |
| `src/lib/auth/admin.ts` | Trusted user lookup and server-side admin allowlist check |
| `src/lib/orders/status.ts` | Shared order statuses and allowed next-status helper |
| `src/lib/products/validation.ts` | Product price/stock validation helpers used by the admin save endpoint |
| `src/app/admin/login/page.tsx` | Styled admin login form with pending/error states |
| `src/app/admin/login/actions.ts` | Server-side sign-in and admin authorization |
| `src/app/admin/actions.ts` | Current-session logout action |
| `src/app/admin/page.tsx` | Protected overview page |
| `src/app/admin/orders/page.tsx` | Protected latest-orders page |
| `src/app/admin/orders/[id]/page.tsx` | Protected single-order details page |
| `src/app/admin/products/page.tsx` | Protected product/inventory list |
| `src/app/admin/products/[id]/page.tsx` | Protected product edit-preview page |
| `src/app/api/admin/overview/route.ts` | Protected counts and test-order value |
| `src/app/api/admin/orders/route.ts` | Protected latest-20 orders `GET` |
| `src/app/api/admin/orders/[id]/route.ts` | Protected order/items `GET` and fulfillment `PATCH` |
| `src/app/api/admin/products/route.ts` | Protected product list `GET`, limit 100 plus total count |
| `src/app/api/admin/products/[id]/route.ts` | Protected single-product `GET` and validated, version-checked product `PATCH` |
| `src/components/admin/AdminShell.tsx` | Shared responsive admin navigation/layout |
| `src/components/admin/OrderCount.tsx` | Overview data loader and four metric cards |
| `src/components/admin/OrdersList.tsx`, `OrdersTable.tsx` | Orders loader and linked summary table |
| `src/components/admin/OrderDetails.tsx`, `OrderItemsTable.tsx` | Order details, status-update UI, items and totals |
| `src/components/admin/OrderStatusBadge.tsx`, `StockBadge.tsx` | Shared status/stock badges |
| `src/components/admin/ProductsList.tsx`, `ProductsTable.tsx` | Product loader, search/stock filters and thumbnail table |
| `src/components/admin/ProductEditor.tsx`, `ProductEditForm.tsx` | Single-product loader and product edit form with save feedback |
| `.env.local` | Server environment variables; do not commit secrets |

**Route distinction:** `src/app/api/orders/route.ts` remains the public checkout `POST`. It must not be replaced with an admin route. Browser UI belongs under `/admin/...`; JSON endpoints belong under `/api/admin/...`. Literal `[id]` folders implement dynamic routes; Next.js 16 route/page params are awaited promises.

---

## 4. Supabase Database

### `products`

Known columns include:

- `id` (text primary key)
- `name`
- `category`
- `description`
- `price`
- `image`
- `stock`
- `active`
- `created_at`
- `updated_at`
- `specs` (JSONB)
- `accent`
- `badge`

The product fetching helper selects active records and converts `price` to a JavaScript number.

Schema confirmed from the user's Supabase SQL results on October 15:

- `price`: `numeric(10,2)`, with `CHECK (price >= 0)`; allowed range is `0` through `99,999,999.99` with at most two decimal places.
- `stock`: 32-bit PostgreSQL `integer`, with `CHECK (stock >= 0)`; allowed range is `0` through `2,147,483,647`.
- `updated_at` is selected by admin product reads. Product `PATCH` conditionally updates only when the submitted `updated_at` still matches, then writes a new timestamp. The user inspected the deployed `create_store_order` definition and confirmed checkout stock decrements also set `updated_at = now()`, so checkout changes participate in this version check.

### `orders`

Known columns include:

- `id` (UUID)
- `order_number` (changed from an identity `bigint` toward `text` so prefixed values such as `APX-XXXXXXXX` can be stored)
- `customer_name`
- `email`
- `phone`
- `shipping_address`
- `shipping_city`
- `shipping_region`
- `shipping_postal_code`
- `shipping_country`
- `subtotal`
- `shipping_fee`
- `total`
- `status`
- `created_at`

The `order_number` column type change was attempted after an identity-column error. Confirm in Supabase that the final schema is `text` and that the RPC works after this change.

Subsequent manual tests confirmed `APX-...` references are stored and returned successfully. The final column type has not been freshly introspected during this update.

The user supplied the full current status constraint:

```sql
CHECK (status = ANY (ARRAY[
  'pending'::text, 'confirmed'::text, 'shipped'::text,
  'delivered'::text, 'cancelled'::text
]))
```

Use `confirmed`, not the originally proposed `processing`. The current API only permits the forward sequence through `delivered`; it does not enable cancellation. These are fulfillment statuses, not proof of payment.

### `order_items`

Known columns include:

- `id` (UUID)
- `order_id` (UUID)
- `product_id` (text)
- `product_name`
- `unit_price`
- `quantity`
- `line_total`
- `created_at`

### RPC: `create_store_order`

The database function is designed to:

1. Validate that the supplied items form a JSON array.
2. Check products and stock in the database.
3. Lock products while processing to help prevent overselling.
4. Calculate the subtotal from database prices rather than trusting client prices.
5. Create an order with a generated `APX-...` order number.
6. Insert the corresponding order items.
7. Decrease inventory and update `updated_at`.
8. Return the order ID and order number.

The function is configured as `SECURITY INVOKER`, with a restricted `search_path`, and execution was granted to `service_role`. Specific table grants were added while troubleshooting permissions.

### RPC: `get_admin_test_order_value`

Manually created in the existing Supabase database under `public`; this is a function, not a table or column.

- Returns a scalar `numeric`: `COALESCE(SUM(total), 0)` from `public.orders` where `status <> 'cancelled'`.
- SQL function marked `STABLE`, `SECURITY INVOKER`, with `search_path = ''` and an explicitly schema-qualified table.
- Execution revoked from `PUBLIC`, `anon` and `authenticated`, then granted to `service_role` in the same transaction.
- Called only after the overview endpoint's admin check. The test total of `17495` was confirmed through SQL, API and dashboard UI.
- The value is recalculated when called; no payment provider or paid-revenue calculation is involved.

### Permissions troubleshooting already done

- Granted `SELECT`, `INSERT`, and `UPDATE` on `products` to `service_role` at different points.
- Granted `INSERT` on `orders` to `service_role`.
- Granted `INSERT` on `order_items` to `service_role`.
- Enabled RLS on `products`, `orders`, and `order_items` was noted; verify actual current RLS policies and grants before production deployment.
- A health-check endpoint was made to work after targeted grants.

Additional grants manually applied while building the admin features:

```sql
GRANT SELECT ON TABLE public.orders TO service_role;
GRANT SELECT ON TABLE public.order_items TO service_role;
GRANT UPDATE (status) ON TABLE public.orders TO service_role;
```

The first two resolved confirmed `42501` permission errors. A targeted `UPDATE (price, stock, active, updated_at)` grant to `service_role` was provided for product saves; the user subsequently reported that saving and stock edits work. Effective live grants/policies have not been independently audited. Do not disable RLS or grant customer/browser roles broad access.

**Security note:** `SUPABASE_SECRET_KEY` must remain server-only. Never expose it through a `NEXT_PUBLIC_` variable or client component.

---

## 5. Environment and Next.js Notes

Expected server environment variables in `.env.local`:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `ADMIN_EMAILS` (comma-separated admin emails; kept server-only)

Browser-safe SSR authentication variables:

- `NEXT_PUBLIC_SUPABASE_URL` (same project as `SUPABASE_URL`)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Missing public URL/key variables previously caused the SSR client's required-URL/key error; adding them and restarting the dev server resolved it. The server key was checked without exposing its value and had the secret-key format. `.env.local` is ignored by Git. No key values or passwords belong in this progress document.

The project uses Next.js 16.4.0 and has `cacheComponents: true` and `partialPrefetching: true` in `next.config.ts`.

Do not add `export const runtime = "nodejs"` to the order route without checking compatibility with the current `cacheComponents` configuration; adding it previously caused a Next.js error.

Before writing Next.js code, read the relevant installed guide in `node_modules/next/dist/docs/` as required by `AGENTS.md`.

Admin pages keep async authentication and dynamic params inside a component under `Suspense`. An explicit `await connection()` from `next/server`, before authentication in that component, was added after a `blocking-prerender-current-time` error. Keep this working pattern when extending pages. Proxy refreshes sessions; authorization remains close to each read/write.

Troubleshooting: `head: true` count requests produced empty error messages. Current overview count queries use `.select('id', { count: 'exact' }).limit(1)` with proper error returns. Never fall through to `count ?? 0` after a query error; that previously disguised a permission failure as zero orders. Protected data responses use `Cache-Control: private, no-store`.

---

## 6. Current Progress — October 15, 2026

### Checkout: Passed (user-confirmed)

- [x] Insufficient-stock validation rejects invalid orders.
- [x] Error modal displays the specific error: `Insufficient stock for HEAD Radical Elite`.
- [x] Successful order is saved to Supabase and checkout clears the cart after success.
- [x] Failed checkout preserves the cart.
- [x] Stock decreases for successful orders and remains unchanged for failed orders.

### Order data integrity: Passed (user-confirmed)

The user subsequently confirmed **all Priority 2 tests pass**:

- [x] Correct customer and shipping information in `orders`.
- [x] Correct products, quantities, prices, and totals in `order_items`.
- [x] `APX-...` order reference correctly generated/stored/returned.
- [x] Database-derived prices used for server-side order totals.
- [x] No partial order or order-item records left after failed transactions.
- [x] Inventory decrements only on successful orders.

**Evidence scope:** Passes are based on the user's manual checks, not a fresh automated audit of the live database.

**Important:** Checkout is still a test-order flow with no payment provider. Successful order insertion does not prove payment was received. Review any checkout success text that suggests no order was actually submitted: orders ARE saved to Supabase.

### Admin: implemented and manually checked

- [x] Sign-in, sign-out, dashboard access and signed-out redirect work (user-confirmed).
- [x] Overview API returns data for the admin and `Unauthorized` after logout (user-confirmed).
- [x] Dashboard metrics match the user's database checks. Initial diagnostic snapshot: 4 orders, 4 pending orders, 11 active low-stock products and test-order value `17,495.00`.
- [x] Orders and order-item details match database records (user-confirmed). One inspected test order contained quantity 2 at `3,499.00`, subtotal/total `6,998.00`, shipping `0.00`.
- [x] A test order advanced to `confirmed`, persisted after refresh, then advanced to `shipped` during the two-tab conflict test. The stale second tab was rejected (user-confirmed). The pending count is therefore mutable; the earlier 4-pending snapshot is not the current expected value.
- [x] Dashboard/order/product navigation, responsive layouts, stock/visibility badges and product search/filter UI implemented. User reported responsive behavior without overlap.
- [x] Product catalog returns all 11 current products; the observed stock snapshot was zero for all 11. This is test data, not evidence of a checkout regression.
- [x] Product editor thumbnail now visible (user-confirmed screenshot); price, stock and visibility are prefilled.
- [x] User confirmed product saving works, including adding stock.
- [x] User reported successful `npm run build` checks at multiple milestones, most recently after the editor UI was assembled and before the product-save implementation.
- [ ] No fresh build/lint or automated regression suite has been run after product saving was added.
- [ ] Non-admin `403`, unauthorized mutation, malformed/invalid fulfillment inputs and the final delivered transition have code paths but have not all been explicitly tested by the user.

Screenshots, API outputs and database statements above are session evidence, not a fresh live database/security audit. Counts and statuses will change as test orders are edited.

---

## 7. Roadmap — Updated

### Priority 1: Stock-error UX — CORE TESTS PASS

- [x] Test insufficient stock and show the actual product-specific error.
- [x] Preserve cart on checkout failure.
- [x] Successful order succeeds; failed stock validation does not reduce stock.
- [ ] Optional: Add `Return to cart` action to the modal.
- [ ] Optional: Show refreshed available quantity.
- [ ] Verify shipping form state is preserved after failures, if not separately tested.
- [ ] Confirm duplicate submissions are disabled while checkout is pending.

### Priority 2: Verify order correctness — ALL TESTS PASS (USER REPORTED)

- [x] Verify customer/shipping details in `orders`.
- [x] Verify product details, quantities, unit prices and line totals in `order_items`.
- [x] Confirm success decreases stock and failure doesn't.
- [x] Confirm failed orders do not leave partial records.
- [x] Confirm `APX-...` order reference works end-to-end.
- [x] Confirm the database determines the order prices/totals.

### Priority 3: Protected admin dashboard — IN PROGRESS

**Step 1 — Admin authentication and authorization — IMPLEMENTED**

- [x] Reuse existing Supabase Auth with email/password login and a manually created test admin account.
- [x] Server-only allowlist authorization; no public signup.
- [x] Session-refresh proxy and local-session logout.
- [x] Protect all currently implemented admin pages, API reads and the order-status mutation.
- [ ] Complete non-admin/unauthorized-mutation regression checks and production review.

**Step 2 — Dashboard overview — IMPLEMENTED**

- [x] Four live metrics, styled cards and restricted aggregate RPC.
- [x] Test-order value labelled accurately; no paid-revenue claims.

**Step 3 — Order management — READS AND FORWARD FULFILLMENT IMPLEMENTED**

- [x] List latest 20 orders and show individual orders, items, customer/shipping details and totals.
- [x] Controlled updates: `pending -> confirmed -> shipped -> delivered`, with expected-status conflict detection.
- [ ] Define cancellation/restocking behavior before enabling cancellation.
- [ ] Additional order pagination/search/filtering if needed; the current list is explicitly latest 20.

**Step 4 — Product/inventory management — BASIC SAVE IMPLEMENTED; CONCURRENCY CHECKS NEXT**

- [x] Protected list/single-product reads, thumbnails, stock/visibility badges, loaded-product search and stock filtering.
- [x] Protected product `PATCH` validates price, stock and visibility and conditionally updates against the loaded `updated_at`.
- [x] Form submits changes with pending/success/error feedback and uses the returned timestamp for subsequent saves.
- [x] User manually confirmed saving a stock increase works.
- [ ] Verify checkout stock decrements maintain `updated_at`; test that a stale editor receives `409` rather than overwriting a newer update.
- [ ] Reload to verify saved values; verify price and visibility changes and storefront behavior.
- [ ] Run a fresh build and review invalid-input/unauthorized-update behavior.
- [ ] Product creation, name/category/description/image editing or upload, and deletion are future work.
- [ ] Pagination/server-side product search if the catalog exceeds the first 100 loaded records.

**Implemented route structure:**

```text
src/app/admin/
  login/page.tsx
  login/actions.ts
  actions.ts
  page.tsx
  orders/page.tsx
  orders/[id]/page.tsx
  products/page.tsx
  products/[id]/page.tsx

src/app/api/admin/
  overview/route.ts
  orders/route.ts
  orders/[id]/route.ts       # GET + PATCH fulfillment
  products/route.ts
  products/[id]/route.ts     # GET + validated/version-checked PATCH
```

**Ordering preference:** The user requested admin UI first. Overview, orders, product list and product editor preview have now been styled. Cancellation was deferred while UI work proceeded; its stock-restoration policy remains undecided.

### Priority 4: Payments — PENDING

- [ ] Choose payment provider for intended markets.
- [ ] Use hosted/tokenized checkout; do not handle raw card data directly.
- [ ] Confirm payment server-side using trusted provider callbacks/webhooks.
- [ ] Keep payment state separate from fulfillment status.

### Priority 5: Production hardening — PENDING

- [ ] Validate/normalize inputs.
- [ ] Audit RLS, database grants and RPC permissions.
- [ ] Keep secrets on server and out of Git.
- [ ] Add rate limiting, useful logs, concurrent-order tests and automated regression tests.
- [ ] Fix checkout confirmation wording to accurately describe test orders saved to the server.
- [ ] Deploy and verify environment variables and database access.
- [ ] Capture manually applied schema/functions/grants in reproducible migrations and add meaningful authorization/concurrency tests.

---

## 8. Working Style Preference

The user prefers beginner-friendly, incremental guidance:

> “just give me what code or line to change so i can also learn dont give me the full code immediately until i ask you”

For future changes, provide exact file paths and focused snippets/line replacements rather than full-file rewrites, unless the user explicitly requests the full code.

The user explicitly asked to make application changes manually: do not edit application files or run database mutations on their behalf. Provide one focused step at a time, then let them apply/test it. Read-only repository inspection has been used to diagnose errors. This progress-document update was separately and explicitly requested by the user.

Be explicit about matching opening/closing JSX tags and whether a snippet replaces or is inserted into an existing block. Several past UI issues came from an early closing tag, duplicated old sections, or accidentally applying a toolbar grid to the table's outer container. Diagnose the saved file before suggesting a correction; it may differ from an unsaved editor buffer.

---

## 9. Handoff Prompt — Resume Here

Continue APEX Pickleball from this progress note updated October 15, 2026. The file retains its original October 13 filename. The public catalog/cart/test checkout, database-derived order totals and inventory transactions previously passed the user's manual checks.

Admin email/password authentication is now implemented using Supabase SSR and a server-only `ADMIN_EMAILS` allowlist. Existing Supabase Auth is configured; do not restart authentication setup. Protected overview, orders, order details, product list and product editor-preview pages exist. Admin UI uses dark/lime styling and has been checked at mobile widths. JSON endpoints are under `/api/admin/...`, not `/admin/...`; preserve the separate public checkout `POST /api/orders`.

Order management supports `pending -> confirmed -> shipped -> delivered`, matching the database constraint. Status `PATCH` requires an authorized admin, validates input and conditionally updates against `expectedStatus`; the user confirmed persistence and a two-tab `409` conflict test. Cancellation is not enabled, and no cancellation/restocking policy was selected.

Product editing now has a protected `PATCH` with price/stock validation, visibility validation and a conditional `updated_at` check. The form sends edits and shows pending/success/error feedback. The user confirmed that saving and adding stock work. A targeted `service_role` update grant was provided before testing; its live effective permissions have not been independently audited.

**Exact resume point:** Test stale-save rejection with two tabs: load one product in both, save a change in the first, then attempt a different change from the stale second tab and confirm it is rejected with `409`. Then reload to confirm saved values and check storefront behavior. Explicitly test price and visibility changes. Run a fresh build and review invalid/unauthorized update behavior. Product creation, product metadata/image editing and deletion remain future work.

The user reported prior production builds passing, but no fresh build/lint has been run after product saving was added. User confirmations and screenshots are not a comprehensive automated/security audit; non-admin access and invalid/unauthorized mutation coverage remains incomplete.

Work manually, one focused snippet at a time. Do not edit application files unless the user changes that preference. The current explicit request was only to update this progress document before proceeding. Read relevant installed Next.js 16 documentation before coding; preserve the working `Suspense`/`await connection()`/awaited-params pattern.

No payment provider is connected. Test-order value is not paid revenue. Optional checkout UX polish, database permission/RLS review, cancellation/restocking, remaining product-management features and production hardening are still pending.
