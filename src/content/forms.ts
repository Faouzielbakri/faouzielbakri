/**
 * Client forms served under /forms/<slug>. Each is a hand-built (or
 * Claude-artifact) HTML file in content/forms/<slug>.html; answers land in the
 * FormResponse table and show in the dashboard's Forms view.
 *
 * To add one: drop the HTML in content/forms/ and add a line here.
 */
export const FORMS = [
  { slug: "detention-app", title: "Truck detention app: project brief", client: "Detention app (friend)" },
] as const;

export type FormSlug = (typeof FORMS)[number]["slug"];

export function findForm(slug: string) {
  return FORMS.find((form) => form.slug === slug);
}
