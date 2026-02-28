'use client';

import React, { useState } from 'react';
import { useKiosk } from '@/lib/kiosk-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Upload, FileCheck, Loader } from 'lucide-react';
import { t } from '@/lib/translations';

interface DigiLockerUploadProps {
  onComplete?: (documentId: string, fileName: string) => void;
  documentType?: string;
}

export default function DigiLockerUpload({ onComplete, documentType = 'application' }: DigiLockerUploadProps) {
  const { language, speak } = useKiosk();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; id: string }[]>([]);
  const [error, setError] = useState('');

  const handleDemoDigiLockerAuth = async () => {
    setIsLoading(true);
    const message = `Opening DigiLocker authorization. Please authenticate with your credentials for ${documentType}`;
    speak(message);
    
    // Simulate DigiLocker auth
    setTimeout(() => {
      setIsLoading(false);
      speak('DigiLocker authenticated. Ready to upload documents.');
      
      // Mock document selection
      const mockDocuments = [
        { name: 'Aadhaar Document', id: 'aadhaar_123' },
        { name: 'PAN Card', id: 'pan_456' },
        { name: 'Address Proof', id: 'address_789' },
      ];
      
      setUploadedFiles(mockDocuments);
    }, 2000);
  };

  const handleFileSelect = (file: { name: string; id: string }) => {
    speak(`Selected ${file.name}`);
    if (onComplete) {
      onComplete(file.id, file.name);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-2 bg-gradient-to-r from-primary/5 to-accent/5">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          {t('document_upload', language)}
        </h3>

        {!uploadedFiles.length && !isLoading && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Upload documents securely through DigiLocker or file system
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleDemoDigiLockerAuth}
                disabled={isLoading}
                className="h-20 flex flex-col items-center justify-center gap-2 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span className="text-xs">Connecting...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    <span>{t('digilocker', language)}</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 border-2"
              >
                <Upload className="w-6 h-6" />
                <span className="text-xs">{t('upload_document', language)}</span>
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Authenticating with DigiLocker...</p>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <FileCheck className="w-5 h-5" />
              <span className="font-semibold">Available Documents</span>
            </div>

            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <Button
                  key={file.id}
                  onClick={() => handleFileSelect(file)}
                  variant="outline"
                  className="w-full h-16 justify-start gap-3 border-2 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <FileCheck className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.id}</p>
                  </div>
                </Button>
              ))}
            </div>

            <Button
              onClick={() => {
                setUploadedFiles([]);
                speak('DigiLocker session closed');
              }}
              variant="outline"
              className="w-full"
            >
              {t('close', language)}
            </Button>
          </div>
        )}
      </Card>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-muted-foreground">
        <p className="font-semibold mb-2">💡 {t('document_upload', language)} Info:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Supported formats: PDF, JPG, PNG, DOCX</li>
          <li>Maximum file size: 5 MB</li>
          <li>Documents are encrypted and stored securely</li>
          <li>Access DigiLocker for verified government-issued documents</li>
        </ul>
      </div>
    </div>
  );
}
