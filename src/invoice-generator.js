/**
 * Invoice Generator Module
 * Generates invoices, purchase orders, and receipts
 */

export class InvoiceGenerator {
  constructor(options = {}) {
    this.companyName = options.companyName || 'Company Name';
    this.companyAddress = options.companyAddress || '';
    this.companyPhone = options.companyPhone || '';
    this.companyEmail = options.companyEmail || '';
  }

  /**
   * Generate an invoice
   * @param {Object} invoiceData - Invoice data
   * @returns {Object} Generated invoice
   */
  generateInvoice(invoiceData) {
    const invoice = {
      type: 'invoice',
      invoiceNumber: invoiceData.invoiceNumber || this.generateInvoiceNumber(),
      date: invoiceData.date || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || this.calculateDueDate(30),
      company: {
        name: this.companyName,
        address: this.companyAddress,
        phone: this.companyPhone,
        email: this.companyEmail
      },
      client: {
        name: invoiceData.clientName || '',
        address: invoiceData.clientAddress || '',
        email: invoiceData.clientEmail || ''
      },
      items: invoiceData.items || [],
      subtotal: 0,
      tax: invoiceData.tax || 0,
      total: 0,
      notes: invoiceData.notes || '',
      paymentTerms: invoiceData.paymentTerms || 'Net 30'
    };

    // Calculate totals
    invoice.subtotal = invoice.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = invoice.subtotal * (invoice.tax / 100);
    invoice.total = invoice.subtotal + taxAmount;

    return invoice;
  }

  /**
   * Generate a purchase order
   * @param {Object} poData - Purchase order data
   * @returns {Object} Generated purchase order
   */
  generatePurchaseOrder(poData) {
    const purchaseOrder = {
      type: 'purchase_order',
      poNumber: poData.poNumber || this.generatePONumber(),
      date: poData.date || new Date().toISOString().split('T')[0],
      deliveryDate: poData.deliveryDate || this.calculateDueDate(14),
      company: {
        name: this.companyName,
        address: this.companyAddress,
        phone: this.companyPhone,
        email: this.companyEmail
      },
      vendor: {
        name: poData.vendorName || '',
        address: poData.vendorAddress || '',
        email: poData.vendorEmail || ''
      },
      items: poData.items || [],
      subtotal: 0,
      tax: poData.tax || 0,
      total: 0,
      notes: poData.notes || '',
      shippingAddress: poData.shippingAddress || this.companyAddress
    };

    // Calculate totals
    purchaseOrder.subtotal = purchaseOrder.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = purchaseOrder.subtotal * (purchaseOrder.tax / 100);
    purchaseOrder.total = purchaseOrder.subtotal + taxAmount;

    return purchaseOrder;
  }

  /**
   * Generate a receipt
   * @param {Object} receiptData - Receipt data
   * @returns {Object} Generated receipt
   */
  generateReceipt(receiptData) {
    const receipt = {
      type: 'receipt',
      receiptNumber: receiptData.receiptNumber || this.generateReceiptNumber(),
      date: receiptData.date || new Date().toISOString().split('T')[0],
      company: {
        name: this.companyName,
        address: this.companyAddress,
        phone: this.companyPhone,
        email: this.companyEmail
      },
      customer: {
        name: receiptData.customerName || '',
        email: receiptData.customerEmail || ''
      },
      items: receiptData.items || [],
      subtotal: 0,
      tax: receiptData.tax || 0,
      total: 0,
      paymentMethod: receiptData.paymentMethod || 'Cash',
      notes: receiptData.notes || ''
    };

    // Calculate totals
    receipt.subtotal = receipt.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const taxAmount = receipt.subtotal * (receipt.tax / 100);
    receipt.total = receipt.subtotal + taxAmount;

    return receipt;
  }

  /**
   * Format invoice as text
   * @param {Object} invoice - Invoice object
   * @returns {string} Formatted invoice text
   */
  formatAsText(document) {
    const lines = [];
    
    lines.push('='.repeat(60));
    lines.push(`${document.type.toUpperCase().replace('_', ' ')}`);
    lines.push('='.repeat(60));
    lines.push('');
    
    // Company info
    lines.push(`${document.company.name}`);
    if (document.company.address) lines.push(document.company.address);
    if (document.company.phone) lines.push(`Phone: ${document.company.phone}`);
    if (document.company.email) lines.push(`Email: ${document.company.email}`);
    lines.push('');
    
    // Document number and date
    if (document.invoiceNumber) lines.push(`Invoice #: ${document.invoiceNumber}`);
    if (document.poNumber) lines.push(`PO #: ${document.poNumber}`);
    if (document.receiptNumber) lines.push(`Receipt #: ${document.receiptNumber}`);
    lines.push(`Date: ${document.date}`);
    if (document.dueDate) lines.push(`Due Date: ${document.dueDate}`);
    if (document.deliveryDate) lines.push(`Delivery Date: ${document.deliveryDate}`);
    lines.push('');
    
    // Client/Vendor/Customer info
    if (document.client) {
      lines.push('Bill To:');
      lines.push(`  ${document.client.name}`);
      if (document.client.address) lines.push(`  ${document.client.address}`);
      if (document.client.email) lines.push(`  ${document.client.email}`);
    } else if (document.vendor) {
      lines.push('Vendor:');
      lines.push(`  ${document.vendor.name}`);
      if (document.vendor.address) lines.push(`  ${document.vendor.address}`);
      if (document.vendor.email) lines.push(`  ${document.vendor.email}`);
    } else if (document.customer) {
      lines.push('Customer:');
      lines.push(`  ${document.customer.name}`);
      if (document.customer.email) lines.push(`  ${document.customer.email}`);
    }
    lines.push('');
    
    // Items
    lines.push('-'.repeat(60));
    lines.push('Items:');
    lines.push('-'.repeat(60));
    document.items.forEach(item => {
      lines.push(`${item.description}`);
      lines.push(`  Qty: ${item.quantity} x $${item.unitPrice.toFixed(2)} = $${(item.quantity * item.unitPrice).toFixed(2)}`);
    });
    lines.push('-'.repeat(60));
    
    // Totals
    lines.push(`Subtotal: $${document.subtotal.toFixed(2)}`);
    if (document.tax > 0) {
      const taxAmount = document.subtotal * (document.tax / 100);
      lines.push(`Tax (${document.tax}%): $${taxAmount.toFixed(2)}`);
    }
    lines.push(`Total: $${document.total.toFixed(2)}`);
    lines.push('');
    
    // Additional info
    if (document.paymentMethod) {
      lines.push(`Payment Method: ${document.paymentMethod}`);
    }
    if (document.paymentTerms) {
      lines.push(`Payment Terms: ${document.paymentTerms}`);
    }
    if (document.notes) {
      lines.push('');
      lines.push('Notes:');
      lines.push(document.notes);
    }
    
    lines.push('');
    lines.push('='.repeat(60));
    
    return lines.join('\n');
  }

  /**
   * Generate invoice number
   * @returns {string} Invoice number
   */
  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }

  /**
   * Generate PO number
   * @returns {string} PO number
   */
  generatePONumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PO-${year}${month}-${random}`;
  }

  /**
   * Generate receipt number
   * @returns {string} Receipt number
   */
  generateReceiptNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RCP-${year}${month}${day}-${random}`;
  }

  /**
   * Calculate due date
   * @param {number} days - Number of days from today
   * @returns {string} Due date in YYYY-MM-DD format
   */
  calculateDueDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}

export default InvoiceGenerator;
