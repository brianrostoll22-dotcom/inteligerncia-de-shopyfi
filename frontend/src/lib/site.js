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
  { label: "Seguimiento", href: "#seguimiento" },
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
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/f3eeac2a186c8ee1457a4623555a9c36a388c833940e1b03c88e6965f983d646.jpeg",
  },
  {
    id: "kira",
    name: "Kira",
    gender: "Hembra",
    age: "2,5 meses",
    line: "Línea de trabajo",
    coat: "Manto dorsal clásico",
    temper: "Atenta y equilibrada, con unas ganas enormes de aprender.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/a205ac33adc6d4f3d3407f5aa14c68a6ecf502dccd7afb8d1dfde2bd5eaf275d.jpeg",
  },
  {
    id: "ares",
    name: "Ares",
    gender: "Macho",
    age: "2 meses",
    line: "Línea de belleza clásica",
    coat: "Negro y fuego intenso",
    temper: "Tranquilo, cariñoso y de lo más observador.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/1835e5eff5b5a4d38905e60f34b132d5a4249f0a0b08bcc8dbd7f1a1277858a0.jpeg",
  },
  {
    id: "luna",
    name: "Luna",
    gender: "Hembra",
    age: "2 meses",
    line: "Compañía y protección",
    coat: "Manto grisáceo",
    temper: "Dulce y confiada, perfecta para familias con niños.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/c1f1319a8aa2c901258d26164b87c456981bb0c4b9e7b6721e3fa4b065e1b348.jpeg",
  },
  {
    id: "max",
    name: "Max",
    gender: "Macho",
    age: "2,5 meses",
    line: "Línea de trabajo tradicional",
    coat: "Manto oscuro",
    temper: "Enérgico, valiente y siempre en marcha.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/9aef70b55509b2253d6050e79f9d02de841218e66001b7f37ae54097ceb84b75.jpeg",
  },
  {
    id: "roxy",
    name: "Roxy",
    gender: "Hembra",
    age: "2 meses",
    line: "Belleza y compañía",
    coat: "Manto negro y fuego",
    temper: "Traviesa y cariñosa, siempre pendiente de ti.",
    img: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/605fe56055ecb9c28906049cd703b16a9910bacdccf5c5e356cf60a21479e368.jpeg",
  },
];

export const GALLERY_PHOTOS = [
  {
    src: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/5c8604a9a86c392803f85a0d8a3afc0de0803aeb80a9c4c620bb32e05adaa735.jpeg",
    alt: "Primer plano de un cachorro de Pastor Alemán ante la valla de cañas del criadero",
    className: "col-span-2 row-span-2",
  },
  {
    src: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/083dbebf0617e6576fd440f4ebb59118786176e300b0d76df98f3db04e296875.jpeg",
    alt: "Cachorro de Pastor Alemán con collar en el recinto del criadero",
    className: "",
  },
  {
    src: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/739c0de4d48906996867029bc185b031c0dd941b894d8721fcc204ef93c1d832.jpeg",
    alt: "Pastor Alemán adulto en el recinto del criadero",
    className: "row-span-2",
  },
  {
    src: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/e1a912e1837d04912390d2ff86cc4b6af9ab832c91f5b71cc1a48437a2c21769.jpeg",
    alt: "Camada de cachorros jugando en el recinto del criadero",
    className: "",
  },
  {
    src: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/250cb641e6a400f236c5c239e9b5510717f2b5e369e18e2d8e89d1f17c653fda.jpeg",
    alt: "Pastor Alemán adulto en el jardín del criadero",
    className: "col-span-2",
  },
  {
    src: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/cf9acf033356ad5435c742684f13b31ab64b79ff3d00a34d3780ad5dde7f2b88.jpeg",
    alt: "Pastor Alemán adulto junto a la valla de cañas del criadero",
    className: "",
  },
  {
    src: "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/1835e5eff5b5a4d38905e60f34b132d5a4249f0a0b08bcc8dbd7f1a1277858a0.jpeg",
    alt: "Cachorro de Pastor Alemán tumbado en el recinto del criadero",
    className: "",
  },
];

export const LITTER_PHOTO =
  "https://static.prod-images.emergentagent.com/jobs/c2676d7f-6a36-4a36-bb23-99a165b69da8/images/a758a207c82713337577963b5e767b1d8d5a887bf1f9877500255825744a5d53.jpeg";

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
