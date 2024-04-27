import { redirect } from "next/navigation"
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription
} from "@/db/queries"
import { FeedWrapper } from "@/components/feed-wrapper"
import { UserProgress } from "@/components/user-progress"
import { StickyWrapper } from "@/components/sticky-wrapper"

import { Header } from "./header"
import { Unit } from "./unit"
import { lessons, units as unitsSchema } from "@/db/schema"
import { Promo } from "@/components/promo"
import { Quests } from "@/components/quests"

export const metadata = {
  title: "Learn"
}

const LearnPage = async () => {
  const userProgressData = getUserProgress()
  const courseProgressData = getCourseProgress()
  const lessonPercentageData = getLessonPercentage()
  const unitData = getUnits()
  const userSubscriptionData = getUserSubscription()

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
  ] = await Promise.all([
    userProgressData,
    unitData,
    courseProgressData,
    lessonPercentageData,
    userSubscriptionData
  ])

  if (!userProgress || !userProgress.activeCourse) redirect('/courses')

  if (!courseProgress) redirect('/courses')

  const isPro = !!userSubscription?.isActive

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourses={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubsciption={isPro}
        />
        {!isPro && (
          <Promo />
        )}
        <Quests points={userProgress.points} />
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
                courseProgress?.activeLesson as typeof lessons.$inferSelect & {
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