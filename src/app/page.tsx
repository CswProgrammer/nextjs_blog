// import Image from "next/image";
import Link from "next/link";
import { Zap, User, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

import HomeNav from "@/components/homenav";
import Slogan from "@/components/slogan";
import StartButton from "@/components/start-button";
import SignInButton from "@/components/sign-in-button";
import { getUserInfo } from "@/lib/session";

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center text-center">
      <HomeNav />
      <h2 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
        <span className="font-extrabold">前后端运维 统统都干</span>
      </h2>
      <Slogan />
      <section className="mt-10 flex justify-center space-x-4">
        <MainButton />

        <Button
          variant="secondary"
          className="text-base rounded-full h-12 px-6"
          size="lg"
        >
          <Code className="h-4 w-4" />
          &nbsp;联系站长
        </Button>
      </section>
    </main>
  );
}

async function MainButton() {
  const user = await getUserInfo();
  if (user == null) {
    return (
      <SignInButton className="text-base" size="lg">
        <User className="h-4 w-4" />
        &nbsp;站长登陆
      </SignInButton>
    );
  }
  // @ts-ignore
  if (!user.isInvited) {
    return (
      <Link href="/invitation-code">
        <Button className="text-base" size="lg">
          <Zap className="h-4 w-4 mr-1" />
          验证邀请码
        </Button>
      </Link>
    );
  }
  return <StartButton />;
}

function LearnButton() {
  return (
    <Link href="/join">
      <Button variant="secondary" className="text-base" size="lg">
        <Code className="h-4 w-4 mr-1" />
        学习项目/参与开发
      </Button>
    </Link>
  );
}
