import type { Category, FeatureKind } from '../types/plan';
import type { Language } from '../locales/translations';

const CATEGORY_NAMES_ES_TO_EN: Record<string, string> = {
  'lotes': 'Lots',
  'calles': 'Streets',
  'calles y accesos': 'Streets',
  'espacios verdes': 'Green spaces',
  'amenidades': 'Amenities',
  'áreas comunes': 'Common areas',
  'areas comunes': 'Common areas',
  'puntos de interés': 'Points of interest',
  'puntos de interes': 'Points of interest',
  'zonas': 'Zones',
  'escenarios y shows': 'Stages & shows',
  'gastronomía y bebidas': 'Food & drinks',
  'gastronomia y bebidas': 'Food & drinks',
  'estacionamiento': 'Parking',
  'accesos y senderos': 'Access & paths',
  'seguridad y servicios': 'Safety & services',
  'muelles y dársenas': 'Docks & Bays',
  'muelles y darsenas': 'Docks & Bays',
  'almacén y racks': 'Storage & Racks',
  'almacen y racks': 'Storage & Racks',
  'playa de camiones': 'Truck yard',
  'pasillos de autoelevador': 'Forklift aisles',
  'control y oficinas': 'Control & Offices',
  'extintores y seguridad': 'Safety & Extinguishers',
  'naves de producción': 'Production halls',
  'naves de produccion': 'Production halls',
  'línea de montaje': 'Assembly line',
  'linea de montaje': 'Assembly line',
  'patio de materiales': 'Raw material yards',
  'expedición y docks': 'Shipping & Docks',
  'expedicion y docks': 'Shipping & Docks',
  'subestación y servicios': 'Utilities & Power',
  'subestacion y servicios': 'Utilities & Power',
  'enfermería y seguridad': 'Medical & Safety',
  'enfermeria y seguridad': 'Medical & Safety',
  'áreas': 'Areas',
  'areas': 'Areas',
  'recorridos': 'Paths',
  'marcadores': 'Markers',
};

const CATEGORY_NAMES_EN_TO_ES: Record<string, string> = {
  'lots': 'Lotes',
  'streets': 'Calles y accesos',
  'green spaces': 'Espacios verdes',
  'amenities': 'Amenidades',
  'common areas': 'Áreas comunes',
  'points of interest': 'Puntos de interés',
  'zones': 'Zonas',
  'stages & shows': 'Escenarios y shows',
  'stages and shows': 'Escenarios y shows',
  'food & drinks': 'Gastronomía y bebidas',
  'food and drinks': 'Gastronomía y bebidas',
  'parking': 'Estacionamiento',
  'access & paths': 'Accesos y senderos',
  'access and paths': 'Accesos y senderos',
  'safety & services': 'Seguridad y servicios',
  'safety and services': 'Seguridad y servicios',
  'docks & bays': 'Muelles y Dársenas',
  'docks and bays': 'Muelles y Dársenas',
  'storage & racks': 'Almacén y Racks',
  'storage and racks': 'Almacén y Racks',
  'truck yard': 'Playa de camiones',
  'forklift aisles': 'Pasillos de autoelevador',
  'control & offices': 'Control y Oficinas',
  'control and offices': 'Control y Oficinas',
  'safety & extinguishers': 'Extintores y Seguridad',
  'safety and extinguishers': 'Extintores y Seguridad',
  'production halls': 'Naves de producción',
  'assembly line': 'Línea de montaje',
  'raw material yards': 'Patio de materiales',
  'shipping & docks': 'Expedición y Docks',
  'shipping and docks': 'Expedición y Docks',
  'utilities & power': 'Subestación y Servicios',
  'medical & safety': 'Enfermería y Seguridad',
  'areas': 'Áreas',
  'paths': 'Recorridos',
  'markers': 'Marcadores',
};

const CATEGORY_ID_MAP: Record<string, { es: string; en: string }> = {
  lots: { es: 'Lotes', en: 'Lots' },
  streets: { es: 'Calles y accesos', en: 'Streets' },
  green: { es: 'Espacios verdes', en: 'Green spaces' },
  amenities: { es: 'Amenidades', en: 'Amenities' },
  common: { es: 'Áreas comunes', en: 'Common areas' },
  poi: { es: 'Puntos de interés', en: 'Points of interest' },
  zones: { es: 'Zonas', en: 'Zones' },
  stages: { es: 'Escenarios y shows', en: 'Stages & shows' },
  food: { es: 'Gastronomía y bebidas', en: 'Food & drinks' },
  parking: { es: 'Estacionamiento', en: 'Parking' },
  access: { es: 'Accesos y senderos', en: 'Access & paths' },
  safety: { es: 'Seguridad y servicios', en: 'Safety & services' },
  docks: { es: 'Muelles y Dársenas', en: 'Docks & Bays' },
  storage: { es: 'Almacén y Racks', en: 'Storage & Racks' },
  yard: { es: 'Playa de camiones', en: 'Truck yard' },
  aisles: { es: 'Pasillos de autoelevador', en: 'Forklift aisles' },
  office: { es: 'Control y Oficinas', en: 'Control & Offices' },
  production: { es: 'Naves de producción', en: 'Production halls' },
  assembly: { es: 'Línea de montaje', en: 'Assembly line' },
  materials: { es: 'Patio de materiales', en: 'Raw material yards' },
  shipping: { es: 'Expedición y Docks', en: 'Shipping & Docks' },
  services: { es: 'Subestación y Servicios', en: 'Utilities & Power' },
  medical: { es: 'Enfermería y Seguridad', en: 'Medical & Safety' },
  areas: { es: 'Áreas', en: 'Areas' },
  paths: { es: 'Recorridos', en: 'Paths' },
  points: { es: 'Marcadores', en: 'Markers' },
};

export function getCategoryDisplayName(category?: Category | null, language: Language = 'es'): string {
  if (!category) return '';
  const rawName = (category.name || '').trim();
  const lowerName = rawName.toLowerCase();

  if (language === 'es') {
    if (CATEGORY_NAMES_EN_TO_ES[lowerName]) {
      return CATEGORY_NAMES_EN_TO_ES[lowerName];
    }
    if (category.id && CATEGORY_ID_MAP[category.id]) {
      return CATEGORY_ID_MAP[category.id].es;
    }
  } else {
    if (CATEGORY_NAMES_ES_TO_EN[lowerName]) {
      return CATEGORY_NAMES_ES_TO_EN[lowerName];
    }
    if (category.id && CATEGORY_ID_MAP[category.id]) {
      return CATEGORY_ID_MAP[category.id].en;
    }
  }

  return rawName || (language === 'es' ? 'Capa sin título' : 'Untitled layer');
}

export function getFeatureKindLabel(kind: FeatureKind, language: Language = 'es'): string {
  if (language === 'es') {
    switch (kind) {
      case 'area':
        return 'Área';
      case 'line':
        return 'Recorrido';
      case 'point':
        return 'Marcador';
    }
  }
  switch (kind) {
    case 'area':
      return 'Area';
    case 'line':
      return 'Path';
    case 'point':
      return 'Marker';
  }
}
