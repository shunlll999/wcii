function createReplayCache(ttMs: number) {
  const map = new Map<string, number>();

  function has(id: string): boolean {
    const exp = map.get(id);
    if (!exp || exp < Date.now()) {
      if (exp) {
        map.delete(id);
      }
      return false;
    }
    return true;
  }

  function add(id: string): void {
    map.set(id, Date.now() + ttMs);
  }

  function cleanup(): void {
    const now = Date.now();
    for (const [id, exp] of map.entries()) {
      if (exp < now) map.delete(id);
    }
  }

  return {
    has,
    add,
    cleanup,
  };
}

export { createReplayCache };
