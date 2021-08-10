const yaml = require("js-yaml");
const { DateTime } = require("luxon");
// const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");
const svgContents = require("eleventy-plugin-svg-contents");

const pluginSEO = require("eleventy-plugin-seo");

module.exports = eleventyConfig => {

};


module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  //machine readable date
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // SEO
  eleventyConfig.addPlugin(pluginSEO, require("./src/_data/seo.json"));

  // eleventyConfig.addPlugin(pluginSEO, {
  //   title: "Foobar Site",
  //   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   url: "https://foo.com",
  //   author: "Jane Doe",
  //   twitter: "username",
  //   image: "foo.jpg"
  // });

  // Syntax Highlighting for Code blocks
  // eleventyConfig.addPlugin(syntaxHighlight);

  // plugin to grab the contents of an SVG file to allow for embedding in your template with all the power of SVG. https://github.com/brob/eleventy-plugin-svg-contents
  eleventyConfig.addPlugin(svgContents);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Add Tailwind Output CSS as Watch Target
  eleventyConfig.addWatchTarget("./_tmp/static/css/style.css");

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
		'./_tmp/static/css/style.css': './static/css/style.css',
		'./src/admin/config.yml': './admin/config.yml',
		'./node_modules/alpinejs/dist/alpine.js': './static/js/alpine.js',
		'./node_modules/prismjs/themes/prism-tomorrow.css':
			'./static/css/prism-tomorrow.css',
	});

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");
  eleventyConfig.addPassthroughCopy('./src/static/fonts');
  eleventyConfig.addPassthroughCopy('./src/static/assets');

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy({ "img/favicon_package_v0.16": "/" });


  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });


  // Note the use of `render()`

  // Markdownify filter
  // https://edjohnsonwilliams.co.uk/blog/2019-05-04-replicating-jekylls-markdownify-filter-in-nunjucks-with-eleventy
  // const md = require('markdown-it')({
  //   html: true,
  //   breaks: true,
  //   linkify: true
  // });

  // eleventyConfig.addNunjucksFilter("markdownify", markdownString => md.render(markdownString));


  // eleventyConfig.addFilter('markdown', function (value) {
  //   let markdown = require('markdown-it')({
  //     html: true
  //   });
  //   return markdown.render(value);
  // });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    pathPrefix: '/',

    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
    templateEngineOverride: "njk,md"
  };
};
