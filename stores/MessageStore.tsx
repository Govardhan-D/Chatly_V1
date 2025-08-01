// store/useMessageStore.ts
import { create } from "zustand";
import { Database } from "../supabase-types";

type Message = Database["public"]["Tables"]["messages"]["Row"];

type MessageStore = {
  messages: Message[] | null;
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  updateMessage: (msg: Message) => void;
  deleteMessage: (id: string) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateMessage: (msg) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.messageid === msg.messageid ? msg : m
      ),
    })),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.messageid !== id),
    })),
}));
