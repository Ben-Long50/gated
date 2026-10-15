import { Picture } from './picture';

export interface Property {
  id: number;
  name: string;
  description: string;
  picture: Picture;
  gpPrice: number;
  type: 'property' | 'districtUpgrade';
}
