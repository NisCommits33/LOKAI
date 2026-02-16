"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function QuizzesPage() {
    return (
        <div className="py-12 bg-gray-50 flex-1">
            <Container>
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">GK Quizzes</h1>
                        <p className="text-gray-500 mt-2">Practice with curated questions covering all Lok Sewa categories.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {["Geography", "History", "Constitution", "Economy", "International Relations", "Science & Tech"].map((category) => (
                            <Card key={category} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle>{category}</CardTitle>
                                    <CardDescription>Practice questions for {category}.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full">Start Practice</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}
