export class ContentStore {
  async saveContent(item: any) { console.log('Saved', item); }
}
export const contentStore = new ContentStore();
