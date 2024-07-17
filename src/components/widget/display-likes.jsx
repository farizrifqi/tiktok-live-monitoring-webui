"use client";
import { motion } from "framer-motion";
import moment from "moment";
import GiftBubble from "../bubble/gift-bubble";
import LikeBubble from "../bubble/like-buble";

export default function DisplayLikes({ likes }) {
  return (
    <div className="flex flex-col border rounded-md col-span-2">
      <div className="px-2 py-1 border-b font-bold shadow-sm">Likes</div>
      <div className="h-[200px] overflow-y-scroll flex flex-col gap-1 p-2 overflow-x-clip">
        {likes.map((log, i) =>
          i === 0 ? (
            <motion.div
              className={`flex flex-col border rounded ${
                log.data.isModerator && "border-red-300"
              }`}
              key={`like-${i}-${log.data.uniqueId}-${log.data.likeCount}-${log.data.createTime}`}
              initial={{ opacity: 0, x: -150 }}
              whileInView={{ opacity: 100, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3,
              }}
              title={
                log.data.createTime &&
                moment(
                  moment.unix(Math.round(log.data.createTime / 1000))
                ).format("dddd, d MMMM yyyy HH:mm:ss")
              }
            >
              <LikeBubble data={log.data} />
            </motion.div>
          ) : (
            <motion.div
              className={`flex flex-col border rounded ${
                log.data.isModerator && "border-red-300"
              }`}
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              key={`like-${i}-${log.data.uniqueId}-${log.data.likeCount}-${log.data.createTime}`}
              title={
                log.data.createTime &&
                moment(
                  moment.unix(Math.round(log.data.createTime / 1000))
                ).format("dddd, d MMMM yyyy HH:mm:ss")
              }
            >
              <LikeBubble data={log.data} />
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
