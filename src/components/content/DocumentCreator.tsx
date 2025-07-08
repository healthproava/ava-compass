import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Download, FileText } from 'lucide-react';

interface DocumentCreatorProps {
  initialData?: {
    title?: string;
    type?: string;
    content?: string;
  };
  onSave?: (documentData: any) => void;
  onDownload?: () => void;
}

const DocumentCreator = ({ initialData, onSave, onDownload }: DocumentCreatorProps) => {
  const [documentData, setDocumentData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || 'letter',
    content: initialData?.content || ''
  });

  const documentTypes = [
    { value: 'letter', label: 'Letter' },
    { value: 'report', label: 'Report' },
    { value: 'memo', label: 'Memo' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'contract', label: 'Contract' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (field: string, value: string) => {
    setDocumentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Create Document</h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button size="sm" onClick={() => onSave?.(documentData)}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Document Title</Label>
          <Input
            id="title"
            placeholder="Enter document title"
            value={documentData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="type">Document Type</Label>
          <Select value={documentData.type} onValueChange={(value) => handleChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="content">Document Content</Label>
          <Textarea
            id="content"
            placeholder="Start writing your document..."
            className="min-h-[400px]"
            value={documentData.content}
            onChange={(e) => handleChange('content', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default DocumentCreator;