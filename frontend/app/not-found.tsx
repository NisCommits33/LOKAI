import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex-1 flex items-center py-20 bg-gray-50">
            <Container>
                <div className="mx-auto max-w-lg text-center space-y-8">
                    <div className="relative">
                        <h1 className="text-9xl font-black text-gray-200 select-none">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl">🔍</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900">Page Not Found</h2>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        <Link href="/">
                            <Button size="lg" className="h-12 px-8">
                                Return to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    )
}
