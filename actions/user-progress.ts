'use server'

import db from "@/db/drizzle"
import { revalidatePath } from "next/cache"

import { getCourseById, getUserProgrss } from "@/db/queries"
import { userProgress } from "@/db/schema"
import { auth, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) throw new Error('Tidak di kanali')

    const course = await getCourseById(courseId)

    if (!course) throw new Error("Kursus tidak di temukan")


    // if (!course.units.length || !course.units[0].lessons.length) throw new Error("Kurus kosong")

    const existingUserProgress = await getUserProgrss()

    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/mascot.svg",
        })

        revalidatePath("/courses")
        revalidatePath("/learn")
        redirect("/learn")
    }

    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
    })

    revalidatePath("/courses")
    revalidatePath("/learn")
    redirect("/learn")
}