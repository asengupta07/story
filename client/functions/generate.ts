import Groq from "groq-sdk";

const model = process.env.GROQ_MODEL || "deepseek-r1-distill-qwen-32b";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


async function generate(prompt: string) {
    const response = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
    });

    const contentWithThoughts = response.choices[0]?.message?.content;

    if (!contentWithThoughts) {
        console.error("Error: contentWithThoughts is undefined.");
        return null;
    }

    const contentWithoutThoughts = contentWithThoughts.split("</think>").pop()?.trim();
    return contentWithoutThoughts;
}

export {
    generate
}
