"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function CleanupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>("")

  const runCleanup = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch('/api/cleanup-phones', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data.data)
      } else {
        setError(data.error || 'Cleanup failed')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            Phone Number Cleanup Tool
          </h1>
          <p className="text-gray-300 mb-6">
            This tool will clean up all phone numbers in the database by:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
            <li>Removing +234 or 234 prefixes from phone numbers</li>
            <li>Removing leading zeros</li>
            <li>Ensuring all records have country codes</li>
            <li>Standardizing the format to 10 digits</li>
          </ul>

          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-200 text-sm">
                <strong>Warning:</strong> This will update existing records in the database. 
                Make sure you have a backup before proceeding.
              </p>
            </div>
          </div>

          {!result && !error && (
            <Button
              onClick={runCleanup}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Running Cleanup...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Run Cleanup
                </>
              )}
            </Button>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/50 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-bold text-green-400">
                  Cleanup Complete!
                </h2>
              </div>
              <div className="space-y-2 text-gray-300">
                <p>Total Records: <span className="font-bold text-white">{result.totalRecords}</span></p>
                <p>Updated Records: <span className="font-bold text-green-400">{result.updatedRecords}</span></p>
                {result.errors && (
                  <p className="text-red-400">
                    Errors: <span className="font-bold">{result.errors.length}</span>
                  </p>
                )}
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => {
                    setResult(null)
                    setError("")
                  }}
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  Run Again
                </Button>
                <Link href="/stats">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Stats
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/50 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold text-red-400">
                  Cleanup Failed
                </h2>
              </div>
              <p className="text-gray-300 mb-4">{error}</p>
              <Button
                onClick={() => {
                  setResult(null)
                  setError("")
                }}
                className="bg-slate-700 hover:bg-slate-600"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <Link href="/stats" className="text-blue-400 hover:text-blue-300 text-sm">
              ← Back to Stats
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
