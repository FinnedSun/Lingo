'use client'

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { reduceHearts } from "@/actions/user-progress"
import { challengeOptions, challenges } from "@/db/schema"
import { upsertChallengeProgress } from "@/actions/challenge-progress"

import { Header } from "./header"
import { QuestionBubble } from "./question-bubble"
import { Challenge } from "./challeange"
import { Footer } from "./footer"

type Props = {
  initialLessonId: number
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOptions: typeof challengeOptions.$inferSelect[]
  })[]
  initialHearts: number
  initialPercentage: number
  userSubscription: any
}

export const Quiz = ({
  initialLessonId,
  initialLessonChallenges,
  initialHearts,
  initialPercentage,
  userSubscription
}: Props) => {
  const [pending, startTransition] = useTransition()

  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(initialPercentage)
  const [challenges] = useState(initialLessonChallenges)
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)

    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })

  const [selectedOption, setSelectedOption] = useState<number>()
  const [status, setStatus] = useState<"betul" | "salah" | "tidak ada">("tidak ada")

  const challenge = challenges[activeIndex]
  const options = challenge?.challengeOptions ?? []

  const onNext = () => {
    setActiveIndex((current) => current + 1)
  }

  const onSelect = (id: number) => {
    if (status !== 'tidak ada') return

    setSelectedOption(id)
  }

  const onContinue = () => {
    if (!selectedOption) return

    if (status === "salah") {
      setStatus("tidak ada")
      setSelectedOption(undefined)
      return;
    }

    if (status === "betul") {
      onNext()
      setStatus("tidak ada")
      setSelectedOption(undefined)
      return;
    }

    const correntOption = options.find((option) => option.correct)

    if (!correntOption) return

    if (correntOption && correntOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === 'hearts') {
              console.log("Missing hearts")
              return
            }

            setStatus("betul")
            setPercentage((prev) => prev + 100 / challenges.length)

            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5))
            }
          })
          .catch(() => toast.error("Ada yang salah, tolong coba lagi."))
      })
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              console.log("Missing hearts")
              return
            }

            setStatus("salah")

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0))
            }
          })
          .catch(() => toast.error("Ada yang salah, tolong coba lagi."))
      })
    }
  }

  const title = challenge.type === "ASSIST"
    ? "Select the correct meaning"
    : challenge.question;

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  )
}