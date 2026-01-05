# Manual Test Checklist

This checklist provides step-by-step instructions for manually verifying the budget application's functionality, performance, and user experience.

**Estimated Time:** 15 minutes

## Prerequisites

- Backend running on `http://localhost:8002`
- Frontend running on `http://localhost:5173`
- Browser DevTools open (F12)
- Test user account (use Dev Login)

---

## 1. API Connection & Authentication ⏱️ 2 min

### 1.1 Backend Health Check
- [ ] Navigate to `http://localhost:8002/`
- [ ] Verify JSON response: `{"message": "Welcome to the Finance App API"}`
- [ ] Check backend logs for any errors

### 1.2 Authentication Flow
- [ ] Go to `http://localhost:5173/login`
- [ ] Click "Dev Login (Test User)"
- [ ] Verify redirect to dashboard (`/`)
- [ ] Check DevTools → Application → Cookies for `session` cookie
- [ ] Verify cookie has `HttpOnly` and `SameSite` attributes

### 1.3 CORS Headers
- [ ] Open DevTools → Network tab
- [ ] Reload dashboard
- [ ] Select any API request (e.g., `/analytics/summary`)
- [ ] Verify Response Headers include:
  - `access-control-allow-origin: http://localhost:5173`
  - `access-control-allow-credentials: true`
- [ ] Verify no CORS errors in Console

---

## 2. Dashboard Display ⏱️ 3 min

### 2.1 Summary Cards
- [ ] Navigate to `/` (Dashboard)
- [ ] Verify the following cards are visible:
  - [ ] Net Worth / Total Balance
  - [ ] Total Assets
  - [ ] Total Liabilities
  - [ ] Income (current month)
  - [ ] Expenses (current month)
  - [ ] Net Flow
- [ ] Verify numbers are formatted correctly (currency format)
- [ ] Check that amounts are not NaN or undefined

### 2.2 Account Summaries
- [ ] Scroll to account section
- [ ] Verify account list displays:
  - [ ] Account name
  - [ ] Account type
  - [ ] Balance amount
  - [ ] Bank/institution name
- [ ] Verify accounts are grouped correctly

### 2.3 Loading States
- [ ] Open DevTools → Network tab
- [ ] Enable "Slow 3G" throttling
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Verify loading skeleton appears briefly
- [ ] Verify skeleton disappears when data loads

### 2.4 Error Handling
- [ ] Stop backend server
- [ ] Reload dashboard
- [ ] Verify error message displays (not blank page)
- [ ] Restart backend
- [ ] Verify dashboard recovers and displays data

---

## 3. Charts & Graphs ⏱️ 2 min

### 3.1 Spending Trends Chart
- [ ] On Dashboard, locate spending trends area chart
- [ ] Verify chart renders with SVG elements (check in DevTools)
- [ ] Verify chart shows:
  - [ ] X-axis (dates)
  - [ ] Y-axis (amounts)
  - [ ] Income line/area
  - [ ] Expenses line/area
- [ ] Hover over data points and verify tooltip appears

### 3.2 Category Pie Chart
- [ ] Locate category breakdown pie chart
- [ ] Verify chart renders with colored segments
- [ ] Verify legend displays category names
- [ ] Hover over segments and verify tooltip shows category and amount

### 3.3 Chart Responsiveness
- [ ] Resize browser window (drag to narrow)
- [ ] Verify charts resize smoothly
- [ ] Verify charts remain readable at 375px width (mobile)
- [ ] Verify no horizontal scrolling required

### 3.4 Empty State
- [ ] (If possible) Test with new user having no transactions
- [ ] Verify charts handle empty data gracefully
- [ ] Verify appropriate "No data" message or empty state

---

## 4. Transactions Management ⏱️ 3 min

