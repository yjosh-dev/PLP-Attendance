const BASE_URL = "http://localhost:8000/storage/";

// ── Palette ──────────────────────────────────────────────
// Green  : #2d6a4f  (dark)  / #52b788  (mid)  / #d8f3dc  (light)
// Gray   : #4a4e69  (dark)  / #9a9bb4  (mid)  / #f0f0f5  (light)
// Yellow : #e9c46a  (rich)  / #f4d58d  (soft)  / #fffbea  (pale)

function QRPlaceholder() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect width="56" height="56" rx="6" fill="#fffbea" />
      {/* top-left */}
      <rect x="4" y="4" width="18" height="18" rx="3" fill="#2d6a4f"/>
      <rect x="7" y="7" width="12" height="12" rx="1.5" fill="#fffbea"/>
      <rect x="9.5" y="9.5" width="7" height="7" rx="1" fill="#2d6a4f"/>
      {/* top-right */}
      <rect x="34" y="4" width="18" height="18" rx="3" fill="#2d6a4f"/>
      <rect x="37" y="7" width="12" height="12" rx="1.5" fill="#fffbea"/>
      <rect x="39.5" y="9.5" width="7" height="7" rx="1" fill="#2d6a4f"/>
      {/* bottom-left */}
      <rect x="4" y="34" width="18" height="18" rx="3" fill="#2d6a4f"/>
      <rect x="7" y="37" width="12" height="12" rx="1.5" fill="#fffbea"/>
      <rect x="9.5" y="39.5" width="7" height="7" rx="1" fill="#2d6a4f"/>
      {/* data */}
      <rect x="34" y="34" width="5" height="5" rx="1" fill="#e9c46a"/>
      <rect x="41" y="34" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="47" y="34" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="34" y="41" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="47" y="41" width="5" height="5" rx="1" fill="#e9c46a"/>
      <rect x="41" y="47" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="47" y="47" width="5" height="5" rx="1" fill="#2d6a4f"/>
      <rect x="34" y="47" width="5" height="5" rx="1" fill="#e9c46a"/>
    </svg>
  );
}

function InfoCell({ label, value }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <span style={{
        fontSize: 7.5,
        fontFamily: "'Trebuchet MS', sans-serif",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#9a9bb4",
        fontWeight: 700,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 10.5,
        fontFamily: "'Georgia', serif",
        color: "#3a3d55",
        fontWeight: 600,
        lineHeight: 1.3,
      }}>
        {value || "—"}
      </span>
    </div>
  );
}

/**
 * EmployeeIDCard
 *
 * Props (from API response):
 *   employee_id    – number | string
 *   account_email  – string
 *   first_name     – string
 *   middle_name    – string
 *   last_name      – string
 *   profile_image  – string  (storage path)
 *   department     – string
 *   position       – string
 *   phone_number   – string
 *   org_name       – string  (optional)
 *   org_tagline    – string  (optional)
 */
