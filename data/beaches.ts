export type Beach = {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  location: string;
  lat: number;
  lng: number;
};

export const beaches: Beach[] = [
  {
    id: "beach:micro-beach",
    slug: "micro-beach",
    name: "Micro Beach",
    shortDescription: "Calm waters, sunsets, and easy access in Garapan.",
    description:
      "Calm waters, sunset views, and easy access in Garapan. A great place for relaxing, swimming, and enjoying the ocean close to town.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    location: "Garapan, Saipan",
    lat: 15.215,
    lng: 145.715,
  },
  {
    id: "beach:ladder-beach",
    slug: "ladder-beach",
    name: "Ladder Beach",
    shortDescription: "A quiet beach spot with cliffs and clear water.",
    description:
      "A quieter beach area known for cliffs, clear water, and a more tucked-away feel. Great for photos and peaceful ocean views.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
    location: "Saipan",
    lat: 15.1255,
    lng: 145.729,
  },
  {
    id: "beach:obyan-beach",
    slug: "obyan-beach",
    name: "Obyan Beach",
    shortDescription: "Popular for snorkeling, sand, and peaceful views.",
    description:
      "A beautiful beach known for sand, snorkeling, and peaceful views. A solid pick for visitors looking for a classic Saipan beach stop.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    location: "Obyan, Saipan",
    lat: 15.1186,
    lng: 145.7508,
  },
];
