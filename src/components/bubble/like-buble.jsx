export default function LikeBubble({ data }) {
  return (
    <>
      <span className="font-bold border-b px-2 py-1">
        <a target="_blank" href={`https://tiktok.com/@${data.uniqueId}`}>
          💓 {data.nickname ?? data.uniqueId}
        </a>
      </span>
      <span className="break-words w-full px-2 py-1">
        Send <b>{data.likeCount} like</b>
      </span>
    </>
  );
}
