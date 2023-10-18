"use client";

import { useState } from "react";

import { Loader2, Lock } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

type Props = {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
};

function VideoPlayer({
  chapterId,
  title,
  courseId,
  completeOnEnd,
  isLocked,
  nextChapterId,
  playbackId,
}: Props) {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary gap-2 bg-slate-800">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          playbackId={playbackId}
          title={title}
          className={`${!isReady && "hidden"} h-full w-full`}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {}}
          autoPlay
        />
      )}
    </div>
  );
}

export default VideoPlayer;
