import { test } from 'node:test';
import assert from 'node:assert';
import { AIIntegration } from '../src/ai-integration.js';
import { InvoiceGenerator } from '../src/invoice-generator.js';

test('AIIntegration - Create instance with default options', () => {
  const ai = new AIIntegration();
  assert.strictEqual(ai.sessionId, null);
  assert.strictEqual(ai.model, 'claude-3-5-sonnet-20241022');
});

test('AIIntegration - Create instance with session ID', () => {
  const ai = new AIIntegration({ 
    sessionId: 'test_session_123' 
  });
  assert.strictEqual(ai.sessionId, 'test_session_123');
});

test('AIIntegration - Initialize teleport session', () => {
  const ai = new AIIntegration();
  ai.initTeleportSession('session_01GRRgxs6yUhxrMTTo2fhmfi');
  assert.strictEqual(ai.sessionId, 'session_01GRRgxs6yUhxrMTTo2fhmfi');
});

test('AIIntegration - Check teleport session status', () => {
  const ai = new AIIntegration();
  assert.strictEqual(ai.isTeleportSessionActive(), false);
  
  ai.initTeleportSession('test_session');
  assert.strictEqual(ai.isTeleportSessionActive(), true);
});

test('AIIntegration - Get session info', () => {
  const ai = new AIIntegration({ 
    sessionId: 'test_session',
    model: 'claude-3'
  });
  
  const info = ai.getSessionInfo();
  assert.strictEqual(info.sessionId, 'test_session');
  assert.strictEqual(info.model, 'claude-3');
  assert.strictEqual(info.active, true);
});

test('AIIntegration - Generate invoice description', async () => {
  const ai = new AIIntegration();
  const generator = new InvoiceGenerator();
  
  const invoice = generator.generateInvoice({
    clientName: 'Test Client',
    items: [
      { description: 'Item 1', quantity: 2, unitPrice: 50 }
    ]
  });
  
  const description = await ai.generateInvoiceDescription(invoice);
  assert.ok(description.includes('Test Client'));
  assert.ok(description.includes('$100.00'));
});

test('AIIntegration - Get suggestions for invoice with no notes', async () => {
  const ai = new AIIntegration();
  const generator = new InvoiceGenerator();
  
  const invoice = generator.generateInvoice({
    clientName: 'Client',
    items: [
      { description: 'Service', quantity: 1, unitPrice: 100 }
    ],
    notes: ''
  });
  
  const suggestions = await ai.getInvoiceSuggestions(invoice);
  const notesSuggestion = suggestions.find(s => s.field === 'notes');
  assert.ok(notesSuggestion);
  assert.ok(notesSuggestion.suggestion.includes('thank you'));
});

test('AIIntegration - Get suggestions for invoice with no items', async () => {
  const ai = new AIIntegration();
  const generator = new InvoiceGenerator();
  
  const invoice = generator.generateInvoice({
    clientName: 'Client',
    items: []
  });
  
  const suggestions = await ai.getInvoiceSuggestions(invoice);
  const itemsSuggestion = suggestions.find(s => s.field === 'items');
  assert.ok(itemsSuggestion);
  assert.strictEqual(itemsSuggestion.type, 'error');
});

test('AIIntegration - Get suggestions for invoice with no tax', async () => {
  const ai = new AIIntegration();
  const generator = new InvoiceGenerator();
  
  const invoice = generator.generateInvoice({
    clientName: 'Client',
    items: [
      { description: 'Service', quantity: 1, unitPrice: 100 }
    ],
    tax: 0,
    notes: 'Some notes'
  });
  
  const suggestions = await ai.getInvoiceSuggestions(invoice);
  const taxSuggestion = suggestions.find(s => s.field === 'tax');
  assert.ok(taxSuggestion);
  assert.strictEqual(taxSuggestion.type, 'warning');
});

test('AIIntegration - Parse invoice from prompt returns structure', async () => {
  const ai = new AIIntegration();
  const result = await ai.parseInvoiceFromPrompt('Create an invoice for consulting services');
  
  assert.ok(result.companyName);
  assert.ok(result.clientName);
  assert.ok(Array.isArray(result.items));
  assert.ok(result.items.length > 0);
});
