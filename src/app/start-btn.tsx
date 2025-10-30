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

  // @ts-ignore
  if (!user.isInvited) {
    return (
      <Link href="/invitation-code">
        <Button className="text-base" size="lg">
          <Zap className="h-4 w-4" />
          &nbsp;验证邀请码
        </Button>
      </Link>
    );
  }

  const lastDocId = (user as any).lastDocId || "";

  return (
    // <Link href="/blog_update/`${lastDocId}`}" passHref legacyBehavior>
    <Link href={`/blog_update/${lastDocId}`}>
      <Button className="text-base" size="lg">
        <Zap className="h-4 w-4" />
        &nbsp;开始使用
      </Button>
    </Link>
  );
}
