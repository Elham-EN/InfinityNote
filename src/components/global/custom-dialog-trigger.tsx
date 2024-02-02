import React, { ReactElement } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import clsx from "clsx";

interface CustomDialogTriggerProps {
  header?: string;
  content?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export default function CustomDialogTrigger({
  header,
  content,
  children,
  description,
  className,
}: CustomDialogTriggerProps): ReactElement {
  return (
    <div>
      <Dialog>
        <DialogTrigger className={clsx("", className)}>{children}</DialogTrigger>
        <DialogContent className="h-screen block sm:h-[440px] overflow-scroll w-full">
          <DialogHeader>
            <DialogTitle>{header}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    </div>
  );
}
