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

/**
 * Represents a point that is not attached to any player.
 * @typedef {Object} UnattachedPoint
 * @property {Coordinates} at - The coordinates of the unattached point.
 * @property {number} height - The height of the unattached point.
 */
export type UnattachedPoint = {
  at: Coordinates;
  height: number;
};

/**
 * Represents a floating point that moves from one location to another.
 * @typedef {Object} FloatingPoint
 * @property {UnattachedPoint} from - The starting coordinates of the floating point.
 * @property {UnattachedPoint} to - The ending coordinates of the floating point.
 */
export interface FloatingPoint {
  from: UnattachedPoint;
  to: UnattachedPoint;
}

/**
 * Represents a dissolve point that disappears over time.
 * @typedef {Object} DissolvePoint
 * @property {Coordinates} at - The coordinates of the dissolve point.
 * @property {number} height - The height of the dissolve point.
 */
export type DissolvePoint = UnattachedPoint;

/**
 * Represents an appear point that appears over time.
 * @typedef {Object} AppearPoint
 * @property {Coordinates} at - The coordinates of the appear point.
 * @property {number} height - The height of the appear point.
 */
export type AppearPoint = UnattachedPoint;

/**
 * Represents a heart that disappears over time.
 * @typedef {Object} DissolveHeart
 * @property {PlayerID} owner - The player that owns the dissolve heart.
 */
export interface DissolveHeart {
  owner: PlayerID;
}

/**
 * Represents an executor for a specific action in the game.
 * An executor is responsible for executing an action and managing its effects on the game state.
 * It has methods for starting and committing the execution of the action, as well as for actually executing the action.
 * @typedef {Object} IExecutor
 * @property {function} begin - Begins execution of the action.
 * @property {function} execute - Executes the action.
 * @property {function} commit - Commits the changes made by the action to the game state.
 */
export type IExecutor = {
  begin(): void;
  execute(): Promise<void>;
  commit(): void;
};

/**
 * The GameStore class is used to manage the state of a game.
 */
export default class GameStore {
  /**
   * A log of messages for the game.
   * @type {string[]}
   */
  log: string[] = [];

  /**
   * The data for each player in the game.
   * @type {Record<PlayerID, PlayerData>}
   */
  players: Record<PlayerID, PlayerData> = {};

  /**
   * The current floating points in the game.
   * @type {FloatingPoint[]}
   */
  floatingPoints: FloatingPoint[] = [];

  /**
   * The current dissolve points in the game.
   * @type {DissolvePoint[]}
   */
  dissolvePoints: DissolvePoint[] = [];

  /**
   * The current appear points in the game.
   * @type {AppearPoint[]}
   */
  appearPoints: AppearPoint[] = [];

  /**
   * The current dissolve hearts in the game.
   * @type {DissolveHeart[]}
   */
  dissolveHearts: DissolveHeart[] = [];

  /**
   * The current tracing paths in the game.
   * @type {Array<{uuid: string; from: Coordinates; to: Coordinates; power: number}>}
   */
  tracings: Array<{
    uuid: string;
    from: Coordinates;
    to: Coordinates;
    power: number;
  }> = [];

  /**
   * Gets the current game state.
   * @returns The current game state.
   */
  get state(): GameState {
    return {
      players: this.players,
    };
  }

  /**
   * Resets the game state to its initial, empty state.
   */
  reset() {
    this.log = [];
    this.players = {};
    this.floatingPoints = [];
    this.dissolvePoints = [];
    this.appearPoints = [];
    this.dissolveHearts = [];
    this.tracings = [];
  }

  /**
   * Adds a log message to the game state.
   * @param msg - The log message to add.
   */
  addLog(msg: string) {
    this.log.push(msg);
  }

  /**
   * Adds a tracing path between two players to the game state.
   * @param from - The player that the tracing path originates from.
   * @param to - The player that the tracing path leads to.
   * @param power - The power of the tracing path.
   */
  addTracePath(from: PlayerID, to: PlayerID, power: number) {
    this.tracings.push({
      uuid: Math.random().toFixed(32).substring(2),
      from: this.players[from].position,
      to: this.players[to].position,
      power,
    });
  }

  /**
   * Adds a player to the game state.
   * @param playerData - The data for the player to add.
   */
  addPlayer(playerData: PlayerData) {
    this.players[playerData.name] = playerData;
  }

