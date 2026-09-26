/**
 * Karachi Bakery Redesign — Core Application Logic
 * Sprint Status: Days 1 to 5 Fully Completed
 * - Day 1: Brand Architecture, Design System & Customer Journey Hub (Issues #4, #15)
 * - Day 2: Category Architecture & Visual Mega Menu (Issues #1, #15)
 * - Day 3: Multi-Faceted Search, Dietary Facets, Price Slider, Sorting & Zero-Results Fallback (Issue #2)
 * - Day 4: Standardized Product Detail (PDP) Modal & Smart Cross-Sell Recommendations (Issues #7, #14)
 * - Day 5: Side-by-Side Product Comparison Bottom Dock & Matrix Modal (Issue #13)
 */

// Application State
const AppState = {
  activeJourney: 'retail', // 'retail' | 'b2b' | 'custom' | 'stores'
  cartItems: [],
  compareItems: [], // array of up to 4 product IDs
  activePdpId: null,
  pdpQuantity: 1,
  pincodeVerified: null,
  filters: {
    searchQuery: '',
    category: 'all',
    dietary: new Set(),
    maxPrice: 2000,
    sortBy: 'bestseller'
  }
};

/**
 * Standardized Product Catalog Data (Solves Issue #7 & #14)
 * Detailed specifications, nutritional panels, authentic ingredients, allergen warnings, and companion pairings.
 */
