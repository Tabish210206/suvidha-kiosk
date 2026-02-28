/**
 * Print Support System
 * Handles thermal printer (80mm) and digital receipt printing
 */

export interface PrintConfig {
  paperWidth: number; // mm
  margin: number; // mm
  fontSize: number; // pt
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
}

export interface PrintableReceipt {
  header: string[];
  sections: PrintSection[];
  footer: string[];
  qrCode?: string;
}

export interface PrintSection {
  title: string;
  content: Array<{
    label?: string;
    value: string;
  }>;
}

// Thermal Printer Configuration (80mm width)
export const THERMAL_PRINTER_CONFIG: PrintConfig = {
  paperWidth: 80, // mm
  margin: 2, // mm
  fontSize: 12, // pt
  fontFamily: 'monospace',
  textAlign: 'center',
};

// A4 Printer Configuration
export const A4_PRINTER_CONFIG: PrintConfig = {
  paperWidth: 210, // mm (A4 width)
  margin: 10, // mm
  fontSize: 11, // pt
  fontFamily: 'Arial, sans-serif',
  textAlign: 'left',
};

/**
 * Print Manager for Receipts
 */
export class PrintManager {
  private config: PrintConfig;
  private paperWidth: number;
  private contentWidth: number;

  constructor(config: PrintConfig = THERMAL_PRINTER_CONFIG) {
    this.config = config;
    this.paperWidth = config.paperWidth;
    this.contentWidth = this.paperWidth - config.margin * 2;
  }

  /**
   * Generate print HTML for thermal printer
   */
  generateThermalHTML(receipt: PrintableReceipt): string {
    const charsPerLine = Math.floor(this.contentWidth / 2.5); // Approximate chars per line

    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: ${this.paperWidth}mm;
      margin: 0;
    }
    
    body {
      width: ${this.paperWidth}mm;
      margin: 0;
      padding: ${this.config.margin}mm;
      font-family: ${this.config.fontFamily};
      font-size: ${this.config.fontSize}pt;
      background: white;
    }
    
    .header, .footer {
      text-align: center;
      font-weight: bold;
      margin: 5mm 0;
      border-bottom: 1px dashed #000;
      padding-bottom: 3mm;
    }
    
    .section {
      margin: 3mm 0;
    }
    
    .section-title {
      font-weight: bold;
      border-bottom: 1px solid #000;
      margin-bottom: 2mm;
      padding-bottom: 1mm;
    }
    
    .line {
      display: flex;
      justify-content: space-between;
      font-family: monospace;
      line-height: 1.4;
    }
    
    .label {
      text-align: left;
      flex: 1;
    }
    
    .value {
      text-align: right;
      flex: 1;
      font-weight: bold;
    }
    
    .qr-code {
      text-align: center;
      margin: 5mm 0;
    }
    
    .qr-code img {
      max-width: ${this.contentWidth}mm;
      height: auto;
    }
    
    .footer-text {
      text-align: center;
      font-size: 9pt;
      margin-top: 5mm;
      padding-top: 3mm;
      border-top: 1px dashed #000;
    }
  </style>
</head>
<body>
`;

    // Header
    if (receipt.header.length > 0) {
      html += '<div class="header">\n';
      receipt.header.forEach((line) => {
        html += `  <div>${this.escapeHtml(line)}</div>\n`;
      });
      html += '</div>\n';
    }

    // Sections
    receipt.sections.forEach((section) => {
      html += `<div class="section">
  <div class="section-title">${this.escapeHtml(section.title)}</div>\n`;

      section.content.forEach((item) => {
        if (item.label) {
          html += `  <div class="line">
    <span class="label">${this.escapeHtml(item.label)}</span>
    <span class="value">${this.escapeHtml(item.value)}</span>
  </div>\n`;
        } else {
          html += `  <div class="line" style="text-align: center; font-weight: bold;">
    ${this.escapeHtml(item.value)}
  </div>\n`;
        }
      });

      html += '</div>\n';
    });

    // QR Code
    if (receipt.qrCode) {
      html += `<div class="qr-code">
  <img src="${receipt.qrCode}" alt="QR Code">
  <div style="font-size: 9pt; margin-top: 2mm;">Scan to verify</div>
</div>\n`;
    }

    // Footer
    if (receipt.footer.length > 0) {
      html += '<div class="footer-text">\n';
      receipt.footer.forEach((line) => {
        html += `  <div>${this.escapeHtml(line)}</div>\n`;
      });
      html += '</div>\n';
    }

    html += `
</body>
</html>
    `;

    return html;
  }

  /**
   * Generate print HTML for A4 paper
   */
  generateA4HTML(receipt: PrintableReceipt): string {
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
    }
    
    body {
      font-family: Arial, sans-serif;
      max-width: 210mm;
      margin: 0 auto;
      padding: 10mm;
      background: white;
    }
    
    .container {
      border: 1px solid #ccc;
      padding: 15mm;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    .header {
      text-align: center;
      margin-bottom: 10mm;
      border-bottom: 2px solid #0066CC;
      padding-bottom: 5mm;
    }
    
    .header h1 {
      margin: 0;
      font-size: 20pt;
      color: #0066CC;
    }
    
    .header p {
      margin: 2mm 0 0 0;
      font-size: 10pt;
      color: #666;
    }
    
    .section {
      margin-bottom: 8mm;
    }
    
    .section-title {
      font-weight: bold;
      font-size: 11pt;
      border-bottom: 1px solid #ddd;
      margin-bottom: 3mm;
      padding-bottom: 2mm;
    }
    
    .line {
      display: flex;
      justify-content: space-between;
      font-size: 10pt;
      margin-bottom: 2mm;
      padding: 0 0 1mm 0;
    }
    
    .line:nth-child(even) {
      background-color: #f9f9f9;
      padding: 1mm 2mm;
    }
    
    .label {
      font-weight: bold;
      color: #333;
    }
    
    .value {
      text-align: right;
      color: #000;
    }
    
    .highlight {
      background-color: #FFF9E6;
      padding: 5mm;
      border-left: 3px solid #FF9800;
      margin: 5mm 0;
    }
    
    .qr-code {
      text-align: center;
      margin: 10mm 0;
      padding: 10mm;
      background: #f9f9f9;
      border: 1px dashed #999;
    }
    
    .qr-code img {
      max-width: 100mm;
      height: auto;
    }
    
    .footer {
      text-align: center;
      border-top: 1px dashed #999;
      margin-top: 10mm;
      padding-top: 5mm;
      font-size: 9pt;
      color: #666;
    }
    
    .signature-area {
      display: flex;
      justify-content: space-around;
      margin-top: 10mm;
    }
    
    .signature-line {
      border-top: 1px solid #000;
      width: 40mm;
      text-align: center;
      font-size: 9pt;
      margin-top: 20mm;
    }
  </style>
</head>
<body>
<div class="container">
`;

