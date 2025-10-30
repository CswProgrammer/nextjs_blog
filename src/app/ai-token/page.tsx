import Link from "next/link";
import HomeNav from "@/components/homenav";
import { getUserInfo } from "@/lib/session";
import { db } from "@/db/db";
import { isSameMonth } from "@/lib/dt";
import { AI_DEFAULT_TOKEN_LIMIT } from "@/constants";
import AddLimit from "./add-limit";

export default async function AITokenPage() {
  const user = await getUserInfo();

  if (user == null || !user.id)
    return (
      <Wrapper>
        <Link href="/" className="underline text-xl">
          请到首页登录
        </Link>
      </Wrapper>
    );

  // 获取 tokenUsage
  let tokenUsage = await db.tokenUsage.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (tokenUsage == null) {
    // 没有则创建一个
    tokenUsage = await db.tokenUsage.create({ data: { userId: user.id } });
  }
  const { tokensLimit, updateLimitAt } = tokenUsage;

  // 是否月初需要重置？
  if (!isSameMonth(updateLimitAt) && tokensLimit < AI_DEFAULT_TOKEN_LIMIT) {
    await db.tokenUsage.update({
      where: { id: tokenUsage.id },
      data: { tokensLimit: AI_DEFAULT_TOKEN_LIMIT, updateLimitAt: new Date() },
    });
    return (
      <Wrapper>
        <p>已自动重置 token limit ，请返回上一页，继续使用 AI 功能</p>
      </Wrapper>
    );
  }

  return (
    <>
      <HomeNav />
      <div className="w-[800px] mx-auto my-20">
        <div className=" prose dark:prose-invert">
          <h2>什么是 token</h2>
          <p>
            AI 大模型一般使用 token 来计算输入和输出的内容长度，API 会根据 token
            来计费。token 不是字符、英文和汉字，简单了解的话：
          </p>
          <ul>
            <li>100 token 约等于 75 英文单词（是单词，不是字母）</li>
            <li>100 token 约等于 100 个汉字或标点符号</li>
            <li>
              AI 接口一般根据 token 使用量来计算收费，如{" "}
              <a
                href="https://openai.com/api/pricing/"
                target="_blank"
                className="underline"
                rel="noopener" // 🔧 修复：加noopener
              >
                OpenAI API 价格
              </a>
            </li>
            <li>AI 接口的输入、输出都要计算 token ，一次请求，双向累计</li>
          </ul>
          <p>
            可以借助&nbsp;
            <a
              href="https://platform.openai.com/tokenizer"
              target="_blank"
              className="underline"
              rel="noopener" // 🔧 修复：加noopener
            >
              OpenAI tokenizer
            </a>
            &nbsp; 工具来测试
          </p>
          <h2>什么是 token limit</h2>
          <p>
            Token limit 是【划水 AI】项目对于 AI 使用量的限制，当 token limit
            小于等于 0 时，AI
            功能将不可用。如果不加限制，用户无节制的使用，可能会浪费我们的 AI
            接口费用。
          </p>
          <p>
            每个用户注册以后，都会分配 token limit
            ，此后每月会自动充值，还可以自己手动领取。
          </p>
          <h2 id="add-limit-heading">领取 token limit</h2>
          <p>token limit 领取规则</p>
          <ul>
            <li>
              每月初会自动重置 token limit 为 10000 （当你的 token limit 大于 1w
              时，不重置）
            </li>
            <li>
              每周可手动领取一次 token limit 1000 （当你的 token limit 超过 1w
              时，不能领取）
            </li>
          </ul>
          <hr />
          <p>
            你当前 token limit 数量：{tokensLimit} ；最后领取（或重置）时间：
            {updateLimitAt.toLocaleString()} ；
          </p>
          <p>
            <AddLimit />
          </p>
        </div>
      </div>
    </>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex justify-center items-center">
      <HomeNav />
      {children}
    </div>
  );
}
