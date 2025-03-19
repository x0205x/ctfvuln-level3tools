"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function CryptoTools() {
  const [caesarInput, setCaesarInput] = useState("")
  const [caesarOutput, setCaesarOutput] = useState("")
  const [caesarShift, setCaesarShift] = useState([3])

  const [vigenereInput, setVigenereInput] = useState("")
  const [vigenereKey, setVigenereKey] = useState("")
  const [vigenereOutput, setVigenereOutput] = useState("")

  // Caesar cipher implementation
  const handleCaesarCipher = (decrypt = false) => {
    const shift = decrypt ? 26 - caesarShift[0] : caesarShift[0]
    const result = caesarInput
      .split("")
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0)
          const isUpperCase = code >= 65 && code <= 90
          const base = isUpperCase ? 65 : 97
          return String.fromCharCode(((code - base + shift) % 26) + base)
        }
        return char
      })
      .join("")
    setCaesarOutput(result)
  }

  // Vigenere cipher implementation
  const handleVigenereCipher = (decrypt = false) => {
    if (!vigenereKey) return

    const result = vigenereInput
      .split("")
      .map((char, i) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0)
          const isUpperCase = code >= 65 && code <= 90
          const base = isUpperCase ? 65 : 97

          const keyChar = vigenereKey[i % vigenereKey.length].toUpperCase()
          const keyShift = keyChar.charCodeAt(0) - 65

          if (decrypt) {
            return String.fromCharCode(((code - base - keyShift + 26) % 26) + base)
          } else {
            return String.fromCharCode(((code - base + keyShift) % 26) + base)
          }
        }
        return char
      })
      .join("")
    setVigenereOutput(result)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptography Tools</CardTitle>
        <CardDescription>Common cryptographic algorithms used in CTF challenges</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="caesar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="caesar">Caesar Cipher</TabsTrigger>
            <TabsTrigger value="vigenere">Vigenère Cipher</TabsTrigger>
          </TabsList>

          <TabsContent value="caesar" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="caesar-input">Input Text</Label>
              <Input
                id="caesar-input"
                placeholder="Enter text to encrypt/decrypt"
                value={caesarInput}
                onChange={(e) => setCaesarInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="caesar-shift">Shift Amount: {caesarShift[0]}</Label>
              </div>
              <Slider id="caesar-shift" min={1} max={25} step={1} value={caesarShift} onValueChange={setCaesarShift} />
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => handleCaesarCipher(false)} className="flex-1">
                Encrypt
              </Button>
              <Button onClick={() => handleCaesarCipher(true)} className="flex-1">
                Decrypt
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caesar-output">Result</Label>
              <Input id="caesar-output" readOnly value={caesarOutput} />
            </div>
          </TabsContent>

          <TabsContent value="vigenere" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="vigenere-input">Input Text</Label>
              <Input
                id="vigenere-input"
                placeholder="Enter text to encrypt/decrypt"
                value={vigenereInput}
                onChange={(e) => setVigenereInput(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vigenere-key">Key</Label>
              <Input
                id="vigenere-key"
                placeholder="Enter encryption key"
                value={vigenereKey}
                onChange={(e) => setVigenereKey(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => handleVigenereCipher(false)} className="flex-1">
                Encrypt
              </Button>
              <Button onClick={() => handleVigenereCipher(true)} className="flex-1">
                Decrypt
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vigenere-output">Result</Label>
              <Input id="vigenere-output" readOnly value={vigenereOutput} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

