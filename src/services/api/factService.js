import factsData from '../mockData/facts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FactService {
  constructor() {
    this.data = [...factsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const fact = this.data.find(item => item.id === id);
    if (!fact) {
      throw new Error(`Fact with id ${id} not found`);
    }
    return { ...fact };
  }

  async getByLocationId(locationId) {
    await delay(250);
    return this.data
      .filter(fact => fact.locationId === locationId)
      .map(fact => ({ ...fact }));
  }

  async markDiscovered(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Fact with id ${id} not found`);
    }
    
    this.data[index] = { ...this.data[index], discovered: true };
    return { ...this.data[index] };
  }

  async getDiscovered() {
    await delay(200);
    return this.data
      .filter(fact => fact.discovered)
      .map(fact => ({ ...fact }));
  }

  async getByCategory(category) {
    await delay(200);
    return this.data
      .filter(fact => fact.category === category)
      .map(fact => ({ ...fact }));
  }

  async getByObjectId(objectId) {
    await delay(200);
    const fact = this.data.find(item => item.objectId === objectId);
    return fact ? { ...fact } : null;
  }
}

export default new FactService();