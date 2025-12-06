import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sessions, chunks, tasks, projects } from "@/lib/db/schema"
import { createId } from "@paralleldrive/cuid2"
import { eq, and } from "drizzle-orm"
import type { Session } from "next-auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { chunkId } = body

    if (!chunkId) {
      return NextResponse.json({ error: "Chunk ID required" }, { status: 400 })
    }

    // Verify that the chunk belongs to the authenticated user
    const chunkExists = await db
      .select()
      .from(chunks)
      .innerJoin(tasks, eq(chunks.taskId, tasks.id))
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(chunks.id, chunkId), eq(projects.userId, userId)))
      .limit(1)

    if (chunkExists.length === 0) {
      return NextResponse.json({ error: "Chunk not found or unauthorized" }, { status: 404 })
    }

    const sessionId = createId()

    await db.insert(sessions).values({
      id: sessionId,
      chunkId,
      startedAt: new Date(),
    })

    const newSession = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1)

    return NextResponse.json(newSession[0])
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
