'use client'

import { refillHearts } from "@/actions/user-progress"
import { createStripeUrl } from "@/actions/user-subscription"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useTransition } from "react"
import { toast } from "sonner"

export const POINTS_TO_REFILL = 10

type Props = {
  hearts: number
  points: number
  hasActiveSubscription: boolean
}

export const Items = ({
  hearts,
  points,
  hasActiveSubscription
}: Props) => {
  const [pending, startTransition] = useTransition()

  const onRefillHearts = () => {
    if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
      return
    }

    startTransition(() => {
      refillHearts()
        .catch(() => toast.error("Ada yang salah"))
    })
  }

  const onUpgrade = () => {
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if (response.data) {
            window.location.href = response.data
          }
        })
        .catch(() => toast.error("Ada yang salah"))
    })
  }

  return (
    <ul className="w-full">
      <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
        <Image
          src={"/heart.svg"}
          alt="Hearts"
          height={60}
          width={60}
        />
        <div className="flex-1">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">
            Tambah Hati
          </p>
        </div>
        <Button
          onClick={onRefillHearts}
          disabled={
            pending
            || hearts === 5
            || points < POINTS_TO_REFILL
          }
        >
          {hearts === 5
            ? "Penuh"
            : (
              <div className="flex items-center">
                <Image
                  src={"/points.svg"}
                  alt="Points"
                  height={20}
                  width={20}
                />
                <p>{POINTS_TO_REFILL}</p>
              </div>
            )
          }
        </Button>
      </div>
      <div className="flex items-center w-full p-4 pt-8 gap-x-4 border-t-2">
        <Image
          src={"/unlimited.svg"}
          alt="Unlimited"
          height={60}
          width={60}
        />
        <div className="flex-1">
          <p className="text-neutral-700 text-base lg:text-xl font-bold">
            Hati tak terbatas
          </p>
        </div>
        <Button
          onClick={onUpgrade}
          disabled={pending}
        >
          {hasActiveSubscription ? "settings" : "tingkatkan"}
        </Button>
      </div>
    </ul>
  )
}