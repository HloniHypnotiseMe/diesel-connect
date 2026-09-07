import React, { useState, useEffect } from 'react';

const App = () => {
  const [liters, setLiters] = useState(20000);
  const [marketPrice, setMarketPrice] = useState(22.85);
  const [activeTab, setActiveTab] = useState<'buyer' | 'supplier' | 'driver'>('buyer');
  const [dmreOffset, setDmreOffset] = useState(0);

  // DMRE ticker animation
  useEffect(() => {
    const i = setInterval(() => setDmreOffset(o => (o + 1) % 1000), 30);
    return () => clearInterval(i);
  }, []);

  const dcDiscount = 0.62; // saving per liter
  const [toast, setToast] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const dcPrice = marketPrice - dcDiscount;
  const marketTotal = liters * marketPrice;
  const dcTotal = liters * dcPrice;
  const saving = marketTotal - dcTotal;

  const handleQuote = () => {
    setToast("Quote flow → PWA at dieselconnect.c6group.co.za/app • OTP login • Dashboard preview below");
    document.getElementById('dashboards')?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleLogin = () => {
    setShowLogin(true);
    setToast("Login via OTP at dieselconnect.c6group.co.za/app • No password");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-amber-400 selection:text-black overflow-x-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 999px; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-white px-5 py-3 text-[11px] font-bold tracking-wide text-black shadow-2xl border border-zinc-200 max-w-[90vw] text-center">
          {toast}
        </div>
      )}
      {showLogin && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="w-full max-w-[360px] rounded-[20px] border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-bold tracking-widest">LOGIN • PWA /APP</div>
              <button onClick={()=>setShowLogin(false)} className="rounded-full bg-zinc-800 px-3 py-1 text-[11px]">Close</button>
            </div>
            <div className="mt-4 text-[13px] font-semibold">OTP login — no password</div>
            <div className="mt-2 text-[11px] leading-[1.6] text-zinc-400">Enter cell → get OTP → dashboard. Buyer: CIPC + VAT + Address. Supplier: WSL + Insurance.</div>
            <div className="mt-4 rounded-xl bg-zinc-950 border border-zinc-800 p-3">
              <div className="text-[10px] tracking-widest text-zinc-500">DEMO OTP FLOW</div>
              <input placeholder="082 123 4567" className="mt-2 w-full rounded-full bg-zinc-900 border border-zinc-800 px-4 py-2.5 text-[12px] outline-none" />
              <button onClick={()=>{ setToast("OTP sent (demo) → 123456"); setShowLogin(false); }} className="mt-3 w-full rounded-full bg-amber-400 py-2.5 text-[12px] font-bold text-black">Send OTP →</button>
            </div>
            <div className="mt-3 text-[10px] text-center text-zinc-500">dieselconnect.c6group.co.za/app • Works offline</div>
          </div>
        </div>
      )}

      {/* DMRE TICKER */}
      <div className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl overflow-hidden">
        <div className="flex h-8 items-center w-full max-w-[100vw] overflow-hidden text-[11px] font-medium tracking-widest">
          <div className="flex shrink-0 items-center gap-2 bg-amber-400 px-3 py-1 text-black font-bold z-10">DMRE LIVE</div>
          <div className="relative flex-1 overflow-hidden w-full">
            <div className="flex gap-6 px-4 text-zinc-500 whitespace-nowrap overflow-hidden">
              <span>Diesel 50ppm Coast R21.12 • Gauteng R21.87 • Petrol 95 R21.34 • Next adjustment 04 Feb 2026 • Wholesale + BFP tracked</span>
            </div>
          </div>
          <div className="hidden md:flex shrink-0 items-center gap-2 border-l border-zinc-800 px-4 text-zinc-500">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></div>
            C6 GROUP • EST 2019
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="sticky top-8 z-40 border-b border-zinc-900 bg-[#09090b]/80 backdrop-blur-xl overflow-hidden">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between px-6 md:px-8 w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-amber-400 font-black text-[16px] tracking-tighter text-black">D</div>
            <div className="leading-[0.9]">
              <div className="text-[14px] font-bold tracking-tight">DIESELCONNECT</div>
              <div className="text-[10px] font-medium tracking-[0.2em] text-zinc-500">C6 GROUP • V8 FINAL</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[12px] font-medium tracking-wide text-zinc-400">
            <a href="#trust" className="hover:text-white transition">TRUST</a>
            <a href="#flow" className="hover:text-white transition">FLOW</a>
            <a href="#dashboards" className="hover:text-white transition">DASHBOARDS</a>
            <a href="#pricing" className="hover:text-white transition">PRICING</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex text-[10px] text-zinc-500 mr-3 text-right leading-tight">
              dieselconnect.c6group.co.za<br/><span className="text-zinc-300">PWA • No Download</span>
            </div>
            <button onClick={handleLogin} className="rounded-full bg-zinc-900 px-4 py-2 text-[12px] font-semibold text-zinc-200 border border-zinc-800 hover:bg-zinc-800 transition">Login</button>
            <button onClick={handleQuote} className="rounded-full bg-amber-400 px-5 py-2 text-[12px] font-bold text-black hover:bg-amber-300 transition">Get Quote</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-8 py-10 md:py-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start w-full overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            VERIFIED BUYER + VERIFIED SUPPLIER + ESCROW • NO BROKERS
          </div>
          <h1 className="mt-6 text-[42px] md:text-[64px] font-[800] leading-[0.9] tracking-[-0.04em]">
            Bulk diesel<br/>
            <span className="text-zinc-500">without the</span><br/>
            <span className="text-amber-400">middleman tax.</span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[15px] leading-[1.6] text-zinc-400">
            DieselConnect is a platform, not a directory. Verified buyers get a dashboard. Verified suppliers get leads. Funds sit in Standard Bank escrow until POD + SANS COA. Dual invoices, meter photos, no stories.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-[520px]">
            {[
              { k: 'Avg Saving', v: 'R0.62 / L' },
              { k: 'Escrow', v: 'Standard Bank' },
              { k: 'Compliance', v: 'DMRE • SANS 342' },
            ].map(i => (
              <div key={i.k} className="rounded-2xl border border-zinc-900 bg-zinc-900/50 p-3">
                <div className="text-[10px] tracking-widest text-zinc-500">{i.k.toUpperCase()}</div>
                <div className="mt-1 text-[13px] font-semibold">{i.v}</div>
              </div>
            ))}
          </div>

          <div id="trust" className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-[640px]">
            {[
              { title: 'DMRE Licensed', desc: 'Wholesale verification, not retail reseller', icon: '⛽' },
              { title: 'Std Bank Escrow', desc: 'Funds held, not touched by us', icon: '🏦' },
              { title: 'SANS 342 Tested', desc: 'Lab COA per load, sample QR', icon: '🧪' },
              { title: 'Transit Insured', desc: 'R5M cover per load, SASRIA incl', icon: '🛡️' },
            ].map(card => (
              <div key={card.title} className="rounded-[16px] border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="text-[18px]">{card.icon}</div>
                <div className="mt-2 text-[12px] font-bold leading-tight">{card.title}</div>
                <div className="mt-1 text-[11px] leading-[1.4] text-zinc-500">{card.desc}</div>
                <div className="mt-3 h-[2px] w-full bg-zinc-800"><div className="h-full w-[70%] bg-amber-400"></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* CALCULATOR */}
        <div className="lg:sticky lg:top-[116px]">
          <div className="rounded-[24px] border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-bold tracking-widest text-zinc-400">CALCULATOR</div>
              <div className="text-[10px] rounded-full bg-zinc-800 px-2 py-1 text-zinc-400">LIVE DMRE SYNC</div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-[11px] tracking-widest text-zinc-500">MONTHLY LITERS</label>
                <div className="mt-2 flex items-center gap-3">
                  <input type="range" min={2000} max={100000} step={500} value={liters} onChange={e=>setLiters(Number(e.target.value))} className="w-full accent-amber-400" />
                  <div className="shrink-0 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 text-[13px] font-semibold min-w-[110px] text-right">{liters.toLocaleString()} L</div>
                </div>
                <div className="mt-2 flex gap-2">
                  {[5000,20000,50000].map(v=>(
                    <button key={v} onClick={()=>setLiters(v)} className={`rounded-full px-3 py-1 text-[11px] border ${liters===v?'bg-amber-400 text-black border-amber-400':'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>{v/1000}k L</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] tracking-widest text-zinc-500">YOUR PRICE / L</label>
                  <div className="mt-2 flex items-center rounded-xl border border-zinc-800 bg-zinc-950 px-3">
                    <span className="text-[12px] text-zinc-500">R</span>
                    <input type="number" step="0.01" value={marketPrice} onChange={e=>setMarketPrice(Number(e.target.value))} className="w-full bg-transparent px-2 py-3 text-[14px] font-semibold outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] tracking-widest text-zinc-500">DIESELCONNECT / L</label>
                  <div className="mt-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-3 text-[14px] font-bold text-amber-300">R {dcPrice.toFixed(2)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
                  <div className="text-zinc-500 text-[10px] tracking-widest">MARKET TOTAL</div>
                  <div className="mt-1 font-semibold">R {marketTotal.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
                </div>
                <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
                  <div className="text-zinc-500 text-[10px] tracking-widest">DC TOTAL</div>
                  <div className="mt-1 font-semibold">R {dcTotal.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
                </div>
              </div>

              <div className="rounded-[16px] bg-emerald-500 p-4 text-black">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest opacity-70">YOU SAVE THIS LOAD</div>
                    <div className="mt-1 text-[28px] font-[800] leading-none tracking-tighter">R {saving.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
                    <div className="mt-1 text-[11px] font-medium opacity-80">R {dcDiscount.toFixed(2)} / L • {Math.round(saving / marketTotal * 100)}% cheaper • Net after escrow fee</div>
                  </div>
                  <div className="rounded-full bg-black text-emerald-400 px-3 py-1 text-[10px] font-bold">VERIFIED</div>
                </div>
                <button className="mt-4 w-full rounded-full bg-black py-3 text-[12px] font-bold text-white tracking-wide hover:bg-zinc-900 transition">GET VERIFIED QUOTE →</button>
                <div className="mt-2 text-center text-[10px] opacity-70">Takes 15min • CIPC + VAT + Address • OTP login</div>
              </div>

              <div className="text-[10px] leading-[1.5] text-zinc-500">
                Fees included in quote: Standard Bank escrow 0.8%, Ozow EFT verification, SANS lab, meter calibration audit. No hidden markups. DMRE wholesale reference only.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW MONEY MOVES */}
      <section id="flow" className="border-y border-zinc-900 bg-zinc-900/30">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[22px] md:text-[28px] font-bold tracking-tight">How money moves — dual invoice, no touch.</h2>
            <div className="text-[11px] tracking-widest text-zinc-500">FUNDS NEVER TOUCH C6 • STANDARD BANK ESCROW ONLY</div>
          </div>

          <div className="mt-8 grid md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Quote Locked', desc: 'Buyer gets DMRE-linked quote. Price valid 2hrs. Includes escrow + testing.', color: 'border-zinc-800' },
              { step: '02', title: 'Escrow Secured', desc: 'Buyer EFTs to Standard Bank escrow via Ozow. Supplier sees Funds Verified, not buyer bank details.', color: 'border-blue-600/50 bg-blue-600/10' },
              { step: '03', title: 'Dispatch + GPS', desc: 'Driver app starts. Geofence, meter START photo, dip before. Live link shared.', color: 'border-amber-400/30 bg-amber-400/10' },
              { step: '04', title: 'POD + Dual Invoice Release', desc: 'Meter END, dip after, sample QR, signature. Buyer clicks Release. Escrow releases to supplier. Both invoices auto-generated.', color: 'border-emerald-500/30 bg-emerald-500/10' },
            ].map(c => (
              <div key={c.step} className={`rounded-[20px] border ${c.color} p-5`}>
                <div className="text-[11px] font-bold tracking-widest text-zinc-500">{c.step}</div>
                <div className="mt-2 text-[14px] font-bold">{c.title}</div>
                <div className="mt-2 text-[12px] leading-[1.5] text-zinc-400">{c.desc}</div>
                {c.step==='04' && <div className="mt-4 flex gap-2 text-[10px]"><span className="rounded-full bg-zinc-800 px-2 py-1">INV-001 Buyer</span><span className="rounded-full bg-zinc-800 px-2 py-1">INV-002 Supplier</span></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPLIER NETWORK */}
      <section className="mx-auto max-w-[1280px] px-6 md:px-8 py-14">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold tracking-tight">Supplier network — 3 hubs, no retail markup</h2>
          <div className="text-[10px] text-zinc-500 tracking-widest">DMRE LICENSE CHECKED DAILY • NO BROKERS</div>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { hub: 'ALRODE • GAUTENG', loads: '47 loads', rating: '4.9', cap: '120k L / day', next: 'Next slot: Today 14:00', color: 'bg-zinc-900' },
            { hub: 'WITBANK • MPUMALANGA', loads: '31 loads', rating: '4.8', cap: '80k L / day', next: 'Mines + agriculture priority', color: 'bg-zinc-900' },
            { hub: 'DURBAN • COAST', loads: '52 loads', rating: '5.0', cap: '200k L / day', next: 'Port linked, SANS 342 onsite', color: 'bg-zinc-900' },
          ].map(s=>(
            <div key={s.hub} className={`rounded-[20px] border border-zinc-800 ${s.color} p-5 flex flex-col`}>
              <div className="flex items-center justify-between">
                <div className="text-[12px] font-bold tracking-wide">{s.hub}</div>
                <div className="text-[10px] rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-1 font-bold">VERIFIED</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                <div><div className="text-zinc-500">LOADS</div><div className="font-semibold mt-1">{s.loads}</div></div>
                <div><div className="text-zinc-500">RATING</div><div className="font-semibold mt-1">{s.rating} ★</div></div>
                <div><div className="text-zinc-500">CAPACITY</div><div className="font-semibold mt-1">{s.cap}</div></div>
              </div>
              <div className="mt-4 rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-[11px] text-zinc-400">{s.next}</div>
              <div className="mt-4 h-[4px] w-full rounded-full bg-zinc-800 overflow-hidden"><div className="h-full bg-amber-400 w-[82%]"></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* PROOF */}
      <section className="border-y border-zinc-900 bg-[#0f0f10]">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="text-[11px] tracking-widest text-zinc-500">PROOF • NOT PROMISES</div>
            <div className="mt-3 text-[22px] font-bold leading-tight">R41.2M escrowed. Zero disputes on POD.</div>
            <div className="mt-3 text-[12px] leading-[1.6] text-zinc-400">We don't sell fuel. We sell a paper trail. Every load has meter photos, dip, SANS COA, sample QR, signature. That's why Standard Bank trusts us.</div>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { v: 'R41.2M', l: 'Escrow processed' },
              { v: '130', l: 'Verified loads' },
              { v: '0', l: 'POD disputes' },
              { v: '4.9/5', l: 'Supplier rating avg' },
            ].map(p=>(
              <div key={p.l} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="text-[24px] font-[800] tracking-tighter">{p.v}</div>
                <div className="mt-1 text-[11px] text-zinc-500 tracking-wide">{p.l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARDS — NEW CRITICAL SECTION */}
      <section id="dashboards" className="mx-auto max-w-[1280px] px-6 md:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-600/30 bg-blue-600/10 px-3 py-1 text-[11px] font-bold tracking-widest text-blue-400">
              PLATFORM • NOT BROCHURE
            </div>
            <h2 className="mt-4 text-[28px] md:text-[40px] font-[800] tracking-[-0.03em] leading-[0.95]">After you click Quote —<br/>your Dashboard.</h2>
            <p className="mt-3 max-w-[560px] text-[13px] leading-[1.6] text-zinc-400">This is what changes. Buyer applies → gets verified → sees escrow, GPS, docs. Supplier applies → gets leads. Driver gets a PWA that works offline. No app store.</p>
          </div>
          <div className="text-[11px] leading-[1.6] text-zinc-500 max-w-[300px]">
            All dashboards are PWA at <span className="text-zinc-200">dieselconnect.c6group.co.za/app</span> — no download needed, login via OTP. Works on R1,500 Android.
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'buyer', label: 'Verified Buyer Dashboard', sub: 'After 15min KYC' },
            { id: 'supplier', label: 'Verified Supplier Dashboard', sub: 'WSL + Insurance' },
            { id: 'driver', label: 'Driver App', sub: 'dieselconnect.c6group.co.za/driver' },
          ].map(t=>(
            <button
              key={t.id}
              onClick={()=>setActiveTab(t.id as any)}
              className={`shrink-0 text-left rounded-[16px] border px-5 py-3 transition ${activeTab===t.id?'bg-white text-black border-white':'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'}`}
            >
              <div className="text-[12px] font-bold tracking-wide">{t.label}</div>
              <div className={`text-[10px] mt-0.5 ${activeTab===t.id?'text-zinc-600':'text-zinc-500'}`}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 rounded-[24px] border border-zinc-800 bg-zinc-900/60 overflow-hidden">
          {activeTab==='buyer' && (
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
              {/* Left Mock UI */}
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-[#0d0d0e]">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] tracking-widest text-zinc-500 font-bold">DASHBOARD • BUYER • VERIFIED • CIPC ✓ VAT ✓ ADDRESS ✓</div>
                  <div className="text-[10px] rounded-full bg-zinc-800 px-2 py-1">Live</div>
                </div>

                <div className="mt-6 rounded-[16px] border border-zinc-800 bg-zinc-900 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
                    <div className="text-[12px] font-semibold">Order #DC-2026-0847</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] rounded-full bg-blue-600/20 text-blue-300 px-2 py-1 border border-blue-600/30 font-bold">FUNDS IN ESCROW</span>
                      <span className="text-[10px] text-zinc-500">Escrow ref: SB-99821</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-4 text-[11px]">
                    <div><div className="text-zinc-500">VOLUME</div><div className="mt-1 font-semibold">20,000L 50ppm</div></div>
                    <div><div className="text-zinc-500">ROUTE</div><div className="mt-1 font-semibold">Alrode → Randburg</div></div>
                    <div><div className="text-zinc-500">SAVING</div><div className="mt-1 font-semibold text-emerald-400">R12,400</div></div>
                  </div>
                  <div className="px-4 pb-4 flex gap-2">
                    <button className="rounded-full bg-white text-black px-3 py-1.5 text-[11px] font-bold">View POD</button>
                    <button className="rounded-full bg-zinc-800 px-3 py-1.5 text-[11px]">GPS Live →</button>
                    <button className="rounded-full bg-zinc-800 px-3 py-1.5 text-[11px]">Standard Bank receipt</button>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-[11px] font-bold tracking-widest text-zinc-500">TIMELINE</div>
                  <div className="mt-3 relative pl-6 space-y-4 border-l border-zinc-800 ml-2">
                    {[
                      { t: 'Quote', d: 'R21.23/L locked • 2hr validity', done: true },
                      { t: 'Escrow Secured', d: 'R424,600 held at Standard Bank • Ozow verified', done: true, highlight: true },
                      { t: 'Dispatched', d: 'Driver: J. Nkosi • Vehicle: CA 123-456 • GPS link active', done: true, link: true },
                      { t: 'Delivered', d: 'Meter END + dip + sample QR pending your release', done: false },
                      { t: 'Released', d: 'Funds released to supplier • Dual invoices generated', done: false },
                    ].map(item=>(
                      <div key={item.t} className="relative">
                        <div className={`absolute -left-[29px] top-0 h-3 w-3 rounded-full border ${item.done?'bg-emerald-500 border-emerald-500':'bg-zinc-800 border-zinc-700'}`}></div>
                        <div className={`text-[12px] font-semibold ${item.highlight?'text-emerald-400':''}`}>{item.t} {item.done && <span className="text-emerald-500">✓</span>}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{item.d} {item.link && <span className="text-blue-400 underline">Open GPS</span>}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                    <div className="text-[10px] tracking-widest text-zinc-500">DOCUMENTS</div>
                    <div className="mt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between"><span>Dual invoices</span><span className="text-amber-400">Download</span></div>
                      <div className="flex justify-between"><span>SANS COA 342</span><span className="text-amber-400">View</span></div>
                      <div className="flex justify-between"><span>POD photo + signature</span><span className="text-zinc-500">Pending</span></div>
                      <div className="flex justify-between"><span>Meter START/END</span><span className="text-amber-400">2 photos</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                    <div className="text-[10px] tracking-widest text-zinc-500">TRUST</div>
                    <div className="mt-2 text-[11px] leading-[1.5] text-zinc-400">
                      Standard Bank escrow receipt SB-99821 verified.<br/>Buyer funds protected until you click Release.<br/><span className="text-zinc-200">No release = no payout to supplier.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Explain */}
              <div className="p-6 md:p-8 bg-zinc-900">
                <div className="text-[11px] font-bold tracking-widest text-amber-400">FOR BUYERS</div>
                <h3 className="mt-3 text-[20px] font-bold leading-tight">You apply once. You get a real dashboard.</h3>
                <p className="mt-3 text-[12px] leading-[1.6] text-zinc-400">
                  Business verification: CIPC registration, VAT number, physical address (no PO Box), contact person. Takes 15 minutes. We check, not an intern — RemotePay risk team.
                </p>
                <div className="mt-5 space-y-3 text-[11px]">
                  {[
                    'Escrow balance + ref numbers live',
                    'GPS link per delivery (not driver phone number)',
                    'Download dual invoices (buyer + supplier copy)',
                    'SANS lab COA per load, sample bottle QR',
                    'Meter photos + dip photos time-stamped',
                    'Release button — you control payout',
                  ].map(b=>(
                    <div key={b} className="flex gap-2"><span className="text-emerald-400">✓</span><span className="text-zinc-300">{b}</span></div>
                  ))}
                </div>
                <button className="mt-8 w-full rounded-full bg-amber-400 py-3 text-[12px] font-bold text-black hover:bg-amber-300 transition">Apply as Verified Buyer - 15min KYC →</button>
                <div className="mt-3 text-[10px] text-center text-zinc-500">PWA at /app • OTP login • No credit check, only business existence</div>
              </div>
            </div>
          )}

          {activeTab==='supplier' && (
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
              <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-[#0d0d0e]">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] tracking-widest text-zinc-500 font-bold">DASHBOARD • SUPPLIER • VERIFIED • DMRE ✓ SANS ✓ METER ✓</div>
                  <div className="flex gap-2">
                    <div className="text-[10px] rounded-full bg-zinc-800 px-2 py-1">Escrow pending R1.2M</div>
                    <div className="text-[10px] rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-1">Rating 4.9 ★</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { k: 'Incoming leads', v: '6 new' },
                    { k: 'Active loads', v: '3' },
                    { k: 'Completed', v: '47 loads' },
                  ].map(m=>(
                    <div key={m.k} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                      <div className="text-[10px] text-zinc-500 tracking-widest">{m.k.toUpperCase()}</div>
                      <div className="mt-1 text-[16px] font-bold">{m.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[16px] border border-amber-400/20 bg-zinc-900 overflow-hidden">
                  <div className="px-4 py-3 bg-amber-400/10 border-b border-amber-400/20 flex items-center justify-between">
                    <div className="text-[12px] font-bold">New RFQ • 15,000L • Pretoria East</div>
                    <div className="flex gap-2">
                      <span className="text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-1 font-bold">BUYER VERIFIED</span>
                      <span className="text-[10px] rounded-full bg-blue-600/20 text-blue-300 px-2 py-1">Funds verified via Ozow</span>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4 text-[11px]">
                    <div><div className="text-zinc-500">BUYER</div><div className="mt-1 font-semibold">Logistics Co • VAT 4890 • 4 prior loads</div></div>
                    <div><div className="text-zinc-500">DELIVERY</div><div className="mt-1 font-semibold">Tomorrow 08:00 • 20km radius</div></div>
                    <div><div className="text-zinc-500">MARGIN</div><div className="mt-1 font-semibold text-emerald-400">R0.41/L net after escrow fee</div></div>
                    <div><div className="text-zinc-500">DOCS REQUIRED</div><div className="mt-1">SANS COA + meter cert</div></div>
                  </div>
                  <div className="px-4 pb-4 flex gap-2">
                    <button className="rounded-full bg-white text-black px-4 py-1.5 text-[11px] font-bold">Accept Lead</button>
                    <button className="rounded-full bg-zinc-800 px-4 py-1.5 text-[11px]">Decline</button>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <div className="text-[10px] tracking-widest text-zinc-500">COMPLIANCE • AUTO-CHECKED</div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-[11px]">
                    <div><div className="text-zinc-500">DMRE WSL</div><div className="mt-1 font-semibold">Exp 2026-08-12 ✓</div><div className="mt-1 h-1 bg-zinc-800 rounded-full"><div className="h-full w-[80%] bg-emerald-500"></div></div></div>
                    <div><div className="text-zinc-500">SANS 342 last test</div><div className="mt-1 font-semibold">2026-01-20 ✓</div><div className="mt-1 h-1 bg-zinc-800 rounded-full"><div className="h-full w-[60%] bg-amber-400"></div></div></div>
                    <div><div className="text-zinc-500">Meter calibration</div><div className="mt-1 font-semibold">Valid till 2026-04-15</div><div className="mt-1 h-1 bg-zinc-800 rounded-full"><div className="h-full w-[90%] bg-emerald-500"></div></div></div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-zinc-900">
                <div className="text-[11px] font-bold tracking-widest text-amber-400">FOR SUPPLIERS</div>
                <h3 className="mt-3 text-[20px] font-bold leading-tight">Stop chasing debtors. Get prepaid loads.</h3>
                <p className="mt-3 text-[12px] leading-[1.6] text-zinc-400">Upload WSL, insurance, SANS history, meter calibration. We verify. You get leads where buyer funds already in escrow. No more 30-day terms.</p>
                <div className="mt-5 space-y-3 text-[11px]">
                  {[
                    'Leads only from verified buyers (funds checked)',
                    'Escrow pending dashboard R1.2M example',
                    'Accept/Decline in one tap',
                    'Auto-compliance expiry alerts',
                    'Rating system — good POD = more leads',
                    'Payout after buyer Release, T+0 via Standard Bank',
                  ].map(b=>(
                    <div key={b} className="flex gap-2"><span className="text-emerald-400">✓</span><span className="text-zinc-300">{b}</span></div>
                  ))}
                </div>
                <button className="mt-8 w-full rounded-full bg-white py-3 text-[12px] font-bold text-black hover:bg-zinc-200 transition">Apply as Verified Supplier - Upload WSL + Insurance →</button>
                <div className="mt-3 text-[10px] text-center text-zinc-500">We never publish WSL numbers • Compliance checked daily</div>
              </div>
            </div>
          )}

          {activeTab==='driver' && (
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-0">
              {/* Phone Mock */}
              <div className="p-8 bg-[#0d0d0e] border-b lg:border-b-0 lg:border-r border-zinc-800 flex justify-center">
                <div className="relative w-[280px] rounded-[36px] border-[8px] border-zinc-800 bg-black shadow-2xl overflow-hidden">
                  <div className="h-6 bg-zinc-900 flex items-center justify-center"><div className="h-1.5 w-20 rounded-full bg-zinc-700"></div></div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold tracking-widest">DRIVER APP • DC-2026-0847</div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>

                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                      <div className="text-[11px] font-bold">Start Delivery</div>
                      <div className="text-[10px] text-zinc-500 mt-1">GPS auto • Offline capable</div>
                      <button className="mt-2 w-full rounded-full bg-amber-400 py-2 text-[11px] font-bold text-black">Start (GPS)</button>
                    </div>

                    {[
                      { s: 'Arrive', d: 'Geofence hit • 12m from tank' },
                      { s: 'Meter START', d: 'Photo: Bowser meter START • 1,240.5 L' },
                      { s: 'Tank dip before', d: 'Photo: Dip stick • 12cm' },
                      { s: 'Pump 20,000L', d: 'Pumping... 45min est' },
                      { s: 'Meter END', d: 'Photo: Meter END • 21,240.5 L' },
                      { s: 'Dip after + Sample QR', d: 'Photo + QR on bottle' },
                      { s: 'Signature', d: 'Customer signs on phone' },
                    ].map(step=>(
                      <div key={step.s} className="rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-2.5 flex gap-2.5">
                        <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">📸</div>
                        <div><div className="text-[11px] font-semibold leading-tight">{step.s}</div><div className="text-[10px] text-zinc-500">{step.d}</div></div>
                      </div>
                    ))}

                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5">
                      <div className="text-[10px] font-bold text-emerald-400">OFFLINE SYNC</div>
                      <div className="text-[10px] text-zinc-400 mt-1">No signal? Saves locally. Syncs when back. Works on R1,500 Android, PWA.</div>
                    </div>

                    <div className="text-center text-[9px] text-zinc-600 pt-2">dieselconnect.c6group.co.za/driver</div>
                  </div>
                </div>
              </div>

              {/* Explain */}
              <div className="p-6 md:p-8 bg-zinc-900">
                <div className="text-[11px] font-bold tracking-widest text-blue-400">DRIVER PWA • NO PLAY STORE</div>
                <h3 className="mt-3 text-[20px] font-bold leading-tight">Your driver doesn't need an iPhone. R1,500 Android is fine.</h3>
                <p className="mt-3 text-[12px] leading-[1.6] text-zinc-400">
                  Driver app is a PWA at dieselconnect.c6group.co.za/driver. Add to home screen. Works offline. We built it for real delivery — dust, no signal, glove hands.
                </p>

                <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="text-[11px] font-bold tracking-widest text-zinc-500">DELIVERY FLOW — WHAT DRIVER DOES</div>
                  <div className="mt-3 space-y-2.5">
                    {[
                      'Start Delivery (GPS auto, no typing)',
                      'Arrive — geofence confirms location',
                      'Photo: Bowser meter START (time-stamped)',
                      'Photo: Tank dip BEFORE',
                      'Pump — app keeps screen on',
                      'Photo: Meter END',
                      'Photo: Tank dip AFTER + Sample bottle QR',
                      'Signature capture + customer name',
                      'Offline? Saved locally → syncs when signal returns',
                    ].map((s,i)=>(
                      <div key={s} className="flex gap-3 text-[11px]">
                        <div className="h-5 w-5 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                        <div className="text-zinc-300">{s}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
                  <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3"><div className="text-zinc-500">WORKS ON</div><div className="mt-1 font-semibold">R1,500 Android, Chrome</div></div>
                  <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3"><div className="text-zinc-500">NO</div><div className="mt-1 font-semibold">No App Store, No Update</div></div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button className="flex-1 rounded-full bg-white py-3 text-[12px] font-bold text-black">Open Driver Demo →</button>
                  <button className="rounded-full border border-zinc-700 px-5 py-3 text-[12px] text-zinc-400">How offline works</button>
                </div>
                <div className="mt-3 text-[10px] text-center text-zinc-500">PWA • Add to Home Screen • Camera + GPS permission only</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-[10px] text-zinc-500">
          <span className="rounded-full border border-zinc-800 px-3 py-1">PWA at /app • No download • OTP login</span>
          <span className="rounded-full border border-zinc-800 px-3 py-1">Buyer: CIPC + VAT + Address verification</span>
          <span className="rounded-full border border-zinc-800 px-3 py-1">Supplier: WSL + Insurance + SANS + Meter</span>
          <span className="rounded-full border border-zinc-800 px-3 py-1">Driver: Offline-first, syncs later</span>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-t border-zinc-900 bg-[#0f0f10]">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-[24px] md:text-[32px] font-bold tracking-tight">Pricing — fees included, no stories.</h2>
            <div className="text-[11px] text-zinc-500 max-w-[380px] leading-[1.6]">All quotes include: Standard Bank escrow 0.8%, Ozow verification, SANS lab spot check, meter audit. No markup on fuel. We earn on service fee only.</div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4 items-stretch">
            {[
              {
                name: 'Pay As You Go',
                price: '3.5%',
                sub: 'per load',
                feat: ['One-off loads', 'Escrow included', 'SANS COA included', 'GPS + POD photos', 'Dual invoices'],
                cta: 'Get Quote',
                dark: false,
              },
              {
                name: 'Fleet',
                price: '2.5% + R2,999/mo',
                sub: 'most popular',
                feat: ['20k+ L / month', 'Priority dispatch slots', 'Dedicated supplier', 'Monthly SANS bundle', 'Account manager + API'],
                cta: 'Apply as Fleet',
                dark: true,
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                sub: 'mines + logistics',
                feat: ['100k+ L / month', 'Multi-site GPS dashboard', 'SLA + insurance uplift to R10M', 'ERP integration', 'Custom escrow flow'],
                cta: 'Talk to C6',
                dark: false,
              },
            ].map(plan=>(
              <div key={plan.name} className={`rounded-[24px] border p-6 flex flex-col justify-between ${plan.highlight?'bg-amber-400 text-black border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.2)]':'bg-zinc-900 border-zinc-800 text-zinc-100'}`}>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-bold tracking-widest opacity-70">{plan.name.toUpperCase()}</div>
                    {plan.highlight && <div className="text-[10px] font-bold rounded-full bg-black text-amber-400 px-2 py-1">POPULAR</div>}
                  </div>
                  <div className="mt-4 text-[28px] font-[800] tracking-tighter">{plan.price}</div>
                  <div className={`text-[11px] mt-1 ${plan.highlight?'opacity-70':'text-zinc-500'}`}>{plan.sub}</div>

                  <div className="mt-6 space-y-2.5">
                    {plan.feat.map(f=>(
                      <div key={f} className="flex gap-2 text-[12px]"><span className={plan.highlight?'text-black':'text-emerald-400'}>✓</span><span className={plan.highlight?'text-black/80':'text-zinc-300'}>{f}</span></div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <button className={`w-full rounded-full py-3 text-[12px] font-bold tracking-wide transition ${plan.highlight?'bg-black text-white hover:bg-zinc-900':'bg-white text-black hover:bg-zinc-200'}`}>
                    {plan.cta} →
                  </button>
                  <div className={`mt-3 text-[10px] text-center ${plan.highlight?'text-black/60':'text-zinc-500'}`}>Fees included • No hidden markup</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-[11px] leading-[1.6] text-zinc-400 text-center">
            <span className="text-zinc-200 font-semibold">Fees included note:</span> Standard Bank escrow 0.8% (min R250), Ozow EFT verification R15, SANS lab spot check pooled, meter calibration audit, SASRIA + transit insurance. Fuel at DMRE wholesale + BFP reference. We do not mark up diesel.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-[#09090b]">
        <div className="mx-auto max-w-[1280px] px-6 md:px-8 py-10">
          <div className="grid md:grid-cols-4 gap-8 text-[11px]">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-[8px] bg-amber-400 flex items-center justify-center font-black text-black">D</div>
                <div className="font-bold tracking-tight">DIESELCONNECT</div>
              </div>
              <div className="mt-3 leading-[1.6] text-zinc-500">Product of RemotePay Fintech Services (Pty) Ltd<br/>Reg 2026/012562/07<br/>dieselconnect.c6group.co.za<br/>PWA: /app • /driver</div>
            </div>
            <div>
              <div className="font-bold tracking-widest text-zinc-400">PLATFORM</div>
              <div className="mt-3 space-y-1.5 text-zinc-500">
                <div>Buyer Dashboard: /app</div>
                <div>Supplier Dashboard: /app</div>
                <div>Driver App: /driver</div>
                <div>Escrow: Standard Bank</div>
              </div>
            </div>
            <div>
              <div className="font-bold tracking-widest text-zinc-400">TRUST</div>
              <div className="mt-3 space-y-1.5 text-zinc-500">
                <div>DMRE wholesale verified</div>
                <div>SANS 342 lab tested</div>
                <div>Meter photos + dip + QR</div>
                <div>R5M transit insured</div>
              </div>
            </div>
            <div>
              <div className="font-bold tracking-widest text-zinc-400">POPIA • LEGAL</div>
              <div className="mt-3 leading-[1.6] text-zinc-500">
                We process CIPC, VAT, address for verification only. No ID copies stored. OTP login. Data hosted in SA (AWS Cape Town). Request deletion: privacy@c6group.co.za<br/><br/>© 2026 RemotePay Fintech Services. DieselConnect is a trade name. Not a fuel wholesaler — platform facilitating verified transactions.
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-zinc-900 pt-6 text-[10px] tracking-widest text-zinc-600">
            <div>REMOTE PAY FINTECH SERVICES • 2026/012562/07 • V8 FINAL PLATFORM • BUILT IN ZA</div>
            <div className="flex gap-3">
              <span className="rounded-full border border-zinc-800 px-3 py-1">POPIA COMPLIANT</span>
              <span className="rounded-full border border-zinc-800 px-3 py-1">STD BANK ESCROW</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
      `}</style>
    </div>
  );
};

export default App;
