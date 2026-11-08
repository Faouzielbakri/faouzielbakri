import type { FormDefinition } from "./types";

export const detentionApp: FormDefinition = {
  slug: "detention-app",
  title: "Truck detention app: project brief",
  client: "Detention app (friend)",
  eyebrow: "Project brief · Mobile app · iOS & Android",
  heading: ["Truck detention", "app"],
  lead: "Before I give you a final price and timeline, I need a few details about how the app should work. Answer what you can. If you are not sure about something, pick “Not sure” and we will decide together.",
  minutes: 10,
  sections: [
    {
      title: "Users & routes",
      blocks: [
        { id: "app-name", type: "text", label: "App name (if you have one)" },
        { note: "The app is built for trucks running in the USA by default." },
        {
          id: "outside-usa",
          type: "single",
          label: "Will drivers also run loads outside the USA?",
          options: [
            "No, USA only",
            { value: "Yes, also Canada", label: "Also Canada" },
            { value: "Yes, also Mexico", label: "Also Mexico" },
            { value: "Yes, Canada and Mexico", label: "Canada and Mexico" },
            "Not sure",
          ],
          hint: "Cross-border loads change the units (km, CAD), the claim letter, and sometimes the language.",
        },
        {
          id: "target-users",
          type: "multi",
          label: "Who is the app for at launch?",
          options: [
            "Owner-operators",
            "Company drivers",
            { value: "Small fleets (dispatcher manages drivers)", label: "Small fleets with a dispatcher" },
          ],
        },
        {
          id: "fleet-admin",
          type: "single",
          label: "Do fleets need an admin account to see all their drivers' trips?",
          options: ["Yes, in version 1", "Later", "No", "Not sure"],
        },
        {
          id: "drivers-month-1",
          type: "select",
          half: true,
          label: "Drivers expected in the first month",
          options: ["Under 50", "50 to 200", "200 to 1,000", "Over 1,000", "Not sure"],
        },
        {
          id: "drivers-year-1",
          type: "select",
          half: true,
          label: "Drivers expected after 1 year",
          options: ["Under 500", "500 to 2,000", "2,000 to 10,000", "Over 10,000", "Not sure"],
        },
        {
          id: "trips-per-week",
          type: "number",
          label: "Trips per driver per week (roughly)",
          unit: "trips / week",
          placeholder: "5",
          hint: "This sets the server, scanning and email costs, so the estimate is more accurate.",
        },
        {
          id: "driver-acquisition",
          type: "multi",
          label: "How will you get your first drivers?",
          options: [
            { value: "Personal network / trucking contacts", label: "My trucking contacts" },
            { value: "Facebook / TikTok trucker groups", label: "Trucker groups online" },
            "Paid ads",
            "A fleet partner",
            "Not sure yet",
          ],
        },
        { id: "languages", type: "multi", label: "App languages", options: ["English", "Spanish", "Other"] },
      ],
    },
    {
      title: "Detention rules",
      blocks: [
        {
          note: "In the US, detention usually starts after the appointment time plus free time (often 2 hours), not when the truck arrives. The free time and rate come from each load's rate confirmation, so the app needs to know them per load.",
        },
        {
          id: "clock-start",
          type: "single",
          label: "When should the detention clock start?",
          options: [
            { value: "Later of arrival or appointment time", label: "Later of arrival or appointment" },
            { value: "On arrival in the geofence", label: "On arrival" },
            "Driver taps check-in",
            "Not sure",
          ],
        },
        { id: "free-time", type: "number", half: true, decimal: true, label: "Default free time", unit: "hours", placeholder: "2" },
        { id: "rate", type: "number", half: true, label: "Default detention rate", unit: "USD / hour", placeholder: "50" },
        {
          id: "per-load-override",
          type: "single",
          label: "Can the driver change free time and rate for each load?",
          options: ["Yes", "No, use defaults"],
        },
        {
          id: "clock-stop",
          type: "multi",
          label: "When should the clock stop?",
          options: [
            { value: "Driver leaves the geofence", label: "Driver leaves the area" },
            { value: "Driver taps Done unloading", label: "Driver taps “Done”" },
            "Not sure",
          ],
        },
        {
          id: "multi-stop",
          type: "single",
          label: "Can one trip have several stops (pickup + one or more deliveries)?",
          options: ["Yes", { value: "One stop per trip is enough", label: "One stop is enough" }, "Not sure"],
        },
      ],
    },
    {
      title: "Documents & scanning",
      blocks: [
        {
          id: "documents",
          type: "multi",
          label: "Which documents should the driver scan?",
          options: [
            { value: "Bill of Lading (BOL)", label: "Bill of Lading" },
            "Rate confirmation",
            { value: "Signed POD / receipt", label: "Signed delivery receipt" },
          ],
        },
        {
          note: "The broker's email is usually on the rate confirmation, not on the BOL. If we only scan the BOL, the driver will often need to type the email.",
        },
        {
          id: "samples",
          type: "single",
          label: "Can you send me 3 to 5 real BOLs and rate confirmations (names can be blurred)?",
          options: ["Yes", "I will try", "No"],
        },
      ],
    },
    {
      title: "Claims & emails",
      blocks: [
        {
          id: "claim-sending",
          type: "single",
          label: "How should the claim be sent?",
          options: ["Driver reviews, then taps Send", "Fully automatic", "Not sure"],
          hint: "I recommend review first. If the scan reads a wrong email, a fully automatic claim goes to the wrong company.",
        },
        {
          id: "email-from",
          type: "single",
          label: "Who should the email come from?",
          options: [
            { value: "App address, reply-to the driver", label: "App address, replies go to driver" },
            "Driver's own email",
            "Not sure",
          ],
        },
        {
          id: "demand-letter",
          type: "single",
          label: "Do you already have a demand letter text?",
          options: [
            { value: "Yes, I have one", label: "Yes" },
            { value: "No, write one for me", label: "No, write one" },
            "A lawyer will write it",
          ],
        },
        {
          id: "claim-extras",
          type: "multi",
          label: "Extra claim features",
          options: [
            { value: "Automatic follow-up reminder if unpaid", label: "Follow-up reminders" },
            { value: "Mark claim as paid / disputed", label: "Mark paid / disputed" },
            { value: "Total recovered dashboard", label: "Total money recovered" },
            "Saved broker list",
          ],
        },
      ],
    },
    {
      title: "Subscription",
      blocks: [
        {
          note: "Apple and Google require in-app purchase for app subscriptions and keep 15 to 30%. At $1 per month you would keep around 70 cents per user before server and AI costs.",
        },
        { id: "price", type: "number", half: true, decimal: true, label: "Monthly price", unit: "USD / month", placeholder: "1" },
        {
          id: "trial",
          type: "select",
          half: true,
          label: "Free trial",
          options: ["No trial", "7 days", "14 days", "First claim free", "Not sure"],
        },
        {
          id: "other-plans",
          type: "multi",
          label: "Other plans?",
          options: ["Yearly plan", { value: "Fleet plan (per driver)", label: "Fleet plan" }, "Only one plan"],
        },
      ],
    },
    {
      title: "Brand & accounts",
      blocks: [
        {
          id: "has-already",
          type: "multi",
          label: "What do you already have?",
          options: [
            "Logo",
            "Brand colors",
            "Domain name",
            { value: "Apple Developer account ($99/yr)", label: "Apple Developer account" },
            { value: "Google Play account ($25)", label: "Google Play account" },
            "Nothing yet",
          ],
        },
        { id: "reference-apps", type: "textarea", label: "Apps you like (design or features)", placeholder: "Names or links" },
      ],
    },
    {
      title: "Scope & budget",
      blocks: [
        { id: "must-have", type: "textarea", label: "The 3 features that must be in version 1" },
        { id: "later", type: "textarea", label: "Features that can wait for version 2" },
        {
          id: "budget",
          type: "select",
          label: "Budget range",
          options: ["Under 12,000 MAD", "12,000 to 20,000 MAD", "20,000 to 30,000 MAD", "Over 30,000 MAD", "Let's discuss"],
        },
      ],
    },
    {
      title: "Timeline & launch",
      blocks: [
        {
          note: "After the app is finished, Apple usually takes 1 to 3 days to review it and Google a few hours to a few days. A first rejection is common for apps that use background location, so plan about 1 extra week.",
        },
        {
          id: "start",
          type: "select",
          half: true,
          label: "When can we start?",
          options: ["Right away", "Within 2 weeks", "Within a month", "Not decided"],
        },
        {
          id: "test-version",
          type: "select",
          half: true,
          label: "When do you want a test version on your phone?",
          options: ["As soon as possible (2 weeks)", "Within 1 month", "No rush"],
        },
        {
          id: "live-in-stores",
          type: "select",
          half: true,
          label: "When should drivers be able to download it?",
          options: ["Within 1 month", "1 to 2 months", "2 to 3 months", "No fixed date"],
        },
        {
          id: "date-reason",
          type: "text",
          half: true,
          label: "Is there a reason for that date?",
          placeholder: "e.g. a launch event, a partner",
        },
        {
          id: "store-first",
          type: "single",
          label: "Which store first?",
          options: [
            { value: "Both at the same time", label: "Both together" },
            { value: "Android first, iPhone after", label: "Android first" },
            { value: "iPhone first, Android after", label: "iPhone first" },
            "Not sure",
          ],
          hint: "Most US truck drivers use iPhone or Android about evenly. Launching on one store first can save 1 to 2 weeks.",
        },
        {
          id: "pilot",
          type: "single",
          label: "Do you want a small group of drivers to test it before the public launch?",
          options: [
            { value: "Yes, I have drivers to test", label: "Yes, I have testers" },
            { value: "Yes, but I need to find them", label: "Yes, need to find them" },
            "No, launch directly",
          ],
        },
      ],
    },
    {
      title: "Maintenance & support",
      blocks: [
        {
          id: "maintenance-level",
          type: "single",
          label: "After launch, what level of maintenance do you want?",
          options: [
            "Bug fixes only",
            { value: "Bug fixes + iOS/Android updates + server care", label: "Fixes, OS updates, server care" },
            { value: "All of that + small new features each month", label: "All of that + small new features" },
            "No maintenance",
            "Let's discuss",
          ],
        },
        {
          id: "maintenance-length",
          type: "select",
          half: true,
          label: "For how long?",
          options: ["3 months", "6 months", "12 months", "Month to month"],
        },
        {
          id: "fix-speed",
          type: "select",
          half: true,
          label: "If something breaks, how fast should it be fixed?",
          options: ["Same day", "Within 48 hours", "Within a week"],
        },
        {
          id: "support",
          type: "single",
          label: "Who answers drivers' questions and support emails?",
          options: [{ value: "Me / my team", label: "Me or my team" }, "The developer", "Not sure"],
        },
        {
          id: "running-costs",
          type: "single",
          label: "Who pays the running costs (server, AI scanning, emails, store accounts)?",
          options: [
            "Me, on my own card",
            { value: "Developer pays, I refund monthly", label: "Developer pays, I refund" },
            "Not sure",
          ],
          hint: "Expect roughly $30 to $100 per month at the start, growing with the number of drivers.",
        },
        {
          id: "admin-dashboard",
          type: "single",
          label: "Do you want an admin dashboard to see users, subscriptions and claims?",
          options: ["Yes, in version 1", "Later", "No"],
        },
        {
          id: "ownership",
          type: "single",
          label: "Who should own the code and accounts at the end?",
          options: ["Everything in my name", "Developer manages, transfer later", "Not sure"],
        },
        { id: "other-notes", type: "textarea", label: "Anything else I should know?" },
      ],
    },
  ],
};
