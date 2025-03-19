"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EncodingTools() {
  const [base64Input, setBase64Input] = useState("")
  const [base64Output, setBase64Output] = useState("")

  const [hexInput, setHexInput] = useState("")
  const [hexOutput, setHexOutput] = useState("")

  const [urlInput, setUrlInput] = useState("")
  const [urlOutput, setUrlOutput] = useState("")

  // Base64 encoding/decoding
  const handleBase64 = (decode = false) => {
    try {
      if (decode) {
        const result = atob(base64Input.trim())
        setBase64Output(result)
      } else {
        const result = btoa(base64Input)
        setBase64Output(result)
      }
    } catch (e) {
      setBase64Output("Error: Invalid input for this operation")
    }
  }

  // Hex encoding/decoding
  const handleHex = (decode = false) => {
    try {
      if (decode) {
        const result =
          hexInput
            .trim()
            .replace(/\s+/g, "") // Remove whitespace
            .match(/.{1,2}/g) // Split into pairs
            ?.map((byte) => String.fromCharCode(Number.parseInt(byte, 16)))
            .join("") || ""
        setHexOutput(result)
      } else {
        const result = Array.from(hexInput)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(" ")
        setHexOutput(result)
      }
    } catch (e) {
      setHexOutput("Error: Invalid input for this operation")
    }
  }

  // URL encoding/decoding
  const handleUrl = (decode = false) => {
    try {
      if (decode) {
        const result = decodeURIComponent(urlInput)
        setUrlOutput(result)
      } else {
        const result = encodeURIComponent(urlInput)
        setUrlOutput(result)
      }
    } catch (e) {
      setUrlOutput("Error: Invalid input for this operation")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encoding Tools</CardTitle>
        <CardDescription>Common encoding and decoding operations for CTF challenges</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="base64" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="base64">Base64</TabsTrigger>
            <TabsTrigger value="hex">Hex</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>

          <TabsContent value="base64" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="base64-input">Input</Label>
              <Textarea
                id="base64-input"
                placeholder="Enter text to encode/decode"
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => handleBase64(false)} className="flex-1">
                Encode
              </Button>
              <Button onClick={() => handleBase64(true)} className="flex-1">
                Decode
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="base64-output">Result</Label>
              <Textarea id="base64-output" readOnly value={base64Output} className="min-h-[100px]" />
            </div>
          </TabsContent>

          <TabsContent value="hex" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="hex-input">Input</Label>
              <Textarea
                id="hex-input"
                placeholder="Enter text to encode or hex to decode"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => handleHex(false)} className="flex-1">
                Text to Hex
              </Button>
              <Button onClick={() => handleHex(true)} className="flex-1">
                Hex to Text
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hex-output">Result</Label>
              <Textarea id="hex-output" readOnly value={hexOutput} className="min-h-[100px]" />
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="url-input">Input</Label>
              <Textarea
                id="url-input"
                placeholder="Enter text to encode/decode"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => handleUrl(false)} className="flex-1">
                Encode
              </Button>
              <Button onClick={() => handleUrl(true)} className="flex-1">
                Decode
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url-output">Result</Label>
              <Textarea id="url-output" readOnly value={urlOutput} className="min-h-[100px]" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

