import moment from "moment";

export default function Statistics({
  chats,
  gifts,
  totalViewers,
  currentViewers,
  totalLikes,
  liveInfo,
}) {
  return (
    <div className="flex flex-col">
      <div className="w-full justify-between flex text-xs px-3 py-1 border-b">
        <span>Chats:</span>
        <span>{chats.length}</span>
      </div>
      <div className="w-full justify-between flex text-xs px-3 py-1 border-b">
        <span>Gifts:</span>
        <span>{gifts.length}</span>
      </div>
      <div className="w-full justify-between flex text-xs px-3 py-1 border-b">
        <span>Total Viewers:</span>
        <span>{totalViewers.length}</span>
      </div>
      <div className="w-full justify-between flex text-xs px-3 py-1 border-b">
        <span>Current Viewers:</span>
        <span>{currentViewers}</span>
      </div>
      <div className="w-full justify-between flex text-xs px-3 py-1 border-b">
        <span>Total Likes:</span>
        <span>{totalLikes}</span>
      </div>
    </div>
  );
}
