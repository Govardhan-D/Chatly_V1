import {
  PowerSyncBackendConnector,
  AbstractPowerSyncDatabase,
  UpdateType,
} from "@powersync/react-native";
import { supabase } from "../supabase";

export class Connector implements PowerSyncBackendConnector {
  /**
   * Implement fetchCredentials to obtain a JWT from your authentication service.
   * See https://docs.powersync.com/installation/authentication-setup
   * If you're using Supabase or Firebase, you can re-use the JWT from those clients, see:
   * https://docs.powersync.com/installation/authentication-setup/supabase-auth
   * https://docs.powersync.com/installation/authentication-setup/firebase-auth
   */
  async fetchCredentials() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw new Error("No active session");
    }
    return {
      // The PowerSync instance URL or self-hosted endpoint
      endpoint: process.env.EXPO_PUBLIC_POWERSYNC_URL,
      /**
       * To get started quickly, use a development token, see:
       * Authentication Setup https://docs.powersync.com/installation/authentication-setup/development-tokens) to get up and running quickly
       */
      token: data.session.access_token,
    };
  }

  /**
   * Implement uploadData to send local changes to your backend service.
   * You can omit this method if you only want to sync data from the database to the client
   * See example implementation here:https://docs.powersync.com/client-sdk-references/react-native-and-expo#3-integrate-with-your-backend
   */
  async uploadData(database: AbstractPowerSyncDatabase) {
    /**
     * For batched crud transactions, use data.getCrudBatch(n);
     * https://powersync-ja.github.io/powersync-js/react-native-sdk/classes/SqliteBucketStorage#getcrudbatch
     */
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    for (const op of transaction.crud) {
      // The data that needs to be changed in the remote db
      const record = { ...op.opData, id: op.id };
      try {
        switch (op.op) {
          case UpdateType.PUT:
            await supabase.from(op.table).upsert(record);
            break;
          case UpdateType.PATCH:
            await supabase.from(op.table).update(record).eq("id", record.id);
            break;
          case UpdateType.DELETE:
            await supabase.from(op.table).delete().eq("id", record.id);
            break;
        }
      } catch (error) {
        console.error(`Error processing ${op.op} on ${op.table}:`, error);
        throw error; // Let PowerSync retry later
      }
    }

    // Completes the transaction and moves onto the next one
    await transaction.complete();
  }
}
