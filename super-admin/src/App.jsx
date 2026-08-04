import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
  Users,
  Car,
  DollarSign,
  TrendingUp,
  Gift,
  FileText,
  PieChart,
  Settings,
  LogOut,
  Lock,
  Search,
  Eye,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Page Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Database States
  const [tenants, setTenants] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tenant Details Modal/Page State
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Status Alerts
  const [alert, setAlert] = useState({ type: '', message: '' });

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  // --- Auth Check ---
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('superadmin_user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    
    // Check superadmin rules
    if (email === 'admin@bulutgrup.tr' || email === 'root@bulutgrup.tr') {
      const mockUser = { email, role: 'superadmin' };
      setUser(mockUser);
      sessionStorage.setItem('superadmin_user', JSON.stringify(mockUser));
      setAuthError('');
    } else {
      setAuthError('Yalnızca yetkili BulutGrup yöneticileri giriş yapabilir.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('superadmin_user');
  };

  // --- Fetch System-Wide Data ---
  useEffect(() => {
    if (!user) return;
    fetchAllData();
  }, [user]);

  async function fetchAllData() {
    setIsLoading(true);
    try {
      // 1. Fetch all tenants
      const { data: tData } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
      setTenants(tData || []);

      // 2. Fetch all vehicles across all tenants
      const { data: vData } = await supabase.from('vehicles').select('*');
      setVehicles(vData || []);

      // 3. Fetch all iyzico payments
      const { data: payData } = await supabase.from('iyzico_payments').select('*').order('created_at', { ascending: false });
      setPayments(payData || []);

      // 4. Fetch all sales
      const { data: sData } = await supabase.from('sales').select('*');
      setSales(sData || []);

      // 5. Fetch admin notifications (new registrations)
      const { data: notifData } = await supabase.from('admin_notifications').select('*').order('created_at', { ascending: false });
      setNotifications(notifData || []);
    } catch (err) {
      console.error('System data load error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // --- Gift Days Action ---
  const handleGiftDays = async (tenantId, days) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    let currentEnds = new Date(tenant.subscription_ends_at || tenant.trial_ends_at || new Date());
    if (currentEnds < new Date()) {
      currentEnds = new Date();
    }
    currentEnds.setDate(currentEnds.getDate() + days);

    try {
      const { error } = await supabase
        .from('tenants')
        .update({
          subscription_ends_at: currentEnds.toISOString(),
          status: 'active'
        })
        .eq('id', tenantId);

      if (error) throw error;

      triggerAlert('success', `${tenant.name} işletmesine +${days} gün hediye edildi!`);
      
      // Update local state
      setTenants(prev => prev.map(t => {
        if (t.id === tenantId) {
          return { ...t, subscription_ends_at: currentEnds.toISOString(), status: 'active' };
        }
        return t;
      }));

      if (selectedTenant && selectedTenant.id === tenantId) {
        setSelectedTenant(prev => ({ ...prev, subscription_ends_at: currentEnds.toISOString(), status: 'active' }));
      }
    } catch (err) {
      triggerAlert('error', 'Hediye gün verilemedi: ' + err.message);
    }
  };

  // --- Calculation Helpers ---
  const formatCur = (v) => '₺' + Math.round(v || 0).toLocaleString('tr-TR');

  const getRemainingDays = (tenant) => {
    const ends = new Date(tenant.subscription_ends_at || tenant.trial_ends_at);
    const diff = ends.getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // --- Render Login View ---
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#faf8f5', padding: '24px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '16px', padding: '34px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
            <div style={{ background: 'linear-gradient(120deg, #1a1a1a, #B91C1C)', color: '#fff', padding: '12px 18px', borderRadius: '12px', fontWeight: 900, fontStyle: 'italic', fontSize: '24px', letterSpacing: '-0.04em' }}>
              G CP
            </div>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, textAlign: 'center', marginBottom: '6px' }}>Süper Admin Kontrol Paneli</h2>
          <p style={{ fontSize: '12.5px', color: '#8a8177', textAlign: 'center', marginBottom: '24px' }}>BulutGrup yöneticileri için giriş ekranı</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Yönetici E-posta *</span>
              <input
                type="email"
                required
                className="input-field"
                placeholder="Örn. admin@bulutgrup.tr"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </label>
            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8a8177' }}>Şifre *</span>
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

  // --- Render SuperAdmin Dashboard View ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <header style={{ height: '64px', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ fontWeight: 900, fontStyle: 'italic', fontSize: '20px', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#B91C1C' }}>G</span>
            <span>GALERİM CP</span>
          </div>
          <span style={{ fontSize: '10px', background: '#B91C1C', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, marginLeft: '6px' }}>SUPERADMIN</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
            <span style={{ display: 'block', fontWeight: 700 }}>{user.email}</span>
            <span style={{ color: '#a39a8e' }}>BulutGrup System Root</span>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#a39a8e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#a39a8e'}>
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
          <button onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}><Settings size={16} /> Sistem Ayarları</button>
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
                  <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', fontWeight: 700 }}>{tenants.filter(t => t.status === 'active').length} Aktif Üye</div>
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
                            <div style={{ fontSize: '11.5px', color: '#8a8177' }}>{t.slug}.galerim.app</div>
                          </td>
                          <td>
                            <div>{t.owner_name}</div>
                            <div style={{ fontSize: '11px', color: '#8a8177' }}>{t.owner_phone}</div>
                          </td>
                          <td>
                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: t.status === 'active' ? '#e8f5ec' : '#fef3c7', color: t.status === 'active' ? '#16a34a' : '#d97706' }}>
                              {t.status}
                            </span>
                          </td>
                          <td>
                            {t.subscription_ends_at ? new Date(t.subscription_ends_at).toLocaleDateString('tr-TR') : 'Deneme Süresi'}
                          </td>
                          <td style={{ fontWeight: 700, color: remDays < 3 ? '#b91c1c' : '#191512' }}>
                            {remDays} gün
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
                                setSelectedTenant({
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

          {/* PAGE: PAYMENTS LOGS */}
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

          {/* PAGE: ANALYTICS */}
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

          {/* PAGE: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="fade-in" style={{ maxWidth: '580px', margin: '0 auto' }}>
              <div style={{ background: '#fff', border: '1px solid #e7e2da', borderRadius: '12px', padding: '24px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px' }}>Sistem Ayarları</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                  <p style={{ color: '#5c554c' }}>Bu arayüz BulutGrup yöneticileri tarafından kullanılmaktadır.</p>
                  <div><strong>Veritabanı Sağlayıcısı:</strong> Supabase Cloud</div>
                  <div><strong>Uygulama API Protokolü:</strong> HTTPS / WSS</div>
                  <div><strong>iyzico Ödeme Ağ Geçidi:</strong> Aktif (Test Modu)</div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* DETAY MODALI (TENANT DETAIL WINDOW) */}
      {selectedTenant && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,15,12,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '820px', width: '100%', maxHeight: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #eee9e1' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{selectedTenant.name} — Detay Bilgileri</h3>
                <span style={{ fontSize: '11.5px', color: '#8a8177' }}>{selectedTenant.owner_email} · {selectedTenant.owner_phone}</span>
              </div>
              <button onClick={() => setSelectedTenant(null)} style={{ border: 'none', background: '#f0ece5', cursor: 'pointer', borderRadius: '8px', width: '30px', height: '30px', fontWeight: '700' }}>✕</button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Analitik Özet */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: '#faf8f5', border: '1px solid #eee9e1', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800 }}>Stoktaki Toplam Araç</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{selectedTenant.vehicles.filter(v => v.status === 'stokta').length} Araç</div>
                </div>
                <div style={{ background: '#faf8f5', border: '1px solid #eee9e1', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800 }}>Satılan Toplam Araç</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{selectedTenant.vehicles.filter(v => v.status === 'satildi').length} Araç</div>
                </div>
                <div style={{ background: '#faf8f5', border: '1px solid #eee9e1', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#8a8177', fontWeight: 800 }}>Net Kâr Marjı (Toplam)</div>
                  <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px', color: '#16a34a' }}>{formatCur(selectedTenant.sales.reduce((a, b) => a + parseFloat(b.net_profit || 0), 0))}</div>
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
                      {selectedTenant.vehicles.map(v => (
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
