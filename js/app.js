/**
 * Micromeet Invoice Generator
 * Main Application JavaScript
 */

// ===================================
// Sample Data
// ===================================
const sampleData = {
    nurhaini: {
        type: 'po',
        number: 'PO-2026-001',
        date: new Date().toISOString().split('T')[0],
        recipient: {
            name: 'Nurhaini',
            address: '',
            phone: '',
            email: ''
        },
        payment: {
            method: 'bank-transfer',
            bankName: 'BCA',
            accountNumber: '7350044544',
            accountName: 'Nurhaini'
        },
        items: [
            { description: 'Layanan Konsultasi AI', qty: 1, price: 5000000 },
            { description: 'Implementasi Sistem', qty: 1, price: 10000000 }
        ],
        taxPercent: 11,
        notes: 'Terima kasih atas kerjasama yang baik.'
    },
    niluh: {
        type: 'po',
        number: 'PO-2026-002',
        date: new Date().toISOString().split('T')[0],
        recipient: {
            name: 'dr Niluh Suwasanti, Sp.PK',
            address: '',
            phone: '',
            email: ''
        },
        payment: {
            method: 'bank-transfer',
            bankName: '',
            accountNumber: '',
            accountName: ''
        },
        items: [
            { description: 'Layanan Konsultasi Medis AI', qty: 1, price: 7500000 },
            { description: 'Pelatihan Sistem', qty: 1, price: 5000000 }
        ],
        taxPercent: 11,
        notes: 'Mohon konfirmasi detail rekening bank untuk pembayaran.'
    }
};

// ===================================
// Company Information
// ===================================
const companyInfo = {
    name: 'Micromeet Technology (Singapore) Pte Ltd',
    shortName: 'Micromeet',
    website: 'https://web.micromeet.ai/home',
    address: 'Singapore',
    email: 'contact@micromeet.ai'
};

// ===================================
// Application State
// ===================================
let savedDocuments = JSON.parse(localStorage.getItem('micromeetDocuments')) || [];
let currentPreviewType = null;

// ===================================
// Initialization
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up navigation
    setupNavigation();

    // Set today's date for date inputs
    setDefaultDates();

    // Set up item table calculations
    setupItemCalculations();

    // Update dashboard stats
    updateDashboardStats();

    // Load saved documents
    loadSavedDocuments();

    // Set up document filters
    setupDocumentFilters();
}

// ===================================
// Navigation
// ===================================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// ===================================
// Date Setup
// ===================================
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    // Set default dates
    const dateInputs = {
        'po-date': today,
        'invoice-date': today,
        'invoice-due-date': dueDateStr,
        'receipt-date': today
    };

    for (const [id, value] of Object.entries(dateInputs)) {
        const input = document.getElementById(id);
        if (input) input.value = value;
    }
}

// ===================================
// Item Management
// ===================================
function setupItemCalculations() {
    ['po', 'invoice'].forEach(type => {
        const tbody = document.getElementById(`${type}-items-body`);
        if (tbody) {
            setupTableRowListeners(tbody, type);
        }

        const taxInput = document.getElementById(`${type}-tax-percent`);
        if (taxInput) {
            taxInput.addEventListener('input', () => calculateTotals(type));
        }
    });
}

function setupTableRowListeners(tbody, type) {
    tbody.addEventListener('input', function(e) {
        if (e.target.classList.contains('item-qty') || e.target.classList.contains('item-price')) {
            const row = e.target.closest('tr');
            updateRowTotal(row);
            calculateTotals(type);
        }
    });
}

