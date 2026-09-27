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
  // Day 6 to 8 Suites:
  initB2BSuite();
  initCakeStudio();
  initStoreLocator();
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
  } else if (journeyId === 'b2b') {
    const b2b = document.getElementById('b2bHighlight');
    if (b2b) b2b.scrollIntoView({ behavior: 'smooth' });
    showToast('Switched to Corporate B2B & Bulk Order Suite (Day 6 Deliverable)', '🏢');
  } else if (journeyId === 'custom') {
    const custom = document.getElementById('customCakeSection');
    if (custom) custom.scrollIntoView({ behavior: 'smooth' });
    showToast('Welcome to Artisanal Custom Cake Studio (Day 7 Deliverable)', '🎂');
  } else if (journeyId === 'stores') {
    const stores = document.getElementById('storesSection');
    if (stores) stores.scrollIntoView({ behavior: 'smooth' });
    showToast('Browsing National Store Locator & Outlets (Day 8 Deliverable)', '📍');
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
  const trigger = document.getElementById('btnMegaMenu') || document.getElementById('navItemCategories') || document.querySelector('.has-mega-menu');
  const dropdown = document.getElementById('megaMenuDropdown');

  if (!dropdown) return;

  if (trigger) {
    const parentLi = trigger.closest('.has-mega-menu') || trigger;

    // Hover open on desktop
    parentLi.addEventListener('mouseenter', () => {
      clearTimeout(megaMenuTimer);
      dropdown.classList.add('visible');
      dropdown.classList.add('open');
      dropdown.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
    });

    parentLi.addEventListener('mouseleave', () => {
      megaMenuTimer = setTimeout(() => {
        dropdown.classList.remove('visible');
        dropdown.classList.remove('open');
        dropdown.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
      }, 280);
    });
  }

  dropdown.addEventListener('mouseenter', () => clearTimeout(megaMenuTimer));
  dropdown.addEventListener('mouseleave', () => {
    megaMenuTimer = setTimeout(() => {
      dropdown.classList.remove('visible');
      dropdown.classList.remove('open');
      dropdown.setAttribute('aria-hidden', 'true');
    }, 280);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('visible');
      dropdown.classList.remove('open');
      dropdown.setAttribute('aria-hidden', 'true');
    }
  });
}

