var fs = require('fs');
var csv = require('fast-csv');

var row = 1;
// File to use
var filename = "example.secretsanta.csv"

// List of all participants
var listOfParticipants = []
// List of all partners they have had in the past
var participantPartners = {}
// List of participants used in the matching process. Can not be used again
var participantsUsed = []
// The final list of the matching participants to thier unique partner
var participantMatch = []

// Start the process
getData()

/*
    Function used to get all of the data from the csv and put it into the appropriate arrays
*/
function getData() {
    fs.createReadStream(filename)
        .pipe(csv())
        .on("data", function(data){
            var column = -1;
            
            data.forEach(function (name){
                // If row 1 - then get all of the participants
                if (row == 1) {
                    // ignore column 1
                    if (column >= 0) {
                        //console.log(name)
                        listOfParticipants.push(name)
                        participantPartners[name] = []
                    }
                // If not row 1 - then get the partners that the particiapnt has had
                } else {
                    if (column >= 0 && name != '') {
                        participantPartners[listOfParticipants[column]].push(name)
                    }
                }
                column=column+1;
            })
            row=row+1;
        })
        // Once it is done reading the file - get the pairings
        .on("end", function(){
            //console.log("done");
            //console.log(participantPartners)
            findPairings()
        });
}

function findPairings() {
    // Reset the arrays and variables each execution
    completedAllParticipants = true;
    participantMatch = []
    participantsUsed = []

    // Loop throught all participants to fine a match
    listOfParticipants.forEach(function(name) {
        matchFound=false;

        // Use temp array to make matches - Using a temp array we can remove choices as we mark them off
        var possibleParticipants=listOfParticipants.slice(0)
        // var possibleParticipants = listOfParticipants.filter(function(element) {
        //     return element !== "none";
        // });

        if (possibleParticipants.length == 0) {
            console.log('Did not create array - trying again')
            completedAllParticipants=false
            setTimeout(findPairings, 5000);
            return;
        }
        
        // Don't stop until you find a match
        while (!matchFound) {
            // Get random participant to check
            console.log("possible participants length: "+possibleParticipants.length)
            var randomInt = getRandomInt(possibleParticipants.length)
            var trailMatch = possibleParticipants[randomInt]
            console.log("trying: "+trailMatch)

            if (trailMatch === undefined) {
                console.log('Trial match undefined - trying again')
                completedAllParticipants=false
                setTimeout(findPairings, 5000);
                return;
            }

            // Match works if
            // - Is not the name of the participant
            // - Has not be used by the participant
            // - Has not been used by another participant
            if (trailMatch != name && participantPartners[name].indexOf(trailMatch) == -1 && participantsUsed.indexOf(trailMatch) == -1) {
                console.log("Found match for "+name+" - "+trailMatch)
                matchFound=true;
                participantsUsed.push(trailMatch)
                participantMatch[name] = trailMatch
                console.log('----------------')
            // if match is not found - remove option from array and try again
            } else {
                console.log("Removing "+trailMatch+" for "+name)
                possibleParticipants.splice(randomInt, 1)
                // If there are no options left - start the process over
                if (possibleParticipants.length == 0) {
                    console.log('Matches not found - trying again')
                    completedAllParticipants=false
                    setTimeout(findPairings, 5000);
                    return;
                }
            }
        }
    })

    // If all matches were compelte - call back
    if (completedAllParticipants) {
        done()
    }
}

// Get random integer function
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Function to call once all of the pairings are done
function done() {
    console.log('final list')
    console.log(participantMatch)
    // Append output to file
    writeToFile()
}

// Write output to file
function writeToFile() {
    // Get the year for fiest column
    var lineToWrite = (new Date()).getFullYear().toString()

    // Loop through matches in order and grad their match
    listOfParticipants.forEach(function(name) {
        lineToWrite = lineToWrite + "," + participantMatch[name]
    })
    
    // Apend to file
    fs.appendFile(filename,"\n"+lineToWrite, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 
}