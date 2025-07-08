export interface Facility {
  id: string;
  name: string;
  address: string;
  phone?: string;
  services?: string[];
  rating?: number;
  distance?: number;
  // Additional fields for compatibility with existing data
  address_line1?: string;
  latitude?: number;
  longitude?: number;
  reviews_count?: number;
  website?: string;
  facility_type?: string;
  image_urls?: string[];
}

export interface SearchResult {
  facilities: Facility[];
  summary: string;
  query: string;
  timestamp: Date;
}

export interface DisplayData {
  type: 'chart' | 'table' | 'card' | 'map';
  title: string;
  data: any;
}

export interface ToastMessage {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}