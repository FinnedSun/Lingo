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
import { useExitModal } from "@/store/use-exit-model"

export const ExitModal = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { isOpen, close } = useExitModal()

  useEffect(() => setIsClient(true), [])

  if (!isClient) return null

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image
              src={'/mascot_sad.svg'}
              alt="mascot sad"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-bold text-2xl text-center">
            Tunggu, jangan pergi!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            kamu akan meninggalkan pelajaran. apa kamu yakin?
          </DialogDescription>
          <DialogFooter className="mb-4">
            <div className="flex flex-col gap-y-4 w-full">
              <Button
                variant={'primary'}
                size={"lg"}
                className="w-full"
                onClick={close}
              >
                Tetap belajar
              </Button>
              <Button
                variant={'dangerOutline'}
                size={"lg"}
                className="w-full"
                onClick={() => {
                  close()
                  router.push('/learn')
                }}
              >
                Akhiri sesi
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}