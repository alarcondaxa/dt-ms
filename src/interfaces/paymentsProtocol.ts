export default interface PaymentsProtocol {
  value: number;
  plate: string;
  renavam: string;
  location: string;
  copied: boolean;
  createdIn: Date;
}
