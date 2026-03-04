import { Info, AlertTriangle, AlertCircle } from "lucide-react";

const variants = {
  success: {
    icon: <Info size={26} color="#16a34a" />,
    iconBg: "bg-green-50 border-green-100",
    confirmBtn: "bg-green-700 hover:bg-green-800",
  },
  danger: {
    icon: <AlertTriangle size={26} color="#dc2626" />,
    iconBg: "bg-red-50 border-red-100",
    confirmBtn: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: <AlertCircle size={26} color="#d97706" />,
    iconBg: "bg-yellow-50 border-yellow-100",
    confirmBtn: "bg-yellow-500 hover:bg-yellow-600",
  },
};

export default function ConfirmationModal({
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "success",
  onConfirm,
  onCancel,
}) {
  const style = variants[variant];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.10)] flex flex-col items-center px-6 py-7 gap-4">
        {/* ICON */}
        <div
          className={`w-14 h-14 flex items-center justify-center border rounded-full ${style.iconBg}`}
        >
          {style.icon}
        </div>

        {/* TEXT */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-base font-semibold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-400 leading-snug">{message}</p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2.5 w-full mt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-150"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 text-sm font-medium text-white rounded-xl transition-colors duration-150 ${style.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
