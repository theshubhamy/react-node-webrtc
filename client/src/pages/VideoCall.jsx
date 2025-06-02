import React, { useEffect, useCallback, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import Peer from '../services/peer';

const VideoCall = () => {
  const { userId, roomId } = useParams();
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState('');
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Get user's media stream on load
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);

      for (const track of stream.getTracks()) {
        Peer.peer.addTrack(track, stream);
      }
    })();
  }, []);

  // Send offer to remote user once both are connected
  const callUser = useCallback(async () => {
    const offer = await Peer.getOffer();
    socket.emit('user:call', { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  // Handle when another user joins
  const handleUserJoined = useCallback(({ id }) => {
    setRemoteSocketId(id);
    setIsConnected(true);
  }, []);

  // Handle incoming call
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      setIsConnected(true);

      const answer = await Peer.getAnswer(offer);
      socket.emit('call:accepted', { to: from, ans: answer });
    },
    [socket],
  );

  // Handle call accepted by remote
  const handleCallAccepted = useCallback(async ({ ans }) => {
    await Peer.setLocalDescription(ans);
  }, []);

  // Remote track added
  useEffect(() => {
    Peer.peer.addEventListener('track', async ev => {
      const [stream] = ev.streams;
      setRemoteStream(stream);
    });
  }, []);

  // Handle negotiation needed
  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await Peer.getOffer();
    socket.emit('peer:nego:needed', { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    Peer.peer.addEventListener('negotiationneeded', handleNegotiationNeeded);
    return () => {
      Peer.peer.removeEventListener(
        'negotiationneeded',
        handleNegotiationNeeded,
      );
    };
  }, [handleNegotiationNeeded]);

  const handleNegoNeeded = useCallback(
    async ({ from, offer }) => {
      const ans = await Peer.getAnswer(offer);
      socket.emit('peer:nego:done', { to: from, ans });
    },
    [socket],
  );

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await Peer.setLocalDescription(ans);
  }, []);

  // Setup all socket listeners
  useEffect(() => {
    socket.on('user:joined', handleUserJoined);
    socket.on('incomming:call', handleIncomingCall);
    socket.on('call:accepted', handleCallAccepted);
    socket.on('peer:nego:needed', handleNegoNeeded);
    socket.on('peer:nego:final', handleNegoFinal);

    return () => {
      socket.off('user:joined', handleUserJoined);
      socket.off('incomming:call', handleIncomingCall);
      socket.off('call:accepted', handleCallAccepted);
      socket.off('peer:nego:needed', handleNegoNeeded);
      socket.off('peer:nego:final', handleNegoFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeeded,
    handleNegoFinal,
  ]);

  // Once connected and we have our stream, initiate call
  useEffect(() => {
    if (isConnected && myStream) {
      callUser();
    }
  }, [isConnected, myStream, callUser]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6">
        <div className="text-4xl font-medium text-center">Room: {roomId}</div>

        {remoteSocketId ? (
          <div className="text-center font-medium text-green-600">
            Connected to: {remoteSocketId}
          </div>
        ) : (
          <div className="text-center font-medium text-yellow-600">
            Waiting for others to join...
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 p-4">
          <div className="bg-muted/100 aspect-video rounded-xl p-4">
            <p className="text-xl font-medium">You ({userId})</p>
            {myStream && (
              <ReactPlayer
                playing
                muted
                url={myStream}
                width="100%"
                height="100%"
              />
            )}
          </div>
          <div className="bg-muted/100 aspect-video rounded-xl p-4">
            <p className="text-xl font-medium">Remote</p>
            {remoteStream ? (
              <ReactPlayer
                playing
                url={remoteStream}
                width="100%"
                height="100%"
              />
            ) : (
              <p className="text-sm text-muted-foreground">No stream yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
