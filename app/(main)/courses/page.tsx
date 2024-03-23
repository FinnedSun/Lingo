import { getCourses, getUserProgrss } from "@/db/queries"

import { List } from "./list"

const CoursesPage = async () => {
  const coursesData = await getCourses()
  const userProgressData = await getUserProgrss()

  const [courses, userProgress] = await Promise.all([
    coursesData,
    userProgressData
  ])

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">
        Belajar Bahasa
      </h1>


      <List
        courses={courses}
        activeCoursesId={userProgress?.activeCourseId}
      />
    </div>
  )
}
export default CoursesPage