import React, { useEffect, useCallback, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ReactPlayer from 'react-player';
import Peer from '../services/peer';

const VideoCall = () => {
  const { userId, roomId } = useParams();
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState('');
  const [myStream, setMyStream] = useState({});

  const handleJoin = useCallback(({ userId, id }) => {
    console.log(`user ${userId} joined room`, id);
    setRemoteSocketId(userId);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await Peer.getOffer();
    socket.emit('user:call', { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log(`Incoming Call`, from, offer);
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      const ans = await Peer.getAnswer(offer);
      socket.emit('call:accepted', { to: from, ans });
    },
    [socket],
  );

  const handleCallAccepted = useCallback(async ({ from, ans }) => {
    await Peer.setLocalDescription(ans);
    console.log('call Accepted', from);
  }, []);

  useEffect(() => {
    socket.on('user:joined', handleJoin);
    socket.on('incomming:call', handleIncommingCall);
    socket.on('call:accepted', handleCallAccepted);
    return () => {
      socket.off('user:joined', handleJoin);
      socket.off('incomming:call', handleIncommingCall);
      socket.off('call:accepted', handleCallAccepted);
    };
  }, [handleJoin, handleIncommingCall, socket, handleCallAccepted]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 ">
        <div className="flex justify-center gap-2 md:justify-center">
          <a href="/" className="flex items-center gap-2  text-4xl font-medium">
            Room:{roomId}
          </a>
        </div>

        {remoteSocketId ? (
          <div className="flex justify-center gap-2 md:justify-center">
            <a href="/" className="flex items-center gap-2 font-medium">
              Connected
            </a>
            <Button type="button" onClick={handleCallUser}>
              Call Others
            </Button>
          </div>
        ) : (
          <div className="flex justify-center gap-2 md:justify-center">
            <a href="/" className="flex items-center gap-2 font-medium">
              Waiting for others to join.
            </a>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="bg-muted/100 aspect-video rounded-xl p-4">
              <p className="text-xl font-medium">
                you:
                <br />
                {userId}
              </p>
              {myStream && (
                <ReactPlayer
                  playing
                  muted
                  width="480px"
                  height="200px"
                  url={myStream}
                />
              )}
            </div>
            <div className="bg-muted/100 aspect-video rounded-xl p-4">
              {<p className="text-xl font-medium">{remoteSocketId}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