  /**
   * Sets the number of hearts for a player in the game state.
   * @param who - The player to set the number of hearts for.
   * @param hearts - The new number of hearts for the player.
   */
  setPlayerHearts(who: string, hearts: number) {
    this.players[who].hearts = hearts;
  }

  /**
   * Sets the range for a player in the game state.
   * @param who - The player to set the range for.
   * @param range - The new range for the player.
   */
  setPlayerRange(who: string, range: number) {
    this.players[who].range = range;
  }

  /**
   * Adds an appear point to the game state.
   * @param at - The coordinates of the appear point.
   * @param height - The height of the appear point.
   */
  addAppearPoint(at: Coordinates, height: number) {
    this.appearPoints.push({ at, height });
  }

  /**
   * Sets the position for a player in the game state.
   * @param who - The player to set the position for.
   * @param x - The new x-coordinate for the player.
   * @param y - The new y-coordinate for the player.
   */
  setPlayerPosition(who: PlayerID, x: number, y: number) {
    this.players[who].position = { x, y };
  }

  /**
   * Adds a dissolve point to the game state.
   * @param at - The coordinates of the dissolve point.
   * @param height - The height of the dissolve point.
   */
  addDissolvePoint(at: Coordinates, height: number) {
    this.dissolvePoints.push({ at, height });
  }

  /**
   * Adds a floating point to the game state.
   * @param from - The unattached point that the floating point originates from.
   * @param to - The unattached point that the floating point will move to.
   */
  addFloatingPoint(from: UnattachedPoint, to: UnattachedPoint) {
    this.floatingPoints.push({
      from,
      to,
    });
  }

