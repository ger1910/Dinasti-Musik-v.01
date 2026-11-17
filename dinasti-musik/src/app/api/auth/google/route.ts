import { NextResponse } from "next/server";
import { loginWithGoogle } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

interface GoogleTokenInfo {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  error_description?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let email = body.email;
    let name = body.name;
    let image = body.image || "";

    // 1. Handle Authorization Code flow (code exchange)
    if (body.code) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://websiteofdinastimusikk.vercel.app";
      const redirectUri = `${siteUrl.replace(/\/$/, "")}/auth/callback`;

      const params = new URLSearchParams({
        client_id: clientId || "",
        client_secret: clientSecret || "",
        code: body.code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      });

      try {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
        if (tokenRes.ok) {
          const tokenInfo = await tokenRes.json();
          if (tokenInfo.id_token) {
            const verifyRes = await fetch(
              `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenInfo.id_token)}`
            );
            if (verifyRes.ok) {
              const info = await verifyRes.json();
              email = info.email;
              name = info.name || email.split("@")[0];
              image = info.picture || "";
            }
          } else if (tokenInfo.access_token) {
            const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${tokenInfo.access_token}` },
            });
            if (userinfoRes.ok) {
              const info = await userinfoRes.json();
              email = info.email;
              name = info.name || email.split("@")[0];
              image = info.picture || "";
            }
          }
        } else {
          console.warn("[auth/google] Code exchange failed");
        }
      } catch (e) {
        console.error("[auth/google] Error during code exchange", e);
      }
    }

    // 2. Existing credential (id_token) handling
    if (body.credential) {
      try {
        const verifyRes = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(body.credential)}`
        );
        if (verifyRes.ok) {
          const tokenInfo: GoogleTokenInfo = await verifyRes.json();
          if (tokenInfo.email) {
            email = tokenInfo.email;
            name = tokenInfo.name || email.split("@")[0];
            image = tokenInfo.picture || image;
          }
        } else {
          console.warn("[auth/google] Token verification failed, falling back to body data if provided");
        }
      } catch (tokenErr) {
        console.error("[auth/google] Gagal memverifikasi token Google:", tokenErr);
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email Google diperlukan untuk melanjutkan login." },
        { status: 400 }
      );
    }

    const user = await loginWithGoogle({
      email,
      name: name || email.split("@")[0],
      image,
    });

    logAudit({
      userId: user.id,
      userName: user.name,
      action: "LOGIN_SUCCESS",
      entity: "AUTH",
      entityId: user.id,
      metadata: { provider: "google", emailVerified: Boolean(body.credential) },
    });

    return NextResponse.json({
      message: "Berhasil masuk dengan akun Google.",
      user,
    });
  } catch (error) {
    console.error("[auth/google]", error);
    return NextResponse.json(
      { error: "Gagal menghubungkan ke akun Google." },
      { status: 500 }
    );
  }
}
