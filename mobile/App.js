import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, TextInput,
  Alert, Modal, KeyboardAvoidingView, Platform, RefreshControl,
  Dimensions, Image
} from 'react-native';
import { supabase } from './src/supabase';

const { width: W } = Dimensions.get('window');

// ─── RENK PALETİ ─────────────────────────────────────────────────────────────
const C = {
  bg: '#0d0b0a',
  card: '#1d1a18',
  border: '#2b2724',
  border2: '#3a3430',
  text: '#f5f2ee',
  muted: '#8a8177',
  dim: '#57504a',
  red: '#B91C1C',
  redDark: '#7a1010',
  redBright: '#f87171',
  green: '#4ade80',
  yellow: '#eab308',
  blue: '#60a5fa',
  purple: '#c084fc',
  teal: '#2dd4bf',
  orange: '#fb923c',
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

// ─── FORMAT YARDIMCILARI ──────────────────────────────────────────────────────
// ₺ sembolü rakamın SAĞINDA
const tl = (n) => Math.round(n || 0).toLocaleString('tr-TR') + ' ₺';
const tlM = (n) => {
  const v = Math.abs(n || 0);
  if (v >= 1_000_000) return (Math.round((n / 1_000_000) * 10) / 10).toString().replace('.', ',') + ' M ₺';
  if (v >= 1_000) return Math.round(n || 0).toLocaleString('tr-TR') + ' ₺';
  return tl(n);
};
const fmt = (n) => Math.round(n || 0).toLocaleString('tr-TR');
const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
};
const getFirstImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  try {
    const urls = JSON.parse(imageUrl);
    if (Array.isArray(urls) && urls.length > 0) return urls[0];
  } catch (e) {}
  return imageUrl;
};

// ─── TOAST BİLEŞENİ ──────────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <View style={styles.toast}>
      <Text style={styles.toastTxt}>{msg}</Text>
    </View>
  );
}

// ─── STAT KARTI ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, subColor }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {sub ? <Text style={[styles.statSub, { color: subColor || C.muted }]}>{sub}</Text> : null}
    </View>
  );
}

// ─── ARAÇ SATIRI ─────────────────────────────────────────────────────────────
function VehicleRow({ v, onPress, showKar }) {
  const kar = (v.sell_price || 0) - (v.buy_price || 0);
  const firstImage = getFirstImageUrl(v.image_url);
  return (
    <TouchableOpacity style={styles.vehicleRow} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.vehicleThumb}>
        {firstImage ? (
          <Image source={{ uri: firstImage }} style={{ width: '100%', height: '100%', borderRadius: 16 }} />
        ) : (
          <Text style={styles.vehicleThumbLetter}>{(v.brand || '?')[0]}</Text>
        )}
        <View style={[styles.vehicleStripe, { backgroundColor: showKar ? C.green : C.red }]} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.vehicleTitle} numberOfLines={1}>{v.brand} {v.model}</Text>
        <Text style={styles.vehicleSub} numberOfLines={1}>{v.plate} · {fmt(v.km)} km · {v.year}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.vehiclePrice, { color: showKar ? (kar >= 0 ? C.green : C.redBright) : C.text }]}>
          {showKar ? ((kar >= 0 ? '+' : '') + tl(kar)) : tl(v.sell_price)}
        </Text>
        <Text style={styles.vehiclePriceLabel}>{showKar ? 'net kâr' : 'hedef satış'}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── HAREKET KARTI ───────────────────────────────────────────────────────────
function ActivityRow({ item }) {
  return (
    <View style={styles.actRow}>
      <View style={[styles.actIcon, { backgroundColor: item.ibg }]}>
        <Text style={[styles.actIconTxt, { color: item.ic }]}>{item.ikon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.actText} numberOfLines={2}>{item.text}</Text>
        <Text style={styles.actWhen}>{item.when}</Text>
      </View>
    </View>
  );
}

