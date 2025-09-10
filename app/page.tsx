"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Globe, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

  useEffect(() => {
    const fetchIPAddresses = async () => {
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="w-full px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="https://kiravo.net" className="hover:opacity-80 transition-opacity">
            <img src="/kiravo-logo.png" alt="Kiravo" className="h-[30px] w-auto" />
          </a>
          <a
            href="https://kiravo.net/tools"
            className="text-slate-600 hover:text-slate-800 transition-colors font-medium"
          >
            More tools
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-balance">What is my IP address?</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-pretty">
            Your IP address is a unique identifier assigned to your device on the internet. This tool shows your current
            public IP address.
          </p>
        </div>

        {/* IP Address Display */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
            </div>
          ) : (
            <>
              {/* IPv4 Address */}
              {ipData.ipv4 && (
                <Card className="p-6 bg-white border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-100 rounded-lg">
                        <Globe className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">IPv4 Address</h2>
                        <p className="text-2xl font-mono font-semibold text-slate-900 mt-1">{ipData.ipv4}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(ipData.ipv4!, "IPv4")}
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      {copiedIP === ipData.ipv4 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              )}

              {/* IPv6 Address */}
              {ipData.ipv6 ? (
                <Card className="p-6 bg-white border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-100 rounded-lg">
                        <Network className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">IPv6 Address</h2>
                        <p className="text-xl font-mono font-semibold text-slate-900 mt-1 break-all">{ipData.ipv6}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(ipData.ipv6!, "IPv6")}
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      {copiedIP === ipData.ipv6 ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-6 bg-slate-50 border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-200 rounded-lg">
                      <Network className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">IPv6 Address</h2>
                      <p className="text-slate-400 mt-1">Not available from your current connection</p>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500">
            Your IP address may change depending on your network connection and location.
          </p>
        </div>
      </main>
    </div>
  )
}
