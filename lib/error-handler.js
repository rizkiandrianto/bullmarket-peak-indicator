function handleError(error, type = 'UNKNOWN_ERROR') {
  const errorMap = {
    SCRAPING_FAILED: {
      message: 'Failed to scrape bull market indicators',
      statusCode: 503,
      retryable: true
    },
    TIMEOUT_ERROR: {
      message: 'Request timeout while scraping data',
      statusCode: 504,
      retryable: true
    },
    NETWORK_ERROR: {
      message: 'Network error occurred',
      statusCode: 502,
      retryable: true
    },
    UNKNOWN_ERROR: {
      message: 'An unexpected error occurred',
      statusCode: 500,
      retryable: false
    }
  };

  const errorInfo = errorMap[type] || errorMap.UNKNOWN_ERROR;
  
  console.error(`[${type}] ${errorInfo.message}:`, error.message);
  
  return {
    type,
    message: errorInfo.message,
    statusCode: errorInfo.statusCode,
    retryable: errorInfo.retryable,
    timestamp: new Date().toISOString(),
    originalError: error.message
  };
}

function createErrorResponse(error, fallbackData = null) {
  return {
    success: false,
    error: {
      type: error.type,
      message: error.message,
      timestamp: error.timestamp
    },
    data: fallbackData,
    meta: {
      cached: !!fallbackData,
      fallback: !!fallbackData
    }
  };
}

module.exports = { handleError, createErrorResponse };