const PRODUCT_CATALOG_DATA = {
  p1: {
    id: 'p1',
    name: 'Original Hyderabad Fruit Biscuit',
    category: 'biscuits',
    categoryLabel: 'Iconic Biscuits & Cookies',
    price: 220,
    originalPrice: 240,
    unit: '400g Collectible Tin',
    grams: 400,
    shelfLife: '6 Months from Mfd',
    rating: 4.9,
    reviews: 2450,
    bestsellerRank: 1,
    dietary: ['veg', 'eggless'],
    dietaryLabel: '100% Veg • Eggless',
    badge: 'Legendary',
    icon: '🍪',
    packaging: 'Hermetically Sealed Gold Heritage Tin',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana (Est. 1953)',
    description: 'The world-famous crown jewel of Karachi Bakery. Golden, buttery shortcrust biscuits generously studded with candied fruit morsels (tutti-frutti) and hand-picked crunchy cashews.',
    ingredients: 'Refined Wheat Flour (Maida), Pure Dairy Butter, Candied Papaya Fruit Bits, Sugar, Cashew Nuts, Milk Solids, Invert Sugar Syrup, Leavening Agents (E500ii, E503ii), Natural Vanilla & Cardamom Extracts.',
    allergens: 'Contains Wheat (Gluten), Tree Nuts (Cashew), Dairy (Milk Solids). Manufactured in a facility handling pistachios and almonds.',
    storage: 'Store in a cool, clean, dry environment away from direct heat and sunlight. Once opened, retain in the airtight tin to preserve crisp freshness.',
    nutrition: {
      calories: '492 kcal',
      carbs: '64.2 g',
      addedSugar: '24.5 g',
      fats: '22.8 g',
      protein: '7.5 g'
    },
    idealPairing: 'Authentic Hyderabadi Irani Chai or Afternoon English Breakfast Tea',
    bundle: {
      pairId: 'p4',
      title: 'Irani Chai Double-Baked Rusk (300g)',
      pairPrice: 140,
      comboPrice: 330,
      savings: 30
    },
    recommendations: ['p2', 'p3', 'p11']
  },
  p2: {
    id: 'p2',
    name: 'Hyderabadi Osmania Biscuits',
    category: 'biscuits',
    categoryLabel: 'Iconic Biscuits & Cookies',
    price: 190,
    originalPrice: 210,
    unit: '400g Heritage Box',
    grams: 400,
    shelfLife: '4 Months from Mfd',
    rating: 4.9,
    reviews: 1890,
    bestsellerRank: 2,
    dietary: ['veg', 'eggless', 'nut-free'],
    dietaryLabel: '100% Veg • Eggless • Nut-Free',
    badge: 'Royal Heritage',
    icon: '☕',
    packaging: 'Airtight Polyfoil Inner Tray with Sturdy Carton',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Created for the 7th Nizam of Hyderabad, Mir Osman Ali Khan. A velvety balance of sweet and salty notes that melts on your palate when dipped in steaming Irani chai.',
    ingredients: 'Refined Wheat Flour, Farm Cream Butter, Vegetable Fat, Sugar, Edible Iodized Salt, Skimmed Milk Powder, Cardamom, Rising Agents.',
    allergens: 'Contains Wheat (Gluten), Milk Solids. Strictly Nut-Free recipe.',
    storage: 'Store in an airtight container at room temperature. Avoid damp areas.',
    nutrition: {
      calories: '480 kcal',
      carbs: '62.0 g',
      addedSugar: '18.2 g',
      fats: '21.5 g',
      protein: '6.8 g'
    },
    idealPairing: 'Strong Hyderabadi Kadak Chai & Evening High Tea',
    bundle: {
      pairId: 'p1',
      title: 'Original Hyderabad Fruit Biscuit (400g)',
      pairPrice: 220,
      comboPrice: 380,
      savings: 30
    },
    recommendations: ['p1', 'p4', 'p16']
  },
  p3: {
    id: 'p3',
    name: 'Royal Cashew & Pista Butter Biscuits',
    category: 'biscuits',
    categoryLabel: 'Iconic Biscuits & Cookies',
    price: 250,
    originalPrice: 280,
    unit: '400g Box',
    grams: 400,
    shelfLife: '6 Months from Mfd',
    rating: 4.8,
    reviews: 840,
    bestsellerRank: 5,
    dietary: ['veg', 'eggless'],
    dietaryLabel: '100% Veg • Eggless',
    badge: 'Artisanal',
    icon: '🌰',
    packaging: 'Luxury Gold-Embossed Presentation Box',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Rich shortbread biscuits loaded with roasted Goan cashews and royal Iranian pistachios, infused with subtle notes of Kashmiri saffron.',
    ingredients: 'Refined Wheat Flour, Butter, Roasted Cashew Nuts (14%), Pistachio Kernels (8%), Sugar, Milk Solids, Saffron Infusion, Cardamom.',
    allergens: 'Contains Wheat (Gluten), Tree Nuts (Cashew, Pistachio), Milk Solids.',
    storage: 'Keep in an airtight jar in a cool place away from sun exposure.',
    nutrition: {
      calories: '510 kcal',
      carbs: '58.0 g',
      addedSugar: '20.0 g',
      fats: '26.4 g',
      protein: '8.8 g'
    },
    idealPairing: 'Kesariya Milk, Kahwa, or Hot Coffee',
    bundle: {
      pairId: 'p11',
      title: "Nizam's Royal Heritage 3-in-1 Tin (1.2kg)",
      pairPrice: 750,
      comboPrice: 950,
      savings: 50
    },
    recommendations: ['p1', 'p2', 'p10']
  },
  p4: {
    id: 'p4',
    name: 'Irani Chai Double-Baked Butter Rusk',
    category: 'biscuits',
    categoryLabel: 'Iconic Biscuits & Cookies',
    price: 140,
    originalPrice: 160,
    unit: '300g Pack',
    grams: 300,
    shelfLife: '6 Months from Mfd',
    rating: 4.7,
    reviews: 620,
    bestsellerRank: 6,
    dietary: ['veg', 'eggless', 'nut-free'],
    dietaryLabel: '100% Veg • Eggless • Nut-Free',
    badge: 'Crisp Delight',
    icon: '🥖',
    packaging: 'Moisture-Barrier Double Pack',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Twice-baked to golden perfection with real dairy butter and fragrant Lucknowi fennel seeds. Ultra-crunchy toast with legendary tea absorption.',
    ingredients: 'Wheat Flour, Pure Butter, Sugar, Active Dry Yeast, Milk Solids, Green Cardamom, Fennel Seeds (Saunf), Iodized Salt.',
    allergens: 'Contains Wheat (Gluten), Dairy. Nut-Free.',
    storage: 'Reseal firmly after opening. Keep away from humid conditions.',
    nutrition: {
      calories: '420 kcal',
      carbs: '72.0 g',
      addedSugar: '14.0 g',
      fats: '11.2 g',
      protein: '8.2 g'
    },
    idealPairing: 'Dipping into boiling hot Irani Chai',
    bundle: {
      pairId: 'p2',
      title: 'Hyderabadi Osmania Biscuits (400g)',
      pairPrice: 190,
      comboPrice: 300,
      savings: 30
    },
    recommendations: ['p1', 'p2', 'p16']
  },
  p5: {
    id: 'p5',
    name: 'Belgian Dark Chocolate Truffle Cake',
    category: 'cakes',
    categoryLabel: 'Artisanal Cakes & Pastries',
    price: 550,
    originalPrice: 600,
    unit: '500g Fresh Baked',
    grams: 500,
    shelfLife: '48 Hours (Refrigerated)',
    rating: 4.9,
    reviews: 1150,
    bestsellerRank: 3,
    dietary: ['veg', 'eggless', 'nut-free'],
    dietaryLabel: '100% Veg • Eggless • Nut-Free',
    badge: 'Chef Signature',
    icon: '🍫',
    packaging: 'Rigid Thermal Insulated Pastry Box with Cool Gel Pack',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Layers of moist chocolate sponge smothered in silky ganache prepared from 70% dark Belgian cocoa and fresh dairy cream. Rich, glossy, and decadent.',
    ingredients: '70% Belgian Dark Cocoa, Wheat Flour, Dairy Cream, Condensed Milk, Cocoa Butter, Sugar, Vanilla Extract, Chocolate Shavings.',
    allergens: 'Contains Wheat (Gluten), Milk, Soy Lecithin. Nut-Free.',
    storage: 'Store refrigerated at 2°C – 5°C. For best flavor, bring to room temperature 15 minutes before serving.',
    nutrition: {
      calories: '380 kcal',
      carbs: '46.0 g',
      addedSugar: '28.0 g',
      fats: '19.2 g',
      protein: '5.4 g'
    },
    idealPairing: 'Celebration dinners, espresso, or vanilla ice cream',
    bundle: {
      pairId: 'p7',
      title: 'Red Velvet Pastry Pack (400g)',
      pairPrice: 380,
      comboPrice: 880,
      savings: 50
    },
    recommendations: ['p6', 'p7', 'p1']
  },
  p6: {
    id: 'p6',
    name: 'Heritage Rich Plum & Dry Fruit Cake',
    category: 'cakes',
    categoryLabel: 'Artisanal Cakes & Pastries',
    price: 420,
    originalPrice: 460,
    unit: '500g Loaf',
    grams: 500,
    shelfLife: '30 Days from Mfd',
    rating: 4.8,
    reviews: 510,
    bestsellerRank: 8,
    dietary: ['veg', 'eggless'],
    dietaryLabel: '100% Veg • Eggless',
    badge: 'Festive Favorite',
    icon: '🥧',
    packaging: 'Foil-Lined Sealed Loaf Box with Heritage Sleeve',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Traditional spiced plum cake laden with macerated black currants, Afghan raisins, candied orange peel, and slivered California almonds. Aged to aromatic perfection.',
    ingredients: 'Wheat Flour, Macerated Golden Raisins, Currants, Candied Citrus Peel, Butter, Almonds, Molasses, Cinnamon, Nutmeg, Caramelized Sugar.',
    allergens: 'Contains Wheat, Almonds, Milk Solids.',
    storage: 'Store at room temperature in a dry container. Does not require refrigeration.',
    nutrition: {
      calories: '395 kcal',
      carbs: '65.0 g',
      addedSugar: '32.0 g',
      fats: '12.4 g',
      protein: '5.1 g'
    },
    idealPairing: 'Warm milk, festive party spreads, and Christmas gifting',
    bundle: {
      pairId: 'p1',
      title: 'Original Hyderabad Fruit Biscuit (400g)',
      pairPrice: 220,
      comboPrice: 600,
      savings: 40
    },
    recommendations: ['p5', 'p7', 'p12']
  },
  p7: {
    id: 'p7',
    name: 'Red Velvet & Cream Cheese Pastry Pack',
    category: 'cakes',
    categoryLabel: 'Artisanal Cakes & Pastries',
    price: 380,
    originalPrice: 420,
    unit: 'Pack of 4 (400g)',
    grams: 400,
    shelfLife: '48 Hours (Refrigerated)',
    rating: 4.7,
    reviews: 430,
    bestsellerRank: 9,
    dietary: ['veg', 'eggless', 'nut-free'],
    dietaryLabel: '100% Veg • Eggless • Nut-Free',
    badge: 'Gourmet Pastry',
    icon: '🍰',
    packaging: 'Individual 4-Cavity Anti-Shock Dessert Tray',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Fluffy ruby red buttermilk sponge layered with artisanal Philadelphia-style cream cheese frosting and dusted with red velvet crumbs.',
    ingredients: 'Refined Flour, Cocoa, Beetroot Extract, Pure Butter, Cream Cheese, Sugar, Buttermilk Solids, Vanilla Bean.',
    allergens: 'Contains Wheat, Milk Solids. Nut-Free.',
    storage: 'Keep refrigerated below 4°C. Consume within 48 hours.',
    nutrition: {
      calories: '360 kcal',
      carbs: '44.0 g',
      addedSugar: '26.0 g',
      fats: '18.0 g',
      protein: '4.8 g'
    },
    idealPairing: 'Cappuccino, anniversary celebrations, or birthday surprise treats',
    bundle: {
      pairId: 'p5',
      title: 'Belgian Dark Truffle Cake (500g)',
      pairPrice: 550,
      comboPrice: 880,
      savings: 50
    },
    recommendations: ['p5', 'p6', 'p14']
  },
  p8: {
    id: 'p8',
    name: 'Royal Kaju Katli (Diamond Cut)',
    category: 'sweets',
    categoryLabel: 'Royal Mithai & Confectionery',
    price: 540,
    originalPrice: 580,
    unit: '500g Luxury Box',
    grams: 500,
    shelfLife: '20 Days from Mfd',
    rating: 4.9,
    reviews: 1680,
    bestsellerRank: 4,
    dietary: ['veg', 'eggless', 'vegan', 'gluten-free'],
    dietaryLabel: '100% Veg • Vegan • Gluten-Free',
    badge: 'Royal Mithai',
    icon: '🍬',
    packaging: 'Rigid Royal Gift Box with Silver Embossing',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Melt-in-mouth diamond delights prepared with over 70% whole cashew nut paste, pure sugar syrup, and adorned with certified pure edible silver leaf.',
    ingredients: 'Whole Cashew Nuts (72%), Fine Cane Sugar, Purified Water, Cardamom, Pure Silver Leaf (Vark).',
    allergens: 'Contains Cashew Nuts. 100% Dairy-Free Vegan & Gluten-Free.',
    storage: 'Store in a cool, dry place. Do not refrigerate to preserve soft texture.',
    nutrition: {
      calories: '475 kcal',
      carbs: '52.0 g',
      addedSugar: '30.0 g',
      fats: '26.0 g',
      protein: '10.2 g'
    },
    idealPairing: 'Diwali, Eid, weddings, and welcoming esteemed guests',
    bundle: {
      pairId: 'p9',
      title: 'Pure Desi Ghee Motichoor Ladoo (500g)',
      pairPrice: 360,
      comboPrice: 840,
      savings: 60
    },
    recommendations: ['p9', 'p10', 'p11']
  },
  p9: {
    id: 'p9',
    name: 'Pure Desi Ghee Motichoor Ladoo',
    category: 'sweets',
    categoryLabel: 'Royal Mithai & Confectionery',
    price: 360,
    originalPrice: 390,
    unit: '500g Box',
    grams: 500,
    shelfLife: '15 Days from Mfd',
    rating: 4.8,
    reviews: 920,
    bestsellerRank: 7,
    dietary: ['veg', 'eggless', 'gluten-free', 'nut-free'],
    dietaryLabel: '100% Veg • Gluten-Free • Nut-Free',
    badge: 'Pure Desi Ghee',
    icon: '🥮',
    packaging: 'Sealed Sweet Box with Moisture Lock',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Tiny gram flour pearls fried exclusively in aromatic pure cow ghee, soaked in saffron syrup, and bound with melon seeds and green cardamom.',
    ingredients: 'Bengal Gram Flour (Besan), Pure Cow Desi Ghee (35%), Sugar, Saffron Extract, Magaz (Melon Seeds), Cardamom Powder.',
    allergens: 'Contains Dairy (Ghee). Wheat-Free Gluten-Free & Nut-Free recipe.',
    storage: 'Store in an airtight container at room temperature away from moisture.',
    nutrition: {
      calories: '450 kcal',
      carbs: '60.0 g',
      addedSugar: '36.0 g',
      fats: '22.0 g',
      protein: '5.8 g'
    },
    idealPairing: 'Pooja celebrations, family festivals, and sweet gifts',
    bundle: {
      pairId: 'p8',
      title: 'Royal Kaju Katli (500g)',
      pairPrice: 540,
      comboPrice: 840,
      savings: 60
    },
    recommendations: ['p8', 'p10', 'p12']
  },
  p10: {
    id: 'p10',
    name: 'Roasted Badam & Anjeer Royal Barfi',
    category: 'sweets',
    categoryLabel: 'Royal Mithai & Confectionery',
    price: 480,
    originalPrice: 520,
    unit: '400g Box',
    grams: 400,
    shelfLife: '25 Days from Mfd',
    rating: 4.9,
    reviews: 780,
    bestsellerRank: 10,
    dietary: ['veg', 'eggless', 'sugar-free', 'gluten-free'],
    dietaryLabel: '100% Veg • Sugar-Free • Gluten-Free',
    badge: 'Sugar-Free Natural',
    icon: '✨',
    packaging: 'Royal Velvet-Finish Gift Box',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Naturally sweetened mithai crafted from succulent Turkish dried figs (anjeer), California almonds, roasted pistachios, and pure ghee. Zero refined sugar added.',
    ingredients: 'Dried Turkish Figs (60%), Roasted Almonds (22%), Pistachios (8%), Pure Desi Ghee, Green Cardamom. No added refined cane sugar.',
    allergens: 'Contains Almonds, Pistachios, Dairy (Ghee). Sugar-Free & Gluten-Free.',
    storage: 'Keep in a cool, dry place. Reseal tightly after serving.',
    nutrition: {
      calories: '430 kcal',
      carbs: '48.0 g (Natural Fruit Sugars)',
      addedSugar: '0.0 g (Zero Added Sugar)',
      fats: '24.0 g',
      protein: '9.4 g'
    },
    idealPairing: 'Diabetic-friendly festivities, fitness enthusiasts, and royal gifting',
    bundle: {
      pairId: 'p14',
      title: 'Sugar-Free Almond Cookies (350g)',
      pairPrice: 260,
      comboPrice: 690,
      savings: 50
    },
    recommendations: ['p8', 'p14', 'p15']
  },
  p11: {
    id: 'p11',
    name: "Nizam's Royal Heritage 3-in-1 Tin",
    category: 'hampers',
    categoryLabel: 'Luxury Hampers & Gift Tins',
    price: 750,
    originalPrice: 820,
    unit: '1.2kg Trio Tin',
    grams: 1200,
    shelfLife: '6 Months from Mfd',
    rating: 5.0,
    reviews: 1420,
    bestsellerRank: 1,
    dietary: ['veg', 'eggless'],
    dietaryLabel: '100% Veg • Eggless',
    badge: "Collector's Item",
    icon: '🎁',
    packaging: 'Embossed Hyderabad Heritage Triple-Compartment Metal Keepsake Tin',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'The definitive Karachi Bakery heirloom. A magnificent collectible tin containing 400g Original Fruit Biscuits, 400g Osmania Biscuits, and 400g Cashew Butter Biscuits.',
    ingredients: 'Assortment of Karachi Bakery signature recipes: Refined Flour, Butter, Tutti-Frutti, Cashews, Saffron, Salt, Sugar, Cardamom.',
    allergens: 'Contains Wheat, Cashews, Milk Solids.',
    storage: 'Tins are reusable and hermetically sealed. Store in a cool room.',
    nutrition: {
      calories: '490 kcal',
      carbs: '63.0 g',
      addedSugar: '22.0 g',
      fats: '23.0 g',
      protein: '7.2 g'
    },
    idealPairing: 'Corporate executive gifting, international travelers, and wedding favors',
    bundle: {
      pairId: 'p12',
      title: 'Vintage Hyderabad Festive Hamper (1.8kg)',
      pairPrice: 1299,
      comboPrice: 1949,
      savings: 100
    },
    recommendations: ['p1', 'p2', 'p12']
  },
  p12: {
    id: 'p12',
    name: 'Vintage Hyderabad Festive Hamper',
    category: 'hampers',
    categoryLabel: 'Luxury Hampers & Gift Tins',
    price: 1299,
    originalPrice: 1450,
    unit: '1.8kg Luxury Box',
    grams: 1800,
    shelfLife: '4 Months from Mfd',
    rating: 4.9,
    reviews: 670,
    bestsellerRank: 11,
    dietary: ['veg', 'eggless'],
    dietaryLabel: '100% Veg • Eggless',
    badge: 'Festive Luxury',
    icon: '🧺',
    packaging: 'Handcrafted Satin-Lined Gold Hamper Box with Regal Satin Bow',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'A lavish banquet hamper featuring 5 iconic bakes: Fruit Biscuit Tin (400g), Royal Kaju Katli (250g), Spiced Plum Cake (300g), Roasted Almonds (250g), and Hyderabadi Teekha Mixture (400g).',
    ingredients: 'Complete assortment of premium confectionery, dry fruits, bakery biscuits, and savoury treats.',
    allergens: 'Contains Wheat, Tree Nuts (Cashew, Almonds, Pistachio), Dairy, Peanuts.',
    storage: 'Store in an ambient dry room away from moisture.',
    nutrition: {
      calories: '460 kcal (avg)',
      carbs: '58.0 g',
      addedSugar: '26.0 g',
      fats: '22.0 g',
      protein: '8.0 g'
    },
    idealPairing: 'Diwali hampers, VIP clients, family reunions, and festive celebration hampers',
    bundle: {
      pairId: 'p11',
      title: "Nizam's Royal Heritage 3-in-1 Tin (1.2kg)",
      pairPrice: 750,
      comboPrice: 1949,
      savings: 100
    },
    recommendations: ['p11', 'p13', 'p8']
  },
  p13: {
    id: 'p13',
    name: 'Corporate Executive Wooden Gift Crate',
    category: 'hampers',
    categoryLabel: 'Luxury Hampers & Gift Tins',
    price: 1850,
    originalPrice: 2100,
    unit: '2.5kg Keepsake Crate',
    grams: 2500,
    shelfLife: '6 Months from Mfd',
    rating: 4.9,
    reviews: 340,
    bestsellerRank: 12,
    dietary: ['veg', 'eggless'],
    dietaryLabel: '100% Veg • Eggless',
    badge: 'Enterprise Crate',
    icon: '🪵',
    packaging: 'Solid Pine Wood Keepsake Chest with Antique Brass Latches',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Engineered for prestigious enterprise gifting. Handcrafted pine chest filled with 6 signature delicacies, vacuum sealed in gold foil compartments with optional corporate logo engraving.',
    ingredients: '6-delicacy assortment: Osmania, Fruit, Pista Butter, Kaju Katli, Anjeer Barfi, and Royal Teekha Mixture.',
    allergens: 'Contains Wheat, Cashew, Pistachio, Almonds, Milk, Peanuts.',
    storage: 'Store in dry surroundings. Solid wood crate is reusable for keepsakes.',
    nutrition: {
      calories: '470 kcal (avg)',
      carbs: '59.0 g',
      addedSugar: '24.0 g',
      fats: '24.0 g',
      protein: '8.5 g'
    },
    idealPairing: 'Boardroom gifting, CXO festive tokens, and premium client appreciation',
    bundle: {
      pairId: 'p14',
      title: 'Sugar-Free Roasted Almond Cookies (350g)',
      pairPrice: 260,
      comboPrice: 1990,
      savings: 120
    },
    recommendations: ['p11', 'p12', 'p1']
  },
  p14: {
    id: 'p14',
    name: 'Sugar-Free Roasted Almond Cookies',
    category: 'healthy',
    categoryLabel: 'Healthy Bakes & Savoury',
    price: 260,
    originalPrice: 290,
    unit: '350g Box',
    grams: 350,
    shelfLife: '6 Months from Mfd',
    rating: 4.8,
    reviews: 890,
    bestsellerRank: 8,
    dietary: ['veg', 'eggless', 'sugar-free'],
    dietaryLabel: '100% Veg • Sugar-Free • Stevia',
    badge: 'Stevia Sweetened',
    icon: '🍃',
    packaging: 'Nitrogen-Flushed Airtight Tray in Protective Box',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Zero refined sugar cookies made with whole wheat, golden California almonds, and naturally sweetened with Stevia leaf extract. Guilt-free crunch.',
    ingredients: 'Whole Wheat Flour, Roasted California Almonds (18%), Pure Butter, Stevia Leaf Extract, Maltitol, Milk Solids, Baking Powder, Natural Vanilla.',
    allergens: 'Contains Wheat, Almonds, Milk Solids. Sugar-Free.',
    storage: 'Store in a cool dry area away from humidity.',
    nutrition: {
      calories: '440 kcal',
      carbs: '54.0 g',
      addedSugar: '0.0 g (Stevia Sweetened)',
      fats: '22.0 g',
      protein: '8.6 g'
    },
    idealPairing: 'Green tea, morning coffee, and mindful snacking for health-conscious bakes',
    bundle: {
      pairId: 'p15',
      title: 'Roasted Millet Superfood Crisp (250g)',
      pairPrice: 190,
      comboPrice: 420,
      savings: 30
    },
    recommendations: ['p10', 'p15', 'p1']
  },
  p15: {
    id: 'p15',
    name: 'Roasted Jowar & Millet Superfood Crisp',
    category: 'healthy',
    categoryLabel: 'Healthy Bakes & Savoury',
    price: 190,
    originalPrice: 220,
    unit: '250g Jar',
    grams: 250,
    shelfLife: '4 Months from Mfd',
    rating: 4.7,
    reviews: 510,
    bestsellerRank: 13,
    dietary: ['veg', 'eggless', 'vegan', 'gluten-free', 'sugar-free', 'nut-free'],
    dietaryLabel: '100% Veg • Vegan • Gluten-Free • Nut-Free',
    badge: '100% Ancient Grains',
    icon: '🌾',
    packaging: 'Reusable Airtight PET Jar with Freshness Seal',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'Crisp popped ancient grains (Jowar, Ragi & Foxtail Millet) roasted in cold-pressed oil with Himalayan rock salt and roasted cumin. Never fried.',
    ingredients: 'Popped Sorghum (Jowar), Foxtail Millet, Cold-Pressed Groundnut Oil, Himalayan Pink Salt, Roasted Cumin, Turmeric, Black Pepper.',
    allergens: 'Zero Wheat (Gluten-Free), Zero Dairy (Vegan), Zero Tree Nuts. Hypoallergenic recipe.',
    storage: 'Keep lid closed tightly to preserve extreme crunch.',
    nutrition: {
      calories: '390 kcal',
      carbs: '68.0 g',
      addedSugar: '0.0 g',
      fats: '9.5 g',
      protein: '9.8 g'
    },
    idealPairing: 'Workday snack desks, weight-watchers, and tea accompaniment',
    bundle: {
      pairId: 'p16',
      title: 'Hyderabadi Royal Teekha Mixture (400g)',
      pairPrice: 160,
      comboPrice: 320,
      savings: 30
    },
    recommendations: ['p14', 'p16', 'p2']
  },
  p16: {
    id: 'p16',
    name: 'Hyderabadi Royal Teekha Mixture',
    category: 'healthy',
    categoryLabel: 'Healthy Bakes & Savoury',
    price: 160,
    originalPrice: 180,
    unit: '400g Fresh Pack',
    grams: 400,
    shelfLife: '3 Months from Mfd',
    rating: 4.8,
    reviews: 1310,
    bestsellerRank: 5,
    dietary: ['veg', 'eggless', 'vegan'],
    dietaryLabel: '100% Veg • Vegan',
    badge: 'Spicy Heritage',
    icon: '🌶️',
    packaging: 'Nitrogen-Flushed 3-Ply Metallic Freshness Pouch',
    fssai: 'FSSAI Lic. 13615015000254',
    origin: 'Hyderabad, Telangana',
    description: 'An iconic Deccan namkeen mixture of crisp besan sev, flattened rice flakes, crunchy peanuts, and fried curry leaves tossed in Kashmiri chilli and asafoetida.',
    ingredients: 'Gram Flour (Besan), Flattened Rice (Poha), Roasted Peanuts, Fresh Curry Leaves, Edible Vegetable Oil, Kashmiri Chilli Powder, Hing (Asafoetida), Rock Salt.',
    allergens: 'Contains Peanuts. Vegan & Eggless.',
    storage: 'Store in an airtight container immediately after opening.',
    nutrition: {
      calories: '520 kcal',
      carbs: '52.0 g',
      addedSugar: '2.0 g',
      fats: '31.0 g',
      protein: '11.2 g'
    },
    idealPairing: 'Evening drinks, rainy afternoons with hot tea, and festive savory platters',
    bundle: {
      pairId: 'p2',
      title: 'Hyderabadi Osmania Biscuits (400g)',
      pairPrice: 190,
      comboPrice: 320,
      savings: 30
    },
    recommendations: ['p1', 'p2', 'p15']
  }
};

