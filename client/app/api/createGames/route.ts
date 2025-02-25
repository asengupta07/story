import { NextRequest, NextResponse } from "next/server"
import { Story, Chapter } from "@/models/schema"
import { generate } from "@/functions/generate"
import { parseUntilJson } from "@/functions/parseUntilJson"


interface StoryInterface {
    title: string,
    premise: string,
    genre: string,
    chapters: ChapterInterface[],
    characters: CharacterInterface[]
}

interface CharacterInterface {
    name: string,
    description: string
}

interface ChapterInterface {
    content: string
}


async function createQuiz(story: StoryInterface, chapters: ChapterInterface[]) {

    const numberOfQuestions = Math.floor(Math.random() * 3) + 3;
    const quizPrompt = `
    Create a quiz for the following story:
    Title: ${story.title}
    Premise: ${story.premise}
    Genre: ${story.genre}
    Characters: ${story.characters.map(character => `${character.name}: ${character.description}`).join("\n")}

    Latest Chapter: ${chapters[chapters.length - 1].content}
    Make sure the output JSON is valid.
    Make sure there is no text or backticks before or after the JSON object.
    The output should be a JSON object in the following format:
    {
        "title": "Quiz Title",
        "description": "Quiz Description",
        "questions": [
            {
                "question": "Question 1",
                "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                "correctAnswer": "Option 1"
            },
            ...
        ]
    }
    
    Create a quiz with ${numberOfQuestions} questions.
    `
    const response = await generate(quizPrompt)
    console.log("Generated Quiz: ", response)   
    return JSON.parse(response ?? "")
}

async function createPoll(story: StoryInterface, chapters: ChapterInterface[]) {
    const pollPrompt = `
    Create a poll for the following story:
    Title: ${story.title}
    Premise: ${story.premise}
    Genre: ${story.genre}
    Characters: ${story.characters.map(character => `${character.name}: ${character.description}`).join("\n")}

    Latest Chapter: ${chapters[chapters.length - 1].content}
    Make sure the output JSON is valid.
    Make sure there is no text or backticks before or after the JSON object.
    The output should be a JSON object in the following format:
    {
        "title": "Poll Title",
        "description": "Poll Description",
        "question": "Poll Question",
        "options": [
            {
                "id": "option1",
                "label": "Option 1"
            },
            ...
        ]
    }

    Create a poll.
    `
    const response = await generate(pollPrompt)
    console.log("Generated Poll: ", response)
    return JSON.parse(response ?? "")
}

async function createPredictions(story: StoryInterface, chapters: ChapterInterface[]) {
    const predictionsPrompt = `
    Create a predictions for the following story:
    Title: ${story.title}
    Premise: ${story.premise}
    Genre: ${story.genre}
    Characters: ${story.characters.map(character => `${character.name}: ${character.description}`).join("\n")}

    Latest Chapter: ${chapters[chapters.length - 1].content}
    Make sure the output JSON is valid.
    Make sure there is no text or backticks before or after the JSON object.
    The output should be a JSON object in the following format:
    {
        "title": "Predictions Title",
        "description": "Predictions Description",
        "inputPlaceholder": "Enter your prediction for the next chapter..."
    }

    Create a prediction.
    `
    const response = await generate(predictionsPrompt)
    console.log("Generated Predictions: ", response)
    return JSON.parse(response ?? "")
}
async function getHandler(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const storyId = searchParams.get("storyId")
    const story = await Story.findById(storyId)
    const chapters = await Chapter.find({ story: storyId })

    const quiz = await createQuiz(story, chapters)
    const poll = await createPoll(story, chapters)
    const predictions = await createPredictions(story, chapters)

    return NextResponse.json({ quiz, poll, predictions })
}

export { getHandler as GET }