function addItem(type) {
    const tbody = document.getElementById(`${type}-items-body`);
    const rowCount = tbody.rows.length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" class="item-desc" placeholder="Deskripsi item"></td>
        <td><input type="number" class="item-qty" value="1" min="1"></td>
        <td><input type="number" class="item-price" value="0" min="0"></td>
        <td class="item-total">0</td>
        <td><button type="button" class="btn-remove" onclick="removeItem(this, '${type}')">×</button></td>
    `;

    tbody.appendChild(newRow);
    renumberRows(tbody);
}

function removeItem(button, type) {
    const tbody = document.getElementById(`${type}-items-body`);
    if (tbody.rows.length > 1) {
        button.closest('tr').remove();
        renumberRows(tbody);
        calculateTotals(type);
    }
}

function renumberRows(tbody) {
    Array.from(tbody.rows).forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

function updateRowTotal(row) {
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const total = qty * price;
    row.querySelector('.item-total').textContent = formatCurrency(total);
}

function calculateTotals(type) {
    const tbody = document.getElementById(`${type}-items-body`);
    let subtotal = 0;

    Array.from(tbody.rows).forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        subtotal += qty * price;
    });

    const taxPercent = parseFloat(document.getElementById(`${type}-tax-percent`).value) || 0;
    const taxAmount = subtotal * (taxPercent / 100);
    const grandTotal = subtotal + taxAmount;

    document.getElementById(`${type}-subtotal`).textContent = formatCurrency(subtotal);
    document.getElementById(`${type}-tax-amount`).textContent = formatCurrency(taxAmount);
    document.getElementById(`${type}-grand-total`).textContent = formatCurrency(grandTotal);
}

// ===================================
// Form Management
// ===================================
function clearForm(type) {
    const form = document.getElementById(`${type}-form`);
    if (form) {
        form.reset();
        setDefaultDates();

        // Reset items table
        const tbody = document.getElementById(`${type}-items-body`);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td>1</td>
                    <td><input type="text" class="item-desc" placeholder="Deskripsi item"></td>
                    <td><input type="number" class="item-qty" value="1" min="1"></td>
                    <td><input type="number" class="item-price" value="0" min="0"></td>
                    <td class="item-total">0</td>
                    <td><button type="button" class="btn-remove" onclick="removeItem(this, '${type}')">×</button></td>
                </tr>
            `;
        }

        // Reset totals
        if (type !== 'receipt') {
            document.getElementById(`${type}-subtotal`).textContent = formatCurrency(0);
            document.getElementById(`${type}-tax-amount`).textContent = formatCurrency(0);
            document.getElementById(`${type}-grand-total`).textContent = formatCurrency(0);
        }
    }
}

function getFormData(type) {
    if (type === 'po') {
        return {
            type: 'po',
            number: document.getElementById('po-number').value,
            date: document.getElementById('po-date').value,
            recipient: {
                name: document.getElementById('po-recipient-name').value,
                address: document.getElementById('po-recipient-address').value,
                phone: document.getElementById('po-recipient-phone').value,
                email: document.getElementById('po-recipient-email').value
            },
            payment: {
                method: document.getElementById('po-payment-method').value,
                bankName: document.getElementById('po-bank-name').value,
                accountNumber: document.getElementById('po-account-number').value,
                accountName: document.getElementById('po-account-name').value
            },
            items: getItemsData('po'),
            taxPercent: parseFloat(document.getElementById('po-tax-percent').value) || 0,
            notes: document.getElementById('po-notes').value
        };
    } else if (type === 'invoice') {
        return {
            type: 'invoice',
            number: document.getElementById('invoice-number').value,
            date: document.getElementById('invoice-date').value,
            dueDate: document.getElementById('invoice-due-date').value,
            poRef: document.getElementById('invoice-po-ref').value,
            customer: {
                name: document.getElementById('invoice-customer-name').value,
                address: document.getElementById('invoice-customer-address').value,
                phone: document.getElementById('invoice-customer-phone').value,
                email: document.getElementById('invoice-customer-email').value
            },
            payment: {
                method: document.getElementById('invoice-payment-method').value,
                bankName: document.getElementById('invoice-bank-name').value,
                accountNumber: document.getElementById('invoice-account-number').value,
                accountName: document.getElementById('invoice-account-name').value
            },
            items: getItemsData('invoice'),
            taxPercent: parseFloat(document.getElementById('invoice-tax-percent').value) || 0,
            notes: document.getElementById('invoice-notes').value
        };
    } else if (type === 'receipt') {
        return {
            type: 'receipt',
            number: document.getElementById('receipt-number').value,
            date: document.getElementById('receipt-date').value,
            invoiceRef: document.getElementById('receipt-invoice-ref').value,
            poRef: document.getElementById('receipt-po-ref').value,
            payer: {
                name: document.getElementById('receipt-payer-name').value,
                address: document.getElementById('receipt-payer-address').value
            },
            payment: {
                method: document.getElementById('receipt-payment-method').value,
                bankName: document.getElementById('receipt-bank-name').value,
                accountNumber: document.getElementById('receipt-account-number').value,
                amount: parseFloat(document.getElementById('receipt-amount').value) || 0
            },
            description: document.getElementById('receipt-description').value,
            notes: document.getElementById('receipt-notes').value
        };
    }
}