export default function EmployeeIDCard({
  employee_id   = "",
  account_email = "",
  first_name    = "",
  middle_name   = "",
  last_name     = "",
  profile_image = null,
  department    = "",
  position      = "",
  phone_number  = "",
  org_name      = "PAMANTASAN NG LUNGSOD NG PASIG",
  org_tagline   = "Umaagos ang Pag-asa.",
}) {
  const fullName  = [first_name, last_name].filter(Boolean).join(" ");
  const initials  = [first_name?.[0], last_name?.[0]].filter(Boolean).join("").toUpperCase();
  const avatarSrc = profile_image ? `${BASE_URL}${profile_image}` : null;
  const empId     = String(employee_id);

  return (
    <div className="relative select-none" style={{ width: 360, height: 220 }}>

      {/* ── Card shell ── */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 12px 48px rgba(45,106,79,0.18), 0 2px 8px rgba(0,0,0,0.08)" }}>

        {/* White base */}
        <div className="absolute inset-0 bg-white" />

        {/* ── LEFT green sidebar ── */}
        <div className="absolute top-0 left-0 bottom-0 w-[90px]"
          style={{ background: "linear-gradient(160deg, #2d6a4f 0%, #40916c 60%, #52b788 100%)" }}>

          {/* Diagonal yellow accent slash */}
          <div className="absolute inset-0 overflow-hidden">
            <div style={{
              position: "absolute",
              bottom: -20, left: -30,
              width: 130, height: 60,
              background: "#e9c46a",
              transform: "rotate(-15deg)",
              opacity: 0.22,
            }} />
            <div style={{
              position: "absolute",
              top: -10, right: -20,
              width: 80, height: 40,
              background: "#f4d58d",
              transform: "rotate(-15deg)",
              opacity: 0.15,
            }} />
          </div>

          {/* Org acronym / monogram */}
          <div className="absolute top-4 left-0 right-0 flex flex-col items-center">
            <span style={{
              fontFamily: "'Georgia', serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}>
              {org_name.slice(0, 2).toUpperCase()}
            </span>
            <div style={{ width: 24, height: 2, background: "#e9c46a", borderRadius: 2, marginTop: 4 }} />
          </div>

          {/* Avatar */}
          <div style={{
            position: "absolute",
            top: 60, left: "50%",
            transform: "translateX(-50%)",
            width: 68, height: 68,
            borderRadius: 14,
            overflow: "hidden",
            border: "3px solid #fff",
            boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
          }}>
            {avatarSrc ? (
              <img src={avatarSrc} alt={fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(135deg, #e9c46a, #f4d58d)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700, color: "#2d6a4f" }}>
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Employee ID pill at bottom of sidebar */}
          <div style={{
            position: "absolute",
            bottom: 12, left: 6, right: 6,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 8,
            padding: "4px 6px",
            textAlign: "center",
          }}>
            <span style={{
              fontFamily: "'Trebuchet MS', sans-serif",
              fontSize: 7,
              letterSpacing: "0.12em",
              color: "#d8f3dc",
              textTransform: "uppercase",
            }}>ID No.</span>
            <p style={{
              fontFamily: "'Georgia', serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.08em",
              marginTop: 1,
            }}>
              {empId.replace(/(\d{4})(?=\d)/g, "$1 ")}
            </p>
          </div>
        </div>

        {/* ── RIGHT content area ── */}
        <div className="absolute top-0 right-0 bottom-0" style={{ left: 90 }}>

          {/* Top yellow header strip */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 46,
            background: "linear-gradient(90deg, #e9c46a 0%, #f4d58d 60%, #fffbea 100%)",
          }}>
            {/* Dot pattern overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(45,106,79,0.15) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
            }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: "8px 14px 0" }}>
              <p style={{
                fontFamily: "'Georgia', serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#2d6a4f",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}>
                {org_name}
              </p>
              <p style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: 7.5,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#40916c",
                marginTop: 1,
              }}>
                {org_tagline}
              </p>
            </div>
          </div>

          {/* Green line separator */}
          <div style={{ position: "absolute", top: 46, left: 0, right: 0, height: 2, background: "#2d6a4f" }} />

          {/* Name block */}
          <div style={{ position: "absolute", top: 56, left: 14, right: 70 }}>
            <p style={{
              fontFamily: "'Georgia', serif",
              fontSize: 17,
              fontWeight: 700,
              color: "#2d3748",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}>
              {fullName}
            </p>
            {middle_name && (
              <p style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: 8,
                color: "#9a9bb4",
                letterSpacing: "0.08em",
                marginTop: 2,
              }}>
                {middle_name}
              </p>
            )}
            {/* Position badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              marginTop: 5,
              background: "#d8f3dc",
              border: "1px solid #52b788",
              borderRadius: 20,
              padding: "2px 8px",
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2d6a4f" }} />
              <span style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: 8.5,
                fontWeight: 700,
                color: "#2d6a4f",
                letterSpacing: "0.06em",
              }}>
                {position}
              </span>
            </div>
            <p style={{
              fontFamily: "'Trebuchet MS', sans-serif",
              fontSize: 8,
              color: "#9a9bb4",
              letterSpacing: "0.05em",
              marginTop: 3,
            }}>
              {department}
            </p>
          </div>

          {/* QR top-right */}
          <div style={{ position: "absolute", top: 54, right: 10 }}>
            <QRPlaceholder />
          </div>

          {/* Gray divider */}
          <div style={{
            position: "absolute", bottom: 54, left: 14, right: 14,
            height: 1,
            background: "linear-gradient(90deg, #e9c46a, #d8f3dc, #f0f0f5)",
          }} />

          {/* Info row */}
          <div style={{
            position: "absolute", bottom: 12, left: 14, right: 14,
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 8px",
          }}>
            <InfoCell label="Phone"  value={phone_number} />
            <InfoCell label="Email"  value={account_email.length > 18 ? account_email.slice(0, 16) + "…" : account_email} />
            <InfoCell label="Dept."  value={department} />
          </div>
        </div>

      </div>
    </div>
  );
}