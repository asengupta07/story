"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Book, Trophy, PieChart, Zap } from "lucide-react"
import { useParams } from "next/navigation"
import NavBar from "@/components/functions/NavBar"

type PollOption = 'option1' | 'option2' | 'option3' | 'option4';
type PollVotes = Record<PollOption, number>;

interface Quiz {
  title: string
  description: string
  questions: {
    question: string
    options: string[]
    correctAnswer: string
  }[]
}

interface Poll {
  title: string
  description: string
  question: string
  options: {
    id: string
    label: string
  }[]
}

interface Predictions {
  title: string
  description: string
  inputPlaceholder: string
}

// Content Configuration
const GAME_CONFIG = {
  title: "Interactive Mini-Games",
  description: "Dive deeper into the magical world of our story!",
  tabs: [
    { id: "quiz", label: "Quiz", icon: Book },
    { id: "polls", label: "Polls", icon: PieChart },
    { id: "predictions", label: "Predictions", icon: Zap }
  ]
}

const QUIZ_CONFIG = {
  title: "Story Quiz Challenge",
  description: "Test your knowledge of the latest chapter!",
  questions: [
    {
      question: "Who is the main character's best friend?",
      options: ["Alex", "Sam", "Jordan", "Taylor"],
      correctAnswer: "Sam",
    },
    {
      question: "What is the name of the magical artifact?",
      options: ["Crystal Orb", "Enchanted Sword", "Mystic Amulet", "Ancient Tome"],
      correctAnswer: "Mystic Amulet",
    },
    {
      question: "Where does the story primarily take place?",
      options: ["Enchanted Forest", "Bustling City", "Desert Oasis", "Mountain Kingdom"],
      correctAnswer: "Mountain Kingdom",
    },
  ]
}

const POLL_CONFIG = {
  title: "Reader's Choice Poll",
  description: "Share your opinion on the story's direction!",
  question: "Who is your favorite character?",
  options: [
    { id: "option1", label: "Character 1" },
    { id: "option2", label: "Character 2" },
    { id: "option3", label: "Character 3" }
  ]
}

const PREDICTIONS_CONFIG = {
  title: "Crystal Ball Predictions",
  description: "What do you think will happen next?",
  inputPlaceholder: "Enter your prediction for the next chapter..."
}

const ACHIEVEMENT_CONFIG = {
  title: "Achievement Unlocked: Quiz Master!",
  displayDuration: 3000
}

