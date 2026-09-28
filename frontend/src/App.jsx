import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Sprout, CheckCircle2, Loader2, Leaf, 
  MapPin, AlertTriangle, Activity, RefreshCw, LogIn, LogOut, 
  ArrowRight, Award, Volume2, Printer, Globe, Filter,
  Check, Edit3, Save, RotateCcw, 
  X, Plus, Trash2, Radio, CheckSquare, CloudSun, Wind,
  Droplets, Sun, CloudRain, ShieldCheck, Target, TrendingUp,
  HeartPulse, Dna, Camera, Image as ImageIcon, AlertCircle, Zap, Share2,
  Sparkles, ChevronRight, Shield, Cpu, CloudLightning, Layers, Smartphone
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// DEFAULT ABOUT CONTENT
const DEFAULT_ABOUT_CONTENT = {
  heroTag: "ABOUT MAATI AI",
  heroTitle: "Intelligence for Every Field. Protection for Every Crop.",
  heroBio: "Maati AI combines Edge AI, spatial intelligence, and ICAR guidelines to give every farmer a clear, localized crop diagnosis and action plan - even without internet.",
  farmersTag: "BUILT FOR FARMERS",
  farmersTitle: "Turning Crop Problems into Smart Decisions.",
  farmersBio: "Navigating crop diseases in remote rural fields shouldn't depend on guesswork or costly delays. Maati AI is architected from the ground up to empower smallholders with zero-latency computer vision, localized spray timing, and automated quarantine telemetry directly at farm-gate level.",
  edgeAiTitle: "Edge AI",
  edgeAiBio: "Runs on-device with sub-2-second inference even in remote offline connectivity zones.",
  forecastTitle: "Smart Forecasting",
  forecastBio: "Correlates microclimate humidity and temperature to predict sporulation risks 48h prior.",
  nationalApiTitle: "National REST API",
  nationalApiBio: "Syncs outbreak geo-telemetry with district agriculture authorities and ICAR advisory protocols."
};

// DEFAULT TEAM MEMBERS
const DEFAULT_TEAM_MEMBERS = [
  { id: 1, name: "Punam Kumari Shaw", role: "Team Leader & ML Lead", desc: "Overseeing model architecture, PyTorch inference & backend API design.", image: "" },
  { id: 2, name: "Full Stack Architect", role: "React & Cloud Developer", desc: "Built reactive client architecture, Vite bundling, and Leaflet geospatial integration.", image: "" },
  { id: 3, name: "Agri-Domain Specialist", role: "IPM Advisory Lead", desc: "Curated ICAR-grade chemical dosage tables, biological controls, and PHI limits.", image: "" },
  { id: 4, name: "Surveillance Engineer", role: "GIS & Cluster Lead", desc: "Implemented PostGIS spatial queries, H3 hexagonal clustering, and officer triage.", image: "" },
  { id: 5, name: "Edge AI Specialist", role: "TFLite / ONNX Engineer", desc: "Quantized deep neural vision backbones for sub-100ms offline mobile execution.", image: "" },
  { id: 6, name: "UI/UX & Regional Voice", role: "Multilingual Engine Lead", desc: "Designed accessible field interfaces and regional language synthesizer pipelines.", image: "" }
];

const DEFAULT_FOOTER_TEXT = "© 2026 Maati AI Platform. Built for Smart India Hackathon.";

// ADVANCED COMPREHENSIVE DISEASE DATABASE

// DISEASE-SPECIFIC TREATMENT ADVISORIES
// Dosages below are limited to documented agricultural recommendations and should be checked against the current product label and local advisory before use.
const DISEASE_TREATMENT_ADVISORIES = {
  "maize northern leaf blight": {
    match: "maize northern leaf blight",
    immediate: "Remove and properly manage severely affected leaves and crop residue where practical. Avoid prolonged leaf wetness and maintain good field aeration.",
    materials: "Mancozeb 75% WP fungicide, clean water, calibrated knapsack/power sprayer, gloves, mask and protective clothing.",
    biological: "Use resistant or tolerant maize varieties where available and maintain field sanitation. Biological products should be used only when locally registered/recommended for maize disease management.",
    chemical: "Mancozeb 75% WP @ 1000 g/ha as a foliar spray for maize leaf blight, as listed in ICAR Kharif Agro-Advisories 2025.",
    dose: "1000 g/ha (1 kg/ha). Do not increase the dose; use the current registered product label for the required spray volume and application instructions.",
    timing: "Start treatment when disease symptoms are observed and follow the current product label for repeat timing. Monitor newly emerging leaves after treatment.",
    followup: "Recheck the crop after treatment. If symptoms continue to spread or the diagnosis is uncertain, obtain field confirmation from an agricultural expert.",
    humanImpact: "Northern Leaf Blight is a plant disease and is not normally a human infection. Handling diseased leaves can expose workers to plant dust and fungal material, so use gloves and a suitable mask. Fungicide exposure can be harmful if the product is mishandled; follow the label and PPE requirements.",
    sourceNote: "Dose reference: ICAR Kharif Agro-Advisories for Farmers 2025."
  },
  "rice blast": {
    match: "rice blast",
    immediate: "Reduce excess nitrogen, maintain balanced crop nutrition, improve field drainage where needed, and use clean/disease-free seed and resistant varieties where available.",
    materials: "Registered rice-blast fungicide, clean water, calibrated sprayer, gloves, mask and protective clothing.",
    biological: "Use resistant varieties and integrated crop management. Biological products should be used only when locally registered/recommended for rice blast.",
    chemical: "ICAR recommendations include Tricyclazole, Propiconazole and other registered fungicides for rice blast management; the exact product and dose must follow the current crop-specific label or local agricultural recommendation.",
    dose: "Use the exact dose printed on the currently registered product label for rice blast; do not substitute a dose from another formulation.",
    timing: "Begin control at early symptom development and follow the product label/local advisory for repeat applications.",
    followup: "Monitor fresh leaves and panicles. Seek agricultural expert confirmation for severe, rapidly spreading or uncertain cases.",
    humanImpact: "Rice blast is a plant disease and does not normally infect humans. Avoid inhaling dust or spray mist and use appropriate PPE during field handling and chemical application.",
    sourceNote: "Treatment guidance: ICAR Kharif Agro-Advisories for Farmers 2025."
  },
  "wheat yellow rust": {
    match: "wheat yellow rust",
    immediate: "Monitor the upper leaves closely, avoid excessive nitrogen, and use resistant varieties where available.",
    materials: "Mancozeb 75% WP or another locally registered rust-control product, clean water, calibrated sprayer, gloves, mask and protective clothing.",
    biological: "Use resistant varieties and balanced crop nutrition. Integrated management is preferred over repeated chemical use.",
    chemical: "TNAU lists Mancozeb @ 2 g/L and sulphur dusting @ 35–40 kg/ha among management options for wheat yellow rust.",
    dose: "Mancozeb: 2 g/L of water. Sulphur dust: 35–40 kg/ha where this recommendation is applicable. Verify the current registered product label before application.",
    timing: "Take control measures when initial yellow stripe pustules appear and follow the product label/local agricultural advisory for repeat timing.",
    followup: "Continue field scouting after treatment, especially on flag leaves. Consult an agricultural expert if the disease continues to spread.",
    humanImpact: "Wheat yellow rust is a plant disease and is not normally a human infection. Avoid inhaling field dust or spray mist and use gloves, mask and protective clothing during treatment.",
    sourceNote: "Treatment guidance: Tamil Nadu Agricultural University Crop Protection advisory."
  }
};

const getDiseaseTreatmentAdvisory = (crop, disease) => {
  const text = `${crop || ""} ${disease || ""}`.toLowerCase().replace(/[–—]/g, "-");
  if (text.includes("northern leaf blight") || (text.includes("maize") && text.includes("blight"))) return DISEASE_TREATMENT_ADVISORIES["maize northern leaf blight"];
  if (text.includes("rice blast") || (text.includes("rice") && text.includes("blast"))) return DISEASE_TREATMENT_ADVISORIES["rice blast"];
  if (text.includes("yellow rust") || text.includes("stripe rust")) return DISEASE_TREATMENT_ADVISORIES["wheat yellow rust"];
  return null;
};

const GLOBAL_DISEASE_DATABASE = {
  "ind-rice-blast": {
    crop: "Paddy (Rice)",
    disease: "Rice Blast",
    pathogen: "Magnaporthe oryzae",
    category: "Fungal (Ascomycota)",
    originType: "india",
    place: "West Bengal, Andhra Pradesh, Punjab, Assam, Odisha, Cauvery Basin",
    confidence: 95.8,
    humanRisk: "Farmer's lung (hypersensitivity pneumonitis), dry coughing, and severe asthma attacks caused by inhaling dry airborne conidia spores during harvesting and threshing.",
    chemical: "Tricyclazole 75% WP @ 0.6g per 1 liter of water (120g dissolved in 200 liters of water per acre) or Isoprothiolane 40% EC @ 1.5ml/L.",
    organic: "Pseudomonas fluorescens liquid bio-culture @ 10ml per liter of water sprayed during cool evening hours.",
    advisory: "Apply at tillering stage or early panicle emergence once morning dew has evaporated. Avoid excessive split application of nitrogenous urea."
  },
  "ind-wheat-yellow-rust": {
    crop: "Wheat",
    disease: "Wheat Yellow / Stripe Rust",
    pathogen: "Puccinia striiformis",
    category: "Fungal (Basidiomycota)",
    originType: "india",
    place: "Punjab, Haryana, Jammu & Kashmir, Tarai Belt of Uttarakhand",
    confidence: 96.2,
    humanRisk: "Contact dermatitis and skin rashes: Dense yellow powdery urediniospores settling on exposed hands, neck, or face during field rogueing cause prickling skin inflammation, itching, and red hives.",
    chemical: "Propiconazole 25% EC (Tilt) @ 1.0ml per liter of water (200ml formulated product per 200 liters of water per acre) or Tebuconazole 25.9% EC @ 1ml/L.",
    organic: "Trichoderma harzianum bio-fungicide formulation @ 5.0g per liter of water applied as a prophylactic foliar barrier.",
    advisory: "Spray immediately in the direction of wind dispersal as soon as initial yellow stripe pustules appear on flag leaves."
  },
  "ind-potato-early-blight": {
    crop: "Potato",
    disease: "Potato Early Blight",
    pathogen: "Alternaria solani",
    category: "Fungal (Hyphomycetes)",
    originType: "india",
    place: "West Bengal (Burdwan, Hooghly), Uttar Pradesh (Agra Belt), Gujarat",
    confidence: 94.1,
    humanRisk: "Gastrointestinal distress and mycotoxin toxicity: Ingesting spoiled or severely infected tubers can introduce Alternariol and Tenuazonic acid mycotoxins, leading to nausea, stomach cramps, vomiting, and diarrhea.",
    chemical: "Chlorothalonil 75% WP @ 2.0g per liter of water (or Azoxystrobin 23% SC @ 1.0ml per liter of water).",
    organic: "Neem Oil (Azadirachtin 10,000 ppm) @ 3.5ml per liter of water mixed with 1g soap emulsifier.",
    advisory: "Begin spraying upon first appearance of concentric target-board spots on lower leaves. Repeat after 10 to 12 days if damp weather persists."
  },
  "ind-tomato-late-blight": {
    crop: "Tomato",
    disease: "Tomato Late Blight",
    pathogen: "Phytophthora infestans",
    category: "Fungal / Oomycete",
    originType: "india",
    place: "Pan-India (Northern & Eastern Gangetic Plains)",
    confidence: 94.6,
    humanRisk: "Eye irritation and acute allergic rhinitis from spore clouds; ingesting decaying blighted tomatoes contaminated with coliforms causes severe gastrointestinal distress.",
    chemical: "Metalaxyl 8% + Mancozeb 64% WP @ 2.5g per liter of water (500g in 200L water per acre) or Cymoxanil 8% + Mancozeb 64% WP @ 2g/L.",
    organic: "Copper Oxychloride 50% WP @ 2.5g per liter of water or Neem oil (10,000 ppm) @ 3ml/L.",
    advisory: "Apply on bright sunny mornings. Avoid application immediately before anticipated rainstorms to prevent chemical wash-off. Pre-Harvest Interval (PHI): 7 Days."
  },
  "global-powdery-mildew": {
    crop: "Grapevine / Cucurbits",
    disease: "Powdery Mildew",
    pathogen: "Erysiphe necator",
    category: "Fungal (Erysiphales)",
    originType: "global",
    place: "Maharashtra (Nashik), Karnataka, Mediterranean, California",
    confidence: 95.3,
    humanRisk: "Asthma and bronchial hypersensitivity: White talcum-like superficial spores easily dislodge into the air, causing sneezing, occupational asthma attacks, and airway irritation upon inhalation.",
    chemical: "Wettable Sulfur 80% WDG @ 2.5g per liter of water (or Hexaconazole 5% EC @ 1.0ml per liter of water).",
    organic: "Raw cow milk emulsion (100ml milk + 900ml water) sprayed on canopy foliage to suppress mycelial growth.",
    advisory: "Do not spray sulfur products when ambient temperatures exceed 32°C to prevent severe leaf phytotoxicity and scorching."
  },
  "global-citrus-greening": {
    crop: "Citrus (Lemon / Orange)",
    disease: "Citrus Greening (Huanglongbing)",
    pathogen: "Candidatus Liberibacter asiaticus",
    category: "Bacterial (Phloem-Limited)",
    originType: "global",
    place: "Central India (Nagpur), Americas (Florida, Brazil), Southern China",
    confidence: 96.5,
    humanRisk: "Chemical pesticide exposure toxicity: Farmers often apply excessive, uncalibrated insecticide doses without protective gear, risking organophosphate poisoning, dizziness, and chronic neuro-ocular damage.",
    chemical: "Imidacloprid 17.8% SL @ 0.5ml/L or Thiamethoxam 25% WG @ 0.35g/L to eradicate psyllid insect vectors.",
    organic: "Kaolin particle clay film (3%) foliar barrier + micronutrient zinc/manganese rejuvenation foliar spray.",
    advisory: "Vector eradication is critical. Thermotherapy of nursery budwood at 48°C for 4 hours."
  },
  "global-banana-panama-tr4": {
    crop: "Banana",
    disease: "Panama Disease TR4",
    pathogen: "Fusarium oxysporum f. sp. cubense TR4",
    category: "Soil-borne Transboundary Biosecurity Fungus",
    originType: "global",
    place: "Global Tropics (Australia, Philippines, Jordan) & India (Bihar, UP border)",
    confidence: 97.5,
    humanRisk: "Catastrophic local food insecurity and economic stress; fungal spore absorption in stagnant drinking water reservoirs.",
    chemical: "No curative systemic chemical; biosecurity drenching with Prochloraz 45% EC around infection zone.",
    organic: "Bio-priming root systems with Trichoderma virens + systemic resistance inducer composts.",
    advisory: "Strict International Quarantine: Restrict soil movement on footwear and machinery; burn infected stools in situ."
  },
  "ind-sugarcane-red-rot": {
    crop: "Sugarcane",
    disease: "Sugarcane Red Rot",
    pathogen: "Colletotrichum falcatum",
    category: "Fungal / Vascular Pathogen",
    originType: "india",
    place: "Uttar Pradesh (Sugarcane Belt), Bihar, Haryana, Tamil Nadu",
    confidence: 93.4,
    humanRisk: "Mycotoxin toxicity and digestive upset if rotting cane juice is consumed; dermal irritation during handling of fungal-infected pith.",
    chemical: "Setts dipping in Carbendazim 50% WP @ 2g/L or Thiophanate-methyl 70% WP @ 1g/L prior to planting.",
    organic: "Trichoderma viride settling in sett furrows @ 5kg/acre enriched with farmyard manure.",
    advisory: "Uproot and burn diseased clumps immediately with roots. Never use infected stools for seed setts."
  }
};

