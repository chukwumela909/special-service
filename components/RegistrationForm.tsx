"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle, Loader2, BarChart3 } from "lucide-react"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().min(1, "Please select an age range"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  lga: z.string().min(2, "Please enter your LGA"),
  city: z.string().min(2, "Please enter your city"),
  state: z.string().min(2, "Please enter your state"),
  country: z.string().min(2, "Please enter your country"),
  cefZone: z.string().optional(),
  expectations: z.string().min(10, "Please share your expectations (at least 10 characters)"),
  inviteSomeone: z.enum(["yes", "no"]),
  inviteeName: z.string().optional(),
  inviteePhone: z.string().optional(),
}).refine((data) => {
  if (data.inviteSomeone === "yes") {
    return data.inviteeName && data.inviteeName.length >= 2 && data.inviteePhone && data.inviteePhone.length >= 10
  }
  return true
}, {
  message: "Please provide invitee name and phone number",
  path: ["inviteeName"],
})

type FormData = z.infer<typeof formSchema>

export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteSomeone: "no",
    },
  })

  const inviteSomeone = watch("inviteSomeone")

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      // Success
      setRegistrationNumber(result.data.registrationNumber)
      setSubmitted(true)
    } catch (error: any) {
      console.error('Registration error:', error)
      setErrorMessage(error.message || 'An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center p-4 relative"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/bg.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="relative z-10 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
        >
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/TFN-new.png"
              alt="Logo"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-400" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-white">
            Registration Complete!
          </h2>
          
          {registrationNumber && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-600"
            >
              <p className="text-sm text-gray-400 mb-1">Your Registration Number</p>
              <p className="text-2xl font-bold text-green-400 font-mono tracking-wider">
                {registrationNumber}
              </p>
              <p className="text-xs text-gray-500 mt-2">Please save this number for your records</p>
            </motion.div>
          )}
          
          <p className="text-gray-300 mb-6">
            Thank you for registering. We look forward to seeing you at the event!
          </p>
          <Button
            onClick={() => {
              setSubmitted(false)
              setRegistrationNumber("")
            }}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white"
          >
            Submit Another Registration
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header with Logo */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <Image
                src="/specialsw.png"
                alt="Logo"
                width={200}
                height={150}
                className="object-contain"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-white text-center mb-5"
            >
              REGISTER FOR A SPECIAL SERVICE WITH DR DAYSMAN OYAKHILOME AND PASTOR DAVID HERNANDEZ
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-center"
            >
              CREATE AN ACCOUNT ON TFN.WATCH and fill this form with the name and email you used to create the account. This allows us to make you a part of the TFN network that enjoy access to cash giveaways, raffle draws, game shows, and charitable causes we invest in
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-6">
            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400"
                >
                  <p className="text-sm font-medium">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="name" className="text-gray-200 font-semibold">
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </motion.div>

            {/* Age Range */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="age" className="text-gray-200 font-semibold">
                Age Range <span className="text-red-400">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("age", value)}>
                <SelectTrigger className="mt-2 bg-slate-800 border-slate-600 text-white focus:border-slate-500 focus:ring-slate-500">
                  <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="under-15" className="text-white focus:bg-slate-700 focus:text-white">Under 15</SelectItem>
                  <SelectItem value="15-24" className="text-white focus:bg-slate-700 focus:text-white">15-24</SelectItem>
                  <SelectItem value="25-35" className="text-white focus:bg-slate-700 focus:text-white">25-35</SelectItem>
                  <SelectItem value="36-45" className="text-white focus:bg-slate-700 focus:text-white">36-45</SelectItem>
                  <SelectItem value="46-55" className="text-white focus:bg-slate-700 focus:text-white">46-55</SelectItem>
                  <SelectItem value="56-65" className="text-white focus:bg-slate-700 focus:text-white">56-65</SelectItem>
                  <SelectItem value="over-65" className="text-white focus:bg-slate-700 focus:text-white">Over 65</SelectItem>
                </SelectContent>
              </Select>
              {errors.age && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.age.message}
                </motion.p>
              )}
            </motion.div>

            {/* Email and Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="email" className="text-gray-200 font-semibold">
                  Email Address <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="phone" className="text-gray-200 font-semibold">
                  Phone Number <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                  placeholder="+234 800 000 0000"
                />
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1"
                  >
                    {errors.phone.message}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Location Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <h3 className="text-lg font-semibold mb-4 text-white">
                Viewing Location
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="lga" className="text-gray-200 font-semibold">
                    LGA <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="lga"
                    {...register("lga")}
                    className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                    placeholder="Local Government Area"
                  />
                  {errors.lga && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.lga.message}
                    </motion.p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city" className="text-gray-200 font-semibold">
                    City <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="city"
                    {...register("city")}
                    className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                    placeholder="Your city"
                  />
                  {errors.city && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.city.message}
                    </motion.p>
                  )}
                </div>

                <div>
                  <Label htmlFor="state" className="text-gray-200 font-semibold">
                    State <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="state"
                    {...register("state")}
                    className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                    placeholder="Your state"
                  />
                  {errors.state && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.state.message}
                    </motion.p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country" className="text-gray-200 font-semibold">
                    Country <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="country"
                    {...register("country")}
                    className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                    placeholder="Your country"
                  />
                  {errors.country && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-1"
                    >
                      {errors.country.message}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* CEF Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Label htmlFor="cefZone" className="text-gray-200 font-semibold">
                CEF Zone (if you&apos;re a member)
              </Label>
              <Input
                id="cefZone"
                {...register("cefZone")}
                className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                placeholder="Enter your CEF zone (optional)"
              />
            </motion.div>

            {/* Expectations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label htmlFor="expectations" className="text-gray-200 font-semibold">
                What are you trusting God for right now? <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="expectations"
                {...register("expectations")}
                className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500 min-h-[120px]"
                placeholder="Share your expectations and what you're believing God for..."
              />
              {errors.expectations && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.expectations.message}
                </motion.p>
              )}
            </motion.div>

            {/* Invite Someone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <Label className="text-gray-200 font-semibold">
                Would you like us to invite someone on your behalf who needs healing, breakthrough, or peace? <span className="text-red-400">*</span>
              </Label>
              <RadioGroup
                defaultValue="no"
                onValueChange={(value) => setValue("inviteSomeone", value as "yes" | "no")}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" className="border-slate-500 text-slate-300" />
                  <Label htmlFor="yes" className="font-normal cursor-pointer text-gray-300">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" className="border-slate-500 text-slate-300" />
                  <Label htmlFor="no" className="font-normal cursor-pointer text-gray-300">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </motion.div>

            {/* Conditional Invitee Information */}
            <AnimatePresence>
              {inviteSomeone === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
                    <h4 className="font-semibold mb-4 text-white">
                      Invitee Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="inviteeName" className="text-gray-200 font-semibold">
                          Invitee Name <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="inviteeName"
                          {...register("inviteeName")}
                          className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                          placeholder="Full name of person to invite"
                        />
                        {errors.inviteeName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-1"
                          >
                            {errors.inviteeName.message}
                          </motion.p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="inviteePhone" className="text-gray-200 font-semibold">
                          Invitee Phone Number <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="inviteePhone"
                          type="tel"
                          {...register("inviteePhone")}
                          className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-slate-500 focus:ring-slate-500"
                          placeholder="+234 800 000 0000"
                        />
                        {errors.inviteePhone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-1"
                          >
                            {errors.inviteePhone.message}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-6"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-lg font-semibold transition-all duration-300 hover:shadow-lg bg-slate-700 hover:bg-slate-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-white mt-8 relative z-10"
        >
          We look forward to having you join us for this special service
        </motion.p>

        {/* Admin Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-4 relative z-10"
        >
          <Link
            href="/stats"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            View Registration Statistics
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
