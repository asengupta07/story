"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, BookOpen, Brain, Users } from "lucide-react";
import storiesData from "./stories.json";

export default function Home() {
  const [currentStory, setCurrentStory] = useState(0);
  const [currentGame, setCurrentGame] = useState(0);
  const [points, setPoints] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const story = storiesData.stories[currentStory];
  const game = story.games[currentGame];

  const handleAnswer = () => {
    if (answered) return;

    setAnswered(true);
    if (game.type === "poll") {
      setPoints(points + game.points);
      setShowResults(true);
    } else if (selectedAnswer === game.correctAnswer) {
      setPoints(points + game.points);
    }
  };

  const nextGame = () => {
    if (currentGame < story.games.length - 1) {
      setCurrentGame(currentGame + 1);
    } else if (currentStory < storiesData.stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setCurrentGame(0);
    }
    setSelectedAnswer("");
    setAnswered(false);
    setShowResults(false);
  };

  const getGameIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return <Brain className="w-5 h-5" />;
      case "quiz":
        return <BookOpen className="w-5 h-5" />;
      case "poll":
        return <Users className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Story Adventure</h1>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold">{points} points</span>
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{story.title}</h2>
          <p className="text-slate-300 mb-6">{story.content}</p>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            {getGameIcon(game.type)}
            <Badge variant="default" className="capitalize">
              {game.type}
            </Badge>
          </div>

          <h3 className="text-xl font-semibold mb-6">{game.question}</h3>

          <ScrollArea className="h-[300px] rounded-md border border-slate-700 p-4">
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              className="space-y-4"
            >
              {game.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-4 rounded-lg transition-colors ${
                    answered
                      ? option === game.correctAnswer
                        ? "bg-green-900/20"
                        : selectedAnswer === option
                        ? "bg-red-900/20"
                        : "bg-slate-900/20"
                      : "hover:bg-slate-700/30"
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    disabled={answered}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                  {showResults && (
                    <Badge variant="default" className="ml-2">
                      25%
                    </Badge>
                  )}
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>

          <div className="flex justify-between mt-6">
            <Button
              onClick={handleAnswer}
              disabled={!selectedAnswer || answered}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Answer
            </Button>
            {answered && (
              <Button
                onClick={nextGame}
                className="bg-green-600 hover:bg-green-700"
              >
                Next {currentGame === story.games.length - 1 ? "Story" : "Question"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