// DOM Content Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  initJourneyTabs();
  initPincodeChecker();
  initGlobalSearch();
  initCatalogFilterHub();
  initMegaMenu();
  initMobileDrawer();
  initCompareSystem();
  initModalsAccessibility();
});

/**
 * ============================================================================
 * Day 1 Features: Brand Journey Switcher & Pincode Checker (Issues #4, #15)
 * ============================================================================
 */

function initJourneyTabs() {
  const tabs = document.querySelectorAll('.journey-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const journey = tab.getAttribute('data-journey');
      switchJourney(journey);
    });
  });
}

function switchJourney(journeyId) {
  AppState.activeJourney = journeyId;

  // Update tabs
  document.querySelectorAll('.journey-tab').forEach(t => {
    t.classList.remove('active');
    if (t.getAttribute('data-journey') === journeyId) {
      t.classList.add('active');
    }
  });

  // Smooth scroll to relevant section
  if (journeyId === 'retail') {
    const shop = document.getElementById('shopPreview');
    if (shop) shop.scrollIntoView({ behavior: 'smooth' });
    showToast('Switched to Retail Online Shop (B2C Mode)', '🛍️');
  } else if (journeyId === 'b2b') {
    const b2b = document.getElementById('b2bHighlight');
    if (b2b) b2b.scrollIntoView({ behavior: 'smooth' });
    showToast('Switched to Corporate & Bulk Orders Suite (B2B Mode)', '🏢');
  } else if (journeyId === 'custom') {
    const custom = document.getElementById('customCakeSection');
    if (custom) custom.scrollIntoView({ behavior: 'smooth' });
    showToast('Custom Cake Studio is scheduled for Day 7 milestone!', '🎂');
  } else if (journeyId === 'stores') {
    const stores = document.getElementById('storesSection');
    if (stores) stores.scrollIntoView({ behavior: 'smooth' });
    showToast('Interactive Store Locator is scheduled for Day 8 milestone!', '📍');
  }
}

