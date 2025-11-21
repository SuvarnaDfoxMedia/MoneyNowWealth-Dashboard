// import cron from "node-cron";
// import Topic from "../models/topicModel.ts";

// export function startTopicScheduler() {
//   cron.schedule(
//     "0 0 * * *",
//     async () => {
//       try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const result = await Topic.updateMany(
//           { status: "scheduled", publish_date: { $lte: today } },
//           { $set: { status: "published" } }
//         );

//         if (result.modifiedCount > 0) {
//           console.log(
//             `Auto-published ${result.modifiedCount} topic(s) for ${today.toDateString()}`
//           );
//         }
//       } catch (error) {
//         console.error("Error in topic scheduler:", error);
//       }
//     },
//     { timezone: "Asia/Kolkata" }
//   );

//   console.log("Topic scheduler started");
// }

// import cron from "node-cron";
// import Topic from "../models/topicModel.ts";

// export function startTopicScheduler() {
//   cron.schedule(
//     "0 * * * *", // runs every hour (तुझं daily 0:0 ही ठीक आहे पण hourly recommended for precise publish)
//     async () => {
//       try {
//         const now = new Date();

//         // Update topics that are published but not yet active and publish_date <= now
//         const result = await Topic.updateMany(
//           {
//             status: "published",
//             is_active: 0,
//             publish_date: { $lte: now },
//           },
//           { $set: { is_active: 1 } }
//         );

//         if (result.modifiedCount > 0) {
//           console.log(
//             `Auto-published ${result.modifiedCount} topic(s) as of ${now.toISOString()}`
//           );
//         }
//       } catch (error) {
//         console.error("Error in topic scheduler:", error);
//       }
//     },
//     { timezone: "Asia/Kolkata" }
//   );

//   console.log("Topic scheduler started");
// }


// import cron from "node-cron";
// import Topic from "../models/topicModel.ts";

// export function startTopicScheduler() {
//   cron.schedule(
//     "0 * * * *", // every hour
//     async () => {
//       try {
//         const now = new Date();

//         // Update topics that are published/scheduled but not yet active
//         const result = await Topic.updateMany(
//           {
//             status: { $in: ["published", "scheduled"] },
//             is_active: 0,
//             publish_date: { $lte: now },
//           },
//           { $set: { is_active: 1, status: "published" } } // make sure status is published
//         );

//         if (result.modifiedCount > 0) {
//           console.log(
//             `Auto-published ${result.modifiedCount} topic(s) as of ${now.toISOString()}`
//           );
//         }
//       } catch (error) {
//         console.error("Error in topic scheduler:", error);
//       }
//     },
//     { timezone: "Asia/Kolkata" }
//   );

//   console.log("Topic scheduler started");
// }



import cron from "node-cron";
import Topic from "../models/topicModel.ts";

export function startTopicScheduler() {
  // Run every day at midnight (00:00)
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // reset time to compare only date

        // Example task: just log topics that should be published today
        const topicsToPublish = await Topic.find({
          status: "published",
          publish_date: { $lte: today },
          is_deleted: false,
        });

        if (topicsToPublish.length > 0) {
          console.log(
            `${topicsToPublish.length} topic(s) are scheduled to be published today:`,
            topicsToPublish.map(t => t.topic_code)
          );
        } else {
          console.log("No topics scheduled for today");
        }

       
        // Activation must be handled manually via toggleActive
      } catch (error) {
        console.error("Error in topic scheduler:", error);
      }
    },
    { timezone: "Asia/Kolkata" }
  );

  console.log("Topic scheduler started");
}
