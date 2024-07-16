export default function BubbleNameSection({ type, data }) {
  const icons = {
    chat: "💬",
    gift: "🎁",
    like: "💗",
    viewer: "➡️",
  };

  const gifterLevelColors = (level) => {
    if (level == 0) {
      return "bg-amber-500 bg-opacity-20";
    } else if (level <= 5) {
      return "bg-sky-300";
    } else if (level <= 10) {
      return "bg-red-300";
    } else if (level <= 20) {
      return "bg-purple-500";
    } else {
      return "bg-yellow-300";
    }
  };
  return (
    <a
      target="_blank"
      href={`https://tiktok.com/@${data.uniqueId}`}
      className="flex items-center gap-2"
    >
      <span>{icons[type]} </span>
      <span>{data.nickname ?? data.uniqueId}</span>
      {data.isModerator && <span>🛠️</span>}

      <span
        className={`${gifterLevelColors(
          data.gifterLevel ?? 0
        )} px-1 rounded-md`}
      >
        💎{data.gifterLevel ?? 0}
      </span>

      {type == "viewer" && <span>Joined the stream.</span>}
    </a>
  );
}
