import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CharacterCard } from "@/components/CharacterCard"

export interface Character {
    name: string
    description: string
    role: string
    backstory: string
}

interface CharacterFormProps {
    onAddCharacter: (character: Character) => void
    onRemoveCharacter: (index: number) => void
    characters: Character[]
}

export function CharacterForm({ onAddCharacter, onRemoveCharacter, characters }: CharacterFormProps) {
    const [newCharacter, setNewCharacter] = useState<Character>({
        name: "",
        description: "",
        role: "",
        backstory: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewCharacter((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddCharacter = () => {
        onAddCharacter(newCharacter)
        setNewCharacter({ name: "", description: "", role: "", backstory: "" })
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Characters
                <p className="text-base font-light text-muted-foreground">These are the characters that will be in your story... Bring your fantasies to life!</p>
            </h3>
            {characters.map((character, index) => (
                <CharacterCard key={index} character={character} index={index} onRemove={() => onRemoveCharacter(index)} />
            ))}
            <Card>
                <CardHeader>
                    <h4 className="text-md font-semibold">Add New Character</h4>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={newCharacter.name} placeholder="Dorothy" onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            value={newCharacter.description}
                            placeholder="A young girl named Dorothy"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" name="role" value={newCharacter.role} placeholder="Wizard" onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="backstory">Backstory</Label>
                        <Textarea
                            id="backstory"
                            name="backstory"
                            value={newCharacter.backstory}
                            placeholder="Once upon a time, a young girl named Dorothy lived in a small house with her dog, Toto. One day, a tornado came and took her to a magical land called Oz."
                            onChange={handleInputChange}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleAddCharacter} type="button" className="w-full">
                        Add Character
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

