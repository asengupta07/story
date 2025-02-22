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
import { Book, Trophy, PieChart, Zap, ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"

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


  const fetchGames = async () => {
    const response = await fetch(`/api/createGames?storyId=${storyId}`)
    const data = await response.json()
    console.log("Data: ", data)
    setQuiz(data.quiz)
    setPoll(data.poll)
    setPredictions(data.predictions)
  }

  useEffect(() => {
    fetchGames()
  }, [storyId])

  const handleAnswerSubmit = () => {
    if (selectedAnswer === QUIZ_CONFIG.questions[currentQuestionIndex].correctAnswer) {
      setQuizScore(quizScore + 1)
    }
    if (currentQuestionIndex < QUIZ_CONFIG.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer("")
    } else {
      setQuizCompleted(true)
      setUserStats((prev) => ({ ...prev, quizzes: prev.quizzes + 1 }))
      if (quizScore === QUIZ_CONFIG.questions.length) {
        setShowAchievement(true)
        setTimeout(() => setShowAchievement(false), ACHIEVEMENT_CONFIG.displayDuration)
      }
    }
  }

  const handlePollVote = (option: PollOption) => {
    setPollVotes((prev) => ({ ...prev, [option]: prev[option] + 1 }))
    setUserStats((prev) => ({ ...prev, polls: prev.polls + 1 }))
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

  return (
    <div className="min-h-screen p-8 bg-bg">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="neutral" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <CardTitle className="text-3xl font-bold text-center">
              {GAME_CONFIG.title}
            </CardTitle>
          </div>
          <CardDescription className="text-center text-lg mt-2">
            {GAME_CONFIG.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-violet-600">
              {GAME_CONFIG.tabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="w-full">
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="quiz">
              <Card className="bg-violet-600">
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {!quizCompleted ? (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                      </h3>
                      <p className="mb-4">{quiz.questions[currentQuestionIndex].question}</p>
                      <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                        {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <RadioGroupItem value={option} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
                      <p className="text-xl mb-4">
                        Your Score: {quizScore} / {quiz.questions.length}
                      </p>
                      <Button onClick={resetQuiz}>Try Again</Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  {!quizCompleted && (
                    <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
                      {currentQuestionIndex < QUIZ_CONFIG.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </Button>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {/* <Progress  */}
                    Progress: {((currentQuestionIndex + 1) / QUIZ_CONFIG.questions.length) * 100}%
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="polls">
              <Card className="bg-violet-600">
                <CardHeader>
                  <CardTitle>{poll.title}</CardTitle>
                  <CardDescription>{poll.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-4">{poll.question}</h3>
                  <div className="space-y-4">
                    {poll.options.map((option) => (
                      <div key={option.id} className="flex items-center justify-between">
                        <Button onClick={() => handlePollVote(option.id as PollOption)} variant="reverse" className="w-full mr-4">
                          {option.label}
                        </Button>
                        <Progress
                          value={(pollVotes[option.id as PollOption] / Object.values(pollVotes).reduce((a, b) => a + b, 0)) * 100}
                          className="w-1/3"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="predictions">
              <Card className="bg-violet-600">
                <CardHeader>
                  <CardTitle>{predictions.title}</CardTitle>
                  <CardDescription>{predictions.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="prediction">Your Prediction</Label>
                    <Input
                      id="prediction"
                      placeholder={predictions.inputPlaceholder}
                      value={prediction}
                      onChange={(e) => setPrediction(e.target.value)}
                    />
                    <Button onClick={handlePredictionSubmit}>Submit Prediction</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Badge variant="default">Quizzes: {userStats.quizzes}</Badge>
            <Badge variant="default">Polls: {userStats.polls}</Badge>
            <Badge variant="default">Predictions: {userStats.predictions}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">Rank: Story Explorer</span>
          </div>
        </CardFooter>
      </Card>

      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-4 right-4 bg-yellow-400 text-yellow-900 p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <span className="font-bold">{ACHIEVEMENT_CONFIG.title}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="max-w-4xl mx-auto mt-12">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Top Readers Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md p-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4 px-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${index}`} />
                  <AvatarFallback>RD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Reader {index + 1}</p>
                  <p className="text-sm text-muted-foreground">Score: {1000 - index * 50}</p>
                </div>
                {index === 0 && <Trophy className="h-5 w-5 text-yellow-500 ml-auto" />}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

