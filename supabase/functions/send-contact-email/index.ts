import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey);

    const formData: ContactFormData = await req.json();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Tüm alanlar zorunludur" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: submission, error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject,
        message,
        status: "new",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Veritabanı hatası" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (resendApiKey) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "AdGusto <noreply@adgusto.app>",
            to: ["destek@adgusto.app"],
            subject: `İletişim Formu: ${subject}`,
            html: `
              <h2>Yeni İletişim Formu Mesajı</h2>
              <p><strong>İsim:</strong> ${name}</p>
              <p><strong>E-posta:</strong> ${email}</p>
              <p><strong>Konu:</strong> ${subject}</p>
              <p><strong>Mesaj:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
              <hr>
              <p><small>Gönderim Zamanı: ${new Date().toLocaleString("tr-TR")}</small></p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.text();
          console.error("Resend API error:", errorData);
        }
      } catch (emailError) {
        console.error("Email sending error:", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY not configured. Email not sent.");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Mesajınız başarıyla gönderildi",
        id: submission.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Bir hata oluştu" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});