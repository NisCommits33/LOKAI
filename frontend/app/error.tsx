"use client"

import { useEffect } from "react"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Runtime Error:", error)
    }, [error])

    return (
        <div className="flex-1 flex items-center py-20 bg-gray-50">
            <Container>
                <div className="mx-auto max-w-lg text-center">
                    <Card className="border-destructive/20 shadow-xl">
                        <CardHeader>
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-10 h-10"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                    />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl font-bold">Something went wrong!</CardTitle>
                            <CardDescription>
                                An unexpected error occurred while processing your request.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md bg-gray-100 p-4 text-left">
                                <p className="text-xs font-mono text-gray-500 break-all">
                                    Error Code: {error.digest || "INTERNAL_RUNTIME_ERROR"}
                                </p>
                                <p className="mt-2 text-sm text-gray-700">
                                    {error.message || "Please try again later or contact support if the issue persists."}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center gap-4">
                            <Button variant="outline" onClick={() => window.location.href = "/"}>
                                Back to Home
                            </Button>
                            <Button onClick={() => reset()}>
                                Try Again
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </Container>
        </div>
    )
}