function initPincodeChecker() {
  const input = document.getElementById('pincodeInput');
  const btn = document.getElementById('btnCheckPincode');

  if (btn && input) {
    btn.addEventListener('click', () => verifyPincode(input.value.trim()));
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') verifyPincode(input.value.trim());
    });
  }
}

function verifyPincode(pincode) {
  const resultBox = document.getElementById('pincodeResult');
  if (!resultBox) return;

  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    resultBox.innerHTML = '<span style="color:#D32F2F;">⚠️ Please enter a valid 6-digit Indian postal code.</span>';
    resultBox.style.display = 'block';
    return;
  }

  // Hyderabad Pincodes start with 500xxx
  if (pincode.startsWith('500') || pincode.startsWith('501') || pincode.startsWith('502')) {
    AppState.pincodeVerified = { code: pincode, type: 'hyderabad' };
    resultBox.innerHTML = `<span style="color:#2E7D32;">⚡ <strong>Same-Day Fresh Delivery Active!</strong> Order by 2:00 PM for dispatch directly from our Mozamjahi Market flagship bakery.</span>`;
    showToast(`Hyderabad Delivery Verified for ${pincode}!`, '⚡');
  } else {
    AppState.pincodeVerified = { code: pincode, type: 'national' };
    resultBox.innerHTML = `<span style="color:#1976D2;">✈️ <strong>Pan-India Express Air Shipping Active!</strong> Estimated delivery: 3–5 business days in protective heritage tins.</span>`;
    showToast(`Pan-India Express Available for ${pincode}!`, '✈️');
  }
  resultBox.style.display = 'block';
}

/**
 * ============================================================================
 * Day 2 Features: Visual Mega Menu & Mobile Drawer (Issues #1, #15)
 * ============================================================================
 */

