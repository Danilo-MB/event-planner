import type { LatLng, PlanFeature, RouteWaypoint } from '../types/plan';

export interface SampleWaypointData {
  title: string;
  caption: string;
  image: string;
}

export const SAMPLE_STREETVIEW_WAYPOINTS: SampleWaypointData[] = [
  {
    title: 'Acceso y Entrada Principal',
    caption: 'Pórtico de bienvenida, control de acreditaciones y acceso peatonal al evento.',
    image: '/streetview/point1_entrance.jpg',
  },
  {
    title: 'Paseo Central Arbolado',
    caption: 'Avenida principal con jardines florales, cartelería digital y circulación fluida.',
    image: '/streetview/point2_promenade.jpg',
  },
  {
    title: 'Pabellón de Stands y Sponsors',
    caption: 'Pabellones modernos, carpas de exhibición, stands de marcas y demostraciones.',
    image: '/streetview/point3_stands.jpg',
  },
  {
    title: 'Patio Gastronómico & Food Trucks',
    caption: 'Pérgolas de madera con guirnaldas de luces, mesas al aire libre y variedad culinaria.',
    image: '/streetview/point4_foodcourt.jpg',
  },
  {
    title: 'Plaza Central & Escenario Principal',
    caption: 'Gran explanada verde para el público con escenario central y shows en vivo.',
    image: '/streetview/point5_plaza.jpg',
  },
];

export const SAMPLE_INDUSTRIAL_WAYPOINTS: SampleWaypointData[] = [
  {
    title: 'Acceso Principal y Garita de Control',
    caption: 'Portón corredizo con barreras vehiculares automáticas y garita de vigilancia.',
    image: '/streetview/logistica/path1_pt0.jpg',
  },
  {
    title: 'Báscula y Pesaje de Camiones',
    caption: 'Puesto de pesaje con balanza integrada para camiones pesados y control de remitos.',
    image: '/streetview/logistica/path1_pt1.jpg',
  },
  {
    title: 'Avenida Central de Circulación Logística',
    caption: 'Arteria de doble mano flanqueada por depósitos y centros de distribución con dársenas.',
    image: '/streetview/logistica/path1_pt2.jpg',
  },
  {
    title: 'Derivador Sector Cargas y Almacén 2',
    caption: 'Intersección señalizada hacia docks de carga, almacenes y oficinas operativas.',
    image: '/streetview/logistica/path1_pt3.jpg',
  },
  {
    title: 'Dársenas y Muelles de Carga (Bays 10-12)',
    caption: 'Muelles de carga con fuelles neumáticos y rampas hidráulicas para semirremolques.',
    image: '/streetview/logistica/path2_pt2.jpg',
  },
  {
    title: 'Operación de Docks y Autoelevadores',
    caption: 'Zona activa de carga y descarga de pallets estandarizados con autoelevadores eléctricos.',
    image: '/streetview/logistica/path2_pt3.jpg',
  },
  {
    title: 'Playa de Acopio Exterior y Expedición',
    caption: 'Racks industriales de exterior para mercadería pesada y playa de preparación para despacho final.',
    image: '/streetview/logistica/path2_pt4.jpg',
  },
  {
    title: 'Terminal Norte de Contenedores y Carga',
    caption: 'Playa de maniobras norte con acopio de contenedores intermodales y grúa pórtico.',
    image: '/streetview/logistica/path1_pt5.jpg',
  },
];

export const SAMPLE_REALESTATE_WAYPOINTS: SampleWaypointData[] = [
  {
    title: 'Vista Aérea General - Acceso Norte',
    caption: 'Perspectiva aérea panorámica de la traza de Barrio Carlina y el entorno de Los Cardales.',
    image: '/streetview/carlina/real_1_vista_aerea.jpg',
  },
  {
    title: 'Apertura de Traza y Maquinaria Pesada',
    caption: 'Operación de excavadora y camiones volcadores consolidando la calzada de tosca.',
    image: '/streetview/carlina/real_5_maquinaria_camion.jpg',
  },
  {
    title: 'Avenidas Principales del Loteo',
    caption: 'Apertura de las arterias viales principales en dirección al óvalo central.',
    image: '/streetview/carlina/real_3_avenidas_boulevard.jpg',
  },
  {
    title: 'Zanjeo y Tendido de Redes Subterráneas',
    caption: 'Excavación precisa sobre traza delimitada para desagües pluviales y servicios.',
    image: '/streetview/carlina/real_4_excavacion_zenital.jpg',
  },
  {
    title: 'Manzanas y Pilares de Conexión Eléctrica',
    caption: 'Calzada interna consolidada con pilares de servicio ya instalados en frentes de parcelas.',
    image: '/streetview/carlina/real_2_pilares_servicios.jpg',
  },
  {
    title: 'Forestación de Parcelas con Tractor',
    caption: 'Operarios y tractor John Deere plantando pinos jóvenes para cortinas forestales de vereda.',
    image: '/streetview/carlina/real_6_forestacion_tractor.jpg',
  },
  {
    title: 'Área de Visitas y Gazebos Comerciales',
    caption: 'Sector de atención y presentación comercial al aire libre con gazebos y fardos campestres.',
    image: '/streetview/carlina/real_9_reunion_gazebos.jpg',
  },
  {
    title: 'Showroom Modular CARLINA',
    caption: 'Oficina de ventas y atención comercial de Barrio Carlina revestida en madera.',
    image: '/streetview/carlina/real_8_showroom_carlina.jpg',
  },
  {
    title: 'Sendero Rural y Tranquera al Atardecer',
    caption: 'Sendero arbolado con tranquera de madera y vistas al atardecer en Los Cardales.',
    image: '/streetview/carlina/real_10_sendero_tranquera.jpg',
  },
];

