const AxiosCodeGen = require('swagger-axios-codegen');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const baseURL = process.env.REACT_APP_SWAGGER_URL;

console.log('Swagger Url:', baseURL);

const swaggerPath =
  process.env.REACT_APP_SWAGGER_PATH || '/swagger/v1/swagger.json';
const swaggerFullPath = baseURL + swaggerPath;
const outputDir =
  process.env.REACT_APP_SERVICE_OUTPUT_DIR || 'src/services/api';
const outputFileName =
  process.env.REACT_APP_SERVICE_OUTPUT_FILE_NAME || 'api.service.ts';
const axiosInstanceName = 'axiosInstance';

(async () => {
  try {
    await AxiosCodeGen.codegen({
      methodNameMode: 'path',
      remoteUrl: swaggerFullPath,
      useHeaderParameters: false,
      outputDir: outputDir,
      fileName: outputFileName,
      modelMode: 'interface',
      strictNullChecks: true,
      useCustomerRequestInstance: true,
    });

    const removeLines = (data, lines = []) => {
      return data
        .split('\n')
        .filter((val, idx) => lines.indexOf(idx) === -1)
        .join('\n');
    };

    fs.readFile(outputDir + '/' + outputFileName, 'utf-8', (_, code) => {
      code = `import ${axiosInstanceName} from './api';\n\n${code}`;
      code = code.replace(
        'export const serviceOptions: ServiceOptions = {};',
        `export const serviceOptions: ServiceOptions = {\n\taxios: ${axiosInstanceName},\n}`,
      );

      code = removeLines(code, [2, 3, 4, 5, 6, 7, 8]);

      fs.writeFile(outputDir + '/' + outputFileName, code, () => {});
    });
  } catch (error) {
    console.error(error);
  }
})();
