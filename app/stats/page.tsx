"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { 
  Users, 
  UserPlus, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Clock,
  TrendingUp,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Registration {
  _id: string
  name: string
  age: string
  email: string
  phone: string
  lga: string
  city: string
  state: string
  country: string
  cefZone?: string
  expectations: string
  inviteSomeone: string
  inviteeName?: string
  inviteePhone?: string
  registrationNumber: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  withInvitees: number
  withCEFZone: number
  recentRegistrations: number
  byAgeRange: Array<{ _id: string; count: number }>
  byCountry: Array<{ _id: string; count: number }>
}

interface ApiResponse {
  success: boolean
  data: {
    registrations: Registration[]
    pagination: {
      page: number
      limit: number
      totalPages: number
      totalCount: number
    }
    stats: Stats
  }
}

export default function StatsPage() {
  const [data, setData] = useState<ApiResponse["data"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    fetchRegistrations()
  }, [page, sortBy, sortOrder])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        search,
        sortBy,
        sortOrder,
      })

      const response = await fetch(`/api/registrations?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchRegistrations()
  }

  const exportToCSV = () => {
    if (!data?.registrations) return

    const headers = [
      "Registration Number",
      "Name",
      "Email",
      "Phone",
      "Age Range",
      "LGA",
      "City",
      "State",
      "Country",
      "CEF Zone",
      "Inviting Someone",
      "Invitee Name",
      "Invitee Phone",
      "Registered At",
    ]

    const rows = data.registrations.map((reg) => [
      reg.registrationNumber,
      reg.name,
      reg.email,
      reg.phone,
      reg.age,
      reg.lga,
      reg.city,
      reg.state,
      reg.country,
      reg.cefZone || "",
      reg.inviteSomeone,
      reg.inviteeName || "",
      reg.inviteePhone || "",
      new Date(reg.createdAt).toLocaleString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading registrations...</p>
        </div>
      </div>
    )
  }

  const stats = data?.stats

  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/TFN-new.png"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Registration Dashboard
              </h1>
              <p className="text-gray-400">
                Event Registration Statistics & Management
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-400" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-gray-400">Total Registrations</div>
            </div>

            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.recentRegistrations}
              </div>
              <div className="text-sm text-gray-400">Last 24 Hours</div>
            </div>

            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <UserPlus className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.withInvitees}
              </div>
              <div className="text-sm text-gray-400">With Invitees</div>
            </div>

            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <MapPin className="w-8 h-8 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.withCEFZone}
              </div>
              <div className="text-sm text-gray-400">CEF Members</div>
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Age Distribution */}
            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Age Distribution</h3>
              <div className="space-y-3">
                {stats.byAgeRange.map((item) => (
                  <div key={item._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{item._id}</span>
                      <span className="text-white font-semibold">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.count / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Countries */}
            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Top Countries</h3>
              <div className="space-y-3">
                {stats.byCountry.map((item, index) => (
                  <div key={item._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">
                        {index + 1}. {item._id}
                      </span>
                      <span className="text-white font-semibold">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.count / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by name, email, phone, or registration number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-gray-400"
              />
              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="createdAt" className="text-white focus:bg-slate-700 focus:text-white">Date</SelectItem>
                  <SelectItem value="name" className="text-white focus:bg-slate-700 focus:text-white">Name</SelectItem>
                  <SelectItem value="email" className="text-white focus:bg-slate-700 focus:text-white">Email</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[120px] bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="desc" className="text-white focus:bg-slate-700 focus:text-white">Newest</SelectItem>
                  <SelectItem value="asc" className="text-white focus:bg-slate-700 focus:text-white">Oldest</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Registrations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Reg #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Invitee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {data?.registrations.map((reg, index) => (
                  <motion.tr
                    key={reg._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-mono text-blue-400">
                        {reg.registrationNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">
                        {reg.name}
                      </div>
                      {reg.cefZone && (
                        <div className="text-xs text-gray-400">
                          CEF: {reg.cefZone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {reg.email}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {reg.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300">
                        {reg.city}, {reg.state}
                      </div>
                      <div className="text-xs text-gray-400">{reg.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">{reg.age}</span>
                    </td>
                    <td className="px-6 py-4">
                      {reg.inviteSomeone === "yes" ? (
                        <div>
                          <div className="text-sm text-green-400">
                            ✓ {reg.inviteeName}
                          </div>
                          <div className="text-xs text-gray-400">
                            {reg.inviteePhone}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(reg.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && (
            <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{" "}
                {Math.min(
                  data.pagination.page * data.pagination.limit,
                  data.pagination.totalCount
                )}{" "}
                of {data.pagination.totalCount} registrations
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || loading}
                  variant="outline"
                  className="bg-slate-900 border-slate-600 text-white hover:bg-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2 px-4">
                  <span className="text-sm text-gray-400">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                </div>

                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= data.pagination.totalPages || loading}
                  variant="outline"
                  className="bg-slate-900 border-slate-600 text-white hover:bg-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
