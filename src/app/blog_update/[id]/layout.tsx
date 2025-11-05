import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Trash from "../trash";
import { LogOut, Users } from "lucide-react";
import UserSettingButton from "@/components/user-setting-button";
import SignOutButton from "@/components/sign-out-button";
import { getUserInfo } from "@/lib/session";
import TopBar from "./top-bar";
import StarList from "../star-list";
import SearchComp from "../search";

export default async function Layout({
  params,
  children,
  directory, // parallel route
}: Readonly<{
  params: { id: string };
  children: React.ReactNode;
  directory: React.ReactNode;
}>) {
  const user = await getUserInfo();
  if (user == null) {
    redirect("/user-info");
  }
  const { id = "0" } = params;

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={18} className="min-w-44 max-w-[500px]">
        <div className="flex flex-col h-screen bg-muted text-muted-foreground p-2">
          <div>
            <UserSettingButton user={user} />

            <SearchComp />

            <StarList />
          </div>
          <Separator className="my-4" />
          <div className="flex-auto overflow-y-auto">{directory}</div>
          <Separator className="my-4" />

          <div className="flex-shrink-0">
            <Trash />

            <SignOutButton className="w-full justify-start px-2 ">
              <LogOut className="h-4 w-4" />
              &nbsp;&nbsp;退出登录
            </SignOutButton>
            {/* <SignOutButton className="w-full justify-start px-2" size="sm">
              <>
                <LogOut className="h-4 w-4" />
                &nbsp;退出登录
              </>
            </SignOutButton> */}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={82}>
        <div className="h-screen flex flex-col">
          {/* top bar */}
          <TopBar defaultId={id} /> {/* content */}
          <div
            id="work-content-scroll-container"
            className="flex-auto overflow-y-auto"
          >
            {" "}
            {children}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