// 22 CONSTITUTIONAL LANGUAGES MAP FOR WHOLE WEBSITE TRANSLATION
const ALL_22_LANGUAGES = {
  en: { langName: "English (Default)", code: "en" },
  hi: { langName: "हिंदी (Hindi)", code: "hi" },
  bn: { langName: "বাংলা (Bengali)", code: "bn" },
  te: { langName: "తెలుగు (Telugu)", code: "te" },
  mr: { langName: "मराठी (Marathi)", code: "mr" },
  ta: { langName: "தமிழ் (Tamil)", code: "ta" },
  gu: { langName: "ગુજરાતી (Gujarati)", code: "gu" },
  kn: { langName: "ಕನ್ನಡ (Kannada)", code: "kn" },
  ml: { langName: "മലയാളം (Malayalam)", code: "ml" },
  or: { langName: "ଓଡ଼ିଆ (Odia)", code: "or" },
  pa: { langName: "ਪੰਜਾਬੀ (Punjabi)", code: "pa" },
  as: { langName: "অসমীয়া (Assamese)", code: "as" },
  ur: { langName: "اردو (Urdu)", code: "ur" },
  mai: { langName: "मैथिली (Maithili)", code: "mai" },
  sat: { langName: "ᱥᱟᱱᱛᱟᱲᱤ (Santali)", code: "sat" },
  ks: { langName: "کٲشُر (Kashmiri)", code: "ks" },
  ne: { langName: "नेपाली (Nepali)", code: "ne" },
  kok: { langName: "कोंकणी (Konkani)", code: "gom" },
  sd: { langName: "سنڌي (Sindhi)", code: "sd" },
  doi: { langName: "डोगरी (Dogri)", code: "doi" },
  mni: { langName: "ꯃৈতৈꯂꯣꯟ (Manipuri)", code: "mni-Mtei" },
  brx: { langName: "बड़ो (Bodo)", code: "brx" },
  sa: { langName: "संस्कृतम् (Sanskrit)", code: "sa" }
};

