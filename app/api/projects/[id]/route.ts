import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { projects, tasks, chunks } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import type { Session } from "next-auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions) as Session | null
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const projectId = params.id

    // Fetch project with user ownership check
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1)

    if (project.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, projectId))

    const tasksWithChunks = await Promise.all(
      projectTasks.map(async (task) => {
        const taskChunks = await db.select().from(chunks).where(eq(chunks.taskId, task.id)).orderBy(chunks.orderIndex)

        return {
          ...task,
          chunks: taskChunks,
        }
      }),
    )

    return NextResponse.json({
      ...project[0],
      tasks: tasksWithChunks,
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}
