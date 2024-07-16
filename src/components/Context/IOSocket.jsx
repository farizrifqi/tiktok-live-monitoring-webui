"use client";
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
export const AppContext = createContext();
export default function SocketContextProvider({ children }) {
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

  const [words, setWords] = useState([]);
  const getWordIndex = (arr, word) => {
    let idx = -1;
    if (arr.length == 0) return idx;
    if (!word) return idx;
    for (let i = 0; i < arr.length; i++) {
      if (idx > -1) break;
      if (arr[i].word.toLowerCase() == word.toLowerCase()) idx = i;
    }
    return idx;
  };
  const resetState = () => {
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
  };
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) setIsloaded(true);
    if (isLoaded && connected && username) {
      if (socket) {
        socket.on("connect", () => {
          setConnected(true);
          console.log("connected to ay");
        });
        socket.on("data-roomInfo", (data) => {
          data = JSON.parse(data);
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
            let tempWords = [...words];
            const wordsMap = new Map(
              tempWords.map((word) => [word.word, word])
            );
            for (const word of data.comment.split(" ")) {
              if (wordsMap.has(word)) {
                tempWords = tempWords.map((w) =>
                  w.word === word ? { ...w, count: w.count + 1 } : w
                );
              } else {
                tempWords.push({ word, count: 1 });
              }
            }

            // data.comment.split(" ").forEach((word) => {
            //   const isExists = Object.keys(tempWords).filter(
            //     (keyWord) => word.toLowerCase() == keyWord.toLowerCase()
            //   );
            //   if (isExists.length == 0) {
            //     tempWords[word] = 0;
            //   } else {
            //     // tempWords[isExists[0]] = tempWords[isExists[0]] + 1;
            //   }
            // });
            setWords(tempWords);
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
            console.log({ data });
            setLogs((prev) => [{ type: "like", data }, ...prev]);
            setTotalLikes(data.totalLikeCount ?? 0);
          } catch (err) {}
        });
      }
    } else {
      console.log("Not connected");
    }
  }, [isLoaded, connected]);
  const initializeSocket = () => {
    if (!username) return;
    if (!socket) {
      const s = io("ws://localhost:2608", {
        transports: ["websocket"],
        forceNew: false,
      });
      setSocket(s);
      s.emit("listenToUsername", username);
    } else {
      resetState();
      socket.emit("listenToUsername", username);
    }
    setConnected(true);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