  /**
   * Sets the number of points for a player in the game state.
   * @param who - The player to set the number of points for.
   * @param points - The new number of points for the player.
   */
  setPlayerPoints(who: PlayerID, points: number) {
    this.players[who].points = points;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

/**
 * The BaseExecutor class is an abstract base class for executors of game actions.
 * It provides a framework for implementing executors, and implements common functionality such as managing the execution state.
 * @typeparam T - The type of action that the executor can execute.
 */
abstract class BaseExecutor<T> implements IExecutor {
  /* Whether or not the executor is currently executing an action. */
  private executing: boolean = false;

  /**
   * Creates a new BaseExecutor.
   * @param action - The action to execute.
   * @param state - The game state to apply the action to.
   */
  constructor(protected action: T, protected state: GameStore) {}

  /**
   * Begins execution of the action.
   * This method should be overridden by subclasses to perform any necessary setup for the action.
   */
  abstract begin(): void;

  /**
   * Commits the changes made by the action to the game state.
   * This method should be overridden by subclasses to apply the changes made by the action to the game state.
   */
  abstract commit(): void;

  /**
   * Executes the action.
   * This method should be overridden by subclasses to perform the actual execution of the action.
   * @returns A promise that resolves when the execution of the action is complete.
   */
  async execute() {
    if (this.executing) return;
    this.executing = true;
  }
}

const sleep = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

/**
 * The SpawnExecutor class is an executor for the spawn action.
 * It is responsible for executing a spawn action, which involves creating an appear point in the game state and waiting for it to animate.
 * @typeparam T - The type of action that the executor can execute.
 */
export class SpawnExecutor extends BaseExecutor<SpawnAction> {
  /*
   * Begins execution of the spawn action.
   * This method adds a log message to the game state indicating that the player is being spawned.
   */
  begin(): void {
    this.state.addLog(`Spawn ${this.action.player.name}`);
  }

  /**
   * Executes the spawn action.
   * This method adds an appear point to the game state and waits for it to animate.
   * @returns A promise that resolves when the animation is complete.
   */
  async execute() {
    this.state.addAppearPoint(this.action.place, 0);
    // TODO: wait for spring?
    await sleep(150);
  }

  /**
   * Commits the changes made by the spawn action to the game state.
   * This method adds the player to the game state.
   */
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

/**
 * The ShareExecutor class is an executor for ShareActions.
 * It implements the logic for executing a share action, which involves transferring points from one player to another.
 */
export class ShareExecutor extends BaseExecutor<ShareAction> {
  private senderAfter: number = 0;
  private receiverAfter: number = 0;

  get sender() {
    return this.state.players[this.action.from];
  }
  get receiver() {
    return this.state.players[this.action.to];
  }

  /*
   * Begins execution of the share action.
   * This method adds a log message to the game state indicating that a player is sharing points with another player.
   */
  begin(): void {
    this.state.addLog(
      `${this.action.from} shares ${this.action.amount} to ${this.action.to}`,
    );
    this.senderAfter = this.sender.points - this.action.amount;
    this.receiverAfter = this.receiver.points + this.action.amount;
  }

  /**
   * Executes the share action.
   * This method updates the number of points for the players involved in the action.
   */
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

  /**
   * Commits the changes made by the share action to the game state.
   * This method adds floating points to the game state to show the points being transferred between the players.
   */
  commit(): void {
    this.state.setPlayerPoints(this.sender.name, this.senderAfter);
    this.state.setPlayerPoints(this.receiver.name, this.receiverAfter);
  }
}

/**
 * The FireExecutor class is an executor for FireActions.
 * It implements the logic for executing a fire action, which involves using action points from the attacker
 * and removing hearts from the victim.
 */
export class FireExecutor extends BaseExecutor<FireAction> {
  private healthAfter: number = 0;
  private pointsAfter: number = 0;

  get attacker() {
    return this.state.players[this.action.attacker];
  }
  get victim() {
    return this.state.players[this.action.victim];
  }

  /*
   * Begins execution of the fire action.
   * This method adds a log message to the game state indicating that a player is attacking another player.
   */
  begin(): void {
    this.state.addLog(
      `${this.action.attacker} attacks ${this.action.victim} on ${this.action.amount}`,
    );
    this.pointsAfter = this.attacker.points - this.action.amount;
    this.healthAfter = this.victim.hearts - this.action.amount;
  }

  /**
   * Executes the fire action.
   */
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

  /**
   * Commits the changes made by the fire action to the game state.
   * This method updates the number of action points and hearts for the players involved in the action.
   */
  commit(): void {
    this.state.setPlayerHearts(this.action.victim, this.healthAfter);
    this.state.setPlayerPoints(this.action.attacker, this.pointsAfter);
  }
}

/**
 * The InvestExecutor class is an executor for InvestActions.
 * It implements the logic for executing an invest action,
 * which involves a player investing their points to increase their range.
 */
export class InvestExecutor extends BaseExecutor<InvestAction> {
  private rangeAfter: number = 0;
  private pointsAfter: number = 0;

  get player() {
    return this.state.players[this.action.who];
  }

  /*
   * Begins execution of the invest action.
   * This method adds a log message to the game state indicating that a player is investing their points.
   */
  begin(): void {
    this.state.addLog(
      `${this.action.who} increases range on ${this.action.amount}`,
    );
    this.rangeAfter = this.player.range + this.action.amount;
    this.pointsAfter = this.player.points - this.action.amount;
  }

  /**
   * Executes the invest action.
   * This method updates the number of points and range for the player involved in the action.
   */
  async execute(): Promise<void> {
    let rangeLeft = this.action.amount;
    while (rangeLeft--) {
      this.state.addDissolvePoint(this.player.position, this.player.points);
      this.state.setPlayerPoints(this.action.who, this.pointsAfter + rangeLeft);
      this.state.setPlayerRange(this.action.who, this.rangeAfter - rangeLeft);
      await sleep(150);
    }
  }

  /**
   * Commits the changes made by the invest action to the game state.
   */
  commit(): void {
    this.state.setPlayerRange(this.action.who, this.rangeAfter);
    this.state.setPlayerPoints(this.action.who, this.pointsAfter);
  }
}

/**
 * The MoveExecutor class is an executor for MoveActions.
 * It implements the logic for executing a move action,
 * which involves a player moving to a new position on the game board.
 */
export class MoveExecutor extends BaseExecutor<MoveAction> {
  private distance: number = 0;
  private pointsBefore: number = 0;

  get player() {
    return this.state.players[this.action.who];
  }

  /*
   * Begins execution of the move action.
   * This method adds a log message to the game state indicating that a player is moving.
   */
  begin(): void {
    this.state.addLog(
      `${this.action.who} moves on [${this.action.to.x},${this.action.to.y}]`,
    );
    this.distance = Math.max(
      Math.abs(this.player.position.x - this.action.to.x),
      Math.abs(this.player.position.y - this.action.to.y),
    );
    this.pointsBefore = this.player.points;
  }

  /**
   * Commits the changes made by the move action to the game state.
   * This method adds floating points and dissolve points to the game state
   * to show the player moving and their previous position being dissolved.
   */
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

  /**
   * Executes the move action.
   * This method updates the position of the player involved in the action.
   */
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
