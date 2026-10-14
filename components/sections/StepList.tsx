type Step = {title: string; body: string; duration?: string};

export function StepList({steps}: {steps: Step[]}) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-3 rounded-card border border-border bg-surface p-6">
          <span
            aria-hidden="true"
            className="inline-flex size-10 items-center justify-center rounded-full bg-primary font-heading font-bold text-on-primary"
          >
            {index + 1}
          </span>
          <h3 className="font-heading text-h3 font-bold text-text">{step.title}</h3>
          <p className="text-muted">{step.body}</p>
          {step.duration ? <p className="mt-auto text-sm font-semibold text-secondary">{step.duration}</p> : null}
        </li>
      ))}
    </ol>
  );
}
