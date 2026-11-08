import { FORMS, findForm } from "@/content/forms";
import { formResponse } from "@/lib/form-html";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return FORMS.map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, ctx: RouteContext<"/forms/[slug]">) {
  const { slug } = await ctx.params;
  if (!findForm(slug)) return new Response("Not found", { status: 404 });
  return formResponse(slug);
}
