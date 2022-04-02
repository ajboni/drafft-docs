/**
 * Copyright (C) 2020 Alexis Boni
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import fse from "fs-extra";
import { config } from "../../config.js";
import { join, normalize, relative, extname, dirname as _dirname } from "path";
import mustache from "mustache";
import { logTitle, logOK, logError, logBg } from "../utils/log.js";

import { JSDOM } from "jsdom";

import { processDocument } from "./process_document.js";
import Glob from "glob";
import {
  changeFileExtension,
  removeSortingPrefix,
  isValidJSON,
} from "../utils/string_utils.js";
import { parseExtraFiles } from "./parse_extra_files.js";
import { basename, dirname } from "path";
import voca from "voca";
// import { version } from "../../package.json" assert { type: "json" };
import { resolve } from "url";

const { titleCase, replaceAll } = voca;
const {
  readJSONSync,
  statSync,
  ensureDirSync,
  ensureFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
  outputFileSync,
} = fse;

const { glob } = Glob;
const { render } = mustache;

async function makeDocPages() {
  logTitle("Generate Doc Pages");
  const extraFiles = parseExtraFiles();
  const langs = config.LANGUAGES;

  langs.forEach((lang, index) => {
    /* Load NavBar JSON*/
    const navbarJsonPath = join(config.CONTENT_FOLDER, lang.id, "navbar.json");

    const navBarButtons = readJSONSync(navbarJsonPath, {
      encoding: "utf-8",
      throws: false,
    });

    /* Generate Sidebar and search database*/
    let sidebar = [];
    let searchDatabase = [];
    let docList = [];

    const sidebarTemplatePath = join(
      config.CONTENT_FOLDER,
      lang.id,
      "sidebar.json"
    );
    if (existsSync(sidebarTemplatePath)) {
      const sidebarJSON = readFileSync(sidebarTemplatePath, {
        encoding: "utf-8",
      });
      if (isValidJSON(sidebarJSON)) {
        sidebar = JSON.parse(sidebarJSON);
      }
    }

    ensureDirSync(join(config.BUILD_FOLDER, lang.id, "docs"));
    const docsFolder = join(config.CONTENT_FOLDER, lang.id, "docs");

    /*   Allow only markdown and folders */
    const docsGlob = `${docsFolder}/**/*{/,.md}`;
    const ignoreGlob = [
      "**/_*", // Exclude files starting with '_'.
      "**/_*/**", // Exclude entire directories starting with '_'.
    ];

    const files = glob.sync(docsGlob, { ignore: ignoreGlob, nosort: true });
    files.sort();

    files.forEach((file, fileIndex) => {
      const type = statSync(file).isFile()
        ? "File"
        : statSync(file).isDirectory
        ? "Folder"
        : "Unknown";

      /* Create Target Path */
      let targetPath = normalize(file).replace(
        normalize(config.CONTENT_FOLDER),
        normalize(config.BUILD_FOLDER)
      );
      targetPath = statSync(file).isFile()
        ? changeFileExtension(targetPath, "html")
        : targetPath;
      targetPath = removeSortingPrefix(targetPath);

      /* We will only continue with markdown files */
      if (type !== "File") {
        /* Add  Folder to sidebar */
        addFolderToSidebar(targetPath, sidebar, lang);
        return;
      }

      /* PROCESS DOCUMENT */

      ensureFileSync(targetPath);

      /* Load html template */
      let template = readFileSync(join(".temp", "docs.html"), {
        encoding: "utf-8",
      });

      /* Process Document */
      const document = processDocument(file, lang, extraFiles, targetPath);

      /* Replace variables in template */

      const variables = { ...config, ...document.data, VERSION: 1 };
      template = render(template, variables);

      let dom = new JSDOM(template);
      const el = dom.window.document.getElementById("docs-content-container");

      el.insertAdjacentHTML("afterbegin", document.html);

      /* Load and process Navbar template */
      let navBarTemplate = loadAndProcessTemplate(
        join("src", "client", "navbar.html"),
        { ...variables, buttons: navBarButtons }
      );
      const navbarElement =
        dom.window.document.getElementById("navbar-container");
      navbarElement.innerHTML = navBarTemplate;

      /* Load and process Footer template */
      let footerTemplate = loadAndProcessTemplate(
        join("src", "client", "footer.html"),
        { ...variables }
      );

      const footerElement =
        dom.window.document.getElementById("footer-container");
      footerElement.innerHTML = footerTemplate;

      /* Load and process TOC template */
      let tocTemplate = loadAndProcessTemplate(
        join("src", "client", "table_of_contents.html"),
        { ...variables }
      );

      const tocElement = dom.window.document.getElementById("toc-container");
      tocElement.outerHTML = tocTemplate;

      /* Set up metadata */
      dom.window.document.title = document.data.title;
      dom.window.document
        .querySelector('meta[name="description"]')
        .setAttribute("content", document.data.description);

      const meta = generateMetaTags(
        document.data.title,
        document.data.description,
        document.data.img,
        document.url
      );

      dom.window.document.head.insertAdjacentHTML("beforeend", meta);

      const processedHTML = dom.serialize();

      /* Add Doc to sidebar */
      addDocumentToSidebar(document, sidebar);

      if (config.ENABLE_SEARCH) {
        /* Add Doc to Search Database */
        addDocumentToSearchDatabase(document, searchDatabase);
      }

      /* Save inventory */
      if (!document.external) {
        if (
          document.buildPath ===
          join(config.BUILD_FOLDER, lang.id, "docs", "index.html")
        ) {
          docList.unshift(document);
        } else {
          docList.push(document);
        }
      }

      /* Finally write the file */
      writeFileSync(targetPath, processedHTML, { encoding: "utf-8" });
    });

    /* Write sidebar to target folder */
    outputFileSync(
      join(".temp", lang.id, "sidebar.json"),
      JSON.stringify(sidebar),
      { encoding: "utf-8" }
    );

    /*  Write hashmap to target folder */
    outputFileSync(
      join(".temp", lang.id, "doc_list.json"),
      JSON.stringify(docList),
      { encoding: "utf-8" }
    );

    /* Write search database to temp folder */
    if (config.ENABLE_SEARCH) {
      outputFileSync(
        join(".temp", lang.id, "searchDB.json"),
        JSON.stringify(searchDatabase),
        { encoding: "utf-8" }
      );
    }

    //   fs.writeFileSync("./build/en/docs/index.html", template);
    logOK(`Generated ${files.length} doc pages for ${lang.caption}`);
  });
}
const _makeDocPages = makeDocPages;
export { _makeDocPages as makeDocPages };