export default function StoryMiniGame() {
  const { storyId } = useParams()
  const [activeTab, setActiveTab] = useState("quiz")
  const [quiz, setQuiz] = useState<Quiz>(QUIZ_CONFIG)
  const [poll, setPoll] = useState<Poll>(POLL_CONFIG)
  const [predictions, setPredictions] = useState<Predictions>(PREDICTIONS_CONFIG)
  const [quizScore, setQuizScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [pollVotes, setPollVotes] = useState<PollVotes>({ option1: 0, option2: 0, option3: 0, option4: 0 })
  const [prediction, setPrediction] = useState("")
  const [userStats, setUserStats] = useState({ quizzes: 0, polls: 0, predictions: 0 })
  const [showAchievement, setShowAchievement] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dateString, setDateString] = useState("2022-12-31")
  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(null)

  const fetchGames = async () => {
    try {
      const response = await fetch(`/api/createGames?storyId=${storyId}`)
      const data = await response.json()
      console.log("Data: ", data)
      setQuiz(data.quiz)
      setPoll(data.poll)
      setPredictions(data.predictions)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCreatedAt = async () => {
    try {
      const response = await fetch(`/api/getCreatedAt?storyId=${storyId}`)
      const data = await response.json()
      setDateString(data.createdAt)
      console.log("Data: ", data)
    } catch (error) {
      console.error("Error fetching created at date: ", error)
    }
  }

  useEffect(() => {
    fetchGames()
    fetchCreatedAt()
  }, [storyId])

  const handleAnswerSubmit = async () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setQuizScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer("");
    } else {
      setQuizCompleted(true);
      setUserStats(prev => ({ ...prev, quizzes: prev.quizzes + 1 }));

      const finalScore = selectedAnswer === currentQuestion.correctAnswer ?
        quizScore + 1 : quizScore;
      console.log("Final Score: ", finalScore)
      console.log("Quiz Score: ", quizScore)
      if (finalScore === quiz.questions.length) {
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), ACHIEVEMENT_CONFIG.displayDuration);
      }
    }
  };

  const handlePollVote = (option: PollOption) => {
    if (selectedPollOption === option) {
      return;
    }

    if (selectedPollOption) {
      setPollVotes(prev => ({
        ...prev,
        [selectedPollOption as keyof typeof prev]: Math.max(0, prev[selectedPollOption as keyof typeof prev] - 1)
      }))
    }

    setPollVotes(prev => ({ ...prev, [option]: prev[option] + 1 }))
    setSelectedPollOption(option)

    if (!selectedPollOption) {
      setUserStats(prev => ({ ...prev, polls: prev.polls + 1 }))
    }
  }

  const handlePredictionSubmit = () => {
    if (prediction.trim()) {
      setUserStats((prev) => ({ ...prev, predictions: prev.predictions + 1 }))
      setPrediction("")
    }
  }

  const resetQuiz = () => {
    setQuizScore(0)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer("")
  }

  const getTotalVotes = () => {
    return Object.values(pollVotes).reduce((sum, votes) => sum + votes, 0);
  };

  const calculatePollPercentage = (votes: number) => {
    const totalVotes = getTotalVotes();
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-2 sm:p-4 md:p-8 bg-bg">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center flex-grow">
                {GAME_CONFIG.title}
              </CardTitle>
            </div>
            <CardDescription className="text-center text-sm sm:text-base md:text-lg mt-2">
              {GAME_CONFIG.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quiz" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {GAME_CONFIG.tabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="quiz">
                <Card className="bg-[#d385af]">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">{quiz.title}</CardTitle>
                    <CardDescription className="text-sm">{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="p-4 sm:p-6 space-y-4">
                        <div className="h-8 bg-violet-500/50 rounded animate-pulse" />
                        <div className="h-4 bg-violet-500/50 rounded animate-pulse w-3/4" />
                        <div className="space-y-2 mt-4 sm:mt-8">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-10 sm:h-12 bg-violet-500/50 rounded animate-pulse" />
                          ))}
                        </div>
                      </div>
                    ) : (
                      !quizCompleted ? (
                        <div className="p-2 sm:p-4">
                          <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4">
                            Question {currentQuestionIndex + 1} of {quiz.questions.length}
                          </h3>
                          <p className="mb-4 text-sm sm:text-base">{quiz.questions[currentQuestionIndex].question}</p>
                          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                            {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                              <div key={index} className="flex items-center space-x-2 mb-2">
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="text-sm sm:text-base">{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <h3 className="text-xl sm:text-2xl font-bold mb-4">Quiz Completed!</h3>
                          <p className="text-lg sm:text-xl mb-4">
                            Your Score: {quizScore} / {quiz.questions.length}
                          </p>
                          <Button onClick={resetQuiz}>Try Again</Button>
                        </div>
                      )
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                    {!quizCompleted && (
                      <>
                        <Button
                          onClick={handleAnswerSubmit}
                          disabled={!selectedAnswer}
                          className="w-full sm:w-auto"
                        >
                          {currentQuestionIndex < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                        </Button>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <Progress
                            value={((currentQuestionIndex + 1) / quiz.questions.length) * 100}
                            className="w-full sm:w-[100px]"
                          />
                          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {currentQuestionIndex + 1} / {quiz.questions.length}
                          </span>
                        </div>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="polls">
                <Card className="bg-[#d385af]">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">{poll.title}</CardTitle>
                    <CardDescription className="text-sm">{poll.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="p-4 sm:p-6 space-y-4">
                        <div className="h-8 bg-violet-500/50 rounded animate-pulse" />
                        <div className="h-4 bg-violet-500/50 rounded animate-pulse w-2/3" />
                        <div className="space-y-3 mt-4 sm:mt-8">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2 sm:gap-4">
                              <div className="h-10 bg-violet-500/50 rounded animate-pulse flex-grow" />
                              <div className="h-4 bg-violet-500/50 rounded animate-pulse w-16 sm:w-24" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4">{poll.question}</h3>
                        <div className="space-y-3 sm:space-y-4">
                          {poll.options.map((option) => (
                            <div key={option.id} className="flex flex-col gap-2">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <Button
                                  onClick={() => handlePollVote(option.id as PollOption)}
                                  variant={selectedPollOption === option.id ? "default" : "reverse"}
                                  className="w-full sm:w-2/3 h-auto min-h-[2.5rem] whitespace-normal text-left px-4 py-2"
                                >
                                  <span className="text-sm sm:text-base line-clamp-2">
                                    {option.label}
                                    {selectedPollOption === option.id && (
                                      <span className="ml-2 inline-block">✓</span>
                                    )}
                                  </span>
                                </Button>
                                <div className="flex items-center gap-2 w-full sm:w-1/3">
                                  <Progress
                                    value={calculatePollPercentage(pollVotes[option.id as PollOption])}
                                    className="flex-1"
                                  />
                                  <span className="text-xs sm:text-sm w-12 text-right">
                                    {Math.round(calculatePollPercentage(pollVotes[option.id as PollOption]))}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm mt-4 text-right">
                          Total votes: {getTotalVotes()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="predictions">
                <Card className="bg-[#d385af]">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">{predictions.title}</CardTitle>
                    <CardDescription className="text-sm">{predictions.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="p-4 sm:p-6 space-y-4">
                        <div className="h-8 bg-violet-500/50 rounded animate-pulse" />
                        <div className="h-4 bg-violet-500/50 rounded animate-pulse w-1/2" />
                        <div className="h-20 sm:h-24 bg-violet-500/50 rounded animate-pulse mt-4 sm:mt-8" />
                        <div className="h-8 sm:h-10 bg-violet-500/50 rounded animate-pulse w-24 sm:w-32" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Label htmlFor="prediction" className="text-sm sm:text-base">Your Prediction</Label>
                        <Input
                          id="prediction"
                          placeholder={predictions.inputPlaceholder}
                          value={prediction}
                          onChange={(e) => setPrediction(e.target.value)}
                          className="text-sm sm:text-base"
                        />
                        <Button onClick={handlePredictionSubmit} className="w-full sm:w-auto">Submit Prediction</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="text-xs sm:text-sm">Quizzes: {userStats.quizzes}</Badge>
              <Badge variant="default" className="text-xs sm:text-sm">Polls: {userStats.polls}</Badge>
              <Badge variant="default" className="text-xs sm:text-sm">Predictions: {userStats.predictions}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              <span className="font-semibold text-sm sm:text-base">Rank: Story Explorer</span>
            </div>
          </CardFooter>
        </Card>

        <AnimatePresence>
          {showAchievement && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-4 right-4 bg-yellow-400 text-yellow-900 p-3 sm:p-4 rounded-lg shadow-lg max-w-[90vw] sm:max-w-md"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="font-bold text-sm sm:text-base">{ACHIEVEMENT_CONFIG.title}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="max-w-4xl mx-auto mt-6 sm:mt-12">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-black">Top Readers Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded-md p-2 sm:p-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-4 mb-4 px-2 sm:px-4">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarImage src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${index}`} />
                    <AvatarFallback>RD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Reader {index + 1}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Score: {1000 - index * 50}</p>
                  </div>
                  {index === 0 && <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 ml-auto" />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
