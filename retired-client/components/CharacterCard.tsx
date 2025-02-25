import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Character } from "./CharacterForm"

interface CharacterCardProps {
  character: Character
  index: number
  onRemove: () => void
}

export function CharacterCard({ character, index, onRemove }: CharacterCardProps) {
  return (
    <Card>
      <CardHeader>
        <h4 className="text-md font-semibold">Character {index + 1}</h4>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Name:</strong> {character.name}
        </p>
        <p>
          <strong>Description:</strong> {character.description}
        </p>
        <p>
          <strong>Role:</strong> {character.role}
        </p>
        <p>
          <strong>Backstory:</strong> {character.backstory}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onRemove} variant="default" className="w-full">
          Delete Character
        </Button>
      </CardFooter>
    </Card>
  )
}

