export default interface RefreshTokenProtocol {
  _id: string;
  refreshToken: string;
  token: string;
  createdIn: Date;
}
