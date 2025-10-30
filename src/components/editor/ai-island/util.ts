import { DOC_TITLE_INPUT_ID, AI_RES_MAX_TOKENS } from "@/constants";
import { MessagesType } from "./messages";

const ORIGIN = process.env.NEXT_PUBLIC_GPT_API_PROXY_ORIGIN || "";
const TOKEN = process.env.NEXT_PUBLIC_GPT_API_PROXY_AUTH_TOKEN || "";

export function genGPTUrl(messages: MessagesType) {
  let url = "/api/gpt/chat?a=1";

  if (ORIGIN) {
    url = ORIGIN + url + `&x-auth-token=${TOKEN}`;
  }

  const option = {
    messages,
    max_tokens: AI_RES_MAX_TOKENS,
  };
  const optionStr = JSON.stringify(option);

  url = url + `&option=${encodeURIComponent(optionStr)}`;

  return url;
}
export function getTitle(): string {
  const titleInput = document.getElementById(
    DOC_TITLE_INPUT_ID,
  ) as HTMLInputElement;
  return titleInput?.value || "";
}