### 4.1 Transaction List (Desktop)
- [ ] Navigate to `/transactions`
- [ ] Verify table view displays (on desktop)
- [ ] Verify columns: Date, Description, Amount, Category, Tags, Actions
- [ ] Verify transactions are sorted by date (newest first)
- [ ] Verify amounts are color-coded (red for expenses, green for income)

### 4.2 Transaction List (Mobile)
- [ ] Resize browser to 375px width OR use DevTools device emulator
- [ ] Navigate to `/transactions`
- [ ] Verify card view displays (not table)
- [ ] Verify each transaction card shows:
  - [ ] Date
  - [ ] Description
  - [ ] Amount
  - [ ] Tags (if any)
  - [ ] Edit button
- [ ] Verify cards are vertically stacked

### 4.3 Editing Transaction
- [ ] Click "Edit" on any transaction
- [ ] Verify modal opens
- [ ] Verify modal is fullscreen on mobile
- [ ] Edit description
- [ ] Add a tag using tag input
- [ ] Click "Save Changes"
- [ ] Verify modal closes
- [ ] Verify changes appear in list immediately

### 4.4 Tag Filtering
- [ ] Locate tag filter dropdown (usually top-right)
- [ ] Click to open dropdown
- [ ] Verify list of available tags displays
- [ ] Select a tag checkbox
- [ ] Verify transaction list filters to show only transactions with that tag
- [ ] Deselect tag
- [ ] Verify all transactions show again

---

## 5. Database Sync & Persistence ⏱️ 2 min

### 5.1 Create via UI
- [ ] (If create functionality exists) Create new transaction
- [ ] Refresh page (F5)
- [ ] Verify transaction persists

### 5.2 Update via UI
- [ ] Edit a transaction's description
- [ ] Save changes
- [ ] Refresh page
- [ ] Verify updated description persists

### 5.3 Create via API, Verify in UI
- [ ] Use DevTools Console or Postman:
  ```javascript
  fetch('http://localhost:8002/transactions/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      date: new Date().toISOString(),
      amount: -50.00,
      description: 'API Created Transaction',
      account_id: <YOUR_ACCOUNT_ID>
    })
  })
  ```
- [ ] Reload transactions page
- [ ] Verify new transaction appears in list

---

## 6. Tags & Categories ⏱️ 2 min

### 6.1 Tag Creation
- [ ] Go to `/transactions`
- [ ] Click Edit on a transaction
- [ ] Type new tag name in tag input
- [ ] Press Enter or click "Create [tag name]"
- [ ] Verify tag is created and assigned
- [ ] Verify tag appears in tag filter dropdown

### 6.2 Category Budgets
- [ ] Navigate to `/budget`
- [ ] Verify category list displays
- [ ] Verify each category shows:
  - [ ] Category name
  - [ ] Current spending
  - [ ] Monthly limit (if set)
  - [ ] Progress bar (if spending > 0)
- [ ] Edit a category limit
- [ ] Verify limit saves

---

## 7. User Profile & Settings ⏱️ 1 min

### 7.1 Profile Page
- [ ] Navigate to `/profile`
- [ ] Verify form displays:
  - [ ] Email field (read-only or editable)
  - [ ] Full Name field
  - [ ] Avatar URL field (if applicable)
- [ ] Update full name
- [ ] Click Save
- [ ] Verify success message or visual feedback
- [ ] Refresh page
- [ ] Verify name persists

### 7.2 Settings Page
- [ ] Navigate to `/settings`
- [ ] Verify sections display:
  - [ ] SimpleFIN Setup
  - [ ] Tag Rules
  - [ ] Sync Status
- [ ] Verify sync status shows current configuration

---

## 8. Mobile Responsive ⏱️ 2 min

### 8.1 Viewport Testing
- [ ] Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
- [ ] Test at viewports:
  - [ ] iPhone SE (375x667)
  - [ ] iPhone 12 Pro (390x844)
  - [ ] iPad (768x1024)
  - [ ] Desktop (1280x720)

