export const getUnixTimeOneDayBeforeCurrent = async () => {
  // Get current Unix time in milliseconds
  var currentTimeMillis = Date.now();

  // Calculate milliseconds in one day
  var oneDayMillis = 24 * 60 * 60 * 1000; // 24 hours * 60 mins * 60 secs * 1000 ms

  // Subtract one day's worth of milliseconds from current time
  var oneDayBeforeMillis = currentTimeMillis - oneDayMillis;

  // Convert milliseconds to seconds (Unix time is in seconds)
  var oneDayBeforeUnix = Math.floor(oneDayBeforeMillis / 1000);

  return oneDayBeforeUnix;
};

export const getUnixTimeOneMonthBeforeCurrent = async () => {
  // Get current Unix time in milliseconds
  var currentTimeMillis = Date.now();

  // Get current date
  var currentDate = new Date(currentTimeMillis);

  // Calculate one month ago
  currentDate.setMonth(currentDate.getMonth() - 1);

  // Get Unix time for one month ago (in seconds)
  var oneMonthBeforeUnix = Math.floor(currentDate.getTime() / 1000);

  return oneMonthBeforeUnix;
};

export const getUnixTimeOneYearBeforeCurrent = async () => {
  // Get current Unix time in milliseconds
  var currentTimeMillis = Date.now();

  // Get current date
  var currentDate = new Date(currentTimeMillis);

  // Calculate one year ago
  currentDate.setFullYear(currentDate.getFullYear() - 1);

  // Get Unix time for one year ago (in seconds)
  var oneYearBeforeUnix = Math.floor(currentDate.getTime() / 1000);

  return oneYearBeforeUnix;
};

export const calculatePercentage = async (currentPrice, priceAgo) => {
  const percentageChange = ((currentPrice - priceAgo) / priceAgo) * 100;
  // // console.log(percentageChange);
  return percentageChange;
};