function toggleMegaMenu(event) {
  if (event) event.preventDefault();
  const dropdown = document.getElementById('megaMenuDropdown');
  const trigger = document.getElementById('btnMegaMenu');
  if (!dropdown) return;

  const isOpen = dropdown.classList.contains('visible') || dropdown.classList.contains('open');
  if (isOpen) {
    dropdown.classList.remove('visible');
    dropdown.classList.remove('open');
    dropdown.setAttribute('aria-hidden', 'true');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  } else {
    dropdown.classList.add('visible');
    dropdown.classList.add('open');
    dropdown.setAttribute('aria-hidden', 'false');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }
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
      const cardText = (card.innerText || '').toLowerCase();
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const dietaryAttr = (card.getAttribute('data-dietary') || '').toLowerCase();
      const nameAttr = (card.getAttribute('data-name') || '').toLowerCase();
      
      const allText = `${cardText} ${tags} ${dietaryAttr} ${nameAttr}`;
      const normQuery = searchQuery.replace(/-/g, ' ');
      const normAllText = allText.replace(/-/g, ' ');

      matchesSearch = (allText.includes(searchQuery) || normAllText.includes(normQuery));
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
  const dropdown = document.getElementById('headerSearchAutocomplete');
  if (!searchInput) return;

  const renderAutocomplete = (query) => {
    if (!dropdown) return;
    if (!query || query.length < 2) {
      dropdown.style.display = 'none';
      return;
    }

    const normQ = query.replace(/-/g, ' ');
    const matches = Object.values(PRODUCT_CATALOG_DATA).filter(p => {
      const text = `${p.name} ${p.categoryLabel} ${p.ingredients} ${p.dietary.join(' ')}`.toLowerCase().replace(/-/g, ' ');
      return text.includes(normQ);
    }).slice(0, 4);

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div class="search-auto-empty">
          <span>No delicacies matching "${query}"</span>
          <button type="button" onclick="resetAllFilters(); document.getElementById('headerSearchAutocomplete').style.display='none';">View All 16 Delicacies</button>
        </div>
      `;
    } else {
      dropdown.innerHTML = `
        <div class="search-auto-header">Matching Delicacies (${matches.length}):</div>
        <div class="search-auto-list">
          ${matches.map(m => `
            <div class="search-auto-item" onclick="openProductDetail('${m.id}'); document.getElementById('headerSearchAutocomplete').style.display='none';">
              <span class="search-auto-icon">${m.icon}</span>
              <div class="search-auto-meta">
                <strong>${m.name}</strong>
                <small>${m.categoryLabel} • ₹${m.price}</small>
              </div>
              <button type="button" class="btn-auto-add" onclick="event.stopPropagation(); addToCart('${m.name} (${m.unit})', ${m.price});">
                + Add
              </button>
            </div>
          `).join('')}
        </div>
        <div class="search-auto-footer" onclick="document.getElementById('shopPreview').scrollIntoView({behavior:'smooth'}); document.getElementById('headerSearchAutocomplete').style.display='none';">
          <span>View all results in catalog &rarr;</span>
        </div>
      `;
    }

    dropdown.style.display = 'block';
  };

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
    renderAutocomplete(query);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (dropdown) dropdown.style.display = 'none';
      const shopSection = document.getElementById('shopPreview');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (dropdown && !dropdown.contains(e.target) && e.target !== searchInput) {
      dropdown.style.display = 'none';
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


/**
 * ============================================================================
 * Day 6 Deliverable: Dedicated B2B & Corporate Bulk Order Suite (Issues #3, #7, #8, #9)
 * ============================================================================
 */

const B2B_STATE = {
  selectedBasePrice: 650,
  selectedProductName: "Royal Heritage Collectible Gold Tin",
  selectedHsn: "1905",
  quantity: 100,
  tinFinish: 'gold',
  companyName: 'Acme Enterprises',
  tagline: 'Festive Celebrations 2026',
  customLogoUrl: null,
  activeQuote: null
};

function initB2BSuite() {
  const dateInput = document.getElementById('rfqDeliveryDate');
  if (dateInput) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    dateInput.value = targetDate.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }
  calculateB2BQuote();
}

function handleB2BQtySlider(val) {
  B2B_STATE.quantity = parseInt(val, 10);
  const display = document.getElementById('b2bQtyDisplay');
  if (display) display.textContent = B2B_STATE.quantity;
  updateB2BChipSelection(B2B_STATE.quantity);
  calculateB2BQuote();
}

function setB2BQuantity(qty) {
  B2B_STATE.quantity = qty;
  const slider = document.getElementById('b2bQtySlider');
  const display = document.getElementById('b2bQtyDisplay');
  if (slider) slider.value = qty;
  if (display) display.textContent = qty;
  updateB2BChipSelection(qty);
  calculateB2BQuote();
}

function updateB2BChipSelection(qty) {
  const chips = document.querySelectorAll('.b2b-qty-chip');
  chips.forEach(chip => {
    const text = chip.textContent;
    if (text.includes(`${qty} Boxes`)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

function calculateB2BQuote() {
  const select = document.getElementById('b2bProductSelect');
  if (select) {
    const option = select.options[select.selectedIndex];
    B2B_STATE.selectedBasePrice = parseInt(option.value, 10);
    B2B_STATE.selectedProductName = option.getAttribute('data-name');
    B2B_STATE.selectedHsn = option.getAttribute('data-hsn');
  }

  const qty = B2B_STATE.quantity;
  let discountPct = 0;
  let perkText = '';
  let tierLevel = 1;

  if (qty < 25) {
    discountPct = 0;
    tierLevel = 0;
    perkText = 'Minimum order quantity for volume corporate pricing is 25 boxes.';
  } else if (qty >= 25 && qty < 100) {
    discountPct = 0.10;
    tierLevel = 1;
    perkText = '🎁 <strong>Tier 1 Active:</strong> 10% Volume Discount on direct factory bakes!';
  } else if (qty >= 100 && qty < 500) {
    discountPct = 0.20;
    tierLevel = 2;
    perkText = '🎁 <strong>Tier 2 Unlocked:</strong> 20% Volume Discount + Complimentary Custom Gold Foil Ribbon!';
  } else if (qty >= 500 && qty < 1000) {
    discountPct = 0.25;
    tierLevel = 3;
    perkText = '👑 <strong>Tier 3 Unlocked:</strong> 25% Volume Discount + Complimentary Laser Tin Lid Logo Embossing!';
  } else {
    discountPct = 0.30;
    tierLevel = 4;
    perkText = '🏛️ <strong>Tier 4 Platinum:</strong> 30% Volume Discount + Free Pan-India Multi-Branch Logistics + Dedicated Key Account Manager!';
  }

  // Update tier milestone pills
  for (let i = 1; i <= 4; i++) {
    const pill = document.getElementById(`tierPill${i}`);
    if (pill) {
      if (i === tierLevel) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    }
  }

  // Update unlocked perk callout
  const perkEl = document.getElementById('b2bUnlockedPerk');
  if (perkEl) perkEl.innerHTML = perkText;

  // Financial Computations
  const baseTotal = B2B_STATE.selectedBasePrice * qty;
  const discountVal = Math.round(baseTotal * discountPct);
  const discountedSubtotal = baseTotal - discountVal;
  const gstVal = Math.round(discountedSubtotal * 0.05); // 5% GST on sweets & biscuits
  const finalTotal = discountedSubtotal + gstVal;
  const effectiveRate = (finalTotal / qty).toFixed(2);

  // Update DOM labels
  const baseTotalEl = document.getElementById('b2bBaseTotal');
  const discountPctEl = document.getElementById('b2bDiscountPct');
  const discountValEl = document.getElementById('b2bDiscountVal');
  const taxValEl = document.getElementById('b2bTaxVal');
  const finalTotalEl = document.getElementById('b2bFinalTotal');
  const effectiveRateEl = document.getElementById('b2bEffectiveRate');

  if (baseTotalEl) baseTotalEl.textContent = `₹${baseTotal.toLocaleString('en-IN')}`;
  if (discountPctEl) discountPctEl.textContent = `${Math.round(discountPct * 100)}%`;
  if (discountValEl) discountValEl.textContent = `-₹${discountVal.toLocaleString('en-IN')}`;
  if (taxValEl) taxValEl.textContent = `₹${gstVal.toLocaleString('en-IN')}`;
  if (finalTotalEl) finalTotalEl.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;
  if (effectiveRateEl) effectiveRateEl.textContent = `₹${effectiveRate} / box`;

  B2B_STATE.activeQuote = {
    baseTotal,
    discountPct,
    discountVal,
    gstVal,
    finalTotal,
    effectiveRate
  };
}

function updateTinBrandingPreview() {
  const companyInput = document.getElementById('b2bCompanyNameInput');
  const occasionInput = document.getElementById('b2bOccasionInput');
  const embossName = document.getElementById('tinCompanyEmboss');
  const embossTagline = document.getElementById('tinTaglineEmboss');
  const ribbonText = document.getElementById('tinRibbonText');

  const valName = companyInput ? companyInput.value.trim() : '';
  const valOccasion = occasionInput ? occasionInput.value.trim() : '';

  if (embossName) embossName.textContent = valName || 'YOUR COMPANY';
  if (embossTagline) embossTagline.textContent = valOccasion || 'FESTIVE CELEBRATIONS 2026';
  if (ribbonText) ribbonText.textContent = `Compliments from ${valName || 'Leadership Team'}`;

  B2B_STATE.companyName = valName || 'Acme Enterprises';
  B2B_STATE.tagline = valOccasion || 'Festive Celebrations 2026';
}

function changeTinFinish(finishName) {
  B2B_STATE.tinFinish = finishName;
  const tin = document.getElementById('tinMockupLid');
  if (tin) {
    tin.className = `tin-mockup ${finishName}`;
  }

  const swatches = document.querySelectorAll('.tin-swatch');
  swatches.forEach(s => {
    if (s.classList.contains(finishName)) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  showToast(`Keepsake tin updated to ${finishName.toUpperCase()} finish!`, '🎨');
}

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const container = document.getElementById('tinCoLogoContainer');
    if (container) {
      container.innerHTML = `<img src="${e.target.result}" alt="Corporate Logo" style="width:100%; height:100%; object-fit:contain;">`;
    }
    B2B_STATE.customLogoUrl = e.target.result;
    showToast('Corporate logo embossed onto gift tin mockup!', '🏢');
  };
  reader.readAsDataURL(file);
}

function validateGSTINFormat(gstin) {
  const badge = document.getElementById('gstStatusBadge');
  if (!badge) return;

  const clean = gstin.trim().toUpperCase();
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (gstRegex.test(clean)) {
    badge.className = 'gst-badge-pill valid';
    badge.textContent = '✓ Verified Format';
  } else if (clean.length > 0) {
    badge.className = 'gst-badge-pill invalid';
    badge.textContent = `${clean.length}/15 Digits`;
  } else {
    badge.className = 'gst-badge-pill';
    badge.textContent = 'Format Check';
  }
}

function generateCorporateQuotation() {
  const contact = document.getElementById('rfqContactPerson')?.value.trim();
  const email = document.getElementById('rfqEmail')?.value.trim();
  const phone = document.getElementById('rfqPhone')?.value.trim();
  const gstin = document.getElementById('rfqGstin')?.value.trim() || '36AAACK1234F1Z5';
  const deliveryDate = document.getElementById('rfqDeliveryDate')?.value;
  const dispatchScope = document.getElementById('rfqDispatchScope')?.value || 'single';

  if (!contact || !email) {
    showToast('Please enter your Contact Person name and Corporate Email to generate quotation.', '⚠️');
    return;
  }

  const quoteNumber = `KB-CORP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const quoteModal = document.getElementById('b2bQuoteModalBackdrop');
  const quoteContent = document.getElementById('b2bQuoteModalContent');

  if (!quoteModal || !quoteContent) return;

  const quote = B2B_STATE.activeQuote;
  const scopeLabel = dispatchScope === 'single' ? 'Single Central Corporate HQ' : (dispatchScope === 'multi-branch' ? 'Multi-Branch Pan-India Dispatch' : 'Employee Home Delivery (CSV)');

  quoteContent.innerHTML = `
    <div class="b2b-invoice-paper">
      <!-- Invoice Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; padding-bottom:1.25rem; border-bottom:2px solid var(--kb-burgundy);">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <span style="background:var(--kb-burgundy); color:#fff; font-weight:800; padding:0.25rem 0.5rem; border-radius:4px; font-size:0.9rem;">KB</span>
            <h2 style="font-family:var(--font-serif); color:var(--kb-burgundy); margin-bottom:0; font-size:1.5rem;">Karachi Bakery Pvt. Ltd.</h2>
          </div>
          <p style="font-size:0.8rem; color:var(--kb-text-secondary); margin-bottom:0.2rem;">Head Office: Mozamjahi Market, Abids, Hyderabad - 500001, Telangana</p>
          <p style="font-size:0.8rem; color:var(--kb-text-secondary); margin-bottom:0.2rem;">GSTIN: 36AAACK1953B1Z9 • FSSAI Lic: 13615015000254</p>
          <p style="font-size:0.8rem; color:var(--kb-text-secondary); margin-bottom:0;">Corporate Desk: b2b@karachibakery.com | +91 40 6666 2222</p>
        </div>
        <div style="text-align:right;">
          <span style="display:inline-block; background:var(--kb-gold-subtle); color:var(--kb-burgundy); font-weight:800; padding:0.35rem 0.75rem; border-radius:6px; font-size:0.85rem; border:1px solid var(--kb-border-gold); margin-bottom:0.4rem;">
            FORMAL PRO-FORMA INVOICE
          </span>
          <div style="font-size:0.85rem; color:var(--kb-text-primary); font-weight:700;">Quote Ref: ${quoteNumber}</div>
          <div style="font-size:0.8rem; color:var(--kb-text-muted);">Date: ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
          <div style="font-size:0.8rem; color:var(--kb-success); font-weight:600;">Valid for: 30 Calendar Days</div>
        </div>
      </div>

      <!-- Billed To & Logistics Info -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; background:var(--kb-cream); padding:1rem; border-radius:8px;">
        <div>
          <h4 style="font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--kb-burgundy); margin-bottom:0.35rem;">Billed To (Corporate Client):</h4>
          <strong style="display:block; font-size:0.95rem; color:var(--kb-text-primary);">${B2B_STATE.companyName}</strong>
          <span style="display:block; font-size:0.82rem; color:var(--kb-text-secondary);">Attn: ${contact} (${email})</span>
          <span style="display:block; font-size:0.82rem; color:var(--kb-text-secondary);">Phone: ${phone || 'Provided upon callback'}</span>
          <span style="display:block; font-size:0.82rem; color:var(--kb-text-secondary);">Client GSTIN: <strong>${gstin}</strong></span>
        </div>
        <div>
          <h4 style="font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--kb-burgundy); margin-bottom:0.35rem;">Order Specifications:</h4>
          <span style="display:block; font-size:0.82rem; color:var(--kb-text-secondary);">Target Delivery Date: <strong>${deliveryDate || 'Within 7 Business Days'}</strong></span>
          <span style="display:block; font-size:0.82rem; color:var(--kb-text-secondary);">Dispatch Logistics: <strong>${scopeLabel}</strong></span>
          <span style="display:block; font-size:0.82rem; color:var(--kb-text-secondary);">Keepsake Tin Finish: <strong>${B2B_STATE.tinFinish.toUpperCase()} Collection</strong></span>
          <span style="display:block; font-size:0.82rem; color:var(--kb-text-secondary);">Custom Branding: <strong>Laser Embossed Logo + Satin Ribbon</strong></span>
        </div>
      </div>

      <!-- Itemized Table -->
      <table style="width:100%; border-collapse:collapse; margin-bottom:1.5rem; font-size:0.85rem;">
        <thead>
          <tr style="background:var(--kb-burgundy); color:#fff; text-align:left;">
            <th style="padding:0.65rem 0.85rem; border-radius:6px 0 0 0;">Item Description</th>
            <th style="padding:0.65rem; text-align:center;">HSN</th>
            <th style="padding:0.65rem; text-align:center;">Qty</th>
            <th style="padding:0.65rem; text-align:right;">Base Rate</th>
            <th style="padding:0.65rem; text-align:right;">Volume Disc.</th>
            <th style="padding:0.65rem 0.85rem; text-align:right; border-radius:0 6px 0 0;">Taxable Value</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid var(--kb-border);">
            <td style="padding:0.85rem;">
              <strong>${B2B_STATE.selectedProductName}</strong>
              <small style="display:block; color:var(--kb-text-muted); font-size:0.75rem;">Includes customized company lid branding and airtight hermetic sealing</small>
            </td>
            <td style="padding:0.85rem; text-align:center;">${B2B_STATE.selectedHsn}</td>
            <td style="padding:0.85rem; text-align:center; font-weight:700;">${B2B_STATE.quantity}</td>
            <td style="padding:0.85rem; text-align:right;">₹${B2B_STATE.selectedBasePrice}</td>
            <td style="padding:0.85rem; text-align:right; color:var(--kb-success); font-weight:700;">${Math.round(quote.discountPct * 100)}%</td>
            <td style="padding:0.85rem; text-align:right; font-weight:700;">₹${(quote.baseTotal - quote.discountVal).toLocaleString('en-IN')}</td>
          </tr>
          <tr style="border-bottom:1px solid var(--kb-border);">
            <td style="padding:0.65rem 0.85rem;">
              <strong>Laser Tin Lid Tooling & Custom Foil Ribbon</strong>
            </td>
            <td style="padding:0.65rem; text-align:center;">9983</td>
            <td style="padding:0.65rem; text-align:center;">1 Job</td>
            <td style="padding:0.65rem; text-align:right;">₹2,500</td>
            <td style="padding:0.65rem; text-align:right; color:var(--kb-success); font-weight:700;">100% OFF</td>
            <td style="padding:0.65rem 0.85rem; text-align:right; font-weight:700; color:var(--kb-success);">₹0.00 (Free)</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals & Payment Summary -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;">
        <div style="max-width:380px; font-size:0.78rem; color:var(--kb-text-muted);">
          <strong>Terms & Conditions:</strong>
          <ul style="margin:0.25rem 0 0 1rem; line-height:1.4;">
            <li>Payment Terms: 50% advance on PO confirmation, balance 50% prior to dispatch.</li>
            <li>Shelf Life: 6 months guaranteed from production date.</li>
            <li>Delivery: Insured express transit across all designated recipient branches.</li>
          </ul>
        </div>
        <div style="min-width:260px; background:var(--kb-gold-subtle); padding:1rem; border-radius:8px; border:1px solid var(--kb-border-gold);">
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.35rem;">
            <span>Subtotal:</span>
            <span>₹${(quote.baseTotal - quote.discountVal).toLocaleString('en-IN')}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.35rem;">
            <span>CGST (2.5%):</span>
            <span>₹${Math.round(quote.gstVal / 2).toLocaleString('en-IN')}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.5rem;">
            <span>SGST (2.5%):</span>
            <span>₹${Math.round(quote.gstVal / 2).toLocaleString('en-IN')}</span>
          </div>
          <div style="height:1px; background:var(--kb-border-gold); margin-bottom:0.5rem;"></div>
          <div style="display:flex; justify-content:space-between; font-size:1.15rem; font-weight:800; color:var(--kb-burgundy);">
            <span>Grand Total:</span>
            <span>₹${quote.finalTotal.toLocaleString('en-IN')}</span>
          </div>
          <div style="font-size:0.75rem; text-align:right; color:var(--kb-text-muted); margin-top:0.25rem;">
            Effective Rate: <strong>₹${quote.effectiveRate} / box</strong>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding-top:1rem; border-top:1px dashed var(--kb-border);">
        <span style="font-size:0.8rem; color:var(--kb-text-muted);">Authorized Signatory: Karachi Bakery Corporate Institutional Sales</span>
        <button type="button" class="action-btn-primary" style="padding:0.6rem 1.25rem; font-size:0.85rem;" onclick="confirmB2BQuoteBooking('${quoteNumber}')">
          Accept Quote & Proceed to PO
        </button>
      </div>
    </div>
  `;

  quoteModal.style.display = 'flex';
  showToast(`Formal Quotation ${quoteNumber} generated!`, '📄');
}

function confirmB2BQuoteBooking(quoteNum) {
  closeB2BQuoteModal();
  AppState.cartItems.push({
    name: `Corporate Bulk Order (${quoteNum}) - ${B2B_STATE.quantity}x ${B2B_STATE.selectedProductName}`,
    price: B2B_STATE.activeQuote ? B2B_STATE.activeQuote.finalTotal : 54600
  });
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) {
    cartBadge.textContent = AppState.cartItems.length;
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
  }
  showToast(`Quotation ${quoteNum} accepted and added to your Cart!`, '🛒');
}

