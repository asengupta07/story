"use client"

import { useState } from "react"
import { Bell, BookOpen, Edit3, Trash2, UserPlus } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import NavBar from "@/components/functions/NavBar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Add this custom tooltip component before the main component
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
    const [storyStatus, setStoryStatus] = useState("Ongoing")
    const [aiEnabled, setAiEnabled] = useState(false)

    // Mock data for charts
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

    return (
        <div className="bg-bg">
            <NavBar />
            <div className="container mx-auto p-6 space-y-6">
                <h1 className="text-4xl font-bold mb-8">My Story Dashboard</h1>

                {/* Story Overview Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>The Chronicles of Aethoria</CardTitle>
                        <CardDescription>An epic fantasy tale of magic and adventure</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <Label>Genre</Label>
                                <p>Fantasy</p>
                            </div>
                            <div>
                                <Label>Tone</Label>
                                <p>Epic, Adventurous</p>
                            </div>
                            <div>
                                <Label>Target Audience</Label>
                                <p>Young Adult</p>
                            </div>
                            <div>
                                <Label>Setting</Label>
                                <p>Medieval-inspired magical realm</p>
                            </div>
                            <div>
                                <Label>Time Period</Label>
                                <p>Fictional middle ages</p>
                            </div>
                            <div>
                                <Label>Themes</Label>
                                <p>Coming of age, Good vs Evil, Power of friendship</p>
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select value={storyStatus} onValueChange={setStoryStatus}>
                                    <SelectTrigger>
                                        <SelectValue>{storyStatus}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Paused">Paused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Total Followers</Label>
                                <p className="text-2xl font-bold">1,234</p>
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
                            {[
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
                            ].map((character) => (
                                <Card key={character.name} className="bg-violet-600">
                                    <CardHeader>
                                        <CardTitle>{character.name}</CardTitle>
                                        <CardDescription>{character.role}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p>
                                            <strong>Description:</strong> {character.description}
                                        </p>
                                        <p>
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <Label>Agent Writer Status</Label>
                                <Select value={aiEnabled ? "AI" : "Manual"} onValueChange={(value) => setAiEnabled(value === "AI")}>
                                    <SelectTrigger>
                                        <SelectValue>{aiEnabled ? "AI" : "Manual"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Manual">Manual</SelectItem>
                                        <SelectItem value="AI">AI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Chapter Interval</Label>
                                <p>Weekly</p>
                            </div>
                            <div>
                                <Label>Writing Style</Label>
                                <p>Descriptive, Character-focused</p>
                            </div>
                            <div>
                                <Label>Target Word Count</Label>
                                <p>80,000 - 100,000 words</p>
                            </div>
                            <div>
                                <Label>Content Warnings</Label>
                                <p>Mild violence, Some intense scenes</p>
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
                            {[
                                { number: 1, title: "The Awakening", recap: "Lyra discovers her magical abilities", author: "You" },
                                { number: 2, title: "The Journey Begins", recap: "Lyra leaves her village with Kael", author: "You" },
                                {
                                    number: 3,
                                    title: "Shadows in the Forest",
                                    recap: "The duo face their first magical challenge",
                                    author: "You",
                                },
                            ].map((chapter) => (
                                <div key={chapter.number} className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold">
                                            Chapter {chapter.number}: {chapter.title}
                                        </h3>
                                        <p className="text-sm text-gray-200">{chapter.recap}</p>
                                    </div>
                                    <Button variant="reverse">
                                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {aiEnabled ? (
                            <div className="flex-1 mr-4">
                                <Label htmlFor="ai-direction">AI Direction</Label>
                                <Textarea id="ai-direction" placeholder="Enter directions for the AI..." />
                            </div>
                        ) : null}
                        <Button>{aiEnabled ? "Generate Next Chapter" : "Write Next Chapter"}</Button>
                    </CardFooter>
                </Card>

                {/* Reader Interaction Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reader Interaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-2xl font-bold">Total Readers: 5,678</p>
                            <Button variant="default">
                                <Bell className="mr-2 h-4 w-4" /> Notify Readers
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {["Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Henry"].map((reader) => (
                                <div key={reader} className="flex items-center">
                                    <Avatar className="mr-2">
                                        <AvatarFallback>{reader[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{reader}</span>
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
                            <Card className="bg-violet-600">
                                <CardHeader>
                                    <CardTitle>Reader Engagement</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={engagementData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" stroke="#222222" />
                                            <YAxis stroke="#222222" />
                                            <Tooltip contentStyle={{ backgroundColor: "#000000", color: "#ffffff" }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="views" stroke="#8884d8" />
                                            <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="bg-violet-600">
                                <CardHeader>
                                    <CardTitle>Genre Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={genreData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label={({ index }) => genreData[index].name}
                                            />
                                            <Tooltip content={<CustomTooltip />} contentStyle={{ backgroundColor: "#000000", color: "#ffffff" }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="bg-violet-600">
                                <CardHeader>
                                    <CardTitle>Word Count per Chapter</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={wordCountData}>
                                            <Bar dataKey="count" fill="#8884d8" />
                                            <Tooltip contentStyle={{ backgroundColor: "#000000", color: "#ffffff" }} />
                                            <YAxis stroke="#222222" />
                                            <XAxis dataKey="name" stroke="#222222" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <Label>Total Chapters</Label>
                                <p className="text-2xl font-bold">5</p>
                            </div>
                            <div>
                                <Label>Average Word Count</Label>
                                <p className="text-2xl font-bold">2,860</p>
                            </div>
                            <div>
                                <Label>Reader Engagement Rate</Label>
                                <p className="text-2xl font-bold">78%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Story Settings & Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Story Settings & Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <Button>
                                <Edit3 className="mr-2 h-4 w-4" /> Edit Story Details
                            </Button>
                            <Button variant="default">
                                <BookOpen className="mr-2 h-4 w-4" /> Preview Story
                            </Button>
                            <Button variant="neutral">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Story
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

