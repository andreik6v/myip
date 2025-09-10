"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, Globe, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface IPData {
  ipv4?: string
  ipv6?: string
}

export default function IPAddressPage() {
  const [ipData, setIpData] = useState<IPData>({})
  const [loading, setLoading] = useState(true)
  const [copiedIP, setCopiedIP] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchIPAddresses = async () => {
    setLoading(true)
    try {
      // Fetch IPv4
      const ipv4Response = await fetch("https://api.ipify.org?format=json")
      const ipv4Data = await ipv4Response.json()

      // Fetch IPv6 (fallback if not available)
      let ipv6Data = null
      try {
        const ipv6Response = await fetch("https://api64.ipify.org?format=json")
        ipv6Data = await ipv6Response.json()
      } catch (error) {
        console.log("IPv6 not available")
      }

      setIpData({
        ipv4: ipv4Data.ip,
        ipv6: ipv6Data?.ip || null,
      })
    } catch (error) {
      console.error("Error fetching IP addresses:", error)
      toast({
        title: "Error",
        description: "Failed to fetch IP addresses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIPAddresses()
  }, [toast])

  const copyToClipboard = async (ip: string, type: string) => {
    try {
      await navigator.clipboard.writeText(ip)
      setCopiedIP(ip)
      toast({
        title: "Copied!",
        description: `${type} address copied to clipboard`,
      })
      setTimeout(() => setCopiedIP(null), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">What is my IP address?</h1>
          </div>
          <p className="text-muted-foreground">
            Your IP address is a unique identifier assigned to your device on the internet. This tool shows your current
            public IP address.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>IPv4 Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={loading ? "Loading..." : ipData.ipv4 || "Not available"}
                readOnly
                placeholder="Your IPv4 address will appear here"
                className="pr-10 font-mono"
              />
              {ipData.ipv4 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => copyToClipboard(ipData.ipv4!, "IPv4")}
                >
                  {copiedIP === ipData.ipv4 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IPv6 Address</CardTitle>
            <CardDescription>IPv6 may not be available on all networks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <Input
                type="text"
                value={loading ? "Loading..." : ipData.ipv6 || "Not available"}
                readOnly
                placeholder="Your IPv6 address will appear here"
                className="pr-10 font-mono"
              />
              {ipData.ipv6 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => copyToClipboard(ipData.ipv6!, "IPv6")}
                >
                  {copiedIP === ipData.ipv6 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>

            <Button onClick={fetchIPAddresses} className="w-full" size="lg" disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Loading..." : "Refresh IP Addresses"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Note:</span> Your IP address may change depending on your
            network connection and location. IP addresses are detected locally and not stored or transmitted.
          </p>
        </div>
      </div>
    </div>
  )
}
