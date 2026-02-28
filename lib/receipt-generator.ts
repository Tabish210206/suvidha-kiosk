/**
 * Receipt Generation System
 * Creates digital and printable receipts for transactions
 */

export interface Transaction {
  transactionId: string;
  type: 'bill_payment' | 'complaint' | 'new_connection' | 'service_request';
  serviceType: 'electricity' | 'water' | 'gas' | 'municipal';
  timestamp: number;
  amount?: number;
  consumerNumber?: string;
  consumerName?: string;
  phoneNumber?: string;
  email?: string;
  status: 'success' | 'pending' | 'failed';
  details: Record<string, any>;
  confirmationCode?: string;
}

export interface Receipt {
  transactionId: string;
  receiptNumber: string;
  qrCode: string;
  dateTime: string;
  transaction: Transaction;
  html: string;
  text: string;
  base64PDF?: string;
}

// Transaction Receipt Generator
export class ReceiptGenerator {
  private readonly SERVICE_CONTACT = {
    electricity: '+91-9876-543-210',
    water: '+91-9876-543-211',
    gas: '+91-9876-543-212',
    municipal: '+91-9876-543-213',
  };

  private readonly SERVICE_NAMES = {
    electricity: 'Electricity Board',
    water: 'Water Supply Department',
    gas: 'Gas Distribution Authority',
    municipal: 'Municipal Corporation',
  };

  /**
   * Generate receipt for transaction
   */
  generateReceipt(transaction: Transaction): Receipt {
    const receiptNumber = this.generateReceiptNumber();
    const qrCode = this.generateQRCode(transaction);
    const dateTime = new Date(transaction.timestamp).toLocaleString('en-IN');

    const html = this.generateHTMLReceipt(transaction, receiptNumber, dateTime);
    const text = this.generateTextReceipt(transaction, receiptNumber, dateTime);

    return {
      transactionId: transaction.transactionId,
      receiptNumber,
      qrCode,
      dateTime,
      transaction,
      html,
      text,
    };
  }

