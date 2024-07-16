"use client";
import { motion } from "framer-motion";
import moment from "moment";
import ChatBubble from "../bubble/chat-bubble";
import { useEffect, useRef } from "react";

export default function DisplayChats({ chats }) {
  // const bottomRef = useRef(null);
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [chats]);

  return (
    <div className="flex flex-col border rounded-md col-span-2">
      <div className="px-2 py-1 border-b font-bold shadow-sm">Chats</div>
      <div className="h-[200px] overflow-y-auto flex flex-col gap-1 p-2 overflow-x-clip">
        {chats.map((log, i) =>
          i === chats.length - 1 ? (
            <motion.div
              // ref={bottomRef}
              className={`flex flex-col border rounded bg-white shadow-md ${
                log.data.isModerator && "border-red-500"
              }`}
              key={`chat-${i}-${log.data.userId}-${log.data.comment}`}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 100, x: 0 }}
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
              <ChatBubble data={log.data} hideTime={true} />
            </motion.div>
          ) : (
            <motion.div
              className={`flex flex-col border rounded bg-white shadow-sm ${
                log.data.isModerator && "border-red-500"
              }`}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              key={`chat-${i}-${log.data.userId}-${log.data.comment}`}
              title={
                log.data.createTime &&
                moment(
                  moment.unix(Math.round(log.data.createTime / 1000))
                ).format("dddd, d MMMM yyyy HH:mm:ss")
              }
            >
              <ChatBubble data={log.data} hideTime={true} />
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
