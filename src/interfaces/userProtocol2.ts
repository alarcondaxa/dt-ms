export default interface UserProtocol2 {
  _id: string;
  licensePlate: string;
  renavam: string;
  color: string;
  brand: string;
  modelCar: string;
  modelYear: number;
  manufacturerYear: number;
  fuel: string;
  uf: string;
  tipo: string;
  lastExecutedLicenseYear: number;
  town: string;
  species: string;
  debts: {
    name: string;
    amount: number;
    maturity: string;
    status: string;
  }[];
  createdIn: Date;
}
