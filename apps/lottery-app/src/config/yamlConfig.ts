import path from "path";

// const config = require('config')
import config from 'config'
const yaml = require('yaml');
const fs = require('fs');
const sourceDir = path.join(__dirname,"..",'..',"/env/");

if(process.env.NODE_ENV === "dev"){
    const copyAssets = require("../../../../../scripts/copyYaml")
}
const yamlInit = ()=>{
    const defaultYml = "application.yml";
    const envYml = `application-${process.env.NODE_ENV}.yml`
    let defaultPath = sourceDir+defaultYml
    let envPath = sourceDir+envYml
    console.log("defaultPath",defaultPath,envPath)
    if (fs.existsSync(defaultPath) || fs.existsSync(envPath)) {
        const fileBuffer = fs.readFileSync(defaultPath);
        const configFile = yaml.parse(fileBuffer.toString());
        let configObj = config.util.extendDeep({}, configFile);

        const envFileBuffer = fs.readFileSync(envPath);
        const envConfigFile = yaml.parse(envFileBuffer.toString());

        configObj = config.util.extendDeep(configObj, envConfigFile);
        config.util.setModuleDefaults("data",configObj)
        return configObj
    }else{
        throw new Error("配置文件缺失")
    }
}
export default yamlInit()
