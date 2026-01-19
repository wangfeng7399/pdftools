import { Card } from "@/components/ui/card"
import { Upload, Cpu, MessageSquare } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload Your PDF",
    description:
      "Click the upload button or drag & drop your PDF file into the designated area. Files up to 50MB are supported.",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description:
      "Our advanced AI processes your document in seconds, extracting key information and generating a comprehensive summary.",
  },
  {
    icon: MessageSquare,
    title: "Chat & Extract",
    description:
      "Review your summary and use the AI chat to translate, simplify, rephrase, or dig deeper into specific sections.",
  },
]

export function HowToSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform lengthy documents into actionable insights
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="relative p-8 text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>

              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
              </div>

              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground text-balance">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
