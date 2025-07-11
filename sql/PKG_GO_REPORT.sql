--------------------------------------------------------
--  File created - Monday-August-05-2024   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Package PKG_GO_REPORT
--------------------------------------------------------

CREATE OR REPLACE PACKAGE "GOREPORTTELEGRAM"."PKG_GO_REPORT" AS 

  /* 
   * TODO: Enter package declarations (types, exceptions, methods, etc.) here 
   */

  -- FUNCTIONS

  --------------------------------------------------------
  -- FUNCTION FN_LIST_PROJECT_GO
  -- Description: Returns a pipelined list of projects from the view VW_PROYECTOS_GOREPORT.
  -- @return {TTY_LIST_PROJECT} List of project records.
  --------------------------------------------------------
  FUNCTION FN_LIST_PROJECT_GO RETURN TTY_LIST_PROJECT PIPELINED ;

  --------------------------------------------------------
  -- FUNCTION FN_LIST_TICK_PROJECT_GO
  -- Description: Lists tickets related to a site from WV_REPORT_TIC_PREV_TELEG, joining with VW_SITIOS_GO_REPORTTELEGRAM.
  -- @param {VARCHAR2} VSITE: Site information to filter the tickets.
  -- @return {TTY_LIST_TICK_PROJECT} List of ticket records.
  --------------------------------------------------------
  FUNCTION FN_LIST_TICK_PROJECT_GO(VSITE VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED ;

  --------------------------------------------------------
  -- FUNCTION FN_LIST_TICK_PROJECT_ABAS_GO
  -- Description: Lists project tickets from WV_REPORT_TIC_ABAS_TELEG based on site.
  -- @param {VARCHAR2} VSITE: Site information to filter the tickets.
  -- @return {TTY_LIST_TICK_PROJECT} List of ticket records.
  --------------------------------------------------------
  FUNCTION FN_LIST_TICK_PROJECT_ABAS_GO(VSITE VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED ;

  --------------------------------------------------------
  -- FUNCTION FN_LIST_TICK_PROJECT_ABAS_GPDF
  -- Description: Retrieves and formats ticket details for PDF generation from WV_REPORT_TIC_ABAS_TELEG.
  -- @param {VARCHAR2} VTICKET: Ticket ID to filter records.
  -- @return {TTY_LIST_TICK_PROJECT} List of formatted ticket records.
  --------------------------------------------------------
  FUNCTION FN_LIST_TICK_PROJECT_ABAS_GPDF(VTICKET VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED ;

  --------------------------------------------------------
  -- FUNCTION FN_LIST_TICK_PROJECT_MGP_GO
  -- Description: Lists project tickets from WV_REPORT_TIC_MGP_TELEG based on site.
  -- @param {VARCHAR2} VSITE: Site information to filter the tickets.
  -- @return {TTY_LIST_TICK_PROJECT} List of ticket records.
  --------------------------------------------------------
  FUNCTION FN_LIST_TICK_PROJECT_MGP_GO(VSITE VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED ;

  --------------------------------------------------------
  -- FUNCTION FN_LIST_TICK_PROJECT_MGP_GOPDF
  -- Description: Retrieves and formats ticket details for PDF generation from WV_REPORT_TIC_MGP_TELEG.
  -- @param {VARCHAR2} VTICKET: Ticket ID to filter records.
  -- @return {TTY_LIST_TICK_PROJECT} List of formatted ticket records.
  --------------------------------------------------------
  FUNCTION FN_LIST_TICK_PROJECT_MGP_GOPDF(VTICKET VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED ;

  --------------------------------------------------------
  -- FUNCTION FN_LIST_TICK_PROJECT_CORR_GO
  -- Description: Lists tickets from WV_REPORT_TIC_CORR_TELEG based on site.
  -- @param {VARCHAR2} VSITE: Site information to filter the tickets.
  -- @return {TTY_LIST_TICK_PROJECT} List of ticket records.
  --------------------------------------------------------
  FUNCTION FN_LIST_TICK_PROJECT_CORR_GO(VSITE VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED ;

  --------------------------------------------------------
  -- FUNCTION FN_LIST_TICK_PROJECT_CORR_GPDF
  -- Description: Retrieves and formats ticket details for PDF generation from WV_REPORT_TIC_CORR_TELEG.
  -- @param {VARCHAR2} VTICKET: Ticket ID to filter records.
  -- @return {TTY_LIST_TICK_PROJECT} List of formatted ticket records.
  --------------------------------------------------------
  FUNCTION FN_LIST_TICK_PROJECT_CORR_GPDF(VTICKET VARCHAR2) RETURN TTY_LIST_TICK_PROJECT PIPELINED ;

  --------------------------------------------------------
  -- FUNCTION FN_USER_EXISTS
  -- Description: Checks if a user with the specified ID exists in the TBL_USER_TELEGRAM table.
  -- @param {TBL_USER_TELEGRAM.USER_ID%TYPE} P_USER_ID: User ID to check for existence.
  -- @return {TTY_EXIST_USER} User existence status and authorization level.
  --------------------------------------------------------
  FUNCTION FN_USER_EXISTS(P_USER_ID TBL_USER_TELEGRAM.USER_ID%TYPE) RETURN TTY_EXIST_USER PIPELINED;

  -- STORED PROCEDURES

  --------------------------------------------------------
  -- PROCEDURE PROC_INSERT_USER_TELEGRAM
  -- Description: Inserts a new user into the TBL_USER_TELEGRAM table.
  -- @param {TBL_USER_TELEGRAM.USER_ID%TYPE} VUSER_ID: User ID to insert.
  -- @param {TBL_USER_TELEGRAM.CELLPHONE%TYPE} VCELLPHONE: User's cellphone number.
  -- @param {TBL_USER_TELEGRAM.FIRSTNAME%TYPE} VFIRSTNAME: User's first name.
  --------------------------------------------------------
  PROCEDURE PROC_INSERT_USER_TELEGRAM 
  ( VUSER_ID IN TBL_USER_TELEGRAM.USER_ID%TYPE,
    VCELLPHONE IN TBL_USER_TELEGRAM.CELLPHONE%TYPE,
    VFIRSTNAME IN TBL_USER_TELEGRAM.FIRSTNAME%TYPE
  );

END PKG_GO_REPORT;
/
