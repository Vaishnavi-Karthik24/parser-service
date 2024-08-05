const rawStoragePath = '/app/data/raw'
const extractorStoragePath = '/app/data/extractor'

const getExtractorStoragePath = (vendor, id, ems) => {
  return `${extractorStoragePath}/${vendor}/${id}/${ems}`
}

module.exports = {
  rawStoragePath,
  getExtractorStoragePath,
}
