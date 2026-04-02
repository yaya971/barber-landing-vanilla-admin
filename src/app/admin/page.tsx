"use client";

import { useState } from "react";
import { 
  Calendar, Clock, Euro, Users, LogOut, Check, X, 
  TrendingUp, MessageSquare, CalendarDays, Star, Mail, Phone,
  AlertCircle
} from "lucide-react";

// MOCK DATA LOCALE POUR LA DEMO
const MOCK_APPOINTMENTS = [
  { id: "1", client_name: "João Silva", service: "Coupe Executive", barber: "Tiago Silva", time: "10:00", status: "confirmed" },
  { id: "2", client_name: "Pedro Santos", service: "Rasage Serviette Chaude", barber: "João Santos", time: "11:30", status: "confirmed" },
  { id: "3", client_name: "Carlos Gomes", service: "Sculpture de Barbe", barber: "Tiago Silva", time: "14:00", status: "confirmed" },
  { id: "4", client_name: "Miguel Costa", service: "L'Expérience Lisboeta", barber: "João Santos", time: "16:00", status: "cancelled" },
];

const INITIAL_SERVICES = [
  { id: "1", name: "Coupe Executive", price: "35", duration: "30 min" },
  { id: "2", name: "Rasage Serviette Chaude", price: "30", duration: "30 min" },
  { id: "3", name: "Sculpture de Barbe", price: "25", duration: "20 min" },
  { id: "4", name: "L'Expérience Lisboeta", price: "60", duration: "60 min" },
];

const MOCK_CLIENTS = [
  { id: "1", full_name: "António Costa", phone: "+351 912 345 611", total_visits: 12, total_spent: 480, last_visit: "Il y a 3 jours", status: "Loyal" },
  { id: "2", full_name: "Filipe Oliveira", phone: "+351 912 345 622", total_visits: 3, total_spent: 105, last_visit: "Il y a 2 semaines", status: "Régulier" },
  { id: "3", full_name: "Hugo Fernandes", phone: "+351 912 345 633", total_visits: 1, total_spent: 60, last_visit: "Il y a 6 semaines", status: "À relancer" },
  { id: "4", full_name: "Bruno Sousa", phone: "+351 912 345 644", total_visits: 25, total_spent: 950, last_visit: "Hier", status: "VIP" },
];

