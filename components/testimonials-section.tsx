import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "PhD Candidate",
    content:
      "This tool has revolutionized my research process. I can now process dozens of papers in the time it used to take me to read just one. Absolutely game-changing!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Business Analyst",
    content:
      "The accuracy is impressive. I use it daily for client reports and market analysis. The chat feature helps me drill down into specific sections quickly.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emma Williams",
    role: "Legal Consultant",
    content:
      "As someone who reviews hundreds of pages of contracts, this tool is invaluable. It highlights key clauses and obligations I might have missed.",
    rating: 5,
    avatar: "EW",
  },
  {
    name: "David Rodriguez",
    role: "Medical Student",
    content:
      "Perfect for studying! I can summarize textbook chapters and research papers in seconds. The multi-language support is a huge plus for international journals.",
    rating: 5,
    avatar: "DR",
  },
  {
    name: "Lisa Anderson",
    role: "Content Strategist",
    content:
      "I use this for content research daily. It helps me extract insights from competitor reports and industry studies 10x faster than manual reading.",
    rating: 5,
    avatar: "LA",
  },
  {
    name: "James Taylor",
    role: "Financial Advisor",
    content:
      "The security features give me confidence to use it with sensitive client documents. Fast, accurate, and incredibly user-friendly.",
    rating: 5,
    avatar: "JT",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Trusted by Professionals Worldwide</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who are already saving hours every week
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm font-medium">4.9 out of 5 from 12,000+ reviews</span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
