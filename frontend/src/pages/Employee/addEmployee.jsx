import { useState, useRef, useContext } from "react";
import { NavbarContext } from "../../context/navbarProvider";

const departments = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Operations",
  "Sales",
  "Legal",
  "Design",
];
const positions = [
  "Junior Developer",
  "Senior Developer",
  "Team Lead",
  "Manager",
  "Director",
  "Analyst",
  "Coordinator",
  "Specialist",
];

// Generate random password function
const generateRandomPassword = () => {
  const length = 12;
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghijkmnpqrstuvwxyz";
  const numbers = "23456789";
  const special = "!@#$%&*";
  
  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  const allChars = uppercase + lowercase + numbers + special;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Philippine phone number validation
const validatePhilippinePhone = (phone) => {
  // Remove common formatting characters
  const clean = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Philippine number patterns:
  // 09XXXXXXXXX (11 digits starting with 09)
  // 639XXXXXXXXX (12 digits starting with 639)
  // +639XXXXXXXXX (13 digits starting with +639)
  // 9XXXXXXXXX (10 digits starting with 9)
  const patterns = [
    /^09\d{9}$/,           // 09123456789
    /^639\d{9}$/,          // 639123456789
    /^\+639\d{9}$/,        // +639123456789
    /^9\d{9}$/             // 9123456789
  ];
  
  return patterns.some(pattern => pattern.test(clean));
};

// Format Philippine phone number for display
const formatPhilippinePhone = (phone) => {
  const clean = phone.replace(/[\s\-\(\)\+]/g, '');
  if (clean.length === 11 && clean.startsWith('09')) {
    return `${clean.slice(0,4)} ${clean.slice(4,7)} ${clean.slice(7)}`;
  }
  return phone;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  icon,
  half,
  error,
  onBlur
}) {
  return (
    <div
      className={`flex flex-col gap-1 ${half ? "flex-1 min-w-0" : "w-full"}`}
    >
      <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-400 pl-0.5">
        {label}
        {required && <span className="text-[#32a852] ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white border rounded-lg text-[12px] text-gray-700 placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-[#32a852]/25 focus:border-[#32a852]
            transition-all duration-150 py-2 ${icon ? "pl-9 pr-3" : "px-3"}
            hover:border-gray-300 ${error ? "border-red-400 focus:ring-red-200" : "border-gray-200"}`}
        />
      </div>
      {error && (
        <p className="text-[9px] text-red-500 pl-0.5 mt-0.5">{error}</p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  value,
  onChange,
  required,
  icon,
}) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <label className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-400 pl-0.5">
        {label}
        {required && <span className="text-[#32a852] ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
            {icon}
          </span>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full bg-white border border-gray-200 rounded-lg text-[12px] text-gray-600
            focus:outline-none focus:ring-2 focus:ring-[#32a852]/25 focus:border-[#32a852]
            transition-all duration-150 py-2 appearance-none cursor-pointer pr-7
            hover:border-gray-300 ${icon ? "pl-9" : "pl-3"}`}
        >
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

const Row = ({ children, gap = "gap-3" }) => (
  <div className={`flex ${gap}`}>{children}</div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
    <div className="flex items-center gap-2.5 mb-0.5">
      <span className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
        {title}
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(90deg,#e5e7eb,transparent)" }}
      />
    </div>
    {children}
  </div>
);

const IconBadge = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IconMail = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconLock = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconCal = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconBuilding = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconUser = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconPhone = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconPin = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Success Modal
function SuccessModal({ employee, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.10)] flex flex-col items-center px-6 py-7 gap-4">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center border rounded-full bg-green-50 border-green-100">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-base font-semibold text-gray-800">
            Employee Registered!
          </h1>
          <p className="text-sm text-gray-400 leading-snug">
            {employee.name} has been successfully added to the system.
          </p>
        </div>

        {/* Summary pill */}
        <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-gray-700 truncate">
              {employee.name}
            </p>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">
              {employee.position} · {employee.department}
            </p>
          </div>
          <span className="text-[10px] font-mono bg-white border border-gray-200 text-gray-400 rounded-lg px-2 py-1 flex-shrink-0">
            {employee.id}
          </span>
        </div>

        {/* Button */}
        <div className="flex w-full mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-xl transition-colors duration-150"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AddEmployee() {
  const fileRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [navbar, setNavbar] = useContext(NavbarContext);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [successData, setSuccessData] = useState(null);
  
  // Validation errors state
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    employee_id: "",
    account_email: "",
    account_password: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    department: "",
    position: "",
    birthdate: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-sync emails if they are the same field being edited
    if (name === "account_email") {
      setForm((p) => ({ ...p, [name]: value }));
    } else if (name === "email") {
      setForm((p) => ({ ...p, [name]: value }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  // Validate email domain (@plpasig.edu.ph)
  const validateEmailDomain = (email) => {
    if (!email) return false;
    return email.toLowerCase().endsWith("@plpasig.edu.ph");
  };

  // Validate field on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === "account_email" || name === "email") {
      if (value && !validateEmailDomain(value)) {
        setErrors((p) => ({ 
          ...p, 
          [name]: "Email must use @plpasig.edu.ph domain" 
        }));
      } else {
        setErrors((p) => ({ ...p, [name]: "" }));
      }
    }
    
    if (name === "phone") {
      if (value && !validatePhilippinePhone(value)) {
        setErrors((p) => ({ 
          ...p, 
          phone: "Enter a valid Philippine number (e.g., 09123456789 or +639123456789)" 
        }));
      } else {
        setErrors((p) => ({ ...p, phone: "" }));
      }
    }
  };

  // Generate random password
  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword();
    setForm((p) => ({ ...p, account_password: newPassword }));
    // Clear password error if exists
    if (errors.account_password) {
      setErrors((p) => ({ ...p, account_password: "" }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    const required = [
      "employee_id",
      "account_email",
      "account_password",
      "first_name",
      "last_name",
      "department",
      "position",
      "birthdate",
      "email",
      "phone",
      "address",
    ];
    
    const missing = required.filter((f) => !form[f]);
    if (missing.length) {
      showToast("error", "Please fill in all required fields");
      return;
    }
    
    // Validate email domains
    if (!validateEmailDomain(form.account_email)) {
      setErrors((p) => ({ 
        ...p, 
        account_email: "Account email must use @plpasig.edu.ph domain" 
      }));
      showToast("error", "Account email must be a @plpasig.edu.ph address");
      return;
    }
    
    if (!validateEmailDomain(form.email)) {
      setErrors((p) => ({ 
        ...p, 
        email: "Personal email must use @plpasig.edu.ph domain" 
      }));
      showToast("error", "Personal email must be a @plpasig.edu.ph address");
      return;
    }
    
    // Validate Philippine phone number
    if (!validatePhilippinePhone(form.phone)) {
      setErrors((p) => ({ 
        ...p, 
        phone: "Enter a valid Philippine number" 
      }));
      showToast("error", "Please enter a valid Philippine phone number");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      if (imageFile) fd.append("profile_image", imageFile);

      const res = await fetch("http://localhost:8000/api/register_employee", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Show success modal
      setSuccessData({
        name: [form.first_name, form.middle_name, form.last_name]
          .filter(Boolean)
          .join(" "),
        position: form.position,
        department: form.department,
        id: form.employee_id,
      });

      setForm({
        employee_id: "",
        account_email: "",
        account_password: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        department: "",
        position: "",
        birthdate: "",
        email: "",
        phone: "",
        address: "",
      });
      setPreview(null);
      setImageFile(null);
      setErrors({});
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const filled = [
    "employee_id",
    "account_email",
    "account_password",
    "first_name",
    "last_name",
    "department",
    "position",
    "birthdate",
    "email",
    "phone",
    "address",
  ].filter((f) => form[f]).length;
  const pct = Math.round((filled / 11) * 100);

  return (
    <div className="-ml-1 w-[97%] h-[96%] bg-[#ECECEC] rounded-xl flex flex-col p-3.5 gap-3 overflow-hidden relative">
      {/* Success Modal */}
      {successData && (
        <SuccessModal
          employee={successData}
          onClose={() => setSuccessData(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`absolute top-3 right-3 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[11px] font-semibold shadow-xl
          ${toast.type === "success" ? "bg-[#32a852] text-white" : "bg-red-500 text-white"}`}
          style={{ maxWidth: 300 }}
        >
          {toast.type === "success" ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-md font-bold text-gray-700 leading-none">
              Register Employee
            </h1>
            <p className="text-[10px] text-gray-400 mt-1 leading-none">
              Fill in all required fields to add a new member
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Progress pill */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5">
            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: "#32a852" }}
              />
            </div>
            <span
              className="text-[10px] font-bold"
              style={{ color: pct === 100 ? "#32a852" : "#9ca3af" }}
            >
              {pct}%
            </span>
          </div>

          {/* Return button */}
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-all duration-150 active:scale-95"
            onClick={() => setNavbar("Manage")}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Return
          </button>

          {/* Save button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-60 text-white"
            style={{
              background: loading ? "#9ca3af" : "#32a852",
              boxShadow: loading ? "none" : "0 3px 12px #32a85238",
            }}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Record
              </>
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-3 flex-1 min-h-0">
        {/* LEFT column */}
        <div className="flex flex-col gap-3 w-[230px] flex-shrink-0 overflow-y-auto">
          {/* Photo Upload */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 self-stretch">
              <span className="text-[10px] font-black tracking-[0.18em] uppercase text-gray-400">
                Profile Photo
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background: "linear-gradient(90deg,#e5e7eb,transparent)",
                }}
              />
            </div>

            <div
              onClick={() => fileRef.current.click()}
              className="w-full cursor-pointer group relative rounded-xl border-2 border-dashed border-gray-200 hover:border-[#32a852]/60 transition-all duration-200 overflow-hidden bg-gray-50 hover:bg-[#32a852]/4"
              style={{ height: 140 }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center group-hover:border-[#32a852]/30 transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c0c0c0"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-medium">
                      Click to upload
                    </p>
                    <p className="text-[9px] text-gray-300 mt-0.5">
                      JPG, PNG · max 2MB
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/12 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full p-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              className="hidden"
              onChange={handleImage}
            />

            {preview && (
              <button
                onClick={() => {
                  setPreview(null);
                  setImageFile(null);
                }}
                className="text-[10px] text-red-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Remove photo
              </button>
            )}
          </div>

          {/* Account */}
          <Section title="Account">
            <Field
              label="Employee ID"
              name="employee_id"
              placeholder="EMP-0001"
              required
              value={form.employee_id}
              onChange={handleChange}
              icon={<IconBadge />}
            />
            <Field
              label="Account Email"
              name="account_email"
              type="email"
              placeholder="work@plpasig.edu.ph"
              required
              value={form.account_email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.account_email}
              icon={<IconMail />}
            />
            <div className="relative">
              <Field
                label="Password"
                name="account_password"
                type="password"
                placeholder="Min. 8 characters"
                required
                value={form.account_password}
                onChange={handleChange}
                error={errors.account_password}
                icon={<IconLock />}
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="absolute right-1 top-7 px-2 py-1 text-[9px] font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded transition-colors"
                style={{ marginTop: "1px" }}
              >
                Generate
              </button>
            </div>
          </Section>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col gap-3 flex-1 min-w-0 overflow-y-auto">
          {/* Personal */}
          <Section title="Personal Information">
            <Row>
              <Field
                label="First Name"
                name="first_name"
                placeholder="Juan"
                required
                half
                value={form.first_name}
                onChange={handleChange}
              />
              <Field
                label="Middle Name"
                name="middle_name"
                placeholder="Santos"
                half
                value={form.middle_name}
                onChange={handleChange}
              />
              <Field
                label="Last Name"
                name="last_name"
                placeholder="Dela Cruz"
                required
                half
                value={form.last_name}
                onChange={handleChange}
              />
            </Row>
            <Field
              label="Birthdate"
              name="birthdate"
              type="date"
              required
              value={form.birthdate}
              onChange={handleChange}
              icon={<IconCal />}
            />
          </Section>

          {/* Role */}
          <Section title="Role & Department">
            <Row>
              <SelectField
                label="Department"
                name="department"
                options={departments}
                required
                value={form.department}
                onChange={handleChange}
                icon={<IconBuilding />}
              />
              <SelectField
                label="Position"
                name="position"
                options={positions}
                required
                value={form.position}
                onChange={handleChange}
                icon={<IconUser />}
              />
            </Row>
          </Section>

          {/* Contact */}
          <Section title="Contact">
            <Row>
              <Field
                label="Personal Email"
                name="email"
                type="email"
                placeholder="personal@plpasig.edu.ph"
                required
                half
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                icon={<IconMail />}
              />
              <Field
                label="Phone Number"
                name="phone"
                placeholder="09123456789"
                required
                half
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                icon={<IconPhone />}
              />
            </Row>
            <Field
              label="Address"
              name="address"
              placeholder="Street, City, Province"
              required
              value={form.address}
              onChange={handleChange}
              icon={<IconPin />}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}