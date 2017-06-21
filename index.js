let gulp = require('gulp'),
    util = require('gulp-util'),
    notifier = require('node-notifier');

let disableNotification = false;
let hasError = false;

let notify = {
    show(title, message) {
        if (util.env.production ||
            util.env.staging ||
            util.env.disableNotification ||
            process.env.DISABLE_NOTIFIER ||
            disableNotification) {
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

let notifiableTask = (taskname, subtasks, handler) => {
    if (typeof subtasks === 'object' && subtasks.constructor.name === 'Array') {
        subtasks.unshift('disableNotification');

        gulp.task(taskname, subtasks, () => {
            disableNotification = false;

            notify[hasError ? 'error' : 'success'](taskname);

            if (typeof handler === 'function') {
                handler();
            }
        });
    } else {
        handler = subtasks;

        gulp.task(taskname, () => {
            return new Promise((resolve, reject) => {
                hasError = false;

                let stream = (paths) => {
                    return gulp.src(paths)
                        .on('end', () => {
                            setTimeout(() => {
                                if (!hasError) {
                                    notify.success(taskname);
                                }

                                resolve();
                            }, 500);
                        })
                        .pipe(plumber({
                            errorHandler(error) {
                                hasError = true;

                                notify.error(taskname);

                                console.error(error.message);

                                reject();
                            }
                        }));
                };

                stream.src = stream;
                stream.dest = gulp.dest;

                handler(stream);
            });
        });
    }
};

gulp.task('disableNotification', () => {
    disableNotification = true;
});

gulp.notifiableTask = notifiableTask;

module.exports = notifiableTask;
