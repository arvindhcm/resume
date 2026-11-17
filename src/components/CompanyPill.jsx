export default function CompanyPill({ name, href, logo }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-0.5 inline-flex items-center gap-1.5 rounded-[8px] border border-border-strong bg-surface px-2 py-px align-middle text-[14.5px] leading-6 font-medium text-ink shadow-sm transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-px hover:shadow-md"
    >
      <img src={logo} alt="" aria-hidden="true" className="h-4 w-auto" />
      {name}
    </a>
  );
}
