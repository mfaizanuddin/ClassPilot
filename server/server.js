import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function extractDocumentText(file) {
  const mimeType = file.mimetype || "";
  const name = file.originalname || "";
  const buffer = file.buffer;

  if (
    mimeType === "application/pdf" ||
    name.toLowerCase().endsWith(".pdf")
  ) {
    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();
      return result.text || "";
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({
      buffer,
    });

    return result.value || "";
  }

  if (
    mimeType === "text/plain" ||
    name.toLowerCase().endsWith(".txt")
  ) {
    return buffer.toString("utf8");
  }

  throw new Error(
    "Unsupported document type. Please upload PDF, DOCX, or TXT."
  );
}

async function askGemini(prompt) {
  const models = ["gemini-3.8-flash", "gemini-2.5-flash"];

  let lastError = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        return response.text || "I couldn't generate a response.";
      } catch (error) {
        lastError = error;

        const message = String(error?.message || error);

        if (!message.includes("503") &&
            !message.includes("UNAVAILABLE") &&
            !message.includes("high demand")) {
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw lastError || new Error("AI service temporarily unavailable.");
}

app.get("/", (req, res) => {
  res.json({
    status: "ClassPilot AI backend is running",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    const reply = await askGemini(`
You are ClassPilot AI, an intelligent teaching copilot for teachers.

Answer the teacher's question clearly and practically.
Use simple language when appropriate.
Help with teaching, lesson planning, syllabus management,
assessments, student understanding, retention, and analytics.

Teacher's question:
${message}
`);

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      error:
        error?.message ||
        "ClassPilot AI could not generate a response.",
    });
  }
});

app.post(
  "/api/chat/document",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No document was uploaded.",
        });
      }

      const message =
        String(req.body?.message || "").trim() ||
        "Please analyze this document.";

      console.log(
        "Received document:",
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        "bytes"
      );

      const documentText = await extractDocumentText(req.file);

      if (!documentText.trim()) {
        return res.status(400).json({
          error:
            "The document was received, but no readable text was found.",
        });
      }

      /*
       * Prevent extremely large prompts from overwhelming the model.
       * The original document is still received completely by the backend.
       */
      const maxCharacters = 120000;
      const trimmedText =
        documentText.length > maxCharacters
          ? documentText.slice(0, maxCharacters) +
            "\n\n[Document text truncated for analysis.]"
          : documentText;

      const reply = await askGemini(`
You are ClassPilot AI, an intelligent teaching copilot.

A teacher has uploaded a document and asked a question about it.

Analyze the document carefully and answer the teacher's question
using the document as the primary source.

Do not claim that you performed actions you did not perform.
If information is not present in the document, say so clearly.

Teacher's question:
${message}

Uploaded document:
--- BEGIN DOCUMENT ---
${trimmedText}
--- END DOCUMENT ---

Give a useful, structured answer for the teacher.
`);

      res.json({
        reply,
        fileName: req.file.originalname,
      });
    } catch (error) {
      console.error("Document chat error:", error);

      res.status(500).json({
        error:
          error?.message ||
          "ClassPilot AI could not analyze the document.",
      });
    }
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `ClassPilot AI backend running on port ${PORT}`
  );
});


