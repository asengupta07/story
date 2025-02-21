"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Menu, X, BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useParams } from "next/navigation"

export default function StoryReader() {
    const [currentChapter, setCurrentChapter] = useState(0)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const params = useParams()
    const storyId = params.storyId as string

    // Hardcoded story data
    const story = {
        title: "The Forgotten Realm",
        chapters: [
            {
                title: "The Memory Collector",
                content: `Chapter 1: The Memory Collector

In the neon-drenched streets of New Aurora, where memories flickered like dying stars, Aria Chen stood before the towering Archive of Consciousness. The building's crystalline surfaces reflected the perpetual twilight that had become the city's signature since the Great Forgetting.

She adjusted her neural interface, a delicate piece of technology that allowed her to process and store the memories she collected. Today's assignment was simple: catalogue a centenarian's childhood memories before they faded completely. But something felt different about this one.

The old man's memories had an unusual quality to them, a shimmer that she'd never encountered in her five years as an archivist. They seemed to pulse with an inner light that defied the standard classification protocols...

"Some memories," he'd told her, "are better left buried."

But as she studied the iridescent pattern of this particular memory, she couldn't help but feel that it was trying to tell her something. The neural readings were off the charts, suggesting a depth of consciousness that exceeded normal human parameters...

In the neon-drenched streets of New Aurora, where memories flickered like dying stars, Aria Chen stood before the towering Archive of Consciousness. The building's crystalline surfaces reflected the perpetual twilight that had become the city's signature since the Great Forgetting.

She adjusted her neural interface, a delicate piece of technology that allowed her to process and store the memories she collected. Today's assignment was simple: catalogue a centenarian's childhood memories before they faded completely. But something felt different about this one.

The old man's memories had an unusual quality to them, a shimmer that she'd never encountered in her five years as an archivist. They seemed to pulse with an inner light that defied the standard classification protocols...

"Some memories," he'd told her, "are better left buried."

But as she studied the iridescent pattern of this particular memory, she couldn't help but feel that it was trying to tell her something. The neural readings were off the charts, suggesting a depth of consciousness that exceeded normal human parameters...

Aria hesitated, her fingers hovering over the interface. The memory's light grew brighter, almost blinding. She felt a strange pull, as if the memory was drawing her in, urging her to uncover its secrets. With a deep breath, she initiated the deep dive protocol, a risky maneuver that allowed her to experience the memory firsthand.

Instantly, she was transported to a different time and place. She found herself in a lush, verdant forest, the air thick with the scent of pine and earth. The sky above was a brilliant azure, dotted with fluffy white clouds. Birds sang melodiously in the trees, and a gentle breeze rustled the leaves.

In the distance, she saw a small village, its inhabitants going about their daily lives. Children laughed and played, while adults tended to their chores. It was a scene of peace and tranquility, a stark contrast to the dystopian reality of New Aurora.

As she walked through the village, she noticed a young boy sitting alone by a stream, his expression one of deep contemplation. She approached him cautiously, unsure of what to expect. The boy looked up, his eyes meeting hers with an intensity that took her breath away.

"Who are you?" he asked, his voice filled with curiosity.

"I'm Aria," she replied. "I'm here to understand your memories."

The boy nodded, as if he understood. "This place," he said, gesturing to the village, "is a part of me. It's where I come from, where my story began."

Aria felt a pang of sadness. "But it's gone now, isn't it? The Great Forgetting took it all away."

The boy's eyes darkened. "Yes, but some things can never be truly forgotten. They live on in our hearts, in our memories."

As the scene began to fade, Aria felt a surge of determination. She knew she had to uncover the truth behind the Great Forgetting, to restore the lost memories and bring hope to the people of New Aurora.

With a final glance at the boy, she returned to the present, her mind racing with possibilities. The memory had given her a glimpse of a world that once was, a world that could be again. And she was determined to make it a reality.
`
            },
            {
                title: "Echoes of the Past",
                content: `Chapter 2: Echoes of the Past

The memory fragment pulsed in Aria's neural interface, its edges crackling with an energy that shouldn't exist. Marcus Vale, her mentor and the head archivist, had warned her about anomalies like these, but she'd always assumed they were theoretical.

"Some memories," he'd told her, "are better left buried."

But as she studied the iridescent pattern of this particular memory, she couldn't help but feel that it was trying to tell her something. The neural readings were off the charts, suggesting a depth of consciousness that exceeded normal human parameters...`,
            },
            {
                title: "The Hidden Door",
                content: `Chapter 3: The Hidden Door

Deep within the Archive's restricted section, Aria found herself standing before a door that shouldn't exist. It was ancient, made of a material that seemed to absorb light rather than reflect it, and covered in symbols that her neural interface couldn't decode.

The memory fragment she'd collected seemed to resonate with the door, creating a harmonic frequency that made her teeth ache. As she reached out to touch the surface, the symbols began to shift and reorganize themselves, as if responding to her presence...`,
            },
        ],
    }

    const nextChapter = () => {
        if (currentChapter < story.chapters.length - 1) {
            setCurrentChapter(currentChapter + 1)
        }
    }

    const previousChapter = () => {
        if (currentChapter > 0) {
            setCurrentChapter(currentChapter - 1)
        }
    }

    const progress = ((currentChapter + 1) / story.chapters.length) * 100

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
                        Chapter {currentChapter + 1} of {story.chapters.length}
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
                        <h2 className="font-semibold mb-4">{story.title}</h2>
                        <div className="space-y-2">
                            {story.chapters.map((chapter, index) => (
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
                        <div className="whitespace-pre-wrap font-serif">{story.chapters[currentChapter].content}</div>
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
                    <Button variant="default" onClick={nextChapter} disabled={currentChapter === story.chapters.length - 1}>
                        Next Chapter
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

