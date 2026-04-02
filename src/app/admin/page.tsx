"use client";

import { useState } from "react";
import { 
  Calendar, Clock, Euro, Users, Settings, LogOut, Check, X, 
  TrendingUp, MessageSquare, CalendarDays, Star, Mail, Phone,
  AlertCircle
} from "lucide-react";

// Mock Data
const MOCK_APPOINTMENTS = [
  { id: 1, client: "João Silva", service: "Coupe Executive", barber: "Tiago Silva", time: "10:00", date: "Actuellement", status: "confirmed" },
  { id: 2, client: "Pedro Santos", service: "Rasage Serviette Chaude", barber: "João Santos", time: "11:30", date: "Aujourd'hui", status: "confirmed" },
  { id: 3, client: "Carlos Gomes", service: "Sculpture de Barbe", barber: "Tiago Silva", time: "14:00", date: "Aujourd'hui", status: "confirmed" },
  { id: 4, client: "Miguel Costa", service: "L'Expérience Lisboeta", barber: "João Santos", time: "16:00", date: "Aujourd'hui", status: "cancelled" },
];

const INITIAL_SERVICES = [
  { id: 1, name: "Coupe Executive", price: "35", duration: "30 min" },
  { id: 2, name: "Rasage Serviette Chaude", price: "30", duration: "30 min" },
  { id: 3, name: "Sculpture de Barbe", price: "25", duration: "20 min" },
  { id: 4, name: "L'Expérience Lisboeta", price: "60", duration: "60 min" },
];

const MOCK_CLIENTS = [
  { id: 1, name: "António Costa", phone: "+351 912 345 611", visits: 12, spent: 480, lastVisit: "Il y a 3 jours", status: "Loyal" },
  { id: 2, name: "Filipe Oliveira", phone: "+351 912 345 622", visits: 3, spent: 105, lastVisit: "Il y a 2 semaines", status: "Régulier" },
  { id: 3, name: "Hugo Fernandes", phone: "+351 912 345 633", visits: 1, spent: 60, lastVisit: "Il y a 6 semaines", status: "À relancer" },
  { id: 4, name: "Bruno Sousa", phone: "+351 912 345 644", visits: 25, spent: 950, lastVisit: "Il y a 1 jour", status: "VIP" },
];

