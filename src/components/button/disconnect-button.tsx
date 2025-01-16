'use client'
import { Button } from '@/components/ui/button'
import { ActivityType, SocketActionType } from '@/lib/types/common'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
export default function DisconnectButton() {
  const { live, connected, state } = useSelector(
    ({ connection }: { connection: RootState['connection'] }) => connection,
  )
  const dispatch = useDispatch()
  const handleDisconnect = () => {
    dispatch({ type: SocketActionType.STOP })
  }
  const cek = () => {
    console.log('state', state)
  }
  return (
    <>
      <Button
        disabled={!live}
        onClick={handleDisconnect}
        variant={'destructive'}
        size={'sm'}
      >
        Stop
      </Button>
      <Button onClick={cek} variant={'destructive'} size={'sm'}>
        C
      </Button>
    </>
  )
}
