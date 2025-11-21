// // routes/topicRoutes.ts
// import express from "express";
// import {
//   getTopics,
//   getTopicById,
//   addTopic,
//   updateTopic,
//   deleteTopic,
//   toggleTopicStatus,
// } from "../controllers/topicController.ts";
// import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";

// const router = express.Router();


// // Get all topics
// router.get("/topic", getTopics);

// // Get single topic by ID
// router.get("/topic/:id", getTopicById);

// // -------------------- ADMIN / EDITOR ROUTES --------------------
// const adminEditorMiddleware = roleFromUrl(["admin", "editor"]);

// // Add new topic
// router.post("/:role/topic/create", adminEditorMiddleware, addTopic);

// router.put("/:role/topic/edit/:id", adminEditorMiddleware, updateTopic);

// router.patch("/:role/topic/change/:id/status", adminEditorMiddleware, toggleTopicStatus);

// router.delete("/:role/topic/delete/:id", adminEditorMiddleware, deleteTopic);

// export default router;



import express from "express";
import {
  getTopics,
  getTopicById,
  addTopic,
  updateTopic,
  deleteTopic,
  toggleTopicStatus,
  getPublishedClustersTopicsArticles,
  getPublishedTopicWithArticlesByIdAgg,
} from "../controllers/topicController.ts";
import { roleFromUrl } from "../middleware/roleUrlMiddleware.ts";

const router = express.Router();

// Public routes
router.get("/topic", getTopics); // list all topics
router.get("/topic/published", getPublishedClustersTopicsArticles); // clusters -> topics -> articles
router.get("/topic/published/:id", getPublishedTopicWithArticlesByIdAgg);

router.get("/topic/:id", getTopicById);

// Admin/editor middleware
const adminEditorMiddleware = roleFromUrl(["admin", "editor"]);

// Admin routes
router.post("/:role/topic/create", adminEditorMiddleware, addTopic);
router.put("/:role/topic/edit/:id", adminEditorMiddleware, updateTopic);
router.patch("/:role/topic/change/:id/status", adminEditorMiddleware, toggleTopicStatus);
router.delete("/:role/topic/delete/:id", adminEditorMiddleware, deleteTopic);

export default router;
