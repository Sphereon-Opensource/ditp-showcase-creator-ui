"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon, ExternalLinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, ButtonProps } from "@/components/ui/button"

interface OpenButtonProps extends ButtonProps {
  value: string
  src?: string
}

export function OpenButton({
  value,
  className,
  src,
  variant = "ghost",
  ...props
}: OpenButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Button
      size="icon"
      variant={variant}
      className={cn(
        "relative z-10 h-8 w-8 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 [&_svg]:h-4 [&_svg]:w-4",
        className
      )}
      onClick={() => {
        window.open(value, "_blank")
      }}
      {...props}
    >
      <span className="sr-only">Open</span>
      <ExternalLinkIcon />
    </Button>
  )
}
