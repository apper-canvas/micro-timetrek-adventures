import challengesData from '../mockData/challenges.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ChallengeService {
  constructor() {
    this.data = [...challengesData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const challenge = this.data.find(item => item.id === id);
    if (!challenge) {
      throw new Error(`Challenge with id ${id} not found`);
    }
    return { ...challenge };
  }

  async getByLocationId(locationId) {
    await delay(250);
    return this.data
      .filter(challenge => challenge.locationId === locationId)
      .map(challenge => ({ ...challenge }));
  }

  async markCompleted(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Challenge with id ${id} not found`);
    }
    
    this.data[index] = { ...this.data[index], completed: true };
    return { ...this.data[index] };
  }

  async getCompleted() {
    await delay(200);
    return this.data
      .filter(challenge => challenge.completed)
      .map(challenge => ({ ...challenge }));
  }

  async reset(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Challenge with id ${id} not found`);
    }
    
    this.data[index] = { ...this.data[index], completed: false };
    return { ...this.data[index] };
  }
}

export default new ChallengeService();