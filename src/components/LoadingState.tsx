export default function LoadingState() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[2/3] rounded-xl bg-gray-100 animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-100 rounded mt-2 animate-pulse" />
          <div className="h-3 w-1/3 bg-gray-100 rounded mt-1 animate-pulse" />
        </div>
      ))}
    </div>
  );
}