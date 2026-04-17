import { DataDeleteCron } from "./dataDelete.js";
import { startItemDeleteCron } from "./itemDelete.js";
import { startItemSortDecayCron } from "./itemSortDecay.js";
import { startTokenCron } from "./token.js";
import { startCommentSortDecayCron } from "./commentSortDecay.js";
import { startBuyDeleteCron } from "./buyDelete.js";
import { startTrustScoreCron } from "./trustScore.js";

export const startAllCrons = () => {
    console.log("Starting all cron job...");
    DataDeleteCron();
    startItemDeleteCron();
    startItemSortDecayCron();
    startTokenCron();
    startCommentSortDecayCron();
    startBuyDeleteCron();
    startTrustScoreCron();
};
