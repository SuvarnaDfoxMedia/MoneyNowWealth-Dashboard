import type { Request, Response } from "express";
import * as articleService from "../services/articleService.ts";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

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

export const getArticles = async (req: Request, res: Response) => {
  try {
    const result = await articleService.getArticles(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch articles",
    });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await articleService.getArticleById(id);
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }
    return res.status(200).json({ success: true, data: article });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch article",
    });
  }
};

export const addArticle = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    parseJSONFields(body, ["sections", "faqs", "tools", "related_reads"]);

    if (req.file) {
      body.hero_image = (req as any).file.relativePath;
    } else if (!body.hero_image) {
      body.hero_image = "";
    }

    if (!["draft", "published", "archived"].includes(body.status)) {
      body.status = "draft";
    }

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

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    parseJSONFields(body, ["sections", "faqs", "tools", "related_reads"]);

    if (req.file) {
      body.hero_image = (req as any).file.relativePath;
    } else if (body.hero_image === "null" || !body.hero_image) {
      delete body.hero_image;
    }

    if (!["draft", "published", "archived"].includes(body.status)) {
      body.status = "draft";
    }

    delete body.read_time;

    const updated = await articleService.updateArticle(id, body);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
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

export const toggleArticleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Article ID is required" });
    }
    const article = await articleService.toggleArticleStatus(id);
    return res.status(200).json({
      success: true,
      message: `Article is now ${
        article.is_active ? "active" : "inactive"
      }`,
      data: article,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle article status",
    });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await articleService.getArticleById(id);
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
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
