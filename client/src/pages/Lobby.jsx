import { GalleryVerticalEnd } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import svgImage from '../assets/undraw_group-video_k4jx.svg';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const socket = useSocket();
  const navigation = useNavigate();
  const [formData, setformData] = useState({
    userId: '',
    roomId: '',
  });
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      console.log('socket event called');

      socket.emit('room:join', formData);
    },
    [formData, socket],
  );
  const hanldeJoinRoom = useCallback(
    data => {
      const { userId, roomId } = data;
      navigation(`/live/${userId}/${roomId}`);
    },
    [navigation],
  );

  useEffect(() => {
    socket.on('room:join', hanldeJoinRoom);
    return () => {
      socket.off('room:join', hanldeJoinRoom);
    };
  }, [hanldeJoinRoom, socket]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              setFormData={setformData}
              formData={formData}
              onFormSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={svgImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
