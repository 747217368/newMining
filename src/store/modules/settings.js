import { useDynamicTitle } from "@/utils/dynamicTitle";

const useSettingsStore = defineStore("settings", {
  state: () => ({
    title: import.meta.env.VITE_APP_TITLE,
    dynamicTitle: true,
  }),
  actions: {
    // 设置网页标题
    setTitle(title) {
      this.title = title;
      useDynamicTitle();
    },
  },
});

export default useSettingsStore;
