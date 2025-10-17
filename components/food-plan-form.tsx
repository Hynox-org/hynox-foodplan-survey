"use client"

import { useId, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Chip = ({ selected, children, onClick }: { selected: boolean; children: React.ReactNode; onClick: () => void }) => (
  <Button
    type="button"
    variant={selected ? "default" : "outline"}
    className={`h-9 rounded-full px-3 ${selected ? "bg-teal-600 text-white border-teal-600" : ""}`}
    onClick={onClick}
    aria-pressed={selected}
  >
    {children}
  </Button>
)

export default function FoodPlanForm() {
  const costHelpId = useId()
  const addressHelpId = useId()

  // Local UI state for chips (still posts as hidden inputs for server handling)
  const [dailySpend, setDailySpend] = useState<number | "custom">(250)
  const [customSpend, setCustomSpend] = useState<number | "">("")
  const [interest, setInterest] = useState<"interested" | "not-interested" | "one-trial" | "">("")
  const [plans, setPlans] = useState<string[]>([])
  const [mealTimes, setMealTimes] = useState<string[]>([])
  const [dietary, setDietary] = useState<"veg" | "egg" | "non-veg" | "">("")
  const [profession, setProfession] = useState<string>("")

  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])

  const budgetOptions = [150, 200, 250, 300, 350, 400]

  return (
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: { [key: string]: any } = {};

        // Extract values from standard input fields
        data.name = formData.get("name");
        data.phone = formData.get("phone");
        data.address = formData.get("address");
        data.profession = formData.get("profession");

        // Extract values from hidden inputs (managed by useState)
        data.dailySpend = formData.get("dailySpend");
        data.interest = formData.get("interest");
        data.dietary = formData.get("dietary");
        data.mealTimes = JSON.parse(formData.get("mealTimes") as string || "[]");

        // Extract values from checkboxes (plans)
        data.plans = plans; // Use the state directly for checkboxes

        console.log("Submitting form data:", data);

        try {
          const response = await fetch("/api/submit-form", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            alert("Form submitted successfully!");
            // Optionally reset form or redirect
          } else {
            const errorData = await response.json();
            alert(`Form submission failed: ${errorData.message}`);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("An unexpected error occurred during form submission.");
        }
      }}
    >
      {/* Header card */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <h1 className="text-xl font-semibold">Home-style meals, delivered</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Avg ₹250/day for breakfast, lunch, dinner. Daily changing menu. [Fresh • Flexible • Cancel anytime]
        </p>
      </div>

      {/* Details */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-medium">Your details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              aria-describedby="phone-note"
              required
            />
            <p id="phone-note" className="text-xs text-muted-foreground">
              Include country code if outside India.
            </p>
          </div>

          <div className="md:col-span-2 grid gap-2">
            <Label htmlFor="address">Address / Area</Label>
            <Input
              id="address"
              name="address"
              placeholder="Saravanampatti, Coimbatore"
              aria-describedby={addressHelpId}
              required
            />
            <p id={addressHelpId} className="text-xs text-muted-foreground">
              Enter your area/locality and city.
            </p>
          </div>
        </div>
      </div>

      {/* Spend & Interest */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-medium">Spend & interest</h2>

        <div className="grid gap-2">
          <Label>Current per day spend (₹)</Label>
          <div className="flex flex-wrap gap-2">
            {budgetOptions.map((b) => (
              <Chip key={b} selected={dailySpend === b} onClick={() => { setDailySpend(b); setCustomSpend("") }}>
                ₹{b}
              </Chip>
            ))}
            <Chip selected={dailySpend === "custom"} onClick={() => setDailySpend("custom")}>
              Custom
            </Chip>
          </div>
          {dailySpend === "custom" && (
            <div className="mt-2 w-40">
              <Input
                type="number"
                min={150}
                step={50}
                placeholder="₹..."
                value={customSpend}
                onChange={(e) => setCustomSpend(e.target.value === "" ? "" : Number(e.target.value))}
                aria-describedby={costHelpId}
              />
            </div>
          )}
          <p id={costHelpId} className="text-xs text-muted-foreground">
            Typical per-day budget is ₹200–₹300 for 3 meals with daily variety.
          </p>
          <input type="hidden" name="dailySpend" value={dailySpend === "custom" ? String(customSpend || "") : String(dailySpend)} />
        </div>

        <div className="mt-4 grid gap-2">
          <Label>Are you interested?</Label>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: "interested", label: "Interested", value: "interested" },
              { id: "not-interested", label: "Not interested", value: "not-interested" },
              { id: "one-trial", label: "1 trial", value: "one-trial" },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setInterest(o.value as any)}
                className={`flex items-center gap-3 rounded-md border p-3 text-left ${interest === o.value ? "border-teal-600 bg-teal-50" : "border-border"}`}
                aria-pressed={interest === o.value}
              >
                <div className={`h-4 w-4 rounded-full border ${interest === o.value ? "bg-teal-600 border-teal-600" : "border-muted-foreground"}`} />
                <span>{o.label}</span>
              </button>
            ))}
          </div>
          <input type="hidden" name="interest" value={interest} />
        </div>
      </div>

      {/* Plan & Preferences */}
      <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-medium">Plan & preferences</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Profession */}
          <div className="grid gap-2">
            <Label htmlFor="profession">Profession</Label>
            <Select name="profession" value={profession} onValueChange={setProfession} required>
              <SelectTrigger id="profession">
                <SelectValue placeholder="Select your profession" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="working">Working professional</SelectItem>
                <SelectItem value="homemaker">Homemaker</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dietary */}
          <div className="grid gap-2">
            <Label>Dietary</Label>
            <div className="flex flex-wrap gap-2">
              {["veg", "egg", "non-veg"].map((d) => (
                <Chip key={d} selected={dietary === d} onClick={() => setDietary(d as any)}>
                  {d === "veg" ? "Veg" : d === "egg" ? "Egg" : "Non-veg"}
                </Chip>
              ))}
            </div>
            <input type="hidden" name="dietary" value={dietary} />
          </div>
        </div>

        {/* Plans */}
        <div className="mt-2 grid gap-3">
          <Label>Your plan</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "plan-weekly", value: "weekly", label: "Weekly plan" },
              { id: "plan-monthly", value: "monthly", label: "Monthly plan" },
              { id: "plan-1day", value: "1-day", label: "1 day" },
              { id: "plan-onetime", value: "one-time", label: "One-time" },
            ].map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-md border border-border p-3">
                <Checkbox
                  id={p.id}
                  name="plans"
                  value={p.value}
                  checked={plans.includes(p.value)}
                  onCheckedChange={() => setPlans(prev => toggle(prev, p.value))}
                />
                <Label htmlFor={p.id} className="leading-none">
                  {p.label}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Select one or more options.</p>
        </div>

        {/* Meal times */}
        <div className="mt-4 grid gap-2">
          <Label>Meal times</Label>
          <div className="flex flex-wrap gap-2">
            {["Breakfast", "Lunch", "Dinner"].map((t) => (
              <Chip key={t} selected={mealTimes.includes(t)} onClick={() => setMealTimes(prev => toggle(prev, t))}>
                {t}
              </Chip>
            ))}
          </div>
          {/* Serialize array for non-JS backends if needed */}
          <input type="hidden" name="mealTimes" value={JSON.stringify(mealTimes)} />
        </div>
      </div>

      {/* Footer submit with privacy note */}
      <div className="sticky bottom-0 z-10 -mx-4 bg-background/80 p-4 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:p-0">
        <div className="flex items-center justify-end gap-3 rounded-xl border border-border bg-card p-3 sm:border-0 sm:bg-transparent sm:p-0">
          <p className="hidden text-xs text-muted-foreground sm:block">
            By continuing, you agree to receive plan updates. You can opt out anytime.
          </p>
          <Button type="submit" className="px-6">
            Submit
          </Button>
        </div>
      </div>
    </form>
  )
}
