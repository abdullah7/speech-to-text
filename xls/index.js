var node_xj = require("xls-to-json");
node_xj({
        input: "Transcription .xls",  // input xls
        output: "output.json", // output json
        sheet: "utterances"  // specific sheetname
    },
    function(err, result) {
        if(err) {
           console.error(err);
        } else {
           console.log('xls-to-json representation generated (output.json).')
        }
    });