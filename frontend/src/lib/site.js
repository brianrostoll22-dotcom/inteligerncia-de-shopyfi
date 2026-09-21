// Configuración central del sitio — edita aquí el número de WhatsApp cuando esté disponible.

export const WHATSAPP_NUMBER_DISPLAY = "+34 600 000 000";
export const WHATSAPP_NUMBER_RAW = "34600000000"; // pendiente de número definitivo

export const PRICE = "450 €";
export const LOCATION = "Vigo, Pontevedra — España";

export const waLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(message)}`;

export const WA_DEFAULT_MSG =
  "¡Hola! Estoy interesado en un cachorro de Pastor Alemán (450 €) del criadero de Vigo. ¿Me podéis informar?";

let lenisInstance = null;
export const setLenis = (l) => {
  lenisInstance = l;
};
export const scrollToId = (hash) => {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: -72, duration: 1.3 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const NAV_LINKS = [
  { label: "Cachorros", href: "#cachorros" },
  { label: "Camadas", href: "#camadas" },
  { label: "Entrega", href: "#entrega" },
  { label: "El criadero", href: "#criadero" },
  { label: "FAQ", href: "#faq" },
];

export const PUPPIES = [
  {
    id: "thor",
    name: "Thor",
    gender: "Macho",
    age: "2 meses",
    line: "Línea de belleza",
    coat: "Manto negro y fuego",
    temper: "Sociable, curioso y muy apegado a la familia.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/c77d461f4a7c179276eb44fae54affe0d2ca4ed801cdfa43ecf5d1e02218dbf0.jpeg",
  },
  {
    id: "kira",
    name: "Kira",
    gender: "Hembra",
    age: "2,5 meses",
    line: "Línea de trabajo",
    coat: "Manto dorsal clásico",
    temper: "Atenta y equilibrada, con unas ganas enormes de aprender.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/46c07e1f781db8634afb1fd09ef3f6fa1c572465e0a335a6c6ec9de5d20be684.jpeg",
  },
  {
    id: "ares",
    name: "Ares",
    gender: "Macho",
    age: "2 meses",
    line: "Línea de belleza clásica",
    coat: "Negro y fuego intenso",
    temper: "Tranquilo, cariñoso y de lo más observador.",
    img: "https://images.unsplash.com/photo-1648495333000-32689c4ead62?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "luna",
    name: "Luna",
    gender: "Hembra",
    age: "2 meses",
    line: "Compañía y protección",
    coat: "Manto grisáceo",
    temper: "Dulce y confiada, perfecta para familias con niños.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/5e5f089d64d679b1d3c4161209aa81ef795c4a2395052c31664345e660465e9c.jpeg",
  },
  {
    id: "max",
    name: "Max",
    gender: "Macho",
    age: "2,5 meses",
    line: "Línea de trabajo tradicional",
    coat: "Manto oscuro",
    temper: "Enérgico, valiente y siempre en marcha.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/fc90f53c95eab698d414a53539a20b4640f7aa8b52d68a8797c2f3a2bc170951.jpeg",
  },
  {
    id: "roxy",
    name: "Roxy",
    gender: "Hembra",
    age: "2 meses",
    line: "Belleza y compañía",
    coat: "Manto negro y fuego",
    temper: "Traviesa y cariñosa, siempre pendiente de ti.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/8cb4445f51cbf0d4ea2c2ce56b19937a52c8240ba08099fc238b5b019c93aa49.jpeg",
  },
];

export const GALLERY_PHOTOS = [
  {
    src: "https://images.pexels.com/photos/20600678/pexels-photo-20600678.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Primer plano de un cachorro de Pastor Alemán",
    className: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1655986909840-1dbc7e7fb405?q=80&w=1200&auto=format&fit=crop",
    alt: "Cachorro de Pastor Alemán con collar",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1511816882713-c794694b5a5f?q=80&w=1200&auto=format&fit=crop",
    alt: "Pastor Alemán adulto entre rocas al atardecer",
    className: "row-span-2",
  },
  {
    src: "https://images.pexels.com/photos/34793851/pexels-photo-34793851.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Camada de cachorros jugando en el campo",
    className: "",
  },
  {
    src: "https://images.pexels.com/photos/6556744/pexels-photo-6556744.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Pastor Alemán en un prado",
    className: "col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1781715631824-5a85f440a40b?q=80&w=1200&auto=format&fit=crop",
    alt: "Pastor Alemán adulto al aire libre",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1648495333000-32689c4ead62?q=80&w=1200&auto=format&fit=crop",
    alt: "Cachorro tumbado en la hierba",
    className: "",
  },
];

export const LITTER_PHOTO =
  "https://customer-assets-jt897jd0.emergentagent.net/job_elite-shepherd-dogs/artifacts/aiezckpo_pastores.png";

export const PUPPIES_SOON = {
  name: "Camada próxima",
  img: "https://customer-assets-jt897jd0.emergentagent.net/job_elite-shepherd-dogs/artifacts/85zmvs98_aun%20no%20listos.jpg",
};

export const VIDEOS = [
  {
    src: "https://customer-assets-jt897jd0.emergentagent.net/job_elite-shepherd-dogs/artifacts/q0728iqz_2552333e-30b2-4632-b098-874d482ca830.mov",
    title: "La camada en el día a día",
    caption: "Momentos reales de nuestros cachorros en el criadero.",
  },
  {
    src: "https://customer-assets-jt897jd0.emergentagent.net/job_elite-shepherd-dogs/artifacts/th4gez0p_5f35e268-9460-4cca-850a-d90b150dd3e8.mov",
    title: "Explorando al aire libre",
    caption: "Los cachorros descubren el exterior jugando juntos.",
  },
];

export const FAQS = [
  {
    q: "¿Qué incluye el precio de 450 €?",
    a: "Todo: el cachorro se entrega con microchip homologado, las vacunas obligatorias puestas al día, cartilla veterinaria oficial, desparasitación interna y externa, contrato de cesión y una guía de primeros cuidados. Sin sorpresas ni costes ocultos.",
  },
  {
    q: "¿Puedo venir a ver a los cachorros antes de decidir?",
    a: "Por supuesto. Puedes visitar nuestro centro especializado de Vigo y conocer a los cachorros y a sus padres en persona. Las visitas se hacen con cita previa para no alterar los ritmos de las camadas: escríbenos por WhatsApp y agendamos.",
  },
  {
    q: "¿Cómo funciona el envío a otras provincias?",
    a: "De acuerdo con la legislación española de bienestar animal, el cachorro puede viajar acompañado siempre por un miembro de nuestro equipo, que te explicará personalmente todos los cuidados antes de la entrega. Según tu zona, el plazo es de 24 o 48 horas: consúltanos tu ciudad por WhatsApp y te confirmamos el plazo exacto.",
  },
  {
    q: "¿Qué documentación recibo con el cachorro?",
    a: "Recibes la cartilla veterinaria oficial con las vacunas obligatorias anotadas, el registro del microchip, el contrato de cesión y la guía de inicio con recomendaciones de alimentación y cuidados.",
  },
  {
    q: "¿Cuándo puedo llevarme el cachorro?",
    a: "Los cachorros se entregan a partir de las 8 semanas de vida, cuando ya están preparados sanitariamente: microchip puesto, vacunas obligatorias administradas y desparasitación al día.",
  },
];

export const MARQUEE_ITEMS = [
  "Pastor Alemán de pura raza",
  "Microchip homologado incluido",
  "Vacunas obligatorias al día",
  "Entrega en 24–48 h según zona",
  "Envío acompañado por nuestro equipo",
  "Centro especializado en Vigo",
  "Visítanos con cita previa",
];
