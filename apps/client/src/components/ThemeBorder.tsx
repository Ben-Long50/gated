const ThemeBorder = ({
  borderColor,
  chamfer,
}: {
  borderColor: string;
  chamfer: string;
}) => {
  const chamferMapBorder = {
    small: 'clip-3 rounded-bl-[4px] rounded-tr-[4px]',
    medium: 'clip-5 rounded-bl-[6px] rounded-tr-[6px]',
    large: 'clip-7 rounded-bl-[8px] rounded-tr-[8px]',
  };

  const chamferMapBg = {
    small: 'clip-4 rounded-bl-[2px] rounded-tr-[2px]',
    medium: 'clip-6 rounded-bl-[4px] rounded-tr-[4px]',
    large: 'clip-8 rounded-bl-[6px] rounded-tr-[6px]',
  };

  return (
    <>
      <div
        className={`${chamferMapBorder[chamfer]} timing absolute right-[2px] top-[2px] z-0 h-full w-full`}
        style={{
          backgroundColor: `${borderColor}`,
        }}
      />
      <div
        className={`${chamferMapBg[chamfer]} group-hover:bg-secondary timing bg-primary absolute z-0 h-full w-full`}
      />
    </>
  );
};

export default ThemeBorder;
