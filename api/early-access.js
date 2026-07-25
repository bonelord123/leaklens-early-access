import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }


  const { website } = req.body;


  if (!website) {
    return res.status(400).json({
      error: "Add meg a webshop URL címét."
    });
  }


  const { data: existing } = await supabase
    .from("early_access_leads")
    .select("id")
    .eq("website", website)
    .maybeSingle();


  if (existing) {
    return res.status(400).json({
      error: "Ez a webshop már jelentkezett az Early Access programba."
    });
  }


  const { data, error } = await supabase
    .from("early_access_leads")
    .insert({
      website,
      status: "new"
    })
    .select()
    .single();


  if (error) {

    console.error(error);

    return res.status(500).json({
      error: "Nem sikerült menteni a jelentkezést."
    });

  }


  return res.status(200).json({
    success: true,
    lead: data
  });

}