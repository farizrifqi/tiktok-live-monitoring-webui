import moment from "moment";

export default function GiftBubble({ data, isStreak }) {
  return (
    <>
      <span
        className={`font-bold border-b px-2 py-1 ${
          isStreak ? "bg-green-200" : "bg-green-400"
        }`}
      >
        <a target="_blank" href={`https://tiktok.com/@${data.uniqueId}`}>
          🎁 {data.nickname ?? data.uniqueId}
        </a>
      </span>
      <span className="break-words w-full px-2 py-1">
        {isStreak ? "Sending gift " : "Has sent gift "}
        {data.giftName} x{data.repeatCount}
      </span>
      <span className="px-2 py-1 border-t text-gray-400 text-[8pt]">
        {moment(moment.unix(Math.round(data.createTime / 1000))).fromNow()}
      </span>
    </>
  );
}
