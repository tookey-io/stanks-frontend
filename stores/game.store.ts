import { makeAutoObservable } from 'mobx';
import {
  Coordinates,
  FireAction,
  GameState,
  InvestAction,
  MoveAction,
  PlayerData,
  PlayerID,
  ShareAction,
  SpawnAction,
} from '../models/game';

export type UnattachedPoint = {
  at: Coordinates;
  height: number;
};

export interface FloatingPoint {
  from: UnattachedPoint;
  to: UnattachedPoint;
}

export type DissolvePoint = UnattachedPoint;

export type AppearPoint = UnattachedPoint;

export interface DissolveHeart {
  owner: PlayerID;
}

export type IExecutor = {
  begin(): void;
  execute(): Promise<void>;
  commit(): void;
};

export default class GameStore {
  log: string[] = [];
  players: Record<PlayerID, PlayerData> = {};
  floatingPoints: FloatingPoint[] = [];
  dissolvePoints: DissolvePoint[] = [];
  appearPoints: AppearPoint[] = [];
  dissolveHearts: DissolveHeart[] = [];
  tracings: Array<{ from: Coordinates; to: Coordinates, power: number }> = [];

  get state(): GameState {
    return {
      players: this.players,
    };
  }

  reset() {
    this.log = [];
    this.players = {};
    this.floatingPoints = [];
    this.dissolvePoints = [];
    this.appearPoints = [];
    this.dissolveHearts = [];
  }

  addLog(msg: string) {
    this.log.push(msg);
  }
  
  addTracePath(from: PlayerID, to: PlayerID, power: number) {
    this.tracings.push({
      from: this.players[from].position,
      to: this.players[to].position,
      power
    });
  }

  addPlayer(playerData: PlayerData) {
    this.players[playerData.name] = playerData;
  }

  setPlayerHearts(who: string, hearts: number) {
    this.players[who].hearts = hearts;
  }

  setPlayerRange(who: string, range: number) {
    this.players[who].range = range;
  }

  addAppearPoint(at: Coordinates, height: number) {
    this.appearPoints.push({ at, height });
  }

  setPlayerPosition(who: PlayerID, x: number, y: number) {
    this.players[who].position = { x, y };
  }

  addDissolvePoint(at: Coordinates, height: number) {
    this.dissolvePoints.push({ at, height });
  }

  addFloatingPoint(from: UnattachedPoint, to: UnattachedPoint) {
    this.floatingPoints.push({
      from,
      to,
    });
  }

