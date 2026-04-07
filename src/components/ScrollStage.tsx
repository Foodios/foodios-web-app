import type { ReactNode } from "react";

type ScrollStageProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

function ScrollStage({ id, className, children }: ScrollStageProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}

export default ScrollStage;
