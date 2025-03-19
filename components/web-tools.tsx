"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Send } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function WebTools() {
  const [url, setUrl] = useState("")
  const [requestMethod, setRequestMethod] = useState("GET")
  const [requestHeaders, setRequestHeaders] = useState("")
  const [requestBody, setRequestBody] = useState("")
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [responseHeaders, setResponseHeaders] = useState<string>("")
  const [responseBody, setResponseBody] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle HTTP request
  const handleRequest = async () => {
    if (!url) {
      setError("Please enter a URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Parse headers
      const headerObj: Record<string, string> = {}
      if (requestHeaders.trim()) {
        requestHeaders.split("\n").forEach((line) => {
          const [key, value] = line.split(":").map((part) => part.trim())
          if (key && value) {
            headerObj[key] = value
          }
        })
      }

      // Prepare request options
      const options: RequestInit = {
        method: requestMethod,
        headers: headerObj,
      }

      // Add body for non-GET requests
      if (requestMethod !== "GET" && requestBody.trim()) {
        options.body = requestBody
      }

      // Make the request
      // Note: This will only work for CORS-enabled endpoints
      const response = await fetch(url, options)

      // Process response
      setResponseStatus(response.status)

      // Format response headers
      const headersString = Array.from(response.headers.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
      setResponseHeaders(headersString)

      // Get response body
      const text = await response.text()
      setResponseBody(text)
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Web Tools</CardTitle>
        <CardDescription>Tools for web-based CTF challenges</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="http" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="http">HTTP Request</TabsTrigger>
          </TabsList>

          <TabsContent value="http" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="url-input">URL</Label>
              <Input
                id="url-input"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method-select">Method</Label>
                <select
                  id="method-select"
                  value={requestMethod}
                  onChange={(e) => setRequestMethod(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="HEAD">HEAD</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button onClick={handleRequest} disabled={isLoading} className="w-full">
                  {isLoading ? "Sending..." : "Send Request"}
                  {!isLoading && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headers-input">Headers (one per line, format: Key: Value)</Label>
              <Textarea
                id="headers-input"
                placeholder="Content-Type: application/json"
                value={requestHeaders}
                onChange={(e) => setRequestHeaders(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body-input">Request Body</Label>
              <Textarea
                id="body-input"
                placeholder={requestMethod === "GET" ? "Body not used for GET requests" : '{"key": "value"}'}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="min-h-[100px]"
                disabled={requestMethod === "GET"}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {responseStatus !== null && (
              <div className="space-y-4 border p-4 rounded-md">
                <div className="flex justify-between">
                  <h3 className="font-medium">Response</h3>
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${
                      responseStatus >= 200 && responseStatus < 300
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Status: {responseStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label>Headers</Label>
                  <pre className="p-2 border rounded-md text-xs overflow-x-auto">
                    {responseHeaders || "(No headers)"}
                  </pre>
                </div>

                <div className="space-y-2">
                  <Label>Body</Label>
                  <pre className="p-2 border rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
                    {responseBody || "(No body)"}
                  </pre>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