let megaMenuTimer;
function initMegaMenu() {
  const trigger = document.getElementById('navItemCategories');
  const dropdown = document.getElementById('megaMenuDropdown');

  if (!trigger || !dropdown) return;

  trigger.addEventListener('mouseenter', () => {
    clearTimeout(megaMenuTimer);
    dropdown.classList.add('visible');
    trigger.setAttribute('aria-expanded', 'true');
  });

  trigger.addEventListener('mouseleave', () => {
    megaMenuTimer = setTimeout(() => {
      dropdown.classList.remove('visible');
      trigger.setAttribute('aria-expanded', 'false');
    }, 280);
  });

  dropdown.addEventListener('mouseenter', () => clearTimeout(megaMenuTimer));
  dropdown.addEventListener('mouseleave', () => {
    megaMenuTimer = setTimeout(() => {
      dropdown.classList.remove('visible');
      trigger.setAttribute('aria-expanded', 'false');
    }, 280);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('visible')) {
      dropdown.classList.remove('visible');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}

function selectCategoryFromMega(category, subquery = '') {
  const dropdown = document.getElementById('megaMenuDropdown');
  if (dropdown) dropdown.classList.remove('visible');

  const targetPill = document.querySelector(`.filter-pill[data-filter="${category}"]`);
  setCategoryFilter(category, targetPill);

  const searchInput = document.getElementById('globalSearchInput');
  const catalogSearch = document.getElementById('catalogSearchInput');
  const btnClear = document.getElementById('btnClearCatalogSearch');
  if (subquery) {
    if (searchInput) searchInput.value = subquery;
    if (catalogSearch) catalogSearch.value = subquery;
    if (btnClear) btnClear.classList.add('visible');
    AppState.filters.searchQuery = subquery.toLowerCase().trim();
  } else {
    if (searchInput) searchInput.value = '';
    if (catalogSearch) catalogSearch.value = '';
    if (btnClear) btnClear.classList.remove('visible');
    AppState.filters.searchQuery = '';
  }

  applyAllFiltersAndSort();

  const shopSection = document.getElementById('shopPreview');
  if (shopSection) {
    shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showToast(`Viewing: ${category.toUpperCase()} ${subquery ? '(' + subquery + ')' : ''}`, '🍪');
}

function initMobileDrawer() {
  const openBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('btnCloseDrawer');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('mobileDrawerBackdrop');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
}

function toggleMobileAcc(btn) {
  const item = btn.closest('.drawer-acc-item');
  if (item) {
    item.classList.toggle('open');
  }
}

/**
 * ============================================================================
 * Day 3 Features: Multi-Faceted Search & Advanced Filtering Hub (Issue #2)
 * ============================================================================
 */

function initCatalogFilterHub() {
  const catalogSearch = document.getElementById('catalogSearchInput');
  const btnClear = document.getElementById('btnClearCatalogSearch');

  if (catalogSearch) {
    catalogSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      AppState.filters.searchQuery = q;

      const headerSearch = document.getElementById('globalSearchInput');
      if (headerSearch && headerSearch.value !== e.target.value) {
        headerSearch.value = e.target.value;
      }

      if (btnClear) {
        if (e.target.value.length > 0) btnClear.classList.add('visible');
        else btnClear.classList.remove('visible');
      }

      applyAllFiltersAndSort();
    });

    catalogSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const shopSection = document.getElementById('shopPreview');
        if (shopSection) {
          shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (catalogSearch) {
        catalogSearch.value = '';
        catalogSearch.focus();
      }
      const headerSearch = document.getElementById('globalSearchInput');
      if (headerSearch) headerSearch.value = '';
      btnClear.classList.remove('visible');
      AppState.filters.searchQuery = '';
      applyAllFiltersAndSort();
    });
  }

  applyAllFiltersAndSort();
}

function quickFilterSearch(query) {
  const catalogSearch = document.getElementById('catalogSearchInput');
  const headerSearch = document.getElementById('globalSearchInput');
  const btnClear = document.getElementById('btnClearCatalogSearch');

  if (catalogSearch) catalogSearch.value = query;
  if (headerSearch) headerSearch.value = query;
  if (btnClear) btnClear.classList.add('visible');

  AppState.filters.searchQuery = query.toLowerCase().trim();
  applyAllFiltersAndSort();

  const shopSection = document.getElementById('shopPreview');
  if (shopSection) {
    shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showToast(`Filtering by keyword: "${query}"`, '🔍');
}

function setCategoryFilter(category, btn) {
  AppState.filters.category = category;

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.remove('active');
    if (pill.getAttribute('data-filter') === category) {
      pill.classList.add('active');
    }
  });

  applyAllFiltersAndSort();
}

function filterCatalog(category, btn) {
  setCategoryFilter(category, btn);
}

function toggleDietaryFilter(dietaryKey, btn) {
  if (AppState.filters.dietary.has(dietaryKey)) {
    AppState.filters.dietary.delete(dietaryKey);
    btn.classList.remove('active');
  } else {
    AppState.filters.dietary.add(dietaryKey);
    btn.classList.add('active');
  }

  applyAllFiltersAndSort();
}

function onPriceSliderChange(val) {
  const maxPrice = parseInt(val, 10);
  AppState.filters.maxPrice = maxPrice;

  const display = document.getElementById('priceDisplayLabel');
  if (display) {
    display.textContent = `₹${maxPrice.toLocaleString('en-IN')}`;
  }

  document.querySelectorAll('.price-preset-btn').forEach(btn => {
    const btnMax = parseInt(btn.getAttribute('data-max'), 10);
    if (btnMax === maxPrice) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  applyAllFiltersAndSort();
}

function setPricePreset(maxVal, btn) {
  const slider = document.getElementById('priceRangeSlider');
  if (slider) slider.value = maxVal;
  onPriceSliderChange(maxVal);
}

function onSortChange(sortMode) {
  AppState.filters.sortBy = sortMode;
  applyAllFiltersAndSort();
}

function toggleMobileFilters() {
  const body = document.getElementById('filterControlsBody');
  const toggleBtn = document.getElementById('btnToggleMobileFilterDrawer');
  if (body) body.classList.toggle('open');
  if (toggleBtn) toggleBtn.classList.toggle('open');
}

function applyAllFiltersAndSort() {
  const container = document.getElementById('productGridContainer');
  const cards = Array.from(document.querySelectorAll('.product-card'));
  const zeroState = document.getElementById('zeroResultsState');
  if (!container || cards.length === 0) return;

  const { searchQuery, category, dietary, maxPrice, sortBy } = AppState.filters;

  let matchingCards = [];
  let hiddenCards = [];

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    const matchesCategory = (category === 'all' || cardCat === category);

    const price = parseFloat(card.getAttribute('data-price') || '0');
    const matchesPrice = (price <= maxPrice);

    const cardDietary = (card.getAttribute('data-dietary') || '').toLowerCase().split(' ');
    let matchesDietary = true;
    for (const d of dietary) {
      if (!cardDietary.includes(d)) {
        matchesDietary = false;
        break;
      }
    }

    let matchesSearch = true;
    if (searchQuery) {
      const title = (card.querySelector('.product-title')?.textContent || '').toLowerCase();
      const catLabel = (card.querySelector('.product-category-label')?.textContent || '').toLowerCase();
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const desc = (card.querySelector('.product-card-desc')?.textContent || '').toLowerCase();

      matchesSearch = (title.includes(searchQuery) || catLabel.includes(searchQuery) || tags.includes(searchQuery) || desc.includes(searchQuery));
    }

    if (matchesCategory && matchesPrice && matchesDietary && matchesSearch) {
      matchingCards.push(card);
    } else {
      hiddenCards.push(card);
    }
  });

  // Sort matching cards
  matchingCards.sort((a, b) => {
    const priceA = parseFloat(a.getAttribute('data-price') || '0');
    const priceB = parseFloat(b.getAttribute('data-price') || '0');
    const ratingA = parseFloat(a.getAttribute('data-rating') || '0');
    const ratingB = parseFloat(b.getAttribute('data-rating') || '0');
    const rankA = parseInt(a.getAttribute('data-bestseller') || '99', 10);
    const rankB = parseInt(b.getAttribute('data-bestseller') || '99', 10);
    const nameA = a.getAttribute('data-name') || '';
    const nameB = b.getAttribute('data-name') || '';

    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'rating-desc':
        return ratingB - ratingA;
      case 'name-asc':
        return nameA.localeCompare(nameB);
      case 'bestseller':
      default:
        return rankA - rankB;
    }
  });

  matchingCards.forEach(card => {
    card.style.display = 'flex';
    container.appendChild(card);
  });

  hiddenCards.forEach(card => {
    card.style.display = 'none';
  });

  if (zeroState) {
    container.appendChild(zeroState);
    if (matchingCards.length === 0) {
      zeroState.style.display = 'block';
    } else {
      zeroState.style.display = 'none';
    }
  }

  updateCatalogCountBadge(matchingCards.length, cards.length);
  updateActiveFilterChips();
}

function updateCatalogCountBadge(visibleCount, totalCount = 16) {
  const badge = document.getElementById('catalogCountBadge');
  if (badge) {
    if (visibleCount === 0) {
      badge.innerHTML = 'Showing <strong style="color:var(--kb-burgundy);">0</strong> matching delicacies';
    } else if (visibleCount === totalCount) {
      badge.innerHTML = `Showing <strong>${visibleCount}</strong> authentic delicacies`;
    } else {
      badge.innerHTML = `Showing <strong>${visibleCount}</strong> of ${totalCount} delicacies`;
    }
  }
}

