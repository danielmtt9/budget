# Playwright Test Setup Instructions

## Current Status

✅ **Playwright is installed** (version 1.57.0)
✅ **Chromium browser works** - Tests can run with Chromium
⚠️  **WebKit requires system dependencies** - Needs sudo access to install

## Install System Dependencies

To run all browsers (Chromium, Firefox, WebKit), install system dependencies:

```bash
# Option 1: Using Playwright (recommended)
sudo npx playwright install-deps

# Option 2: Manual installation
sudo apt-get install -y \
    libwoff1 \
    libevent-2.1-7t64 \
    libgstreamer-plugins-bad1.0-0 \
    libwebpdemux2 \
    libavif16 \
    libharfbuzz-icu0 \
    libenchant-2-2 \
    libhyphen0 \
    libmanette-0.2-0
```

## Running Tests

### Run All Tests (All Browsers)
```bash
cd frontend
npm run test:comprehensive
```

### Run Tests on Specific Browser Only
```bash
# Chromium only (currently works)
npx playwright test tests/e2e/comprehensive.spec.ts --project=chromium

# Firefox only
npx playwright test tests/e2e/comprehensive.spec.ts --project=firefox

# WebKit only (requires system deps)
npx playwright test tests/e2e/comprehensive.spec.ts --project=webkit
```

### Run API Tests Only
```bash
cd frontend
npm run test:api
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

## Test Results Summary

### Without System Dependencies
- ✅ Chromium: Works
- ✅ Firefox: Works  
- ❌ WebKit: Fails (needs system deps)

### With System Dependencies
- ✅ All browsers should work

## Note

System dependencies are only needed for WebKit (Safari) support. 
Chromium and Firefox tests will work without them.

After installing system dependencies, all 96 E2E tests should run successfully.
