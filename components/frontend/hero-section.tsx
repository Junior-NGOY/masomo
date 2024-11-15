import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SmallTitle from "../small-title";

export default function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/50">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 ">
        <div className="flex flex-col items-center space-y-8 text-center">
          <SmallTitle title="Bienvenue à School Management" />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl mx-auto">
              Your complete school management solution
              <br />
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              From admissions to academics, simplify every aspect of school
              administration with our comprehensive and user-friendly platform.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-[400px]:flex-row  ">
            <Button size="lg" className="min-w-[200px] rounded-full">
              Get started
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px] group">
              View features
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
