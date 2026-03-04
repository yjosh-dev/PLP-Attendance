import { useState } from "react";
import { Ellipsis, Building2, Mail, Phone, Hash, Trash2, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EmployeeCard({ employee = {
  employee_id: null,
  account_email: null,
  first_name: null,
  middle_name: null,
  last_name: null,
  profile_image: null,
  phone_number: null,
  department_name: null,
  position_name: null
}, onDelete, isDeleting = false }) {
  const [flipped, setFlipped] = useState(false);
  const initials = `${employee.first_name?.[0] ?? ""}${employee.last_name?.[0] ?? ""}`;
  const fullName = `${employee.first_name} ${employee.last_name}`;

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="w-50 h-67"
      whileHover={{ y: flipped ? 0 : -4, boxShadow: flipped ? "none" : "0px 12px 28px 0px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: "preserve-3d", position: "relative", width: "100%", height: "100%" }}
      >

        {/* ===== FRONT ===== */}
        <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className="absolute inset-0 bg-white rounded-md overflow-hidden flex flex-col shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]">

          {/* ACCENT */}
          <div className="w-full h-[3%] bg-gradient-to-r from-green-700 to-green-500" />

          {/* STATUS ROW */}
          <div className="w-full h-[13%] flex flex-row justify-between items-center px-2.5">
            <div className="px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-medium">
              ● Active
            </div>
            <motion.button
              whileHover={{ rotate: 90, scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFlipped(true)}
            >
              <Ellipsis size={15} className="cursor-pointer text-gray-300 hover:text-gray-500 transition-colors" />
            </motion.button>
          </div>

          {/* AVATAR + NAME */}
          <div className="w-full h-[45%] flex items-center justify-center flex-col gap-1">
            <motion.div
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.2 }}
              className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm bg-gray-100 flex items-center justify-center shrink-0"
            >
              {employee.profile_image ? (
                <img src={`http://localhost:8000/storage/${employee.profile_image}`} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-gray-400">{initials}</span>
              )}
            </motion.div>
            <div className="flex flex-col items-center">
              <h1 className="font-semibold text-gray-800 text-xs truncate w-40 text-center">{fullName}</h1>
              <h1 className="text-[11px] text-gray-400">{employee.position}</h1>
            </div>
          </div>

          {/* INFO CARD */}
          <div className="mx-2 mb-2 flex-1 bg-gray-50 border border-gray-100 rounded-lg p-2 flex flex-col justify-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <Hash size={10} className="text-gray-300 shrink-0" />
              <span className="text-[10px] text-gray-300 font-mono truncate">{employee.employee_id}</span>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center gap-1.5">
              <Building2 size={10} className="text-gray-300 shrink-0" />
              <span className="text-[10px] text-gray-400 truncate">{employee.department}</span>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center gap-1.5">
              <Mail size={10} className="text-gray-300 shrink-0" />
              <span className="text-[10px] text-gray-400 truncate">{employee.account_email}</span>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center gap-1.5">
              <Phone size={10} className="text-gray-300 shrink-0" />
              <span className="text-[10px] text-gray-400 truncate">{employee.phone_number}</span>
            </div>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 bg-red-600 rounded-md overflow-hidden flex flex-col items-center justify-center gap-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]"
        >
          {/* CLOSE — hidden while deleting */}
          {!isDeleting && (
            <motion.button
              whileHover={{ rotate: 90, scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setFlipped(false)}
              className="absolute top-3 right-3"
            >
              <X size={14} className="text-red-200 hover:text-white transition-colors" />
            </motion.button>
          )}

          {/* TRASH ICON — swaps to spinner when deleting */}
          <motion.div
            animate={flipped ? { scale: [0.8, 1.1, 1], opacity: [0, 1] } : {}}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="w-14 h-14 rounded-full bg-red-500 border-2 border-red-400 flex items-center justify-center"
          >
            {isDeleting
              ? <Loader2 size={22} className="text-white animate-spin" />
              : <Trash2 size={22} className="text-white" />
            }
          </motion.div>

          {/* TEXT */}
          <motion.div
            animate={flipped ? { opacity: [0, 1], y: [6, 0] } : {}}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="flex flex-col items-center gap-0.5 text-center px-4"
          >
            {isDeleting ? (
              <>
                <p className="text-white text-xs font-semibold">Deleting...</p>
                <p className="text-red-200 text-[10px] leading-snug">Please wait a moment.</p>
              </>
            ) : (
              <>
                <p className="text-white text-xs font-semibold">Delete Employee?</p>
                <p className="text-red-200 text-[10px] leading-snug">
                  This will permanently remove {employee.first_name}'s record.
                </p>
              </>
            )}
          </motion.div>

          {/* BUTTONS — hidden while deleting */}
          {!isDeleting && (
            <motion.div
              animate={flipped ? { opacity: [0, 1], y: [6, 0] } : {}}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex gap-2 w-full px-4"
            >
              <button
                onClick={() => setFlipped(false)}
                className="flex-1 py-1.5 text-[10px] font-medium text-red-200 bg-red-500 hover:bg-red-400 rounded-lg transition-colors duration-150"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { onDelete?.(employee.employee_id); }}
                className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-white hover:bg-red-50 rounded-lg transition-colors duration-150"
              >
                Delete
              </motion.button>
            </motion.div>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
}