// ─── BAR GRAFİK ──────────────────────────────────────────────────────────────
function BarChart({ bars }) {
  const maxV = Math.max(...bars.map(b => b.val), 1);
  return (
    <View style={styles.barChartWrap}>
      {bars.map((b, i) => (
        <View key={i} style={styles.barCol}>
          <View style={[styles.bar, { height: Math.max(4, Math.round(b.val / maxV * 80)), backgroundColor: b.active ? C.red : C.border2 }]} />
          <Text style={[styles.barLabel, { color: b.active ? C.redBright : C.dim }]}>{b.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── GİRİŞ ALANI ─────────────────────────────────────────────────────────────
function Field({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, focus && { borderColor: C.red }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.dim}
        keyboardType={keyboardType || 'default'}
        secureTextEntry={secureTextEntry || false}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </View>
  );
}

// ─── GERİ BUTONU ─────────────────────────────────────────────────────────────
function BackBtn({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 16 }}>
      <Text style={{ color: C.redBright, fontWeight: '800', fontSize: 13 }}>← {label}</Text>
    </TouchableOpacity>
  );
}

// ─── LOGIN EKRANI ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'E-posta ve şifre giriniz.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      onLogin(data.session);
    } catch (err) {
      Alert.alert('Giriş Başarısız', err.message || 'E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 28 }}>
        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center', marginBottom: 18,
            shadowColor: C.red, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: '900', fontStyle: 'italic', color: '#fff' }}>G</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '900', fontStyle: 'italic', color: C.text, letterSpacing: -0.5 }}>Galerim</Text>
          <Text style={{ fontSize: 13, color: C.muted, fontWeight: '600', marginTop: 4 }}>Galeri yönetim paneli</Text>
        </View>

        <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '900', color: C.text, marginBottom: 20 }}>Giriş Yap</Text>

          <Text style={loginStyles.label}>E-POSTA</Text>
          <TextInput
            style={[loginStyles.input, focusEmail && loginStyles.inputFocus]}
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@galeri.com"
            placeholderTextColor={C.dim}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setFocusEmail(true)}
            onBlur={() => setFocusEmail(false)}
          />

          <Text style={[loginStyles.label, { marginTop: 14 }]}>ŞİFRE</Text>
          <TextInput
            style={[loginStyles.input, focusPass && loginStyles.inputFocus]}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={C.dim}
            secureTextEntry
            onFocus={() => setFocusPass(true)}
            onBlur={() => setFocusPass(false)}
          />

          <TouchableOpacity
            style={[loginStyles.btn, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={loginStyles.btnTxt}>Giriş Yap →</Text>}
          </TouchableOpacity>
        </View>

        <Text style={{ textAlign: 'center', color: C.dim, fontSize: 11, marginTop: 28, fontWeight: '600' }}>
          Galerim v2.0 · BulutGrup Yazılım
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const loginStyles = StyleSheet.create({
  label: { fontSize: 9.5, fontWeight: '800', color: C.muted, letterSpacing: 0.6, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: C.border2, borderRadius: 12, padding: 14, fontSize: 14, backgroundColor: '#131110', color: C.text },
  inputFocus: { borderColor: C.red },
  btn: { backgroundColor: C.red, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 22,
    shadowColor: C.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
  btnTxt: { color: '#fff', fontWeight: '900', fontSize: 15 },
});

// ─── ANA UYGULAMA ─────────────────────────────────────────────────────────────
export default function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [tab, setTab] = useState('genel');
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [messages, setMessages] = useState([]);
  const [banks, setBanks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [aracTab, setAracTab] = useState('stok');
  const [detay, setDetay] = useState(null);

  // Form states
  const [sf, setSf] = useState({ vehicle_id: '', sell_price: '', noter: '', bank_id: '' });
  const [mf, setMf] = useState({ vehicle_id: '', expense_type: 'diger', amount: '', description: '', bank_id: '', expense_date: new Date().toISOString().split('T')[0] });
  const [abf, setAbf] = useState({
    brand: '', model: '', version: '', plate: '', km: '', year: String(new Date().getFullYear()),
    color: '', fuel_type: 'Benzin', gear_type: 'Otomatik', body_type: 'Sedan',
    buy_price: '', sell_price: '', seller_name: '', seller_phone: '', bank_id: '',
    buy_date: new Date().toISOString().split('T')[0]
  });
  const [customBrandMobile, setCustomBrandMobile] = useState(false);
  const [customModelMobile, setCustomModelMobile] = useState(false);
  const [customVersionMobile, setCustomVersionMobile] = useState(false);
  const [customBrandMobileInput, setCustomBrandMobileInput] = useState('');
  const [customModelMobileInput, setCustomModelMobileInput] = useState('');
  const [customVersionMobileInput, setCustomVersionMobileInput] = useState('');
  const [isSavingMobileVehicle, setIsSavingMobileVehicle] = useState(false);
  const [replyMsg, setReplyMsg] = useState(null);
  const [replyText, setReplyText] = useState('');
  // Hesaplayıcı state'leri
  const [krediBorcuStr, setKrediBorcuStr] = useState('500000');
  const [faizStr, setFaizStr] = useState('4.5');
  const [ayStr, setAyStr] = useState('60');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ─── AUTH DURUMU ──────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        setTenant(null);
        setVehicles([]); setSales([]); setExpenses([]);
        setMessages([]); setBanks([]); setDocuments([]);
        setCustomers([]); setPersonnel([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ─── VERİ YÜKLEME ─────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const userEmail = session.user?.email;
      let query = supabase.from('tenants').select('*');
      if (userEmail) query = query.eq('owner_email', userEmail);
      const { data: tenants } = await query.limit(1);
      let t = tenants?.[0] || null;
      if (!t) {
        // email ile bulunamazsa ilk tenant'ı al
        const { data: all } = await supabase.from('tenants').select('*').limit(1);
        t = all?.[0] || null;
      }
      if (!t) { setLoading(false); setRefreshing(false); return; }
      setTenant(t);
      await loadForTenant(t.id);
    } catch (err) {
      console.error('loadData error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session]);

  const loadForTenant = async (tid) => {
    const [vRes, sRes, eRes, mRes, bRes, dRes, cRes, pRes] = await Promise.all([
      supabase.from('vehicles').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
      supabase.from('sales').select('*, vehicles(brand,model,plate)').eq('tenant_id', tid).order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
      supabase.from('messages').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
      supabase.from('banks').select('*').eq('tenant_id', tid),
      supabase.from('bank_documents').select('*').eq('tenant_id', tid).order('due_date', { ascending: true }),
      supabase.from('customers').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
      supabase.from('personnel').select('*').eq('tenant_id', tid).order('created_at', { ascending: false }),
    ]);
    setVehicles(vRes.data || []);
    setSales(sRes.data || []);
    setExpenses(eRes.data || []);
    setMessages(mRes.data || []);
    setBanks(bRes.data || []);
    setDocuments(dRes.data || []);
    setCustomers(cRes.data || []);
    setPersonnel(pRes.data || []);
  };

  useEffect(() => { if (session) loadData(); }, [session, loadData]);
  const onRefresh = () => { setRefreshing(true); loadData(); };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setTab('genel');
  };

  // ─── HESAPLAMALAR ──────────────────────────────────────────────
  const stok = vehicles.filter(v => v.status === 'stokta');
  const satilan = vehicles.filter(v => v.status === 'satildi');
  const stokDeger = stok.reduce((a, v) => a + parseFloat(v.buy_price || 0), 0);
  const salesCiro = sales.reduce((a, s) => a + parseFloat(s.sell_price || 0), 0);
  const netProfit = sales.reduce((a, s) => a + parseFloat(s.net_profit || 0), 0);
  const bankTop = banks.reduce((a, b) => a + parseFloat(b.balance || 0), 0);
  const totalCapital = bankTop + stokDeger;
  const bekleyenVade = documents.filter(d => d.status === 'bekliyor').reduce((a, d) => a + parseFloat(d.amount || 0), 0);
  const unreadMessages = messages.filter(m => !m.is_read);

  const ay6Kar = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const label = d.toLocaleDateString('tr-TR', { month: 'short' });
      const val = sales.filter(s => {
        const sd = new Date(s.created_at);
        return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear();
      }).reduce((a, s) => a + parseFloat(s.net_profit || 0), 0);
      return { label, val, active: i === 5 };
    });
  })();

  const sonHareketler = (() => {
    const items = [];
    sales.slice(0, 3).forEach(s => {
      const v = vehicles.find(v => v.id === s.vehicle_id);
      items.push({
        text: `${v?.brand || ''} ${v?.model || ''} satıldı — ${tl(s.sell_price)}`,
        when: fmtDate(s.created_at),
        ikon: '₺', ibg: 'rgba(74,222,128,.15)', ic: C.green,
        ts: new Date(s.created_at).getTime()
      });
    });
    expenses.slice(0, 3).forEach(e => {
      items.push({
        text: `${e.description || e.expense_type || 'Masraf'} — ${tl(e.amount)}`,
        when: fmtDate(e.created_at),
        ikon: '−', ibg: 'rgba(234,179,8,.15)', ic: C.yellow,
        ts: new Date(e.created_at).getTime()
      });
    });
    return items.sort((a, b) => b.ts - a.ts).slice(0, 5);
  })();

  // ─── TABS ──────────────────────────────────────────────────────
  const tabs = [
    { id: 'genel',   label: 'Genel',   ikon: 'G' },
    { id: 'araclar', label: 'Araçlar', ikon: 'A' },
    { id: 'masraf',  label: 'Masraf',  ikon: '＋' },
    { id: 'satis',   label: 'Satış',   ikon: '₺' },
    { id: 'diger',   label: 'Diğer',   ikon: '⋯' },
  ];

  // ─── AUTH KONTROL ─────────────────────────────────────────────
  if (authLoading) return <View style={styles.loadingWrap}><ActivityIndicator size="large" color={C.red} /></View>;
  if (!session) return <LoginScreen onLogin={(s) => setSession(s)} />;
  if (loading) return <View style={styles.loadingWrap}><ActivityIndicator size="large" color={C.red} /></View>;

  // ══════════════════════════════════════════════════════════════
  // RENDER: GENEL BAKIŞ
  // ══════════════════════════════════════════════════════════════
  const renderGenel = () => (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.red} />}>
      <View style={styles.heroCard}>
        <View style={styles.heroOrb1} /><View style={styles.heroOrb2} />
        <Text style={styles.heroLabel}>BU DÖNEM NET KÂR</Text>
        <Text style={styles.heroValue}>{netProfit >= 0 ? '+' : ''}{tl(netProfit)}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <View style={styles.heroPill}><Text style={styles.heroPillTxt}>{sales.length} satış</Text></View>
          <View style={styles.heroPill}><Text style={styles.heroPillTxt}>{tlM(salesCiro)} ciro</Text></View>
        </View>
      </View>
      <View style={styles.statGrid}>
        <StatCard label="TOPLAM SERMAYE" value={tl(totalCapital)} sub="Kasa + Stok Değeri" subColor={C.orange} />
        <StatCard label="KASA + BANKA" value={tl(bankTop)} sub={banks.length + ' hesap'} subColor={C.green} />
        <StatCard label="STOK DEĞERİ" value={tl(stokDeger)} sub={stok.length + ' araç stokta'} subColor={C.blue} />
        <StatCard label="BEKLEYEN VADE" value={tl(bekleyenVade)} sub={documents.filter(d => d.status === 'bekliyor').length + ' belge'} subColor={C.yellow} />
        <StatCard label="SATILANLAR" value={satilan.length} sub="toplam satılan" subColor={C.green} />
        <StatCard label="BU DÖNEM SATIŞ" value={sales.length} sub={tl(salesCiro) + ' ciro'} subColor={C.teal} />
      </View>
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aylık Kâr</Text>
          <Text style={styles.sectionSub}>Son 6 ay</Text>
        </View>
        <BarChart bars={ay6Kar} />
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Son Hareketler</Text>
        {sonHareketler.length === 0 ? <Text style={styles.emptyTxt}>Henüz hareket yok.</Text> : sonHareketler.map((h, i) => <ActivityRow key={i} item={h} />)}
      </View>
    </ScrollView>
  );

  // ══════════════════════════════════════════════════════════════
  // RENDER: ARAÇLAR
  // ══════════════════════════════════════════════════════════════
  const renderAraclar = () => {
    const dv = vehicles.find(v => v.id === detay);
    if (dv) {
      const dvExpenses = expenses.filter(e => e.vehicle_id === dv.id);
      const totalExp = dvExpenses.reduce((a, e) => a + parseFloat(e.amount || 0), 0);
      const beklenenKar = (dv.sell_price || 0) - (dv.buy_price || 0) - totalExp;
      return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
          <BackBtn label="Araçlarım" onPress={() => setDetay(null)} />
          <View style={styles.detayImg}>
            {(() => {
              const firstImage = getFirstImageUrl(dv.image_url);
              return firstImage ? (
                <Image source={{ uri: firstImage }} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
              ) : (
                <Text style={styles.detayImgLetter}>{(dv.brand || '?')[0]}</Text>
              );
            })()}
            <View style={[styles.detayBadge, { backgroundColor: dv.status === 'stokta' ? 'rgba(74,222,128,.2)' : 'rgba(248,113,113,.2)' }]}>
              <Text style={[styles.detayBadgeTxt, { color: dv.status === 'stokta' ? C.green : C.redBright }]}>{dv.status === 'stokta' ? 'STOKTA' : 'SATILDI'}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '900', fontStyle: 'italic', color: C.text, marginTop: 14 }}>{dv.brand} {dv.model}</Text>
          <Text style={{ fontSize: 12, color: C.muted, marginTop: 3, fontWeight: '600' }}>{dv.plate} · {fmt(dv.km)} km · {dv.year}</Text>
          <View style={styles.detayGrid}>
            {[
              ['YAKIT', dv.fuel_type || '—'],
              ['VİTES', dv.gear_type || '—'],
              ['KASA TİPİ', dv.body_type || '—'],
              ['RENK', dv.color || '—'],
              ['ALIŞ FİYATI', tl(dv.buy_price)],
              ['HEDEF SATIŞ', tl(dv.sell_price)],
              ['TOPLAM MASRAF', tl(totalExp)],
              ['ALIŞ TARİHİ', fmtDate(dv.buy_date)],
            ].map(([k, v], i) => (
              <View key={i} style={styles.detayItem}><Text style={styles.detayKey}>{k}</Text><Text style={styles.detayVal}>{v}</Text></View>
            ))}
          </View>
          <View style={styles.karCard}>
            <View style={styles.heroOrb1} />
            <Text style={styles.heroLabel}>BEKLENEN KÂR</Text>
            <Text style={{ fontSize: 28, fontWeight: '900', fontStyle: 'italic', color: beklenenKar >= 0 ? '#bbf7d0' : '#fecaca', marginTop: 6 }}>
              {(beklenenKar >= 0 ? '+' : '') + tl(beklenenKar)}
            </Text>
          </View>
          {dv.status === 'stokta' && (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={styles.btnLight} onPress={() => { setSf({ vehicle_id: dv.id, sell_price: String(dv.sell_price || ''), noter: '', bank_id: banks[0]?.id || '' }); setTab('satis'); setDetay(null); }}>
                <Text style={{ fontWeight: '900', fontSize: 13, color: '#131110' }}>Bu aracı sat</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      );
    }
    const liste = aracTab === 'stok' ? stok : satilan;
    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 20 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.red} />}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {[['stok', 'Stokta ' + stok.length], ['satildi', 'Satılan ' + satilan.length]].map(([id, label]) => (
            <TouchableOpacity key={id} onPress={() => setAracTab(id)} style={[styles.pillBtn, aracTab === id && styles.pillBtnActive]}>
              <Text style={[styles.pillBtnTxt, aracTab === id && styles.pillBtnTxtActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {liste.length === 0
          ? <Text style={styles.emptyTxt}>Bu listede araç bulunmuyor.</Text>
          : liste.map(v => <VehicleRow key={v.id} v={v} showKar={aracTab === 'satildi'} onPress={() => setDetay(v.id)} />)}
      </ScrollView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: MASRAF EKLE
  // ══════════════════════════════════════════════════════════════
  const handleSaveMobileVehicle = async () => {
    const finalBrand = customBrandMobile ? customBrandMobileInput.trim() : abf.brand;
    const modelBase = customModelMobile ? customModelMobileInput.trim() : abf.model;
    const versionBase = customVersionMobile ? customVersionMobileInput.trim() : abf.version;
    const finalModel = modelBase + (versionBase ? ' ' + versionBase : '');

    if (!finalBrand) { Alert.alert('Hata', 'Marka alanı zorunludur.'); return; }
    if (!finalModel) { Alert.alert('Hata', 'Model alanı zorunludur.'); return; }
    if (!abf.buy_price) { Alert.alert('Hata', 'Alış fiyatı zorunludur.'); return; }
    if (!abf.sell_price) { Alert.alert('Hata', 'Hedef satış fiyatı zorunludur.'); return; }
    if (!abf.bank_id) { Alert.alert('Hata', 'Kasa/Banka seçimi zorunludur.'); return; }

    setIsSavingMobileVehicle(true);
    try {
      const buyPriceNum = parseFloat(String(abf.buy_price).replace(/\./g, '').replace(',', '.')) || 0;
      const sellPriceNum = parseFloat(String(abf.sell_price).replace(/\./g, '').replace(',', '.')) || 0;
      const kmNum = parseInt(String(abf.km).replace(/\./g, '')) || 0;
      const yearNum = parseInt(abf.year) || new Date().getFullYear();

      // 1. Insert vehicle into database
      const { data: vData, error: vErr } = await supabase
        .from('vehicles')
        .insert([{
          tenant_id: tenant.id,
          brand: finalBrand,
          model: finalModel,
          plate: abf.plate,
          km: kmNum,
          year: yearNum,
          color: abf.color,
          fuel_type: abf.fuel_type,
          gear_type: abf.gear_type,
          body_type: abf.body_type,
          buy_price: buyPriceNum,
          sell_price: sellPriceNum,
          seller_name: abf.seller_name || 'Bilinmeyen Satıcı',
          seller_phone: abf.seller_phone || '—',
          buy_date: abf.buy_date || new Date().toISOString().split('T')[0],
          status: 'stokta'
        }])
        .select('*');

      if (vErr) throw vErr;

      // 2. Reduce cash from selected bank account by inserting an expense entry or updating bank balance
      const newVehicle = vData?.[0];
      if (newVehicle) {
        // Update bank account balance by subtracting buy price
        const selectedBank = banks.find(b => b.id === abf.bank_id);
        if (selectedBank) {
          const newBalance = parseFloat(selectedBank.balance || 0) - buyPriceNum;
          await supabase.from('banks').update({ balance: newBalance }).eq('id', abf.bank_id);
        }
      }

      showToast('Araç başarıyla stoka eklendi ✓');
      setAbf({
        brand: '', model: '', version: '', plate: '', km: '', year: String(new Date().getFullYear()),
        color: '', fuel_type: 'Benzin', gear_type: 'Otomatik', body_type: 'Sedan',
        buy_price: '', sell_price: '', seller_name: '', seller_phone: '', bank_id: '',
        buy_date: new Date().toISOString().split('T')[0]
      });
      setCustomBrandMobile(false);
      setCustomModelMobile(false);
      setCustomVersionMobile(false);
      setCustomBrandMobileInput('');
      setCustomModelMobileInput('');
      setCustomVersionMobileInput('');
      
      setTab('araclar');
      setAracTab('stok');
      loadData();
    } catch (err) {
      Alert.alert('Hata', err.message);
    } finally {
      setIsSavingMobileVehicle(false);
    }
  };

  const renderAracAlis = () => {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
          <BackBtn label="Diğer" onPress={() => setTab('diger')} />
          <View style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Araç Alış (Stoka Ekle)</Text>

            {/* Marka Seçimi */}
            <Text style={styles.fieldLabel}>MARKA *</Text>
            {customBrandMobile ? (
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                <TextInput
                  style={[styles.fieldInput, { flex: 1 }]}
                  value={customBrandMobileInput}
                  onChangeText={setCustomBrandMobileInput}
                  placeholder="Marka girin"
                  placeholderTextColor={C.dim}
                />
                <TouchableOpacity onPress={() => { setCustomBrandMobile(false); setAbf(p => ({ ...p, brand: '' })); }} style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: C.card }}>
                  <Text style={{ color: C.text, fontSize: 12, fontWeight: '700' }}>Liste</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, marginBottom: 12, maxHeight: 150, overflow: 'hidden' }}>
                <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
                  {Object.keys(CAR_DATA).map(b => (
                    <TouchableOpacity key={b} onPress={() => {
                      setAbf(p => ({ ...p, brand: b, model: '', version: '' }));
                      setCustomModelMobile(false);
                      setCustomVersionMobile(false);
                    }} style={[styles.selectRow, abf.brand === b && { borderLeftColor: C.red, borderLeftWidth: 3 }]}>
                      <Text style={{ color: C.text, fontWeight: '700', fontSize: 12 }}>{b}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => {
                    setCustomBrandMobile(true);
                    setCustomModelMobile(true);
                    setCustomVersionMobile(true);
                    setAbf(p => ({ ...p, brand: '', model: '', version: '' }));
                  }} style={[styles.selectRow, { backgroundColor: '#181514' }]}>
                    <Text style={{ color: C.blue, fontWeight: '700', fontSize: 12 }}>✍️ Diğer (Kendim Yazacağım)</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}

            {/* Model Seçimi */}
            {abf.brand || customBrandMobile ? (
              <>
                <Text style={styles.fieldLabel}>MODEL *</Text>
                {customModelMobile ? (
                  <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                    <TextInput
                      style={[styles.fieldInput, { flex: 1 }]}
                      value={customModelMobileInput}
                      onChangeText={setCustomModelMobileInput}
                      placeholder="Model girin"
                      placeholderTextColor={C.dim}
                    />
                    {!customBrandMobile && (
                      <TouchableOpacity onPress={() => { setCustomModelMobile(false); setAbf(p => ({ ...p, model: '' })); }} style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: C.card }}>
                        <Text style={{ color: C.text, fontSize: 12, fontWeight: '700' }}>Liste</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, marginBottom: 12, maxHeight: 150, overflow: 'hidden' }}>
                    <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
                      {abf.brand && CAR_DATA[abf.brand] && Object.keys(CAR_DATA[abf.brand]).map(m => (
                        <TouchableOpacity key={m} onPress={() => {
                          setAbf(p => ({ ...p, model: m, version: '' }));
                          setCustomVersionMobile(false);
                        }} style={[styles.selectRow, abf.model === m && { borderLeftColor: C.red, borderLeftWidth: 3 }]}>
                          <Text style={{ color: C.text, fontWeight: '700', fontSize: 12 }}>{m}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity onPress={() => {
                        setCustomModelMobile(true);
                        setCustomVersionMobile(true);
                        setAbf(p => ({ ...p, model: '', version: '' }));
                      }} style={[styles.selectRow, { backgroundColor: '#181514' }]}>
                        <Text style={{ color: C.blue, fontWeight: '700', fontSize: 12 }}>✍️ Diğer (Kendim Yazacağım)</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                )}
              </>
            ) : null}

            {/* Versiyon Seçimi */}
            {abf.model || customModelMobile ? (
              <>
                <Text style={styles.fieldLabel}>VERSİYON / DONANIM PAKETİ</Text>
                {customVersionMobile ? (
                  <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                    <TextInput
                      style={[styles.fieldInput, { flex: 1 }]}
                      value={customVersionMobileInput}
                      onChangeText={setCustomVersionMobileInput}
                      placeholder="Versiyon girin"
                      placeholderTextColor={C.dim}
                    />
                    {!customModelMobile && (
                      <TouchableOpacity onPress={() => { setCustomVersionMobile(false); setAbf(p => ({ ...p, version: '' })); }} style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: C.card }}>
                        <Text style={{ color: C.text, fontSize: 12, fontWeight: '700' }}>Liste</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, marginBottom: 12, maxHeight: 150, overflow: 'hidden' }}>
                    <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
                      {abf.brand && abf.model && CAR_DATA[abf.brand]?.[abf.model] && CAR_DATA[abf.brand][abf.model].map(v => (
                        <TouchableOpacity key={v} onPress={() => setAbf(p => ({ ...p, version: v }))} style={[styles.selectRow, abf.version === v && { borderLeftColor: C.red, borderLeftWidth: 3 }]}>
                          <Text style={{ color: C.text, fontWeight: '700', fontSize: 12 }}>{v}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity onPress={() => {
                        setCustomVersionMobile(true);
                        setAbf(p => ({ ...p, version: '' }));
                      }} style={[styles.selectRow, { backgroundColor: '#181514' }]}>
                        <Text style={{ color: C.blue, fontWeight: '700', fontSize: 12 }}>✍️ Diğer (Kendim Yazacağım)</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                )}
              </>
            ) : null}

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="PLAKA" value={abf.plate} onChangeText={v => setAbf(p => ({ ...p, plate: v }))} placeholder="34 ABC 123" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="KM" value={abf.km} onChangeText={v => setAbf(p => ({ ...p, km: v }))} placeholder="85.000" keyboardType="numeric" />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="MODEL YILI" value={abf.year} onChangeText={v => setAbf(p => ({ ...p, year: v }))} placeholder="2021" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="RENK" value={abf.color} onChangeText={v => setAbf(p => ({ ...p, color: v }))} placeholder="Beyaz" />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>YAKIT TİPİ</Text>
                <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, overflow: 'hidden', height: 44, justifyContent: 'center', marginBottom: 12 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 8, gap: 6 }}>
                    {['Benzin', 'Dizel', 'LPG', 'Hibrit', 'Elektrik'].map(f => (
                      <TouchableOpacity key={f} onPress={() => setAbf(p => ({ ...p, fuel_type: f }))} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: abf.fuel_type === f ? C.red : 'transparent' }}>
                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{f}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>VİTES TİPİ</Text>
                <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, overflow: 'hidden', height: 44, justifyContent: 'center', marginBottom: 12 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 8, gap: 6 }}>
                    {['Otomatik', 'Manuel', 'Yarı Otomatik'].map(g => (
                      <TouchableOpacity key={g} onPress={() => setAbf(p => ({ ...p, gear_type: g }))} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: abf.gear_type === g ? C.red : 'transparent' }}>
                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            <Text style={styles.fieldLabel}>KASA TİPİ</Text>
            <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, overflow: 'hidden', height: 44, justifyContent: 'center', marginBottom: 12 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 8, gap: 6 }}>
                {['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Station Wagon', 'Coupe', 'Cabrio', 'Minivan', 'Panelvan', 'Motosiklet', 'Ticari'].map(b => (
                  <TouchableOpacity key={b} onPress={() => setAbf(p => ({ ...p, body_type: b }))} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: abf.body_type === b ? C.red : 'transparent' }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="ALIŞ FİYATI (₺) *" value={abf.buy_price} onChangeText={v => setAbf(p => ({ ...p, buy_price: v }))} placeholder="850.000" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="HEDEF SATIŞ FİYATI (₺) *" value={abf.sell_price} onChangeText={v => setAbf(p => ({ ...p, sell_price: v }))} placeholder="930.000" keyboardType="numeric" />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="ALINAN KİŞİ" value={abf.seller_name} onChangeText={v => setAbf(p => ({ ...p, seller_name: v }))} placeholder="Ahmet Yılmaz" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="ALINAN TELEFON" value={abf.seller_phone} onChangeText={v => setAbf(p => ({ ...p, seller_phone: v }))} placeholder="0532..." keyboardType="phone-pad" />
              </View>
            </View>

            <Text style={styles.fieldLabel}>ÖDEME HESABI *</Text>
            <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
              {banks.length === 0
                ? <Text style={[styles.emptyTxt, { padding: 12 }]}>Önce banka ekleyin</Text>
                : banks.map(b => (
                  <TouchableOpacity key={b.id} onPress={() => setAbf(p => ({ ...p, bank_id: b.id }))}
                    style={[styles.selectRow, abf.bank_id === b.id && { borderLeftColor: C.red, borderLeftWidth: 3 }]}>
                    <Text style={{ color: C.text, fontWeight: '700', fontSize: 12 }}>{b.bank_name}</Text>
                    <Text style={{ color: C.muted, fontSize: 10 }}>{b.account_name} · {tl(b.balance)}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          <TouchableOpacity disabled={isSavingMobileVehicle} style={[styles.btnRed, isSavingMobileVehicle && { opacity: 0.6 }]} onPress={handleSaveMobileVehicle}>
            <Text style={styles.btnRedTxt}>{isSavingMobileVehicle ? 'Kaydediliyor...' : 'Aracı Kaydet ve Stoka Ekle'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  const renderMasraf = () => {
    const handleKaydet = async () => {
      if (!mf.amount) { showToast('Tutar zorunlu'); return; }
      if (!mf.vehicle_id) { showToast('Araç seçiniz'); return; }
      if (!mf.bank_id) { showToast('Kasa/Banka seçiniz'); return; }
      try {
        const { error } = await supabase.from('expenses').insert([{
          tenant_id: tenant.id,
          vehicle_id: mf.vehicle_id,
          expense_type: mf.expense_type,
          amount: parseFloat(String(mf.amount).replace(/\./g, '').replace(',', '.')) || 0,
          description: mf.description,
          bank_id: mf.bank_id,
          expense_date: mf.expense_date || new Date().toISOString().split('T')[0],
        }]);
        if (error) throw error;
        setMf({ vehicle_id: '', expense_type: 'diger', amount: '', description: '', bank_id: '', expense_date: new Date().toISOString().split('T')[0] });
        showToast('Masraf kaydedildi ✓');
        loadData();
      } catch (err) { Alert.alert('Hata', err.message); }
    };
    const tipleri = ['diger', 'yakit', 'bakim', 'sigorta', 'vergisi', 'muayene', 'lastik', 'yikama', 'noter'];
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
          <View style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Masraf Ekle</Text>

            <Text style={styles.fieldLabel}>ARAÇ *</Text>
            <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
              {vehicles.length === 0
                ? <Text style={[styles.emptyTxt, { padding: 12 }]}>Stoğa araç giriniz</Text>
                : vehicles.map(v => (
                  <TouchableOpacity key={v.id} onPress={() => setMf(p => ({ ...p, vehicle_id: v.id }))}
                    style={[styles.selectRow, mf.vehicle_id === v.id && { borderLeftColor: C.red, borderLeftWidth: 3 }]}>
                    <Text style={{ color: C.text, fontWeight: '700', fontSize: 12 }}>{v.brand} {v.model}</Text>
                    <Text style={{ color: C.muted, fontSize: 10 }}>{v.plate} · {v.status === 'stokta' ? 'Stokta' : 'Satıldı'}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.fieldLabel}>MASRAF TİPİ</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 7, paddingVertical: 4 }}>
                {tipleri.map(k => (
                  <TouchableOpacity key={k} onPress={() => setMf(p => ({ ...p, expense_type: k }))} style={[styles.pillBtn, mf.expense_type === k && styles.pillBtnActive]}>
                    <Text style={[styles.pillBtnTxt, mf.expense_type === k && styles.pillBtnTxtActive]}>{k}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.fieldLabel}>KASA / BANKA *</Text>
            <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
              {banks.length === 0
                ? <Text style={[styles.emptyTxt, { padding: 12 }]}>Önce banka ekleyin</Text>
                : banks.map(b => (
                  <TouchableOpacity key={b.id} onPress={() => setMf(p => ({ ...p, bank_id: b.id }))}
                    style={[styles.selectRow, mf.bank_id === b.id && { borderLeftColor: C.red, borderLeftWidth: 3 }]}>
                    <Text style={{ color: C.text, fontWeight: '700', fontSize: 12 }}>{b.bank_name}</Text>
                    <Text style={{ color: C.muted, fontSize: 10 }}>{b.account_name} · {tl(b.balance)}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            <Field label="TUTAR (₺) *" value={mf.amount} onChangeText={v => setMf(p => ({ ...p, amount: v }))} placeholder="5.000" keyboardType="numeric" />
            <Field label="AÇIKLAMA" value={mf.description} onChangeText={v => setMf(p => ({ ...p, description: v }))} placeholder="Detay..." />
          </View>
          <TouchableOpacity style={styles.btnRed} onPress={handleKaydet}>
            <Text style={styles.btnRedTxt}>Masrafı Kaydet</Text>
          </TouchableOpacity>

          <View style={[styles.sectionCard, { marginTop: 14 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Son Masraflar</Text>
            {expenses.length === 0
              ? <Text style={styles.emptyTxt}>Henüz masraf yok.</Text>
              : expenses.slice(0, 15).map(e => (
                <View key={e.id} style={{ paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.text, fontWeight: '700', fontSize: 12 }}>{e.expense_type || '—'}</Text>
                    <Text style={{ color: C.muted, fontSize: 10 }}>{e.description || ''} · {fmtDate(e.expense_date)}</Text>
                  </View>
                  <Text style={{ color: C.redBright, fontWeight: '900', fontSize: 13 }}>{tl(e.amount)}</Text>
                </View>
              ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: ARAÇ SATIŞ
  // ══════════════════════════════════════════════════════════════
  const renderSatis = () => {
    const sv = stok.find(v => v.id === sf.vehicle_id) || stok[0];
    const satisFiyat = parseFloat(String(sf.sell_price).replace(/\./g, '').replace(',', '.')) || 0;
    const noterUcreti = parseFloat(String(sf.noter).replace(/\./g, '').replace(',', '.')) || 0;
    const aracExpenses = expenses.filter(e => e.vehicle_id === sv?.id).reduce((a, e) => a + parseFloat(e.amount || 0), 0);
    const maliyet = (sv?.buy_price || 0) + aracExpenses + noterUcreti;
    const kar = satisFiyat - maliyet;

    const handleKaydet = async () => {
      if (!sv) { showToast('Stoğa araç ekleyin'); return; }
      if (!sf.sell_price) { showToast('Satış fiyatı girin'); return; }
      if (!sf.bank_id) { showToast('Kasa/Banka seçiniz'); return; }
      try {
        const { error: sErr } = await supabase.from('sales').insert([{
          tenant_id: tenant.id,
          vehicle_id: sv.id,
          sell_price: satisFiyat,
          notary_expense: noterUcreti,
          net_profit: kar,
          sale_date: new Date().toISOString().split('T')[0],
          bank_id: sf.bank_id,
        }]);
        if (sErr) throw sErr;
        showToast(sv.brand + ' ' + sv.model + ' satıldı ✓');
        setSf({ vehicle_id: '', sell_price: '', noter: '', bank_id: '' });
        setTab('araclar'); setAracTab('satildi'); loadData();
      } catch (err) { Alert.alert('Hata', err.message); }
    };

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
          <View style={styles.sectionCard}>
            <Text style={styles.fieldLabel}>SATILACAK ARAÇ</Text>
            <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
              {stok.length === 0
                ? <Text style={[styles.emptyTxt, { padding: 12 }]}>Stokta araç yok</Text>
                : stok.map(v => (
                  <TouchableOpacity key={v.id} onPress={() => setSf(p => ({ ...p, vehicle_id: v.id }))}
                    style={[styles.selectRow, sf.vehicle_id === v.id && { borderLeftColor: C.red, borderLeftWidth: 3 }]}>
                    <Text style={{ color: C.text, fontWeight: '700', fontSize: 13 }}>{v.brand} {v.model}</Text>
                    <Text style={{ color: C.muted, fontSize: 11 }}>{v.plate} · {tl(v.sell_price)}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="SATIŞ FİYATI (₺)" value={sf.sell_price} onChangeText={v => setSf(p => ({ ...p, sell_price: v }))} placeholder="950.000" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="NOTER ÜCRETİ (₺)" value={sf.noter} onChangeText={v => setSf(p => ({ ...p, noter: v }))} placeholder="8.000" keyboardType="numeric" />
              </View>
            </View>

            <Text style={styles.fieldLabel}>KASA / BANKA *</Text>
            <View style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}>
              {banks.length === 0
                ? <Text style={[styles.emptyTxt, { padding: 12 }]}>Önce banka ekleyin</Text>
                : banks.map(b => (
                  <TouchableOpacity key={b.id} onPress={() => setSf(p => ({ ...p, bank_id: b.id }))}
                    style={[styles.selectRow, sf.bank_id === b.id && { borderLeftColor: C.red, borderLeftWidth: 3 }]}>
                    <Text style={{ color: C.text, fontWeight: '700', fontSize: 12 }}>{b.bank_name}</Text>
                    <Text style={{ color: C.muted, fontSize: 10 }}>{b.account_name} · {tl(b.balance)}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>

          {sv && (
            <View style={styles.karCard}>
              <View style={styles.heroOrb1} />
              <Text style={styles.heroLabel}>{sv.brand} {sv.model} · {sv.plate}</Text>
              <View style={{ marginTop: 10, gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#ffd0d0', fontSize: 11 }}>Alış Fiyatı</Text>
                  <Text style={{ color: '#ffd0d0', fontSize: 11 }}>{tl(sv.buy_price)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#ffd0d0', fontSize: 11 }}>Araç Masrafları</Text>
                  <Text style={{ color: '#ffd0d0', fontSize: 11 }}>{tl(aracExpenses)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#ffd0d0', fontSize: 11 }}>Noter Ücreti</Text>
                  <Text style={{ color: '#ffd0d0', fontSize: 11 }}>{tl(noterUcreti)}</Text>
                </View>
              </View>
              <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.2)', marginTop: 12, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={{ color: '#ffd0d0', fontWeight: '800', fontSize: 11, letterSpacing: 1 }}>NET KÂR</Text>
                <Text style={{ fontSize: 30, fontWeight: '900', fontStyle: 'italic', color: kar >= 0 ? '#bbf7d0' : '#fecaca' }}>
                  {(kar >= 0 ? '+' : '') + tl(kar)}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.btnLight} onPress={handleKaydet}>
            <Text style={{ fontWeight: '900', fontSize: 14, color: '#131110' }}>Satışı Tamamla</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: DİĞER
  // ══════════════════════════════════════════════════════════════
  const renderDiger = () => {
    const menuItems = [
      { ad: 'Araç Alış', alt: 'Yeni İlan Ekle', ikon: '＋', ibg: 'rgba(96,165,250,.14)', ic: C.blue, onPress: () => setTab('arac-alis') },
      { ad: 'Müşteri Mesajları', alt: `${messages.length} mesaj, ${unreadMessages.length} okunmamış`, ikon: '💬', ibg: 'rgba(248,113,113,.14)', ic: C.redBright, onPress: () => setTab('mesajlar') },
      { ad: 'Müşteriler', alt: customers.length + ' kayıt', ikon: '👥', ibg: 'rgba(96,165,250,.14)', ic: C.blue, onPress: () => setTab('musteriler') },
      { ad: 'Personel', alt: personnel.length + ' çalışan', ikon: '👤', ibg: 'rgba(192,132,252,.14)', ic: C.purple, onPress: () => setTab('personel') },
      { ad: 'Bankalar', alt: banks.length + ' hesap · ' + tl(bankTop), ikon: '🏦', ibg: 'rgba(45,212,191,.14)', ic: C.teal, onPress: () => setTab('bankalar') },
      { ad: 'Çek / Senet', alt: documents.filter(d => d.status === 'bekliyor').length + ' bekleyen', ikon: '📄', ibg: 'rgba(234,179,8,.14)', ic: C.yellow, onPress: () => setTab('ceksenet') },
      { ad: 'Raporlar', alt: 'Kâr & Masraf', ikon: '📊', ibg: 'rgba(74,222,128,.14)', ic: C.green, onPress: () => setTab('raporlar') },
      { ad: 'Hesaplayıcı', alt: 'Kredi & Taksit', ikon: '%', ibg: 'rgba(251,146,60,.14)', ic: C.orange, onPress: () => setTab('hesap') },
      { ad: 'Abonelik', alt: tenant?.status || 'Trial', ikon: '★', ibg: 'rgba(148,163,184,.14)', ic: '#94a3b8', onPress: () => setTab('abonelik') },
      { ad: 'Ayarlar', alt: tenant?.name || '', ikon: '⚙', ibg: 'rgba(148,163,184,.14)', ic: '#94a3b8', onPress: () => setTab('ayarlar') },
    ];
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {menuItems.map((m, i) => (
            <TouchableOpacity key={i} style={styles.menuCard} onPress={m.onPress} activeOpacity={0.75}>
              <View style={[styles.menuIcon, { backgroundColor: m.ibg }]}>
                <Text style={{ fontSize: 16, color: m.ic }}>{m.ikon}</Text>
              </View>
              <Text style={styles.menuTitle}>{m.ad}</Text>
              <Text style={styles.menuSub}>{m.alt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Oturum & Çıkış */}
        <View style={{ marginTop: 16, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16 }}>
          <Text style={{ fontSize: 10, color: C.muted, fontWeight: '700', marginBottom: 4 }}>OTURUM</Text>
          <Text style={{ fontSize: 13, color: C.text, fontWeight: '600', marginBottom: 12 }}>{session?.user?.email || 'Kullanıcı'}</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Çıkış Yap', 'Oturumu kapatmak istediğinize emin misiniz?', [
              { text: 'Vazgeç', style: 'cancel' },
              { text: 'Çıkış Yap', style: 'destructive', onPress: handleLogout }
            ])}
            style={{ backgroundColor: 'rgba(185,28,28,.15)', borderWidth: 1, borderColor: 'rgba(185,28,28,.3)', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: C.redBright, fontWeight: '800', fontSize: 13 }}>Oturumu Kapat</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.footer}>Galerim v2.0 · BulutGrup Yazılım</Text>
      </ScrollView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: MESAJLAR
  // ══════════════════════════════════════════════════════════════
  const renderMesajlar = () => (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.red} />}>
      <BackBtn label="Diğer" onPress={() => setTab('diger')} />
      {messages.length === 0
        ? <Text style={styles.emptyTxt}>Henüz mesaj yok.</Text>
        : messages.map(msg => (
          <View key={msg.id} style={[styles.msgCard, !msg.is_read && { borderLeftColor: C.yellow, borderLeftWidth: 3 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontWeight: '800', fontSize: 13.5, color: C.text }}>{msg.sender_name}</Text>
              {!msg.is_read && <View style={styles.yeniBadge}><Text style={styles.yeniBadgeTxt}>YENİ</Text></View>}
            </View>
            <Text style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>📞 {msg.sender_phone}</Text>
            <Text style={{ fontSize: 13, color: '#ccc', lineHeight: 18 }}>{msg.message_text}</Text>
            <Text style={{ fontSize: 11, color: C.dim, marginTop: 6, textAlign: 'right' }}>
              {new Date(msg.created_at).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              {!msg.is_read && (
                <TouchableOpacity style={styles.btnSmallGreen} onPress={async () => {
                  await supabase.from('messages').update({ is_read: true }).eq('id', msg.id);
                  setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
                }}>
                  <Text style={{ fontSize: 11, color: C.green, fontWeight: '800' }}>✓ Okundu</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnSmallBlue} onPress={() => { setReplyMsg(msg); setReplyText(''); }}>
                <Text style={{ fontSize: 11, color: C.blue, fontWeight: '800' }}>↩ Yanıtla</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      <Modal visible={!!replyMsg} transparent animationType="slide" onRequestClose={() => setReplyMsg(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Müşteriye Yanıt</Text>
            {replyMsg && <Text style={styles.modalSub}>📞 {replyMsg.sender_phone} numarasına SMS gönderilecek</Text>}
            {replyMsg && (
              <View style={styles.quoteBox}>
                <Text style={{ fontWeight: '700', color: C.text, fontSize: 12 }}>{replyMsg.sender_name}:</Text>
                <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{replyMsg.message_text}</Text>
              </View>
            )}
            <TextInput style={styles.replyInput} value={replyText} onChangeText={setReplyText}
              placeholder="Yanıt mesajınızı yazın..." placeholderTextColor={C.dim}
              multiline numberOfLines={3} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <TouchableOpacity style={[styles.btnDark, { flex: 1 }]} onPress={() => setReplyMsg(null)}>
                <Text style={{ color: C.muted, fontWeight: '700' }}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnBlue, { flex: 2 }]} onPress={async () => {
                if (!replyText.trim()) { showToast('Yanıt metni girin'); return; }
                try {
                  await supabase.from('messages').insert([{
                    tenant_id: replyMsg.tenant_id, vehicle_id: replyMsg.vehicle_id,
                    sender_name: tenant?.name || 'Galeri', sender_phone: tenant?.owner_phone || '',
                    message_text: '↩️ Yanıt: ' + replyText, is_read: true
                  }]);
                  await supabase.from('messages').update({ is_read: true }).eq('id', replyMsg.id);
                  setReplyMsg(null); setReplyText('');
                  showToast('Yanıt kaydedildi');
                  loadData();
                } catch (err) { Alert.alert('Hata', err.message); }
              }}>
                <Text style={{ color: '#fff', fontWeight: '900' }}>Yanıtı Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );

  // ══════════════════════════════════════════════════════════════
  // RENDER: MÜŞTERİLER
  // ══════════════════════════════════════════════════════════════
  const renderMusteriler = () => {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.red} />}>
        <BackBtn label="Diğer" onPress={() => setTab('diger')} />
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Müşteriler</Text>
            <Text style={styles.sectionSub}>{customers.length} kayıt</Text>
          </View>
          {customers.length === 0
            ? <Text style={styles.emptyTxt}>Henüz müşteri kaydı yok.</Text>
            : customers.map(c => (
              <View key={c.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.text, fontWeight: '800', fontSize: 13 }}>{c.name_surname}</Text>
                    <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>📞 {c.phone}</Text>
                    {c.email ? <Text style={{ color: C.dim, fontSize: 10 }}>{c.email}</Text> : null}
                    {c.notes ? <Text style={{ color: C.muted, fontSize: 10, marginTop: 3, fontStyle: 'italic' }}>{c.notes}</Text> : null}
                  </View>
                  <Text style={{ color: C.dim, fontSize: 10 }}>{fmtDate(c.created_at)}</Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: PERSONEL
  // ══════════════════════════════════════════════════════════════
  const renderPersonel = () => {
    const toplamMaas = personnel.reduce((a, p) => a + parseFloat(p.salary || 0), 0);
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.red} />}>
        <BackBtn label="Diğer" onPress={() => setTab('diger')} />

        <View style={styles.heroCard}>
          <View style={styles.heroOrb1} />
          <Text style={styles.heroLabel}>TOPLAM MAAŞ GİDERİ</Text>
          <Text style={styles.heroValue}>{tl(toplamMaas)}</Text>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillTxt}>{personnel.length} çalışan</Text>
          </View>
        </View>

        <View style={[styles.sectionCard, { marginTop: 14 }]}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Personel Listesi</Text>
          {personnel.length === 0
            ? <Text style={styles.emptyTxt}>Henüz personel kaydı yok.</Text>
            : personnel.map(p => (
              <View key={p.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.text, fontWeight: '800', fontSize: 13 }}>{p.first_name} {p.last_name}</Text>
                    <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>📞 {p.phone}</Text>
                    {p.email ? <Text style={{ color: C.dim, fontSize: 10 }}>{p.email}</Text> : null}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: C.green, fontWeight: '900', fontSize: 14 }}>{tl(p.salary)}</Text>
                    <Text style={{ color: C.muted, fontSize: 10 }}>aylık maaş</Text>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: BANKALAR
  // ══════════════════════════════════════════════════════════════
  const renderBankalar = () => {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.red} />}>
        <BackBtn label="Diğer" onPress={() => setTab('diger')} />

        <View style={styles.heroCard}>
          <View style={styles.heroOrb1} />
          <Text style={styles.heroLabel}>TOPLAM BAKİYE</Text>
          <Text style={styles.heroValue}>{tl(bankTop)}</Text>
          <View style={styles.heroPill}><Text style={styles.heroPillTxt}>{banks.length} hesap</Text></View>
        </View>

        <View style={[styles.sectionCard, { marginTop: 14 }]}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Hesaplar</Text>
          {banks.length === 0
            ? <Text style={styles.emptyTxt}>Henüz banka/kasa kaydı yok.</Text>
            : banks.map(b => (
              <View key={b.id} style={{ paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.text, fontWeight: '800', fontSize: 14 }}>{b.bank_name}</Text>
                    <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{b.account_name}</Text>
                    {b.iban ? <Text style={{ color: C.dim, fontSize: 10, marginTop: 2 }}>IBAN: {b.iban}</Text> : null}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: parseFloat(b.balance) >= 0 ? C.green : C.redBright, fontWeight: '900', fontSize: 16 }}>{tl(b.balance)}</Text>
                    <Text style={{ color: C.dim, fontSize: 10 }}>bakiye</Text>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: ÇEK / SENET
  // ══════════════════════════════════════════════════════════════
  const renderCekSenet = () => {
    const bekleyen = documents.filter(d => d.status === 'bekliyor');
    const tahsil = documents.filter(d => d.status !== 'bekliyor');
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.red} />}>
        <BackBtn label="Diğer" onPress={() => setTab('diger')} />

        <View style={styles.statGrid}>
          <StatCard label="BEKLEYEN" value={tl(bekleyenVade)} sub={bekleyen.length + ' belge'} subColor={C.yellow} />
          <StatCard label="TAHSİL / ÖDENDİ" value={tahsil.length} sub="belge" subColor={C.green} />
        </View>

        <View style={[styles.sectionCard, { marginTop: 14 }]}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Belgeler</Text>
          {documents.length === 0
            ? <Text style={styles.emptyTxt}>Henüz çek/senet kaydı yok.</Text>
            : documents.map(d => (
              <View key={d.id} style={{ paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <View style={{ backgroundColor: d.type === 'cek' ? 'rgba(96,165,250,.2)' : 'rgba(192,132,252,.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ color: d.type === 'cek' ? C.blue : C.purple, fontSize: 10, fontWeight: '800' }}>{d.type === 'cek' ? 'ÇEK' : 'SENET'}</Text>
                      </View>
                      <View style={{ backgroundColor: d.status === 'bekliyor' ? 'rgba(234,179,8,.2)' : 'rgba(74,222,128,.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ color: d.status === 'bekliyor' ? C.yellow : C.green, fontSize: 10, fontWeight: '800' }}>{d.status.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={{ color: C.text, fontWeight: '700', fontSize: 13 }}>{d.debtor}</Text>
                    <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>Vade: {fmtDate(d.due_date)}</Text>
                  </View>
                  <Text style={{ color: d.status === 'bekliyor' ? C.yellow : C.green, fontWeight: '900', fontSize: 15 }}>{tl(d.amount)}</Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: RAPORLAR
  // ══════════════════════════════════════════════════════════════
  const renderRaporlar = () => {
    const toplamMasraf = expenses.reduce((a, e) => a + parseFloat(e.amount || 0), 0);
    const ort = sales.length > 0 ? netProfit / sales.length : 0;
    const enKarli = [...sales].sort((a, b) => b.net_profit - a.net_profit)[0];
    const enKarliArac = enKarli ? vehicles.find(v => v.id === enKarli.vehicle_id) : null;

    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.red} />}>
        <BackBtn label="Diğer" onPress={() => setTab('diger')} />

        <View style={styles.heroCard}>
          <View style={styles.heroOrb1} /><View style={styles.heroOrb2} />
          <Text style={styles.heroLabel}>TOPLAM NET KÂR</Text>
          <Text style={styles.heroValue}>{netProfit >= 0 ? '+' : ''}{tl(netProfit)}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <View style={styles.heroPill}><Text style={styles.heroPillTxt}>{sales.length} satış</Text></View>
            <View style={styles.heroPill}><Text style={styles.heroPillTxt}>{tl(salesCiro)} ciro</Text></View>
          </View>
        </View>

        <View style={styles.statGrid}>
          <StatCard label="TOPLAM CİRO" value={tl(salesCiro)} subColor={C.green} />
          <StatCard label="TOPLAM MASRAF" value={tl(toplamMasraf)} subColor={C.redBright} />
          <StatCard label="ORTALAMA KÂR" value={tl(ort)} sub="satış başına" />
          <StatCard label="STOK DEĞERİ" value={tl(stokDeger)} sub={stok.length + ' araç'} />
        </View>

        {enKarliArac && (
          <View style={[styles.sectionCard, { marginTop: 14 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>En Kârlı Satış</Text>
            <Text style={{ color: C.text, fontWeight: '800', fontSize: 15 }}>{enKarliArac.brand} {enKarliArac.model}</Text>
            <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{enKarliArac.plate}</Text>
            <Text style={{ color: C.green, fontWeight: '900', fontSize: 22, marginTop: 8 }}>+{tl(enKarli.net_profit)}</Text>
          </View>
        )}

        <View style={[styles.sectionCard, { marginTop: 14 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aylık Kâr Trendi</Text>
            <Text style={styles.sectionSub}>Son 6 ay</Text>
          </View>
          <BarChart bars={ay6Kar} />
        </View>

        <View style={[styles.sectionCard, { marginTop: 14 }]}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Masraf Kalemleri</Text>
          {(() => {
            const grouped = {};
            expenses.forEach(e => { grouped[e.expense_type || 'diger'] = (grouped[e.expense_type || 'diger'] || 0) + parseFloat(e.amount || 0); });
            return Object.entries(grouped).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border }}>
                <Text style={{ color: C.text, fontWeight: '700', fontSize: 12 }}>{k}</Text>
                <Text style={{ color: C.redBright, fontWeight: '900', fontSize: 12 }}>{tl(v)}</Text>
              </View>
            ));
          })()}
          {expenses.length === 0 && <Text style={styles.emptyTxt}>Masraf kaydı yok.</Text>}
        </View>
      </ScrollView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: HESAPLAYICI
  // ══════════════════════════════════════════════════════════════
  const renderHesap = () => {

    const anapar = parseFloat(krediBorcuStr.replace(/\./g, '').replace(',', '.')) || 0;
    const aylikFaiz = (parseFloat(faizStr.replace(',', '.')) || 0) / 100 / 12;
    const ay = parseInt(ayStr) || 1;
    let taksit = 0;
    if (aylikFaiz > 0) {
      taksit = anapar * (aylikFaiz * Math.pow(1 + aylikFaiz, ay)) / (Math.pow(1 + aylikFaiz, ay) - 1);
    } else {
      taksit = anapar / ay;
    }
    const toplamOdeme = taksit * ay;
    const toplamFaiz = toplamOdeme - anapar;

    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
          <BackBtn label="Diğer" onPress={() => setTab('diger')} />
          <View style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Kredi & Taksit Hesaplayıcı</Text>
            <Field label="KREDİ TUTARI (₺)" value={krediBorcuStr} onChangeText={setKrediBorcuStr} placeholder="500.000" keyboardType="numeric" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="AYLIK FAİZ (%)" value={faizStr} onChangeText={setFaizStr} placeholder="4.50" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="VADE (AY)" value={ayStr} onChangeText={setAyStr} placeholder="60" keyboardType="numeric" />
              </View>
            </View>
          </View>

          <View style={styles.karCard}>
            <View style={styles.heroOrb1} />
            <Text style={styles.heroLabel}>AYLIK TAKSİT</Text>
            <Text style={{ fontSize: 32, fontWeight: '900', fontStyle: 'italic', color: C.text, marginTop: 6 }}>{tl(taksit)}</Text>
            <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.2)', marginTop: 14, paddingTop: 14, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ffd0d0', fontSize: 12 }}>Toplam Ödeme</Text>
                <Text style={{ color: C.text, fontWeight: '800', fontSize: 12 }}>{tl(toplamOdeme)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ffd0d0', fontSize: 12 }}>Toplam Faiz</Text>
                <Text style={{ color: C.redBright, fontWeight: '800', fontSize: 12 }}>{tl(toplamFaiz)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ffd0d0', fontSize: 12 }}>Anapara</Text>
                <Text style={{ color: C.green, fontWeight: '800', fontSize: 12 }}>{tl(anapar)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: ABONELİK
  // ══════════════════════════════════════════════════════════════
  const renderAbonelik = () => {
    const trialEnd = tenant?.trial_ends_at ? new Date(tenant.trial_ends_at) : null;
    const subEnd = tenant?.subscription_ends_at ? new Date(tenant.subscription_ends_at) : null;
    const now = new Date();
    const kalanGun = trialEnd ? Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))) : 0;
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        <BackBtn label="Diğer" onPress={() => setTab('diger')} />

        <View style={styles.heroCard}>
          <View style={styles.heroOrb1} /><View style={styles.heroOrb2} />
          <Text style={styles.heroLabel}>ABONELİK DURUMU</Text>
          <Text style={{ fontSize: 24, fontWeight: '900', color: '#fff', marginTop: 8 }}>
            {tenant?.status === 'active' ? '✓ Aktif' : tenant?.status === 'trial' ? '⏳ Deneme' : tenant?.status || '—'}
          </Text>
          {kalanGun > 0 && <Text style={{ color: '#ffd0d0', fontSize: 13, marginTop: 6 }}>{kalanGun} gün kaldı</Text>}
        </View>

        <View style={[styles.sectionCard, { marginTop: 14 }]}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Paket Bilgileri</Text>
          {[
            ['Durum', tenant?.status === 'active' ? 'Aktif ✓' : tenant?.status === 'trial' ? 'Deneme Sürümü' : tenant?.status || '—'],
            ['Deneme Bitiş', fmtDate(tenant?.trial_ends_at)],
            ['Abonelik Bitiş', fmtDate(tenant?.subscription_ends_at)],
          ].map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Text style={{ color: C.muted, fontSize: 12, fontWeight: '700' }}>{k}</Text>
              <Text style={{ color: C.text, fontSize: 12, fontWeight: '800' }}>{v}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.sectionCard, { marginTop: 14 }]}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Planlar</Text>
          {[
            { isim: 'Aylık Plan', fiyat: '6.490 ₺ / ay', renk: C.blue },
            { isim: 'Yıllık Plan', fiyat: '48.000 ₺ / yıl', renk: C.green, tasarruf: '%38 tasarruf' },
          ].map((p, i) => (
            <View key={i} style={{ borderWidth: 1, borderColor: p.renk + '40', borderRadius: 14, padding: 14, marginBottom: 10, backgroundColor: p.renk + '10' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: C.text, fontWeight: '800', fontSize: 14 }}>{p.isim}</Text>
                  {p.tasarruf && <Text style={{ color: C.green, fontSize: 11, fontWeight: '700', marginTop: 2 }}>{p.tasarruf}</Text>}
                </View>
                <Text style={{ color: p.renk, fontWeight: '900', fontSize: 16 }}>{p.fiyat}</Text>
              </View>
            </View>
          ))}
          <Text style={{ color: C.muted, fontSize: 11, textAlign: 'center', marginTop: 6 }}>Abonelik için tenant paneline giriniz</Text>
        </View>
      </ScrollView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER: AYARLAR
  // ══════════════════════════════════════════════════════════════
  const renderAyarlar = () => {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        <BackBtn label="Diğer" onPress={() => setTab('diger')} />

        <View style={[styles.sectionCard]}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>Galeri Bilgileri</Text>
          {[
            ['Galeri Adı', tenant?.name || '—'],
            ['Yetkili', tenant?.owner_name || '—'],
            ['Telefon', tenant?.owner_phone || '—'],
            ['E-Posta', tenant?.owner_email || '—'],
            ['Vergi Dairesi', tenant?.tax_office || '—'],
            ['Vergi No', tenant?.tax_number || '—'],
            ['Şirket Ünvanı', tenant?.company_title || '—'],
            ['Adres', tenant?.address || '—'],
          ].map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Text style={{ color: C.muted, fontSize: 12, fontWeight: '700', flex: 1 }}>{k}</Text>
              <Text style={{ color: C.text, fontSize: 12, fontWeight: '600', flex: 2, textAlign: 'right' }} numberOfLines={1}>{v}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.sectionCard, { marginTop: 14 }]}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Hesap</Text>
          <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
            <Text style={{ color: C.muted, fontSize: 12, fontWeight: '700' }}>Giriş E-Postası</Text>
            <Text style={{ color: C.text, fontSize: 13, fontWeight: '600', marginTop: 3 }}>{session?.user?.email || '—'}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => Alert.alert('Çıkış Yap', 'Oturumu kapatmak istediğinize emin misiniz?', [
            { text: 'Vazgeç', style: 'cancel' },
            { text: 'Çıkış Yap', style: 'destructive', onPress: handleLogout }
          ])}
          style={{ marginTop: 20, backgroundColor: 'rgba(185,28,28,.15)', borderWidth: 1, borderColor: 'rgba(185,28,28,.3)', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}>
          <Text style={{ color: C.redBright, fontWeight: '800', fontSize: 14 }}>Oturumu Kapat</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>Galerim v2.0 · BulutGrup Yazılım</Text>
      </ScrollView>
    );
  };

  // ══════════════════════════════════════════════════════════════
  // EKRAN İÇERİĞİ SEÇİMİ
  // ══════════════════════════════════════════════════════════════
  const renderContent = () => {
    switch (tab) {
      case 'genel':      return renderGenel();
      case 'araclar':    return renderAraclar();
      case 'arac-alis':  return renderAracAlis();
      case 'masraf':     return renderMasraf();
      case 'satis':      return renderSatis();
      case 'diger':      return renderDiger();
      case 'mesajlar':   return renderMesajlar();
      case 'musteriler': return renderMusteriler();
      case 'personel':   return renderPersonel();
      case 'bankalar':   return renderBankalar();
      case 'ceksenet':   return renderCekSenet();
      case 'raporlar':   return renderRaporlar();
      case 'hesap':      return renderHesap();
      case 'abonelik':   return renderAbonelik();
      case 'ayarlar':    return renderAyarlar();
      default:           return renderGenel();
    }
  };

  const basliklar = {
    genel: 'Genel Bakış', araclar: 'Araçlarım', 'arac-alis': 'Araç Alış',
    masraf: 'Masraf Ekle', satis: 'Araç Satış', diger: 'Diğer',
    mesajlar: 'Mesajlar', musteriler: 'Müşteriler', personel: 'Personel',
    bankalar: 'Bankalar', ceksenet: 'Çek / Senet', raporlar: 'Raporlar',
    hesap: 'Hesaplayıcı', abonelik: 'Abonelik', ayarlar: 'Ayarlar'
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGaleri}>{tenant?.name?.toUpperCase() || 'GALERİ'}</Text>
          <Text style={styles.headerBaslik}>{basliklar[tab] || ''}</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => setTab('diger')}>
          <Text style={styles.avatarTxt}>{(tenant?.name || 'G')[0]}</Text>
        </TouchableOpacity>
      </View>

      {/* İçerik */}
      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBarWrap}>
        <View style={styles.tabBar}>
          {tabs.map(t => {
            const active = tab === t.id;
            return (
              <TouchableOpacity key={t.id} style={[styles.tabBtn, active && styles.tabBtnActive]}
                onPress={() => { setTab(t.id); if (t.id === 'araclar') setDetay(null); }} activeOpacity={0.8}>
                <Text style={[styles.tabIkon, { color: active ? '#fff' : C.muted }]}>{t.ikon}</Text>
                {active && <Text style={styles.tabLabel}>{t.label}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Toast msg={toast} />
    </SafeAreaView>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  loadingWrap: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10, backgroundColor: C.bg },
  headerGaleri: { fontSize: 10, fontWeight: '700', color: C.muted, letterSpacing: 1 },
  headerBaslik: { fontSize: 22, fontWeight: '900', fontStyle: 'italic', color: C.text, letterSpacing: -0.5 },
  avatar: { width: 38, height: 38, borderRadius: 14, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#fff', fontWeight: '900', fontSize: 14 },

  heroCard: { backgroundColor: C.red, borderRadius: 24, padding: 22, overflow: 'hidden', position: 'relative',
    shadowColor: C.red, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16 },
  heroOrb1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,.07)' },
  heroOrb2: { position: 'absolute', bottom: -60, right: 30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,.05)' },
  heroLabel: { fontSize: 10, fontWeight: '800', color: '#ffd0d0', letterSpacing: 1 },
  heroValue: { fontSize: 36, fontWeight: '900', fontStyle: 'italic', color: '#fff', marginTop: 6, letterSpacing: -1 },
  heroPill: { backgroundColor: 'rgba(255,255,255,.16)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  heroPillTxt: { fontSize: 11, fontWeight: '800', color: '#fff' },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  statCard: { width: (W - 42) / 2, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 15 },
  statLabel: { fontSize: 9.5, color: C.muted, fontWeight: '800', letterSpacing: 0.5 },
  statValue: { fontSize: 16, fontWeight: '900', color: C.text, marginTop: 5, letterSpacing: -0.5 },
  statSub: { fontSize: 10.5, marginTop: 3, fontWeight: '700' },

  sectionCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 18, marginTop: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: C.text },
  sectionSub: { fontSize: 10.5, color: C.muted, fontWeight: '700' },

  barChartWrap: { flexDirection: 'row', alignItems: 'flex-end', height: 90 },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  bar: { width: '70%', borderRadius: 8 },
  barLabel: { fontSize: 9.5, fontWeight: '800' },

  actRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#26221f' },
  actIcon: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  actIconTxt: { fontSize: 13, fontWeight: '900' },
  actText: { fontSize: 12, fontWeight: '700', color: C.text },
  actWhen: { fontSize: 10.5, color: C.muted, marginTop: 1 },

  vehicleRow: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 20, padding: 14, flexDirection: 'row', gap: 13, alignItems: 'center', marginBottom: 10 },
  vehicleThumb: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#2b2724', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  vehicleThumbLetter: { fontSize: 18, fontWeight: '900', fontStyle: 'italic', color: '#6b6259' },
  vehicleStripe: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 3 },
  vehicleTitle: { fontSize: 13.5, fontWeight: '800', color: C.text },
  vehicleSub: { fontSize: 10.5, color: C.muted, marginTop: 3, fontWeight: '600' },
  vehiclePrice: { fontSize: 14, fontWeight: '900', letterSpacing: -0.5 },
  vehiclePriceLabel: { fontSize: 9.5, color: C.muted, marginTop: 2, fontWeight: '700' },

  pillBtn: { borderWidth: 1, borderColor: C.border2, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 9 },
  pillBtnActive: { backgroundColor: C.text, borderColor: C.text },
  pillBtnTxt: { fontSize: 12, fontWeight: '800', color: C.muted },
  pillBtnTxtActive: { color: '#131110' },

  fieldLabel: { fontSize: 9.5, fontWeight: '800', color: C.muted, letterSpacing: 0.6, marginBottom: 5 },
  fieldInput: { borderWidth: 1, borderColor: C.border2, borderRadius: 12, padding: 12, fontSize: 13, backgroundColor: '#131110', color: C.text },

  selectRow: { padding: 12, borderBottomWidth: 1, borderBottomColor: C.border },

  detayImg: { height: 130, backgroundColor: '#1a1714', borderRadius: 20, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 1, borderColor: C.border },
  detayImgLetter: { fontSize: 52, fontWeight: '900', fontStyle: 'italic', color: C.border2 },
  detayBadge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  detayBadgeTxt: { fontSize: 10, fontWeight: '800' },
  detayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  detayItem: { width: (W - 48) / 2, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 12 },
  detayKey: { fontSize: 9, color: C.muted, fontWeight: '800', letterSpacing: 0.5 },
  detayVal: { fontSize: 13, color: C.text, fontWeight: '700', marginTop: 4 },

  karCard: { backgroundColor: C.red, borderRadius: 20, padding: 18, overflow: 'hidden', position: 'relative', marginTop: 12,
    shadowColor: C.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12 },

  btnRed: { backgroundColor: C.red, borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 12,
    shadowColor: C.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
  btnRedTxt: { color: '#fff', fontWeight: '900', fontSize: 14 },
  btnLight: { backgroundColor: C.text, borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 12 },
  btnDark: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border2, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnBlue: { backgroundColor: C.blue, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnSmallGreen: { backgroundColor: 'rgba(74,222,128,.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnSmallBlue: { backgroundColor: 'rgba(96,165,250,.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },

  menuCard: { width: (W - 42) / 2, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 18, padding: 16 },
  menuIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  menuTitle: { fontSize: 13, fontWeight: '800', color: C.text },
  menuSub: { fontSize: 10, color: C.muted, marginTop: 2, fontWeight: '700' },

  msgCard: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, marginBottom: 10 },
  yeniBadge: { backgroundColor: '#F97316', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  yeniBadgeTxt: { fontSize: 9, fontWeight: '800', color: '#fff' },

  modalSheet: { backgroundColor: '#1a1714', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, borderTopWidth: 1, borderColor: C.border },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: C.text, marginBottom: 6 },
  modalSub: { fontSize: 12, color: C.muted, marginBottom: 14 },
  quoteBox: { backgroundColor: '#131110', padding: 12, borderRadius: 10, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: C.border2 },
  replyInput: { borderWidth: 1, borderColor: C.border2, borderRadius: 10, padding: 12, color: C.text, fontSize: 13.5, minHeight: 80, textAlignVertical: 'top' },

  tabBarWrap: { paddingHorizontal: 14, paddingBottom: 10, paddingTop: 8, backgroundColor: C.bg },
  tabBar: { backgroundColor: 'rgba(29,26,24,.95)', borderWidth: 1, borderColor: C.border, borderRadius: 999, flexDirection: 'row', padding: 6, gap: 2 },
  tabBtn: { flex: 1, borderRadius: 999, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  tabBtnActive: { flex: 2.2, backgroundColor: C.red },
  tabIkon: { fontSize: 13, fontWeight: '900', fontStyle: 'italic' },
  tabLabel: { fontSize: 11, fontWeight: '800', color: '#fff' },

  emptyTxt: { textAlign: 'center', color: C.muted, fontStyle: 'italic', marginTop: 24 },
  footer: { textAlign: 'center', fontSize: 10, color: C.dim, marginTop: 20, fontWeight: '700' },
  toast: { position: 'absolute', bottom: 90, left: '10%', right: '10%', backgroundColor: '#f5f2ee', borderRadius: 999, paddingVertical: 12, paddingHorizontal: 22, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  toastTxt: { color: '#131110', fontWeight: '800', fontSize: 13 },
});