function updateActiveFilterChips() {
  const bar = document.getElementById('activeFiltersBar');
  const container = document.getElementById('activeChipsContainer');
  if (!bar || !container) return;

  const { searchQuery, category, dietary, maxPrice } = AppState.filters;
  const chips = [];

  const categoryLabels = {
    'biscuits': 'Biscuits & Cookies',
    'cakes': 'Cakes & Pastries',
    'sweets': 'Royal Mithai',
    'hampers': 'Luxury Hampers',
    'healthy': 'Healthy & Savoury'
  };

  const dietaryLabels = {
    'eggless': '100% Veg / Eggless',
    'vegan': 'Vegan',
    'sugar-free': 'Sugar-Free',
    'gluten-free': 'Gluten-Free',
    'nut-free': 'Nut-Free'
  };

  if (searchQuery) {
    chips.push({
      label: `Keyword: "${searchQuery}"`,
      onRemove: () => {
        const catalogSearch = document.getElementById('catalogSearchInput');
        const headerSearch = document.getElementById('globalSearchInput');
        const btnClear = document.getElementById('btnClearCatalogSearch');
        if (catalogSearch) catalogSearch.value = '';
        if (headerSearch) headerSearch.value = '';
        if (btnClear) btnClear.classList.remove('visible');
        AppState.filters.searchQuery = '';
        applyAllFiltersAndSort();
      }
    });
  }

  if (category !== 'all') {
    chips.push({
      label: `Category: ${categoryLabels[category] || category}`,
      onRemove: () => setCategoryFilter('all')
    });
  }

  dietary.forEach(d => {
    chips.push({
      label: `Dietary: ${dietaryLabels[d] || d}`,
      onRemove: () => {
        const btn = document.querySelector(`.dietary-pill[data-dietary="${d}"]`);
        if (btn) toggleDietaryFilter(d, btn);
      }
    });
  });

  if (maxPrice < 2000) {
    chips.push({
      label: `Budget: Under ₹${maxPrice.toLocaleString('en-IN')}`,
      onRemove: () => setPricePreset(2000)
    });
  }

  container.innerHTML = '';

  if (chips.length > 0) {
    chips.forEach(chip => {
      const chipEl = document.createElement('span');
      chipEl.className = 'active-filter-chip';
      chipEl.innerHTML = `<span>${chip.label}</span><button type="button" class="chip-remove" aria-label="Remove filter">✕</button>`;
      chipEl.querySelector('.chip-remove').addEventListener('click', chip.onRemove);
      container.appendChild(chipEl);
    });
    bar.style.display = 'flex';
  } else {
    bar.style.display = 'none';
  }
}

function resetAllFilters() {
  AppState.filters.searchQuery = '';
  AppState.filters.category = 'all';
  AppState.filters.dietary.clear();
  AppState.filters.maxPrice = 2000;
  AppState.filters.sortBy = 'bestseller';

  const catalogSearch = document.getElementById('catalogSearchInput');
  const headerSearch = document.getElementById('globalSearchInput');
  const btnClear = document.getElementById('btnClearCatalogSearch');
  if (catalogSearch) catalogSearch.value = '';
  if (headerSearch) headerSearch.value = '';
  if (btnClear) btnClear.classList.remove('visible');

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.remove('active');
    if (pill.getAttribute('data-filter') === 'all') pill.classList.add('active');
  });

  document.querySelectorAll('.dietary-pill').forEach(pill => pill.classList.remove('active'));

  const slider = document.getElementById('priceRangeSlider');
  if (slider) slider.value = 2000;
  const priceDisplay = document.getElementById('priceDisplayLabel');
  if (priceDisplay) priceDisplay.textContent = '₹2,000';
  document.querySelectorAll('.price-preset-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-max') === '2000') btn.classList.add('active');
  });

  const sortSelect = document.getElementById('catalogSortSelect');
  if (sortSelect) sortSelect.value = 'bestseller';

  applyAllFiltersAndSort();
  showToast('All filters reset! Showing all 16 delicacies.', '🔄');
}

function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    AppState.filters.searchQuery = query;

    const catalogSearch = document.getElementById('catalogSearchInput');
    const btnClear = document.getElementById('btnClearCatalogSearch');
    if (catalogSearch && catalogSearch.value !== e.target.value) {
      catalogSearch.value = e.target.value;
    }
    if (btnClear) {
      if (e.target.value.length > 0) btnClear.classList.add('visible');
      else btnClear.classList.remove('visible');
    }

    applyAllFiltersAndSort();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const shopSection = document.getElementById('shopPreview');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

/**
 * ============================================================================
 * Day 4 Features: Standardized Product Detail (PDP) Modal & Smart Cross-Sell (Issues #7, #14)
 * ============================================================================
 */

