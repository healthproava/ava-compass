import { useState, useEffect } from 'react';
import AvaWidget from '../components/AvaWidget';
import ResultsContainer from '../components/ResultsContainer';
import { useToast } from '@/hooks/use-toast';

const WidgetPage = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');
  const { toast } = useToast();
  
  // Listen for events from the widget
  useEffect(() => {
    const handleSearchResults = (event: CustomEvent) => {
      if (event.detail.facilities) {
        setFacilities(event.detail.facilities);
      }
      if (event.detail.summary) {
        setSummary(event.detail.summary);
      }
    };

    const handleDisplayData = (event: CustomEvent) => {
      console.log('Display data event:', event.detail);
      // Handle flexible data display
    };

    const handleShowToast = (event: CustomEvent) => {
      console.log('Show toast event:', event.detail);
      toast({
        title: "AVA Assistant",
        description: event.detail.message,
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <AvaWidget />
        <ResultsContainer 
          facilities={facilities}
          summary={summary}
          isVisible={facilities.length > 0 || !!summary}
        />
      </div>
    </div>
  );
};

export default WidgetPage;