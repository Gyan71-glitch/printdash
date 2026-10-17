// The fixed list editors pick a post's category from. Each category page shows
// exactly the posts tagged with it; "Latest" is not a category, it lists every post.
// The first six follow "Latest" in the navbar's top row.
export const CATEGORIES = [
  "Markets", "News", "Brands Story", "Politics", "Business", "IPO",
  "Global", "Asia News", "Economy", "Finance", "Policy", "Crypto",
  "Crime", "Investigations", "Dark Web", "Sports", "Automotive", "Education", "AI World",
] as const

export type Category = (typeof CATEGORIES)[number]

export const NAV_CATEGORIES = ["Latest", ...CATEGORIES]

export function categorySlug(name: string) {
  return name.toLowerCase().replace(/ /g, "_")
}

export function categoryFromSlug(slug: string): Category | undefined {
  const s = slug.toLowerCase()
  return CATEGORIES.find((c) => categorySlug(c) === s)
}

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.includes(value as Category)
}
