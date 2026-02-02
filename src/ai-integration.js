/**
 * AI Integration Module for Invoice Generator
 * Provides AI-powered features for generating and processing invoices
 */

export class AIIntegration {
  constructor(options = {}) {
    this.sessionId = options.sessionId || null;
    this.apiKey = options.apiKey || process.env.CLAUDE_API_KEY;
    this.model = options.model || 'claude-3-5-sonnet-20241022';
  }

  /**
   * Initialize a teleport session
   * @param {string} sessionId - The teleport session ID
   */
  initTeleportSession(sessionId) {
    this.sessionId = sessionId;
    console.log(`Initialized teleport session: ${sessionId}`);
  }

  /**
   * Parse natural language into invoice data
   * @param {string} prompt - Natural language description of invoice
   * @returns {Object} Parsed invoice data structure
   */
  async parseInvoiceFromPrompt(prompt) {
    // This is a mock implementation that demonstrates the structure
    // In a real implementation, this would call the Claude API
    
    console.log('AI: Parsing invoice from prompt...');
    console.log(`Prompt: ${prompt}`);
    
    // For now, return a structured response based on common patterns
    // A real implementation would use Claude API to parse the natural language
    return {
      companyName: 'AI Generated Company',
      clientName: 'Client from prompt',
      items: [
        {
          description: 'Service from AI parsing',
          quantity: 1,
          unitPrice: 100.00
        }
      ],
      tax: 10,
      notes: 'Generated via AI teleport session'
    };
  }

  /**
   * Get AI suggestions for invoice improvements
   * @param {Object} invoice - Invoice object
   * @returns {Array} Suggestions for improvement
   */
  async getInvoiceSuggestions(invoice) {
    console.log('AI: Analyzing invoice for suggestions...');
    
    const suggestions = [];
    
    // Basic validation suggestions
    if (!invoice.notes || invoice.notes.trim() === '') {
      suggestions.push({
        type: 'missing_field',
        field: 'notes',
        suggestion: 'Consider adding a thank you note or payment instructions'
      });
    }
    
    if (invoice.items.length === 0) {
      suggestions.push({
        type: 'error',
        field: 'items',
        suggestion: 'Invoice has no items. Add at least one item.'
      });
    }
    
    if (invoice.tax === 0) {
      suggestions.push({
        type: 'warning',
        field: 'tax',
        suggestion: 'Tax rate is 0%. Verify if this is correct for your jurisdiction.'
      });
    }
    
    // Check for common missing information
    if (!invoice.client?.email && !invoice.customer?.email) {
      suggestions.push({
        type: 'missing_field',
        field: 'email',
        suggestion: 'Add client email for better communication'
      });
    }
    
    return suggestions;
  }

  /**
   * Format invoice description using AI
   * @param {Object} invoice - Invoice object
   * @returns {string} AI-generated description
   */
  async generateInvoiceDescription(invoice) {
    console.log('AI: Generating invoice description...');
    
    const itemCount = invoice.items.length;
    const itemDescription = itemCount === 1 
      ? '1 item' 
      : `${itemCount} items`;
    
    const total = invoice.total.toFixed(2);
    const clientName = invoice.client?.name || invoice.customer?.name || 'Customer';
    
    return `Invoice for ${clientName} with ${itemDescription} totaling $${total}`;
  }

  /**
   * Check if teleport session is active
   * @returns {boolean}
   */
  isTeleportSessionActive() {
    return this.sessionId !== null;
  }

  /**
   * Get session info
   * @returns {Object}
   */
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      model: this.model,
      active: this.isTeleportSessionActive()
    };
  }
}

export default AIIntegration;
