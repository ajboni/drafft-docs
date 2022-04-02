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

import chalk from "chalk";

const { gray, green, red, yellow, bold, hex } = chalk;

export function logStatus(msg) {
  console.log(gray`${msg}`);
}
export function logOK(msg) {
  console.log(green`[OK] ${msg}`);
}
export function logError(msg) {
  console.trace(red`[ERROR] ${msg}`);
}

export function logBg(msg) {
  console.log(hex("#f29312")`[BACKGROUND] ${msg}`);
}

export function logJob(msg) {
  console.log(hex("#f29312")`[...] ${msg}`);
}

export function logWarning(msg) {}
export function logTitle(msg) {
  console.log(bold.whiteBright`\n-------- ${msg} -------- \n`);
}
