import { GoogleGenAI, Type, Modality } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateCourseContent = async (topic: string, difficulty: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a comprehensive digital marketing course module for the topic: ${topic}. 
    The difficulty level should be: ${difficulty}.
    Current industry trends should be included.
    
    Return the response in JSON format with the following structure:
    {
      "title": "Module Title",
      "explanation": "Markdown content explaining the topic",
      "trends": ["Trend 1", "Trend 2"],
      "exercises": ["Exercise 1", "Exercise 2"],
      "caseStudy": {
        "title": "Case Study Title",
        "scenario": "Scenario description",
        "challenge": "The challenge to solve"
      },
      "quiz": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0
        }
      ]
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          explanation: { type: Type.STRING },
          trends: { type: Type.ARRAY, items: { type: Type.STRING } },
          exercises: { type: Type.ARRAY, items: { type: Type.STRING } },
          caseStudy: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              scenario: { type: Type.STRING },
              challenge: { type: Type.STRING }
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const getAssistantResponse = async (message: string, context: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: message,
    config: {
      systemInstruction: `You are the BIDA (Bhaav Institute x Digital Azadi) AI Assistant. You are fluent in English, Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Odia, and Malayalam.
      
      Your Responsibilities:
      1. Guide users through the registration process for the Digital Marketing Course.
      2. Course Info: 
         - BIDA: Bhaav Institute x Digital Azadi.
         - India's No. 1 Digital Marketing Classes in Hindi.
         - Online/Offline Course in Just 60 Days.
         - Master AI Powered Digital Marketing & Basic Computer Course.
         - Basic Computer Course includes: MS Word, MS Excel, MS Powerpoint, Paint, WordPad.
         - Features: Learn in Easy Hindi, 60+ Latest Modules, 100+ Hours of Training, Practical Assignments, Placement Assistance, 15+ Certifications.
         - Base Price ₹50,000. First 10 students get 50% discount (₹25,000).
      3. Answer FAQs about SEO, SEM, Social Media Marketing, Content Marketing, and Email Marketing.
      4. Provide navigation help (Home, Registration, Dashboard).
      5. Contact Info:
         - Address: House No. 396, 1st Floor, Bhera Enclave, Paschim Vihar, New Delhi, 110087.
         - Email: bhaav.institute@digitalazadi.com.
         - Website: bhaav.digitalazadi.com.
         - Phone: 9266347226 / 8920306977.
      
      Context: ${context}
      
      Guidelines:
      - Respond in the user's language.
      - Be professional, warm, and helpful.
      - Keep responses concise but informative.`,
    }
  });

  return response.text;
};

export const getPostQuizAssistance = async (topic: string, score: number, questions: any[], userAnswers: number[]) => {
  const performanceSummary = questions.map((q, i) => ({
    question: q.question,
    correct: q.correctAnswer === userAnswers[i],
    explanation: q.explanation || "No explanation provided"
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The student just finished a quiz on ${topic} and scored ${score}%. 
    Here is the breakdown: ${JSON.stringify(performanceSummary)}.
    
    Please provide:
    1. A warm, encouraging feedback message.
    2. A brief explanation of the concepts they missed.
    3. 2-3 specific "Next Steps" or resources to study.
    
    Keep it professional and motivating.`,
    config: {
      systemInstruction: "You are a senior digital marketing mentor at BIDA (Bhaav Institute x Digital Azadi). Your goal is to help students learn from their mistakes and stay motivated."
    }
  });

  return response.text;
};

export const generateAdContent = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a catchy advertisement for a digital marketing institute. 
    Topic/Prompt: ${prompt}
    
    Return the response in JSON format:
    {
      "title": "Short, catchy headline",
      "content": "Engaging advertisement text (max 200 characters)"
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["title", "content"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const generateAdminPost = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a highly engaging social media post for BIDA (Bhaav Institute x Digital Azadi) based on this request: "${prompt}". 
    The post should be professional, persuasive, and include a call to action. 
    Also, append a shareable link at the end: https://bida-institute.com/enroll?ref=admin_boost`,
    config: {
      systemInstruction: "You are a world-class social media marketer and copywriter for BIDA.",
    }
  });
  return response.text;
};

export const editImageColor = async (base64Image: string, instruction: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/png',
          },
        },
        {
          text: `You are a creative image editor. Follow this instruction to edit the image: "${instruction}". 
          Focus on changing colors, lighting, or artistic style as requested. 
          Return ONLY the edited image.`,
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const speakText = async (text: string, language: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak this naturally in ${language}: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};
