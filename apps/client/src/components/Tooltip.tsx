const Tooltip = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  return (
    <p
      className={`${className} bg-secondary timing pointer-events-none absolute bottom-10 right-1/2 translate-x-1/2 rounded px-1 py-0.5 text-sm opacity-0 shadow shadow-black group-hover/button:opacity-100`}
    >
      {label}
    </p>
  );
};

export default Tooltip;
