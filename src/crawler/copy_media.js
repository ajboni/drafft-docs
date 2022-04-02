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

import { join } from "path";
import fse from "fs-extra";
import { logOK, logTitle, logStatus } from "../utils/log.js";
import { config } from "../../config.js";
import columnify from "columnify";
const { lstatSync, ensureDirSync, copySync } = fse;

/**
 * Copies media content into build folder
 */
export function copyMedia() {
  logTitle("Copy media resources.");
  const { BUILD_FOLDER, CONTENT_FOLDER } = config;
  const srcPath = join(CONTENT_FOLDER, "img");
  const dstPath = join(BUILD_FOLDER, "img");
  let filesCopied = [];
  const filterFunction = (src, dst) => {
    if (lstatSync(src).isFile()) {
      const file = {
        source: src,
        destination: dst,
      };
      filesCopied.push(file);
    }
    return true;
  };

  //   console.log(columnify(new Array(filesCopied)));
  ensureDirSync(dstPath);
  copySync(srcPath, dstPath, { recursive: true, filter: filterFunction });
  logStatus(columnify(filesCopied) + "\n");

  logOK(`${filesCopied.length} files copied`);
}
