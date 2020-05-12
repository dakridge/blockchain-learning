// Dependencies
import os from "os";
import publicIP from "public-ip";

const getIPAddress = () => {
  // await publicIp.v4()

  const ifaces = os.networkInterfaces();
  let address = null;

  Object.keys(ifaces).forEach((dev) => {
    ifaces[dev].filter((details) => {
      if (details.family === "IPv4" && details.internal === false) {
        address = details.address;
        return;
      }
    });
  });

  return address;
};

export default getIPAddress;
