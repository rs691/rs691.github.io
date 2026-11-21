"use client"

import {
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FC,
  type ReactNode,
} from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string
  /** Scroll runway height while motion is enabled. Ignored when reduced motion is on. */
  scrollHeight?: CSSProperties["height"]
}

export const TextReveal: FC<TextRevealProps> = ({
  children,
  className,
  scrollHeight = "200vh",
  style,
  ...props
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
  })

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string")
  }

  const words = children.split(/\s+/).filter(Boolean)
  const textClass = cn(
    "flex flex-wrap p-5 text-2xl font-bold",
    "md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl"
  )

  return (
    <div
      ref={sectionRef}
      className={cn("relative z-0", className)}
      {...props}
      style={reduced ? style : { height: scrollHeight, ...style }}
    >
      <div
        className={cn(
          "mx-auto flex max-w-4xl items-center bg-transparent px-4 py-20",
          reduced ? "relative" : "sticky top-0 h-1/2"
        )}
      >
        <span
          className={cn(
            textClass,
            reduced ? "text-foreground" : "text-foreground/20"
          )}
        >
          {words.map((word, i) => {
            if (reduced) {
              return (
                <span
                  key={`${word}-${i}`}
                  className="relative mx-1 lg:mx-1.5 xl:mx-3"
                >
                  {word}
                </span>
              )
            }

            const start = i / Math.max(words.length, 1)
            const end = start + 1 / Math.max(words.length, 1)
            return (
              <Word
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[start, end]}
              >
                {word}
              </Word>
            )
          })}
        </span>
      </div>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mx-1 lg:mx-1.5 xl:mx-3">
      <span className="absolute opacity-30">{children}</span>
      <motion.span style={{ opacity }} className="text-foreground">
        {children}
      </motion.span>
    </span>
  )
}
