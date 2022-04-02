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

import { config } from "../../config.js";
import minimatch from "minimatch";
import fse from "fs-extra";
import matter from "gray-matter";
import path from "path";

const { readFileSync } = fse;
const { match } = minimatch;

import markdownIt from "markdown-it";
import markdownItImsize from "markdown-it-imsize";
import markdownItTaskLists from "markdown-it-task-lists";
import markdownitEmoji from "markdown-it-emoji";
import markdownItAnchor from "markdown-it-anchor";
import markdownItExternalLinks from "markdown-it-external-links";

var md = markdownIt({
  html: true,
  linkify: true,
  //   typography: true,
})
  .use(markdownItImsize, { autofill: true })
  .use(markdownItAnchor, {
    permalink: true,
    permalinkBefore: true,
  })
  .use(markdownItExternalLinks, {
    externalClassName: null,
    externalRel: "noopener noreferrer",
    externalTarget: "_blank",
  })
  .use(markdownItTaskLists, {
    label: true,
  });

/**
 * Scans for extra files (eg: readme.md and returns them as an object.)
 * Useful to carry data to the documents.
 * Extra files are defined in config
 * @returns an object with all special files and its contents
 */
export function parseExtraFiles() {
  let obj = {};
  let specialFiles = config.EXTRA_FILES_AS_VARIABLES;
  const files = match(specialFiles, "*", { nocase: true });
  files.forEach((file) => {
    let contents = readFileSync(file, { encoding: "utf-8" });

    obj[file.toString().replace(".", "_")] = contents;
  });
  return obj;
}
