import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFound() {
    return (
        <div className="flex-1 flex items-center py-20 bg-white">
            <Container>
                <div className="mx-auto max-w-lg text-center space-y-12">
                    <div className="relative">
                        <h1 className="text-[12rem] font-black text-gray-50 select-none leading-none">404</h1>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                            <span className="text-6xl mb-4">🛸</span>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Lost in Space?</h2>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-gray-500 text-lg max-w-sm mx-auto font-medium">
                            We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
                        <BackButton />
                        <Link href="/">
                            <Button size="lg" className="h-12 px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    )
}
