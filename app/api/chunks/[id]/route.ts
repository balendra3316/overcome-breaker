import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { chunks, tasks, projects } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import type { Session } from "next-auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const chunkId = params.id
    
    // Get chunk with user ownership verification
    const chunk = await db
      .select({
        id: chunks.id,
        taskId: chunks.taskId,
        title: chunks.title,
        description: chunks.description,
        durationMin: chunks.durationMin,
        deps: chunks.deps,
        energy: chunks.energy,
        resources: chunks.resources,
        acceptanceCriteria: chunks.acceptanceCriteria,
        orderIndex: chunks.orderIndex,
        scheduledStart: chunks.scheduledStart,
        scheduledEnd: chunks.scheduledEnd,
        status: chunks.status,
        createdAt: chunks.createdAt,
        updatedAt: chunks.updatedAt,
      })
      .from(chunks)
      .innerJoin(tasks, eq(chunks.taskId, tasks.id))
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(chunks.id, chunkId), eq(projects.userId, session.user.id)))
      .limit(1)

    if (chunk.length === 0) {
      return NextResponse.json({ error: "Chunk not found" }, { status: 404 })
    }

    return NextResponse.json(chunk[0])
  } catch (error) {
    console.error("Error fetching chunk:", error)
    return NextResponse.json({ error: "Failed to fetch chunk" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { status } = body
    const chunkId = params.id

    // Verify user owns this chunk before updating
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

    await db
      .update(chunks)
      .set({ status: status as "todo" | "doing" | "done" | "snoozed" | "stuck" })
      .where(eq(chunks.id, chunkId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating chunk:", error)
    return NextResponse.json({ error: "Failed to update chunk" }, { status: 500 })
  }
}
