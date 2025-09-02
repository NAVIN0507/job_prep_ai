import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function MarkdownRenderer({
  className,
  children,
  ...props
}: { className?: string } & ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-none prose prose-neutral dark:prose-invert font-sans leading-relaxed tracking-normal p-6 rounded-2xl border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      <div className="space-y-4 text-base text-muted-foreground">
        {typeof children === "string"
          ? children.split("\n").map((line, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {line}
              </p>
            ))
          : children}
      </div>
    </div>
  );
}
