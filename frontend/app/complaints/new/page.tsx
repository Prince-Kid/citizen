"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertTriangle } from "lucide-react"

const complaintSchema = z.object({
  category: z.string({
    required_error: "Please select a category",
  }),
  subject: z
    .string()
    .min(5, {
      message: "Subject must be at least 5 characters",
    })
    .max(100, {
      message: "Subject must not exceed 100 characters",
    }),
  description: z
    .string()
    .min(20, {
      message: "Description must be at least 20 characters",
    })
    .max(1000, {
      message: "Description must not exceed 1000 characters",
    }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  phone: z.string().optional(),
  location: z
    .string()
    .min(5, {
      message: "Location must be at least 5 characters",
    })
    .optional(),
})

type ComplaintFormValues = z.infer<typeof complaintSchema>

export default function NewComplaintPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      category: "",
      subject: "",
      description: "",
      email: "",
      phone: "",
      location: "",
    },
  })

  async function onSubmit(data: ComplaintFormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      // This would be replaced with actual API call
      console.log("Complaint data:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful submission
      setIsSuccess(true)

      // Reset form
      form.reset()

      // Redirect after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err) {
      setError("Failed to submit complaint. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: "infrastructure", label: "Infrastructure" },
    { value: "sanitation", label: "Sanitation" },
    { value: "public_safety", label: "Public Safety" },
    { value: "utilities", label: "Utilities" },
    { value: "environment", label: "Environment" },
    { value: "transportation", label: "Transportation" },
    { value: "other", label: "Other" },
  ]

  if (isSuccess) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Alert className="max-w-md">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your complaint has been submitted successfully. You will be redirected to the dashboard shortly.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Submit a Complaint</CardTitle>
          <CardDescription>
            Fill out the form below to submit your complaint. We'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the category that best describes your complaint</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief title of your complaint" {...field} />
                    </FormControl>
                    <FormDescription>A short, descriptive title for your complaint</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed information about your complaint"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Please include all relevant details about the issue</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>We'll use this to contact you about your complaint</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormDescription>Alternative contact method</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Address or location of the issue" {...field} />
                    </FormControl>
                    <FormDescription>Helps us identify where the issue is occurring</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Complaint"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <p className="text-xs text-muted-foreground">
            By submitting this form, you agree to our terms and privacy policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
