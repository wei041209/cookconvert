// AdSlot placeholder component for future monetization
export default function AdSlot({ position }: { position: string }) {
  return (
    <div className="my-8 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center text-sm text-gray-500">
      <p>Advertisement</p>
      <p className="text-xs mt-1">Position: {position}</p>
    </div>
  );
}


