module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    options: {
      ios: {
        version: grunt.option('os-version') || '8.3',
        device: grunt.option('device') || 'iPhone 6'
      },
      tns: grunt.option('tns') || 'tns'
    },
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ["dist"],
      "api-ref": ["dist/api-ref"],
      "github.io": ["github.io/**/*.*", "!github.io/.git", "!github.io/.gitignore", "!github.io/.nojekyll"]
    },
    exec: {
      tsc_source: 'node_modules/typescript/bin/tsc -p ./source/',
      tsc_example: 'node_modules/typescript/bin/tsc -p ./examples/SimpleBackgroundHttp/',
      gradle_android_upload_service: {
        cmd: 'gradle build',
        cwd: 'deps/android-upload-service'
      },
      npm_pack: {
        cmd: 'npm pack ./package',
        cwd: 'dist/'
      },
      tns_install: {
        cmd: '<%= options.tns %> install',
        cwd: 'examples/SimpleBackgroundHttp'
      },
      tns_plugin_install: {
        cmd: '<%= options.tns %> plugin add ../../dist/package',
        cwd: 'examples/SimpleBackgroundHttp'
      },
      run_ios_emulator: {
        cmd: '<%= options.tns %> run ios --emulator --device iPhone-6',
        cwd: 'examples/SimpleBackgroundHttp'
      },
      build_ios_emulator: {
        cmd: '<%= options.tns %> build ios --emulator',
        cwd: 'examples/SimpleBackgroundHttp'
      },
      run_android_emulator: {
        cmd: '<%= options.tns %> run android --emulator',
        cwd: 'examples/SimpleBackgroundHttp'
      },
      tsd_link: {
        cmd: 'tsd link',
        cwd: 'examples/SimpleBackgroundHttp'
      },
    },
    typedoc: {
      "api-ref": {
        options: {
          // 'flag:undefined' will set flags without options.
          module: 'commonjs',
          target: 'es5',
          out: './dist/api-ref/',
          json: './dist/doc.json',
          name: 'Background HTTP for NativeScript',
          includeDeclarations: undefined,
          excludeExternals: undefined,
          externalPattern: '**/d.ts/**',
          mode: 'file',
          readme: 'source/README.md',
          entryPoint: '"nativescript-background-http"'
          // verbose: undefined
        },
        src: ['source/background-http.d.ts', 'source/d.ts/data/observable/observable.d.ts']
      }
    },
    copy: {
      plugin: {
        files: [
          { expand: true, cwd: 'source', src: ['**/*.js', '**/*.xml', '**/*.jar', '**/*.plist', './*.d.ts', 'package.json', 'README.md', 'imagepicker.d.ts'], dest: 'dist/package' }
        ]
      },
      android_upload_service: {
        src: 'deps/android-upload-service/build/outputs/aar/android-upload-service-debug.aar',
        dest: 'dist/package/platforms/android/libs/android-upload-service.aar'
      },
      "github.io": {
      	files: [
		      { expand: true, cwd: 'dist/api-ref', src: ['**/*'], dest: 'github.io' }
      	]
      }
    },
    mkdir: {
      dist: {
        options: {
          create: ["dist/package"]
        }
      }
    },
    mochaAppium: {
      options: {
        reporter: 'spec',
        timeout: 360e3,
        usePromises: true,
        appiumPath: 'appium'
      },
      'iOS': {
        src: ['tests/automation/*.js'],
        options: {
          platformName: 'iOS',
          version: '<%= options.ios.version %>',
          deviceName: '<%= options.ios.device %>',
          app: __dirname + '/examples/SimpleBackgroundHttp/platforms/ios/build/emulator/SimpleBackgroundHttp.app'
        }
      },
      'Android': {
        src: ['tests/automation/*.js'],
        options: {
          platformName: 'Android',
          version: '<%= options.android.version %>',
          deviceName: '<%= options.android.device %> - <%= options.android.version %>',
          app: __dirname + '/examples/SimpleBackgroundHttp/platforms/android/build/outputs/apk/SimpleBackgroundHttp-debug.apk'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-typedoc');
  grunt.loadNpmTasks('grunt-mocha-appium');

  grunt.registerTask('http-dev', 'Host handle uploads.', function() {
    var serv = require('./examples/www/server');
    var done = this.async();
    var server = serv.start(8083, console);
  });
  
  // Default task(s).
  grunt.registerTask('default', [
    'clean:dist',
    'exec:gradle_android_upload_service',
    'exec:tsc_source',
    'mkdir:dist',
    'copy:android_upload_service',
    'copy:plugin',
    'exec:npm_pack',
    'exec:tns_install',
    'exec:tns_plugin_install',
    'exec:tsd_link',
    'exec:tsc_example'
  ]);
  
  grunt.registerTask('ios', [
    'default',
    'exec:run_ios_emulator'
  ]);

  grunt.registerTask('android', [
    'default',
    'exec:run_android_emulator'
  ]);

  grunt.registerTask('github.io', [
  	'clean:api-ref',
  	'clean:github.io',
  	'typedoc:api-ref',
  	'copy:github.io'
  ]);

  grunt.registerTask('tests', [
    'default',
    'exec:build_ios_emulator',
    'mochaAppium:iOS'
  ])
};