function addFolderToSidebar(targetPath, sidebar, lang) {
  if (!config.AUTO_GENERATE_SIDEBAR) return;

  let url = config.REMOVE_EXTENSION_FROM_LINKS
    ? changeFileExtension(relative(config.BUILD_FOLDER, targetPath), "")
    : relative(config.BUILD_FOLDER, targetPath);

  const name = basename(url, extname(url));
  const caption = replaceAll(titleCase(name), /[-_]/, " ");

  /* Make pseudo absolute */
  url = "/" + url;
  let parent = _dirname(url);

  const obj = {
    name,
    caption,
    url: url,
    type: "Folder",
    parent,
    children: [],
    isFolder: true,
    checked: "", // This is needed because mustache will use parent context if the key is not found.
    isSelected: false, // Same as above.
  };

  const parentObj = findParentDeep(sidebar, parent);

  if (parentObj) {
    parentObj.children.push(obj);
  } else {
    if (
      /* Index will be ommited in sidebar and accessed by the icon */
      targetPath !== join(config.BUILD_FOLDER, lang.id, "docs", "index.html")
    ) {
      sidebar.push(obj);
    }
  }
}

function addDocumentToSidebar(document, sidebar) {
  if (!config.AUTO_GENERATE_SIDEBAR) return;

  /* Make pseudo absolute */
  let parent = _dirname(document.url);

  const obj = {
    name: document.name,
    caption: document.caption,
    url: document.url,
    type: "File",
    parent,
    children: [],
    isFolder: false,
    checked: "", // This is needed because mustache will use parent context if the key is not found.
    isSelected: false, // Same as above.
    target: document.target, // ^
  };

  const parentObj = findParentDeep(sidebar, parent);

  if (parentObj) {
    parentObj.children.push(obj);
  } else {
    if (
      /* Index will be ommited in sidebar and accessed by the icon */
      document.buildPath !==
      join(config.BUILD_FOLDER, document.lang.id, "docs", "index.html")
    ) {
      sidebar.push(obj);
    }
  }
}

function findParentDeep(data, key) {
  for (let index = 0; index < data.length; index++) {
    const element = data[index];

    if (element.url === key) {
      return element;
    } else {
      const match = findParentDeep(element.children, key);
      if (match) {
        return match;
      }
    }
  }
}

function addDocumentToSearchDatabase(document, db) {
  /* Pick wanted properties: https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties */
  const obj = (({ url, title, plainTextContent }) => ({
    url,
    title,
    plainTextContent,
  }))(document);
  db.push(obj);
}

function loadAndProcessTemplate(srcPath, variables) {
  let template = readFileSync(srcPath, {
    encoding: "utf-8",
  });
  template = render(template, variables);

  return template;
}

function generateMetaTags(title, description, img, docUrl) {
  let html = "";
  const imgPath = img ? resolve(config.PROJECT_URL, img) : "";

  html += `
<!-- Google / Search Engine Tags -->
<meta itemprop="name" content="${title}">
<meta itemprop="description" content="${description}">
`;

  if (img) {
    html += `<meta itemprop="image" content="${imgPath}">`;
  }

  if (config.PROJECT_URL) {
    const targetUrl = resolve(config.PROJECT_URL, docUrl);
    html += `
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${targetUrl}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
`;
    if (img) {
      html += `
	  <meta property="og:image" content="${imgPath}">
	  `;
    }

    html += `
<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${targetUrl}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
`;
    if (img) {
      html += `<meta property="twitter:image" content="${imgPath}">`;
    }
  }
  return html;
}
