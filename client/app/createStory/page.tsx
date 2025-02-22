"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import NavBar from "@/components/functions/NavBar"
import { CharacterForm } from "@/components/CharacterForm"
import type { Character } from "@/components/CharacterForm"
import { usePrivy } from "@privy-io/react-auth"


export default function CreateStoryAgent() {
    const { user } = usePrivy()
    const [storySettings, setStorySettings] = useState({
        agentWriter: false,
        interval: 0,
        moral: "",
        writingStyle: "",
        wordCount: 0,
        contentWarnings: [],
        additionalInstructions: "",
        guidelines: "",
    } as {
        agentWriter: boolean,
        interval: number,
        moral: string,
        writingStyle: string,
        wordCount: number,
        contentWarnings: string[] | string,
        additionalInstructions: string,
        guidelines: string,
    })

    const [story, setStory] = useState({
        title: "",
        genre: "",
        tone: "",
        targetAudience: "",
        premise: "",
        setting: "",
        timePeriod: "",
        characters: [] as Character[],
        themes: "",
        user: {
            publicKey: ""
        }
    })

    const handleStorySettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setStorySettings((prev) => ({ ...prev, [name]: value }))
    }

    const handleStoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setStory((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            ...storySettings,
            interval: Number(storySettings.interval),
            wordCount: Number(storySettings.wordCount),
            contentWarnings:
                storySettings.contentWarnings && typeof storySettings.contentWarnings === 'string' ? storySettings.contentWarnings.split(',').map((cw: string) => cw.trim()) : storySettings.contentWarnings,
            ...story,
            user: {
                publicKey: user?.wallet?.address
            }
        }
        console.log(JSON.stringify(payload, null, 2))
        const response = await fetch("/api/create", {
            method: "POST",
            body: JSON.stringify(payload),
        })
        const data = await response.json()
        console.log(data)
        // TODO: Redirect to story page
    }

    const handleAddCharacter = (character: Character) => {
        setStory((prev) => ({ ...prev, characters: [...prev.characters, character] }))
    }

    const handleRemoveCharacter = (index: number) => {
        setStory((prev) => ({
            ...prev,
            characters: prev.characters.filter((_, i) => i !== index),
        }))
    }

    return (
        <>
            <NavBar />
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-10">
                <h1 className="text-3xl font-bold">
                    Create a Story
                    <p className="text-base font-normal text-muted-foreground">
                        This is the first step in creating a story! Pour your imagination into the form below and choose whether to let AI take over or retain control... Or both!
                    </p>
                </h1>


                <div className="space-y-5">
                    <h2 className="text-xl font-semibold">Story Details
                        <p className="text-base font-light text-muted-foreground">These are the details of the story you want to create... Let your imagination run wild!</p>
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="storyTitle">Title</Label>
                            <Input id="storyTitle" name="title" value={story.title} placeholder="The Wizard of Oz" onChange={handleStoryChange} required />
                        </div>
                        <div>
                            <Label htmlFor="genre">Genre</Label>
                            <Input id="genre" name="genre" value={story.genre} placeholder="Fantasy" onChange={handleStoryChange} required />
                        </div>
                        <div>
                            <Label htmlFor="tone">Tone</Label>
                            <Input id="tone" name="tone" value={story.tone} placeholder="Mysterious" onChange={handleStoryChange} required />
                        </div>
                        <div>
                            <Label htmlFor="targetAudience">Target Audience</Label>
                            <Input
                                id="targetAudience"
                                name="targetAudience"
                                value={story.targetAudience}
                                placeholder="Children"
                                onChange={handleStoryChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="premise">Premise</Label>
                            <Textarea id="premise" name="premise" value={story.premise} placeholder="A young girl named Dorothy goes on an adventure to find a wizard who can help her return home." onChange={handleStoryChange} required />
                        </div>
                        <div>
                            <Label htmlFor="setting">Setting</Label>
                            <Input id="setting" name="setting" value={story.setting} placeholder="A magical land called Oz" onChange={handleStoryChange} required />
                        </div>
                        <div>
                            <Label htmlFor="timePeriod">Time Period</Label>
                            <Input id="timePeriod" name="timePeriod" value={story.timePeriod} placeholder="1920s" onChange={handleStoryChange} required />
                        </div>
                        <div>
                            <Label htmlFor="themes">Themes</Label>
                            <Input id="themes" name="themes" value={story.themes} placeholder="Magic, Adventure, Friendship" onChange={handleStoryChange} required />
                        </div>
                        <CharacterForm
                            onAddCharacter={handleAddCharacter}
                            onRemoveCharacter={handleRemoveCharacter}
                            characters={story.characters}
                        />

                    </div>

                    <h2 className="text-xl font-semibold mt-8">Story Settings
                        <p className="text-base font-light text-muted-foreground">These are the settings for the story you want to create... Let the AI Agent do its magic!</p>
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="agentWriter"
                                checked={storySettings.agentWriter}
                                onCheckedChange={(checked) => setStorySettings((prev) => ({ ...prev, agentWriter: checked }))}
                            />
                            <Label htmlFor="agentWriter">Agent Writer</Label>
                        </div>
                        <div>
                            <Label htmlFor="interval">Interval <span className="text-sm font-bold text-muted-foreground">{"(How frequently you/AI will be writing the chapters, in minutes) [Later this will be in days]"}</span></Label>
                            <Input
                                id="interval"
                                name="interval"
                                type="number"
                                value={storySettings.interval}
                                placeholder="1"
                                onChange={handleStorySettingsChange}
                                required
                            />
                        </div>
                        {storySettings.agentWriter && (
                            <>
                                <div>
                                    <Label htmlFor="moral">Moral</Label>
                                    <Input
                                        id="moral"
                                        name="moral"
                                        placeholder="The story should be about the importance of friendship."
                                        value={storySettings.moral}
                                        onChange={handleStorySettingsChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="writingStyle">Writing Style</Label>
                                    <Input
                                        id="writingStyle"
                                        name="writingStyle"
                                        placeholder="The story should be written in the style of a children's book."
                                        value={storySettings.writingStyle}
                                        onChange={handleStorySettingsChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="wordCount">Word Count <span className="text-sm font-bold text-muted-foreground">{"(How many words AI will be writing per chapter)"}</span></Label>
                                    <Input
                                        id="wordCount"
                                        name="wordCount"
                                        type="number"
                                        value={storySettings.wordCount}
                                        placeholder="1000"
                                        onChange={handleStorySettingsChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contentWarnings">Content Warnings <span className="text-sm font-bold text-muted-foreground">{"(comma-separated)"}</span></Label>
                                    <Input
                                        id="contentWarnings"
                                        name="contentWarnings"
                                        placeholder="Violence, Death, Sexuality"
                                        value={storySettings.contentWarnings}
                                        onChange={handleStorySettingsChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="additionalInstructions">Additional Instructions <span className="text-sm font-bold text-muted-foreground">{"(Any additional instructions for the AI)"}</span></Label>
                                    <Textarea
                                        id="additionalInstructions"
                                        name="additionalInstructions"
                                        placeholder="The story should not have any violence."
                                        value={storySettings.additionalInstructions}
                                        onChange={handleStorySettingsChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="guidelines">Guidelines <span className="text-sm font-bold text-muted-foreground">{"(Any guidelines for the AI)"}</span></Label>
                                    <Textarea
                                        id="guidelines"
                                        name="guidelines"
                                        placeholder="The story should not be too scary."
                                        value={storySettings.guidelines}
                                        onChange={handleStorySettingsChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Create Story Agent
                </Button>
            </form>
        </>
    )
}

