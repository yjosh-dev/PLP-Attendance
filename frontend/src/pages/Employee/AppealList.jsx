import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  X,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  ImageOff,
} from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function fmtDate(str) {
  if (!str) return "—";
  const [y, m, d] = str.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function fmtDateTime(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_STYLES = {
  WAITING: { badge: "bg-amber-50 border-amber-200 text-amber-700" },
  APPROVED: { badge: "bg-green-50 border-green-200 text-green-700" },
  REJECTED: { badge: "bg-red-50 border-red-200 text-red-500" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? {
    badge: "bg-gray-100 border-gray-200 text-gray-500",
  };
  return (
    <span
      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${s.badge}`}
    >
      {status}
    </span>
  );
}

function ImageLightbox({ src, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
      >
        <X size={22} />
      </button>
      <img
        src={src}
        alt="Proof attachment enlarged"
        className="max-w-full max-h-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function ProcessModal({ appeal, onClose, onApprove, onReject, loading }) {
  const [lightbox, setLightbox] = useState(false);
  if (!appeal) return null;

  const hasValidImage =
    appeal.proof_image &&
    !appeal.proof_image.includes("Temp") &&
    !appeal.proof_image.includes("tmp");

  const imageUrl = hasValidImage
    ? `http://localhost:8000/storage/${appeal.proof_image}`
    : null;

  return (
    <>
      {lightbox && imageUrl && (
        <ImageLightbox src={imageUrl} onClose={() => setLightbox(false)} />
      )}

      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-xl border border-gray-200 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.10)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-[9px] font-black tracking-[0.18em] uppercase text-gray-400">
                Appeal #{appeal.id}
              </p>
              <h2 className="text-sm font-semibold text-gray-800 mt-0.5">
                Process Appeal
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body — two columns */}
          <div className="grid grid-cols-2 gap-0 flex-1 min-h-0">
            {/* Left: Employee + Appeal details */}
            <div className="flex flex-col gap-4 px-6 py-5 border-r border-gray-100 overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black tracking-[0.18em] uppercase text-gray-400">
                  Employee
                </span>
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-3.5 py-2.5 flex flex-col gap-1.5">
                  {[
                    { label: "ID", value: appeal.employee_id },
                    { label: "Email", value: appeal.account?.account_email },
                    {
                      label: "Since",
                      value: fmtDateTime(appeal.account?.account_created_at),
                    },
                  ].map(({ label, value }, i, arr) => (
                    <div key={label}>
                      <div className="flex items-center justify-between py-0.5 gap-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex-shrink-0">
                          {label}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-700 text-right break-all">
                          {value || "—"}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="h-px bg-gray-100" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-black tracking-[0.18em] uppercase text-gray-400">
                  Appeal Details
                </span>
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-3.5 py-2.5 flex flex-col gap-1.5">
                  {[
                    { label: "Date", value: fmtDate(appeal.date_excused) },
                    {
                      label: "Submitted",
                      value: fmtDateTime(appeal.appeal_submitted_at),
                    },
                    {
                      label: "Status",
                      value: <StatusBadge status={appeal.status} />,
                    },
                    { label: "Reason", value: appeal.reason },
                    { label: "Note", value: appeal.note },
                  ].map(({ label, value }, i, arr) => (
                    <div key={label}>
                      <div className="flex items-start justify-between py-0.5 gap-3">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex-shrink-0">
                          {label}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-700 text-right leading-snug">
                          {value || "—"}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="h-px bg-gray-100" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Attachment */}
            <div className="flex flex-col gap-1.5 px-6 py-5">
              <span className="text-[9px] font-black tracking-[0.18em] uppercase text-gray-400">
                Attachment
              </span>

              {imageUrl ? (
                <div className="flex flex-col gap-2 flex-1">
                  <div
                    className="relative group cursor-zoom-in rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-1 min-h-[200px] flex items-center justify-center"
                    onClick={() => setLightbox(true)}
                  >
                    <img
                      src={imageUrl}
                      alt="Proof attachment"
                      className="w-full h-full object-contain max-h-64 transition-transform duration-200 group-hover:scale-[1.02]"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                    {/* Fallback */}
                    <div className="hidden flex-col items-center gap-1.5 p-4">
                      <ImageOff size={20} className="text-gray-300" />
                      <span className="text-[11px] text-gray-400">
                        Failed to load image
                      </span>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                      <span className="text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 px-2.5 py-1 rounded-lg">
                        Click to enlarge
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 truncate">
                    {appeal.proof_image}
                  </span>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-gray-50 border border-gray-100 rounded-lg min-h-[200px]">
                  <ImageOff size={20} className="text-gray-200" />
                  <span className="text-[11px] text-gray-400">
                    No attachment
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100">
            <button
              onClick={onClose}
              disabled={!!loading}
              className="px-5 py-2 text-[11px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150 disabled:opacity-50"
            >
              Close
            </button>
            <button
              onClick={() => onReject(appeal.id)}
              disabled={!!loading}
              className="px-5 py-2 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors duration-150 disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading === "reject" ? (
                <>
                  <Loader2 size={11} className="animate-spin" />
                  Rejecting…
                </>
              ) : (
                <>
                  <XCircle size={11} />
                  Reject
                </>
              )}
            </button>
            <button
              onClick={() => onApprove(appeal.id)}
              disabled={!!loading}
              className="px-5 py-2 text-[11px] font-semibold text-white rounded-lg transition-colors duration-150 disabled:opacity-60 flex items-center gap-1.5 hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#32a852" }}
            >
              {loading === "approve" ? (
                <>
                  <Loader2 size={11} className="animate-spin" />
                  Approving…
                </>
              ) : (
                <>
                  <CheckCircle size={11} />
                  Approve
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AppealList() {
  const [appeals, setAppeals] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAppeals = useCallback(async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:8000/api/appeal");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setAppeals(data);
    } catch {
      setAppeals(mockData);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchAppeals();
  }, [fetchAppeals]);

  const parseResponse = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        `Server error (${res.status}): endpoint may not exist yet`,
      );
    }
  };

  const handleApprove = async (id) => {
    setActionLoading("approve");
    try {
      const appeal = appeals.find((a) => a.id === id);
      const res = await fetch("http://127.0.0.1:8000/api/accept_appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: appeal.employee_id,
          date_excused: appeal.date_excused,
          id: appeal.id,
        }),
      });
      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || "Failed to approve");

      setAppeals((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a)),
      );
      showToast("success", "Appeal approved successfully");
      setSelected(null);
    } catch (err) {
      showToast("error", err.message || "Failed to approve appeal");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading("reject");
    try {
      setAppeals((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" } : a)),
      );
      showToast("success", "Appeal rejected");
      setSelected(null);
    } catch {
      showToast("error", "Failed to reject appeal");
    } finally {
      setActionLoading(null);
    }
  };

  const waiting = appeals.filter((a) => a.status === "WAITING").length;

  return (
    <div className="-ml-1 w-[97%] h-[96%] bg-[#ECECEC] rounded-xl flex flex-col p-3.5 gap-3 overflow-hidden relative">
      {selected && (
        <ProcessModal
          appeal={selected}
          loading={actionLoading}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {toast && (
        <div
          className={`absolute top-3 right-3 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-semibold shadow-lg
          ${toast.type === "success" ? "bg-[#32a852] text-white" : "bg-red-600 text-white"}`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={12} />
          ) : (
            <X size={12} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-md font-bold text-gray-700 leading-none">
            Employee Appeals
          </h1>
          <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
            Review and process submitted appeals
          </p>
        </div>
        <div className="flex items-center gap-2">
          {waiting > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-[11px] font-semibold text-amber-700">
                {waiting} pending
              </span>
            </div>
          )}
          <button
            onClick={fetchAppeals}
            disabled={fetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-semibold text-gray-500 hover:border-gray-300 transition-all duration-150 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={11} className={fetching ? "animate-spin" : ""} />
            {fetching ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0">
        <div
          className="grid border-b border-gray-100 flex-shrink-0"
          style={{ gridTemplateColumns: "44px 1fr 120px 1fr 160px 90px 76px" }}
        >
          {[
            "#",
            "Employee",
            "Date Excused",
            "Reason",
            "Submitted At",
            "Status",
            "Action",
          ].map((col) => (
            <div
              key={col}
              className="py-2.5 px-3 text-[9px] font-black tracking-[0.18em] uppercase text-gray-400 bg-gray-50"
            >
              {col}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {fetching ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-300">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-[11px]">Loading appeals…</span>
            </div>
          ) : appeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <FileText size={20} className="text-gray-200" />
              <p className="text-[11px] text-gray-300">No appeals found</p>
            </div>
          ) : (
            appeals.map((appeal, i) => (
              <div
                key={appeal.id}
                className={`grid border-b border-gray-50 hover:bg-gray-50/70 transition-colors duration-100 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}
                style={{
                  gridTemplateColumns: "44px 1fr 120px 1fr 160px 90px 76px",
                }}
              >
                <div className="px-3 py-3 flex items-center">
                  <span className="text-[10px] text-gray-400">
                    #{appeal.id}
                  </span>
                </div>
                <div className="px-3 py-3 flex flex-col justify-center min-w-0">
                  <span className="text-[11px] font-semibold text-gray-700 truncate">
                    {appeal.employee_id}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate">
                    {appeal.account?.account_email}
                  </span>
                </div>
                <div className="px-3 py-3 flex items-center">
                  <span className="text-[11px] text-gray-600">
                    {fmtDate(appeal.date_excused)}
                  </span>
                </div>
                <div className="px-3 py-3 flex items-center min-w-0">
                  <span className="text-[11px] text-gray-600 truncate">
                    {appeal.reason}
                  </span>
                </div>
                <div className="px-3 py-3 flex items-center">
                  <span className="text-[10px] text-gray-400">
                    {fmtDateTime(appeal.appeal_submitted_at)}
                  </span>
                </div>
                <div className="px-3 py-3 flex items-center">
                  <StatusBadge status={appeal.status} />
                </div>
                <div className="px-3 py-3 flex items-center">
                  <button
                    onClick={() => setSelected(appeal)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-all duration-150 active:scale-95"
                  >
                    Process
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!fetching && appeals.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-50 flex-shrink-0">
            <span className="text-[10px] text-gray-400">
              {appeals.length} record{appeals.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
