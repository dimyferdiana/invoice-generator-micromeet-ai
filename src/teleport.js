#!/usr/bin/env node

/**
 * AI Teleport Session CLI
 * Demonstrates AI integration with invoice generator
 */

import { InvoiceGenerator } from './invoice-generator.js';
import { AIIntegration } from './ai-integration.js';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
AI Teleport Session CLI

Usage:
  node src/teleport.js [session-id]

Examples:
  node src/teleport.js session_01GRRgxs6yUhxrMTTo2fhmfi
  node src/teleport.js --help

Description:
  This demonstrates the AI teleport session functionality for the invoice generator.
  A teleport session enables AI-powered features like:
  - Natural language invoice parsing
  - Intelligent suggestions
  - Automated invoice generation
  
`);
}

async function runTeleportSession() {
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const sessionId = args[0] || 'session_default';
  
  console.log('🚀 Invoice Generator - AI Teleport Session\n');
  console.log('='.repeat(60));
  
  // Initialize AI integration
  const ai = new AIIntegration({ sessionId });
  ai.initTeleportSession(sessionId);
  
  console.log('\n📊 Session Information:');
  const sessionInfo = ai.getSessionInfo();
  console.log(`  Session ID: ${sessionInfo.sessionId}`);
  console.log(`  Model: ${sessionInfo.model}`);
  console.log(`  Status: ${sessionInfo.active ? '✅ Active' : '❌ Inactive'}`);
  
  console.log('\n' + '='.repeat(60));
  console.log('🤖 Demonstrating AI Features\n');
  
  // Create invoice generator
  const generator = new InvoiceGenerator({
    companyName: 'Micromeet AI Solutions',
    companyAddress: '100 AI Boulevard, Tech City, TC 12345',
    companyPhone: '555-AI-GEN',
    companyEmail: 'invoices@micromeet-ai.com'
  });
  
  // Generate a sample invoice
  console.log('📝 Generating sample invoice...\n');
  const invoice = generator.generateInvoice({
    clientName: 'Demo Client Corp',
    clientEmail: 'billing@democlient.com',
    items: [
      {
        description: 'AI-Powered Invoice Generation Service',
        quantity: 1,
        unitPrice: 299.00
      },
      {
        description: 'Claude Integration Package',
        quantity: 1,
        unitPrice: 499.00
      }
    ],
    tax: 8.5,
    notes: ''
  });
  
  console.log('✅ Invoice generated successfully\n');
  
  // Get AI suggestions
  console.log('🔍 Getting AI suggestions...\n');
  const suggestions = await ai.getInvoiceSuggestions(invoice);
  
  if (suggestions.length > 0) {
    console.log('💡 AI Suggestions:');
    suggestions.forEach((suggestion, index) => {
      const icon = suggestion.type === 'error' ? '❌' : 
                   suggestion.type === 'warning' ? '⚠️' : '💡';
      console.log(`  ${icon} [${suggestion.field}] ${suggestion.suggestion}`);
    });
  } else {
    console.log('✅ No suggestions - invoice looks good!');
  }
  
  // Generate description
  console.log('\n📄 Generating AI description...\n');
  const description = await ai.generateInvoiceDescription(invoice);
  console.log(`  "${description}"`);
  
  // Display the invoice
  console.log('\n' + '='.repeat(60));
  console.log('📋 Generated Invoice\n');
  console.log(generator.formatAsText(invoice));
  
  console.log('='.repeat(60));
  console.log('✨ Teleport session demonstration complete!');
  console.log('='.repeat(60));
}

// Run the teleport session
runTeleportSession().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