function setFormData(type, data) {
    if (type === 'po') {
        document.getElementById('po-number').value = data.number || '';
        document.getElementById('po-date').value = data.date || '';
        document.getElementById('po-recipient-name').value = data.recipient?.name || '';
        document.getElementById('po-recipient-address').value = data.recipient?.address || '';
        document.getElementById('po-recipient-phone').value = data.recipient?.phone || '';
        document.getElementById('po-recipient-email').value = data.recipient?.email || '';
        document.getElementById('po-payment-method').value = data.payment?.method || 'bank-transfer';
        document.getElementById('po-bank-name').value = data.payment?.bankName || '';
        document.getElementById('po-account-number').value = data.payment?.accountNumber || '';
        document.getElementById('po-account-name').value = data.payment?.accountName || '';
        document.getElementById('po-tax-percent').value = data.taxPercent || 0;
        document.getElementById('po-notes').value = data.notes || '';

        setItemsData('po', data.items || []);
        calculateTotals('po');
    } else if (type === 'invoice') {
        document.getElementById('invoice-number').value = data.number || '';
        document.getElementById('invoice-date').value = data.date || '';
        document.getElementById('invoice-due-date').value = data.dueDate || '';
        document.getElementById('invoice-po-ref').value = data.poRef || '';
        document.getElementById('invoice-customer-name').value = data.customer?.name || '';
        document.getElementById('invoice-customer-address').value = data.customer?.address || '';
        document.getElementById('invoice-customer-phone').value = data.customer?.phone || '';
        document.getElementById('invoice-customer-email').value = data.customer?.email || '';
        document.getElementById('invoice-payment-method').value = data.payment?.method || 'bank-transfer';
        document.getElementById('invoice-bank-name').value = data.payment?.bankName || '';
        document.getElementById('invoice-account-number').value = data.payment?.accountNumber || '';
        document.getElementById('invoice-account-name').value = data.payment?.accountName || '';
        document.getElementById('invoice-tax-percent').value = data.taxPercent || 0;
        document.getElementById('invoice-notes').value = data.notes || '';

        setItemsData('invoice', data.items || []);
        calculateTotals('invoice');
    } else if (type === 'receipt') {
        document.getElementById('receipt-number').value = data.number || '';
        document.getElementById('receipt-date').value = data.date || '';
        document.getElementById('receipt-invoice-ref').value = data.invoiceRef || '';
        document.getElementById('receipt-po-ref').value = data.poRef || '';
        document.getElementById('receipt-payer-name').value = data.payer?.name || '';
        document.getElementById('receipt-payer-address').value = data.payer?.address || '';
        document.getElementById('receipt-payment-method').value = data.payment?.method || 'bank-transfer';
        document.getElementById('receipt-bank-name').value = data.payment?.bankName || '';
        document.getElementById('receipt-account-number').value = data.payment?.accountNumber || '';
        document.getElementById('receipt-amount').value = data.payment?.amount || 0;
        document.getElementById('receipt-description').value = data.description || '';
        document.getElementById('receipt-notes').value = data.notes || '';
    }
}

