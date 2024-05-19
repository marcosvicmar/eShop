export const authDecode = (authHeader: string) => Buffer.from(authHeader.replaceAll("Basic ", ""), "base64").toString('ascii').split(":");
