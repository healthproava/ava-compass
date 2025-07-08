import { useState, useCallback } from 'react';
import { SearchResult, DisplayData } from '../types';

export const useWidgetState = () => {
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [displayData, setDisplayData] = useState<DisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchResults = useCallback((results: SearchResult) => {
    setSearchResults(results);
    setError(null);
  }, []);

  const handleDisplayData = useCallback((data: DisplayData) => {
    setDisplayData(prev => [...prev, data]);
  }, []);

  const clearDisplayData = useCallback(() => {
    setDisplayData([]);
  }, []);

  const clearSearchResults = useCallback(() => {
    setSearchResults(null);
  }, []);

  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setErrorState = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  return {
    // State
    searchResults,
    displayData,
    isLoading,
    error,
    
    // Actions
    handleSearchResults,
    handleDisplayData,
    clearDisplayData,
    clearSearchResults,
    setLoadingState,
    setErrorState,
  };
};