function closeB2BQuoteModal() {
  const quoteModal = document.getElementById('b2bQuoteModalBackdrop');
  if (quoteModal) quoteModal.style.display = 'none';
}

function handleB2BQuoteBackdrop(event) {
  if (event.target.id === 'b2bQuoteModalBackdrop') {
    closeB2BQuoteModal();
  }
}

function printB2BQuotation() {
  window.print();
}

function orderB2BSampleKit() {
  addToCart('Karachi Bakery Executive 4-Sample Tasting Kit (Fruit Biscuits, Osmania, Kaju Katli, Truffle)', 499);
  showToast('Executive Tasting Sample Kit added! (₹499 - 100% refundable upon bulk order)', '📦');
}

function requestAccountManagerCallback() {
  const phone = document.getElementById('rfqPhone')?.value.trim();
  const contact = document.getElementById('rfqContactPerson')?.value.trim();
  showToast(`Thank you ${contact || ''}! A Key Account Manager will contact you at ${phone || 'your number'} within 2 hours.`, '📞');
}


/**
 * ============================================================================
 * Day 7 Deliverable: Artisanal Custom Cake & Celebration Studio (Issues #10 & #11)
 * ============================================================================
 */

const CAKE_STUDIO_STATE = {
  step: 1,
  flavor: 'belgian_truffle',
  flavorName: 'Belgian Dark Chocolate Truffle',
  flavorPricePerKg: 1200,
  primaryColor: '#3D1C06',
  secondaryColor: '#261104',
  diet: 'eggless',
  dietLabel: '🌱 100% Eggless',
  weightKg: 1.0,
  tiers: 1,
  serves: '8 – 12 Servings',
  weightCostAdjustment: 0,
  shape: 'round',
  shapeName: 'Classic Round',
  shapeSurcharge: 0,
  frosting: 'whipped',
  frostingName: 'Whipped Dairy Cream',
  frostingSurcharge: 0,
  toppings: new Map(),
  message: 'Happy Birthday Priya! 🎉',
  deliveryDate: '',
  timeslot: 'morning',
  timeslotName: 'Morning Fresh (9:00 AM – 12:00 PM)',
  timeslotCost: 0,
  specialNotes: ''
};

