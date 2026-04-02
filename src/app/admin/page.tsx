"use client";

import { useState } from "react";
import { 
  Calendar, Clock, Euro, Users, LogOut, Check, X, 
  TrendingUp, MessageSquare, CalendarDays, Box, PieChart, Info,
  AlertTriangle, Calculator, ShoppingCart, CreditCard, Banknote
} from "lucide-react";
import Image from "next/image";

// ==========================================
// MOCK DATA LOCALE POUR LA DEMO ULTIME
// ==========================================
const MOCK_APPOINTMENTS = [
  { id: "1", client_name: "João Silva", service: "Coupe Executive", price: 35, barber: "Tiago Silva", time: "10:00", status: "confirmed" },
  { id: "2", client_name: "Pedro Santos", service: "Rasage Serviette Chaude", price: 30, barber: "João Santos", time: "11:30", status: "confirmed" },
  { id: "3", client_name: "Carlos Gomes", service: "Sculpture de Barbe", price: 25, barber: "Tiago Silva", time: "14:00", status: "confirmed" },
  { id: "4", client_name: "Miguel Costa", service: "L'Expérience Lisboeta", price: 60, barber: "João Santos", time: "16:00", status: "cancelled" },
];

const INITIAL_SERVICES = [
  { id: "1", name: "Coupe Executive", price: "35", duration: "30 min" },
  { id: "2", name: "Rasage Serviette Chaude", price: "30", duration: "30 min" },
  { id: "3", name: "Sculpture de Barbe", price: "25", duration: "20 min" },
  { id: "4", name: "L'Expérience Lisboeta", price: "60", duration: "60 min" },
];

const MOCK_CLIENTS = [
  { id: "1", full_name: "João Silva", phone: "+351 912 345 611", total_visits: 12, total_spent: 480, last_visit: "Il y a 3 jours", status: "Loyal" },
  { id: "2", full_name: "Pedro Santos", phone: "+351 912 345 622", total_visits: 3, total_spent: 105, last_visit: "Il y a 2 semaines", status: "Régulier" },
  { id: "3", full_name: "Carlos Gomes", phone: "+351 912 345 633", total_visits: 1, total_spent: 60, last_visit: "Il y a 6 semaines", status: "À relancer" },
  { id: "4", full_name: "Bruno Sousa", phone: "+351 912 345 644", total_visits: 25, total_spent: 950, last_visit: "Hier", status: "VIP" },
];

const MOCK_MARKETING = [
  { id: 1, name: "Rappel de Rendez-vous (24h avant)", type: "SMS", active: true, description: "Réduit les absences de 80%. Intégré avec le logiciel téléphonique." },
  { id: 2, name: "Relance Inactivité (6 semaines)", type: "SMS & Email", active: false, description: "Recible les clients inactifs pour augmenter la rétention." },
  { id: 3, name: "Joyeux Anniversaire", type: "Email", active: true, description: "Automatisé le jour J pour vos clients fidèles avec une promo." },
];

const MOCK_TEAM = [
  { id: 1, name: "Tiago Silva", role: "Master Barber", status: "working", hours: "10:00 - 18:00", image: "https://i.pravatar.cc/150?u=tiago", expertise: "Coupe & Visagisme" },
  { id: 2, name: "João Santos", role: "Senior Barber", status: "off", hours: "Repos", image: "https://i.pravatar.cc/150?u=joao", expertise: "Barbe Traditionnelle" },
  { id: 3, name: "Lucas Mendes", role: "Apprenti Barber", status: "working", hours: "13:00 - 20:00", image: "https://i.pravatar.cc/150?u=lucas", expertise: "Fades & Dégradés" },
];

const MOCK_INVENTORY = [
  { id: 1, name: "Cire Matifiante Reuzel", category: "Coiffure", stock: 24, price: 18.00, alert: false },
  { id: 2, name: "Huile à Barbe Proraso Wood", category: "Soin Barbe", stock: 3, price: 14.50, alert: true },
  { id: 3, name: "Shampoing Rafraîchissant", category: "Lavage", stock: 15, price: 22.00, alert: false },
  { id: 4, name: "Lames Derby Extra (Boite)", category: "Rasage", stock: 1, price: 9.90, alert: true },
];

