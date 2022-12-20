import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { HiroUserDto } from '../../dto/auth/hiro.dto';
import { useStores } from '../../stores';
import Loader from '../shared/Loader';
import RpsActions from './RpsActions';
import RpsPlayer from './RpsPlayer';
import RpsRoomInput from './RpsRoomInput';
import RpsStatus from './RpsStatus';
import RpsSubmitButton from './RpsSubmitButton';

interface RpsStateResponseDto {
  status: 'created' | 'finished';
  winners?: string[];
  moves?: {
    [playerId: string]: string;
  };
}

export enum Moves {
  Rock = 1, // 001
  Scissors = 2, // 010
  Paper = 4, // 100
}

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/rps`;

const RpsGame = observer(() => {
  const { hiroStore } = useStores();

  const [hiroUser, setHiroUser] = useState<HiroUserDto | null>(null);
  const [roomId, setRoomId] = useState<null | string>(null);
  const [move, setMove] = useState<null | Moves>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitted, submit] = useState(false);
  const [isWaitingForPartner, setWaitingForPartner] = useState(false);
  const [response, setResponse] = useState<null | RpsStateResponseDto>(null);

  const getRandom = () => `${parseInt(`${Math.random() * 9999}`)}`;

  useEffect(() => {
    setHiroUser(hiroStore.getUser());
    setRoomId(getRandom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!canSubmit && hiroUser && roomId && move) setCanSubmit(true);
    else setCanSubmit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hiroUser, roomId, move]);

  useEffect(() => {
    const postMove = async () => {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({
            roomId,
            playerId: hiroUser?.profile.stxAddress.mainnet,
            hash: `${move}`,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) setWaitingForPartner(true);
      } catch (error) {
        console.log('error', error);
      }
    };

    if (isSubmitted && !isWaitingForPartner) postMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  useEffect(() => {
    if (!isWaitingForPartner) return;
    const getResult = async () => {
      try {
        const params = new URLSearchParams();
        params.set('roomId', roomId!);
        params.set('playerId', hiroUser?.profile.stxAddress.mainnet!);
        const res = await fetch(`${API_URL}?${params.toString()}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data: RpsStateResponseDto = await res.json();
        if (data && data.status) {
          if (data.status === 'finished') {
            setResponse(data);
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    const interval = setInterval(() => {
      if (!response) {
        getResult();
      }
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWaitingForPartner]);

  const onRoomUpdate = (event: any) => {
    setRoomId(event.target.value);
  };

  const onActionSelect = (moveId: number) => (event: any) => {
    if (moveId === move) setMove(null);
    else setMove(moveId);
  };

  const onSubmit = () => {
    if (!isSubmitted) submit(true);
  };

  const onRefresh = () => {
    setRoomId(getRandom);
    setMove(null);
    setCanSubmit(true);
    submit(false);
    setWaitingForPartner(false);
    setResponse(null);
  };

  return (
    <div className="m-auto w-fit flex flex-col items-center">
      <div className="pt-10">
        <RpsPlayer />
      </div>
      <div className="pt-10 w-full">
        <RpsRoomInput onChange={onRoomUpdate} value={roomId} />
      </div>
      <div className="pt-10">
        <RpsActions onSelect={onActionSelect} selected={move} />
      </div>
      <div className="pt-10">
        {!isWaitingForPartner ? (
          <RpsSubmitButton onSubmit={onSubmit} isActive={canSubmit} />
        ) : response ? (
          <RpsStatus
            winners={response.winners}
            playerAddress={hiroUser?.profile.stxAddress.mainnet}
            onRefresh={onRefresh}
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
});

export default RpsGame;
