export default ({
  className,
  width,
}: {
  className?: string;
  width?: number;
}) => {
  width = width ?? 9 * 3;
  const radius = width / 9;
  return (
    <svg
      version="1.1"
      width={width}
      height={10}
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-black ${className}`}
    >
      <circle cx={radius} cy={radius} r={radius} />
      <circle cx={4 * radius} cy={radius} r={radius} />
      <circle cx={7 * radius} cy={radius} r={radius} />
    </svg>
  );
};
