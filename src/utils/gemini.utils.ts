import { AIUsage } from '@/resources/common.resource';
import config from '../config';
import {GoogleGenerativeAI} from '@google/generative-ai';
import { LinkedInUserDataDetail } from '@/resources/user.resource';

const GEMINI_API_KEY = config.gemini_api_key;

const baseInstruction = `Your job is to Extract the following details from the provided HTML snippet and return a JSON object:
Location: {city, state, country}
Summary
Experience: [{company, title, years, location}]
Education: [{school, degree, years}]
Skills: [skill1, skill2, ...]
Recommendations: [{name, title, text}]
Interests: [{name, title, company, group, newsletter, school}]

If any field is unavailable, include it in the JSON with an empty value.
Return only valid JSON.

Example output:
{
  "location": {"city": "", "state": "", "country": ""},
  "summary": "",
  "experience": [],
  "education": [],
  "skills": [],
  "recommendations": [],
  "interests": []
}
-------------------
`;

const generate = async (text: string) => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptForCard = `${baseInstruction}\n\nHTML snippet:\n\n${text}\n\n`;

    const result = await model.generateContent(promptForCard);

    // Extract the generated text from the response
    const generatedText = result.response.text();

    const finalData: LinkedInUserDataDetail =  JSON.parse(generatedText.replaceAll('```json\n', '').replaceAll('```', '').trim());

    const generatedUsage: AIUsage = {
        input: result.response.usageMetadata.promptTokenCount,
        output: result.response.usageMetadata.candidatesTokenCount
    }

    return {
        usageMetadata: generatedUsage,
        data: finalData
    }
}

export default {
    generate
}