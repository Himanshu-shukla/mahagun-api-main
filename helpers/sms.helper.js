import axios from "axios";

const sendOTPUrl = "https://api.msg91.com/api/v5/otp";
const verifyOTPUrl = "https://api.msg91.com/api/v5/otp/verify";
const resendOTPUrl = "https://api.msg91.com/api/v5/otp/retry";

const authkey = "389067AkrQVWBYl263cc0681P1";

const SendOTP = async (mobile) => {
  let params = {
    authkey,
    template_id: "63e76b4dd6fc053ea07d2ec3",
    // template_id: "1007057628377608805",
    mobile: "91" + mobile,
    otp_length: 6,
  };

  try {
    await axios.get(sendOTPUrl, { params });

    return { code: 200, msg: "OTP sent on phone" };
  } catch (error) {
    return { code: 400, msg: error };
  }
};

const VerifyPhoneOTP = async (mobile, otp) => {
  let params = {
    mobile: "91" + mobile,
    otp,
    authkey,
  };

  try {
    await axios.post(verifyOTPUrl, {}, { params });

    return true;
  } catch (error) {
    return false;
  }
};

const ResendPhoneOTP = async (mobile) => {
  let params = {
    authkey,
    mobile: "91" + mobile,
    retrytype: "text",
  };

  try {
    await axios.post(resendOTPUrl, {}, { params });

    return { code: 200, msg: "OTP re-sent successfully" };
  } catch (error) {
    return { code: 400, msg: error };
  }
};

export { SendOTP, VerifyPhoneOTP, ResendPhoneOTP };
