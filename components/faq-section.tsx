import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Can AI summarize a PDF file?",
    answer:
      "Our AI PDF Summarizer can create summaries from any PDF file. Simply upload your document, and our advanced AI will scan through it, extract key points, and deliver a clean, concise summary in seconds. No technical skills needed—just upload and get insights instantly.",
  },
  {
    question: "How accurate are the AI-generated summaries?",
    answer:
      "Our AI achieves over 95% accuracy in extracting key information from documents. It's trained on millions of documents across various domains and uses advanced natural language processing to understand context, identify main themes, and preserve critical details. We continuously improve the model based on user feedback.",
  },
  {
    question: "Is it safe to use this PDF summarizer?",
    answer:
      "Yes, completely safe. We use HTTPS encryption and trusted security protocols to protect your files during upload and processing. Our tool is verified by Google Safe Browsing, and we're GDPR compliant. All files are automatically deleted from our servers within 24 hours of processing.",
  },
  {
    question: "Can I use this tool for free?",
    answer:
      "Yes! Your first PDF summary is completely free, and you get three chat questions included—all powered by our advanced AI. This lets you experience the full capabilities before upgrading. For unlimited access and additional features, check out our premium plans.",
  },
  {
    question: "What languages are supported?",
    answer:
      "Our AI summarizer supports over 90 languages, including English, Spanish, French, German, Chinese, Japanese, Arabic, and many more. The AI can process documents in one language and even help you translate summaries to another language through the chat feature.",
  },
  {
    question: "What's the maximum file size I can upload?",
    answer:
      "You can upload PDF files up to 50 MB for free accounts and up to 100 MB for premium users. This is sufficient for most documents, including lengthy research papers, books, and technical manuals. The AI can handle documents with hundreds of pages without any issues.",
  },
  {
    question: "How long does it take to generate a summary?",
    answer:
      "Most summaries are generated within 5-15 seconds, depending on the document length and complexity. Our AI processes even 100+ page documents in under 30 seconds. You'll see a progress indicator while the analysis is running.",
  },
  {
    question: "Can I chat with my PDF after summarization?",
    answer:
      "Yes! This is one of our most popular features. After getting your summary, you can use the AI chat to ask specific questions about the document, request translations, simplify complex sections, extract specific data, or explore topics in greater depth. It's like having a conversation with your document.",
  },
  {
    question: "Do you store my documents?",
    answer:
      "We temporarily store your documents only during the processing phase to generate summaries and enable chat functionality. All files are automatically deleted from our servers within 24 hours. You can also manually delete your files immediately after processing if desired.",
  },
  {
    question: "What types of PDFs work best?",
    answer:
      "Our AI works with all types of PDFs, including text-based documents, scanned documents (with OCR), academic papers, books, contracts, reports, and technical manuals. For best results, use PDFs with clear text formatting. Scanned documents may take slightly longer due to OCR processing.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our AI PDF Summarizer
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
