"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Menu, X, BookOpen, ArrowLeft, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useParams } from "next/navigation"
import { ModeToggle } from "@/components/theme/themeSwitcher"

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
    const [fontSize, setFontSize] = useState(16) // Default font size
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
            window.scrollTo(0, 0)
        }
    }

    const previousChapter = () => {
        if (currentChapter > 0) {
            setCurrentChapter(currentChapter - 1)
            window.scrollTo(0, 0)
        }
    }

    const increaseFontSize = () => {
        setFontSize(prev => Math.min(prev + 2, 24)) // Max font size 24px
    }

    const decreaseFontSize = () => {
        setFontSize(prev => Math.max(prev - 2, 12)) // Min font size 12px
    }

    const progress = ((currentChapter + 1) / (story?.chapters.length ?? 0)) * 100

    return (
        <div className="min-h-screen bg-bg">
            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 bg-bg border-b z-10">
                <div className="flex items-center justify-between p-2 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button variant="noShadow" size="icon" onClick={() => window.history.back()}>
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button variant="noShadow" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 text-sm me-4">
                            <BookOpen className="w-4 h-4" />
                            Chapter {currentChapter + 1} of {story?.chapters.length ?? 0}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="noShadow" size="icon" onClick={decreaseFontSize} className="h-8 w-8">
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Button variant="noShadow" size="icon" onClick={increaseFontSize} className="h-8 w-8">
                                <Plus className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center ms-2">
                                <ModeToggle />
                            </div>
                        </div>
                    </div>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Main Content */}
            <main className="pt-[73px] pb-20 px-4 md:px-0">
                <div className="max-w-prose mx-auto mt-8">
                    <h1 className="text-xl sm:text-2xl font-bold text-center">{story?.title}</h1>
                    <h2 className="text-lg sm:text-xl font-semibold text-center mt-2">
                        Chapter {currentChapter + 1}: {story?.chapters[currentChapter].title}
                    </h2>
                    <article className="prose prose-purple prose-lg z-30 mt-4" style={{ maxWidth: '100%' }}>
                        <div 
                            className="whitespace-pre-wrap font-serif text-justify"
                            style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                        >
                            {story?.chapters[currentChapter].content}
                        </div>
                    </article>
                </div>
            </main>

            {/* Chapter Sidebar */}
            <div
                className={`fixed top-[73px] z-50 left-0 bottom-0 w-64 sm:w-72 bg-main border-r transform transition-transform duration-200 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                                        window.scrollTo(0, 0)
                                    }}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                                        currentChapter === index
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

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 border-t p-2 z-20 sm:p-4 bg-bg">
                <div className="max-w-prose mx-auto flex justify-between gap-4">
                    <Button 
                        variant="default" 
                        onClick={previousChapter} 
                        disabled={currentChapter === 0}
                        className="flex-1 sm:flex-none"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Previous Chapter</span>
                        <span className="sm:hidden">Previous</span>
                    </Button>
                    <Button 
                        variant="default" 
                        onClick={nextChapter} 
                        disabled={currentChapter === (story?.chapters.length ?? 0) - 1}
                        className="flex-1 sm:flex-none"
                    >
                        <span className="hidden sm:inline">Next Chapter</span>
                        <span className="sm:hidden">Next</span>
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
