import Link from "next/link";
import { getUserInfo } from "@/lib/session";
import SignInButton from "@/components/sign-in-button";
import { Button } from "@/components/ui/button";
import { Zap, User } from "lucide-react";
export default async function StartButton() {
  const user = await getUserInfo();

  if (user == null) {
    return (
      <SignInButton className="text-base" size="lg">
        <User className="h-4 w-4" />
        &nbsp;站长登陆
      </SignInButton>
    );
  }
  return (
    <Link href="/blog_update/1" passHref legacyBehavior>
      <Button className="text-base" size="lg">
        <Zap className="h-4 w-4" />
        &nbsp;开始使用
      </Button>
    </Link>
  );
}
