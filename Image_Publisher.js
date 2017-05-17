/*
  Full Job Name: Image Publisher
  Created: 11/24/2016, 1:01:16 PM
  Updated: 2017-05-17 8:50:37 AM

  Trigger: {"filter":"abalobi_registration"}
*/
postData({
  url: "http://197.85.186.65:8080/imageupload",
  "body": function(state) {

      // Get image base64 data for reconstruction
      return {
        "name": dataValue("name")(state),
        "surname": dataValue("surname")(state),
        "id": dataValue("id")(state),
        "image": dataValue("photo_selfie")(state)
      }
  },
  headers: {
      "Authorization": "06926a82-67a7-48ee-8fdb-d16b031ceb1b",
      "Content-Type": "application/json"
  }
})