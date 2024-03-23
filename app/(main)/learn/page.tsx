import { redirect } from "next/navigation"
import {
  getCoursePorgress,
  getLessonPercentage,
  getUnits,
  getUserProgrss
} from "@/db/queries"
import { FeedWrapper } from "@/components/feed-wrapper"
import { UserProgress } from "@/components/user-progress"
import { StickyWrapper } from "@/components/sticky-wrapper"

import { Header } from "./header"
import { Unit } from "./unit"
import { lessons, units as unitsSchema } from "@/db/schema"

const LearnPage = async () => {
  const userProgressData = getUserProgrss()
  const courseProgressData = getCoursePorgress()
  const lessonPercentageData = getLessonPercentage()
  const unitData = getUnits()

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
  ] = await Promise.all([
    userProgressData,
    unitData,
    courseProgressData,
    lessonPercentageData,
  ])

  if (!userProgress || !userProgress.activeCourse) redirect('/courses')

  if (!courseProgress) redirect('/courses')

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourses={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubsciption={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons}
              activeLesson={
                courseProgress?.actievLesson as typeof lessons.$inferSelect & {
                  unit: typeof unitsSchema.$inferSelect
                } | undefined
              }
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  )
}
export default LearnPage