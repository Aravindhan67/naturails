const fs = require('fs');
const path = require('path');

// Helper to convert AI generated image to Base64 data URL to store directly in MongoDB database
const getBase64Image = (filename, fallbackSvgTitle) => {
  try {
    const filePath = path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'products', filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      return `data:image/jpeg;base64,${data.toString('base64')}`;
    }
  } catch (e) {
    console.warn(`Could not read ${filename}, falling back to vector SVG.`);
  }
  return generateProductSvg(fallbackSvgTitle, "100% AYUSH HERBS", "#2D5A27", "#3F7538", "#C27351", "leaf");
};

const generateProductSvg = (title, subtitle, primaryColor, secondaryColor, accentColor, iconShape) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDFBF7" />
        <stop offset="100%" stop-color="#F5EFE6" />
      </linearGradient>
      <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" />
        <stop offset="100%" stop-color="${secondaryColor}" />
      </linearGradient>
    </defs>
    <rect width="600" height="600" rx="24" fill="url(#bgGrad)" />
    <circle cx="120" cy="120" r="140" fill="${primaryColor}" fill-opacity="0.08" />
    <circle cx="480" cy="460" r="160" fill="${accentColor}" fill-opacity="0.08" />
    <ellipse cx="300" cy="490" rx="140" ry="20" fill="#2E382F" opacity="0.12" />
    <g>
      <rect x="220" y="210" width="160" height="240" rx="30" fill="url(#bottleGrad)" />
      <rect x="260" y="165" width="80" height="50" rx="10" fill="${secondaryColor}" />
      <rect x="275" y="125" width="50" height="42" rx="12" fill="#2B362A" />
      <circle cx="300" cy="115" r="18" fill="#425540" />
      <rect x="235" y="245" width="130" height="170" rx="12" fill="#FFFFFF" fill-opacity="0.95" />
      <circle cx="300" cy="275" r="14" fill="${accentColor}" fill-opacity="0.2" />
      <text x="300" y="310" font-family="'Playfair Display', Georgia, serif" font-size="13" font-weight="bold" fill="#2B3B2B" text-anchor="middle">${title.substring(0, 16)}</text>
      <text x="300" y="328" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="9" font-weight="600" fill="${accentColor}" text-anchor="middle" letter-spacing="1.5">AYURVEDA</text>
      <line x1="265" y1="340" x2="335" y2="340" stroke="#E2DCD2" stroke-width="1" />
      <text x="300" y="360" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="8" fill="#6B786E" text-anchor="middle">${subtitle.substring(0, 20)}</text>
      <text x="300" y="390" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="9" font-weight="bold" fill="#2B3B2B" text-anchor="middle">NATURALIS</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Authentic Ayurvedic products tailored for Indian users with AI generated photorealistic images
