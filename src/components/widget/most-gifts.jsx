export default function MostGifts({ gifts }) {
  return (
    <div className="flex flex-col border rounded-md">
      <div className="px-2 py-1 border-b font-bold shadow-sm">Most Gift</div>
      <div className="h-[200px] overflow-y-scroll flex flex-col">
        {Object.keys(
          Object.fromEntries(Object.entries(gifts).sort((a, b) => b[1] - a[1]))
        ).map((giftName) => (
          <div
            key={`most-gifts-${giftName}-${gifts[giftName]}`}
            className="flex justify-between py-1 border-b px-2"
          >
            <div>{giftName}</div>
            <div>{gifts[giftName]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
