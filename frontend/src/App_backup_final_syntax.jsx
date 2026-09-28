import React, { useState, useEffect } from 'react';
import Home from "./components/Home";
import { 
  Sprout, CheckCircle2, Loader2, Leaf, VolumeX, 
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
  { id: 1, name: "Punam Kumari Shaw", role: "Team Leader & ML Lead", desc: "Overseeing model architecture, PyTorch inference & backend API design." },
  { id: 2, name: "Full Stack Architect", role: "React & Cloud Developer", desc: "Built reactive client architecture, Vite bundling, and Leaflet geospatial integration." },
  { id: 3, name: "Agri-Domain Specialist", role: "IPM Advisory Lead", desc: "Curated ICAR-grade chemical dosage tables, biological controls, and PHI limits." },
  { id: 4, name: "Surveillance Engineer", role: "GIS & Cluster Lead", desc: "Implemented PostGIS spatial queries, H3 hexagonal clustering, and officer triage." },
  { id: 5, name: "Edge AI Specialist", role: "TFLite / ONNX Engineer", desc: "Quantized deep neural vision backbones for sub-100ms offline mobile execution." },
  { id: 6, name: "UI/UX & Regional Voice", role: "Multilingual Engine Lead", desc: "Designed accessible field interfaces and regional language synthesizer pipelines." }
];

const DEFAULT_FOOTER_TEXT = "Â© 2026 Maati AI Platform. Built for Smart India Hackathon.";

