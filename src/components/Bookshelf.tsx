const Bookshelf = ({ className }: { className?: string }) => {
  const TILT_ANGLE = 15; // degrees
  // Start from index 1 to avoid first book being tilted
  const tiltedIndex = Math.floor(Math.random() * 29) + 1;

  const calculateTiltMargin = (width: number) => {
    // Using trigonometry to calculate the horizontal offset
    // sin(angle) * width gives us how far the corner moves horizontally
    return Math.abs(Math.sin((TILT_ANGLE * Math.PI) / 180) * width);
  };

  const books = Array.from({ length: 30 }, (_, index) => {
    const width = Math.floor(Math.random() * 8) + 15;
    return {
      id: index,
      width,
      height: Math.floor(Math.random() * 25) + 60,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`,
      isTilted: index === tiltedIndex,
      tiltMargin: width ? calculateTiltMargin(width) : 0,
    };
  });

  return (
    <div
      className={`flex flex-wrap gap-[2px] p-5 items-end w-fit min-w-min ${className}`}
    >
      {books.map((book) => (
        <div
          key={book.id}
          style={{
            width: `${book.width}px`,
            height: `${book.height}px`,
            backgroundColor: book.color,
            transform: book.isTilted ? `rotate(-${TILT_ANGLE}deg)` : undefined,
            marginRight: book.isTilted ? `${book.tiltMargin}px` : undefined,
            marginLeft: book.isTilted ? `${book.tiltMargin}px` : undefined,
          }}
          className="rounded cursor-pointer hover:scale-105 hover:-translate-y-1 transition-transform"
        ></div>
      ))}
    </div>
  );
};

export default Bookshelf;
