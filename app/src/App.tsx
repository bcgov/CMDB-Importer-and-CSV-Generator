import { useEffect, useState } from 'react'
import './App.css'
import {  getJSON, getRawPubCode } from './PubCode'
import { getDDSRepos, gretDDSReposCSVColumns } from './Github'
import { getCSV, getCSVColumns } from './Util'
import { getPlatformRegistryItems } from './PlatformRegistry'


function App() {
  // menu items
  const [currentMenuItem, setCurrentMenutItem] = useState('PubCodeYAML')
  const [currentContent, setCurrentContent] = useState('')

  useEffect(()=> {
    setContent(currentMenuItem)
  },[currentMenuItem])

  const pubCodeMenuItems = ['PubCodeYAML','PubCodeJSON', 'PubCodeCSV',  'PubCodeCSVColumns']
  const platformRegistryItems = ['PlatformRegistryItems']
  const githubMenuItems = ['GithubGetDDSRepos', 'GithubFirstRepoCSVColumns']
  const jiraMenuItems = ['JiraGetApp']

  const setContent = async (menuItem: string) => { 
    switch(menuItem)
    {
      case 'PubCodeYAML':
        var pubCodeYaml = await getRawPubCode()
        setCurrentContent(pubCodeYaml)
        break;
      case 'PubCodeJSON':
        var pubCodeYaml = await getRawPubCode()
        var pubCodeJSON = await getJSON(pubCodeYaml) 
        setCurrentContent(pubCodeJSON)
        break
      case 'PubCodeCSV':
        var pubCodeYaml = await getRawPubCode()
        var pubCodeJSON = await getJSON(pubCodeYaml) 
        var PubCodeCSV = await getCSV(pubCodeJSON)
        setCurrentContent(PubCodeCSV)
        break;
      case 'PubCodeCSVColumns':
        var pubCodeYaml = await getRawPubCode()
        var pubCodeJSON = await getJSON(pubCodeYaml) 
        var PubCodeCSV = await getCSV(pubCodeJSON)
        var PubCodeCSVColumns = getCSVColumns(PubCodeCSV)
        setCurrentContent(PubCodeCSVColumns)
        break;
      case 'GithubGetDDSRepos':
        const ddsRepoContent = await getDDSRepos()
        setCurrentContent(ddsRepoContent)
        break;
      case 'GithubFirstRepoCSVColumns':
        const ddsRepoColumnContent = await gretDDSReposCSVColumns()
        setCurrentContent(ddsRepoColumnContent)
        break;
      case 'PlatformRegistryItems':
        const platformRegistryItems = await getPlatformRegistryItems()
        setCurrentContent(platformRegistryItems)
        break
      default: 
        alert('Not implemented')
    }


  }

  // content menu item id + element id
  const MenuButton = (props: any) => {
    return <button id={props.funcID} className={'button'} onClick={()=> setCurrentMenutItem(props.funcID)}>{props.funcID}</button>
  }


  return (
    <>
    <div id="menu">
      <div id="title">DDS CMDB Dev Panel<button id="copybtn" onClick={async () => {
        const text = currentContent; // Get the text content

        try {
            await navigator.clipboard.writeText(text);
            alert('Text copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text.');
        }
    }}>Copy</button></div>
      <div id="pubCodeButtons">
        {pubCodeMenuItems.map(item => <MenuButton funcID={item}/>)}
      </div>
      <br></br>
      <div id="githubButtons">
        {githubMenuItems.map(item => <MenuButton funcID={item}/>)}
      </div>
      <br></br>
      <div id="platformRegistryButtons">
        {platformRegistryItems.map(item => <MenuButton funcID={item}/>)}
      </div>
      <br></br>
      <div id="JiraButtons">
        {jiraMenuItems.map(item => <MenuButton funcID={item}/>)}
      </div>
      <br></br>
    </div>
    <div id="content">
      {currentContent}
    </div>
    </>
  )
}

export default App
