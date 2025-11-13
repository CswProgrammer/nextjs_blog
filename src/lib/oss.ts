import OSS from "ali-oss";

export const ossClient = new OSS({
  // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || "",
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || "",
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: "oss-ap-southeast-1",
  // yourBucketName填写Bucket名称。
  bucket: "ai20251023",
});
