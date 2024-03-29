"use client";
// import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React, { ReactElement, ReactNode } from "react";
import { EmojiClickData, Theme } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface EmojiPickerProps {
  children: ReactNode;
  getValue?: (emoji: string) => void;
}

function EmojiPicker({ children, getValue }: EmojiPickerProps): ReactElement {
  //const route = useRouter();
  const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
  // Callback function that is called when an emoji is clicked.
  // The callback receives the event and the emoji data
  const onClick = (selectedEmoji: EmojiClickData) => {
    if (getValue) getValue(selectedEmoji.emoji);
  };
  return (
    <div className="flex items-center">
      <Popover>
        {/* If it's a string, wrap it into span element */}
        {typeof children === "string" ? <span>{children}</span> : children}
        <PopoverContent className="p-0 border-none">
          <Picker onEmojiClick={onClick} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default EmojiPicker;