/**
 * Returns the appropriate sample list of waypoints based on feature context.
 */
export function getSampleListForFeature(featureContext?: PlanFeature | boolean): SampleWaypointData[] {
  if (typeof featureContext === 'boolean') {
    return featureContext ? SAMPLE_INDUSTRIAL_WAYPOINTS : SAMPLE_STREETVIEW_WAYPOINTS;
  }
  if (!featureContext) return SAMPLE_STREETVIEW_WAYPOINTS;

  const name = (featureContext.name || '').toLowerCase();
  const cat = (featureContext.categoryId || '').toLowerCase();

  const isIndustrial =
    cat === 'industrial' ||
    name.includes('logistica') ||
    name.includes('carga') ||
    name.includes('deposito') ||
    name.includes('hormigon') ||
    name.includes('industrial');

  if (isIndustrial) return SAMPLE_INDUSTRIAL_WAYPOINTS;

  const isRealEstate =
    cat === 'streets' ||
    cat === 'lots' ||
    name.includes('boulevard') ||
    name.includes('barrio') ||
    name.includes('lote') ||
    name.includes('obra') ||
    name.includes('calle') ||
    name.includes('avenida') ||
    name.includes('traza') ||
    name.includes('manzana');

  if (isRealEstate) return SAMPLE_REALESTATE_WAYPOINTS;

  return SAMPLE_STREETVIEW_WAYPOINTS;
}

/**
 * Returns waypoints filled with sample photos for a given number of coordinates.
 */
export function generateSampleWaypointsForCoords(
  coordsCount: number,
  featureContext?: PlanFeature | boolean
): RouteWaypoint[] {
  const samplesList = getSampleListForFeature(featureContext);
  const waypoints: RouteWaypoint[] = [];
  const count = Math.max(coordsCount, 1);
  for (let i = 0; i < count; i++) {
    const sample = samplesList[i % samplesList.length];
    const isSingleCycle = count <= samplesList.length;
    waypoints.push({
      index: i,
      title: isSingleCycle ? sample.title : `${sample.title} (${i + 1})`,
      caption: sample.caption,
      image: sample.image,
    });
  }
  return waypoints;
}

/**
 * Checks if a feature has at least one waypoint photo.
 */
export function hasStreetViewPhotos(feature: PlanFeature | null | undefined): boolean {
  if (!feature || feature.kind !== 'line') return false;
  if (!feature.routeWaypoints || feature.routeWaypoints.length === 0) return false;
  return feature.routeWaypoints.some((w) => !!w.image && w.image.trim().length > 0);
}

/**
 * Returns effective waypoints for all coordinates in a feature.
 * If a coordinate has no explicit waypoint entry, provides a default entry.
 */
export function getEffectiveWaypoints(feature: PlanFeature): RouteWaypoint[] {
  if (feature.kind !== 'line') return [];
  const coordsCount = feature.coords.length;
  const existingMap = new Map<number, RouteWaypoint>();
  (feature.routeWaypoints || []).forEach((w) => existingMap.set(w.index, w));

  const result: RouteWaypoint[] = [];
  for (let i = 0; i < coordsCount; i++) {
    if (existingMap.has(i)) {
      result.push(existingMap.get(i)!);
    } else {
      result.push({
        index: i,
        title: `Punto ${i + 1}`,
      });
    }
  }
  return result;
}

/**
 * Calculate geographical bearing between two points in degrees (0 - 360).
 */
export function calculateBearing(start: LatLng, end: LatLng): number {
  const [lat1, lon1] = start;
  const [lat2, lon2] = end;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
}

/**
 * Human-readable compass direction name.
 */
export function getCompassDirection(bearing: number): string {
  const directions = [
    { label: 'Norte', min: 337.5, max: 360 },
    { label: 'Norte', min: 0, max: 22.5 },
    { label: 'Noreste', min: 22.5, max: 67.5 },
    { label: 'Este', min: 67.5, max: 112.5 },
    { label: 'Sureste', min: 112.5, max: 157.5 },
    { label: 'Sur', min: 157.5, max: 202.5 },
    { label: 'Suroeste', min: 202.5, max: 247.5 },
    { label: 'Oeste', min: 247.5, max: 292.5 },
    { label: 'Noroeste', min: 292.5, max: 337.5 },
  ];

  for (const d of directions) {
    if (bearing >= d.min && bearing < d.max) return d.label;
  }
  return 'Norte';
}
