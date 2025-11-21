
const { getConnection, sql } = require('../config/db');

const executeStoredProcedure = async (procedureName, inputParams = {}) => {
  const pool = await getConnection();
  const request = pool.request();

  
  for (const [name, value] of Object.entries(inputParams)) {
    if (value !== undefined && value !== null) {
      request.input(name, value);
    } else {
      request.input(name, sql.NVarChar, null); 
    }
  }

  const result = await request.execute(procedureName);
  return result;
};

module.exports = {
  executeStoredProcedure
};

