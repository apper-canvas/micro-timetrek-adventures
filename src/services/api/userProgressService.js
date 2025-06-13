import progressData from '../mockData/userProgress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserProgressService {
  constructor() {
    this.data = { ...progressData };
  }

  async get() {
    await delay(200);
    return { ...this.data };
  }

  async update(updates) {
    await delay(250);
    this.data = { ...this.data, ...updates };
    return { ...this.data };
  }

  async addDiscoveredFact(factId) {
    await delay(200);
    this.data.totalFactsDiscovered = (this.data.totalFactsDiscovered || 0) + 1;
    if (!this.data.achievements.firstDiscovery && this.data.totalFactsDiscovered === 1) {
      this.data.achievements.firstDiscovery = true;
    }
    return { ...this.data };
  }

  async visitLocation(locationId) {
    await delay(200);
    if (!this.data.locationsVisited.includes(locationId)) {
      this.data.locationsVisited.push(locationId);
    }
    this.data.currentLocation = locationId;
    return { ...this.data };
  }

  async completeChallenge(challengeId) {
    await delay(200);
    if (!this.data.challengesCompleted.includes(challengeId)) {
      this.data.challengesCompleted.push(challengeId);
      this.data.totalBadgesEarned = (this.data.totalBadgesEarned || 0) + 1;
      
      if (!this.data.achievements.firstChallenge && this.data.challengesCompleted.length === 1) {
        this.data.achievements.firstChallenge = true;
      }
    }
    return { ...this.data };
  }

  async updateTimeSpent(additionalMinutes) {
    await delay(100);
    this.data.timeSpentExploring = (this.data.timeSpentExploring || 0) + additionalMinutes;
    return { ...this.data };
  }

  async unlockAchievement(achievementKey) {
    await delay(200);
    if (this.data.achievements[achievementKey] !== undefined) {
      this.data.achievements[achievementKey] = true;
    }
    return { ...this.data };
  }

  async reset() {
    await delay(300);
    this.data = { ...progressData };
    return { ...this.data };
  }
}

export default new UserProgressService();