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
  layout: {
    i: string;
    w: number;
    h: number;
    x: number;
    y: number;
    tileWidth: number;
    tileHeight: number;
    tileUrl: string;
    isDraggable: boolean;
    static: boolean;
  }[];
  locations: Location[];
}

enum MapType {
  location,
  component,
}

export interface Location {
  id: number;
  index: number;
  map: Map;
  mapId: number;
  character?: Character;
  characterId?: number;
}
