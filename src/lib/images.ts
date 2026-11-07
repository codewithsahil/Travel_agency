/** Unsplash helper. Only the photo id is stored in data; width is chosen per usage. */
export function unsplash(id: string, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}`
}

/** Curated photo ids, grouped by purpose, so pages never hard-code URLs. */
export const photos = {
  // hero slideshow
  heroBali: "1537996194471-e657df975ab4",
  heroSantorini: "1570077188670-e3a8d69ac5ff",
  heroLake: "1501785888041-af3ef285b470",
  heroBeach: "1507525428034-b723cf961d3e",
  // page headers & banners
  destinationsHeader: "1469474968028-56623f02e42e",
  packagesHeader: "1520250497591-112f2f40a3f4",
  aboutHeader: "1488646953014-85cb44e25828",
  contactHeader: "1436491865332-7a61a109cc05",
  offer: "1540202404-a2f29016b523",
  cta: "1506905925346-21bda4d32df4",
  roadTrip: "1469854523086-cc02fe5d8800",
  story: "1476514525535-07fb3b4ae5f1",
} as const
