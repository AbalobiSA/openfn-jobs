/*
  Full Job Name: Send SMS with Nexmo
  Created: 11/24/2016, 4:18:16 PM
  Edited: 2017-05-17 8:51:05 AM

  Trigger: {"destination":"SMS portal"}
*/
postData({
    //https://api.telerivet.com/nexmo/status

    url: function(state) {
        var part1 = "https://rest.nexmo.com/sms/json?api_key=87ad2a2c&api_secret=8f2272e17d7d1329&to=";
        var part2 = dataValue("data[0].Envelope.Body.notifications.Notification.sObject.cell_num_personal__c")(state);
        var part3 = "&from=NexmoWorks&text=hello+from+Nexmo";
        console.log(part1 + part2 + part3);
        return part1 + part2 + part3;
    },
    "body": function(state) {
        var initialNumber = dataValue("recipient_number")(state);
        var newNumber = "";

        var messagePart = dataValue("text")(state);

        console.log("SUBSTRING OF INITIAL: " + initialNumber.substring(0, 3));

        if (initialNumber.indexOf(' ') >= 0){
            //replace all spaces
            console.log("Spaces detected, replacing...");
            initialNumber = initialNumber.replace(/ /g, '');
        }

        if (initialNumber.substring(0, 1) == "0") {
            //If the number begins with 0, replace with 27
            console.log("SUBSTRING: " + initialNumber.substring(0, 2) + "\n");
            newNumber = "27" + initialNumber.substring(1);
        } else if (initialNumber.substring(0, 3) == "+27") {
            //If the number begins with a +27, remove the plus
            console.log("SUBSTRING: " + initialNumber.substring(1) + "\n");
            newNumber = initialNumber.substring(1);
        } else {
            newNumber = initialNumber;
        }





        return {
            api_key: '531be3cf',
            api_secret: '84458c1883489e44',
            "to": newNumber,
            from: '2787240508610041',
            text: messagePart
        }
    },
    "headers": {
        "Content-Type": "application/json",

    }
})
