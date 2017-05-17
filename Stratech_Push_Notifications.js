/*
  Full Job Name: Stratech Push Notifications
  Created: 11/24/2016, 1:02:48 PM
  Updated: 2017-05-17 8:51:28 AM

  Trigger: {"Envelope":{"Body":{"notifications":{"OrganizationId":"00D24000000Hm97EAC"}}}}
*/
postData({
  url: "http://52.50.190.20:31001/http_record_add_new",
  // url: "http://197.85.186.65:8080/http_record_add_new",
  "body": function(state) {

      if (dataValue("Envelope.Body.notifications.Notification.sObject.-type")(state) == "sf:Ablb_Co_op_membership__c"){
        //COOP MEMBERSHIP REQUEST
        return {
          "new_record_type": "Ablb_Co_op_membership__c",
          "unique_id_field": "sfid",
          "unique_id": dataValue("Envelope.Body.notifications.Notification.sObject.Id")(state)
        }
      } else if (dataValue("Envelope.Body.notifications.Notification.sObject.-type")(state) == "sf:User"){
        //NEW USER REQUEST HERE
        return {
          "new_record_type": "User",
          "unique_id_field": "sfid",
          "unique_id": dataValue("Envelope.Body.notifications.Notification.sObject.Id")(state)
        }
      } else if (dataValue("Envelope.Body.notifications.Notification.sObject.-type")(state) == "sf:Ablb_Fisher_Catch__c"){
        //CATCH NOTIFICATION HERE
        return {
          "new_record_type": "Ablb_Fisher_Catch__c",
          "unique_id_field": "sfid",
          "unique_id": dataValue("Envelope.Body.notifications.Notification.sObject.Id")(state)
        }
      } else if (dataValue("Envelope.Body.notifications.Notification.sObject.-type")(state) == "sf:Ablb_Co_op__c"){
        //NEW COOP CREATED HERE
        return {
          "new_record_type": "Ablb_Co_op__c",
          "unique_id_field": "sfid",
          "unique_id": dataValue("Envelope.Body.notifications.Notification.sObject.Id")(state)
        }
      } else {
        return {
          "information": "Please ignore this request."
        }
      }

  },
  headers: {
      "Authorization": "06926a82-67a7-48ee-8fdb-d16b031ceb1b",
      "Content-Type": "application/json"
  }
})
