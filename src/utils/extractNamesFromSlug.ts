export interface CoupleNames {
  groomName: string;
  brideName: string;
}

export const extractNamesFromSlug = (clientSlug: string): CoupleNames => {
  // Split by dash and capitalize each name
  const parts = clientSlug.split('-');
  
  if (parts.length >= 2) {
    const groomName = capitalizeFirstLetter(parts[0]);
    const brideName = capitalizeFirstLetter(parts[1]);
    
    return {
      groomName,
      brideName
    };
  }

  // Fallback if format is unexpected
  return {
    groomName: 'Pengantin Pria',
    brideName: 'Pengantin Wanita'
  };
};

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Helper function to create slug from names
export const createSlugFromNames = (groomName: string, brideName: string): string => {
  const cleanGroom = groomName.toLowerCase().replace(/\s+/g, '-');
  const cleanBride = brideName.toLowerCase().replace(/\s+/g, '-');
  return `${cleanGroom}-${cleanBride}`;
};