const Tooltip = ({ label }: { label: string }) => {
  return (
    <p className="bg-secondary timing pointer-events-none absolute -top-8 right-1/2 translate-x-1/2 whitespace-nowrap rounded px-1 py-0.5 text-sm opacity-0 shadow shadow-black group-hover/button:opacity-100">
      {label}
    </p>
  );
};

export default Tooltip;
