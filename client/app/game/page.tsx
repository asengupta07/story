"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

// JSON data for games
const gamesData = {
  quiz: [
    {
      question:
        "What do you think will happen to the main character in the next chapter?",
      options: [
        "They will discover a hidden treasure",
        "They will face a dangerous enemy",
        "They will make a new ally",
        "They will uncover a family secret",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Which supporting character is most likely to betray the protagonist?",
      options: [
        "The loyal sidekick",
        "The mysterious stranger",
        "The childhood friend",
        "The wise mentor",
      ],
      correctAnswer: 1,
    },
  ],
  poll: [
    {
      question:
        "What setting would you like to see in the next part of the story?",
      options: [
        "A bustling city",
        "A remote island",
        "A mystical forest",
        "An ancient ruins",
      ],
    },
    {
      question: "Which plot twist would you find most exciting?",
      options: [
        "The villain is actually the hero's parent",
        "The entire story was a dream",
        "A time travel element is introduced",
        "The protagonist has a secret superpower",
      ],
    },
  ],
  prediction: [
    {
      question: "Predict the outcome of the upcoming battle:",
      options: [
        "The hero will win decisively",
        "The hero will lose but escape",
        "It will end in a draw",
        "An unexpected ally will intervene",
      ],
      correctAnswer: 3,
    },
    {
      question: "What will be the main character's next major decision?",
      options: [
        "To seek revenge",
        "To forgive their enemy",
        "To abandon their quest",
        "To sacrifice themselves for others",
      ],
      correctAnswer: 1,
    },
  ],
};

export default function StoryGames() {
  const [gameType, setGameType] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleGameTypeSelect = (type: string) => {
    setGameType(type);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  const handleAnswerSubmit = () => {
    if (gameType === "poll") {
      setScore(score + 1); // In polls, any answer gives a point
    } else {
      const currentGame = gamesData[gameType as keyof typeof gamesData];
      //   if (
      //     Number.parseInt(selectedAnswer) ===
      //     currentGame[currentQuestion].correctAnswer
      //   ) {
      //     setScore(score + 1);
      //   }
    }

    if (
      currentQuestion <
      gamesData[gameType as keyof typeof gamesData].length - 1
    ) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      setShowResult(true);
    }
  };

  const renderGameSelection = () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Choose a Game Type</CardTitle>
        <CardDescription>
          Select the type of story-based game you want to play
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={handleGameTypeSelect}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="quiz" id="quiz" />
            <Label htmlFor="quiz">Quiz</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poll" id="poll" />
            <Label htmlFor="poll">Poll</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="prediction" id="prediction" />
            <Label htmlFor="prediction">Prediction</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );

  const renderGame = () => {
    const currentGame = gamesData[gameType as keyof typeof gamesData];
    const currentQ = currentGame[currentQuestion];

    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {gameType.charAt(0).toUpperCase() + gameType.slice(1)}
          </CardTitle>
          <CardDescription>
            Question {currentQuestion + 1} of {currentGame.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{currentQ.question}</p>
          <RadioGroup onValueChange={setSelectedAnswer}>
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
            Submit Answer
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderResult = () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Game Over</CardTitle>
        <CardDescription>Here's how you did</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">
          Your Score: {score}/
          {gamesData[gameType as keyof typeof gamesData].length}
        </p>
        <Progress
          value={
            (score / gamesData[gameType as keyof typeof gamesData].length) * 100
          }
          className="w-full"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={() => setGameType("")}>Play Again</Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Story-based Mini Games</h1>
        {!gameType && renderGameSelection()}
        {gameType && !showResult && renderGame()}
        {showResult && renderResult()}
      </div>
    </div>
  );
}
