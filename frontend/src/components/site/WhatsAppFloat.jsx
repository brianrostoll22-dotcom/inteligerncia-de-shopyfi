import { WA_DEFAULT_MSG, waLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/site/Shared";

export default function WhatsAppFloat() {
  return (
    <a
      href={waLink(WA_DEFAULT_MSG)}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="floating-whatsapp-btn"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-wa/40 animate-ping" />
      <span className="relative flex w-14 h-14 items-center justify-center rounded-full bg-wa text-white shadow-xl shadow-wa/30 transition-transform duration-300 group-hover:scale-110 group-hover:bg-wadark">
        <WhatsAppIcon className="w-7 h-7" />
      </span>
    </a>
  );
}
