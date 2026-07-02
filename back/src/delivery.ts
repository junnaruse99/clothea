import { DeliveryConfig, DeliveryQuote, District } from "./types";

/** Distancia Haversine en km entre dos coordenadas. */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Algoritmo de precio de delivery (personalizable desde el panel admin):
 *
 *   tarifa = max(minFee, baseFee + perKmFee * distancia_km) + recargo_distrito
 *   gratis si subtotal >= freeThreshold (y freeThreshold > 0)
 *
 * La distancia se calcula desde la ubicación de la tienda (originLat/Lng)
 * hasta el centro del distrito elegido.
 */
export function computeDeliveryQuote(
  cfg: DeliveryConfig,
  district: District,
  subtotal: number
): DeliveryQuote {
  const distanceKm = haversineKm(
    cfg.originLat,
    cfg.originLng,
    district.lat,
    district.lng
  );
  const raw = Math.max(cfg.minFee, cfg.baseFee + cfg.perKmFee * distanceKm);
  const fee = Math.round((raw + district.surcharge) * 10) / 10;
  const freeDelivery = cfg.freeThreshold > 0 && subtotal >= cfg.freeThreshold;
  return {
    districtId: district.id,
    districtName: district.name,
    distanceKm: Math.round(distanceKm * 10) / 10,
    fee: freeDelivery ? 0 : fee,
    freeDelivery,
  };
}
