import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { UseFormRegister, FieldValues, Path, RegisterOptions } from "react-hook-form"
import { cn } from "@/lib/utils"
import { FormMessage } from "./ui/form"

interface FormInputProps<T extends FieldValues> {
  label: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: string
  placeholder?: string
  className?: string
  rules?: RegisterOptions
}

export const FormTextInput = <T extends FieldValues>({ 
  label, 
  name, 
  register, 
  error, 
  placeholder,
  className,
}: FormInputProps<T>) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        className="text-md font-bold text-foreground/80"
        htmlFor={name}
      >
        {label}
      </Label>
      <Input
        className="mt-3 border dark:border-dark-border text-foreground"
        id={name}
        type="text"
        placeholder={placeholder}
        {...register(name)}
      />
      {error && (
        <FormMessage className="text-red-500 text-sm">
          {error}
        </FormMessage>
      )}
    </div>
  )
}

export const FormTextArea = <T extends FieldValues>({ 
  label, 
  name, 
  register, 
  error, 
  placeholder,
  className,
}: FormInputProps<T>) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        className="text-md font-bold text-foreground/80"
        htmlFor={name}
      >
        {label}
      </Label>
      <Textarea
        className="rounded w-full dark:text-dark-text dark:bg-dark-input bg-light-bg resize-none mt-3 p-2 border dark:border-dark-border"
        rows={8}
        id={name}
        placeholder={placeholder}
        {...register(name)}
      />
      {error && (
        <FormMessage className="text-red-500 text-sm">
          {error}
        </FormMessage>
      )}
    </div>
  )
}