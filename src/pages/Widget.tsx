import { useCallback } from 'react';
import AvaWidget from '../components/AvaWidget';
import ResultsContainer from '../components/ResultsContainer';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useWidgetState } from '../hooks/useWidgetState';
import { SearchResult, DisplayData, ToastMessage } from '../types';

interface WidgetPageProps {
  className?: string;
}

const WidgetPage: React.FC<WidgetPageProps> = ({ className }) => {
  const { toast } = useToast();
  const {
    searchResults,
    displayData,
    isLoading,
    error,
    handleSearchResults,
    handleDisplayData,
    clearDisplayData,
    clearSearchResults,
    setLoadingState,
    setErrorState,
  } = useWidgetState();

  // Handler for search results from AVA widget
  const onSearchResults = useCallback((results: SearchResult) => {
    handleSearchResults(results);
    
    // Show success toast
    const facilityCount = results.facilities.length;
    toast({
      title: "Search Results",
      description: `Found ${facilityCount} facilities matching your criteria`,
      duration: 4000,
    });
  }, [handleSearchResults, toast]);

  // Handler for display data from AVA widget
  const onDisplayData = useCallback((data: DisplayData) => {
    handleDisplayData(data);
    
    toast({
      title: "Data Visualization",
      description: `Added ${data.type}: ${data.title}`,
      duration: 3000,
    });
  }, [handleDisplayData, toast]);

  // Handler for toast messages from AVA widget
  const onShowToast = useCallback((message: ToastMessage) => {
    toast({
      title: message.title,
      description: message.description,
      variant: message.variant || 'default',
      duration: message.duration || 5000,
    });
  }, [toast]);

  // Handler for loading state changes
  const onLoadingChange = useCallback((loading: boolean) => {
    setLoadingState(loading);
  }, [setLoadingState]);

  // Handler for errors
  const onError = useCallback((errorMessage: string) => {
    setErrorState(errorMessage);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
      duration: 6000,
    });
  }, [setErrorState, toast]);

  // Clear all data
  const handleClearAll = useCallback(() => {
    clearSearchResults();
    clearDisplayData();
    setErrorState(null);
  }, [clearSearchResults, clearDisplayData, setErrorState]);

  return (
    <div className={`min-h-screen bg-background flex ${className || ''}`}>
      {/* Left side - AVA Widget */}
      <div className="w-1/2 p-4 border-r relative">
        <AvaWidget 
          isFullScreen={true}
          onSearchResults={onSearchResults}
          onDisplayData={onDisplayData}
          onShowToast={onShowToast}
          onLoadingChange={onLoadingChange}
          onError={onError}
          isLoading={isLoading}
        />
        
        {/* Results indicator overlay when we have results */}
        {(searchResults?.facilities.length || searchResults?.summary) && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-sky-100 border border-sky-300 rounded-lg p-3 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                  <span className="text-sky-700 text-sm font-medium">
                    {searchResults.facilities.length > 0 && 
                      `Found ${searchResults.facilities.length} facilities`}
                    {searchResults.summary && searchResults.facilities.length === 0 && 
                      "Search completed"}
                  </span>
                  <span className="text-sky-600 text-xs">→ See results panel</span>
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-sky-600 hover:text-sky-800 text-xs underline"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 shadow-lg flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-500"></div>
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-red-100 border border-red-300 rounded-lg p-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 text-sm font-medium">Error</span>
                </div>
                <button
                  onClick={() => setErrorState(null)}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Right side - Results */}
      <div className="w-1/2 p-4 relative">
        <ResultsContainer 
          searchResults={searchResults}
          displayData={displayData}
          isVisible={true}
          isLoading={isLoading}
          error={error}
          onClearResults={clearSearchResults}
          onClearDisplayData={clearDisplayData}
          onClearAll={handleClearAll}
        />
      </div>
      
      <Toaster />
    </div>
  );
};

export default WidgetPage;