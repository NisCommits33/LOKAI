"use client"

import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      console.log("Home: Authenticated user detected, redirecting to dashboard...")
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  // If loading or we HAVE a user (and are redirecting), show the loader
  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="py-20 md:py-32">
      <Container className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Prepare for Nepal Government <span className="text-primary">Exams with AI</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          The all-in-one platform for Lok Sewa preparation. Practice GK quizzes,
          generate questions from your own study materials, and track your progress.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="h-14 px-12 text-lg font-bold shadow-xl hover:scale-105 transition-transform bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
          <p className="text-sm text-gray-500 font-medium">Join thousands of students and government employees</p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">GK Quizzes</h3>
            <p className="mt-2 text-gray-600">
              Thousands of curated GK questions covering geography, history, and constitution.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">AI Document Analysis</h3>
            <p className="mt-2 text-gray-600">
              Upload your PDFs and let our AI generate summaries and practice questions for you.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Organization Specific</h3>
            <p className="mt-2 text-gray-600">
              Access department-specific policies and sections if you are a verified employee.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
