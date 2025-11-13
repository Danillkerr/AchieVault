export interface ProfileFromSteam {
  id: string;
  displayName: string;
  photos: [{ value: string }, { value: string }, { value: string }];
}

export interface SteamProfile {
  steamid: string;
  name: string;
  avatar: string;
}
