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

import fse from "fs";
import Glob from "glob";
import { renderSync } from "node-sass";
import { join } from "path";
import { config } from "../../config.js";
import { logError, logOK, logTitle } from "../utils/log.js";
import { getFilenameFromPath } from "../utils/string_utils.js";

const { writeFileSync } = fse;
const { sync } = Glob;
export function makeStyles() {
  logTitle("Generating Styles");

  //   const srcPath = path.join("src", "client", "style.scss");
  //   const dstPath = path.join(config.BUILD_FOLDER, "css", "style.css");

  // options is optional
  const files = sync("src/client/**/*.scss");
  try {
    files.forEach((srcPath) => {
      if (getFilenameFromPath(srcPath, false).startsWith("_")) return;
      const dstPath = join(
        config.BUILD_FOLDER,
        "css",
        `${getFilenameFromPath(srcPath, false)}.css`
      );
      const result = renderSync({
        file: srcPath,
        outputStyle: "compressed",
      });
      writeFileSync(dstPath, result.css);
      logOK(`Convert sass styles into css: ${srcPath} => ${dstPath}`);
    });
  } catch (error) {
    logError(error);
  }
}
