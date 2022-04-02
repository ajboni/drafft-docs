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
import fse from "fs-extra";
import fuse from "fuse.js";
import { join } from "path";

const { readFileSync, outputFileSync } = fse;
const { createIndex } = fuse;
/**
 * Add javascript necesary to perform a seach on this document
 *
 * @param {document} Document to add search to.
 * @returns
 */
export function makeSearch() {
  if (!config.ENABLE_SEARCH) return;

  config.LANGUAGES.forEach((lang) => {
    const docs = JSON.parse(
      readFileSync(join(".temp", lang.id, "searchDB.json"), {
        encoding: "utf-8",
      })
    );

    const options = {
      keys: [
        { name: "plainTextContent", weight: 1 },
        { name: "title", weight: 12 },
        { name: "url", weight: 0.5 },
      ],
    };
    const index = createIndex(options.keys, docs);

    outputFileSync(
      join(config.BUILD_FOLDER, lang.id, "searchIndex.json"),
      JSON.stringify(index.toJSON())
    );
    outputFileSync(
      join(config.BUILD_FOLDER, lang.id, "searchDatabase.json"),
      JSON.stringify(docs)
    );
  });
}
