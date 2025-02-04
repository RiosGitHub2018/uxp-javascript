const photoshop = require('photoshop') ;
const { app, core } = photoshop ;
const fs = require('fs') ;
const { localFileSystem } = require('uxp').storage ;
const { entrypoints } = require('uxp') ;
const os = require('os') ;
const homePath = os.homedir() ;

/**
  * Returns path to PSUserConfig.txt
  * @return {string} 
*/
const getPSUserConfigPath = () => {
  const psVersion = require('uxp').host.version ;
  const mainVersion = psVersion.split('.')[0] ;

  const versionTable = {
    '23': '2022', 
    '24': '2023', 
    '25': '2024'
  } ;
  const yyyy = versionTable[mainVersion] ;

  let preferencesPath ;
  if( /darwin/i.test(os.platform()) ) {
    // macOS
    preferencesPath = `${homePath}/Library/Preferences/Adobe Photoshop ${yyyy} Settings` ;
  } else {
    // Windows
    preferencesPath = `${homePath}\\AppData\\Roaming\\Adobe\\Adobe Photoshop ${yyyy}\\Adobe Photoshop ${yyyy} Settings` ;
  }

  const userConfigPath = path.join(preferencesPath, 'PSUserConfig.txt') ;
  return `file:${userConfigPath}` ;
} ;

/**
  * Returns srcPath exists or not
  * @return {boolean} 
*/
const exists = (srcPath) => {
  let res = false ;
  try {
    fs.lstatSync(srcPath) ;
    res = true ;
  } catch(e) {
    // skip
  }

  return res ;
} ;

/**
  * Returns whether or not to warn when script is opened in Photoshop
  * @return {boolean} 
*/
const getWarnRunningScripts = () => {
  let res = true ;

  const userConfigPath = getPSUserConfigPath() ;
  if(exists(userConfigPath)) {
    const configText = fs.readFileSync(userConfigPath, {encoding: 'utf-8'}) ;
    const matchObj = configText.match(/(WarnRunningScripts +)([01])/) ;
    if(matchObj[2]) {
      res = Boolean(Number(matchObj[2])) ;
    }
  }

  return res ;
} ;

/**
  * Set whether or not to warn when script is opened in Photoshop
  * @param {boolean | integer} bool new value
*/
const setWarnRunningScripts = (bool) => {
  const newValue = parseInt(Number(Boolean(bool))).toString() ;

  const userConfigPath = getPSUserConfigPath() ;
  let newText ;
  if(exists(userConfigPath)) {
    const oldText = fs.readFileSync(userConfigPath, {encoding: 'utf-8'}) ;
    const pattern = /(WarnRunningScripts +)([01])/ ;
    if(pattern.test(oldText)) {
      newText = oldText.replace(pattern, `$1${newValue}`) ;
    } else {
      newText = `${oldText}\nWarnRunningScripts ${newValue}` ;
    }
  } else {
    newText = `WarnRunningScripts ${newValue}` ;
  }

  try {
    fs.writeFileSync(userConfigPath, newText, {encoding: 'utf-8'}) ;
  } catch(e) {
    // skip
  }
} ;

/**
  * Execute script file via app.open
  * @param {string} targetPath script path e.g. 'file:/Users/username/Desktop/script.psjs'
*/
const execScriptViaOpen = async (targetPath) => {
  if(getWarnRunningScripts()) {
    // If script warnings are enabled, disable them and require user to restart
    setWarnRunningScripts(false) ;
    app.showAlert('Restart Photoshop once to execute scripts.') ;
  } else {
    const scriptEntry = await localFileSystem.getEntryWithUrl(targetPath) ;
    app.open(scriptEntry) ;
  }
} ;

const main = async () => {
  try {
    await core.executeAsModal(
      async (context) => {
        await execScriptViaOpen( path.join(`file:${homePath}`, 'Desktop', 'alert.psjs') ) ;
      }, 

      {
        'commandName': 'execScriptViaOpen'
      }
    ) ;
  } catch(e) {
    console.log(e) ;
  }
} ;