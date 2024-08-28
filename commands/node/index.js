export const updateLogs = async ({ step, failedStatuses }) => {
  const logDetails = await getLogDetails({ step, failedStatuses })
  const { description, comments } = logDetails
  console.log(description, comments)
}

function getLogDetails({ step, failedStatuses }) {
  failedStatuses = ['FAILED', 'EXPIRED', 'CANCELLED', 'CANCELED']

  const logMapper = {
    77: {
      description: 'Test description',
      comments: 'Test comments',
    },
    78: {
      description: 'Test description',
      comments: 'Test comments',
    },
  }

  return logMapper[step]
}
