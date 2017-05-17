/*
  Full Job Name: Abalobi Registration Ack via Nexmo
  Created: 11/24/2016, 4:18:16 PM
  Edited: 2017-05-17 9:32:45 AM

  Trigger: {"Envelope":{"Body":{"notifications":{"Notification":{"sObject":{"-type":"sf:Ablb_Registration__c"}}}}}}
*/
postData({
    //https://api.telerivet.com/nexmo/status

  url: function(state){
    var part1 = "https://rest.nexmo.com/sms/json?api_key=87ad2a2c&api_secret=8f2272e17d7d1329&to=";
    var part2 = dataValue("data[0].Envelope.Body.notifications.Notification.sObject.cell_num_personal__c")(state);
    var part3 = "&from=NexmoWorks&text=hello+from+Nexmo";
    console.log(part1 + part2 + part3);
    return part1 + part2 + part3;
  },
  "body": function(state){
    var initialNumber = dataValue("Envelope.Body.notifications.Notification.sObject.cell_num_personal__c")(state);
    var newNumber = "";
    
    var messagePart1 = "[Abalobi] Thank you for your registration, ";
    var messagePart2 = dataValue("Envelope.Body.notifications.Notification.sObject.name__c")(state);
    var messagePart3 = " ";
    var messagePart4 = dataValue("Envelope.Body.notifications.Notification.sObject.surname__c")(state);
    var messagePart5 = ". You'll receive another SMS within 2 business days to confirm your registration";
    //Keep this here - may re-use later:   var messagePart5 = ". The Abalobi team is currently on Christmas break, so your registration will be processed early in January. You will receive another SMS once your registration is processed.";
    
    if (initialNumber.substring(0, 2) != "27"){
      console.log("SUBSTRING: " + initialNumber.substring(0, 2) + "\n");
       newNumber = "27" + initialNumber.substring(1);
    } else{
      newNumber = initialNumber;
    }



    return{
      api_key: '531be3cf',
      api_secret: '84458c1883489e44',
      "to": newNumber,
      from: '2787240508610041',
      text: messagePart1 + messagePart2 + messagePart3 + messagePart4 + messagePart5
    }
  },
  "headers": {
      "Content-Type": "application/json",

  }
})