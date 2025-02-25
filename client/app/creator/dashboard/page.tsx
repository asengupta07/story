"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Edit3, BookOpen, Bot } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import NavBar from "@/components/functions/NavBar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  const [currentStories, setCurrentStories] = useState<Story[]>([]);
  const [pastStories, setPastStories] = useState<Story[]>([]);

  useEffect(() => {
    // if (!user) {
    //   router.push("/");
    // }
    const email = localStorage.getItem("email")

    if (email) {
      console.log(email);
      fetchCurrentStories(email);
      fetchPastStories(email);
    }
  }, []);

  const fetchCurrentStories = async (email: string) => {
    const response = await fetch(`/api/stories/current?email=${email}`);
    const data = await response.json();
    console.log("Current Stories");
    console.log(data);
    setCurrentStories(data);
  }

  const fetchPastStories = async (email: string) => {
    const response = await fetch(`/api/stories/past?email=${email}`);
    const data = await response.json();
    console.log("Past Stories");
    console.log(data);
    setPastStories(data);
  }

  return (
    <div className="min-h-screen bg-violet-100 dark:bg-bw">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-8">My Story Universe</h1>
        <Tabs defaultValue="current" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-8">
            <TabsTrigger value="current">Current Stories</TabsTrigger>
            <TabsTrigger value="past">Past Stories</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <ScrollArea className="h-[calc(100vh-250px)] sm:h-[calc(100vh-300px)] px-2 sm:px-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pr-2 sm:pr-6 py-4 sm:py-6">
                {currentStories.map((story) => (
                  <StoryCard key={story.id} story={story} isCurrentStory={true} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="past">
            <ScrollArea className="h-[calc(100vh-250px)] sm:h-[calc(100vh-300px)] px-2 sm:px-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pr-2 sm:pr-6 py-4 sm:py-6">
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
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 z-20 h-full flex flex-col">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span className="truncate mr-2">{story.title}</span>
                    <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-purple-700 flex-shrink-0" />
                  </CardTitle>
                  <CardDescription className="text-black text-xs sm:text-sm">
                    {story.readers} followers • Last edited {story.lastEdited}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 flex-grow">
                  <Badge variant={story.status === "Published" ? "default" : "neutral"} className="mb-2 text-xs sm:text-sm">
                    {story.status}
                  </Badge>
                  <p className="text-xs sm:text-sm dark:text-black text-black line-clamp-3">
                    {isCurrentStory
                      ? story.premise
                      : "Reflect on your completed masterpiece and gather inspiration."}
                  </p>
                </CardContent>
                <CardFooter className="p-3 sm:p-4">
                  <Button
                    variant="reverse"
                    className="w-full justify-between group text-xs sm:text-sm"
                    onClick={() => router.push(`/creator/story/${story.id}`)}
                  >
                    {isCurrentStory ? (
                      <>
                        Continue Writing
                        <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    ) : (
                      <>
                        Read Story
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TooltipTrigger>
            <TooltipContent className="z-50 text-xs sm:text-sm">This story has an AI agent writer assisting in its creation.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 z-20 h-full flex flex-col">
          <CardHeader className="text-white p-3 sm:p-4">
            <CardTitle className="flex items-center justify-between text-base sm:text-lg">
              <span className="truncate">{story.title}</span>
            </CardTitle>
            <CardDescription className="text-purple-100 text-xs sm:text-sm">
              {story.readers} followers • Last edited {story.lastEdited}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 flex-grow">
            <Badge variant={story.status === "Published" ? "default" : "neutral"} className="mb-2 text-xs sm:text-sm">
              {story.status}
            </Badge>
            <p className="text-xs sm:text-sm dark:text-black text-black line-clamp-3">
              {isCurrentStory
                ? "Continue your journey and bring this story to life!"
                : "Reflect on your completed masterpiece and gather inspiration."}
            </p>
          </CardContent>
          <CardFooter className="p-3 sm:p-4">
            <Button
              variant="reverse"
              className="w-full justify-between group text-xs sm:text-sm"
              onClick={() => router.push(`/creator/story/${story.id}`)}
            >
              {isCurrentStory ? (
                <>
                  Continue Writing
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </>
              ) : (
                <>
                  Read Story
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  )
}
