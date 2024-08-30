"use client";

import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
export default function SettingsDialog({
  wsUrl,
  setWsUrl,
  columnLimit,
  setColumnsLimit,
  proxy,
  setProxy,
  proxyTimeout,
  setProxyTimeout,
  isNotifySound,
  setIsNotifySound,
}) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full flex items-center justify-end">
        <button
          title="Open Setting"
          onClick={() => setIsOpen(true)}
          className="border p-0.5 w-fit rounded-md hover:bg-gray-100 mb-2"
        >
          ⚙️
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <Dialog
            static
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30"
            />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
              <DialogPanel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.95, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: -100 }}
                exit={{ opacity: 0, y: 100 }}
                className="lg:w-1/2 space-y-4 bg-white p-8 rounded-md"
              >
                <DialogTitle className="font-bold">⚙️ Settings</DialogTitle>
                <Description>Common Settings</Description>
                <div className="flex flex-col w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={() => setIsNotifySound(!isNotifySound)}
                      className={`border rounded-md px-2 py-1 hover:bg-gray-100 `}
                    >
                      <span
                        className={`${isNotifySound ? "animate-pulse" : ""}`}
                      >
                        {isNotifySound ? "🔊" : "🔇"}
                      </span>
                    </button>
                    {isNotifySound
                      ? "Sound Notification turned on"
                      : "Sound Notification turned off"}
                  </div>
                  Websocket URL:
                  <div className="flex gap-1">
                    <input
                      onChange={(e) => setWsUrl(e.target.value)}
                      value={wsUrl}
                      type="text"
                      className="border px-3 py-1 outline-none rounded-md w-full"
                    ></input>
                  </div>
                </div>
                <div className="flex flex-col">
                  Row Limits:
                  <div className="flex flex-col gap-1">
                    <input
                      onChange={(e) =>
                        setColumnsLimit(
                          e.target.value > 200
                            ? 200
                            : e.target.value < 1
                            ? 1
                            : e.target.value
                        )
                      }
                      value={columnLimit}
                      type="number"
                      min="1"
                      max="200"
                      className={`border px-3 py-1 outline-none rounded-md ${
                        columnLimit >= 50 && "border-red-400"
                      }`}
                    ></input>
                    {columnLimit >= 50 && (
                      <span className="text-xs text-red-400">
                        <b>WARNING!!</b> More than 50 will cause lag.
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  Proxy:
                  <div className="flex gap-1">
                    <input
                      onChange={(e) => setProxy(e.target.value)}
                      value={proxy}
                      type="text"
                      className="border px-3 py-1 outline-none rounded-md"
                    ></input>
                  </div>
                  <ul className="text-xs flex flex-col gap-1 ml-1 my-1">
                    {[
                      "https://username:password@host:port",
                      "http://username:password@host:port",
                      "https://host:port",
                    ].map((example) => (
                      <li
                        key={example}
                        className="bg-gray-200 w-fit px-1 py-0.5 rounded"
                      >
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col">
                  Proxy Timeout (Milliseconds):
                  <div className="flex gap-1">
                    <input
                      onChange={(e) => {
                        if (parseInt(e.target.value) < 10000) {
                          setProxyTimeout(10000);
                        } else {
                          setProxyTimeout(e.target.value);
                        }
                      }}
                      value={proxyTimeout}
                      type="number"
                      placeholder="10000"
                      className="border px-3 py-1 outline-none rounded-md"
                    ></input>
                  </div>
                </div>
                <div className="flex gap-4 items-center justify-end">
                  <button
                    className="border rounded-md px-3 py-1 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
