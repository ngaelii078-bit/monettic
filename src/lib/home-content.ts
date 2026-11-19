import { projects, services } from "./content";

/**
 * Homepage copy and facts. Every figure here is true today; replace or extend
 * them as real campaign numbers come in (emails sent, calls booked, clients won).
 */
export const heroStats = [
  { value: projects.length, suffix: "", label: "client websites live" },
  { value: services.length, suffix: "", label: "services, one team" },
  { value: 6, suffix: "", label: "stages from lead to client" },
  { value: 100, suffix: "%", label: "of messages approved by you" },
];

export const heroPromises = ["you approve every message", "a no ends outreach", "CRM included", "built around your offer"];

export const pipelineStages = [
  { label: "Leads found", short: "audience", bar: 100, heading: "we agree who counts, before anything sends.", description: "Industry, size, area and who can say yes. You sign off the audience first, whether you sell to businesses, consumers or both." },
  { label: "Contacts sourced", short: "clean list", bar: 86, heading: "a clean list, built for your offer.", description: "Contact details from public and approved sources, checked for fit, with duplicates removed before a single email is written." },
  { label: "Emails sent", short: "sequence", bar: 64, heading: "personal emails, approved by you.", description: "Messages are written around your offer and your audience. Nothing sends until you have reviewed it." },
  { label: "Replies", short: "inbox", bar: 38, heading: "every reply sorted, fast.", description: "Interested replies are organised for your team. A no, or no response, ends outreach and contact preferences are respected." },
  { label: "Calls booked", short: "calendar", bar: 22, heading: "the call lands on your calendar.", description: "Interested leads reach your team with context, so the first conversation starts warm instead of cold." },
  { label: "Clients closed", short: "CRM", bar: 13, heading: "you close. the CRM keeps score.", description: "Conversations, next steps and closed clients sit together in your dashboard and CRM, so nothing slips." },
] as const;

/** Index of the stage where the client's team takes over. */
export const handoverStage = 4;

export const featuredWorkIds = ["dg-property", "dcb-spares", "thunder-brothers", "ngenzeni"];

export const dashboardFeatures = [
  { label: "Lead history", title: "every touch in one timeline" },
  { label: "Sales scripts", title: "what to say, lead by lead" },
  { label: "AI sales advice", title: "the next best step, suggested" },
  { label: "CRM included", title: "owners, stages and pipeline" },
  { label: "Website activity", title: "known leads' visits, linked" },
];

export const comparisonColumns = ["hiring in house", "separate freelancers", "monettic"] as const;
export const comparisonRows = [
  { label: "you get", values: ["one person", "separate pieces", "one connected system"] },
  { label: "lead lists", values: ["you build them", "bought separately", "researched for your offer"] },
  { label: "CRM + dashboard", values: ["another tool to buy", "not their job", "included"] },
  { label: "who joins it up", values: ["you", "you", "we do"] },
];

export const outreachStandards = [
  { title: "fit", text: "the audience you signed off" },
  { title: "approved", text: "you review every message first" },
  { title: "respectful", text: "a no, or no reply, ends it" },
  { title: "in context", text: "replies reach you with history" },
  { title: "tracked", text: "every lead lands in your CRM" },
];

/** Service cards that have their own page link there; the rest open the enquiry form. */
export const serviceSlugs: Record<string, string> = {
  "Website build": "website-design",
  "SEO + AEO": "seo-aeo",
  "AI integration": "ai-automation",
  "Lead generation": "lead-generation",
};
