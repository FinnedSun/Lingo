import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

import db from "@/db/drizzle";
import {
  challengeProgress,
  challenges,
  courses,
  lessons,
  units,
  userProgress
} from "@/db/schema";

export const getUserProgrss = cache(async () => {
  const { userId } = await auth()

  if (!userId) return null

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    }
  })

  return data
})

export const getUnits = cache(async () => {
  const { userId } = await auth()
  const userProgress = await getUserProgrss()

  if (!userId || !userProgress?.activeCourseId) {
    return []
  }

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(
                  challengeProgress.userId,
                  userId,
                )
              },
            },
          },
        },
      },
    },
  })

  const normalizedData = data.map((unit) => {
    const lessonsWithComplitedStatus = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) return { ...lesson, completed: false }
      const allCompletedChallenges = lesson.challenges.every((challenges) => {
        return challenges.challengeProgress
          && challenges.challengeProgress.length > 0
          && challenges.challengeProgress.every((progress) => progress.completed)
      })

      return { ...lesson, completed: allCompletedChallenges }
    })

    return { ...unit, lesson: lessonsWithComplitedStatus }
  })

  return normalizedData
})

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany()

  return data
})

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId)
  })

  return data
})

export const getCoursePorgress = cache(async () => {
  const { userId } = await auth()
  const userProgress = await getUserProgrss()

  if (!userId || !userProgress?.activeCourseId) return null

  const unitInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId)
              },
            },
          },
        },
      },
    },
  })

  const firstUncompetedLesson = unitInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return !challenge.challengeProgress
          || challenge.challengeProgress.length === 0
          || challenge.challengeProgress.some((prosess) => prosess.completed === false)
      })
    })

  return {
    actievLesson: firstUncompetedLesson,
    activeLessonId: firstUncompetedLesson?.id,
  }
})

export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth()

  if (!userId) return null

  const userProgress = await getUserProgrss()

  const lessonId = id || userProgress?.activeCourseId

  if (!lessonId) return null

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return null

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed = challenge.challengeProgress
      && challenge.challengeProgress.length > 0
      && challenge.challengeProgress.every((prosess) => prosess.completed)

    return { ...challenge, completed }
  })

  return { ...data, challenges: normalizedChallenges }
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCoursePorgress()

  if (!courseProgress?.activeLessonId) return 0

  const lesson = await getLesson(courseProgress.activeLessonId)

  if (!lesson) return 0

  const completedChallenges = lesson.challenges
    .filter((challenge) => challenge.completed)
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100,
  );

  return percentage
});