module.exports = function (eleventyConfig) {
  // 复制静态资源到输出目录
  eleventyConfig.addPassthroughCopy("src/assets");

  // 注册 Nunjucks 自定义过滤器
  eleventyConfig.addNunjucksFilter("year", function () {
    return new Date().getFullYear().toString();
  });

  // 扫描拍立得图片文件夹，供 hero 随机展示（往文件夹放图后重新构建即自动生效）
  eleventyConfig.addGlobalData("polaroid", () => {
    const fs = require("fs");
    const path = require("path");
    const dir = path.join(__dirname, "src", "assets", "images", "polaroid");
    const exts = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"];
    let files = [];
    try {
      files = fs
        .readdirSync(dir)
        .filter((f) => exts.includes(path.extname(f).toLowerCase()))
        .sort();
    } catch (e) {
      files = [];
    }
    return files.map((f) => "/assets/images/polaroid/" + encodeURIComponent(f));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
