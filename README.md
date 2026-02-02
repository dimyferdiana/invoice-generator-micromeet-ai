# Invoice Generator for Micromeet AI

A simple and flexible invoice, purchase order, and receipt generator with AI capabilities.

## Features

- Generate professional invoices
- Create purchase orders
- Generate receipts
- Automatic number generation
- Tax calculation
- Multiple output formats (text and JSON)
- CLI interface for easy use
- Extensible API for programmatic use
- **AI Integration** with Claude teleport sessions
- AI-powered invoice suggestions and validation
- Natural language invoice parsing (coming soon)

## Installation

```bash
npm install
```

## Usage

### Command Line Interface

Generate an invoice with sample data:

```bash
node src/cli.js invoice
```

Generate a receipt:

```bash
node src/cli.js receipt
```

Generate a purchase order:

```bash
node src/cli.js po
```

### With Custom Configuration

Create a configuration file (e.g., `my-invoice.json`):

```json
{
  "companyName": "Your Company",
  "companyAddress": "123 Main St, City, State 12345",
  "companyPhone": "555-1234",
  "companyEmail": "info@yourcompany.com",
  "clientName": "Client Name",
  "clientAddress": "456 Client St, City, State 67890",
  "clientEmail": "client@example.com",
  "items": [
    {
      "description": "Consulting Services",
      "quantity": 10,
      "unitPrice": 150.00
    },
    {
      "description": "Software License",
      "quantity": 1,
      "unitPrice": 500.00
    }
  ],
  "tax": 8.5,
  "notes": "Thank you for your business!"
}
```

Generate invoice with config:

```bash
node src/cli.js invoice --config my-invoice.json --output invoice.txt
```

Generate JSON output:

```bash
node src/cli.js invoice --config my-invoice.json --format json --output invoice.json
```

### Programmatic Usage

```javascript
import { InvoiceGenerator } from './src/invoice-generator.js';

// Create generator instance
const generator = new InvoiceGenerator({
  companyName: 'Your Company',
  companyAddress: '123 Main St',
  companyPhone: '555-1234',
  companyEmail: 'info@company.com'
});

// Generate invoice
const invoice = generator.generateInvoice({
  clientName: 'Client Name',
  clientEmail: 'client@example.com',
  items: [
    { description: 'Service', quantity: 1, unitPrice: 100.00 }
  ],
  tax: 10,
  notes: 'Thank you!'
});

// Format as text
const text = generator.formatAsText(invoice);
console.log(text);
```

### AI Teleport Session

Experience AI-powered invoice generation with Claude:

```bash
node src/teleport.js session_01GRRgxs6yUhxrMTTo2fhmfi
```

This will:
- Initialize an AI teleport session
- Generate a sample invoice
- Provide AI-powered suggestions
- Generate intelligent descriptions
- Demonstrate AI integration capabilities

### AI Features

The AI integration module provides:

```javascript
import { AIIntegration } from './src/ai-integration.js';

// Create AI integration
const ai = new AIIntegration({ 
  sessionId: 'your_session_id' 
});

// Get suggestions for an invoice
const suggestions = await ai.getInvoiceSuggestions(invoice);

// Generate AI description
const description = await ai.generateInvoiceDescription(invoice);
```

## API Reference

### InvoiceGenerator

#### Constructor

```javascript
new InvoiceGenerator(options)
```

Options:
- `companyName` - Your company name
- `companyAddress` - Your company address
- `companyPhone` - Your company phone
- `companyEmail` - Your company email

#### Methods

- `generateInvoice(data)` - Generate an invoice
- `generatePurchaseOrder(data)` - Generate a purchase order
- `generateReceipt(data)` - Generate a receipt
- `formatAsText(document)` - Format document as text
- `generateInvoiceNumber()` - Generate unique invoice number
- `generatePONumber()` - Generate unique PO number
- `generateReceiptNumber()` - Generate unique receipt number
- `calculateDueDate(days)` - Calculate due date

### AIIntegration

#### Constructor

```javascript
new AIIntegration(options)
```

Options:
- `sessionId` - Teleport session ID
- `apiKey` - Claude API key (optional)
- `model` - AI model to use (default: claude-3-5-sonnet-20241022)

#### Methods

- `initTeleportSession(sessionId)` - Initialize teleport session
- `parseInvoiceFromPrompt(prompt)` - Parse natural language to invoice data
- `getInvoiceSuggestions(invoice)` - Get AI suggestions for invoice
- `generateInvoiceDescription(invoice)` - Generate AI description
- `isTeleportSessionActive()` - Check if session is active
- `getSessionInfo()` - Get session information

## Testing

Run tests:

```bash
npm test
```

## License

MIT
