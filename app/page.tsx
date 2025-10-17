import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import FoodPlanForm from "@/components/food-plan-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Food Plan Survey",
  description: "Help us understand your preferences and daily food spending to tailor a better plan.",
}

export default function Page() {
  return (
    <main className="min-h-dvh">
      <section className="mx-auto w-full max-w-2xl px-4 sm:px-6 md:px-8 py-8 md:py-12">
        <Card className="border-none shadow-none">
          <div className="h-2 w-24 rounded-full bg-primary mb-4" aria-hidden="true" />
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-balance text-2xl md:text-3xl">Food Plan Survey</CardTitle>
            <CardDescription className="text-pretty">
              Help us understand your preferences and daily food spending to tailor a better plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <FoodPlanForm />
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
