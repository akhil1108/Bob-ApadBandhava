// Always visible: LIFEBridge must never delay a call to official emergency services.
export function EmergencyBanner() {
  return (
    <div className="bg-emergency px-4 py-2 text-center text-sm font-medium text-white">
      In an emergency, call{" "}
      <a href="tel:112" className="underline underline-offset-2">
        112
      </a>{" "}
      first. LIFEBridge is a prototype and does not replace official emergency services.
    </div>
  );
}
