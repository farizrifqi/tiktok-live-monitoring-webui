import moment from "moment";

export default function ViewerBubble({ data, isRejoin }) {
  return (
    <>
      <span className="font-bold border-b px-2 py-1 break-words w-full ">
        <a target="_blank" href={`https://tiktok.com/@${data.uniqueId}`}>
          {data.nickname}{" "}
          {isRejoin ? "rejoined the stream. " : "Joined live stream. "}
        </a>
      </span>
    </>
  );
}
