import { poetDetail, writerDetail } from "./poet/index.js";
import { vrExhibition, vrExhibitionDetail } from "./vr/index.js";
import {
  forumDetail,
  forumEdit,
} from "@/router/routes/permission/modules/individualPage/forum/index.js";
import { editUser } from "@/router/routes/permission/modules/individualPage/user/index.js";

const poetPage = [poetDetail, writerDetail];
const vrPage = [vrExhibitionDetail, vrExhibition];
const forumPage = [forumEdit, forumDetail];
const userPage = [editUser];
const individualPageRoutes = [
  ...poetPage,
  ...vrPage,
  ...forumPage,
  ...userPage,
];

export default individualPageRoutes;
