/*
  Full Job Name: CCM_Landing_Site_v2_0 Monitor Survey
  Created: 2017-04-03 2:38:25 PM
  Edited: 2017-05-17 8:49:48 AM

  Trigger: {"openfn_filter":"monitor_survey"}
*/
steps(
    create("Ablb_Monitor_Day__c", fields(

        /*================================================================
         Monitor Day Fields
         ================================================================*/
        field("day_community__c", dataValue("dayForm.day_community ")),
        field("comment_text__c", dataValue("dayForm.day_end.comment")),
        field("comment_has__c", function(state){
            var tempObj = dataValue("dayForm.day_end.comment")(state);

            return hasComment(tempObj);

            function hasComment(input){
                if (input != undefined && input != null && input != ""){
                    return true;
                } else{
                    return false;
                }
            }

        }),
        field("time_work_stop__c", dataValue("dayForm.day_end.monitor_end_time")),
        field("shore_end_description__c", dataValue("dayForm.day_end.end_location_text")),
        field("gps_lat_end__c", dataValue("dayForm.day_end.gps_day_end_lattitude")),
        field("gps_lon_end__c", dataValue("dayForm.day_end.gps_day_end_longitude")),
        field("monitor_id__c", dataValue("dayForm.day_monitor_name")),
        field("sea_condition__c", dataValue("dayForm.day_sea_condition")),
        field("weather__c", dataValue("dayForm.day_weather")),
        field("wind_direction__c", dataValue("dayForm.day_wind_direction")),
        field("wind_strength__c", dataValue("dayForm.day_wind_strength")),
        field("odk_uuid__c", dataValue("dayForm.form_uuid")),
        field("landing_site__c", function(state){
            var testObj = dataValue("dayForm.landingsite")(state);
            
            return validate(testObj);
            
            function validate(input){
                if (input != undefined && input != null && input != ""){
                    return input;
                } else{
                    return "shore_monitor_no_landing_site";
                }
            }
        }),
        field("time_work_start__c", dataValue("dayForm.monitor_start_time")),
        field("shore_start_description__c", dataValue("dayForm.monitor_start_point")),
        field("gps_lat__c", dataValue("dayForm.gps_start_lattitude")),
        field("gps_lon__c", dataValue("dayForm.gps_start_longitude")),
        field("monitor_team_ids__c", function(state){
            var tempObj = dataValue("dayForm.monitor_team")(state);
            var tempStore = "";
            var count = 0;
            /*
             We need to remove the comma from the end of the line.

             To do this, we first need to check which entry
             will be the last entry in the line, and decide
             not to add a comma on the last entry.
             */

            //Check the length of the JSON
            var key2, arrLength = 0;
            for(key2 in tempObj) {
                if(tempObj.hasOwnProperty(key2)) {
                    arrLength++;
                }
            }

            //Iterate through the JSON and parse all entries into a single string
            for (key in tempObj){
                count++;
                if (tempObj[key] == true){
                    tempStore += "" + key + addCommaIfNotLast(count, arrLength);
                }
            }

            //Self Explanatory
            function addCommaIfNotLast(currentItem, length){
                if (currentItem == length){
                    return "";
                } else{
                    return ",";
                }
            }

            return tempStore;
        }),
        field("day_date__c", function(state){
            var timeStamp = dataValue("dayForm.form_timestamp")(state);
            var older_date = dataValue("dayForm.monitor_previous_date")(state);

            if (validateItem(older_date)){
                return older_date;
            } else{
                return timeStamp;
            }


            function validateItem(input){
                return (input != undefined && input != null && input != "");
            }

        }),
        field("monitor_role__c", dataValue("dayForm.monitor_type")),
        field("user_id__c", dataValue("dayForm.day_monitor_name")),

        //Still to add

        field("device_id__c", dataValue("dayForm.device.uuid")),
        field("form_version__c", dataValue("dayForm.form_version")),
        field("form_language__c", dataValue("dayForm.form_language")),
        field("gps_acc__c", dataValue("dayForm.gps_start_accuracy")),
        field("gps_acc_end__c", dataValue("dayForm.day_end.gps_day_end_accuracy")),
        // field("shore_num_fishers_recorded__c", dataValue("dayForm.num_expected_trips")),
        field("num_children_expected__c", dataValue("dayForm.num_expected_trips"))
        // field("??__c", dataValue("dayForm.form_type")),
        // field("??__c", dataValue("dayForm.form_status")),
        // field("lkup_monitor_id__c", dataValue("dayForm.day_monitor_name")),
        // field("comment_image_url__c", dataValue("dayForm.day_end.comment")),
        // field("lkup_landing_site__c", dataValue("dayForm.landingsite")),



        //TODO: Boat Tally Fields

        /*
        "version": "7.0",
        "uuid": "b7ecbb8005e21ae2",
        "serial": "LGH85056172095",
        "platform": "Android",
        "model": "LG-H850",
        "manufacturer": "LGE",
        "isVirtual": false,
        "cordova": "4.1.1",
        "available": true
        */



    )),
    each(
        merge(
            dataPath("tripForms[*]"),
            fields(
                field("parent_uuid", dataValue("dayForm.form_uuid")),
                field("parent_species", dataValue("species_key")),
                field("parentId", lastReferenceValue("id"))
            )
        ),
        combine(
            create("Ablb_Monitor_Trip__c", fields(

                /*================================================================
                 Monitor Trip Fields
                 ================================================================*/
                field("irp_licences__c", function(state) {
                    var tempObj = dataValue("boat_irp_licenses")(state);
                    var tempStore = "";
                    var count = 0;
                    //Check the length of the JSON
                    var key2, arrLength = 0;
                    for(key2 in tempObj) {
                        if(tempObj.hasOwnProperty(key2)) {
                            arrLength++;
                        }
                    }
                    //Iterate through the JSON and parse all entries into a single string
                    for (key in tempObj){
                        count++;
                        tempStore += "" + tempObj[key].license_num +  "/" + tempObj[key].license_holder +  "/" + tempObj[key].license_community + addCommaIfNotLast(count, arrLength);
                    }
                    //Self Explanatory
                    function addCommaIfNotLast(currentItem, length){
                        if (currentItem == length){
                            return "";
                        } else{
                            return ",";
                        }
                    }
                    return tempStore;
                }),
                field("boat_name__c", dataValue("boat_name")),
                field("number_of_crew__c", dataValue("boat_num_crew")),
                field("num_irp_licences__c", dataValue("boat_number_of_irp_licenses")),
                field("boat_reg_number__c", dataValue("boat_registration_number")),
                field("boat_type__c", dataValue("boat_type")),
                field("gear_types__c", function(state){
                    var tempObj = dataValue("fisher_gear_list")(state);
                    var tempStore = "";
                    var count = 0;
                    //Check the length of the JSON
                    var key2, arrLength = 0;
                    for(key2 in tempObj) {
                        if(tempObj.hasOwnProperty(key2)) {
                            arrLength++;
                        }
                    }
                    //Iterate through the JSON and parse all entries into a single string
                    for (key in tempObj){
                        count++;
                        if (tempObj[key] == true){
                            tempStore += "" + key + addCommaIfNotLast(count, arrLength);
                        }
                    }
                    //Self Explanatory
                    function addCommaIfNotLast(currentItem, length){
                        if (currentItem == length){
                            return "";
                        } else{
                            return ",";
                        }
                    }
                    return tempStore;
                }),
                field("odk_uuid__c", dataValue("form_uuid")),
                field("odk_parent_uuid__c", dataValue("parent_uuid")),
                field("parent_day__c", dataValue("parentId")),
                field("is_local__c", dataValue("local_fisher")),
                field("main_fisher_id__c", function(state){

                    var abalobi = dataValue("main_fisher_abalobi")(state);
                    var non_abalobi = dataValue("main_fisher_custom")(state);

                    if (validateItem(abalobi)){
                        return abalobi;
                    } else if (validateItem(non_abalobi)){
                        return non_abalobi;
                    } else if (dataValue("permit_type")(state) == "recreational"){
                        return "recreational_fisher";
                    } else{
                        return "no_name_specified";
                    }

                    function validateItem(input){
                        return (input != undefined && input != null && input != "");
                    }
                }),
                field("main_fisher_other__c", dataValue("main_fisher_custom")),
                field("comment_text__c", dataValue("monitor_comment")),
                field("permit_has__c", dataValue("permit_has")),
                field("permit_num_non_irp__c", dataValue("permit_number_non_irp")),
                field("permit_type__c", dataValue("permit_type")),
                field("trip_type__c", dataValue("trip_type")),
                field("main_fisher_other_gender__c", dataValue("fisher_gender")),
                field("trip_date__c", dataValue("form_timestamp")),
                field("shore_gps_lat__c", dataValue("gps_trip_lattitude")),
                field("shore_gps_lon__c", dataValue("gps_trip_longitude")),
                field("comment_has__c", function(state){

                    var tempObj = dataValue("monitor_comment")(state);

                    return hasComment(tempObj);

                    function hasComment(input){
                        if (input != undefined && input != null && input != ""){
                            return true;
                        } else{
                            return false;
                        }
                    }
                }),
                field("shore_gps_acc__c", dataValue("gps_trip_accuracy")),
                field("num_children_expected__c", dataValue("num_expected_catches"))
                // field("__c", dataValue("fisher_age")),
                // field("??__c", dataValue("form_type")),
                // field("comment_image_url__c", dataValue("SOMETHING")),


            )),

            each(
                merge(
                    dataPath("catches[*]"),
                    fields(
                        field("parent_uuid", dataValue("form_uuid")),
                        field("parentId", lastReferenceValue("id"))
                    )
                ),
                combine(
                    create("Ablb_Monitor_Catch__c", fields(

                        /*================================================================
                         Monitor Catch
                         ================================================================*/
                        field("odk_uuid__c", dataValue("catch_uuid")),
                        field("odk_parent_uuid__c", dataValue("parent_uuid")),
                        field("species__c", dataValue("species_key")),
                        field("num_crates__c", dataValue("total_crates")),
                        field("num_items__c", dataValue("total_items")),
                        field("weight_kg__c", dataValue("weight_kgs")),
                        field("parent_trip__c", dataValue("parentId")),
                        field("num_children_expected__c", dataValue("num_expected_samples"))
                        // field("__c", dataValue("")),
                        // field("<?don't map?>__c", dataValue("species_name")),
                    )),
                    each(

                        merge(
                            dataPath("samples[*]"),
                            fields(
                                field("parent_uuid", dataValue("catch_uuid")),
                                field("parent_species", dataValue("species_key")),
                                field("parentId", lastReferenceValue("id"))
                            )
                        ),
                        combine(
                            
                        
                        create("Ablb_Monitor_Sample__c", fields(

                            /*================================================================
                             Monitor Sample
                             ================================================================*/
                            field("weight_kg__c", dataValue("weight")),
                            field("has_eggs__c", dataValue("hasEggs")),
                            field("length_cm__c", dataValue("length")),
                            field("odk_uuid__c", dataValue("sample_uuid")),
                            field("odk_parent_uuid__c", dataValue("parent_uuid")),
                            field("gender__c", dataValue("gender")),
                            field("species__c", dataValue("parent_species")),
                            field("tag__c", dataValue("lobster_tag")),
                            field("parent_catch__c", dataValue("parentId"))

                        )))
                    )
                )
            )
        ))

);


/*
    Tool Functions


function hasComment(input){
    if (input != undefined && input != null && input != ""){
        return true;
    } else{
        return false;
    }
}
    

*/