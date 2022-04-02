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
import { join } from "path";
import { config } from "../../config.js";
import { timeElpasedInSeconds } from "../utils/date_utils.js";
import { logTitle } from "../utils/log.js";
import { cleanUp } from "./clean_up.js";
import { copyMedia } from "./copy_media.js";
import { initBuildFolder } from "./init_build_folder.js";
import { makeDocPages } from "./make_docs_pages.js";
import { makeLandingPages } from "./make_landing_pages.js";
import { makeSearch } from "./make_search.js";
import { makeSidebars } from "./make_sidebar.js";
import { makeStyles } from "./make_styles.js";
import { makeTemplates } from "./make_templates.js";
const { BUILD_FOLDER } = config;

const { writeFileSync } = fse;
async function crawl() {
  const startTime = new Date();

  /* Clean Up */
  initBuildFolder();

  /* Copy Media Files */
  copyMedia();

  /* Generate Styles */
  makeStyles();

  /* Generate basic templates */
  await makeTemplates();

  /* Process Landing Pages */
  makeLandingPages();

  /* Process Documents */
  await makeDocPages();

  /* Process Sidebar */
  makeSidebars();

  /* Generate Search Indexes */
  makeSearch();

  /* Clean UP */
  await cleanUp();

  /* Build Completed */
  const elapsed = timeElpasedInSeconds(startTime, new Date());
  logTitle(`Building Done in ${elapsed} seconds.`);
  writeFileSync(join(BUILD_FOLDER, ".build.log"), new Date().toISOString());
}

const _crawl = crawl;
export { _crawl as crawl };