function initCakeStudio() {
  const dateInput = document.getElementById('cakeDeliveryDate');
  if (dateInput) {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    dateInput.value = tmrw.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
    CAKE_STUDIO_STATE.deliveryDate = dateInput.value;
  }
  updateCakeCustomization();
}

function switchCakeStep(stepNum) {
  CAKE_STUDIO_STATE.step = stepNum;

  // Update step navigation tabs
  for (let i = 1; i <= 4; i++) {
    const tab = document.getElementById(`cakeTab${i}`);
    const panel = document.getElementById(`cakePanel${i}`);
    if (tab) {
      if (i === stepNum) tab.classList.add('active');
      else tab.classList.remove('active');
    }
    if (panel) {
      if (i === stepNum) {
        panel.style.display = 'block';
        panel.classList.add('active');
      } else {
        panel.style.display = 'none';
        panel.classList.remove('active');
      }
    }
  }
}

function handleCakeDietChange(dietVal) {
  CAKE_STUDIO_STATE.diet = dietVal;
  const dietLabels = {
    eggless: '🌱 100% Eggless',
    egg: '🥚 Classic European',
    sugarfree: '🍃 Sugar-Free Stevia',
    glutenfree: '🌾 Gluten-Free'
  };
  CAKE_STUDIO_STATE.dietLabel = dietLabels[dietVal] || 'Vegetarian';
  
  const dietPills = document.querySelectorAll('.cake-diet-chip');
  dietPills.forEach(pill => {
    const input = pill.querySelector('input');
    if (input && input.value === dietVal) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  const summaryDiet = document.getElementById('cakeSummaryDiet');
  if (summaryDiet) summaryDiet.textContent = CAKE_STUDIO_STATE.dietLabel;
}

function selectCakeFlavor(id, pricePerKg, name, color1, color2) {
  CAKE_STUDIO_STATE.flavor = id;
  CAKE_STUDIO_STATE.flavorPricePerKg = pricePerKg;
  CAKE_STUDIO_STATE.flavorName = name;
  CAKE_STUDIO_STATE.primaryColor = color1;
  CAKE_STUDIO_STATE.secondaryColor = color2;

  // Update active cards
  document.querySelectorAll('.flavor-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById(`flavorCard_${id}`);
  if (card) card.classList.add('active');

  // Update cake stage visual tiers color
  const tiers = document.querySelectorAll('.cake-tier');
  tiers.forEach(tier => {
    tier.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  });

  // Update chocolate plaque color
  const plaque = document.getElementById('cakeEdiblePlaque');
  if (plaque) plaque.style.background = color2;

  const summaryFlavor = document.getElementById('cakeSummaryFlavor');
  if (summaryFlavor) summaryFlavor.textContent = name;

  updateCakeCustomization();
  showToast(`Selected flavor: ${name}`, '🎂');
}

function selectCakeSize(weight, tiers, serves, surcharge) {
  CAKE_STUDIO_STATE.weightKg = weight;
  CAKE_STUDIO_STATE.tiers = tiers;
  CAKE_STUDIO_STATE.serves = serves;
  CAKE_STUDIO_STATE.weightCostAdjustment = surcharge;

  // Update active size cards
  document.querySelectorAll('.size-card').forEach(c => c.classList.remove('active'));
  const key = weight.toString().replace('.', '_');
  const card = document.getElementById(`sizeCard_${key}`);
  if (card) card.classList.add('active');

  // Update tier visibility on stage visualizer
  const t1 = document.getElementById('cakeTier1');
  const t2 = document.getElementById('cakeTier2');
  const t3 = document.getElementById('cakeTier3');

  if (tiers === 1) {
    if (t2) t2.style.display = 'none';
    if (t3) t3.style.display = 'none';
  } else if (tiers === 2) {
    if (t2) t2.style.display = 'block';
    if (t3) t3.style.display = 'none';
  } else if (tiers === 3) {
    if (t2) t2.style.display = 'block';
    if (t3) t3.style.display = 'block';
  }

  const summarySize = document.getElementById('cakeSummarySize');
  if (summarySize) summarySize.textContent = `${weight} kg (${serves}) • ${tiers}-Tier`;

  updateCakeCustomization();
}

function selectCakeShape(shape, surcharge, btn) {
  CAKE_STUDIO_STATE.shape = shape;
  CAKE_STUDIO_STATE.shapeSurcharge = surcharge;
  CAKE_STUDIO_STATE.shapeName = shape === 'round' ? 'Classic Round' : (shape === 'heart' ? 'Romantic Heart' : 'Modern Square');

  document.querySelectorAll('.cake-shape-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  updateCakeCustomization();
}

function selectCakeFrosting(frosting, surcharge) {
  CAKE_STUDIO_STATE.frosting = frosting;
  CAKE_STUDIO_STATE.frostingSurcharge = surcharge;
  
  const frostingNames = {
    whipped: 'Whipped Dairy Cream',
    buttercream: 'Italian Meringue Buttercream',
    ganache_drip: 'Belgian Ganache Cascading Drip',
    mirror_glaze: 'Saffron & Gold Mirror Glaze'
  };
  CAKE_STUDIO_STATE.frostingName = frostingNames[frosting] || frosting;

  document.querySelectorAll('.frosting-card').forEach(c => {
    const input = c.querySelector('input');
    if (input && input.value === frosting) c.classList.add('active');
    else c.classList.remove('active');
  });

  const summaryFrosting = document.getElementById('cakeSummaryFrosting');
  if (summaryFrosting) summaryFrosting.textContent = CAKE_STUDIO_STATE.frostingName;

  updateCakeCustomization();
}

function toggleCakeTopping(checkbox) {
  const key = checkbox.value;
  const price = parseInt(checkbox.getAttribute('data-price'), 10);
  const label = checkbox.getAttribute('data-label');

  if (checkbox.checked) {
    CAKE_STUDIO_STATE.toppings.set(key, { label, price });
  } else {
    CAKE_STUDIO_STATE.toppings.delete(key);
  }

  const row = document.getElementById('cakeSummaryToppingsRow');
  const summaryToppings = document.getElementById('cakeSummaryToppings');

  if (CAKE_STUDIO_STATE.toppings.size > 0) {
    if (row) row.style.display = 'flex';
    const names = Array.from(CAKE_STUDIO_STATE.toppings.values()).map(t => t.label).join(', ');
    if (summaryToppings) summaryToppings.textContent = names;
  } else {
    if (row) row.style.display = 'none';
  }

  updateCakeCustomization();
}

function updateCakeMessagePreview(text) {
  CAKE_STUDIO_STATE.message = text;
  const display = document.getElementById('plaqueTextDisplay');
  if (display) {
    display.textContent = text.trim() ? text : 'Your Message Here';
  }
}

function selectCakeTimeslot(slot, cost) {
  CAKE_STUDIO_STATE.timeslot = slot;
  CAKE_STUDIO_STATE.timeslotCost = cost;
  
  const slotNames = {
    morning: 'Morning Fresh (9 AM – 12 PM)',
    afternoon: 'Afternoon Treat (1 PM – 4 PM)',
    evening: 'Evening Party (5 PM – 8 PM)',
    midnight: 'Midnight Surprise (11:30 PM – 12:15 AM)'
  };
  CAKE_STUDIO_STATE.timeslotName = slotNames[slot] || slot;

  document.querySelectorAll('.timeslot-chip').forEach(c => {
    const input = c.querySelector('input');
    if (input && input.value === slot) c.classList.add('active');
    else c.classList.remove('active');
  });

  const summaryTimeslot = document.getElementById('cakeSummaryTimeslot');
  if (summaryTimeslot) summaryTimeslot.textContent = CAKE_STUDIO_STATE.timeslotName;

  updateCakeCustomization();
}

function updateCakeCustomization() {
  const baseRate = CAKE_STUDIO_STATE.flavorPricePerKg + CAKE_STUDIO_STATE.weightCostAdjustment;
  const shapeCost = CAKE_STUDIO_STATE.shapeSurcharge;
  
  let toppingsCost = CAKE_STUDIO_STATE.frostingSurcharge;
  CAKE_STUDIO_STATE.toppings.forEach(t => {
    toppingsCost += t.price;
  });

  const slotCost = CAKE_STUDIO_STATE.timeslotCost;
  const total = baseRate + shapeCost + toppingsCost + slotCost;

  const basePriceEl = document.getElementById('cakeBasePrice');
  const shapeSurchargeEl = document.getElementById('cakeShapeSurcharge');
  const toppingsCostEl = document.getElementById('cakeToppingsCost');
  const timeslotCostEl = document.getElementById('cakeTimeslotCost');
  const finalPriceEl = document.getElementById('cakeFinalPrice');

  if (basePriceEl) basePriceEl.textContent = `₹${baseRate.toLocaleString('en-IN')}`;
  if (shapeSurchargeEl) shapeSurchargeEl.textContent = shapeCost > 0 ? `+₹${shapeCost}` : '+₹0';
  if (toppingsCostEl) toppingsCostEl.textContent = toppingsCost > 0 ? `+₹${toppingsCost}` : '+₹0';
  if (timeslotCostEl) timeslotCostEl.textContent = slotCost > 0 ? `+₹${slotCost}` : 'FREE';
  if (finalPriceEl) finalPriceEl.textContent = `₹${total.toLocaleString('en-IN')}`;

  CAKE_STUDIO_STATE.calculatedTotal = total;
}

function bookCustomCake() {
  const notes = document.getElementById('cakeSpecialNotes')?.value.trim();
  const dateVal = document.getElementById('cakeDeliveryDate')?.value;
  if (dateVal) CAKE_STUDIO_STATE.deliveryDate = dateVal;

  const total = CAKE_STUDIO_STATE.calculatedTotal || 1200;
  const cakeTitle = `Bespoke ${CAKE_STUDIO_STATE.flavorName} (${CAKE_STUDIO_STATE.weightKg}kg • ${CAKE_STUDIO_STATE.tiers}-Tier)`;

  // Add to main shopping cart
  addToCart(cakeTitle, total);

  // Render Confirmation Modal
  const modal = document.getElementById('cakeModalBackdrop');
  const body = document.getElementById('cakeModalBody');

  if (modal && body) {
    const toppingsList = Array.from(CAKE_STUDIO_STATE.toppings.values()).map(t => t.label).join(', ') || 'Standard Artisan Garnish';
    
    body.innerHTML = `
      <div style="background:var(--kb-cream); padding:1.25rem; border-radius:12px; margin-bottom:1.25rem; border:1px solid var(--kb-border);">
        <h4 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--kb-burgundy); margin-bottom:0.5rem;">${cakeTitle}</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; font-size:0.85rem; color:var(--kb-text-secondary);">
          <div>Dietary: <strong>${CAKE_STUDIO_STATE.dietLabel}</strong></div>
          <div>Geometry: <strong>${CAKE_STUDIO_STATE.shapeName}</strong></div>
          <div>Frosting: <strong>${CAKE_STUDIO_STATE.frostingName}</strong></div>
          <div>Servings: <strong>${CAKE_STUDIO_STATE.serves}</strong></div>
          <div>Delivery Date: <strong>${CAKE_STUDIO_STATE.deliveryDate || 'Tomorrow'}</strong></div>
          <div>Timeslot: <strong>${CAKE_STUDIO_STATE.timeslotName}</strong></div>
        </div>
        <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed var(--kb-border); font-size:0.85rem;">
          <div>Inscribed Plaque: <strong style="color:var(--kb-burgundy); font-family:var(--font-serif);">"${CAKE_STUDIO_STATE.message}"</strong></div>
          <div>Gourmet Accents: <strong>${toppingsList}</strong></div>
          ${notes ? `<div>Kitchen Notes: <em>"${notes}"</em></div>` : ''}
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:1.2rem; font-weight:800; color:var(--kb-burgundy);">Total: ₹${total.toLocaleString('en-IN')}</span>
        <button type="button" class="action-btn-primary" onclick="closeCakeModal()" style="padding:0.6rem 1.5rem;">Continue Shopping</button>
      </div>
    `;
    modal.style.display = 'flex';
  }

  showToast('Custom Celebration Cake successfully booked & added to Cart!', '🎂');
}

function closeCakeModal() {
  const modal = document.getElementById('cakeModalBackdrop');
  if (modal) modal.style.display = 'none';
}

function handleCakeModalBackdrop(event) {
  if (event.target.id === 'cakeModalBackdrop') {
    closeCakeModal();
  }
}


/**
 * ============================================================================
 * Day 8 Deliverable: National Store Locator & Interactive Outlets Hub (Issues #5 & #6)
 * ============================================================================
 */

const STORE_LOCATIONS_DATA = [
  {
    id: 'hyd-1',
    name: 'Mozamjahi Market Flagship (Est. 1953)',
    city: 'hyderabad',
    cityLabel: 'Hyderabad, Telangana',
    type: 'flagship',
    typeLabel: '🏛️ Heritage Flagship',
    address: 'MJ Market, Abids, Hyderabad - 500001 (Opp. Heritage Clock Tower)',
    hours: '9:00 AM – 10:30 PM',
    openHour: 9,
    closeHour: 22.5,
    is24Hours: false,
    phone: '+91 40 2461 4872',
    amenities: ['☕ Cafe & Tea Bar', '🎂 Custom Cake Counter', '🚗 Valet Parking', '📶 Free Wi-Fi'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Mozamjahi+Market+Hyderabad'
  },
  {
    id: 'hyd-2',
    name: 'Banjara Hills Bistro & Bakery',
    city: 'hyderabad',
    cityLabel: 'Hyderabad, Telangana',
    type: 'cafe',
    typeLabel: '☕ Cafe & Dine-In',
    address: 'Road No. 1, Opp. Taj Krishna, Banjara Hills, Hyderabad - 500034',
    hours: '9:00 AM – 11:00 PM',
    openHour: 9,
    closeHour: 23,
    is24Hours: false,
    phone: '+91 40 6666 2222',
    amenities: ['☕ Continental Cafe', '🍕 Woodfired Pizza', '🎂 Cake Studio', '🚗 Valet Parking'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Banjara+Hills+Hyderabad'
  },
  {
    id: 'hyd-3',
    name: 'Cyberabad Hitec City Tech Hub',
    city: 'hyderabad',
    cityLabel: 'Hyderabad, Telangana',
    type: 'express',
    typeLabel: '🛍️ Express Retail',
    address: 'Opp. Bio-Diversity Complex, Gachibowli Main Road, Hyderabad - 500081',
    hours: '8:30 AM – 11:30 PM',
    openHour: 8.5,
    closeHour: 23.5,
    is24Hours: false,
    phone: '+91 40 2988 5678',
    amenities: ['🏢 Corporate Gifting Desk', '🎂 Cake Counter', '⚡ Quick Takeaway'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Gachibowli+Hyderabad'
  },
  {
    id: 'hyd-4',
    name: 'RGI Airport Domestic Terminal 1',
    city: 'hyderabad',
    cityLabel: 'Hyderabad, Telangana',
    type: 'airport',
    typeLabel: '✈️ Airport 24/7',
    address: 'Shaheed Bhagat Singh Domestic Departures, Shamshabad - 500409',
    hours: 'Open 24 Hours • 7 Days a Week',
    openHour: 0,
    closeHour: 24,
    is24Hours: true,
    phone: '+91 40 6697 5000',
    amenities: ['✈️ Travel Sealed Tins', '🎁 Gift Packing', '⚡ 24/7 Open Counter'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Rajiv+Gandhi+Airport+Hyderabad'
  },
  {
    id: 'hyd-5',
    name: 'Secunderabad Heritage Clock Tower',
    city: 'hyderabad',
    cityLabel: 'Hyderabad, Telangana',
    type: 'flagship',
    typeLabel: '🏛️ Heritage Flagship',
    address: 'Sarojini Devi Road, Near Clock Tower, Secunderabad - 500003',
    hours: '9:30 AM – 10:00 PM',
    openHour: 9.5,
    closeHour: 22,
    is24Hours: false,
    phone: '+91 40 2780 4321',
    amenities: ['🍬 Pure Mithai Counter', '🍪 Fresh Bakes', '☕ Irani Chai Bar'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Secunderabad'
  },
  {
    id: 'blr-1',
    name: 'Bengaluru Indiranagar 100ft Road',
    city: 'bengaluru',
    cityLabel: 'Bengaluru, Karnataka',
    type: 'cafe',
    typeLabel: '☕ Cafe & Dine-In',
    address: '777-H, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038',
    hours: '9:00 AM – 10:30 PM',
    openHour: 9,
    closeHour: 22.5,
    is24Hours: false,
    phone: '+91 80 4112 8899',
    amenities: ['☕ Artisan Cafe', '🎂 Bespoke Pastries', '📶 High Speed Wi-Fi'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Indiranagar+Bengaluru'
  },
  {
    id: 'blr-2',
    name: 'Kempegowda Airport (BLR) T2 Departures',
    city: 'bengaluru',
    cityLabel: 'Bengaluru, Karnataka',
    type: 'airport',
    typeLabel: '✈️ Airport 24/7',
    address: 'Terminal 2 Garden Terminal, Security Hold Area, Devanahalli - 560300',
    hours: 'Open 24 Hours • 7 Days a Week',
    openHour: 0,
    closeHour: 24,
    is24Hours: true,
    phone: '+91 80 6678 2000',
    amenities: ['✈️ Flight Safe Packing', '🎁 Travel Tin Curations', '⚡ 24/7 Service'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+BLR+Airport+Terminal+2'
  },
  {
    id: 'blr-3',
    name: 'Bengaluru Koramangala 5th Block',
    city: 'bengaluru',
    cityLabel: 'Bengaluru, Karnataka',
    type: 'cafe',
    typeLabel: '☕ Cafe & Dine-In',
    address: '80 Feet Road, 5th Block, Koramangala, Bengaluru - 560095',
    hours: '10:00 AM – 11:00 PM',
    openHour: 10,
    closeHour: 23,
    is24Hours: false,
    phone: '+91 80 4099 3344',
    amenities: ['☕ Youth Lounge', '🍪 Signature Biscuits', '🎂 Quick Cake Delivery'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Koramangala+Bengaluru'
  },
  {
    id: 'mum-1',
    name: 'Mumbai Bandra Linking Road',
    city: 'mumbai',
    cityLabel: 'Mumbai, Maharashtra',
    type: 'flagship',
    typeLabel: '🏛️ Heritage Flagship',
    address: 'Corner of Linking Road & 24th Road, Bandra West, Mumbai - 400050',
    hours: '9:30 AM – 10:30 PM',
    openHour: 9.5,
    closeHour: 22.5,
    is24Hours: false,
    phone: '+91 22 2640 1234',
    amenities: ['🎁 Luxury Hampers', '🍪 Fresh Fruit Biscuit Cans', '🎂 Custom Celebration Bakes'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Bandra+Mumbai'
  },
  {
    id: 'mum-2',
    name: 'Mumbai CSMI Airport (BOM) T2',
    city: 'mumbai',
    cityLabel: 'Mumbai, Maharashtra',
    type: 'airport',
    typeLabel: '✈️ Airport 24/7',
    address: 'Terminal 2 Domestic Departures, Chhatrapati Shivaji Airport, Andheri East - 400099',
    hours: 'Open 24 Hours • 7 Days a Week',
    openHour: 0,
    closeHour: 24,
    is24Hours: true,
    phone: '+91 22 6685 1000',
    amenities: ['✈️ Air Travel Packs', '🎁 Keepsake Gift Tins', '⚡ 24/7 Open'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Mumbai+Airport+T2'
  },
  {
    id: 'del-1',
    name: 'Delhi NCR Connaught Place Flagship',
    city: 'delhi',
    cityLabel: 'New Delhi, Delhi NCR',
    type: 'flagship',
    typeLabel: '🏛️ Heritage Flagship',
    address: 'Outer Circle, Block L, Connaught Place, New Delhi - 110001',
    hours: '9:30 AM – 10:30 PM',
    openHour: 9.5,
    closeHour: 22.5,
    is24Hours: false,
    phone: '+91 11 2341 5678',
    amenities: ['🏛️ Heritage Parlour', '🍬 Royal Mithai', '☕ High Tea Counter'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+Connaught+Place+Delhi'
  },
  {
    id: 'del-2',
    name: 'Delhi IGI Airport (DEL) T3 Departures',
    city: 'delhi',
    cityLabel: 'New Delhi, Delhi NCR',
    type: 'airport',
    typeLabel: '✈️ Airport 24/7',
    address: 'Terminal 3 International & Domestic Departures, IGI Airport - 110037',
    hours: 'Open 24 Hours • 7 Days a Week',
    openHour: 0,
    closeHour: 24,
    is24Hours: true,
    phone: '+91 11 4963 8000',
    amenities: ['✈️ Duty Free Area Adjacent', '🎁 Export Quality Tins', '⚡ 24/7 Service'],
    mapsUrl: 'https://maps.google.com/?q=Karachi+Bakery+IGI+Airport+Terminal+3'
  }
];

const StoreLocatorState = {
  activeCity: 'all',
  activeType: 'all',
  searchQuery: '',
  selectedStoreId: 'hyd-1'
};

function initStoreLocator() {
  renderStoreCards(STORE_LOCATIONS_DATA);
  selectStoreSpotlight('hyd-1');

  // Update clock pill
  const clockEl = document.getElementById('liveClockPill');
  if (clockEl) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    clockEl.textContent = `🕒 Outlets Status: Checked at ${timeStr}`;
  }
}

function calculateStoreLiveStatus(store) {
  if (store.is24Hours) {
    return { statusText: '✈️ Open 24 Hours', pillClass: 'airport24' };
  }

  const now = new Date();
  const currentHours = now.getHours() + now.getMinutes() / 60;

  if (currentHours >= store.openHour && currentHours < store.closeHour) {
    const closeTimeStr = store.hours.includes('–') ? store.hours.split('–')[1].trim() : 'Evening';
    return { statusText: `🟢 Open Now • Closes ${closeTimeStr}`, pillClass: 'open' };
  } else {
    const openTimeStr = store.hours.includes('–') ? store.hours.split('–')[0].trim() : 'Morning';
    return { statusText: `🔴 Closed • Opens ${openTimeStr}`, pillClass: 'closed' };
  }
}

function renderStoreCards(stores) {
  const container = document.getElementById('storeCardsList');
  const countEl = document.getElementById('storeCountDisplay');
  if (!container) return;

  if (countEl) {
    countEl.innerHTML = `Showing <strong>${stores.length}</strong> verified outlets across India`;
  }

  if (stores.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem 1.5rem; background:#fff; border-radius:12px; border:1px dashed var(--kb-border);">
        <span style="font-size:2.5rem; display:block; margin-bottom:0.5rem;">🔍</span>
        <h4 style="color:var(--kb-burgundy); margin-bottom:0.25rem;">No Outlets Found</h4>
        <p style="font-size:0.85rem; color:var(--kb-text-muted); margin-bottom:1rem;">We couldn't find an outlet matching your search criteria.</p>
        <button type="button" class="action-btn-primary" onclick="clearStoreSearch()" style="padding:0.4rem 1rem; font-size:0.8rem;">View All 12 Outlets</button>
      </div>
    `;
    return;
  }

  container.innerHTML = stores.map(store => {
    const liveStatus = calculateStoreLiveStatus(store);
    const isSelected = store.id === StoreLocatorState.selectedStoreId ? 'selected' : '';

    return `
      <div class="store-card ${isSelected}" id="storeCard_${store.id}" onclick="selectStoreSpotlight('${store.id}')">
        <div class="store-card-header">
          <div class="store-badge-row">
            <span class="store-badge ${store.type}">${store.typeLabel}</span>
            <span class="store-badge" style="background:#F3F4F6; color:var(--kb-text-muted);">${store.cityLabel.split(',')[0]}</span>
          </div>
          <span class="store-status-pill ${liveStatus.pillClass}">${liveStatus.statusText}</span>
        </div>
        <h3 class="store-name">${store.name}</h3>
        <p class="store-address">📍 ${store.address}</p>
        <div class="store-meta-row">
          <span>🕒 <strong>${store.hours}</strong></span>
          <span>📞 <a href="tel:${store.phone.replace(/\s+/g, '')}" onclick="event.stopPropagation()">${store.phone}</a></span>
        </div>
        <div class="store-amenities-row">
          ${store.amenities.map(a => `<span class="store-amenity-chip">${a}</span>`).join('')}
        </div>
        <div class="store-card-actions">
          <a href="${store.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-store-action primary" onclick="event.stopPropagation()">
            <span>🗺️ Get Directions</span>
          </a>
          <a href="tel:${store.phone.replace(/\s+/g, '')}" class="btn-store-action" onclick="event.stopPropagation()">
            <span>📞 Call</span>
          </a>
          <button type="button" class="btn-store-action" onclick="shareStoreWhatsApp('${store.id}'); event.stopPropagation();">
            <span>💬 Share</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterStoresByCity(city, btn) {
  StoreLocatorState.activeCity = city;
  
  document.querySelectorAll('.city-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');

  applyStoreFilters();

  // Highlight map pin
  highlightMapPin(city);
}

function filterStoresByType(type, btn) {
  StoreLocatorState.activeType = type;

  document.querySelectorAll('.type-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');

  applyStoreFilters();
}

function filterStores() {
  const input = document.getElementById('storeSearchInput');
  const clearBtn = document.getElementById('btnStoreSearchClear');
  
  if (input) {
    StoreLocatorState.searchQuery = input.value.trim().toLowerCase();
    if (clearBtn) clearBtn.style.display = StoreLocatorState.searchQuery ? 'flex' : 'none';
  }

  applyStoreFilters();
}

function clearStoreSearch() {
  const input = document.getElementById('storeSearchInput');
  const clearBtn = document.getElementById('btnStoreSearchClear');
  if (input) input.value = '';
  if (clearBtn) clearBtn.style.display = 'none';

  StoreLocatorState.searchQuery = '';
  StoreLocatorState.activeCity = 'all';
  StoreLocatorState.activeType = 'all';

  document.querySelectorAll('.city-pill').forEach(p => {
    if (p.getAttribute('data-city') === 'all') p.classList.add('active');
    else p.classList.remove('active');
  });

  document.querySelectorAll('.type-pill').forEach(p => {
    if (p.getAttribute('data-type') === 'all') p.classList.add('active');
    else p.classList.remove('active');
  });

  highlightMapPin('hyderabad');
  applyStoreFilters();
}

function applyStoreFilters() {
  let filtered = STORE_LOCATIONS_DATA;

  // City filter
  if (StoreLocatorState.activeCity !== 'all') {
    filtered = filtered.filter(s => s.city === StoreLocatorState.activeCity);
  }

  // Type filter
  if (StoreLocatorState.activeType !== 'all') {
    filtered = filtered.filter(s => s.type === StoreLocatorState.activeType);
  }

  // Text search filter
  if (StoreLocatorState.searchQuery) {
    const q = StoreLocatorState.searchQuery;
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.cityLabel.toLowerCase().includes(q) ||
      s.amenities.some(a => a.toLowerCase().includes(q))
    );
  }

  renderStoreCards(filtered);

  if (filtered.length > 0) {
    selectStoreSpotlight(filtered[0].id);
  }
}

function selectStoreSpotlight(storeId) {
  StoreLocatorState.selectedStoreId = storeId;
  const store = STORE_LOCATIONS_DATA.find(s => s.id === storeId);
  if (!store) return;

  // Highlight card
  document.querySelectorAll('.store-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById(`storeCard_${storeId}`);
  if (card) {
    card.classList.add('selected');
  }

  // Update spotlight panel
  const badgeEl = document.getElementById('spotlightBadge');
  const statusEl = document.getElementById('spotlightStatus');
  const nameEl = document.getElementById('spotlightName');
  const cityEl = document.getElementById('spotlightCity');
  const addressEl = document.getElementById('spotlightAddress');
  const hoursEl = document.getElementById('spotlightHours');
  const phoneEl = document.getElementById('spotlightPhone');
  const amenitiesEl = document.getElementById('spotlightAmenities');
  const directionsEl = document.getElementById('spotlightDirectionsLink');
  const callEl = document.getElementById('spotlightCallLink');

  const liveStatus = calculateStoreLiveStatus(store);

  if (badgeEl) badgeEl.textContent = store.typeLabel;
  if (statusEl) {
    statusEl.textContent = liveStatus.statusText;
    statusEl.style.color = liveStatus.pillClass === 'closed' ? '#B91C1C' : '#15803D';
  }
  if (nameEl) nameEl.textContent = store.name;
  if (cityEl) cityEl.textContent = store.cityLabel;
  if (addressEl) addressEl.textContent = store.address;
  if (hoursEl) hoursEl.textContent = store.hours;
  if (phoneEl) phoneEl.textContent = store.phone;
  if (amenitiesEl) {
    amenitiesEl.innerHTML = store.amenities.map(a => `<span class="amenity-chip">${a}</span>`).join('');
  }
  if (directionsEl) directionsEl.href = store.mapsUrl;
  if (callEl) callEl.href = `tel:${store.phone.replace(/\s+/g, '')}`;

  highlightMapPin(store.city);
}

function selectMapPin(city) {
  filterStoresByCity(city);
  const cityPill = document.querySelector(`.city-pill[data-city="${city}"]`);
  if (cityPill) {
    document.querySelectorAll('.city-pill').forEach(p => p.classList.remove('active'));
    cityPill.classList.add('active');
  }
  showToast(`Filtered outlets for ${city.toUpperCase()}`, '📍');
}

function highlightMapPin(city) {
  document.querySelectorAll('.map-marker-pin').forEach(pin => {
    if (city === 'all') {
      pin.classList.remove('active');
    } else if (pin.classList.contains(`marker-${city}`)) {
      pin.classList.add('active');
    } else {
      pin.classList.remove('active');
    }
  });
}

function findNearestStore() {
  selectStoreSpotlight('hyd-1');
  const card = document.getElementById('storeCard_hyd-1');
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  showToast('Located nearest flagship outlet: Mozamjahi Market (Est. 1953)!', '📍');
}

function shareStoreWhatsApp(storeId) {
  const store = STORE_LOCATIONS_DATA.find(s => s.id === storeId);
  if (!store) return;
  const msg = encodeURIComponent(`Karachi Bakery Outlet: ${store.name}\nAddress: ${store.address}\nHours: ${store.hours}\nPhone: ${store.phone}\nDirections: ${store.mapsUrl}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}


/**
 * ============================================================================
 * Shopping Cart Drawer & Checkout Hub Logic (Issue #4 & #12)
 * ============================================================================
 */

function openCartDrawer() {
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (!backdrop) return;

  renderCartDrawerContent();
  backdrop.style.display = 'flex';
  // Small delay for CSS transition
  requestAnimationFrame(() => {
    backdrop.classList.add('active');
  });
}

function closeCartDrawer() {
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (!backdrop) return;

  backdrop.classList.remove('active');
  setTimeout(() => {
    backdrop.style.display = 'none';
  }, 320);
}

function handleCartBackdropClick(event) {
  if (event.target.id === 'cartDrawerBackdrop') {
    closeCartDrawer();
  }
}

function renderCartDrawerContent() {
  const container = document.getElementById('cartItemsList');
  const footer = document.getElementById('cartDrawerBottom');
  const headerCount = document.getElementById('cartHeaderCount');
  const cartBadge = document.getElementById('cartCount');

  if (!container || !footer) return;

  const items = AppState.cartItems || [];
  const totalCount = items.length;

  if (headerCount) headerCount.textContent = `${totalCount} ${totalCount === 1 ? 'Item' : 'Items'}`;
  if (cartBadge) cartBadge.textContent = totalCount;

  if (totalCount === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">🛒</div>
        <h4 class="cart-empty-title">Your Cart is Empty</h4>
        <p class="cart-empty-desc">Explore Hyderabad's iconic Fruit Biscuits, Royal Osmania, and Handcrafted Mithai.</p>
        <button type="button" class="btn-start-shopping" onclick="closeCartDrawer(); document.getElementById('shopPreview').scrollIntoView({ behavior: 'smooth' });">
          Explore Delicacies 🍪
        </button>
      </div>
    `;
    footer.innerHTML = `
      <div style="text-align:center; font-size:0.8rem; color:var(--kb-text-muted);">
        ✨ Free shipping across Hyderabad on orders above ₹499
      </div>
    `;
    return;
  }

  // Aggregate items by name to allow quantity adjustments
  const aggregated = new Map();
  items.forEach((item, originalIndex) => {
    const key = item.name;
    if (aggregated.has(key)) {
      const existing = aggregated.get(key);
      existing.qty += 1;
      existing.indices.push(originalIndex);
    } else {
      aggregated.set(key, {
        name: item.name,
        price: item.price,
        qty: 1,
        indices: [originalIndex]
      });
    }
  });

  let subtotal = 0;
  let itemsHtml = '';

  aggregated.forEach((item, name) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    // Detect item icon
    let icon = '🍪';
    if (name.toLowerCase().includes('cake') || name.toLowerCase().includes('pastry')) icon = '🎂';
    else if (name.toLowerCase().includes('katli') || name.toLowerCase().includes('ladoo') || name.toLowerCase().includes('barfi')) icon = '🍬';
    else if (name.toLowerCase().includes('hamper') || name.toLowerCase().includes('crate') || name.toLowerCase().includes('tin')) icon = '🎁';
    else if (name.toLowerCase().includes('tasting') || name.toLowerCase().includes('sample')) icon = '📦';

    itemsHtml += `
      <div class="cart-item-card">
        <div class="cart-item-icon">${icon}</div>
        <div class="cart-item-details">
          <h4 class="cart-item-title" title="${item.name}">${item.name}</h4>
          <span class="cart-item-price">₹${item.price} each</span>
        </div>
        <div class="cart-qty-ctrls">
          <button type="button" class="cart-qty-btn" onclick="decrementCartItem('${encodeURIComponent(item.name)}')">−</button>
          <span class="cart-qty-num">${item.qty}</span>
          <button type="button" class="cart-qty-btn" onclick="incrementCartItem('${encodeURIComponent(item.name)}')">+</button>
        </div>
        <div style="text-align:right; min-width:60px;">
          <strong style="display:block; font-size:0.88rem; color:var(--kb-burgundy);">₹${itemTotal.toLocaleString('en-IN')}</strong>
          <button type="button" class="cart-btn-del" onclick="deleteCartItemGroup('${encodeURIComponent(item.name)}')" title="Remove Item">🗑️</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = itemsHtml;

  const gst = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + gst;

  footer.innerHTML = `
    <div class="cart-bill-row">
      <span>Subtotal (${totalCount} ${totalCount === 1 ? 'item' : 'items'}):</span>
      <span>₹${subtotal.toLocaleString('en-IN')}</span>
    </div>
    <div class="cart-bill-row">
      <span>Estimated GST (5% Food HSN):</span>
      <span>₹${gst.toLocaleString('en-IN')}</span>
    </div>
    <div class="cart-bill-row">
      <span>Express Shipping:</span>
      <span style="color:var(--kb-success); font-weight:700;">FREE (Promo)</span>
    </div>
    <div class="cart-bill-row total">
      <span>Total Amount:</span>
      <strong>₹${grandTotal.toLocaleString('en-IN')}</strong>
    </div>

    <button type="button" class="btn-checkout-primary" onclick="proceedToCheckout(${grandTotal})">
      <span>Proceed to Secure Checkout (₹${grandTotal.toLocaleString('en-IN')})</span> →
    </button>

    <div class="cart-bottom-actions">
      <button type="button" class="btn-clear-cart-link" onclick="clearCart()">Empty Cart</button>
      <span class="cart-security-note">🔒 256-Bit SSL Encrypted</span>
    </div>
  `;
}

function incrementCartItem(encodedName) {
  const name = decodeURIComponent(encodedName);
  const found = AppState.cartItems.find(i => i.name === name);
  if (found) {
    AppState.cartItems.push({ name: found.name, price: found.price });
    updateCartBadge();
    renderCartDrawerContent();
  }
}

function decrementCartItem(encodedName) {
  const name = decodeURIComponent(encodedName);
  const index = AppState.cartItems.findIndex(i => i.name === name);
  if (index !== -1) {
    AppState.cartItems.splice(index, 1);
    updateCartBadge();
    renderCartDrawerContent();
  }
}

function deleteCartItemGroup(encodedName) {
  const name = decodeURIComponent(encodedName);
  AppState.cartItems = AppState.cartItems.filter(i => i.name !== name);
  updateCartBadge();
  renderCartDrawerContent();
  showToast(`Removed all units of "${name}" from cart.`, '🗑️');
}

function clearCart() {
  AppState.cartItems = [];
  updateCartBadge();
  renderCartDrawerContent();
  showToast('Your shopping cart has been cleared.', '🧹');
}

function updateCartBadge() {
  const count = (AppState.cartItems || []).length;
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 300);
  }
}

function proceedToCheckout(amount) {
  closeCartDrawer();
  showToast(`Proceeding to Secure Gateway for ₹${amount.toLocaleString('en-IN')}! Thank you for ordering from Karachi Bakery.`, '🎉');
}
