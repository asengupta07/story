export interface CharacterInterface {
    name: string;
    description: string;
    role: string;
    backstory: string;
}


export interface UserInterface {
    alias?: string;
    email: string;
    role?: string;
    password?: string;
}


export interface StorySettingsInterface {
    title: string;
    agentWriter: boolean;
    interval: number;
    storyId: string;
    moral: string;
    writingStyle: string;
    wordCount: number;
    contentWarnings?: string[];
    additionalInstructions?: string;
    guidelines?: string;
}

export interface StoryInterface {
    title: string;
    genre: string;
    tone: string;
    targetAudience: string;
    premise: string;
    setting: string;
    timePeriod: string;
    characters: CharacterInterface[];
    themes: string;
    user: UserInterface;
}