import CmsPage, { type ICmsPage } from "../models/cmsPageModel.ts";

export const getPages = async (query: any) => {
  const { slug, page_code, status, includeInactive, page, limit, search } = query;

  const filter: Record<string, any> = {};

  if (slug) filter.slug = slug;
  if (page_code) filter.page_code = page_code;
  if (status) filter.status = status;
  if (includeInactive !== "true") filter.is_active = 1;
  if (search) filter.title = { $regex: search, $options: "i" };

  const pageNum = parseInt(page as string) || 1;
  const perPage = parseInt(limit as string) || 10;
  const skip = (pageNum - 1) * perPage;

  const [pages, total] = await Promise.all([
    CmsPage.find(filter).sort({ created_at: -1 }).skip(skip).limit(perPage),
    CmsPage.countDocuments(filter),
  ]);

  return { pages, total, currentPage: pageNum, totalPages: Math.ceil(total / perPage) };
};

export const getPageById = async (id: string) => {
  const page = await CmsPage.findById(id);
  if (!page || page.is_active === 0) throw new Error("Page not found");
  return page;
};

export const createPage = async (data: Partial<ICmsPage>) => {
  if (!data.title || !data.slug) throw new Error("title and slug are required");

  const slugExists = await CmsPage.findOne({ slug: data.slug });
  if (slugExists) throw new Error("Slug already exists");

  const page = new CmsPage({
    ...data,
    sections: data.sections || [],
    faqs: data.faqs || [],
    is_active: 1,
    is_deleted: false,
  });

  await page.save();
  return page;
};

export const updatePage = async (id: string, data: Partial<ICmsPage>) => {
  const page = await CmsPage.findById(id);
  if (!page || page.is_active === 0) throw new Error("Page not found");

  Object.assign(page, data);
  await page.save();
  return page;
};

export const togglePageStatus = async (id: string) => {
  const page = await CmsPage.findById(id);
  if (!page) throw new Error("Page not found");

  page.is_active = page.is_active === 1 ? 0 : 1;
  await page.save();
  return page;
};

export const deletePage = async (id: string) => {
  const page = await CmsPage.findById(id);
  if (!page) throw new Error("Page not found");

  page.is_deleted = true;
  page.is_active = 0;
  page.deleted_at = new Date();
  await page.save();
  return page;
};
