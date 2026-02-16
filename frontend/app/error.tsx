"use client"

import { useEffect } from "react"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"
import { AlertCircle, RotateCcw, Home } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Runtime Error:", error)
    }, [error])

    return (
        <div className="flex-1 flex items-center py-20 bg-gray-50/50 min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto max-w-lg"
                >
                    <Card className="border-none shadow-2xl overflow-hidden bg-white/80 backdrop-blur-md">
                        <div className="h-2 bg-destructive/80" />
                        <CardHeader className="text-center pt-10">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <AlertCircle className="w-10 h-10" />
                            </div>
                            <CardTitle className="text-3xl font-black text-gray-900">Oops! Something Broke</CardTitle>
                            <CardDescription className="text-lg pt-2 font-medium">
                                We encountered an unexpected error while processing your request.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="rounded-xl bg-gray-900 p-6 text-left shadow-inner">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Error Log</span>
                                </div>
                                <p className="text-xs font-mono text-destructive/90 break-all leading-relaxed">
                                    {error.digest || "INTERNAL_RUNTIME_ERROR"}
                                </p>
                                <p className="mt-3 text-sm text-gray-300 font-medium leading-relaxed italic">
                                    &quot;{error.message || "Please try again later or contact support if the issue persists."}&quot;
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 bg-gray-50/50 px-8 py-6">
                            <BackButton className="w-full sm:w-auto" />
                            <div className="flex gap-3 w-full sm:w-auto">
                                <Button variant="outline" onClick={() => window.location.href = "/"} className="flex-1 sm:flex-none font-bold">
                                    <Home className="mr-2 h-4 w-4" />
                                    Home
                                </Button>
                                <Button onClick={() => reset()} className="flex-1 sm:flex-none font-bold shadow-lg shadow-primary/20">
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}
