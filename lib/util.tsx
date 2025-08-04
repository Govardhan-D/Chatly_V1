import { supabase } from "./supabase";
import { Database } from "../supabase-types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];
type LastMessage =
  Database["public"]["Functions"]["get_last_message_with_users"]["Returns"][0];

export async function getContacts(): Promise<Contact[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const { data: contacts, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("userid", user.id);
    if (error) {
      throw error;
    }

    return contacts || [];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
}

export async function getUserById(userId: string): Promise<User> {
  try {
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("userid", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!userData) {
      throw new Error("User not found");
    }

    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function sendMessage(
  receiverId: string,
  content: string
): Promise<Message> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        content: content,
        senderid: user.id,
        receiverid: receiverId,
        timestamp: new Date().toISOString(),
        status: "sent",
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function getLastMessage(
  userId1: string,
  userId2: string
): Promise<{ data: LastMessage | null; error: Error | null }> {
  const { data, error } = await supabase.rpc("get_last_message_with_users", {
    user1_id: userId1,
    user2_id: userId2,
  });

  return { data: data?.[0] || null, error };
}
