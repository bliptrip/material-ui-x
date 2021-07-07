import { base64Decode, base64Encode } from './encoding/base64';
import { md5 } from './encoding/md5';
import { LicenseStatus } from './licenseStatus';

export function generateReleaseInfo() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return base64Encode(today.getTime().toString());
}

const expiryReg = /^.*EXPIRY=([0-9]+),.*$/;

export function verifyLicense(releaseInfo: string, encodedLicense: string) {
    return LicenseStatus.Valid;
}
