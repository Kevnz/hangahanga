onmessage = function(e) {
  console.info('Worker: Message received from main script', JSON.stringify(e))
  const result = e.data[0] * e.data[1]
  if (e.data[0] === 0 && e.data[1] === 0) {
    throw new Error('Be better than that')
  }
  if (isNaN(result)) {
    postMessage('Please write two numbers')
  } else {
    console.info('Worker: Posting message back to main script')
    postMessage(result)
  }
}
