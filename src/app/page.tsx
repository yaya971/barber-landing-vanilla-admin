"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Scissors, User, X, CheckCircle, ChevronRight, Check } from "lucide-react";
import Image from "next/image";

// Mock Data
const SERVICES = [
  { id: 1, name: "Coupe Executive", price: "€35", duration: "30 min", description: "Coupe sur-mesure, lavage et finition premium." },
  { id: 2, name: "Rasage Serviette Chaude", price: "€30", duration: "30 min", description: "Rasage classique à l'ancienne." },
  { id: 3, name: "Sculpture de Barbe", price: "€25", duration: "20 min", description: "Taille experte et huile nourrissante." },
  { id: 4, name: "L'Expérience Lisboeta", price: "€60", duration: "60 min", description: "Le package complet: Coupe + Rasage." },
];

const BARBERS = [
  { id: 1, name: "Tiago Silva", role: "Master Barber", image: "https://i.pravatar.cc/150?u=tiago" },
  { id: 2, name: "João Santos", role: "Senior Barber", image: "https://i.pravatar.cc/150?u=joao" },
];

// Generate next 5 days
const getNextDays = () => {
  const days = [];
  for (let i = 1; i <= 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
};

const TIME_SLOTS = ["10:00", "11:00", "13:00", "14:30", "16:00", "18:00"];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  // Booking State
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    setTimeout(() => {
      setBookingStep(1);
      setSelectedService(null);
      setSelectedBarber(null);
      setSelectedDate(null);
      setSelectedTime(null);
    }, 300);
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep(5); // Success step
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#0f1012]/95 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
        <div className="max-w-[1200px] mx-auto px-8 flex justify-between items-center">
          <a href="#" className="font-serif text-2xl font-semibold text-white tracking-widest uppercase">
            O Barbeiro <span className="text-[#d4af37] italic normal-case">Lisboeta</span>
          </a>
          <div className="hidden md:flex items-center space-x-10 text-sm font-medium uppercase tracking-[2px]">
            <a href="#services" className="hover:text-white transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[1px] auto after:bg-[#d4af37] after:transition-all">Services</a>
            <a href="#about" className="hover:text-white transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:h-[1px] auto after:bg-[#d4af37] after:transition-all">L'Artisanat</a>
            <button onClick={openModal} className="border border-[#d4af37] text-[#d4af37] px-6 py-2 rounded-sm hover:bg-[#d4af37] hover:text-[#0f1012] transition-colors">
              Réserver
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black/60">
          <Image
            src="/hero.png"
            alt="Barber Shop Interior"
            fill
            priority
            className="object-cover hero-bg-anim mix-blend-overlay opacity-60"
          />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto w-full pt-20">
          <div className="max-w-2xl">
            <span className="inline-block text-[#d4af37] uppercase tracking-[4px] text-xs font-semibold mb-6 border-b border-[#d4af37]/30 pb-2">
              Dép. 2024 • Lisbonne, PT
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
              L'Art Genuin du <br /> <span className="text-[#d4af37] italic">Soin Masculin</span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed">
              L'héritage classique portugais rencontre le luxe moderne. Élevez votre style au cœur de notre magnifique ville.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={openModal} className="bg-[#d4af37] text-[#0f1012] px-8 py-4 font-medium tracking-wide uppercase text-sm hover:-translate-y-1 transition-transform border border-[#d4af37] hover:shadow-[0_10px_20px_rgba(212,175,55,0.2)]">
                Prendre Rendez-vous
              </button>
              <a href="#services" className="bg-white/5 backdrop-blur-sm border border-white/10 px-8 py-4 font-medium tracking-wide uppercase text-sm hover:-translate-y-1 transition-all hover:bg-white/10">
                Découvrir
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-8 bg-[#0f1012]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20 md:mb-24">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">Nos Services</h2>
            <div className="w-16 h-[2px] bg-[#d4af37] mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg">La précision magistrale dans chaque coupe et rasage.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {SERVICES.map((service, idx) => (
              <div key={service.id} className={`service-card bg-[#18191c] border ${idx === 3 ? 'border-[#d4af37]/30 bg-gradient-to-br from-[#18191c] to-[#1a1712]' : 'border-white/5'} p-10 rounded-sm relative group`}>
                {idx === 3 && (
                  <span className="absolute top-6 -right-10 bg-[#d4af37] text-black text-[10px] uppercase font-bold tracking-[2px] px-10 py-1 rotate-45 shadow-lg">La Signature</span>
                )}
                <div className="flex justify-between items-baseline mb-4 pb-4 border-b border-white/5 dashed-border">
                  <h3 className="font-serif text-2xl group-hover:text-[#d4af37] transition-colors">{service.name}</h3>
                  <span className="font-serif text-2xl text-[#d4af37]">{service.price}</span>
                </div>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Wizard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-[#18191c] border-t-4 border-[#d4af37] w-full max-w-2xl rounded-sm shadow-2xl my-auto flex flex-col max-h-[90vh]">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20">
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="p-8 pb-4 shrink-0 text-center border-b border-white/5">
              <h2 className="font-serif text-3xl mb-2 text-white">Réserver une session</h2>
              
              {/* Progress Steps */}
              {bookingStep < 5 && (
                <div className="flex justify-center items-center mt-6 space-x-2 sm:space-x-4">
                  {[1, 2, 3, 4].map(step => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${bookingStep === step ? 'bg-[#d4af37] text-black' : bookingStep > step ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                        {bookingStep > step ? <Check className="w-4 h-4" /> : step}
                      </div>
                      {step < 4 && <div className={`h-[1px] w-6 sm:w-12 ml-2 sm:ml-4 ${bookingStep > step ? 'bg-[#d4af37]/50' : 'bg-white/10'}`}></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
              {/* Step 1: Services */}
              {bookingStep === 1 && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <h3 className="text-lg text-gray-300 uppercase tracking-widest text-center mb-6">Choisissez le service</h3>
                  <div className="grid gap-4">
                    {SERVICES.map(s => (
                      <div key={s.id} onClick={() => setSelectedService(s)} className={`cursor-pointer border p-4 rounded flex justify-between items-center transition-all ${selectedService?.id === s.id ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-white/10 hover:border-white/30'}`}>
                        <div>
                          <h4 className="font-serif text-xl">{s.name}</h4>
                          <p className="text-sm text-gray-500 mt-1 flex items-center"><Clock className="w-3 h-3 mr-1"/> {s.duration}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[#d4af37] font-semibold text-lg">{s.price}</span>
                          {selectedService?.id === s.id && <CheckCircle className="w-5 h-5 text-[#d4af37] inline ml-4" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Barbers */}
              {bookingStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg text-gray-300 uppercase tracking-widest text-center mb-6">Choisissez le barbier</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {BARBERS.map(b => (
                      <div key={b.id} onClick={() => setSelectedBarber(b)} className={`cursor-pointer border p-6 rounded flex flex-col items-center text-center transition-all ${selectedBarber?.id === b.id ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-white/10 hover:border-white/30'}`}>
                        <img src={b.image} alt={b.name} className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-transparent group-hover:border-[#d4af37]" />
                        <h4 className="font-serif text-xl">{b.name}</h4>
                        <p className="text-xs text-[#d4af37] uppercase tracking-widest mt-1">{b.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {bookingStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg text-gray-300 uppercase tracking-widest text-center mb-6">Date et Créneau</h3>
                  
                  {/* Date Selection */}
                  <div>
                    <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">Jours Disponibles</p>
                    <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar">
                      {getNextDays().map((date, i) => (
                        <div key={i} onClick={() => setSelectedDate(date)} className={`shrink-0 cursor-pointer border rounded-lg p-3 w-20 flex flex-col items-center justify-center transition-all ${selectedDate?.getDate() === date.getDate() ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-white/10 hover:border-white/30'}`}>
                          <span className="text-xs uppercase text-gray-500 mb-1">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                          <span className="text-xl font-serif font-semibold">{date.getDate()}</span>
                          <span className="text-xs text-[#d4af37]">{date.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div className=" animate-in fade-in duration-300">
                      <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">Heures pour {selectedBarber?.name}</p>
                      <div className="grid grid-cols-3 gap-3">
                        {TIME_SLOTS.map(time => (
                          <div key={time} onClick={() => setSelectedTime(time)} className={`cursor-pointer border rounded text-center py-3 transition-all ${selectedTime === time ? 'border-[#d4af37] bg-[#d4af37] text-black font-semibold' : 'border-white/10 hover:border-[#d4af37]/50 text-gray-300'}`}>
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Contact Details */}
              {bookingStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg text-gray-300 uppercase tracking-widest text-center mb-6">Vos Coordonnées</h3>
                  
                  {/* Summary Card */}
                  <div className="bg-black/30 p-4 border border-white/5 rounded-sm flex items-center justify-between mb-6">
                    <div>
                      <p className="font-serif text-lg">{selectedService.name}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                        <User className="w-3 h-3" /> {selectedBarber.name} &bull; 
                        <Calendar className="w-3 h-3" /> {selectedDate?.toLocaleDateString('fr-FR')} à {selectedTime}
                      </p>
                    </div>
                    <span className="text-[#d4af37] font-semibold text-xl">{selectedService.price}</span>
                  </div>

                  <form id="details-form" onSubmit={submitBooking} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Nom Complet</label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0f1012] border border-white/10 text-white p-3 focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="João Silva" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">E-mail</label>
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0f1012] border border-white/10 text-white p-3 focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="joao@example.com" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Téléphone</label>
                        <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0f1012] border border-white/10 text-white p-3 focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="+351 912 345 678" />
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 5: Success */}
              {bookingStep === 5 && (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-50 duration-500">
                  <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-[#d4af37]" />
                  </div>
                  <h3 className="font-serif text-3xl mb-4 italic text-[#d4af37]">Réservation Confirmée !</h3>
                  <p className="text-gray-400 max-w-md">
                    Merci {formData.name}, votre rendez-vous avec {selectedBarber?.name} le {selectedDate?.toLocaleDateString()} à {selectedTime} a bien été enregistré.
                    <br/><br/>Vous allez recevoir un message de confirmation.
                  </p>
                  <button onClick={closeModal} className="mt-8 bg-white/10 px-8 py-3 uppercase text-sm tracking-widest hover:bg-white/20 transition-colors">Retour à l'accueil</button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {bookingStep < 5 && (
              <div className="p-6 border-t border-white/5 bg-black/20 shrink-0 flex justify-between items-center">
                {bookingStep > 1 ? (
                  <button onClick={() => setBookingStep(bookingStep - 1)} className="text-gray-400 hover:text-white uppercase text-xs tracking-widest font-semibold transition-colors">
                    Retour
                  </button>
                ) : <div></div>}
                
                {bookingStep === 1 && (
                  <button onClick={() => setBookingStep(2)} disabled={!selectedService} className="bg-[#d4af37] disabled:opacity-50 text-black px-6 py-3 font-semibold uppercase text-xs tracking-widest flex items-center hover:bg-[#f3d87b] transition-colors">
                    Suivant <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
                {bookingStep === 2 && (
                  <button onClick={() => setBookingStep(3)} disabled={!selectedBarber} className="bg-[#d4af37] disabled:opacity-50 text-black px-6 py-3 font-semibold uppercase text-xs tracking-widest flex items-center hover:bg-[#f3d87b] transition-colors">
                    Suivant <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
                {bookingStep === 3 && (
                  <button onClick={() => setBookingStep(4)} disabled={!selectedDate || !selectedTime} className="bg-[#d4af37] disabled:opacity-50 text-black px-6 py-3 font-semibold uppercase text-xs tracking-widest flex items-center hover:bg-[#f3d87b] transition-colors">
                    Vos Coordonnées <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
                {bookingStep === 4 && (
                  <button type="submit" form="details-form" className="bg-[#d4af37] text-black px-8 py-3 font-bold uppercase text-xs tracking-widest flex items-center hover:bg-[#f3d87b] transition-colors">
                    Confirmer la réservation
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
