export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)";
  };
  public: {
    Tables: {
      contacts: {
        Row: {
          blocked: boolean | null;
          contactid: string;
          contactuserid: string;
          nickname: string | null;
          userid: string;
        };
        Insert: {
          blocked?: boolean | null;
          contactid?: string;
          contactuserid: string;
          nickname?: string | null;
          userid: string;
        };
        Update: {
          blocked?: boolean | null;
          contactid?: string;
          contactuserid?: string;
          nickname?: string | null;
          userid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contacts_contactuserid_fkey";
            columns: ["contactuserid"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["userid"];
          },
          {
            foreignKeyName: "contacts_userid_fkey";
            columns: ["userid"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["userid"];
          }
        ];
      };
      groupmembers: {
        Row: {
          groupid: string;
          groupmemberid: string;
          joindate: string | null;
          role: string | null;
          userid: string;
        };
        Insert: {
          groupid: string;
          groupmemberid?: string;
          joindate?: string | null;
          role?: string | null;
          userid: string;
        };
        Update: {
          groupid?: string;
          groupmemberid?: string;
          joindate?: string | null;
          role?: string | null;
          userid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "groupmembers_groupid_fkey";
            columns: ["groupid"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["groupid"];
          },
          {
            foreignKeyName: "groupmembers_userid_fkey";
            columns: ["userid"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["userid"];
          }
        ];
      };
      groups: {
        Row: {
          adminid: string;
          creationdate: string | null;
          groupid: string;
          groupname: string | null;
          grouppicture: string | null;
        };
        Insert: {
          adminid: string;
          creationdate?: string | null;
          groupid?: string;
          groupname?: string | null;
          grouppicture?: string | null;
        };
        Update: {
          adminid?: string;
          creationdate?: string | null;
          groupid?: string;
          groupname?: string | null;
          grouppicture?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "groups_adminid_fkey";
            columns: ["adminid"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["userid"];
          }
        ];
      };
      messages: {
        Row: {
          content: string | null;
          mediaurl: string | null;
          messageid: string;
          receiverid: string;
          senderid: string;
          status: string | null;
          timestamp: string | null;
        };
        Insert: {
          content?: string | null;
          mediaurl?: string | null;
          messageid?: string;
          receiverid: string;
          senderid: string;
          status?: string | null;
          timestamp?: string | null;
        };
        Update: {
          content?: string | null;
          mediaurl?: string | null;
          messageid?: string;
          receiverid?: string;
          senderid?: string;
          status?: string | null;
          timestamp?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_receiverid_fkey";
            columns: ["receiverid"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["userid"];
          },
          {
            foreignKeyName: "messages_senderid_fkey";
            columns: ["senderid"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["userid"];
          }
        ];
      };
      users: {
        Row: {
          email: string;
          lastseen: string | null;
          phonenumber: string | null;
          profilepicture: string | null;
          status: string | null;
          userid: string;
          username: string | null;
        };
        Insert: {
          email: string;
          lastseen?: string | null;
          phonenumber?: string | null;
          profilepicture?: string | null;
          status?: string | null;
          userid?: string;
          username?: string | null;
        };
        Update: {
          email?: string;
          lastseen?: string | null;
          phonenumber?: string | null;
          profilepicture?: string | null;
          status?: string | null;
          userid?: string;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_last_message_with_users: {
        Args: { user1_id: string; user2_id: string };
        Returns: {
          messageid: string;
          content: string;
          senderid: string;
          receiverid: string;
          timestamp: string;
          status: string;
          mediaurl: string;
          sender_username: string;
          sender_profile_picture: string;
          receiver_username: string;
          receiver_profile_picture: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
