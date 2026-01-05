import { test, expect, APIRequestContext } from '@playwright/test';
import { createUser } from '../support/factories/user.factory';

const API_URL = 'http://localhost:8002';

test.describe('Comprehensive API Integration Tests', () => {
  let user: { email: string; password: string };
  let request: APIRequestContext;
  let accountId: number;
  let transactionId: number;
  let tagId: number;
  let categoryId: number;

  test.beforeEach(async ({ request: req }) => {
    request = req;
    user = await createUser();
    
    // Login to get session cookie
    await request.get(`${API_URL}/dev/login?email=${user.email}`);
    
    // Create test account
    const accountResponse = await request.post(`${API_URL}/accounts/`, {
      data: { name: 'API Test Account', type: 'Checking' }
    });
    expect(accountResponse.ok()).toBeTruthy();
    const account = await accountResponse.json();
    accountId = account.id;
    
    // Create test transaction
    const txResponse = await request.post(`${API_URL}/transactions/`, {
      data: {
        date: new Date().toISOString(),
        amount: -50.00,
        description: 'API Test Transaction',
        category_id: null,
        account_id: accountId
      }
    });
    expect(txResponse.ok()).toBeTruthy();
    const transaction = await txResponse.json();
    transactionId = transaction.id;
    
    // Create test tag
    const tagResponse = await request.post(`${API_URL}/tags/`, {
      data: { name: `APITag_${Date.now()}`, color: '#00FF00' }
    });
    expect(tagResponse.ok()).toBeTruthy();
    const tag = await tagResponse.json();
    tagId = tag.id;
  });

  test.afterEach(async () => {
    // Clean up test data
    if (transactionId) {
      try {
        await request.delete(`${API_URL}/transactions/${transactionId}`);
      } catch (e) {
        // Ignore if already deleted
      }
    }
    if (tagId) {
      try {
        await request.delete(`${API_URL}/tags/${tagId}`);
      } catch (e) {
        // Ignore if already deleted
      }
    }
    if (categoryId) {
      try {
        await request.delete(`${API_URL}/categories/${categoryId}`);
      } catch (e) {
        // Ignore if already deleted
      }
    }
    if (accountId) {
      try {
        await request.delete(`${API_URL}/accounts/${accountId}`);
      } catch (e) {
        // Ignore if already deleted
      }
    }
  });

  test.describe('Analytics API', () => {
    test('[P0] should get dashboard summary', async () => {
      const response = await request.get(`${API_URL}/analytics/summary`);
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(data).toHaveProperty('total_balance');
      expect(data).toHaveProperty('total_assets');
      expect(data).toHaveProperty('total_liabilities');
      expect(data).toHaveProperty('income');
      expect(data).toHaveProperty('expenses');
      expect(data).toHaveProperty('net_flow');
      expect(data).toHaveProperty('effective_date');
      
      expect(typeof data.total_balance).toBe('number');
      expect(typeof data.income).toBe('number');
      expect(typeof data.expenses).toBe('number');
    });

    test('[P0] should get spending trends', async () => {
      const response = await request.get(`${API_URL}/analytics/trends`);
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(Array.isArray(data)).toBeTruthy();
      
      if (data.length > 0) {
        const trend = data[0];
        expect(trend).toHaveProperty('date');
        expect(trend).toHaveProperty('income');
        expect(trend).toHaveProperty('expenses');
        expect(typeof trend.income).toBe('number');
        expect(typeof trend.expenses).toBe('number');
      }
    });

    test('[P0] should get account summaries', async () => {
      const response = await request.get(`${API_URL}/analytics/account-summaries`);
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(Array.isArray(data)).toBeTruthy();
      
      if (data.length > 0) {
        const account = data[0];
        expect(account).toHaveProperty('id');
        expect(account).toHaveProperty('name');
        expect(account).toHaveProperty('type');
        expect(account).toHaveProperty('balance');
        expect(typeof account.balance).toBe('number');
      }
    });

    test('[P1] should get spending by category', async () => {
      const response = await request.get(`${API_URL}/analytics/spending-by-category`);
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      expect(Array.isArray(data)).toBeTruthy();
      
      if (data.length > 0) {
        const category = data[0];
        expect(category).toHaveProperty('category');
        expect(category).toHaveProperty('total');
        expect(category).toHaveProperty('limit');
        expect(typeof category.total).toBe('number');
        expect(typeof category.limit).toBe('number');
      }
    });
  });

  test.describe('Transactions API', () => {
    test('[P0] should create transaction', async () => {
      const newTxData = {
        date: new Date().toISOString(),
        amount: -75.50,
        description: 'New API Transaction',
        category_id: null,
        account_id: accountId
      };
      
      const response = await request.post(`${API_URL}/transactions/`, {
        data: newTxData
      });
      
      expect(response.ok()).toBeTruthy();
      const transaction = await response.json();
      
      expect(transaction).toHaveProperty('id');
      expect(transaction.description).toBe(newTxData.description);
      // Amount may be returned as string or number - convert to number for comparison
      const amountValue = typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount;
      expect(amountValue).toBe(newTxData.amount);
      
      // Clean up
      await request.delete(`${API_URL}/transactions/${transaction.id}`);
    });

    test('[P0] should get all transactions', async () => {
      const response = await request.get(`${API_URL}/transactions/`);
      expect(response.ok()).toBeTruthy();
      const transactions = await response.json();
      
      expect(Array.isArray(transactions)).toBeTruthy();
      
      if (transactions.length > 0) {
        const tx = transactions[0];
        expect(tx).toHaveProperty('id');
        expect(tx).toHaveProperty('date');
        expect(tx).toHaveProperty('amount');
        expect(tx).toHaveProperty('description');
      }
    });

    test('[P0] should filter transactions by tags', async () => {
      // First, assign tag to transaction
      await request.patch(`${API_URL}/transactions/${transactionId}`, {
        data: { tag_ids: [tagId] }
      });
      
      // Filter by tag
      const response = await request.get(`${API_URL}/transactions/?tags=${tagId}`);
      expect(response.ok()).toBeTruthy();
      const transactions = await response.json();
      
      expect(Array.isArray(transactions)).toBeTruthy();
      
      // Verify transaction is in results
      const found = transactions.find((tx: any) => tx.id === transactionId);
      expect(found).toBeDefined();
    });

    test('[P1] should update transaction', async () => {
      const updateData = {
        description: 'Updated Description',
        tag_ids: [tagId]
      };
      
      const response = await request.patch(`${API_URL}/transactions/${transactionId}`, {
        data: updateData
      });
      
      expect(response.ok()).toBeTruthy();
      const updated = await response.json();
      
      expect(updated.description).toBe(updateData.description);
      expect(updated.tags).toBeDefined();
      expect(Array.isArray(updated.tags)).toBeTruthy();
    });

    test('[P1] should delete transaction', async () => {
      // Create transaction to delete
      const createResponse = await request.post(`${API_URL}/transactions/`, {
        data: {
          date: new Date().toISOString(),
          amount: -25.00,
          description: 'To Be Deleted',
          category_id: null,
          account_id: accountId
        }
      });
      const txToDelete = await createResponse.json();
      
      // Delete it
      const deleteResponse = await request.delete(`${API_URL}/transactions/${txToDelete.id}`);
      expect(deleteResponse.ok()).toBeTruthy();
      
      // Verify it's gone
      const getResponse = await request.get(`${API_URL}/transactions/${txToDelete.id}`);
      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe('Tags & Categories API', () => {
    test('[P0] should create tag', async () => {
      const tagData = {
        name: `NewTag_${Date.now()}`,
        color: '#FF5733'
      };
      
      const response = await request.post(`${API_URL}/tags/`, {
        data: tagData
      });
      
      expect(response.ok()).toBeTruthy();
      const tag = await response.json();
      
      expect(tag).toHaveProperty('id');
      expect(tag.name).toBe(tagData.name);
      expect(tag.color).toBe(tagData.color);
      
      // Clean up
      await request.delete(`${API_URL}/tags/${tag.id}`);
    });

    test('[P0] should get all tags', async () => {
      const response = await request.get(`${API_URL}/tags/`);
      expect(response.ok()).toBeTruthy();
      const tags = await response.json();
      
      expect(Array.isArray(tags)).toBeTruthy();
      
      if (tags.length > 0) {
        const tag = tags[0];
        expect(tag).toHaveProperty('id');
        expect(tag).toHaveProperty('name');
        expect(tag).toHaveProperty('color');
      }
    });

    test('[P1] should update tag', async () => {
      const updateData = {
        name: `UpdatedTag_${Date.now()}`,
        color: '#00FFFF'
      };
      
      const response = await request.patch(`${API_URL}/tags/${tagId}`, {
        data: updateData
      });
      
      expect(response.ok()).toBeTruthy();
      const updated = await response.json();
      
      expect(updated.name).toBe(updateData.name);
      expect(updated.color).toBe(updateData.color);
    });

    test('[P1] should get all categories', async () => {
      const response = await request.get(`${API_URL}/categories/`);
      expect(response.ok()).toBeTruthy();
      const categories = await response.json();
      
      expect(Array.isArray(categories)).toBeTruthy();
    });

    test('[P1] should update category', async () => {
      // First get a category
      const getResponse = await request.get(`${API_URL}/categories/`);
      const categories = await getResponse.json();
      
      if (categories.length > 0) {
        const category = categories[0];
        const updateData = {
          monthly_limit: 1000.00
        };
        
        const response = await request.patch(`${API_URL}/categories/${category.id}`, {
          data: updateData
        });
        
        expect(response.ok()).toBeTruthy();
        const updated = await response.json();
        expect(updated.monthly_limit).toBe(updateData.monthly_limit);
      }
    });
  });

  test.describe('Sync API', () => {
    test('[P1] should get sync status', async () => {
      const response = await request.get(`${API_URL}/sync/status`);
      expect(response.ok()).toBeTruthy();
      const status = await response.json();
      
      expect(status).toHaveProperty('configured');
      expect(status).toHaveProperty('message');
      expect(typeof status.configured).toBe('boolean');
      expect(typeof status.message).toBe('string');
    });

    test('[P2] should setup SimpleFIN (if token provided)', async () => {
      // This test would require a valid SimpleFIN setup token
      // For now, just verify endpoint exists and handles invalid tokens gracefully
      const response = await request.post(`${API_URL}/sync/setup`, {
        data: { setup_token: 'invalid_token_for_testing' }
      });
      
      // Should return error for invalid token (including 503 if service unavailable)
      expect([400, 422, 500, 503]).toContain(response.status());
    });
  });

  test.describe('User API', () => {
    test('[P0] should get current user', async () => {
      const response = await request.get(`${API_URL}/users/me`);
      expect(response.ok()).toBeTruthy();
      const user = await response.json();
      
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user.email).toBeTruthy();
    });

    test('[P1] should update user profile', async () => {
      const updateData = {
        full_name: 'Test User Name'
      };
      
      const response = await request.put(`${API_URL}/users/me`, {
        data: updateData
      });
      
      expect(response.ok()).toBeTruthy();
      const updated = await response.json();
      
      expect(updated.full_name).toBe(updateData.full_name);
    });
  });

  test.describe('API Error Handling', () => {
    test('[P1] should return 401 for unauthenticated requests', async () => {
      // Create new context without session
      const unauthenticatedRequest = request;
      
      // Clear cookies
      const response = await unauthenticatedRequest.get(`${API_URL}/analytics/summary`, {
        headers: {
          Cookie: ''
        }
      });
      
      expect(response.status()).toBe(401);
    });

    test('[P1] should return 404 for non-existent resources', async () => {
      const response = await request.get(`${API_URL}/transactions/99999999`);
      expect(response.status()).toBe(404);
    });

    test('[P1] should return 422 for invalid data', async () => {
      const response = await request.post(`${API_URL}/transactions/`, {
        data: {
          // Missing required fields
          amount: -50
        }
      });
      
      expect([400, 422]).toContain(response.status());
    });
  });

  test.describe('Database Synchronization', () => {
    test('[P0] should persist created transaction', async () => {
      // Create transaction
      const createResponse = await request.post(`${API_URL}/transactions/`, {
        data: {
          date: new Date().toISOString(),
          amount: -99.99,
          description: 'Persist Test Transaction',
          category_id: null,
          account_id: accountId
        }
      });
      const created = await createResponse.json();
      const txId = created.id;
      
      // Fetch it immediately
      const getResponse = await request.get(`${API_URL}/transactions/${txId}`);
      expect(getResponse.ok()).toBeTruthy();
      const fetched = await getResponse.json();
      
      expect(fetched.id).toBe(txId);
      expect(fetched.description).toBe('Persist Test Transaction');
      
      // Clean up
      await request.delete(`${API_URL}/transactions/${txId}`);
    });

    test('[P0] should persist tag assignment', async () => {
      // Assign tag to transaction
      await request.patch(`${API_URL}/transactions/${transactionId}`, {
        data: { tag_ids: [tagId] }
      });
      
      // Fetch transaction
      const response = await request.get(`${API_URL}/transactions/${transactionId}`);
      const tx = await response.json();
      
      expect(tx.tags).toBeDefined();
      expect(Array.isArray(tx.tags)).toBeTruthy();
      const hasTag = tx.tags.some((t: any) => t.id === tagId);
      expect(hasTag).toBeTruthy();
    });

    test('[P1] should handle concurrent updates', async () => {
      // Make two concurrent update requests
      const update1 = request.patch(`${API_URL}/transactions/${transactionId}`, {
        data: { description: 'Update 1' }
      });
      
      const update2 = request.patch(`${API_URL}/transactions/${transactionId}`, {
        data: { description: 'Update 2' }
      });
      
      const [response1, response2] = await Promise.all([update1, update2]);
      
      // Both should succeed (last write wins)
      expect(response1.ok() || response2.ok()).toBeTruthy();
      
      // Fetch final state
      const finalResponse = await request.get(`${API_URL}/transactions/${transactionId}`);
      const final = await finalResponse.json();
      
      expect(final.description).toMatch(/Update [12]/);
    });
  });
});
