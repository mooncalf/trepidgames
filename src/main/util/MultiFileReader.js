// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.MultiFileReader = function (files, onAllSuccess, onFirstError, maxTotalSize) {
"use strict";

    this.start = function() {
        if (!files || files.length === 0)
            onAllSuccess(files);
        else {
            if (!maxTotalSize) maxTotalSize = MAX_TOTAL_SIZE;
            var totalSize = 0;
            for (var i = 0; i < files.length; i++) totalSize += files[i].size;
            if (totalSize > maxTotalSize) {
                var error = "Maximum total size limit exceeded: " + ((maxTotalSize / 1024) | 0) + "KB";
                if (onFirstError) onFirstError(files, error, true);     // known error
                return;
            }

            for (i = 0; i < files.length; i++) load(files[i]);
            checkFinish();
        }
    };

    function load(file) {
        if (!file) return;

        jt.Util.log("Reading file: " + file.name);
        var reader = new FileReader();
        reader.onload = function (event) {
            file.success = true;
            file.content = new Uint8Array(event.target.result);
            checkFinish();
        };
        reader.onerror = function (event) {
            file.success = false;
            file.error = event.target.error.name;
            checkFinish();
        };
        reader.readAsArrayBuffer(file);
    }

    function checkFinish() {
        if (finished) return;

        for (var i = 0; i < files.length; i++)
            if (files[i] && (files[i].success === undefined)) return;

        finished = true;

        // All files have a definition, check for errors
        for (i = 0; i < files.length; i++)
            if (files[i] && !files[i].success) {
                if (onFirstError) onFirstError(files, files[i].error);
                return files;
            }

        // If no errors, then success
        if (onAllSuccess) onAllSuccess(files);
    }

    var finished = false;

    var MAX_TOTAL_SIZE = 8 * 720 * 1024;   // Read up 8 720KB disks of files

};
