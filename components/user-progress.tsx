import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { InfinityIcon } from "lucide-react"
import { courses } from "@/db/schema"

type Props = {
  activeCourses: typeof courses.$inferSelect
  hearts: number
  points: number
  hasActiveSubsciption: boolean
}

export const UserProgress = ({
  activeCourses,
  hearts,
  points,
  hasActiveSubsciption
}: Props) => {
  return (
    <div className="flex items-center justify-center gap-x-2 w-full">
      <Link href={'/courses'}>
        <Button variant={'ghost'}>
          <Image
            src={activeCourses.imageSrc}
            alt={activeCourses.title}
            className="rounded-md border"
            width={32}
            height={32}
          />
        </Button>
      </Link>
      <Link href={'/shop'}>
        <Button variant={'ghost'} className="text-orange-500">
          <Image
            src={'/points.svg'}
            height={28}
            width={28}
            alt="Points"
            className="mr-2"
          />
          {points}
        </Button>
      </Link>
      <Link href={'/shop'}>
        <Button variant={'ghost'} className="text-rose-500">
          <Image
            src={'/heart.svg'}
            height={22}
            width={22}
            alt="Hearts"
            className="mr-2"
          />
          {hasActiveSubsciption
            ? <InfinityIcon className="h-4 w-4 stroke-[3]" />
            : hearts
          }
        </Button>
      </Link>
    </div>
  )
}