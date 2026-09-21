import { GALLERY_PHOTOS, VIDEOS } from "@/lib/site";
import { SectionHead, Reveal } from "@/components/site/Shared";
import { Camera, Play } from "lucide-react";

export default function Gallery() {
  return (
    <section id="camadas" className="py-24 md:py-32 bg-sand scroll-mt-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="03"
          eyebrow="Camadas"
          title={
            <>
              La camada,
              <br />
              <em className="italic text-copper">día a día</em>
            </>
          }
          desc="Fotografías y vídeos reales del día a día en el criadero: juego, socialización y los primeros pasos de cada camada."
        />

        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[210px] gap-3">
            {GALLERY_PHOTOS.map((p, i) => (
              <figure
                key={p.src}
                data-testid={`gallery-item-photo-${i + 1}`}
                className={`group relative overflow-hidden rounded-2xl bg-bone ${p.className}`}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-16 md:mt-20">
          <div className="flex items-center gap-3 mb-8">
            <Play className="w-5 h-5 text-copper" />
            <h3 className="font-serif text-3xl md:text-4xl">Vídeos del criadero</h3>
            <Camera className="w-5 h-5 text-muted-foreground" />
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {VIDEOS.map((v, i) => (
            <Reveal key={v.id} delay={0.08 * i}>
              <div className="rounded-2xl overflow-hidden bg-bone border border-line">
                <div className="aspect-video" data-testid={`gallery-item-video-${i + 1}`}>
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
                <div className="p-5">
                  <h4 className="font-serif text-xl font-medium">{v.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{v.caption}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
