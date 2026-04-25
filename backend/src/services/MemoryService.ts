export type MemoryItem = {
  key: string;
  lesson: string;
  approved: boolean;
  containsSensitiveData: boolean;
};

export class MemoryService {
  private memory: MemoryItem[] = [];

  store(item: MemoryItem): boolean {
    if (!item.approved || item.containsSensitiveData) {
      return false;
    }
    this.memory.push(item);
    return true;
  }

  list(): MemoryItem[] {
    return this.memory;
  }
}