const MOCK_FINANCE = [
  { id: "Tiago Silva", barber: "Tiago Silva", sales_services: 4200, sales_products: 350, comm_rate: 0.60, payout: 2730 },
  { id: "João Santos", barber: "João Santos", sales_services: 3100, sales_products: 120, comm_rate: 0.50, payout: 1610 },
  { id: "Lucas Mendes", barber: "Lucas Mendes", sales_services: 1150, sales_products: 50, comm_rate: 0.40, payout: 480 },
];

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>(MOCK_APPOINTMENTS);
  const [services, setServices] = useState<any[]>(INITIAL_SERVICES);
  const [marketing, setMarketing] = useState(MOCK_MARKETING);
  const [clients, setClients] = useState<any[]>(MOCK_CLIENTS);
  const [inventory, setInventory] = useState<any[]>(MOCK_INVENTORY);
  const [finances, setFinances] = useState<any[]>(MOCK_FINANCE);
  
  const [activeTab, setActiveTab] = useState("analytics");
  const [isLogged, setIsLogged] = useState(false);

  // CAISSE / POS STATE
  const [posCart, setPosCart] = useState<any[]>([]);
  const [posClientInfo, setPosClientInfo] = useState<any>(null); // l'appointment en cours

  const handleCancel = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
  };

  const updatePrice = (id: string, newPrice: string) => {
    setServices(services.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  const updateStock = (id: number, increment: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + increment);
        return { ...item, stock: newStock, alert: newStock <= 5 };
      }
      return item;
    }));
  };

  const toggleMarketing = (id: number) => {
    setMarketing(marketing.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  // --- LOGIQUE DE CAISSE (POS) ---
  const openPOS = (appointment: any) => {
    setPosClientInfo(appointment);
    setPosCart([{
      id: "srv_" + appointment.id,
      name: appointment.service,
      price: appointment.price,
      type: "service",
      quantity: 1
    }]);
    setActiveTab("pos");
  };

  const addToCartFromInventory = (product: any) => {
    const existing = posCart.find(i => i.id === product.id && i.type === "product");
    if (existing) {
      setPosCart(posCart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setPosCart([...posCart, { ...product, type: "product", quantity: 1 }]);
    }
  };

  const checkoutCart = () => {
    if (!posClientInfo) return;
    
    const cartTotal = posCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const productTotal = posCart.filter(i => i.type === "product").reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceTotal = posCart.filter(i => i.type === "service").reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 1. UPDATE APPOINTMENT TO COMPLETED
    setAppointments(appointments.map(a => a.id === posClientInfo.id ? { ...a, status: "completed" } : a));

    // 2. UPDATE CRM
    setClients(clients.map(c => {
      if (c.full_name === posClientInfo.client_name) {
        return { ...c, total_spent: c.total_spent + cartTotal, total_visits: c.total_visits + 1, last_visit: "Aujourd'hui" };
      }
      return c;
    }));

    // 3. DECREASE INVENTORY STOCK
    const newInventory = [...inventory];
    posCart.filter(i => i.type === "product").forEach(cartItem => {
      const idx = newInventory.findIndex(inv => inv.id === cartItem.id);
      if (idx !== -1) {
        newInventory[idx].stock = Math.max(0, newInventory[idx].stock - cartItem.quantity);
        newInventory[idx].alert = newInventory[idx].stock <= 5;
      }
    });
    setInventory(newInventory);

    // 4. UPDATE FINANCE
    setFinances(finances.map(f => {
      if (f.barber === posClientInfo.barber) {
        const newSalesServ = f.sales_services + serviceTotal;
        const newSalesProd = f.sales_products + productTotal;
        return {
          ...f,
          sales_services: newSalesServ,
          sales_products: newSalesProd,
          payout: (newSalesServ * f.comm_rate) + (newSalesProd * 0.10) // Hypothétique 10% com sur produits
        }
      }
      return f;
    }));

    setActiveTab("appointments");
    setPosCart([]);
    setPosClientInfo(null);
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#0f1012] flex items-center justify-center p-4">
        <div className="bg-[#18191c] border border-white/10 p-10 max-w-md w-full rounded-sm text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-transparent"></div>
          <h1 className="font-serif text-4xl mb-4 text-white">OS <span className="text-[#d4af37] italic">Cockpit</span></h1>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">Le système de gestion ERP ultime conçu spécifiquement pour l'industrie du Barbershop.</p>
          <div className="space-y-4">
            <input type="email" placeholder="Email Gérant" className="w-full bg-[#0f1012] border border-white/10 p-4 text-white focus:outline-none focus:border-[#d4af37] text-sm" defaultValue="admin@barbershop.com" />
            <input type="password" placeholder="Mot de passe" className="w-full bg-[#0f1012] border border-white/10 p-4 text-white focus:outline-none focus:border-[#d4af37] text-sm" defaultValue="password" />
            <button onClick={() => setIsLogged(true)} className="w-full bg-[#d4af37] text-black font-bold uppercase tracking-widest text-xs py-4 mt-4 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-[#f3d87b] transition-all">Accéder au contrôle</button>
          </div>
          <p className="mt-8 text-xs text-gray-500 uppercase tracking-widest">Mode Démonstration Actif</p>
        </div>
      </div>
    );
  }

  const activeTabClasses = "bg-[#d4af37]/10 text-[#d4af37] border-l-2 border-[#d4af37]";
  const inactiveTabClasses = "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent";

  const totalCartValue = posCart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <div className="min-h-screen bg-[#0f1012] flex flex-col md:flex-row font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#18191c] border-r border-white/5 flex flex-col shrink-0 h-screen sticky top-0 custom-scrollbar z-50">
        <div className="p-6 border-b border-white/5">
          <h1 className="font-serif text-2xl text-white">OS <span className="text-[#d4af37] italic">Cockpit</span></h1>
          <p className="text-xs tracking-widest uppercase text-emerald-400 font-semibold mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Système Online
          </p>
        </div>
        <nav className="flex flex-col flex-1 overflow-y-auto py-4">
          
          <div className="px-6 mb-2 mt-2">
            <p className="text-[10px] uppercase tracking-[3px] text-gray-500 font-bold">Pilotage</p>
          </div>
          <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-3 w-full text-left px-6 py-3 transition-colors text-sm ${activeTab === "analytics" ? activeTabClasses : inactiveTabClasses}`}>
            <TrendingUp className="w-4 h-4" /> Vue d'Ensemble
          </button>
          <button onClick={() => setActiveTab("finance")} className={`flex items-center gap-3 w-full text-left px-6 py-3 transition-colors text-sm ${activeTab === "finance" ? activeTabClasses : inactiveTabClasses}`}>
            <PieChart className="w-4 h-4" /> Compta & Paies
          </button>
          
          <div className="px-6 mb-2 mt-6">
            <p className="text-[10px] uppercase tracking-[3px] text-gray-500 font-bold">Quotidien</p>
          </div>
          {/* BOUTON CAISSE TOUJOURS ACCESSIBLE */}
          <button onClick={() => setActiveTab("pos")} className={`flex items-center gap-3 w-full text-left px-6 py-3 transition-colors text-sm font-bold bg-[#d4af37]/5 text-[#d4af37] mb-2 border-l-2 border-[#d4af37] ${activeTab === "pos" ? "bg-[#d4af37]/20 shadow-inner" : ""}`}>
            <Calculator className="w-4 h-4" /> Caisse (Encaisser)
          </button>

          <button onClick={() => setActiveTab("appointments")} className={`flex items-center gap-3 w-full text-left px-6 py-3 transition-colors text-sm ${activeTab === "appointments" ? activeTabClasses : inactiveTabClasses}`}>
            <Calendar className="w-4 h-4" /> Réservations <span className="ml-auto bg-[#d4af37] text-black text-[10px] px-2 py-0.5 rounded-full font-bold">{appointments.filter(a=>a.status==='confirmed').length}</span>
          </button>
          <button onClick={() => setActiveTab("team")} className={`flex items-center gap-3 w-full text-left px-6 py-3 transition-colors text-sm ${activeTab === "team" ? activeTabClasses : inactiveTabClasses}`}>
            <CalendarDays className="w-4 h-4" /> Planning Équipe
          </button>
          
          <div className="px-6 mb-2 mt-6">
            <p className="text-[10px] uppercase tracking-[3px] text-gray-500 font-bold">Clients</p>
          </div>
          <button onClick={() => setActiveTab("crm")} className={`flex items-center gap-3 w-full text-left px-6 py-3 transition-colors text-sm ${activeTab === "crm" ? activeTabClasses : inactiveTabClasses}`}>
            <Users className="w-4 h-4" /> Fichiers CRM
          </button>
          <button onClick={() => setActiveTab("marketing")} className={`flex items-center gap-3 w-full text-left px-6 py-3 transition-colors text-sm ${activeTab === "marketing" ? activeTabClasses : inactiveTabClasses}`}>
            <MessageSquare className="w-4 h-4" /> Moteur Automatisé
          </button>
          
          <div className="px-6 mb-2 mt-6">
            <p className="text-[10px] uppercase tracking-[3px] text-gray-500 font-bold">Boutique</p>
          </div>
          <button onClick={() => setActiveTab("services")} className={`flex items-center gap-3 w-full text-left px-6 py-3 transition-colors text-sm ${activeTab === "services" ? activeTabClasses : inactiveTabClasses}`}>
            <Euro className="w-4 h-4" /> Menu Prestations
          </button>
          <button onClick={() => setActiveTab("inventory")} className={`flex items-center gap-3 w-full text-left px-6 py-3 transition-colors text-sm ${activeTab === "inventory" ? activeTabClasses : inactiveTabClasses}`}>
            <Box className="w-4 h-4" /> Inventaire Stocks
            {inventory.some(i => i.alert) && <span className="ml-auto w-2 h-2 rounded-full bg-red-500"></span>}
          </button>

        </nav>
        <div className="p-4 border-t border-white/5">
           <button onClick={() => setIsLogged(false)} className="flex items-center justify-center gap-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 transition-colors w-full p-3 rounded text-sm uppercase tracking-widest font-semibold"><LogOut className="w-4 h-4"/> Quitter</button>
        </div>
      </aside>

      {/* MAIN CONTENT V2 */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        <div className="absolute inset-0 bg-[#0f1012]/95 z-0"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          
          {/* ====== POS / CAISSE TAB - NOUVEAUTÉ ====== */}
          {activeTab === "pos" && (
             <div className="animate-in fade-in zoom-in-95 duration-300">
               <header className="mb-8">
                 <h2 className="font-serif text-3xl text-white flex items-center gap-3"><Calculator className="w-8 h-8 text-[#d4af37]" /> Caisse Enregistreuse</h2>
                 <p className="text-gray-400 mt-2">Gérez les paiements, upsells et intégrez automatiquement toutes vos finances.</p>
               </header>
               
               {!posClientInfo ? (
                 <div className="bg-[#18191c] border border-white/5 rounded p-12 text-center shadow-xl">
                   <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-6 opacity-50" />
                   <h3 className="text-xl text-white font-serif mb-2">Aucun ticket en cours</h3>
                   <p className="text-gray-400 mb-8 max-w-md mx-auto">Ouvrez le Planning et cliquez sur "Encaisser" à coté d'une séance terminée pour démarrer l'encaissement et l'attribution des commissions.</p>
                   <button onClick={() => setActiveTab("appointments")} className="bg-[#d4af37] text-black px-6 py-3 uppercase tracking-widest text-xs font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all">Aller au Planning</button>
                 </div>
               ) : (
                 <div className="grid lg:grid-cols-3 gap-8 items-start">
                   {/* Colonne d'ajout produits */}
                   <div className="lg:col-span-2 space-y-6">
                     <div className="bg-[#18191c] border border-white/5 p-6 rounded shadow-xl">
                       <h3 className="font-serif text-xl text-white mb-6 uppercase tracking-widest border-b border-white/5 pb-4">Catalogue Boutique (Upsell)</h3>
                       <div className="grid sm:grid-cols-2 gap-4">
                         {inventory.map(item => (
                           <button 
                             key={item.id} 
                             onClick={() => addToCartFromInventory(item)}
                             disabled={item.stock <= 0}
                             className={`text-left p-4 rounded border transition-colors flex justify-between items-center group ${item.stock <= 0 ? 'bg-black/30 border-white/5 opacity-50 cursor-not-allowed' : 'bg-white/5 border-white/10 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5'}`}
                           >
                             <div>
                               <p className="text-white font-serif group-hover:text-[#d4af37] transition-colors">{item.name}</p>
                               <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Stock: {item.stock}</p>
                             </div>
                             <p className="text-[#d4af37] font-mono">€{item.price.toFixed(2)}</p>
                           </button>
                         ))}
                       </div>
                     </div>
                   </div>

                   {/* Ticket de caisse / Sidebar */}
                   <div className="bg-[#18191c] border-t-4 border-[#d4af37] rounded shadow-2xl p-6 sticky top-6">
                     <div className="mb-6 text-center border-b border-white/5 pb-6">
                       <p className="text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">Ticket N° 2024-{posClientInfo.id}9</p>
                       <h3 className="font-serif text-2xl text-white">{posClientInfo.client_name}</h3>
                       <p className="text-sm text-[#d4af37] mt-1">Barbier: {posClientInfo.barber}</p>
                     </div>

                     <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                       {posCart.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center bg-[#0f1012] p-3 rounded border border-white/5">
                           <div className="flex-1">
                             <p className="text-white font-serif text-sm line-clamp-1">{item.name}</p>
                             <p className="text-[10px] uppercase tracking-widest text-gray-500">{item.type}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-xs text-gray-400 mb-1">x{item.quantity}</p>
                             <p className="text-white font-mono">€{(item.price * item.quantity).toFixed(2)}</p>
                           </div>
                         </div>
                       ))}
                     </div>

                     <div className="border-t border-white/10 pt-4 mb-6">
                       <div className="flex justify-between items-end">
                         <span className="text-gray-400 uppercase tracking-widest text-sm font-bold">Total TTC</span>
                         <span className="text-[#d4af37] font-serif text-4xl font-bold">€{totalCartValue.toFixed(2)}</span>
                       </div>
                     </div>

                     <div className="space-y-3">
                       <button onClick={checkoutCart} className="w-full bg-[#d4af37] hover:bg-[#e4c256] text-black font-bold uppercase tracking-widest py-4 rounded-sm flex justify-center items-center gap-2 transition-colors"><CreditCard className="w-5 h-5"/> Payer par Carte</button>
                       <button onClick={checkoutCart} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest py-4 rounded-sm flex justify-center items-center gap-2 transition-colors"><Banknote className="w-5 h-5"/> Payer en Espèces</button>
                       <button onClick={() => { setPosClientInfo(null); setPosCart([]); }} className="w-full text-gray-500 hover:text-white uppercase tracking-widest text-xs py-2 mt-2 transition-colors">Annuler le Ticket</button>
                     </div>
                   </div>
                 </div>
               )}
             </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && ( ... ) /* To avoid large file code duplication I will just output the rest exactly as is in subsequent chunks or the full write */)} 
          {activeTab === "analytics" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-10">
                <h2 className="font-serif text-3xl text-white">Vue d'Ensemble</h2>
                <p className="text-gray-400 mt-2">Analysez la performance globale de votre établissement ce mois-ci.</p>
              </header>
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#18191c] p-8 border border-white/5 rounded-sm relative overflow-hidden group hover:border-[#d4af37]/30 transition-colors">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#d4af37]/5 rounded-full blur-2xl group-hover:bg-[#d4af37]/20 transition-all"></div>
                  <p className="text-xs uppercase tracking-[2px] text-gray-500 font-bold mb-3">Chiffre d'Affaires</p>
                  <p className="font-serif text-5xl text-white">€8,450</p>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <p className="text-emerald-400 text-sm flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> +12%</p>
                    <p className="text-xs text-gray-600">vs M-1</p>
                  </div>
                </div>
                <div className="bg-[#18191c] p-8 border border-white/5 rounded-sm shadow-lg border-t-2 border-t-[#d4af37]/50">
                  <p className="text-xs uppercase tracking-[2px] text-gray-500 font-bold mb-3">Taux de Remplissage</p>
                  <p className="font-serif text-5xl text-[#d4af37]">88%</p>
                  <p className="text-gray-400 text-sm mt-6 pt-4 border-t border-white/5">Excellente optimisation du planning.</p>
                </div>
                <div className="bg-[#18191c] p-8 border border-white/5 rounded-sm">
                  <p className="text-xs uppercase tracking-[2px] text-gray-500 font-bold mb-3">Produits Vendus</p>
                  <p className="font-serif text-5xl text-white">24</p>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <p className="text-emerald-400 text-sm flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> +5%</p>
                    <p className="text-xs text-[#d4af37]">€450 CA Boutique</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FINANCE & PAYROLL TAB */}
          {activeTab === "finance" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="font-serif text-3xl text-white">Comptabilité & Paies</h2>
                  <p className="text-gray-400 mt-2">Calculez automatiquement les commissions dues à chaque collaborateur.</p>
                </div>
                <button className="border border-white/10 hover:border-[#d4af37] text-white hover:text-[#d4af37] px-4 py-2 text-xs uppercase tracking-widest transition-colors font-bold rounded-sm">Générer Fiches de Paie</button>
              </header>
              <div className="bg-[#18191c] border border-white/5 rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/30 border-b border-white/5 text-[10px] uppercase tracking-[2px] text-gray-500">
                      <th className="p-5 font-bold">Collaborateur</th>
                      <th className="p-5 font-bold text-right">CA Prestations</th>
                      <th className="p-5 font-bold text-right">CA Boutique</th>
                      <th className="p-5 font-bold text-center">Taux Com.</th>
                      <th className="p-5 font-bold text-right text-[#d4af37]">À Payer (Net)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {finances.map((fin, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-5 font-serif text-lg text-white">{fin.barber}</td>
                        <td className="p-5 text-right text-gray-300 font-mono">€{fin.sales_services.toFixed(2)}</td>
                        <td className="p-5 text-right text-gray-300 font-mono">€{fin.sales_products.toFixed(2)}</td>
                        <td className="p-5 text-center text-gray-500 font-mono">{(fin.comm_rate * 100).toFixed(0)}%</td>
                        <td className="p-5 text-right font-serif text-xl tracking-wide text-[#d4af37] font-bold">€{fin.payout.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TEAM SCHEDULE TAB */}
          {activeTab === "team" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="font-serif text-3xl text-white">Planning de l'Équipe</h2>
                  <p className="text-gray-400 mt-2">Pilotez la disponibilité de vos collaborateurs en temps réel.</p>
                </div>
                <p className="text-sm border border-white/10 px-4 py-2 rounded-sm text-gray-300 font-mono tracking-widest bg-black/50">Aujourd'hui</p>
              </header>
              <div className="grid gap-4">
                {MOCK_TEAM.map(member => (
                  <div key={member.id} className={`p-6 border rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${member.status === 'working' ? 'bg-[#18191c] border-white/5' : 'bg-black/30 border-white/5 opacity-60'}`}>
                    <div className="flex gap-4 items-center w-full md:w-auto">
                      <div className="relative">
                        <img src={member.image} alt={member.name} className={`w-16 h-16 rounded-full object-cover border-2 ${member.status === 'working' ? 'border-[#d4af37]' : 'border-gray-600 grayscale'}`} />
                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#18191c] ${member.status === 'working' ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-white">{member.name}</h3>
                        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-bold mt-1">{member.role}</p>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><Info className="w-3 h-3"/> {member.expertise}</p>
                      </div>
                    </div>
                    <div className="w-full md:w-auto p-4 bg-[#0f1012] border border-white/5 rounded text-center flex-1 md:flex-none md:min-w-[200px]">
                      <p className="text-[10px] uppercase tracking-[2px] text-gray-500 mb-1">Horaires (Auj)</p>
                      <p className={`font-mono text-xl ${member.status === 'working' ? 'text-white' : 'text-red-400 font-bold'}`}>{member.hours}</p>
                    </div>
                    <div className="w-full md:w-auto flex flex-col gap-2">
                       <button className="bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest font-bold py-2 px-4 rounded transition-colors w-full">Gérer la semaine</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === "inventory" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="font-serif text-3xl text-white">Inventaire Boutique</h2>
                  <p className="text-gray-400 mt-2">Contrôlez vos stocks de produits et évitez les ruptures.</p>
                </div>
                <button className="bg-[#d4af37] text-black px-4 py-2 text-xs uppercase tracking-widest transition-colors font-bold rounded-sm hover:bg-[#f3d87b]">+ Ajouter Produit</button>
              </header>
              <div className="bg-[#18191c] border border-white/5 rounded-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/30 border-b border-white/5 text-[10px] uppercase tracking-[2px] text-gray-500">
                      <th className="p-5 font-bold">Produit</th>
                      <th className="p-5 font-bold">Catégorie</th>
                      <th className="p-5 font-bold text-center">Niveau de Stock</th>
                      <th className="p-5 font-bold text-right">Ajuster</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {inventory.map(item => (
                      <tr key={item.id} className={`transition-colors ${item.alert ? 'bg-red-500/5' : 'hover:bg-white/[0.02]'}`}>
                        <td className="p-5">
                          <p className="font-serif text-lg text-white flex items-center gap-2">
                            {item.alert && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />}
                            {item.name}
                          </p>
                          <p className="text-xs text-[#d4af37] mt-1 font-mono">Prix unitaire: €{item.price.toFixed(2)}</p>
                        </td>
                        <td className="p-5 text-gray-400 text-sm uppercase tracking-wider">{item.category}</td>
                        <td className="p-5 text-center">
                          <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full font-mono text-sm border font-bold ${item.alert ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-white/5 text-white border-white/10'}`}>
                            {item.stock} unités
                          </span>
                        </td>
                        <td className="p-5 text-right space-x-2">
                           <button onClick={() => updateStock(item.id, -1)} className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-white font-mono text-lg leading-none inline-flex items-center justify-center border border-white/10 transition-colors">-</button>
                           <button onClick={() => updateStock(item.id, 1)} className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 text-white font-mono text-lg leading-none inline-flex items-center justify-center border border-white/10 transition-colors">+</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === "appointments" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-10">
                <h2 className="font-serif text-3xl text-white">Réservations du jour</h2>
              </header>
              <div className="bg-[#18191c] border border-white/5 rounded-sm p-2 shadow-xl">
                 {appointments.map(app => (
                   <div key={app.id} className={`p-5 border-b border-white/5 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#0a0a0c] mb-2 rounded border-l-2 transition-colors gap-4 ${app.status === 'completed' ? 'border-l-emerald-500 opacity-60' : 'border-l-[#d4af37] hover:bg-white/[0.02]'}`}>
                     <div>
                       <p className="text-white font-serif text-2xl">{app.client_name}</p>
                       <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest flex flex-wrap gap-2 items-center">
                         <span className={`${app.status === 'completed' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' : 'text-[#d4af37] bg-[#d4af37]/10 border-[#d4af37]/30'} border px-2 py-0.5 rounded-sm font-bold`}>{app.time}</span>
                         <span>&bull;</span>
                         <span className="text-white">{app.barber}</span>
                         <span>&bull;</span>
                         <span className="text-gray-500">{app.service} (€{app.price})</span>
                       </p>
                     </div>
                     <div className="flex gap-4 items-center">
                       {app.status === 'confirmed' && (
                         <>
                           <button onClick={() => openPOS(app)} className="bg-[#d4af37] hover:bg-[#e4c256] text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-sm transition-colors flex items-center gap-2">
                             <Calculator className="w-4 h-4"/> Encaisser
                           </button>
                           <button onClick={() => handleCancel(app.id)} className="text-gray-500 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/30 p-2 rounded"><X className="w-5 h-5"/></button>
                         </>
                       )}
                       {app.status === 'completed' && (
                         <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase tracking-[2px] font-bold px-4 py-2 rounded-sm flex items-center gap-2">
                           <Check className="w-4 h-4"/> Terminé & Payé
                         </span>
                       )}
                       {app.status === 'cancelled' && (
                         <span className="bg-red-500/10 text-red-500 border border-red-500/30 text-[10px] uppercase tracking-[2px] font-bold px-4 py-2 rounded-sm">
                           Annulé
                         </span>
                       )}
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* CRM TAB */}
          {activeTab === "crm" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-10 border-b border-white/5 pb-4 flex justify-between items-end">
                <div>
                  <h2 className="font-serif text-3xl text-white">Base de données CRM</h2>
                  <p className="text-gray-400 mt-2">Détails des clients enregistrés.</p>
                </div>
              </header>
              <div className="grid gap-4">
                {clients.map(c => (
                  <div key={c.id} className="bg-[#18191c] p-6 flex flex-col md:flex-row md:justify-between md:items-center rounded-sm border border-white/5 gap-4 hover:border-[#d4af37]/30 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-black rounded flex items-center justify-center border border-white/10 font-serif text-xl text-[#d4af37]">{c.full_name.charAt(0)}</div>
                      <div>
                        <h4 className="text-white font-serif text-2xl flex items-center gap-2">
                          {c.full_name} 
                          {c.status === 'VIP' && <span className="bg-[#d4af37] text-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">VIP</span>}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">{c.phone} &bull; Dernière session: {c.last_visit}</p>
                      </div>
                    </div>
                    <div className="md:text-right bg-[#0f1012] p-4 rounded border border-white/5 w-full md:w-auto flex justify-between md:flex-col items-center">
                      <p className="text-[10px] uppercase tracking-[2px] text-gray-500 md:mb-1">Valeur générée</p>
                      <p className="text-[#d4af37] font-serif text-2xl tracking-widest font-bold">€{c.total_spent.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MARKETING TAB */}
          {activeTab === "marketing" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-10">
                <h2 className="font-serif text-3xl text-white">Moteur Automatisé</h2>
                <p className="text-gray-400 mt-2">Le système travaille pour vous en envoyant les bonnes communications au bon moment.</p>
              </header>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {marketing.map(campaign => (
                  <div key={campaign.id} className={`p-8 rounded-sm border transition-colors flex flex-col h-full ${campaign.active ? 'bg-[#18191c] border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/5' : 'bg-[#18191c]/50 border-white/5 opacity-80'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${campaign.active ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-white/5 text-gray-500'}`}>
                        {campaign.type.includes('Email') ? <Users className="w-5 h-5"/> : <MessageSquare className="w-5 h-5"/>}
                      </div>
                      <div onClick={() => toggleMarketing(campaign.id)} className={`cursor-pointer w-12 h-6 rounded-full relative transition-colors ${campaign.active ? 'bg-[#d4af37]' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${campaign.active ? 'left-7' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[2px] text-gray-500 mb-2">{campaign.type} Automatisé</p>
                      <h3 className="font-serif text-2xl text-white mb-4 line-clamp-2">{campaign.name}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4 mt-auto">{campaign.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === "services" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-10">
                <h2 className="font-serif text-3xl text-white">Menu des Prestations</h2>
                <p className="text-gray-400 mt-2">Ces prix sont reflétés en temps réel sur le site de réservation et dans la caisse.</p>
              </header>
              <div className="grid md:grid-cols-2 gap-6">
                {services.map(service => (
                  <div key={service.id} className="bg-[#18191c] border border-white/5 p-8 rounded-sm hover:border-white/20 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-[2px] text-gray-500 mb-1">{service.duration} mins de prestation</p>
                      <h3 className="font-serif text-2xl text-white">{service.name}</h3>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-48 shrink-0">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-serif text-xl">€</span>
                        <input type="number" value={service.price} onChange={(e) => updatePrice(service.id, e.target.value)} className="w-full bg-[#0f1012] border border-white/10 p-4 pl-10 text-white font-serif text-2xl focus:outline-none focus:border-[#d4af37] rounded-sm transition-colors" />
                      </div>
                      <button className="bg-white/5 hover:bg-[#d4af37] text-white hover:text-black p-4 rounded-sm transition-colors group"><Check className="w-6 h-6"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
