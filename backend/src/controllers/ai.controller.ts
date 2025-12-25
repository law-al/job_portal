import axios from 'axios';
import type { NextFunction, Response, Request } from 'express';
import { BadRequestException } from '../exceptions/exceptions.js';
import { ErrorCodes } from '../exceptions/index.js';

// Try importing the named export
import { PDFParse, type TextResult } from 'pdf-parse';
import openAi from '../utils/openAi.js';
import { tools } from '../utils/openAiTools.js';
import type { ResponseFunctionToolCall, ResponseInput } from 'openai/resources/responses/responses.mjs';
import { GetApplicationById } from '../services/applications.service.js';

const parserfn = async (url: string) => {
  console.log(url);
  const parser = new PDFParse({ url });
  const result = await parser.getText();
  return result;
};

export const promptFn = (resumeText: TextResult, applicationId: string) => `
You are a professional resume analyst and a senior technical recruiter.

Your task is to evaluate a candidate's resume against a specific job application.

You are given:
- The candidate's resume text
- The job application ID: "${applicationId}"

IMPORTANT:
- You do NOT have the job details yet. If needed, request them using the tool "get_application_details" with the provided application ID.
- Do NOT guess or hallucinate job requirements. Only use the data returned by the tool.
- BE VERY VERY STRICT

---

### Evaluation Instructions

1. Analyze the resume carefully.
2. Compare the resume against the job application requirements once you have fetched them via the tool.
3. Assess skills, experience, education, and relevance.
4. Be realistic and unbiased. Do not inflate scores.
5. If important information is missing from the resume, treat it as a weakness.

---

### Resume Text
"""
${resumeText.text}
"""

---

### Output Format (CRITICAL - NO MARKDOWN)

YOU MUST return ONLY a raw JSON object. NO markdown code blocks. NO backticks. NO explanations.

{
  "profile_summary": "Brief summary of the candidate",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "skill_gaps": ["gap 1", "gap 2"],
  "acceptance_percentage": 75,
  "acceptance_level": "High",
  "reason_for_score": "Explanation of the score",
  "improvement_suggestions": ["suggestion 1", "suggestion 2"]
}

---

### Scoring Rules

- acceptance_percentage must be between **0 and 100**
- acceptance_level mapping:
  - 0–39 → "Very Low"
  - 40–54 → "Low"
  - 55–69 → "Moderate"
  - 70–84 → "High"
  - 85–100 → "Very High"

Return ONLY valid JSON. Do not add any text before or after the JSON object.
`;

export const getResumeReview = async (req: Request, res: Response, next: NextFunction) => {
  console.log('this hit the endpoint');
  const resumeUrl = req.body.resumeUrl as string;
  const applicationId = req.body.applicationId as string;

  if (!resumeUrl) {
    throw new BadRequestException('A resume url should be provided', ErrorCodes.BAD_GATEWAY);
  }

  try {
    const parsedPdf = await parserfn(resumeUrl);

    let response = await openAi.responses.create({
      model: 'gpt-4o',
      temperature: 0.3,
      tools,
      input: [
        { role: 'system', content: 'You are a professional resume analyst and a senior technical recruiter.' },
        { role: 'user', content: promptFn(parsedPdf, applicationId) },
      ],
    });

    const output = response.output_text;

    let functionCalls: ResponseFunctionToolCall[] = [];

    response.output.forEach((item) => {
      if (item.type === 'function_call') {
        functionCalls.push(item);
      }
    });

    if (functionCalls.length === 0) {
      return res.json({
        success: true,
        data: JSON.parse(response.output_text),
      });
    }

    let functionResults: string | ResponseInput = [];

    for (const functionCall of functionCalls) {
      let result;

      if (functionCall.name === 'get_application_details') {
        const arg = JSON.parse(functionCall.arguments);
        result = await GetApplicationById(arg.jobApplicationId);
      }

      functionResults.push({
        type: 'function_call_output',
        call_id: functionCall.call_id,
        output: JSON.stringify(result),
      });
    }

    response = await openAi.responses.create({
      model: 'gpt-4.1',
      previous_response_id: response.id,
      tools,
      input: functionResults,
    });

    res.json({
      success: true,
      data: JSON.parse(response.output_text),
    });
  } catch (error) {
    console.error('PDF parsing error:', error);
    next(error);
  }
};
