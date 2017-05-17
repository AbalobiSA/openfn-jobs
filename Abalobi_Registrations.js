/*
  Full Job Name: Abalobi Registrations
  Created: 11/24/2016, 12:57:17 PM
  Updated: 2017-05-17 8:49:13 AM

  Trigger: {"filter":"abalobi_registration"}
*/
execute(function(state) {

    let filter = dataValue("usertype")(state);

    if (filter === "co_op") {
        return create("Ablb_Co_op__c", fields(
            // field("test", dataValue("app_version"))
            field("display_name__c", dataValue("co_op_name")),
            field("Name", function(state){

                let coop_name_raw = dataValue("co_op_name")(state);

                function fixCoopName(input){
                    let no_spaces = replaceAll(input, " ", "_");
                    return no_spaces.toLowerCase();
                }

                function replaceAll(input, search, replacement) {
                    return input.replace(new RegExp(search, 'g'), replacement);
                }

                return fixCoopName(coop_name_raw);
            }),
            field("date_registered_on_abalobi__c", dataValue("uuid_timestamp")),
            // relationship("lkup_administrator_id__c"),
            // relationship("lkup_community_id__c"),
            // relationship("lkup_administrator_id__r", "unique_ext_id__c", dataValue("coop_admin_id")),
            relationship("lkup_community_id__r", "unique_ext_id__c", dataValue("landingsite"))

            // field("gps_lat", dataValue("")),
            // field("gps_lon", dataValue("")),
            // field("gps_alt_m", dataValue("")),
            // field("image_url", dataValue(""))
        ))(state);

    } else {
        return create("Ablb_Registration__c", fields(


            field("app_version__c", function(state) {
                try {
                    return dataValue("app_version")(state);
                } catch (ex) {
                    return "Mapping Failed";
                }
            }),

            field("usertype__c", function(state){
                let user_type = dataValue("usertype")(state);
                let is_fisher = dataValue("is_also_fisher")(state);

                if (user_type === "fisher_manager"){
                    if (is_fisher){
                        return "fisher_manager fisher"
                    } else{
                        return "fisher_manager"
                    }
                } else{
                    return user_type;
                }
            }),
            field("permission_local_assistant__c", sourceValue("$.data.permission_local_implementer")),
            field("permission_daff__c", sourceValue("$.data.permission_daff")),
            field("name__c", sourceValue("$.data.name")),
            field("surname__c", sourceValue("$.data.surname")),
            field("nickname__c", sourceValue("$.data.nickname")),
            field("email__c", sourceValue("$.data.email")),
            field("email_is_my_own__c", sourceValue("$.data.email_is_my_own")),
            field("id_number__c", sourceValue("$.data.id")),
            field("cell_num_personal__c", sourceValue("$.data.cell")),
            field("password__c", sourceValue("$.data.password")),
            field("birth_date__c", sourceValue("$.data.birth_date")),
            field("home_community__c", sourceValue("$.data.landingsite")),
            field("home_community_custom__c", sourceValue("$.data.landingsite_custom")),
            field("fisher_boat_type__c", sourceValue("$.data.fisher_boat_type")),
            field("preferred_language__c", sourceValue("$.data.preferred_language")),
            field("has_license_recreational__c", sourceValue("$.data.fisher_license_recreational")),
            field("has_license_com__c", sourceValue("$.data.fisher_license_commercial")),
            field("has_license_com_wcrl__c", sourceValue("$.data.fisher_com_wcrl")),
            field("has_license_com_tlf__c", sourceValue("$.data.fisher_com_tlf")),
            field("has_license_com_other__c", sourceValue("$.data.fisher_com_other")),
            field("has_license_irp__c", sourceValue("$.data.fisher_licence_irp")),
            field("licence_recreational_number__c", sourceValue("$.data.fisher_licence_recreational_number")),
            field("licence_com_wcrl_number__c", sourceValue("$.data.fisher_licence_com_wcrl_number")),
            field("licence_com_tlf_number__c", sourceValue("$.data.fisher_licence_com_tlf_number")),
            field("licence_com_other_number__c", sourceValue("$.data.fisher_licence_com_other_number")),
            field("licence_irp_number__c", sourceValue("$.data.fisher_licence_irp_number")),
            field("fisher_in_co_op__c", sourceValue("$.data.fisher_co_op")),
            field("fisher_co_op_name__c", sourceValue("$.data.fisher_co_op_name")),
            field("fishes_from_boat__c", sourceValue("$.data.fisher_boat")),
            field("fishes_from_shore__c", sourceValue("$.data.fisher_shore")),
            field("boat_other__c", sourceValue("$.data.boat_other")),
            field("boat_own__c", sourceValue("$.data.boat_own")),
            field("boat_name__c", sourceValue("$.data.boat_name")),
            field("boat_reg__c", sourceValue("$.data.boat_reg")),
            field("boat_expDate__c", sourceValue("$.data.boat_expDate")),
            field("boat_has_engine__c", sourceValue("$.data.boat_has_engine")),
            field("boat_engine_hp__c", sourceValue("$.data.boat_engine_hp")),
            field("boat_engine_cc__c", sourceValue("$.data.boat_engine_cc")),
            field("device_manufacturer__c", sourceValue("$.data.device_manufacturer")),
            field("device_model__c", sourceValue("$.data.device_model")),
            field("device_platform__c", sourceValue("$.data.device_platform")),
            field("device_version__c", sourceValue("$.data.device_version")),
            field("device_uuid__c", sourceValue("$.data.device_uuid")),
            field("device_serial__c", sourceValue("$.data.device_serial")),
            field("co_op_name__c", sourceValue("$.data.co_op_name")),
            field("co_op_reg_num__c", sourceValue("$.data.co_op_reg_num")),
            field("coop_admin_name__c", sourceValue("$.data.coop_admin_name")),
            field("coop_admin_surname__c", sourceValue("$.data.coop_admin_surname")),
            field("coop_admin_nickname__c", sourceValue("$.data.coop_admin_nickname")),
            field("coop_admin_id__c", sourceValue("$.data.coop_admin_id")),
            field("uuid_timestamp__c", sourceValue("$.data.uuid_timestamp")),
            field("gender__c", sourceValue("$.data.gender"))
        ))(state);
    }
});