export default function App() {
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const savedLang = localStorage.getItem('maati_selected_lang');
      return savedLang ? savedLang : 'en';
    } catch {
      return 'en';
    }
  });

  const handleLanguageChange = (langKey) => {
    setCurrentLang(langKey);
    localStorage.setItem('maati_selected_lang', langKey);
    const targetCode = ALL_22_LANGUAGES[langKey]?.code || 'en';

    if (targetCode === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
      window.location.reload();
      return;
    }

    document.cookie = `googtrans=/en/${targetCode}; path=/;`;
    document.cookie = `googtrans=/en/${targetCode}; domain=${window.location.hostname}; path=/;`;

    const selectElem = document.querySelector('.goog-te-combo');
    if (selectElem) {
      selectElem.value = targetCode;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  const [currentPage, setCurrentPage] = useState(() => {
  try {
    return sessionStorage.getItem('maati_current_page') || 'home';
  } catch {
    return 'home';
  }
});
useEffect(() => {
  try {
    sessionStorage.setItem('maati_current_page', currentPage);
  } catch {}
}, [currentPage]);
  const [activeToolTab, setActiveToolTab] = useState('disease');

  // ROLE-BASED ACCESS STATE
  // The selected session is persisted locally so refresh does not immediately sign the user out.
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('maati_auth_user');
      const token = localStorage.getItem('maati_auth_token');
      return saved && token ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', role: 'farmer' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const isAdmin = user?.role === 'admin';
  const isFarmer = user?.role === 'farmer';

  // LIVE EDITABLE FOOTER STATE WITH LOCALSTORAGE
  const [footerText, setFooterText] = useState(() => {
    try {
      const saved = localStorage.getItem('maati_custom_footer');
      return saved ? saved : DEFAULT_FOOTER_TEXT;
    } catch {
      return DEFAULT_FOOTER_TEXT;
    }
  });
  const [isEditingFooter, setIsEditingFooter] = useState(false);
  const [footerInput, setFooterInput] = useState(footerText);

  // ABOUT BIO STATE (LOCAL STORAGE PERSISTED)
  const [aboutBio, setAboutBio] = useState(() => {
    try {
      const saved = localStorage.getItem('maati_about_bio_v2');
      return saved ? JSON.parse(saved) : DEFAULT_ABOUT_CONTENT;
    } catch {
      return DEFAULT_ABOUT_CONTENT;
    }
  });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioForm, setEditBioForm] = useState(aboutBio);

  // TEAM STATE
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('maati_team_members');
      return saved ? JSON.parse(saved) : DEFAULT_TEAM_MEMBERS;
    } catch {
      return DEFAULT_TEAM_MEMBERS;
    }
  });
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isManagingTeam, setIsManagingTeam] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: '', role: '', desc: '', image: '' });
  const [newMember, setNewMember] = useState({ name: '', role: '', desc: '', image: '' });

  const saveTeamMembers = (members) => {
    setTeamMembers(members);
    try { localStorage.setItem('maati_team_members', JSON.stringify(members)); } catch {}
  };

  const handleTeamImage = (event, target = 'new') => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result || '');
      if (target === 'new') setNewMember(prev => ({ ...prev, image }));
      else setTeamForm(prev => ({ ...prev, image }));
    };
    reader.readAsDataURL(file);
  };

  const openEditMember = (member) => {
    setEditingMemberId(member.id);
    setTeamForm({ name: member.name || '', role: member.role || '', desc: member.desc || '', image: member.image || '' });
  };

  const saveEditedMember = () => {
    if (!teamForm.name.trim() || !teamForm.role.trim()) return;
    saveTeamMembers(teamMembers.map(member => member.id === editingMemberId ? { ...member, ...teamForm, name: teamForm.name.trim(), role: teamForm.role.trim(), desc: teamForm.desc.trim() } : member));
    setEditingMemberId(null);
  };

  const addTeamMember = () => {
    if (!newMember.name.trim() || !newMember.role.trim()) return;
    const member = { id: Date.now(), name: newMember.name.trim(), role: newMember.role.trim(), desc: newMember.desc.trim(), image: newMember.image || '' };
    saveTeamMembers([...teamMembers, member]);
    setNewMember({ name: '', role: '', desc: '', image: '' });
    setIsAddingMember(false);
  };

  const deleteTeamMember = (id) => {
    if (!window.confirm('Delete this team member?')) return;
    saveTeamMembers(teamMembers.filter(member => member.id !== id));
    if (editingMemberId === id) setEditingMemberId(null);
  };

  // SOIL & ADVISORY STATE
  const [formData, setFormData] = useState({ N: 90, P: 42, K: 43, temperature: 24.5, humidity: 82, ph: 6.5, rainfall: 200 });
  const [cropResult, setCropResult] = useState(null);

  // DYNAMIC DIAGNOSIS STATE
  const [catalogScope, setCatalogScope] = useState('all');
  const [selectedDiseaseKey, setSelectedDiseaseKey] = useState('ind-rice-blast');
  const [activeDisease, setActiveDisease] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // LIVE WEATHER STATE
  const WEATHER_LOCATIONS = {
    'Andhra Pradesh (Amaravati)': { latitude: 16.5062, longitude: 80.6480 },
    'Arunachal Pradesh (Itanagar)': { latitude: 27.0844, longitude: 93.6053 },
    'Assam (Dispur/Guwahati)': { latitude: 26.1445, longitude: 91.7362 },
    'Bihar (Patna)': { latitude: 25.5941, longitude: 85.1376 },
    'Chhattisgarh (Raipur)': { latitude: 21.2514, longitude: 81.6296 },
    'Goa (Panaji)': { latitude: 15.4909, longitude: 73.8278 },
    'Gujarat (Gandhinagar)': { latitude: 23.2156, longitude: 72.6369 },
    'Haryana (Chandigarh)': { latitude: 30.7333, longitude: 76.7794 },
    'Himachal Pradesh (Shimla)': { latitude: 31.1048, longitude: 77.1734 },
    'Jharkhand (Ranchi)': { latitude: 23.3441, longitude: 85.3096 },
    'Karnataka (Bengaluru)': { latitude: 12.9716, longitude: 77.5946 },
    'Kerala (Thiruvananthapuram)': { latitude: 8.5241, longitude: 76.9366 },
    'Madhya Pradesh (Bhopal)': { latitude: 23.2599, longitude: 77.4126 },
    'Maharashtra (Mumbai)': { latitude: 19.0760, longitude: 72.8777 },
    'Manipur (Imphal)': { latitude: 24.8170, longitude: 93.9368 },
    'Meghalaya (Shillong)': { latitude: 25.5788, longitude: 91.8933 },
    'Mizoram (Aizawl)': { latitude: 23.7271, longitude: 92.7176 },
    'Nagaland (Kohima)': { latitude: 25.6751, longitude: 94.1086 },
    'Odisha (Bhubaneswar)': { latitude: 20.2961, longitude: 85.8245 },
    'Punjab (Chandigarh)': { latitude: 30.7333, longitude: 76.7794 },
    'Rajasthan (Jaipur)': { latitude: 26.9124, longitude: 75.7873 },
    'Sikkim (Gangtok)': { latitude: 27.3389, longitude: 88.6065 },
    'Tamil Nadu (Chennai)': { latitude: 13.0827, longitude: 80.2707 },
    'Telangana (Hyderabad)': { latitude: 17.3850, longitude: 78.4867 },
    'Tripura (Agartala)': { latitude: 23.8315, longitude: 91.2868 },
    'Uttar Pradesh (Lucknow)': { latitude: 26.8467, longitude: 80.9462 },
    'Uttarakhand (Dehradun)': { latitude: 30.3165, longitude: 78.0322 },
    'West Bengal (Kolkata/Howrah)': { latitude: 22.5726, longitude: 88.3639 },
    'Andaman and Nicobar Islands (Port Blair)': { latitude: 11.6234, longitude: 92.7265 },
    'Chandigarh (Chandigarh)': { latitude: 30.7333, longitude: 76.7794 },
    'Dadra and Nagar Haveli and Daman and Diu (Daman)': { latitude: 20.3974, longitude: 72.8328 },
    'Delhi (New Delhi)': { latitude: 28.6139, longitude: 77.2090 },
    'Jammu and Kashmir (Srinagar)': { latitude: 34.0837, longitude: 74.7973 },
    'Ladakh (Leh)': { latitude: 34.1526, longitude: 77.5771 },
    'Lakshadweep (Kavaratti)': { latitude: 10.5669, longitude: 72.6420 },
    'Puducherry (Puducherry)': { latitude: 11.9416, longitude: 79.8083 }
  };

  const [selectedLocation, setSelectedLocation] = useState('West Bengal (Kolkata/Howrah)');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');
  const [weatherUpdatedAt, setWeatherUpdatedAt] = useState('');

  const getWeatherDescription = (code) => {
    const map = {
      0: ['Clear Sky', 'sun'],
      1: ['Mainly Clear', 'sun'], 2: ['Partly Cloudy', 'cloud'], 3: ['Overcast', 'cloud'],
      45: ['Fog', 'cloud'], 48: ['Rime Fog', 'cloud'],
      51: ['Light Drizzle', 'rain'], 53: ['Drizzle', 'rain'], 55: ['Heavy Drizzle', 'rain'],
      56: ['Freezing Drizzle', 'rain'], 57: ['Heavy Freezing Drizzle', 'rain'],
      61: ['Light Rain', 'rain'], 63: ['Rain', 'rain'], 65: ['Heavy Rain', 'rain'],
      66: ['Freezing Rain', 'rain'], 67: ['Heavy Freezing Rain', 'rain'],
      71: ['Light Snow', 'cloud'], 73: ['Snow', 'cloud'], 75: ['Heavy Snow', 'cloud'],
      77: ['Snow Grains', 'cloud'],
      80: ['Rain Showers', 'rain'], 81: ['Rain Showers', 'rain'], 82: ['Heavy Rain Showers', 'rain'],
      85: ['Snow Showers', 'cloud'], 86: ['Heavy Snow Showers', 'cloud'],
      95: ['Thunderstorm', 'rain'], 96: ['Thunderstorm with Hail', 'rain'], 99: ['Severe Thunderstorm with Hail', 'rain']
    };
    return map[code] || ['Variable Conditions', 'cloud'];
  };

  const getFarmAdvisory = (rainProb, precipitation, wind, humidity, code) => {
    if (rainProb >= 60 || precipitation >= 5 || [95, 96, 99].includes(code)) return 'Avoid chemical spraying; rainfall may wash off treatment. Check drainage and postpone field operations during storms.';
    if (rainProb >= 35) return 'Use a short dry window for field work. Prefer morning operations only when foliage is dry and rain is not imminent.';
    if (humidity >= 80) return 'High humidity can increase fungal disease pressure. Scout susceptible crops and avoid unnecessary leaf wetness.';
    if (wind >= 20) return 'Wind is relatively strong. Avoid fine-spray applications and postpone spraying until conditions are calmer.';
    return 'Favorable conditions for routine field operations. Check crop moisture before irrigation and keep scouting for disease symptoms.';
  };

  const fetchLiveWeather = async () => {
    const location = WEATHER_LOCATIONS[selectedLocation];
    if (!location) return;
    setWeatherLoading(true);
    setWeatherError('');
    try {
      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,dew_point_2m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,uv_index_max,wind_speed_10m_max',
        forecast_days: '10',
        timezone: 'Asia/Kolkata',
        temperature_unit: 'celsius',
        wind_speed_unit: 'kmh',
        precipitation_unit: 'mm'
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
      if (!response.ok) throw new Error('Live weather service is unavailable');
      const data = await response.json();
      const currentDescription = getWeatherDescription(data.current.weather_code);
      const humidity = Math.round(data.current.relative_humidity_2m ?? 0);
      const rainChance = Math.round(data.daily.precipitation_probability_max?.[0] ?? 0);
      const precipitation = Number(data.current.precipitation ?? 0);
      const currentCode = data.current.weather_code;
      const currentRisk = humidity >= 80 ? `HIGH: Relative humidity is ${humidity}%, which can increase fungal disease pressure.` : humidity >= 65 ? `MODERATE: Relative humidity is ${humidity}%. Continue regular crop scouting.` : `LOW: Relative humidity is ${humidity}%, reducing immediate fungal disease pressure.`;
      setCurrentWeather({
        temp: Number(data.current.temperature_2m).toFixed(1),
        humidity,
        wind: Math.round(data.current.wind_speed_10m ?? 0),
        rainChance,
        condition: currentDescription[0],
        microclimateRisk: currentRisk,
        uvIndex: Number(data.daily.uv_index_max?.[0] ?? 0).toFixed(1),
        dewPoint: `${Number(data.current.dew_point_2m ?? 0).toFixed(1)}°C`,
        precipitation,
        advisory: getFarmAdvisory(rainChance, precipitation, Math.round(data.current.wind_speed_10m ?? 0), humidity, currentCode)
      });
      setFiveDayForecast(data.daily.time.map((date, index) => {
        const description = getWeatherDescription(data.daily.weather_code[index]);
        const rain = Math.round(data.daily.precipitation_probability_max[index] ?? 0);
        const rainAmount = Number(data.daily.precipitation_sum[index] ?? 0);
        const wind = Math.round(data.daily.wind_speed_10m_max[index] ?? 0);
        return {
          day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { weekday: 'long' }),
          date: new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          tempMax: Math.round(data.daily.temperature_2m_max[index]),
          tempMin: Math.round(data.daily.temperature_2m_min[index]),
          condition: description[0],
          rainProb: `${rain}%`,
          rainAmount,
          wind,
          icon: description[1],
          advisory: getFarmAdvisory(rain, rainAmount, wind, humidity, data.daily.weather_code[index])
        };
      }));
      setWeatherUpdatedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (error) {
      setWeatherError(error.message || 'Unable to load live weather');
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
    const refreshTimer = setInterval(fetchLiveWeather, 15 * 60 * 1000);
    return () => clearInterval(refreshTimer);
  }, [selectedLocation]);

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('10:15:20 PM');
  const [syncToast, setSyncToast] = useState('');

  // LIVE NATIONAL SURVEILLANCE
  const SURVEILLANCE_CROP_MAP = {
    'Andhra Pradesh (Amaravati)': ['Rice', 'Rice Blast'],
    'Arunachal Pradesh (Itanagar)': ['Rice', 'Rice Blast'],
    'Assam (Dispur/Guwahati)': ['Rice', 'Rice Blast'],
    'Bihar (Patna)': ['Rice', 'Rice Blast'],
    'Chhattisgarh (Raipur)': ['Rice', 'Rice Blast'],
    'Goa (Panaji)': ['Rice', 'Rice Blast'],
    'Gujarat (Gandhinagar)': ['Cotton', 'Leaf Spot'],
    'Haryana (Chandigarh)': ['Wheat', 'Yellow Rust'],
    'Himachal Pradesh (Shimla)': ['Apple', 'Apple Scab'],
    'Jharkhand (Ranchi)': ['Rice', 'Rice Blast'],
    'Karnataka (Bengaluru)': ['Paddy (Rice)', 'Bacterial Leaf Blight'],
    'Kerala (Thiruvananthapuram)': ['Coconut', 'Leaf Blight'],
    'Madhya Pradesh (Bhopal)': ['Soybean', 'Rust / Leaf Spot'],
    'Maharashtra (Mumbai)': ['Onion', 'Purple Blotch'],
    'Manipur (Imphal)': ['Rice', 'Rice Blast'],
    'Meghalaya (Shillong)': ['Rice', 'Rice Blast'],
    'Mizoram (Aizawl)': ['Rice', 'Rice Blast'],
    'Nagaland (Kohima)': ['Rice', 'Rice Blast'],
    'Odisha (Bhubaneswar)': ['Rice', 'Rice Blast'],
    'Punjab (Chandigarh)': ['Wheat', 'Yellow Rust'],
    'Rajasthan (Jaipur)': ['Mustard', 'Alternaria Blight'],
    'Sikkim (Gangtok)': ['Large Cardamom', 'Leaf Blight'],
    'Tamil Nadu (Chennai)': ['Rice', 'Rice Blast'],
    'Telangana (Hyderabad)': ['Cotton', 'Leaf Spot'],
    'Tripura (Agartala)': ['Rice', 'Rice Blast'],
    'Uttar Pradesh (Lucknow)': ['Wheat', 'Yellow Rust'],
    'Uttarakhand (Dehradun)': ['Wheat', 'Yellow Rust'],
    'West Bengal (Kolkata/Howrah)': ['Rice', 'Rice Blast'],
    'Andaman and Nicobar Islands (Port Blair)': ['Coconut', 'Leaf Blight'],
    'Chandigarh (Chandigarh)': ['Wheat', 'Yellow Rust'],
    'Dadra and Nagar Haveli and Daman and Diu (Daman)': ['Paddy (Rice)', 'Leaf Blight'],
    'Delhi (New Delhi)': ['Vegetables', 'Leaf Spot'],
    'Jammu and Kashmir (Srinagar)': ['Apple', 'Apple Scab'],
    'Ladakh (Leh)': ['Barley', 'Leaf Spot'],
    'Lakshadweep (Kavaratti)': ['Coconut', 'Leaf Blight'],
    'Puducherry (Puducherry)': ['Rice', 'Rice Blast']
  };

  const SURVEILLANCE_SOLUTIONS = {
    'Rice Blast': { action: 'Scout new leaves and panicles; reduce prolonged leaf wetness and avoid excessive nitrogen.', remedy: 'Use a locally registered rice-blast fungicide only according to the product label and state agriculture advisory.' },
    'Yellow Rust': { action: 'Inspect flag leaves and new growth; isolate heavily affected patches for close monitoring.', remedy: 'Use a locally registered rust fungicide according to the current state wheat advisory and product label.' },
    'Apple Scab': { action: 'Remove infected fallen leaves where practical and monitor young leaves after wet weather.', remedy: 'Follow the local horticulture advisory for registered scab-control products and label directions.' },
    'Purple Blotch': { action: 'Improve field aeration, avoid unnecessary leaf wetness and remove severely affected debris.', remedy: 'Use a locally registered onion fungicide according to label directions and local agriculture guidance.' },
    'Bacterial Leaf Blight': { action: 'Improve drainage, avoid excessive nitrogen and remove severely affected plant material where practical.', remedy: 'Follow the state rice bacterial-disease advisory; use only locally registered products and label directions.' },
    'Leaf Spot': { action: 'Scout lower leaves, improve canopy airflow and avoid unnecessary overhead irrigation.', remedy: 'Confirm the causal disease before treatment and follow the locally registered crop-protection label.' },
    'Rust / Leaf Spot': { action: 'Scout lower canopy leaves and maintain balanced nutrition while monitoring disease spread.', remedy: 'Confirm the disease and follow the current state soybean advisory for registered control options.' },
    'Leaf Blight': { action: 'Remove severely affected debris where practical and improve field sanitation and drainage.', remedy: 'Confirm the disease before treatment and follow the locally registered crop/horticulture advisory.' },
    'Alternaria Blight': { action: 'Monitor older leaves and pods during humid periods and improve field airflow.', remedy: 'Use a locally registered mustard disease-control product according to the product label and local advisory.'}
  };

  const [surveillanceData, setSurveillanceData] = useState([]);
  const [surveillanceLoading, setSurveillanceLoading] = useState(false);
  const [surveillanceError, setSurveillanceError] = useState('');
  const [dashboardStats, setDashboardStats] = useState({ total: 0, highRisk: 0, pending: 0 });

  const buildLiveRiskIncident = (locationName, weather, index) => {
    const [crop, disease] = SURVEILLANCE_CROP_MAP[locationName] || ['Mixed Crops', 'Leaf Spot'];
    const humidity = Number(weather.relative_humidity_2m ?? 0);
    const rainProb = Number(weather.precipitation_probability ?? 0);
    const precipitation = Number(weather.precipitation ?? 0);
    const code = Number(weather.weather_code ?? 0);
    const wetSignal = rainProb * 0.45 + Math.min(precipitation, 10) * 2.5 + Math.max(0, humidity - 55) * 0.55 + ([51,53,55,61,63,65,80,81,82,95,96,99].includes(code) ? 8 : 0);
    const riskScore = Math.max(35, Math.min(96, Math.round(wetSignal)));
    const severity = riskScore >= 78 ? 'CRITICAL' : riskScore >= 62 ? 'HIGH' : 'MEDIUM';
    const solution = SURVEILLANCE_SOLUTIONS[disease] || SURVEILLANCE_SOLUTIONS['Leaf Spot'];
    const coords = WEATHER_LOCATIONS[locationName];
    return {
      id: `RISK-${String(index + 1).padStart(3, '0')}`,
      state: locationName.split(' (')[0],
      village: locationName.includes('(') ? locationName.slice(locationName.indexOf('(') + 1, -1) : locationName,
      crop, disease, severity, confidence: riskScore, riskScore,
      lat: coords.latitude, lng: coords.longitude, status: 'PENDING',
      time: 'Live now', remedy: solution.remedy, action: solution.action, source: 'LIVE WEATHER RISK',
      temperature: Number(weather.temperature_2m ?? 0).toFixed(1), humidity: Math.round(humidity), rainProb: Math.round(rainProb), precipitation: Number(precipitation.toFixed(1))
    };
  };

  useEffect(() => {
    const pendingCount = surveillanceData.filter(i => i.status === 'PENDING').length;
    const highRiskCount = surveillanceData.filter(i => i.severity === 'CRITICAL' && i.status === 'PENDING').length;
    setDashboardStats({ total: surveillanceData.length, highRisk: highRiskCount, pending: pendingCount });
  }, [surveillanceData]);

  const handleSelectDisease = (key) => {
    setSelectedDiseaseKey(key);
    setActiveDisease(GLOBAL_DISEASE_DATABASE[key]);
  };

  const handleSaveFooter = (e) => {
    e.preventDefault();
    if (footerInput.trim()) {
      setFooterText(footerInput.trim());
      localStorage.setItem('maati_custom_footer', footerInput.trim());
      setSyncToast("Footer updated successfully!");
      setTimeout(() => setSyncToast(''), 3000);
    }
    setIsEditingFooter(false);
  };

  const handleResetFooter = (e) => {
    e.stopPropagation();
    setFooterText(DEFAULT_FOOTER_TEXT);
    setFooterInput(DEFAULT_FOOTER_TEXT);
    localStorage.removeItem('maati_custom_footer');
    setIsEditingFooter(false);
  };

  const fetchSurveillance = async () => {
    setIsSyncing(true);
    setSurveillanceLoading(true);
    setSurveillanceError('');
    setSyncToast('Refreshing all-India surveillance risk feed...');
    try {
      const entries = Object.entries(WEATHER_LOCATIONS);
      const latitudes = entries.map(([, value]) => value.latitude).join(',');
      const longitudes = entries.map(([, value]) => value.longitude).join(',');
      const params = new URLSearchParams({
        latitude: latitudes, longitude: longitudes,
        current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code',
        daily: 'precipitation_probability_max',
        forecast_days: '1', timezone: 'Asia/Kolkata', precipitation_unit: 'mm'
      });
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
      if (!weatherResponse.ok) throw new Error('Live surveillance weather feed is unavailable');
      const weatherData = await weatherResponse.json();
      const locations = Array.isArray(weatherData) ? weatherData : [weatherData];
      const liveRisks = locations.map((weather, index) => {
        const current = weather.current || {};
        const daily = weather.daily || {};
        current.precipitation_probability = daily.precipitation_probability_max?.[0] ?? 0;
        return buildLiveRiskIncident(entries[index][0], current, index);
      });

      let verifiedIncidents = [];
      try {
        const backendResponse = await fetch('https://maati-ai-backend.onrender.com/api/v1/surveillance/hotspots');
        if (backendResponse.ok) {
          const backendData = await backendResponse.json();
          if (backendData.status === 'SUCCESS' && Array.isArray(backendData.incidents)) verifiedIncidents = backendData.incidents.map(item => ({ ...item, source: 'FIELD / BACKEND' }));
        }
      } catch {
        // Keep the live weather-risk feed available when the optional backend feed is offline.
      }

      const merged = [...verifiedIncidents, ...liveRisks.filter(risk => !verifiedIncidents.some(item => item.state === risk.state))];
      setSurveillanceData(merged);
      setLastSyncTime(new Date().toLocaleTimeString('en-IN'));
      setSyncToast(`Live surveillance refreshed: ${merged.length} state/UT signals available.`);
    } catch (error) {
      setSurveillanceError(error.message || 'Unable to load live surveillance');
      setSyncToast('Live surveillance refresh failed.');
    } finally {
      setSurveillanceLoading(false);
      setTimeout(() => setIsSyncing(false), 500);
      setTimeout(() => setSyncToast(''), 4000);
    }
  };

  useEffect(() => {
    fetchSurveillance();
    const refreshTimer = setInterval(fetchSurveillance, 15 * 60 * 1000);
    return () => clearInterval(refreshTimer);
  }, []);

  const handleVerify = async (id) => {
    if (!isAdmin) {
      setSyncToast('Admin authentication is required to verify incidents.');
      setTimeout(() => setSyncToast(''), 3000);
      return;
    }

    const token = localStorage.getItem('maati_auth_token');
    if (!token) {
      setSyncToast('Admin session expired. Please log in again.');
      setTimeout(() => setSyncToast(''), 3000);
      return;
    }

    try {
      const res = await fetch(`https://maati-ai-backend.onrender.com/api/v1/surveillance/verify/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          throw new Error('Admin session is no longer valid. Please log in again.');
        }
        if (id.startsWith('INC-')) {
          throw new Error(data.detail || 'Backend verification failed.');
        }
      }

      setSurveillanceData(prev => prev.map(item => item.id === id ? { ...item, status: 'RESOLVED' } : item));
      setSyncToast(`Case ${id} verified. Recommended field response recorded.`);
    } catch (error) {
      setSyncToast(error.message || 'Unable to verify this incident.');
    }
    setTimeout(() => setSyncToast(''), 3000);
  };

  const speakText = () => {
    if (!('speechSynthesis' in window) || !activeDisease) return;
    window.speechSynthesis.cancel();
    const spokenMessage = `${activeDisease.disease}. Recommended treatment: ${activeDisease.chemical}`;
    const utterance = new SpeechSynthesisUtterance(spokenMessage);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.90;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const playVoiceNote = (message) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  const handleDiseaseUpload = async (e) => {
  const input = e.currentTarget;
  const file = input.files?.[0];

  if (!file) return;

  const previewUrl = URL.createObjectURL(file);

  setUploadedPreview(previewUrl);
  setActiveDisease(null);
  setSelectedDiseaseKey(null);
  setActionLoading(true);
  setSyncToast("Analyzing leaf with Maati AI...");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "https://maati-ai-backend.onrender.com/api/v1/detect-disease",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.detail || "Disease detection request failed."
      );
    }

    if (data.status !== "SUCCESS") {
      throw new Error(
        data?.message || "AI disease detection was unsuccessful."
      );
    }

    // Display the backend AI result immediately.
    setActiveDisease({
      crop: data.crop || "Unknown",
      disease: data.disease || "Unknown Disease",
      pathogen:
        data.pathogen ||
        "See agricultural expert for pathogen confirmation",
      confidence: Number(data.confidence || 0),
      humanRisk:
        data.description ||
        "AI screening result. Field verification is recommended for uncertain cases.",
      chemical:
        data.treatment?.chemical ||
        "Use only locally registered crop-protection products according to the product label.",
      organic:
        data.treatment?.organic ||
        "Maintain crop hygiene and follow locally approved integrated pest management practices.",
      advisory:
        data.treatment?.advisory ||
        "Monitor the crop regularly and consult an agricultural expert when necessary.",
      treatmentPlan: null,
      humanImpact:
        "The detected plant disease is not automatically a human disease. Avoid direct exposure to diseased plant material, dust and spray mist, and follow appropriate PPE and product-label safety instructions."
    });

    // Stop the scanner immediately after a successful AI response.
    setActionLoading(false);

    // Apply Maati AI advisory data separately when available.
    try {
      const diseaseTreatment = getDiseaseTreatmentAdvisory(
        data.crop,
        data.disease
      );

      if (diseaseTreatment) {
        setActiveDisease((previous) => ({
          ...previous,
          chemical:
            diseaseTreatment.chemical ||
            previous.chemical,
          organic:
            diseaseTreatment.biological ||
            previous.organic,
          advisory:
            diseaseTreatment.immediate ||
            previous.advisory,
          treatmentPlan: diseaseTreatment,
          humanImpact:
            diseaseTreatment.humanImpact ||
            previous.humanImpact
        }));
      }
    } catch (advisoryError) {
      console.warn(
        "Disease advisory lookup failed:",
        advisoryError
      );
    }

    setSyncToast(
      `AI diagnosis completed: ${data.disease || "Unknown Disease"}`
    );
  } catch (error) {
    console.error("Disease detection error:", error);
    setActionLoading(false);
    setSyncToast(
      error.message ||
      "Unable to analyze the leaf. Please check the backend server."
    );
  } finally {
    input.value = "";

    setTimeout(() => {
      setSyncToast("");
    }, 3500);
  }
};
  const handleCropSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('https://maati-ai-backend.onrender.com/api/v1/recommend-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Crop recommendation failed.");
      setCropResult(data);
      setSyncToast(`Crop recommendation completed: ${data.recommended_crop || "Unknown"}`);
    } catch (error) {
      setCropResult(null);
      setSyncToast(error.message || "Unable to connect to the crop recommendation service.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveBio = (e) => {
    e.preventDefault();
    setAboutBio(editBioForm);
    localStorage.setItem('maati_about_bio_v2', JSON.stringify(editBioForm));
    setIsEditingBio(false);
    setSyncToast('About Platform content updated!');
    setTimeout(() => setSyncToast(''), 3000);
  };

  const handleResetBio = () => {
    if (window.confirm("Do you want to reset About page to default?")) {
      setAboutBio(DEFAULT_ABOUT_CONTENT);
      setEditBioForm(DEFAULT_ABOUT_CONTENT);
      localStorage.removeItem('maati_about_bio_v2');
      setIsEditingBio(false);
      setSyncToast('About bio restored to default!');
      setTimeout(() => setSyncToast(''), 3000);
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;
    const updated = [...teamMembers, { id: Date.now(), ...newMember }];
    setTeamMembers(updated);
    localStorage.setItem('maati_team_members', JSON.stringify(updated));
    setNewMember({ name: '', role: '', desc: '' });
    setIsAddingMember(false);
  };

  const handleDeleteMember = (id) => {
    const updated = teamMembers.filter(m => m.id !== id);
    setTeamMembers(updated);
    localStorage.setItem('maati_team_members', JSON.stringify(updated));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = loginForm.username.trim();
    const password = loginForm.password;

    if (!username || !password || loginLoading) return;

    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('https://maati-ai-backend.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: loginForm.role })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.status !== 'SUCCESS' || !data.token) {
        throw new Error(data.detail || 'Authentication failed. Please check your credentials and selected role.');
      }

      const authenticatedUser = data.user && typeof data.user === 'object' ? data.user : {};
      const authenticatedRole = authenticatedUser.role || data.role || loginForm.role;
      const sessionUser = {
        name: authenticatedUser.name || data.display_name || username,
        username: authenticatedUser.username || username,
        role: authenticatedRole,
        badge: authenticatedUser.badge || (authenticatedRole === 'admin' ? 'Maati AI Administrator' : 'Registered Krishi Farmer')
      };

      if (!['admin', 'farmer'].includes(sessionUser.role)) {
        throw new Error('The backend returned an unsupported account role.');
      }

      setUser(sessionUser);
      localStorage.setItem('maati_auth_user', JSON.stringify(sessionUser));
      localStorage.setItem('maati_auth_token', data.token);
      setShowLoginModal(false);
      setLoginForm({ username: '', password: '', role: data.role });
      setCurrentPage('home');
      setSyncToast(`${data.role === 'admin' ? 'Admin' : 'Farmer'} authentication successful.`);
      setTimeout(() => setSyncToast(''), 2500);
    } catch (error) {
      setLoginError(error.message || 'Unable to authenticate. Please make sure the FastAPI backend is running.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsManagingTeam(false);
    setIsAddingMember(false);
    setEditingMemberId(null);
    setShowLoginModal(false);
    try {
      localStorage.removeItem('maati_auth_user');
      localStorage.removeItem('maati_auth_token');
    } catch {}
    if (currentPage === 'team' || currentPage === 'dashboard') setCurrentPage('home');
  };

  const filteredSurveillance = surveillanceData.filter((item) => {
    if (severityFilter === 'ALL') return true;
    return item.severity === severityFilter;
  });

  // The public entry point is the authentication screen.
  // The main application becomes available only after a valid backend session exists.
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[2rem] bg-white shadow-2xl">
          <div
            className="hidden lg:flex min-h-[650px] p-10 text-white bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(rgba(5,35,18,.76),rgba(2,20,10,.92)),url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop')" }}
          >
            <div className="flex flex-col justify-between w-full">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-black text-3xl">M</div>
                <p className="mt-6 text-xs font-black tracking-[0.25em] text-emerald-300">MAATI AI ENTERPRISE SUITE</p>
                <h1 className="mt-3 text-5xl font-black leading-tight">Smart intelligence for every field.</h1>
                <p className="mt-5 max-w-md text-sm leading-7 text-emerald-50">AI-powered crop advisory, disease detection, weather intelligence and agro-surveillance in one secure platform.</p>
              </div>
              <div className="space-y-3 text-xs text-emerald-100">
                <div className="flex items-center gap-3"><ShieldCheck size={17} /><span>Secure role-based access</span></div>
                <div className="flex items-center gap-3"><Leaf size={17} /><span>AI-assisted agricultural intelligence</span></div>
                <div className="flex items-center gap-3"><Activity size={17} /><span>Live surveillance and field signals</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 sm:p-10 lg:p-12 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="lg:hidden flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-3xl">M</div>
              </div>
              <p className="text-[10px] font-black tracking-[0.2em] text-emerald-600">SECURE PLATFORM ACCESS</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Welcome to Maati AI</h2>
              <p className="mt-2 text-sm text-slate-500">Sign in to continue to the agricultural intelligence platform.</p>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => { setLoginError(''); setLoginForm({ ...loginForm, role: 'farmer' }); }} className={`py-3 rounded-xl border text-sm font-black ${loginForm.role === 'farmer' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200 text-slate-600'}`}>Farmer</button>
                    <button type="button" onClick={() => { setLoginError(''); setLoginForm({ ...loginForm, role: 'admin' }); }} className={`py-3 rounded-xl border text-sm font-black ${loginForm.role === 'admin' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200 text-slate-600'}`}>Admin</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2">Username</label>
                  <input type="text" required autoComplete="username" placeholder="Enter your username" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} className="w-full border rounded-xl px-4 py-3.5 text-sm outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-2">Password</label>
                  <input type="password" required autoComplete="current-password" placeholder="Enter your password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full border rounded-xl px-4 py-3.5 text-sm outline-none" />
                </div>

                <div className="rounded-xl bg-slate-50 border px-4 py-3 text-xs text-slate-600">
                  <span className="font-black text-slate-800">{loginForm.role === 'admin' ? 'Administrator' : 'Registered Farmer'}</span> access selected.
                </div>

                {loginError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-xs font-bold">{loginError}</div>
                )}

                <button type="submit" disabled={loginLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-black py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2">
                  {loginLoading ? <><Loader2 size={17} className="animate-spin" /> Authenticating...</> : <><LogIn size={17} /> Sign In Securely</>}
                </button>
              </form>

              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck size={14} className="text-emerald-500" /> Authentication is verified by the FastAPI backend.
              </div>
              <p className="mt-2 text-center text-[9px] text-slate-400">Maati AI Enterprise Suite v3.1.0</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="maati-app min-h-screen bg-[#f3f7f4] text-slate-900 font-sans flex flex-col justify-between">
      <style>{`
        :root { color-scheme: light; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #eef5f0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .maati-app {
          --maati-deep: #062b1a;
          --maati-green: #159447;
          --maati-lime: #b8e986;
          --maati-ink: #10251b;
          --maati-muted: #60766a;
          --maati-line: rgba(16, 58, 35, .10);
          background:
            radial-gradient(circle at 10% 0%, rgba(178, 232, 134, .22), transparent 28%),
            radial-gradient(circle at 95% 12%, rgba(21, 148, 71, .12), transparent 25%),
            linear-gradient(180deg, #f7fbf8 0%, #edf5f0 52%, #f7faf8 100%);
          min-height: 100vh;
        }
        .maati-app::selection { background: rgba(21, 148, 71, .20); color: #062b1a; }
        .maati-app header {
          background: rgba(255,255,255,.86) !important;
          border-bottom: 1px solid rgba(12, 72, 39, .10) !important;
          box-shadow: 0 12px 35px rgba(15, 54, 33, .08) !important;
          backdrop-filter: blur(18px);
        }
        .maati-app header > div { min-height: 70px; }
        .maati-app header nav {
          background: rgba(241,247,243,.92) !important;
          border: 1px solid rgba(17, 72, 42, .08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.85);
        }
        .maati-app header nav button {
          position: relative;
          white-space: nowrap;
          transition: transform .2s ease, background .2s ease, color .2s ease, box-shadow .2s ease;
        }
        .maati-app header nav button:hover { transform: translateY(-1px); }
        .maati-app header nav button[class*="bg-white"] {
          box-shadow: 0 5px 16px rgba(22, 84, 48, .10);
        }
        .maati-app header .w-10.h-10 {
          background: linear-gradient(145deg, #159447, #08713a) !important;
          box-shadow: 0 10px 24px rgba(21,148,71,.24) !important;
          border: 1px solid rgba(255,255,255,.35);
        }
        .maati-app main, .maati-app section { scroll-margin-top: 100px; }
        .maati-app section > div:first-child h1,
        .maati-app section > div:first-child h2 { letter-spacing: -.035em; }
        .maati-app .bg-white {
          box-shadow: 0 12px 34px rgba(20, 55, 37, .055);
          border-color: rgba(15, 67, 38, .09) !important;
        }
        .maati-app .bg-white:hover { box-shadow: 0 18px 42px rgba(20, 65, 40, .09); }
        .maati-app [class*="rounded-3xl"] { border-radius: 24px !important; }
        .maati-app [class*="rounded-2xl"] { border-radius: 18px !important; }
        .maati-app input, .maati-app select, .maati-app textarea {
          border-color: rgba(19, 73, 42, .14) !important;
          background: rgba(255,255,255,.88);
          transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
        }
        .maati-app input:focus, .maati-app select:focus, .maati-app textarea:focus {
          border-color: rgba(21,148,71,.55) !important;
          box-shadow: 0 0 0 4px rgba(21,148,71,.10);
        }
        .maati-app button { transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; }
        .maati-app button:hover:not(:disabled) { filter: saturate(1.04); }
        .maati-app button[class*="bg-emerald-600"]:hover:not(:disabled),
        .maati-app button[class*="bg-emerald-500"]:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(21,148,71,.18);
        }
        .maati-app .shadow-sm { box-shadow: 0 10px 26px rgba(18,55,35,.055) !important; }
        .maati-app .shadow-md { box-shadow: 0 14px 32px rgba(18,55,35,.10) !important; }
        .maati-app .shadow-xl, .maati-app .shadow-2xl { box-shadow: 0 28px 70px rgba(4,30,17,.18) !important; }
        .maati-app .bg-slate-950 {
          background: linear-gradient(145deg, #061d13 0%, #0a3020 62%, #0b3b25 100%) !important;
          box-shadow: 0 18px 45px rgba(2,25,14,.16);
        }
        .maati-app .bg-emerald-50 { background: rgba(232,248,238,.78) !important; }
        .maati-app .bg-slate-50 { background: rgba(246,249,247,.86) !important; }
        .maati-app .bg-slate-100 { background: rgba(237,244,239,.92) !important; }
        .maati-app [class*="border-slate-200"] { border-color: rgba(17,64,38,.10) !important; }
        .maati-app [class*="border-emerald-100"] { border-color: rgba(21,148,71,.13) !important; }
        .maati-app [class*="border-emerald-200"] { border-color: rgba(21,148,71,.20) !important; }
        .maati-app [class*="animate-in"] { animation-duration: .45s; }
        .maati-app .leaflet-container {
          border-radius: 24px;
          box-shadow: inset 0 0 0 1px rgba(10,52,29,.10);
          overflow: hidden;
        }
        .maati-app footer {
          background: rgba(255,255,255,.78) !important;
          backdrop-filter: blur(14px);
          border-top-color: rgba(14,73,40,.10) !important;
        }
        .maati-app footer span:hover { color: #0c7b3d; }
        .maati-app .maati-section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border: 1px solid rgba(21,148,71,.15);
          background: rgba(232,248,238,.78);
          border-radius: 999px;
          color: #08713a;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .maati-app .maati-section-kicker::before {
          content: "";
          width: 7px; height: 7px; border-radius: 999px;
          background: #36b56b;
          box-shadow: 0 0 0 4px rgba(54,181,107,.10);
        }
        @media (max-width: 1180px) {
          .maati-app header > div { padding-left: 18px; padding-right: 18px; }
          .maati-app header nav { order: 3; width: 100%; }
          .maati-app header > div { flex-wrap: wrap; }
        }
        @media (max-width: 760px) {
          .maati-app header > div { padding-top: 10px; padding-bottom: 10px; gap: 9px; }
          .maati-app header nav { width: 100%; overflow-x: auto; scrollbar-width: thin; }
          .maati-app header nav button { font-size: 11px; padding-left: 12px; padding-right: 12px; }
          .maati-app header .max-w-7xl > div:last-child { margin-left: auto; }
          .maati-app .text-4xl { font-size: 2.15rem; line-height: 1.06; }
          .maati-app .text-5xl { font-size: 2.45rem; line-height: 1.02; }
        }
        @media (prefers-reduced-motion: reduce) {
          .maati-app *, .maati-app *::before, .maati-app *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
        }
      `}</style>
      {/* NAVBAR */}
      <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
          <div onClick={() => setCurrentPage('home')} className="flex items-center gap-3 cursor-pointer select-none">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-200">
              M
            </div>
            <div>
              <h1 className="text-xl font-black text-emerald-950 tracking-tight leading-tight">Maati AI</h1>
              <p className="text-[10px] text-emerald-600 font-bold tracking-wider">AI for Healthy Crops & Prosperous Farmers</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold text-slate-600 overflow-x-auto">
            <button onClick={() => setCurrentPage('home')} className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition ${currentPage === 'home' ? 'bg-white text-emerald-800 shadow-sm font-black' : 'hover:text-slate-900'}`}>Home</button>
            <button onClick={() => setCurrentPage('tools')} className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition ${currentPage === 'tools' ? 'bg-white text-emerald-800 shadow-sm font-black' : 'hover:text-slate-900'}`}>AI Advisory Tools</button>
            <button onClick={() => setCurrentPage('weather')} className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition flex items-center gap-1.5 ${currentPage === 'weather' ? 'bg-white text-emerald-800 shadow-sm font-black' : 'hover:text-slate-900'}`}><CloudSun size={14} className="text-amber-500" /> Agro Weather Intel</button>
            <button onClick={() => { setCurrentPage('dashboard'); fetchSurveillance(); }} className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition ${currentPage === 'dashboard' ? 'bg-white text-emerald-800 shadow-sm font-black' : 'hover:text-slate-900'}`}>Surveillance Dashboard</button>
            <button onClick={() => setCurrentPage('about')} className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition ${currentPage === 'about' ? 'bg-white text-emerald-800 shadow-sm font-black' : 'hover:text-slate-900'}`}>About Platform</button>
            <button onClick={() => setCurrentPage('team')} className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition ${currentPage === 'team' ? 'bg-white text-emerald-800 shadow-sm font-black' : 'hover:text-slate-900'}`}>Our Team</button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl shadow-xs">
              <Globe size={15} className="text-emerald-700" />
              <select value={currentLang} onChange={(e) => handleLanguageChange(e.target.value)} className="bg-transparent text-xs font-bold text-emerald-950 outline-none cursor-pointer max-w-[170px] truncate">
                {Object.keys(ALL_22_LANGUAGES).map((code) => (
                  <option key={code} value={code} className="bg-white text-slate-800 font-medium">
                    {ALL_22_LANGUAGES[code].langName}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right"><span className="text-xs font-bold text-slate-800 block">{user.name}</span><span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">{user.badge}</span><span className="text-[8px] font-black uppercase tracking-wider text-slate-400 block mt-0.5">{isAdmin ? 'Admin Account' : 'Farmer Account'}</span></div>
                <button onClick={handleLogout} className="p-2 hover:bg-rose-50 text-slate-600 rounded-xl" title="Logout"><LogOut size={16} /></button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition">
                <LogIn size={15} /> Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold">✕</button>
            <h3 className="text-xl font-black text-slate-900 text-center mb-4">Maati AI Secure Access</h3>
            <p className="text-[11px] text-slate-500 text-center mb-4">Choose your account type before signing in.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => { setLoginError(''); setLoginForm({ ...loginForm, role: 'farmer' }); }} className={`py-2 text-xs font-bold rounded-xl border ${loginForm.role === 'farmer' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200'}`}>🌾 Farmer</button>
                <button type="button" onClick={() => { setLoginError(''); setLoginForm({ ...loginForm, role: 'admin' }); }} className={`py-2 text-xs font-bold rounded-xl border ${loginForm.role === 'admin' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200'}`}>🛡️ Admin</button>
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-[10px] text-slate-600">
                <p className="font-black text-slate-800">{loginForm.role === 'admin' ? 'Administrator access' : 'Farmer access'}</p>
                <p className="mt-1">{loginForm.role === 'admin' ? 'Team management, profile editing, incident verification, and all farmer tools.' : 'Crop advisory, disease detection, weather intelligence, surveillance viewing, and team viewing.'}</p>
              </div>
              <input type="text" required placeholder="Username / Phone" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none" />
              <input type="password" required placeholder="Password / PIN" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none" />
              {loginError && <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 text-[10px] font-bold">{loginError}</div>}
              <button type="submit" disabled={loginLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-md cursor-pointer">{loginLoading ? 'Authenticating...' : 'Authenticate & Enter'}</button>
              <p className="text-[9px] text-slate-400 text-center">Authentication is verified by the FastAPI backend. Admin actions require an admin session.</p>
            </form>
          </div>
        </div>
      )}

      {/* 5. ABOUT PLATFORM VIEW (EXACT STRUCTURE & DESIGN OF USER'S SCREENSHOT) */}
      {currentPage === 'about' && (
        <div className="w-full flex-1 pb-16 space-y-12 animate-in fade-in">
          
          {/* SECTION 1: TOP HERO BANNER (GREEN NATURE WITH PHONE SCANNER MOCKUP) */}
          <section 
            className="relative pt-12 pb-16 px-6 sm:px-12 text-white bg-cover bg-center overflow-hidden border-b border-emerald-950/20 shadow-md"
            style={{
              backgroundImage: `linear-gradient(rgba(8, 30, 16, 0.82), rgba(5, 20, 10, 0.90)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop')`
            }}
          >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Heading and Description */}
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-xs">
                  <Leaf size={14} className="text-emerald-400" />
                  <span>{aboutBio.heroTag}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  {aboutBio.heroTitle}
                </h1>

                <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
                  {aboutBio.heroBio}
                </p>

                <div className="pt-2">
                  <button 
                    onClick={() => setCurrentPage('tools')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    Explore Our Technology <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* Right Column: Smartphone Mockup with Leaf Diagnosis */}
              <div className="md:col-span-4 flex justify-center">
                <div className="w-52 bg-slate-900 border-4 border-slate-700 rounded-[36px] p-2.5 shadow-2xl relative overflow-hidden">
                  <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2"></div>
                  <div className="rounded-[24px] overflow-hidden bg-white text-slate-800 space-y-2 p-2.5">
                    <img 
                      src="https://images.unsplash.com/photo-1592417817098-8f3d69102353?q=80&w=400&auto=format&fit=crop" 
                      alt="Phone scanner preview" 
                      className="w-full h-28 object-cover rounded-xl"
                    />
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded uppercase">Detected</span>
                      <h4 className="text-[11px] font-black text-slate-900">Rice Blast (95.8%)</h4>
                      <p className="text-[9px] text-slate-500 font-medium">Tricyclazole 75% WP @ 0.6g/L</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* MAIN PAGE BODY */}
          <main className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
            
            {/* SECTION 2: "TURNING CROP PROBLEMS INTO SMART DECISIONS" */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 sm:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left side text */}
                <div className="md:col-span-7 space-y-3">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                    {aboutBio.farmersTag}
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {aboutBio.farmersTitle}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {aboutBio.farmersBio}
                  </p>
                </div>

                {/* Right side 3 stacked feature cards */}
                <div className="md:col-span-5 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0"><Cpu size={16} /></div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{aboutBio.edgeAiTitle}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{aboutBio.edgeAiBio}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-cyan-600 text-white shrink-0"><CloudSun size={16} /></div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{aboutBio.forecastTitle}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{aboutBio.forecastBio}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0"><Layers size={16} /></div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{aboutBio.nationalApiTitle}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{aboutBio.nationalApiBio}</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 3: "HOW MAATI AI WORKS" (4-STEP CONNECTED WORKFLOW) */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 text-center space-y-8">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">
                  THE PATH OF INTELLIGENCE
                </span>
                <h3 className="text-2xl font-black text-slate-900">How Maati AI Works</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Step 1: SCAN */}
                <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 flex flex-col items-center space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    <Camera size={20} />
                  </div>
                  <span className="text-[11px] font-black uppercase text-emerald-800">1. SCAN</span>
                  <p className="text-[11px] text-slate-600 leading-tight">Farmer captures clear photo of leaf or infected tissue.</p>
                </div>

                {/* Step 2: DETECT */}
                <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 flex flex-col items-center space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-[11px] font-black uppercase text-emerald-800">2. DETECT</span>
                  <p className="text-[11px] text-slate-600 leading-tight">Edge AI identifies pathogen with 94%+ diagnostic accuracy.</p>
                </div>

                {/* Step 3: PREDICT */}
                <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 flex flex-col items-center space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    <CloudSun size={20} />
                  </div>
                  <span className="text-[11px] font-black uppercase text-emerald-800">3. PREDICT</span>
                  <p className="text-[11px] text-slate-600 leading-tight">Microclimate telemetry correlates weather with outbreak potential.</p>
                </div>

                {/* Step 4: ACT */}
                <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 flex flex-col items-center space-y-2">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[11px] font-black uppercase text-emerald-800">4. ACT</span>
                  <p className="text-[11px] text-slate-600 leading-tight">Immediate localized ICAR dosages & PHI advisory delivered.</p>
                </div>

              </div>
            </section>

            {/* SECTION 4: "WHAT MAKES US DIFFERENT?" (4 STAT HIGHLIGHTS) */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-slate-900">What Makes Us Different?</h3>
                <p className="text-xs text-slate-500 font-medium">Built for smallholders, scaled for national surveillance.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-black text-xs">
                    &lt; 2s
                  </div>
                  <p className="text-xl font-black text-slate-900">&lt; 2 Sec</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Fast Inference</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto mb-2 font-black text-xs">
                    100%
                  </div>
                  <p className="text-xl font-black text-slate-900">100%</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Offline-Ready</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2 font-black text-xs">
                    28+
                  </div>
                  <p className="text-xl font-black text-slate-900">28+</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Regional States</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2 font-black text-xs">
                    38+
                  </div>
                  <p className="text-xl font-black text-slate-900">38+</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Pathogen Categories</p>
                </div>
              </div>
            </section>

            {/* SECTION 5: "FROM REACTIVE FARMING TO PREDICTIVE FARMING" */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 sm:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left side text and comparison */}
                <div className="md:col-span-7 space-y-4">
                  <h3 className="text-2xl font-black text-slate-900">From Reactive Farming to Predictive Farming.</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Traditional farming waits until blight spreads across hectares before treating with expensive chemical blankets. Maati AI reverses this paradigm:
                  </p>

                  <ul className="space-y-2 text-xs text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>Pinpoints micro-spores up to 48 hours before visible foliage collapse.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>Replaces broad-spectrum overspraying with targeted ICAR bio-chemical dosages.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>Enables District Agri Officers to isolate contagion hotspots before spore dispersal.</span>
                    </li>
                  </ul>
                </div>

                {/* Right side graphic card with quote */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-100 shadow-md w-full max-w-xs">
                    <img 
                      src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop" 
                      alt="Farmer in green crop field" 
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-emerald-950/30 flex items-center justify-center p-4">
                      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 text-center shadow-lg border border-white/40">
                        <Leaf size={16} className="text-emerald-600 mx-auto mb-1" />
                        <p className="text-xs font-black text-slate-900">Healthy Crops, Stronger Communities</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* SECTION 6: BOTTOM CALL TO ACTION (CTA) BANNER */}
            <section 
              className="py-12 px-6 text-center text-white rounded-3xl bg-cover bg-center overflow-hidden relative shadow-lg"
              style={{
                backgroundImage: `linear-gradient(rgba(10, 35, 18, 0.85), rgba(5, 20, 10, 0.92)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop')`
              }}
            >
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black text-white">The Future of Farming is Predictive</h3>
                <p className="text-xs sm:text-sm text-emerald-100">
                  Join thousands of farmers and extension officers across Bharat using AI to protect agricultural yields.
                </p>

                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button 
                    onClick={() => setCurrentPage('tools')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-md"
                  >
                    Scan a Leaf Now
                  </button>
                  <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-xl border border-white/20 transition cursor-pointer"
                  >
                    Explore Surveillance Map
                  </button>
                </div>
              </div>
            </section>

          </main>
        </div>
      )}

      {/* 1. HOME VIEW */}
      {currentPage === 'home' && (
        <div className="w-full flex-1 pb-16 space-y-14 animate-in fade-in">
          <section 
            className="relative pt-16 pb-24 px-6 text-center text-white bg-cover bg-center overflow-hidden border-b border-emerald-950/20"
            style={{
              backgroundImage: `linear-gradient(rgba(8, 30, 16, 0.76), rgba(5, 20, 10, 0.88)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop')`
            }}
          >
            <div className="max-w-4xl mx-auto space-y-4 relative z-10">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                Early Crop Disease Detection & Precision Agro-Surveillance
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Protecting Bharat's smallholder farmers with instant leaf pathology diagnoses, verified biological dosages, and native voice synthesis across all 28 states and UTs.
              </p>

              <div className="pt-6">
                <div 
                  onClick={() => setCurrentPage('tools')}
                  className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-2xl max-w-2xl mx-auto text-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border border-white/40 cursor-pointer transform hover:-translate-y-1 transition group"
                >
                  <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <Leaf className="w-8 h-8 text-emerald-600 mb-1 group-hover:scale-110 transition" />
                    <span className="text-xs font-black text-slate-800">Scan a Leaf</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Click or upload clear leaf photo</span>
                    <span className="mt-2 text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full shadow-xs">Step 1: Upload</span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-sm h-28">
                    <img 
                      src="https://images.unsplash.com/photo-1592417817098-8f3d69102353?q=80&w=400&auto=format&fit=crop" 
                      alt="Sample leaf scan" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-emerald-600/10 flex items-center justify-center">
                      <span className="bg-black/70 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={11} className="text-amber-400" /> Scanning 95.8%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 mb-1" />
                    <span className="text-xs font-black text-slate-900">Recommended Action</span>
                    <span className="text-[10px] text-slate-600 mt-0.5">ICAR verified dosage remedy</span>
                    <span className="mt-2 text-[10px] font-bold text-rose-700 bg-white px-2.5 py-0.5 rounded-full shadow-xs">Step 3: Cure Dosage</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-20">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md py-6 px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div><p className="text-3xl sm:text-4xl font-black text-emerald-600">94.8%</p><p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Diagnostic Accuracy</p></div>
              <div><p className="text-3xl sm:text-4xl font-black text-emerald-600">&lt; 2 Sec</p><p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Inference Latency</p></div>
              <div><p className="text-3xl sm:text-4xl font-black text-emerald-600">38+</p><p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Pathogen Categories</p></div>
              <div><p className="text-3xl sm:text-4xl font-black text-emerald-600">100%</p><p className="text-xs font-bold text-slate-500 uppercase mt-0.5">Field-Ready Offline</p></div>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-6 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why Maati AI?</h2>
              <p className="text-xs text-slate-500 font-medium">Smart Technology. Real Impact.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center"><Leaf size={24} /></div>
                <h3 className="font-black text-base text-slate-900">Detect Early</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">Sub-minute leaf vision pathology localizes microscopic spores days before severe systemic wilt collapses crops.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center"><Zap size={24} /></div>
                <h3 className="font-black text-base text-slate-900">Works Offline</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">Runs directly on farmer smartphones inside deep rural connectivity dead-zones using quantized edge models.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center"><CloudSun size={24} /></div>
                <h3 className="font-black text-base text-slate-900">Weather + Disease Risk</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">Dynamic microclimate heuristics warn farmers 48 hours prior to favorable fungal infection cycles.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center"><Globe size={24} /></div>
                <h3 className="font-black text-base text-slate-900">Hyper-Friendly UI</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">Speaks all 22 official constitutional languages with high-clarity voice assistance for non-literate farmers.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 2. AGRO WEATHER INTEL VIEW */}
      {currentPage === 'weather' && (
        <div className="w-full flex-1 pb-16 animate-in fade-in">
          <section className="relative overflow-hidden bg-cover bg-center text-white py-14 px-6 sm:px-12" style={{backgroundImage:`linear-gradient(rgba(5,35,22,.82),rgba(4,20,15,.92)),url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=1920&auto=format&fit=crop')`}}>
            <div className="max-w-6xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold"><CloudSun size={15}/> National Agrometeorological Advisory</div>
              <h2 className="text-3xl sm:text-4xl font-black">Agro-Climatic Weather Intelligence</h2>
              <p className="text-emerald-100 text-sm max-w-2xl">Weather-aware farming guidance for crop protection, irrigation planning, spraying windows, and field operations.</p>
            </div>
          </section>

          <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-7 relative z-10 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={18} className="text-emerald-600 shrink-0"/>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Location</p>
                  <p className="text-sm font-black text-slate-900">Select any Indian State or Union Territory</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <select value={selectedLocation} onChange={(e)=>setSelectedLocation(e.target.value)} className="w-full sm:min-w-[320px] px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-200">
                  {Object.keys(WEATHER_LOCATIONS).map((location)=><option key={location} value={location}>{location}</option>)}
                </select>
                <button onClick={fetchLiveWeather} disabled={weatherLoading} className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 disabled:opacity-60">
                  <RefreshCw size={15} className={weatherLoading ? 'animate-spin' : ''}/> {weatherLoading ? 'Refreshing...' : 'Refresh Weather'}
                </button>
              </div>
            </div>
            {weatherError && <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-xs font-bold text-rose-700">{weatherError} <button onClick={fetchLiveWeather} className="underline ml-1">Try again</button></div>}

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-7 sm:p-9 text-white shadow-xl">
                {weatherLoading && !currentWeather ? <div className="min-h-[250px] flex items-center justify-center"><div className="flex items-center gap-3 text-emerald-100"><Loader2 className="animate-spin" size={24}/> Loading live weather...</div></div> : currentWeather ? <><div className="flex justify-between items-start"><div><p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Live Current Conditions</p><h3 className="text-6xl font-black mt-2">{currentWeather.temp}°C</h3><p className="text-lg text-emerald-100 mt-1">{currentWeather.condition}</p><p className="text-xs text-slate-300 mt-2">{selectedLocation}</p><p className="text-[10px] text-emerald-200 mt-2">Updated: {weatherUpdatedAt || 'Live'}</p></div><CloudSun size={58} className="text-amber-300"/></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                  <div className="bg-white/10 rounded-2xl p-4"><Droplets size={18}/><p className="text-xl font-black mt-2">{currentWeather.humidity}%</p><p className="text-[10px] text-emerald-100">Humidity</p></div>
                  <div className="bg-white/10 rounded-2xl p-4"><Wind size={18}/><p className="text-xl font-black mt-2">{currentWeather.wind} km/h</p><p className="text-[10px] text-emerald-100">Wind</p></div>
                  <div className="bg-white/10 rounded-2xl p-4"><CloudRain size={18}/><p className="text-xl font-black mt-2">{currentWeather.rainChance}%</p><p className="text-[10px] text-emerald-100">Rain Chance</p></div>
                  <div className="bg-white/10 rounded-2xl p-4"><Sun size={18}/><p className="text-xl font-black mt-2">{currentWeather.uvIndex}</p><p className="text-[10px] text-emerald-100">UV Index</p></div>
                </div></> : null}
              </div>
              <div className="lg:col-span-5 space-y-5">
                <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6"><div className="flex items-center gap-2 text-rose-700 font-black"><AlertTriangle size={20}/> Disease Risk Alert</div><p className="text-sm text-slate-700 mt-3 leading-relaxed">{currentWeather?.microclimateRisk || (weatherLoading ? 'Updating live disease-risk conditions...' : 'Live weather unavailable.')}</p></div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-emerald-700 font-black"><ShieldCheck size={19}/> Field Advisory</div><button onClick={fetchLiveWeather} disabled={weatherLoading} className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50" title="Refresh live weather"><RefreshCw size={15} className={weatherLoading ? 'animate-spin' : ''}/></button></div><p className="text-sm text-slate-600 mt-3">{currentWeather?.advisory || (weatherLoading ? 'Preparing live field advisory...' : 'Live weather unavailable.')}</p><p className="text-xs text-slate-500 mt-2">Dew point: <b>{currentWeather?.dewPoint || '--'}</b></p><button onClick={speakText} className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2"><Volume2 size={15}/> Listen Advisory</button></div>
                {weatherError && <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 font-medium">{weatherError}. Please refresh to retry.</div>}
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-5"><div><h3 className="text-xl font-black text-slate-900">10-Day Live Farm Forecast</h3><p className="text-xs text-slate-500">Live forecast for spraying, irrigation, harvesting and field operations.</p></div><CloudSun className="text-emerald-600"/></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-3">{fiveDayForecast.map((day)=><div key={day.date} className="rounded-2xl border border-slate-200 p-4 bg-slate-50"><p className="font-black text-sm text-slate-900">{day.day}</p><p className="text-[10px] text-slate-500">{day.date}</p><div className="flex items-center gap-2 my-3">{day.icon==='sun'?<Sun className="text-amber-500"/>:day.icon==='rain'?<CloudRain className="text-blue-500"/>:<CloudSun className="text-slate-500"/>}<span className="text-xl font-black">{day.tempMax}°</span><span className="text-xs text-slate-500">/{day.tempMin}°</span></div><p className="text-xs font-bold text-slate-700">{day.condition}</p><p className="text-[10px] text-blue-700 font-bold mt-1">Rain: {day.rainProb} • {day.rainAmount.toFixed(1)} mm</p><p className="text-[10px] text-slate-500 font-bold mt-1">Max wind: {day.wind} km/h</p><p className="text-[10px] text-slate-600 leading-relaxed mt-3">{day.advisory}</p></div>)}</div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6"><Droplets className="text-blue-600"/><h3 className="font-black mt-3">Irrigation Guidance</h3><p className="text-xs text-slate-600 mt-2">Use rainfall probability and humidity before scheduling irrigation. Avoid unnecessary watering during wet periods.</p></div>
              <div className="bg-white border border-slate-200 rounded-3xl p-6"><ShieldCheck className="text-emerald-600"/><h3 className="font-black mt-3">Spray Window</h3><p className="text-xs text-slate-600 mt-2">Prefer calm, dry periods. Do not apply contact fungicides immediately before expected rainfall.</p></div>
              <div className="bg-white border border-slate-200 rounded-3xl p-6"><Activity className="text-amber-600"/><h3 className="font-black mt-3">Crop Risk Monitoring</h3><p className="text-xs text-slate-600 mt-2">High humidity and prolonged leaf wetness can increase fungal disease pressure. Scout vulnerable crops regularly.</p></div>
            </section>
          </main>
        </div>
      )}

      {/* 3. AI ADVISORY TOOLS VIEW */}
      {currentPage === 'tools' && (
        <div className="w-full flex-1 pb-16 animate-in fade-in">
          <section className="relative overflow-hidden bg-cover bg-center text-white py-12 px-6 sm:px-12 border-b border-emerald-800/20 shadow-md"
            style={{
              backgroundImage: `linear-gradient(rgba(10, 40, 20, 0.78), rgba(6, 25, 12, 0.85)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1920&auto=format&fit=crop')`
            }}
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">AI Advisory Tools</h1>
                <p className="text-emerald-100 text-sm font-medium tracking-wide">Smart Diagnosis. Timely Action. Healthier Crops.</p>
              </div>
            </div>
          </section>

          <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-5 space-y-6">
            <div className="flex bg-white/90 backdrop-blur-md border border-emerald-100 p-1.5 rounded-full w-fit mx-auto shadow-sm">
              <button onClick={() => setActiveToolTab('crop')} className={`px-6 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeToolTab === 'crop' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}><Sprout size={15} /> Soil-to-Crop Recommender</button>
              <button onClick={() => setActiveToolTab('disease')} className={`px-6 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeToolTab === 'disease' ? 'bg-emerald-600 text-white shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'}`}><Leaf size={15} /> Leaf Disease Scanner</button>
            </div>

            {activeToolTab === 'disease' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-5 space-y-4">
                    <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer bg-emerald-50/20 hover:bg-emerald-50/40 transition">
                      <Leaf className="w-10 h-10 text-emerald-600 mb-2" />
                      <span className="text-xs font-bold text-slate-800">Click to upload leaf photo</span>
                      <input type="file" accept="image/*" onChange={handleDiseaseUpload} className="hidden" />
                    </label>

                    {uploadedPreview && (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                        <img src={uploadedPreview} alt="Leaf Preview" className="w-full h-56 object-cover" />
                        <button type="button" onClick={() => setUploadedPreview(null)} className="absolute top-2.5 right-2.5 bg-black/60 text-white rounded-full p-1 cursor-pointer"><X size={14} /></button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <label
  onClick={(e) => e.stopPropagation()}
  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition"
>
  <Camera size={15} />
  Open Camera
  <input
    type="file"
    accept="image/*"
    capture="environment"
    onClick={(e) => e.stopPropagation()}
    onChange={handleDiseaseUpload}
    className="hidden"
  />
</label>

<label
  onClick={(e) => e.stopPropagation()}
  className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition"
>
  <ImageIcon size={15} className="text-emerald-600" />
  Upload Picture
  <input
    type="file"
    accept="image/*"
    onClick={(e) => e.stopPropagation()}
    onChange={handleDiseaseUpload}
    className="hidden"
  />
</label>
                    </div>

                    {actionLoading && (
                      <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-xs py-2">
                        <Loader2 className="animate-spin" size={16} /> Scanning leaf pathology...
                      </div>
                    )}
                  </div>

                  {activeDisease ? (
                    <div className="md:col-span-7 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase text-emerald-600">AI Diagnosis Result</p>
                          <h3 className="text-2xl font-black text-slate-900">{activeDisease.disease}</h3>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black">{Number(activeDisease.confidence || 0).toFixed(1)}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3"><p className="text-[10px] font-bold text-slate-500">Crop</p><p className="text-sm font-black">{activeDisease.crop || 'Unknown'}</p></div>
                        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3"><p className="text-[10px] font-bold text-slate-500">Pathogen</p><p className="text-xs font-bold">{activeDisease.pathogen}</p></div>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200"><p className="text-[10px] font-black uppercase text-amber-700 mb-1">AI Assessment</p><p className="text-xs text-slate-800 font-medium">{activeDisease.humanRisk}</p></div>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200"><p className="text-[10px] font-black uppercase text-emerald-700 mb-1">Recommended Advisory</p><p className="text-xs font-medium">{activeDisease.advisory}</p></div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200"><p className="text-[10px] font-black uppercase text-slate-600 mb-1">Organic / Biological Option</p><p className="text-xs font-medium">{activeDisease.organic}</p></div>
                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200"><p className="text-[10px] font-black uppercase text-rose-700 mb-1">Chemical Treatment</p><p className="text-xs font-medium">{activeDisease.chemical}</p></div>
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200"><p className="text-[10px] font-black uppercase text-blue-700 mb-2">Expert Treatment Plan</p>{activeDisease.treatmentPlan ? (<div className="space-y-2 text-xs text-slate-700"><p><span className="font-black text-blue-800">1. Immediate action:</span> {activeDisease.treatmentPlan.immediate}</p><p><span className="font-black text-blue-800">2. What is needed:</span> {activeDisease.treatmentPlan.materials}</p><p><span className="font-black text-blue-800">3. Biological / preventive:</span> {activeDisease.treatmentPlan.biological}</p><p><span className="font-black text-blue-800">4. Chemical treatment:</span> {activeDisease.treatmentPlan.chemical}</p><p><span className="font-black text-blue-800">5. Recommended quantity:</span> {activeDisease.treatmentPlan.dose}</p><p><span className="font-black text-blue-800">6. When / how:</span> {activeDisease.treatmentPlan.timing}</p><p><span className="font-black text-blue-800">7. Follow-up:</span> {activeDisease.treatmentPlan.followup}</p><p className="pt-1 text-[10px] text-slate-500"><span className="font-bold">Reference:</span> {activeDisease.treatmentPlan.sourceNote}</p></div>) : (<div className="space-y-2 text-xs text-slate-700"><p>{activeDisease.advisory}</p><p><span className="font-black text-blue-800">Treatment:</span> {activeDisease.chemical}</p><p><span className="font-black text-blue-800">Safety:</span> Use the current locally registered product label for dose, water volume, application method and harvest precautions.</p><p className="font-semibold text-amber-700">Disease-specific dosage was not verified for this diagnosis. Confirm the treatment with a qualified agricultural expert before application.</p></div>)}</div>
                        <div className="bg-violet-50 p-4 rounded-2xl border border-violet-200"><p className="text-[10px] font-black uppercase text-violet-700 mb-1">Human Health Impact</p><p className="text-xs text-slate-700 font-medium">{activeDisease.humanImpact}</p></div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => playVoiceNote(activeDisease.advisory)} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><Volume2 size={14}/> Listen Advisory</button>
                        <button type="button" onClick={() => window.print()} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><Printer size={14}/> Print Result</button>
                      </div>
                    </div>
                  ) : (
                    <div className="md:col-span-7 rounded-3xl bg-slate-50 border border-slate-200 p-8 text-center">
                      <Leaf className="mx-auto text-emerald-500 mb-3" size={34}/>
                      <h3 className="font-black text-slate-900">Waiting for image</h3>
                      <p className="text-xs text-slate-500 mt-1">Upload a clear leaf image to start AI diagnosis.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeToolTab === 'crop' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Soil-to-Crop Recommender</h2>
                  <p className="text-xs text-slate-500 mt-1">Enter field and soil readings to receive a ranked crop recommendation from the Maati AI backend.</p>
                </div>
                <form onSubmit={handleCropSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    ['N','Nitrogen (kg/ha)',formData.N], ['P','Phosphorus (kg/ha)',formData.P], ['K','Potassium (kg/ha)',formData.K],
                    ['temperature','Temperature (°C)',formData.temperature], ['humidity','Humidity (%)',formData.humidity], ['ph','Soil pH',formData.ph], ['rainfall','Rainfall (mm)',formData.rainfall]
                  ].map(([key,label,value]) => (
                    <label key={key} className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600">{label}</span>
                      <input type="number" step="any" value={value} onChange={(e) => setFormData(prev => ({...prev, [key]: Number(e.target.value)}))} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500" required />
                    </label>
                  ))}
                  <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                    <button type="submit" disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2">
                      {actionLoading ? <Loader2 size={15} className="animate-spin" /> : <Sprout size={15} />}
                      Get Crop Recommendation
                    </button>
                  </div>
                </form>

                {cropResult && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
                      <p className="text-[10px] font-black uppercase text-emerald-700">Recommended Crop</p>
                      <h3 className="text-3xl font-black text-slate-900 mt-1">{String(cropResult.recommended_crop || 'Unknown')}</h3>
                      <p className="text-sm text-emerald-700 font-bold mt-1">{Number(cropResult.confidence || 0).toFixed(1)}% confidence</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-3">Ranked Alternatives</p>
                      <div className="space-y-2">
                        {(Array.isArray(cropResult.alternatives) ? cropResult.alternatives : []).map((item,index) => {
                          const name = typeof item === 'object' ? (item.crop || item.name || item.label || 'Alternative') : String(item);
                          const score = typeof item === 'object' ? (item.confidence ?? item.score ?? item.probability) : null;
                          return <div key={index} className="flex justify-between gap-3 text-xs font-bold"><span>{name}</span>{score !== null && <span>{Number(score).toFixed(1)}%</span>}</div>;
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {/* 4. SURVEILLANCE DASHBOARD VIEW */}
      {currentPage === 'dashboard' && (
        <section className="max-w-7xl mx-auto px-6 py-8 w-full space-y-6 animate-in fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 border border-rose-100 px-3 py-1 rounded-full text-[11px] font-black uppercase"><Radio size={13} /> National Agro-Surveillance</div>
              <h2 className="text-3xl font-black text-slate-900 mt-2">Outbreak Intelligence Dashboard</h2>
              <p className="text-sm text-slate-500 mt-1">Monitor live agro-climatic disease risk signals, backend field alerts and response status across all Indian states and union territories.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-500 font-semibold">Last sync: {lastSyncTime}</span>
              <button onClick={fetchSurveillance} className="flex items-center gap-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl shadow-sm"><RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} /> Sync Live Feed</button>
            </div>
          </div>

          {syncToast && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 text-xs font-bold">{syncToast}</div>}
          {surveillanceError && <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl px-4 py-3 text-xs font-bold">{surveillanceError} <button onClick={fetchSurveillance} className="underline ml-2">Try again</button></div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><div className="flex justify-between"><Activity className="text-emerald-600" size={22}/><span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">LIVE</span></div><p className="text-3xl font-black mt-4">{dashboardStats.total}</p><p className="text-xs font-bold text-slate-500">Detected Incidents</p></div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><AlertTriangle className="text-rose-600" size={22}/><p className="text-3xl font-black mt-4">{dashboardStats.highRisk}</p><p className="text-xs font-bold text-slate-500">Critical Pending</p></div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><Radio className="text-amber-600" size={22}/><p className="text-3xl font-black mt-4">{dashboardStats.pending}</p><p className="text-xs font-bold text-slate-500">Awaiting Verification</p></div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><ShieldCheck className="text-blue-600" size={22}/><p className="text-3xl font-black mt-4">{surveillanceData.filter(i => i.status === 'RESOLVED').length}</p><p className="text-xs font-bold text-slate-500">Resolved Cases</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
                <div><h3 className="font-black text-slate-900">Live Outbreak Map</h3><p className="text-[11px] text-slate-500">Live weather-driven disease risk signals and verified field alerts</p></div>
                <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 outline-none"><option value="ALL">All Severities</option><option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option></select>
              </div>
              <div className="h-[500px] w-full">
                <MapContainer center={[22.00, 79.50]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                  {filteredSurveillance.map((spot) => (
                    <CircleMarker key={spot.id} center={[spot.lat, spot.lng]} radius={spot.severity === 'CRITICAL' ? 14 : 11} pathOptions={{ color: spot.severity === 'CRITICAL' ? '#e11d48' : spot.severity === 'HIGH' ? '#f59e0b' : '#38bdf8', fillColor: spot.severity === 'CRITICAL' ? '#fb7185' : spot.severity === 'HIGH' ? '#fbbf24' : '#7dd3fc', fillOpacity: 0.75, weight: 2 }}>
                      <Popup><div className="text-xs space-y-1"><strong>{spot.id} · {spot.disease}</strong><br/>{spot.state} · {spot.village}<br/>Crop: {spot.crop}<br/>{spot.source === 'LIVE WEATHER RISK' ? `Risk score: ${spot.riskScore}%` : `Confidence: ${spot.confidence}%`}<br/>Status: {spot.status}<br/><b>Solution:</b> {spot.remedy}</div></Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
              <div className="px-5 py-3 border-t border-slate-100 flex flex-wrap gap-5 text-[10px] font-bold text-slate-600"><span><i className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 mr-1"/>Critical</span><span><i className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 mr-1"/>High</span><span><i className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400 mr-1"/>Medium</span></div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-sm"><p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Response Center</p><h3 className="text-xl font-black mt-2">Field incidents</h3><p className="text-xs text-slate-400 mt-1">Review, verify and close AI-generated alerts.</p></div>
              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {filteredSurveillance.map((spot) => (
                  <div key={spot.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2"><div><p className="text-[10px] font-black text-slate-400">{spot.id} · {spot.time}</p><h4 className="font-black text-slate-900 mt-1">{spot.disease}</h4></div><span className={`text-[9px] font-black px-2 py-1 rounded-full ${spot.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : spot.severity === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>{spot.severity}</span></div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]"><div className="bg-slate-50 rounded-xl p-2"><b>Crop</b><br/>{spot.crop}</div><div className="bg-slate-50 rounded-xl p-2"><b>{spot.source === 'LIVE WEATHER RISK' ? 'Risk Score' : 'Confidence'}</b><br/>{spot.source === 'LIVE WEATHER RISK' ? spot.riskScore : spot.confidence}%</div></div>
                    <p className="text-[10px] text-slate-500 mt-3"><MapPin size={11} className="inline mr-1 text-emerald-600"/>{spot.state} · {spot.village}</p>
                    {spot.source && <p className="text-[9px] font-black uppercase tracking-wide text-sky-600 mt-2">Source: {spot.source}</p>}
                    {spot.temperature && <div className="grid grid-cols-3 gap-1.5 mt-2 text-[9px] font-bold"><span className="bg-slate-50 rounded-lg p-1.5">Temp<br/><b>{spot.temperature}°C</b></span><span className="bg-slate-50 rounded-lg p-1.5">Humidity<br/><b>{spot.humidity}%</b></span><span className="bg-slate-50 rounded-lg p-1.5">Rain risk<br/><b>{spot.rainProb}%</b></span></div>}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mt-2"><p className="text-[9px] font-black uppercase tracking-wide text-emerald-700">Recommended Solution</p><p className="text-[10px] text-slate-700 mt-1 leading-relaxed">{spot.remedy}</p>{spot.action && <p className="text-[10px] text-slate-600 mt-2 leading-relaxed"><b>Field action:</b> {spot.action}</p>}</div>
                    <p className="text-[9px] text-slate-400 mt-2">Risk signal is an advisory screening result, not a confirmed field diagnosis. Verify symptoms before treatment.</p>
                    {spot.status === 'PENDING' ? (isAdmin ? <button onClick={() => handleVerify(spot.id)} className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black py-2.5 rounded-xl flex items-center justify-center gap-2"><CheckSquare size={14}/> Verify Incident</button> : <div className="w-full mt-3 bg-slate-100 text-slate-600 text-[11px] font-black py-2.5 rounded-xl text-center">Admin verification required</div>) : <div className="w-full mt-3 bg-emerald-50 text-emerald-700 text-[11px] font-black py-2.5 rounded-xl text-center flex items-center justify-center gap-2"><CheckCircle2 size={14}/> Verified / Resolved</div>}
                  </div>
                ))}
                {filteredSurveillance.length === 0 && <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">No incidents match this severity filter.</div>}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3 mb-3"><div><h3 className="text-xl font-black text-slate-900">All India State & UT Monitoring</h3><p className="text-[11px] text-slate-500">Live risk signals are generated from current agro-climatic conditions; field verification is required.</p></div><span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">{Object.keys(WEATHER_LOCATIONS).length} locations monitored</span></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Object.keys(WEATHER_LOCATIONS).map(location => { const state = location.split(' (')[0]; const items = surveillanceData.filter(i => i.state === state); const item = items[0]; const critical = items.some(i => i.severity === 'CRITICAL'); return <div key={location} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"><div className="flex justify-between gap-2"><div><h4 className="font-black text-slate-900 text-sm">{state}</h4><p className="text-[9px] text-slate-400 mt-0.5">{location.includes('(') ? location.slice(location.indexOf('(') + 1, -1) : ''}</p></div><MapPin size={15} className={critical ? 'text-rose-600' : 'text-emerald-600'}/></div><div className="mt-3 flex items-center justify-between"><span className="text-xl font-black">{item ? item.riskScore || item.confidence : '—'}</span><span className={`text-[9px] font-black px-2 py-1 rounded-full ${critical ? 'bg-rose-100 text-rose-700' : item?.severity === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>{item?.severity || 'NO SIGNAL'}</span></div><p className="text-[9px] text-slate-500 mt-2">{item ? `${item.crop} · ${item.disease}` : 'Waiting for live feed'}</p></div>; })}
            </div>
          </div>
        </section>
      )}

      {/* 6. TEAM VIEW */}
      {currentPage === 'team' && (
        <section className="max-w-6xl mx-auto px-6 py-12 space-y-8 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">OUR TEAM</p>
              <h2 className="text-3xl font-black text-slate-900 mt-1">Team Maati AI</h2>
              <p className="text-sm text-slate-500 mt-2">{isAdmin ? 'Manage team profiles, images, roles, and descriptions.' : 'Meet the people building Maati AI for healthy crops and prosperous farmers.'}</p>
            </div>
            {isAdmin && (
              <button onClick={() => setIsManagingTeam(!isManagingTeam)} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2">
                <Edit3 size={15} /> {isManagingTeam ? 'Close Team Manager' : 'Manage Team'}
              </button>
            )}
          </div>

          {isAdmin && isManagingTeam && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-black text-emerald-950">Team Management</p>
                <p className="text-xs text-emerald-800 mt-1">Changes are saved in this browser automatically. You can add your own descriptions and profile photos.</p>
              </div>
              <button onClick={() => setIsAddingMember(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2">
                <Plus size={15} /> Add Team Member
              </button>
            </div>
          )}

          {isAddingMember && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <div><h3 className="font-black text-slate-900">Add Team Member</h3><p className="text-xs text-slate-500 mt-1">Enter the details you want to display on the team page.</p></div>
                <button onClick={() => setIsAddingMember(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X size={17} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} placeholder="Full Name" className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />
                <input value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} placeholder="Role / Designation" className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />
                <textarea value={newMember.desc} onChange={e => setNewMember({ ...newMember, desc: e.target.value })} placeholder="Description" rows="4" className="md:col-span-2 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-200 resize-none" />
                <label className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-emerald-300 flex items-center gap-4">
                  {newMember.image ? <img src={newMember.image} alt="Team preview" className="w-16 h-16 rounded-2xl object-cover" /> : <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400"><ImageIcon size={22} /></div>}
                  <div><p className="text-xs font-black text-slate-800">Upload Profile Image</p><p className="text-[10px] text-slate-500 mt-1">PNG, JPG, JPEG or WEBP</p></div>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleTeamImage(e, 'new')} />
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button onClick={() => setIsAddingMember(false)} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-black">Cancel</button>
                <button onClick={addTeamMember} disabled={!newMember.name.trim() || !newMember.role.trim()} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black disabled:opacity-40 flex items-center gap-2"><Save size={14} /> Save Member</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 text-center">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-24 h-24 rounded-3xl object-cover mx-auto mb-4 border-4 border-emerald-50 shadow-sm" />
                  ) : (
                    <div className="w-24 h-24 bg-emerald-600 text-white rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-4">{member.name.charAt(0).toUpperCase()}</div>
                  )}
                  <h4 className="font-black text-slate-900 text-base">{member.name}</h4>
                  <p className="text-xs text-emerald-600 font-black mt-1">{member.role}</p>
                  <p className="text-xs text-slate-500 leading-5 mt-3 min-h-[60px]">{member.desc || 'Add a team member description from Manage Team.'}</p>
                </div>
                {isAdmin && isManagingTeam && (
                  <div className="border-t border-slate-100 bg-slate-50 p-3 flex gap-2">
                    <button onClick={() => openEditMember(member)} className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-black flex items-center justify-center gap-1.5 hover:border-emerald-300"><Edit3 size={13} /> Edit</button>
                    <button onClick={() => deleteTeamMember(member.id)} className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-black flex items-center justify-center gap-1.5 hover:bg-rose-100"><Trash2 size={13} /> Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {editingMemberId !== null && (
            <div className="fixed inset-0 z-[1000] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6">
                <div className="flex items-center justify-between mb-5"><div><h3 className="font-black text-slate-900">Edit Team Member</h3><p className="text-xs text-slate-500 mt-1">Update name, role, description, or image.</p></div><button onClick={() => setEditingMemberId(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X size={17} /></button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="Full Name" className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />
                  <input value={teamForm.role} onChange={e => setTeamForm({ ...teamForm, role: e.target.value })} placeholder="Role / Designation" className="px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-200" />
                  <textarea value={teamForm.desc} onChange={e => setTeamForm({ ...teamForm, desc: e.target.value })} placeholder="Description" rows="5" className="md:col-span-2 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-200 resize-none" />
                  <label className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-emerald-300 flex items-center gap-4">
                    {teamForm.image ? <img src={teamForm.image} alt="Team preview" className="w-16 h-16 rounded-2xl object-cover" /> : <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400"><ImageIcon size={22} /></div>}
                    <div><p className="text-xs font-black text-slate-800">Change Profile Image</p><p className="text-[10px] text-slate-500 mt-1">Choose a new image or keep the current one.</p></div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => handleTeamImage(e, 'edit')} />
                  </label>
                </div>
                <div className="flex justify-end gap-2 mt-5"><button onClick={() => setEditingMemberId(null)} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-black">Cancel</button><button onClick={saveEditedMember} disabled={!teamForm.name.trim() || !teamForm.role.trim()} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black disabled:opacity-40 flex items-center gap-2"><Save size={14} /> Save Changes</button></div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 print:hidden">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div><span>{footerText}</span></div>
          <div className="flex gap-6 font-semibold">
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentPage('home')}>Home</span>
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentPage('tools')}>AI Advisory Tools</span>
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentPage('weather')}>Agro Weather Intel</span>
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>Surveillance Dashboard</span>
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentPage('about')}>About Platform</span>
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentPage('team')}>Our Team</span>
          </div>
        </div>
      </footer>
    </div>
  );
}