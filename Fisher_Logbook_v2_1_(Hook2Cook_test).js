/*
  Full Job Name: Fisher Logbook v2_1 (Hook2Cook test)
  Created: 2017-05-17 8:50:23 AM
  Updated: 2017-05-17 8:50:20 AM

  Trigger: {"formId":"Fisher_Logbook_v2_1"}
*/
steps(
    each(
        join("$.data.data[*]", "$.data.formVersion", "formVersion"),
        create("Ablb_Fisher_Trip__c", fields(
            //HARDCODED
            field("form_id__c", "Fisher_Logbook_v2_0"), //DO NOT CHANGE

            field("all_or_self_only__c", dataValue("all_or_self_only")),
            field("boat_as_per_profile__c", dataValue("boat_as_per_profile")),
            field("boat_skipper_manual__c", dataValue("boat_skipper_manual")),
            field("catch_has__c", dataValue("catch_has")),
            field("comment_has__c", dataValue("comment_has")),
            field("comment_image_url__c", dataValue("comment_image.url")),
            field("comment_image2_url__c", dataValue("comment_image2.url")),
            field("comment_image3_url__c", dataValue("comment_image3.url")),
            field("comment_text__c", dataValue("comment_text")),
            field("community__c", function(state) {
                if (dataValue("trip_community")(state) === null) {  //Workaround for bug in v2_0 form which can leave trip_community as null
                    if (dataValue("trip_has")(state) == "no") {
                        return dataValue("fisher_community")(state);
                    } else {
                        return null;
                    }
                } else {
                    return dataValue("trip_community")(state);
                }
            }),
            field("cost_bait__c", dataValue("cost_bait")),
            field("cost_food__c", dataValue("cost_food")),
            field("cost_fuel__c", dataValue("cost_fuel_price")),
            field("cost_harbour_fee__c", dataValue("cost_harbour_fee")),
            field("cost_has__c", dataValue("cost_has")),
            field("cost_oil__c", dataValue("cost_oil")),
            field("cost_other_amount__c", dataValue("cost_other")),
            field("cost_other_description__c", dataValue("cost_other_name")),
            field("cost_transport__c", dataValue("cost_transport")),
            field("crew_list__c", dataValue("crew_members")), //NOT an array
            field("crew_number__c", dataValue("crew_number")),
            field("current_direction__c", dataValue("current_direction")),
            field("current_strength__c", dataValue("current_strength")),
            field("device_id__c", dataValue("deviceid")),
            field("displayed_profit__c", dataValue("displayed_profit")),
            field("form_language__c", dataValue("calc_form_language")),
            // field("form_version__c", dataValue("formversion_hack")), //BACKUP
            field("form_version__c", dataValue("*meta-model-version*")),
            field("fuel_litres__c", dataValue("fuel_litres")),
            field("gps_acc__c", dataValue("geopoint:Accuracy")),
            field("gps_alt_m__c", dataValue("geopoint:Altitude")),
            field("gps_lat__c", dataValue("geopoint:Latitude")),
            field("gps_lon__c", dataValue("geopoint:Longitude")),
            // field("gps_track_has__c", sourceValue()), // For future use
            field("landing_site__c", dataValue("landing_site")),

            relationship("lkup_community__r", "unique_ext_id__c", function(state) {
                if (dataValue("trip_community")(state) === null) {  //Workaround for bug in v2_0 form which can leave trip_community as null
                    if (dataValue("trip_has")(state) == "no") {
                        return dataValue("fisher_community")(state);
                    } else {
                        //This will probably cause job to fail, but fisher_community should always have a value
                        return null;
                    }
                } else {
                    return dataValue("trip_community")(state);
                }
            }),


            // relationship("lkup_landing_site__r", "unique_ext_id__c", function(state){

            //   var test = dataValue("landing_site")(state);

            //   if (!validateItem(test)){
            //       return "no_landingsite_defined";
            //   } else{
            //       return test;
            //   }

            //   function validateItem(input){
            //       return (input != undefined && input != null && input != "");
            //   }

            // }),   //TODO: landing_site is not always populated


            relationship("lkup_main_fisher_id__r", "abalobi_id__c", dataValue("main_fisher")),

            field("main_fisher_id__c", dataValue("main_fisher")),
            field("no_catch_reason__c", dataValue("no_catch_reason")),
            field("no_catch_target_species_other__c", dataValue("target_specie_manual")),
            field("no_trip_reason__c", dataValue("no_trip_reason")),
            field("no_trip_reason_other__c", dataValue("no_trip_reason_other")),
            field("nonlinked_boat_name__c", dataValue("nonlinked_boat_name")),
            field("nonlinked_boat_owner_manual__c", dataValue("nonlinked_boat_owner_manual")),
            field("nonlinked_boat_reg_num__c", dataValue("nonlinked_boat_reg_num")),
            field("nonlinked_boat_reg_type__c", dataValue("nonlinked_boat_reg_type")),
            field("nonlinked_boat_type__c", dataValue("nonlinked_boat_type")),
            field("num_children_expected__c", dataValue("count_repeats")),
            field("num_irp_linked__c", dataValue("num_irp")),
            field("odk_date__c", dataValue("*meta-date-marked-as-complete*")),
            field("odk_form_end_time__c", dataValue("end")),
            field("odk_form_start_time__c", dataValue("start")),
            field("odk_phonenumber__c", dataValue("phonenumber")),
            field("odk_uuid__c", dataValue("instanceID")),
            field("sea_condition__c", dataValue("sea_condition")),
            field("shore_type__c", dataValue("shore_type")),
            field("shore_spots__c", dataValue("shore_spots")),
            field("trip_date__c", dataValue("trip_date")),
            field("trip_end_time__c", function(state) {
                var tempStore;
                if (dataValue("time_end")(state) === null) {
                    return null;
                } else {
                    try {
                        var firstDate = new Date(dataValue("trip_date")(state) + "T" + dataValue("time_end")(state));
                        tempStore = firstDate.toISOString();

                    } catch (ex) {
                        return "Unable to parse TIME_END";
                    }
                    return tempStore;
                }
            }),
            field("trip_has__c", dataValue("trip_has")),
            field("trip_start_time__c", function(state) {
                var tempStore;
                if (dataValue("time_start")(state) === null) {
                    return null;
                } else {

                    try {
                        var firstDate = new Date(dataValue("trip_date")(state) + "T" + dataValue("time_start")(state));
                        tempStore = firstDate.toISOString();

                    } catch (ex) {
                        return "Unable to parse TIME_START";
                    }
                    return tempStore;
                }

            }),
            field("trip_type__c", dataValue("trip_type")),
            field("trip_today_or_prev__c", dataValue("trip_today_or_prev")), //TODO - SALESFORCE CREATE
            field("user_id__c", dataValue("username")),
            field("weather__c", dataValue("weather")),
            field("wind_direction__c", dataValue("wind_direction")),
            field("wind_strength__c", dataValue("wind_strength")),

            //relationship("lkup_boat_id__r", "unique_ext_id", dataValue("xxx")),  //TODO might need to do this in SF trigger -> needs to get value from user profile to put in here


            // field("boat_id__c", sourceValue()), //Will be allocated by a trigger in salesforce if boat_as_per_profile is true
            // field("CreatedById", sourceValue()), //Salesforce fields
            // field("CreatedDate", sourceValue()), //Salesforce fields
            // field("flag_submitted_by_another_user__c", sourceValue()), //Will be allocated by a trigger in salesforce
            // field("flag_submitted_by_non_proxy_approved_use__c", sourceValue()), //Will be allocated by a trigger in salesforce
            // field("Id", sourceValue()), //SALESFORCE FIELDS
            // field("IsDeleted", sourceValue()), //SALESFORCE FIELDS
            // field("LastActivityDate", sourceValue()), //SALESFORCE FIELDS
            // field("LastModifiedById", sourceValue()), //SALESFORCE FIELDS
            // field("LastModifiedDate", sourceValue()), //SALESFORCE FIELDS
            // field("LastReferencedDate", sourceValue()), //SALESFORCE FIELDS
            // field("LastViewedDate", sourceValue()), //SALESFORCE FIELDS
            // field("lkup_boat_id__c", sourceValue()), //SALESFORCE TRIGGER
            // field("Name", sourceValue()), //SALESFORCE FIELD
            // field("num_boats_local__c", sourceValue()), // LEGACY FIELDS, NO LONGER ASKED IN FISHER FORM
            // field("num_boats_outside_ski__c", sourceValue()), // LEGACY FIELDS, NO LONGER ASKED IN FISHER FORM
            // field("num_boats_sport__c", sourceValue()), // LEGACY FIELDS, NO LONGER ASKED IN FISHER FORM
            // field("num_children_in_sf__c", sourceValue()), //SALESFORCE ROLLUP FIELD
            // field("OwnerId", sourceValue()), //SALESFORCE FIELD, ASSIGNED TO MAIN FISHER USING TRIGGER IN SALESFORCE
            // field("SystemModstamp", sourceValue()), // SALESFORCE FIELD


            /*
             // LISTS
             */
            field("no_catch_target_species_list__c", function(state) {

                var tempStore;
                try {

                    tempStore = Array.apply(
                        null, dataValue("target_specie_list")(state)
                    ).join(', ');
                } catch (ex) {
                    return " ";
                }

                return tempStore;
            }),
            field("catch_method_list__c", function(state) {

                var tempStore;
                try {

                    tempStore = Array.apply(
                        null, dataValue("catch_method_list")(state)
                    ).join(', ');
                } catch (ex) {
                    return " ";
                }

                return tempStore;
            }),
            field("catch_specie_list__c", function(state) {

                var tempStore;
                try {

                    tempStore = Array.apply(
                        null, dataValue("catch_specie_list")(state)
                    ).join(', ');
                } catch (ex) {
                    return " ";
                }

                return tempStore;
            }),
            field("permit_list_boat__c", function(state) {

                var tempStore;
                try {

                    tempStore = Array.apply(
                        null, dataValue("permit_list_boat")(state)
                    ).join(', ');
                } catch (ex) {
                    return " ";
                }

                return tempStore;
            }),
            field("permit_list_self__c", function(state) {  //TODO: check out an array to string function that is available: https://github.com/OpenFn/language-common/blob/master/src/index.js#L338

                var tempStore;
                try {

                    tempStore = Array.apply(
                        null, dataValue("permit_list_self")(state)
                    ).join(', ');
                } catch (ex) {
                    return " ";
                }

                return tempStore;
            })
        ))
    ),


    each(
        merge(
            dataPath("rpt_catch[*]"),
            fields(
                field("metaId", dataValue("*meta-instance-id*")),
                field("parentId", lastReferenceValue("id")),
                field("target_specie_manual", dataValue("target_specie_manual")),
                field("parent_uuid", dataValue("instanceID"))
            )
        ),
        create("Ablb_fisher_catch__c", fields(
            field("parent_trip__c", dataValue("parentId")),
            field("odk_parent_uuid__c", dataValue("parent_uuid")), //Note - This is from the parent trip record
            field("alloc_coop_crates__c", dataValue("alloc_coop_crates")),
            field("alloc_coop_number__c", dataValue("alloc_coop_number")),
            field("alloc_coop_weight_kg__c", dataValue("alloc_coop_weight_kg")),
            field("alloc_self_crates__c", dataValue("alloc_self_crates")),
            field("alloc_self_number__c", dataValue("alloc_self_number")),
            field("alloc_self_weight_kg__c", dataValue("alloc_self_weight_kg")),
            field("alloc_sold_crates__c", dataValue("alloc_sold_other_crates")),
            field("alloc_sold_number__c", dataValue("alloc_sold_other_number")),
            field("alloc_sold_weight_kg__c", dataValue("alloc_sold_other_weight_kg")),
            field("bait_used__c", dataValue("catch_bait")),
            field("bait_used_other__c", dataValue("catch_bait_other")),
            field("coop_price_for_total_batch__c", dataValue("coop_price_per_batch")),
            field("coop_price_per_crate__c", dataValue("coop_price_per_crate")),
            field("coop_price_per_item__c", dataValue("coop_price_per_item")),
            field("coop_price_per_kg__c", dataValue("coop_price_per_kg")),
            field("coop_price_type__c", dataValue("coop_price_type")),

            relationship("lkup_species__r", "Name", dataValue("selected_specie")),

            field("num_crates__c", dataValue("catch_crates")),
            field("num_items__c", dataValue("catch_number")),
            field("other_price_for_total_batch__c", dataValue("other_price_per_batch")),
            field("other_price_per_crate__c", dataValue("other_price_per_crate")),
            field("other_price_per_item__c", dataValue("other_price_per_item")),
            field("other_price_per_kg__c", dataValue("other_price_per_kg")),
            field("other_price_type__c", dataValue("other_price_type")),
            field("species__c", dataValue("selected_specie")),
            field("species_other__c", dataValue("target_specie_manual")), //Note - This is from the parent trip record
            field("weight_kg__c", dataValue("catch_weight_kg")),

            field("catch_qr_tag__c", function(state){
                //Get the array of repeat tag objects
                let tagArray = dataValue("rpt_tags")(state);
                let tagString = "";

                for (let i in tagArray){
                    tagString += removeURL(tagArray[i].hook2cook_tag) + " ";
                }

                function removeURL(input) {
                    let search = "http://hooktocook.abalobi.info/catch/tag/";
                    return input.split(search).join("");
                }

                // console.log(tagString);
                return tagString;
            })


            //SALESFORCE FIELDS

            // field("CreatedById", sourceValue()),
            // field("CreatedDate", sourceValue()),
            // field("Id", sourceValue()),
            // field("IsDeleted", sourceValue()),
            // field("LastActivityDate", sourceValue()),
            // field("LastModifiedById", sourceValue()),
            // field("LastModifiedDate", sourceValue()),
            // field("LastReferencedDate", sourceValue()),
            // field("LastViewedDate", sourceValue()),
            // field("Name", sourceValue()),
            // field("SystemModstamp", sourceValue()),


        ))
    )
)

