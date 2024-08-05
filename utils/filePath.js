export const rawStoragePath = '/app/data/raw'
export const extractorStoragePath = '/app/data/extractor'

export const getExtractorStoragePath = (vendor, id, ems) => {
  return `${extractorStoragePath}/${vendor}/${id}/${ems}`
}
