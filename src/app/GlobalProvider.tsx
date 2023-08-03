"use client";

import useAuth from "@components/_hooks/useAuth";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { GetUserResponse } from "src/lib/apis/_models/AuthDto";
import { ChannelsObj } from "./chat/components/types";
import useGetChannels from "./chat/components/hooks/channel/useGetChannels";

export const userAtom = atomWithReset<GetUserResponse>({
  id: -1,
  username: "",
  email: "",
  profileImage: "",
  temp: 36.5,
  isTestTarget: false,
});
export const isLoggedInAtom = atomWithReset<boolean>(false);

export const channelsAtom = atom<ChannelsObj>({});
export default function GlobalProvider(props: { children: React.ReactNode }) {
  const path = usePathname();
  useAuth();
  useGetChannels();

  const storePathValues = () => {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    const prevPath = storage.getItem("currentPath") || "";
    storage.setItem("prevPath", prevPath);
    storage.setItem("currentPath", globalThis.location.pathname);
  };

  useEffect(() => storePathValues, [path]);

  return <>{props.children}</>;
}