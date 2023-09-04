const GetMarketingAttachmentUrl = async (url) => {
  const nameArray = url.split(".com/");

  const key = nameArray[1].replace(/ /g, "+");

  return "https://dv7bokmnhkp6i.cloudfront.net/" + key;
};

export { GetMarketingAttachmentUrl };
