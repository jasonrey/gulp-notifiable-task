'use strict';

let gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    util = require('gulp-util'),
    notifier = require('node-notifier');

let disableNotification = false;
let noNotification = util.env.production || util.env.staging || util.env.disableNotification || process.env.DISABLE_NOTIFIER;
let hasError = false;

let notify = {
    show(title, message) {
        if (noNotification || disableNotification) {
            return;
        }

        notifier.notify({
            title, message
        });
    },

    success(title) {
        this.show('Gulp Task [' + title + ']', 'SUCCESS');
    },

    error(title) {
        this.show('Gulp Task [' + title + ']', 'ERROR');
    }
};

let generateCallback = (taskname, subtasks, handler) => {
    if (typeof handler !== 'function') {
        handler = function() {};
    }

    let hasDone = !!handler.length;

    return function() {
        return new Promise((resolve, reject) => {
            if (subtasks.length) {
                disableNotification = false;
            }

            hasError = false;

            let originalSrc = gulp.src;

            let hasStream = false;

            gulp.src = paths => {
                hasStream = true;

                return originalSrc(paths)
                    .on('end', () => {
                        setTimeout(() => {
                            if (!hasError) {
                                resolve();
                            }
                        }, 500);
                    })
                    .pipe(plumber({
                        errorHandler(error) {
                            reject(error);
                        }
                    }));
            };

            let result = hasDone ? new Promise(handler) : handler();

            gulp.src = originalSrc;

            if (!hasStream) {
                Promise.resolve(result)
                    .then(resolve)
                    .catch(reject);
            }
        })
            .then(() => {
                notify.success(taskname);
            })
            .catch(error => {
                hasError = true;

                disableNotification = false;

                notify.error(taskname);

                console.error(error.message);
            });
    };
};

let generateFallbackHandler = function(taskname) {
    return function() {
        disableNotification = false;

        notify.success(taskname);
    };
};

let notifiableTask = (taskname, subtasks, handler) => {
    let hasSubtasks = typeof subtasks === 'object' && subtasks.constructor.name === 'Array';

    if (typeof subtasks === 'function') {
        handler = subtasks;

        subtasks = [];
    }

    if (typeof handler !== 'function') {
        handler = generateFallbackHandler(taskname);
    }

    gulp.task(
        taskname,
        hasSubtasks && !noNotification ? ['disableNotification', ...subtasks] : subtasks,
        generateCallback(taskname, subtasks, handler)
    );
};

gulp.task('disableNotification', () => {
    disableNotification = true;
});

gulp.notifiableTask = notifiableTask;

module.exports = notifiableTask;
