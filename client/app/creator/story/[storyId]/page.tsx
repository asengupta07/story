"use client"

import { useEffect, useState } from "react"
import { Bell, BookOpen, Edit3, Trash2, UserPlus } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import NavBar from "@/components/functions/NavBar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"


interface Story {
    title: string;
    description: string;
    details: {
        genre: string;
        tone: string;
        targetAudience: string;
        setting: string;
        timePeriod: string;
        themes: string;
        totalFollowers: number;
    };
    characters: {
        name: string;
        role: string;
        description: string;
        backstory: string;
    }[];
    writingSettings: {
        chapterInterval: string;
        writingStyle: string;
        targetWordCount: string;
        contentWarnings: string;
    };
    chapters: {
        number: number;
        title: string;
        recap: string;
        author: string;
    }[];
    readers: {
        total: number;
        topReaders: string[];
    };
}

interface Analytics {
    totalChapters: number;
    averageWordCount: number;
    readerEngagementRate: number;
}

interface BrandDeal {
    _id: string;
    name: string;
    product: string;
    description: string;
    status: string;
}

const storyData: Story = {
    title: "The Chronicles of Aethoria",
    description: "An epic fantasy tale of magic and adventure",
    details: {
        genre: "Fantasy",
        tone: "Epic, Adventurous",
        targetAudience: "Young Adult",
        setting: "Medieval-inspired magical realm",
        timePeriod: "Fictional middle ages",
        themes: "Coming of age, Good vs Evil, Power of friendship",
        totalFollowers: 1234,
    },
    characters: [
        {
            name: "Lyra Starborn",
            role: "Protagonist",
            description: "A young mage discovering her powers",
            backstory: "Orphaned at a young age, raised by village elders",
        },
        {
            name: "Kael Shadowbane",
            role: "Deuteragonist",
            description: "A skilled warrior with a mysterious past",
            backstory: "Former royal guard, exiled for a crime he didn't commit",
        },
        {
            name: "Morwen the Wise",
            role: "Mentor",
            description: "An ancient wizard guiding the heroes",
            backstory: "Last of the original council of mages",
        },
    ],
    writingSettings: {
        chapterInterval: "Weekly",
        writingStyle: "Descriptive, Character-focused",
        targetWordCount: "80,000 - 100,000 words",
        contentWarnings: "Mild violence, Some intense scenes",
    },
    chapters: [
        {
            number: 1,
            title: "The Awakening",
            recap: "Lyra discovers her magical abilities",
            author: "You",
        },
        {
            number: 2,
            title: "The Journey Begins",
            recap: "Lyra leaves her village with Kael",
            author: "You",
        },
        {
            number: 3,
            title: "Shadows in the Forest",
            recap: "The duo face their first magical challenge",
            author: "You",
        },
    ],
    readers: {
        total: 5678,
        topReaders: ["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry"],
    },
}

const analyticsData: Analytics = {
    totalChapters: 5,
    averageWordCount: 2860,
    readerEngagementRate: 78,
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2">
                <p>{`${payload[0].name}: ${payload[0].value}%`}</p>
            </div>
        );
    }
    return null;
};

