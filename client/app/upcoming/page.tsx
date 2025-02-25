"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import NavBar from "@/components/functions/NavBar"


interface FeatureRequest {
  title: string
  description: string
  email: string
}

interface UpcomingFeature {
  title: string
  description: string
  status: "planned" | "in-progress" | "coming-soon"
}

export default function UpcomingPage() {
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [featureRequest, setFeatureRequest] = useState<FeatureRequest>({
    title: "",
    description: "",
    email: "",
  })

  const upcomingFeatures: UpcomingFeature[] = [
    {
      title: "Endgame Protocol",
      description: "DAO-inspired governance model for stories, where users can vote on stories that they feel is going stale and get a chance to create a graceful end to the story... Democratic, transparent and fair.",
      status: "planned",
    },
    {
      title: "AI Enhancements",
      description: "StoryBoard AI will be much more powerful and will be able to generate even better and more immersive stories pretty soon...",
      status: "in-progress",
    },
    {
      title: "Automation",
      description: "Chapter auto-generation and auto-publishing as per the set interval, without requiring any creator intervention... The creator can just sit back and relax and watch the story grow by itself, or even join in the fun to add their own chapters as they see fit! (No more writer's block! No more George R.R. Martining great stories!)",
      status: "coming-soon",
    },
    {
      title: "Creds System and Perks",
      description: "Users will be able to earn creds by reading and engaging with stories, and participating in the community... These creds will be used to unlock perks and exclusive features in the app... More details will be revealed soon!",
      status: "coming-soon",
    },
  ]

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this to your backend
    console.log("Feature request submitted:", featureRequest)
    const text = "Feature request submitted:\n\n" + "Title: *" + featureRequest.title + "*\n\n" + "Description: " + featureRequest.description + "\n\n" + "Submitted by: _" + featureRequest.email + "_"
    const urlEncodedText = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/918910201104?text=${urlEncodedText}`
    window.open(whatsappUrl, '_blank')
    setShowRequestForm(false)
    setFeatureRequest({ title: "", description: "", email: "" })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <>
    <NavBar />
    <div className="container max-w-6xl py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Upcoming Changes</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Exciting new features are on the horizon! Check out what we're working on and suggest new features you'd like to see.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {upcomingFeatures.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${feature.status === 'planned' ? 'bg-blue-100 text-blue-800' : 
                        feature.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {feature.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="bg-main hover:bg-main/90"
          >
            {showRequestForm ? "Close Request Form" : "Request a Feature"}
          </Button>
        </div>

        {showRequestForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle>Request a New Feature</CardTitle>
                <CardDescription>
                  Let us know what features you'd like to see in StoryBoard!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Feature Title</label>
                    <Input
                      id="title"
                      value={featureRequest.title}
                      onChange={(e) => setFeatureRequest(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a title for your feature request"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea
                      id="description"
                      value={featureRequest.description}
                      onChange={(e) => setFeatureRequest(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the feature you'd like to see..."
                      required
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Your Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={featureRequest.email}
                      onChange={(e) => setFeatureRequest(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email for updates"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-main hover:bg-main/90">
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
    </>
  )
} 