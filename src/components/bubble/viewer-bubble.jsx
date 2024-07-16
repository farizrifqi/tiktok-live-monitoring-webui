import moment from "moment";
import BubbleNameSection from "./name-section";

export default function ViewerBubble({ data, isRejoin }) {
  return (
    <>
      <span className="font-bold border-b px-2 py-1 break-words w-full ">
        <BubbleNameSection data={data} type={"viewer"} />
      </span>
    </>
  );
}
