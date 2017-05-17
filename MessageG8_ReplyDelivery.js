/*
  Full Job Name: MessageG8 Reply/Delivery
  Created: 11/24/2016, 1:01:16 PM
  Updated: 2017-05-17 8:50:50 AM

  Trigger: {"system_id":"message02"}
*/
execute(function(state) {

    let filter = dataValue("datasource")(state);
    let SERVER_ENDPOINT = "http://197.85.186.65:8080/messagegate";

/*============================================================================
     Handle delivery report
 ============================================================================*/
    if (filter === "MessageG8_DLR") {

        let dlrCode = parseInt(dataValue("dlr")(state));

        //Convert to binary string
        let binaryDlr = convertToBinary(dlrCode);

        //Pad with leading zeroes if necessary
        binaryDlr = padWithZeroes(binaryDlr, 7);

        //Split code into array of chars
        let binaryChars = binaryDlr.split("");

        //Get the appropriate array of flags
        let flags = getFlags(binaryChars);

        //Declare an array to be filled with logs
        let messages = [];

        //Do we need to post? Did an error occur?
        let hasConcern = checkFlags(flags);

        console.log("Received delivery report.");

        /*============================================================================
            Functions
         ============================================================================*/

        function convertToBinary(dec){
            return (dec >>> 0).toString(2);
        }

        /**
         * Create a true or false from a binary value
         * @param input - Binary value
         * @returns {boolean}
         */
        function checkBinary(input){
            switch (parseInt(input)){
                case 1:
                    return true;
                    break;
                case 0:
                    return false;
                    break;
            }
        }

        function padWithZeroes(obj, expected_length){
            let tempObj = obj;
            if (tempObj.length !== expected_length){
                let zeroesToAdd = expected_length - tempObj.length;
                for (let i = 0; i < zeroesToAdd; i++){
                    tempObj = "0" + tempObj;
                }
            }
            return tempObj;
        }

        function getFlags(binaryCharArray){
            let init_flags=[{position:0,message:"The SMS has been rejected by the gateway",value:!1,concern:!0},
                {position:1,message:"The SMS has been accepted by the gateway",value:!1,concern:!1},
                {position:2,message:"The SMS has been rejected by the SMSC",value:!1,concern:!0},
                {position:3,message:"The SMS has been sent, but not yet delivered",value:!1,concern:!1},
                {position:4,message:"The SMS has been queued for delivery",value:!1,concern:!1},
                {position:5,message:"Delivery of the SMS has failed",value:!1,concern:!0},
                {position:6,message:"The SMS has been delivered to the subscriber",value:!1,concern:!1}];

            for (let i in binaryCharArray){
                init_flags[i].value = checkBinary(binaryCharArray[i]);
            }
            return init_flags;
        }

        function checkFlags(flagsArr){
            let hasConcern = false;
            for (let i in flagsArr){
                if (flagsArr[i].value === true && flagsArr[i].concern === true){
                    hasConcern = true;
                }
                if (flagsArr[i].value === true){
                    messages.push(flagsArr[i].message);
                }
            }
            return hasConcern;
        }

        /*============================================================================
            Return
         ============================================================================*/

        if (hasConcern){
            for (let i in messages){
                console.log(messages[i]);
            }
            console.log("Sending to abalobi server.");
            return postData({
                "url": SERVER_ENDPOINT,
                "body": function(state) {
                    return {
                        "message_type" : "delivery_report",
                        "message_recipient" : dataValue("destination_address")(state),
                        "delivery_code" : dataValue("dlr")(state),
                        "messages" : messages,
                        "notes" : "A recent message failed to send. Please check the number is correct."
                    }
                },
                "headers": {
                    "Content-Type": "application/json",
                }
            })(state);
        } else{
            for (let i in messages){
                console.log(messages[i]);
            }
            console.log("No need to send, no errors.");
            return null;
        }
    }
/*============================================================================
        Handle message reply
 ============================================================================*/
    else if (filter === "MessageG8") {

        console.log("Received SMS reply. Sending to abalobi server.");

        return postData({
            //https://api.telerivet.com/nexmo/status

            "url": SERVER_ENDPOINT,
            "body": function(state) {
                return {
                    "message_type" : "message_reply",
                    "message_sender" : dataValue("source_address")(state),
                    "message_body" : dataValue("content")(state)
                }
            },
            "headers": {
                "Content-Type": "application/json",

            }
        })(state);
    }
});

