export default function MostLiker({ user }) {
  return (
    <div className="flex flex-col border rounded-md">
      <div className="px-2 py-1 border-b font-bold shadow-sm">Most Like</div>
      <div className="h-[200px] overflow-y-auto flex flex-col">
        {Object.keys(
          Object.fromEntries(Object.entries(user).sort((a, b) => b[1] - a[1]))
        ).map((uniqId) => (
          <a
            target="_blank"
            key={`most-liker-${uniqId}-${user[uniqId]}`}
            href={`https://tiktok.com/@${uniqId}`}
            className="flex justify-between py-1 border-b px-2"
          >
            <div>{uniqId}</div>
            <div>{user[uniqId]}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
