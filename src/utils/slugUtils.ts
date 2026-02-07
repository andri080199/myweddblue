export interface CoupleNames {
  bride: string;
  groom: string;
  initials: string;
  fullNames: string;
}

export function parseCoupleFromSlug(clientSlug: string): CoupleNames {
  if (!clientSlug) {
    return {
      bride: 'Bride',
      groom: 'Groom', 
      initials: 'B & G',
      fullNames: 'Bride & Groom'
    };
  }

  // Split by dash and capitalize each name
  const parts = clientSlug.split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  const bride = parts[0] || 'Bride';
  const groom = parts[1] || 'Groom';
  
  // Get first letter of each name for initials
  const brideInitial = bride.charAt(0).toUpperCase();
  const groomInitial = groom.charAt(0).toUpperCase();
  
  return {
    bride,
    groom,
    initials: `${brideInitial} & ${groomInitial}`,
    fullNames: `${bride} & ${groom}`
  };
}