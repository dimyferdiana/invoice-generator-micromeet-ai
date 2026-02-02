#!/usr/bin/env node

/**
 * CLI for Invoice Generator
 */

import { InvoiceGenerator } from './invoice-generator.js';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Invoice Generator CLI

Usage:
  invoice-gen <type> [options]

Types:
  invoice     Generate an invoice
  po          Generate a purchase order
  receipt     Generate a receipt

Options:
  --help, -h          Show this help message
  --output, -o        Output file path (default: output to console)
  --config, -c        Config file path (JSON format)
  --format, -f        Output format: text or json (default: text)

Examples:
  invoice-gen invoice --config invoice-data.json --output invoice.txt
  invoice-gen receipt --format json --output receipt.json
  invoice-gen po --config po-data.json

Config File Format (JSON):
{
  "companyName": "Your Company",
  "companyAddress": "123 Main St",
  "companyPhone": "555-1234",
  "companyEmail": "info@company.com",
  "clientName": "Client Name",
  "clientAddress": "456 Client St",
  "clientEmail": "client@example.com",
  "items": [
    {
      "description": "Product/Service",
      "quantity": 1,
      "unitPrice": 100.00
    }
  ],
  "tax": 10,
  "notes": "Thank you for your business"
}
`);
}

function generateDocument() {
  const type = args[0];
  
  if (!type || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  // Parse arguments
  let configPath = null;
  let outputPath = null;
  let format = 'text';

  for (let i = 1; i < args.length; i++) {
    if ((args[i] === '--config' || args[i] === '-c') && i + 1 < args.length) {
      configPath = args[i + 1];
      i++;
    } else if ((args[i] === '--output' || args[i] === '-o') && i + 1 < args.length) {
      outputPath = args[i + 1];
      i++;
    } else if ((args[i] === '--format' || args[i] === '-f') && i + 1 < args.length) {
      format = args[i + 1];
      i++;
    }
  }

  // Load config
  let config = {};
  if (configPath) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      config = JSON.parse(configContent);
    } catch (error) {
      console.error(`Error reading config file: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Use sample data if no config provided
    config = {
      companyName: 'Sample Company Inc.',
      companyAddress: '123 Business St, City, State 12345',
      companyPhone: '555-0123',
      companyEmail: 'info@samplecompany.com',
      clientName: 'Sample Client',
      clientAddress: '456 Client Ave, City, State 67890',
      clientEmail: 'client@example.com',
      items: [
        {
          description: 'Consulting Services',
          quantity: 10,
          unitPrice: 150.00
        },
        {
          description: 'Software License',
          quantity: 1,
          unitPrice: 500.00
        }
      ],
      tax: 8.5,
      notes: 'Thank you for your business!'
    };
  }

  // Create generator
  const generator = new InvoiceGenerator({
    companyName: config.companyName,
    companyAddress: config.companyAddress,
    companyPhone: config.companyPhone,
    companyEmail: config.companyEmail
  });

  // Generate document
  let document;
  try {
    switch (type.toLowerCase()) {
      case 'invoice':
        document = generator.generateInvoice(config);
        break;
      case 'po':
      case 'purchase-order':
        config.vendorName = config.vendorName || config.clientName;
        config.vendorAddress = config.vendorAddress || config.clientAddress;
        config.vendorEmail = config.vendorEmail || config.clientEmail;
        document = generator.generatePurchaseOrder(config);
        break;
      case 'receipt':
        config.customerName = config.customerName || config.clientName;
        config.customerEmail = config.customerEmail || config.clientEmail;
        document = generator.generateReceipt(config);
        break;
      default:
        console.error(`Unknown document type: ${type}`);
        console.error('Valid types: invoice, po, receipt');
        process.exit(1);
    }
  } catch (error) {
    console.error(`Error generating document: ${error.message}`);
    process.exit(1);
  }

  // Format output
  let output;
  if (format === 'json') {
    output = JSON.stringify(document, null, 2);
  } else {
    output = generator.formatAsText(document);
  }

  // Write output
  if (outputPath) {
    try {
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(outputPath, output, 'utf-8');
      console.log(`Document generated successfully: ${outputPath}`);
    } catch (error) {
      console.error(`Error writing output file: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.log(output);
  }
}

// Run CLI
generateDocument();
