import vue from "@vitejs/plugin-vue";

import createAutoImport from "./auto-import";
import { mars3dPlugin } from "vite-plugin-mars3d";

export default function createVitePlugins(viteEnv, isBuild = false) {

  const vitePlugins = [vue()];
  vitePlugins.push(mars3dPlugin());
  vitePlugins.push(createAutoImport());
  return vitePlugins;
}
