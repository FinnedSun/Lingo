"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useHeartsModal } from "@/store/use-hearts-modal"

export const HeartsModal = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { isOpen, close } = useHeartsModal()

  useEffect(() => setIsClient(true), [])

  const onClick = () => {
    close()
    router.push("/store")
  }

  if (!isClient) return null

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image
              src={'/mascot_bad.svg'}
              alt="mascot sad"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-bold text-2xl text-center">
            Kamu kehabisan hati!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Dapatkan Pro untuk hati yang tak terbatas atau beli di store.
          </DialogDescription>
          <DialogFooter className="mb-4">
            <div className="flex flex-col gap-y-4 w-full">
              <Button
                variant={'primary'}
                size={"lg"}
                className="w-full"
                onClick={onClick}
              >
                Dapatkan hati tak terbatas
              </Button>
              <Button
                variant={'primaryOutline'}
                size={"lg"}
                className="w-full"
                onClick={close}
              >
                Tidak Terima kasih.
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}