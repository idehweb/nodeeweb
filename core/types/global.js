"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USE_ENV = exports.ENV = void 0;
var ENV;
(function (ENV) {
    ENV["PRO"] = "production";
    ENV["DEV"] = "development";
    ENV["LOC"] = "local";
})(ENV || (exports.ENV = ENV = {}));
var USE_ENV;
(function (USE_ENV) {
    USE_ENV["NPM"] = "npm-install";
    USE_ENV["GIT"] = "git-clone";
})(USE_ENV || (exports.USE_ENV = USE_ENV = {}));
