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

import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  createWriteStream,
} from "fs";
import { config } from "../../config.js";
import { join } from "path";
import moustache from "mustache";
import { logTitle, logOK, logError, logBg } from "../utils/log.js";
import { getRandomInt } from "../utils/math_utils.js";
import trianglify from "trianglify";
import fse from "fs-extra";
import { JSDOM } from "jsdom";

import { processDocument } from "./process_document.js";
import { parseExtraFiles } from "./parse_extra_files.js";
import jimp from "jimp";
const { read } = jimp;
const { render } = moustache;
const { ensureDirSync, pathExistsSync } = fse;

async function makeLandingPages() {
  logTitle("Generate Landing Pages");
  const extraFiles = parseExtraFiles();
  makeLandingPageBackground();

  /* Process Markdown and write output */
  const langs = config.LANGUAGES;

  langs.forEach((lang, index) => {
    ensureDirSync(join(config.BUILD_FOLDER, lang.id));
    let indexPath = join(config.CONTENT_FOLDER, lang.id, "index.md");

    /* Fallback for non existing languages */
    if (config.FALLBACK_TO_DEFAULT_LANGUAGE) {
      if (!pathExistsSync(indexPath)) {
        indexPath = join(config.CONTENT_FOLDER, langs[0].id, "index.md");
      }
    }

    let dstPath = join(config.BUILD_FOLDER, lang.id, "index.html");

    const document = processDocument(indexPath, lang, extraFiles, dstPath);

    /* Concatenate with generated template */
    let template = readFileSync(join(".temp", "landing_page.html"), {
      encoding: "utf-8",
    });

    /* Replace variables in template */
    template = render(template, config);

    let dom = new JSDOM(template);
    const el = dom.window.document.getElementById("cover-content");
    el.innerHTML = document.html;

    /* Set up metadata */
    dom.window.document.title = document.data.title;

    dom.window.document
      .querySelector('meta[name="description"]')
      .setAttribute("content", document.data.description);

    const processedHTML = dom.serialize();

    /* Finally write the file */
    writeFileSync(dstPath, processedHTML, { encoding: "utf-8" });

    /* Default language get special treatment */
    if (index === 0) {
      /* TODO: Process links and make it relative to the lang folder. */

      writeFileSync(join(config.BUILD_FOLDER, "index.html"), processedHTML, {
        encoding: "utf-8",
      });
    }
  });
}

const _makeLandingPages = makeLandingPages;
export { _makeLandingPages as makeLandingPages };

/**
 * Generates a background from scratch using trianglify or gets the bg defined in settings.
 * In either case a bg.png file is created in build/img
 */
function makeLandingPageBackground() {
  let dstPath = join(config.BUILD_FOLDER, "img", "bg.jpg");
  if (config.LANDING_PAGE_BG !== "auto") {
    try {
      copyFileSync(config.LANDING_PAGE_BG, dstPath);
      logOK(`Background copied: ${config.LANDING_PAGE_BG} => ${dstPath}`);
    } catch (error) {
      logError(error);
    }
  } else {
    const canvas = trianglify({
      width: 1200,
      height: 768,
      cellSize: getRandomInt(100, 250),
    }).toCanvas();

    try {
      const file = createWriteStream(".temp/bg.png");
      canvas.createPNGStream().pipe(file);
      file.on("close", () => {
        //   Compress background
        read(".temp/bg.png", function (err, image) {
          if (err) {
            console.log(err);
          } else {
            // image.resize(1200, 768);
            image.quality(80);
            image.write(dstPath);
          }
        });
      });
      logOK(`Generated background and copied into: ${dstPath}`);
    } catch (error) {
      logError(error);
    }
  }
}