  setPlayerPoints(who: PlayerID, points: number) {
    this.players[who].points = points;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

abstract class BaseExecutor<T> implements IExecutor {
  private executing: boolean = false;

  constructor(protected action: T, protected state: GameStore) {}
  abstract begin(): void;
  abstract commit(): void;
  async execute() {
    if (this.executing) return;
    this.executing = true;
  }
}

const sleep = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

export class SpawnExecutor extends BaseExecutor<SpawnAction> {
  begin(): void {
    this.state.addLog(`Spawn ${this.action.player.name}`);
  }

  async execute() {
    this.state.addAppearPoint(this.action.place, 0);
    // TODO: wait for spring?
    await sleep(150);
  }

  commit(): void {
    this.state.addPlayer({
      position: this.action.place,
      range: 2,
      hearts: 3,
      points: 1,
      name: this.action.player.name,
      userpic: this.action.player.userpic,
    });
  }
}

export class ShareExecutor extends BaseExecutor<ShareAction> {
  private senderAfter: number = 0;
  private receiverAfter: number = 0;

  get sender() {
    return this.state.players[this.action.from];
  }
  get receiver() {
    return this.state.players[this.action.to];
  }

  begin(): void {
    this.state.addLog(`${this.action.from} shares ${this.action.amount} to ${this.action.to}`);
    this.senderAfter = this.sender.points - this.action.amount;
    this.receiverAfter = this.receiver.points + this.action.amount;
  }

  async execute() {
    let amountLeft = this.action.amount;

    while (amountLeft--) {
      this.state.addFloatingPoint(
        {
          at: this.sender.position,
          height: this.sender.points,
        },
        {
          at: this.receiver.position,
          height: this.receiver.points + 1,
        },
      );

      this.state.setPlayerPoints(this.sender.name, this.sender.points - 1);
      await sleep(100);
    }
  }

  commit(): void {
    this.state.setPlayerPoints(this.sender.name, this.senderAfter);
    this.state.setPlayerPoints(this.receiver.name, this.receiverAfter);
  }
}

export class FireExecutor extends BaseExecutor<FireAction> {
  private healthAfter: number = 0;
  private pointsAfter: number = 0;

  get attacker() {
    return this.state.players[this.action.attacker];
  }
  get victim() {
    return this.state.players[this.action.victim];
  }
  begin(): void {
    this.state.addLog(`${this.action.attacker} attacks ${this.action.victim} on ${this.action.amount}`);
    this.pointsAfter = this.attacker.points - this.action.amount;
    this.healthAfter = this.victim.hearts - this.action.amount;
  }
  async execute() {
    let shootsLeft = this.action.amount;
    while (shootsLeft--) {
      this.state.addDissolvePoint(this.attacker.position, this.attacker.points);
      this.state.setPlayerPoints(this.attacker.name, this.attacker.points - 1);
      this.state.addTracePath(this.attacker.name, this.victim.name, 2.5);
      await sleep(300);
      this.state.setPlayerHearts(this.victim.name, this.victim.hearts);
    }
  }
  commit(): void {
    this.state.setPlayerHearts(this.action.victim, this.healthAfter);
    this.state.setPlayerPoints(this.action.attacker, this.pointsAfter);
  }
}

export class InvestExecutor extends BaseExecutor<InvestAction> {
  private rangeAfter: number = 0;
  private pointsAfter: number = 0;

  get player() {
    return this.state.players[this.action.who];
  }

  begin(): void {
    this.state.addLog(`${this.action.who} increases range on ${this.action.amount}`);
    this.rangeAfter = this.player.range + this.action.amount;
    this.pointsAfter = this.player.points - this.action.amount;
  }

  async execute(): Promise<void> {
    let rangeLeft = this.action.amount;
    while (rangeLeft--) {
      this.state.addDissolvePoint(this.player.position, this.player.points);
      this.state.setPlayerPoints(this.action.who, this.pointsAfter + rangeLeft);
      this.state.setPlayerRange(this.action.who, this.rangeAfter - rangeLeft);
      await sleep(150);
    }
  }

  commit(): void {
    this.state.setPlayerRange(this.action.who, this.rangeAfter);
    this.state.setPlayerPoints(this.action.who, this.pointsAfter);
  }
}

export class MoveExecutor extends BaseExecutor<MoveAction> {
  private distance: number = 0;
  private pointsBefore: number = 0;

  get player() {
    return this.state.players[this.action.who];
  }

  begin(): void {
    this.state.addLog(`${this.action.who} moves on [${this.action.to.x},${this.action.to.y}]`);
    this.distance = Math.max(
      Math.abs(this.player.position.x - this.action.to.x),
      Math.abs(this.player.position.y - this.action.to.y),
    );
    this.pointsBefore = this.player.points;
  }

  commit(): void {
    this.state.setPlayerPoints(
      this.action.who,
      this.pointsBefore - this.distance,
    );
    this.state.setPlayerPosition(
      this.action.who,
      this.action.to.x,
      this.action.to.y,
    );
  }

  async execute(): Promise<void> {
    await super.execute();

    let distanceLeft = this.distance;
    while (distanceLeft) {
      let signX = Math.sign(this.action.to.x - this.player.position.x);
      let signY = Math.sign(this.action.to.y - this.player.position.y);
      this.state.addDissolvePoint(this.player.position, this.player.points);
      this.state.setPlayerPoints(this.action.who, this.player.points - 1);
      this.state.setPlayerPosition(
        this.action.who,
        this.player.position.x + signX,
        this.player.position.y + signY,
      );
      distanceLeft--;

      // TODO: wait for spring?
      await sleep(500);
    }
  }
}
