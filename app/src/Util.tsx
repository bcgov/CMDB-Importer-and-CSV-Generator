import { json2csv } from "json-2-csv"

export  const getCSV = (input: any) => {
    var after = json2csv([JSON.parse(input)], { expandNestedObjects: true, expandArrayObjects: true})
    return after

  }

export  const getCSVColumns = (input: any) => {
    var header = input.split('\n')[0]
    var asVertical = header.replaceAll(',', ',\n')
    return asVertical
  }