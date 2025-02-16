"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function CreateStoryAgent() {
  const [storySettings, setStorySettings] = useState({
    agentWriter: false,
    interval: 0,
    storyId: "",
    moral: "",
    writingStyle: "",
    wordCount: 0,
    contentWarnings: [],
    additionalInstructions: "",
    guidelines: "",
  })

  const [story, setStory] = useState({
    title: "",
    genre: "",
    tone: "",
    targetAudience: "",
    premise: "",
    setting: "",
    timePeriod: "",
    characters: [],
    themes: "",
    user: "",
  })

  const handleStorySettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStorySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleStoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStory((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      storySettings: {
        ...storySettings,
        interval: Number(storySettings.interval),
        wordCount: Number(storySettings.wordCount),
        contentWarnings:
          storySettings.contentWarnings.length > 0 ? storySettings.contentWarnings.map((cw: string) => cw.trim()) : [],
      },
      story: {
        ...story,
        characters: [], // You may want to implement a separate component for adding characters
      },
    }
    console.log(JSON.stringify(payload, null, 2))
    // Here you would typically send this data to your backend
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Create Story Agent</h1>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Story Details</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="storyTitle">Title</Label>
            <Input id="storyTitle" name="title" value={story.title} onChange={handleStoryChange} required />
          </div>
          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input id="genre" name="genre" value={story.genre} onChange={handleStoryChange} required />
          </div>
          <div>
            <Label htmlFor="tone">Tone</Label>
            <Input id="tone" name="tone" value={story.tone} onChange={handleStoryChange} required />
          </div>
          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              value={story.targetAudience}
              onChange={handleStoryChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="premise">Premise</Label>
            <Textarea id="premise" name="premise" value={story.premise} onChange={handleStoryChange} required />
          </div>
          <div>
            <Label htmlFor="setting">Setting</Label>
            <Input id="setting" name="setting" value={story.setting} onChange={handleStoryChange} required />
          </div>
          <div>
            <Label htmlFor="timePeriod">Time Period</Label>
            <Input id="timePeriod" name="timePeriod" value={story.timePeriod} onChange={handleStoryChange} required />
          </div>
          <div>
            <Label htmlFor="themes">Themes</Label>
            <Input id="themes" name="themes" value={story.themes} onChange={handleStoryChange} required />
          </div>
          <div>
            <Label htmlFor="user">User ID</Label>
            <Input id="user" name="user" value={story.user} onChange={handleStoryChange} required />
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-8">Story Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="agentWriter"
              checked={storySettings.agentWriter}
              onCheckedChange={(checked) => setStorySettings((prev) => ({ ...prev, agentWriter: checked }))}
            />
            <Label htmlFor="agentWriter">Agent Writer</Label>
          </div>
          <div>
            <Label htmlFor="interval">Interval</Label>
            <Input
              id="interval"
              name="interval"
              type="number"
              value={storySettings.interval}
              onChange={handleStorySettingsChange}
              required
            />
          </div>
          {storySettings.agentWriter && (
            <>
              <div>
                <Label htmlFor="storyId">Story ID</Label>
                <Input
                  id="storyId"
                  name="storyId"
                  value={storySettings.storyId}
                  onChange={handleStorySettingsChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="moral">Moral</Label>
                <Input
                  id="moral"
                  name="moral"
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
                  value={storySettings.writingStyle}
                  onChange={handleStorySettingsChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="wordCount">Word Count</Label>
                <Input
                  id="wordCount"
                  name="wordCount"
                  type="number"
                  value={storySettings.wordCount}
                  onChange={handleStorySettingsChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contentWarnings">Content Warnings (comma-separated)</Label>
                <Input
                  id="contentWarnings"
                  name="contentWarnings"
                  value={storySettings.contentWarnings}
                  onChange={handleStorySettingsChange}
                />
              </div>
              <div>
                <Label htmlFor="additionalInstructions">Additional Instructions</Label>
                <Textarea
                  id="additionalInstructions"
                  name="additionalInstructions"
                  value={storySettings.additionalInstructions}
                  onChange={handleStorySettingsChange}
                />
              </div>
              <div>
                <Label htmlFor="guidelines">Guidelines</Label>
                <Textarea
                  id="guidelines"
                  name="guidelines"
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
  )
}

