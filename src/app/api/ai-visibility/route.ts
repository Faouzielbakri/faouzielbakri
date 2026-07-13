import { NextResponse } from "next/server";
import { z } from "zod";
import { runVisibilityChecks } from "@/lib/ai-visibility";

const PayloadSchema = z.object({ url: z.string().min(3).max(300) });

export async function POST(request: Request) {
  let payload: z.infer<typeof PayloadSchema>;
  try {
    payload = PayloadSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const report = await runVisibilityChecks(payload.url);
    return NextResponse.json(report);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Audit failed" },
      { status: 422 },
    );
  }
}
