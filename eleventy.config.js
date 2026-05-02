import fs from "node:fs";
import path from "node:path";
import { RenderPlugin } from "@11ty/eleventy"

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "webroot/*": "." });
  eleventyConfig.addPlugin(RenderPlugin);
  eleventyConfig.addFilter("ageText", ageText);
  eleventyConfig.addFilter("a11yText", a11yText);
  eleventyConfig.addFilter("withoutvalue", withoutvalue);
  eleventyConfig.addNunjucksGlobal("asset", asset);
  eleventyConfig.addNunjucksGlobal("contentFile", contentFile);
  eleventyConfig.addTransform("external-link-rel", function (content) {
    if (!this.page?.outputPath || !this.page.outputPath.endsWith(".html")) {
      return content;
    }
    return addMissingRelToLinks(content);
  });
};

export const config = {
  markdownTemplateEngine: 'njk',
  htmlTemplateEngine: 'njk',
}

const generatedAssetSources = {
  "/assets/style.css": "styles/style.css.njk",
};

function ageText(dateString, lang = "en") {
  const today = new Date();
  const birth = new Date(`${dateString}T00:00:00Z`);
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const hasHadBirthday =
    today.getUTCMonth() > birth.getUTCMonth() ||
    (today.getUTCMonth() === birth.getUTCMonth() &&
      today.getUTCDate() >= birth.getUTCDate());
  if (!hasHadBirthday) {
    age--;
  }

  if (lang === "ru") {
    const mod10 = age % 10;
    const mod100 = age % 100;
    if (mod10 === 1 && mod100 !== 11) return `${age} год`;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return `${age} года`;
    }
    return `${age} лет`;
  }
  return `${age} y.o.`;
}

function a11yText(value = "") {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&shy;/g, "")
    .replace(/&#173;/g, "")
    .replace(/&#xAD;/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function withoutvalue(arr, value) {
  return (arr || []).filter(item => item !== value);
}

function asset(url) {
  if (!url) return url;
  if (/^(https?:|mailto:|tel:|data:|#)/i.test(url)) return url;
  const [withoutHash, hash = ""] = String(url).split("#");
  const [pathname, query = ""] = withoutHash.split("?");
  const sourcePath =
    generatedAssetSources[pathname] ||
    pathname.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), sourcePath);
  try {
    const stat = fs.statSync(absolutePath);
    const ts = Math.floor(stat.mtimeMs / 1000);
    let result = pathname + (query ? `?${query}&v=${ts}` : `?v=${ts}`);
    if (hash) result += `#${hash}`;
    return result;
  } catch {
    return url;
  }
}

function contentFile(basePath) {
  const candidates = [
    `${basePath}.md`,
    `${basePath}.html`,
    `${basePath}.njk`,
  ];
  for (const rel of candidates) {
    const abs = path.join(process.cwd(), rel.replace(/^\/+/, ""));
    if (fs.existsSync(abs)) {
      return rel;
    }
  }
  throw new Error(`No content file found for base path: ${basePath}`);
}

function addMissingRelToLinks(content) {
  return content.replace(/<a\b([^>]*?)>/gi, (fullMatch, attrs) => {
    const hrefMatch = attrs.match(/\bhref\s*=\s*(["'])(.*?)\1/i);
    if (!hrefMatch) {
      return fullMatch;
    }
    const href = hrefMatch[2];
    if (
      href.startsWith("#") ||
      /^mailto:/i.test(href) ||
      /^tel:/i.test(href) ||
      /^javascript:/i.test(href) ||
      href.startsWith("/")
    ) {
      return fullMatch;
    }
    const isExternal =
      /^https?:\/\//i.test(href) ||
      /^\/\//.test(href);
    if (!isExternal) {
      return fullMatch;
    }
    // if rel already exists, leave it alone
    if (/\brel\s*=/i.test(attrs)) {
      return fullMatch;
    }
    return `<a${attrs} rel="noopener noreferrer">`;
  });
}
