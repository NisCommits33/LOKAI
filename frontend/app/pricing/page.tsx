"use client"

import { Container } from "@/components/layout/Container"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, ShieldCheck, Globe2, ArrowRight } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { motion } from "framer-motion"

export default function PricingPage() {
    const plans = [
        {
            name: "Basic",
            price: "Free",
            description: "Essential tools for casual learners.",
            features: ["10 GK Quizzes / day", "Basic AI Document Analysis", "Public Community access", "Progress tracking"],
            buttonText: "Current Plan",
            variant: "outline",
            highlight: false
        },
        {
            name: "Pro",
            price: "Rs. 499",
            period: "/mo",
            description: "For dedicated civil service aspirants.",
            features: ["Unlimited GK Quizzes", "Advanced AI Question Gen", "Detailed Progress Analytics", "Personal Study Kit", "Priority AI processing"],
            buttonText: "Upgrade to Pro",
            variant: "default",
            highlight: true
        },
        {
            name: "Organization",
            price: "Custom",
            description: "Tailored institutional solutions.",
            features: ["Employee Verification", "Shared Resource Library", "Admin Dashboard", "Compliance Tracking", "Departmental Quizzes"],
            buttonText: "Inquire Now",
            variant: "outline",
            highlight: false
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="py-20 bg-white flex-1 min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <BackButton />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24 max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 transition-all">
                        <Globe2 className="h-3 w-3" />
                        Professional Plans
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">Simple, Flat Pricing.</h1>
                    <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">No complex tiers. Choose the plan that fits your professional preparation journey.</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {plans.map((plan) => (
                        <motion.div key={plan.name} variants={itemVariants}>
                            <Card className={`flex flex-col h-full border border-slate-100 shadow-none transition-all duration-200 bg-white group hover:border-slate-200 ${plan.highlight ? 'ring-1 ring-slate-900 border-slate-900' : ''}`}>
                                <CardHeader className="pt-10 px-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                            {plan.name}
                                        </CardTitle>
                                        {plan.highlight && <Sparkles className="h-4 w-4 text-slate-900" />}
                                    </div>
                                    <div className="flex items-baseline gap-1 py-4">
                                        <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                                        {plan.period && <span className="text-slate-400 font-bold text-sm">{plan.period}</span>}
                                    </div>
                                    <CardDescription className="text-slate-500 font-medium text-sm leading-relaxed min-h-[40px]">
                                        {plan.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 px-8 pb-8 pt-4">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <Check className="mt-1 h-3.5 w-3.5 text-slate-900 flex-shrink-0" />
                                                <span className="text-xs text-slate-500 font-bold leading-relaxed">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="px-8 pb-10 pt-6">
                                    <Button className={`w-full h-11 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-none ${plan.highlight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
                                        {plan.buttonText}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Secure Badge - Minimal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 pt-10 border-t border-slate-50 flex flex-wrap justify-center gap-10 opacity-30 group"
                >
                    <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                        <Globe2 className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Nepal Hosted</span>
                    </div>
                </motion.div>
            </Container>
        </div>
    )
}
