import moment from "moment";

export default function ChatBubble({ data }) {
  return (
    <>
      <span className="font-bold border-b px-2 py-1">
        <a target="_blank" href={`https://tiktok.com/@${data.uniqueId}`}>
          💬 {data.nickname ?? data.uniqueId}
        </a>
      </span>
      <span className="break-words w-full px-2 py-1">{data.comment}</span>
      <span className="px-2 py-1 border-t text-gray-400 text-[8pt]">
        {moment(moment.unix(Math.round(data.createTime / 1000))).fromNow()}
      </span>
    </>
  );
}
