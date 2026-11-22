export default function PlayCard({ item }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor-label="Open live"
      className="group pointer-events-auto block"
    >
      <div className="aspect-[16/10] w-full overflow-hidden rounded-sm bg-surface-alt ring-1 ring-border-strong/40">
        <img
          src={item.snapshot}
          alt={item.alt}
          loading="lazy"
          draggable="false"
          className="size-full object-cover transition-transform duration-700 ease-cs-out group-hover:scale-[1.015]"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-6">
        <h2 className="m-0 text-[15.5px] font-medium text-ink">{item.title}</h2>
        <span className="shrink-0 text-sm text-muted transition-colors group-hover:text-ink">
          Visit &#8599;
        </span>
      </div>
      <p className="m-0 mt-1 max-w-[560px] text-[15px] leading-[1.6] text-muted">
        {item.description}
      </p>
    </a>
  );
}
