var fs = require('fs'),
    path = require('path'),
    levenshtein = require('fast-levenshtein'),
    targetTransc = require('./results/target_transcription.json'),
    smResults = require('../speechmatics/src/results/transcripts.json'),

    results = [];


var FILE_MAPPING_1_KEY = 'File Mapping 1';
var FILE_MAPPING_2_KEY = 'File Mapping 2';
var TRUE_TRANSCRIPTION_KEY = 'True Transcription';

//==========================================================
// Compare transcriptions
//==========================================================

// It compares transcriptions of both files
// to the true-transcription by Levesnshtein's Distance Algorithm
targetTransc.forEach(entry => {


    var trueTranscription = entry[TRUE_TRANSCRIPTION_KEY],

        file1 = entry[FILE_MAPPING_1_KEY],
        file1Transcription = smResults[file1],
        // { useCollator: true} => locale sensitive string comparison
        // As our strings contains de-DE locale' strings
        levDistance1 = levenshtein.get(file1Transcription, trueTranscription, { useCollator: true})

        file2 = entry[FILE_MAPPING_1_KEY],
        file2Transcription = smResults[file2],
        levDistance2 = levenshtein.get(file2Transcription, trueTranscription, { useCollator: true});

    results.push({
        TRUE_TRANSCRIPTION_KEY: trueTranscription,
        FILE_MAPPING_1_KEY: file1,
        'Transcription File Mapping 1': file1Transcription,
        'Levenshtein Distance 1': levDistance1,
        FILE_MAPPING_2_KEY: file2,
        'Transcription File Mapping 2': file2Transcription,
        'Levenshtein Distance 2': levDistance2,
    });

});

//==========================================================
// Write comparison results to file
//==========================================================
var file = path.join(__dirname, 'results/speechmatics_results.json'),
    contents = JSON.stringify(results, null, 4),
    cb = (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File [results/speechmatics_results.json] containing statistics for speechmatics' analysis has been created");
         };

fs.writeFile(file, contents, cb);