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
                  <div className="flex gap-1">
                    <input
                      onChange={(e) => setColumnsLimit(e.target.value)}
                      value={columnLimit}
                      type="number"
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
