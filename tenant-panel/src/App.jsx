import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
  Car,
  TrendingUp,
  DollarSign,
  FileText,
  Users,
  Briefcase,
  Landmark,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  PieChart,
  Settings,
  LogOut,
  Lock,
  Eye,
  Menu,
  X,
  CreditCard,
  Phone,
  Mail,
  User,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const formatCur = (val) => {
  return Math.round(val || 0).toLocaleString('tr-TR') + ' ₺';
};

const CAR_DATA = {
  "Volkswagen": {
    "Passat": ["1.6 TDI Bluemotion Trendline", "1.6 TDI Bluemotion Comfortline", "1.6 TDI Bluemotion Highline", "1.5 TSI Elegance", "1.5 TSI Business", "2.0 TDI Bluemotion Highline"],
    "Golf": ["1.6 TDI Comfortline", "1.6 TDI Highline", "1.2 TSI Trendline", "1.4 TSI Highline", "1.5 TSI R-Line"],
    "Polo": ["1.2 TSI Comfortline", "1.4 TDI Comfortline", "1.0 TSI Trendline", "1.0 TSI Comfortline", "1.6 TDI Comfortline"],
    "Tiguan": ["1.5 TSI Act Comfortline", "1.5 TSI Elegance", "2.0 TDI Highline", "1.6 TDI Comfortline"],
    "Jetta": ["1.6 TDI Trendline", "1.6 TDI Comfortline", "1.6 TDI Highline", "1.2 TSI Trendline", "1.4 TSI Highline"]
  },
  "Renault": {
    "Clio": ["1.5 dCi Joy", "1.5 dCi Touch", "1.5 dCi Icon", "1.0 TCe Joy", "1.0 TCe Touch", "1.0 TCe Icon", "1.2 Joy"],
    "Megane": ["1.5 dCi Touch", "1.5 dCi Icon", "1.5 Blue dCi Joy", "1.3 TCe Joy", "1.3 TCe Touch", "1.3 TCe Icon"],
    "Fluence": ["1.5 dCi Touch", "1.5 dCi Icon", "1.5 dCi Business", "1.5 dCi Privilege"],
    "Symbol": ["1.5 dCi Joy", "1.2 16V Joy", "0.9 TCe Joy"],
    "Duster": ["1.5 dCi Laureate", "1.5 dCi Prestige", "1.3 TCe Prestige", "1.5 Blue dCi Comfort"]
  },
  "Fiat": {
    "Egea": ["1.3 M.Jet Easy", "1.3 M.Jet Urban", "1.6 M.Jet Urban", "1.6 M.Jet Lounge", "1.4 Fire Easy", "1.4 Fire Urban"],
    "Linea": ["1.3 M.Jet Active Plus", "1.3 M.Jet Pop", "1.6 M.Jet Lounge", "1.4 Fire Pop"],
    "Doblo": ["1.3 M.Jet Premio", "1.6 M.Jet Premio", "1.3 M.Jet Safeline", "1.6 M.Jet Easy"],
    "Fiorino": ["1.3 M.Jet Pop", "1.3 M.Jet Safeline", "1.3 M.Jet Premio"]
  },
  "Ford": {
    "Focus": ["1.6 TDCi Trend X", "1.6 TDCi Style", "1.6 TDCi Titanium", "1.5 EcoBlue Trend X", "1.5 EcoBlue Titanium"],
    "Fiesta": ["1.4 TDCi Trend", "1.4 TDCi Titanium", "1.25 Trend", "1.0 EcoBoost Titanium"],
    "Courier": ["1.5 TDCi Trend", "1.5 TDCi Deluxe", "1.6 TDCi Titanium", "1.5 TDCi Titanium Plus"]
  },
  "Hyundai": {
    "i20": ["1.2 D-Style", "1.4 CRDi Jump", "1.4 CRDi Style", "1.4 MPI Style", "1.4 MPI Elite"],
    "Tucson": ["1.6 CRDi Elite", "1.6 CRDi Elite Plus", "1.6 GDI Elite", "1.6 T-GDI Elite Sport"]
  },
  "Toyota": {
    "Corolla": ["1.4 D-4D Active", "1.4 D-4D Touch", "1.4 D-4D Advance", "1.4 D-4D Premium", "1.6 Touch", "1.5 Vision", "1.5 Dream", "1.8 Hybrid Dream"]
  },
  "BMW": {
    "3 Serisi": ["320d Premium", "320d Technology", "320d M Sport", "320i ED 40th Year Edition", "320i First Edition Sport Line", "320i First Edition M Sport"],
    "5 Serisi": ["520d Premium", "520d Executive", "520i Executive", "520i Special Edition M Sport"]
  },
  "Mercedes-Benz": {
    "C Serisi": ["C180 BlueEfficiency Fascination", "C180 AMG", "C200 d AMG", "C200 d Style", "C200 d Exclusive"],
    "E Serisi": ["E250 CDI Avantgarde", "E180 Elite", "E180 Edition M", "E200 d AMG", "E200 d Exclusive"]
  },
  "Audi": {
    "A3": ["1.6 TDI Attraction", "1.6 TDI Ambition", "1.6 TDI Sportback S-Line", "30 TDI S Tronic Design", "35 TFSI S Tronic Advanced"],
    "A4": ["2.0 TDI Design", "2.0 TDI Quattro Sport", "2.0 TFSI Design"]
  },
  "Opel": {
    "Astra": ["1.6 CDTI Enjoy Active", "1.6 CDTI Design", "1.6 CDTI Cosmo", "1.6 CDTI Elite", "1.4 Turbo Enjoy", "1.2 Turbo Edition"],
    "Corsa": ["1.3 CDTI Essentia", "1.3 CDTI Enjoy", "1.2 Essentia", "1.4 Enjoy", "1.2 Turbo Edition"]
  },
  "Peugeot": {
    "3008": ["1.6 BlueHedi Active Life", "1.6 BlueHdi Active", "1.6 BlueHdi Allure", "1.5 BlueHdi Active Prime", "1.5 BlueHdi Allure Dynamic", "1.5 BlueHdi GT Line"],
    "2008": ["1.6 e-Hdi Active", "1.6 BlueHdi Allure", "1.5 BlueHdi Active Prime", "1.2 PureTech Allure"]
  }
};

const getFirstImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  try {
    const urls = JSON.parse(imageUrl);
    if (Array.isArray(urls) && urls.length > 0) {
      return urls[0];
    }
  } catch (e) {
    // If not a JSON string, return the original string
  }
  return imageUrl;
};

