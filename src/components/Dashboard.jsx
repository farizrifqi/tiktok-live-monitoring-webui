"use client";
import { motion } from "framer-motion";
import moment from "moment";
import { AppContext } from "./Context/IOSocket";
import { Suspense, useContext, useEffect, useState } from "react";
import VideoPlayer from "./video-player";
import ChatBubble from "./bubble/chat-bubble";
import GiftBubble from "./bubble/gift-bubble";
import ViewerBubble from "./bubble/viewer-bubble";
import LikeBubble from "./bubble/like-buble";
import MostWords from "./widget/most-words";
import DisplayChats from "./widget/display-chats";
import DisplayGifts from "./widget/display-gifts";
import MostChat from "./widget/most-chat";
import MostGifter from "./widget/most-gifter";
import MostGifts from "./widget/most-gifts";
import DisplayLikes from "./widget/display-likes";
import MostLiker from "./widget/most-liker";
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
    userChats,
    userGifts,
    mostGifts,
    userLikes,
    setWsUrl,
    wsUrl,
  } = useContext(AppContext);

  const [tempUsername, setTempUsername] = useState("");
  const [tempMsg, setTempMsg] = useState("");

  const [showLike, setShowLike] = useState(true);
  const [showComment, setShowComment] = useState(true);
  const [showGift, setShowGift] = useState(true);
  const [showViewer, setShowViewer] = useState(false);
  const [columnLimit, setColumnsLimit] = useState(25);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      let url = localStorage.getItem("socketUrl");
      if (url) {
        setWsUrl(url);
      }
    }
  }, []);
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
      {/* <div className="block md:hidden">
        Currently only supports on Desktop View.
      </div> */}
      <div className="gap-5 flex flex-col lg:flex-row">
        <aside className="lg:w-1/5 flex flex-col h-screen lg:sticky lg:top-0 overflow-y-hidden py-1 border-b lg:border-b-0 lg:border-r">
          <div className="w-fit flex flex-col justify-center p-4">
            <div className="flex flex-col text-xs">
              WS URL:
              <div className="flex gap-1">
                <input
                  onChange={(e) => setWsUrl(e.target.value)}
                  value={wsUrl}
                  type="text"
                  className="border px-3 py-1 outline-none rounded-md"
                ></input>
              </div>
            </div>
            <div className="flex flex-col text-sm">
              Username:
              <div className="flex gap-1">
                <input
                  onChange={(e) => setTempUsername(e.target.value)}
                  value={tempUsername}
                  type="text"
                  placeholder="@Tiktok"
                  className="border px-3 py-1 outline-none rounded-md disabled:cursor-not-allowed disabled:bg-gray-200"
                  disabled={isLoading}
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
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={showComment}
                onChange={(e) => setShowComment(e.target.checked)}
              />
              <label>Show Comment</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={showLike}
                onChange={(e) => setShowLike(e.target.checked)}
              />
              <label>Show Likes</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={showGift}
                onChange={(e) => setShowGift(e.target.checked)}
              />
              <label>Show Gift</label>
            </div>
            <div className="flex gap-2">
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
              <div className="overflow-y-scroll overflow-x-clip p-2 flex flex-col gap-2 text-xs h-full shadow-md">
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
                  .filter((l, i) => i <= columnLimit)
                  .map((log, i) =>
                    i === 0 ? (
                      <motion.div
                        className={`flex flex-col border rounded ${
                          log.data.isModerator && "border-red-300"
                        }`}
                        key={`log-${log.type}-${log.data.uniqueId}-${log.data.createTime}`}
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 100, x: 0 }}
                        viewport={{ once: true }}
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
                        className={`flex flex-col border rounded ${
                          log.data.isModerator && "border-red-300"
                        }`}
                        key={`log-${log.type}-${log.data.uniqueId}-${log.data.createTime}`}
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
              <div className=" border rounded-md p-3 w-full h-auto flex items-center justify-center">
                <div className="w-[300px]">
                  <Suspense fallback={<div>Loading...</div>}>
                    <VideoPlayer src={liveInfo.stream_url.hls_pull_url} />
                  </Suspense>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 p-1 text-xs gap-3">
              <DisplayChats
                chats={logs
                  .filter((log) => log.type == "chat")
                  .filter((l, i) => i <= columnLimit)}
              />
              <MostWords words={words} />
              <MostChat chats={userChats} />
              <DisplayGifts
                gifts={logs
                  .filter((log) => log.type == "gift" && !log.isStreak)
                  .filter((l, i) => i <= columnLimit)}
              />
              <MostGifter user={userGifts} />
              <MostGifts gifts={mostGifts} />
              <DisplayLikes
                likes={logs
                  .filter((log) => log.type == "like")
                  .filter((l, i) => i <= columnLimit)}
              />
              <MostLiker user={userLikes} />
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
