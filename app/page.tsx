"use client"

import { useState, useEffect } from "react"
import { Copy, Check, Globe, Network, RefreshCw } from "lucide-react"
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
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">IP Address Lookup</h1>
          <p className="text-slate-600">Discover your public IP address and network information.</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Your IP Addresses</h2>

          <div className="space-y-4">
            {loading ? (
              <Card className="p-6 bg-white border-slate-200">
                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-900 border-t-transparent"></div>
                    <span className="text-slate-600">Detecting your IP address...</span>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                {/* IPv4 Address */}
                {ipData.ipv4 && (
                  <Card className="p-6 bg-white border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                          <Globe className="h-5 w-5 text-slate-700" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-600 mb-1">IPv4 Address</div>
                          <div className="text-lg font-mono font-semibold text-slate-900">{ipData.ipv4}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(ipData.ipv4!, "IPv4")}
                        className="border-slate-200 hover:bg-slate-50"
                      >
                        {copiedIP === ipData.ipv4 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </Card>
                )}

                {/* IPv6 Address */}
                {ipData.ipv6 ? (
                  <Card className="p-6 bg-white border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                          <Network className="h-5 w-5 text-slate-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-600 mb-1">IPv6 Address</div>
                          <div className="text-lg font-mono font-semibold text-slate-900 break-all">{ipData.ipv6}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(ipData.ipv6!, "IPv6")}
                        className="ml-4 flex-shrink-0 border-slate-200 hover:bg-slate-50"
                      >
                        {copiedIP === ipData.ipv6 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 bg-slate-50 border-slate-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-200 rounded-lg">
                        <Network className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-600 mb-1">IPv6 Address</div>
                        <div className="text-slate-500">Not available from your current connection</div>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mb-8">
          <Button
            onClick={fetchIPAddresses}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh IP Addresses
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            <strong>Privacy Note:</strong> Your IP address may change depending on your network connection and location.
            IP addresses are detected locally and not stored or transmitted.
          </p>
        </div>
      </main>
    </div>
  )
}