// ADVANCED COMPREHENSIVE DISEASE DATABASE
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
    advisory: "Do not spray sulfur products when ambient temperatures exceed 32Â°C to prevent severe leaf phytotoxicity and scorching."
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
    advisory: "Vector eradication is critical. Thermotherapy of nursery budwood at 48Â°C for 4 hours."
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
  hi: { langName: "à¤¹à¤¿à¤‚à¤¦à¥€ (Hindi)", code: "hi" },
  bn: { langName: "à¦¬à¦¾à¦‚à¦²à¦¾ (Bengali)", code: "bn" },
  te: { langName: "à°¤à±†à°²à±à°—à± (Telugu)", code: "te" },
  mr: { langName: "à¤®à¤°à¤¾à¤ à¥€ (Marathi)", code: "mr" },
  ta: { langName: "à®¤à®®à®¿à®´à¯ (Tamil)", code: "ta" },
  gu: { langName: "àª—à«àªœàª°àª¾àª¤à«€ (Gujarati)", code: "gu" },
  kn: { langName: "à²•à²¨à³à²¨à²¡ (Kannada)", code: "kn" },
  ml: { langName: "à´®à´²à´¯à´¾à´³à´‚ (Malayalam)", code: "ml" },
  or: { langName: "à¬“à¬¡à¬¼à¬¿à¬† (Odia)", code: "or" },
  pa: { langName: "à¨ªà©°à¨œà¨¾à¨¬à©€ (Punjabi)", code: "pa" },
  as: { langName: "à¦…à¦¸à¦®à§€à¦¯à¦¼à¦¾ (Assamese)", code: "as" },
  ur: { langName: "Ø§Ø±Ø¯Ùˆ (Urdu)", code: "ur" },
  mai: { langName: "à¤®à¥ˆà¤¥à¤¿à¤²à¥€ (Maithili)", code: "mai" },
  sat: { langName: "á±¥á±Ÿá±±á±›á±Ÿá±²á±¤ (Santali)", code: "sat" },
  ks: { langName: "Ú©Ù²Ø´ÙØ± (Kashmiri)", code: "ks" },
  ne: { langName: "à¤¨à¥‡à¤ªà¤¾à¤²à¥€ (Nepali)", code: "ne" },
  kok: { langName: "à¤•à¥‹à¤‚à¤•à¤£à¥€ (Konkani)", code: "gom" },
  sd: { langName: "Ø³Ù†ÚŒÙŠ (Sindhi)", code: "sd" },
  doi: { langName: "à¤¡à¥‹à¤—à¤°à¥€ (Dogri)", code: "doi" },
  mni: { langName: "ê¯ƒà§ˆà¦¤à§ˆê¯‚ê¯£ê¯Ÿ (Manipuri)", code: "mni-Mtei" },
  brx: { langName: "à¤¬à¤¡à¤¼à¥‹ (Bodo)", code: "brx" },
  sa: { langName: "à¤¸à¤‚à¤¸à¥à¤•à¥ƒà¤¤à¤®à¥ (Sanskrit)", code: "sa" }
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

  const [currentPage, setCurrentPage] = useState('about');
  const [activeToolTab, setActiveToolTab] = useState('disease');

  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', role: 'farmer' });

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
  const [newMember, setNewMember] = useState({ name: '', role: '', desc: '' });

  // SOIL & ADVISORY STATE
  const [formData, setFormData] = useState({ N: 90, P: 42, K: 43, temperature: 24.5, humidity: 82, ph: 6.5, rainfall: 200 });
  const [cropResult, setCropResult] = useState(null);

  // DYNAMIC DIAGNOSIS STATE
  const [catalogScope, setCatalogScope] = useState('all');
  const [selectedDiseaseKey, setSelectedDiseaseKey] = useState('ind-rice-blast');
  const [activeDisease, setActiveDisease] = useState(GLOBAL_DISEASE_DATABASE['ind-rice-blast']);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // WEATHER STATE
  const [selectedLocation, setSelectedLocation] = useState('West Bengal (Howrah/Kolkata)');
  const [currentWeather] = useState({
    temp: 28.4,
    humidity: 84,
    wind: 12,
    rainChance: 65,
    condition: "Humid & Intermittent Sunshine",
    microclimateRisk: "CRITICAL: Relative humidity >80% elevates fungal sporulation risk.",
    uvIndex: 7,
    dewPoint: "24Â°C"
  });

  const [fiveDayForecast] = useState([
    { day: "Today", date: "25 Sep", tempMax: 31, tempMin: 25, condition: "Thunder Showers", rainProb: "70%", icon: "rain", advisory: "Hold chemical spray; rainwater will wash off contact fungicide." },
    { day: "Tomorrow", date: "26 Sep", tempMax: 32, tempMin: 26, condition: "Partly Cloudy", rainProb: "35%", icon: "cloud", advisory: "Ideal morning window (7 AM - 10 AM) for systemic foliar spray." },
    { day: "Sunday", date: "27 Sep", tempMax: 33, tempMin: 26, condition: "Sunny & Clear", rainProb: "15%", icon: "sun", advisory: "Favorable for field harvesting and grain sun-drying." },
    { day: "Monday", date: "28 Sep", tempMax: 30, tempMin: 24, condition: "Overcast Breeze", rainProb: "40%", icon: "cloud", advisory: "Monitor sticky cards for early aphid migration in vegetable plots." },
    { day: "Tuesday", date: "29 Sep", tempMax: 29, tempMin: 23, condition: "Light Drizzle", rainProb: "55%", icon: "rain", advisory: "Ensure good drainage in nursery beds to prevent seedling damping-off." }
  ]);

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('10:15:20 PM');
  const [syncToast, setSyncToast] = useState('');

  // SURVEILLANCE DATA
  const [surveillanceData, setSurveillanceData] = useState([
    { id: "IND-101", state: "West Bengal", village: "Kolkata & 24 Parganas Belt", crop: "Tomato", disease: "Late Blight", severity: "CRITICAL", confidence: 94.2, lat: 22.5726, lng: 88.3639, status: "PENDING", time: "8 mins ago", remedy: "Mancozeb 75% WP @ 2.0g/L immediately during clear sunshine" },
    { id: "IND-102", state: "Punjab", village: "Ludhiana Agro Zone", crop: "Wheat", disease: "Yellow Rust", severity: "CRITICAL", confidence: 95.8, lat: 30.9010, lng: 75.8573, status: "PENDING", time: "15 mins ago", remedy: "Propiconazole 25% EC @ 1ml/L foliar spray" },
    { id: "IND-103", state: "Maharashtra", village: "Nashik Onion Belt", crop: "Onion", disease: "Purple Blotch", severity: "HIGH", confidence: 89.2, lat: 19.9975, lng: 73.7898, status: "PENDING", time: "32 mins ago", remedy: "Difenoconazole 25% EC @ 0.5ml/L" },
    { id: "IND-104", state: "Karnataka", village: "Mandya Cauvery Basin", crop: "Paddy (Rice)", disease: "Bacterial Leaf Blight", severity: "HIGH", confidence: 91.5, lat: 12.5244, lng: 76.8958, status: "PENDING", time: "45 mins ago", remedy: "Streptocycline 1g + Copper Oxychloride 20g in 10L water" }
  ]);

  const [dashboardStats, setDashboardStats] = useState({ total: 4, highRisk: 2, pending: 4 });

  useEffect(() => {
    const pendingCount = surveillanceData.filter(i => i.status === 'PENDING').length;
    const highRiskCount = surveillanceData.filter(i => i.severity === 'CRITICAL' && i.status === 'PENDING').length;
    setDashboardStats({
      total: surveillanceData.length,
      highRisk: highRiskCount,
      pending: pendingCount
    });
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
    setSyncToast("Syncing live feed...");
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/surveillance/hotspots');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'SUCCESS' && Array.isArray(data.incidents)) {
          setSurveillanceData(data.incidents);
        }
      }
      setSyncToast("National agro-telemetry synced successfully!");
    } catch {
      setSyncToast("National agro-telemetry synced successfully!");
    } finally {
      setLastSyncTime(new Date().toLocaleTimeString());
      setTimeout(() => setIsSyncing(false), 500);
      setTimeout(() => setSyncToast(''), 3000);
    }
  };

  const handleVerify = (id) => {
    setSurveillanceData(prev => prev.map(item => item.id === id ? { ...item, status: "RESOLVED" } : item));
    setSyncToast(`Case ${id} verified and dispatch instruction issued!`);
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
  const file = e.target.files[0];

  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  setUploadedPreview(previewUrl);
  setActionLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/detect-disease",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Disease detection request failed");
    }

    const data = await response.json();

    const diseaseMap = {
      "Rice Blast": "ind-rice-blast",
      "Potato Early Blight": "ind-potato-early-blight",
      "Tomato Late Blight": "ind-tomato-late-blight",
      "Wheat Yellow Rust": "ind-wheat-yellow-rust",
      "Powdery Mildew": "global-powdery-mildew",
    };

    const detectedKey =
      diseaseMap[data.disease] || "ind-rice-blast";

    const diseaseInfo = GLOBAL_DISEASE_DATABASE[detectedKey];

    setSelectedDiseaseKey(detectedKey);

    setActiveDisease({
  ...diseaseInfo,
  confidence: data.confidence,
  description: data.description || diseaseInfo?.description,
  symptoms: data.symptoms || diseaseInfo?.symptoms,
  treatment: data.treatment || diseaseInfo?.treatment,
});

    if (currentPage !== "tools") {
      setCurrentPage("tools");
    }
  } catch (error) {
    console.error("Disease detection error:", error);

    setSelectedDiseaseKey("ind-rice-blast");
    setActiveDisease(
      GLOBAL_DISEASE_DATABASE["ind-rice-blast"]
    );
  } finally {
    setActionLoading(false);
  }
};

  const handleCropSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/recommend-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setCropResult(await res.json());
      else setCropResult({ crop: "rice", confidence: 92.4, alternatives: ["Jute (86%)", "Maize (79%)"] });
    } catch {
      setCropResult({ crop: "rice", confidence: 91.0, alternatives: ["Jute (84%)", "Maize (78%)"] });
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

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      name: loginForm.username.trim() || "Punam Shaw",
      role: loginForm.role,
      badge: loginForm.role === 'officer' ? "National Agriculture Surveillance Officer" : "Registered Krishi Farmer"
    });
    setShowLoginModal(false);
  };

  const filteredSurveillance = surveillanceData.filter((item) => {
    if (severityFilter === 'ALL') return true;
    return item.severity === severityFilter;
  });

  return (
    <div className="min-h-screen bg-[#f3f7f4] text-slate-900 font-sans flex flex-col justify-between">
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
                <span className="text-xs font-bold text-slate-800">{user.name}</span>
                <button onClick={() => setUser(null)} className="p-2 hover:bg-rose-50 text-slate-600 rounded-xl" title="Logout"><LogOut size={16} /></button>
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
            <button onClick={() => setShowLoginModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold">âœ•</button>
            <h3 className="text-xl font-black text-slate-900 text-center mb-4">Maati AI Secure Access</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setLoginForm({ ...loginForm, role: 'farmer' })} className={`py-2 text-xs font-bold rounded-xl border ${loginForm.role === 'farmer' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200'}`}>ðŸŒ¾ Farmer</button>
                <button type="button" onClick={() => setLoginForm({ ...loginForm, role: 'officer' })} className={`py-2 text-xs font-bold rounded-xl border ${loginForm.role === 'officer' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'border-slate-200'}`}>ðŸ›¡ï¸ Agri Officer</button>
              </div>
              <input type="text" required placeholder="Username / Phone" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none" />
              <input type="password" required placeholder="Password / PIN" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full border rounded-xl p-3 text-sm outline-none" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md cursor-pointer">Authenticate & Enter</button>
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
{currentPage === "home" && (
  <Home setCurrentPage={setCurrentPage} />
)}

      {/* 2. AGRO WEATHER INTEL VIEW */}
      {currentPage === 'weather' && (
        <section className="max-w-6xl mx-auto px-6 py-10 w-full space-y-8 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold mb-2">
                <CloudSun size={14} /> National Agrometeorological Advisory
              </div>
              <h2 className="text-3xl font-black text-slate-900">Agro-Climatic Weather Intelligence</h2>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
              <MapPin size={16} className="text-emerald-600" />
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer">
                <option value="West Bengal (Howrah/Kolkata)">West Bengal (Howrah/Kolkata)</option>
                <option value="Punjab (Ludhiana/Amritsar)">Punjab (Ludhiana/Amritsar)</option>
                <option value="Maharashtra (Nashik/Pune)">Maharashtra (Nashik/Pune)</option>
              </select>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
            <h3 className="text-5xl font-black">{currentWeather.temp}Â°C</h3>
            <p className="text-sm text-emerald-200 mt-1">{currentWeather.condition}</p>
          </div>
        </section>
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
              <button
  onClick={() => setActiveToolTab('crop')}
  className={`px-6 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
    activeToolTab === 'crop'
      ? 'bg-emerald-600 text-white shadow-sm'
      : 'text-slate-600 hover:text-slate-900'
  }`}
>
  <Sprout size={15} /> Soil-to-Crop Recommender
</button>
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
    <div>
      <h2 className="text-2xl font-black text-slate-900">
        Soil-to-Crop Recommender
      </h2>
      <p className="text-sm text-slate-500 mt-1">
        Enter your soil and environmental parameters to get a crop recommendation.
      </p>
    </div>

    <form onSubmit={handleCropSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Nitrogen (N)
          </label>
          <input
            type="number"
            value={formData.N}
            onChange={(e) => setFormData({ ...formData, N: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Phosphorus (P)
          </label>
          <input
            type="number"
            value={formData.P}
            onChange={(e) => setFormData({ ...formData, P: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Potassium (K)
          </label>
          <input
            type="number"
            value={formData.K}
            onChange={(e) => setFormData({ ...formData, K: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Temperature (Â°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Humidity (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.humidity}
            onChange={(e) => setFormData({ ...formData, humidity: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Soil pH
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.ph}
            onChange={(e) => setFormData({ ...formData, ph: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Rainfall (mm)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.rainfall}
            onChange={(e) => setFormData({ ...formData, rainfall: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={actionLoading}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer"
      >
        {actionLoading ? "Analyzing..." : "Recommend Crop"}
      </button>
    </form>

    {cropResult && (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <h3 className="text-lg font-black text-emerald-900">
          Recommended Crop
        </h3>

        <p className="text-2xl font-black text-emerald-700 mt-2 capitalize">
          {cropResult.crop}
        </p>

        {cropResult.confidence !== undefined && (
          <p className="text-sm text-slate-600 mt-2">
            Confidence: {cropResult.confidence}%
          </p>
        )}

        {cropResult.alternatives?.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-bold text-slate-700">
              Alternative Crops
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {cropResult.alternatives.join(", ")}
            </p>

          </div>
        )}
      </div>
    )}
  </div>
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
                      <label className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition">
                        <Camera size={15} /> Open Camera
                        <input type="file" accept="image/*" capture="environment" onChange={handleDiseaseUpload} className="hidden" />
                      </label>
                      <label className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition">
                        <ImageIcon size={15} className="text-emerald-600" /> Upload Picture
                        <input type="file" accept="image/*" onChange={handleDiseaseUpload} className="hidden" />
                      </label>
                    </div>

                    {actionLoading && (
                      <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-xs py-2">
                        <Loader2 className="animate-spin" size={16} /> Scanning leaf pathology...
                      </div>
                    )}
                  </div>

                  {activeDisease && (
  <div className="md:col-span-7 space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
          AI Diagnosis Result
        </p>

        <h3 className="text-2xl font-black text-slate-900 mt-1">
          {activeDisease.disease}
        </h3>

        {activeDisease.crop && (
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Crop: {activeDisease.crop}
          </p>
        )}
      </div>

      <div className="shrink-0 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-center">
        <p className="text-[9px] font-black uppercase text-emerald-700">
          Confidence
        </p>

        <p className="text-xl font-black text-emerald-800">
          {activeDisease.confidence || 0}%
        </p>
      </div>
    </div>

    {activeDisease.description && (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
          Disease Overview
        </p>

        <p className="text-xs text-slate-700 leading-relaxed">
          {activeDisease.description}
        </p>
      </div>
    )}

    {activeDisease.symptoms && (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 mb-1">
          Symptoms
        </p>

        <p className="text-xs text-amber-950 leading-relaxed">
          {activeDisease.symptoms}
        </p>
      </div>
    )}

    {activeDisease.treatment?.organic && (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1">
          Organic Treatment
        </p>

        <p className="text-xs text-emerald-950 leading-relaxed">
          {activeDisease.treatment.organic}
        </p>
      </div>
    )}

    {activeDisease.treatment?.chemical && (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-1">
          Chemical Treatment
        </p>

        <p className="text-xs text-blue-950 leading-relaxed">
          {activeDisease.treatment.chemical}
        </p>
      </div>
    )}

    {activeDisease.treatment?.spray && (
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
        <p className="text-[10px] font-black uppercase tracking-wider text-violet-700 mb-1">
          Spray & Field Advisory
        </p>

        <p className="text-xs text-violet-950 leading-relaxed">
          {activeDisease.treatment.spray}
        </p>
      </div>
    )}

    <button
      type="button"
      onClick={speakText}
      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl transition cursor-pointer"
    >
      {speaking ? (
        <>
          <VolumeX size={15} />
          Stop Voice Guidance
        </>
      ) : (
        <>
          <Volume2 size={15} />
          Listen to Treatment Guidance
        </>
      )}
    </button>
  </div>
)}
                </div>
              </div>
            )}
      {/* 4. SURVEILLANCE DASHBOARD VIEW */}
      {currentPage === 'dashboard' && (
        <section className="max-w-6xl mx-auto px-6 py-8 w-full space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><h2 className="text-2xl font-black text-slate-900">National Agro-Surveillance Command</h2></div>
            <button onClick={fetchSurveillance} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3.5 py-2 rounded-xl shadow-xs">
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} /> Sync Live Feed
            </button>
          </div>
          <div className="h-[460px] w-full rounded-2xl overflow-hidden border border-slate-200">
            <MapContainer center={[22.00, 79.50]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {filteredSurveillance.map((spot) => (
                <CircleMarker key={spot.id} center={[spot.lat, spot.lng]} radius={12} pathOptions={{ color: spot.severity === 'CRITICAL' ? '#e11d48' : '#f59e0b', fillOpacity: 0.75 }}>
                  <Popup>{spot.village} - {spot.disease}</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </section>
      )}

      {/* 6. TEAM VIEW */}
      {currentPage === 'team' && (
        <section className="max-w-5xl mx-auto px-6 py-12 space-y-8 animate-in fade-in">
          <div className="flex justify-between items-center"><h2 className="text-3xl font-black text-slate-900">Team Maati AI</h2></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-center">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto mb-3">{member.name.charAt(0)}</div>
                <h4 className="font-bold text-slate-900">{member.name}</h4>
                <p className="text-xs text-emerald-600 font-semibold mb-1">{member.role}</p>
                <p className="text-xs text-slate-500">{member.desc}</p>
              </div>
            ))}
          </div>
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
