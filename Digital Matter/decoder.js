// Decode an uplink message from an array of bytes to an object of fields
function Decoder(bytes, port)
{
 var decoded = {};
 if (port === 1)
 {
 decoded.type = "position";

 decoded.latitudeDeg = bytes[0] + bytes[1] * 256 +
 bytes[2] * 65536 + bytes[3] * 16777216;
 if (decoded.latitudeDeg >= 0x80000000)
 decoded.latitudeDeg -= 0x100000000;
 decoded.latitudeDeg /= 1e7;

 decoded.longitudeDeg = bytes[4] + bytes[5] * 256 +
 bytes[6] * 65536 + bytes[7] * 16777216;
 if (decoded.longitudeDeg >= 0x80000000)
 decoded.longitudeDeg -= 0x100000000;
 decoded.longitudeDeg /= 1e7;

 decoded.inTrip = ((bytes[8] & 0x1) !== 0) ? true : false;
 decoded.fixFailed = ((bytes[8] & 0x2) !== 0) ? true : false;
 decoded.headingDeg = (bytes[8] >> 2) * 5.625;

 decoded.speedKmph = bytes[9];
 decoded.batV = bytes[10] * 0.025;
 }
 else if (port === 2)
 {
 decoded.type = "downlink ack";

 decoded.sequence = (bytes[0] & 0x7F);
 decoded.accepted = ((bytes[0] & 0x80) !== 0) ? true : false;
 decoded.fwMaj = bytes[1];
 decoded.fwMin = bytes[2];
 }
 else if (port === 3)
 {
 decoded.type = "stats";

 decoded.initialBatV = 4.0 + 0.100 * (bytes[0] & 0xF);
 decoded.txCount = 32 * ((bytes[0] >> 4) + (bytes[1] & 0x7F) * 16);
 decoded.tripCount = 32 * ((bytes[1] >> 7) + (bytes[2] & 0xFF) * 2
 + (bytes[3] & 0x0F) * 512);
 decoded.gpsSuccesses = 32 * ((bytes[3] >> 4) + (bytes[4] & 0x3F) * 16);
 decoded.gpsFails = 32 * ((bytes[4] >> 6) + (bytes[5] & 0x3F) * 4);
 decoded.aveGpsFixS = 1 * ((bytes[5] >> 6) + (bytes[6] & 0x7F) * 4);
 decoded.aveGpsFailS = 1 * ((bytes[6] >> 7) + (bytes[7] & 0xFF) * 2);
 decoded.aveGpsFreshenS = 1 * ((bytes[7] >> 8) + (bytes[8] & 0xFF) * 1);
 decoded.wakeupsPerTrip = 1 * ((bytes[8] >> 8) + (bytes[9] & 0x7F) * 1);
 decoded.uptimeWeeks = 1 * ((bytes[9] >> 7) + (bytes[10] & 0xFF) * 2);
 }
 return decoded;
}
