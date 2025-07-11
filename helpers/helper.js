
/**
 * 
 * imports libraries 
 * 
 */
const fs = require("fs");
const axios = require('axios');
const path = require('path');

/**
 * @param url string
 * @param folderPath string to folder to save documents 
 * @param filename String , name of the document
 * @returns {Promise<boolean>} true if download the document or false if it was an error 
 */

async function download(url ,folderPath ,filename, postData = null) {

// 2. custom download folder
const fullPath = path.join(folderPath, filename);

// 3. check if the folder exists, if not create it
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath), { recursive: true };
}


try {
    const response = await axios({
      /*method: 'GET',
      url: url,
      responseType: 'stream' // Expect a stream of data*/
      url: url,
      method: postData ? 'POST' : 'GET',
      data: postData,
      responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
      // Create a write stream to the local file
      const writer = fs.createWriteStream(fullPath);

      // Pipe the response to the file
      response.data.pipe(writer);

      writer.on('finish', () => {
        // Download finished successfully
        resolve(true);
      });

      writer.on('error', (error) => {
        // Error during download
        console.error('Error creating document:', error);
        reject(error); // Reject with the error object
      });
    });

} catch (error) {
  console.error('Error downloading the file:', error.message);
  //throw new Error('Error al descargar el archivo PDF: ' + error.message);
  return false; // Return false in case of an error
}

}

module.exports = { download }