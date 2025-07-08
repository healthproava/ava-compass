import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Save, Download } from 'lucide-react';

interface EmailDrafterProps {
  initialData?: {
    to?: string;
    subject?: string;
    body?: string;
  };
  onSave?: (emailData: any) => void;
  onSend?: (emailData: any) => void;
  onDownload?: () => void;
}

const EmailDrafter = ({ initialData, onSave, onSend, onDownload }: EmailDrafterProps) => {
  const [emailData, setEmailData] = useState({
    to: initialData?.to || '',
    cc: '',
    bcc: '',
    subject: initialData?.subject || '',
    body: initialData?.body || ''
  });

  const handleChange = (field: string, value: string) => {
    setEmailData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Draft Email</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => onSave?.(emailData)}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button size="sm" onClick={() => onSend?.(emailData)}>
            <Send className="h-4 w-4 mr-1" />
            Send
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            type="email"
            placeholder="recipient@email.com"
            value={emailData.to}
            onChange={(e) => handleChange('to', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cc">CC</Label>
            <Input
              id="cc"
              type="email"
              placeholder="cc@email.com"
              value={emailData.cc}
              onChange={(e) => handleChange('cc', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bcc">BCC</Label>
            <Input
              id="bcc"
              type="email"
              placeholder="bcc@email.com"
              value={emailData.bcc}
              onChange={(e) => handleChange('bcc', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Email subject"
            value={emailData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="body">Message</Label>
          <Textarea
            id="body"
            placeholder="Compose your message..."
            className="min-h-[300px]"
            value={emailData.body}
            onChange={(e) => handleChange('body', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default EmailDrafter;