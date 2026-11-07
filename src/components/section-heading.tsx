import { cn } from "@/lib/utils"

type Props = {
  title: string
  text?: string
  id?: string
  align?: "left" | "center"
  className?: string
  /** Optional action rendered on the right (left-aligned layout only). */
  action?: React.ReactNode
  invert?: boolean
}

export function SectionHeading({ title, text, id, align = "left", className, action, invert }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn(align === "left" && "max-w-2xl")}>
        <h2 id={id} className={cn("text-display font-medium", invert ? "text-white" : "text-deep")}>
          {title}
        </h2>
        {text && (
          <p className={cn("mt-4 text-lg leading-relaxed", invert ? "text-white/80" : "text-muted-foreground")}>
            {text}
          </p>
        )}
      </div>
      {align === "left" && action}
    </div>
  )
}