    // Header
    if (receipt.header.length > 0) {
      html += '<div class="header">\n';
      if (receipt.header[0]) {
        html += `  <h1>${this.escapeHtml(receipt.header[0])}</h1>\n`;
      }
      if (receipt.header[1]) {
        html += `  <p>${this.escapeHtml(receipt.header[1])}</p>\n`;
      }
      html += '</div>\n';
    }

    // Sections
    receipt.sections.forEach((section) => {
      html += `<div class="section">
  <div class="section-title">${this.escapeHtml(section.title)}</div>\n`;

      section.content.forEach((item) => {
        if (item.label) {
          html += `  <div class="line">
    <span class="label">${this.escapeHtml(item.label)}</span>
    <span class="value">${this.escapeHtml(item.value)}</span>
  </div>\n`;
        } else {
          html += `  <div class="highlight">
    <strong>${this.escapeHtml(item.value)}</strong>
  </div>\n`;
        }
      });

      html += '</div>\n';
    });

    // QR Code
    if (receipt.qrCode) {
      html += `<div class="qr-code">
  <p><strong>Scan to Verify</strong></p>
  <img src="${receipt.qrCode}" alt="QR Code">
</div>\n`;
    }

    // Footer
    if (receipt.footer.length > 0) {
      html += '<div class="footer">\n';
      receipt.footer.forEach((line) => {
        html += `  <p>${this.escapeHtml(line)}</p>\n`;
      });
      html += '</div>\n';
    }

    html += `
  <div class="signature-area">
    <div class="signature-line">Authorized Signature</div>
    <div class="signature-line">Customer Signature</div>
  </div>
</div>
</body>
</html>
    `;

    return html;
  }

  /**
   * Print document
   */
  print(html: string, title: string = 'Receipt'): void {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.document.title = title;
      printWindow.print();
    };
  }

  /**
   * Download as PDF (requires external library)
   */
  async downloadAsPDF(html: string, filename: string): Promise<void> {
    try {
      // Create blob from HTML
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.download = `${filename}.html`; // Note: HTML instead of PDF (requires html2pdf library)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  }

  /**
   * Copy HTML to clipboard for sharing
   */
  copyToClipboard(html: string): Promise<boolean> {
    try {
      // Extract text content
      const div = document.createElement('div');
      div.innerHTML = html;
      const text = div.textContent || div.innerText || '';

      return navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch(() => false);
    } catch (error) {
      console.error('Failed to copy:', error);
      return Promise.resolve(false);
    }
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Pad string to center on line
   */
  private centerText(text: string, width: number): string {
    const padding = Math.max(0, width - text.length) / 2;
    return ' '.repeat(Math.floor(padding)) + text;
  }

  /**
   * Format line for thermal printer
   */
  private formatThermalLine(label: string, value: string): string {
    const maxWidth = 32; // Approximate for 80mm
    const labelWidth = Math.floor(maxWidth * 0.6);
    const valueWidth = Math.floor(maxWidth * 0.4);

    const paddedLabel = label.substring(0, labelWidth).padEnd(labelWidth);
    const paddedValue = value.substring(0, valueWidth).padStart(valueWidth);

    return paddedLabel + paddedValue;
  }
}

/**
 * Create a simple receipt structure
 */
export function createReceipt(data: {
  title: string;
  company: string;
  sections: { title: string; items: Array<{ label?: string; value: string }> }[];
  qrCode?: string;
  footer?: string[];
}): PrintableReceipt {
  return {
    header: [data.title, data.company],
    sections: data.sections,
    qrCode: data.qrCode,
    footer: data.footer || [
      'Thank you for your transaction',
      'Please keep this receipt for your records',
      new Date().toLocaleString('en-IN'),
    ],
  };
}

export function getPrintManager(
  config?: PrintConfig
): PrintManager {
  return new PrintManager(config);
}

export default PrintManager;
