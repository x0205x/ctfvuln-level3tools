import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CryptoTools from "@/components/crypto-tools"
import EncodingTools from "@/components/encoding-tools"
import ForensicsTools from "@/components/forensics-tools"
import WebTools from "@/components/web-tools"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">CTF Solver Toolkit</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="container py-6">
        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="crypto">Cryptography</TabsTrigger>
            <TabsTrigger value="encoding">Encoding</TabsTrigger>
            <TabsTrigger value="forensics">Forensics</TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
          </TabsList>
          <TabsContent value="crypto" className="mt-6">
            <CryptoTools />
          </TabsContent>
          <TabsContent value="encoding" className="mt-6">
            <EncodingTools />
          </TabsContent>
          <TabsContent value="forensics" className="mt-6">
            <ForensicsTools />
          </TabsContent>
          <TabsContent value="web" className="mt-6">
            <WebTools />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

