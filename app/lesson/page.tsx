import { getLesson, getUserProgrss } from "@/db/queries"
import { redirect } from "next/navigation"
import Quiz from "./quiz"

const LessonPage = async () => {
  const lessonData = getLesson()
  const userProgressData = getUserProgrss()

  const [
    lesson,
    userProgress,
  ] = await Promise.all([
    lessonData,
    userProgressData
  ])


  if (!lesson || !userProgress) redirect('/learn')

  const initialPercentage = lesson.challenges
    .filter((challenge) => challenge.completed)
    .length / lesson.challenges.length * 100
  return (
    <div>
      <Quiz
        initialLessonId={lesson.id}
        initialLessonChallenges={lesson.challenges}
        initialHearts={userProgress.hearts}
        initialPercentage={initialPercentage}
        userSubscription={null}
      />
    </div>
  )
}
export default LessonPage