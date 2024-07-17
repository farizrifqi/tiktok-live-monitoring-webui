export default function MostGifts({ gifts }) {
  return (
    <div className="flex flex-col border rounded-md">
      <div className="px-2 py-1 border-b font-bold shadow-sm">Most Gift</div>
      <div className="h-[200px] overflow-y-scroll flex flex-col">
        {Object.keys(
          Object.fromEntries(
            Object.entries(gifts).sort((a, b) => b[1].count - a[1].count)
          )
        ).map((giftName) => (
          <div
            key={`most-gifts-${giftName}-${gifts[giftName]}`}
            className="flex justify-between py-1 border-b px-2 text-xs"
          >
            <div className="flex items-center gap-1">
              <div
                className="w-4 h-4 bg-cover bg-center"
                style={{ backgroundImage: `url("${gifts[giftName].img}")` }}
              ></div>
              <div>{giftName}</div>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-gray-100 px-1 py-0.5 rounded">
                🎁 {gifts[giftName].count}
              </div>
              <div className="bg-gray-100 px-1 py-0.5 rounded">
                🧑‍🤝‍🧑 {gifts[giftName].user.length}
              </div>
              <div className="bg-gray-100 px-1 py-0.5 rounded">
                🪙 {gifts[giftName].coin * gifts[giftName].count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
