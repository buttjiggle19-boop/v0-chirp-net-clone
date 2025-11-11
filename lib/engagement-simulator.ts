export interface EngagementMetrics {
  views: number
  likes: number
  retweets: number
  replies: number
}

export interface EngagementParams {
  currentMetrics: EngagementMetrics
  followers: number
  monthlyViewers: number
}

// Calculate realistic engagement reach based on follower count
const calculateBaseReach = (followers: number, monthlyViewers: number): number => {
  // More followers = higher base reach
  // Formula: 2-8% of followers see each post, adjusted by monthly viewers
  const followerReach = followers * (0.02 + Math.random() * 0.06)
  const viewerBoost = monthlyViewers > 0 ? monthlyViewers * 0.0001 : 0
  return followerReach + viewerBoost
}

export const simulateTimePassedEngagement = (params: EngagementParams, timePassed: number): EngagementMetrics => {
  const { currentMetrics, followers, monthlyViewers } = params
  const minutes = timePassed / 60000
  const hours = minutes / 60

  // Calculate base reach for this period
  const baseReach = calculateBaseReach(followers, monthlyViewers)

  // More realistic viral curve - peaks around 6-12 hours
  let engagementMultiplier = 0.1
  if (hours > 0.5) engagementMultiplier = 0.3
  if (hours > 1) engagementMultiplier = 0.6
  if (hours > 2) engagementMultiplier = 0.9
  if (hours > 4) engagementMultiplier = 1.2
  if (hours > 6) engagementMultiplier = 1.5
  if (hours > 12) engagementMultiplier = 1.8
  if (hours > 24) engagementMultiplier = 1.4
  if (hours > 36) engagementMultiplier = 0.8
  if (hours > 48) engagementMultiplier = 0.3

  // Growth rates based on reach
  const newViews = Math.floor(currentMetrics.views + baseReach * 0.5 * engagementMultiplier)
  const newLikes = Math.floor(currentMetrics.likes + baseReach * 0.08 * engagementMultiplier)
  const newRetweets = Math.floor(currentMetrics.retweets + baseReach * 0.02 * engagementMultiplier)
  const newReplies = Math.floor(currentMetrics.replies + baseReach * 0.01 * engagementMultiplier)

  return {
    views: Math.max(currentMetrics.views, newViews),
    likes: Math.max(currentMetrics.likes, newLikes),
    retweets: Math.max(currentMetrics.retweets, newRetweets),
    replies: Math.max(currentMetrics.replies, newReplies),
  }
}

export const simulateRealTimeEngagement = (params: EngagementParams): EngagementMetrics => {
  const { currentMetrics, followers, monthlyViewers } = params

  // Calculate realistic engagement rates based on audience
  const baseReach = calculateBaseReach(followers, monthlyViewers)

  // Slow, realistic real-time engagement
  const chance = Math.random()

  // Views: smallest increments, happens often
  const viewIncrement = Math.max(1, Math.floor(baseReach * 0.05 * (0.3 + Math.random() * 0.7)))

  // Likes: fewer, more selective
  const likeChance = Math.max(0.02, 0.06 * (followers / 1000))
  const likes = chance < likeChance ? Math.floor(baseReach * 0.01) : 0

  // Retweets: rare
  const retweetChance = Math.max(0.001, 0.015 * (followers / 1000))
  const retweets = chance < retweetChance ? Math.floor(baseReach * 0.003) : 0

  // Replies: very rare
  const replyChance = Math.max(0.0005, 0.008 * (followers / 1000))
  const replies = chance < replyChance ? 1 : 0

  return {
    views: currentMetrics.views + viewIncrement,
    likes: currentMetrics.likes + likes,
    retweets: currentMetrics.retweets + retweets,
    replies: currentMetrics.replies + replies,
  }
}
