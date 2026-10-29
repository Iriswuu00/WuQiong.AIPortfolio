import { cn } from "@/lib/utils";

/**
 * Splits text into per-character spans so the source site's
 * "charUp" reveal animation can be applied with a stagger.
 */
export function SplitChars({
  text,
  className,
  charClassName,
  delayStep = 0.035,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  charClassName?: string;
  delayStep?: number;
  as?: "span" | "h1" | "h2" | "h3" | "div" | "p";
}) {
  const chars = text.split("");
  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className={cn("char", charClassName)}
          style={{
            transitionDelay: `${(i * delayStep).toFixed(3)}s`,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </Tag>
  );
}
