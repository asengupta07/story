"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Clock, Coins, Sparkles } from "lucide-react"
import NavBar from "@/components/functions/NavBar"
import { useParams } from "next/navigation"

export default function PerkPurchasePage() {
    const { storyId } = useParams()
    const { toast } = useToast()
    const [selectedPerk, setSelectedPerk] = useState(null)
    const [userNativeTokens, setUserNativeTokens] = useState(1000)
    const [userStoryTokens, setUserStoryTokens] = useState(500)
    const [purchaseType, setPurchaseType] = useState("")
    const [tokenBalance, setTokenBalance] = useState<string | null>(null);
    const [storyDetails, setStoryDetails] = useState<any>(null);
    const [dateString, setDateString] = useState("2022-12-31")
    const [intStoryTokens, setIntStoryTokens] = useState(0)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // Debug mount/unmount
    useEffect(() => {
        console.log("Component mounted/updated");
        return () => console.log("Component will unmount");
    }, []);

    // Debug storyId changes
    useEffect(() => {
        console.log("storyId changed:", storyId);
    }, [storyId]);

    // Debug storyDetails changes
    useEffect(() => {
        console.log("storyDetails changed:", storyDetails);
    }, [storyDetails]);

    // Main data fetching effect
    useEffect(() => {
        console.log("Main useEffect triggered, storyId:", storyId);

        if (!storyId) {
            console.log("No storyId available yet");
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch story details
                console.log("Fetching story details for storyId:", storyId);
                const storyRes = await fetch(`/api/getStory/${storyId}`);
                if (!storyRes.ok) throw new Error(`Failed to fetch story details: ${storyRes.statusText}`);
                const storyData = await storyRes.json();
                setStoryDetails(storyData);

                // Fetch created at date
                console.log("Fetching created at date for storyId:", storyId);
                const dateRes = await fetch(`/api/getCreatedAt?storyId=${storyId}`);
                if (!dateRes.ok) throw new Error(`Failed to fetch created at date: ${dateRes.statusText}`);
                const dateData = await dateRes.json();
                setDateString(dateData.createdAt);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [storyId]);

    // Token balance effect

    const perks = [
        {
            id: 1,
            name: "Introduce a New Character",
            description: "Create a brand new character to join the story!",
            nativeCost: 500,
            storyCost: 250,
            cooldown: 5,
            available: true,
        },
        {
            id: 2,
            name: "Plot Twist Suggestion",
            description: "Suggest an unexpected turn of events!",
            nativeCost: 300,
            storyCost: 150,
            cooldown: 3,
            available: true,
        },
        {
            id: 3,
            name: "Exclusive Chapter Sneak Peek",
            description: "Get early access to the next chapter!",
            nativeCost: 200,
            storyCost: 100,
            cooldown: 0,
            available: true,
        },
        {
            id: 4,
            name: "Alter a Character's Fate",
            description: "Change the destiny of an existing character!",
            nativeCost: 750,
            storyCost: 375,
            cooldown: 7,
            available: false,
        },
    ]

    const featuredPerks = [
        { user: "StoryLover42", perk: "Introduced Detective Sarah", chapter: 7 },
        { user: "PlotTwister", perk: "Added unexpected ally reveal", chapter: 12 },
    ]

    const activePerks = [
        { name: "Plot Twist Suggestion", status: "Pending", cooldown: 2 },
        { name: "Exclusive Chapter Sneak Peek", status: "Used", cooldown: 0 },
    ]

    const handlePerkPurchase = (perk: any) => {
        const cost = purchaseType === "native" ? perk.nativeCost : perk.storyCost
        const userBalance = purchaseType === "native" ? userNativeTokens : userStoryTokens
        const setUserBalance = purchaseType === "native" ? setUserNativeTokens : setUserStoryTokens
        const tokenName = purchaseType === "native" ? "Native Tokens" : "Story Tokens"
        console.log("TODO hai bhai kuchh aur kar jaa ke")
    }

    if (isLoading) {
        return <div className="min-h-screen bg-bg p-8 flex items-center justify-center">
            <p>Loading story details...</p>
        </div>
    }

    if (error) {
        return <div className="min-h-screen bg-bg p-8 flex items-center justify-center">
            <p>Error: {error}</p>
        </div>
    }

    if (!storyDetails) {
        return <div className="min-h-screen bg-bg p-8 flex items-center justify-center">
            <p>No story details available</p>
        </div>
    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-bg p-4 sm:p-6 md:p-8">
                <header className="mb-6 md:mb-8 text-center max-w-3xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{storyDetails.title}</h1>
                    <div className="flex flex-col items-center space-y-2 mb-3 md:mb-4">
                        <div>
                            <p className="text-lg sm:text-xl">by {storyDetails.alias}</p>
                            <p className="text-xs sm:text-sm opacity-75">Genre: {storyDetails.genre}</p>
                        </div>
                    </div>
                    <p className="mb-4 text-sm sm:text-base px-4">
                        {storyDetails.premise}
                    </p>
                    <div className="flex justify-center space-x-4 text-sm sm:text-base">
                        <div className="flex items-center bg-purple-900/30 rounded-lg px-3 py-1.5">
                            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 mr-2 text-pink-400" />
                            <span>{intStoryTokens ? Number(intStoryTokens).toFixed(3) : 0} $INT</span>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto">
                    <Tabs defaultValue="available-perks" className="mb-8">
                        <TabsList className="w-full grid grid-cols-3 h-auto">
                            <TabsTrigger value="available-perks" className="text-xs sm:text-sm py-2">Available Perks</TabsTrigger>
                            <TabsTrigger value="my-perks" className="text-xs sm:text-sm py-2">My Active Perks</TabsTrigger>
                            <TabsTrigger value="featured-perks" className="text-xs sm:text-sm py-2">Featured Perks</TabsTrigger>
                        </TabsList>

                        <TabsContent value="available-perks" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {perks.map((perk) => (
                                <Card
                                    key={perk.id}
                                    className={`${perk.available ? "opacity-100" : "opacity-50"}`}
                                >
                                    <CardHeader className="p-4 sm:p-6">
                                        <CardTitle className="flex justify-between items-center text-base sm:text-lg">
                                            <span className="mr-2">{perk.name}</span>
                                            {perk.cooldown > 0 && (
                                                <Badge variant="neutral" className="text-xs whitespace-nowrap">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {perk.cooldown}ch
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="text-sm">{perk.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 sm:p-6 pt-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm sm:text-base font-bold flex items-center">
                                                <Coins className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-yellow-700" />
                                                {perk.nativeCost}
                                            </p>
                                            <p className="text-sm sm:text-base font-bold flex items-center">
                                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1 text-pink-400" />
                                                {perk.storyCost}
                                            </p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full sm:w-[48%] text-sm" disabled={!perk.available} onClick={() => setPurchaseType("native")}>
                                                    Buy with $STORY
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-purple-900 text-white max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Purchase {perk.name}</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to purchase this perk for{" "}
                                                        {purchaseType === "native" ? perk.nativeCost : perk.storyCost}{" "}
                                                        {purchaseType === "native" ? "Native" : "Story"} Tokens?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {perk.name === "Introduce a New Character" && (
                                                    <div className="space-y-4">
                                                        <Input placeholder="Character Name" />
                                                        <Textarea placeholder="Character Description" />
                                                        <Textarea placeholder="Character Backstory" />
                                                        <Input placeholder="Role in the story" />
                                                    </div>
                                                )}
                                                {perk.name === "Plot Twist Suggestion" && (
                                                    <Textarea placeholder="Describe your plot twist (max 500 characters)" maxLength={500} />
                                                )}
                                                <DialogFooter>
                                                    <Button onClick={() => handlePerkPurchase(perk)}>Confirm and Pay</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="w-full sm:w-[48%] text-sm" disabled={!perk.available} onClick={() => setPurchaseType("story")}>
                                                    Buy with $INT
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="text-white max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Purchase {perk.name}</DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to purchase this perk for{" "}
                                                        {purchaseType === "native" ? perk.nativeCost : perk.storyCost}{" "}
                                                        {purchaseType === "native" ? "Native" : "Story"} Tokens?
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {perk.name === "Introduce a New Character" && (
                                                    <div className="space-y-4">
                                                        <Input placeholder="Character Name" />
                                                        <Textarea placeholder="Character Description" />
                                                        <Textarea placeholder="Character Backstory" />
                                                        <Input placeholder="Role in the story" />
                                                    </div>
                                                )}
                                                {perk.name === "Plot Twist Suggestion" && (
                                                    <Textarea placeholder="Describe your plot twist (max 500 characters)" maxLength={500} />
                                                )}
                                                <DialogFooter>
                                                    <Button onClick={() => handlePerkPurchase(perk)}>Confirm and Pay</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="my-perks">
                            <div className="space-y-4">
                                {activePerks.map((perk, index) => (
                                    <Card key={index} className="bg-main">
                                        <CardHeader>
                                            <CardTitle>{perk.name}</CardTitle>
                                            <CardDescription>Status: {perk.status}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {perk.cooldown > 0 && (
                                                <p className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    Cooldown: {perk.cooldown} chapters
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="featured-perks">
                            <div className="space-y-4">
                                {featuredPerks.map((perk, index) => (
                                    <Card key={index} className="">
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
                                                {perk.perk}
                                            </CardTitle>
                                            <CardDescription>
                                                by {perk.user} in Chapter {perk.chapter}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <section className="mb-6 md:mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">Rules & Guidelines</h2>
                        <Accordion type="single" collapsible className="rounded-lg">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Perk Restrictions</AccordionTrigger>
                                <AccordionContent>
                                    Some perks have cooldown periods. For example, introducing a character locks that perk for 5 chapters.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Creativity Guidelines</AccordionTrigger>
                                <AccordionContent>
                                    Be creative with your perks, but please respect the story&apos;s tone and genre. The author reserves the
                                    right to adjust submissions as needed.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">Support & FAQ</h2>
                        <Accordion type="single" collapsible className="rounded-lg">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>How do perks work?</AccordionTrigger>
                                <AccordionContent>
                                    Perks allow you to influence the story. Once purchased, the author will incorporate your perk into the
                                    narrative within the next few chapters.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Can I get a refund?</AccordionTrigger>
                                <AccordionContent>
                                    Refunds are available within 24 hours of purchase if the perk hasn&apos;t been implemented yet. Contact
                                    support for assistance.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>How long does it take for my perk to appear in the story?</AccordionTrigger>
                                <AccordionContent>
                                    Typically, perks are implemented within 1-3 chapters after purchase, depending on the current storyline
                                    and the nature of the perk.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>What&apos;s the difference between Native and Story Tokens?</AccordionTrigger>
                                <AccordionContent>
                                    Native Tokens can be used across all stories on the platform, while Story Tokens are specific to this
                                    story. Story Tokens may offer better rates but are limited to this narrative.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>
                </main>

                <footer className="mt-8 md:mt-12 text-center text-xs sm:text-sm opacity-75">
                    <p>© 2025 The Enchanted Chronicles. All rights reserved.</p>
                </footer>
            </div>
        </>
    )
}