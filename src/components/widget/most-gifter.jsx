export default function MostGifter({ user }) {
  return (
    <div className="flex flex-col border rounded-md">
      <div className="px-2 py-1 border-b font-bold shadow-sm">Most Gifter</div>
      <div className="h-[200px] overflow-y-scroll flex flex-col">
        {Object.keys(
          Object.fromEntries(
            Object.entries(user).sort((a, b) => b[1].coins - a[1].coins)
          )
        ).map((uniqId) => (
          <a
            target="_blank"
            key={`most-gifter-${uniqId}-${user[uniqId]}`}
            href={`https://tiktok.com/@${uniqId}`}
            className="flex justify-between py-0.5 border-b px-2 text-xs items-center"
          >
            <div>{uniqId}</div>
            <div className="flex items-center gap-1">
              <div className="bg-gray-100 px-1 py-0.5 rounded">
                🎁 {user[uniqId].gifts}
              </div>
              <div className="bg-gray-100 px-1 py-0.5 rounded">
                🪙 {user[uniqId].coins}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