  /**
   * Generate unique receipt number
   */
  private generateReceiptNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `RCP-${year}${month}${day}-${random}`;
  }

  /**
   * Generate QR code data
   */
  private generateQRCode(transaction: Transaction): string {
    const qrData = {
      txn_id: transaction.transactionId,
      service: transaction.serviceType,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      status: transaction.status,
    };

    // Simple QR encoding (in real app, use proper library)
    return `https://verify.kiosk/${Buffer.from(
      JSON.stringify(qrData)
    ).toString('base64')}`;
  }

  /**
   * Generate HTML receipt
   */
  private generateHTMLReceipt(
    transaction: Transaction,
    receiptNumber: string,
    dateTime: string
  ): string {
    const serviceContact =
      this.SERVICE_CONTACT[transaction.serviceType as keyof typeof this.SERVICE_CONTACT];
    const serviceName =
      this.SERVICE_NAMES[transaction.serviceType as keyof typeof this.SERVICE_NAMES];

    const statusColor =
      transaction.status === 'success'
        ? '#198754'
        : transaction.status === 'pending'
          ? '#FF9800'
          : '#DC3545';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt - ${receiptNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .receipt-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            ;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .receipt-header {
            background: linear-gradient(135deg, #0066CC 0%, #004399 100%);
            color: white;
            padding: 24px;
            text-align: center;
        }
        
        .receipt-header h1 {
            font-size: 24px;
            margin-bottom: 8px;
        }
        
        .receipt-header p {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .receipt-content {
            padding: 24px;
        }
        
        .receipt-section {
            margin-bottom: 24px;
            border-bottom: 1px solid #eee;
            padding-bottom: 16px;
        }
        
        .receipt-section:last-child {
            border-bottom: none;
        }
        
        .section-title {
            font-weight: bold;
            font-size: 14px;
            color: #333;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .receipt-field {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .receipt-field label {
            color: #666;
            font-weight: 500;
        }
        
        .receipt-field value {
            color: #000;
            text-align: right;
            word-break: break-word;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 4px;
            background: ${statusColor};
            color: white;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            margin: 16px 0;
        }
        
        .amount-display {
            font-size: 28px;
            font-weight: bold;
            color: ${statusColor};
            margin: 12px 0;
        }
        
        .qr-code {
            text-align: center;
            padding: 16px;
            background: #f9f9f9;
            border-radius: 4px;
            margin: 16px 0;
        }
        
        .qr-code img {
            max-width: 200px;
            height: auto;
        }
        
        .receipt-footer {
            background: #f9f9f9;
            padding: 20px 24px;
            text-align: center;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }
        
        .contact-info {
            background: #e8f4f8;
            padding: 12px;
            border-radius: 4px;
            margin: 8px 0;
            font-size: 13px;
        }
        
        .action-buttons {
            display: flex;
            gap: 12px;
            margin-top: 16px;
            flex-wrap: wrap;
        }
        
        .btn {
            flex: 1;
            min-width: 120px;
            padding: 10px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: #0066CC;
            color: white;
        }
        
        .btn-primary:hover {
            background: #004399;
        }
        
        .btn-secondary {
            background: #f0f0f0;
            color: #333;
            border: 1px solid #ddd;
        }
        
        .btn-secondary:hover {
            background: #e0e0e0;
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .receipt-container {
                box-shadow: none;
                border: none;
            }
            
            .action-buttons {
                display: none;
            }
        }
        
        @media (max-width: 600px) {
            .receipt-container {
                border-radius: 0;
            }
            
            .receipt-field {
                flex-direction: column;
            }
            
            .receipt-field value {
                text-align: left;
                margin-top: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="receipt-header">
            <h1>${serviceName}</h1>
            <p>${this.SERVICE_CONTACT[transaction.serviceType as keyof typeof this.SERVICE_CONTACT]}</p>
        </div>
        
        <div class="receipt-content">
            <!-- Transaction Status -->
            <div class="receipt-section">
                <div class="status-badge">${transaction.status}</div>
                ${transaction.amount ? `<div class="amount-display">₹${transaction.amount.toFixed(2)}</div>` : ''}
            </div>
            
            <!-- Receipt Details -->
            <div class="receipt-section">
                <div class="section-title">Receipt Details</div>
                <div class="receipt-field">
                    <label>Receipt Number:</label>
                    <value>${receiptNumber}</value>
                </div>
                <div class="receipt-field">
                    <label>Transaction ID:</label>
                    <value>${transaction.transactionId}</value>
                </div>
                <div class="receipt-field">
                    <label>Date & Time:</label>
                    <value>${dateTime}</value>
                </div>
                ${transaction.confirmationCode ? `
                <div class="receipt-field">
                    <label>Confirmation Code:</label>
                    <value>${transaction.confirmationCode}</value>
                </div>
                ` : ''}
            </div>
            
            <!-- Consumer Details -->
            <div class="receipt-section">
                <div class="section-title">Service Details</div>
                <div class="receipt-field">
                    <label>Service Type:</label>
                    <value>${transaction.serviceType}</value>
                </div>
                ${transaction.consumerNumber ? `
                <div class="receipt-field">
                    <label>Consumer Number:</label>
                    <value>${transaction.consumerNumber}</value>
                </div>
                ` : ''}
                ${transaction.consumerName ? `
                <div class="receipt-field">
                    <label>Name:</label>
                    <value>${transaction.consumerName}</value>
                </div>
                ` : ''}
            </div>
            
            <!-- Contact Information -->
            <div class="contact-info">
                <strong>Customer Support:</strong>
                ${serviceContact}
                <br>
                For assistance or complaints, please contact the support number above.
            </div>
            
            <!-- QR Code -->
            <div class="qr-code">
                <p style="font-size: 12px; color: #666; margin-bottom: 8px;">Scan for verification</p>
                <img src="${this.generateQRCodeImage(this.generateQRCode(transaction))}" alt="QR Code">
            </div>
            
            <!-- Action Buttons -->
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="window.print()">Print Receipt</button>
                <button class="btn btn-secondary" onclick="downloadReceipt()">Download PDF</button>
            </div>
        </div>
        
        <div class="receipt-footer">
            <p>This is an electronically generated receipt. No signature required.</p>
            <p>Please keep this receipt for your records.</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate text receipt (for email/SMS)
   */
  private generateTextReceipt(
    transaction: Transaction,
    receiptNumber: string,
    dateTime: string
  ): string {
    const serviceName =
      this.SERVICE_NAMES[transaction.serviceType as keyof typeof this.SERVICE_NAMES];

    return `
========================================
    ${serviceName}
========================================

TRANSACTION RECEIPT
Receipt #: ${receiptNumber}
Date & Time: ${dateTime}

STATUS: ${transaction.status.toUpperCase()}
${transaction.amount ? `AMOUNT: ₹${transaction.amount.toFixed(2)}` : ''}

Transaction ID: ${transaction.transactionId}
${transaction.confirmationCode ? `Confirmation Code: ${transaction.confirmationCode}` : ''}

Service Type: ${transaction.serviceType}
${transaction.consumerNumber ? `Consumer Number: ${transaction.consumerNumber}` : ''}
${transaction.consumerName ? `Name: ${transaction.consumerName}` : ''}

Customer Support:
${this.SERVICE_CONTACT[transaction.serviceType as keyof typeof this.SERVICE_CONTACT]}

========================================
Thank you for using our service!
========================================
    `;
  }

  /**
   * Generate QR code image (simplified)
   */
  private generateQRCodeImage(qrData: string): string {
    // In production, use a proper QR code library
    // For now, return a placeholder data URL
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="white" width="200" height="200"/%3E%3C/svg%3E';
  }

  /**
   * Send receipt via email (mock)
   */
  async sendReceiptByEmail(
    receipt: Receipt,
    email: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // In production, call email service API
      console.log('Sending receipt to:', email);
      console.log('Receipt:', receipt.receiptNumber);

      // Simulate API call
      return {
        success: true,
        message: `Receipt sent to ${email}`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send receipt',
      };
    }
  }

  /**
   * Send receipt via SMS (mock)
   */
  async sendReceiptBySMS(
    receipt: Receipt,
    phoneNumber: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // In production, call SMS service API
      console.log('Sending SMS to:', phoneNumber);
      console.log('Receipt:', receipt.receiptNumber);

      // Simulate API call
      return {
        success: true,
        message: `SMS sent to ${phoneNumber}`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send SMS',
      };
    }
  }

  /**
   * Download receipt as PDF
   */
  async downloadReceiptPDF(receipt: Receipt): Promise<void> {
    try {
      // In production, use a library like html2pdf or pdfkit
      const element = document.createElement('div');
      element.innerHTML = receipt.html;

      // Trigger download
      const dataStr = `data:text/html;charset=utf-8,${encodeURIComponent(receipt.html)}`;
      const link = document.createElement('a');
      link.href = dataStr;
      link.download = `receipt-${receipt.receiptNumber}.html`;
      link.click();
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  }

  /**
   * Print receipt
   */
  printReceipt(receipt: Receipt): void {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(receipt.html);
      printWindow.document.close();
      printWindow.print();
    }
  }
}

export function getReceiptGenerator(): ReceiptGenerator {
  return new ReceiptGenerator();
}

export default ReceiptGenerator;
