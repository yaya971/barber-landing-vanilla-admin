"use server";

import { supabase } from "./supabase";

// Helper to check if Supabase is actually configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.length > 0 && !url.includes("mock-supabase-url");
};

// ==========================================
// CLIENT ACTIONS (Public)
// ==========================================

export async function getPublicData() {
  if (!isSupabaseConfigured()) {
    return {
      barbers: [
        { id: "1", name: "Tiago Silva", role: "Master Barber", avatar_url: "https://i.pravatar.cc/150?u=tiago" },
        { id: "2", name: "João Santos", role: "Senior Barber", avatar_url: "https://i.pravatar.cc/150?u=joao" },
      ],
      services: [
        { id: "1", name: "Coupe Executive", price: 35, duration_minutes: 30, description: "Coupe sur-mesure, lavage et finition premium." },
        { id: "2", name: "Rasage Serviette Chaude", price: 30, duration_minutes: 30, description: "Rasage classique à l'ancienne." },
        { id: "3", name: "Sculpture de Barbe", price: 25, duration_minutes: 20, description: "Taille experte et huile nourrissante." },
        { id: "4", name: "L'Expérience Lisboeta", price: 60, duration_minutes: 60, description: "Le package complet: Coupe + Rasage.", is_signature: true },
      ],
      reviews: [
        { id: "1", client_name: "Alexandre Dupont", rating: 5, comment: "L'expérience Lisboeta est incroyable. Tiago a des mains en or !" },
        { id: "2", client_name: "Mathieu Ferreira", rating: 5, comment: "Meilleur salon de la ville, prestation haut de gamme." }
      ]
    };
  }

  const [barbersRes, servicesRes, reviewsRes] = await Promise.all([
    supabase.from("barbers").select("*"),
    supabase.from("services").select("*"),
    supabase.from("reviews").select("*").eq("is_published", true)
  ]);

  return {
    barbers: barbersRes.data || [],
    services: servicesRes.data || [],
    reviews: reviewsRes.data || []
  };
}

export async function bookAppointment(data: any) {
  if (!isSupabaseConfigured()) {
    console.log("Mock Booking saved:", data);
    return { success: true, message: "Réservation simulée réussie." };
  }

  // 1. Gérer le Client (CRM)
  let clientId = null;
  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("email", data.email)
    .single();

  if (existingClient) {
    clientId = existingClient.id;
  } else {
    const { data: newClient } = await supabase
      .from("clients")
      .insert({
        full_name: data.name,
        email: data.email,
        phone: data.phone,
      })
      .select("id")
      .single();
    if (newClient) clientId = newClient.id;
  }

  // 2. Insérer le rendez-vous
  const { error } = await supabase.from("appointments").insert({
    barber_id: data.barberId,
    service_id: data.serviceId,
    client_id: clientId,
    client_name: data.name,
    client_email: data.email,
    client_phone: data.phone,
    start_time: data.startTime,
    end_time: data.endTime,
    status: "confirmed"
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // TODO: Trigger Email via Resend Here.
  
  return { success: true };
}

// ==========================================
// ADMIN ACTIONS (Protected)
// ==========================================

export async function getAdminData() {
  if (!isSupabaseConfigured()) {
    return {
      appointments: [],
      clients: [],
      services: []
    }
  }

  const [appRes, clientsRes, srvRes] = await Promise.all([
    supabase.from("appointments").select("*, barbers(name), services(name)").order('start_time', { ascending: false }),
    supabase.from("clients").select("*").order('last_visit', { ascending: false }),
    supabase.from("services").select("*")
  ]);

  return {
    appointments: appRes.data || [],
    clients: clientsRes.data || [],
    services: srvRes.data || []
  };
}

export async function cancelAppointment(id: string) {
  if (!isSupabaseConfigured()) return { success: true };
  const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
  return { success: !error };
}

export async function updateServicePrice(id: string, price: number) {
  if (!isSupabaseConfigured()) return { success: true };
  const { error } = await supabase.from("services").update({ price }).eq("id", id);
  return { success: !error };
}
