import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/lib/site";
import { SectionHead, Reveal } from "@/components/site/Shared";

export default function Faq() {
  return (
    <section id="faq" className="py-24 md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHead
          index="06"
          eyebrow="Guía de adopción"
          title={
            <>
              Preguntas <em className="italic text-copper">frecuentes</em>
            </>
          }
        />
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} data-testid={`faq-item-${i + 1}`} className="border-line">
                <AccordionTrigger className="font-serif text-xl md:text-2xl font-medium text-left hover:text-copper hover:no-underline py-6">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground md:text-lg leading-relaxed pb-6">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