function openProductDetail(productId, event) {
  if (event) event.stopPropagation();

  const product = PRODUCT_CATALOG_DATA[productId];
  if (!product) return;

  AppState.activePdpId = productId;
  AppState.pdpQuantity = 1;

  const modal = document.getElementById('pdpModalBackdrop');
  const container = document.getElementById('pdpModalContent');
  if (!modal || !container) return;

  // Find companion bundle delicacy
  const bundlePair = product.bundle ? PRODUCT_CATALOG_DATA[product.bundle.pairId] : null;

  // Build dietary badges HTML
  const dietaryBadgesHtml = product.dietary.map(d => {
    if (d === 'veg') return '<span class="pdp-badge veg">100% Veg 🟢</span>';
    if (d === 'eggless') return '<span class="pdp-badge eggless">Eggless</span>';
    if (d === 'vegan') return '<span class="pdp-badge vegan">🌿 Vegan</span>';
    if (d === 'sugar-free') return '<span class="pdp-badge sugar-free">🍃 Sugar-Free / Stevia</span>';
    if (d === 'gluten-free') return '<span class="pdp-badge gluten-free">🌾 Gluten-Free</span>';
    if (d === 'nut-free') return '<span class="pdp-badge nut-free">🥜 Nut-Free</span>';
    return '';
  }).join('');

  // Build recommendation cards HTML
  const recommendationsHtml = (product.recommendations || []).map(recId => {
    const rec = PRODUCT_CATALOG_DATA[recId];
    if (!rec) return '';
    return `
      <div class="pdp-rec-card">
        <div class="pdp-rec-thumb" onclick="openProductDetail('${rec.id}')" title="Inspect ${rec.name}">
          ${rec.icon}
        </div>
        <div class="pdp-rec-details">
          <h5 onclick="openProductDetail('${rec.id}')">${rec.name}</h5>
          <span class="pdp-rec-unit">${rec.unit}</span>
          <div class="pdp-rec-bottom">
            <span class="pdp-rec-price">₹${rec.price}</span>
            <button type="button" class="btn-rec-quick-add" onclick="addToCart('${rec.name} (${rec.unit})', ${rec.price})">
              + Add
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Is product already in compare list?
  const isCompared = AppState.compareItems.includes(productId);

  container.innerHTML = `
    <div class="pdp-modal-layout">
      <!-- Left Column: Visual Showcase -->
      <div class="pdp-gallery-col">
        <div class="pdp-main-visual">
          <span class="pdp-hero-icon">${product.icon}</span>
          <span class="pdp-ribbon-tag">${product.badge}</span>
        </div>
        
        <div class="pdp-trust-chips">
          <div class="pdp-trust-chip">
            <span>🏛️</span>
            <strong>Hyderabad Heritage</strong>
            <small>Est. 1953</small>
          </div>
          <div class="pdp-trust-chip">
            <span>🛡️</span>
            <strong>Certified Authentic</strong>
            <small>${product.fssai}</small>
          </div>
          <div class="pdp-trust-chip">
            <span>✨</span>
            <strong>Freshly Baked</strong>
            <small>Direct from Master Bakers</small>
          </div>
        </div>

        <!-- Frequently Bought Together Bundle (Solves Issue #14) -->
        ${bundlePair ? `
          <div class="pdp-bundle-card">
            <div class="bundle-badge">⚡ Pair & Save ₹${product.bundle.savings}</div>
            <h4 class="bundle-heading">Frequently Relished Together</h4>
            <div class="bundle-items-visual">
              <div class="bundle-item-mini">
                <span class="bundle-icon">${product.icon}</span>
                <span class="bundle-name">${product.name}</span>
                <span class="bundle-price">₹${product.price}</span>
              </div>
              <span class="bundle-plus">+</span>
              <div class="bundle-item-mini">
                <span class="bundle-icon">${bundlePair.icon}</span>
                <span class="bundle-name">${bundlePair.name}</span>
                <span class="bundle-price">₹${bundlePair.price}</span>
              </div>
            </div>
            <div class="bundle-cta-row">
              <div class="bundle-pricing-details">
                <span class="bundle-deal-price">₹${product.bundle.comboPrice}</span>
                <span class="bundle-orig-price">₹${product.price + bundlePair.price}</span>
                <span class="bundle-save-tag">Save ₹${product.bundle.savings}</span>
              </div>
              <button type="button" class="btn-add-bundle" onclick="addBundleToCart('${product.id}', '${bundlePair.id}', ${product.bundle.comboPrice})">
                Add Both to Cart
              </button>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Right Column: Standardized Specifications (Solves Issue #7) -->
      <div class="pdp-info-col">
        <div class="pdp-header">
          <div class="pdp-category-pill">${product.categoryLabel}</div>
          <h2 class="pdp-title" id="pdpTitle">${product.name}</h2>
          
          <div class="pdp-meta-row">
            <div class="pdp-rating-strip">
              <span class="star-rating">⭐ ${product.rating}</span>
              <span class="review-count">(${product.reviews.toLocaleString()} verified customer ratings)</span>
            </div>
            <div class="pdp-dietary-row">
              ${dietaryBadgesHtml}
            </div>
          </div>

          <div class="pdp-pricing-strip">
            <div class="pdp-price-group">
              <span class="pdp-price-current">₹${product.price}</span>
              <span class="pdp-price-original">₹${product.originalPrice}</span>
              <span class="pdp-discount-tag">Save ₹${product.originalPrice - product.price}</span>
            </div>
            <span class="pdp-unit-indicator">Net Weight: <strong>${product.unit}</strong></span>
          </div>
        </div>

        <p class="pdp-description">${product.description}</p>

        <!-- Standardized Technical Specifications Matrix (Directly addresses Issue #7) -->
        <div class="pdp-specs-matrix">
          <h4 class="specs-matrix-title">📋 Standardized Delicacy Specifications</h4>
          <div class="specs-grid">
            <div class="spec-cell">
              <span class="spec-label">Net Quantity / Pack</span>
              <strong class="spec-value">${product.unit}</strong>
            </div>
            <div class="spec-cell">
              <span class="spec-label">Shelf Life & Freshness</span>
              <strong class="spec-value">${product.shelfLife}</strong>
            </div>
            <div class="spec-cell">
              <span class="spec-label">Packaging Standard</span>
              <strong class="spec-value">${product.packaging}</strong>
            </div>
            <div class="spec-cell">
              <span class="spec-label">Food Safety License</span>
              <strong class="spec-value">${product.fssai}</strong>
            </div>
            <div class="spec-cell">
              <span class="spec-label">Dietary Classification</span>
              <strong class="spec-value">${product.dietaryLabel}</strong>
            </div>
            <div class="spec-cell">
              <span class="spec-label">Artisanal Origin</span>
              <strong class="spec-value">${product.origin}</strong>
            </div>
          </div>
        </div>

        <!-- Nutritional Facts Table (Standardized per 100g) -->
        <div class="pdp-nutrition-panel">
          <div class="nutrition-header">
            <h4>📊 Nutritional Information (Approx. per 100g)</h4>
            <span class="nutrition-sub">FSSAI Certified Testing Values</span>
          </div>
          <div class="nutrition-table-grid">
            <div class="nutri-item">
              <span class="nutri-val">${product.nutrition.calories}</span>
              <span class="nutri-lbl">Energy / Calories</span>
            </div>
            <div class="nutri-item">
              <span class="nutri-val">${product.nutrition.carbs}</span>
              <span class="nutri-lbl">Carbohydrates</span>
            </div>
            <div class="nutri-item">
              <span class="nutri-val">${product.nutrition.addedSugar}</span>
              <span class="nutri-lbl">Added Sugars</span>
            </div>
            <div class="nutri-item">
              <span class="nutri-val">${product.nutrition.fats}</span>
              <span class="nutri-lbl">Total Fats</span>
            </div>
            <div class="nutri-item">
              <span class="nutri-val">${product.nutrition.protein}</span>
              <span class="nutri-lbl">Protein</span>
            </div>
          </div>
        </div>

        <!-- Ingredients & Allergen Transparency -->
        <div class="pdp-ingredients-box">
          <h4>🌿 Complete Ingredients</h4>
          <p>${product.ingredients}</p>
          <div class="pdp-allergen-alert">
            <span class="allergen-icon">⚠️</span>
            <div>
              <strong>Allergen Declaration:</strong> ${product.allergens}
            </div>
          </div>
        </div>

        <!-- Storage Guidelines -->
        <div class="pdp-storage-strip">
          <span>📦 <strong>Storage Instructions:</strong> ${product.storage}</span>
        </div>

        <!-- Purchasing Control Deck -->
        <div class="pdp-purchase-deck">
          <div class="qty-selector-wrap">
            <label class="qty-label">Quantity:</label>
            <div class="qty-stepper">
              <button type="button" class="btn-qty-step" onclick="changePdpQty(-1)">−</button>
              <span class="qty-display" id="pdpQtyDisplay">1</span>
              <button type="button" class="btn-qty-step" onclick="changePdpQty(1)">+</button>
            </div>
          </div>

          <div class="pdp-action-buttons">
            <button type="button" class="btn-pdp-cart" onclick="addPdpToCart()">
              <span>Add to Cart</span>
              <span class="pdp-btn-subtotal" id="pdpBtnSubtotal">₹${product.price}</span>
            </button>
            <button type="button" class="btn-pdp-compare ${isCompared ? 'active' : ''}" id="btnPdpCompare" onclick="toggleCompareItem('${product.id}', this, event)">
              ⚖️ ${isCompared ? 'Added to Compare' : 'Add to Compare'}
            </button>
          </div>
        </div>

        <!-- Smart Cross-Sell Carousel (Issue #14) -->
        <div class="pdp-cross-sells">
          <h4 class="cross-sell-title">👑 Customers Also Relished</h4>
          <div class="pdp-rec-grid">
            ${recommendationsHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeProductDetail() {
  const modal = document.getElementById('pdpModalBackdrop');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function changePdpQty(delta) {
  const product = PRODUCT_CATALOG_DATA[AppState.activePdpId];
  if (!product) return;

  AppState.pdpQuantity = Math.max(1, Math.min(20, AppState.pdpQuantity + delta));
  
  const display = document.getElementById('pdpQtyDisplay');
  const subtotalEl = document.getElementById('pdpBtnSubtotal');

  if (display) display.textContent = AppState.pdpQuantity;
  if (subtotalEl) {
    const total = product.price * AppState.pdpQuantity;
    subtotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
  }
}

function addPdpToCart() {
  const product = PRODUCT_CATALOG_DATA[AppState.activePdpId];
  if (!product) return;

  const qty = AppState.pdpQuantity;
  const totalPrice = product.price * qty;

  for (let i = 0; i < qty; i++) {
    AppState.cartItems.push({ name: `${product.name} (${product.unit})`, price: product.price });
  }

  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) {
    cartBadge.textContent = AppState.cartItems.length;
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
  }

  showToast(`Added ${qty}x "${product.name}" (Total ₹${totalPrice}) to your cart!`, '🛒');
  closeProductDetail();
}

function addBundleToCart(primaryId, bundleId, bundlePrice) {
  const p1 = PRODUCT_CATALOG_DATA[primaryId];
  const p2 = PRODUCT_CATALOG_DATA[bundleId];
  if (!p1 || !p2) return;

  AppState.cartItems.push({ name: `${p1.name} (${p1.unit})`, price: p1.price });
  AppState.cartItems.push({ name: `${p2.name} (${p2.unit})`, price: p2.price });

  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) {
    cartBadge.textContent = AppState.cartItems.length;
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
  }

  showToast(`🎉 Bundle Deal Added! "${p1.name}" + "${p2.name}" for ₹${bundlePrice}!`, '🎁');
}

/**
 * ============================================================================
 * Day 5 Features: Side-by-Side Product Comparison Drawer & Matrix (Issue #13)
 * ============================================================================
 */

function initCompareSystem() {
  const headerCompareBtn = document.getElementById('btnCompareBadge');
  if (headerCompareBtn) {
    headerCompareBtn.addEventListener('click', () => openCompareModal());
  }
  updateCompareUI();
}

function toggleCompareItem(productId, btnElement, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const product = PRODUCT_CATALOG_DATA[productId];
  if (!product) return;

  const index = AppState.compareItems.indexOf(productId);

  if (index > -1) {
    // Remove from compare
    AppState.compareItems.splice(index, 1);
    showToast(`Removed "${product.name}" from comparison.`, '⚖️');
  } else {
    // Add to compare (max 4)
    if (AppState.compareItems.length >= 4) {
      showToast('Comparison dock is full (maximum 4 delicacies). Remove one to add another.', '⚠️');
      return;
    }
    AppState.compareItems.push(productId);
    showToast(`Added "${product.name}" to comparison matrix.`, '⚖️');
  }

  updateCompareUI();

  // If compare modal is currently open, refresh it
  const modal = document.getElementById('compareModalBackdrop');
  if (modal && modal.style.display === 'flex') {
    renderCompareMatrix();
  }
}

function updateCompareUI() {
  const count = AppState.compareItems.length;

  // 1. Update header compare badge
  const headerBadge = document.getElementById('compareCount');
  if (headerBadge) {
    headerBadge.textContent = count;
    if (count > 0) {
      headerBadge.style.display = 'inline-block';
      headerBadge.classList.add('bump');
      setTimeout(() => headerBadge.classList.remove('bump'), 300);
    } else {
      headerBadge.style.display = 'none';
    }
  }

  // 2. Update all card compare buttons in catalog
  document.querySelectorAll('.btn-card-compare, .btn-card-compare-action').forEach(btn => {
    const cardId = btn.getAttribute('data-compare-id');
    if (AppState.compareItems.includes(cardId)) {
      btn.classList.add('active');
      btn.innerHTML = '✓ Compared';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '⚖️ Compare';
    }
  });

  // 3. Update PDP compare button if open
  const pdpBtn = document.getElementById('btnPdpCompare');
  if (pdpBtn && AppState.activePdpId) {
    if (AppState.compareItems.includes(AppState.activePdpId)) {
      pdpBtn.classList.add('active');
      pdpBtn.innerHTML = '✓ In Compare Matrix';
    } else {
      pdpBtn.classList.remove('active');
      pdpBtn.innerHTML = '⚖️ Add to Compare';
    }
  }

  // 4. Update Bottom Comparison Dock
  const dock = document.getElementById('comparisonDock');
  const itemsContainer = document.getElementById('dockItemsList');
  const countLabel = document.getElementById('dockCountLabel');

  if (!dock || !itemsContainer) return;

  if (count > 0) {
    dock.style.display = 'block';
    if (countLabel) {
      countLabel.innerHTML = `<strong>${count}</strong> of 4 delicacies selected`;
    }

    itemsContainer.innerHTML = AppState.compareItems.map(id => {
      const p = PRODUCT_CATALOG_DATA[id];
      if (!p) return '';
      return `
        <div class="dock-item-chip" title="${p.name}">
          <span class="dock-item-icon">${p.icon}</span>
          <span class="dock-item-name">${p.name}</span>
          <span class="dock-item-price">₹${p.price}</span>
          <button type="button" class="btn-dock-remove" onclick="toggleCompareItem('${p.id}', null, event)" title="Remove ${p.name}">✕</button>
        </div>
      `;
    }).join('');
  } else {
    dock.style.display = 'none';
  }
}

function openCompareModal() {
  const modal = document.getElementById('compareModalBackdrop');
  if (!modal) return;

  // If user hasn't selected items yet, auto-select top 2 iconic bestsellers for instant preview!
  if (AppState.compareItems.length === 0) {
    AppState.compareItems = ['p1', 'p2'];
    updateCompareUI();
    showToast("Loaded Hyderabad's Top 2 Bestsellers for instant comparison! You can add or swap delicacies anytime.", "⚖️");
  }

  renderCompareMatrix();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
  const modal = document.getElementById('compareModalBackdrop');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function renderCompareMatrix() {
  const body = document.getElementById('compareModalBody');
  if (!body) return;

  if (AppState.compareItems.length === 0) {
    body.innerHTML = `
      <div class="compare-empty-state">
        <span class="empty-icon">⚖️</span>
        <h3>No Delicacies in Comparison</h3>
        <p>Browse our catalog and click "⚖️ Compare" on any biscuit, sweet, cake, or hamper to compare ingredients, nutritional values, and prices side-by-side.</p>
        <button type="button" class="action-btn-primary" onclick="closeCompareModal()">Explore Delicacies</button>
      </div>
    `;
    return;
  }

  const items = AppState.compareItems.map(id => PRODUCT_CATALOG_DATA[id]).filter(Boolean);

  // Generate Comparison Columns
  body.innerHTML = `
    <div class="compare-table-container">
      <table class="compare-table">
        <thead>
          <tr>
            <th class="spec-header-col">Feature Comparison</th>
            ${items.map(item => `
              <th class="product-col-header">
                <button type="button" class="btn-matrix-remove" onclick="toggleCompareItem('${item.id}', null, event)" title="Remove from comparison">✕</button>
                <div class="matrix-thumb" onclick="openProductDetail('${item.id}')">${item.icon}</div>
                <div class="matrix-badge">${item.badge}</div>
                <h4 class="matrix-title" onclick="openProductDetail('${item.id}')">${item.name}</h4>
                <div class="matrix-cat">${item.categoryLabel}</div>
                <div class="matrix-price-row">
                  <span class="matrix-price">₹${item.price}</span>
                  <span class="matrix-orig">₹${item.originalPrice}</span>
                </div>
                <div class="matrix-value-metric">
                  ₹${((item.price / item.grams) * 100).toFixed(1)} / 100g
                </div>
                <button type="button" class="btn-matrix-add" onclick="addToCart('${item.name} (${item.unit})', ${item.price})">
                  🛒 Add to Cart
                </button>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <!-- Net Weight Row -->
          <tr>
            <td class="spec-title">📦 Pack Size / Weight</td>
            ${items.map(item => `<td><strong>${item.unit}</strong></td>`).join('')}
          </tr>

          <!-- Price Value Metric -->
          <tr>
            <td class="spec-title">💰 Price per 100g</td>
            ${items.map(item => `
              <td><span class="matrix-highlight">₹${((item.price / item.grams) * 100).toFixed(1)} per 100g</span></td>
            `).join('')}
          </tr>

          <!-- Shelf Life -->
          <tr>
            <td class="spec-title">⏳ Shelf Life & Freshness</td>
            ${items.map(item => `<td>${item.shelfLife}</td>`).join('')}
          </tr>

          <!-- Customer Rating -->
          <tr>
            <td class="spec-title">⭐ Customer Rating</td>
            ${items.map(item => `
              <td>
                <strong>⭐ ${item.rating} / 5.0</strong>
                <div style="font-size:0.75rem; color:var(--kb-text-muted);">(${item.reviews.toLocaleString()} reviews)</div>
              </td>
            `).join('')}
          </tr>

          <!-- Dietary Specifications -->
          <tr>
            <td class="spec-title">🥗 Dietary Profile</td>
            ${items.map(item => `
              <td>
                <div class="matrix-dietary-pills">
                  ${item.dietary.map(d => `<span class="matrix-pill">${d.toUpperCase()}</span>`).join('')}
                </div>
              </td>
            `).join('')}
          </tr>

          <!-- Packaging Spec -->
          <tr>
            <td class="spec-title">🎁 Packaging Specification</td>
            ${items.map(item => `<td>${item.packaging}</td>`).join('')}
          </tr>

          <!-- Key Ingredients -->
          <tr>
            <td class="spec-title">🌿 Primary Ingredients</td>
            ${items.map(item => `<td class="matrix-text-cell">${item.ingredients}</td>`).join('')}
          </tr>

          <!-- Allergen Profile -->
          <tr>
            <td class="spec-title">⚠️ Allergen Advisory</td>
            ${items.map(item => `
              <td class="matrix-text-cell">
                <span class="matrix-allergen-tag">${item.allergens}</span>
              </td>
            `).join('')}
          </tr>

          <!-- Calories & Sugars -->
          <tr>
            <td class="spec-title">📊 Energy (per 100g)</td>
            ${items.map(item => `<td><strong>${item.nutrition.calories}</strong></td>`).join('')}
          </tr>
          <tr>
            <td class="spec-title">🍃 Added Sugars</td>
            ${items.map(item => `<td>${item.nutrition.addedSugar}</td>`).join('')}
          </tr>

          <!-- Best Paired With -->
          <tr>
            <td class="spec-title">☕ Ideal Occasion & Pairing</td>
            ${items.map(item => `<td class="matrix-text-cell">${item.idealPairing}</td>`).join('')}
          </tr>

          <!-- Bottom Action Row -->
          <tr class="matrix-footer-row">
            <td class="spec-title">Action</td>
            ${items.map(item => `
              <td>
                <button type="button" class="btn-matrix-add" onclick="addToCart('${item.name} (${item.unit})', ${item.price})">
                  Add to Cart
                </button>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function clearAllCompare() {
  AppState.compareItems = [];
  updateCompareUI();
  closeCompareModal();
  showToast('All items cleared from comparison dock.', '🧹');
}

/**
 * ============================================================================
 * Modal Accessibility & Keyboard Navigation
 * ============================================================================
 */

function initModalsAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductDetail();
      closeCompareModal();
    }
  });
}

function handleBackdropClick(event) {
  if (event.target.id === 'pdpModalBackdrop') {
    closeProductDetail();
  }
}

function handleCompareBackdropClick(event) {
  if (event.target.id === 'compareModalBackdrop') {
    closeCompareModal();
  }
}

/**
 * ============================================================================
 * Cart & Toast Notification Manager
 * ============================================================================
 */

function addToCart(productName, price) {
  AppState.cartItems.push({ name: productName, price: price });
  
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) {
    cartBadge.textContent = AppState.cartItems.length;
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
  }

  showToast(`Added "${productName}" (₹${price}) to your cart!`, '🛒');
}

let toastTimeout;
function showToast(message, icon = '✨') {
  const toast = document.getElementById('toastNotice');
  const msgEl = document.getElementById('toastMessage');
  const iconEl = document.getElementById('toastIcon');

  if (!toast) return;

  msgEl.textContent = message;
  iconEl.textContent = icon;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