const initialProducts = [
  {
    name: "Pure Kumkumadi Thailam — Kashmiri Saffron & Lotus Radiance Face Oil",
    category: "Skincare",
    price: 1299,
    originalPrice: 1699,
    volumeOrWeight: "30 ml / 1 fl oz",
    description: "An authentic classical Ayurvedic formulation crafted with Grade-A Mogra Kashmiri Saffron (Kesar), Blue Water Lily, Sandalwood, and Indian Madder (Manjistha) steeped in goat's milk and cold-pressed black sesame oil. Renowned for illuminating dull complexions, smoothing pigmentation, and restoring a bridal golden glow.",
    ingredients: "Kashmiri Mogra Kesar (Crocus Sativus), Red Sandalwood (Rakta Chandana), Blue Lotus (Utpala), Manjistha, Padmaka, Lodhra, Cold-Pressed Black Sesame Oil, Goat's Milk.",
    benefits: [
      "Natural golden radiance and complexional illumination",
      "Reduces dark spots, blemishes, and stubborn hyperpigmentation",
      "Deeply hydrates and delays premature fine expression lines",
      "100% Classical Ashtanga Hridaya recipe with real saffron strands"
    ],
    certifications: ["AYUSH Ministry Approved", "100% Ayurvedic", "GMP Certified", "Cruelty-Free", "Made in India"],
    stock: 45,
    rating: 4.9,
    numReviews: 142,
    isFeatured: true,
    bestSeller: true,
    originRegion: "Pampore, Kashmir & Mysuru, Karnataka",
    image: getBase64Image('kumkumadi.jpg', 'KUMKUMADI')
  },
  {
    name: "Kerala Virgin Coconut & Bhringraj Intensive Hair Growth Oil",
    category: "Haircare",
    price: 749,
    originalPrice: 999,
    volumeOrWeight: "200 ml / 6.8 fl oz",
    description: "Kshirapaka slow-boiled herbal hair elixir infused with freshly harvested True Bhringraj (False Daisy), Amla, Brahmi, and Curry Leaves gently simmered for 72 hours in pure wet-milled Kerala Virgin Coconut Milk. Stops premature graying, arrests seasonal hair fall, and induces thick follicle regeneration.",
    ingredients: "Eclipta Alba (Bhringraj), Phyllanthus Emblica (Amla), Bacopa Monnieri (Brahmi), Murraya Koenigii (Curry Leaves), Indigofera Tinctoria (Neeli), Wet-Milled Virgin Coconut Oil, Vetiver Root.",
    benefits: [
      "Reduces hair fall within 14 days of regular champi (scalp massage)",
      "Stimulates dormant follicles for visible hair density",
      "Soothes heated scalp pitta and prevents dry dandruff flakes",
      "Non-sticky, lightweight absorption with natural herbal aroma"
    ],
    certifications: ["100% Herbal Active", "Zero Mineral Oil", "Zero Silicones", "AYUSH Certified", "Made in India"],
    stock: 65,
    rating: 4.9,
    numReviews: 189,
    isFeatured: true,
    bestSeller: true,
    originRegion: "Wayanad, Kerala",
    image: getBase64Image('bhringraj.jpg', 'BHRINGRAJ OIL')
  },
  {
    name: "Kashmiri Saffron & Mysore Sandalwood Radiance Ubtan Mask",
    category: "Skincare",
    price: 899,
    originalPrice: 1199,
    volumeOrWeight: "100 g / 3.5 oz",
    description: "Centuries-old Indian royal bathing ritual in a jar. Micro-milled wild Kasturi turmeric, pure Mysore white sandalwood, chickpea flour, almond kernel meal, and Kashmiri saffron threads. Instantly removes environmental sun tan, detoxifies pollution, and refines open pores.",
    ingredients: "Mysore Chandan (Sandalwood Flakes), Kasturi Manjal (Wild Turmeric), Kashmiri Saffron (Kesar), Besan (Gram Flour), Sweet Almond Powder, Rose Petal Extract, Neem Bark.",
    benefits: [
      "Instantly lifts stubborn sun tanning and balances skin tone",
      "Porous absorption of excess oil without moisture loss",
      "Leaves skin petal-soft with an intoxicating sandalwood fragrance",
      "Gentle physical and enzymatic natural exfoliation"
    ],
    certifications: ["100% Vegetarian (Green Dot)", "Preservative Free Powder", "Pure Heritage", "Made in India"],
    stock: 50,
    rating: 4.8,
    numReviews: 118,
    isFeatured: true,
    bestSeller: false,
    originRegion: "Mysuru, Karnataka & Kashmir",
    image: getBase64Image('ubtan.jpg', 'UBTAN MASK')
  },
  {
    name: "Handmade Neem, Tulsi & Kasturi Turmeric Artisan Bath Bar",
    category: "Handmade Soaps",
    price: 349,
    originalPrice: 450,
    volumeOrWeight: "125 g / 4.4 oz",
    description: "Cold-processed artisan bathing bar cure-aged for 45 days. Packed with freshly pounded Indian organic Neem leaves, Holy Basil (Tulsi), and wild Kasturi turmeric. Delivers antibacterial purification, fights back acne, and leaves skin refreshed in humid Indian climates.",
    ingredients: "Saponified Coconut Oil, Cold-Pressed Castor Oil, Fresh Neem Juice, Steam-Distilled Tulsi Essential Oil, Kasturi Turmeric, Pure Kokum Butter.",
    benefits: [
      "Natural antibacterial shield against body breakouts and prickly heat",
      "Rich creamy moisturizing lather that never dries the skin",
      "Zero SLS/SLES, zero animal tallow, 100% biodegradable",
      "Long-lasting solid bar with invigorating herbal fresh aroma"
    ],
    certifications: ["Handcrafted in India", "Plastic-Free Packaging", "100% Vegan (Green Dot)", "Cruelty-Free"],
    stock: 90,
    rating: 4.8,
    numReviews: 96,
    isFeatured: false,
    bestSeller: true,
    originRegion: "Coimbatore, Tamil Nadu",
    image: getBase64Image('soap.jpg', 'NEEM TULSI SOAP')
  },
  {
    name: "Pure Himalayan Shilajit Gold Resin with Ashwagandha & Swarna Bhasma",
    category: "Wellness & Teas",
    price: 1999,
    originalPrice: 2499,
    volumeOrWeight: "20 g / 0.7 oz",
    description: "Harvested at 18,000 feet from pristine Himalayan cliff faces in Ladakh. Traditional Surya-Tapi (sun-dried) purification with over 80+ bio-active ionic minerals and >75% fulvic acid, fortified with KSM-66 Organic Ashwagandha and Ayurvedic Swarna Bhasma (Gold essence) for stamina, immunity, and cellular rejuvenation.",
    ingredients: "100% Pure Shudh Shilajit (Asphaltum Punjabianum), KSM-66 Organic Ashwagandha Extract, Swarna Bhasma, Safed Musli, Gokshura.",
    benefits: [
      "Boosts ATP energy production, physical stamina, and mental vitality",
      "High fulvic acid content enhances nutrient absorption",
      "Classical Rasayana tonic for stress relief and deep sleep recovery",
      "Lab-tested for heavy metals (Lead, Arsenic, Mercury free)"
    ],
    certifications: ["AYUSH Premium Mark", "GMP Certified", "100% Heavy Metal Tested", "Himalayan Harvested"],
    stock: 40,
    rating: 5.0,
    numReviews: 215,
    isFeatured: true,
    bestSeller: true,
    originRegion: "Ladakh & Zanskar Range (18,000 ft)",
    image: getBase64Image('shilajit.jpg', 'SHILAJIT GOLD')
  },
  {
    name: "Pure Nilgiri Eucalyptus & Natural Bhimseni Camphor Oil",
    category: "Essential Oils",
    price: 499,
    originalPrice: 650,
    volumeOrWeight: "30 ml / 1 fl oz",
    description: "Steam-distilled from high-elevation Nilgiri blue gum eucalyptus leaves blended with pure edible Bhimseni Kapoor (Camphor). Provides instant steam inhalation relief for congestion, seasonal allergies, joint pain relief, and natural spiritual room purification.",
    ingredients: "100% Pure Eucalyptus Globulus (Nilgiri Blue Gum) Leaf Oil, Natural Edible Grade Bhimseni Camphor (Cinnamomum Camphora).",
    benefits: [
      "Immediate sinus and respiratory decongestion during seasonal changes",
      "Relieves sore back, neck, and joint stiffness when applied with warm sesame oil",
      "Purifies indoor air and deters mosquitoes and pests naturally",
      "Crisp, refreshing camphorous mountain fragrance"
    ],
    certifications: ["Steam Distilled", "100% Pure Therapeutic Grade", "Nilgiri Harvest", "AYUSH Approved"],
    stock: 75,
    rating: 4.9,
    numReviews: 84,
    isFeatured: true,
    bestSeller: false,
    originRegion: "Ooty & Coonoor, Nilgiris, Tamil Nadu",
    image: getBase64Image('eucalyptus.jpg', 'NILGIRI EUCALYPTUS')
  },
  {
    name: "Organic Malabar Cardamom & Lemongrass Herbal Tea Infusion",
    category: "Wellness & Teas",
    price: 449,
    originalPrice: 599,
    volumeOrWeight: "100 g loose leaf (~40 cups)",
    description: "A restorative caffeine-free Ayurvedic digestif blending whole Green Cardamom pods from the Idukki hills of Kerala with freshly cut Lemongrass, Mulethi (Licorice), and Tulsi. Eases post-meal heaviness, regulates metabolism, and refreshes the palate.",
    ingredients: "Whole Malabar Green Cardamom (Elaichi), Cymbopogon (Lemongrass), Krishna Tulsi, Yashtimadhu (Licorice Root), Ginger flakes.",
    benefits: [
      "Promotes digestive fire (Agni) and relieves post-meal bloating",
      "Caffeine-free soothing morning or evening cup",
      "Rich in natural antioxidants that soothe seasonal throat irritations",
      "Naturally sweet aromatic tasting notes without any added sugar"
    ],
    certifications: ["100% Organic", "Direct Trade Spices", "Non-GMO", "Caffeine-Free"],
    stock: 55,
    rating: 4.8,
    numReviews: 62,
    isFeatured: false,
    bestSeller: false,
    originRegion: "Idukki, Western Ghats, Kerala",
    image: getBase64Image('tea.jpg', 'MALABAR TEA')
  },
  {
    name: "Pure Cold-Pressed Virgin Sesame & Ashwagandha Body Abhyanga Oil",
    category: "Body Care",
    price: 649,
    originalPrice: 850,
    volumeOrWeight: "250 ml / 8.5 fl oz",
    description: "Traditional daily self-massage (Abhyanga) oil. Cold-pressed virgin black sesame oil wood-churned (Chekku / Ghani) in Tamil Nadu and infused with Ashwagandha and Bala root. Warms stiff muscles, grounds nervous Vata energy, and locks in deep dermal moisture.",
    ingredients: "Wood-Pressed Black Sesame Seed Oil (Til Tailam), Withania Somnifera (Ashwagandha), Sida Cordifolia (Bala), Camphor, Cardamom oil.",
    benefits: [
      "Classical Ayurvedic daily Abhyanga oil to balance Vata dosha",
      "Warms tired muscles and lubricates joints after long work days",
      "Leaves skin supple, radiant, and deeply moisturized",
      "Traditional Wood-Ghani pressed without heat or chemical solvents"
    ],
    certifications: ["Cold Wood-Pressed (Chekku)", "100% Ayurvedic Recipe", "GMP Certified", "Made in India"],
    stock: 60,
    rating: 4.9,
    numReviews: 73,
    isFeatured: false,
    bestSeller: true,
    originRegion: "Erode & Coimbatore, Tamil Nadu",
    image: getBase64Image('abhyanga.jpg', 'ABHYANGA OIL')
  }
];

module.exports = { initialProducts, generateProductSvg };