### 8.2 Navigation
- [ ] On mobile viewport, verify:
  - [ ] Bottom navigation bar appears (if implemented)
  - [ ] Navigation icons are visible
  - [ ] Navigation is accessible
- [ ] Tap each navigation item
- [ ] Verify page navigation works

### 8.3 Touch Targets
- [ ] On mobile viewport, inspect buttons and links
- [ ] Verify minimum 44x44px touch target size
- [ ] Verify adequate spacing between interactive elements
- [ ] Verify no overlapping clickable areas

### 8.4 Modals on Mobile
- [ ] On mobile viewport, open edit modal
- [ ] Verify modal takes full screen or near-full screen
- [ ] Verify close button is accessible
- [ ] Verify keyboard doesn't cover inputs

---

## 9. PWA Features ⏱️ 2 min

### 9.1 Service Worker
- [ ] Open DevTools → Application → Service Workers
- [ ] Verify service worker is registered
- [ ] Verify service worker status is "activated and running"
- [ ] Check "Update on reload" and verify it updates

### 9.2 Offline Indicator
- [ ] Look for offline indicator component (usually top bar)
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Offline"
- [ ] Trigger a network request (reload page)
- [ ] Verify offline indicator appears with message
- [ ] Set throttling back to "Online"
- [ ] Verify indicator disappears or shows "Back online" message

### 9.3 Caching
- [ ] Open DevTools → Application → Cache Storage
- [ ] Verify cache entries exist (Google Fonts, static assets)
- [ ] Go offline
- [ ] Reload page
- [ ] Verify page still loads (from cache)
- [ ] Verify cached fonts and styles load

### 9.4 Install Prompt
- [ ] (If conditions met) Verify install prompt appears
- [ ] Verify "Add to Home Screen" works (if on mobile device)
- [ ] Verify app icon displays correctly
- [ ] Verify app opens in standalone mode

---

## 10. Performance Checks ⏱️ 2 min

### 10.1 Initial Load
- [ ] Open DevTools → Network tab
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Note total load time
- [ ] Verify initial load < 3 seconds on fast connection
- [ ] Check number of requests (< 50 for initial load)

### 10.2 API Response Times
- [ ] In Network tab, filter by "Fetch/XHR"
- [ ] Reload dashboard
- [ ] Verify API endpoints respond:
  - [ ] `/analytics/summary` < 500ms
  - [ ] `/analytics/trends` < 500ms
  - [ ] `/transactions/` < 1000ms
- [ ] Check for any requests taking > 2 seconds

### 10.3 Console Errors
- [ ] Open DevTools → Console
- [ ] Reload page and navigate through app
- [ ] Verify no red errors appear
- [ ] Note any yellow warnings (acceptable but should be reviewed)

---

## 11. Browser Compatibility ⏱️ 2 min

Test in multiple browsers:
- [ ] **Chrome/Edge** (Chromium)
- [ ] **Firefox**
- [ ] **Safari** (if on Mac)

For each browser:
- [ ] Verify login works
- [ ] Verify dashboard displays correctly
- [ ] Verify charts render
- [ ] Verify transactions list works
- [ ] Verify no console errors

---

## Test Results Summary

**Date:** _______________
**Tester:** _______________
**Environment:** _______________

### Critical Issues Found
1. ________________________________
2. ________________________________
3. ________________________________

### Minor Issues Found
1. ________________________________
2. ________________________________
3. ________________________________

### Notes
________________________________
________________________________
________________________________

---

## Quick Smoke Test (5 minutes)

For rapid testing, focus on these critical paths:
1. Login → Dashboard loads → Summary cards visible
2. Navigate to Transactions → List displays → Edit works
3. Create/assign tag → Filter by tag works
4. Mobile viewport → Responsive layout → Touch targets adequate
5. Service worker registered → Offline indicator works

If all pass, application is ready for deployment. If any fail, investigate before proceeding.
