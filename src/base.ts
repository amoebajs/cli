import * as path from "path";
import copyFn from "copy";
import rimrafFn from "rimraf";
import VinylFile from "vinyl";

const [_, __, action, ...argv] = process.argv;

export const ACTION = action;

export const CWD = process.cwd();

export const YARN = /^win/.test(process.platform) ? "yarn.cmd" : "yarn";

export interface IContent {
  moduleName: string;
  emit: string;
}

export function createContent(): IContent {
  const emitpath = (
    argv.find(i => i.startsWith("--path=")) ?? `--path=.`
  ).slice(7);

  const modulename = (
    argv.find(i => i.startsWith("--name=")) ?? `--name=`
  ).slice(7);

  const realemit = path.resolve(CWD, emitpath);
  const finalmd =
    modulename.length === 0 ? "demo-" + new Date().getTime() : modulename;
  return {
    emit: realemit,
    moduleName: finalmd
  };
}

export function rimraf(pathname: string) {
  return new Promise<void>((resolve, reject) => {
    rimrafFn(pathname, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export function copy(
  patterns: string[],
  dist: string,
  options?: copyFn.Options
) {
  return new Promise<VinylFile[]>((resolve, reject) => {
    copyFn(patterns, dist, options ?? {}, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files ?? []);
      }
    });
  });
}
