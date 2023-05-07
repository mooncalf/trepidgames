// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.EmbeddedFiles = {

    get: function(fileName) {
    var comp = this.compressedContent[fileName];
    if (comp !== undefined) return { name: fileName, content: jt.Util.uncompressStringBase64ToInt8BitArray(comp) };

    var diff = this.diffsContent[fileName];
    if (diff === undefined) return undefined;

    var base = this.get(diff.based);
    if (base === undefined) return undefined;

    var content = base.content;
    for (var add in diff.diffs) {
        var bytes = diff.diffs[add];
        for (var i = 0; i < bytes.length; ++i) content[(add | 0) + i] = bytes[i];
    }
    return { name: fileName, content: content };
    },

    embedFileCompressedContent: function(fileName, compressedContent) {
        this.compressedContent[fileName] = compressedContent;
    },

    embedFileDiff: function(fileName, diffs) {
        this.diffsContent[fileName] = diffs;
    },

    compressedContent: {},

    diffsContent: {}

};
