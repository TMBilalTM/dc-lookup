import { useState } from 'react';
import Image from 'next/image';

// Sample function to fetch SVG content (you can adapt this based on your server or API setup)
async function fetchBadgeSvg(badgeName) {
    try {
      const response = await fetch(`/svg/badges/${badgeName}.svg`);
      if (!response.ok) {
        throw new Error('Failed to fetch badge SVG');
      }
      const svgContent = await response.text();
      return svgContent;
    } catch (error) {
      console.error('Error fetching badge SVG:', error);
      return null;
    }
  }


export default function BadgeDisplayPage() {
  const [badgeSvg, setBadgeSvg] = useState(null);
  const [error, setError] = useState(null);

  const handleBadgeLoad = async (badgeName) => {
    const svgContent = await fetchBadgeSvg(badgeName);
    if (svgContent) {
      setBadgeSvg(svgContent);
      setError(null);
    } else {
      setError('Failed to load badge SVG');
    }
  };

  return (
    <div>
      <h1>Dynamic SVG Badge Display</h1>
      <button onClick={() => handleBadgeLoad('activedeveloper')}>
        Load Badge 1
      </button>
      <button onClick={() => handleBadgeLoad('badge2')}>
        Load Badge 2
      </button>
      {badgeSvg && (
        <div dangerouslySetInnerHTML={{ __html: badgeSvg }} />
      )}
      {error && (
        <p>Error loading badge: {error}</p>
      )}
    </div>
  );
}
