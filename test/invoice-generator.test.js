import { test } from 'node:test';
import assert from 'node:assert';
import { InvoiceGenerator } from '../src/invoice-generator.js';

test('InvoiceGenerator - Create instance with default options', () => {
  const generator = new InvoiceGenerator();
  assert.strictEqual(generator.companyName, 'Company Name');
  assert.strictEqual(generator.companyAddress, '');
});

test('InvoiceGenerator - Create instance with custom options', () => {
  const generator = new InvoiceGenerator({
    companyName: 'Test Company',
    companyAddress: '123 Test St',
    companyPhone: '555-0000',
    companyEmail: 'test@test.com'
  });
  assert.strictEqual(generator.companyName, 'Test Company');
  assert.strictEqual(generator.companyAddress, '123 Test St');
  assert.strictEqual(generator.companyPhone, '555-0000');
  assert.strictEqual(generator.companyEmail, 'test@test.com');
});

test('InvoiceGenerator - Generate invoice with items', () => {
  const generator = new InvoiceGenerator({ companyName: 'Test Co' });
  const invoice = generator.generateInvoice({
    clientName: 'Client A',
    items: [
      { description: 'Item 1', quantity: 2, unitPrice: 50.00 },
      { description: 'Item 2', quantity: 1, unitPrice: 100.00 }
    ],
    tax: 10
  });

  assert.strictEqual(invoice.type, 'invoice');
  assert.strictEqual(invoice.client.name, 'Client A');
  assert.strictEqual(invoice.items.length, 2);
  assert.strictEqual(invoice.subtotal, 200.00);
  assert.strictEqual(invoice.total, 220.00); // 200 + 10% tax
});

test('InvoiceGenerator - Generate invoice with no tax', () => {
  const generator = new InvoiceGenerator();
  const invoice = generator.generateInvoice({
    clientName: 'Client B',
    items: [
      { description: 'Service', quantity: 5, unitPrice: 20.00 }
    ]
  });

  assert.strictEqual(invoice.subtotal, 100.00);
  assert.strictEqual(invoice.total, 100.00);
});

test('InvoiceGenerator - Generate invoice number', () => {
  const generator = new InvoiceGenerator();
  const invoiceNumber = generator.generateInvoiceNumber();
  assert.match(invoiceNumber, /^INV-\d{6}-\d{4}$/);
});

test('InvoiceGenerator - Generate purchase order', () => {
  const generator = new InvoiceGenerator({ companyName: 'Test Co' });
  const po = generator.generatePurchaseOrder({
    vendorName: 'Vendor A',
    items: [
      { description: 'Supplies', quantity: 10, unitPrice: 15.00 }
    ],
    tax: 5
  });

  assert.strictEqual(po.type, 'purchase_order');
  assert.strictEqual(po.vendor.name, 'Vendor A');
  assert.strictEqual(po.subtotal, 150.00);
  assert.strictEqual(po.total, 157.50); // 150 + 5% tax
  assert.ok(po.poNumber);
});

test('InvoiceGenerator - Generate PO number', () => {
  const generator = new InvoiceGenerator();
  const poNumber = generator.generatePONumber();
  assert.match(poNumber, /^PO-\d{6}-\d{4}$/);
});

test('InvoiceGenerator - Generate receipt', () => {
  const generator = new InvoiceGenerator({ companyName: 'Store' });
  const receipt = generator.generateReceipt({
    customerName: 'Customer A',
    items: [
      { description: 'Product A', quantity: 2, unitPrice: 25.00 },
      { description: 'Product B', quantity: 1, unitPrice: 50.00 }
    ],
    tax: 7.5,
    paymentMethod: 'Credit Card'
  });

  assert.strictEqual(receipt.type, 'receipt');
  assert.strictEqual(receipt.customer.name, 'Customer A');
  assert.strictEqual(receipt.subtotal, 100.00);
  assert.strictEqual(receipt.total, 107.50); // 100 + 7.5% tax
  assert.strictEqual(receipt.paymentMethod, 'Credit Card');
});

test('InvoiceGenerator - Generate receipt number', () => {
  const generator = new InvoiceGenerator();
  const receiptNumber = generator.generateReceiptNumber();
  assert.match(receiptNumber, /^RCP-\d{8}-\d{4}$/);
});

test('InvoiceGenerator - Format invoice as text', () => {
  const generator = new InvoiceGenerator({ companyName: 'Test Co' });
  const invoice = generator.generateInvoice({
    clientName: 'Client',
    items: [
      { description: 'Service', quantity: 1, unitPrice: 100.00 }
    ]
  });

  const text = generator.formatAsText(invoice);
  assert.ok(text.includes('INVOICE'));
  assert.ok(text.includes('Test Co'));
  assert.ok(text.includes('Client'));
  assert.ok(text.includes('Service'));
  assert.ok(text.includes('$100.00'));
});

test('InvoiceGenerator - Calculate due date', () => {
  const generator = new InvoiceGenerator();
  const dueDate = generator.calculateDueDate(30);
  const expectedDate = new Date();
  expectedDate.setDate(expectedDate.getDate() + 30);
  const expectedDateStr = expectedDate.toISOString().split('T')[0];
  assert.strictEqual(dueDate, expectedDateStr);
});

test('InvoiceGenerator - Invoice includes auto-generated invoice number', () => {
  const generator = new InvoiceGenerator();
  const invoice = generator.generateInvoice({
    clientName: 'Client',
    items: [{ description: 'Item', quantity: 1, unitPrice: 50 }]
  });
  assert.ok(invoice.invoiceNumber);
  assert.match(invoice.invoiceNumber, /^INV-/);
});

test('InvoiceGenerator - Invoice uses provided invoice number', () => {
  const generator = new InvoiceGenerator();
  const invoice = generator.generateInvoice({
    invoiceNumber: 'CUSTOM-123',
    clientName: 'Client',
    items: [{ description: 'Item', quantity: 1, unitPrice: 50 }]
  });
  assert.strictEqual(invoice.invoiceNumber, 'CUSTOM-123');
});
