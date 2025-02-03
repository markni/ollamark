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
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px) rotate(0deg); }
            100% { opacity: 1; transform: translateY(0) rotate(0deg); }
          }
          @keyframes fadeInTilt {
            0% { opacity: 0; transform: translateY(10px) rotate(0deg); }
            100% { opacity: 1; transform: translateY(0) rotate(-${TILT_ANGLE}deg); }
          }
          .book {
            transition: transform 0.2s ease-out;
          }
          .book:hover {
            transform: translateY(-4px) scale(1.05) rotate(0deg) !important;
          }
          .book.tilted:hover {
            transform: translateY(-4px) scale(1.05) rotate(-${TILT_ANGLE}deg) !important;
          }
        `}
      </style>
      {books.map((book) => (
        <div
          key={book.id}
          style={{
            width: `${book.width}px`,
            height: `${book.height}px`,
            backgroundColor: book.color,
            marginRight: book.isTilted ? `${book.tiltMargin}px` : undefined,
            marginLeft: book.isTilted ? `${book.tiltMargin}px` : undefined,
            animation: book.isTilted
              ? `fadeInTilt 0.3s ease-out forwards`
              : `fadeIn 0.3s ease-out forwards`,
            animationDelay: `${book.id * 10}ms`,
            opacity: 0,
          }}
          className={`rounded cursor-pointer book ${
            book.isTilted ? "tilted" : ""
          }`}
        ></div>
      ))}
    </div>
  );
};

export default Bookshelf;
