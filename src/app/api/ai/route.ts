import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, prompt, context, userApiKey } = await req.json();

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to high-quality mock responses for calming demo mode
      const responseText = getMockResponse(action, prompt, context);
      return NextResponse.json({ text: responseText, mock: true });
    }

    // Call real Gemini 1.5 Flash API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildSystemPrompt(action, context) + "\n\nUser request:\n" + prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to contact Gemini API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    return NextResponse.json({ text: generatedText, mock: false });

  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

function buildSystemPrompt(action: string, context?: string): string {
  const basePrompt = "You are Lumi, a friendly, encouraging, and highly competent study tutor. You speak in a calming, clear, and reassuring tone. Avoid jargon, keep formatting clean using Markdown, and use bullet points where helpful.";
  
  switch (action) {
    case "chat":
      return `${basePrompt} You answer questions about the student's study materials. Context of study material:\n${context || "None"}`;
    case "summarize":
      return `${basePrompt} Summarize the following note or document. Organize it with: 1) A 2-sentence gentle overview, 2) Key take-aways in bullets, 3) 2-3 definitions of critical concepts. Text to summarize:\n${context || ""}`;
    case "simplify":
      return `${basePrompt} Explain this difficult concept in extremely simple, intuitive terms. Use a warm, everyday analogy (like baking bread, a garden, library, or rivers) to ground the explanation. Text to simplify:\n${context || ""}`;
    case "quiz":
      return `${basePrompt} Create a 3-question multiple choice quiz based on this text. Format your response cleanly in Markdown. For each question, display the question, options A, B, C, D, and write the correct answer at the very end in a collapsible spoiler. Text:\n${context || ""}`;
    case "todo-breakdown":
      return `${basePrompt} You are an expert productivity planner. Break down the user's high-level learning goal into 4-6 specific, bite-sized chronological subtasks that are actionable and clear. Output ONLY a clean markdown bullet list of the tasks. Goal:\n${context || ""}`;
    case "exam-planner":
      return `${basePrompt} You are an academic advisor. The student has an upcoming exam with syllabus topics. Today is ${new Date().toLocaleDateString()}. Calculate the number of days left and generate a realistic, daily step-by-step study schedule dividing the syllabus evenly. Output ONLY a clean markdown bullet list where each line starts with '- [ ] Day X: [Actionable study task]' so it can be parsed directly into a checklist. Context:\n${context || ""}`;
    case "extract-formulas":
      return `${basePrompt} Extract all mathematical formulas, scientific equations, or core technical rules from this text. For each, list: 1) The formula in clean notation, 2) A brief description of variables, 3) Real-world usage in one sentence. Text:\n${context || ""}`;
    default:
      return basePrompt;
  }
}

function getMockResponse(action: string, prompt: string, context?: string): string {
  switch (action) {
    case "exam-planner":
      return `- [ ] Day 1: Read syllabus core topics & draft notes\n- [ ] Day 2: Review formulas and practice 5 equations\n- [ ] Day 3: Solve chapter exercises & mock exam questions\n- [ ] Day 4: Deep-dive review of weak topics\n- [ ] Day 5: Run flashcard active recalls & final quick revision`;
    case "chat":
      if (prompt.toLowerCase().includes("quiz")) {
        return `### 🌟 Mini-Quiz: Neural Networks\n\nLet's test your understanding with a quick, gentle question. \n\n**Which part of a neural network determines the strength of the connection between two nodes?**\n- A) Activation Function\n- B) Weight\n- C) Bias\n- D) Loss Function\n\n*Reply with your answer and I'll explain it!*`;
      }
      return `Hello! I'm Lumi, your personal StudyOS companion. 🧘‍♂️\n\nSince no Gemini API Key is configured yet, I'm running in calming demo mode. \n\nYou can ask me to quiz you, give an analogy, or explain anything. Once you add your Gemini API Key in the **Settings** panel, I'll be able to read all your actual notes, PDFs, and generate real-time answers. \n\nHow can I help you feel relaxed and focused today?`;
    
    case "summarize":
      return `### 📝 StudyOS AI Note Summary\n\n**Overview:**\nThis text discusses fundamental parameters of computer architecture and system optimization, focusing on memory alignment, cache efficiency, and computational scaling.\n\n**Key Takeaways:**\n* **Locality of Reference:** Keep related variables stored together in memory to optimize CPU L1/L2 cache hits.\n* **Time-Space Trade-off:** Increasing memory footprint can speed up CPU throughput (e.g., using precomputed lookup tables).\n* **Asynchronous Offloading:** Non-critical operations (like logs) should be offloaded to background threads to prevent UI blockages.\n\n**Key Concept Definitions:**\n1. **L1 Cache:** Fast, tiny memory located inside the processor core to hold high-frequency instructions.\n2. **Cache Miss:** A state where the processor requests data that is not in the cache, causing a slow fetch from RAM.`;

    case "simplify":
      return `### 💡 Concept Simplified: The Water Pipes Analogy\n\nTo understand this concept (like electric current, network bandwidth, or data streams), think of it as a **garden water pipe system**:\n\n* **Voltage / Pressure:** This is the water pressure pushing through the pipe. Higher pressure forces water through faster.\n* **Current / Flow Rate:** This is the actual amount of water pouring out of the end of the pipe per second.\n* **Resistance / Pipe Width:** This is the diameter of the pipe. A very narrow pipe restricts the water flow (high resistance), while a wide pipe lets water flow freely (low resistance).\n\nIf you want to increase the flow rate, you can either **increase the pressure** (voltage) or **widen the pipe** (reduce resistance). This is Ohm's Law in action!`;

    case "quiz":
      return `### 🧠 StudyOS Quick Quiz\n\n**Question 1:** Which data structure operates on a Last-In, First-Out (LIFO) model?\n- A) Queue\n- B) Linked List\n- C) Stack\n- D) Binary Tree\n\n**Question 2:** What is the primary purpose of an Activation Function in neural networks?\n- A) To normalize data weights\n- B) To introduce non-linearity\n- C) To speed up database reads\n- D) To calculate training loss\n\n**Question 3:** What does 'O(n log n)' describe in computer science?\n- A) Constant time complexity\n- B) Linearithmic algorithmic time scaling (like Merge Sort)\n- C) Exponential execution curves\n- D) Memory allocation capacity\n\n---\n**Answers Key (Reveal when ready):**\n1: C (Stack) | 2: B (Non-linearity) | 3: B (Linearithmic)`;

    case "todo-breakdown":
      return `- [ ] Review the syllabus core requirements\n- [ ] Read Chapter 1 introductory slides\n- [ ] Draft a visual summary mind map of main formulas\n- [ ] Solve the 3 practice quiz problems at the end of the chapter\n- [ ] Schedule a 15-minute active recall review tomorrow morning`;

    case "extract-formulas":
      return `### 🔬 Extracted Formulas & Equations\n\n1. **Shannon Entropy Formula:**\n   $$H(X) = -\\sum_{i=1}^n P(x_i) \\log_2 P(x_i)$$\n   * **Variables:** $H(X)$ is information entropy, $P(x_i)$ is probability of event $x_i$.\n   * **Usage:** Calculates the average rate at which information is produced by a stochastic source.\n\n2. **Ohm's Law:**\n   $$V = I \\times R$$\n   * **Variables:** $V$ is voltage (Volts), $I$ is current (Amperes), $R$ is resistance (Ohms).\n   * **Usage:** Relates electrical voltage, current, and resistance in circuit loops.`;
    default:
      return "I'm here to support your learning. Let me know how I can help!";
  }
}
