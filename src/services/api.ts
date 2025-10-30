export interface MGNREGAData {
  totalWorkers: number;
  totalWages: number;
  households: number;
  employmentDays: number;
  workCompleted: number;
  budgetUtilization: number;
  lastUpdated: string;
}

export interface ChartData {
  month: string;
  workers: number;
  wages: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mgnrega-backend-vq9h.onrender.com/api';

const apiRequest = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchDistrictData = async (district: string): Promise<MGNREGAData> => {
  return await apiRequest(`/districts/${encodeURIComponent(district)}`);
};

export const fetchChartData = async (district: string): Promise<ChartData[]> => {
  return await apiRequest(`/districts/${encodeURIComponent(district)}/chart`);
};

export const fetchAllDistricts = async (): Promise<string[]> => {
  return await apiRequest('/districts');
};

export const fetchDistrictsByState = async (state: string): Promise<string[]> => {
  return await apiRequest(`/districts/state/${encodeURIComponent(state)}`);
};

export const fetchAllStates = async (): Promise<string[]> => {
  return await apiRequest('/states');
};

export interface LocationDetectionResult {
  district: string;
  state: string;
  formatted_address: string;
  available: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  detectedDistrict?: string;
  matchedDistrict?: string | null;
}

export const detectUserLocation = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 20000, // Increased timeout
      maximumAge: 300000 // 5 minute cache
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(`${API_BASE_URL}/location/detect`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to detect location');
          }

          const locationData: LocationDetectionResult = await response.json();
          
          if (!locationData.available) {
            throw new Error(`District '${locationData.district}' detected but no MGNREGA data available. Please select manually.`);
          }
          
          resolve(locationData.district);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        let errorMessage = 'Location detection failed';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access in your browser settings and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Please ensure GPS is enabled and you have a stable internet connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location detection timed out. Please try again or select your district manually.';
            break;
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
};

export const getDetailedLocation = async (): Promise<LocationDetectionResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(`${API_BASE_URL}/location/detect`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to detect location');
          }

          const locationData = await response.json();
          resolve(locationData);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        let errorMessage = 'Location detection failed';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location detection timed out';
            break;
          default:
            errorMessage = `Geolocation error: ${error.message}`;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 300000
      }
    );
  });
};