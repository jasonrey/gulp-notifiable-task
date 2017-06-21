# gulp-notifiable-task

# Information

This plugin adds a `.notifiableTask` wrapper method that create Gulp task and mimics `.task` parameters.

1 main difference is the callback. A custom handler object that mimics `gulp.src` behavior will be passed over to the callback, in which must be used to create the stream instead of the default `gulp.src`.

You may pass in `--staging`, `--production` or `--disableNotification` to surpress notification.

Underlyingly, the plugin is using:

+ [`node-notifier`](https://www.npmjs.com/package/node-notifier) to trigger notification
+ [`gulp-plumber`](https://www.npmjs.com/package/gulp-plumber) to patch error handler
+ [`gulp-util`](https://www.npmjs.com/package/gulp-util) to check for environment and arguments

## Usage

```
    let gulp = require('gulp');
    let sass = require('gulp-sass');

    require('gulp-notifiable-task');

    gulp.notifiableTask('build', ['build:sass']);

    gulp.notifiableTask('build:sass', function(stream) {
        stream.src('**/*.sass')
            .pipe(sass())
            .pipe(gulp.dest('css'));
    });
```

## Todos

- Customizable notification templates
- Custom callback before notification