const MOCK_MARKETING = [
  { id: 1, name: "Rappel de Rendez-vous (24h avant)", type: "SMS", active: true, description: "Réduit les absences de 80%. Intégré avec le logiciel téléphonique." },
  { id: 2, name: "Relance Inactivité (6 semaines)", type: "SMS & Email", active: false, description: "Recible les clients inactifs pour augmenter la rétention." },
  { id: 3, name: "Joyeux Anniversaire", type: "Email", active: true, description: "Automatisé le jour J pour vos clients fidèles." },
];

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>(MOCK_APPOINTMENTS);
  const [services, setServices] = useState<any[]>(INITIAL_SERVICES);
  const [clients, setClients] = useState<any[]>(MOCK_CLIENTS);
  const [marketing, setMarketing] = useState(MOCK_MARKETING);
  
  const [activeTab, setActiveTab] = useState("analytics");
  const [isLogged, setIsLogged] = useState(false);

  const handleCancel = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
  };

  const updatePrice = (id: string, newPrice: string) => {
    setServices(services.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  const toggleMarketing = (id: number) => {
    setMarketing(marketing.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#0f1012] flex items-center justify-center p-4">
        <div className="bg-[#18191c] border border-white/10 p-10 max-w-md w-full rounded-sm text-center shadow-2xl">
          <h1 className="font-serif text-3xl mb-2 text-white">Cockpit Admin</h1>
          <p className="text-gray-400 mb-8 text-sm">Mode Démonstration Actif</p>
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full bg-[#0f1012] border border-white/10 p-3 text-white focus:outline-none focus:border-[#d4af37]" defaultValue="admin@demo.com" />
            <input type="password" placeholder="Mot de passe" className="w-full bg-[#0f1012] border border-white/10 p-3 text-white focus:outline-none focus:border-[#d4af37]" defaultValue="password" />
            <button onClick={() => setIsLogged(true)} className="w-full bg-[#d4af37] text-black font-semibold uppercase tracking-widest text-sm py-4 mt-4 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">Connexion</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1012] flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-[#18191c] border-r border-white/5 flex flex-col shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-white/5">
          <h1 className="font-serif text-xl text-white">O Barbeiro <span className="text-[#d4af37] italic">Cockpit</span></h1>
          <p className="text-xs tracking-widest uppercase text-emerald-400 font-semibold mt-2 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Simulateur Actif</p>
        </div>
        <nav className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2 ml-2 mt-2">Vue Globale</p>
          <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "analytics" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><TrendingUp className="w-5 h-5" /> Analytics</button>
          
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2 ml-2 mt-6">Quotidien</p>
          <button onClick={() => setActiveTab("appointments")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "appointments" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><Calendar className="w-5 h-5" /> Réservations <span className="ml-auto bg-[#d4af37] text-black text-[10px] px-2 py-0.5 rounded-full font-bold">3</span></button>
          
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2 ml-2 mt-6">Business</p>
          <button onClick={() => setActiveTab("crm")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "crm" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><Users className="w-5 h-5" /> Fichiers Clients</button>
          <button onClick={() => setActiveTab("marketing")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "marketing" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><MessageSquare className="w-5 h-5" /> Automatisations</button>
          <button onClick={() => setActiveTab("services")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "services" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><Euro className="w-5 h-5" /> Carte des Services</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === "analytics" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10">
              <h2 className="font-serif text-3xl text-white">Performance du mois</h2>
              <p className="text-gray-400 mt-2">Vue d'ensemble simulée.</p>
            </header>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#18191c] p-6 border border-white/5 rounded-sm relative overflow-hidden">
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Chiffre d'Affaires</p>
                <p className="font-serif text-4xl text-white">€8,450</p>
                <p className="text-emerald-400 text-sm flex items-center mt-4"><TrendingUp className="w-4 h-4 mr-1"/> +12%</p>
              </div>
              <div className="bg-[#18191c] p-6 border border-white/5 rounded-sm">
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Taux de Remplissage</p>
                <p className="font-serif text-4xl text-[#d4af37]">88%</p>
                <p className="text-gray-400 text-sm mt-4">Statistique simulée</p>
              </div>
              <div className="bg-[#18191c] p-6 border border-white/5 rounded-sm">
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Clients Fidèles</p>
                <p className="font-serif text-4xl text-white">340</p>
              </div>
            </div>
          </div>
        )}

        {/* --- CRM --- */}
        {activeTab === "crm" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10 border-b border-white/5 pb-4">
              <h2 className="font-serif text-3xl text-white">Fichier Clients CRM</h2>
            </header>
            <div className="space-y-4">
              {clients.map(c => (
                <div key={c.id} className="bg-[#18191c] p-4 flex justify-between items-center rounded border border-white/5">
                  <div>
                    <h4 className="text-white font-serif text-xl">{c.full_name}</h4>
                    <p className="text-sm text-gray-500">{c.phone} &bull; {c.last_visit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#d4af37] font-semibold">€{c.total_spent}</p>
                    <p className="text-xs text-gray-500">{c.total_visits} visites</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MARKETING & RELANCES --- */}
        {activeTab === "marketing" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10">
              <h2 className="font-serif text-3xl text-white">Moteur de Relances</h2>
            </header>
            <div className="grid gap-6">
              {marketing.map(campaign => (
                <div key={campaign.id} className={`p-6 rounded border transition-colors ${campaign.active ? 'bg-[#18191c] border-[#d4af37]/30' : 'bg-black/20 border-white/5 opacity-70'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-xl text-white mb-1">{campaign.name}</h3>
                      <p className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">{campaign.type}</p>
                    </div>
                    {/* Toggle UI Interactif */}
                    <div onClick={() => toggleMarketing(campaign.id)} className={`cursor-pointer w-12 h-6 rounded-full relative transition-colors ${campaign.active ? 'bg-[#d4af37]' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${campaign.active ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{campaign.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- APPOINTMENTS --- */}
        {activeTab === "appointments" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10">
              <h2 className="font-serif text-3xl text-white">Créneaux du jour</h2>
            </header>
            <div className="bg-[#18191c] border border-white/5 rounded p-2">
               {appointments.map(app => (
                 <div key={app.id} className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0a0a0c] mb-2 rounded">
                   <div>
                     <p className="text-white font-bold text-lg">{app.client_name}</p>
                     <p className="text-sm text-gray-400">{app.time} &bull; {app.barber} &bull; <span className="text-[#d4af37]">{app.service}</span></p>
                   </div>
                   <div className="flex gap-4 items-center">
                     <span className={`text-xs px-2 py-1 rounded ${app.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                       {app.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
                     </span>
                     {app.status === 'confirmed' && <button onClick={() => handleCancel(app.id)} className="text-white hover:text-red-500"><X className="w-5 h-5"/></button>}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* --- SERVICES --- */}
        {activeTab === "services" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10">
              <h2 className="font-serif text-3xl text-white">Prix des Services</h2>
            </header>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div key={service.id} className="bg-[#18191c] border border-white/5 p-6 rounded">
                  <h3 className="font-serif text-xl text-white mb-2">{service.name}</h3>
                  <div className="flex items-center gap-3 mt-4">
                    <input type="number" value={service.price} onChange={(e) => updatePrice(service.id, e.target.value)} className="w-full bg-[#0f1012] border border-white/10 p-3 text-white focus:border-[#d4af37]" />
                    <button className="bg-[#d4af37] text-black p-3 rounded-sm"><Check className="w-5 h-5"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
