import site from "./site.js";

export default {
  lang: (data) => {
    const slug = data.page?.fileSlug || "";
    return site.languages[slug] ? slug : site.languagesorder[0];
  },

  pagekey: (data) => {
    const stem = (data.page?.filePathStem || "").replace(/^\/+/, "");
    return stem.split("/")[0] || "";
  },

  blockkey: (data) => {
    const stem = (data.page?.filePathStem || "").replace(/^\/+/, "");
    return stem.split("/")[1] || "";
  },
};
