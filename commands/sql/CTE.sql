  with audit_event_tracker_ids(audit_event_id) as 
            (
                 select audit_event_id from audit_event_tracker  
                WHERE notification_event_status = 'READY' 
                AND audit_type != 'CREATE'
                AND date(created_ts) = current_date() 
                AND audit_entity_type IN ('USER', 'USER_RULE', 'POLYGON', 'RELEASE', 'ACTIVATION_SUMMARY', 'LAYER'
                                        , 'USER_CONDITION', 'CHANGE_NOTIFICATION')
            )
        UPDATE audit_event_tracker  aet 
            inner join audit_event_tracker_ids aetm on aetm.audit_event_id = aet.audit_event_id 
        set 
            notification_event_status = 'In Progress', 
            updated_ts = current_timestamp();
       
 

       with tmp_audit_event_tracker (audit_event_id, audit_entity_id, audit_entity_name, audit_entity_type, audit_type, 
        entity_owner_id, entity_modifier_id, emailSubject, emailBody, description 
       ) as 
       (
         with tmp_audit_event_tracker_copy (audit_event_id, audit_entity_id, audit_entity_name, audit_entity_type, audit_type, audit_desc, notification_event_status, entity_owner_id, entity_modifier_id, old_value, new_value, created_ts, updated_ts, audit_table_id, audit_table) as 
            as (
                 SELECT audit_event_id, audit_entity_id, audit_entity_name, audit_entity_type, audit_type, audit_desc, notification_event_status, entity_owner_id, entity_modifier_id, old_value, new_value, created_ts, updated_ts, audit_table_id, audit_table
                FROM audit_event_tracker ad 
                where notification_event_status = 'In Progress' 
                AND audit_type != 'CREATE'
                AND date(created_ts) = current_date() 
                AND audit_entity_type IN ('USER', 'USER_RULE', 'POLYGON', 'RELEASE', 'ACTIVATION_SUMMARY', 'LAYER'
                                        , 'USER_CONDITION', 'CHANGE_NOTIFICATION') 
            ) 
                SELECT audit_event_id, audit_entity_id, audit_entity_name, audit_entity_type, audit_type, 
                        entity_owner_id, IFNULL(entity_modifier_id, entity_owner_id) AS entity_modifier_id,
                        CONCAT(CONCAT(UCASE(LEFT(aet.audit_entity_type, 1)), LCASE(SUBSTRING(aet.audit_entity_type, 2))), ' has been ', lower(aet.audit_type),'d - ', aet.audit_entity_name) AS emailSubject,
                        CONCAT('This email is to notify that the ', aet.audit_entity_type, ' - "', aet.audit_entity_name, '" ', 'has been ', lower(aet.audit_type), 'd by ', su.full_name, '.') AS emailBody,
                        CONCAT(aet.audit_entity_type, ' - "', aet.audit_entity_name, '" ', ' has been ', lower(aet.audit_type), 'd by ', su.full_name, '.') AS description
                FROM   tmp_audit_event_tracker_copy aet
                    INNER JOIN sec_users su ON su.login_id = IFNULL(entity_modifier_id, entity_owner_id)
                WHERE audit_entity_type IN ('USER', 'USER_RULE', 'RELEASE', 'ACTIVATION_SUMMARY')
       ) 
        INSERT INTO user_email_notification(notification_entity_id, notification_entity_type, email_sent, no_of_attempts, email_from, email_to, cc, bcc, subject, email_body, created_ts, updated_ts)
        SELECT DISTINCT taet.audit_entity_id, taet.audit_entity_type, 0 AS email_sent, 0 AS no_of_attempts, emailSender, 'test@test.com' , cc, bcc, taet.emailSubject, taet.emailBody, CURRENT_TIMESTAMP(), NULL AS updated_ts  
        FROM tmp_audit_event_tracker taet
            INNER JOIN sec_users su ON su.login_id = taet.entity_owner_id
            INNER JOIN user_notification_preference unp ON unp.user_id = taet.entity_owner_id AND unp.notification_type = taet.audit_entity_type
        WHERE taet.entity_owner_id != taet.entity_modifier_id
            AND taet.audit_type = 'UPDATE'
            AND taet.audit_entity_type IN ('USER', 'USER_RULE', 'RELEASE', 'ACTIVATION_SUMMARY')
            AND unp.bEmail = 1;

        
      with tmp_audit_event_tracker (audit_event_id, audit_entity_id, audit_entity_name, audit_entity_type, audit_type, 
        entity_owner_id, entity_modifier_id, emailSubject, emailBody, description 
       ) as 
       (
         with tmp_audit_event_tracker_copy (audit_event_id, audit_entity_id, audit_entity_name, audit_entity_type, audit_type, audit_desc, notification_event_status, entity_owner_id, entity_modifier_id, old_value, new_value, created_ts, updated_ts, audit_table_id, audit_table) as 
            as (
                 SELECT audit_event_id, audit_entity_id, audit_entity_name, audit_entity_type, audit_type, audit_desc, notification_event_status, entity_owner_id, entity_modifier_id, old_value, new_value, created_ts, updated_ts, audit_table_id, audit_table
                FROM audit_event_tracker ad 
                where notification_event_status = 'In Progress' 
                AND audit_type != 'CREATE'
                AND date(created_ts) = current_date() 
                AND audit_entity_type IN ('USER', 'USER_RULE', 'POLYGON', 'RELEASE', 'ACTIVATION_SUMMARY', 'LAYER'
                                        , 'USER_CONDITION', 'CHANGE_NOTIFICATION') 
            ) 
                SELECT audit_event_id, audit_entity_id, audit_entity_name, audit_entity_type, audit_type, 
                        entity_owner_id, IFNULL(entity_modifier_id, entity_owner_id) AS entity_modifier_id,
                        CONCAT(CONCAT(UCASE(LEFT(aet.audit_entity_type, 1)), LCASE(SUBSTRING(aet.audit_entity_type, 2))), ' has been ', lower(aet.audit_type),'d - ', aet.audit_entity_name) AS emailSubject,
                        CONCAT('This email is to notify that the ', aet.audit_entity_type, ' - "', aet.audit_entity_name, '" ', 'has been ', lower(aet.audit_type), 'd by ', su.full_name, '.') AS emailBody,
                        CONCAT(aet.audit_entity_type, ' - "', aet.audit_entity_name, '" ', ' has been ', lower(aet.audit_type), 'd by ', su.full_name, '.') AS description
                FROM   tmp_audit_event_tracker_copy aet
                    INNER JOIN sec_users su ON su.login_id = IFNULL(entity_modifier_id, entity_owner_id)
                WHERE audit_entity_type IN ('USER', 'USER_RULE', 'RELEASE', 'ACTIVATION_SUMMARY')
       ) 
        INSERT INTO user_system_notification(notification_entity_id, notification_entity_name, notification_entity_type, status, user_id, urgency, created_ts, description, details, modified_ts)
        SELECT DISTINCT taet.audit_entity_id, taet.audit_entity_name, taet.audit_entity_type, 'NEW', taet.entity_owner_id, 'NORMAL', CURRENT_TIMESTAMP(), taet.description, null AS details, null AS modified_ts
        FROM tmp_audit_event_tracker taet
            INNER JOIN user_notification_preference unp ON unp.user_id = taet.entity_owner_id AND unp.notification_type = taet.audit_entity_type
        WHERE taet.entity_owner_id != taet.entity_modifier_id
            AND taet.audit_type = 'UPDATE'
            AND taet.audit_entity_type IN ('USER', 'USER_RULE', 'RELEASE', 'ACTIVATION_SUMMARY')
            AND unp.bVSON = 1;