export default function MyStoryDashboard() {
    const [storyData, setStoryData] = useState<Story | null>(null)
    const [direction, setDirection] = useState("")
    const [storyStatus, setStoryStatus] = useState("Ongoing")
    const [aiEnabled, setAiEnabled] = useState(false)
    const [brandDeals, setBrandDeals] = useState<BrandDeal[]>([])
    const { storyId } = useParams();
    const router = useRouter();
    useEffect(() => {
        fetch(`/api/stories/details?storyId=${storyId}`)
            .then(res => res.json())
            .then(data => {
                setStoryData(data)
                console.log(data)
                setAiEnabled(data.aiEnabled)
                setStoryStatus(data.status)
            })

        fetch(`/api/getDeals?storyId=${storyId}`)
            .then(res => res.json())
            .then(data => {
                setBrandDeals(data.existingBrandDeals)
                console.log(data)
            })
    }, [storyId])

    const handleGenerateNextChapter = async () => {
        console.log("Generating next chapter")
        const response = await fetch(`/api/generate`, {
            method: "POST",
            body: JSON.stringify({
                storyId: storyId,
                direction: direction
            })
        })
        const data = await response.json()
        console.log(data)
        setStoryData((prev) => {
            if (prev) {
                return { ...prev, chapters: [...prev.chapters, data.chapter] }
            }
            return prev
        })
    }

    const engagementData = [
        { name: "Mon", views: 400, comments: 24 },
        { name: "Tue", views: 300, comments: 13 },
        { name: "Wed", views: 520, comments: 42 },
        { name: "Thu", views: 410, comments: 28 },
        { name: "Fri", views: 380, comments: 22 },
        { name: "Sat", views: 610, comments: 51 },
        { name: "Sun", views: 580, comments: 47 },
    ]

    const genreData = [
        { name: "Fantasy", value: 45 },
        { name: "Sci-Fi", value: 30 },
        { name: "Romance", value: 15 },
        { name: "Mystery", value: 10 },
    ]

    const wordCountData = [
        { name: "Ch 1", count: 2500 },
        { name: "Ch 2", count: 2800 },
        { name: "Ch 3", count: 3200 },
        { name: "Ch 4", count: 2700 },
        { name: "Ch 5", count: 3100 },
    ]

    const handleStatusChange = async (value: string, index: number) => {
        console.log(value, index)
        const payload = {
            status: value,
            dealId: brandDeals[index]._id,
        }
        const res = await fetch(`/api/getDeals`, {
            method: "POST",
            body: JSON.stringify(payload),
        })
        if (res.ok) {
            console.log("Status updated")
        } else {
            console.log("Error updating status")
        }
    }

    const truncateText = (text: string, maxLength: number) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    return (
        <div className="bg-violet-200 dark:bg-bg">
            <NavBar />
            <div className="container mx-auto p-2 sm:p-6 space-y-4 sm:space-y-6">
                <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8">My Story Dashboard</h1>

                {/* Story Overview Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">{storyData?.title}</CardTitle>
                        <CardDescription className="line-clamp-2 sm:line-clamp-none">{storyData?.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <Label>Genre</Label>
                                <p className="truncate">{storyData?.details.genre}</p>
                            </div>
                            <div>
                                <Label>Tone</Label>
                                <p className="truncate">{storyData?.details.tone}</p>
                            </div>
                            <div>
                                <Label>Target Audience</Label>
                                <p className="truncate">{storyData?.details.targetAudience}</p>
                            </div>
                            <div>
                                <Label>Setting</Label>
                                <p className="truncate">{storyData?.details.setting}</p>
                            </div>
                            <div>
                                <Label>Time Period</Label>
                                <p className="truncate">{storyData?.details.timePeriod}</p>
                            </div>
                            <div>
                                <Label>Themes</Label>
                                <p className="truncate">{storyData?.details.themes}</p>
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select value={storyStatus} onValueChange={setStoryStatus}>
                                    <SelectTrigger>
                                        <SelectValue>{storyStatus}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active" className="hover:bg-[#d385af]">Active</SelectItem>
                                        <SelectItem value="completed" className="hover:bg-[#d385af]">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Total Followers</Label>
                                <p className="text-xl sm:text-2xl font-bold">{storyData?.details.totalFollowers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Characters Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Characters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {storyData?.characters.map((character) => (
                                <Card key={character.name} className="bg-[#d385af] dark:bg-black">
                                    <CardHeader>
                                        <CardTitle className="text-base sm:text-lg">{character.name}</CardTitle>
                                        <CardDescription>{character.role}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="line-clamp-2 sm:line-clamp-none">
                                            <strong>Description:</strong> {character.description}
                                        </p>
                                        <p className="line-clamp-2 sm:line-clamp-none">
                                            <strong>Backstory:</strong> {character.backstory}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" /> Add New Character
                        </Button>
                    </CardFooter>
                </Card>

                {/* Writing Settings Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Writing Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <Label>Agent Writer Status</Label>
                                <Select value={aiEnabled ? "AI" : "Manual"} onValueChange={(value) => setAiEnabled(value === "AI")}>
                                    <SelectTrigger>
                                        <SelectValue>{aiEnabled ? "AI" : "Manual"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Manual" className="hover:bg-[#d385af]">Manual</SelectItem>
                                        <SelectItem value="AI" className="hover:bg-[#d385af]">AI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Chapter Interval</Label>
                                <p className="truncate">{storyData?.writingSettings.chapterInterval}</p>
                            </div>
                            <div>
                                <Label>Writing Style</Label>
                                <p className="truncate">{storyData?.writingSettings.writingStyle}</p>
                            </div>
                            <div>
                                <Label>Target Word Count</Label>
                                <p className="truncate">{storyData?.writingSettings.targetWordCount}</p>
                            </div>
                            <div>
                                <Label>Content Warnings</Label>
                                <p className="truncate">{storyData?.writingSettings.contentWarnings}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chapter Management Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chapter Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {storyData?.chapters.map((chapter) => (
                                <div key={chapter.number} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold truncate">
                                            Chapter {chapter.number}: {chapter.title}
                                        </h3>
                                        <p className="text-sm text-gray-900 line-clamp-2 sm:line-clamp-none">{chapter.recap}</p>
                                    </div>
                                    <Button variant="reverse" onClick={() => {
                                        router.push(`/reader/story/read/${storyId}`)
                                    }}>
                                        <Edit3 className="mr-2 h-4 w-4" /> Read
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                        {aiEnabled ? (
                            <div className="w-full sm:flex-1 sm:mr-4">
                                <Label htmlFor="ai-direction">AI Direction</Label>
                                <Textarea id="ai-direction" placeholder="Enter directions for the AI..." value={direction} onChange={(e) => setDirection(e.target.value)} />
                            </div>
                        ) : null}
                        <Button className="w-full sm:w-auto" onClick={handleGenerateNextChapter}>{aiEnabled ? "Generate Next Chapter" : "Write Next Chapter"}</Button>
                    </CardFooter>
                </Card>

                {/* Reader Interaction Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reader Interaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <p className="text-xl sm:text-2xl font-bold">Total Readers: {storyData?.readers.total}</p>
                            <Button variant="default">
                                <Bell className="mr-2 h-4 w-4" /> Notify Readers
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {storyData?.readers.topReaders.map((reader: string) => (
                                <div key={reader} className="flex items-center">
                                    <Avatar className="mr-2">
                                        <AvatarFallback>{reader[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="truncate">{reader}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Story Analytics Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Story Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="bg-[#d385af] dark:bg-grey">
                                <CardHeader>
                                    <CardTitle>Reader Engagement</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[200px] sm:h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={engagementData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" stroke="#424028" />
                                            <YAxis stroke="#424028" />
                                            <Tooltip contentStyle={{ backgroundColor: "#000000", color: "#ffffff" }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="views" stroke="#0000ff" />
                                            <Line type="monotone" dataKey="comments" stroke="#ff0000" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="bg-[#d385af]">
                                <CardHeader>
                                    <CardTitle>Genre Distribution</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[200px] sm:h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={genreData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#424028"
                                                label={({ index }) => genreData[index].name}
                                            />
                                            <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000000", color: "#ffffff" }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="bg-[#d385af]">
                                <CardHeader>
                                    <CardTitle>Word Count per Chapter</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[200px] sm:h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={wordCountData}>
                                            <Bar dataKey="count" fill="#424028" />
                                            <Tooltip contentStyle={{ backgroundColor: "#000000", color: "#ffffff" }} />
                                            <YAxis stroke="#222222" />
                                            <XAxis dataKey="name" stroke="#222222" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <Label>Total Chapters</Label>
                                <p className="text-xl sm:text-2xl font-bold">{analyticsData.totalChapters}</p>
                            </div>
                            <div>
                                <Label>Average Word Count</Label>
                                <p className="text-xl sm:text-2xl font-bold">{analyticsData.averageWordCount}</p>
                            </div>
                            <div>
                                <Label>Reader Engagement Rate</Label>
                                <p className="text-xl sm:text-2xl font-bold">{analyticsData.readerEngagementRate}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Brand Deals Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Brand Deals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {brandDeals.map((deal, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="w-full sm:w-auto">
                                        <h3 className="font-bold truncate">{deal.name}</h3>
                                        <p className="text-sm text-black truncate">{deal.product}</p>
                                        <p className="text-sm text-black mb-2 line-clamp-2">{deal.description}</p>
                                        <Select onValueChange={(value) => handleStatusChange(value, index)} defaultValue={deal.status}>
                                            <SelectTrigger className="w-full sm:w-48">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending" className="hover:bg-[#d385af]">Pending</SelectItem>
                                                <SelectItem value="approved" className="hover:bg-[#d385af]">Approved</SelectItem>
                                                <SelectItem value="rejected" className="hover:bg-[#d385af]">Rejected</SelectItem>
                                                <SelectItem value="completed" className="hover:bg-[#d385af]">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="reverse" className="w-full sm:w-auto">
                                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Story Settings & Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Story Settings & Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button className="w-full sm:w-auto">
                                <Edit3 className="mr-2 h-4 w-4" /> Edit Story Details
                            </Button>
                            <Button variant="default" className="w-full sm:w-auto">
                                <BookOpen className="mr-2 h-4 w-4" /> Preview Story
                            </Button>
                            <Button variant="neutral" className="w-full sm:w-auto">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Story
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
