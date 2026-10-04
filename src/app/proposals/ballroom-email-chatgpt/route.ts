import { proposalResponse } from "@/lib/proposal-html";

export const dynamic = "force-static";

export function GET() {
  return proposalResponse("ballroom-email-chatgpt.html");
}
