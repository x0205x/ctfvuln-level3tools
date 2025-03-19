"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ForensicsTools() {
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [hexDump, setHexDump] = useState<string>("")
  const [stringExtract, setStringExtract] = useState<string>("")

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileType(file.type || "Unknown")
    setFileSize(file.size)

    const reader = new FileReader()

    reader.onload = (event) => {
      const content = event.target?.result as string
      setFileContent(content)

      // Generate hex dump
      generateHexDump(content)

      // Extract strings
      extractStrings(content)
    }

    reader.readAsText(file)
  }

  // Generate hex dump from file content
  const generateHexDump = (content: string) => {
    const bytes = new TextEncoder().encode(content)
    let result = ""

    for (let i = 0; i < bytes.length; i += 16) {
      // Address
      result += i.toString(16).padStart(8, "0") + "  "

      // Hex values
      for (let j = 0; j < 16; j++) {
        if (i + j < bytes.length) {
          result += bytes[i + j].toString(16).padStart(2, "0") + " "
        } else {
          result += "   "
        }
        if (j === 7) result += " "
      }

      // ASCII representation
      result += " |"
      for (let j = 0; j < 16; j++) {
        if (i + j < bytes.length) {
          const byte = bytes[i + j]
          // Only print printable ASCII characters
          if (byte >= 32 && byte <= 126) {
            result += String.fromCharCode(byte)
          } else {
            result += "."
          }
        } else {
          result += " "
        }
      }
      result += "|\n"

      // Limit to first 256 bytes for performance
      if (i >= 256) {
        result += "...\n(truncated for performance)"
        break
      }
    }

    setHexDump(result)
  }

  // Extract printable strings from file
  const extractStrings = (content: string) => {
    const bytes = new TextEncoder().encode(content)
    let currentString = ""
    let strings: string[] = []

    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i]
      // Only collect printable ASCII characters
      if (byte >= 32 && byte <= 126) {
        currentString += String.fromCharCode(byte)
      } else {
        if (currentString.length >= 4) {
          // Only keep strings of 4+ chars
          strings.push(currentString)
        }
        currentString = ""
      }
    }

    // Add the last string if it exists
    if (currentString.length >= 4) {
      strings.push(currentString)
    }

    // Limit to first 100 strings for performance
    if (strings.length > 100) {
      strings = strings.slice(0, 100)
      strings.push("... (truncated for performance)")
    }

    setStringExtract(strings.join("\n"))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forensics Tools</CardTitle>
        <CardDescription>Basic file analysis tools for CTF forensics challenges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Upload File for Analysis</Label>
            <Input id="file-upload" type="file" onChange={handleFileUpload} className="mt-2" />
          </div>

          {fileContent === null ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No file loaded</AlertTitle>
              <AlertDescription>Upload a file to analyze its contents</AlertDescription>
            </Alert>
          ) : (
            <Tabs defaultValue="info" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">File Info</TabsTrigger>
                <TabsTrigger value="hexdump">Hex Dump</TabsTrigger>
                <TabsTrigger value="strings">Strings</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>File Type</Label>
                    <div className="p-2 border rounded-md mt-1">{fileType}</div>
                  </div>
                  <div>
                    <Label>File Size</Label>
                    <div className="p-2 border rounded-md mt-1">{fileSize} bytes</div>
                  </div>
                </div>

                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Basic Analysis</AlertTitle>
                  <AlertDescription>
                    For more detailed analysis, use the Hex Dump and Strings tabs. For advanced forensics, consider
                    specialized tools like Autopsy, Volatility, or ExifTool.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="hexdump" className="mt-4">
                <Label>Hex Dump (first 256 bytes)</Label>
                <pre className="p-2 border rounded-md mt-1 overflow-x-auto font-mono text-xs">{hexDump}</pre>
              </TabsContent>

              <TabsContent value="strings" className="mt-4">
                <Label>Extracted Strings (4+ characters)</Label>
                <Textarea readOnly value={stringExtract} className="font-mono text-xs mt-1 min-h-[300px]" />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

