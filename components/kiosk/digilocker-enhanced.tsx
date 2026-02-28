'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Shield, Check, Lock, AlertCircle, File, Image, FileJson } from 'lucide-react';

interface DigiLockerDocument {
  id: string;
  name: string;
  type: string;
  issueDate: string;
  expiryDate?: string;
  issuer: string;
  verified: boolean;
}

interface EnhancedDigiLockerProps {
  documentType: string;
  onComplete?: (docId: string, fileName: string, data: DigiLockerDocument) => void;
  autoFillForm?: boolean;
  showSecurityBadge?: boolean;
}

const availableDocuments: Record<string, DigiLockerDocument[]> = {
  'aadhaar': [
    {
      id: 'AADH-2024-001',
      name: 'Aadhaar Card',
      type: 'aadhaar',
      issueDate: '2020-01-15',
      expiryDate: '2030-01-15',
      issuer: 'UIDAI',
      verified: true,
    },
  ],
  'pancard': [
    {
      id: 'PAN-2024-001',
      name: 'PAN Card',
      type: 'pancard',
      issueDate: '2015-05-20',
      issuer: 'Income Tax Department',
      verified: true,
    },
  ],
  'address': [
    {
      id: 'ADDR-2024-001',
      name: 'Electricity Bill (Address Proof)',
      type: 'address',
      issueDate: '2024-02-15',
      issuer: 'Electricity Board',
      verified: true,
    },
    {
      id: 'ADDR-2024-002',
      name: 'Utility Bill (Address Proof)',
      type: 'address',
      issueDate: '2024-02-10',
      issuer: 'Water Board',
      verified: true,
    },
  ],
  'property': [
    {
      id: 'PROP-2024-001',
      name: 'Property Registration Certificate',
      type: 'property',
      issueDate: '2018-06-01',
      issuer: 'Revenue Department',
      verified: true,
    },
  ],
};

const mockUserData = {
  aadhaar: { name: 'John Doe', address: '123 Main Street, City, State 560001' },
  pancard: { name: 'John Doe', panNumber: 'XXXXX0000X' },
  property: { propertyValue: 25000000, address: '123 Main Street, City' },
};

export default function EnhancedDigiLocker({
  documentType,
  onComplete,
  autoFillForm = true,
  showSecurityBadge = true,
}: EnhancedDigiLockerProps) {
  const [selectedDoc, setSelectedDoc] = useState<DigiLockerDocument | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDocumentsList, setShowDocumentsList] = useState(true);

  const documents = availableDocuments[documentType] || [];

  const handleSelectDocument = (doc: DigiLockerDocument) => {
    setSelectedDoc(doc);
    setShowDocumentsList(false);

    if (autoFillForm && mockUserData[documentType as keyof typeof mockUserData]) {
      const userData = mockUserData[documentType as keyof typeof mockUserData];
      simulateAutoFill(userData);
    }

    setTimeout(() => {
      setIsProcessing(true);
      setTimeout(() => {
        onComplete?.(doc.id, doc.name, doc);
        setIsProcessing(false);
      }, 1000);
    }, 500);
  };

  const simulateAutoFill = (userData: any) => {
    console.log('[v0] Auto-filling form with:', userData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  if (!showDocumentsList && selectedDoc) {
    return (
      <div className="space-y-4">
        {/* Selected Document */}
        <Card className="p-6 border-2 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-lg">{selectedDoc.name}</h4>
                <p className="text-sm text-muted-foreground">From: {selectedDoc.issuer}</p>
                <p className="text-xs text-muted-foreground mt-1">Issued: {selectedDoc.issueDate}</p>
              </div>
            </div>
            {selectedDoc.verified && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                <Check className="w-4 h-4" />
                Verified
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-r-transparent animate-spin" />
              Processing document...
            </div>
          )}
        </Card>

        {/* Security Badges */}
        {showSecurityBadge && (
          <Card className="p-4 border-2 bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-900/20 dark:to-purple-900/10">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              Security & Compliance
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Lock className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-semibold">AES-256 Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-semibold">Government Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-semibold">DPDP Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Check className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-semibold">Digital Verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Lock className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-semibold">Secure Transfer</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-semibold">ISO Certified</span>
              </div>
            </div>
          </Card>
        )}

        {/* Auto-Filled Data Preview */}
        {autoFillForm && mockUserData[documentType as keyof typeof mockUserData] && (
          <Card className="p-4 border-2 border-green-500 bg-green-50 dark:bg-green-900/10">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Auto-Filled Information
            </h4>
            <div className="space-y-2 text-sm">
              {Object.entries(mockUserData[documentType as keyof typeof mockUserData] || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-semibold">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Button
          onClick={() => {
            setShowDocumentsList(true);
            setSelectedDoc(null);
          }}
          variant="outline"
          className="w-full"
        >
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* DigiLocker Documents List */}
      <Card className="p-6 border-2">
        <h3 className="text-lg font-semibold mb-4">Available Documents from DigiLocker</h3>
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleSelectDocument(doc)}
                className="p-4 border-2 border-border rounded-lg hover:border-primary hover:shadow-lg transition-all cursor-pointer bg-muted/50 hover:bg-muted"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">{doc.name}</h4>
                      <p className="text-xs text-muted-foreground">ID: {doc.id}</p>
                      <p className="text-xs text-muted-foreground mt-1">Issued: {doc.issueDate}</p>
                    </div>
                  </div>
                  {doc.verified && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold flex-shrink-0 ml-2">
                      <Check className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No documents available for this type</p>
        )}
      </Card>

      {/* Manual Upload */}
      <Card className="p-6 border-2 border-dashed border-primary">
        <h3 className="text-lg font-semibold mb-4">Or Upload Documents Manually</h3>
        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-semibold mb-2">Upload Document</p>
          <p className="text-xs text-muted-foreground mb-4">Supported: PDF, JPG, PNG, DOCX (Max 5MB)</p>
          <label className="inline-block">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            <Button as="span" className="cursor-pointer">
              Choose Files
            </Button>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-semibold">Uploaded Files:</p>
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                <File className="w-4 h-4 text-muted-foreground" />
                <span>{file.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
