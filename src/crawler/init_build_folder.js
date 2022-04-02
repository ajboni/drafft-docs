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
import { join } from "path";
import Glob from "glob";
import { basename } from "path";
import { logOK, logJob, logTitle } from "../utils/log.js";

const { ensureDirSync, removeSync, copyFileSync, copySync, outputFileSync } =
  fse;
const { glob } = Glob;

export function initBuildFolder() {
  logTitle("Init Build Folder");
  removeSync(config.BUILD_FOLDER);
  removeSync(".temp");
  ensureDirSync(config.BUILD_FOLDER);

  /* Create necesary folders */
  ensureDirSync(join(config.BUILD_FOLDER, "css"));
  ensureDirSync(join(config.BUILD_FOLDER, "js"));
  ensureDirSync(join(config.BUILD_FOLDER, "favicons"));
  ensureDirSync(join(config.BUILD_FOLDER, "css", "flags-css"));
  ensureDirSync(join(config.BUILD_FOLDER, "css", "flags"));

  ensureDirSync(".cache");

  /* Copy flags css */
  copySync(
    join("node_modules", "flag-icon-css", "css", "flag-icon.min.css"),
    join(config.BUILD_FOLDER, "css", "flags-css", "flag-icon.min.css")
  );
  copySync(
    join("node_modules", "flag-icon-css", "flags"),
    join(config.BUILD_FOLDER, "css", "flags")
  );

  /* Copy fuse.js for Searches */
  copySync(
    join("node_modules", "fuse.js", "dist", "fuse.min.js"),
    join(config.BUILD_FOLDER, "js", "fuse", "fuse.min.js")
  );

  /* Copy templates js */
  copyTemplatesJavascript();
}

export function copyTemplatesJavascript() {
  const srcFolder = join("src", "client");
  const jsDstFolder = join(config.BUILD_FOLDER, "js");
  const jsGlob = `${srcFolder}/**/*.js`;
  const files = glob.sync(jsGlob);
  files.forEach((file) => {
    copySync(file, join(jsDstFolder, basename(file)));
  });
  logOK(`${files.length} client javascript copied.`);
}
