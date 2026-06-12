export function MaintenanceBanner() {
  return (
    <div className="bg-yellow-950/60 border-yellow-700/50 rounded-lg px-4 py-3 flex items-start gap-3">
      <span className="text-lg leading-none mt-0.5">👨‍🔧</span>
      <div>
        <p className="font-semibold text-yellow-400 text-sm">Pi is under maintenance</p>
        <p className="text-yellow-500/80 text-xs mt-0.5 leading-relaxed">
          The UI is fully available. Database provisioning will return shortly.
        </p>
      </div>
    </div>
  );
}