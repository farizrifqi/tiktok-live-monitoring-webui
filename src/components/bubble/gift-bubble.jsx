import moment from "moment";
import BubbleNameSection from "./name-section";

export default function GiftBubble({ data, isStreak }) {
  return (
    <>
      <span
        className={`font-bold border-b px-2 py-1 ${
          isStreak ? "bg-green-200" : "bg-green-400"
        }`}
      >
        <BubbleNameSection data={data} type={"gift"} />
      </span>
      <span className="break-words w-full px-2 py-1 flex items-center gap-1">
        {isStreak ? "Sending gift " : "Has sent gift "}
        <div
          className="w-4 h-4 bg-cover bg-center"
          style={{ backgroundImage: `url("${data.giftPictureUrl}")` }}
        ></div>
        {data.giftName} x{data.repeatCount}
      </span>
      <span className="px-2 py-1 border-t text-gray-400 text-[8pt]">
        {moment(moment.unix(Math.round(data.createTime / 1000))).fromNow()}
      </span>
    </>
  );
}
