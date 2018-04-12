var Speechmatics = require('speechmatics'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    log = console.log;

var USER_ID = 12345;
var API_AUTH_TOKEN = 'some token';
var options = {};
var sm = new Speechmatics(USER_ID, API_AUTH_TOKEN, options);

//=========================================================
// Create Job
//=========================================================

var createdJobs = [2369193];

var createJob = (function () {


    return (audioFilename, cb) => {
            return sm.createJob(
               // options
               {
                    audioFilename: audioFilename,
                    formData: {
                        model: 'de',
                    }
               },
               // callback
               (err, created) => {
                   if (err) {
                      log("Error while creating job for transcript .");
                      log(`${err.code} ${err.error}`);
                   } else {
                       log(`Transcript job created with id: ${created.id} file:${audioFilename}`);
                       createdJobs.push(created.id);
                       log(created);
                   }
               }
            );
        }

})();

//=========================================================
// Get Transcript
//=========================================================

var getTranscript = (function () {

    return (tid, callback) => {
        return sm.getTranscript(tid, callback);
    };

})();


function getTranscriptOfCreatedJobs() {
    var transcripts = {},
        callback = (err, transcript) => {
            var job = transcript.job,
                sentences = '';

            log("Transcription retrieved for job-id:" + job.id + ", name:" + job.name);

            if (transcript && !_.isEmpty(transcript.words)) {
                sentences =
                    _.chain(transcript.words)
                     .map(word => word.name)
                     .join(" ")
                     .value();
            }

            var sen = {};
            sen[job.name] = sentences;
            console.log(sen);
            transcripts = Object.assign(transcripts, sen);
        };


    _.forEach(createdJobs, jobId => {
        log(`Fetching transcript for job: ${jobId}`)
        getTranscript(jobId, callback)
    });


    // Write transcripts in file 'results/transcripts.json'
    setTimeout(() => {
        var file = path.join(__dirname, 'results/transcripts.json'),
            contents = JSON.stringify(transcripts, null, 4),
            cb = (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    };
                    console.log("File ['./results/transcriptions.json'] containing audio-file-name and transcription has been created.");
                 };

        fs.writeFile(file, contents, cb);

    }, 10000);

}


//=========================================================
// Process all audios in './audio/' folder
//=========================================================

function processAudioFolder() {
    fs.readdir(path.join(__dirname, 'audio/'), (err, files) => {

        _.forEach(files, file => {

            var audioFilename = path.join(__dirname, 'audio/', file);;
            createJob(audioFilename);

        });

        // call getTranscriptOfAllJobs() after 120 sec
        // After the data transfer finishes, it may take up to 120 seconds
        setTimeout(getTranscriptOfCreatedJobs, 120000);

    });
}

processAudioFolder();
//getTranscriptOfCreatedJobs();
