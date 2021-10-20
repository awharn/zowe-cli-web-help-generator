const gulp = require('gulp');
require('ts-node/register');

/**
 * Development related tasks
 */
const developmentTasks = require("./gulp/DevelopmentTasks");
gulp.task("updateLicense", developmentTasks.license);
