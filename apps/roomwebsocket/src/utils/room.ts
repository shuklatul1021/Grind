import type { RoomData, RoomUser } from "../types/type.js";

export class Room {
  private roomConfig: RoomData;

  constructor(roomConfig: RoomData) {
    this.roomConfig = roomConfig;
  }

  // ============================================
  // GETTERS
  // ============================================

  get roomId(): string {
    return this.roomConfig.roomId;
  }

  get connectedCount(): number {
    return this.roomConfig.connectedCount;
  }

  getRoomData(): RoomData {
    return this.roomConfig;
  }

  getUser(userId: string): RoomUser | undefined {
    return this.roomConfig.users.find((u) => u.userId === userId);
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================

  addUser(user: RoomUser): void {
    // Check if user already exists
    const existingUser = this.getUser(user.userId);
    if (existingUser) {
      console.warn(`User ${user.userId} already exists in room ${this.roomId}`);
      return;
    }

    this.roomConfig.users.push(user);
    console.log(` User ${user.userId} added to room ${this.roomId}`);
  }

  removeUser(userId: string): boolean {
    const initialLength = this.roomConfig.users.length;
    this.roomConfig.users = this.roomConfig.users.filter(
      (u) => u.userId !== userId,
    );

    const removed = this.roomConfig.users.length < initialLength;
    if (removed) {
      console.log(`User ${userId} removed from room ${this.roomId}`);
    }
    return removed;
  }

  incrementConnectedCount(): void {
    this.roomConfig.connectedCount += 1;
  }

  decrementConnectedCount(): void {
    if (this.roomConfig.connectedCount > 0) {
      this.roomConfig.connectedCount -= 1;
    }
  }

  // ============================================
  // ROOM STATE MANAGEMENT
  // ============================================

  startRoom(): void {
    this.roomConfig.roomStatus = "LIVE";
    this.roomConfig.startedAt = Date.now();
    console.log(
      `🚀 Room ${this.roomId} started at ${new Date(this.roomConfig.startedAt).toISOString()}`,
    );
  }

  endRoom(): void {
    this.roomConfig.roomStatus = "ENDED";
    this.roomConfig.endedAt = Date.now();
    console.log(
      `🏁 Room ${this.roomId} ended at ${new Date(this.roomConfig.endedAt).toISOString()}`,
    );
  }

  isWaiting(): boolean {
    return this.roomConfig.roomStatus === "WAITING";
  }

  isLive(): boolean {
    return this.roomConfig.roomStatus === "LIVE";
  }

  isEnded(): boolean {
    return this.roomConfig.roomStatus === "ENDED";
  }

  // ============================================
  // BROADCAST HELPERS
  // ============================================

  getConnectedUsers(): RoomUser[] {
    return this.roomConfig.users.filter((u) => u.isConnected);
  }

  getSubmittedUsers(): RoomUser[] {
    return this.roomConfig.users.filter((u) => u.hasSubmitted);
  }

  getUsersWithViolations(): RoomUser[] {
    return this.roomConfig.users.filter((u) => u.violationCount > 0);
  }

  // ============================================
  // STATISTICS
  // ============================================

  getStats() {
    return {
      totalUsers: this.roomConfig.users.length,
      connectedUsers: this.getConnectedUsers().length,
      submittedUsers: this.getSubmittedUsers().length,
      usersWithViolations: this.getUsersWithViolations().length,
      roomStatus: this.roomConfig.roomStatus,
      duration: this.roomConfig.duration,
      maxGuests: this.roomConfig.maxGuests,
    };
  }
}
