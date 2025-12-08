export interface Map {
  id: number;
  user: User;
  userId: number;
  campaign: Campaign;
  campaignId: number;
  picture: Picture;
  draft: boolean;
  name: string;
  description?: string;
  type: MapType;
  width: number;
  height: number;
  baseColor: string;
  layerCount: number;
  layers: Layer[];
  picture: File | null;
  publicId: string;
  locations: Location[];
}

interface Layer {
  name: string;
  id: number;
  hidden: boolean;
  componentCount: number;
  components: Component[];
}

interface Component {
  name: string;
  id: number;
  imageUrl: string;
  width: number;
  height: number;
  imageColStart: number;
  imageRowStart: number;
  mapColStart: number;
  mapRowStart: number;
}

enum MapType {
  map = 'map',
  component = 'component',
}

export interface Location {
  id: number;
  index: number;
  map: Map;
  mapId: number;
  character?: Character;
  characterId?: number;
}
