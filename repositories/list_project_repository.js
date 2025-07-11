/**
 * Imports libraries and repositories 
 */
const Repository = require("./repository");
const { download } = require('../helpers/helper');


class ListProjectsRepository extends Repository{
//---------------------------------------------------
/**
 * Retrieves and formats a list of all projects from the database.
 *
 * @returns {Promise<Array<Array<Object>>>} - A promise that resolves to an array of formatted project information.
 */
async  getListProject() {
  try {
    // Call the tableFunction to get the list of projects
    const result = await this.tableFunction("PKG_GO_REPORT.FN_LIST_PROJECT_GO");

    // Initialize an empty array to hold the formatted results
    const results = [];

    // Iterate over the rows from the result and format them
    result.rows.forEach((item) => {
      results.push([
        {
          text: item.NOMBRE_PROYECTO,
          callback_data: item.NOMBRE_PROYECTO
        }
      ]);
    });

    // Return the formatted results
    return results;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error in getListProject:', error.message);
    // Optionally, return an empty array or handle the error as needed
    return [];
  }
}

//---------------------------------------------------
/**
 * Retrieves and formats a list of tickets from the 'Preventivo' project.
 *
 * @param {string} Site - The site identifier or project name used to search for tickets.
 * @returns {Promise<Array<Array<Object>>>} - A promise that resolves to an array of formatted ticket information.
 */
async  getListTicketsPrev(Site) {
  try {
    // Call the tableFunction to get the list of tickets
    const result = await this.tableFunction("PKG_GO_REPORT.FN_LIST_TICK_PROJECT_GO", [Site]);

    // Initialize an empty array to hold the formatted results
    const results = [];

    // Iterate over the rows from the result and format them
    result.rows.forEach((item) => {
      results.push([
        {
          text: `${item.TICKET} - ${item.NOMBREDELSITIO}`,
          callback_data: String(item.TICKET)
        }
      ]);
    });

    // Return the formatted results
    return results;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error in getListTicketsPrev:', error.message);
    // Optionally, return an empty array or handle the error as needed
    return [];
  }
}

//---------------------------------------------------
/**
 * Retrieves and formats a list of tickets from the 'Abastecimiento' project.
 *
 * @param {string} Site - The site identifier or project name used to search for tickets.
 * @returns {Promise<Array<Array<Object>>>} - A promise that resolves to an array of formatted ticket information.
 */
async  getListTicketsAbas(Site) {
  try {
    // Call the tableFunction to get the list of tickets
    const result = await this.tableFunction("PKG_GO_REPORT.FN_LIST_TICK_PROJECT_ABAS_GO", [Site]);

    // Initialize an empty array to hold the formatted results
    const results = [];

    // Iterate over the rows from the result and format them
    result.rows.forEach((item) => {
      results.push([
        {
          text: `${item.TICKET} - ${item.NOMBREDELSITIO}`,
          callback_data: String(item.TICKET)
        }
      ]);
    });

    // Return the formatted results
    return results;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error in getListTicketsAbas:', error.message);
    // Optionally, return an empty array or handle the error as needed
    return [];
  }
}

//---------------------------------------------------
/**
 * Retrieves and formats a list of tickets from the 'MGP-Motor Generador' project.
 *
 * @param {string} Site - The site identifier or project name used to search for tickets.
 * @returns {Promise<Array<Array<Object>>>} - A promise that resolves to an array of formatted ticket information.
 */

async  getListTicketsMGP(Site) {
  try {
    // Call the tableFunction to get the list of tickets
    const result = await this.tableFunction("PKG_GO_REPORT.FN_LIST_TICK_PROJECT_MGP_GO", [Site]);

    // Initialize an empty array to hold the formatted results
    const results = [];

    // Iterate over the rows from the result and format them
    result.rows.forEach((item) => {
      results.push([
        {
          text: `${item.TICKET} - ${item.NOMBREDELSITIO}`,
          callback_data: String(item.TICKET)
        }
      ]);
    });

    // Return the formatted results
    return results;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error in getListTicketsMGP:', error.message);
    // Optionally, return an empty array or handle the error as needed
    return [];
  }
}
//---------------------------------------------------
/**
 * Retrieves and formats a list of tickets from the 'Correctivo' project.
 *
 * @param {string} Site - The site identifier or project name used to search for tickets.
 * @returns {Promise<Array<Array<Object>>>} - A promise that resolves to an array of formatted ticket information.
 */

async getListTicketsCORR(Site) {

  try{
      let result = await this.tableFunction("PKG_GO_REPORT.FN_LIST_TICK_PROJECT_CORR_GO",[Site]);

     // Initialize an empty array to hold the formatted results
      const results = [];

      result.rows.forEach((item) => (
      results.push([
                    { text: `${item.TICKET} - ${item.NOMBREDELSITIO}`, 
                      callback_data:String(item.TICKET) 
                    }
                  ])
     ));

    return results;

  }catch( error ){
    console.error('Error in getListTicketsCORR:', error.message);
    return [];
  }

}
//---------------------------------------------------
/**
 * Downloads a PDF file from the specified URL and saves it to the specified path with the given filename.
 * 
 * @param {string} url - The URL of the PDF file to download.
 * @param {string} path - The folder path where the document will be saved.
 * @param {string} filename - The name of the document file.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the download was successful, or false if there was an error.
 */
async Downloadpdf(url, path, filename, postData) {
  try {
    const result = await download(url, path, filename, postData);
    return result;
  } catch (error) {
    console.error('Error in Downloadpdf:', error.message);
    return false; // Return false if there's an error
  }
}
//---------------------------------------------------
/**
 * Registers a new user by calling a stored procedure.
 *
 * @param {Object} user - The user information to register.
 * @param {number} user.user_id - The user's unique ID.
 * @param {string} user.cellphone - The user's cellphone number.
 * @param {string} user.firstname - The user's first name.
 * @returns {Promise<void>} - A promise that resolves when the user is successfully registered.
 */
async  register_user(user) {
  try {
    // Call the stored procedure to register the user
    await this.storedProcedure("PKG_GO_REPORT.PROC_INSERT_USER_TELEGRAM", [
      user.user_id,
      user.cellphone,
      user.firstname,
    ]);
  } catch (error) {
    // Handle any errors that occurred during the registration process
    console.error('Error registering user:', error.message);
    // Optionally, throw an error or handle it as needed
    throw new Error('User registration failed');
  }
}

//---------------------------------------------------
/**
 * Checks if a user exists by calling a table function.
 *
 * @param {Object} user - The user information to check.
 * @param {number} user.user_id - The user's unique ID.
 * @returns {Promise<Object|null>} - A promise that resolves to the user data if the user exists, or null if the user does not exist.
 */
async  getExistsUser(user) {
  try {
    // Call the table function to check if the user exists
    const result = await this.tableFunction("PKG_GO_REPORT.FN_USER_EXISTS", [user]);

    // Return the first row of the result, or null if no user is found
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error checking if user exists:', error.message);
    // Optionally, throw an error or handle it as needed
    throw new Error('Error checking user existence');
  }
}

//---------------------------------------------------
/**
 * Retrieves and formats ticket details for the 'MGP' project, and constructs a string based on ticket information.
 *
 * @param {string} ticket - The ticket identifier to retrieve details for.
 * @returns {Promise<string|null>} - A promise that resolves to a formatted string with ticket details, or null if no details are found.
 */
async  getListTicketsMGPFile(ticket) {
  try {
    // Call the table function to get the list of ticket details
    const result = await this.tableFunction("PKG_GO_REPORT.FN_LIST_TICK_PROJECT_MGP_GOPDF", [ticket]);

    // Initialize the results variable
    let results = null;

    // Check if there are any rows in the result
    if (result.rows.length > 0) {
      // Format the first item into a string
      const item = result.rows[0];
      results = `${item.TICKET}_${item.NOMBREDELSITIO}`;
    }

    // Return the formatted results
    return results;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error retrieving ticket details:', error.message);
    // Optionally, throw an error or handle it as needed
    throw new Error('Error retrieving ticket details');
  }
}

//---------------------------------------------------
/**
 * Retrieves and formats ticket details for the 'CORR' project, and constructs a string based on ticket information.
 *
 * @param {string} ticket - The ticket identifier to retrieve details for.
 * @returns {Promise<string|null>} - A promise that resolves to a formatted string with ticket details, or null if no details are found.
 */
async  getListTicketsCORRFile(ticket) {
  try {
    // Call the table function to get the list of ticket details
    const result = await this.tableFunction("PKG_GO_REPORT.FN_LIST_TICK_PROJECT_CORR_GPDF", [ticket]);

    // Initialize the results variable
    let results = null;

    // Check if there are any rows in the result
    if (result.rows.length > 0) {
      // Format the first item into a string
      const item = result.rows[0];
      results = `${item.TICKET}_${item.NOMBREDELSITIO}`;
    }

    // Return the formatted results
    return results;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error retrieving ticket details for CORR project:', error.message);
    // Optionally, throw an error or handle it as needed
    throw new Error('Error retrieving ticket details for CORR project');
  }
}

//---------------------------------------------------
/**
 * Retrieves and formats ticket details for the 'Abas' project, and constructs a string based on ticket information.
 *
 * @param {string} ticket - The ticket identifier to retrieve details for.
 * @returns {Promise<string|null>} - A promise that resolves to a formatted string with ticket details, or null if no details are found.
 */
async  getListTicketsAbasFile(ticket) {
  try {
    // Call the table function to get the list of ticket details
    const result = await this.tableFunction("PKG_GO_REPORT.FN_LIST_TICK_PROJECT_ABAS_GPDF", [ticket]);

    // Initialize the results variable
    let results = null;

    // Check if there are any rows in the result
    if (result.rows.length > 0) {
      // Format the first item into a string
      const item = result.rows[0];
      results = `${item.TICKET}_${item.NOMBREDELSITIO}`;
    }

    // Return the formatted results
    return results;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error retrieving ticket details for Abas project:', error.message);
    // Optionally, throw an error or handle it as needed
    throw new Error('Error retrieving ticket details for Abas project');
  }
}

//---------------------------------------------------
}

module.exports = ListProjectsRepository;