import moment from "moment";
import BubbleNameSection from "./name-section";

export default function ChatBubble({ data, hideTime }) {
  if (hideTime == null) hideTime = false;
  return (
    <>
      <span className={`font-bold border-b px-2 py-1`}>
        <BubbleNameSection type="chat" data={data} />
      </span>
      <span className="break-words w-full px-2 py-1">{data.comment}</span>
      {!hideTime && (
        <span className="px-2 py-1 border-t text-gray-400 text-[8pt]">
          {moment(moment.unix(Math.round(data.createTime / 1000))).fromNow()}
        </span>
      )}
    </>
  );
}
