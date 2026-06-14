export default interface UserProtocol {
  _id: string;
  plate: string;
  renavam: string;
  chassi: string;
  motor: string;
  color: string;
  fabricationYear: string;
  modelYear: string;
  modelCar: string;
  expDoc: string;
  licensingStatus: string;
  city: string;
  crlvDigital: string;
  category: string;
  observations: string[];
  licensing?: {
    label: string;
    value: number;
  };
  finesDebts: {
    value: number;
    label: string;
  }[];
  ipvaDebts: {
    value: number;
    label: string;
  }[];
  createdIn: Date;
}
