import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="max-w-md text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your food plan survey has been submitted successfully. We will get back to you shortly.
        </p>
        <Link href="/" passHref>
          <Button>Explore More</Button>
        </Link>
      </div>
    </div>
  );
}
