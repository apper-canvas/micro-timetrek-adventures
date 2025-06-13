import locationsData from '../mockData/locations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LocationService {
  constructor() {
    this.data = [...locationsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const location = this.data.find(item => item.id === id);
    if (!location) {
      throw new Error(`Location with id ${id} not found`);
    }
    return { ...location };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Location with id ${id} not found`);
    }
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async unlock(id) {
    await delay(200);
    return this.update(id, { unlocked: true });
  }

  async updateProgress(id, progress, discoveredFacts = []) {
    await delay(200);
    return this.update(id, { 
      progress, 
      discoveredFacts: [...discoveredFacts] 
    });
  }

  async getUnlocked() {
    await delay(200);
    return this.data.filter(location => location.unlocked);
  }
}

export default new LocationService();