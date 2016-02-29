/*
 * grunt-cclogdelete
 * https://github.com/okamoto-masao/grunt-cclogdelete
 *
 * Copyright (c) 2016 okamoto-masao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('cclogdelete', 'delete cclog() with ruby script.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // grunt.log.writeln(JSON.stringify(options));

    var done = this.async();
    var fileCount = this.files.length;
    var doneCount = 0;

    grunt.log.writeln('fileCount:' + fileCount);

    grunt.log.writeln('process.cwd:' + process.cwd());

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var spawn = require('child_process').spawn;
        var cmd = spawn('ruby', ['node_modules/grunt-cclogdelete/cclogdelete.rb', filepath], { cwd:"." });
        var buff = "";

        cmd.stdout.on('data', function(data) {
          // grunt.log.writeln('stdout:' + data);

          buff += String(data);
        });

        cmd.stderr.on('data', function(data) {
          grunt.log.writeln('stderr: ' + data);
          done(false);
        });

        cmd.on('close', function(code) {
          if (code !== 0) {
            grunt.log.writeln('child process exited with code : ' + code);
            done(false);
          }

          // Print a success message.
          grunt.log.writeln('File "' + f.dest + '" created.');

          // Write the destination file.
          grunt.file.write(f.dest, buff);

          // Count done processes and check end of all.
          doneCount++;
          if (doneCount >= fileCount) done();
        });

        grunt.log.writeln('run cclogdelete. filepath = ' + filepath);

      });

      // Handle options.
      src += options.punctuation;
    });
  });

};
