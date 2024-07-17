"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
export default function Disclaimer({}) {
  const countClickMap = ["Understand", "UNDERSTAND!!"];
  let [isOpen, setIsOpen] = useState(true);
  let [countClick, setCountClick] = useState(0);
  return (
    <>
      <div className="w-full"></div>
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
                <DialogTitle className="font-bold">‼️ Disclaimer</DialogTitle>
                <Description>
                  This tool is an unofficial and unaffiliated with TikTok. The
                  information and data obtained through this tool are solely for
                  informational purposes only and should not be considered
                  medical, financial, or legal advice. It is essential to
                  consult with the appropriate professionals for any critical
                  decisions or actions.
                </Description>

                <div className="flex gap-4 items-center justify-end">
                  <button
                    className="border rounded-md px-3 py-1 hover:bg-gray-100"
                    onClick={() => {
                      if (countClick >= 1) setIsOpen(false);
                      setCountClick((prev) => prev + 1);
                    }}
                  >
                    {countClickMap[countClick]}
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
