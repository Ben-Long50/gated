import { Picture } from './picture.js';

export type Property = {
  id: number;
  name: string;
  description: string;
  picture: Picture;
  gpPrice: number;
  type: 'property' | 'districtUpgrade';
};
