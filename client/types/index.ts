export interface Character {
    name: string;
    description: string;
    role: string;
    backstory: string;
}


export interface UserInterface {
    alias?: string;
    publicKey: string;
    role?: string;
}


export interface StoryInterface {
    title: string;
    genre: string;
    tone: string;
    targetAudience: string;
    premise: string;
    setting: string;
    timePeriod: string;
    characters: Character[];
    guidelines?: string;
    themes: string;
    moral: string;
    writingStyle: string;
    wordCount: number;
    contentWarnings?: string[];
    additionalInstructions?: string;
    user: UserInterface;
}