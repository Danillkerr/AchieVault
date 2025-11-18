export interface IProfileFromSteam {
  id: string;
  displayName: string;
  photos: [{ value: string }, { value: string }, { value: string }];
}

export interface ISteamProfile {
  steamid: string;
  name: string;
  avatar: string;
}
