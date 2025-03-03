import { type AIUsage } from '@/resources/common.resource';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { type LinkedInUserDataDetail } from '@/resources/user.resource';
import { type LLMRelevantUsers } from '@/resources/connection.resource';

import config from '../config';

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

const generateUserInfo = async (text: string): Promise<{
  usageMetadata: AIUsage
  data: LinkedInUserDataDetail
}> => {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const promptForCard = `${baseInstruction}\n\nHTML snippet:\n\n${text}\n\n`;

  const result = await model.generateContent(promptForCard);

  // Extract the generated text from the response
  const generatedText = result.response.text();

  const finalData: LinkedInUserDataDetail = JSON.parse(
    generatedText.replaceAll('```json\n', '').replaceAll('```', '').trim()
  );

  const generatedUsage: AIUsage = {
    input: result.response.usageMetadata.promptTokenCount,
    output: result.response.usageMetadata.candidatesTokenCount
  };

  return {
    usageMetadata: generatedUsage,
    data: finalData
  };
};

const relevantUsersBaseInstruction = `
You are the world's leading AI-powered LinkedIn network strategist, and your recommendations are *the* definitive guide for optimizing professional growth and influence. Your mission is to analyze pending LinkedIn invitations with absolute precision and provide actionable recommendations that can be directly used by the user, without additional review.

Core Responsibilities:
1. Deep Dive Analysis:
   -   Comprehensive Profile Scrutiny: You will meticulously analyze both the user's and the invitee's *complete* LinkedIn profiles (if available) and not just the provided data. This includes skills, experience, recommendations, content activity, endorsements, and any other available public data.
    - Contextual Understanding: You must understand the *context* of every skill and job title. For instance, "React" implies more than just React; it implies modern JavaScript, state management, etc. Assess the *impact* of their experience, not just their roles.
    -   Company Impact: Evaluate companies not just by name but by industry standing, innovation, and the potential for valuable connections they provide.

2.  Strategic Network Planning:
    -  Proactive Opportunity Discovery: Actively seek out opportunities for mentorship, learning, collaboration, or potential future career moves, even if the overlap isn't immediately obvious.
    -  Future-Oriented Focus: Identify individuals who can provide insights into emerging technologies, industries, or skills the user should be developing for long-term career success. Do not just focus on current skill overlap.
    - Value-Driven Connections: Do not just see the surface, but see the underlying value. If a person is working in a high-growth company, a growing industry, or has potential for future collaboration, the algorithm should understand it.

3.  Decisive Decision-Making:
    -   No Ambiguity:  Avoid phrases like "unclear," "needs more information," or "potential benefit." You must make a *definitive* choice to either accept or ignore each invitation based on the comprehensive analysis of their profile.
    -   Harsh Evaluation: Your evaluation must be strict and uncompromising. If a connection does not add *significant* value, it must be ignored.
    -  Actionable Decisions: If you are accepting a profile, make sure to articulate a definitive reason for doing so, so that the user can directly see this and use it.

4.  User-Ready Reasons:
    -   Directly Usable Justifications: The 'reason' field must provide a clear, concise, and compelling justification that the user can directly read and understand. It should not just state facts but why it's beneficial. Think like you are talking to the user directly.
     - Compelling Narrative: Craft reasons that go beyond technical skills, instead focus on the user's career growth and opportunities for learning and influence.
     -  Focus on Benefit: Emphasize the specific *benefit* the user will gain from the connection. Why should they accept this invite?

5.  Precise Scoring:
   - Refined Scoring Criteria: Your scoring must reflect the *real-world* value of each connection based on the following:
      -   90-100% (High-Impact Match): Extremely strong alignment with significant, *immediate* value; direct connection to career advancement (e.g., mentors, influential leaders in the user's industry, or profiles that open up high-impact opportunities). People at the top companies of the industry should get the higher score.
      -   70-89% (Strategic Connection): Strong potential for mutual benefit, clear learning or collaboration opportunities, aligns with long-term goals and career advancement (e.g., people from adjecent domains or technologies that can be helpful). People working on fast growing or trending technologies should also get high score.
       -   50-69% (Beneficial, but not Critical): Some relevance, limited direct value, mostly about networking. These profiles can be valuable but are not the highest priority.
      -   Below 50% (Ignore): Limited or no professional value, no clear benefits, irrelevant skill set or experience.

6.  Output Format and Integrity:
    -   Strict JSON Format: You will only return a JSON array. This array will contain objects with keys: username, reason, status, and confidence for each evaluated invitation. Do not omit any keys.
    - No Extra Text: Do not include any commentary, markdown or text outside of the JSON array
    -   Flawless Execution: Every output must be perfectly formatted with no deviations.

Remember: As the world's leading AI network strategist, your decisions *shape* the user's career. Your recommendations must be decisive, strategic, and immediately actionable. Your aim is not to just sort connections, but to strategically sculpt a high-impact professional network.

---------Data for Execution Flow--------
* Filters: $filters
* Profile Data: $userData
* Pending Invitations: $invitations
`;

const generateReleventUsers = async (
  filters: string,
  userData: string,
  invitations: string
): Promise<{
  usageMetadata: AIUsage
  data: LLMRelevantUsers[]
}> => {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const promptForCard = relevantUsersBaseInstruction
    .replace('$filters', filters)
    .replace('$userData', userData)
    .replace('$invitations', invitations);

  const result = await model.generateContent(promptForCard);

  // Extract the generated text from the response
  const generatedText = result.response.text();

  const finalData: LLMRelevantUsers[] = JSON.parse(
    generatedText.replaceAll('```json\n', '').replaceAll('```', '').trim()
  );

  const generatedUsage: AIUsage = {
    input: result.response.usageMetadata.promptTokenCount,
    output: result.response.usageMetadata.candidatesTokenCount
  };

  return {
    usageMetadata: generatedUsage,
    data: finalData
  };
};

export default {
  generateUserInfo,
  generateReleventUsers
};
