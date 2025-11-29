export interface ISocialSource {
  getFriendIds(userId: string): Promise<string[]>;
}
export const ISocialSource = Symbol('ISocialSource');
