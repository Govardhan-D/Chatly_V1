import { column, Schema, Table } from "@powersync/react-native";
// OR: import { column, Schema, Table } from '@powersync/react-native';

const users = new Table(
  {
    // id column (text) is automatically included
    userid: column.text,
    phonenumber: column.text,
    username: column.text,
    profilepicture: column.text,
    status: column.text,
    lastseen: column.text,
    email: column.text,
  },
  { indexes: {} }
);

const contacts = new Table(
  {
    // id column (text) is automatically included
    contactid: column.text,
    userid: column.text,
    contactuserid: column.text,
    nickname: column.text,
    blocked: column.integer,
  },
  { indexes: {} }
);

const messages = new Table(
  {
    // id column (text) is automatically included
    messageid: column.text,
    senderid: column.text,
    receiverid: column.text,
    content: column.text,
    mediaurl: column.text,
    timestamp: column.text,
    status: column.text,
    reply_to: column.text,
  },
  { indexes: {} }
);

export const AppSchema = new Schema({
  users,
  contacts,
  messages,
});

export type PowerSyncDatabase = (typeof AppSchema)["types"];
