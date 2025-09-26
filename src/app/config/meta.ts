export type SiteMeta = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  robots?: string;
};

export const defaultMeta: SiteMeta = {
  title: "Olotto — Win Weekly Prizes from Just ₹100",
  description:
    "Join Olotto with just ₹100 and play exciting online games. Track entries, enjoy a safe experience, and unlock rewards worth up to ₹11.5 Cr weekly.",
  url: "https://olotto.co",
  image: "https://olotto.co/og-image.png",
  // default: do not index pages unless explicitly allowed
  robots: "noindex, nofollow",
};

export const pageMeta: Record<string, Partial<SiteMeta>> = {
  "/": {
    title: "Olotto – Win Weekly Prizes from Just ₹100 Game Entries",
    description:
      "Join Olotto with just ₹100 and play exciting online games. Track entries, enjoy a safe experience, and unlock rewards worth up to ₹11.5 Cr weekly.",
    robots: "index, follow",
  },
  "/register": {
    title: "Register on Olotto – Join with ₹100 & Win Weekly Rewards",
    description:
      "Create your Olotto account in minutes. Start with just ₹100 and unlock thrilling online games with rewards worth up to ₹11.5 Cr every week.",
    robots: "index, follow",
  },
  "/login": {
    title: "Login – Olotto: Continue Playing and Winning Big",
    description:
      "Enter your credentials to access Olotto. Track your entries, unlock rewards, and stay connected to ₹11.5 Cr weekly prize potential.",
    robots: "index, follow",
  },
  // add other routes here; omit or leave robots unset to inherit default noindex
};
