"use client"

import * as React from "react"
import { TrashIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

interface DeleteButtonProps extends ButtonProps {
  src?: string
  onClick?: () => void
}

export function DeleteButton({
  className,
  src,
  variant = "ghost",
  onClick,
  ...props
}: DeleteButtonProps) {

  return (
    <Button
      size="icon"
      variant={variant}
      className={cn(
        "relative z-10 h-8 w-8 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 [&_svg]:h-4 [&_svg]:w-4",
        className
      )}
      onClick={() => {
        onClick?.()
      }}
      {...props}
    >
      <span className="sr-only">Delete</span>
      <TrashIcon />
    </Button>
  )
}
