--------------------------------------------------------
--  File created - Monday-August-05-2024   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Package Body PKG_GO_REPORT
--------------------------------------------------------

CREATE OR REPLACE PACKAGE BODY "GOREPORTTELEGRAM"."PKG_GO_REPORT" AS

-- FUNCTIONS

--------------------------------------------------------
-- FUNCTION FN_LIST_PROJECT_GO
-- Description: Returns a pipelined list of projects from the view VW_PROYECTOS_GOREPORT.
-- Return Type: TTY_LIST_PROJECT
--------------------------------------------------------
FUNCTION FN_LIST_PROJECT_GO RETURN TTY_LIST_PROJECT PIPELINED AS 
BEGIN
    -- Iterate over each project record from the view
    FOR V_REC IN (SELECT AUTO_ID, NOMBRE_PRO FROM VW_PROYECTOS_GOREPORT)
    LOOP
        -- Pipe each project record as a row in the output
        PIPE ROW (TY_LIST_PROJECT(V_REC.AUTO_ID, V_REC.NOMBRE_PRO));
    END LOOP;

    RETURN; -- End of function
END FN_LIST_PROJECT_GO;

--------------------------------------------------------
-- FUNCTION FN_LIST_TICK_PROJECT_GO
-- Description: Lists tickets related to a site from WV_REPORT_TIC_PREV_TELEG, joining with VW_SITIOS_GO_REPORTTELEGRAM.
-- Parameters:
--   @param {VARCHAR2} VSITE: Site information to filter the tickets.
-- Return Type: TTY_LIST_TICK_PROJECT
--------------------------------------------------------
FUNCTION FN_LIST_TICK_PROJECT_GO (VSITE IN VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED AS 
BEGIN
    -- Query to fetch ticket information based on site
    FOR V_REC IN (
        SELECT TT.TICKETID, TT.SITEID, TT.NOMBREDELSITIO  
        FROM WV_REPORT_TIC_PREV_TELEG TT
        INNER JOIN VW_SITIOS_GO_REPORTTELEGRAM TG ON (TT.SITEID = TG.SITEID)
        WHERE TT.TICKETID LIKE VSITE OR TG.ID2GFINAL LIKE '%' || UPPER(VSITE) || '%'
        ORDER BY TT.TICKETID DESC
    )
    LOOP
        -- Pipe each ticket record as a row in the output
        PIPE ROW (TY_LIST_TICK_PROJECT(V_REC.SITEID, V_REC.TICKETID, V_REC.NOMBREDELSITIO));
    END LOOP;

    RETURN; -- End of function
END FN_LIST_TICK_PROJECT_GO;

--------------------------------------------------------
-- FUNCTION FN_LIST_TICK_PROJECT_ABAS_GO
-- Description: Lists project tickets from WV_REPORT_TIC_ABAS_TELEG based on site.
-- Parameters:
--   @param {VARCHAR2} VSITE: Site information to filter the tickets.
-- Return Type: TTY_LIST_TICK_PROJECT
--------------------------------------------------------
FUNCTION FN_LIST_TICK_PROJECT_ABAS_GO (VSITE IN VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED AS 
BEGIN
    -- Query to fetch ticket information from the ABAS view
    FOR V_REC IN (
        SELECT TT.TICKETID, TT.IDNODO, TT.NOMBREDELSITIO  
        FROM WV_REPORT_TIC_ABAS_TELEG TT
        INNER JOIN VW_SITIOS_GO_REPORTTELEGRAM TG ON (TT.IDNODO = TG.SITEID)
        WHERE TT.TICKETID LIKE VSITE OR TG.ID2GFINAL LIKE '%' || UPPER(VSITE) || '%'
        ORDER BY TT.TICKETID DESC
    )
    LOOP
        -- Pipe each ticket record as a row in the output
        PIPE ROW (TY_LIST_TICK_PROJECT(V_REC.IDNODO, V_REC.TICKETID, V_REC.NOMBREDELSITIO));
    END LOOP;

    RETURN; -- End of function
END FN_LIST_TICK_PROJECT_ABAS_GO;

--------------------------------------------------------
-- FUNCTION FN_LIST_TICK_PROJECT_MGP_GO
-- Description: Lists project tickets from WV_REPORT_TIC_MGP_TELEG based on site.
-- Parameters:
--   @param {VARCHAR2} VSITE: Site information to filter the tickets.
-- Return Type: TTY_LIST_TICK_PROJECT
--------------------------------------------------------
FUNCTION FN_LIST_TICK_PROJECT_MGP_GO (VSITE IN VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED AS 
BEGIN
    -- Query to fetch ticket information from the MGP view
    FOR V_REC IN (
        SELECT TT.TICKETID, TT.SITEID, TT.NOMBREDELSITIO  
        FROM WV_REPORT_TIC_MGP_TELEG TT
        INNER JOIN VW_SITIOS_GO_REPORTTELEGRAM TG ON (TT.SITEID = TG.SITEID)
        WHERE TT.TICKETID LIKE VSITE OR TG.ID2GFINAL LIKE '%' || UPPER(VSITE) || '%'
        ORDER BY TT.TICKETID DESC
    )
    LOOP
        -- Pipe each ticket record as a row in the output
        PIPE ROW (TY_LIST_TICK_PROJECT(V_REC.SITEID, V_REC.TICKETID, V_REC.NOMBREDELSITIO));
    END LOOP;

    RETURN; -- End of function
END FN_LIST_TICK_PROJECT_MGP_GO;

--------------------------------------------------------
-- FUNCTION FN_LIST_TICK_PROJECT_CORR_GO
-- Description: Lists tickets from WV_REPORT_TIC_CORR_TELEG based on site.
-- Parameters:
--   @param {VARCHAR2} VSITE: Site information to filter the tickets.
-- Return Type: TTY_LIST_TICK_PROJECT
--------------------------------------------------------
FUNCTION FN_LIST_TICK_PROJECT_CORR_GO (VSITE IN VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED AS 
BEGIN
    -- Query to fetch ticket information from the CORR view
    FOR V_REC IN (
        SELECT TT.TICKETID, TT.SITEID, TT.NOMBREDELSITIO  
        FROM WV_REPORT_TIC_CORR_TELEG TT
        INNER JOIN VW_SITIOS_GO_REPORTTELEGRAM TG ON (TT.SITEID = TG.SITEID)
        WHERE TT.TICKETID LIKE VSITE OR TG.ID2GFINAL LIKE '%' || UPPER(VSITE) || '%'
    )
    LOOP
        -- Pipe each ticket record as a row in the output
        PIPE ROW (TY_LIST_TICK_PROJECT(V_REC.SITEID, V_REC.TICKETID, V_REC.NOMBREDELSITIO));
    END LOOP;

    RETURN; -- End of function
END FN_LIST_TICK_PROJECT_CORR_GO;

--------------------------------------------------------
-- FUNCTION FN_LIST_TICK_PROJECT_MGP_GOPDF
-- Description: Retrieves and formats ticket details for PDF generation from WV_REPORT_TIC_MGP_TELEG.
-- Parameters:
--   @param {VARCHAR2} VTICKET: Ticket ID to filter records.
-- Return Type: TTY_LIST_TICK_PROJECT
--------------------------------------------------------
FUNCTION FN_LIST_TICK_PROJECT_MGP_GOPDF (VTICKET IN VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED AS 
BEGIN
    -- Query to fetch ticket details for a specific ticket ID and format for PDF
    FOR V_REC IN (
        SELECT TICKETID, SITEID, REPLACE(ID2GFINAL || '_' || NOMBREDELSITIO, ' ', '_') AS NOMBREDELSITIO 
        FROM WV_REPORT_TIC_MGP_TELEG 
        WHERE SITEID IN (SELECT SITEID FROM VW_SITIOS_GO_REPORTTELEGRAM WHERE TICKETID = VTICKET)
        ORDER BY TICKETID DESC
    )
    LOOP
        -- Pipe each formatted ticket record as a row in the output
        PIPE ROW (TY_LIST_TICK_PROJECT(V_REC.SITEID, V_REC.TICKETID, V_REC.NOMBREDELSITIO));
    END LOOP;

    RETURN; -- End of function
END FN_LIST_TICK_PROJECT_MGP_GOPDF;

--------------------------------------------------------
-- FUNCTION FN_LIST_TICK_PROJECT_CORR_GPDF
-- Description: Similar to FN_LIST_TICK_PROJECT_MGP_GOPDF, but for tickets from WV_REPORT_TIC_CORR_TELEG.
-- Parameters:
--   @param {VARCHAR2} VTICKET: Ticket ID to filter records.
-- Return Type: TTY_LIST_TICK_PROJECT
--------------------------------------------------------
FUNCTION FN_LIST_TICK_PROJECT_CORR_GPDF (VTICKET IN VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED AS 
BEGIN
    -- Query to fetch and format ticket details for a specific ticket ID from the CORR view
    FOR V_REC IN (
        SELECT TICKETID, SITEID, REPLACE(ID2GFINAL || '_' || NOMBREDELSITIO, ' ', '_') AS NOMBREDELSITIO 
        FROM WV_REPORT_TIC_CORR_TELEG 
        WHERE SITEID IN (SELECT SITEID FROM VW_SITIOS_GO_REPORTTELEGRAM WHERE TICKETID = VTICKET)
        ORDER BY TICKETID DESC
    )
    LOOP
        -- Pipe each formatted ticket record as a row in the output
        PIPE ROW (TY_LIST_TICK_PROJECT(V_REC.SITEID, V_REC.TICKETID, V_REC.NOMBREDELSITIO));
    END LOOP;

    RETURN; -- End of function
END FN_LIST_TICK_PROJECT_CORR_GPDF;

--------------------------------------------------------
-- FUNCTION FN_LIST_TICK_PROJECT_ABAS_GPDF
-- Description: Similar to FN_LIST_TICK_PROJECT_MGP_GOPDF, but for tickets from WV_REPORT_TIC_ABAS_TELEG.
-- Parameters:
--   @param {VARCHAR2} VTICKET: Ticket ID to filter records.
-- Return Type: TTY_LIST_TICK_PROJECT
--------------------------------------------------------
FUNCTION FN_LIST_TICK_PROJECT_ABAS_GPDF (VTICKET IN VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED AS 
BEGIN
    -- Query to fetch and format ticket details for a specific ticket ID from the ABAS view
    FOR V_REC IN (
        SELECT TICKETID, IDNODO, REPLACE(ID2GFINAL || '_' || NOMBREDELSITIO, ' ', '_') AS NOMBREDELSITIO 
        FROM WV_REPORT_TIC_ABAS_TELEG 
        WHERE IDNODO IN (SELECT IDNODO FROM VW_SITIOS_GO_REPORTTELEGRAM WHERE TICKETID = VTICKET)
        ORDER BY TICKETID DESC
    )
    LOOP
        -- Pipe each formatted ticket record as a row in the output
        PIPE ROW (TY_LIST_TICK_PROJECT(V_REC.IDNODO, V_REC.TICKETID, V_REC.NOMBREDELSITIO));
    END LOOP;

    RETURN; -- End of function
END FN_LIST_TICK_PROJECT_ABAS_GPDF;

--------------------------------------------------------
-- PROCEDURES

--------------------------------------------------------
-- PROCEDURE PROC_INSERT_USER_TELEGRAM
-- Description: Inserts a new user into the TBL_USER_TELEGRAM table.
-- Parameters:
--   @param {TBL_USER_TELEGRAM.USER_ID%TYPE} VUSER_ID: User ID to insert.
--   @param {TBL_USER_TELEGRAM.CELLPHONE%TYPE} VCELLPHONE: User's cellphone number.
--   @param {TBL_USER_TELEGRAM.FIRSTNAME%TYPE} VFIRSTNAME: User's first name.
--------------------------------------------------------
PROCEDURE PROC_INSERT_USER_TELEGRAM 
( VUSER_ID IN TBL_USER_TELEGRAM.USER_ID%TYPE,
  VCELLPHONE IN TBL_USER_TELEGRAM.CELLPHONE%TYPE,
  VFIRSTNAME IN TBL_USER_TELEGRAM.FIRSTNAME%TYPE
) AS 
BEGIN
    -- Insert the user data into TBL_USER_TELEGRAM
    INSERT INTO TBL_USER_TELEGRAM (USER_ID, CELLPHONE, FIRSTNAME) 
    VALUES (VUSER_ID, VCELLPHONE, VFIRSTNAME);
END;

--------------------------------------------------------
-- FUNCTION FN_USER_EXISTS
-- Description: Checks if a user with the specified ID exists in the TBL_USER_TELEGRAM table.
-- Parameters:
--   @param {TBL_USER_TELEGRAM.USER_ID%TYPE} P_USER_ID: User ID to check for existence.
-- Return Type: TTY_EXIST_USER
--------------------------------------------------------
FUNCTION FN_USER_EXISTS(P_USER_ID TBL_USER_TELEGRAM.USER_ID%TYPE) RETURN TTY_EXIST_USER PIPELINED
IS
BEGIN
    -- Query to determine if the user exists and fetch their authorization level
    FOR V_REC IN (
        SELECT CASE WHEN COUNT(user_id) > 0 THEN 'YES' ELSE 'NO' END RESULTADO, NVL(MAX(AUTH), '0') AUTH
        FROM TBL_USER_TELEGRAM
        WHERE user_id = P_USER_ID
    )
    LOOP
        -- Pipe the result indicating if the user exists and their authorization level
        PIPE ROW (TY_EXIST_USER(V_REC.RESULTADO, V_REC.AUTH));
    END LOOP;
    RETURN; -- End of function
END;

END;
/
