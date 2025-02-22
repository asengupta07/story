"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Menu, X, BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useParams } from "next/navigation"

interface Story {
    title: string
    chapters: {
        title: string
        content: string
    }[]
}

export default function StoryReader() {
    const [currentChapter, setCurrentChapter] = useState(0)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const params = useParams()
    const storyId = params.storyId as string
    const [story, setStory] = useState<Story | null>(null)

    const fetchStory = async () => {
        const res = await fetch(`/api/getChapters/${storyId}`)
        const data = await res.json()
        setStory(data)
    }

    useEffect(() => {
        fetchStory()
    }, [storyId])
    const nextChapter = () => {
        if (currentChapter < (story?.chapters.length ?? 0) - 1) {
            setCurrentChapter(currentChapter + 1)
        }
    }

    const previousChapter = () => {
        if (currentChapter > 0) {
            setCurrentChapter(currentChapter - 1)
        }
    }

    const progress = ((currentChapter + 1) / (story?.chapters.length ?? 0)) * 100

    return (
        <div className="min-h-screen bg-bg">
            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 bg-bg border-b z-10">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Button variant="noShadow" size="icon" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <Button variant="noShadow" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm ">
                        <BookOpen className="w-4 h-4" />
                        Chapter {currentChapter + 1} of {story?.chapters.length ?? 0}
                    </div>
                </div>
                <Progress value={progress} className="h-1" />
            </div>

            {/* Chapter Sidebar */}
            <div
                className={`fixed top-[73px] left-0 bottom-0 w-72 bg-main border-r transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } z-20`}
            >
                <ScrollArea className="h-full">
                    <div className="p-4">
                        <h2 className="font-semibold mb-4">{story?.title}</h2>
                        <div className="space-y-2">
                            {story?.chapters.map((chapter, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentChapter(index)
                                        setIsSidebarOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${currentChapter === index
                                        ? "bg-purple-100 text-purple-900 font-medium"
                                        : "hover:text-purple-900 hover:bg-gray-100"
                                        }`}
                                >
                                    Chapter {index + 1}: {chapter.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <main className="pt-[73px] pb-20 px-4 md:px-0">
                <div className="max-w-prose mx-auto mt-8">
                    <article className="prose prose-purple prose-lg z-30">
                        <div className="whitespace-pre-wrap font-serif">{story?.chapters[currentChapter].content}</div>
                    </article>
                </div>
            </main>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t p-4 bg-bg">
                <div className="max-w-prose mx-auto flex justify-between">
                    <Button variant="default" onClick={previousChapter} disabled={currentChapter === 0}>
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous Chapter
                    </Button>
                    <Button variant="default" onClick={nextChapter} disabled={currentChapter === (story?.chapters.length ?? 0) - 1}>
                        Next Chapter
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