export default function App() {
  // Mode Selection: 'portal' (gm.galerim.app) vs 'catalog' (galeriadi.galerim.app)
  const [appMode, setAppMode] = useState('portal'); // 'portal' | 'catalog'
  const [catalogSlug, setCatalogSlug] = useState('');
  const [catalogTenant, setCatalogTenant] = useState(null);
  const [catalogFilterQuery, setCatalogFilterQuery] = useState('');
  const [catalogFilterBodyType, setCatalogFilterBodyType] = useState('All');

  // Portal Marketplace States
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [portalSelectedGallerySlug, setPortalSelectedGallerySlug] = useState(null);
  const [portalCategory, setPortalCategory] = useState('Otomobil');
  const [portalSort, setPortalSort] = useState('featured');
  const [portalView, setPortalView] = useState('grid');
  const [portalGrouped, setPortalGrouped] = useState(false);
  const [portalSelectedBrands, setPortalSelectedBrands] = useState([]);
  const [portalPriceMin, setPortalPriceMin] = useState('');
  const [portalPriceMax, setPortalPriceMax] = useState('');
  const [portalYearMin, setPortalYearMin] = useState('');
  const [portalYearMax, setPortalYearMax] = useState('');
  const [portalSelectedFuels, setPortalSelectedFuels] = useState([]);
  const [portalSelectedBodyTypes, setPortalSelectedBodyTypes] = useState([]);
  const [portalHeavyDamage, setPortalHeavyDamage] = useState('');
  const [portalSelectedGears, setPortalSelectedGears] = useState([]);
  const [portalSelectedGallery, setPortalSelectedGallery] = useState(null);
  const [portalFavs, setPortalFavs] = useState({});
  const [phoneShown, setPhoneShown] = useState(false);
  const [portalMessageModalOpen, setPortalMessageModalOpen] = useState(false);
  const [portalMessageForm, setPortalMessageForm] = useState({ name: '', phone: '', text: '' });
  const [portalMessageSending, setPortalMessageSending] = useState(false);
  const [portalMessageSent, setPortalMessageSent] = useState(false);

  // Authentication State
  const [user, setUser] = useState(null); // { email, role: 'superadmin' | 'tenant', tenantId }
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSlug, setLoginSlug] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab/Views State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicleTab, setVehicleTab] = useState('stokta');
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editVehicleForm, setEditVehicleForm] = useState(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-07');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [aracFiles, setAracFiles] = useState(Array(10).fill(null));
  const [isSavingVehicle, setIsSavingVehicle] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [customBrandMode, setCustomBrandMode] = useState(false);
  const [customModelMode, setCustomModelMode] = useState(false);
  const [customVersionMode, setCustomVersionMode] = useState(false);
  const [customBrandInput, setCustomBrandInput] = useState('');
  const [customModelInput, setCustomModelInput] = useState('');
  const [customVersionInput, setCustomVersionInput] = useState('');
  const [editSlots, setEditSlots] = useState(Array(10).fill(null));
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [settingsForm, setSettingsForm] = useState({ name: '', company_title: '', owner_name: '', owner_phone: '', owner_email: '', tax_office: '', tax_number: '', address: '', password: '' });

  useEffect(() => {
    setActiveImageIdx(0);
  }, [selectedAdId]);

  // General Database States
  const [tenants, setTenants] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [messages, setMessages] = useState([]);
  const [replyModal, setReplyModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);

  // Active Tenant Context (for merged panel)
  const [currentTenant, setCurrentTenant] = useState(null);
  const [trialExpired, setTrialExpired] = useState(false);

  // Superadmin view state
  const [superadminSelectedTenant, setSuperadminSelectedTenant] = useState(null);

  const [aracForm, setAracForm] = useState({
    brand: '', model: '', plate: '', km: '', year: new Date().getFullYear(),
    fuel_type: 'Benzin', gear_type: 'Otomatik', body_type: 'Sedan', buy_price: '', sell_price: '',
    seller_name: '', seller_phone: '', buy_date: new Date().toISOString().split('T')[0],
    has_kasko: false, has_sigorta: false, has_warranty: false, has_spare_key: false,
    has_ruhsat: false, has_invoice: false, tramer_amount: 0, is_heavy_damage: false,
    is_consignment: false, description: ''
  });

  const [expertise, setExpertise] = useState({
    sag_on_camurluk: 'orijinal', sol_on_camurluk: 'orijinal',
    sag_on_kapi: 'orijinal', sol_on_kapi: 'orijinal',
    sag_arka_kapi: 'orijinal', sol_arka_kapi: 'orijinal',
    sag_arka_camurluk: 'orijinal', sol_arka_camurluk: 'orijinal',
    motor_kaputu: 'orijinal', tavan: 'orijinal', bagaj_kapagi: 'orijinal'
  });

  const toggleExpertise = (part) => {
    const states = ['orijinal', 'lokal', 'boyali', 'degismis'];
    const current = expertise[part];
    const nextIdx = (states.indexOf(current) + 1) % states.length;
    setExpertise({
      ...expertise,
      [part]: states[nextIdx]
    });
  };

  const [masrafForm, setMasrafForm] = useState({
    vehicle_id: '', expense_type: 'yakit', amount: '',
    expense_date: new Date().toISOString().split('T')[0], bank_id: '', description: ''
  });

  const [satisForm, setSatisForm] = useState({
    vehicle_id: '', customer_id: '', sell_price: '', notary_expense: 0,
    sale_date: new Date().toISOString().split('T')[0], bank_id: ''
  });

  const [bankForm, setBankForm] = useState({ bank_name: '', account_name: '', iban: '', balance: '' });
  const [docForm, setDocForm] = useState({ type: 'cek', amount: '', due_date: '', debtor: '', status: 'bekliyor' });
  const [customerForm, setCustomerForm] = useState({ name_surname: '', phone: '', email: '', notes: '' });
  const [personnelForm, setPersonnelForm] = useState({ first_name: '', last_name: '', phone: '', email: '', salary: '' });
  const [payForm, setPayForm] = useState({ personnel_id: '', amount: '', payment_type: 'maas', payment_date: new Date().toISOString().split('T')[0], bank_id: '' });

  // Detail Expand State
  const [expandedVehicle, setExpandedVehicle] = useState(null);

  // Status Alerts
  const [alert, setAlert] = useState({ type: '', message: '' });

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const formatNumberInput = (val) => {
    if (!val) return '';
    const num = String(val).replace(/\D/g, '');
    return num ? parseInt(num).toLocaleString('tr-TR') : '';
  };
  
  const parseNumberInput = (val) => {
    if (!val) return 0;
    const num = String(val).replace(/\D/g, '');
    return num ? parseInt(num) : 0;
  };

  const uploadVehicleImages = async (files, tenantId) => {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('image', file);
      formData.append('tenant_id', tenantId);

      try {
        const response = await fetch('https://ilan.galerim.app/upload.php', {
          method: 'POST',
          body: formData
        });
        const resData = await response.json();
        if (resData && resData.url) {
          urls.push(resData.url);
        } else {
          console.error('Self-hosted upload error:', resData.error);
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          urls.push(base64);
        }
      } catch (err) {
        console.error('Self-hosted upload network error:', err);
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        urls.push(base64);
      }
    }
    return urls;
  };


  // --- Subdomain & Mode Check ---
  useEffect(() => {
    const host = window.location.hostname;
    const parts = host.split('.');
    
    // Check if query parameter "tenant" or "slug" exists (for testing on localhost e.g. localhost:5173?tenant=bulutgrup)
    const urlParams = new URLSearchParams(window.location.search);
    const querySlug = urlParams.get('tenant') || urlParams.get('slug');

    // Parse pathname (e.g. /bulutgrup)
    const pathSlug = window.location.pathname.replace(/^\/|\/$/g, '').trim();

    const isLocalhost = host === 'localhost' || host === '127.0.0.1';
    const modeParam = urlParams.get('mode');
    
    let isPortalMode = false;
    if (isLocalhost) {
      // Default to admin/tenant panel on localhost unless user specifies ilan mode or requests a tenant showcase
      if (modeParam === 'ilan' || modeParam === 'catalog' || pathSlug === 'ilan' || querySlug || (pathSlug && pathSlug !== 'admin' && pathSlug !== 'index.html')) {
        isPortalMode = false;
      } else {
        isPortalMode = true;
      }
    } else {
      isPortalMode = (parts[0] === 'gm');
    }

    if (isPortalMode) {
      // Gallery Admin & Super Admin panel
      setAppMode('portal');
      const sessionUser = sessionStorage.getItem('gm_user');
      if (sessionUser) {
        const u = JSON.parse(sessionUser);
        setUser(u);
        if (u.role === 'tenant') {
          loadTenantContext(u.tenantId);
        }
      } else {
        setIsLoading(false);
      }
    } else {
      // We are in Catalog/Showcase mode
      setAppMode('catalog');
      setCatalogSlug('ilan'); // Always use the unified portal design!

      // Determine if a specific gallery showcase is requested
      const cleanPath = (pathSlug && pathSlug !== 'ilan' && pathSlug !== 'index.html') ? pathSlug : null;
      const targetShowcase = cleanPath || querySlug;

      if (targetShowcase) {
        setPortalSelectedGallerySlug(targetShowcase);
      } else {
        // Fallback for subdomains if they type e.g. bulutgrup.galerim.app
        if (parts.length > 2 && parts[0] !== 'ilan' && parts[0] !== 'gm' && parts[0] !== 'www') {
          setPortalSelectedGallerySlug(parts[0]);
        } else {
          setPortalSelectedGallerySlug(null);
        }
      }
    }
  }, []);

  // --- Load Public Catalog ---
  useEffect(() => {
    if (appMode !== 'catalog' || !catalogSlug) return;
    loadCatalogData();
  }, [appMode, catalogSlug]);

  async function loadCatalogData() {
    setIsLoading(true);
    try {
      if (catalogSlug === 'ilan') {
        // Platform Portal Mode
        setCatalogTenant({ id: 'ilan-id', name: 'Oto Vitrin', slug: 'ilan', owner_phone: '085 888 7143', owner_email: 'admin@galerim.app' });
        
        // Fetch all tenants to populate galleries filter and features
        const { data: tData } = await supabase
          .from('tenants')
          .select('*');
        const tenantsList = tData || [];
        setTenants(tenantsList);

        // Verify that target showcase gallery exists
        if (portalSelectedGallerySlug) {
          const exists = tenantsList.some(t => t.slug === portalSelectedGallerySlug);
          if (!exists) {
            console.warn('Showcase gallery not found, resetting to main portal');
            setPortalSelectedGallerySlug(null);
          }
        }

        // Fetch all vehicles with tenant relationship
        const { data: vData } = await supabase
          .from('vehicles')
          .select('*, tenants(id, name, slug, owner_phone, owner_email)')
          .eq('status', 'stokta');
        setVehicles(vData || []);

        const { data: sData } = await supabase.from('sales').select('tenant_id');
        setSales(sData || []);
      } else {
        // Single Gallery Mode
        const { data: tenantData, error: tErr } = await supabase
          .from('tenants')
          .select('*')
          .eq('slug', catalogSlug)
          .single();
        
        if (tErr || !tenantData) {
          console.error('Tenant not found for catalog');
          setCatalogTenant(null);
          return;
        }
        
        setCatalogTenant(tenantData);

        // Fetch stock vehicles
        const { data: vData } = await supabase
          .from('vehicles')
          .select('brand, model, year, plate, km, fuel_type, gear_type, body_type, sell_price, tramer_amount, is_heavy_damage, expertise, description, image_url')
          .eq('tenant_id', tenantData.id)
          .eq('status', 'stokta');
        
        setVehicles(vData || []);

        const { data: sData } = await supabase.from('sales').select('tenant_id').eq('tenant_id', tenantData.id);
        setSales(sData || []);
      }
    } catch (err) {
      console.error('Catalog load error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // --- Fetch System-Wide Data (for Super Admin) ---
  const fetchSuperadminData = async () => {
    setIsLoading(true);
    try {
      const { data: tData } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
      setTenants(tData || []);

      const { data: vData } = await supabase.from('vehicles').select('*');
      setVehicles(vData || []);

      const { data: payData } = await supabase.from('iyzico_payments').select('*').order('created_at', { ascending: false });
      setPayments(payData || []);

      const { data: sData } = await supabase.from('sales').select('*');
      setSales(sData || []);

      const { data: notifData } = await supabase.from('admin_notifications').select('*').order('created_at', { ascending: false });
      setNotifications(notifData || []);
    } catch (err) {
      console.error('Superadmin data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fetch Tenant Context (for Tenant Admin) ---
  const loadTenantContext = async (tenantId) => {
    setIsLoading(true);
    setVehicles([]);
    setSales([]);
    setExpenses([]);
    setBanks([]);
    setCustomers([]);
    setPersonnel([]);
    try {
      // 1. Get Tenant details & check trial status
      const { data: tenantData, error: tErr } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single();

      if (tErr) throw tErr;
      setCurrentTenant(tenantData);
      setSettingsForm({
        name: tenantData.name || '',
        company_title: tenantData.company_title || '',
        owner_name: tenantData.owner_name || '',
        owner_phone: tenantData.owner_phone || '',
        owner_email: tenantData.owner_email || '',
        tax_office: tenantData.tax_office || '',
        tax_number: tenantData.tax_number || '',
        address: tenantData.address || '',
        password: tenantData.password || ''
      });

      // Check Trial / Subscription active
      const ends = new Date(tenantData.subscription_ends_at || tenantData.trial_ends_at);
      if (ends < new Date()) {
        setTrialExpired(true);
      } else {
        setTrialExpired(false);
      }

      // 2. Load dashboard & modules data in PARALLEL
      const [vRes, cRes, bRes, dRes, pRes, expRes, sRes, msgRes] = await Promise.all([
        supabase.from('vehicles').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false }),
        supabase.from('customers').select('*').eq('tenant_id', tenantId).order('name_surname'),
        supabase.from('banks').select('*').eq('tenant_id', tenantId).order('bank_name'),
        supabase.from('bank_documents').select('*').eq('tenant_id', tenantId).order('due_date'),
        supabase.from('personnel').select('*').eq('tenant_id', tenantId).order('first_name'),
        supabase.from('expenses').select('*').eq('tenant_id', tenantId),
        supabase.from('sales').select('*, vehicles(brand, model, plate)').eq('tenant_id', tenantId),
        supabase.from('messages').select('*, vehicles(brand, model, plate)').eq('tenant_id', tenantId).order('created_at', { ascending: false })
      ]);

      setVehicles(vRes.data || []);
      setCustomers(cRes.data || []);
      setBanks(bRes.data || []);
      setDocuments(dRes.data || []);
      setPersonnel(pRes.data || []);
      setExpenses(expRes.data || []);
      setSales(sRes.data || []);
      setMessages(msgRes.data || []);
    } catch (err) {
      console.error('Tenant data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIN / LOGOUT ---
  const handlePortalLogin = async (e) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();
    setAuthError('');
    setIsLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      // 2. If Auth succeeds
      if (!authErr && authData?.user) {
        if (email === 'admin@bulutgrup.tr' || email === 'root@bulutgrup.tr') {
          const u = { email, role: 'superadmin' };
          setUser(u);
          sessionStorage.setItem('gm_user', JSON.stringify(u));
          fetchSuperadminData();
          return;
        } else {
          // Tenant kaydını bul — 3 farklı yöntemle dene
          let tenantData = null;

          // Yöntem 1: owner_email kolonu
          const { data: t1 } = await supabase
            .from('tenants').select('*')
            .eq('owner_email', email).maybeSingle();
          if (t1) tenantData = t1;

          // Yöntem 2: email kolonu (bazı kayıtlar farklı sütun kullanıyor olabilir)
          if (!tenantData) {
            const { data: t2 } = await supabase
              .from('tenants').select('*')
              .eq('email', email).maybeSingle();
            if (t2) tenantData = t2;
          }

          // Yöntem 3: Supabase Auth user metadata'dan tenantId
          if (!tenantData && authData?.user?.user_metadata?.tenant_id) {
            const { data: t3 } = await supabase
              .from('tenants').select('*')
              .eq('id', authData.user.user_metadata.tenant_id).maybeSingle();
            if (t3) tenantData = t3;
          }

          // Yöntem 4: e-postanın @ öncesi slug olarak dene
          if (!tenantData) {
            const slugFromEmail = email.split('@')[0].replace(/[^a-z0-9-]/g, '');
            const { data: t4 } = await supabase
              .from('tenants').select('*')
              .eq('slug', slugFromEmail).maybeSingle();
            if (t4) tenantData = t4;
          }

          if (tenantData) {
            const u = { email, role: 'tenant', tenantId: tenantData.id };
            setUser(u);
            sessionStorage.setItem('gm_user', JSON.stringify(u));
            loadTenantContext(tenantData.id);
            return;
          } else {
            setAuthError(
              `Giriş başarılı ancak "${email}" e-postasına bağlı bir galeri kaydı bulunamadı. ` +
              `Hesabınız henüz aktif olmayabilir. Destek için admin@galerim.app adresine yazın.`
            );
            setIsLoading(false);
            return;
          }
        }
      }

      // 3. Fallback check for Super Admin or local testing if Auth is disabled or not configured yet
      if ((email === 'admin@bulutgrup.tr' || email === 'root@bulutgrup.tr' || email === 'fatih@bulutgrup.tr') && password === '123456') {
        if (email === 'fatih@bulutgrup.tr') {
          const { data: tenantData } = await supabase.from('tenants').select('*').eq('owner_email', email).maybeSingle();
          if (tenantData) {
            const u = { email, role: 'tenant', tenantId: tenantData.id };
            setUser(u);
            sessionStorage.setItem('gm_user', JSON.stringify(u));
            loadTenantContext(tenantData.id);
            return;
          }
        } else {
          const u = { email, role: 'superadmin' };
          setUser(u);
          sessionStorage.setItem('gm_user', JSON.stringify(u));
          fetchSuperadminData();
          return;
        }
      }

      setAuthError('Hatalı giriş! E-posta veya şifre eşleşmedi.');
      setIsLoading(false);
    } catch (err) {
      setAuthError('Giriş yapılamadı: ' + err.message);
      setIsLoading(false);
    }
  };


  const handlePortalLogout = () => {
    setUser(null);
    setCurrentTenant(null);
    setTrialExpired(false);
    sessionStorage.removeItem('gm_user');
  };

  // --- SaaS Checkout Simulation ---
  const handlePayTrialSubscription = async (plan) => {
    const isYearly = plan === 'yearly';
    const amount = isYearly ? 48000 : 6490;
    const ends = new Date();
    ends.setDate(ends.getDate() + (isYearly ? 365 : 30));

    try {
      // 1. Update tenant sub expiry
      const { error: tErr } = await supabase
        .from('tenants')
        .update({
          subscription_ends_at: ends.toISOString(),
          status: 'active'
        })
        .eq('id', currentTenant.id);

      if (tErr) throw tErr;

      // 2. Insert iyzico mock payment
      const { error: payErr } = await supabase
        .from('iyzico_payments')
        .insert([{
          tenant_id: currentTenant.id,
          amount,
          status: 'success',
          iyzico_payment_id: 'MOCK-PAY-' + Math.floor(Math.random()*100000),
          card_association: 'Visa'
        }]);

      if (payErr) throw payErr;

      // Refresh
      triggerAlert('success', `Aboneliğiniz başarıyla etkinleştirildi! (${plan === 'yearly' ? 'Yıllık' : 'Aylık'} Paket)`);
      loadTenantContext(currentTenant.id);
    } catch (err) {
      triggerAlert('error', 'Ödeme tamamlanamadı: ' + err.message);
    }
  };

  // --- SUPERADMIN: Hediye Gün Ekleme ---
  const handleGiftDays = async (tenantId, days) => {
    const t = tenants.find(ten => ten.id === tenantId);
    if (!t) return;

    let ends = new Date(t.subscription_ends_at || t.trial_ends_at || new Date());
    if (ends < new Date()) {
      ends = new Date();
    }
    ends.setDate(ends.getDate() + days);

    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          subscription_ends_at: ends.toISOString(),
          status: 'active'
        })
        .eq('id', tenantId);

      if (error) throw error;

      triggerAlert('success', `${t.name} işletmesine +${days} gün hediye edildi!`);
      fetchSuperadminData();
      if (superadminSelectedTenant && superadminSelectedTenant.id === tenantId) {
        setSuperadminSelectedTenant({ ...superadminSelectedTenant, subscription_ends_at: ends.toISOString(), status: 'active' });
      }
    } catch (err) {
      triggerAlert('error', 'Hediye gün eklenemedi: ' + err.message);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    const finalBrand = customBrandMode ? customBrandInput.trim() : selectedBrand;
    const modelBase = customModelMode ? customModelInput.trim() : selectedModel;
    const versionBase = customVersionMode ? customVersionInput.trim() : selectedVersion;
    const finalModel = modelBase + (versionBase ? ' ' + versionBase : '');

    if (!finalBrand || !finalModel || !aracForm.buy_price) {
      triggerAlert('error', 'Marka, model ve alış fiyatı zorunludur!');
      return;
    }
    setIsSavingVehicle(true);
    try {
      let imageUrls = [];
      const filesToUpload = aracFiles.filter(Boolean);
      if (filesToUpload.length > 0) {
        imageUrls = await uploadVehicleImages(filesToUpload, currentTenant.id);
      }

      const { error } = await supabase
        .from('vehicles')
        .insert([{
          ...aracForm,
          brand: finalBrand,
          model: finalModel,
          image_url: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
          tenant_id: currentTenant.id,
          expertise: expertise
        }]);

      if (error) throw error;
      
      triggerAlert('success', 'Araç stoka kaydedildi!');
      setAracFiles(Array(10).fill(null));
      setAracForm({
        brand: '', model: '', plate: '', km: '', year: new Date().getFullYear(),
        fuel_type: 'Benzin', gear_type: 'Otomatik', body_type: 'Sedan', buy_price: '', sell_price: '',
        seller_name: '', seller_phone: '', buy_date: new Date().toISOString().split('T')[0],
        has_kasko: false, has_sigorta: false, has_warranty: false, has_spare_key: false,
        has_ruhsat: false, has_invoice: false, tramer_amount: 0, is_heavy_damage: false,
        is_consignment: false, description: ''
      });
      setSelectedBrand('');
      setSelectedModel('');
      setSelectedVersion('');
      setCustomBrandInput('');
      setCustomModelInput('');
      setCustomVersionInput('');
      setCustomBrandMode(false);
      setCustomModelMode(false);
      setCustomVersionMode(false);
      setExpertise({
        sag_on_camurluk: 'orijinal', sol_on_camurluk: 'orijinal',
        sag_on_kapi: 'orijinal', sol_on_kapi: 'orijinal',
        sag_arka_kapi: 'orijinal', sol_arka_kapi: 'orijinal',
        sag_arka_camurluk: 'orijinal', sol_arka_camurluk: 'orijinal',
        motor_kaputu: 'orijinal', tavan: 'orijinal', bagaj_kapagi: 'orijinal'
      });
      loadTenantContext(currentTenant.id);
      setActiveTab('araclar');
    } catch (err) {
      triggerAlert('error', 'Hata: ' + err.message);
    } finally {
      setIsSavingVehicle(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!masrafForm.amount || !masrafForm.bank_id) {
      triggerAlert('error', 'Tutar ve ödeme hesabı zorunludur!');
      return;
    }
    try {
      const { error } = await supabase
        .from('expenses')
        .insert([{
          ...masrafForm,
          vehicle_id: masrafForm.vehicle_id || null,
          tenant_id: currentTenant.id,
          amount: parseFloat(masrafForm.amount)
        }]);

      if (error) throw error;
      triggerAlert('success', 'Gider başarıyla kaydedildi!');
      setMasrafForm({
        vehicle_id: '', expense_type: 'yakit', amount: '',
        expense_date: new Date().toISOString().split('T')[0], bank_id: '', description: ''
      });
      loadTenantContext(currentTenant.id);
      setActiveTab('araclar');
    } catch (err) {
      triggerAlert('error', 'Hata: ' + err.message);
    }
  };

  const handleSellVehicle = async (e) => {
    e.preventDefault();
    if (!satisForm.vehicle_id || !satisForm.sell_price || !satisForm.bank_id) {
      triggerAlert('error', 'Satış bilgileri zorunludur!');
      return;
    }
    try {
      const { error } = await supabase
        .from('sales')
        .insert([{
          ...satisForm,
          tenant_id: currentTenant.id,
          sell_price: parseFloat(satisForm.sell_price),
          notary_expense: parseFloat(satisForm.notary_expense || 0)
        }]);

      if (error) throw error;
      triggerAlert('success', 'Satış kaydedildi ve kar hesaplandı!');
      setSatisForm({
        vehicle_id: '', customer_id: '', sell_price: '', notary_expense: 0,
        sale_date: new Date().toISOString().split('T')[0], bank_id: ''
      });
      loadTenantContext(currentTenant.id);
      setActiveTab('araclar');
    } catch (err) {
      triggerAlert('error', 'Hata: ' + err.message);
    }
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    if (!bankForm.bank_name || !bankForm.account_name) {
      triggerAlert('error', 'Banka bilgileri eksik!');
      return;
    }
    try {
      const { error } = await supabase
        .from('banks')
        .insert([{
          ...bankForm,
          tenant_id: currentTenant.id,
          balance: parseFloat(bankForm.balance || 0)
        }]);

      if (error) throw error;
      triggerAlert('success', 'Hesap tanımlandı!');
      setBankForm({ bank_name: '', account_name: '', iban: '', balance: '' });
      loadTenantContext(currentTenant.id);
    } catch (err) {
      triggerAlert('error', 'Hata: ' + err.message);
    }
  };

  const handleAddDoc = async (e) => {
    e.preventDefault();
    if (!docForm.amount || !docForm.due_date || !docForm.debtor) {
      triggerAlert('error', 'Belge bilgileri eksik!');
      return;
    }
    try {
      const { error } = await supabase
        .from('bank_documents')
        .insert([{
          ...docForm,
          tenant_id: currentTenant.id,
          amount: parseFloat(docForm.amount)
        }]);

      if (error) throw error;
      triggerAlert('success', 'Belge portföye eklendi!');
      setDocForm({ type: 'cek', amount: '', due_date: '', debtor: '', status: 'bekliyor' });
      loadTenantContext(currentTenant.id);
    } catch (err) {
      triggerAlert('error', 'Hata: ' + err.message);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!customerForm.name_surname || !customerForm.phone) {
      triggerAlert('error', 'İsim ve telefon zorunludur!');
      return;
    }
    try {
      const { error } = await supabase
        .from('customers')
        .insert([{
          ...customerForm,
          tenant_id: currentTenant.id
        }]);

      if (error) throw error;
      triggerAlert('success', 'Müşteri kaydedildi!');
      setCustomerForm({ name_surname: '', phone: '', email: '', notes: '' });
      loadTenantContext(currentTenant.id);
    } catch (err) {
      triggerAlert('error', 'Hata: ' + err.message);
    }
  };

  const handleAddPersonnel = async (e) => {
    e.preventDefault();
    if (!personnelForm.first_name || !personnelForm.last_name || !personnelForm.phone) {
      triggerAlert('error', 'Personel bilgileri zorunludur!');
      return;
    }
    try {
      const { error } = await supabase
        .from('personnel')
        .insert([{
          ...personnelForm,
          tenant_id: currentTenant.id,
          salary: parseFloat(personnelForm.salary || 0)
        }]);

      if (error) throw error;
      triggerAlert('success', 'Personel kaydedildi!');
      setPersonnelForm({ first_name: '', last_name: '', phone: '', email: '', salary: '' });
      loadTenantContext(currentTenant.id);
    } catch (err) {
      triggerAlert('error', 'Hata: ' + err.message);
    }
  };

  const handlePayPersonnel = async (e) => {
    e.preventDefault();
    if (!payForm.personnel_id || !payForm.amount || !payForm.bank_id) {
      triggerAlert('error', 'Ödeme tutarı ve banka seçimi zorunludur!');
      return;
    }
    try {
      const { error } = await supabase
        .from('personnel_payments')
        .insert([{
          ...payForm,
          tenant_id: currentTenant.id,
          amount: parseFloat(payForm.amount)
        }]);

      if (error) throw error;
      triggerAlert('success', 'Maaş ödemesi yapıldı ve bakiyeden düşüldü!');
      setPayForm({ personnel_id: '', amount: '', payment_type: 'maas', payment_date: new Date().toISOString().split('T')[0], bank_id: '' });
      loadTenantContext(currentTenant.id);
    } catch (err) {
      triggerAlert('error', 'Hata: ' + err.message);
    }
  };

  // --- ANALYTICS & MATHS ---
  const stockVal = vehicles.filter(v => v.status === 'stokta').reduce((acc, curr) => {
    const vehicleExpenses = expenses.filter(e => e.vehicle_id === curr.id).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    return acc + parseFloat(curr.buy_price || 0) + vehicleExpenses;
  }, 0);
  const stockTargetVal = vehicles.filter(v => v.status === 'stokta').reduce((acc, curr) => acc + parseFloat(curr.sell_price || 0), 0);
  const stockTargetProfit = stockTargetVal - stockVal;
  const totalCash = banks.reduce((acc, curr) => acc + parseFloat(curr.balance || 0), 0);
  const totalCapital = totalCash + stockVal;
  const salesCiro = sales.reduce((acc, curr) => acc + parseFloat(curr.sell_price || 0), 0);
  const netProfit = sales.reduce((acc, curr) => acc + parseFloat(curr.net_profit || 0), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  // Period calculations
  const thisPeriodSales = sales.filter(s => s.sale_date && s.sale_date.startsWith(selectedPeriod));
  const thisPeriodSalesCiro = thisPeriodSales.reduce((acc, curr) => acc + parseFloat(curr.sell_price || 0), 0);
  const thisPeriodNetProfit = thisPeriodSales.reduce((acc, curr) => acc + parseFloat(curr.net_profit || 0), 0);

  const getMonthsList = () => {
    const months = [];
    const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    let currentYear = 2026;
    let currentMonthIndex = 6; // July
    
    const period = (activeTab === 'raporlar' || activeTab === 'muhasebe') ? selectedPeriod : '2026-07';
    if (period) {
      const parts = period.split('-');
      currentYear = parseInt(parts[0]);
      currentMonthIndex = parseInt(parts[1]) - 1;
    }

    for (let i = 5; i >= 0; i--) {
      let mIdx = currentMonthIndex - i;
      let y = currentYear;
      if (mIdx < 0) {
        mIdx += 12;
        y -= 1;
      }
      const label = `${monthNames[mIdx]} ${y}`;
      const periodKey = `${y}-${String(mIdx + 1).padStart(2, '0')}`;
      
      const periodSales = sales.filter(s => s.sale_date && s.sale_date.startsWith(periodKey));
      const ciro = periodSales.reduce((acc, curr) => acc + parseFloat(curr.sell_price || 0), 0);
      
      months.push({ label, periodKey, ciro });
    }
    return months;
  };

  const getRecentActivities = () => {
    const activities = [];
    
    vehicles.forEach(v => {
      if (v.buy_date) {
        activities.push({
          date: new Date(v.buy_date),
          text: `${v.brand} ${v.model} stoğa alındı`,
          val: `${new Date(v.buy_date).toLocaleDateString('tr-TR')} · Satıcı: ${v.seller_name || 'Bilinmiyor'}`,
          color: '#E5484D'
        });
      }
    });

    sales.forEach(s => {
      if (s.sale_date) {
        const vObj = vehicles.find(item => item.id === s.vehicle_id);
        activities.push({
          date: new Date(s.sale_date),
          text: `${vObj ? `${vObj.brand} ${vObj.model}` : 'Araç'} satıldı`,
          val: `${new Date(s.sale_date).toLocaleDateString('tr-TR')} · Tutar: ${formatCur(s.sell_price)}`,
          color: '#1F8A5B'
        });
      }
    });

    expenses.forEach(e => {
      const v = vehicles.find(item => item.id === e.vehicle_id);
      const date = e.created_at ? new Date(e.created_at) : new Date();
      activities.push({
        date: date,
        text: `${v ? `${v.brand} ${v.model}` : 'Araç'} için masraf eklendi`,
        val: `${date.toLocaleDateString('tr-TR')} · Tutar: ${formatCur(e.amount)} (${e.expense_type})`,
        color: '#B26A00'
      });
    });

    activities.sort((a, b) => b.date - a.date);
    return activities.slice(0, 5);
  };

  const getPartColor = (partVal) => {
    if (partVal === 'orijinal') return { bg: '#e8f5ec', color: '#16a34a', bc: '#22c55e' };
    if (partVal === 'lokal') return { bg: '#fef3c7', color: '#d97706', bc: '#f59e0b' };
    if (partVal === 'boyali') return { bg: '#ffedd5', color: '#ea580c', bc: '#f97316' };
    return { bg: '#fee2e2', color: '#991b1b', bc: '#ef4444' };
  };

  const getRemainingDays = (tenant) => {
    if (!tenant) return 0;
    const ends = new Date(tenant.subscription_ends_at || tenant.trial_ends_at);
    const diff = ends.getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };



  // ============================================================
  // VIEW: PUBLIC CATALOG
  // ============================================================
  if (appMode === 'catalog') {
    if (!catalogTenant) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#faf8f5', flexDirection: 'column' }}>
          <p style={{ fontStyle: 'italic', fontWeight: 800 }}>Böyle bir galeri bulunamadı.</p>
        </div>
      );
    }

    if (catalogSlug === 'ilan') {
      // -------------------------------------------------------------
      // PLATFORM WIDE MARKETPLACE: http://ilan.galerim.app
      // -------------------------------------------------------------
      const availableBrands = [...new Set(vehicles.map(v => v.brand))].filter(Boolean).sort();
      const gMap = Object.fromEntries(tenants.map(t => [t.id, t]));
      const activeShowcaseGallery = tenants.find(t => t.slug === portalSelectedGallerySlug);

      let portalFiltered = vehicles.filter(c => {
        if (c.status !== 'stokta') return false;

        // Showcase Lock (e.g. ilan.galerim.app/bulutgrup)
        if (portalSelectedGallerySlug) {
          const targetGallery = tenants.find(t => t.slug === portalSelectedGallerySlug);
          if (targetGallery && c.tenant_id !== targetGallery.id) return false;
        }

        // Category Tab Filter (Otomobil, SUV & Pickup, Motosiklet, Ticari)
        if (portalCategory === 'SUV & Pickup') {
          if (c.body_type !== 'SUV' && c.body_type !== 'Arazi') return false;
        } else if (portalCategory === 'Ticari') {
          if (c.body_type !== 'Panelvan' && c.body_type !== 'Minivan') return false;
        } else if (portalCategory === 'Motosiklet') {
          if (c.body_type !== 'Motosiklet') return false;
        } else {
          // 'Otomobil' is default
          if (c.body_type === 'SUV' || c.body_type === 'Arazi' || c.body_type === 'Panelvan' || c.body_type === 'Minivan' || c.body_type === 'Motosiklet') return false;
        }

        if (portalSelectedGallery && c.tenant_id !== portalSelectedGallery) return false;
        if (portalSelectedBrands.length && !portalSelectedBrands.includes(c.brand)) return false;
        
        // Fuel Type Matching
        if (portalSelectedFuels.length) {
          const matched = portalSelectedFuels.some(fuel => {
            if (fuel === 'Benzinli') return c.fuel_type === 'Benzin' || c.fuel_type === 'Benzinli';
            if (fuel === 'Benzin+LPG') return c.fuel_type === 'LPG' || c.fuel_type === 'Benzin+LPG' || c.fuel_type === 'LPG+Benzin';
            if (fuel === 'Dizel') return c.fuel_type === 'Dizel';
            if (fuel === 'Hibrit') return c.fuel_type === 'Hibrit';
            if (fuel === 'Elektrikli') return c.fuel_type === 'Elektrik' || c.fuel_type === 'Elektrikli';
            return c.fuel_type === fuel;
          });
          if (!matched) return false;
        }

        // Body Type Matching
        if (portalSelectedBodyTypes.length && !portalSelectedBodyTypes.includes(c.body_type)) return false;

        // Heavy Damage Matching
        if (portalHeavyDamage === 'var') {
          if (!c.is_heavy_damage) return false;
        } else if (portalHeavyDamage === 'yok') {
          if (c.is_heavy_damage) return false;
        }

        if (portalSelectedGears.length && !portalSelectedGears.includes(c.gear_type)) return false;
        if (portalPriceMin && parseFloat(c.sell_price) < parseFloat(portalPriceMin)) return false;
        if (portalPriceMax && parseFloat(c.sell_price) > parseFloat(portalPriceMax)) return false;
        if (portalYearMin && parseInt(c.year) < parseInt(portalYearMin)) return false;
        if (portalYearMax && parseInt(c.year) > parseInt(portalYearMax)) return false;
        if (catalogFilterQuery) {
          const q = catalogFilterQuery.toLowerCase().trim();
          const brandMatch = c.brand ? c.brand.toLowerCase().includes(q) : false;
          const modelMatch = c.model ? c.model.toLowerCase().includes(q) : false;
          const galleryName = gMap[c.tenant_id]?.name || c.tenants?.name || '';
          const galleryMatch = galleryName.toLowerCase().includes(q);
          if (!brandMatch && !modelMatch && !galleryMatch) return false;
        }
        return true;
      });

      const sorters = {
        featured: (a, b) => (b.is_consignment ? -1 : 1) || a.id.localeCompare(b.id),
        priceAsc: (a, b) => parseFloat(a.sell_price) - parseFloat(b.sell_price),
        priceDesc: (a, b) => parseFloat(b.sell_price) - parseFloat(a.sell_price),
        yearDesc: (a, b) => parseInt(b.year) - parseInt(a.year),
        kmAsc: (a, b) => parseInt(a.km) - parseInt(b.km),
      };
      portalFiltered = [...portalFiltered].sort(sorters[portalSort]);

      const handleSendPortalMessage = async (vehicle) => {
        if (!portalMessageForm.name.trim() || !portalMessageForm.phone.trim() || !portalMessageForm.text.trim()) {
          alert('Lütfen tüm alanları doldurunuz.');
          return;
        }
        setPortalMessageSending(true);
        try {
          const { error } = await supabase.from('messages').insert([{
            tenant_id: vehicle.tenant_id,
            vehicle_id: vehicle.id,
            sender_name: portalMessageForm.name,
            sender_phone: portalMessageForm.phone,
            message_text: portalMessageForm.text,
            is_read: false
          }]);
          if (error) throw error;
          setPortalMessageSent(true);
          setPortalMessageForm({ name: '', phone: '', text: '' });
          setTimeout(() => { setPortalMessageSent(false); setPortalMessageModalOpen(false); }, 3000);
        } catch (err) {
          console.error(err);
          alert('Mesaj gönderilirken hata oluştu: ' + err.message);
        } finally {
          setPortalMessageSending(false);
        }
      };

      // If Detail View is Active
      if (selectedAdId) {
        const v = vehicles.find(item => item.id === selectedAdId);
        if (v) {
          const gallery = gMap[v.tenant_id] || v.tenants || { id: v.tenant_id, name: 'Seçkin Galeri', city: 'İstanbul', owner_phone: '0532 000 00 00', owner_email: 'info@galeri.com' };
          const galleryVehiclesCount = vehicles.filter(c => c.tenant_id === gallery.id && c.status === 'stokta').length;
          const gallerySalesCount = sales.filter(s => s.tenant_id === gallery.id).length;
          const fav = !!portalFavs[v.id];
          const tramerText = v.tramer_amount ? formatCur(v.tramer_amount) : 'Tramersiz';
          
          const specs = [
            { k: 'Marka', v: v.brand },
            { k: 'Model', v: v.model },
            { k: 'Yıl', v: v.year },
            { k: 'Kilometre', v: v.km.toLocaleString('tr-TR') + ' km' },
            { k: 'Yakıt Tipi', v: v.fuel_type },
            { k: 'Vites Tipi', v: v.gear_type },
            { k: 'Kasa Tipi', v: v.body_type || 'Sedan' },
            { k: 'Renk', v: v.color || 'Belirtilmemiş' },
            { k: 'Tramer Kaydı', v: tramerText },
          ];

          const parts = [
            { key: 'sag_on_camurluk', label: 'Sağ Ön Çamurluk' },
            { key: 'sol_on_camurluk', label: 'Sol Ön Çamurluk' },
            { key: 'sag_on_kapi', label: 'Sağ Ön Kapı' },
            { key: 'sol_on_kapi', label: 'Sol Ön Kapı' },
            { key: 'sag_arka_kapi', label: 'Sağ Arka Kapı' },
            { key: 'sol_arka_kapi', label: 'Sol Arka Kapı' },
            { key: 'sag_arka_camurluk', label: 'Sağ Arka Çamurluk' },
            { key: 'sol_arka_camurluk', label: 'Sol Arka Çamurluk' },
            { key: 'motor_kaputu', label: 'Motor Kaputu' },
            { key: 'tavan', label: 'Tavan' },
            { key: 'bagaj_kapagi', label: 'Bagaj Kapağı' }
          ];

          const galleryInitials = gallery.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

          // Get other listings of the same gallery
          const otherListings = vehicles.filter(item => item.tenant_id === v.tenant_id && item.id !== v.id && item.status === 'stokta').slice(0, 3);

          return (
            <div style={{ minHeight: '100vh', background: '#F4F5F7', color: '#101828', fontFamily: "'Manrope', sans-serif" }}>
              <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
              <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
              
              <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E7E9EF' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', height: '68px', display: 'flex', alignItems: 'center', gap: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { setSelectedAdId(null); setPortalSelectedGallery(null); }}>
                    <img src="/logo.png" alt="Galerim Logo" style={{ height: '38px', display: 'block' }} />
                  </div>
                  <nav style={{ display: 'flex', gap: '22px', fontSize: '14px', fontWeight: 600, color: '#475467' }}>
                    <span style={{ color: portalCategory === 'Otomobil' ? '#101828' : '#475467', borderBottom: portalCategory === 'Otomobil' ? '2px solid #3538CD' : 'none', padding: '22px 0', cursor: 'pointer' }} onClick={() => { setPortalCategory('Otomobil'); setSelectedAdId(null); }}>Otomobil</span>
                    <span style={{ color: portalCategory === 'SUV & Pickup' ? '#101828' : '#475467', borderBottom: portalCategory === 'SUV & Pickup' ? '2px solid #3538CD' : 'none', padding: '22px 0', cursor: 'pointer' }} onClick={() => { setPortalCategory('SUV & Pickup'); setSelectedAdId(null); }}>SUV &amp; Pickup</span>
                    <span style={{ color: portalCategory === 'Motosiklet' ? '#101828' : '#475467', borderBottom: portalCategory === 'Motosiklet' ? '2px solid #3538CD' : 'none', padding: '22px 0', cursor: 'pointer' }} onClick={() => { setPortalCategory('Motosiklet'); setSelectedAdId(null); }}>Motosiklet</span>
                    <span style={{ color: portalCategory === 'Ticari' ? '#101828' : '#475467', borderBottom: portalCategory === 'Ticari' ? '2px solid #3538CD' : 'none', padding: '22px 0', cursor: 'pointer' }} onClick={() => { setPortalCategory('Ticari'); setSelectedAdId(null); }}>Ticari</span>
                    <span style={{ color: portalCategory === 'Galeriler' ? '#101828' : '#475467', borderBottom: portalCategory === 'Galeriler' ? '2px solid #3538CD' : 'none', padding: '22px 0', cursor: 'pointer' }} onClick={() => { setPortalCategory('Galeriler'); setSelectedAdId(null); }}>Tüm Galeriler</span>
                  </nav>
                  <div style={{ flex: 1 }}></div>
                  <button onClick={() => window.open('http://galerim.app', '_blank')} style={{ height: '40px', padding: '0 18px', border: 'none', borderRadius: '12px', background: '#3538CD', color: '#fff', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}>+ İlan Ver</button>
                </div>
              </header>

              <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 28px 64px' }}>
                <div style={{ fontSize: '12.5px', color: '#98A2B3', fontWeight: 600, marginBottom: '14px' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => setSelectedAdId(null)}>Vasıta</span> · 
                  <span style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedAdId(null)}>Otomobil</span> · 
                  <span style={{ color: '#475467', marginLeft: '4px' }}>{v.brand} {v.model}</span>
                </div>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                  <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '20px', padding: '14px' }}>
                      {(() => {
                        let allImages = [];
                        try {
                          allImages = v.image_url ? JSON.parse(v.image_url) : [];
                          if (!Array.isArray(allImages)) allImages = [v.image_url];
                        } catch (e) {
                          if (v.image_url) allImages = [v.image_url];
                        }
                        
                        const mainImageSrc = allImages[activeImageIdx] || '';
                        
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ position: 'relative', height: '460px', background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              {mainImageSrc ? (
                                <img src={mainImageSrc} alt={v.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span className="material-symbols-outlined" style={{ fontSize: '72px', color: '#94A3B8' }}>directions_car</span>
                              )}
                              {v.is_consignment && (
                                <div style={{ position: 'absolute', top: '14px', left: '14px', background: '#FFB020', color: '#3D2600', fontSize: '11.5px', fontWeight: 800, borderRadius: '999px', padding: '5px 12px' }}>ÖNE ÇIKAN</div>
                              )}
                            </div>
                            
                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                                {allImages.map((imgSrc, imgIdx) => (
                                  <div 
                                    key={imgIdx} 
                                    onClick={() => setActiveImageIdx(imgIdx)}
                                    style={{ 
                                      width: '64px', 
                                      height: '48px', 
                                      borderRadius: '6px', 
                                      overflow: 'hidden', 
                                      cursor: 'pointer', 
                                      border: activeImageIdx === imgIdx ? '2px solid #3538CD' : '1px solid #E7E9EF',
                                      opacity: activeImageIdx === imgIdx ? 1 : 0.6,
                                      flexShrink: 0
                                    }}
                                  >
                                    <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Technical Specifications */}
                    <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '20px', padding: '24px' }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '17px', marginBottom: '16px' }}>Araç Bilgileri</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {specs.map((sp, idx) => (
                          <div key={idx} style={{ background: '#F7F8FA', borderRadius: '12px', padding: '12px 14px' }}>
                            <div style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{sp.k}</div>
                            <div style={{ fontSize: '14px', fontWeight: 800, marginTop: '3px' }}>{sp.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Paint and Expertise Report */}
                    <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '20px', padding: '24px' }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '17px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#3538CD' }}>analytics</span>
                        Boya &amp; Değişen Ekspertiz Raporu
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        {parts.map((p, idx) => {
                          const state = v.expertise?.[p.key] || 'orijinal';
                          const colorObj = getPartColor(state);
                          return (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', background: colorObj.bg, border: `1px solid ${colorObj.bc}15` }}>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{p.label}</span>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: colorObj.color, textTransform: 'uppercase' }}>{state}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Description */}
                    <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '20px', padding: '24px' }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '17px', marginBottom: '12px' }}>Açıklama</div>
                      <div style={{ fontSize: '14px', lineHeight: '1.75', color: '#344054', whiteSpace: 'pre-line' }}>{v.description || 'Bu ilan için herhangi bir açıklama eklenmemiştir.'}</div>
                    </div>

                    {/* Other listings of this gallery */}
                    {otherListings.length > 0 && (
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0 14px' }}>
                          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 700 }}>Bu Galerinin Diğer İlanları</div>
                          <div style={{ height: '1px', flex: 1, background: '#E7E9EF' }}></div>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#3538CD', cursor: 'pointer' }} onClick={() => { setPortalSelectedGallery(v.tenant_id); setSelectedAdId(null); }}>Tümünü gör</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                          {otherListings.map(item => (
                            <div key={item.id} onClick={() => { setSelectedAdId(item.id); setPhoneShown(false); }} style={{ color: '#101828', background: '#fff', border: '1px solid #E7E9EF', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
                              <div style={{ position: 'relative', height: '130px', background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.image_url ? (
                                  <img src={getFirstImageUrl(item.image_url)} alt={item.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <span className="material-symbols-outlined" style={{ color: '#94A3B8' }}>directions_car</span>
                                )}
                              </div>
                              <div style={{ padding: '12px 14px 14px' }}>
                                <div style={{ fontWeight: 800, fontSize: '13.5px' }}>{item.brand} {item.model}</div>
                                <div style={{ fontSize: '12px', color: '#667085', fontWeight: 600, marginTop: '4px' }}>{item.year} · {item.km.toLocaleString('tr-TR')} km</div>
                                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '16px', color: '#3538CD', marginTop: '8px' }}>{formatCur(item.sell_price)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </main>

                  <aside style={{ width: '360px', flexShrink: 0, position: 'sticky', top: '92px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '20px', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                        <h1 style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.25 }}>{v.brand} {v.model}</h1>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setPortalFavs({ ...portalFavs, [v.id]: !fav })} style={{ width: '38px', height: '38px', border: '1px solid #E7E9EF', borderRadius: '12px', background: '#fff', cursor: 'pointer', fontSize: '16px', color: fav ? '#E11D48' : '#98A2B3' }}>
                            {fav ? '♥' : '♡'}
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#667085', fontWeight: 600, marginTop: '6px' }}>{gallery.city || 'İstanbul'} · İlan No: #{v.id.slice(0,7)} · Bugün</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '34px', color: '#3538CD', letterSpacing: '-1px', marginTop: '16px' }}>{formatCur(v.sell_price)}</div>
                      
                      <div style={{ display: 'flex', gap: '14px', marginTop: '14px', padding: '14px 0', borderTop: '1px solid #F0F1F5', borderBottom: '1px solid #F0F1F5' }}>
                        <div style={{ flex: 1, textContent: 'center', textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: '15px' }}>{v.year}</div><div style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 700 }}>Yıl</div></div>
                        <div style={{ width: '1px', background: '#F0F1F5' }}></div>
                        <div style={{ flex: 1, textContent: 'center', textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: '15px' }}>{v.km.toLocaleString('tr-TR')}</div><div style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 700 }}>Km</div></div>
                        <div style={{ width: '1px', background: '#F0F1F5' }}></div>
                        <div style={{ flex: 1, textContent: 'center', textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: '15px' }}>{v.fuel_type}</div><div style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 700 }}>Yakıt</div></div>
                        <div style={{ width: '1px', background: '#F0F1F5' }}></div>
                        <div style={{ flex: 1, textContent: 'center', textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: '15px' }}>{v.gear_type}</div><div style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 700 }}>Vites</div></div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                        <button onClick={() => setPhoneShown(true)} style={{ height: '46px', border: 'none', borderRadius: '13px', background: '#3538CD', color: '#fff', fontWeight: 800, fontSize: '14.5px', cursor: 'pointer' }}>
                          {phoneShown ? gallery.owner_phone : 'Numarayı Göster'}
                        </button>
                        <button onClick={() => setPortalMessageModalOpen(true)} style={{ height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #3538CD', borderRadius: '13px', background: '#EEF0FF', color: '#3538CD', fontWeight: 800, fontSize: '14.5px', cursor: 'pointer' }}>
                          Mesaj Gönder
                        </button>
                      </div>
                    </div>

                    <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '20px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '17px' }}>{galleryInitials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#101828', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{gallery.name}</div>
                          <div style={{ fontSize: '11.5px', color: '#667085', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>📍 {gallery.city || 'İstanbul'}</span>
                            <span style={{ color: '#E2E5EA' }}>·</span>
                            <span>🚗 {galleryVehiclesCount} ilan</span>
                            <span style={{ color: '#E2E5EA' }}>·</span>
                            <span style={{ color: '#B54708', fontWeight: 800 }}>★ {gallerySalesCount}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button onClick={() => {
                        const targetUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                          ? `http://localhost:5173/?tenant=${gallery.slug}`
                          : `https://ilan.galerim.app/?tenant=${gallery.slug}`;
                        window.open(targetUrl, '_blank');
                      }} style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '14px', height: '40px', background: '#fff', border: '1px solid #E0E3EB', borderRadius: '12px', color: '#344054', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
                        Galeri Vitrinini Gör ↗
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
              {portalMessageModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                  <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '28px', border: '1px solid #E7E9EF', boxShadow: '0 20px 48px rgba(0,0,0,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700 }}>Galeriye Mesaj Gönder</div>
                      <button onClick={() => { setPortalMessageModalOpen(false); setPortalMessageSent(false); }} style={{ border: 'none', background: 'none', fontSize: '20px', fontWeight: 600, color: '#98A2B3', cursor: 'pointer' }}>×</button>
                    </div>
                    {portalMessageSent && (
                      <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '20px', margin: '0 0 16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '36px', marginBottom: '8px' }}>✅</div>
                        <div style={{ fontWeight: 800, color: '#065f46', fontSize: '15px' }}>Mesajınız Başarıyla Gönderildi!</div>
                        <div style={{ color: '#047857', fontSize: '12.5px', marginTop: '6px' }}>Galeri en kısa sürede sizinle iletişime geçecektir.</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#344054', marginBottom: '5px' }}>Adınız Soyadınız</label>
                        <input placeholder="Fatih Akyıldız" value={portalMessageForm.name} onChange={(e) => setPortalMessageForm({ ...portalMessageForm, name: e.target.value })} style={{ width: '100%', height: '40px', border: '1px solid #D0D5DD', borderRadius: '10px', padding: '0 12px', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#344054', marginBottom: '5px' }}>Telefon Numaranız</label>
                        <input placeholder="0532 000 00 00" value={portalMessageForm.phone} onChange={(e) => setPortalMessageForm({ ...portalMessageForm, phone: e.target.value })} style={{ width: '100%', height: '40px', border: '1px solid #D0D5DD', borderRadius: '10px', padding: '0 12px', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#344054', marginBottom: '5px' }}>Mesajınız</label>
                        <textarea placeholder={`Merhaba, ${v.brand} ${v.model} ilanınız hakkında bilgi alabilir miyim?`} rows={4} value={portalMessageForm.text} onChange={(e) => setPortalMessageForm({ ...portalMessageForm, text: e.target.value })} style={{ width: '100%', border: '1px solid #D0D5DD', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: "'Manrope', sans-serif" }}></textarea>
                      </div>
                      <button disabled={portalMessageSending} onClick={() => handleSendPortalMessage(v)} style={{ height: '44px', border: 'none', borderRadius: '10px', background: '#3538CD', color: '#fff', fontWeight: 800, fontSize: '14px', cursor: 'pointer', marginTop: '6px' }}>
                        {portalMessageSending ? 'Gönderiliyor...' : 'Mesajı İlet'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }
      }

      // Render Listings Portal (Grid / List)
      return (
        <div style={{ minHeight: '100vh', background: '#F4F5F7', color: '#101828', fontFamily: "'Manrope', sans-serif" }}>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

          <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E7E9EF' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px', height: '68px', display: 'flex', alignItems: 'center', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { setPortalSelectedGallery(null); setSelectedAdId(null); }}>
                <img src="/logo.png" alt="Galerim Logo" style={{ height: '38px', display: 'block' }} />
              </div>
              <nav style={{ display: 'flex', gap: '22px', fontSize: '14px', fontWeight: 600, color: '#475467' }}>
                <span style={{ color: portalCategory === 'Otomobil' ? '#101828' : '#475467', borderBottom: portalCategory === 'Otomobil' ? '2px solid #3538CD' : 'none', padding: '22px 0', cursor: 'pointer' }} onClick={() => { setPortalCategory('Otomobil'); setPortalSelectedGallery(null); }}>Otomobil</span>
                <span style={{ color: portalCategory === 'SUV & Pickup' ? '#101828' : '#475467', borderBottom: portalCategory === 'SUV & Pickup' ? '2px solid #3538CD' : 'none', padding: '22px 0', cursor: 'pointer' }} onClick={() => { setPortalCategory('SUV & Pickup'); setPortalSelectedGallery(null); }}>SUV &amp; Pickup</span>
                <span style={{ color: portalCategory === 'Motosiklet' ? '#101828' : '#475467', borderBottom: portalCategory === 'Motosiklet' ? '2px solid #3538CD' : 'none', padding: '22px 0', cursor: 'pointer' }} onClick={() => { setPortalCategory('Motosiklet'); setPortalSelectedGallery(null); }}>Motosiklet</span>
                <span style={{ color: portalCategory === 'Ticari' ? '#101828' : '#475467', borderBottom: portalCategory === 'Ticari' ? '2px solid #3538CD' : 'none', padding: '22px 0', cursor: 'pointer' }} onClick={() => { setPortalCategory('Ticari'); setPortalSelectedGallery(null); }}>Ticari</span>
              </nav>
              <div style={{ flex: 1 }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input placeholder="Marka, model veya galeri ara" style={{ width: '260px', height: '40px', border: '1px solid #E0E3EB', borderRadius: '12px', padding: '0 14px', fontSize: '13.5px', background: '#F7F8FA', outline: 'none' }} value={catalogFilterQuery} onChange={(e) => setCatalogFilterQuery(e.target.value)} />
                <button onClick={() => window.open('http://galerim.app', '_blank')} style={{ height: '40px', padding: '0 18px', border: 'none', borderRadius: '12px', background: '#3538CD', color: '#fff', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}>+ İlan Ver</button>
              </div>
            </div>
          </header>

          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 28px 64px' }}>
            <div style={{ fontSize: '12.5px', color: '#98A2B3', fontWeight: 600, marginBottom: '6px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => { setPortalSelectedGallerySlug(null); setPortalCategory('Otomobil'); setPortalSelectedGallery(null); window.history.pushState({}, '', '/'); }}>Vasıta</span> · 
              <span style={{ cursor: 'pointer', marginLeft: '4px' }}>{portalCategory}</span>
              {portalSelectedGallerySlug && activeShowcaseGallery && (
                <span style={{ color: '#475467', marginLeft: '4px' }}> · {activeShowcaseGallery.name}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: '32px', fontWeight: 700, letterSpacing: '-1px' }}>
                {activeShowcaseGallery ? `${activeShowcaseGallery.name} İlanları` : `${portalCategory} İlanları`}
              </h1>
              <div style={{ fontSize: '14px', color: '#667085', fontWeight: 600, paddingBottom: '5px' }}>{portalFiltered.length} ilan</div>
              {portalSelectedGallerySlug && (
                <button onClick={() => { setPortalSelectedGallerySlug(null); window.history.pushState({}, '', '/'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #3538CD', background: '#EEF0FF', color: '#3538CD', borderRadius: '999px', padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', marginBottom: '2px' }}>
                  Tüm İlanları Gör <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
                </button>
              )}
              {portalSelectedGallery && !portalSelectedGallerySlug && (
                <button onClick={() => setPortalSelectedGallery(null)} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #3538CD', background: '#EEF0FF', color: '#3538CD', borderRadius: '999px', padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', marginBottom: '2px' }}>
                  {gMap[portalSelectedGallery]?.name || 'Filtrelenmiş Galeri'} <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
                </button>
              )}
              <div style={{ flex: 1 }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {!portalSelectedGallerySlug && (
                  <button 
                    onClick={() => {
                      setPortalCategory('Galeriler');
                      setSelectedAdId(null);
                    }} 
                    style={{ 
                      height: '38px', 
                      padding: '0 14px', 
                      borderRadius: '11px', 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      cursor: 'pointer', 
                      border: '1px solid #E0E3EB', 
                      background: portalCategory === 'Galeriler' ? '#3538CD' : '#fff', 
                      color: portalCategory === 'Galeriler' ? '#fff' : '#344054' 
                    }}
                  >
                    Galeri Listesi
                  </button>
                )}
                <select value={portalSort} onChange={(e) => setPortalSort(e.target.value)} style={{ height: '38px', border: '1px solid #E0E3EB', borderRadius: '11px', background: '#fff', padding: '0 10px', fontSize: '13px', fontWeight: 600, color: '#344054', cursor: 'pointer', outline: 'none' }}>
                  <option value="featured">Öne çıkanlar</option>
                  <option value="priceAsc">Fiyat (artan)</option>
                  <option value="priceDesc">Fiyat (azalan)</option>
                  <option value="yearDesc">Yıl (en yeni)</option>
                  <option value="kmAsc">Kilometre (en düşük)</option>
                </select>
                <div style={{ display: 'flex', background: '#fff', border: '1px solid #E0E3EB', borderRadius: '11px', padding: '3px', gap: '2px' }}>
                  <button onClick={() => setPortalView('grid')} style={{ width: '34px', height: '30px', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: portalView === 'grid' ? '#3538CD' : 'transparent', color: portalView === 'grid' ? '#fff' : '#98A2B3' }} title="Kart görünümü">▦</button>
                  <button onClick={() => setPortalView('list')} style={{ width: '34px', height: '30px', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', background: portalView === 'list' ? '#3538CD' : 'transparent', color: portalView === 'list' ? '#fff' : '#98A2B3' }} title="Liste görünümü">☰</button>
                </div>
              </div>
            </div>

            {/* Featured Galleries or Showcase Gallery Profile Header */}
            {portalSelectedGallerySlug && activeShowcaseGallery ? (
              <div style={{ marginTop: '26px', background: '#fff', border: '1px solid #E7E9EF', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '20px' }}>
                    {(activeShowcaseGallery.name || 'Galeri').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 700 }}>{activeShowcaseGallery.name}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#667085', fontWeight: 600 }}>
                      📍 {activeShowcaseGallery.city || 'İstanbul'} · 📞 {activeShowcaseGallery.owner_phone} · ✉ {activeShowcaseGallery.owner_email}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={() => { setPortalSelectedGallerySlug(null); window.history.pushState({}, '', '/'); }} style={{ height: '38px', padding: '0 16px', border: '1px solid #E0E3EB', borderRadius: '10px', background: '#fff', color: '#344054', fontWeight: 700, fontSize: '12.5px', cursor: 'pointer' }}>
                    Tüm İlanları Gör
                  </button>
                </div>
              </div>
            ) : (
              !portalSelectedGallery && (
                <div style={{ marginTop: '26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '16px', fontWeight: 700 }}>Öne Çıkan Galeriler</div>
                    <div style={{ height: '1px', flex: 1, background: '#E7E9EF' }}></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                    {tenants.filter(g => g.is_featured).slice(0, 4).map(g => {
                      const active = portalSelectedGallery === g.id;
                      const initials = (g.name || 'Galeri').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                      const count = vehicles.filter(c => c.tenant_id === g.id && c.status === 'stokta').length;
                      const salesCount = sales.filter(s => s.tenant_id === g.id).length;
                      return (
                        <div key={g.id} onClick={() => setPortalSelectedGallery(g.id)} style={{ background: '#fff', borderRadius: '16px', padding: '16px', cursor: 'pointer', border: `1.5px solid ${active ? '#3538CD' : '#E7E9EF'}`, boxShadow: active ? '0 8px 24px rgba(53,56,205,0.14)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>{initials}</div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#101828', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                            <div style={{ fontSize: '11.5px', color: '#667085', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span>📍 {g.city || 'İstanbul'}</span>
                              <span style={{ color: '#E2E5EA' }}>·</span>
                              <span>🚗 {count} ilan</span>
                              <span style={{ color: '#E2E5EA' }}>·</span>
                              <span style={{ color: '#B54708', fontWeight: 800 }}>★ {salesCount}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {tenants.filter(g => g.is_featured).length === 0 && tenants.slice(0, 4).map(g => {
                      const active = portalSelectedGallery === g.id;
                      const initials = (g.name || 'Galeri').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                      const count = vehicles.filter(c => c.tenant_id === g.id && c.status === 'stokta').length;
                      const salesCount = sales.filter(s => s.tenant_id === g.id).length;
                      return (
                        <div key={g.id} onClick={() => setPortalSelectedGallery(g.id)} style={{ background: '#fff', borderRadius: '16px', padding: '16px', cursor: 'pointer', border: `1.5px solid ${active ? '#3538CD' : '#E7E9EF'}`, boxShadow: active ? '0 8px 24px rgba(53,56,205,0.14)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>{initials}</div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#101828', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                            <div style={{ fontSize: '11.5px', color: '#667085', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span>📍 {g.city || 'İstanbul'}</span>
                              <span style={{ color: '#E2E5EA' }}>·</span>
                              <span>🚗 {count} ilan</span>
                              <span style={{ color: '#E2E5EA' }}>·</span>
                              <span style={{ color: '#B54708', fontWeight: 800 }}>★ {salesCount}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            <div style={{ display: 'flex', gap: '24px', marginTop: '28px', alignItems: 'flex-start' }}>
              
              {/* Filter Sidebar */}
              {portalCategory !== 'Galeriler' && (
                <aside style={{ width: '256px', flexShrink: 0, position: 'sticky', top: '92px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '18px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px' }}>Filtreler</div>
                      <button onClick={() => {
                        setPortalSelectedBrands([]);
                        setPortalPriceMin('');
                        setPortalPriceMax('');
                        setPortalYearMin('');
                        setPortalYearMax('');
                        setPortalSelectedFuels([]);
                        setPortalSelectedBodyTypes([]);
                        setPortalHeavyDamage('');
                        setPortalSelectedGears([]);
                        setPortalSelectedGallery(null);
                        setCatalogFilterQuery('');
                      }} style={{ border: 'none', background: 'none', color: '#3538CD', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Temizle</button>
                    </div>
                    
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Marka</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '18px', maxHeight: '180px', overflowY: 'auto' }}>
                      {availableBrands.map(brandName => {
                        const count = vehicles.filter(c => c.brand === brandName && c.status === 'stokta').length;
                        const checked = portalSelectedBrands.includes(brandName);
                        return (
                          <label key={brandName} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13.5px', fontWeight: 600, color: '#344054', cursor: 'pointer' }}>
                            <input type="checkbox" checked={checked} onChange={() => {
                              setPortalSelectedBrands(checked ? portalSelectedBrands.filter(b => b !== brandName) : [...portalSelectedBrands, brandName]);
                            }} style={{ width: '16px', height: '16px', accentColor: '#3538CD', cursor: 'pointer' }} />
                            <span style={{ flex: 1 }}>{brandName}</span>
                            <span style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 700 }}>{count}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Fiyat (TL)</div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                      <input placeholder="Min" value={portalPriceMin} onChange={(e) => setPortalPriceMin(e.target.value.replace(/\D/g, ''))} style={{ width: '50%', height: '36px', border: '1px solid #E0E3EB', borderRadius: '10px', padding: '0 10px', fontSize: '13px', outline: 'none' }} />
                      <input placeholder="Maks" value={portalPriceMax} onChange={(e) => setPortalPriceMax(e.target.value.replace(/\D/g, ''))} style={{ width: '50%', height: '36px', border: '1px solid #E0E3EB', borderRadius: '10px', padding: '0 10px', fontSize: '13px', outline: 'none' }} />
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Model Yılı</div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                      <input placeholder="Min Yıl" value={portalYearMin} onChange={(e) => setPortalYearMin(e.target.value.replace(/\D/g, ''))} style={{ width: '50%', height: '36px', border: '1px solid #E0E3EB', borderRadius: '10px', padding: '0 10px', fontSize: '13px', outline: 'none' }} />
                      <input placeholder="Maks Yıl" value={portalYearMax} onChange={(e) => setPortalYearMax(e.target.value.replace(/\D/g, ''))} style={{ width: '50%', height: '36px', border: '1px solid #E0E3EB', borderRadius: '10px', padding: '0 10px', fontSize: '13px', outline: 'none' }} />
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Yakıt</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '18px' }}>
                      {['Benzinli', 'Benzin+LPG', 'Dizel', 'Hibrit', 'Elektrikli'].map(fuel => {
                        const active = portalSelectedFuels.includes(fuel);
                        return (
                          <button key={fuel} onClick={() => {
                            setPortalSelectedFuels(active ? portalSelectedFuels.filter(f => f !== fuel) : [...portalSelectedFuels, fuel]);
                          }} style={{ borderRadius: '999px', padding: '7px 13px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', border: '1px solid #E0E3EB', background: active ? '#3538CD' : '#fff', color: active ? '#fff' : '#475467' }}>
                            {fuel}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Vites</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '18px' }}>
                      {['Otomatik', 'Manuel', 'Yarı Otomatik'].map(gear => {
                        const active = portalSelectedGears.includes(gear);
                        return (
                          <button key={gear} onClick={() => {
                            setPortalSelectedGears(active ? portalSelectedGears.filter(g => g !== gear) : [...portalSelectedGears, gear]);
                          }} style={{ borderRadius: '999px', padding: '7px 13px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', border: '1px solid #E0E3EB', background: active ? '#3538CD' : '#fff', color: active ? '#fff' : '#475467' }}>
                            {gear}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Kasa Tipi</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '18px', maxHeight: '180px', overflowY: 'auto' }}>
                      {['Cabrio', 'Coupe', 'Coupe 4 kapı', 'Hatchback 3 kapı', 'Hatchback 5 kapı', 'Sedan', 'Station Wagon', 'MPV', 'Roadster'].map(bodyType => {
                        const count = vehicles.filter(c => c.body_type === bodyType && c.status === 'stokta').length;
                        const checked = portalSelectedBodyTypes.includes(bodyType);
                        return (
                          <label key={bodyType} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13.5px', fontWeight: 600, color: '#344054', cursor: 'pointer' }}>
                            <input type="checkbox" checked={checked} onChange={() => {
                              setPortalSelectedBodyTypes(checked ? portalSelectedBodyTypes.filter(b => b !== bodyType) : [...portalSelectedBodyTypes, bodyType]);
                            }} style={{ width: '16px', height: '16px', accentColor: '#3538CD', cursor: 'pointer' }} />
                            <span style={{ flex: 1 }}>{bodyType}</span>
                            <span style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 700 }}>{count}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Ağır Hasar Kaydı</div>
                    <select value={portalHeavyDamage} onChange={(e) => setPortalHeavyDamage(e.target.value)} style={{ width: '100%', height: '36px', border: '1px solid #E0E3EB', borderRadius: '10px', background: '#fff', padding: '0 8px', fontSize: '13px', fontWeight: 600, color: '#344054', outline: 'none', cursor: 'pointer' }}>
                      <option value="">Fark etmez</option>
                      <option value="var">Ağır Hasarlı (Var)</option>
                      <option value="yok">Hasarsız (Yok)</option>
                    </select>
                  </div>

                  <div style={{ background: 'linear-gradient(135deg,#1B1D3A,#33357A)', borderRadius: '18px', padding: '20px', color: '#fff' }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>Galerinizi ekleyin</div>
                    <div style={{ fontSize: '12.5px', color: '#C9CCF2', marginBottom: '14px' }}>İlanlarınızı binlerce alıcıya ulaştırın, vitrin sayfanızı oluşturun.</div>
                    <button onClick={() => window.open('http://galerim.app/?register=true', '_blank')} style={{ height: '36px', padding: '0 16px', border: 'none', borderRadius: '10px', background: '#fff', color: '#1B1D3A', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}>Başvur</button>
                  </div>
                </aside>
              )}

              {/* Listings Main Section */}
              <main style={{ flex: 1, minWidth: 0 }}>
                {portalCategory === 'Galeriler' ? (
                  <div>
                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', fontWeight: 800, color: '#101828', marginBottom: '20px' }}>Tüm Üye Galerilerimiz</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {[...tenants].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'tr')).map(g => {
                        const count = vehicles.filter(c => c.tenant_id === g.id && c.status === 'stokta').length;
                        const salesCount = sales.filter(s => s.tenant_id === g.id).length;
                        const initials = (g.name || 'Galeri').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                        return (
                          <div 
                            key={g.id} 
                            onClick={() => {
                              setPortalSelectedGallery(g.id);
                              setPortalCategory('Otomobil'); // Switch back to see their cars
                            }}
                            style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E7E9EF', padding: '18px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '14px' }}
                          >
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '16px' }}>{initials}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 800, fontSize: '15px', color: '#101828', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                              <div style={{ fontSize: '11.5px', color: '#667085', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span>📍 {g.city || 'İstanbul'}</span>
                                <span style={{ color: '#E2E5EA' }}>·</span>
                                <span>🚗 {count} ilan</span>
                                <span style={{ color: '#E2E5EA' }}>·</span>
                                <span style={{ color: '#B54708', fontWeight: 800 }}>★ {salesCount}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : portalFiltered.length === 0 ? (
                  <div style={{ background: '#fff', border: '1px dashed #D0D5DD', borderRadius: '18px', padding: '60px', textAlign: 'center', color: '#667085' }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, color: '#101828', marginBottom: '6px' }}>Sonuç bulunamadı</div>
                    <div style={{ fontSize: '13.5px', marginBottom: '16px' }}>Filtreleri gevşeterek tekrar deneyin.</div>
                    <button onClick={() => {
                      setPortalSelectedBrands([]);
                      setPortalPriceMin('');
                      setPortalPriceMax('');
                      setPortalYearMin('');
                      setPortalSelectedFuels([]);
                      setPortalSelectedGears([]);
                      setPortalSelectedGallery(null);
                      setCatalogFilterQuery('');
                    }} style={{ height: '38px', padding: '0 18px', border: 'none', borderRadius: '11px', background: '#3538CD', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                      Filtreleri Temizle
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {/* Render Grouped by Gallery */}
                    {portalGrouped ? (
                      tenants
                        .map(g => ({ g, its: portalFiltered.filter(c => c.tenant_id === g.id) }))
                        .filter(x => x.its.length)
                        .map(x => {
                          const initials = (x.g.name || 'Galeri').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                          return (
                            <div key={x.g.id}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '13px' }}>{initials}</div>
                                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '17px' }}>{x.g.name || 'Seçkin Galeri'}</div>
                                <div style={{ fontSize: '12.5px', color: '#667085', fontWeight: 700, background: '#fff', border: '1px solid #E7E9EF', borderRadius: '999px', padding: '3px 10px' }}>{x.its.length} ilan</div>
                                <div style={{ height: '1px', flex: 1, background: '#E7E9EF' }}></div>
                              </div>
                              
                              {portalView === 'grid' ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                                  {x.its.map(c => {
                                    const fav = !!portalFavs[c.id];
                                    const g = gMap[c.tenant_id] || { name: 'Seçkin Galeri' };
                                    const gInit = (g.name || 'Seçkin Galeri').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                                    return (
                                      <div key={c.id} onClick={() => { setSelectedAdId(c.id); setPhoneShown(false); }} style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '18px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <div style={{ position: 'relative', height: '180px', background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          {c.image_url ? (
                                            <img src={getFirstImageUrl(c.image_url)} alt={c.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                          ) : (
                                            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#94A3B8' }}>directions_car</span>
                                          )}
                                          {c.is_consignment && (
                                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#FFB020', color: '#3D2600', fontSize: '11px', fontWeight: 800, borderRadius: '999px', padding: '4px 10px' }}>ÖNE ÇIKAN</div>
                                          )}
                                        </div>
                                        <div style={{ padding: '14px 16px 16px' }}>
                                          <div style={{ color: '#101828', fontWeight: 800, fontSize: '14.5px', minHeight: '39px' }}>{c.brand} {c.model}</div>
                                          <div style={{ fontSize: '12.5px', color: '#667085', fontWeight: 600, marginTop: '5px' }}>{c.year} · {c.km.toLocaleString('tr-TR')} km · {c.fuel_type} · {c.gear_type}</div>
                                          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '12px' }}>
                                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '18px', color: '#3538CD' }}>{formatCur(c.sell_price)}</div>
                                            <div style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 700 }}>{g.city || 'İstanbul'}</div>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '12px', paddingTop: '11px', borderTop: '1px solid #F0F1F5' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>{gInit}</div>
                                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#475467' }}>{g.name}</div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  {x.its.map(c => {
                                    const g = gMap[c.tenant_id] || { name: 'Seçkin Galeri' };
                                    const gInit = (g.name || 'Seçkin Galeri').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                                    return (
                                      <div key={c.id} onClick={() => { setSelectedAdId(c.id); setPhoneShown(false); }} style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '16px', padding: '12px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}>
                                        <div style={{ position: 'relative', width: '170px', height: '106px', flexShrink: 0, background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                          {c.image_url ? (
                                            <img src={getFirstImageUrl(c.image_url)} alt={c.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                          ) : (
                                            <span className="material-symbols-outlined" style={{ color: '#94A3B8' }}>directions_car</span>
                                          )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ color: '#101828', fontWeight: 800, fontSize: '15px' }}>{c.brand} {c.model}</div>
                                          <div style={{ fontSize: '12.5px', color: '#667085', fontWeight: 600, marginTop: '4px' }}>{c.year} · {c.km.toLocaleString('tr-TR')} km · {c.fuel_type} · {c.gear_type}</div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '10px' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800 }}>{gInit}</div>
                                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#475467' }}>{g.name}</div>
                                            <div style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 600 }}>· {g.city || 'İstanbul'}</div>
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', paddingRight: '8px' }}>
                                          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '19px', color: '#3538CD' }}>{formatCur(c.sell_price)}</div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })
                    ) : (
                      /* Flat View (Not Grouped) */
                      portalView === 'grid' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                          {portalFiltered.map(c => {
                            const fav = !!portalFavs[c.id];
                            const g = gMap[c.tenant_id] || { name: 'Seçkin Galeri' };
                            const gInit = g.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                            return (
                              <div key={c.id} onClick={() => { setSelectedAdId(c.id); setPhoneShown(false); }} style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '18px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <div style={{ position: 'relative', height: '180px', background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {c.image_url ? (
                                    <img src={getFirstImageUrl(c.image_url)} alt={c.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#94A3B8' }}>directions_car</span>
                                  )}
                                  {c.is_consignment && (
                                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#FFB020', color: '#3D2600', fontSize: '11px', fontWeight: 800, borderRadius: '999px', padding: '4px 10px' }}>ÖNE ÇIKAN</div>
                                  )}
                                </div>
                                <div style={{ padding: '14px 16px 16px' }}>
                                  <div style={{ color: '#101828', fontWeight: 800, fontSize: '14.5px', minHeight: '39px' }}>{c.brand} {c.model}</div>
                                  <div style={{ fontSize: '12.5px', color: '#667085', fontWeight: 600, marginTop: '5px' }}>{c.year} · {c.km.toLocaleString('tr-TR')} km · {c.fuel_type} · {c.gear_type}</div>
                                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '12px' }}>
                                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '18px', color: '#3538CD' }}>{formatCur(c.sell_price)}</div>
                                    <div style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 700 }}>{g.city || 'İstanbul'}</div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '12px', paddingTop: '11px', borderTop: '1px solid #F0F1F5' }}>
                                    <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>{gInit}</div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#475467' }}>{g.name}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {portalFiltered.map(c => {
                            const g = gMap[c.tenant_id] || { name: 'Seçkin Galeri' };
                            const gInit = g.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                            return (
                              <div key={c.id} onClick={() => { setSelectedAdId(c.id); setPhoneShown(false); }} style={{ background: '#fff', border: '1px solid #E7E9EF', borderRadius: '16px', padding: '12px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }}>
                                <div style={{ position: 'relative', width: '170px', height: '106px', flexShrink: 0, background: 'linear-gradient(135deg, #F1F5F9, #CBD5E1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                  {c.image_url ? (
                                    <img src={getFirstImageUrl(c.image_url)} alt={c.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    <span className="material-symbols-outlined" style={{ color: '#94A3B8' }}>directions_car</span>
                                  )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ color: '#101828', fontWeight: 800, fontSize: '15px' }}>{c.brand} {c.model}</div>
                                  <div style={{ fontSize: '12.5px', color: '#667085', fontWeight: 600, marginTop: '4px' }}>{c.year} · {c.km.toLocaleString('tr-TR')} km · {c.fuel_type} · {c.gear_type}</div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '10px' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#EEF0FF', color: '#3538CD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800 }}>{gInit}</div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#475467' }}>{g.name}</div>
                                    <div style={{ fontSize: '11.5px', color: '#98A2B3', fontWeight: 600 }}>· {g.city || 'İstanbul'}</div>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', paddingRight: '8px' }}>
                                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '19px', color: '#3538CD' }}>{formatCur(c.sell_price)}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )
                    )}
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      );
    }

    // Filter vehicles
    const filteredCatalogVehicles = vehicles.filter(v => {
      if (v.status !== 'stokta') return false;
      if (catalogFilterQuery) {
        const q = catalogFilterQuery.toLowerCase().trim();
        const brandModelMatch = `${v.brand} ${v.model}`.toLowerCase().includes(q);
        if (!brandModelMatch) return false;
      }
      if (catalogFilterBodyType && catalogFilterBodyType !== 'All') {
        if (v.body_type !== catalogFilterBodyType) return false;
      }
      return true;
    });

    return (
      <div style={{ background: '#faf8f5', minHeight: '100vh', padding: '40px 24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #e7e2da', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', color: '#1A1D23' }}>{catalogTenant.name}</h1>
              <p style={{ color: '#8a8177', fontSize: '13px' }}>Araç Portföyü & İletişim Kataloğu</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '13px' }}>
              <div style={{ fontWeight: 700 }}><Phone size={13} style={{ display: 'inline', marginRight: '4px' }} /> {catalogTenant.owner_phone}</div>
              <div style={{ color: '#5c554c', marginTop: '2px' }}><Mail size={13} style={{ display: 'inline', marginRight: '4px' }} /> {catalogTenant.owner_email}</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '19px', color: '#9AA1AC', position: 'absolute', left: '12px' }}>search</span>
              <input 
                placeholder="Marka veya model ara..." 
                value={catalogFilterQuery}
                onChange={(e) => setCatalogFilterQuery(e.target.value)}
                style={{ width: '100%', height: '40px', border: '1px solid #E2E5EA', borderRadius: '10px', background: '#F7F8FA', padding: '0 14px 0 38px', fontSize: '13.5px', color: '#1A1D23', outline: 'none' }} 
              />
            </div>
            <div style={{ width: '200px' }}>
              <select 
                className="input-field" 
                value={catalogFilterBodyType}
                onChange={(e) => setCatalogFilterBodyType(e.target.value)}
                style={{ height: '40px', marginTop: 0 }}
              >
                <option value="All">Tüm Kasa Tipleri</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="SUV">SUV</option>
                <option value="Station Wagon">Station Wagon</option>
                <option value="Coupe">Coupe</option>
                <option value="Cabrio">Cabrio</option>
                <option value="Arazi">Arazi</option>
                <option value="Panelvan">Panelvan</option>
                <option value="Minivan">Minivan</option>
              </select>
            </div>
          </div>

          {/* Catalog Grid */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Stoktaki Güncel Araçlarımız</h2>
            <span style={{ fontSize: '12.5px', color: '#8a8177', fontWeight: 600 }}>{filteredCatalogVehicles.length} araç listelendi</span>
          </div>

          {filteredCatalogVehicles.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#8a8177', fontStyle: 'italic' }}>
              Arama kriterlerine uygun araç bulunamadı.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {filteredCatalogVehicles.map((v, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, #f0ece5, #ddd6cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a39a8e', fontSize: '12px', fontWeight: 800 }}>
                    ARAÇ FOTOĞRAFI
                  </div>
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase' }}>{v.brand} {v.model}</h3>
                      <p style={{ fontSize: '11.5px', color: '#8a8177', marginTop: '3px' }}>{v.year} model · {v.km.toLocaleString('tr-TR')} km · {v.fuel_type} · {v.gear_type} · {v.body_type}</p>
                      {v.description && <p style={{ fontSize: '12px', color: '#5c554c', marginTop: '8px', lineHeight: 1.4 }}>{v.description}</p>}
                    </div>
                    <div style={{ borderTop: '1px solid #f3efe9', marginTop: '14px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#8a8177', fontWeight: 700 }}>SATIŞ FİYATI</span>
                      <strong style={{ fontSize: '18px', fontWeight: 900, color: '#B91C1C' }}>{formatCur(v.sell_price)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #e7e2da', textAlign: 'center', fontSize: '11.5px', color: '#8a8177' }}>
            Bu katalog <a href="http://galerim.app" style={{ fontWeight: 700, textDecoration: 'underline' }}>galerim.app</a> oto galeri yönetim sistemi tarafından otomatik oluşturulmuştur.
          </footer>
        </div>
      </div>
    );
  }

  // ============================================================
  // VIEW: PORTAL (gm.galerim.app) LOGIN SCREEN
  // ============================================================
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#faf8f5', padding: '24px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '16px', padding: '34px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
            <img src="/logo.png" alt="Galerim Logo" style={{ height: '42px', display: 'block' }} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, textAlign: 'center', marginBottom: '6px' }}>Sistem Yönetim Portalı</h2>
          <p style={{ fontSize: '12.5px', color: '#8a8177', textAlign: 'center', marginBottom: '24px' }}>Galerim ortak paneline erişim</p>
          
          <form onSubmit={handlePortalLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>E-posta Adresiniz *</span>
              <input
                type="email"
                required
                className="input-field"
                placeholder="Örn. admin@bulutgrup.tr veya galeri@posta.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </label>
            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Giriş Şifreniz *</span>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </label>
            
            {authError && (
              <div style={{ color: '#b91c1c', fontSize: '12px', fontWeight: 700, background: '#fee2e2', padding: '8px 12px', borderRadius: '6px' }}>
                {authError}
              </div>
            )}
            
            <button type="submit" className="btn-primary" style={{ padding: '12px', borderRadius: '8px', fontSize: '14px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Lock size={15} /> Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================
  // VIEW: TRIAL EXPIRED LOCK (14 days rule)
  // ============================================================
  if (user.role === 'tenant' && trialExpired) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#faf8f5', padding: '24px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '520px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '10px' }}>Hesap Kullanım Süreniz Sona Erdi</h2>
          <p style={{ fontSize: '14px', color: '#5c554c', lineHeight: 1.6, marginBottom: '26px' }}>
            14 günlük ücretsiz deneme veya aktif abonelik süreniz tamamlanmıştır. İşlemlerinize devam edebilmek için lütfen aşağıdaki ödeme seçeneklerinden birini seçerek aboneliğinizi etkinleştirin.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '26px' }}>
            <button
              onClick={() => handlePayTrialSubscription('monthly')}
              style={{ background: '#faf8f5', border: '1px solid #ddd6cc', borderRadius: '12px', padding: '18px', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ fontWeight: 800, fontSize: '13px' }}>Aylık Paket</div>
              <div style={{ fontSize: '22px', fontWeight: 900, marginTop: '8px', color: '#B91C1C' }}>₺6.490</div>
              <div style={{ fontSize: '11px', color: '#8a8177', marginTop: '2px' }}>Taahhütsüz</div>
            </button>
            
            <button
              onClick={() => handlePayTrialSubscription('yearly')}
              style={{ background: '#faf8f5', border: '1px solid #B91C1C', borderRadius: '12px', padding: '18px', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ fontWeight: 800, fontSize: '13px', color: '#B91C1C' }}>Yıllık Paket</div>
              <div style={{ fontSize: '22px', fontWeight: 900, marginTop: '8px', color: '#16a34a' }}>₺48.000</div>
              <div style={{ fontSize: '11px', color: '#8a8177', marginTop: '2px' }}>%38 Avantajlı</div>
            </button>
          </div>

          <div style={{ display: 'flex', alignLines: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#8a8177' }}>
            <span>Ödemeler <strong>iyzico</strong> güvencesiyle 256-bit SSL şifrelemeyle tahsil edilir.</span>
          </div>

          <button onClick={handlePortalLogout} style={{ marginTop: '24px', background: 'none', border: 'none', color: '#8a8177', fontWeight: 700, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
            Farklı Hesapla Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // VIEW: SUPER ADMIN CP (admin@bulutgrup.tr / root@bulutgrup.tr)
  // ============================================================
  if (user.role === 'superadmin') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <header style={{ height: '64px', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <img src="/logo.png" alt="Galerim Logo" style={{ height: '32px', display: 'block' }} />
            <span style={{ fontSize: '10px', background: '#B91C1C', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, marginLeft: '6px' }}>SUPERADMIN</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', fontSize: '12px' }}>
              <span style={{ display: 'block', fontWeight: 700 }}>{user.email}</span>
              <span style={{ color: '#a39a8e' }}>BulutGrup System Root</span>
            </div>
            <button onClick={handlePortalLogout} style={{ background: 'none', border: 'none', color: '#a39a8e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LogOut size={16} /> Çıkış
            </button>
          </div>
        </header>

        {/* Main Container */}
        <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
          
          {/* Sidebar */}
          <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{ width: '240px', background: '#fff', borderRight: '1px solid #e7e2da', padding: '24px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}><TrendingUp size={16} /> Genel Bakış</button>
            <button onClick={() => { setActiveTab('isletmeler'); setMobileMenuOpen(false); }} className={`sidebar-link ${activeTab === 'isletmeler' ? 'active' : ''}`}><Users size={16} /> İşletmeler (Tenants)</button>
            <button onClick={() => { setActiveTab('odemeler'); setMobileMenuOpen(false); }} className={`sidebar-link ${activeTab === 'odemeler' ? 'active' : ''}`}><FileText size={16} /> Ödeme Kayıtları</button>
            <button onClick={() => { setActiveTab('analitik'); setMobileMenuOpen(false); }} className={`sidebar-link ${activeTab === 'analitik' ? 'active' : ''}`}><PieChart size={16} /> Analitik Raporlar</button>
          </aside>

          {/* Content Area */}
          <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            
            {/* Notification Alert */}
            {alert.message && (
              <div className={`alert-box ${alert.type}`} style={{ padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', fontWeight: 700, fontSize: '13px', background: alert.type === 'success' ? '#e8f5ec' : '#fee2e2', color: alert.type === 'success' ? '#16a34a' : '#991b1b', border: `1px solid ${alert.type === 'success' ? '#22c55e' : '#ef4444'}` }}>
                {alert.message}
              </div>
            )}

            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="fade-in">
                <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>Sistem Genel Bakış</h1>
                
                {/* Summary Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Kayıtlı Galeri (Tenant)</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '6px' }}>{tenants.length}</div>
                    <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', fontWeight: 700 }}>{tenants.filter(t => t.status === 'active' || t.status === 'trial').length} Aktif Üye</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Toplam Araç Havuzu</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '6px' }}>{vehicles.length}</div>
                    <div style={{ fontSize: '11px', color: '#8a8177', marginTop: '4px' }}>{vehicles.filter(v => v.status === 'stokta').length} Stokta / {vehicles.filter(v => v.status === 'satildi').length} Satılan</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Toplam Satış Hacmi</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '6px' }}>{formatCur(sales.reduce((a, b) => a + parseFloat(b.sell_price), 0))}</div>
                    <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', fontWeight: 700 }}>{sales.length} Araç satışı tamamlandı</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '18px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Toplam iyzico Cirosu</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, marginTop: '6px', color: '#B91C1C' }}>{formatCur(payments.filter(p => p.status === 'success').reduce((a, b) => a + parseFloat(b.amount), 0))}</div>
                    <div style={{ fontSize: '11px', color: '#8a8177', marginTop: '4px' }}>Platform SaaS Gelirleri</div>
                  </div>
                </div>

                {/* Latest Registrations */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Son Sistem Hareketleri (Kayıt Bildirimleri)</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {notifications.length === 0 ? (
                        <p style={{ color: '#8a8177', fontStyle: 'italic' }}>Yeni üyelik bildirimi bulunmuyor.</p>
                      ) : (
                        notifications.slice(0, 5).map(n => (
                          <div key={n.id} style={{ background: '#faf8f5', border: '1px solid #eee9e1', borderRadius: '8px', padding: '12px', fontSize: '12.5px' }}>
                            <div style={{ fontWeight: 800, color: '#B91C1C', display: 'flex', justifyContent: 'space-between' }}>
                              <span>{n.title}</span>
                              <span style={{ fontSize: '10.5px', color: '#8a8177', fontWeight: 400 }}>{new Date(n.created_at).toLocaleString('tr-TR')}</span>
                            </div>
                            <div style={{ color: '#5c554c', marginTop: '4px', lineHeight: 1.4 }}>{n.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Hızlı Sistem Bilgisi</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3efe9', paddingBottom: '6px' }}>
                        <span>Sistem Statüsü:</span>
                        <strong style={{ color: '#16a34a' }}>AKTİF (Normal)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3efe9', paddingBottom: '6px' }}>
                        <span>Supabase Veri Havuzu:</span>
                        <strong>PostgreSQL 15</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3efe9', paddingBottom: '6px' }}>
                        <span>Edge Functions:</span>
                        <strong style={{ color: '#16a34a' }}>Çalışıyor</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ISLETMELER (TENANTS) */}
            {activeTab === 'isletmeler' && (
              <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.02em' }}>İşletmeler (Cari Galeriler)</h1>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', fontSize: '11px', fontWeight: 700, color: '#8a8177', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 18px' }}>Galeri Adı</th>
                        <th>Yetkili / Tel</th>
                        <th>Durum</th>
                        <th>Bitiş Tarihi</th>
                        <th>Kalan Gün</th>
                        <th>Öne Çıkar</th>
                        <th>Hediye Lisans Ekle</th>
                        <th>Detay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map(t => {
                        const remDays = getRemainingDays(t);
                        return (
                          <tr key={t.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                            <td style={{ padding: '14px 18px' }}>
                              <div style={{ fontWeight: 800 }}>{t.name}</div>
                              <div style={{ fontSize: '11.5px', color: '#8a8177' }}>ilan.galerim.app/{t.slug}</div>
                            </td>
                            <td>
                              <div>{t.owner_name}</div>
                              <div style={{ fontSize: '11px', color: '#8a8177' }}>{t.owner_phone}</div>
                            </td>
                            <td>
                              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: t.status === 'active' || t.status === 'trial' ? '#e8f5ec' : '#fee2e2', color: t.status === 'active' || t.status === 'trial' ? '#16a34a' : '#b91c1c' }}>
                                {t.status === 'trial' ? 'Deneme' : t.status}
                              </span>
                            </td>
                            <td>
                              {t.subscription_ends_at ? new Date(t.subscription_ends_at).toLocaleDateString('tr-TR') : 'Deneme Süresi'}
                            </td>
                            <td style={{ fontWeight: 700, color: remDays < 3 ? '#b91c1c' : '#191512' }}>
                              {remDays} gün
                            </td>
                            <td>
                              <button 
                                onClick={async () => {
                                  const newStatus = !t.is_featured;
                                  const { error } = await supabase
                                    .from('tenants')
                                    .update({ is_featured: newStatus })
                                    .eq('id', t.id);
                                  if (error) {
                                    alert('Güncelleme başarısız: ' + error.message);
                                  } else {
                                    setTenants(tenants.map(item => item.id === t.id ? { ...item, is_featured: newStatus } : item));
                                  }
                                }} 
                                style={{ 
                                  padding: '4px 8px', 
                                  fontSize: '11px', 
                                  borderRadius: '6px', 
                                  background: t.is_featured ? '#FFF6E5' : '#faf8f5', 
                                  border: `1px solid ${t.is_featured ? '#b45309' : '#ddd6cc'}`, 
                                  color: t.is_featured ? '#b45309' : '#8a8177', 
                                  fontWeight: 800, 
                                  cursor: 'pointer' 
                                }}
                              >
                                {t.is_featured ? '★ Öne Çıkarıldı' : '☆ Öne Çıkar'}
                              </button>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={() => handleGiftDays(t.id, 30)} style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', background: '#faf3ee', border: '1px solid #ddd6cc', color: '#B91C1C', fontWeight: 700, cursor: 'pointer' }}>+30 G</button>
                                <button onClick={() => handleGiftDays(t.id, 90)} style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', background: '#faf3ee', border: '1px solid #ddd6cc', color: '#B91C1C', fontWeight: 700, cursor: 'pointer' }}>+90 G</button>
                                <button onClick={() => handleGiftDays(t.id, 365)} style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '4px', background: '#faf3ee', border: '1px solid #ddd6cc', color: '#B91C1C', fontWeight: 700, cursor: 'pointer' }}>+365 G</button>
                              </div>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  const tenantVehicles = vehicles.filter(v => v.tenant_id === t.id);
                                  const tenantSales = sales.filter(s => s.tenant_id === t.id);
                                  setSuperadminSelectedTenant({
                                    ...t,
                                    vehicles: tenantVehicles,
                                    sales: tenantSales
                                  });
                                }}
                                className="btn-secondary"
                                style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}
                              >
                                <Eye size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: PAYMENTS LOGS */}
            {activeTab === 'odemeler' && (
              <div className="fade-in">
                <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>iyzico Ödeme Log Kayıtları</h1>

                <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', fontSize: '11px', fontWeight: 700, color: '#8a8177', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 18px' }}>İşletme</th>
                        <th>Tutar</th>
                        <th>Ödeme Durumu</th>
                        <th>Kart Türü</th>
                        <th>iyzico İşlem ID</th>
                        <th>Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => {
                        const t = tenants.find(ten => ten.id === p.tenant_id);
                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                            <td style={{ padding: '14px 18px' }}>
                              <div style={{ fontWeight: 800 }}>{t?.name}</div>
                              <div style={{ fontSize: '11.5px', color: '#8a8177' }}>{t?.slug}</div>
                            </td>
                            <td style={{ fontWeight: 700 }}>{formatCur(p.amount)}</td>
                            <td>
                              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: p.status === 'success' ? '#e8f5ec' : '#fee2e2', color: p.status === 'success' ? '#16a34a' : '#991b1b' }}>
                                {p.status === 'success' ? 'Başarılı' : 'Hatalı'}
                              </span>
                            </td>
                            <td>{p.card_association || 'Mastercard'}</td>
                            <td>{p.iyzico_payment_id || 'MOCK-192837'}</td>
                            <td style={{ color: '#8a8177' }}>{new Date(p.created_at).toLocaleString('tr-TR')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: ANALYTICS */}
            {activeTab === 'analitik' && (
              <div className="fade-in">
                <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>Platform Analiz Raporu</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px' }}>Tenant Kâr Analizleri</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {tenants.map(t => {
                        const tSales = sales.filter(s => s.tenant_id === t.id);
                        const tProfit = tSales.reduce((a, b) => a + parseFloat(b.net_profit || 0), 0);
                        return (
                          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid #f3efe9', paddingBottom: '8px' }}>
                            <div>
                              <span style={{ fontWeight: 700 }}>{t.name}</span>
                              <div style={{ fontSize: '11px', color: '#8a8177' }}>{tSales.length} araç satışı</div>
                            </div>
                            <span style={{ fontWeight: 800, color: tProfit >= 0 ? '#16a34a' : '#b91c1c' }}>{formatCur(tProfit)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px' }}>Stok Havuzu Değerleri</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {tenants.map(t => {
                        const tVehicles = vehicles.filter(v => v.tenant_id === t.id && v.status === 'stokta');
                        const tStockVal = tVehicles.reduce((a, b) => a + parseFloat(b.buy_price || 0), 0);
                        return (
                          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid #f3efe9', paddingBottom: '8px' }}>
                            <div>
                              <span style={{ fontWeight: 700 }}>{t.name}</span>
                              <div style={{ fontSize: '11px', color: '#8a8177' }}>{tVehicles.length} araç stokta</div>
                            </div>
                            <span style={{ fontWeight: 800 }}>{formatCur(tStockVal)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* DETAY MODALI (TENANT DETAIL WINDOW) */}
        {superadminSelectedTenant && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,15,12,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '820px', width: '100%', maxHeight: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #eee9e1' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{superadminSelectedTenant.name} — Detay Bilgileri</h3>
                  <span style={{ fontSize: '11.5px', color: '#8a8177' }}>{superadminSelectedTenant.owner_email} · {superadminSelectedTenant.owner_phone}</span>
                </div>
                <button onClick={() => setSuperadminSelectedTenant(null)} style={{ border: 'none', background: '#f0ece5', cursor: 'pointer', borderRadius: '8px', width: '30px', height: '30px', fontWeight: '700' }}>✕</button>
              </div>
              
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Analitik Özet */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div style={{ background: '#faf8f5', border: '1px solid #eee9e1', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800 }}>Stoktaki Toplam Araç</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{superadminSelectedTenant.vehicles.filter(v => v.status === 'stokta').length} Araç</div>
                  </div>
                  <div style={{ background: '#faf8f5', border: '1px solid #eee9e1', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800 }}>Satılan Toplam Araç</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{superadminSelectedTenant.vehicles.filter(v => v.status === 'satildi').length} Araç</div>
                  </div>
                  <div style={{ background: '#faf8f5', border: '1px solid #eee9e1', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800 }}>Net Kâr Marjı (Toplam)</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px', color: '#16a34a' }}>{formatCur(superadminSelectedTenant.sales.reduce((a, b) => a + parseFloat(b.net_profit || 0), 0))}</div>
                  </div>
                </div>

                {/* Araç Listesi */}
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>Araç Portföyü Detayları</h4>
                  <div style={{ border: '1px solid #e7e2da', borderRadius: '10px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', fontSize: '10px', color: '#8a8177', fontWeight: 700, textTransform: 'uppercase' }}>
                          <th style={{ padding: '10px 14px' }}>Araç</th>
                          <th>Alış Fiyatı</th>
                          <th>Satış / Hedef</th>
                          <th>Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {superadminSelectedTenant.vehicles.map(v => (
                          <tr key={v.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                            <td style={{ padding: '10px 14px' }}>
                              <div style={{ fontWeight: 700 }}>{v.brand} {v.model}</div>
                              <div style={{ fontSize: '11px', color: '#8a8177' }}>{v.plate}</div>
                            </td>
                            <td>{formatCur(v.buy_price)}</td>
                            <td style={{ fontWeight: 700 }}>{formatCur(v.sell_price)}</td>
                            <td>
                              <span style={{ fontSize: '10.5px', fontWeight: 700, color: v.status === 'stokta' ? '#b45309' : '#16a34a' }}>{v.status === 'stokta' ? 'Stokta' : 'Satıldı'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ============================================================
  // VIEW: TENANT WEB PANEL
  // ============================================================
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#F5F6F8', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      
      {/* Sidebar */}
      <aside style={{ width: '252px', background: '#fff', borderRight: '1px solid #E7E9ED', padding: '24px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', flexShrink: 0 }}>
        {/* Top: Logo & Navigation */}
        <div>
          {/* Logo Section */}
          <div style={{ padding: '4px 12px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="Galerim Logo" style={{ height: '38px', display: 'block' }} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#8A929E', padding: '0 12px 14px', borderBottom: '1px solid #F0F1F4', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1F8A5B', boxShadow: '0 0 0 3px rgba(31,138,91,.16)' }}></span>
            <a 
              href={window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? `http://localhost:5173/?tenant=${currentTenant?.slug || 'bulutgrup'}` 
                : `https://ilan.galerim.app/?tenant=${currentTenant?.slug || 'bulutgrup'}`
              } 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#B91C1C', textDecoration: 'none', fontWeight: 700 }} 
              title="Müşteri İlan Sayfasını Yeni Sekmede Aç"
            >
              ilan.galerim.app/?tenant={currentTenant?.slug || 'demo'} ↗
            </a>
          </div>

          <div style={{ padding: '14px 12px 6px', fontSize: '10.5px', fontWeight: 700, color: '#A4ABB5', letterSpacing: '.8px', textTransform: 'uppercase' }}>Menü</div>
          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '0 8px' }}>
            {[
              { id: 'dashboard', label: 'Genel Bakış', icon: 'dashboard' },
              { id: 'araclar', label: 'Araç Listesi', icon: 'directions_car' },
              { id: 'arac-alis', label: 'Araç Alış', icon: 'add_circle' },
              { id: 'masraf-ekle', label: 'Gider Ekle', icon: 'receipt_long' },
              { id: 'arac-satis', label: 'Araç Satış', icon: 'sell' },
              { id: 'bankalar', label: 'Bankalar & Kasa', icon: 'account_balance' },
              { id: 'musteriler', label: 'Müşteriler', icon: 'group' },
              { id: 'personel', label: 'Personel', icon: 'badge' },
              { id: 'raporlar', label: 'Raporlar', icon: 'bar_chart' },
              { id: 'muhasebe', label: 'Muhasebe', icon: 'calculate' },
              { id: 'mesajlar', label: 'Mesajlar', icon: 'forum' },
              { id: 'ayarlar', label: 'Ayarlar', icon: 'settings' }
            ].map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? '#FDF2F2' : 'transparent',
                    color: isActive ? '#B91C1C' : '#46505C',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{
                    fontFamily: "'Material Symbols Outlined'",
                    fontSize: '21px',
                    color: isActive ? '#B91C1C' : '#8A929E',
                    fontFeatureSettings: "'liga'"
                  }}>
                    {item.icon}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.id === 'mesajlar' && messages.filter(m => !m.is_read).length > 0 && (
                    <span style={{ 
                      background: '#E5484D', 
                      color: '#fff', 
                      fontSize: '10.5px', 
                      fontWeight: 800, 
                      borderRadius: '8px', 
                      padding: '2px 7px',
                      lineHeight: 1
                    }}>
                      {messages.filter(m => !m.is_read).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile Details */}
        <div style={{ borderTop: '1px solid #F0F1F4', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Fatura Bilgileri Eksik Uyarısı */}
          {currentTenant && (!currentTenant.tax_office || !currentTenant.tax_number || !currentTenant.company_title || !currentTenant.address) && (
            <div 
              onClick={() => setActiveTab('ayarlar')}
              style={{ background: '#FFF9EB', border: '1px solid #FFE6AD', borderRadius: '12px', padding: '10px 12px', margin: '0 8px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'flex-start' }}
            >
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', color: '#B26A00', marginTop: '2px' }}>warning</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '11px', color: '#B26A00' }}>Fatura Bilgileriniz Eksik</div>
                <div style={{ fontSize: '9.5px', color: '#6A562B', marginTop: '2px', lineHeight: '1.3' }}>Fatura kesilmesi için bilgilerinizi tamamlayın.</div>
              </div>
            </div>
          )}

          {/* Sistem Durumu */}
          <div style={{ background: 'linear-gradient(150deg,#FDF2F2,#FDF8F8)', border: '1px solid #FADCDC', borderRadius: '12px', padding: '12px', margin: '0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', color: '#B91C1C' }}>shield_person</span>
              <span style={{ fontWeight: 700, fontSize: '12.5px', color: '#1A1D23' }}>Lisans Durumu</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11.5px', color: '#46505C', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1F8A5B', boxShadow: '0 0 0 3px rgba(31,138,91,.16)' }}></span>
              {getRemainingDays(currentTenant)} gün kaldı
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#801414', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>
              DG
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#1A1D23', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentTenant?.name || 'Demo Galeri'}</div>
              <div style={{ fontSize: '11.5px', color: '#8A929E' }}>Yıllık paket</div>
            </div>
            <button onClick={handlePortalLogout} style={{ background: 'none', border: 'none', color: '#8A929E', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px' }}>logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Top Header */}
        <header style={{ height: '66px', flexShrink: 0, borderBottom: '1px solid #E7E9ED', background: '#fff', display: 'flex', alignItems: 'center', gap: '18px', padding: '0 26px' }}>
          <div>
            <div style={{ fontWeight: 800, fontStyle: 'italic', fontSize: '18px', letterSpacing: '-.4px', color: '#1A1D23' }}>Genel Bakış</div>
            <div style={{ fontSize: '12px', color: '#8A929E', fontWeight: 500 }}>Galerim oto yönetim paneli konsolu</div>
          </div>
          <div style={{ flex: 1, maxWidth: '420px', marginLeft: '14px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '19px', color: '#9AA1AC', position: 'absolute', left: '12px' }}>search</span>
            <input placeholder="Araç, müşteri veya banka ara..." value={adminSearchQuery} onChange={(e) => setAdminSearchQuery(e.target.value)} style={{ width: '100%', height: '40px', border: '1px solid #E2E5EA', borderRadius: '10px', background: '#F7F8FA', padding: '0 14px 0 38px', fontSize: '13.5px', color: '#1A1D23', outline: 'none' }} />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {(activeTab === 'raporlar' || activeTab === 'muhasebe') && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', color: '#6B7280', position: 'absolute', left: '12px', pointerEvents: 'none' }}>calendar_today</span>
                <select 
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)} 
                  style={{ height: '40px', padding: '0 14px 0 36px', border: '1px solid #E2E5EA', background: '#fff', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#46505C', cursor: 'pointer', outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}
                >
                  <option value="2026-07">Temmuz 2026</option>
                  <option value="2026-06">Haziran 2026</option>
                  <option value="2026-05">Mayıs 2026</option>
                  <option value="2026-04">Nisan 2026</option>
                  <option value="2026-03">Mart 2026</option>
                  <option value="2026-02">Şubat 2026</option>
                  <option value="2026-01">Ocak 2026</option>
                </select>
              </div>
            )}
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} style={{ width: '40px', height: '40px', border: '1px solid #E2E5EA', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', color: '#46505C' }}>notifications</span>
                {messages.filter(m => !m.is_read).length > 0 && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-6px', 
                    right: '-6px', 
                    minWidth: '20px', 
                    height: '20px', 
                    borderRadius: '10px', 
                    background: '#E5484D', 
                    color: '#fff', 
                    fontSize: '10px', 
                    fontWeight: 900, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0 5px',
                    boxShadow: '0 2px 5px rgba(229,72,77,0.4)',
                    border: '2px solid #fff'
                  }}>
                    {messages.filter(m => !m.is_read).length}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div style={{ position: 'absolute', right: 0, top: '46px', width: '280px', background: '#fff', border: '1px solid #E2E5EA', borderRadius: '12px', boxShadow: '0 10px 24px rgba(0,0,0,0.1)', zIndex: 100, padding: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', borderBottom: '1px solid #F0F1F4', paddingBottom: '8px', marginBottom: '8px', color: '#1A1D23' }}>Bildirimler</div>
                  {messages.filter(m => !m.is_read).length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {messages.filter(m => !m.is_read).slice(0, 3).map(m => (
                        <div key={m.id} onClick={() => { setActiveTab('mesajlar'); setNotificationsOpen(false); }} style={{ fontSize: '12px', padding: '6px', borderRadius: '6px', background: '#fefaf6', cursor: 'pointer' }}>
                          <strong>{m.sender_name}</strong>: {m.message_text.slice(0, 36)}...
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#8A929E', textAlign: 'center', padding: '12px 0' }}>
                      Henüz yeni bildiriminiz yok.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Work Area */}
        <main style={{ flex: 1, padding: '26px', overflowY: 'auto' }}>
          
          {/* Notification Alert */}
          {alert.message && (
            <div className={`alert-box ${alert.type}`} style={{ padding: '14px 18px', borderRadius: '8px', marginBottom: '20px', fontWeight: 700, fontSize: '13px', background: alert.type === 'success' ? '#e8f5ec' : '#fee2e2', color: alert.type === 'success' ? '#16a34a' : '#991b1b', border: `1px solid ${alert.type === 'success' ? '#22c55e' : '#ef4444'}` }}>
              {alert.message}
            </div>
          )}

          {/* PAGE: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1320px' }}>
              
              {/* Stats Grid Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                
                {/* Card 1: Stoktaki Araç */}
                <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '18px 18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FDF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '23px', color: '#B91C1C' }}>directions_car</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-.8px', marginTop: '14px', color: '#1A1D23' }}>{vehicles.filter(v => v.status === 'stokta').length}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600, marginTop: '1px' }}>Stoktaki Araç</div>
                  <div style={{ fontSize: '11.5px', color: '#9AA1AC', marginTop: '8px', paddingTop: '9px', borderTop: '1px solid #F0F1F4' }}>Toplam {vehicles.length} araç kaydı</div>
                </div>

                {/* Card 2: Stok Değeri */}
                <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '18px 18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#EBF2FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '23px', color: '#2A6FDB' }}>payments</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-.8px', marginTop: '14px', color: '#1A1D23' }}>{formatCur(stockVal)}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600, marginTop: '1px' }}>Stok Değeri</div>
                  <div style={{ fontSize: '11.5px', color: '#9AA1AC', marginTop: '8px', paddingTop: '9px', borderTop: '1px solid #F0F1F4' }}>Alış + ek masraflar</div>
                </div>

                {/* Card 3: Kasa + Banka */}
                <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '18px 18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#EAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '23px', color: '#1F8A5B' }}>account_balance</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-.8px', marginTop: '14px', color: '#1a1d23' }}>{formatCur(totalCash)}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600, marginTop: '1px' }}>Kasa + Banka</div>
                  <div style={{ fontSize: '11.5px', color: '#9AA1AC', marginTop: '8px', paddingTop: '9px', borderTop: '1px solid #F0F1F4' }}>Toplam nakit bakiye</div>
                </div>

                {/* Card 4: Toplam Sermaye */}
                <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '18px 18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FFF6E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '23px', color: '#B54708' }}>account_balance_wallet</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-.8px', marginTop: '14px', color: '#1a1d23' }}>{formatCur(totalCapital)}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600, marginTop: '1px' }}>Toplam Sermaye</div>
                  <div style={{ fontSize: '11.5px', color: '#9AA1AC', marginTop: '8px', paddingTop: '9px', borderTop: '1px solid #F0F1F4' }}>Kasa/Banka + Stok Değeri</div>
                </div>

                {/* Card 5: Stok Hedefi */}
                <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '18px 18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#EAF6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '23px', color: '#1F8A5B' }}>sell</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-.8px', marginTop: '14px', color: '#1A1D23' }}>{formatCur(stockTargetVal)}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600, marginTop: '1px' }}>Stok Hedefi</div>
                  <div style={{ fontSize: '11.5px', color: '#16a34a', marginTop: '8px', paddingTop: '9px', borderTop: '1px solid #F0F1F4', fontWeight: 700 }}>Planlanan toplam satış</div>
                </div>

                {/* Card 6: Toplam Net Kâr */}
                <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '18px 18px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#F4F0FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '23px', color: '#7C5CFC' }}>trending_up</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-.8px', marginTop: '14px', color: '#1A1D23' }}>{formatCur(netProfit)}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600, marginTop: '1px' }}>Toplam Net Kâr</div>
                  <div style={{ fontSize: '11.5px', color: '#b45309', marginTop: '8px', paddingTop: '9px', borderTop: '1px solid #F0F1F4', fontWeight: 700 }}>Hedeflenen Kâr: {formatCur(stockTargetProfit)}</div>
                </div>

              </div>

              {/* Middle Grid: Trend Chart & Son Hareketler */}
              {(() => {
                const trendMonths = getMonthsList();
                const maxVal = Math.max(...trendMonths.map(m => m.ciro), 100000);
                const chartPoints = trendMonths.map((m, i) => {
                  const x = i * 152;
                  const y = 200 - (m.ciro / maxVal) * 160;
                  return { x, y };
                });
                const linePath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const areaPath = chartPoints.length > 0 ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} 240 L 0 240 Z` : 'M 0 240 Z';
                const recentActivities = getRecentActivities();

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: '16px' }}>
                    
                    {/* Gelir Trendi Area Chart */}
                    <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '15px', color: '#1A1D23' }}>Ciro & Gelir Trendi</div>
                          <div style={{ fontSize: '12px', color: '#8A929E' }}>Son 6 ay · sistem üzerinden yapılan araç satışları</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-.5px', color: '#B91C1C' }}>{formatCur(salesCiro)}</div>
                          <div style={{ fontSize: '12px', color: '#1F8A5B', fontWeight: 700 }}>Toplam Satış Hacmi</div>
                        </div>
                      </div>
                      
                      {/* SVG Wave Line Area Chart */}
                      <svg viewBox="0 0 760 240" preserveAspectRatio="none" style={{ width: '100%', height: '200px', display: 'block', marginTop: '14px' }}>
                        <defs>
                          <linearGradient id="revg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#B91C1C" stopOpacity="0.18"></stop>
                            <stop offset="100%" stopColor="#B91C1C" stopOpacity="0"></stop>
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="50" x2="760" y2="50" stroke="#EEF0F3" strokeWidth="1"></line>
                        <line x1="0" y1="100" x2="760" y2="100" stroke="#EEF0F3" strokeWidth="1"></line>
                        <line x1="0" y1="150" x2="760" y2="150" stroke="#EEF0F3" strokeWidth="1"></line>
                        <line x1="0" y1="200" x2="760" y2="200" stroke="#EEF0F3" strokeWidth="1"></line>
                        
                        {/* Area path */}
                        <path d={areaPath} fill="url(#revg)"></path>
                        
                        {/* Line path */}
                        <path d={linePath} fill="none" stroke="#B91C1C" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"></path>
                      </svg>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        {trendMonths.map((m, i) => (
                          <span key={i} style={{ fontSize: '11.5px', color: '#A4ABB5', fontWeight: 600 }}>{m.label}</span>
                        ))}
                      </div>
                    </div>

                    {/* Son Hareketler Panel */}
                    <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '20px' }}>
                      <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1D23', marginBottom: '16px', margin: 0 }}>Son Hareketler</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {recentActivities.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, marginTop: '5px', flexShrink: 0, boxShadow: `0 0 0 3px ${item.color}15` }}></span>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1D23' }}>{item.text}</div>
                              <div style={{ fontSize: '11.5px', color: '#8A929E', marginTop: '2px' }}>{item.val}</div>
                            </div>
                          </div>
                        ))}
                        {recentActivities.length === 0 && (
                          <div style={{ fontSize: '12.5px', color: '#8A929E', textAlign: 'center', fontStyle: 'italic', padding: '24px 0' }}>
                            Henüz kaydedilmiş bir hareket bulunmuyor.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* Bottom: Stoktaki Araçlar */}
              <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '20px 20px 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1D23', margin: 0 }}>Stoktaki Araçlar</h2>
                  <button onClick={() => setActiveTab('araclar')} style={{ background: 'none', border: 'none', color: '#B91C1C', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>Tümünü gör <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '16px' }}>arrow_forward</span></button>
                </div>

                {vehicles.filter(v => v.status === 'stokta').length === 0 ? (
                  <p style={{ color: '#8a8177', fontStyle: 'italic', margin: 0, paddingBottom: '12px' }}>Stokta araç kaydı bulunmuyor.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '12px' }}>
                    {vehicles.filter(v => v.status === 'stokta').slice(0, 3).map(v => (
                      <div key={v.id} style={{ background: '#FAFBFC', border: '1px solid #E7E9ED', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F0F1F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', color: '#6B7280' }}>directions_car</span>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A1D23' }}>{v.brand} {v.model}</div>
                            <div style={{ fontSize: '11.5px', color: '#8A929E', marginTop: '2px' }}>{v.plate} · {v.km.toLocaleString('tr-TR')} km</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '10px', color: '#9AA1AC', fontWeight: 700, textTransform: 'uppercase' }}>Hedef satış</div>
                          <strong style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D23', marginTop: '2px', display: 'block' }}>{formatCur(v.sell_price)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* PAGE: VEHICLE LIST */}
          {activeTab === 'araclar' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.02em' }}>Araç Listesi</h1>
                <div style={{ display: 'flex', gap: '6px', background: '#fff', padding: '4px', borderRadius: '8px', border: '1px solid #ddd6cc' }}>
                  <button onClick={() => setVehicleTab('stokta')} style={{ border: 'none', background: vehicleTab === 'stokta' ? '#1a1a1a' : 'transparent', color: vehicleTab === 'stokta' ? '#fff' : '#5c554c', fontWeight: 700, fontSize: '12.5px', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>Stokta ({vehicles.filter(v => v.status === 'stokta').length})</button>
                  <button onClick={() => setVehicleTab('satildi')} style={{ border: 'none', background: vehicleTab === 'satildi' ? '#1a1a1a' : 'transparent', color: vehicleTab === 'satildi' ? '#fff' : '#5c554c', fontWeight: 700, fontSize: '12.5px', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>Satılan ({vehicles.filter(v => v.status === 'satildi').length})</button>
                  <button onClick={() => setVehicleTab('pasif')} style={{ border: 'none', background: vehicleTab === 'pasif' ? '#1a1a1a' : 'transparent', color: vehicleTab === 'pasif' ? '#fff' : '#5c554c', fontWeight: 700, fontSize: '12.5px', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>Pasif ({vehicles.filter(v => v.status === 'pasif').length})</button>
                </div>
              </div>

              {(vehicleTab === 'stokta' || vehicleTab === 'pasif') ? (
                <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', fontSize: '11px', fontWeight: 700, color: '#8a8177', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 18px' }}>Araç</th>
                        <th>Plaka</th>
                        <th>KM</th>
                        <th>Alış Fiyatı</th>
                        <th>Hedef Satış</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.filter(v => v.status === vehicleTab).filter(v => {
                        if (!adminSearchQuery) return true;
                        const q = adminSearchQuery.toLowerCase();
                        return (v.brand?.toLowerCase().includes(q) || v.model?.toLowerCase().includes(q) || v.plate?.toLowerCase().includes(q));
                      }).map(v => {
                        const isExpanded = expandedVehicle === v.id;
                        const totalVehicleExpenses = expenses.filter(e => e.vehicle_id === v.id).reduce((s, curr) => s + parseFloat(curr.amount), 0);
                        return (
                          <React.Fragment key={v.id}>
                            <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid #f3efe9', fontSize: '13px' }}>
                              <td style={{ padding: '13px 18px' }}>
                                <div style={{ fontWeight: 800 }}>{v.brand} {v.model}</div>
                                <div style={{ fontSize: '11px', color: '#8a8177' }}>{v.year} · {v.fuel_type} · {v.gear_type} · {v.color}</div>
                              </td>
                              <td style={{ fontWeight: 700 }}>{v.plate}</td>
                              <td>{v.km.toLocaleString('tr-TR')} km</td>
                              <td>{formatCur(v.buy_price)}</td>
                              <td style={{ fontWeight: 800 }}>{formatCur(v.sell_price)}</td>
                              <td>
                                <button
                                  onClick={() => setExpandedVehicle(isExpanded ? null : v.id)}
                                  className="btn-secondary"
                                  style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  Detay {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1' }}>
                                <td colSpan="6" style={{ padding: '18px' }}>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '14px' }}>
                                    <div style={{ background: '#fff', border: '1px solid #eee9e1', borderRadius: '8px', padding: '12px' }}>
                                      <div style={{ fontSize: '10.5px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Evrak Durumu</div>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px', fontSize: '11px', fontWeight: 700 }}>
                                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: v.has_ruhsat ? '#e8f5ec' : '#fee2e2', color: v.has_ruhsat ? '#16a34a' : '#991b1b' }}>Ruhsat: {v.has_ruhsat ? 'Var' : 'Yok'}</span>
                                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: v.has_spare_key ? '#e8f5ec' : '#fee2e2', color: v.has_spare_key ? '#16a34a' : '#991b1b' }}>Yedek Anahtar: {v.has_spare_key ? 'Var' : 'Yok'}</span>
                                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: v.has_ruhsat ? '#e8f5ec' : '#fee2e2', color: v.has_ruhsat ? '#16a34a' : '#991b1b' }}>Fatura: {v.has_invoice ? 'Var' : 'Yok'}</span>
                                      </div>
                                    </div>
                                    <div style={{ background: '#fff', border: '1px solid #eee9e1', borderRadius: '8px', padding: '12px' }}>
                                      <div style={{ fontSize: '10.5px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Hasar & Tramer</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', fontSize: '12px' }}>
                                        <div><strong>Tramer Kaydı:</strong> {formatCur(v.tramer_amount)}</div>
                                        <div style={{ color: v.is_heavy_damage ? '#b91c1c' : '#16a34a', fontWeight: 700 }}>{v.is_heavy_damage ? '⚠️ Ağır Hasarlı' : '✓ Ağır Hasar Yok'}</div>
                                      </div>
                                    </div>
                                    <div style={{ background: '#fff', border: '1px solid #eee9e1', borderRadius: '8px', padding: '12px' }}>
                                      <div style={{ fontSize: '10.5px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Alış Bilgileri & Masraf</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', fontSize: '12px' }}>
                                        <div><strong>Alınan Kişi:</strong> {v.seller_name} ({v.seller_phone})</div>
                                        <div><strong>Toplam Ek Masraf:</strong> <span style={{ color: '#b45309', fontWeight: 700 }}>{formatCur(totalVehicleExpenses)}</span></div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Action buttons inside details */}
                                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button
                                      onClick={() => {
                                        setSatisForm({ ...satisForm, vehicle_id: v.id, sell_price: v.sell_price });
                                        setActiveTab('arac-satis');
                                      }}
                                      className="btn-primary"
                                      style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                                    >
                                      Bu Aracı Sat
                                    </button>
                                    <button
                                      onClick={() => {
                                        setMasrafForm({ ...masrafForm, vehicle_id: v.id });
                                        setActiveTab('masraf-ekle');
                                      }}
                                      className="btn-secondary"
                                      style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
                                    >
                                      Masraf Ekle
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingVehicle(v);
                                        setEditVehicleForm({ ...v });
                                        
                                        // Populate editSlots
                                        let existingUrls = [];
                                        try {
                                          existingUrls = v.image_url ? JSON.parse(v.image_url) : [];
                                          if (!Array.isArray(existingUrls)) existingUrls = [v.image_url];
                                        } catch (e) {
                                          if (v.image_url) existingUrls = [v.image_url];
                                        }
                                        const initialSlots = Array(10).fill(null);
                                        existingUrls.forEach((url, i) => {
                                          if (i < 10) initialSlots[i] = url;
                                        });
                                        setEditSlots(initialSlots);
                                      }}
                                      className="btn-secondary"
                                      style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', border: '1px solid #2A6FDB', color: '#2A6FDB' }}
                                    >
                                      Düzenle
                                    </button>
                                    <button
                                      onClick={async () => {
                                        const newStatus = v.status === 'stokta' ? 'pasif' : 'stokta';
                                        try {
                                          const { error } = await supabase.from('vehicles').update({ status: newStatus }).eq('id', v.id);
                                          if (error) throw error;
                                          setVehicles(vehicles.map(item => item.id === v.id ? { ...item, status: newStatus } : item));
                                          triggerAlert('success', `Araç durumu başarıyla ${newStatus === 'stokta' ? 'Stokta' : 'Pasif'} olarak güncellendi.`);
                                        } catch (err) {
                                          alert('Hata: ' + err.message);
                                        }
                                      }}
                                      className="btn-secondary"
                                      style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', border: '1px solid #b45309', color: '#b45309' }}
                                    >
                                      {v.status === 'stokta' ? 'Pasife Al' : 'Stoğa Geri Al'}
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (!confirm(`${v.brand} ${v.model} aracını silmek istediğinize emin misiniz?`)) return;
                                        try {
                                          let urlsToDelete = [];
                                          if (v.image_url) {
                                            try {
                                              const parsed = JSON.parse(v.image_url);
                                              if (Array.isArray(parsed)) {
                                                urlsToDelete = parsed;
                                              }
                                            } catch (e) {
                                              if (typeof v.image_url === 'string') {
                                                urlsToDelete = [v.image_url];
                                              }
                                            }
                                          }
                                          const { error } = await supabase.from('vehicles').delete().eq('id', v.id);
                                          if (error) throw error;
                                          if (urlsToDelete.length > 0) {
                                            fetch('https://ilan.galerim.app/delete_image.php', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ urls: urlsToDelete })
                                            }).then(r => r.json())
                                              .then(data => console.log('Sunucu resim silme sonucu:', data))
                                              .catch(err => console.error('Sunucu resim silme hatası:', err));
                                          }
                                          setVehicles(vehicles.filter(item => item.id !== v.id));
                                          triggerAlert('success', 'Araç ve sunucudaki resimleri başarıyla silindi.');
                                        } catch (err) {
                                          alert('Silinirken hata oluştu: ' + err.message);
                                        }
                                      }}
                                      className="btn-secondary"
                                      style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', border: '1px solid #b91c1c', color: '#b91c1c' }}
                                    >
                                      Sil
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', fontSize: '11px', fontWeight: 700, color: '#8a8177', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 18px' }}>Araç</th>
                        <th>Alış Fiyatı</th>
                        <th>Masraflar</th>
                        <th>Satış Fiyatı</th>
                        <th>Satış Tarihi</th>
                        <th>Net Kâr</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map(s => {
                        const karVal = parseFloat(s.net_profit || 0);
                        const totalExpensesForSold = expenses.filter(e => e.vehicle_id === s.vehicle_id).reduce((sum, curr) => sum + parseFloat(curr.amount), 0);
                        const vObj = vehicles.find(v => v.id === s.vehicle_id);
                        return (
                          <tr key={s.id} style={{ borderBottom: '1px solid #f3efe9', fontSize: '13px' }}>
                            <td style={{ padding: '13px 18px' }}>
                              <div style={{ fontWeight: 800 }}>{vObj?.brand} {vObj?.model}</div>
                              <div style={{ fontSize: '11px', color: '#8a8177' }}>{vObj?.plate}</div>
                            </td>
                            <td>{formatCur(vObj?.buy_price)}</td>
                            <td style={{ color: '#b45309' }}>{formatCur(totalExpensesForSold)}</td>
                            <td style={{ fontWeight: 700 }}>{formatCur(s.sell_price)}</td>
                            <td style={{ color: '#8a8177' }}>{new Date(s.sale_date).toLocaleDateString('tr-TR')}</td>
                            <td style={{ fontWeight: 900, color: karVal >= 0 ? '#16a34a' : '#b91c1c' }}>{formatCur(karVal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PAGE: ADD VEHICLE */}
          {activeTab === 'arac-alis' && (
            <div className="fade-in">
              <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>Araç Alış (Stoka Ekle)</h1>
              
              <form onSubmit={handleAddVehicle} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Araç Künyesi */}
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '14px' }}>Temel Bilgiler</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Marka *</span>
                        {customBrandMode ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input type="text" className="input-field" required value={customBrandInput} onChange={(e) => setCustomBrandInput(e.target.value)} placeholder="Marka Yazın" />
                            <button type="button" onClick={() => { setCustomBrandMode(false); setSelectedBrand(''); }} style={{ border: '1px solid #E2E5EA', background: '#fff', borderRadius: '8px', padding: '0 8px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>Liste</button>
                          </div>
                        ) : (
                          <select
                            className="input-field"
                            required
                            value={selectedBrand}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '__custom__') {
                                setCustomBrandMode(true);
                                setSelectedBrand('');
                                setSelectedModel('');
                                setSelectedVersion('');
                                setCustomModelMode(true);
                                setCustomVersionMode(true);
                              } else {
                                setSelectedBrand(val);
                                setSelectedModel('');
                                setSelectedVersion('');
                                setCustomModelMode(false);
                                setCustomVersionMode(false);
                              }
                            }}
                          >
                            <option value="">-- Seçin --</option>
                            {Object.keys(CAR_DATA).map(b => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                            <option value="__custom__">✍️ Diğer (Kendim Yazacağım)</option>
                          </select>
                        )}
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Model *</span>
                        {customModelMode ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input type="text" className="input-field" required value={customModelInput} onChange={(e) => setCustomModelInput(e.target.value)} placeholder="Model Yazın" />
                            {!customBrandMode && (
                              <button type="button" onClick={() => { setCustomModelMode(false); setSelectedModel(''); }} style={{ border: '1px solid #E2E5EA', background: '#fff', borderRadius: '8px', padding: '0 8px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>Liste</button>
                            )}
                          </div>
                        ) : (
                          <select
                            className="input-field"
                            required
                            value={selectedModel}
                            disabled={!selectedBrand}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '__custom__') {
                                setCustomModelMode(true);
                                setSelectedModel('');
                                setSelectedVersion('');
                                setCustomVersionMode(true);
                              } else {
                                setSelectedModel(val);
                                setSelectedVersion('');
                                setCustomVersionMode(false);
                              }
                            }}
                          >
                            <option value="">-- Seçin --</option>
                            {selectedBrand && CAR_DATA[selectedBrand] && Object.keys(CAR_DATA[selectedBrand]).map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                            <option value="__custom__">✍️ Diğer (Kendim Yazacağım)</option>
                          </select>
                        )}
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Versiyon / Donanım *</span>
                        {customVersionMode ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input type="text" className="input-field" value={customVersionInput} onChange={(e) => setCustomVersionInput(e.target.value)} placeholder="Versiyon Yazın" />
                            {!customModelMode && (
                              <button type="button" onClick={() => { setCustomVersionMode(false); setSelectedVersion(''); }} style={{ border: '1px solid #E2E5EA', background: '#fff', borderRadius: '8px', padding: '0 8px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>Liste</button>
                            )}
                          </div>
                        ) : (
                          <select
                            className="input-field"
                            value={selectedVersion}
                            disabled={!selectedModel}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '__custom__') {
                                setCustomVersionMode(true);
                                setSelectedVersion('');
                              } else {
                                setSelectedVersion(val);
                              }
                            }}
                          >
                            <option value="">-- Seçin --</option>
                            {selectedBrand && selectedModel && CAR_DATA[selectedBrand]?.[selectedModel] && CAR_DATA[selectedBrand][selectedModel].map(v => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                            <option value="__custom__">✍️ Diğer (Kendim Yazacağım)</option>
                          </select>
                        )}
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Plaka</span>
                        <input type="text" className="input-field" value={aracForm.plate} onChange={(e) => setAracForm({ ...aracForm, plate: e.target.value })} placeholder="34 ABC 123" />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>KM</span>
                        <input type="text" className="input-field" value={aracForm.km ? formatNumberInput(aracForm.km) : ''} onChange={(e) => setAracForm({ ...aracForm, km: parseNumberInput(e.target.value) })} placeholder="85.000" />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Model Yılı</span>
                        <input type="number" className="input-field" value={aracForm.year} onChange={(e) => setAracForm({ ...aracForm, year: e.target.value })} placeholder="2021" />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Renk</span>
                        <input type="text" className="input-field" value={aracForm.color} onChange={(e) => setAracForm({ ...aracForm, color: e.target.value })} placeholder="Beyaz" />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Yakıt Tipi</span>
                        <select className="input-field" value={aracForm.fuel_type} onChange={(e) => setAracForm({ ...aracForm, fuel_type: e.target.value })}>
                          <option>Benzin</option>
                          <option>Dizel</option>
                          <option>LPG</option>
                          <option>Hibrit</option>
                          <option>Elektrik</option>
                        </select>
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Vites Tipi</span>
                        <select className="input-field" value={aracForm.gear_type} onChange={(e) => setAracForm({ ...aracForm, gear_type: e.target.value })}>
                          <option>Otomatik</option>
                          <option>Manuel</option>
                          <option>Yarı Otomatik</option>
                        </select>
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Kasa Tipi</span>
                        <select className="input-field" value={aracForm.body_type} onChange={(e) => setAracForm({ ...aracForm, body_type: e.target.value })}>
                          <option>Sedan</option>
                          <option>Hatchback 5 kapı</option>
                          <option>Hatchback 3 kapı</option>
                          <option>Coupe</option>
                          <option>Coupe 4 kapı</option>
                          <option>Cabrio</option>
                          <option>Station Wagon</option>
                          <option>MPV</option>
                          <option>Roadster</option>
                          <option>SUV</option>
                          <option>Arazi</option>
                          <option>Panelvan</option>
                          <option>Minivan</option>
                          <option>Motosiklet</option>
                        </select>
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Alış Tarihi</span>
                        <input type="date" className="input-field" value={aracForm.buy_date} onChange={(e) => setAracForm({ ...aracForm, buy_date: e.target.value })} />
                      </label>
                    </div>
                  </div>

                  {/* Fiyat ve Alış Bilgileri */}
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '14px' }}>Alış Bilgileri</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Alış Fiyatı (₺) *</span>
                        <input type="text" className="input-field" required value={aracForm.buy_price ? formatNumberInput(aracForm.buy_price) : ''} onChange={(e) => setAracForm({ ...aracForm, buy_price: parseNumberInput(e.target.value) })} placeholder="850.000" style={{ fontWeight: 700 }} />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Hedef Satış Fiyatı (₺)</span>
                        <input type="text" className="input-field" value={aracForm.sell_price ? formatNumberInput(aracForm.sell_price) : ''} onChange={(e) => setAracForm({ ...aracForm, sell_price: parseNumberInput(e.target.value) })} placeholder="950.000" style={{ fontWeight: 700 }} />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Alınan Kişi</span>
                        <input type="text" className="input-field" value={aracForm.seller_name} onChange={(e) => setAracForm({ ...aracForm, seller_name: e.target.value })} placeholder="Ad Soyad" />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Telefon</span>
                        <input type="text" className="input-field" value={aracForm.seller_phone} onChange={(e) => setAracForm({ ...aracForm, seller_phone: e.target.value })} placeholder="05xx xxx xx xx" />
                      </label>
                    </div>

                    {/* Evrak checklist */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12.5px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input type="checkbox" checked={aracForm.has_spare_key} onChange={(e) => setAracForm({ ...aracForm, has_spare_key: e.target.checked })} /> Yedek Anahtar Var
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input type="checkbox" checked={aracForm.has_ruhsat} onChange={(e) => setAracForm({ ...aracForm, has_ruhsat: e.target.checked })} /> Ruhsat Var
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input type="checkbox" checked={aracForm.has_invoice} onChange={(e) => setAracForm({ ...aracForm, has_invoice: e.target.checked })} /> Fatura Var
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input type="checkbox" checked={aracForm.has_kasko} onChange={(e) => setAracForm({ ...aracForm, has_kasko: e.target.checked })} /> Kaskolu
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input type="checkbox" checked={aracForm.has_sigorta} onChange={(e) => setAracForm({ ...aracForm, has_sigorta: e.target.checked })} /> Trafik Sigortası Var
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input type="checkbox" checked={aracForm.has_warranty} onChange={(e) => setAracForm({ ...aracForm, has_warranty: e.target.checked })} /> Garantisi Var
                      </label>
                    </div>
                  </div>
                </div>

                {/* Ekspertiz Raporu */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '88px' }}>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '6px' }}>Ekspertiz Raporu</h2>
                    <p style={{ fontSize: '11px', color: '#8a8177', marginBottom: '14px' }}>Değiştirmek için parçaya tıklayın</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {Object.keys(expertise).map(key => {
                        const partVal = expertise[key];
                        const styles = getPartColor(partVal);
                        const displayName = key.replaceAll('_', ' ').toUpperCase();
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => toggleExpertise(key)}
                            style={{ padding: '8px', border: `1px solid ${styles.bc}`, background: styles.bg, color: styles.color, borderRadius: '8px', fontWeight: 700, fontSize: '10.5px', textTransform: 'capitalize', cursor: 'pointer', outline: 'none' }}
                          >
                            <div>{displayName}</div>
                            <div style={{ fontSize: '9px', opacity: 0.8, textTransform: 'uppercase' }}>{partVal}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                        <input type="checkbox" checked={aracForm.is_heavy_damage} onChange={(e) => setAracForm({ ...aracForm, is_heavy_damage: e.target.checked })} /> ⚠️ Ağır Hasar Kayıtlı
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px' }}>
                        <input type="checkbox" checked={aracForm.is_consignment} onChange={(e) => setAracForm({ ...aracForm, is_consignment: e.target.checked })} /> Araç Konsinye (Emanet)
                      </label>
                    </div>

                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F0F1F4' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '8px' }}>Araç Resimleri (Maks. 10 Adet)</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginTop: '8px' }}>
                        {Array.from({ length: 10 }).map((_, idx) => {
                          const file = aracFiles[idx];
                          const previewUrl = file ? URL.createObjectURL(file) : null;
                          return (
                            <div key={idx} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#F2F4F7', border: '1px dashed #D0D5DD', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              {previewUrl ? (
                                <>
                                  <img src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <button type="button" onClick={() => {
                                    const newFiles = [...aracFiles];
                                    newFiles[idx] = null;
                                    setAracFiles(newFiles);
                                  }} style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
                                </>
                              ) : (
                                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#98A2B3' }}>add</span>
                                  <span style={{ fontSize: '9px', color: '#98A2B3', marginTop: '2px' }}>#{idx+1}</span>
                                  <input type="file" accept="image/*" onChange={(e) => {
                                    const selectedFile = e.target.files[0];
                                    if (selectedFile) {
                                      const newFiles = [...aracFiles];
                                      newFiles[idx] = selectedFile;
                                      setAracFiles(newFiles);
                                    }
                                  }} style={{ display: 'none' }} />
                                </label>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button type="submit" disabled={isSavingVehicle} className="btn-primary" style={{ width: '100%', marginTop: '18px', padding: '13px', borderRadius: '10px', fontSize: '14px', opacity: isSavingVehicle ? 0.6 : 1, cursor: isSavingVehicle ? 'not-allowed' : 'pointer' }}>
                      {isSavingVehicle ? 'Kaydediliyor, lütfen bekleyin...' : 'Aracı Kaydet ve Stoka Ekle'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* PAGE: ADD EXPENSE */}
          {activeTab === 'masraf-ekle' && (
            <div className="fade-in" style={{ maxWidth: '580px', margin: '0 auto' }}>
              <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '24px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>Gider Kaydet</h1>
                
                <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Araç Seçin (Opsiyonel)</span>
                    <select
                      className="input-field"
                      value={masrafForm.vehicle_id}
                      onChange={(e) => setMasrafForm({ ...masrafForm, vehicle_id: e.target.value })}
                    >
                      <option value="">-- Genel Gider (Araçsız) --</option>
                      {vehicles.filter(v => v.status === 'stokta').map(v => (
                        <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate})</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Gider Tipi</span>
                    <select
                      className="input-field"
                      value={masrafForm.expense_type}
                      onChange={(e) => setMasrafForm({ ...masrafForm, expense_type: e.target.value })}
                    >
                      <option value="yakit">Yakıt</option>
                      <option value="bakim">Bakım / Onarım</option>
                      <option value="sigorta">Sigorta / Kasko</option>
                      <option value="vergisi">Vergisi</option>
                      <option value="muayene">Muayene</option>
                      <option value="lastik">Lastik</option>
                      <option value="yikama">Temizlik / Yıkama</option>
                      <option value="noter">Noter Masrafı</option>
                      <option value="personel">Personel Gideri</option>
                      <option value="isletme">İşletme Gideri</option>
                      <option value="diger">Diğer / Genel Gider</option>
                    </select>
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Tutar (₺) *</span>
                      <input type="number" className="input-field" required value={masrafForm.amount} onChange={(e) => setMasrafForm({ ...masrafForm, amount: e.target.value })} placeholder="0.00" />
                    </label>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Masraf Tarihi</span>
                      <input type="date" className="input-field" value={masrafForm.expense_date} onChange={(e) => setMasrafForm({ ...masrafForm, expense_date: e.target.value })} />
                    </label>
                  </div>

                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Hangi Hesaptan Ödenecek? *</span>
                    <select
                      className="input-field"
                      required
                      value={masrafForm.bank_id}
                      onChange={(e) => setMasrafForm({ ...masrafForm, bank_id: e.target.value })}
                    >
                      <option value="">-- Kasa / Banka Seçin --</option>
                      {banks.map(b => (
                        <option key={b.id} value={b.id}>{b.bank_name} ({b.account_name}) - Bakiye: {formatCur(b.balance)}</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Açıklama / Not</span>
                    <textarea className="input-field" rows="2" value={masrafForm.description} onChange={(e) => setMasrafForm({ ...masrafForm, description: e.target.value })}></textarea>
                  </label>

                  <button type="submit" className="btn-primary" style={{ padding: '12px', borderRadius: '8px', fontSize: '14px', marginTop: '10px' }}>
                    Gideri Kaydet
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* PAGE: VEHICLE SALE */}
          {activeTab === 'arac-satis' && (
            <div className="fade-in" style={{ maxWidth: '580px', margin: '0 auto' }}>
              <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '24px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>Araç Satış</h1>
                
                <form onSubmit={handleSellVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Satılacak Araç *</span>
                    <select
                      className="input-field"
                      required
                      value={satisForm.vehicle_id}
                      onChange={(e) => {
                        const targetV = vehicles.find(v => v.id === e.target.value);
                        setSatisForm({ ...satisForm, vehicle_id: e.target.value, sell_price: targetV ? targetV.sell_price : '' });
                      }}
                    >
                      <option value="">-- Araç Seçin --</option>
                      {vehicles.filter(v => v.status === 'stokta').map(v => (
                        <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate})</option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Alıcı Müşteri</span>
                    <select
                      className="input-field"
                      value={satisForm.customer_id}
                      onChange={(e) => setSatisForm({ ...satisForm, customer_id: e.target.value })}
                    >
                      <option value="">-- Müşteri Seçin (İsteğe Bağlı) --</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name_surname} ({c.phone})</option>
                      ))}
                    </select>
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Satış Fiyatı (₺) *</span>
                      <input type="number" className="input-field" required value={satisForm.sell_price} onChange={(e) => setSatisForm({ ...satisForm, sell_price: e.target.value })} placeholder="0.00" style={{ fontWeight: 700 }} />
                    </label>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Noter Gideri (₺)</span>
                      <input type="number" className="input-field" value={satisForm.notary_expense} onChange={(e) => setSatisForm({ ...satisForm, notary_expense: e.target.value })} placeholder="0.00" />
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Satış Tarihi</span>
                      <input type="date" className="input-field" value={satisForm.sale_date} onChange={(e) => setSatisForm({ ...satisForm, sale_date: e.target.value })} />
                    </label>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Tahsilat Hesabı *</span>
                      <select
                        className="input-field"
                        required
                        value={satisForm.bank_id}
                        onChange={(e) => setSatisForm({ ...satisForm, bank_id: e.target.value })}
                      >
                        <option value="">-- Kasa / Banka Seçin --</option>
                        {banks.map(b => (
                          <option key={b.id} value={b.id}>{b.bank_name} ({b.account_name})</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '12px', borderRadius: '8px', fontSize: '14px', marginTop: '10px' }}>
                    Satışı Kaydet ve Faturayı Kes
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* PAGE: BANKS */}
          {activeTab === 'bankalar' && (
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', alignItems: 'start' }}>
              
              {/* Hesap Ekleme */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Banka / Kasa Hesapları</h2>
                  
                  <form onSubmit={handleAddBank} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="text" className="input-field" required placeholder="Banka Adı (Örn. YapıKredi)" value={bankForm.bank_name} onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })} />
                      <input type="text" className="input-field" required placeholder="Hesap Türü (Örn. Ticari TL)" value={bankForm.account_name} onChange={(e) => setBankForm({ ...bankForm, account_name: e.target.value })} />
                    </div>
                    <input type="text" className="input-field" placeholder="IBAN Numarası" value={bankForm.iban} onChange={(e) => setBankForm({ ...bankForm, iban: e.target.value })} />
                    <input type="number" className="input-field" placeholder="Başlangıç Bakiyesi" value={bankForm.balance} onChange={(e) => setBankForm({ ...bankForm, balance: e.target.value })} />
                    <button type="submit" className="btn-primary" style={{ padding: '9px', borderRadius: '8px', fontSize: '12.5px', marginTop: '4px' }}>Hesap Ekle</button>
                  </form>

                  {/* List banks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {banks.map(b => (
                      <div key={b.id} style={{ background: '#faf8f5', border: '1px solid #eee9e1', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{b.bank_name}</div>
                          <div style={{ fontSize: '11px', color: '#8a8177', marginTop: '2px' }}>{b.account_name} {b.iban && `· ${b.iban}`}</div>
                        </div>
                        <div style={{ fontWeight: 900, fontSize: '15px' }}>{formatCur(b.balance)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Çek & Senetler */}
              <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Çek & Senet Portföyü</h2>
                
                <form onSubmit={handleAddDoc} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px', alignItems: 'end' }}>
                  <select className="input-field" value={docForm.type} onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}>
                    <option value="cek">Çek</option>
                    <option value="senet">Senet</option>
                  </select>
                  <input type="number" className="input-field" required placeholder="Tutar" value={docForm.amount} onChange={(e) => setDocForm({ ...docForm, amount: e.target.value })} />
                  <input type="date" className="input-field" required value={docForm.due_date} onChange={(e) => setDocForm({ ...docForm, due_date: e.target.value })} />
                  <input type="text" className="input-field" required placeholder="Borçlu Kişi/Firma" value={docForm.debtor} onChange={(e) => setDocForm({ ...docForm, debtor: e.target.value })} style={{ gridColumn: 'span 2' }} />
                  <button type="submit" className="btn-primary" style={{ padding: '9px', borderRadius: '8px', fontSize: '12.5px' }}>Belge Ekle</button>
                </form>

                {/* List Documents */}
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', fontSize: '11px', fontWeight: 700, color: '#8a8177', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 12px' }}>Tür</th>
                      <th>Borçlu</th>
                      <th>Vade</th>
                      <th>Tutar</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(d => (
                      <tr key={d.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, textTransform: 'uppercase', color: d.type === 'cek' ? '#1e64d4' : '#b45309' }}>{d.type}</td>
                        <td>{d.debtor}</td>
                        <td>{new Date(d.due_date).toLocaleDateString('tr-TR')}</td>
                        <td style={{ fontWeight: 700 }}>{formatCur(d.amount)}</td>
                        <td>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, background: d.status === 'bekliyor' ? '#fef3c7' : '#e8f5ec', color: d.status === 'bekliyor' ? '#d97706' : '#16a34a' }}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PAGE: CUSTOMERS */}
          {activeTab === 'musteriler' && (
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', alignItems: 'start' }}>
              
              {/* Müşteri Ekle */}
              <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Yeni Müşteri Ekle</h2>
                <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Adı Soyadı / Firma *</span>
                    <input type="text" className="input-field" required value={customerForm.name_surname} onChange={(e) => setCustomerForm({ ...customerForm, name_surname: e.target.value })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Telefon *</span>
                    <input type="text" className="input-field" required value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>E-posta</span>
                    <input type="email" className="input-field" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Notlar</span>
                    <textarea className="input-field" rows="2" value={customerForm.notes} onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}></textarea>
                  </label>
                  <button type="submit" className="btn-primary" style={{ padding: '10px', borderRadius: '8px', fontSize: '13px', marginTop: '6px' }}>
                    Müşteri Kaydet
                  </button>
                </form>
              </div>

              {/* Müşteriler Listesi */}
              <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Cari Müşteri Listesi</h2>
                {customers.length === 0 ? (
                  <p style={{ color: '#8a8177', fontStyle: 'italic' }}>Müşteri kaydı bulunamadı.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', fontSize: '11px', fontWeight: 700, color: '#8a8177', textTransform: 'uppercase' }}>
                        <th style={{ padding: '8px 12px' }}>Müşteri</th>
                        <th>Telefon</th>
                        <th>E-posta</th>
                        <th>Notlar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 700 }}>{c.name_surname}</td>
                          <td>{c.phone}</td>
                          <td>{c.email || '-'}</td>
                          <td style={{ color: '#8a8177' }}>{c.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* PAGE: PERSONNEL */}
          {activeTab === 'personel' && (
            <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', alignItems: 'start' }}>
              
              {/* Personel Ekle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Yeni Personel Ekle</h2>
                  <form onSubmit={handleAddPersonnel} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="text" className="input-field" required placeholder="Adı" value={personnelForm.first_name} onChange={(e) => setPersonnelForm({ ...personnelForm, first_name: e.target.value })} />
                      <input type="text" className="input-field" required placeholder="Soyadı" value={personnelForm.last_name} onChange={(e) => setPersonnelForm({ ...personnelForm, last_name: e.target.value })} />
                    </div>
                    <input type="text" className="input-field" required placeholder="Telefon" value={personnelForm.phone} onChange={(e) => setPersonnelForm({ ...personnelForm, phone: e.target.value })} />
                    <input type="email" className="input-field" placeholder="E-posta" value={personnelForm.email} onChange={(e) => setPersonnelForm({ ...personnelForm, email: e.target.value })} />
                    <input type="number" className="input-field" placeholder="Aylık Maaş (₺)" value={personnelForm.salary} onChange={(e) => setPersonnelForm({ ...personnelForm, salary: e.target.value })} />
                    <button type="submit" className="btn-primary" style={{ padding: '9px', borderRadius: '8px', fontSize: '12.5px', marginTop: '4px' }}>Kaydet</button>
                  </form>
                </div>
                
                <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Personel Listesi</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {personnel.map(p => (
                      <div key={p.id} style={{ background: '#faf8f5', border: '1px solid #eee9e1', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{p.first_name} {p.last_name}</div>
                          <div style={{ fontSize: '11px', color: '#8a8177' }}>Tel: {p.phone}</div>
                        </div>
                        <div style={{ fontWeight: 800 }}>Maaş: {formatCur(p.salary)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personel Ödeme Ekle */}
              <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Personele Ödeme Yap</h2>
                <form onSubmit={handlePayPersonnel} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Personel Seçin *</span>
                    <select
                      className="input-field"
                      required
                      value={payForm.personnel_id}
                      onChange={(e) => setPayForm({ ...payForm, personnel_id: e.target.value })}
                    >
                      <option value="">-- Personel Seçin --</option>
                      {personnel.map(p => (
                        <option key={p.id} value={p.id}>{p.first_name} {p.last_name} (Maaş: {formatCur(p.salary)})</option>
                      ))}
                    </select>
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Ödeme Tutar *</span>
                      <input type="number" className="input-field" required value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })} />
                    </label>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Ödeme Tipi</span>
                      <select className="input-field" value={payForm.payment_type} onChange={(e) => setPayForm({ ...payForm, payment_type: e.target.value })}>
                        <option value="maas">Maaş</option>
                        <option value="prim">Prim / Prim Ödemesi</option>
                        <option value="avans">Avans</option>
                        <option value="diger">Diğer</option>
                      </select>
                    </label>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Ödeme Tarihi</span>
                      <input type="date" className="input-field" value={payForm.payment_date} onChange={(e) => setPayForm({ ...payForm, payment_date: e.target.value })} />
                    </label>
                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Kasa / Banka Hesabı *</span>
                      <select
                        className="input-field"
                        required
                        value={payForm.bank_id}
                        onChange={(e) => setPayForm({ ...payForm, bank_id: e.target.value })}
                      >
                        <option value="">-- Kasa / Banka Seçin --</option>
                        {banks.map(b => (
                          <option key={b.id} value={b.id}>{b.bank_name} ({b.account_name})</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '11px', borderRadius: '8px', fontSize: '13px', marginTop: '6px' }}>Ödemeyi Tamamla</button>
                </form>
              </div>
            </div>
          )}

          {/* PAGE: REPORTS */}
          {activeTab === 'raporlar' && (() => {
            const periodBuys = vehicles.filter(v => v.buy_date && v.buy_date.startsWith(selectedPeriod));
            const periodSales = sales.filter(s => s.sale_date && s.sale_date.startsWith(selectedPeriod));
            const periodExpenses = expenses.filter(e => e.expense_date && e.expense_date.startsWith(selectedPeriod));
            
            const periodCiro = periodSales.reduce((acc, curr) => acc + parseFloat(curr.sell_price || 0), 0);
            const periodBuyCostSum = periodSales.reduce((acc, curr) => acc + (vehicles.find(v => v.id === curr.vehicle_id)?.buy_price || 0), 0);
            const periodExpensesSum = periodExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
            const periodNetProfit = periodSales.reduce((acc, curr) => acc + parseFloat(curr.net_profit || 0), 0);
            const periodNetProfitAfterExpenses = periodNetProfit - periodExpensesSum;

            const sortedPeriodSales = [...periodSales].sort((a, b) => parseFloat(b.net_profit || 0) - parseFloat(a.net_profit || 0));
            const mostProfitableSale = sortedPeriodSales[0];
            const mostProfitableVehicleText = mostProfitableSale 
              ? `${mostProfitableSale.vehicles?.brand} ${mostProfitableSale.vehicles?.model} (${mostProfitableSale.vehicles?.plate || ''})` 
              : 'Bulunmamaktadır';
            const mostProfitableVehicleProfit = mostProfitableSale ? parseFloat(mostProfitableSale.net_profit || 0) : 0;

            const monthsMap = {
              '2026-07': 'Temmuz 2026',
              '2026-06': 'Haziran 2026',
              '2026-05': 'Mayıs 2026',
              '2026-04': 'Nisan 2026',
              '2026-03': 'Mart 2026',
              '2026-02': 'Şubat 2026',
              '2026-01': 'Ocak 2026'
            };
            const periodLabel = monthsMap[selectedPeriod] || selectedPeriod;

            return (
              <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Finansal Raporlama</h1>
                    <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px', fontWeight: 500 }}>{periodLabel} dönemine ait performans analizleri</div>
                  </div>
                </div>

                {/* Summary Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Alınan Araçlar</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, marginTop: '4px' }}>{periodBuys.length} Adet</div>
                    <div style={{ fontSize: '11px', color: '#8a8177', marginTop: '2px' }}>Toplam satın alım yapılan</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Satılan Araçlar</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, marginTop: '4px' }}>{periodSales.length} Adet</div>
                    <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px', fontWeight: 700 }}>{formatCur(periodCiro)} Ciro</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Toplam Masraf</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, marginTop: '4px', color: '#b91c1c' }}>{formatCur(periodExpensesSum)}</div>
                    <div style={{ fontSize: '11px', color: '#8a8177', marginTop: '2px' }}>Araç + Genel giderler</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase' }}>Net Kâr (Masraf Düşülmüş)</div>
                    <div style={{ fontSize: '22px', fontWeight: 900, marginTop: '4px', color: periodNetProfitAfterExpenses >= 0 ? '#16a34a' : '#b91c1c' }}>
                      {formatCur(periodNetProfitAfterExpenses)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8a8177', marginTop: '2px' }}>Net araç satış kârı: {formatCur(periodNetProfit)}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  {/* Left Side: Most profitable & details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* En Çok Kâr Getiren Araç */}
                    <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: '12px', padding: '20px', color: '#fff' }}>
                      <div style={{ fontSize: '12px', color: '#c7d2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>En Çok Kâr Getiren Araç</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '8px' }}>{mostProfitableVehicleText}</div>
                      {mostProfitableSale && (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                          <span style={{ fontSize: '26px', fontWeight: 900, color: '#34d399' }}>+{formatCur(mostProfitableVehicleProfit)}</span>
                          <span style={{ fontSize: '12px', color: '#c7d2fe' }}>net kâr</span>
                        </div>
                      )}
                    </div>

                    {/* Rapor Detay Listesi */}
                    <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                      <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 14px 0' }}>Dönem Finansal Detayları</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3efe9', paddingBottom: '8px' }}>
                          <span style={{ color: '#5c554c', fontSize: '13.5px' }}>Araç Satış Hacmi (Ciro):</span>
                          <strong style={{ fontSize: '14.5px' }}>{formatCur(periodCiro)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3efe9', paddingBottom: '8px' }}>
                          <span style={{ color: '#5c554c', fontSize: '13.5px' }}>Satılan Araçların Alış Maliyeti:</span>
                          <strong style={{ fontSize: '14.5px' }}>{formatCur(periodBuyCostSum)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3efe9', paddingBottom: '8px' }}>
                          <span style={{ color: '#5c554c', fontSize: '13.5px' }}>Brüt Satış Kârı:</span>
                          <strong style={{ fontSize: '14.5px', color: '#16a34a' }}>{formatCur(periodNetProfit)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3efe9', paddingBottom: '8px' }}>
                          <span style={{ color: '#5c554c', fontSize: '13.5px' }}>Dönem Boyunca Yapılan Harcamalar (Masraflar):</span>
                          <strong style={{ fontSize: '14.5px', color: '#b91c1c' }}>{formatCur(periodExpensesSum)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '14px' }}>Dönem Net Kârı:</span>
                          <strong style={{ color: periodNetProfitAfterExpenses >= 0 ? '#16a34a' : '#b91c1c', fontSize: '17px', fontWeight: 900 }}>
                            {formatCur(periodNetProfitAfterExpenses)}
                          </strong>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Side: Expense Categories distribution (Chart-like) */}
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 14px 0' }}>Gider Kategorileri Dağılımı</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        { key: 'yakit', label: 'Yakıt' },
                        { key: 'bakim', label: 'Bakım & Onarım' },
                        { key: 'sigorta', label: 'Sigorta' },
                        { key: 'vergisi', label: 'Vergi' },
                        { key: 'muayene', label: 'Muayene' },
                        { key: 'lastik', label: 'Lastik' },
                        { key: 'yikama', label: 'Yıkama' },
                        { key: 'noter', label: 'Noter' },
                        { key: 'diger', label: 'Diğer' }
                      ].map(cat => {
                        const amount = periodExpenses.filter(e => e.expense_type === cat.key).reduce((sum, curr) => sum + parseFloat(curr.amount || 0), 0);
                        if (amount === 0) return null;
                        
                        const pct = periodExpensesSum > 0 ? (amount / periodExpensesSum) * 100 : 0;
                        return (
                          <div key={cat.key}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px', fontWeight: 600 }}>
                              <span style={{ color: '#4b5563' }}>{cat.label}</span>
                              <span style={{ color: '#111827' }}>{formatCur(amount)} ({pct.toFixed(0)}%)</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: '#b91c1c', borderRadius: '4px' }}></div>
                            </div>
                          </div>
                        );
                      })}
                      {periodExpenses.length === 0 && (
                        <p style={{ fontStyle: 'italic', color: '#8a8177', fontSize: '13px', margin: 0 }}>Bu döneme ait masraf kaydı bulunmamaktadır.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lists of Purchases and Sales */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Bu Ay Alınanlar */}
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 12px 0' }}>Bu Dönem Alınan Araçlar ({periodBuys.length})</h2>
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                        <thead>
                          <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', color: '#8a8177', fontWeight: 700 }}>
                            <th style={{ padding: '8px 10px' }}>Araç</th>
                            <th>Plaka</th>
                            <th style={{ textAlign: 'right', paddingRight: '10px' }}>Alış Fiyatı</th>
                          </tr>
                        </thead>
                        <tbody>
                          {periodBuys.map(v => (
                            <tr key={v.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                              <td style={{ padding: '10px' }}><strong>{v.brand} {v.model}</strong><br/><span style={{ fontSize: '10.5px', color: '#8a8177' }}>{v.year} model</span></td>
                              <td>{v.plate}</td>
                              <td style={{ textAlign: 'right', paddingRight: '10px', fontWeight: 700 }}>{formatCur(v.buy_price)}</td>
                            </tr>
                          ))}
                          {periodBuys.length === 0 && (
                            <tr>
                              <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#8a8177', fontStyle: 'italic' }}>Alınan araç bulunmamaktadır.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bu Ay Satılanlar */}
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 12px 0' }}>Bu Dönem Satılan Araçlar ({periodSales.length})</h2>
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                        <thead>
                          <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', color: '#8a8177', fontWeight: 700 }}>
                            <th style={{ padding: '8px 10px' }}>Araç</th>
                            <th>Satış Fiyatı</th>
                            <th style={{ textAlign: 'right', paddingRight: '10px' }}>Net Kâr</th>
                          </tr>
                        </thead>
                        <tbody>
                          {periodSales.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                              <td style={{ padding: '10px' }}><strong>{s.vehicles?.brand} {s.vehicles?.model}</strong><br/><span style={{ fontSize: '10.5px', color: '#8a8177' }}>{s.vehicles?.plate}</span></td>
                              <td>{formatCur(s.sell_price)}</td>
                              <td style={{ textAlign: 'right', paddingRight: '10px', fontWeight: 700, color: '#16a34a' }}>+{formatCur(s.net_profit)}</td>
                            </tr>
                          ))}
                          {periodSales.length === 0 && (
                            <tr>
                              <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#8a8177', fontStyle: 'italic' }}>Satılan araç bulunmamaktadır.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* PAGE: ACCOUNTING / MUHASEBE */}
          {activeTab === 'muhasebe' && (() => {
            const periodSales = sales.filter(s => s.sale_date && s.sale_date.startsWith(selectedPeriod));
            const periodBuys = vehicles.filter(v => v.buy_date && v.buy_date.startsWith(selectedPeriod));
            const periodExpenses = expenses.filter(e => e.expense_date && e.expense_date.startsWith(selectedPeriod));

            const totalPeriodIncome = periodSales.reduce((sum, s) => sum + parseFloat(s.sell_price || 0), 0);
            const totalPeriodBuyCost = periodBuys.reduce((sum, v) => sum + parseFloat(v.buy_price || 0), 0);
            const totalPeriodExpenseCost = periodExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
            const totalPeriodOutgoings = totalPeriodBuyCost + totalPeriodExpenseCost;
            const periodNetResult = totalPeriodIncome - totalPeriodOutgoings;

            const expenseTypesMap = {
              yakit: 'Yakıt',
              bakim: 'Bakım / Onarım',
              sigorta: 'Sigorta / Kasko',
              vergisi: 'Vergisi',
              muayene: 'Muayene',
              lastik: 'Lastik',
              yikama: 'Temizlik / Yıkama',
              noter: 'Noter Masrafı',
              personel: 'Personel Gideri',
              isletme: 'İşletme Gideri',
              diger: 'Diğer / Genel Gider'
            };

            const expenseBreakdown = periodExpenses.reduce((acc, curr) => {
              const label = expenseTypesMap[curr.expense_type] || 'Diğer';
              acc[label] = (acc[label] || 0) + parseFloat(curr.amount || 0);
              return acc;
            }, {});

            return (
              <div className="fade-in">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.02em' }}>Muhasebe Paneli</h1>
                    <p style={{ color: '#667085', fontSize: '14px', margin: 0, fontWeight: 500 }}>
                      Seçili döneme ait aylık gelir, gider ve kâr-zarar analizi.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d' }}>
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px' }}>arrow_upward</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Toplam Gelir (Giriş)</span>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#16a34a', marginTop: '10px' }}>{formatCur(totalPeriodIncome)}</div>
                    <div style={{ fontSize: '12px', color: '#667085', marginTop: '4px' }}>{periodSales.length} araç satışından ciro</div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c' }}>
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px' }}>arrow_downward</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Toplam Gider (Çıkış)</span>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 800, color: '#dc2626', marginTop: '10px' }}>{formatCur(totalPeriodOutgoings)}</div>
                    <div style={{ fontSize: '12px', color: '#667085', marginTop: '4px' }}>{formatCur(totalPeriodBuyCost)} araç alım + {formatCur(totalPeriodExpenseCost)} diğer masraf</div>
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #E7E9ED', borderRadius: '16px', padding: '20px', borderColor: periodNetResult >= 0 ? '#bbf7d0' : '#fca5a5', background: periodNetResult >= 0 ? '#f0fdf4' : '#fef2f2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: periodNetResult >= 0 ? '#15803d' : '#b91c1c' }}>
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px' }}>finance</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Net Kâr / Zarar</span>
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: periodNetResult >= 0 ? '#16a34a' : '#dc2626', marginTop: '10px' }}>
                      {periodNetResult >= 0 ? '+' : ''}{formatCur(periodNetResult)}
                    </div>
                    <div style={{ fontSize: '12px', color: periodNetResult >= 0 ? '#15803d' : '#991b1b', marginTop: '4px', fontWeight: 600 }}>
                      Bu ayın finansal performansı
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#16a34a', fontFamily: "'Material Symbols Outlined'", fontSize: '20px' }}>payments</span>
                        Gelir Detayları (Satışlar)
                      </h3>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #e7e2da', color: '#8a8177', fontWeight: 700 }}>
                              <th style={{ padding: '8px' }}>Araç</th>
                              <th>Müşteri</th>
                              <th>Satış Tarihi</th>
                              <th style={{ textAlign: 'right', paddingRight: '8px' }}>Satış Tutarı</th>
                            </tr>
                          </thead>
                          <tbody>
                            {periodSales.map(s => (
                              <tr key={s.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                                <td style={{ padding: '10px 8px' }}>
                                  <strong>{s.vehicles?.brand} {s.vehicles?.model}</strong>
                                  <div style={{ fontSize: '10.5px', color: '#8a8177' }}>{s.vehicles?.plate}</div>
                                </td>
                                <td>{s.customer_name || 'Bilinmeyen Alıcı'}</td>
                                <td>{s.sale_date}</td>
                                <td style={{ textAlign: 'right', paddingRight: '8px', fontWeight: 700, color: '#16a34a' }}>{formatCur(s.sell_price)}</td>
                              </tr>
                            ))}
                            {periodSales.length === 0 && (
                              <tr>
                                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#8a8177', fontStyle: 'italic' }}>
                                  Bu dönemde gerçekleşen araç satışı bulunmuyor.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#dc2626', fontFamily: "'Material Symbols Outlined'", fontSize: '20px' }}>shopping_cart</span>
                        Araç Alımları (Yatırımlar)
                      </h3>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #e7e2da', color: '#8a8177', fontWeight: 700 }}>
                              <th style={{ padding: '8px' }}>Araç</th>
                              <th>Satıcı</th>
                              <th>Alış Tarihi</th>
                              <th style={{ textAlign: 'right', paddingRight: '8px' }}>Alış Tutarı</th>
                            </tr>
                          </thead>
                          <tbody>
                            {periodBuys.map(v => (
                              <tr key={v.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                                <td style={{ padding: '10px 8px' }}>
                                  <strong>{v.brand} {v.model}</strong>
                                  <div style={{ fontSize: '10.5px', color: '#8a8177' }}>{v.plate}</div>
                                </td>
                                <td>{v.seller_name}</td>
                                <td>{v.buy_date}</td>
                                <td style={{ textAlign: 'right', paddingRight: '8px', fontWeight: 700, color: '#dc2626' }}>{formatCur(v.buy_price)}</td>
                              </tr>
                            ))}
                            {periodBuys.length === 0 && (
                              <tr>
                                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#8a8177', fontStyle: 'italic' }}>
                                  Bu dönemde satın alınan araç bulunmuyor.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#dc2626', fontFamily: "'Material Symbols Outlined'", fontSize: '20px' }}>receipt_long</span>
                        Masraf & Genel Gider Detayları
                      </h3>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '2px solid #e7e2da', color: '#8a8177', fontWeight: 700 }}>
                              <th style={{ padding: '8px' }}>Açıklama / Tip</th>
                              <th>İlişkili Araç</th>
                              <th>Tarih</th>
                              <th style={{ textAlign: 'right', paddingRight: '8px' }}>Tutar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {periodExpenses.map(e => {
                              const relatedVehicle = vehicles.find(v => v.id === e.vehicle_id);
                              return (
                                <tr key={e.id} style={{ borderBottom: '1px solid #f3efe9' }}>
                                  <td style={{ padding: '10px 8px' }}>
                                    <strong>{e.description || expenseTypesMap[e.expense_type] || 'Masraf'}</strong>
                                    <div style={{ fontSize: '10.5px', color: '#8a8177' }}>{expenseTypesMap[e.expense_type]}</div>
                                  </td>
                                  <td>
                                    {relatedVehicle ? (
                                      <span>{relatedVehicle.brand} {relatedVehicle.model} <br/><small style={{ color: '#8a8177' }}>({relatedVehicle.plate})</small></span>
                                    ) : (
                                      <span style={{ color: '#8a8177', fontStyle: 'italic' }}>Genel Gider</span>
                                    )}
                                  </td>
                                  <td>{e.expense_date}</td>
                                  <td style={{ textAlign: 'right', paddingRight: '8px', fontWeight: 700, color: '#dc2626' }}>{formatCur(e.amount)}</td>
                                </tr>
                              );
                            })}
                            {periodExpenses.length === 0 && (
                              <tr>
                                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#8a8177', fontStyle: 'italic' }}>
                                  Bu dönemde kaydedilmiş masraf bulunmuyor.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Kategori Bazlı Gider Dağılımı</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {Object.entries(expenseBreakdown).map(([label, sum]) => {
                          const percentage = totalPeriodExpenseCost > 0 ? (sum / totalPeriodExpenseCost) * 100 : 0;
                          return (
                            <div key={label}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: '#475467', marginBottom: '4px' }}>
                                <span>{label}</span>
                                <span>{formatCur(sum)} (%{percentage.toFixed(0)})</span>
                              </div>
                              <div style={{ width: '100%', height: '8px', background: '#F2F4F7', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${percentage}%`, height: '100%', background: '#dc2626', borderRadius: '4px' }}></div>
                              </div>
                            </div>
                          );
                        })}
                        {Object.keys(expenseBreakdown).length === 0 && (
                          <div style={{ color: '#8a8177', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', padding: '10px' }}>Gider verisi bulunmuyor.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* PAGE: MESSAGES */}
          {activeTab === 'mesajlar' && (
            <div className="fade-in">
              <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.02em' }}>Müşteri Mesajları</h1>
              <p style={{ color: '#667085', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
                İlan portalı üzerinden gelen teklifler, soru ve talep mesajları listelenmektedir.
              </p>

              <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#faf8f5', borderBottom: '1px solid #eee9e1', fontSize: '11px', color: '#8a8177', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '14px 18px' }}>Gönderen Bilgisi</th>
                      <th>İlgili İlan</th>
                      <th>Mesaj İçeriği</th>
                      <th>Tarih</th>
                      <th style={{ textAlign: 'right', paddingRight: '18px' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(msg => (
                      <tr key={msg.id} style={{ borderBottom: '1px solid #f3efe9', background: msg.is_read ? '#fff' : '#fefaf6' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 800, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {msg.sender_name}
                            {!msg.is_read && (
                              <span style={{ fontSize: '10px', background: '#F97316', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>YENİ</span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#667085', marginTop: '2px', fontWeight: 600 }}>📞 {msg.sender_phone}</div>
                        </td>
                        <td>
                          {msg.vehicles ? (
                            <div>
                              <div style={{ fontWeight: 700, color: '#3538CD' }}>{msg.vehicles.brand} {msg.vehicles.model}</div>
                              <div style={{ fontSize: '11px', color: '#667085', fontWeight: 600 }}>Plaka: {msg.vehicles.plate}</div>
                            </div>
                          ) : (
                            <span style={{ color: '#8a8177', fontStyle: 'italic' }}>Silinmiş İlan</span>
                          )}
                        </td>
                        <td style={{ maxWidth: '320px', whiteSpace: 'normal', wordBreak: 'break-word', color: '#344054', fontWeight: 500 }}>
                          {msg.message_text}
                        </td>
                        <td style={{ color: '#667085', fontWeight: 600 }}>
                          {new Date(msg.created_at).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: '18px' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {!msg.is_read && (
                              <button onClick={async () => {
                                try {
                                  const { error } = await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
                                  if (error) throw error;
                                  setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
                                } catch (err) {
                                  alert('Hata: ' + err.message);
                                }
                              }} style={{ border: 'none', background: '#eafaf1', color: '#16a34a', padding: '6px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}>Okundu İşaretle</button>
                            )}
                            <button onClick={() => { setReplyModal(msg); setReplyText(''); }} style={{ border: 'none', background: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}>Yanıtla</button>
                            <button onClick={async () => {
                              if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
                              try {
                                const { error } = await supabase.from('messages').delete().eq('id', msg.id);
                                if (error) throw error;
                                setMessages(messages.filter(m => m.id !== msg.id));
                              } catch (err) {
                                alert('Silinirken hata oluştu: ' + err.message);
                              }
                            }} style={{ border: 'none', background: '#fef2f2', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}>Sil</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {messages.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '36px', textAlign: 'center', color: '#8a8177', fontStyle: 'italic', fontWeight: 500 }}>
                          Henüz hiçbir müşteri mesajı bulunmamaktadır.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {replyModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setReplyModal(null)}>
                  <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '460px', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontSize: '18px', fontWeight: 900, marginBottom: '6px' }}>Müşteriye Yanıt</div>
                    <div style={{ fontSize: '13px', color: '#667085', marginBottom: '16px' }}>Yanıtınız <strong>{replyModal.sender_phone}</strong> numarasına SMS olarak gönderilecektir.</div>
                    <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#344054', borderLeft: '3px solid #e5e7eb' }}>
                      <div style={{ fontWeight: 700, marginBottom: '4px', color: '#1a1a1a' }}>{replyModal.sender_name}:</div>
                      {replyModal.message_text}
                    </div>
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Yanıt mesajınızı yazın..." rows={3} style={{ width: '100%', padding: '12px', border: '1px solid #d0d5dd', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '14px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setReplyModal(null)} style={{ border: '1px solid #d0d5dd', background: '#fff', color: '#344054', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>İptal</button>
                      <button onClick={async () => {
                        if (!replyText.trim()) { alert('Lütfen yanıt mesajı yazın.'); return; }
                        try {
                          await supabase.from('messages').insert([{ tenant_id: replyModal.tenant_id, vehicle_id: replyModal.vehicle_id, sender_name: tenant?.name || 'Galeri', sender_phone: tenant?.phone || '', message_text: '↩️ Yanıt: ' + replyText, is_read: true }]);
                          await supabase.from('messages').update({ is_read: true }).eq('id', replyModal.id);
                          const { data: refreshed } = await supabase.from('messages').select('*, vehicles(brand, model, plate)').eq('tenant_id', tenant.id).order('created_at', { ascending: false });
                          setMessages(refreshed || []);
                          setReplyModal(null);
                          setReplyText('');
                          alert('Yanıtınız kaydedildi. SMS entegrasyonu aktif olduğunda müşteriye iletilecektir.');
                        } catch (err) { alert('Hata: ' + err.message); }
                      }} style={{ border: 'none', background: '#2563eb', color: '#fff', padding: '8px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>Yanıtı Gönder</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PAGE: SETTINGS */}
          {activeTab === 'ayarlar' && (
            <div className="fade-in">
              <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>Ayarlar</h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* Sol Taraf: Firma Bilgileri */}
                <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, borderBottom: '1px solid #F0F1F4', paddingBottom: '10px' }}>Firma & Fatura Bilgileri</h2>
                  
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const { error } = await supabase
                        .from('tenants')
                        .update({
                          name: settingsForm.name,
                          company_title: settingsForm.company_title,
                          owner_name: settingsForm.owner_name,
                          owner_phone: settingsForm.owner_phone,
                          owner_email: settingsForm.owner_email,
                          tax_office: settingsForm.tax_office,
                          tax_number: settingsForm.tax_number,
                          address: settingsForm.address,
                          city: settingsForm.city || 'İstanbul'
                        })
                        .eq('id', currentTenant.id);

                      if (error) throw error;

                      // Şifreyi Supabase Auth üzerinden değiştir (tabloya yazmayız)
                      if (settingsForm.password && settingsForm.password.length >= 6) {
                        const { error: pwErr } = await supabase.auth.updateUser({ password: settingsForm.password });
                        if (pwErr) throw pwErr;
                      }

                      setCurrentTenant({
                        ...currentTenant,
                        name: settingsForm.name,
                        company_title: settingsForm.company_title,
                        owner_name: settingsForm.owner_name,
                        owner_phone: settingsForm.owner_phone,
                        owner_email: settingsForm.owner_email,
                        tax_office: settingsForm.tax_office,
                        tax_number: settingsForm.tax_number,
                        address: settingsForm.address,
                        city: settingsForm.city || 'İstanbul',
                        password: settingsForm.password
                      });
                      triggerAlert('success', 'Ayarlar başarıyla güncellendi.');
                    } catch (err) {
                      alert('Ayarlar kaydedilirken hata: ' + err.message);
                    }
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Firma Adı (Kısa) *</span>
                        <input type="text" className="input-field" required value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })} />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Yetkili Ad Soyad *</span>
                        <input type="text" className="input-field" required value={settingsForm.owner_name} onChange={(e) => setSettingsForm({ ...settingsForm, owner_name: e.target.value })} />
                      </label>
                    </div>

                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Firma Tam Ünvanı *</span>
                      <input type="text" className="input-field" required placeholder="Fatura kesilmesi için tam ticari ünvan" value={settingsForm.company_title} onChange={(e) => setSettingsForm({ ...settingsForm, company_title: e.target.value })} />
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Telefon Numarası *</span>
                        <input type="text" className="input-field" required value={settingsForm.owner_phone} onChange={(e) => setSettingsForm({ ...settingsForm, owner_phone: e.target.value })} />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>E-posta Adresi *</span>
                        <input type="email" className="input-field" required value={settingsForm.owner_email} onChange={(e) => setSettingsForm({ ...settingsForm, owner_email: e.target.value })} />
                      </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Vergi Dairesi *</span>
                        <input type="text" className="input-field" required value={settingsForm.tax_office} onChange={(e) => setSettingsForm({ ...settingsForm, tax_office: e.target.value })} />
                      </label>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Vergi Numarası *</span>
                        <input type="text" className="input-field" required value={settingsForm.tax_number} onChange={(e) => setSettingsForm({ ...settingsForm, tax_number: e.target.value })} />
                      </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <label>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Şehir (Galeri Konumu) *</span>
                        <select className="input-field" required value={settingsForm.city || 'İstanbul'} onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}>
                          <option>İstanbul</option>
                          <option>Ankara</option>
                          <option>İzmir</option>
                          <option>Bursa</option>
                          <option>Antalya</option>
                          <option>Adana</option>
                          <option>Konya</option>
                          <option>Gaziantep</option>
                          <option>Kocaeli</option>
                          <option>Mersin</option>
                          <option>Samsun</option>
                          <option>Sakarya</option>
                          <option>Diyarbakır</option>
                          <option>Eskişehir</option>
                          <option>Trabzon</option>
                          <option>Yalova</option>
                          <option>Muğla</option>
                        </select>
                      </label>
                      <label style={{ opacity: 0 }}>
                        <span>Hidden</span>
                      </label>
                    </div>

                    <label>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Adres *</span>
                      <textarea className="input-field" required style={{ minHeight: '80px', fontFamily: 'inherit' }} value={settingsForm.address} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}></textarea>
                    </label>

                    <label style={{ borderTop: '1px solid #F0F1F4', paddingTop: '14px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Şifre Değiştir</span>
                      <input type="password" placeholder="Yeni şifrenizi girin" className="input-field" value={settingsForm.password} onChange={(e) => setSettingsForm({ ...settingsForm, password: e.target.value })} />
                    </label>

                    <button type="submit" className="btn-primary" style={{ padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', marginTop: '10px' }}>Firma Bilgilerini Kaydet</button>
                  </form>
                </div>

                {/* Sağ Taraf: Abonelik Bilgileri */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '20px' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, borderBottom: '1px solid #F0F1F4', paddingBottom: '10px', marginBottom: '14px' }}>Abonelik Paketi</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8a8177' }}>Paket Durumu:</span>
                        <strong style={{ color: currentTenant?.status === 'trial' ? '#b45309' : '#16a34a', textTransform: 'uppercase' }}>
                          {currentTenant?.status === 'trial' ? 'Deneme Sürümü' : 'Aktif Lisans'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8a8177' }}>Kalan Gün:</span>
                        <strong>{getRemainingDays(currentTenant)} Gün</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8a8177' }}>Bitiş Tarihi:</span>
                        <strong>{currentTenant ? new Date(currentTenant.subscription_ends_at || currentTenant.trial_ends_at).toLocaleDateString('tr-TR') : ''}</strong>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setActiveTab('lisans')} 
                      className="btn-primary" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '12.5px', marginTop: '16px' }}
                    >
                      Aboneliği Yönet / Paket Al
                    </button>
                  </div>

                  <div style={{ background: '#FFFDF9', border: '1px solid #FFE7C4', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '24px', color: '#B26A00' }}>info</span>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 800, color: '#B26A00' }}>Fatura Uyarıları</h4>
                      <p style={{ margin: 0, fontSize: '11.5px', color: '#5C554C', lineHeight: '1.4' }}>
                        Fatura kesilebilmesi için vergi numarası ve tam firma ünvanı bilgilerinizin eksiksiz olması zorunludur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {editingVehicle && editVehicleForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,15,12,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '820px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #eee9e1' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Araç Düzenle: {editingVehicle.brand} {editingVehicle.model}</h3>
                <button onClick={() => { setEditingVehicle(null); setEditVehicleForm(null); setAracFiles([]); }} style={{ border: 'none', background: '#f0ece5', cursor: 'pointer', borderRadius: '8px', width: '30px', height: '30px', fontWeight: '700' }}>✕</button>
              </div>
              
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Marka *</span>
                    <input className="input-field" value={editVehicleForm.brand || ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, brand: e.target.value })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Model *</span>
                    <input className="input-field" value={editVehicleForm.model || ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, model: e.target.value })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Plaka</span>
                    <input className="input-field" value={editVehicleForm.plate || ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, plate: e.target.value })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>KM</span>
                    <input className="input-field" value={editVehicleForm.km ? formatNumberInput(editVehicleForm.km) : ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, km: parseNumberInput(e.target.value) })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Model Yılı</span>
                    <input type="number" className="input-field" value={editVehicleForm.year || ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, year: parseInt(e.target.value) })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Renk</span>
                    <input className="input-field" value={editVehicleForm.color || ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, color: e.target.value })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Yakıt Tipi</span>
                    <select className="input-field" value={editVehicleForm.fuel_type || 'Benzin'} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, fuel_type: e.target.value })}>
                      <option>Benzin</option>
                      <option>Dizel</option>
                      <option>LPG</option>
                      <option>Hibrit</option>
                      <option>Elektrik</option>
                    </select>
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Vites Tipi</span>
                    <select className="input-field" value={editVehicleForm.gear_type || 'Otomatik'} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, gear_type: e.target.value })}>
                      <option>Otomatik</option>
                      <option>Manuel</option>
                      <option>Yarı Otomatik</option>
                    </select>
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Kasa Tipi</span>
                    <select className="input-field" value={editVehicleForm.body_type || 'Sedan'} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, body_type: e.target.value })}>
                      <option>Sedan</option>
                      <option>Hatchback 5 kapı</option>
                      <option>Hatchback 3 kapı</option>
                      <option>Coupe</option>
                      <option>Coupe 4 kapı</option>
                      <option>Cabrio</option>
                      <option>Station Wagon</option>
                      <option>MPV</option>
                      <option>Roadster</option>
                      <option>SUV</option>
                      <option>Arazi</option>
                      <option>Panelvan</option>
                      <option>Minivan</option>
                      <option>Motosiklet</option>
                    </select>
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Alış Fiyatı (₺) *</span>
                    <input className="input-field" value={editVehicleForm.buy_price ? formatNumberInput(editVehicleForm.buy_price) : ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, buy_price: parseNumberInput(e.target.value) })} style={{ fontWeight: 700 }} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Hedef Satış (₺) *</span>
                    <input className="input-field" value={editVehicleForm.sell_price ? formatNumberInput(editVehicleForm.sell_price) : ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, sell_price: parseNumberInput(e.target.value) })} style={{ fontWeight: 700 }} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Durum *</span>
                    <select className="input-field" value={editVehicleForm.status || 'stokta'} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, status: e.target.value })}>
                      <option value="stokta">Stokta</option>
                      <option value="pasif">Pasif (Yayından Kaldır)</option>
                      <option value="satildi">Satıldı</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Alınan Kişi / Satıcı</span>
                    <input className="input-field" value={editVehicleForm.seller_name || ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, seller_name: e.target.value })} />
                  </label>
                  <label>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '4px' }}>Satıcı Telefon</span>
                    <input className="input-field" value={editVehicleForm.seller_phone || ''} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, seller_phone: e.target.value })} />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                     <input type="checkbox" checked={!!editVehicleForm.is_heavy_damage} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, is_heavy_damage: e.target.checked })} /> ⚠️ Ağır Hasarlı
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                     <input type="checkbox" checked={!!editVehicleForm.is_consignment} onChange={(e) => setEditVehicleForm({ ...editVehicleForm, is_consignment: e.target.checked })} /> Araç Konsinye (Emanet)
                  </label>
                </div>

                <div style={{ marginTop: '12px', borderTop: '1px solid #f0f1f4', paddingTop: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#8a8177', display: 'block', marginBottom: '8px' }}>Araç Resimleri (Maks. 10 Adet)</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginTop: '8px' }}>
                    {Array.from({ length: 10 }).map((_, idx) => {
                      const slot = editSlots[idx];
                      let previewUrl = null;
                      if (typeof slot === 'string') previewUrl = slot;
                      else if (slot instanceof File) previewUrl = URL.createObjectURL(slot);

                      return (
                        <div key={idx} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#F2F4F7', border: '1px dashed #D0D5DD', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {previewUrl ? (
                            <>
                              <img src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => {
                                const newSlots = [...editSlots];
                                newSlots[idx] = null;
                                setEditSlots(newSlots);
                              }} style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
                            </>
                          ) : (
                            <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#98A2B3' }}>add</span>
                              <span style={{ fontSize: '9px', color: '#98A2B3', marginTop: '2px' }}>#{idx+1}</span>
                              <input type="file" accept="image/*" onChange={(e) => {
                                const selectedFile = e.target.files[0];
                                if (selectedFile) {
                                  const newSlots = [...editSlots];
                                  newSlots[idx] = selectedFile;
                                  setEditSlots(newSlots);
                                }
                              }} style={{ display: 'none' }} />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 24px', borderTop: '1px solid #eee9e1', background: '#faf8f5' }}>
                <button onClick={() => { setEditingVehicle(null); setEditVehicleForm(null); setAracFiles([]); }} className="btn-secondary" style={{ padding: '9px 18px', borderRadius: '8px', fontSize: '13px' }}>İptal</button>
                <button
                  onClick={async () => {
                    try {
                      const filesToUpload = editSlots.filter(s => s instanceof File);
                      const uploadedUrls = filesToUpload.length > 0 ? await uploadVehicleImages(filesToUpload, currentTenant.id) : [];
                      
                      let uploadIndex = 0;
                      const finalUrls = editSlots
                        .map(slot => {
                          if (typeof slot === 'string') return slot;
                          if (slot instanceof File) {
                            const url = uploadedUrls[uploadIndex];
                            uploadIndex++;
                            return url;
                          }
                          return null;
                        })
                        .filter(Boolean);

                      const finalImageUrl = finalUrls.length > 0 ? JSON.stringify(finalUrls) : null;

                      const { error } = await supabase
                        .from('vehicles')
                        .update({
                          brand: editVehicleForm.brand,
                          model: editVehicleForm.model,
                          plate: editVehicleForm.plate,
                          km: editVehicleForm.km,
                          year: editVehicleForm.year,
                          color: editVehicleForm.color,
                          fuel_type: editVehicleForm.fuel_type,
                          gear_type: editVehicleForm.gear_type,
                          body_type: editVehicleForm.body_type,
                          buy_price: editVehicleForm.buy_price,
                          sell_price: editVehicleForm.sell_price,
                          status: editVehicleForm.status,
                          seller_name: editVehicleForm.seller_name,
                          seller_phone: editVehicleForm.seller_phone,
                          is_heavy_damage: editVehicleForm.is_heavy_damage,
                          is_consignment: editVehicleForm.is_consignment,
                          image_url: finalImageUrl
                        })
                        .eq('id', editingVehicle.id);

                      if (error) throw error;
                      setVehicles(vehicles.map(item => item.id === editingVehicle.id ? { ...editVehicleForm, image_url: finalImageUrl } : item));
                      setEditingVehicle(null);
                      setEditVehicleForm(null);
                      setAracFiles(Array(10).fill(null));
                      setEditSlots(Array(10).fill(null));
                      triggerAlert('success', 'Araç bilgileri başarıyla güncellendi.');
                      loadTenantContext(currentTenant.id);
                    } catch (err) {
                      alert('Güncelleme sırasında hata oluştu: ' + err.message);
                    }
                  }}
                  className="btn-primary"
                  style={{ padding: '9px 18px', borderRadius: '8px', fontSize: '13px' }}
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
