import { differenceInHours, formatDistanceToNowStrict } from "date-fns"

// en-US parts reassembled as "19 Sep 2026" (en-IN/en-GB print "Sept"), in IST
const dateParts = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
})

function formatDate(date: Date) {
  const p = Object.fromEntries(dateParts.formatToParts(date).map((x) => [x.type, x.value]))
  return `${p.day} ${p.month} ${p.year}`
}

// Publish label for a post, computed from its real createdAt:
// "3 hours ago" within the last day, "19 Sep 2026" after that.
export function postDateLabel(post: { createdAt?: string | Date }) {
  if (!post.createdAt) return ""
  const date = new Date(post.createdAt)
  if (isNaN(date.getTime())) return ""

  if (differenceInHours(new Date(), date) < 24) {
    return `${formatDistanceToNowStrict(date, { roundingMethod: "floor" })} ago`
  }
  return formatDate(date)
}
