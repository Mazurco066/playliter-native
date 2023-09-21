// Get uniques on root object
const getUniques = (array: Array<any>, element: string) => array
  .map(item => item[element])
  .filter((value, index, self) => self.indexOf(value) === index)

// Get uniques including a subkey
const getUniquesInside = (array: Array<any>, element1: string, element2: string) => array
  .map(item => item[element1][element2])
  .filter((value, index, self) => self.indexOf(value) === index)

// Get uniques from a typed array
const getUniquesTyped = (array: Array<any>) => array
  .map(item => item)
  .filter((value, index, self) => self.indexOf(value) === index)

// Exporting named
export { getUniquesInside, getUniquesTyped }
export default getUniques
