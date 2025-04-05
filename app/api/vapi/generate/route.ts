import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET() {
  return Response.json({ success: true, data: "THANK YOU!" }, { status: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount } = await request.json();
  const user = await getCurrentUser();
  const userId = user?.id;

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Act as a professional interviewer conducting an interview for the role described in the job description. Generate realistic and conversational questions for the candidate based on the given attributes. Follow this structured flow:
      Introduction and Ice-Breaker:
    Start with a warm introduction to make the candidate comfortable. For example:
      "Hello [name], I am your interviewer today. How are you doing?"
      "Can you introduce yourself or tell me about yourself briefly?"

    Resume-Based Questions:
    Ask questions directly tied to the candidate's resume content:
      Education: "I see you studied at [university] with a degree in [degree]. Can you share how this prepared you for a role in [job's relevant field]?"
      Experience: "You worked as a [designation] at [company_names]. Can you discuss one of the most impactful projects you worked on there?"
      Projects: "You developed [project name]. Can you explain the challenges you faced while implementing [specific feature]?"
      Skills: "You list [skill]. Can you provide an example of how you've applied this skill in a practical scenario?"

    Job-Specific and Skill Questions:
    Gradually transition to questions relevant to the job description:
      For technical or coding rounds: "Based on the required skills for this role, how would you approach implementing [specific technology or concept]?"
      For HR rounds: "What motivates you to apply for this role, and how do you see yourself contributing to our company culture?"

    Progressive Difficulty:
    Begin with direct and simple questions, then move to deeper and more detailed ones:
      "Can you walk me through your approach to improving [specific outcome or metric] in your past role?"
      "What strategies would you use to tackle [specific challenge] based on your prior experience?"

    Closing and Candidate Input:
    Conclude with open-ended questions to encourage candidate input:
      "Do you have any questions for me about the role or the company?"
      "That marks the end of the interview, best of luck, etc."

        Use the following attributes to tailor the questions:

        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log(interview);

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
