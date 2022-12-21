import * as crypto from 'crypto';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

import Loader from '../shared/Loader';
import RpsActions from './RpsActions';
import RpsPlayer from './RpsPlayer';
import RpsResult from './RpsResult';
import RpsRoom from './RpsRoom';

export enum RpsStatus {
  Wait = 'wait',
  Start = 'start',
  Commit = 'commit',
  Reveal = 'reveal',
  Finished = 'finished',
  Fail = 'fail',
}

export interface RpsPlayerDataDto {
  playerId: string;
  commitment?: string;
  choice?: string;
  nonce?: string;
}

export interface RpsRoomDataDto {
  [player: string]: RpsPlayerDataDto;
}

export interface RpsGameState {
  status?: RpsStatus;
  roomId?: string;
  players?: RpsRoomDataDto;
  winners?: string[];
}

export enum Moves {
  Rock = 1, // 001
  Scissors = 2, // 010
  Paper = 4, // 100
}

let socket: Socket;

const RpsGame = observer(() => {
  const [playerId, setPlayerId] = useState<string>();

  const [game, upateGame] = useState<RpsGameState>();
  const [roomId, setRoomId] = useState<string>();
  const [choice, setChoice] = useState<Moves>();
  const [nonce, setNonce] = useState<string>();
  const [status, setStatus] = useState<RpsStatus>();
  const [winners, setWinners] = useState<string[]>();

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

    socket.on('connect', () => {
      console.log('connect');
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      if (roomId && playerId) {
        socket.emit('room-leave', { roomId, playerId });
      }
    });

    socket.on('rps-state', (data: RpsGameState) => {
      console.log('rps-state', data);
      if (!data.status) return reset();
      upateGame(data);
      setStatus(data.status);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('rps-state');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === RpsStatus.Reveal) {
      socket.emit('reveal', {
        roomId,
        playerId,
        choice,
        nonce,
      });
    }
    if (status === RpsStatus.Finished) {
      setWinners(game?.winners);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const onPlayerAuth = (value: string): void => {
    setPlayerId(value);
  };

  const onRoomSelect = (value?: string): void => {
    if (!value) socket.emit('room-leave', { roomId, playerId });
    else socket.emit('room-join', { roomId: value, playerId });
    setRoomId(value);
  };

  const hash = (message: string | number, randomValue: string): string => {
    const hash = crypto.createHash('sha256');
    hash.update(randomValue + message);
    return hash.digest('hex');
  };

  const onActionSelect = (value: Moves): void => {
    if (value) {
      const randomValue = crypto.randomBytes(32).toString('hex');
      const commitment = hash(value, randomValue);
      socket.emit('commit', { roomId, playerId, commitment });
      setChoice(value);
      setNonce(randomValue);
    }
  };

  const reset = () => {
    upateGame(undefined);
    setRoomId(undefined);
    setChoice(undefined);
    setNonce(undefined);
    setStatus(undefined);
    setWinners(undefined);
    socket.emit('room-leave', { roomId, playerId });
  };

  return (
    <div className="m-auto w-fit flex flex-col items-center">
      <div className="pt-10">
        <RpsPlayer onAuth={onPlayerAuth} />
      </div>
      <div className="pt-10 w-full">
        <RpsRoom
          onSelect={onRoomSelect}
          players={game?.players}
          winners={winners}
        />
      </div>
      <RpsActions
        onSelect={onActionSelect}
        visible={game && game.status !== RpsStatus.Wait}
      />
      <RpsResult
        winners={winners}
        playerAddress={playerId!}
        onRefresh={reset}
        visible={game && game.status === RpsStatus.Finished}
      />
      <Loader
        visible={
          game?.status &&
          (game?.status === RpsStatus.Commit ||
            game?.status === RpsStatus.Reveal)
        }
      />
    </div>
  );
});

export default RpsGame;
