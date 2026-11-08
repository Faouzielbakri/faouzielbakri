/**
 * A client form is plain data: sections of questions, rendered on the site by
 * /forms/<slug> in the site's own style. Answers go to the FormResponse table
 * (src/app/api/forms/[slug]/route.ts) and show in the dashboard's Forms view.
 */

/** A choice: the stored value, and a shorter label for the chip when it differs. */
export type Choice = string | { value: string; label: string };

type Base = {
  /** Stable key for drafts saved in the browser. Never rename once a form is sent. */
  id: string;
  /** The question as the client reads it; also what the dashboard shows. */
  label: string;
  hint?: string;
  /** Sits beside the next half-width field on wide screens. */
  half?: boolean;
};

export type Field = Base &
  (
    | { type: "text"; placeholder?: string }
    | { type: "textarea"; placeholder?: string }
    | { type: "number"; unit?: string; placeholder?: string; decimal?: boolean }
    | { type: "select"; options: string[] }
    /** One choice, shown as chips. */
    | { type: "single"; options: Choice[] }
    /** Any number of choices, shown as chips. */
    | { type: "multi"; options: Choice[] }
  );

/** A short explanation between questions. */
export type Note = { note: string };

export type Block = Field | Note;

export type FormSection = { title: string; blocks: Block[] };

export type FormDefinition = {
  slug: string;
  /** For the dashboard and the browser tab. */
  title: string;
  /** Who it was sent to, for the dashboard. */
  client: string;
  eyebrow: string;
  /** The page heading; the last word is set in the accent italic. */
  heading: [string, string];
  lead: string;
  minutes: number;
  sections: FormSection[];
};

export const isNote = (block: Block): block is Note => "note" in block;
export const choiceValue = (choice: Choice) => (typeof choice === "string" ? choice : choice.value);
export const choiceLabel = (choice: Choice) => (typeof choice === "string" ? choice : choice.label);
