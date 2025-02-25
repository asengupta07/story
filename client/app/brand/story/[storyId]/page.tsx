"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Book, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import NavBar from "@/components/functions/NavBar"
import { useParams } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"


interface StoryDetails {
    title: string;
    author: string;
    genre: string;
    premise: string;
    setting: string;
    themes: string;
    targetAudience: string;
}

interface ChapterRecap {
    title: string;
    recap: string;
}

export default function BrandDealPage() {
    const { storyId } = useParams();
    const { toast } = useToast()
    const { user } = usePrivy()
    const [formData, setFormData] = useState({
        brandName: "",
        productName: "",
        productDescription: "",
    })
    const [storyDetails, setStoryDetails] = useState<StoryDetails>({
        title: "",
        author: "",
        genre: "",
        premise: "",
        setting: "",
        themes: "",
        targetAudience: "",
    })
    const [chapterRecaps, setChapterRecaps] = useState<ChapterRecap[]>([])
    const [existingBrandDeals, setExistingBrandDeals] = useState<{ brand: string, description: string }[]>([])

    const fetchStoryDetails = async () => {
        try {
            const response = await fetch(`/api/deal?storyId=${storyId}`)
            const data = await response.json()
            setStoryDetails(data.storyDetails)
            setChapterRecaps(data.chapterRecaps)
            setExistingBrandDeals(data.existingBrandDeals)
        } catch (error) {
            console.error("Error fetching story details:", error)
        }
    }

    useEffect(() => {
        fetchStoryDetails()
    }, [storyId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
        const payload = {
            name: formData.brandName,
            product: formData.productName,
            description: formData.productDescription,
            storyId: storyId,
            publicKey: user?.wallet?.address,
        }
        const res = await fetch(`/api/deal`, {
            method: "POST",
            body: JSON.stringify(payload),
        })
        if (res.ok) {
            toast({
                title: "Proposal Submitted",
                description: "Your brand deal proposal has been successfully submitted.",
                action: <ToastAction className="text-black" altText="Okay">Okay</ToastAction>,
            })
            setFormData({ brandName: "", productName: "", productDescription: "" })
            fetchStoryDetails()
        } else {
            toast({
                title: "Error Submitting Proposal",
                description: "Please try again.",
            })
        }
    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-background text-foreground">
                <header className="bg-primary text-primary-foreground py-6">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-bold">{storyDetails.title} - Brand Deal Opportunities</h1>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main content area */}
                        <div className="lg:w-2/3">
                            {/* Story Details Section */}
                            <Card className="mb-8">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row">
                                        <div>
                                            <CardTitle className="text-2xl mb-2">{storyDetails.title}</CardTitle>
                                            <CardDescription className="text-lg mb-2">by {storyDetails.author}</CardDescription>
                                            <p className="mb-2">
                                                <strong>Genre:</strong> {storyDetails.genre}
                                            </p>
                                            <p className="mb-4">{storyDetails.premise}</p>
                                            <div className="mb-2">
                                                <strong>Setting:</strong> {storyDetails.setting}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Themes:</strong> {storyDetails.themes}
                                            </div>
                                            <div>
                                                <strong>Target Audience:</strong> {storyDetails.targetAudience}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Latest Chapter Recap Section */}
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>Latest Chapter Recaps</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full ">
                                        {chapterRecaps.map((chapter, index) => (
                                            <AccordionItem value={`item-${index}`} key={index} className="my-4">
                                                <AccordionTrigger>{chapter.title}</AccordionTrigger>
                                                <AccordionContent>
                                                    <p>{chapter.recap}</p>
                                                    <Button variant="default" className="mt-2 p-4">
                                                        <Book className="w-4 h-4 mr-1" />
                                                        Read Full Chapter
                                                    </Button>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>

                            {/* Previous Brand Deals Section */}
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>Existing Brand Integrations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {existingBrandDeals.map((deal, index) => (
                                        <div key={index} className="mb-4 last:mb-0">
                                            <h3 className="text-lg font-medium">{deal.brand}</h3>
                                            <p>{deal.description}</p>
                                            {index < existingBrandDeals.length - 1 && <Separator className="my-4" />}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Guidelines for Brand Integration */}
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>Guidelines for Brand Integration</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Ensure product placements align with the futuristic, space-station setting.</li>
                                        <li>Consider how your brand can enhance cross-cultural interactions in the story.</li>
                                        <li>Focus on sustainable and innovative products that fit the eco-conscious theme.</li>
                                        <li>Aim for subtle integrations that feel natural to the characters and plot.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar - Brand Deal Proposal Form */}
                        <div className="lg:w-1/3">
                            <Card className="sticky top-[5rem] mb-8">
                                <CardHeader>
                                    <CardTitle>Propose a Brand Deal</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="brandName" className="text-sm font-medium">
                                                    Brand Name
                                                </label>
                                                <Input
                                                    id="brandName"
                                                    name="brandName"
                                                    value={formData.brandName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="productName" className="text-sm font-medium">
                                                    Product Name
                                                </label>
                                                <Input
                                                    id="productName"
                                                    name="productName"
                                                    value={formData.productName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="productDescription" className="text-sm font-medium">
                                                    Product Description
                                                </label>
                                                <Textarea
                                                    id="productDescription"
                                                    name="productDescription"
                                                    value={formData.productDescription}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-4 mb-4">
                                            Note: Brand integration should feel organic and relevant to the story&apos;s themes and setting.
                                        </p>
                                        <Button type="submit" className="w-full">
                                            <Send className="w-4 h-4 mr-2" />
                                            Submit Proposal
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Contact & Support Info */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Contact & Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>For brand partnership inquiries or support with submitting deals, please contact:</p>
                            <p className="font-medium">partnerships@storyboard.com</p>
                        </CardContent>
                    </Card>
                </main>

                {/* Navigation & Actions */}
                <footer className="bg-secondary text-secondary-foreground py-4">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <Button variant="default" className="text-secondary-foreground">
                            Return to Main Story Page
                        </Button>
                        <Button variant="default">Preview Past Integrations</Button>
                    </div>
                </footer>
            </div>
        </>
    )
}

