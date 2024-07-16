import BubbleNameSection from "./name-section";

export default function LikeBubble({ data }) {
  return (
    <>
      <span className="font-bold border-b px-2 py-1">
        <BubbleNameSection data={data} type={"like"} />
      </span>
      <span className="break-words w-full px-2 py-1">
        Send <b>{data.likeCount} like</b>
      </span>
    </>
  );
}
