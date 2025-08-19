import { PowerSyncDatabase } from "@powersync/react-native";
import { AppSchema } from "./powersync-schema";
import { Connector } from "./connector";

export const powersync = new PowerSyncDatabase({
  // The schema you defined in the previous step
  schema: AppSchema,
  // For other options see,
  // https://powersync-ja.github.io/powersync-js/web-sdk/globals#powersyncopenfactoryoptions
  database: {
    // Filename for the SQLite database — it's important to only instantiate one instance per file.
    // For other database options see,
    // https://powersync-ja.github.io/powersync-js/web-sdk/globals#sqlopenoptions
    dbFilename: "powersync.db",
  },
});

export const setupPowerSync = async () => {
  console.log("connecting with powersync");
  // Uses the backend connector that will be created in the next section
  const connector = new Connector();
  try {
    await powersync.connect(connector);
    console.log("Powersync connected...", powersync.currentStatus);
  } catch (error) {
    console.log(error);
    return error;
  }
};
