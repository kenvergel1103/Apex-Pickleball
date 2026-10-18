
export type PaddleSpec = {
  label: string;
  value: string;
};

export type PaddleProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  specs: PaddleSpec[];
  image: string;
  accent: string;
  badge: string;
};

export const paddleProducts: PaddleProduct[] = [
  {
    id: "head-radical-elite",
    name: "HEAD Radical Elite",
    category: "ALL-COURT",
    price: 3499, // Demo price: verify before publishing
    description:
      "A versatile widebody paddle with a fiberglass-composite face and a forgiving feel.",
    specs: [
      { label: "Face Material", value: "Fiberglass Composite" },
      { label: "Core Thickness", value: "15 mm" },
      { label: "Shape", value: "Widebody" },
      { label: "Weight", value: "230 g / 8.1 oz" },
      { label: "Handle Length", value: "130 mm / 5.1 in" },
    ],
    image: "/images/paddle-5.png",
    accent: "#D7FF3F",
    badge: "All-Court",
  },
  {
    id: "control",
    name: "VESSEL — Carbon Series",
    category: "CONTROL SERIES",
    price: 1299, // Existing demo price
    description:
      "Dial in your touch. Own the kitchen. Play every shot with confidence.",
    specs: [
      { label: "Surface", value: "Fine Textured 3K Carbon Fiber" },
      { label: "Core", value: "Polypropylene Honeycomb" },
      { label: "Edge Guard", value: "TPU" },
      { label: "Handle Grip", value: "PU" },
      { label: "Core Thickness", value: "16 mm (from your existing listing)" },
    ],
    image: "/images/paddle-control.png",
    accent: "#D7FF3F",
    badge: "Control Series",
  },
  {
    id: "power",
    name: "WILSON BLAZE PRO 13",
    category: "POWER SERIES",
    price: 1499, // Existing demo price; official PH listing is higher
    description:
      "A power-oriented paddle for players looking to attack with confidence.",
    specs: [
      { label: "Model", value: "Blaze Pro 13" },
      { label: "Core Thickness", value: "13 mm (model designation)" },
      { label: "Other Technical Details", value: "Verify against the exact model's manufacturer specifications" },
    ],
    image: "/images/paddle-power.png",
    accent: "#FF794D",
    badge: "Power Series",
  },
  {
    id: "speed",
    name: "JOOLA ESSENTIALS DASH",
    category: "BEGINNER",
    price: 1399, // Demo price
    description:
      "A lightweight, colorful paddle designed for players learning the game.",
    specs: [
      { label: "Surface", value: "Sandblasted Fiberglass" },
      { label: "Core Thickness", value: "10 mm" },
      { label: "Construction", value: "Cool Press" },
      { label: "Best For", value: "Beginners and recreational players" },
      { label: "Color Options", value: "Multiple colors" },
    ],
    image: "/images/paddle-speed.png",
    accent: "#83B9FF",
    badge: "Lightweight",
  },
  {
    id: "warping-point-neon-gen-3",
    name: "Warping Point Neon Gen 3",
    category: "ALL-COURT",
    price: 6400, // Listed at ₱6,400 when researched
    description:
      "A Gen 3 all-court paddle designed for spin, touch, and controlled power.",
    specs: [
      { label: "Face Material", value: "Carbon Fiber" },
      { label: "Core", value: "Polypropylene Honeycomb with EVA Foam Wall" },
      { label: "Core Thickness", value: "16 mm" },
      { label: "Weight", value: "7.8–8.1 oz" },
      { label: "Paddle Length", value: "16.4 in" },
      { label: "Paddle Width", value: "7.55 in" },
      { label: "Handle Length", value: "5.5 in" },
      { label: "Grip Circumference", value: "4.25 in" },
      { label: "Edge Guard", value: "Yes" },
      { label: "Certification", value: "UPA-A listed; check current approval status" },
    ],
    image: "/images/paddle-4.png",
    accent: "#D7FF3F",
    badge: "Gen 3",
  },
  {
    id: "swift-flow-pro",
    name: "Swift Flow Pro",
    category: "POWER SERIES",
    price: 8999, // Demo PHP price; verify local pricing
    description:
      "A competitive all-court paddle built around a carbon-fiber face and reinforced core.",
    specs: [
      { label: "Face Material", value: "Japanese Carbon Fiber" },
      { label: "Core", value: "Gen 4 Polymer Honeycomb with Foam Edge Construction" },
      { label: "Core Thickness", value: "16 mm" },
      { label: "Edge Protection", value: "Reinforced Edge Guard" },
      { label: "Certification", value: "USA Pickleball approved per manufacturer listing" },
      { label: "Weight", value: "Not confirmed in the reviewed listing" },
      { label: "Dimensions", value: "Not confirmed in the reviewed listing" },
    ],
    image: "/images/swift-flow-pro.png",
    accent: "#83B9FF",
    badge: "Tournament Ready",
  },
  {
    id: "stiga-amp-16",
    name: "STIGA AMP 16 Carbon Control Hybrid",
    category: "CONTROL SERIES",
    price: 9999, // Demo PHP price; verify local pricing
    description:
      "A balanced hybrid paddle combining a textured carbon face with a softer honeycomb core.",
    specs: [
      { label: "Face Material", value: "T700 Carbon Fiber" },
      { label: "Core", value: "Soft Polypropylene Honeycomb" },
      { label: "Core Thickness", value: "16 mm" },
      { label: "Weight", value: "225 g average (about 7.9 oz)" },
      { label: "Shape", value: "Hybrid" },
      { label: "Length", value: "415 mm" },
      { label: "Width", value: "190 mm" },
      { label: "Handle Length", value: "135 mm" },
      { label: "Grip Circumference", value: "105 mm" },
      { label: "Certification", value: "USAP listed by manufacturer" },
    ],
    image: "/images/stiga-amp-cc16.png",
    accent: "#D7FF3F",
    badge: "Carbon Control",
  },
  {
    id: "selkirk-omni",
    name: "Selkirk OMNI — Widebody / Elongated",
    category: "ALL-COURT",
    price: 18800, // Listed by a Philippine retailer; verify current price
    description:
      "A modern foam-core all-court paddle available in widebody and elongated shapes.",
    specs: [
      { label: "Face", value: "Multistrata T700 Carbon Fiber" },
      { label: "Surface", value: "InfiniGrit" },
      { label: "Core", value: "ReactCore PureFoam Construction" },
      { label: "Core Thickness", value: "16 mm" },
      { label: "Weight", value: "7.9–8.2 oz" },
      {
        label: "Widebody Dimensions",
        value: '15.95" × 8" (handle 5.6")',
      },
      {
        label: "Elongated Dimensions",
        value: '16.5" × 7.45" (handle 5.8")',
      },
      { label: "Grip Circumference", value: "4.25 in" },
      { label: "Shape Options", value: "Widebody or Elongated" },
    ],
    image: "/images/selkirk-omni.png",
    accent: "#83B9FF",
    badge: "All-Court",
  },
  {
    id: "rev-zeus",
    name: "REV ZEUS Power",
    category: "POWER SERIES",
    price: 8999, // Demo PHP price; verify local pricing
    description:
      "A power-focused paddle featuring a raw carbon face and a thermoformed construction.",
    specs: [
      { label: "Face Material", value: "T700 Raw Carbon Fiber" },
      { label: "Core", value: "Polypropylene Honeycomb" },
      { label: "Core Thickness", value: "14 mm" },
      { label: "Weight", value: "Approximately 8.0 oz" },
      { label: "Paddle Dimensions", value: '16.25" × 7.75"' },
      { label: "Handle Length", value: "5.25 in" },
      { label: "Grip Circumference", value: "4.2 in" },
      { label: "Construction", value: "Thermoformed" },
    ],
    image: "/images/rev-zeus.png",
    accent: "#FF794D",
    badge: "Power Paddle",
  },
  {
    id: "kuikma-open-red",
    name: "Decathlon Kuikma Open — Red",
    category: "BEGINNER",
    price: 1490, // Decathlon PH listed price when researched
    description:
      "An accessible recreational paddle for players getting started with pickleball.",
    specs: [
      { label: "Brand", value: "Kuikma / Decathlon" },
      { label: "Color", value: "Red" },
      { label: "Weight", value: "Confirm the exact model specification" },
      { label: "Surface", value: "Not confirmed in the reviewed listing" },
      { label: "Core", value: "Not confirmed in the reviewed listing" },
      { label: "Thickness", value: "Not confirmed in the reviewed listing" },
    ],
    image: "/images/kuikma-open-red.png",
    accent: "#FF794D",
    badge: "Beginner Friendly",
  },
  {
    id: "beginner",
    name: "Decathlon Kuikma Open — Blue",
    category: "BEGINNER",
    price: 1490, // Decathlon PH listed price when researched
    description:
      "A recreational paddle for players developing their technique and consistency.",
    specs: [
      { label: "Brand", value: "Kuikma / Decathlon" },
      { label: "Color", value: "Blue" },
      { label: "Weight", value: "Confirm the exact model specification" },
      { label: "Surface", value: "Not confirmed in the reviewed listing" },
      { label: "Core", value: "Not confirmed in the reviewed listing" },
      { label: "Thickness", value: "Not confirmed in the reviewed listing" },
    ],
    image: "/images/kuikma-open-blue.png",
    accent: "#83B9FF",
    badge: "Beginner Friendly",
  },
];
