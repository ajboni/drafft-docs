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

import { basename, extname, join, dirname } from "path";
import { readdirSync } from "fs";
import voca from "voca";
const { replaceAll, titleCase } = voca;
export function removeFileExtension(str) {
  return str.replace(/\.[^/.]+$/, "");
}

export function getFilenameFromPath(filepath, includeExtension = true) {
  if (!includeExtension) return basename(filepath, extname(filepath));
  else return basename(filepath);
}

export function changeFileExtension(filepath, newExtension) {
  if (newExtension !== "") {
    newExtension = `.${newExtension}`;
  }
  return join(
    dirname(filepath),
    basename(filepath, extname(filepath)) + newExtension
  );
}

export function getFolders(source) {
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

/**
 * Strip __ prefix and anything before that (used for sorting purposes) and return the clean name
 *
 * @param {string} str
 * @returns The string without the __prefix
 */
export function removeSortingPrefix(str) {
  return replaceAll(str, /[^_\\\/]*__/, "");
}

/**
 * Generates a "nice" caption from a filePath.
 * Useful to show in sidebar or in the document html.
 *
 * @param {*} filePath
 * @returns
 */
export function captionFromPath(filePath) {
  return replaceAll(
    titleCase(removeSortingPrefix(getFilenameFromPath(filePath, false))),
    /[-_]/,
    " "
  );
}

/**
 *  Check if a string is a valid JSON string in JavaScript without
 * @param {string } str
 * @returns True/False if string is valid json
 */
export function isValidJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
