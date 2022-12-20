import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

import Loader from '../shared/Loader';
import RpsActions from './RpsActions';
import RpsPlayer from './RpsPlayer';
import RpsRoom from './RpsRoom';
import RpsStatus from './RpsStatus';
import RpsSubmitButton from './RpsSubmitButton';

export interface RpsRoomDto {
  [address: string]: boolean;
}

interface RpsStateResponseDto {
  status: 'started' | 'finished';
  winners?: string[];
  moves?: {
    [address: string]: Moves;
  };
}

export enum Moves {
  Rock = 1, // 001
  Scissors = 2, // 010
  Paper = 4, // 100
}

let socket: Socket;

const RpsGame = observer(() => {
  const [room, upateRoom] = useState<RpsRoomDto | null>(null);

  const [virtualAddress, setVirtualAddress] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<null | string>(null);
  const [move, setMove] = useState<null | Moves>(null);
  const [status, setStatus] = useState<null | RpsStateResponseDto>(null);

  useEffect(() => {
    socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

    socket.on('connect', () => {
      console.log('connect');
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      if (roomId && virtualAddress) {
        socket.emit('room-leave', { roomId, address: virtualAddress });
      }
    });

    socket.on('room', (data) => {
      console.log('room', data);
      upateRoom(data);
    });

    socket.on('status', (data) => {
      console.log('status', data);
      setStatus(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlayerAuth = (value: string) => {
    setVirtualAddress(value);
  };

  const onRoomSelect = (value: string | null) => {
    if (!value) socket.emit('room-leave', { roomId, address: virtualAddress });
    else socket.emit('room-join', { roomId: value, address: virtualAddress });
    setRoomId(value);
  };

  const onActionSelect = (value: Moves) => {
    if (value) {
      socket.emit('move', {
        roomId,
        address: virtualAddress,
        move: value,
      });
      setMove(value);
    }
  };

  const onRefresh = () => {
    setRoomId(null);
    setMove(null);
    setStatus(null);
    upateRoom(null);
  };

  return (
    <div className="m-auto w-fit flex flex-col items-center">
      <div className="pt-10">
        <RpsPlayer onAuth={onPlayerAuth} />
      </div>
      <div className="pt-10 w-full">
        <RpsRoom onSelect={onRoomSelect} room={room} />
      </div>
      {room && Object.keys(room).length > 1 ? (
        <>
          <div className="pt-10">
            <RpsActions onSelect={onActionSelect} />
          </div>
          <div className="pt-10">
            {status && status.status === 'finished' ? (
              <RpsStatus
                winners={status.winners}
                playerAddress={virtualAddress!}
                onRefresh={onRefresh}
              />
            ) : move || (status && status.status === 'started') ? (
              <Loader />
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
});

export default RpsGame;
