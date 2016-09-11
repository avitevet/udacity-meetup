/* eslint-env node */

// generated on 2016-07-25 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const jasmine = require('gulp-jasmine-phantom');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
	return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
	outputStyle: 'expanded',
	precision: 10,
	includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

/**
 * Concat, babel, and uglify the given JS files in the project.
 * Store them in the given dest directory in a file named filename.
 * smap indicates whether the files should have source maps or not -
 * in production mode, the files should not have sourcemaps, otherwise they should.
 */
gulp.task('scripts', () => {
	var scriptnames = ['validatedForm.js', 'invitelist.js', 'authenticationForm.js', 'create-event.js',
		'invite-guests.js', 'my-events.js', 'preview-send.js'];
	var scriptfiles = [];
	scriptnames.forEach(function(name) {
		scriptfiles.push('app/scripts/' + name);
	});

	return gulp.src(scriptfiles)
    .pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.concat('app.min.js'))
    .pipe($.babel())
		.pipe($.uglify())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('.tmp/scripts'))
		.pipe(gulp.dest('dist/scripts'))
    .pipe(reload({stream: true}));
});



function lint(files, options) {
	return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
	return lint('app/scripts/**/*.js', {
		fix: true
	})
	.pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
	return lint('test/spec/**/*.js', {
		fix: true,
		env: {
			mocha: true
		}
	})
	.pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('test', function() {
	gulp.src('test/spec/**/*.js')
	.pipe(jasmine({
		integration: true,
		keepRunner: 'test/generated',
		includeStackTrace: true,
		jasmineVersion: '2.4',
		vendor: ['app/scripts/invitelist.js', 'app/scripts/invite-guests.js']
	}));
});

gulp.task('html', ['styles', 'scripts'], () => {
	return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    /*.pipe($.if('*.js', $.uglify())) // JS is already uglified */
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
	return gulp.src('app/images/**/*')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true,
			// don't remove IDs from SVGs, they are often used
			// as hooks for embedding and styling
			svgoPlugins: [{cleanupIDs: false}]
		})))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
	return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
	return gulp.src([
		'app/*.*',
		'!app/*.html'
	], {
		dot: true
	}).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'scripts', 'fonts', 'test'], () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['.tmp', 'app'],
			index: 'signin.html'
		}
	});

	gulp.watch([
		'app/*.html',
		'app/images/**/*',
		'.tmp/fonts/**/*'
	]).on('change', reload);

	gulp.watch('app/styles/**/*.scss', ['styles']);
	gulp.watch('app/scripts/**/*.js', ['scripts', 'test']).on('change', reload);
	gulp.watch('test/spec/**/*.js', ['test']);
	gulp.watch('app/fonts/**/*', ['fonts']);
	gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('assets:dist', () => {
	return gulp.src('app/assets/**')
		.pipe(gulp.dest('dist/assets'));
});

gulp.task('serve:dist', ['html', 'fonts', 'images', 'assets:dist' /*, 'test' */], () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['dist'],
			index: 'signin.html'
		}
	});
});

gulp.task('serve:test', ['scripts'], () => {
	browserSync({
		notify: false,
		port: 9000,
		ui: false,
		server: {
			baseDir: 'test',
			routes: {
				'/scripts': '.tmp/scripts'
			}
		}
	});

	gulp.watch('app/scripts/**/*.js', ['scripts']);
	gulp.watch('test/spec/**/*.js').on('change', reload);
	gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
	gulp.src('app/styles/*.scss')
    .pipe(wiredep({
	ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

	gulp.src('app/*.html')
    .pipe(wiredep({
	exclude: ['bootstrap-sass'],
	ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
	return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
	gulp.start('build');
});
