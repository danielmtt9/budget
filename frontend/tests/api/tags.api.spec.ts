import { test, expect, APIResponse } from '@playwright/test';
import { createUser } from '../support/factories/user.factory';

test.describe('API Tag Management', () => {
  test.use({ baseURL: 'http://localhost:8002' });
  let user: { email: string, password: string };
  let createdTagId: number;

  test.beforeEach(async ({ request }) => {
    // Ensure a user exists for each test context
    user = await createUser();
    // Login to set session cookie in the request context
    await request.get(`/dev/login?email=${user.email}`);
  });

  test('[P0] should create a tag', async ({ request }) => {
    const tagName = `TestTag_${Date.now()}`;
    const response: APIResponse = await request.post('/tags/', {
      data: { name: tagName, color: '#FF0000' },
    });
    expect(response.status()).toBe(201);
    const tag = await response.json();
    expect(tag.name).toBe(tagName);
    expect(tag.color).toBe('#FF0000');
    expect(tag.id).toBeDefined();
    createdTagId = tag.id; // Store for later tests
  });

  test('[P0] should get all tags', async ({ request }) => {
    // Create a tag first
    const tagName = `TagForList_${Date.now()}`;
    await request.post('/tags/', { data: { name: tagName } });

    const response = await request.get('/tags/');
    expect(response.status()).toBe(200);
    const tags = await response.json();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
    const myTag = tags.find((t: any) => t.name === tagName);
    expect(myTag).toBeDefined();
  });

  test('[P1] should get a specific tag by ID', async ({ request }) => {
    const tagName = `SpecificTag_${Date.now()}`;
    const createResponse = await request.post('/tags/', {
      data: { name: tagName },
    });
    const { id } = await createResponse.json();

    const getResponse = await request.get(`/tags/${id}`);
    expect(getResponse.status()).toBe(200);
    const tag = await getResponse.json();
    expect(tag.id).toBe(id);
    expect(tag.name).toBe(tagName);
  });

  test('[P1] should update a tag', async ({ request }) => {
    const tagName = `UpdateTag_${Date.now()}`;
    const createResponse = await request.post('/tags/', {
      data: { name: tagName },
    });
    const { id } = await createResponse.json();

    const updatedName = `UpdatedName_${Date.now()}`;
    const updatedColor = '#00FF00';
    const updateResponse = await request.put(`/tags/${id}`, {
      data: { name: updatedName, color: updatedColor },
    });
    expect(updateResponse.status()).toBe(200);
    const tag = await updateResponse.json();
    expect(tag.id).toBe(id);
    expect(tag.name).toBe(updatedName);
    expect(tag.color).toBe(updatedColor);
  });

  test('[P1] should delete a tag', async ({ request }) => {
    const tagName = `DeleteTag_${Date.now()}`;
    const createResponse = await request.post('/tags/', {
      data: { name: tagName },
    });
    const { id } = await createResponse.json();

    const deleteResponse = await request.delete(`/tags/${id}`);
    expect(deleteResponse.status()).toBe(204);

    const getResponse = await request.get(`/tags/${id}`);
    expect(getResponse.status()).toBe(404); // Should no longer exist
  });

  test('[P0] should update transaction with tags', async ({ request }) => {
    // Create an account first
    const accountResponse = await request.post('/accounts/', {
      data: { name: 'Test Account', type: 'checking' }
    });
    expect(accountResponse.status()).toBe(201);
    const account = await accountResponse.json();
    const accountId = account.id;

    // Create a transaction first
    const transactionResponse = await request.post('/transactions/', {
      data: {
        amount: 100,
        description: 'Test Transaction',
        date: new Date().toISOString(),
        account_id: accountId
      }
    });
    expect(transactionResponse.status()).toBe(201);
    const transaction = await transactionResponse.json();
    const transactionId = transaction.id;

    // Create tags
    const tag1Name = `TxTag1_${Date.now()}`;
    const tag2Name = `TxTag2_${Date.now()}`;
    const tag1Response = await request.post('/tags/', { data: { name: tag1Name } });
    const tag2Response = await request.post('/tags/', { data: { name: tag2Name } });
    const tag1 = await tag1Response.json();
    const tag2 = await tag2Response.json();

    // Update transaction with tags
    const updateResponse = await request.patch(`/transactions/${transactionId}`, {
      data: { tag_ids: [tag1.id, tag2.id] }
    });
    expect(updateResponse.status()).toBe(200);
    const updatedTransaction = await updateResponse.json();
    expect(updatedTransaction.tags.length).toBe(2);
    expect(updatedTransaction.tags.some((t: any) => t.id === tag1.id)).toBe(true);
    expect(updatedTransaction.tags.some((t: any) => t.id === tag2.id)).toBe(true);
  });
});
