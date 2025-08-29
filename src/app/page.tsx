// import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Code, Zap } from "lucide-react";
import HomeNav from "@/components/homenav";
import Slogan from "@/components/slogan";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center text-center">
      <HomeNav />
      <h2 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
        <span className="font-extrabold">AI编程 高效工作！</span>
      </h2>
      <Slogan />
      <section className="mt-10 flex justify-center space-x-4">
        <Button className="text-base" size="lg">
          <Zap className="h-4 w-4" />
          &nbsp;向我提问
        </Button>
        <Button variant="secondary" className="text-base" size="lg">
          <Code className="h-4 w-4" />
          &nbsp;联系本人
        </Button>
      </section>
    </main>
  );
}
