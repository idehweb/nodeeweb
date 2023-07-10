import { Req } from "@nodeeweb/core/types/global";
import { serviceOnError } from "../common/service";
import { classCatchBuilder } from "@nodeeweb/core/utils/catchAsync";
import mongoose from "mongoose";
import store from "@nodeeweb/core/store";

export default class Service {
  static getAllQuery(req: Req) {
    let search: mongoose.FilterQuery<any> = {};
    if (req.query.search) {
      search["title." + req.headers.lan] = {
        $exists: true,
        $regex: req.query.search,
        $options: "i",
      };
    }
    if (req.query.Search) {
      search["title." + req.headers.lan] = {
        $exists: true,
        $regex: req.query.Search,
        $options: "i",
      };
    }
    let tt = Object.keys(req.query);
    tt.forEach((item) => {
      if (store.db.model("entry").schema.paths[item]) {
        let split = (req.query[item] as string).split(",");
        if (mongoose.isValidObjectId(split[0])) {
          search[item] = {
            $in: split,
          };
        }
      }
    });
    if (req.query.filter && typeof req.query.filter === "string") {
      search = JSON.parse(req.query.filter);
    }
    return search;
  }
  static onError = serviceOnError("Entry");
}

classCatchBuilder(Service);
