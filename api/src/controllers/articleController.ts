import type { Request, Response } from "express";
import * as articleService from "../services/articleService";

// Extend Express Request type to include `file`
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

// Helper to parse JSON fields
const parseJSONFields = (body: any, fields: string[]) => {
  for (const field of fields) {
    if (typeof body[field] === "string") {
      try {
        body[field] = JSON.parse(body[field]);
      } catch {
        body[field] = [];
      }
    }
  }
};

// Get all articles
export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const { status, search, topic_id } = req.query;

    const sort = { createdAt: -1 }; // latest first

    const result = await articleService.getArticles({
      status,
      search,
      topic_id,
      page,
      limit,
      sort,
    });

    return res.status(200).json({
      success: true,
      articles: result.articles || [],
      total: result.total || 0,
      currentPage: result.currentPage || page,
      totalPages: result.totalPages || 1,
      limit,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch articles",
    });
  }
};

// Get single article by ID
export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await articleService.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch article",
    });
  }
};

// Create a new article
// export const addArticle = async (req: Request, res: Response) => {
//   try {
//     const body = req.body;
//     parseJSONFields(body, ["sections", "faqs", "tools", "related_reads"]);

//     if (req.file) {
//       body.hero_image = req.file.path; // Adjust if you store relativePath
//     } else if (!body.hero_image) {
//       body.hero_image = "";
//     }

//     if (!["draft", "published", "archived"].includes(body.status)) {
//       body.status = "draft";
//     }

//     delete body.read_time;

//     const article = await articleService.createArticle(body);
//     return res.status(201).json({
//       success: true,
//       message: "Article created successfully",
//       data: article,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create article",
//     });
//   }
// };

// // Update an existing article
// export const updateArticle = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const body = req.body;
//     parseJSONFields(body, ["sections", "faqs", "tools", "related_reads"]);

//     if (req.file) {
//       body.hero_image = req.file.path;
//     } else if (body.hero_image === "null" || !body.hero_image) {
//       delete body.hero_image;
//     }

//     if (!["draft", "published", "archived"].includes(body.status)) {
//       body.status = "draft";
//     }

//     delete body.read_time;

//     const updated = await articleService.updateArticle(id, body);

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Article not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Article updated successfully",
//       data: updated,
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update article",
//     });
//   }
// };



// Create a new article
export const addArticle = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Parse JSON fields from frontend
    parseJSONFields(body, ["sections", "faqs", "tools", "related_reads"]);

    // Store only the filename of uploaded image
    if (req.file) {
      body.hero_image = req.file.filename; // <-- FIXED: store only filename
    } else if (!body.hero_image) {
      body.hero_image = "";
    }

    // Ensure status is valid
    if (!["draft", "published", "archived"].includes(body.status)) {
      body.status = "draft";
    }

    // Remove read_time if not needed
    delete body.read_time;

    const article = await articleService.createArticle(body);

    return res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create article",
    });
  }
};

// Update an existing article
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Parse JSON fields
    parseJSONFields(body, ["sections", "faqs", "tools", "related_reads"]);

    // Update hero image if new file uploaded
    if (req.file) {
      body.hero_image = req.file.filename; // <-- FIXED: store only filename
    } else if (body.hero_image === "null" || !body.hero_image) {
      delete body.hero_image; // keep existing if not updated
    }

    // Validate status
    if (!["draft", "published", "archived"].includes(body.status)) {
      body.status = "draft";
    }

    delete body.read_time;

    const updated = await articleService.updateArticle(id, body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update article",
    });
  }
};


// Toggle article status (active/inactive)
export const toggleArticleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Article ID is required",
      });
    }

    const article = await articleService.toggleArticleStatus(id);

    return res.status(200).json({
      success: true,
      message: `Article is now ${article.is_active ? "active" : "inactive"}`,
      data: article,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle article status",
    });
  }
};

// Soft delete an article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await articleService.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    article.is_deleted = true;
    article.deleted_at = new Date();
    await article.save();

    return res.status(200).json({
      success: true,
      message: "Article deleted successfully (soft delete)",
      data: article,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete article",
    });
  }
};

