import type { Request, Response } from "express";
import * as cmsPageService from "../services/cmsPageService.ts";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const getPages = async (req: Request, res: Response) => {
  try {
    const result = await cmsPageService.getPages(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    console.error("Error in getPages:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch CMS pages",
    });
  }
};

export const getPageById = async (req: Request, res: Response) => {
  try {
    const page = await cmsPageService.getPageById(req.params.id);
    return res.status(200).json({ success: true, page });
  } catch (error: any) {
    console.error("Error in getPageById:", error);
    return res.status(404).json({
      success: false,
      message: error.message || "CMS page not found",
    });
  }
};

export const addPage = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const pageData = {
      ...req.body,
      title: req.body.title?.trim(),
      slug: req.body.slug?.trim().toLowerCase(),
    };

    const page = await cmsPageService.createPage(pageData);

    return res.status(201).json({
      success: true,
      message: "CMS page created successfully",
      page,
    });
  } catch (error: any) {
    console.error("Error in addPage:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create CMS page",
    });
  }
};

export const updatePage = async (req: MulterRequest, res: Response) => {
  try {
    const updatedData: any = { ...req.body };

    if (updatedData.title) updatedData.title = updatedData.title.trim();
    if (updatedData.slug) updatedData.slug = updatedData.slug.trim().toLowerCase();

    const page = await cmsPageService.updatePage(req.params.id, updatedData);

    return res.status(200).json({
      success: true,
      message: "CMS page updated successfully",
      page,
    });
  } catch (error: any) {
    console.error("Error in updatePage:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update CMS page",
    });
  }
};

export const togglePageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = await cmsPageService.togglePageStatus(id);

    return res.status(200).json({
      success: true,
      message: `CMS page is now ${page.is_active ? "active" : "inactive"}`,
      page,
    });
  } catch (error: any) {
    console.error("Error in togglePageStatus:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle CMS page status",
    });
  }
};

export const deletePage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = await cmsPageService.deletePage(id);

    return res.status(200).json({
      success: true,
      message: "CMS page deleted successfully (soft delete)",
      page,
    });
  } catch (error: any) {
    console.error("Error in deletePage:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete CMS page",
    });
  }
};