const MOCK_MARKETING = [
  { id: 1, name: "Rappel de Rendez-vous (24h avant)", type: "SMS", active: true, description: "Réduit les absences de 80%." },
  { id: 2, name: "Relance Inactivité (6 semaines)", type: "SMS & Email", active: false, description: "Recible les clients qui n'ont pas réservé depuis 6 semaines avec une promo de 10%." },
  { id: 3, name: "Joyeux Anniversaire", type: "Email", active: true, description: "Envoie un e-mail automatique avec une coupe offerte le jour de l'anniversaire du client." },
  { id: 4, name: "Newsletter Mensuelle (Tips Barbe)", type: "Email", active: false, description: "Fidélise votre clientèle grâce à du contenu de qualité." },
];

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [marketing, setMarketing] = useState(MOCK_MARKETING);
  const [activeTab, setActiveTab] = useState("analytics");
  const [isLogged, setIsLogged] = useState(false);

  const handleCancel = (id: number) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
  };

  const updatePrice = (id: number, newPrice: string) => {
    setServices(services.map(s => s.id === id ? { ...s, price: newPrice } : s));
  };

  const toggleMarketing = (id: number) => {
    setMarketing(marketing.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#0f1012] flex items-center justify-center p-4">
        <div className="bg-[#18191c] border border-white/10 p-10 max-w-md w-full rounded-sm text-center">
          <h1 className="font-serif text-3xl mb-2 text-white">Cockpit Admin</h1>
          <p className="text-gray-400 mb-8 text-sm">Votre ERP Barbershop Complet.</p>
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full bg-[#0f1012] border border-white/10 p-3 text-white focus:outline-none focus:border-[#d4af37]" defaultValue="admin@barbeiro.pt" />
            <input type="password" placeholder="Mot de passe" className="w-full bg-[#0f1012] border border-white/10 p-3 text-white focus:outline-none focus:border-[#d4af37]" defaultValue="password" />
            <button onClick={() => setIsLogged(true)} className="w-full bg-[#d4af37] text-black font-semibold uppercase tracking-widest text-sm py-4 mt-4 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">Accéder à mon salon</button>
          </div>
          <p className="mt-6 text-xs text-gray-600">Note: mode démo du template complet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1012] flex flex-col md:flex-row font-sans">
      {/* Sidebar ERP */}
      <aside className="w-full md:w-64 bg-[#18191c] border-r border-white/5 flex flex-col shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-white/5">
          <h1 className="font-serif text-xl text-white">O Barbeiro <span className="text-[#d4af37] italic">Cockpit</span></h1>
          <p className="text-xs tracking-widest uppercase text-emerald-400 font-semibold mt-2 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Salon Ouvert</p>
        </div>
        <nav className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2 ml-2 mt-2">Vue Globale</p>
          <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "analytics" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <TrendingUp className="w-5 h-5" /> Analytics
          </button>
          
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2 ml-2 mt-6">Quotidien</p>
          <button onClick={() => setActiveTab("appointments")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "appointments" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Calendar className="w-5 h-5" /> Rendez-vous <span className="ml-auto bg-[#d4af37] text-black text-[10px] px-2 py-0.5 rounded-full font-bold">3</span>
          </button>
          <button onClick={() => setActiveTab("schedule")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "schedule" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <CalendarDays className="w-5 h-5" /> Planning Equipe
          </button>
          
          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-2 ml-2 mt-6">Business</p>
          <button onClick={() => setActiveTab("crm")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "crm" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Users className="w-5 h-5" /> Fichiers Clients
          </button>
          <button onClick={() => setActiveTab("marketing")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "marketing" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <MessageSquare className="w-5 h-5" /> Relances & Marketing
          </button>
          <button onClick={() => setActiveTab("services")} className={`flex items-center gap-3 w-full text-left p-3 rounded transition-colors ${activeTab === "services" ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Euro className="w-5 h-5" /> Carte des Services
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
           <button onClick={() => setIsLogged(false)} className="flex items-center gap-3 text-gray-500 hover:text-[#d4af37] transition-colors w-full p-3"><LogOut className="w-5 h-5"/> Déconnexion</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* --- ANALYTICS --- */}
        {activeTab === "analytics" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10">
              <h2 className="font-serif text-3xl text-white">Performance du mois</h2>
              <p className="text-gray-400 mt-2">Vue d'ensemble de la rentabilité de votre barbershop.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-[#18191c] p-6 border border-white/5 rounded-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#d4af37]/10 rounded-full blur-2xl"></div>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Chiffre d'affaires</p>
                <p className="font-serif text-4xl text-white">€8,450.00</p>
                <p className="text-emerald-400 text-sm flex items-center mt-4"><TrendingUp className="w-4 h-4 mr-1"/> +12% vs mois dernier</p>
              </div>
              <div className="bg-[#18191c] p-6 border border-white/5 rounded-sm">
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Nouveaux Clients</p>
                <p className="font-serif text-4xl text-white">42</p>
                <p className="text-emerald-400 text-sm flex items-center mt-4"><TrendingUp className="w-4 h-4 mr-1"/> +5% vs mois dernier</p>
              </div>
              <div className="bg-[#18191c] p-6 border border-white/5 rounded-sm">
                <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Taux de remplissage</p>
                <p className="font-serif text-4xl text-[#d4af37]">88%</p>
                <p className="text-gray-400 text-sm mt-4">Excellent ratio pour Tiago et João.</p>
              </div>
            </div>

            <h3 className="font-serif text-2xl text-white mb-6">Services les plus demandés</h3>
            <div className="bg-[#18191c] border border-white/5 rounded p-6">
               <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-sm mb-2"><span className="text-white">Coupe Executive</span><span className="text-[#d4af37]">125 réservations</span></div>
                   <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-[#d4af37] h-2 rounded-full w-[85%]"></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-sm mb-2"><span className="text-white">Sculpture de Barbe</span><span className="text-[#d4af37]">84 réservations</span></div>
                   <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-[#d4af37] h-2 rounded-full w-[55%]"></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-sm mb-2"><span className="text-white">L'Expérience Lisboeta</span><span className="text-[#d4af37]">40 réservations</span></div>
                   <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-[#d4af37]/50 h-2 rounded-full w-[30%]"></div></div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* --- CRM --- */}
        {activeTab === "crm" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="font-serif text-3xl text-white">Fichier Clients</h2>
                <p className="text-gray-400 mt-2">Votre base de données fidélité intégrée.</p>
              </div>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm uppercase tracking-widest transition-colors font-semibold">Exporter CSV</button>
            </header>

            <div className="bg-[#18191c] border border-white/5 rounded overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 border-b border-white/5 text-xs uppercase tracking-widest text-gray-500">
                    <th className="p-4 font-normal">Identité</th>
                    <th className="p-4 font-normal hidden md:table-cell">Contact</th>
                    <th className="p-4 font-normal text-center">Visites</th>
                    <th className="p-4 font-normal">Dernière Visite</th>
                    <th className="p-4 font-normal">Statut</th>
                    <th className="p-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_CLIENTS.map(client => (
                    <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-white font-serif text-lg">{client.name}</p>
                        <p className="text-xs text-[#d4af37] uppercase tracking-widest">€{client.spent} dépensés</p>
                      </td>
                      <td className="p-4 hidden md:table-cell text-gray-400 text-sm"><Phone className="w-3 h-3 inline mr-1"/>{client.phone}</td>
                      <td className="p-4 text-center text-white">{client.visits}</td>
                      <td className="p-4 text-gray-400 text-sm">{client.lastVisit}</td>
                      <td className="p-4">
                        {client.status === 'VIP' && <span className="text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center w-max"><Star className="w-3 h-3 mr-1 fill-current"/> VIP</span>}
                        {client.status === 'Loyal' && <span className="text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-semibold w-max flex">Loyal</span>}
                        {client.status === 'À relancer' && <span className="text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center w-max"><AlertCircle className="w-3 h-3 mr-1"/> À relancer</span>}
                        {client.status === 'Régulier' && <span className="text-gray-300 bg-white/10 px-2.5 py-1 rounded-full text-xs font-semibold w-max flex">Régulier</span>}
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-[#d4af37] hover:text-white transition-colors p-2 text-xs uppercase tracking-widest font-semibold">Envoyer SMS</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- MARKETING & RELANCES --- */}
        {activeTab === "marketing" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10">
              <h2 className="font-serif text-3xl text-white">Marketing Automatisé</h2>
              <p className="text-gray-400 mt-2">Paramétrez des SMS et Emails automatiques pour vos clients afin de générer plus de réservations sans effort.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
              {marketing.map(campaign => (
                <div key={campaign.id} className={`p-6 rounded border transition-colors ${campaign.active ? 'bg-[#18191c] border-[#d4af37]/30' : 'bg-black/20 border-white/5 opacity-70'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-xl text-white mb-1">{campaign.name}</h3>
                      <p className="text-xs uppercase tracking-widest text-[#d4af37] flex items-center gap-1">
                        {campaign.type.includes('Email') ? <Mail className="w-3 h-3"/> : null} 
                        {campaign.type.includes('SMS') ? <Phone className="w-3 h-3"/> : null} 
                        {campaign.type}
                      </p>
                    </div>
                    {/* Fake Toggle Switch */}
                    <div onClick={() => toggleMarketing(campaign.id)} className={`cursor-pointer w-12 h-6 rounded-full relative transition-colors ${campaign.active ? 'bg-[#d4af37]' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${campaign.active ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{campaign.description}</p>
                  {campaign.active && <p className="mt-4 text-xs font-semibold text-emerald-400">● Campagne active et en cours de distribution</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SCHEDULE --- */}
        {activeTab === "schedule" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10">
              <h2 className="font-serif text-3xl text-white">Planning de l'équipe (Mock)</h2>
              <p className="text-gray-400 mt-2">Visibilité sur la disponibilité de vos barbiers.</p>
            </header>

            <div className="bg-[#18191c] border border-white/5 rounded p-6">
               <div className="grid gap-6">
                  <div className="flex items-center gap-4 p-4 border border-white/5 rounded">
                    <img src="https://i.pravatar.cc/150?u=tiago" alt="Tiago" className="w-12 h-12 rounded-full border border-[#d4af37]" />
                    <div>
                      <h4 className="font-serif text-xl text-white">Tiago Silva</h4>
                      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Aujourd'hui: 10:00 - 18:00</p>
                    </div>
                    <button className="ml-auto bg-white/5 p-2 rounded text-gray-400 hover:text-white hover:bg-white/10 text-xs uppercase cursor-not-allowed">Bloquer un créneau</button>
                  </div>
                  <div className="flex items-center gap-4 p-4 border border-white/5 rounded">
                    <img src="https://i.pravatar.cc/150?u=joao" alt="Joao" className="w-12 h-12 rounded-full border border-white/20 opacity-50 grayscale" />
                    <div>
                      <h4 className="font-serif text-xl text-gray-500">João Santos</h4>
                      <p className="text-red-400 text-xs font-semibold uppercase tracking-widest">En congé aujourd'hui</p>
                    </div>
                    <button className="ml-auto bg-white/5 p-2 rounded text-gray-400 hover:text-white hover:bg-white/10 text-xs uppercase cursor-not-allowed">Gérer les congés</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* --- APPOINTMENTS (Legacy refactored) --- */}
        {activeTab === "appointments" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="font-serif text-3xl text-white">Carnet du jour</h2>
                <p className="text-gray-400 mt-2">Gérez les créneaux et accueillez vos clients.</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif text-[#d4af37]">{appointments.filter(a => a.status === 'confirmed').length}</span>
                <span className="text-gray-500 ml-2 uppercase text-xs tracking-widest">confirmés</span>
              </div>
            </header>

            <div className="bg-[#18191c] border border-white/5 rounded overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 border-b border-white/5 text-xs uppercase tracking-widest text-gray-500">
                    <th className="p-4 font-normal text-center">Heure</th>
                    <th className="p-4 font-normal">Client</th>
                    <th className="p-4 font-normal hidden md:table-cell">Service</th>
                    <th className="p-4 font-normal hidden md:table-cell">Barbier</th>
                    <th className="p-4 font-normal">Statut</th>
                    <th className="p-4 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {appointments.map(app => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 whitespace-nowrap text-center">
                        <span className="font-serif text-xl text-[#d4af37]">{app.time}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white text-lg">{app.client}</p>
                        <p className="text-xs text-gray-500 md:hidden">{app.service}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell text-gray-300">{app.service}</td>
                      <td className="p-4 hidden md:table-cell text-gray-400">{app.barber}</td>
                      <td className="p-4">
                        {app.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Confirmé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Annulé
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {app.status === 'confirmed' && (
                          <button onClick={() => handleCancel(app.id)} className="text-gray-500 hover:text-red-400 transition-colors p-2" title="Annuler">
                            <X className="w-5 h-5 inline" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SERVICES (Legacy refactored) --- */}
        {activeTab === "services" && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10">
              <h2 className="font-serif text-3xl text-white">Gestion des Prix</h2>
              <p className="text-gray-400 mt-2">Ajustez les tarifs applicables sur la page des clients.</p>
            </header>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div key={service.id} className="bg-[#18191c] border border-white/5 p-6 rounded relative group hover:border-[#d4af37]/30 transition-colors">
                  <h3 className="font-serif text-xl text-white mb-2">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex items-center gap-2"><Clock className="w-4 h-4"/> {service.duration}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-serif">€</span>
                      <input 
                        type="number" 
                        value={service.price} 
                        onChange={(e) => updatePrice(service.id, e.target.value)}
                        className="w-full bg-[#0f1012] border border-white/10 p-3 pl-8 text-white font-serif text-xl focus:outline-none focus:border-[#d4af37] transition-colors rounded-sm"
                      />
                    </div>
                    <button className="bg-[#d4af37]/10 text-[#d4af37] p-3 rounded-sm hover:bg-[#d4af37] hover:text-black transition-colors" title="Sauvegarder">
                      <Check className="w-5 h-5"/>
                    </button>
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
