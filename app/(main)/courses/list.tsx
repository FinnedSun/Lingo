"use client"

import { courses, userProgress } from "@/db/schema"
import { useTransition } from "react"

import { useRouter } from "next/navigation"
import { upsertUserProgress } from "@/actions/user-progress"

import { Card } from "./card"
import { toast } from "sonner"

type Props = {
  courses: typeof courses.$inferSelect[]
  activeCoursesId?: typeof userProgress.$inferSelect.activeCourseId
}

export const List = ({
  courses,
  activeCoursesId
}: Props) => {
  const router = useRouter()
  const [panding, startTransiton] = useTransition()

  const onClick = (id: number) => {
    if (panding) return

    if (id === activeCoursesId) {
      return router.push('/learn')
    }

    startTransiton(() => {
      upsertUserProgress(id)
        .catch(() => toast.error("Ada kesalahan."))
    })
  }

  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={false}
          active={course.id === activeCoursesId}
        />
      ))}
    </div>
  )
}