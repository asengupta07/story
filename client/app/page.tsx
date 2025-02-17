"use client";

import type React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, Coins, PenTool, Sparkles, Users } from "lucide-react";
import LoginButton from "@/components/functions/ConnectButton";
import NavBar from "@/components/functions/NavBar";
import { useAccount } from "wagmi";

export default function LandingPage() {
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      console.log(address);
    }
  }, [address]);
  
  return (
    <div className="flex min-h-screen flex-col items-center">
      <NavBar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-28">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="default" className="mb-4 mt-12">
                The Future of Storytelling
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-r from-purple-600 dark:to-white to-black bg-clip-text text-transparent">
                  Where Stories 
                </span>
                {" "}Come Alive 
                <br />
                Through{" "}
                <span className="bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
                  Web3 Innovation
                </span>
              </h1>
              <p className="mb-8 text-xl text-muted-foreground">
                Join a revolutionary platform where stories evolve, readers
                decide, and creators thrive through interactive storytelling
                powered by blockchain technology.
              </p>
              <div className="flex justify-center gap-4 items-center">
                <LoginButton />
                <Button size="lg" variant="default">
                  Explore Stories
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.100),transparent)]" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/50">
          <div className="container">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Redefining Storytelling
              </h2>
              <p className="text-xl text-muted-foreground">
                Experience the perfect blend of creativity and technology
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<PenTool />}
                title="Flexible Creation"
                description="Write manually or use AI assistance to craft engaging narratives that captivate your audience"
              />
              <FeatureCard
                icon={<Users />}
                title="Reader Engagement"
                description="Engage readers with interactive choices, quizzes, and predictions that shape the story"
              />
              <FeatureCard
                icon={<Coins />}
                title="Token Rewards"
                description="Earn $STORY tokens for creating content, participating in stories, and building your audience"
              />
              <FeatureCard
                icon={<Sparkles />}
                title="AI-Powered Tools"
                description="Enhanced creativity with AI-assisted plot development, character creation, and story branching"
              />
              <FeatureCard
                icon={<Code />}
                title="Web3 Integration"
                description="Seamless blockchain integration for transparent monetization and ownership tracking"
              />
              <FeatureCard
                icon={<BookOpen />}
                title="Dynamic Stories"
                description="Create branching narratives where reader choices lead to unique story outcomes"
              />
            </div>
          </div>
        </section>

        {/* Creator/Reader Tabs Section */}
        <section className="py-24">
          <div className="container">
            <Tabs defaultValue="creators" className="mx-auto max-w-4xl">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="creators">For Creators</TabsTrigger>
                <TabsTrigger value="readers">For Readers</TabsTrigger>
              </TabsList>
              <TabsContent value="creators" className="mt-8">
                <Card className="p-6">
                  <h3 className="mb-4 text-2xl font-bold">
                    Empower Your Creativity
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Flexible Writing Modes</h4>
                      <p className="text-muted-foreground">
                        Choose between manual writing or AI assistance to bring
                        your stories to life
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Monetization Options</h4>
                      <p className="text-muted-foreground">
                        Earn through subscriptions, token rewards, and reader
                        support
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="readers" className="mt-8">
                <Card className="p-6">
                  <h3 className="mb-4 text-2xl font-bold">
                    Shape the Stories You Love
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Interactive Reading</h4>
                      <p className="text-muted-foreground">
                        Make choices that influence story outcomes and earn
                        rewards for participation
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Community Engagement</h4>
                      <p className="text-muted-foreground">
                        Connect with creators and other readers through
                        predictions and discussions
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Token Section */}
        <section id="tokens" className="py-24 bg-muted/50">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                $STORY Tokens
              </h2>
              <p className="mb-8 text-xl text-muted-foreground">
                Power the storytelling economy with our native token
              </p>
              <Card className="backdrop-blur-sm bg-background/60">
                <div className="grid gap-6 p-6 md:grid-cols-3">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary">Create</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn tokens for publishing stories
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary">Engage</h3>
                    <p className="text-sm text-muted-foreground">
                      Get rewarded for participation
                    </p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary">Trade</h3>
                    <p className="text-sm text-muted-foreground">
                      Exchange tokens for benefits
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                Join the Story Revolution
              </h2>
              <p className="mb-8 text-xl text-muted-foreground">
                Be part of the future of interactive storytelling
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600"
                >
                  Create Your Story
                </Button>
                <Button size="lg" variant="default">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center gap-4 text-center md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">StoryBoard</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StoryBoard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 backdrop-blur-sm bg-background/60">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}
