"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Edit3, BookOpen, Bot } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import NavBar from "@/components/functions/NavBar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

interface Story {
  id: string;
  title: string;
  status: string;
  hasAgent: boolean;
  readers: number;
  lastEdited: string;
  premise: string;
}


export default function StoryDashboard() {
  const [activeTab, setActiveTab] = useState("current")
  const { user } = usePrivy();
  const router = useRouter();
  const [currentStories, setCurrentStories] = useState<Story[]>([]);
  const [pastStories, setPastStories] = useState<Story[]>([]);
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
    if (user) {
      console.log(user.wallet?.address);
      fetchCurrentStories();
      fetchPastStories();
    }
  }, [user]);

  const fetchCurrentStories = async () => {
    const response = await fetch(`/api/stories/current?address=${user?.wallet?.address}`);
    const data = await response.json();
    console.log("Current Stories");
    console.log(data);
    setCurrentStories(data);
  }

  const fetchPastStories = async () => {
    const response = await fetch(`/api/stories/past?address=${user?.wallet?.address}`);
    const data = await response.json();
    console.log("Past Stories");
    console.log(data);
    setPastStories(data);
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8 ">My Story Universe</h1>
        <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="current">Current Stories</TabsTrigger>
            <TabsTrigger value="past">Past Stories</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <ScrollArea className="h-[calc(100vh-300px)] px-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-6 py-6">
                {currentStories.map((story) => (
                  <StoryCard key={story.id} story={story} isCurrentStory={true} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="past">
            <ScrollArea className="h-[calc(100vh-200px)] px-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-6 py-6">
                {pastStories.map((story) => (
                  <StoryCard key={story.id} story={story} isCurrentStory={false} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StoryCard({ story, isCurrentStory }: { story: any, isCurrentStory: boolean }) {
  const router = useRouter();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {story.hasAgent ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 z-20">
                <CardHeader className=" text-white">
                  <CardTitle className="flex items-center justify-between">
                    {story.title}
                    <Bot className="h-5 w-5 text-yellow-300" />
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    {story.readers} followers • Last edited {story.lastEdited}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Badge variant={story.status === "Published" ? "default" : "neutral"} className="mb-2">
                    {story.status}
                  </Badge>
                  <p className="text-sm dark:text-gray-800 text-gray-600">
                    {isCurrentStory
                      ? story.premise
                      : "Reflect on your completed masterpiece and gather inspiration."}
                  </p>
                </CardContent>
                <CardFooter className="">
                  <Button variant="reverse" className="w-full justify-between group" onClick={() => router.push(`/myStory/${story.id}`)}>
                    {isCurrentStory ? (
                      <>
                        Continue Writing
                        <Edit3 className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    ) : (
                      <>
                        Read Story
                        <BookOpen className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="z-50">This story has an AI agent writer assisting in its creation.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 z-20">
          <CardHeader className=" text-white">
            <CardTitle className="flex items-center justify-between">
              {story.title}
            </CardTitle>
            <CardDescription className="text-purple-100">
              {story.readers} followers • Last edited {story.lastEdited}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Badge variant={story.status === "Published" ? "default" : "neutral"} className="mb-2">
              {story.status}
            </Badge>
            <p className="text-sm dark:text-gray-800 text-gray-600">
              {isCurrentStory
                ? "Continue your journey and bring this story to life!"
                : "Reflect on your completed masterpiece and gather inspiration."}
            </p>
          </CardContent>
          <CardFooter className="">
            <Button variant="reverse" className="w-full justify-between group" onClick={() => router.push(`/myStory/${story.id}`)}>
              {isCurrentStory ? (
                <>
                  Continue Writing
                  <Edit3 className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              ) : (
                <>
                  Read Story
                  <BookOpen className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  )
}

