import { useState, useEffect } from 'react';
import AvaWidget from '../components/AvaWidget';
import ResultsContainer from '../components/ResultsContainer';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const WidgetPage = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');
  const { toast } = useToast();
  
  // Listen for events from the widget
  useEffect(() => {
    const handleSearchResults = (event: CustomEvent) => {
      console.log('Search results event:', event.detail);
      if (event.detail.facilities) {
        setFacilities(event.detail.facilities);
        // Show results in toast
        const facilityCount = event.detail.facilities.length;
        toast({
          title: "Search Results",
          description: `Found ${facilityCount} facilities matching your criteria`,
          duration: 4000,
        });
      }
      if (event.detail.summary) {
        setSummary(event.detail.summary);
        toast({
          title: "Search Summary",
          description: event.detail.summary,
          duration: 6000,
        });
      }
    };

    const handleDisplayData = (event: CustomEvent) => {
      console.log('Display data event:', event.detail);
      // Handle flexible data display
    };

    const handleShowToast = (event: CustomEvent) => {
      console.log('Show toast event:', event.detail);
      console.log('Toast being triggered with message:', event.detail.message);
      toast({
        title: "AVA Assistant",
        description: event.detail.message,
        duration: 5000, // Show for 5 seconds
      });
    };

    window.addEventListener('show-search-results', handleSearchResults as EventListener);
    window.addEventListener('display-data', handleDisplayData as EventListener);
    window.addEventListener('show-toast', handleShowToast as EventListener);

    return () => {
      window.removeEventListener('show-search-results', handleSearchResults as EventListener);
      window.removeEventListener('display-data', handleDisplayData as EventListener);
      window.removeEventListener('show-toast', handleShowToast as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - AVA Widget */}
      <div className="w-1/2 p-4 border-r relative">
        <AvaWidget isFullScreen={true} />
        
        {/* Results indicator overlay when we have results */}
        {(facilities.length > 0 || summary) && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-sky-100 border border-sky-300 rounded-lg p-3 shadow-lg animate-fade-in">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                <span className="text-sky-700 text-sm font-medium">
                  {facilities.length > 0 && `Found ${facilities.length} facilities`}
                  {summary && facilities.length === 0 && "Search completed"}
                </span>
                <span className="text-sky-600 text-xs">→ See results panel</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Right side - Results */}
      <div className="w-1/2 p-4 relative">
        <ResultsContainer 
          facilities={facilities}
          summary={summary}
          isVisible={true}
        />
      </div>
      
      <Toaster />
    </div>
  );
};

export default WidgetPage;