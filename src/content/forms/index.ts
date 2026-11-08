import { detentionApp } from "./detention-app";
import type { FormDefinition } from "./types";

/**
 * Client forms served under /forms/<slug>, in the site's own style.
 * To add one: write a definition next to detention-app.ts and list it here.
 */
export const FORMS: FormDefinition[] = [detentionApp];

export function findForm(slug: string) {
  return FORMS.find((form) => form.slug === slug);
}
