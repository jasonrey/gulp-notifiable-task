# gulp-notifiable-task

# Information

This plugin adds a `.notifiableTask` wrapper method that create Gulp task and mimics `.task` parameters.

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

    gulp.notifiableTask('build:sass', function() {
        gulp.src('**/*.sass')
            .pipe(sass())
            .pipe(gulp.dest('css'));
    });
```

## Todos

- Customizable notification templates
- Custom callback before notification

## Credits

- calvin @ weixhen.co
- [`node-notifier`](https://www.npmjs.com/package/node-notifier)
- [`gulp`](https://www.npmjs.com/package/gulp)
- [`gulp-plumber`](https://www.npmjs.com/package/gulp-plumber)
- [`gulp-util`](https://www.npmjs.com/package/gulp-util)
