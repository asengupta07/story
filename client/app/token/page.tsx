"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ArrowDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGasPrice, useWriteContract } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { formatEther, parseEther } from "viem";
import { abi, contractAddress } from "../abi";

export default function TokenSwap() {
  const { data: gasData, refetch } = useGasPrice({
    chainId: polygonAmoy.id,
  });
  const [polAmount, setPolAmount] = useState("");
  const [storyAmount, setStoryAmount] = useState("");
  const [gasFee, setGasFee] = useState("0.000");
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();
  const exchangeRate = 10000;

  function handleSwap() {
    setIsLoading(true);

    const tx = writeContractAsync(
      {
        abi: abi,
        address: contractAddress,
        functionName: "buyPresaleTokens",
        value: parseEther(polAmount),
      },
      {
        onSuccess: () => {
          console.log("Transaction successful", tx);
        },
        onError: () => {
          console.log("Transaction failed");
        },
      }
    );
    setIsLoading(false);
  }

  useEffect(() => {
    const calculatedStory = Number.parseFloat(polAmount) * exchangeRate;
    setStoryAmount(isNaN(calculatedStory) ? "" : calculatedStory.toString());
  }, [polAmount]);

  useEffect(() => {
    const fetchGasFee = () => {
      refetch().then(({ data }) => {
        if (data) {
          setGasFee(formatEther(data)); // Convert from Wei to ETH
        }
        console.log(data);
        console.log("gasFee", gasFee);
      });
    };

    fetchGasFee();
    const interval = setInterval(fetchGasFee, 1000); // Fetch every second
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-bg relative">
        <Link
          href="/"
          className="absolute top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 transition-colors duration-200"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to Home</span>
        </Link>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Swap POL for $STORY
            </CardTitle>
            <CardDescription className="text-center">
              Exchange POL for $STORY tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="eth-amount" className="text-sm font-medium">
                  You pay
                </label>
                <Input
                  id="eth-amount"
                  type="number"
                  placeholder="0.0"
                  value={polAmount}
                  onChange={(e) => setPolAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                />
                <div className="text-sm">POL</div>
              </div>
              <div className="flex justify-center">
                <ArrowDown />
              </div>
              <div className="space-y-2">
                <label htmlFor="Story-amount" className="text-sm font-medium">
                  You receive
                </label>
                <Input
                  id="Story-amount"
                  type="number"
                  placeholder="0.0"
                  value={storyAmount}
                  readOnly
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                />
                <div className="text-sm">$STORY</div>
              </div>
            </div>
            <div className="mt-6 text-sm">
              <div className="flex justify-between">
                <span>Exchange rate:</span>
                <span>1 POL = {exchangeRate.toLocaleString()} $STORY</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Estimated gas fee:</span>
                <span>{gasFee} POL</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="default"
              onClick={handleSwap}
              disabled={!polAmount || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Swapping...
                </>
              ) : (
                "Swap"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
