import { Card } from "@/components/ui/card"
import { BookOpen, Briefcase, FlaskConical, PenTool, Scale, TrendingUp } from "lucide-react"

const useCases = [
  {
    icon: BookOpen,
    title: "Students & Researchers",
    description:
      "Quickly digest academic papers, textbooks, and research documents. Perfect for literature reviews and exam preparation.",
    stats: "Save 5+ hours per week",
  },
  {
    icon: Briefcase,
    title: "Business Professionals",
    description:
      "Analyze contracts, reports, and proposals efficiently. Make informed decisions faster with executive summaries.",
    stats: "3x faster document review",
  },
  {
    icon: Scale,
    title: "Legal Teams",
    description:
      "Review case files, legal documents, and contracts rapidly. Extract key clauses and obligations with precision.",
    stats: "70% time reduction",
  },
  {
    icon: FlaskConical,
    title: "Scientists & Analysts",
    description:
      "Process research papers, lab reports, and technical documentation. Stay current with the latest findings.",
    stats: "Read 10x more papers",
  },
  {
    icon: PenTool,
    title: "Content Creators",
    description: "Extract insights from books, articles, and documents for content creation and research purposes.",
    stats: "2x content output",
  },
  {
    icon: TrendingUp,
    title: "Consultants",
    description: "Analyze client documents, market reports, and industry studies quickly to deliver faster insights.",
    stats: "4x client throughput",
  },
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Built for Every Professional</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From students to executives, our AI summarizer adapts to your workflow
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <Card key={index} className="p-6 hover:border-primary/50 transition-colors">
              <div className="mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <useCase.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>
              <div className="text-xs font-medium text-primary">{useCase.stats}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
