import { arrayToObjectMap } from "@projectsbuild/library/utils";

export const PROJECT_STATUSES = ["planning", "building", "complete"] as const;
export const PROJECT_STATUS = arrayToObjectMap(PROJECT_STATUSES);
