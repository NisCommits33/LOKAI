import { Container } from "./Container"

export function Footer() {
    return (
        <footer className="border-t bg-gray-50 py-12">
            <Container>
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="text-center md:text-left">
                        <p className="text-lg font-bold text-primary">LokAI</p>
                        <p className="mt-1 text-sm text-gray-500">
                            AI-powered exam preparation for Nepal government employees.
                        </p>
                    </div>
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} LokAI. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    )
}
