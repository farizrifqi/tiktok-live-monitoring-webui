"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
export const AppContext = createContext();
export default function SocketContextProvider({ children }) {
  const [wsUrl, setWsUrl] = useState("ws://localhost:2608");
  const [tried, setTried] = useState(1);
  const [isLoaded, setIsloaded] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");

  const [socket, setSocket] = useState(null);

  const [isLive, setIsLive] = useState(false);
  const [message, setMessage] = useState("");
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveInfo, setLiveInfo] = useState(null);
  const [logs, setLogs] = useState([]);
  const [chats, setChats] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [totalViewers, setTotalViewers] = useState([]);
  const [currentViewers, SetCurrentViewers] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);

  const [words, setWords] = useState({});
  const [userChats, setUserChats] = useState({});
  const [userGifts, setUserGifts] = useState({});
  const [mostGifts, setMostGifts] = useState({});
  const [userLikes, setUserLikes] = useState({});

  const [proxy, setProxy] = useState("");
  const [proxyTimeout, setProxyTimeout] = useState(10000);

  const resetState = () => {
    setTried(0);
    setIsLive(false);
    setMessage("");
    setIsLiveConnected(false);
    setLiveInfo(null);
    setLogs([]);
    setChats([]);
    setGifts([]);
    setTotalViewers([]);
    SetCurrentViewers(0);
    setWords({});
    setUserChats({});
    setUserGifts({});
    setMostGifts({});
    setUserLikes({});
  };
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) setIsloaded(true);
    if (socket && isLoaded) {
      socket.on("data-roomInfo", (data) => {
        data = JSON.parse(data);
        console.log({ liveInfo: data });
        setLiveInfo(data);
      });
      socket.on("data-connection", (data) => {
        data = JSON.parse(data);
        if (data.isCon) {
          setIsLiveConnected(data.isConnected);
          setIsLive(true);
        }

        setIsLoading(false);
      });
      socket.on("data-islive", (data) => {
        data = JSON.parse(data);
        setIsLiveConnected(false);
        setIsLive(false);
        setMessage(data.message);
      });
      socket.on("data-chat", (data) => {
        try {
          data = JSON.parse(data);
          setChats((prev) => [data, ...prev]);
          setLogs((prev) => [{ type: "chat", data }, ...prev]);
          data.comment.split(" ").forEach((word) => {
            if (words[word.toLowerCase()]) {
              words[word.toLowerCase()] = words[word.toLowerCase()] + 1;
            } else {
              words[word.toLowerCase()] = 1;
            }
          });

          if (userChats[data.uniqueId]) {
            userChats[data.uniqueId] = userChats[data.uniqueId] + 1;
          } else {
            userChats[data.uniqueId] = 1;
          }
        } catch (err) {
          console.log(err);
        }
      });
      socket.on("data-gift", (data) => {
        try {
          data = JSON.parse(data);
          setGifts((prev) => [data, ...prev]);
          if (data.giftType === 1 && !data.repeatEnd) {
            setLogs((prev) => [
              { type: "gift", isStreak: true, data },
              ...prev,
            ]);
          } else {
            if (userGifts[data.uniqueId]) {
              userGifts[data.uniqueId] = {
                gifts: userGifts[data.uniqueId].gifts + data.repeatCount,
                coins:
                  userGifts[data.uniqueId].coins +
                  data.repeatCount * (data.diamondCount ?? 1),
              };
            } else {
              userGifts[data.uniqueId] = {
                gifts: data.repeatCount,
                coins: data.repeatCount * (data.diamondCount ?? 1),
              };
            }
            if (mostGifts[data.giftName]) {
              mostGifts[data.giftName] = {
                count: mostGifts[data.giftName].count + data.repeatCount,
                user: [...mostGifts[data.giftName].user, data.uniqueId],
                img: mostGifts[data.giftName].img,
                coin: mostGifts[data.giftName].coin,
              };
            } else {
              mostGifts[data.giftName] = {
                count: data.repeatCount,
                user: [data.uniqueId],
                img: data.giftPictureUrl,
                coin: data.diamoundCount ?? 1,
              };
            }
            console.log({ data });
            setLogs((prev) => [
              { type: "gift", isStreak: false, data },
              ...prev,
            ]);
          }
        } catch (err) {}
      });
      socket.on("data-member", (data) => {
        try {
          data = JSON.parse(data);
          if (totalViewers.includes(data.uniqueId)) {
            setLogs((prev) => [
              { type: "viewer", isRejoin: true, data },
              ...prev,
            ]);
          } else {
            setTotalViewers((prev) => [...prev, data]);
            setLogs((prev) => [
              { type: "viewer", isRejoin: false, data },
              ...prev,
            ]);
          }
        } catch (err) {}
      });
      socket.on("data-viewer", (data) => {
        try {
          data = JSON.parse(data);
          SetCurrentViewers(data.viewerCount);
        } catch (err) {}
      });
      socket.on("data-like", (data) => {
        try {
          data = JSON.parse(data);
          setLogs((prev) => [{ type: "like", data }, ...prev]);
          if (userLikes[data.uniqueId]) {
            userLikes[data.uniqueId] += data.likeCount;
          } else {
            userLikes[data.uniqueId] = data.likeCount;
          }
          setTotalLikes(data.totalLikeCount ?? 0);
        } catch (err) {}
      });
      socket.on("connect_error", (error) => {
        let tries = tried;

        setTried(parseInt(tries) + 1);
        setMessage(
          "Unable to connect to server, trying in 5s... (" + tried + "/3)"
        );
        if (tried == 3) {
          setIsLoading(false);
          setTried(1);
          socket.disconnect();
          setSocket(null);
        }
      });
      socket.on("connect", () => {
        console.log("connected");
        setConnected(true);
        socket.emit(
          "listenToUsername",
          JSON.stringify({ username, proxy, proxyTimeout })
        );
      });
      socket.on("disconnect", () => {
        console.log("disconnected");
        setConnected(false);
      });
    }
  }, [isLoaded, connected, socket, tried]);
  const initializeSocket = () => {
    if (!username) {
      console.log("No username found. Please enter a username.");
      return;
    }
    if (!socket) {
      console.log("Socket not found. Connecting to socket");
      localStorage.setItem("advttl-socketUrl", wsUrl);
      if (proxy || proxy == "") {
        localStorage.setItem("advttl-proxy", proxy);
        localStorage.setItem("advttl-proxyTimeout", proxyTimeout);
      }
      const s = io(wsUrl, {
        transports: ["websocket"],
        forceNew: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
      });
      setSocket(s);
    } else {
      console.log("Socket found. Requesting data...");

      resetState();
      socket.emit(
        "listenToUsername",
        JSON.stringify({ username, proxy, proxyTimeout })
      );
    }
  };
  return (
    <AppContext.Provider
      value={{
        socket,
        connected,
        chats,
        username,
        isLive,
        setUsername,
        initializeSocket,
        isLoading,
        setIsLoading,
        liveInfo,
        gifts,
        logs,
        totalViewers,
        currentViewers,
        isLiveConnected,
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
        proxy,
        setProxy,
        proxyTimeout,
        setProxyTimeout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
