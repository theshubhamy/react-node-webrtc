import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm({
  className,
  formData,
  setFormData,
  onFormSubmit,
  ...props
}) {
  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={onFormSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Join Meeting</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="userId">UserId</Label>
          <Input
            id="userId"
            type="userId"
            placeholder=""
            required
            value={formData.userId}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="meetingId">Meeting Id</Label>
          </div>
          <Input
            id="roomId"
            type="roomId"
            required
            value={formData.roomId}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full">
          Join
        </Button>
      </div>
    </form>
  );
}
