import { IThemeConfigPreset } from "@core/types";
import { MenuLinkType } from "./core/api/graphql/types";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $cfg: IThemeConfigPreset;
    $menus: Record<string, MenuLinkType[]>;
  }
}
