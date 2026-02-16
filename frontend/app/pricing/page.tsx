"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
    const plans = [
        {
            name: "Basic",
            price: "Free",
            description: "Perfect for casual learners.",
            features: ["10 GK Quizzes / day", "Basic AI Document Analysis", "Public Community access"],
            buttonText: "Current Plan",
            variant: "outline"
        },
        {
            name: "Pro",
            price: "Rs. 499/mo",
            description: "For serious candidates.",
            features: ["Unlimited GK Quizzes", "Advanced AI Question Gen", "Detailed Progress Analytics", "Personal Study Kit"],
            buttonText: "Upgrade to Pro",
            variant: "default"
        },
        {
            name: "Organization",
            price: "Custom",
            description: "For government offices.",
            features: ["Employee Verification", "Shared Resource Library", "Admin Dashboard", "Compliance Tracking"],
            buttonText: "Contact Sales",
            variant: "outline"
        }
    ]

    return (
        <div className="py-20 bg-gray-50 flex-1">
            <Container className="text-center">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight">Simple, Transparent Pricing</h1>
                    <p className="text-gray-500 mt-4 text-lg">Choose the plan that fits your preparation goals.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`flex flex-col ${plan.name === "Pro" ? "border-primary shadow-xl scale-105" : "shadow-md"}`}>
                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <div className="text-3xl font-bold py-4">{plan.price}</div>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3 text-left">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check className="h-4 w-4 text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full font-bold" variant={plan.variant as any}>
                                    {plan.buttonText}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </Container>
        </div>
    )
}
