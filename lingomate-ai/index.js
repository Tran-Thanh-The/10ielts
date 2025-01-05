import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import cors from 'cors';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const app = express();
app.use(bodyParser.json());
app.use(cors());

// evaluate writing schema
const evaluateWritingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    feedback: {
      type: SchemaType.STRING,
      description: "Vietnamese evaluation content addressing document structure, content overview, and grammar usage. Maximum length: 400 characters.",
      nullable: false,
    },
    score: {
      type: SchemaType.NUMBER,
      description: "Score of the content, from 0 to 100. With a error margin of 5 points.",
      nullable: false,
    }
  },
};

const evaluateWritingModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: evaluateWritingSchema,
  },
});

app.post('/evaluate-writing', async (req, res) => {
  const { topic, writingAssignmentSubmission } = req.body;

  if (!topic || !writingAssignmentSubmission) {
    return res.status(400).json({ error: 'Missing content or topic' });
  }

  try {
    const response = await evaluateWritingModel.generateContent({
      contents: [
        {
          role: "model",
          parts: [
            {
              text: "You are a language teacher in VietNam. You are evaluating a writing of a student. Here is the writing and your feedback to the student:",
            }
          ]
        },
        {
          role: "user",
          parts: [
            {
              text: `Topic: ${topic}\n\nStudent's Writing:\n${writingAssignmentSubmission}`,
            }
          ]
        }
      ]
    });

    const result = JSON.parse(response?.response?.candidates?.[0]?.content?.parts?.[0]?.text);
    console.log("EVALUATE_WRITING_RESPONSE: ", result);
    res.json(result);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to evaluate writing', detail: error });
  }
});

// evaluate-speaking
const evaluateSpeakingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    feedback: {
      type: SchemaType.STRING,
      description: "Vietnamese evaluation content addressing pronunciation, fluency, and grammar usage. Maximum length: 400 characters.",
      nullable: false,
    },
    score: {
      type: SchemaType.NUMBER,
      description: "Score of the content, from 0 to 100",
      nullable: false,
    }
  },
};

const evaluateSpeakingModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: evaluateSpeakingSchema,
  },
});

app.post('/evaluate-speaking', async (req, res) => {
  const { speakingAssignmentSubmission } = req.body;

  if (!speakingAssignmentSubmission) {
    return res.status(400).json({ error: 'Missing content' });
  }

  try {
    const response = await evaluateSpeakingModel.generateContent({
      contents: [
        {
          role: "model",
          parts: [
            {
              text: "You are a language teacher in VietNam. You are evaluating a speaking of a student. Here is the speaking and your feedback to the student:",
            }
          ]
        },
        {
          role: "user",
          parts: [
            {
              text: speakingAssignmentSubmission,
            }
          ]
        }
      ]
    });

    // Trả kết quả điểm và nhận xét
    // const { score, feedback } = response.data;
    const res = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json(res);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to evaluate speaking', detail: error });
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
