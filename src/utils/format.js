import moment from 'moment-timezone';

//日期時間, 貨幣, 字串長度等
export const numberWithCommas = number => {
  return number.toLocaleString('zh-tw');
};

export const getDateString = _date => {
  const year = _date.getFullYear();
  const month = (_date.getMonth() + 1).toString().padStart(2, '0');
  const date = _date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${date}`;
};

export const getTimeString = _date => {
  const hour = _date.getHours().toString().padStart(2, '0');
  const minute = _date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
};

//將一個指定的ISO日期時間字串'2024-03-15T14:30:00.000Z'，以台北時區的格式'2024/3/15 下午10:30:00'顯示出來。
/*
範例1.將ISO 8601日期格式轉換為台北時區格式
convertToTaipeiTime("2024-03-15T14:30:00.000Z"); //2024/3/15 下午10:30:00
範例2.取得當前日期(ISO 8601格式)轉換為台北格式
const today = new Date() //2024-03-21T05:32:07.230Z
convertToTaipeiTime(today) //2024/3/21 下午1:32:44
*/
export const convertIsoToTaipeiTime = time => {
  if (!(time instanceof Date)) {
    throw new Error('請提供日期格式參數 new Date()');
  }
  return time.toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

// 將日期物件轉換為 ISO 8601 格式
export const convertDateToIsoTaipei = date => {
  if (!(date instanceof Date)) {
    throw new Error('請提供日期格式參數new Date()');
  }

  const isoDateString = moment(date).tz('Asia/Taipei').format();
  // console.log(isoDateString);
  return isoDateString;
};

// 把時間轉成ISO台北再存進資料庫
export const convertIsoToTaipei = isoString => {
  // 使用 Date 对象解析 ISO 8601 格式的日期时间字符串
  const date = new Date(isoString);
  // 将 UTC 时间减去八个小时（28800000 毫秒）
  const taipeiTime = new Date(
    date.getTime() - 8 * 60 * 60 * 1000,
  ).toISOString();
  return taipeiTime;
};
