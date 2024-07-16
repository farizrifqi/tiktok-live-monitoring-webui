"use client";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { AppContext } from "./Context/IOSocket";
import { Suspense, useContext, useEffect, useState } from "react";
import VideoPlayer from "./video-player";
import ChatBubble from "./bubble/chat-bubble";
import GiftBubble from "./bubble/gift-bubble";
import ViewerBubble from "./bubble/viewer-bubble";
import LikeBubble from "./bubble/like-buble";
const componentBubble = {
  chat: (props) => <ChatBubble {...props} />,
  gift: (props) => <GiftBubble {...props} />,
  viewer: (props) => <ViewerBubble {...props} />,
  like: (props) => <LikeBubble {...props} />,
};
export default function Dashboard() {
  const {
    socket,
    connected,
    initializeSocket,
    username,
    setUsername,
    chats,
    isLive,
    isLoading,
    setIsLoading,
    liveInfo,
    gifts,
    logs,
    totalViewers,
    currentViewers,
    message,
    setMessage,
    totalLikes,
    words,
  } = useContext(AppContext);

  const [tempUsername, setTempUsername] = useState("");
  const [tempMsg, setTempMsg] = useState("");

  const [showLike, setShowLike] = useState(true);
  const [showComment, setShowComment] = useState(true);
  const [showGift, setShowGift] = useState(true);
  const [showViewer, setShowViewer] = useState(false);
  const chatAnimation = {
    initial: { opacity: 0, y: -300 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };
  useEffect(() => {
    initializeSocket();
  }, [username]);
  useEffect(() => {
    if (message) {
      setTempMsg(message);
      setTimeout(() => {
        setTempMsg("");
      }, 3000);
    }
  }, [message]);
  return (
    <main className="min-w-screen h-screen max-h-screen min-h-screen">
      <div className="flex gap-5">
        <aside className="w-1/4 flex flex-col h-screen sticky top-0 overflow-y-hidden py-1 border-r">
          <div className="w-fit flex items-center justify-center p-4">
            <div className="flex flex-col text-sm">
              Username:
              <div className="flex gap-1">
                <input
                  onChange={(e) => setTempUsername(e.target.value)}
                  value={tempUsername}
                  type="text"
                  className="border px-3 py-1 outline-none rounded-md"
                ></input>
                <button
                  onClick={() => {
                    setIsLoading(true);
                    setUsername(tempUsername.replace("@", ""));
                    setMessage("");
                  }}
                  className="px-3 py-1 border rounded hover:bg-gray-200 transition-colors disabled:cursor-not-allowed disabled:bg-gray-200"
                  disabled={isLoading}
                >
                  Stream
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col text-xs px-2">
            <div className="flex">
              <input
                type="checkbox"
                checked={showComment}
                onChange={(e) => setShowComment(e.target.checked)}
              />
              <label>Show Comment</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                checked={showLike}
                onChange={(e) => setShowLike(e.target.checked)}
              />
              <label>Show Likes</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                checked={showGift}
                onChange={(e) => setShowGift(e.target.checked)}
              />
              <label>Show Gift</label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                checked={showViewer}
                onChange={(e) => setShowViewer(e.target.checked)}
              />
              <label>Show Joined Viewer</label>
            </div>
          </div>
          {message && (
            <div className="border px-3 py-1 border-red-500 rounded bg-white drop-shadow-md w-full">
              {message}
            </div>
          )}
          {isLive && (
            <div className="h-full">
              <div className="border-b p-2">
                <b>Logs</b>
              </div>
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
              <div className="overflow-y-scroll overflow-x-clip p-2 flex flex-col gap-2 text-xs h-full">
                {logs
                  .filter((log) => {
                    if (log.type == "chat") {
                      if (!showComment) return false;
                    } else if (log.type == "gift") {
                      if (!showGift) return false;
                    } else if (log.type == "like") {
                      if (!showLike) return false;
                    } else if (log.type == "viewer") {
                      if (!showViewer) return false;
                    }
                    return true;
                  })
                  .map((log, i) =>
                    i === 0 ? (
                      <motion.div
                        className="flex flex-col border rounded"
                        key={`chat-${i}-${Date.now()}`}
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 100, x: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.2,
                        }}
                        title={
                          log.data.createTime &&
                          moment(
                            moment.unix(Math.round(log.data.createTime / 1000))
                          ).format("dddd, d MMMM yyyy HH:mm:ss")
                        }
                      >
                        {componentBubble[log.type]({
                          data: log.data,
                          isStreak: log?.isStreak ?? null,
                          isRejoin: log?.isRejoin ?? null,
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex flex-col border rounded"
                        initial={{ y: -100 }}
                        whileInView={{ y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.2,
                        }}
                        key={`chat-${i}-${Date.now()}-${
                          log.data.createTime ?? Math.random()
                        }`}
                        title={
                          log.data.createTime &&
                          moment(
                            moment.unix(Math.round(log.data.createTime / 1000))
                          ).format("dddd, d MMMM yyyy HH:mm:ss")
                        }
                      >
                        {componentBubble[log.type]({
                          data: log.data,
                          isStreak: log?.isStreak ?? null,
                          isRejoin: log?.isRejoin ?? null,
                        })}
                      </motion.div>
                    )
                  )}
              </div>
            </div>
          )}
        </aside>
        {isLive && (
          <div className="w-full flex flex-col">
            {liveInfo?.stream_url?.hls_pull_url && (
              <div className="w-full aspect-video relative border rounded-md p-3">
                <Suspense>
                  <VideoPlayer src={liveInfo.stream_url.hls_pull_url} />
                </Suspense>
              </div>
            )}
            <div className="grid grid-cols-3">
              <div className="flex flex-col">
                <div>Most Written Word</div>
                <div className="h-[400px] overflow-y-scroll flex flex-col">
                  {words.map((word) => (
                    <div
                      key={`${word.word}-${word.count}`}
                      className="flex justify-between"
                    >
                      <div>{word.word}</div>
                      <div>{word.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {tempMsg && (
        <div className="border px-3 py-1 border-sky-500 rounded top-0 absolute bg-white drop-shadow-md w-full z-14">
          {tempMsg}
        </div>
      )}
    </main>
  );
}
