import Link from "next/link";
import HomeNav from "@/components/homenav";
import { getUserInfo } from "@/lib/session";
import CheckCode from "./check-code";

export default async function InvitationPage() {
  const user = await getUserInfo();

  if (user == null)
    return (
      <Wrapper>
        <Link href="/" className="underline text-xl">
          尚未登录，请到首页登录
        </Link>
      </Wrapper>
    );

  // @ts-ignore
  if (user.isInvited) {
    return (
      <Wrapper>
        <p>你已经被邀请了</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex-col ">
        <p className="text-sm mb-4">
          项目在内测阶段，需要邀请码才能进入。如无邀请码，请联系管理员申请，加
          vx：
          <code className="text-muted-foreground">AIProject-dev</code>
          ，备注：“aiblog测试”。
        </p>
        <CheckCode />
      </div>
    </Wrapper>
  );
}

// 容器
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex justify-center items-center">
      <HomeNav />
      {children}
    </div>
  );
}
