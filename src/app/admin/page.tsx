"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Clock, Euro, Users, LogOut, Check, X, 
  TrendingUp, MessageSquare, CalendarDays, Star, Mail, Phone,
  AlertCircle
} from "lucide-react";
import { getAdminData, cancelAppointment, updateServicePrice } from "@/lib/actions";

const MOCK_MARKETING = [
  { id: 1, name: "Rappel de Rendez-vous (24h avant)", type: "SMS", active: true, description: "Réduit les absences de 80%. Connecté à Twilio." },
  { id: 2, name: "Relance Inactivité (6 semaines)", type: "SMS & Email", active: false, description: "Recible via Resend les clients inactifs." },
  { id: 3, name: "Joyeux Anniversaire", type: "Email", active: true, description: "Automatisé avec Supabase Edge Functions." },
];

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [marketing, setMarketing] = useState(MOCK_MARKETING);
  
  const [activeTab, setActiveTab] = useState("analytics");
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLogged) {
      getAdminData().then(data => {
        setAppointments(data.appointments);
        setClients(data.clients);
        setServices(data.services);
        setIsLoading(false);
      });
    }
  }, [isLogged]);

  const handleCancel = async (id: string) => {
    await cancelAppointment(id);
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
  };

  const updatePrice = async (id: string, newPrice: string) => {
    await updateServicePrice(id, parseFloat(newPrice));
    setServices(services.map(s => s.id === id ? { ...s, price: parseFloat(newPrice) } : s));
  };

  const toggleMarketing = (id: number) => {
    setMarketing(marketing.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#0f1012] flex items-center justify-center p-4">
        <div className="bg-[#18191c] border border-white/10 p-10 max-w-md w-full rounded-sm text-center">
          <h1 className="font-serif text-3xl mb-2 text-white">Cockpit Admin</h1>
          <div className="space-y-4 mt-8">
            <input type="email" placeholder="Email" className="w-full bg-[#0f1012] border border-white/10 p-3 text-white focus:outline-none focus:border-[#d4af37]" defaultValue="admin@barbeiro.pt" />
            <input type="password" placeholder="Mot de passe" className="w-full bg-[#0f1012] border border-white/10 p-3 text-white focus:outline-none focus:border-[#d4af37]" defaultValue="password" />
            <button onClick={() => setIsLogged(true)} className="w-full bg-[#d4af37] text-black font-semibold uppercase tracking-widest text-sm py-4 mt-4 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">Connexion (Base de données active)</button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#0f1012] flex items-center justify-center text-[#d4af37]">Chargement des données ERP...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f1012] flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 bg-[#18191c] border-r border-white/5 flex flex-col shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-white/5">
          <h1 className="font-serif text-xl text-white">O Barbeiro <span className="text-[#d4af37] italic">Cockpit</span></h1>
        </div>
        <nav className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2 ml-2 mt-2">Vue Globale</p>
          <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "analytics" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><TrendingUp className="w-5 h-5" /> Analytics</button>
          
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2 ml-2 mt-6">Quotidien</p>
          <button onClick={() => setActiveTab("appointments")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "appointments" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><Calendar className="w-5 h-5" /> Réservations</button>
          
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
              <h2 className="font-serif text-3xl text-white">Performance (Données Réelles)</h2>
              <p className="text-gray-400 mt-2">Vue d'ensemble de la base de données.</p>
            </header>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#18191c] p-6 border border-white/5 rounded-sm relative overflow-hidden">
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Base Clients Active</p>
                <p className="font-serif text-4xl text-white">{clients.length}</p>
              </div>
              <div className="bg-[#18191c] p-6 border border-white/5 rounded-sm">
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Réservations Totales</p>
                <p className="font-serif text-4xl text-white">{appointments.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "crm" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10 border-b border-white/5 pb-4">
              <h2 className="font-serif text-3xl text-white">CRM Connecté</h2>
              <p className="text-gray-400 mt-2">Dossiers clients mis à jour automatiquement par Supabase.</p>
            </header>
            <div className="space-y-4">
              {clients.map(c => (
                <div key={c.id || c.email} className="bg-[#18191c] p-4 flex justify-between items-center rounded border border-white/5">
                  <div>
                    <h4 className="text-white font-serif text-xl">{c.full_name || c.name}</h4>
                    <p className="text-sm text-gray-500">{c.email} &bull; {c.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#d4af37] font-semibold">€{c.total_spent || 0}</p>
                    <p className="text-xs text-gray-500">{c.total_visits || 0} visites</p>
                  </div>
                </div>
              ))}
              {clients.length === 0 && <p className="text-gray-400 italic">Aucun client en base.</p>}
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
              <h2 className="font-serif text-3xl text-white">Base de données des Réservations</h2>
            </header>
            <div className="bg-[#18191c] border border-white/5 rounded overflow-hidden p-2">
               {appointments.map(app => (
                 <div key={app.id} className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0a0a0c] mb-2 rounded">
                   <div>
                     <p className="text-white font-bold">{app.client_name}</p>
                     <p className="text-sm text-gray-400">{new Date(app.start_time || app.time).toLocaleString()}</p>
                   </div>
                   <div className="flex gap-4 items-center">
                     <span className={`text-xs px-2 py-1 rounded ${app.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>{app.status}</span>
                     {app.status === 'confirmed' && <button onClick={() => handleCancel(app.id)} className="text-white hover:text-red-500"><X className="w-5 h-5"/></button>}
                   </div>
                 </div>
               ))}
               {appointments.length === 0 && <p className="text-gray-400 p-4">Aucune réservation trouvée en base.</p>}
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
                    <button className="bg-[#d4af37] text-black p-3"><Check className="w-5 h-5"/></button>
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
