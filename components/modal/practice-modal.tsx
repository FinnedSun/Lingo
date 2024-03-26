"use client"

import Image from "next/image"
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
import { usePracticeModal } from "@/store/use-practice-modal"

export const PracticeModal = () => {
  const [isClient, setIsClient] = useState(false)
  const { isOpen, close } = usePracticeModal()

  useEffect(() => setIsClient(true), [])

  if (!isClient) return null

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image
              src={'/heart.svg'}
              alt="Heart"
              height={100}
              width={100}
            />
          </div>
          <DialogTitle className="text-bold text-2xl text-center">
            Latihan
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Gunakan latihan untuk mengembalikan hati dan point. kamu tidak bisa kehilangan hati dan point di latihan ini.
          </DialogDescription>
          <DialogFooter className="mb-4">
            <div className="flex flex-col gap-y-4 w-full">
              <Button
                variant={'primary'}
                size={"lg"}
                className="w-full"
                onClick={close}
              >
                Saya mengerti.
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}