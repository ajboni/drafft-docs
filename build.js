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

import { crawl } from "./src/crawler/crawl.js";
import { watch } from "chokidar";
import { copyMedia } from "./src/crawler/copy_media.js";
import { config } from "./config.js";
import { makeStyles } from "./src/crawler/make_styles.js";
import { join, extname } from "path";
import { copyTemplatesJavascript } from "./src/crawler/init_build_folder.js";
/* Set up dev live-reload */
crawl();
setUpLiveReload();

/**
 * Sets up live reload for dev environment.
 * TODO: Make it more modular. do not clean up. remove and only reprocess what's changed.
 */
function setUpLiveReload() {
  if (process.env.NODE_ENV === "development") {
    // TODO:
    // chokidar
    //   .watch("./src", { ignoreInitial: true })
    //   .on("all", (event, path) => {
    //     crawl();
    //     console.log(event, path);
    //   });

    // /* Watch CSS Folder */
    // chokidar
    //   .watch(path.join("src", "client", "scss"), { ignoreInitial: true })
    //   .on("all", (event, path) => {});

    watch("./config.js", { ignoreInitial: true }).on("all", (event, path) => {
      crawl();
      console.log(event, path);
    });

    watch(config.CONTENT_FOLDER, { ignoreInitial: true }).on(
      "all",
      (event, path) => {
        console.log(event, path);
        crawl();
      }
    );

    /* Watch client files */
    watch(join("src", "client"), { ignoreInitial: true }).on(
      "all",
      (event, _path, details) => {
        switch (extname(_path)) {
          case ".js":
            copyTemplatesJavascript();
            break;
          case ".scss":
            makeStyles();
            break;
          default:
            break;
        }
      }
    );
  }
}
