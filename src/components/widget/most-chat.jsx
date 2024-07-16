export default function MostChat({ chats }) {
  return (
    <div className="flex flex-col border rounded-md">
      <div className="px-2 py-1 border-b font-bold shadow-sm">Most Chat</div>
      <div className="h-[200px] overflow-y-scroll flex flex-col">
        {Object.keys(
          Object.fromEntries(Object.entries(chats).sort((a, b) => b[1] - a[1]))
        ).map((chat) => (
          <a
            target="_blank"
            key={`${chat}-${chats[chat]}`}
            href={`https://tiktok.com/@${chat}`}
            className="flex justify-between py-1 border-b px-2"
          >
            <div>{chat}</div>
            <div>{chats[chat]}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
