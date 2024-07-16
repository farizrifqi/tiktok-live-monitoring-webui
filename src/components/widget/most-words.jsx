export default function MostWords({ words }) {
  return (
    <div className="flex flex-col border rounded-md">
      <div className="px-2 py-1 border-b font-bold shadow-sm">Most Word</div>
      <div className="h-[200px] overflow-y-scroll flex flex-col">
        {Object.keys(
          Object.fromEntries(Object.entries(words).sort((a, b) => b[1] - a[1]))
        ).map((word) => (
          <div
            key={`${word}-${words[word]}`}
            className="flex justify-between py-1 border-b px-2"
          >
            <div>{word}</div>
            <div>{words[word]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
