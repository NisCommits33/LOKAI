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
        <div className="flex-1 flex items-center py-20 bg-white min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-lg"
                >
                    <Card className="border border-slate-100 shadow-none overflow-hidden bg-white">
                        <CardHeader className="text-center pt-12 px-10">
                            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">System Encountered an Error</CardTitle>
                            <CardDescription className="text-sm pt-3 font-medium text-slate-500">
                                An unexpected condition interrupted the current operation.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 pb-8">
                            <div className="rounded-xl bg-slate-900 p-6 text-left border border-slate-800">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Exception Log</span>
                                </div>
                                <p className="text-[10px] font-mono text-red-400/90 break-all leading-relaxed bg-red-950/20 p-2 rounded border border-red-900/20 mb-3">
                                    {error.digest || "INTERNAL_RUNTIME_FAULT"}
                                </p>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                                    &quot;{error.message || "Please re-authenticate or contact technical support."}&quot;
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 bg-slate-50/30 px-10 py-8 border-t border-slate-50">
                            <BackButton />
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button variant="outline" onClick={() => window.location.href = "/"} className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-xs font-bold uppercase tracking-widest border-slate-100 hover:bg-white transition-all shadow-none text-slate-600">
                                    <Home className="mr-2.5 h-4 w-4" />
                                    Home
                                </Button>
                                <Button onClick={() => reset()} className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-xs font-bold uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-none">
                                    <RotateCcw className="mr-2.5 h-4 w-4" />
                                    Retry
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </Container>
        </div>
    )
}