function getItemsData(type) {
    const tbody = document.getElementById(`${type}-items-body`);
    const items = [];

    Array.from(tbody.rows).forEach(row => {
        const desc = row.querySelector('.item-desc').value;
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;

        if (desc || qty > 0 || price > 0) {
            items.push({ description: desc, qty, price });
        }
    });

    return items;
}

function setItemsData(type, items) {
    const tbody = document.getElementById(`${type}-items-body`);
    tbody.innerHTML = '';

    if (items.length === 0) {
        items = [{ description: '', qty: 1, price: 0 }];
    }

    items.forEach((item, index) => {
        const row = document.createElement('tr');
        const total = item.qty * item.price;
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><input type="text" class="item-desc" placeholder="Deskripsi item" value="${item.description || ''}"></td>
            <td><input type="number" class="item-qty" value="${item.qty || 1}" min="1"></td>
            <td><input type="number" class="item-price" value="${item.price || 0}" min="0"></td>
            <td class="item-total">${formatCurrency(total)}</td>
            <td><button type="button" class="btn-remove" onclick="removeItem(this, '${type}')">×</button></td>
        `;
        tbody.appendChild(row);
    });
}

// ===================================
// Sample Data Loading
// ===================================
function loadSamplePO(sampleId) {
    const data = sampleData[sampleId];
    if (data) {
        setFormData('po', data);
        switchTab('purchase-order');
    }
}

// ===================================
// Document Preview
// ===================================
function previewDocument(type) {
    const data = getFormData(type);
    currentPreviewType = type;

    let html = '';

    if (type === 'po') {
        html = generatePOPreview(data);
    } else if (type === 'invoice') {
        html = generateInvoicePreview(data);
    } else if (type === 'receipt') {
        html = generateReceiptPreview(data);
    }

    document.getElementById('preview-content').innerHTML = html;
    document.getElementById('preview-modal').classList.add('active');
}

function generatePOPreview(data) {
    const items = data.items;
    let subtotal = 0;

    items.forEach(item => {
        subtotal += item.qty * item.price;
    });

    const taxAmount = subtotal * (data.taxPercent / 100);
    const grandTotal = subtotal + taxAmount;

    let itemsHtml = items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.description || '-'}</td>
            <td class="text-right">${item.qty}</td>
            <td class="text-right">${formatCurrency(item.price)}</td>
            <td class="text-right">${formatCurrency(item.qty * item.price)}</td>
        </tr>
    `).join('');

    return `
        <div class="preview-header">
            <div class="preview-logo">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="40" width="25" height="50" fill="#2563EB"/>
                    <rect x="40" y="25" width="25" height="65" fill="#2563EB"/>
                    <polygon points="40,25 65,25 90,0 65,0" fill="#2563EB"/>
                    <rect x="70" y="10" width="20" height="80" fill="#2563EB"/>
                </svg>
                <div class="preview-logo-text">
                    <h2>Micromeet</h2>
                    <p>Technology (Singapore) Pte Ltd</p>
                </div>
            </div>
            <div class="preview-title">
                <h1>Purchase Order</h1>
                <p>${data.number || 'PO-000'}</p>
            </div>
        </div>

        <div class="preview-info-grid">
            <div class="preview-info-section">
                <h4>Kepada</h4>
                <p><strong>${data.recipient.name || '-'}</strong></p>
                ${data.recipient.address ? `<p>${data.recipient.address}</p>` : ''}
                ${data.recipient.phone ? `<p>Tel: ${data.recipient.phone}</p>` : ''}
                ${data.recipient.email ? `<p>Email: ${data.recipient.email}</p>` : ''}
            </div>
            <div class="preview-info-section">
                <h4>Detail PO</h4>
                <p><strong>Nomor PO:</strong> ${data.number || '-'}</p>
                <p><strong>Tanggal:</strong> ${formatDate(data.date)}</p>
            </div>
        </div>

        <table class="preview-items-table">
            <thead>
                <tr>
                    <th style="width: 50px;">No</th>
                    <th>Deskripsi</th>
                    <th style="width: 80px;" class="text-right">Qty</th>
                    <th style="width: 150px;" class="text-right">Harga</th>
                    <th style="width: 150px;" class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-right">Subtotal:</td>
                    <td class="text-right">${formatCurrency(subtotal)}</td>
                </tr>
                <tr>
                    <td colspan="4" class="text-right">Pajak (${data.taxPercent}%):</td>
                    <td class="text-right">${formatCurrency(taxAmount)}</td>
                </tr>
                <tr>
                    <td colspan="4" class="text-right"><strong>Grand Total:</strong></td>
                    <td class="text-right"><strong>${formatCurrency(grandTotal)}</strong></td>
                </tr>
            </tfoot>
        </table>

        <div class="preview-payment-info">
            <h4>Informasi Pembayaran</h4>
            <p><strong>Metode:</strong> ${getPaymentMethodLabel(data.payment.method)}</p>
            ${data.payment.bankName ? `<p><strong>Bank:</strong> ${data.payment.bankName}</p>` : ''}
            ${data.payment.accountNumber ? `<p><strong>No. Rekening:</strong> ${data.payment.accountNumber}</p>` : ''}
            ${data.payment.accountName ? `<p><strong>Atas Nama:</strong> ${data.payment.accountName}</p>` : ''}
        </div>

        ${data.notes ? `
        <div class="preview-notes">
            <h4>Catatan</h4>
            <p>${data.notes}</p>
        </div>
        ` : ''}

        <div class="preview-footer">
            <div class="preview-signature">
                <div class="signature-line"></div>
                <p>Penerima</p>
            </div>
            <div class="preview-signature">
                <div class="signature-line"></div>
                <p>Hormat Kami,<br>Micromeet Technology</p>
            </div>
        </div>

        <div class="preview-company-footer">
            <p>${companyInfo.name}</p>
            <p><a href="${companyInfo.website}" target="_blank">${companyInfo.website}</a></p>
        </div>
    `;
}

function generateInvoicePreview(data) {
    const items = data.items;
    let subtotal = 0;

    items.forEach(item => {
        subtotal += item.qty * item.price;
    });

    const taxAmount = subtotal * (data.taxPercent / 100);
    const grandTotal = subtotal + taxAmount;

    let itemsHtml = items.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.description || '-'}</td>
            <td class="text-right">${item.qty}</td>
            <td class="text-right">${formatCurrency(item.price)}</td>
            <td class="text-right">${formatCurrency(item.qty * item.price)}</td>
        </tr>
    `).join('');

    return `
        <div class="preview-header">
            <div class="preview-logo">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="40" width="25" height="50" fill="#2563EB"/>
                    <rect x="40" y="25" width="25" height="65" fill="#2563EB"/>
                    <polygon points="40,25 65,25 90,0 65,0" fill="#2563EB"/>
                    <rect x="70" y="10" width="20" height="80" fill="#2563EB"/>
                </svg>
                <div class="preview-logo-text">
                    <h2>Micromeet</h2>
                    <p>Technology (Singapore) Pte Ltd</p>
                </div>
            </div>
            <div class="preview-title">
                <h1>Invoice</h1>
                <p>${data.number || 'INV-000'}</p>
            </div>
        </div>

        <div class="preview-info-grid">
            <div class="preview-info-section">
                <h4>Tagihan Kepada</h4>
                <p><strong>${data.customer.name || '-'}</strong></p>
                ${data.customer.address ? `<p>${data.customer.address}</p>` : ''}
                ${data.customer.phone ? `<p>Tel: ${data.customer.phone}</p>` : ''}
                ${data.customer.email ? `<p>Email: ${data.customer.email}</p>` : ''}
            </div>
            <div class="preview-info-section">
                <h4>Detail Invoice</h4>
                <p><strong>Nomor Invoice:</strong> ${data.number || '-'}</p>
                <p><strong>Tanggal:</strong> ${formatDate(data.date)}</p>
                <p><strong>Jatuh Tempo:</strong> ${formatDate(data.dueDate)}</p>
                ${data.poRef ? `<p><strong>Ref. PO:</strong> ${data.poRef}</p>` : ''}
            </div>
        </div>

        <table class="preview-items-table">
            <thead>
                <tr>
                    <th style="width: 50px;">No</th>
                    <th>Deskripsi</th>
                    <th style="width: 80px;" class="text-right">Qty</th>
                    <th style="width: 150px;" class="text-right">Harga</th>
                    <th style="width: 150px;" class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-right">Subtotal:</td>
                    <td class="text-right">${formatCurrency(subtotal)}</td>
                </tr>
                <tr>
                    <td colspan="4" class="text-right">Pajak (${data.taxPercent}%):</td>
                    <td class="text-right">${formatCurrency(taxAmount)}</td>
                </tr>
                <tr>
                    <td colspan="4" class="text-right"><strong>Grand Total:</strong></td>
                    <td class="text-right"><strong>${formatCurrency(grandTotal)}</strong></td>
                </tr>
            </tfoot>
        </table>

        <div class="preview-payment-info">
            <h4>Informasi Pembayaran</h4>
            <p><strong>Metode:</strong> ${getPaymentMethodLabel(data.payment.method)}</p>
            ${data.payment.bankName ? `<p><strong>Bank:</strong> ${data.payment.bankName}</p>` : ''}
            ${data.payment.accountNumber ? `<p><strong>No. Rekening:</strong> ${data.payment.accountNumber}</p>` : ''}
            ${data.payment.accountName ? `<p><strong>Atas Nama:</strong> ${data.payment.accountName}</p>` : ''}
        </div>

        ${data.notes ? `
        <div class="preview-notes">
            <h4>Catatan</h4>
            <p>${data.notes}</p>
        </div>
        ` : ''}

        <div class="preview-footer">
            <div class="preview-signature">
                <div class="signature-line"></div>
                <p>Pelanggan</p>
            </div>
            <div class="preview-signature">
                <div class="signature-line"></div>
                <p>Hormat Kami,<br>Micromeet Technology</p>
            </div>
        </div>

        <div class="preview-company-footer">
            <p>${companyInfo.name}</p>
            <p><a href="${companyInfo.website}" target="_blank">${companyInfo.website}</a></p>
        </div>
    `;
}

function generateReceiptPreview(data) {
    return `
        <div class="preview-header">
            <div class="preview-logo">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="40" width="25" height="50" fill="#2563EB"/>
                    <rect x="40" y="25" width="25" height="65" fill="#2563EB"/>
                    <polygon points="40,25 65,25 90,0 65,0" fill="#2563EB"/>
                    <rect x="70" y="10" width="20" height="80" fill="#2563EB"/>
                </svg>
                <div class="preview-logo-text">
                    <h2>Micromeet</h2>
                    <p>Technology (Singapore) Pte Ltd</p>
                </div>
            </div>
            <div class="preview-title">
                <h1>Bukti Bayar</h1>
                <p>${data.number || 'RCP-000'}</p>
            </div>
        </div>

        <div class="preview-info-grid">
            <div class="preview-info-section">
                <h4>Diterima Dari</h4>
                <p><strong>${data.payer.name || '-'}</strong></p>
                ${data.payer.address ? `<p>${data.payer.address}</p>` : ''}
            </div>
            <div class="preview-info-section">
                <h4>Detail Pembayaran</h4>
                <p><strong>Nomor:</strong> ${data.number || '-'}</p>
                <p><strong>Tanggal:</strong> ${formatDate(data.date)}</p>
                ${data.invoiceRef ? `<p><strong>Ref. Invoice:</strong> ${data.invoiceRef}</p>` : ''}
                ${data.poRef ? `<p><strong>Ref. PO:</strong> ${data.poRef}</p>` : ''}
            </div>
        </div>

        <div class="preview-payment-info" style="text-align: center; padding: 30px;">
            <h4 style="font-size: 16px; margin-bottom: 20px;">Jumlah Pembayaran</h4>
            <p style="font-size: 32px; font-weight: 700; color: #2563EB; margin-bottom: 20px;">${formatCurrency(data.payment.amount)}</p>
            <p style="font-size: 14px; color: #64748B;">(${numberToWords(data.payment.amount)})</p>
        </div>

        <div class="preview-info-grid">
            <div class="preview-info-section">
                <h4>Metode Pembayaran</h4>
                <p><strong>Metode:</strong> ${getPaymentMethodLabel(data.payment.method)}</p>
                ${data.payment.bankName ? `<p><strong>Bank:</strong> ${data.payment.bankName}</p>` : ''}
                ${data.payment.accountNumber ? `<p><strong>No. Rekening:</strong> ${data.payment.accountNumber}</p>` : ''}
            </div>
            <div class="preview-info-section">
                <h4>Keterangan</h4>
                <p>${data.description || '-'}</p>
            </div>
        </div>

        ${data.notes ? `
        <div class="preview-notes">
            <h4>Catatan</h4>
            <p>${data.notes}</p>
        </div>
        ` : ''}

        <div class="preview-footer">
            <div class="preview-signature">
                <div class="signature-line"></div>
                <p>Pembayar</p>
            </div>
            <div class="preview-signature">
                <div class="signature-line"></div>
                <p>Penerima,<br>Micromeet Technology</p>
            </div>
        </div>

        <div class="preview-company-footer">
            <p>${companyInfo.name}</p>
            <p><a href="${companyInfo.website}" target="_blank">${companyInfo.website}</a></p>
        </div>
    `;
}

function closePreview() {
    document.getElementById('preview-modal').classList.remove('active');
}

function printDocument() {
    window.print();
}

function downloadPDF() {
    alert('Untuk download PDF, silakan gunakan fitur Print dan pilih "Save as PDF" pada dialog print.');
    window.print();
}

// ===================================
// Document Storage
// ===================================
function saveDocument(type) {
    const data = getFormData(type);
    data.id = Date.now();
    data.savedAt = new Date().toISOString();

    savedDocuments.push(data);
    localStorage.setItem('micromeetDocuments', JSON.stringify(savedDocuments));

    updateDashboardStats();
    loadSavedDocuments();

    alert('Dokumen berhasil disimpan!');
}

function loadSavedDocuments() {
    const list = document.getElementById('documents-list');
    const filter = document.getElementById('filter-type')?.value || 'all';
    const search = document.getElementById('search-docs')?.value?.toLowerCase() || '';

    let filtered = savedDocuments;

    if (filter !== 'all') {
        filtered = filtered.filter(doc => doc.type === filter);
    }

    if (search) {
        filtered = filtered.filter(doc => {
            const searchableText = [
                doc.number,
                doc.recipient?.name,
                doc.customer?.name,
                doc.payer?.name
            ].filter(Boolean).join(' ').toLowerCase();
            return searchableText.includes(search);
        });
    }

    if (filtered.length === 0) {
        list.innerHTML = '<p class="no-docs">Belum ada dokumen tersimpan</p>';
        return;
    }

    list.innerHTML = filtered.map(doc => {
        const name = doc.recipient?.name || doc.customer?.name || doc.payer?.name || '-';
        const typeLabel = getDocTypeLabel(doc.type);

        return `
            <div class="doc-item">
                <div class="doc-info">
                    <div class="doc-icon ${doc.type}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                    </div>
                    <div class="doc-details">
                        <h4>${doc.number || 'No Number'}</h4>
                        <p>${typeLabel} - ${name} - ${formatDate(doc.date)}</p>
                    </div>
                </div>
                <div class="doc-actions">
                    <button class="btn btn-secondary" onclick="loadDocument(${doc.id})">Buka</button>
                    <button class="btn btn-secondary" onclick="deleteDocument(${doc.id})">Hapus</button>
                </div>
            </div>
        `;
    }).join('');
}

function loadDocument(id) {
    const doc = savedDocuments.find(d => d.id === id);
    if (doc) {
        setFormData(doc.type, doc);
        switchTab(doc.type === 'po' ? 'purchase-order' : doc.type);
    }
}

function deleteDocument(id) {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
        savedDocuments = savedDocuments.filter(d => d.id !== id);
        localStorage.setItem('micromeetDocuments', JSON.stringify(savedDocuments));
        updateDashboardStats();
        loadSavedDocuments();
    }
}

function setupDocumentFilters() {
    const filterType = document.getElementById('filter-type');
    const searchDocs = document.getElementById('search-docs');

    if (filterType) {
        filterType.addEventListener('change', loadSavedDocuments);
    }

    if (searchDocs) {
        searchDocs.addEventListener('input', loadSavedDocuments);
    }
}

// ===================================
// Dashboard
// ===================================
function updateDashboardStats() {
    const poCount = savedDocuments.filter(d => d.type === 'po').length;
    const invoiceCount = savedDocuments.filter(d => d.type === 'invoice').length;
    const receiptCount = savedDocuments.filter(d => d.type === 'receipt').length;

    document.getElementById('po-count').textContent = poCount;
    document.getElementById('invoice-count').textContent = invoiceCount;
    document.getElementById('receipt-count').textContent = receiptCount;
}

// ===================================
// Utility Functions
// ===================================
function formatCurrency(amount) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function getPaymentMethodLabel(method) {
    const labels = {
        'bank-transfer': 'Bank Transfer',
        'cash': 'Cash',
        'credit-card': 'Credit Card',
        'e-wallet': 'E-Wallet'
    };
    return labels[method] || method;
}

function getDocTypeLabel(type) {
    const labels = {
        'po': 'Purchase Order',
        'invoice': 'Invoice',
        'receipt': 'Bukti Bayar'
    };
    return labels[type] || type;
}

function numberToWords(num) {
    const ones = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

    if (num < 12) return ones[num] + ' Rupiah';
    if (num < 20) return ones[num - 10] + ' Belas Rupiah';
    if (num < 100) return ones[Math.floor(num / 10)] + ' Puluh ' + ones[num % 10] + ' Rupiah';
    if (num < 200) return 'Seratus ' + numberToWordsHelper(num - 100);
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Ratus ' + numberToWordsHelper(num % 100);
    if (num < 2000) return 'Seribu ' + numberToWordsHelper(num - 1000);
    if (num < 1000000) return numberToWordsHelper(Math.floor(num / 1000)) + ' Ribu ' + numberToWordsHelper(num % 1000);
    if (num < 1000000000) return numberToWordsHelper(Math.floor(num / 1000000)) + ' Juta ' + numberToWordsHelper(num % 1000000);
    if (num < 1000000000000) return numberToWordsHelper(Math.floor(num / 1000000000)) + ' Miliar ' + numberToWordsHelper(num % 1000000000);

    return numberToWordsHelper(Math.floor(num / 1000000000000)) + ' Triliun ' + numberToWordsHelper(num % 1000000000000);
}

function numberToWordsHelper(num) {
    if (num === 0) return '';
    return numberToWords(num).replace(' Rupiah', '');
}
