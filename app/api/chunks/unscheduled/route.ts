import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { chunks, tasks, projects, users } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import type { Session } from "next-auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
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

    const allChunks = await db
      .select({
        id: chunks.id,
        title: chunks.title,
        description: chunks.description,
        durationMin: chunks.durationMin,
        energy: chunks.energy,
        status: chunks.status,
        scheduledStart: chunks.scheduledStart,
        scheduledEnd: chunks.scheduledEnd,
        taskTitle: tasks.title,
        projectTitle: projects.title,
      })
      .from(chunks)
      .innerJoin(tasks, eq(chunks.taskId, tasks.id))
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(chunks.status, "todo"), eq(projects.userId, userId)))

    const unscheduled = allChunks.filter((chunk) => !chunk.scheduledStart)
    const scheduled = allChunks.filter((chunk) => chunk.scheduledStart)

    return NextResponse.json({
      unscheduled,
      scheduled,
    })
  } catch (error) {
    console.error("Error fetching chunks:", error)
    return NextResponse.json({ error: "Failed to fetch chunks" }, { status: 500 })
  }
}
