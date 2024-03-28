import { FeedWrapper } from "@/components/feed-wrapper"
import { StickyWrapper } from "@/components/sticky-wrapper"
import { UserProgress } from "@/components/user-progress"
import { getUserProgress } from "@/db/queries"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Items } from "./items"

const ShopPage = async () => {
  const userProgressData = getUserProgress()

  const [
    userProgress
  ] = await Promise.all([
    userProgressData
  ])

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses")
  }

  return (
    <div className="flex flex-row-reverse gap-[46px] p-6">
      <StickyWrapper>
        <UserProgress
          activeCourses={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubsciption={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image
            src={'/shop.svg'}
            alt="Shop"
            width={90}
            height={90}
          />
          <h1 className="font-bold text-center text-neutral-800 text-2xl my-6">
            Shop
          </h1>
          <p className="text-muted-foreground text-center mb-6 text-lg">
            Gunakan point mu untuk barang keren.
          </p>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={false}
          />
        </div>
      </FeedWrapper>
    </div>
  )
}
export default ShopPage