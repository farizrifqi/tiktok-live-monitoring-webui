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
import Options from "./widget/options";
import Statistics from "./widget/statistics";
import SettingsDialog from "./Settings";
import AboutDialog from "./About";
import Disclaimer from "./Disclaimer";
import { trackClick } from "./Analytics";

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
    isLiveConnected,
    proxy,
    setProxy,
    proxyTimeout,
    setProxyTimeout,
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
      let url = localStorage.getItem("advttl-socketUrl");
      if (url) {
        setWsUrl(url);
      }
      let proxy = localStorage.getItem("advttl-proxy");
      if (proxy) {
        setProxy(proxy);
      }
      let proxyTimeout = localStorage.getItem("advttl-proxyTimeout");
      if (proxy) {
        setProxyTimeout(proxyTimeout);
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
      }, 6000);
    }
  }, [message]);

  const setOptions = (type) => {
    switch (type) {
      case "like":
        setShowLike(!showLike);
        break;
      case "comment":
        setShowComment(!showComment);
        break;
      case "gift":
        setShowGift(!showGift);
        break;
      case "viewer":
        setShowViewer(!showViewer);
        break;
    }
  };
  return (
    <main className="min-w-screen h-screen max-h-screen min-h-screen">
      <div className="gap-5 flex flex-col lg:flex-row">
        <aside className="lg:w-1/5 flex flex-col h-screen lg:sticky lg:top-0 overflow-y-hidden py-1 border-b lg:border-b-0 lg:border-r">
          <div className="w-full flex flex-col justify-center p-4">
            <div className="flex items-center justify-end self-end gap-2">
              <Disclaimer />
              <AboutDialog />

              <SettingsDialog
                setWsUrl={setWsUrl}
                wsUrl={wsUrl}
                columnLimit={columnLimit}
                setColumnsLimit={setColumnsLimit}
                proxy={proxy}
                setProxy={setProxy}
                proxyTimeout={proxyTimeout}
                setProxyTimeout={setProxyTimeout}
              />
            </div>

            <div className="flex flex-col text-sm gap-2">
              Username:
              <div className="flex gap-1">
                <input
                  onChange={(e) => setTempUsername(e.target.value)}
                  value={tempUsername}
                  type="text"
                  placeholder="@Tiktok"
                  className="w-full border px-3 py-1 outline-none rounded-md disabled:cursor-not-allowed disabled:bg-gray-200"
                  disabled={isLoading}
                ></input>
              </div>
              <button
                onClick={() => {
                  if (tempUsername == "") return;
                  trackClick(tempUsername);
                  setIsLoading(true);
                  setUsername(tempUsername.replace("@", ""));
                  setMessage("");
                  initializeSocket();
                }}
                className="px-3 py-1 border rounded hover:bg-gray-200 transition-colors disabled:cursor-not-allowed disabled:bg-gray-200"
                disabled={isLoading}
              >
                Connect
              </button>
            </div>
          </div>

          {false && message && (
            <div className="border px-3 py-1 border-red-500 rounded bg-white drop-shadow-md w-full">
              {message}
            </div>
          )}
          <Options
            setOptions={setOptions}
            options={{ showComment, showLike, showGift, showViewer }}
          />
          {isLive && (
            <div className="h-full">
              <div className="border-b p-2">
                <b>Logs</b>
              </div>
              <Statistics
                chats={chats}
                gifts={gifts}
                totalViewers={totalViewers}
                currentViewers={currentViewers}
                totalLikes={totalLikes}
                liveInfo={liveInfo}
              />

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
                        key={`log-${i}-${log.type}-${log.data.uniqueId}-${log.data.createTime}`}
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
                        key={`log-${i}-${log.type}-${log.data.uniqueId}-${log.data.createTime}`}
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
        {isLive && liveInfo && (
          <div className="w-full flex flex-col py-1">
            {(liveInfo?.title ||
              liveInfo?.hashtag?.title ||
              liveInfo?.game_tag?.length > 0) && (
              <div className=" border rounded-md p-2 w-full h-auto flex items-center justify-between text-lg font-extrabold">
                <div className="flex items-center gap-1">
                  <div
                    title={isLiveConnected ? "LIVE!!" : "Not Live."}
                    className={`${isLiveConnected ? "animate-pulse" : ""}`}
                  >
                    {isLiveConnected ? "🟢" : "🔴"}
                  </div>
                  {liveInfo?.title && <span> {liveInfo.title}</span>}{" "}
                </div>
                {(liveInfo?.hashtag?.title ||
                  liveInfo?.game_tag?.length > 0) && (
                  <div className="justify-between flex text-xs gap-2">
                    {liveInfo?.game_tag[0] && (
                      <span className="px-2 py-1 bg-gray-200 font-light tracking-wider rounded">
                        {liveInfo.game_tag[0].show_name}
                      </span>
                    )}
                    {liveInfo?.hashtag?.title && (
                      <span className="px-2 py-1 bg-gray-200 font-light tracking-wider rounded">
                        #{liveInfo.hashtag.title}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
            {liveInfo?.stream_url?.hls_pull_url && (
              <div className=" border rounded-md p-3 w-full h-auto flex items-center justify-center bg-black">
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
                mostGifts={mostGifts}
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
