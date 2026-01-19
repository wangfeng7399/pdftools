import OpenAI from "openai"

// OpenRouter兼容OpenAI API格式
// 需要在环境变量中设置 OPENROUTER_API_KEY
// 并使用 baseURL: "https://openrouter.ai/api/v1"

const getOpenAIClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error("未设置 OPENROUTER_API_KEY 或 OPENAI_API_KEY 环境变量")
  }

  // 如果使用OpenRouter，设置baseURL
  const baseURL = process.env.OPENROUTER_API_KEY 
    ? "https://openrouter.ai/api/v1"
    : undefined

  return new OpenAI({
    apiKey,
    baseURL,
    // OpenRouter需要设置HTTP头
    defaultHeaders: process.env.OPENROUTER_API_KEY ? {
      "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
      "X-Title": "PDF Summarizer",
    } : undefined,
  })
}

/**
 * 生成PDF摘要
 */
export async function generateSummary(
  text: string,
  model: string = "openai/gpt-4o-mini" // OpenRouter模型格式
): Promise<string> {
  console.log("[AI Client] generateSummary called, text length:", text.length, "model:", model)
  const startTime = Date.now()
  
  try {
    const client = getOpenAIClient()
    console.log("[AI Client] ✓ OpenAI client created")
    
    const promptText = text.substring(0, 100000) // 限制输入长度
    const prompt = `请为以下PDF文档内容生成一个详细、结构化的摘要。摘要应该包括：
1. 文档的主要主题和目的
2. 关键要点（3-5个）
3. 重要细节和数据
4. 结论或建议（如果有）

请用中文回答，保持专业和准确。

文档内容：
${promptText}`

    console.log("[AI Client] Sending request to AI API, prompt length:", prompt.length)
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "你是一个专业的文档摘要助手，擅长从长文档中提取关键信息并生成清晰、结构化的摘要。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const duration = Date.now() - startTime
    const result = completion.choices[0]?.message?.content || "摘要生成失败"
    console.log("[AI Client] ✓ Summary generated in", duration, "ms, result length:", result.length)
    
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    console.error("[AI Client] ✗ Error after", duration, "ms:", error)
    throw new Error(`摘要生成失败: ${error instanceof Error ? error.message : "未知错误"}`)
  }
}

/**
 * 处理长文档的摘要（优化后的分块处理）
 */
export async function generateSummaryForLongDocument(
  text: string,
  model: string = "openai/gpt-4o-mini"
): Promise<string> {
  console.log("[AI Client] generateSummaryForLongDocument called, text length:", text.length)
  const startTime = Date.now()
  
  // 大幅增加块大小，减少块数量
  const maxChunkSize = 50000 // 从8000增加到50000
  const maxChunks = 10 // 最多处理10个块，避免太多API调用
  
  // 如果文档不长，直接生成摘要
  if (text.length <= maxChunkSize) {
    console.log("[AI Client] Text is short, generating summary directly")
    return generateSummary(text, model)
  }

  // 智能分块：按段落分，而不是按字符数
  console.log("[AI Client] Text is long, splitting into chunks...")
  
  // 先按段落分割（双换行符）
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  console.log("[AI Client] Found", paragraphs.length, "paragraphs")
  
  // 将段落合并成更大的块
  const chunks: string[] = []
  let currentChunk = ""
  
  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = paragraph
      
      // 限制块数量
      if (chunks.length >= maxChunks) {
        console.log("[AI Client] Reached max chunks limit, truncating remaining text")
        break
      }
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph
    }
  }
  
  if (currentChunk && chunks.length < maxChunks) {
    chunks.push(currentChunk.trim())
  }
  
  console.log("[AI Client] Split into", chunks.length, "chunks (max size:", maxChunkSize, ")")
  
  // 如果还是太多块，只取前几个
  const chunksToProcess = chunks.slice(0, maxChunks)
  if (chunks.length > maxChunks) {
    console.log("[AI Client] Warning: Document too long, only processing first", maxChunks, "chunks")
  }
  
  // 串行处理所有块（简化逻辑，避免并行导致的复杂性）
  const summaries: string[] = []

  for (let i = 0; i < chunksToProcess.length; i++) {
    console.log("[AI Client] Processing chunk", i + 1, "of", chunksToProcess.length, "size:", chunksToProcess[i].length)
    const chunkStartTime = Date.now()
    const chunkSummary = await generateSummary(chunksToProcess[i], model)
    const chunkDuration = Date.now() - chunkStartTime
    summaries.push(chunkSummary)
    console.log("[AI Client] ✓ Chunk", i + 1, "completed in", chunkDuration, "ms")
  }

  // 合并摘要（如果有多于1个摘要）
  if (summaries.length === 1) {
    return summaries[0]
  }
  
  console.log("[AI Client] All chunks processed, combining", summaries.length, "summaries...")
  const combinedText = summaries.join("\n\n")
  const finalSummary = await generateSummary(combinedText, model)
  
  const totalDuration = Date.now() - startTime
  console.log("[AI Client] ✓ Long document summary completed in", totalDuration, "ms")
  
  return finalSummary
}

/**
 * 与PDF内容聊天
 */
export async function chatWithPDF(
  question: string,
  pdfText: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
  model: string = "openai/gpt-4o-mini"
): Promise<string> {
  const client = getOpenAIClient()

  // 限制PDF文本长度，只使用相关部分
  const contextText = pdfText.substring(0, 50000)

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `你是一个专业的文档助手。用户会向你提问关于PDF文档的问题。
文档内容如下（仅作为参考）：
${contextText}

请基于文档内容回答用户的问题。如果问题与文档无关，请礼貌地说明。`,
    },
    ...conversationHistory,
    {
      role: "user",
      content: question,
    },
  ]

  try {
    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    })

    return completion.choices[0]?.message?.content || "回答生成失败"
  } catch (error) {
    console.error("AI聊天错误:", error)
    throw new Error(`回答生成失败: ${error instanceof Error ? error.message : "未知错误"}`)
  }
}
