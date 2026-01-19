import { Card } from "@/components/ui/card"
import { Zap, Target, MessageCircle, Globe, Gauge, GraduationCap } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Free Access",
    description:
      "Get your first summary free with three chat questions included. Experience the power of AI without commitment.",
  },
  {
    icon: Target,
    title: "Accurate Results",
    description: "Even with lengthy PDFs, our AI delivers precise, reliable insights you can trust every single time.",
  },
  {
    icon: MessageCircle,
    title: "Chat with PDF",
    description:
      "Once summarized, dive into an interactive AI chat to clarify, translate, or explore specific content sections.",
  },
  {
    icon: Globe,
    title: "90+ Languages",
    description:
      "Our AI summarizer captures the essence of text in over 90 languages, ensuring nothing gets lost in translation.",
  },
  {
    icon: Gauge,
    title: "Easy Navigation",
    description:
      "Designed to be simple and intuitive, allowing anyone to use AI summarization regardless of tech expertise.",
  },
  {
    icon: GraduationCap,
    title: "Exam Ready",
    description:
      "Perfect as a notes maker from PDF. Streamline study sessions and focus on essentials with time-saving summaries.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Choose Our AI PDF Summarizer</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to save you time and enhance productivity
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
