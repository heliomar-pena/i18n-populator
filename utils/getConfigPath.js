import { defaultConfigPath } from '../config';
import path from 'path';
const configPath = defaultConfigPath;

const parsePath = (customPath) => {
  return path.join(process.cwd(), customPath);
};

export default { configPath, parsePath };
