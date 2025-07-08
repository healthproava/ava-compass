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
      <div className="w-1/2 p-4 border-r">
        <AvaWidget isFullScreen={true} />
      </div>
      
      {/* Right side - Results */}
      <div className="w-1/2 p-4">
        <ResultsContainer 
          facilities={facilities}
          summary={summary}
          isVisible={facilities.length > 0 || !!summary}
        />
      </div>
      
      <Toaster />
    </div>
  );
};

export default WidgetPage;