import { arrayToObjectMap } from "@projectsbuild/library/utils";

export const REPO_URL = "https://github.com/spfave/projects-build";

export const PROJECT_ID_LENGTH = 8;
export const PROJECT_STATUSES = ["planning", "building", "complete"] as const;
export const PROJECT_STATUS = arrayToObjectMap(PROJECT_STATUSES);
