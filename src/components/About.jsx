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
export default function AboutDialog({}) {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full">
        <button
          title="About"
          onClick={() => setIsOpen(true)}
          className="border p-0.5 w-fit rounded-md hover:bg-gray-100 mb-2"
        >
          ❓
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
                <DialogTitle className="font-bold">❓ About</DialogTitle>
                <Description>
                  This tool is an unofficial and unaffiliated with TikTok. The
                  information and data obtained through this tool are solely for
                  informational purposes only and should not be considered
                  medical, financial, or legal advice. It is essential to
                  consult with the appropriate professionals for any critical
                  decisions or actions.
                </Description>

                <div className="text-sm flex flex-col gap-1">
                  <ul className="list-disc list-inside">
                    <li>
                      <a
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300"
                        href="https://github.com/farizrifqi/adv-ttl-client"
                      >
                        Client Repository
                      </a>
                    </li>
                    <li>
                      <span className="italic">
                        Server Repository (Coming-Soon!!)
                      </span>
                    </li>
                  </ul>
                  <span className="py-2">
                    Made by{" "}
                    <a
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300"
                      href="https://farizrifqi.link"
                    >
                      Fariz Rifqi
                    </a>
                    . This tools was made with ❤️.
                  </span>
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
