import { useEffect, useState } from 'react';
import type { PlaceResult } from '../types/plan';

interface NominatimPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string];
  address?: {
    country_code?: string;
    [key: string]: unknown;
  };
}

// Focused country codes: Argentina, Latin America, North America, Europe
const PRIORITY_COUNTRY_CODES = [
  'ar', // Argentina
  'uy', 'cl', 'br', 'py', 'bo', 'pe', 'co', 'ec', 've', 'mx', 'cr', 'pa', 'do', 'gt', 'hn', 'sv', 'ni', 'cu', 'pr', // LATAM
  'us', 'ca', // North America
  'es', 'it', 'fr', 'de', 'pt', 'gb', 'ch', 'at', 'nl', 'be', 'ie', 'se', 'no', 'dk', 'pl', 'gr' // Europe
];

function getCountryRank(countryCode?: string): number {
  if (!countryCode) return 5;
  const cc = countryCode.toLowerCase();
  if (cc === 'ar') return 1; // Argentina top priority
  if (['uy', 'cl', 'br', 'py', 'bo', 'pe', 'co', 'ec', 've', 'mx', 'cr', 'pa', 'do', 'gt', 'hn', 'sv', 'ni', 'cu', 'pr'].includes(cc)) {
    return 2; // LATAM second
  }
  if (['us', 'ca'].includes(cc)) {
    return 3; // North America third
  }
  if (['es', 'it', 'fr', 'de', 'pt', 'gb', 'ch', 'at', 'nl', 'be', 'ie', 'se', 'no', 'dk', 'pl', 'gr'].includes(cc)) {
    return 4; // Europe fourth
  }
  return 5;
}

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export function usePlaceSearch(query: string): {status: SearchStatus;results: PlaceResult[];} {
  const [state, setState] = useState<{status: SearchStatus;results: PlaceResult[];}>({
    status: 'idle',
    results: []
  });

  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setState({ status: 'idle', results: [] });
      return;
    }
    const controller = new AbortController();
    setState((s) => ({ status: 'loading', results: s.results }));
    const timer = window.setTimeout(async () => {
      try {
        const countryCodesParam = PRIORITY_COUNTRY_CODES.join(',');
        // First try search focused on Argentina, LATAM, North America, and Europe
        let url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&accept-language=es,en&countrycodes=${countryCodesParam}&q=${encodeURIComponent(q)}`;
        let res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error('Search failed');
        let data = (await res.json()) as NominatimPlace[];

        // If no results found in preferred regions, fallback to worldwide search
        if (!data || data.length === 0) {
          url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&accept-language=es,en&q=${encodeURIComponent(q)}`;
          res = await fetch(url, { signal: controller.signal });
          if (res.ok) {
            data = (await res.json()) as NominatimPlace[];
          }
        }

        // Sort results: Argentina #1, LATAM #2, North America #3, Europe #4
        const sortedData = [...(data || [])].sort((a, b) => {
          const rankA = getCountryRank(a.address?.country_code);
          const rankB = getCountryRank(b.address?.country_code);
          return rankA - rankB;
        });

        setState({ status: 'success', results: sortedData.slice(0, 6).map(toPlace) });
      } catch {
        if (!controller.signal.aborted) setState({ status: 'error', results: [] });
      }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return state;
}

function toPlace(place: NominatimPlace): PlaceResult {
  const [label, ...rest] = place.display_name.split(',').map((s) => s.trim());
  const bb = place.boundingbox?.map(Number);
  return {
    id: String(place.place_id),
    label,
    secondary: rest.join(', '),
    lat: Number(place.lat),
    lng: Number(place.lon),
    bounds: bb && bb.every((n) => Number.isFinite(n)) ? [[bb[0], bb[2]], [bb[1], bb[3]]] : undefined
  };
}