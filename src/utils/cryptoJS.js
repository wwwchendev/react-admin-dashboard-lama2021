import cryptoJS from 'crypto-js';

// 加密
const encrypt = value => {
  const key = cryptoJS.enc.Utf8.parse(import.meta.env.VITE_CRYPTO_SECRET);
  const iv = cryptoJS.enc.Hex.parse('00000000000000000000000000000000'); //固定16bytes IV讓產生的加密密碼是固定的
  const encryptedPassword = cryptoJS.AES.encrypt(value, key, {
    iv: iv,
  }).toString();
  return encryptedPassword;
};

export default { encrypt };
