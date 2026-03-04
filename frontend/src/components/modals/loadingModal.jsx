export default function LoadingModal({ isOpen, message = "Loading..." }) {
  if (!isOpen) return null;

  return (
    <div className="w-screen h-screen absolute inset-0 bg-green-800 z-50 flex flex-col items-center justify-center gap-6">
      {/* LOGO */}
      <div className="rounded-full w-36 h-36 bg-white shadow-2xl flex items-center justify-center animate-pulse">
        <img src={plplogo} className="w-28 h-28 object-contain" />
      </div>

      {/* MESSAGE */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-white text-xl font-bold inter tracking-wide">
          Pamantasan ng Lungsod ng Pasig
        </h1>
        <p className="text-green-300 text-sm inter">{message}</p>
      </div>

      {/* SPINNER */}
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}