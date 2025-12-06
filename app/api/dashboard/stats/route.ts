import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { projects, chunks, sessions, tasks, users } from "@/lib/db/schema"
import { eq, and, gte } from "drizzle-orm"
import type { Session } from "next-auth"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching dashboard stats...")

    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Ensure user exists in database
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (user.length === 0) {
      // Create user if they don't exist
      await db.insert(users).values({
        id: userId,
        email: session.user.email || "",
        name: session.user.name || "",
        timezone: "UTC",
        workHours: { start: "09:00", end: "17:00" },
        energyProfile: { morning: 80, afternoon: 60, evening: 40 },
        defaultChunkMinutes: 10,
      })
    }

    // Get current date ranges
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    let activeProjects, todayChunks, weekSessions

    try {
      // Count active projects for this user only
      activeProjects = await db
        .select()
        .from(projects)
        .where(and(eq(projects.status, "active"), eq(projects.userId, userId)))

      // Count today's scheduled chunks for this user only
      const todayEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      todayChunks = await db
        .select()
        .from(chunks)
        .innerJoin(tasks, eq(chunks.taskId, tasks.id))
        .innerJoin(projects, eq(tasks.projectId, projects.id))
        .where(
          and(
            eq(projects.userId, userId),
            gte(chunks.scheduledStart, today),
            gte(chunks.scheduledEnd, today),
          ),
        )

      // Get week's focus time and completion rate for this user only
      weekSessions = await db
        .select({
          id: sessions.id,
          actualMin: sessions.actualMin,
          outcome: sessions.outcome,
          startedAt: sessions.startedAt,
        })
        .from(sessions)
        .innerJoin(chunks, eq(sessions.chunkId, chunks.id))
        .innerJoin(tasks, eq(chunks.taskId, tasks.id))
        .innerJoin(projects, eq(tasks.projectId, projects.id))
        .where(and(eq(projects.userId, userId), gte(sessions.startedAt, weekAgo)))

    } catch (dbError: any) {
      if (dbError.message?.includes('relation "projects" does not exist')) {
        console.log("[v0] Database tables not found - returning default stats")
        return NextResponse.json({
          activeProjects: 0,
          todayChunks: 0,
          weekFocusTime: 0,
          completionRate: 0,
          message: "Database setup required - please run migration scripts",
        })
      }
      throw dbError
    }

    const weekFocusTime = weekSessions.reduce((sum, session) => sum + (session.actualMin || 0), 0)
    const completedSessions = weekSessions.filter((session) => session.outcome === "done").length
    const completionRate = weekSessions.length > 0 ? (completedSessions / weekSessions.length) * 100 : 0

    console.log("[v0] Dashboard stats fetched successfully for user:", userId)
    return NextResponse.json({
      activeProjects: activeProjects.length,
      todayChunks: todayChunks.length,
      weekFocusTime,
      completionRate,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard stats",
        activeProjects: 0,
        todayChunks: 0,
        weekFocusTime: 0,
        completionRate: 0,
      },
      { status: 500 },
    )
  }
}
