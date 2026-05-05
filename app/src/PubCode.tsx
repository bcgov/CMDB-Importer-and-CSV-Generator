import { json2csv } from "json-2-csv";
import * as yaml from 'js-yaml'

  export const getRawPubCode = async () => {
     const response = await fetch('https://raw.githubusercontent.com/bcgov/pubcode/refs/heads/main/bcgovpubcode.yml');
     const body: any = await response.text()
     console.dir(body)
     return body
  }

export const getJSON = async (input: any) => {
    var after = yaml.load(input)
    return JSON.stringify(after,  null, 2)
  }

