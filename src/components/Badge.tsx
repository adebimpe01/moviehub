interface BadgeProps {
  children: React.ReactNode;
}

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
      {children}
    </span>
  );
}