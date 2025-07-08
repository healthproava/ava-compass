import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Maximize2, Download, NotebookText, Mail, FormInput, MapPin } from 'lucide-react';
import EmailDrafter from './content/EmailDrafter';
import DocumentCreator from './content/DocumentCreator';
import FormBuilder from './content/FormBuilder';
import InteractiveMap from './content/InteractiveMap';
import ResultsMarkdownDisplay from './ResultsMarkdownDisplay';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ContentRendererProps {
  contentType: 'facilities' | 'email' | 'document' | 'form' | 'map' | 'markdown';
  data?: any;
  summary?: string;
  isVisible?: boolean;
}

const ContentRenderer = ({ 
  contentType, 
  data, 
  summary,
  isVisible = false 
}: ContentRendererProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${contentType}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const renderContent = () => {
    switch (contentType) {
      case 'email':
        return (
          <div className="notebook-style bg-white border rounded-lg shadow-sm p-6 h-full">
            <div className="notebook-header flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Email Draft</h2>
                  <p className="text-sm text-gray-500">{data?.subject || 'Draft Email'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <EmailDrafter 
              initialData={data}
              onDownload={handleDownloadPDF}
            />
          </div>
        );
      case 'document':
        return (
          <div className="notebook-style bg-white border rounded-lg shadow-sm p-6 h-full">
            <div className="notebook-header flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-bright rounded-full flex items-center justify-center">
                  <NotebookText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Document</h2>
                  <p className="text-sm text-gray-500">{data?.title || summary || 'Generated Document'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <DocumentCreator 
              initialData={data}
              onDownload={handleDownloadPDF}
            />
          </div>
        );
      case 'form':
        return (
          <div className="notebook-style bg-white border rounded-lg shadow-sm p-6 h-full">
            <div className="notebook-header flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <FormInput className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Interactive Form</h2>
                  <p className="text-sm text-gray-500">{data?.title || 'Generated Form'}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <FormBuilder 
              initialData={data}
              onDownload={handleDownloadPDF}
            />
          </div>
        );
      case 'map':
        return (
          <div className="notebook-style bg-white border rounded-lg shadow-sm p-6 h-full">
            <div className="notebook-header flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Interactive Map</h2>
                  <p className="text-sm text-gray-500">Location visualization</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <InteractiveMap 
              markers={data?.markers || []}
              center={data?.center}
              zoom={data?.zoom}
              onDownload={handleDownloadPDF}
            />
          </div>
        );
      case 'markdown':
        return (
          <div className="notebook-style bg-white border rounded-lg shadow-sm p-6 h-full">
            <div className="notebook-header flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <NotebookText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Content Display</h2>
                  <p className="text-sm text-gray-500">Generated content</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <div className="prose max-w-none">
              {data && typeof data === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: data }} />
              ) : (
                <p>{summary || 'No content available'}</p>
              )}
            </div>
          </div>
        );
      case 'facilities':
      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">Search Results</h2>
                {data?.length > 0 && (
                  <Badge variant="secondary">
                    {data.length} results found
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
            <ResultsMarkdownDisplay
              facilities={data || []}
              summary={summary}
              onFacilitySelect={(facility) => {
                console.log('Selected facility:', facility);
              }}
            />
          </div>
        );
    }
  };

  if (!isVisible && contentType === 'facilities' && (!data || data.length === 0) && !summary) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-sm">Ask AVA for help with any task</p>
          <p className="text-xs mt-1 text-gray-400">Search, create documents, draft emails, build forms, or view maps</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div ref={contentRef} className="h-full">
        {renderContent()}
      </div>
      
      {/* Popup/Full Screen Option */}
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-2 right-2 opacity-50 hover:opacity-100"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <div ref={contentRef}>
            {renderContent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentRenderer;