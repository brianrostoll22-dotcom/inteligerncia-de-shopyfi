import { toast } from "sonner";
import { WA_DEFAULT_MSG, waLink, WHATSAPP_NUMBER_DISPLAY, NAV_LINKS, scrollToId } from "@/lib/site";
import { Reveal, WaButton } from "@/components/site/Shared";

export default function Footer() {
  const copyNumber = () => {
    navigator.clipboard?.writeText(WHATSAPP_NUMBER_DISPLAY);
    toast.success(`Número copiado: ${WHATSAPP_NUMBER_DISPLAY}`);
  };

  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-24 md:pt-32 pb-10">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-copper mb-6">
            Únete a la familia
          </p>
          <h2 className="font-serif text-5xl md:text-7xl leading-[0.98] max-w-4xl">
            ¿Preparado para conocer a tu <em className="italic text-copper">nuevo mejor amigo</em>?
          </h2>
          <div className="mt-10">
            <WaButton href={waLink(WA_DEFAULT_MSG)} testid="footer-whatsapp-cta" dark={false}>
              Escríbenos por WhatsApp
            </WaButton>
          </div>
        </Reveal>

        <div className="mt-20 md:mt-28 grid md:grid-cols-3 gap-10 border-t border-bone/10 pt-12">
          <div>
            <p className="font-serif text-2xl font-semibold" data-testid="footer-logo">
              Pastor Alemán
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper mt-2">
              Criadero especializado · Vigo
            </p>
            <p className="mt-4 text-sm text-bone/60 leading-relaxed max-w-xs">
              Crianza responsable de la raza Pastor Alemán. Cachorros con pedigrí, carácter y
              salud garantizadas.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">Secciones</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    data-testid={`footer-${l.href.slice(1)}-link`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(l.href);
                    }}
                    className="text-bone/70 hover:text-bone transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">Contacto</p>
            <button
              onClick={copyNumber}
              data-testid="footer-phone-link"
              className="mt-4 block text-bone/70 hover:text-bone transition-colors text-sm underline underline-offset-4 decoration-bone/30"
            >
              WhatsApp: {WHATSAPP_NUMBER_DISPLAY}
            </button>
            <p className="mt-2 text-sm text-bone/70" data-testid="footer-vigo-location">
              Vigo, Pontevedra — España
            </p>
            <p className="mt-2 text-sm text-bone/70">Visitas con cita previa · Lun–Sáb 10:00–19:00</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between gap-4 text-xs text-bone/40">
          <p data-testid="footer-legal-notice">
            © {new Date().getFullYear()} Criadero Especializado en Pastor Alemán · Vigo. Crianza
            conforme a la normativa española de bienestar animal: entrega con microchip y vacunas
            obligatorias.
          </p>
          <p>Entrega en 24–48 h según zona · Consulta tu plazo por WhatsApp</p>
        </div>
      </div>
    </footer>
  );
}
