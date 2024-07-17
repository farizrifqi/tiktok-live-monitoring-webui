export default function Options({ options, setOptions }) {
  return (
    <div className="flex flex-col text-xs px-2">
      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={options.showComment}
          onChange={(e) => setOptions("comment")}
        />
        <label>Show Comment</label>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={options.showLike}
          onChange={(e) => setOptions("like")}
        />
        <label>Show Likes</label>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={options.showGift}
          onChange={(e) => setOptions("gift")}
        />
        <label>Show Gift</label>
      </div>
      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={options.showViewer}
          onChange={(e) => setOptions("viewer")}
        />
        <label>Show Joined Viewer</label>
      </div>
    </div>
  );
}
